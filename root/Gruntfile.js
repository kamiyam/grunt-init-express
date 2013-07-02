/*
 * {%= name %}
 * {%= homepage %}
 *
 * Copyright (c) {%= grunt.template.today('yyyy') %} {%= author_name %}
 * Licensed under the {%= licenses.join(', ') %} license{%= licenses.length === 1 ? '' : 's' %}.
 */

'use strict';

var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

var mountFolder = function folderMount(connect, point) {
  return connect.static(path.resolve(point));
};

module.exports = function (grunt) {

  // load all grunt-plugin tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var nodeConfig = {
    listen: 8000,
    dev:"app",
    dist:"dist",
    express:{
      port: 3000,
      static :{
        src:'private',
        dist:'public'
      }
    }
  };

  // Project configuration.
  grunt.initConfig({
    c: nodeConfig,
    express: {
      options: {
        // Override defaults here
        port: nodeConfig.express.port
      },
      dev: {
        options: {
          script: 'app/app.js'
        }
      },
      prod: {
        options: {
          script: 'app/app.js'
        }
      }
    },
    connect: {
      options: {
        host: 'localhost',
        port: '<%= c.listen %>'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              proxySnippet
            ];
          }
        }
      },
      proxies: [
        {
          context: '/',
          host: 'localhost',
          port: '<%= c.express.port %>',
          https: false,
          changeOrigin: false
        }

      ]
    },
    open: {
      server: {
        url: 'http://localhost:<%= c.listen %>'
      }
    },
    coffee: {
      server: {
        files: {
          '<%= c.dev %>/private/.temp/javascripts/coffee.js': '<%= c.dev %>/private/javascripts/**/*.coffee'
        }
      }
    },
    compass: {
      options: {
        sassDir: '<%= c.dev %>/private/stylesheets',
        cssDir: '<%= c.dev %>/private/.temp/stylesheets',
        imagesDir: '<%= c.dev %>/private/images',
        javascriptsDir: '<%= c.dev %>/private/javascripts',
        fontsDir: '<%= c.dev %>/private/stylesheets/fonts',
        importPath: '<%= c.dev %>/components',
        relativeAssets: true
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },
    concat: {
      options: {
        separator: ''
      },
      js: {
        src: ['<%= c.dev %>/private/.temp/javascripts/*.js'],
        dest: '<%= c.dev %>/public/javascripts/main.js'
      },
      css: {
        src: ['<%= c.dev %>/private/.temp/stylesheets/*.css'],
        dest: '<%= c.dev %>/public/stylesheets/style.css'
      }
    },
    cssmin: {
      server: {
        files: {
          '<%= c.dev %>/public/stylesheets/style.css': ['<%= c.dev %>/private/.temp/stylesheets/*.css']
        }
      }
    },
    copy: {
      server: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= c.dev %>/private',
          dest: '<%= c.dev %>/public',
          src: [
            '*.{ico,txt,html}'
          ]
        },{
          expand: true,
          dot: true,
          cwd: '<%= c.dev %>/private/images',
          dest: '<%= c.dev %>/private/.temp/images',
          src: [
            '*'
          ]
        },{
          expand: true,
          dot: true,
          cwd: '<%= c.dev %>/private/javascripts/',
          dest: '<%= c.dev %>/private/.temp/javascripts/',
          src: [
            '*.js'
          ]
        },{
          expand: true,
          dot: true,
          cwd: '<%= c.dev %>/private/stylesheets/',
          dest: '<%= c.dev %>/private/.temp/stylesheets/',
          src: [
            '*.css'
          ]
        }]
      },
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= c.dev %>',
          dest: '<%= c.dist %>',
          src: [
            '*.{ico,txt,html}'
          ]
        }]
      }
    },
    watch: {
      express: {
        files:  [ '{<%= c.dev %>,<%= c.dev %>/routes}/*.js' ],
        tasks:  [ 'express:dev', 'livereload' ]
      },
      html: {
        files: ['<%= c.dev %>/private/*.{ico,txt,html}'],
        tasks: ['copy:server']
      },
      compass: {
        files: ['<%= c.dev %>/private/stylesheets/**/*.{scss,sass}'],
        tasks: ['compass']
      },
      coffee: {
        files: ['<%= c.dev %>/private/javascripts/**/*.coffee'],
        tasks: ['coffee']
      },
      js: {
        files: ['<%= c.dev %>/private/javascripts/*.js'],
        tasks: ['copy:server']
      },
      livereload: {
        files: [
          '<%= c.dev %>/views/*.{jade,ejs,html}',
          '<%= c.dev %>/private/*.html',
          '{<%= c.dev %>/private/.temp,<%= c.dev %>/private}/stylesheets/*.css',
          '{<%= c.dev %>/private/.temp,<%= c.dev %>/private}/javascripts/*.js',
          '<%= c.dev %>/private/images/*.{png,jpg,jpeg}'
        ],
        tasks: ['concat:css','concat:js','cssmin:server','livereload']
      }
    },
    clean: {
      dist: ['<%= c.dev %>/private/.temp', '<%= c.dist %>/*'],
      server: '<%= c.dev %>/private/.temp'
    }
  });

  // remove when regarde task is renamed
  grunt.renameTask('regarde', 'watch');

//  // remove when mincss task is renamed
//  grunt.renameTask('mincss', 'cssmin');

  grunt.registerTask('default', [
    'express:dev',
    'configureProxies',
    'livereload-start',
    'connect:livereload',
    'clean:server',
    'coffee:server',
    'compass:server',
    'copy:server',
    'concat:css',
    'concat:js',
    'cssmin:server',
    'open',
    'watch']);

};