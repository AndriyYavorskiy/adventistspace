angular.module('AMO').directive('amoDesktop', ['$window', function ($window) {
  return {
    restrict: 'A',
    link: function (s, e, a) {
      adapt();
      $window.addEventListener('resize', adapt);
      function adapt () {
        e.css({height: $window.innerHeight + 'px'});
      }
    }
  }
}]);