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
        files:  [ 'app/**/*.{js,json,hbs,html}' ],
        tasks:  [ 'express:default' ],
        options: {
          spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
        }
      }
    }
  });

  grunt.registerTask('install', ['shell:installDependencies']);

  grunt.registerTask('server', ['express:default', 'watch']);

  // Default task(s).
  grunt.registerTask('default', ['server']);

};