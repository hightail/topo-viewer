module.exports = function(grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    shell: {
      installDependencies: {
        command: [
          'npm install',
          'bower install'
        ].join('&&'),
        options: {
          stdout: true
        }
      }
    },
    sass: {
      options: {
        includePaths: [
          './app/client/appearance/base/common/styles'
        ]
      },
      default: {
        options: {
          outputStyle: 'nested'
        },
        files: {
          './app/client/wilson.css': [
            './app/client/appearance/base/common/styles/app.scss'
          ]
        }
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          './app/client/wilson.css': [
            './app/client/appearance/base/common/styles/app.scss'
          ]
        }
      }
    },
    express: {
      default: {
        options: {
          port: process.env.PORT || 3000,
          script: 'app/server/app.js',
          background: true
        }
      }
    },
    watch: {
      express: {
        files:  [ 'app/**/*.{js,json,hbs,html,scss}' ],
        tasks:  [ 'restartServer' ],
        options: {
          spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
        }
      }
    }
  });

  grunt.registerTask('install', ['shell:installDependencies']);

  grunt.registerTask('restartServer', ['sass:dist','express:default']);

  grunt.registerTask('server', ['restartServer', 'watch']);

  // Default task(s).
  grunt.registerTask('default', ['server']);

};