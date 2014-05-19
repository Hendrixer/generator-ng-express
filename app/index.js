'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

var notes = {
  intro: 'You can install ng-Express in two ways:',

  options: '\n\n' +
    '• Quick mode: Create your angular app with minmal options.' +
    '\n' +
    '• Custom mode: You decide what you want.',
  complete: '\n\nCongrats! Your angular app is ready for you.' +
    '\nRun "gulp" to start up your server on port 9000' +
    '\nRun "gulp ?" to see all the tasks. Enjoy'
};

var root = path.basename(process.cwd());


var hasOption = function (options, option) {
  if (options) {
    return options.indexOf(option) !== -1;
  } else {
    return false;
  }
};

var defaults = {
  depend: ["'ui.router'", "'ngAnimate'", "'fx.animations'"],
  provides: ['$stateProvider']
};

var NgExpressGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    /* app specfics */
    this.name = 'myApp';
    this.version = '0.0.1';
    this.e2e = false;
    this.unit = false;

    /* css stuff */
    this.cssLint = false;
    this.cssPre = 'none';

    /* angular stuff */
    this.ngAnimate = true;
    this.ngRoute = false;
    this.ngCookies = true;
    this.ngTouch = false;
    this.ngResource = false;
    this.providers = defaults.provides.join(', ');
    this.injectables = '\n    ' + defaults.depend.join(',\n    ') + '\n';

    this.extra = false;
    this.uiRouter = false;
    this.ngFx = true;

    /* Express stuff */


    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies({
          callback: function () {
            this._finalize();
          }.bind(this)
        });
      }
    });
  },

  whatMode: function () {
    var done = this.async();

    this.log(this.yeoman);
    this.log(chalk.underline.bold.cyan(notes.intro));
    this.log(chalk.magenta(notes.options));

    var questions = [{
      type: 'list',
      name: 'mode',
      message: 'Which mode would you like?',
      choices: ['Quick', 'Custom']
    }];

    this.prompt(questions, function (props) {
      this.mode = props.mode;
      done();
    }.bind(this));
  },

  quick: function () {
    if (this.mode === 'Quick') {
      this.uiRouter = true;
      this.ngRoute = false;
      this.ngAnimate = true;
      this.ngFx = true;
      this.cssPre = 'stylus';
    }
  },
  custom: function () {
    var done,
        questions;
    if (this.mode === 'Custom') {

      done = this.async();

      questions = [
        {
          type: 'input',
          name: 'name',
          message: 'Your app name?',
          default: root
        },
        {
          type: 'checkbox',
          name: 'modules',
          message: 'What official angular modules do you need?\n Use spacebar to select and enter when finished',
          choices: [
                {
                  value: 'ngAnimate',
                  name: 'angular-animate.js',
                  checked: false
                },
                {
                  value: 'ngCookies',
                  name: 'angular-cookies.js',
                  checked: false
                },
                {
                  value: 'ngTouch',
                  name: 'angular-touch.js',
                  checked: false
                },
                {
                  value: 'ngRoute',
                  name: 'angular-route.js',
                  checked: false
                }
          ]
        },
        {
          type: 'checkbox',
          name: 'extra',
          message: 'Third party angular modules?',
          choices: [
                {
                  value: 'ngFx',
                  name: 'ng-Fx (awesome animation library)',
                  checked: this.ngAnimate ? true : false
                },
                {
                  value: 'uiRouter',
                  name: 'angular-ui-router.js (will replace ngRoute)',
                  checked: false
                }
          ]
        },
        {
          type: 'list',
          name: 'cssPre',
          message: 'Do you want a css preprocessor?',
          choices: ['none', 'stylus', 'less', 'sass'],
          default: 0
        }
      ];

      this.prompt(questions, function (prop) {
        this.name = prop.name;
        this.version = prop.version;
        this.cssPre = prop.cssPre;
        this.extra = prop.extra;

        this._injectOptions(prop.modules, prop.extra);
        done();
      }.bind(this));
    }
  },

  _injectOptions: function (modules, extras) {
    var injectables = [],
        provide = [];

    if (this.mode === 'Custom') {
      this.ngAnimate = hasOption(modules, 'ngAnimate');
      this.ngCookies = hasOption(modules, 'ngCookies');
      this.ngTouch = hasOption(modules, 'ngTouch');
      this.uiRouter = hasOption(extras, 'uiRouter');
      this.ngRoute = hasOption(modules, 'ngRoute');
      this.ngFx = hasOption(extras, 'ngFx');

      if(this.ngRoute && this.uiRouter) {
        this.ngRoute = false;
      }
    }

    if (this.ngFx) {
      this.ngAnimate = true;
      injectables.push('fx.animations');
    }
    if (this.ngAnimate) {
      injectables.push('ngAnimate');
    }
    if (this.ngRoute) {
      injectables.push('ngRoute');
      provide.push('$routeProvider');
    }
    if (this.ngTouch) {
      injectables.push('ngTouch');
    }
    if (this.ngCookies) {
      injectables.push('ngCookies');
    }
    if (this.uiRouter) {
      injectables.push('ui.router');
      provide.push('$stateProvider');
    }

    this.injectables = injectables;
    this.providers = provide.join(', ');
  },

  app: function () {
    this.mkdir('client');
    if(this.uiRouter) {
      this.template('client/_index.html', 'client/index.html');
      this.template('client/common/_directives.js', 'client/common/directives.js');
      this.template('client/home/_home.html', 'client/main/main.tpl.html');
      this.template('client/home/_home.js', 'client/main/main.js');
      this.template('client/_app.js', 'client/app.js');
      this.template('client/notes/_note.html', 'client/note/note.tpl.html');
      this.template('client/notes/_note.js', 'client/note/note.js');
      this.template('client/notes/_note.directive.html', 'client/note/note.directive.html');
    } else if (this.ngRoute) {
      this.template('client_router/_index.html', 'client/index.html');
      this.template('client_router/common/_directives.js', 'client/common/directives.js');
      this.template('client_router/main/_main.tpl.html', 'client/main/main.tpl.html');
      this.template('client_router/main/_main.js', 'client/main/main.js');
      this.template('client_router/note/_note.tpl.html', 'client/note/note.tpl.html');
      this.template('client_router/note/_note.js', 'client/note/note.js');
      this.template('client_router/_app.js', 'client/app.js');
    }


    // this.copy('client/assets/_angular.jpeg', 'client/assets/angular.jpeg');
    this.copy('client/styles/css/_app.css', 'client/styles/css/app.css');

    if (this.cssPre === 'stylus') {
      this.copy('client/styles/stylus/_app.styl', 'client/styles/stylus/app.styl');
    }
    if (this.cssPre === 'less') {
      this.copy('client/styles/less/_app.less', 'client/styles/less/app.less');
    }
    if (this.cssPre === 'sass') {
      this.copy('client/styles/sass/_app.scss', 'client/styles/sass/app.scss');
    }

    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
    this.template('_Gulpfile.js', 'Gulpfile.js');


    this.mkdir('server');
    this.copy('server/_server.js', 'server/server.js');
    this.copy('server/main/_app.js', 'server/main/app.js');
    this.copy('server/note/_note_controllers.js', 'server/note/note_controllers.js');
    this.copy('server/note/_note_routes.js', 'server/note/note_routes.js');
    this.copy('server/note/_note_model.js', 'server/note/note_model.js');
    this.copy('server/main/_middleware.js', 'server/main/middleware.js');
    this.template('server/main/_config.js', 'server/main/config.js');


  },
  dotFiles: function () {
    this.copy('gitignore', '.gitignore');
    this.copy('bowerrc', '.bowerrc');
  },

  // _gulpInstallStuff: function () {
  //   this.spawnCommand('gulp', ['bowerInstall'])
  //     .on('error', this._finalize)
  //     .on('exit', function (err) {
  //       if (err === 127) {
  //         this.log.error('Could not find Gulp. sudo npm install -g gulp');
  //       }
  //       this._finalize(err);
  //     }.bind(this));
  // },
  _finalize: function (err) {
    if (err) {
      this.log.error(err);
    } else {
      this.log(chalk.bold.magenta(notes.complete));
    }
  }
});

module.exports = NgExpressGenerator;
