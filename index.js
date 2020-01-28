angular.module('AMO', ['ngclipboard', 'pascalprecht.translate', 'ngRoute']);

angular.module('AMO').config(function ($translateProvider) {
  $translateProvider.useStaticFilesLoader({
    files: [{ prefix: 'locals/', suffix: '.json' }]
  });
  $translateProvider.preferredLanguage(window.localStorage.getItem('amo-lang') || 'en');
  $translateProvider.useSanitizeValueStrategy('escape');
});

angular.module('AMO')
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true);
  $routeProvider.
  when('/', {
    templateUrl : '/pages/home/home.html',
    controller: 'homePageController'
  }).
  when("/2love", {
      templateUrl: '/pages/toLove/toLove.html',
      controller: '2LovePageController'
  }).
  otherwise({
    redirectTo: '/',
    template: '/pages/home/home.html'
  });
}]);
