#!/bin/bash
clear
echo "Installing npm and its dependencies..."
sudo apt-get -y install python-software-properties python g++ make
sudo add-apt-repository -y ppa:chris-lea/node.js
sudo apt-get -y update
sudo apt-get -y install nodejs 
sudo apt-get -y install npm
sudo apt-cache -y show nodejs

clear 
echo "Installing grunt and its dependencies"
npm install -g grunt-cli