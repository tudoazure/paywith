module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                separator: ';'

            },

            vendor: {
                src: ['scripts/vendor/jquery.min.js', 'scripts/vendor/bootstrap.min.js', 'scripts/vendor/moment.min.js', 'scripts/vendor/angular.min.js', 'scripts/vendor/ui-bootstrap-tpls-0.10.0.min.js', 'scripts/vendor/angular-route.js', 'scripts/vendor/angular-cookies.min.js', 'scripts/vendor/angular-google-analytics.js', 'scripts/vendor/bootstrapValidator.js'],
                dest: 'dest/vendor.js'
            },

            script: {
                src: ['scripts/app.js', 'scripts/controllers/*.js', 'scripts/directives/*.js', 'scripts/factories/*.js', 'scripts/services/*.js'],
                dest: 'dest/script.js'
            }

        },

        removelogging: {
            dist: {
                src: "dest/script.js"
            }
        },
        concat_css: {
            options: {
                // Task-specific options go here.
            },
            all: {
                src: ["styles/**/*.css"],
                dest: "dest/styles.css"
            }
        },
        cssmin: {
            add_banner: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                files: {
                    'app/src/css/style.min.css': ['dest/styles.css'],
                    'app/paybutton.css': ['paybutton.css']
                }
            }
        },
        preprocess: {
            button_dev: {
                options: {

                    context: {
                        DEBUG: true,
                        URL: "<%= pkg.conf.dev.API_HOST%>"
                    }
                },
                files: {
                    "dest/pptmbutton.js": "pptmbutton.js"
                }
            },
            button_prod: {
                options: {

                    context: {
                        DEBUG: true,
                        URL: "<%= pkg.conf.prod.API_HOST%>"
                    }
                },
                files: {
                    "dest/pptmbutton.js": "pptmbutton.js"
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },

            script: {
                src: 'dest/script.js',
                dest: 'app/src/js/script.min.js'

            },
            vendor: {
                src: 'dest/vendor.js',
                dest: 'app/src/js/vendor.min.js'
            },
            paybutton: {
                src: ['paybutton.js'],
                dest: 'app/paybutton.js'
            },
            customjs: {
                src: ['custom.js'],
                dest: 'app/custom.js'
            },
            button: {
                src: ['dest/pptmbutton.js'],
                dest: 'app/pptmbutton.min.js'

            }
        },
        processhtml: {
            options: {
                data: {
                    message: 'Hello world!'
                },
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            config_dev: {
                options: {
                    process: true,
                    data: {
                        API_HOST: "<%= pkg.conf.dev.API_HOST%>",
                        APP_HOST: "<%= pkg.conf.dev.APP_HOST%>",
                        PAYMENT_BUTTON_HOST: "<%= pkg.conf.dev.PAYMENT_BUTTON_HOST%>",
                        OAUTH_CLIENT_ID: "<%= pkg.conf.dev.OAUTH_CLIENT_ID%>",
                        OAUTH_HOST: "<%= pkg.conf.dev.OAUTH_HOST%>",
                        OAUTH_REDIRECT_URI: "<%= pkg.conf.dev.OAUTH_REDIRECT_URI%>",
                        PAY_BUTTON_URL: "<%= pkg.conf.dev.PAY_BUTTON_URL%>",
                        message: 'This is a devlopment distribution'
                    }
                },
                files: {
                    'app/config.js': ['environment/config.js']
                }
            },
            config_prod: {
                options: {
                    process: true,
                    data: {
                        API_HOST: "<%= pkg.conf.prod.API_HOST%>",
                        APP_HOST: "<%= pkg.conf.prod.APP_HOST%>",
                        PAYMENT_BUTTON_HOST: "<%= pkg.conf.prod.PAYMENT_BUTTON_HOST%>",
                        OAUTH_CLIENT_ID: "<%= pkg.conf.prod.OAUTH_CLIENT_ID%>",
                        OAUTH_HOST: "<%= pkg.conf.prod.OAUTH_HOST%>",
                        OAUTH_REDIRECT_URI: "<%= pkg.conf.prod.OAUTH_REDIRECT_URI%>",
                        PAY_BUTTON_URL: "<%= pkg.conf.prod.PAY_BUTTON_URL%>",
                        message: 'This is a devlopment distribution'
                    }
                },
                files: {
                    'app/config.js': ['environment/config.js']
                }
            },
            dist: {
                files: {
                    'app/index.html': ['index.html'],
                    'app/authresponse.html': ['authresponse.html'],
                    'app/authpayresponse.html': ['authpayresponse.html'],
                    'app/authbuttonresponse.html': ['authbuttonresponse.html']

                }
            },
            singleproduct_dev: {
                options: {
                    process: true,
                    data: {
                        url: "<%= pkg.conf.dev.APP_HOST%>",
                        message: 'This is a devlopment distribution'
                    }
                },
                files: {
                    'dev/single_product.html': ['single_product.html.dev']
                }
            },
            singleproduct_prod: {
                options: {
                    process: true,
                    data: {
                        url: "<%= pkg.conf.prod.APP_HOST%>",
                        message: 'This is a production distribution'
                    }
                },
                files: {
                    'prod/single_product.html': ['single_product.html.prod']
                }
            },
            payment_details: {
                files: {
                    'app/payment_details.html': ['payment_details.html']
                }
            },
            payment_details_finish: {
                files: {
                    'app/payment_details_finish.html': ['payment_details_finish.html'],
                    'app/payment_button_finish.html': ['payment_button_finish.html'],
                    'app/payment_failed.html': ['payment_failed.html'],
                    'app/thankyou.html': ['thankyou.html']
                }
            }

        },
        htmlmin: { // Task
            dev: { // Target
                options: { // Target options
                    removeComments: true,
                    collapseWhitespace: true,
                    minifyJS: true
                },
                files: { // Dictionary of files
                    'app/single_product.html': 'dev/single_product.html',
                    'app/index.html': 'app/index.html',
                    'app/views/products.html': 'views/products.html',
                    'app/views/sales.html': 'views/sales.html',
                    'app/views/create-product.html': 'views/create-product.html',
                    'app/views/edit-product.html': 'views/edit-product.html',
                    'app/views/help.html': 'views/help.html',
                    'app/views/home.html': 'views/home.html',
                    'app/views/login.html': 'views/login.html',
                    'app/views/logout.html': 'views/logout.html',
                    'app/views/payments.html': 'views/payments.html',
                    'app/views/profile.html': 'views/profile.html',
                    'app/views/reports.html': 'views/reports.html',
                    'app/views/button.html': 'views/button.html'


                }
            },
            prod: {
                options: { // Target options
                    removeComments: true,
                    collapseWhitespace: true,
                    minifyJS: true
                },
                files: {
                    'app/single_product.html': 'prod/single_product.html',
                    'app/index.html': 'app/index.html',
                    'app/views/products.html': 'views/products.html',
                    'app/views/sales.html': 'views/sales.html',
                    'app/views/create-product.html': 'views/create-product.html',
                    'app/views/edit-product.html': 'views/edit-product.html',
                    'app/views/help.html': 'views/help.html',
                    'app/views/home.html': 'views/home.html',
                    'app/views/login.html': 'views/login.html',
                    'app/views/logout.html': 'views/logout.html',
                    'app/views/payments.html': 'views/payments.html',
                    'app/views/profile.html': 'views/profile.html',
                    'app/views/reports.html': 'views/reports.html',
                    'app/views/button.html': 'views/button.html'


                }
            }

        },

        copy: {
            main: {
                files: [
                // includes files within path
                    {
                        expand: true,
                        src: ['assets/images/*'],
                        dest: 'app/'

                    },
                    {
                        expand: true,
                        src: ['fonts/*'],
                        dest: 'app/src/'
                    }
                ]
            }
        },
        hashres: {

            options: {

                encoding: 'utf8',
                // Optional. Format used to name the files specified in 'files' property.
                // Default value: '${hash}.${name}.cache.${ext}'
                fileNameFormat: '${hash}.${name}.cache.${ext}',
                // Optional. Should files be renamed or only alter the references to the files
                // Use it with '${name}.${ext}?${hash} to get perfect caching without renaming your files
                // Default value: true
                renameFiles: true
            },
            // hashres is a multitask. Here 'prod' is the name of the subtask. You can have as many as you want.
            prod: {
                // Specific options, override the global ones
                options: {
                    // You can override encoding, fileNameFormat or renameFiles
                },
                // Files to hash
                src: ['app/src/js/vendor.min.js', 'app/src/js/script.min.js', 'app/config.js', 'app/src/css/style.min.css'],
                // File that refers to above files and needs to be updated with the hashed name
                dest: 'app/*.html',
            }

        }
    });
    grunt.loadNpmTasks('grunt-preprocess');
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    //concat file 
    grunt.loadNpmTasks('grunt-contrib-concat');

    //concat css
    grunt.loadNpmTasks('grunt-concat-css');

    //minify css
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    //process html 
    grunt.loadNpmTasks('grunt-processhtml');

    //minify html files
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    grunt.loadNpmTasks('grunt-contrib-copy');


    //heshres
    grunt.loadNpmTasks('grunt-hashres');

    grunt.loadNpmTasks("grunt-remove-logging");

    // Default task(s).
    grunt.registerTask('default', ['concat', 'removelogging', 'concat_css', 'cssmin', 'uglify', 'processhtml', 'htmlmin', 'copy', 'hashres']);

    //grunt task for development branch
    grunt.registerTask('dev', ['concat:vendor', 'concat:script', 'removelogging', 'concat_css', 'cssmin', 'preprocess:button_dev', 'uglify', 'processhtml:config_dev', 'processhtml:dist', 'processhtml:singleproduct_dev', 'processhtml:payment_details', 'processhtml:payment_details_finish', 'htmlmin:dev', 'copy', 'hashres']);

    //grunt task for production
    grunt.registerTask('prod', ['concat:vendor', 'concat:script', 'removelogging', 'concat_css', 'cssmin', 'preprocess:button_prod', 'uglify', 'processhtml:config_prod', 'processhtml:dist', 'processhtml:singleproduct_prod', 'processhtml:payment_details', 'processhtml:payment_details_finish', 'htmlmin:prod', 'copy', 'hashres']);

};