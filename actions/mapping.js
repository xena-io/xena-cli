'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var inquirer = require('inquirer');
var chalk = require('chalk');
var shell = require('shelljs');

var mappingAnswers = {};
var appname = process.cwd();

function createMapping(answers) {
  var file = appname + '/server/api/' + answers.mapping + '/' + answers.mapping + '.mapping.json';

  return Promise.try(function() {
    return shell.test('-e', file);
  })
    .then(function(exists) {
      if (exists)
        return console.log(chalk.red('This mapping already exists.'));

      var str = fs.readFileSync(path.join(__dirname, '../templates/server/api/endpoint/_.mapping.json'), {encoding: 'utf8'});

      if (!shell.test('-e', appname + '/server/api/' + answers.mapping)) {
        shell.mkdir('-p', appname + '/server/api/' + answers.mapping);
        shell.chmod(755, appname + '/server/api/' + answers.mapping);
        console.log(chalk.green('\u2731 ') + 'creating directory: ' + chalk.blue(appname + '/server/api/' + answers.mapping));
      }

      fs.writeFile(file, str, function () {
        console.log(chalk.green('\u2731 ') + 'creating file: ' + chalk.blue(file));
      }); 
    })
    .catch(function(err) {
      console.log(chalk.red('Don\'t die Gabrielle!'));
      throw new Error(err.stack);
    })
    .return('')
    .tap(function() {
      console.log('');
    })
  ;
}

module.exports = function mapping(name) {
  var questions = [];
  
  if (!name) {
    questions.unshift({
      type: 'input',
      name: 'mapping',
      message: 'What is the name of the mapping?'
    });
  }
  else {
    mappingAnswers.mapping = name;
  }

  if (questions.length) {
    inquirer.prompt(questions, function(answers) {
      _.extend({}, mappingAnswers, answers);
      return createMapping(mappingAnswers);
    });
  }

  return createMapping(mappingAnswers);
};
