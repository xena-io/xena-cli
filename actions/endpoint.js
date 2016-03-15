'use strict';

var _ = require('lodash');
var program = require('commander');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var inquirer = require('inquirer');
var chalk = require('chalk');
var shell = require('shelljs');

var endpointAnswers = {
  mappingExists: false
};
var appname = process.cwd();

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
  return tpl(endpointAnswers);
}

function createEndpoint(answers) {
  var file = appname + '/server/api/' + answers.name + '/' + answers.name + '.object.js';

  return Promise.try(function() {
    return shell.test('-e', file);
  })
    .then(function(exists) {
      if (exists)
        return console.log(chalk.red('This endpoint already exists.'));

      if (!shell.test('-e', appname + '/server/api/' + answers.name)) {
        shell.mkdir('-p', appname + '/server/api/' + answers.name);
        shell.chmod(755, appname + '/server/api/' + answers.name);
        console.log(chalk.green('\u2731 ') + 'creating directory: ' + chalk.blue(appname + '/server/api/' + answers.name));
        console.log('');
      }

      createFile(appname + '/server/api/' + answers.name + '/' + answers.name + '.object.js',
        readTpl('server/api/endpoint/_.object.js')
      );
      createFile(appname + '/server/api/' + answers.name + '/get.js',
        readTpl('server/api/endpoint/_get.js')
      );
      createFile(appname + '/server/api/' + answers.name + '/post.js',
        readTpl('server/api/endpoint/_post.js')
      );
      createFile(appname + '/server/api/' + answers.name + '/list.js',
        readTpl('server/api/endpoint/_list.js')
      );

      if (!answers.mappingExists) {
        createFile(appname + '/server/api/' + answers.name + '/' + answers.name + '.mapping.yaml',
          readTpl('server/api/endpoint/_.mapping.yaml')
        );
      }
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

function parseFields(fields) {
  var aFields = [];

  for (var i = 0, l = fields.length; i < l; i++) {
    var field = fields[i].split(':');
    aFields.push({
      name: field[0],
      type: field[1]
    });
  }

  return aFields;
}

function endpoint(name, options) {
  var mapping = appname + '/server/api/' + name + '/' + name + '.mapping.json';
  var fields = [];

  return Promise.try(function() {
    return shell.test('-e', mapping);
  })
    .then(function(exists) {
      var questions = [
        {
          type: 'input',
          name: 'name',
          message: 'What is the name of the endpoint?',
          when: function() {
            return !name;
          }
        },
        {
          type: 'confirm',
          name: 'mapping',
          message: 'It seems that there is no mapping for this endpoint yet, would you like to create one?',
          when: function(answers) {
            return !exists;
          }
        },
        {
          type: 'input',
          name: 'fields',
          message: 'What are the fields for this mapping? (the syntax to declare a field is field:type, ex: name:string, each field separated by a space)',
          when: function(answers) {
            return !exists && answers.mapping;
          }
        }
      ];

      if (exists) {
        endpointAnswers.mappingExists = true;
        endpointAnswers.fields = [];
        var obj = require(mapping).properties;
        for(var key in obj) {
          if (obj.hasOwnProperty(key)) {
            endpointAnswers.fields.push({
              name: key,
              type: obj[key].type
            });
          }
        }
      }

      if (name) {
        endpointAnswers.name = name;
      }

      if (questions.length) {
        return inquirer.prompt(questions, function(answers) {
          if (answers.mapping && answers.fields.length) {
            answers.fields = parseFields(answers.fields.split(' '));
          }
          _.extend(endpointAnswers, answers);
          return createEndpoint(endpointAnswers);
        });
      }

      return createEndpoint(endpointAnswers);
    })
  ;
};

module.exports = program
  .command('endpoint [name]')
  .alias('e')
  .description('Generate an endpoint for the API')
  .action(endpoint)
;
