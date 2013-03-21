/**
 * grunt-init-express
 * 
 * @version      v0.0.1rc1
 * @author       kamiyam (http://twitter.com/kamiyam)
 * @copyright    (c) 2013 "kamiyam"
 * @license      The MIT License
 * @link         https://github.com/kamiyam/grunt-init-express
 *
 */

'use strict';

//description
exports.description = 'Create a Express apps plugin.';

// about express
exports.notes = 'For more information about Express, ' +
  'please see the docs at http://expressjs.com/guide.html';

// after setup express
exports.after = 'You should now install project dependencies with _npm ' +
  'install_. After comand _express app_';

// If exist files warning.
exports.warnOn = '*';

// template files
exports.template = function(grunt, init, done) {

  init.process({type: 'grunt'}, [
    // prompt
    init.prompt('name', 'Express Application name'),
    init.prompt('description', 'Express Application description'),
    init.prompt('version'),
    init.prompt('repository'),
    init.prompt('homepage'),
    init.prompt('bugs'),
    init.prompt('licenses'),
    init.prompt('author_name'),
    init.prompt('author_email'),
    init.prompt('author_url'),
    init.prompt('grunt_version'),
    init.prompt('node_version', grunt.package.engines.node)
  ], function(err, props) {

    props.short_name = props.name;
    props.main = 'Gruntfile.js';
    props.npm_test = 'grunt test';
    props.keywords = ['grunt','node.js','express'];
    props.devDependencies = {
    "matchdep": "~0.1.1",
    "grunt": "~0.4.1",
    "grunt-regarde": "~0.1.1",
    "grunt-contrib-connect": "~0.2.0",
    "grunt-contrib-livereload": "~0.1.2",
    "grunt-open": "~0.2.0",
    "grunt-connect-proxy": "~0.1.0",
    "grunt-exec": "~0.4.0",
    "grunt-contrib-coffee": "~0.6.3",
    "grunt-contrib-compass": "~0.1.3",
    "grunt-contrib-clean": "~0.4.0",
    "grunt-contrib-copy": "~0.4.0",
    "grunt-contrib-concat": "~0.1.3",
    "grunt-contrib-mincss": "~0.4.0rc7",
    "grunt-contrib-uglify": "~0.2.0",
    "supervisor": "~0.5.2",
    };
    props.peerDependencies = {
      'grunt': props.grunt_version,
    };

    // filecopy
    var files = init.filesToCopy(props);

    // add lisences file
    init.addLicenseFiles(files, props.licenses);

    // setting all files
    init.copyAndProcess(files, props);

    // create package.json
    init.writePackageJSON('package.json', props);

    done();
  });

};
