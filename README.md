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

To initialize a XENA application (the name is optional, if you don't specify it in the command it will be asked during the initialization):
```shell
$ xena init [name]
```

To create a new mapping for an elasticsearch type (as with the init command, the name is optional):
```shell
$ xena mapping [name]
```
