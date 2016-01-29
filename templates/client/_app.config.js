'use strict';

export function routes($locationProvider, $urlRouterProvider, $stateProvider) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('waisygh', {
      url: '/',
      views: {
        'toolbar': {
          template: require('./toolbar/toolbar.tpl.html')
        }
      }
    })
  ;
}

export function material($mdThemingProvider, $mdIconProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette(<%= theme1 %>)
    .accentPalette(<%= theme2 %>, {
      'default': '500'
    })
  ;
  $mdIconProvider
    .defaultIconSet('assets/mdi.svg')
  ;
}
