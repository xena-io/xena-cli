# XENA

XENA : eXtended Elasticsearch Node.js AngularJS

MEAN is great. But MongoDB is not the only database and Express is not the only stable framework for Node.js.

Enters...XENA (awesome name, right? very powerful)

The eXtended is for [Hapi](http://hapijs.com/) (HENA didn't sound so good and wasn't as cool as XENA)

## Installation

This is not a published npm module yet so to install this you have follow those steps:

```shell
$ git clone https://github.com/xena-io/xena-cli.git
$ cd xena-cli
$ npm link
```

## Usage

All options for the following commands are optional, if you don't input them, you will be asked during the execution of the command.

### Initialization

To initialize a XENA application:
```shell
$ xena init [name]
```
### Mapping

To create a new mapping for an elasticsearch type:
```shell
$ xena mapping [name] [fields...]
```

The fields option is a list of all the fields you wish to push in your mapping, the syntax is `name:type`

Here is an exemple :
```shell
$ xena mapping user username:string email:string dob:date
```

### Endpoint

To create an endpoint in the backend API:
```shell
$ xena endpoint [name]
```
