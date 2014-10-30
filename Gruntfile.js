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
          background: false
        }
      }
    }
  });

  grunt.registerTask('server', ['shell:installDependencies','express']);
  //grunt.registerTask('server', ['express']);

  // Default task(s).
  grunt.registerTask('default', ['server']);

};