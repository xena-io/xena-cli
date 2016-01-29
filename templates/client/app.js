'use strict';

import angular from 'angular';
import ngMaterial from 'angular-material';
import ngMdIcons from 'angular-material-icons';
import ngMessages from 'angular-messages';
import uiRouter from 'angular-ui-router';

import {routes, material} from './app.configs';

angular
  .module('waisygh', [
    // angular dependencies
    ngMaterial,
    ngMdIcons,
    ngMessages,
    uiRouter

    // app dependencies
  ])
  .constant('API_HOST', '/api/')
  .config(material)
  .config(routes)
;
