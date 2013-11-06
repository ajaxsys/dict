/* jshint node: true */

module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/**\n' +
            '* <%= pkg.name %>.js v<%= pkg.version %> by @fat and @mdo\n' +
            '* Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            '* <%= _.pluck(pkg.licenses, "url").join(", ") %>\n' +
            '*/\n',
    // jqueryCheck: 'if (!jQuery) { throw new Error(\"Bootstrap requires jQuery\") }\n\n',

    // Task configuration.
    clean: {
      dist: ['release/static/dict/pkg/']
    },

    jshint: {
      options: {
        jshintrc: 'resources/static/js/.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['dict/static/dict/js/*.js']
      },
      test: {
        src: ['dict/static/dict/js/tests/*.js']
      }
    },

    csslint: {
      strict: {
        options: {
          import: 2
        },
        src: ['dict/static/dict/css/dict.common.css']
      },
      lax: {
        options: {
          import: false
        },
        src: ['dict/static/dict/css/dict.common.css']
      }
    },

    cssmin: {
      compress: {
        files: {
          'release/static/dict/pkg/dict_ui.min.css':[
              'resources/static/js/jwe/jquery.windows-engine.css',
              'resources/static/js/tooltip/tipsy.css',
          ],
          'release/static/dict/pkg/dict_proxy.min.css':[
              'resources/static/js/bootstrap/css/bootstrap.css',
              'dict/static/dict/css/dict.common.css',
          ],
        },
      }
    },

    concat: {
      options: {
        // banner: '<%= banner %><%= jqueryCheck %>',
        // stripBanners: false
      },
      dict_bookmarklet: {
        src: ['dict/static/dict/js/dict.util.sharebml.js',
              'dict/static/dict/js/dict.bookmarklet.js'],
        dest: 'release/static/dict/pkg/<%= pkg.name %>_bookmarklet.js'
      },
      dict_ui_dev: {
        src: [
          'resources/static/js/jquery.min.js',
          'resources/static/js/jquery.cookie.js',
          'resources/static/js/jquery.plaintext.js',
          'resources/static/js/tooltip/jquery.tipsy.js',
          'resources/static/js/jwe/jquery.windows-engine.js',
          'dict/static/dict/js/conf.js',
          'dict/static/dict/js/dict.util.js',
          'dict/static/dict/js/dict.util.sharebml.js',
          'dict/static/dict/js/dict.ui.js',
          'dict/static/dict/js/dict.ui.navi.js',
          'dict/static/dict/js/end.js',
        ],
        dest: 'release/static/dict/pkg/<%= pkg.name %>_ui_dev.js'
      },
      dict_ui_rls: {
        src: [
          'dict/static/dict/js/conf.release.js',
          '<%= concat.dict_ui_dev.src %>'
        ],
        dest: 'release/static/dict/pkg/<%= pkg.name %>_ui_rls.js'
      },
      dict_proxy: {
        src: [
          'resources/static/js/jquery.min.js',
          'resources/static/js/jquery.cookie.js',
          'resources/static/js/bootstrap/js/bootstrap.min.js',
          'dict/static/dict/js/dict.util.js',
          'dict/static/dict/js/dict.proxy.js',
          'dict/static/dict/js/dict.formatter.js',
          'dict/static/dict/js/dict.formatter.weblio.js',
          'dict/static/dict/js/dict.formatter.weblios.js',
        ],
        dest: 'release/static/dict/pkg/<%= pkg.name %>_proxy.js'
      },
    },

    uglify: {
      options: {
        //banner: '<%= banner %>'
      },
      dict_bookmarklet: {
        src: ['<%= concat.dict_bookmarklet.dest %>'],
        dest: 'release/static/dict/pkg/<%= pkg.name %>_bookmarklet.min.js'
      },
      dict_ui: {
        src: ['<%= concat.dict_ui_rls.dest %>'],
        dest: 'release/static/dict/pkg/<%= pkg.name %>_ui.min.js'
      },
      dict_proxy: {
        src: ['<%= concat.dict_proxy.dest %>'],
        dest: 'release/static/dict/pkg/<%= pkg.name %>_proxy.min.js'
      },
    },

/*
    qunit: {
      options: {
        inject: 'js/tests/unit/phantom.js'
      },
      files: ['js/tests/*.html']
    },
*/
    connect: {
      server: {
        options: {
          port: 3000,
          base: '.'
        }
      }
    },

    copy: {
      main: {
        files: [
          //{src: ['resources/static/js/jwe/default/*'], dest: 'resources/static/js/pkg/default/', filter: 'isFile'}, // includes files in path
          //{src: ['path/**'], dest: 'dest/'}, // includes files in path and its subdirs
          //{expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'}, // makes all src relative to cwd
          {expand:true, cwd: 'resources/static/js/jwe/default/',src: ['*'], dest: 'release/static/dict/pkg/default/', filter: 'isFile'}, 
          //{expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'} // flattens results to a single level
        ]
      }
    },
 //   validation: {
 //     options: {
 //       reset: true,
 //     },
 //     files: {
 //       src: ["_gh_pages/**/*.html"]
 //     }
 //   },

    watch: {
      src: {
        files: ['dict/static/dict/js/*.js',
                'resources/static/js/**/*',
        ],
        tasks: ['jshint','dist']
      },
      // test: {
      //   files: '<%= jshint.test.src %>',
      //   tasks: ['jshint:test']
      // }
    }
  });


  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // TODO
  //grunt.loadNpmTasks('grunt-imagine');

//  grunt.loadNpmTasks('grunt-contrib-connect');
//  grunt.loadNpmTasks('grunt-contrib-qunit');
//  grunt.loadNpmTasks('grunt-html-validation');


  // Docs HTML validation task
  //grunt.registerTask('validate-docs', ['jekyll', 'validation']);

  // Test task.
  // var testSubtasks = ['jshint', 'qunit', 'validate-docs'];
  var testSubtasks = ['jshint'];

  grunt.registerTask('test', testSubtasks);

  // JS distribution task.
  grunt.registerTask('dist-js', ['concat', 'uglify']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['cssmin']);

  // Full distribution task.
  grunt.registerTask('dist', ['clean', 'copy', 'dist-css', 'dist-js']);

  // Default task.
  grunt.registerTask('default', ['dist']);

  // task for building customizer
  grunt.registerTask('build-min', 'Modify html files using minimized scripts/css.', function () {
    var fs = require('fs')

    function getFiles(type) {
      var files = {}
      fs.readdirSync(type)
        .filter(function (path) {
          return new RegExp('\\.' + type + '$').test(path)
        })
        .forEach(function (path) {
          return files[path] = fs.readFileSync(type + '/' + path, 'utf8')
        })
      return 'var __' + type + ' = ' + JSON.stringify(files) + '\n'
    }

    var customize = fs.readFileSync('test.html', 'utf-8')
    var files = '<!-- generated -->\n<script id="files">\n' + getFiles('js') + getFiles('less') + '<\/script>\n<!-- /generated -->'
    fs.writeFileSync('customize.html', customize.replace(/<!-- generated -->(.|[\n\r])*<!-- \/generated -->/, files))
  });
};

