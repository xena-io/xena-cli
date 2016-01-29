'use strict';

var _ = require('lodash');
var program = require('commander');
var s = require('underscore.string');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var inquirer = require('inquirer');
var chalk = require('chalk');
var shell = require('shelljs');

_.mixin(s.exports());

var initAnswers = {};

function createFile(file, str) {
  fs.writeFile(file, str);
  console.log(chalk.green('\u2713 ') + 'creating file: ' + chalk.blue(file));
}

function readTpl(file) {
  var str = fs.readFileSync(path.join(__dirname, '../templates/', file), {encoding: 'utf8'});
  var tpl = _.template(str, {
    imports: {
      _: _
    }
  });
  return tpl(initAnswers);
}

function mkdir(folder) {
  return new Promise(function(resolve, reject) {
    shell.mkdir('-p', folder);
    shell.chmod(755, folder);
    console.log(chalk.green('\u2713 ') + 'creating directory: ' + chalk.blue(folder));

    return resolve;
  });
}

function createApp(answers) {
  return Promise.try(function(){
    return shell.test('-e', answers.appname);
  })
    .then(function(exists) {
      if (exists)
        return console.log(chalk.red('This application already exists!'));

      console.log('');
      console.log(chalk.blue('Initializing your XENA app.'));
      console.log('');

      mkdir(answers.appname);

      // structure server
      mkdir(answers.appname + '/server');
      mkdir(answers.appname + '/server/api');
      mkdir(answers.appname + '/server/config');
      mkdir(answers.appname + '/server/config/environment');
      mkdir(answers.appname + '/server/es');

      console.log('');

      // structure client
      mkdir(answers.appname + '/client');
      mkdir(answers.appname + '/client/assets');

      console.log('');

      // project root
      createFile(answers.appname + '/package.json', readTpl('_package.json'));
      createFile(answers.appname + '/gulpfile.babel.js', readTpl('gulpfile.babel.js'));
      createFile(answers.appname + '/webpack.config.js', readTpl('webpack.config.js'));

      // server
      createFile(answers.appname + '/server/server.js', readTpl('server/server.js'));

      // elastic
      createFile(answers.appname + '/server/es/init.js', readTpl('server/es/init.js'));
      createFile(answers.appname + '/server/es/client.js', readTpl('server/es/client.js'));

      // config
      createFile(answers.appname + '/server/config/environment/index.js',
        readTpl('server/config/environment/_index.js'));
      createFile(answers.appname + '/server/config/environment/development.js',
        readTpl('server/config/environment/_development.js'));
      createFile(answers.appname + '/server/config/environment/production.js',
        readTpl('server/config/environment/_production.js'));

      console.log('');

      createFile(answers.appname + '/client/index.html', readTpl('client/_index.html'));
      createFile(answers.appname + '/client/app.js', readTpl('client/app.js'));
      createFile(answers.appname + '/client/app.config.js', readTpl('client/_app.config.js'));

      shell.exec("curl -o " + answers.appname + "/client/assets/mdi.svg https://materialdesignicons.com/api/download/angularmaterial/38EF63D0-4744-11E4-B3CF-842B2B6CFE1B")
    })
    .catch(function(err) {
      console.log('');
      return console.log(chalk.red('Stay with me Gabrielle! ' + err));
    })
    .return('')
    .tap(function() {
      console.log('');
      console.log(chalk.green('Your XENA app is ready to go!'));
      console.log('');
      console.log('To launch your application follow those steps:');
      console.log('');
      console.log('  $ ' + chalk.blue('cd ' + answers.appname + ' && npm install'));
    })
  ;
}

function init(name, options) {
  var questions = [
    {
      type: 'input',
      name: 'description',
      message: 'Description:'
    },
    {
      type: 'input',
      name: 'author',
      message: 'Author(s):'
    },
    {
      type: 'input',
      name: 'indices',
      message: 'Elasticsearch indices (separated by a comma if several):',
      default: [name]
    },
    {
      type: 'input',
      name: 'shards',
      message: 'Number of shards:',
      default: 2
    },
    {
      type: 'input',
      name: 'replicas',
      message: 'Number of replicas:',
      default: 0
    },
    {
      type: 'list',
      name: 'theme1',
      message: 'Main color for Angular Material theme:',
      choices: ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'grey', 'blue-grey'],
      default: 'blue'
    },
    {
      type: 'list',
      name: 'theme2',
      message: 'Secondary color for Angular Material theme:',
      choices: ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'grey', 'blue-grey'],
      default: 'red'
    }
  ];

  if(!name) {
    questions.unshift({
      type: 'input',
      name: 'appname',
      message: 'What\'s the name of your application?',
    });
  }
  else {
    initAnswers.appname = name;
  }

  return inquirer.prompt(questions, function(answers) {
    _.extend(initAnswers, answers);
    initAnswers.indices = initAnswers.indices.indexOf(',') !== -1 ?
      _.uniq(_.map(initAnswers.indices.split(','), _.trim)) :
      initAnswers.indices;
    return createApp  (initAnswers);
  });
};

module.exports = program
  .command('init [name]')
  .alias('i')
  .description('Initialize your XENA application')
  .action(init);
;
