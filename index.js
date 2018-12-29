angular.module('AMO', ['ngclipboard', 'pascalprecht.translate'])
.config(function($translateProvider) {
  $translateProvider.useStaticFilesLoader({
    files: [{ prefix: 'locals/', suffix: '.json' }]
  });
  $translateProvider.preferredLanguage(window.localStorage.getItem('amo-lang') || 'en');
  $translateProvider.useSanitizeValueStrategy('escape');
});