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
      mkdir(answers.appname + '/server/elasticsearch');

      // structure client
      mkdir(answers.appname + '/client');
      mkdir(answers.appname + '/client/app');
      mkdir(answers.appname + '/client/components');
      mkdir(answers.appname + '/client/assets');
      mkdir(answers.appname + '/client/assets/images');

      console.log('');

      // package.json
      createFile(answers.appname + '/package.json', readTpl('_package.json'));

      // server
      createFile(answers.appname + '/server/server.js', readTpl('server/server.js'));

      // elastic
      createFile(answers.appname + '/server/elasticsearch/init.js', readTpl('server/es/init.js'));
      createFile(answers.appname + '/server/elasticsearch/client.js', readTpl('server/es/client.js'));

      // config
      createFile(answers.appname + '/server/config/environment/index.js',
        readTpl('server/config/environment/_index.js'));
      createFile(answers.appname + '/server/config/environment/development.js',
        readTpl('server/config/environment/_development.js'));
      createFile(answers.appname + '/server/config/environment/production.js',
        readTpl('server/config/environment/_production.js'));
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
      console.log('  $ ' + chalk.blue('cd ' + answers.appname + ' && npm install && bower install'));
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
