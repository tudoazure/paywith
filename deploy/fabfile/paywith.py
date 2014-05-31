#!/usr/bin/python
# -*- coding: utf-8 -*-

from fabric.api import *
from fabric.contrib.files import exists, contains, append

base_dir = '~/src'
server_dir = '%s/server' % base_dir
ui_dir = '%s/ui' % base_dir
current_release = 'current'
previous_release = 'previous'
repo_url = 'git@paytm.unfuddle.com:paytm/digitalgoodfrontend.git'


@task
def install_git():
    """
    apt-get install git_core
    """

    run('sudo apt-get install git-core')


@task
def clone_code(repo_url):
    """
    Checkout the code from the repo in fab_settings.py
    """

    clone_full_cmd = '{0} {1}'.format('git clone', repo_url)
    run(clone_full_cmd)


@task
def checkout_code(branch, reference):
    """
    Checkout the code from the repo in fab_settings.py
    """

    checkout_branch = '{0} -b {1}'.format('git checkout', branch)
    pull_command = 'git pull origin {0}'.format(branch)
    checkout_command = 'git checkout {0}'.format(reference)

    with settings(warn_only=True):
        if run(checkout_branch) != 0:
            run('git checkout %s' % branch)
            run(pull_command)
            run(checkout_command)


@task
def setup_ui(
    git_branch,
    git_tag,
    with_git=True,
    with_clone_code=True,
    deployment_type='prod',
    ):

    with settings(warn_only=True):
        run('mkdir %s' % base_dir)
        run('mkdir %s' % ui_dir)

    if with_git:
        install_git()
    if with_clone_code:
        with cd(ui_dir):
            env.release_path = ui_dir + '/%s' % env.release_dir
            if not exists(env.release_path):
                clone_code(repo_url + ' %s' % env.release_dir)
            else:
                print 'Directory exists, no need to clone again'

        with cd(ui_dir + '/' + env.release_dir):
            checkout_code(git_branch, git_tag)
            run('echo "Installing grunt dependencies..."')
            run('npm install')
            run('grunt %s' % env.deployment_type)


def symlink_release():
    if exists(env.previous_release_path):
        run('rm %(previous_release_path)s' % env)

    run('rm -rf %(current_release_path)s' % env)
    run('ln -s %(release_path)s %(current_release_path)s' % env)


@task
def dev():

    env.hosts = 'ubuntu@dev-paywith.paytm.com'
    env.key_filename = '~/Downloads/PayWithPaytm.pem'
    env.deployment_type = 'dev'
    env.current_release_path = ui_dir + '/%s' % current_release
    env.previous_release_path = ui_dir + '/%s' % previous_release


@task
def prod():
    env.hosts = 'ubuntu@paywith.paytm.com'
    env.key_filename = '~/Downloads/PayWithPaytm.pem'
    env.deployment_type = 'prod'
    env.current_release_path = ui_dir + '/%s' % current_release
    env.previous_release_path = ui_dir + '/%s' % previous_release


@task
def deploy(git_tag, git_branch='dev', create_dir=True):
    env.release_dir = git_tag
    setup_ui(git_branch, git_tag)
    symlink_release()

