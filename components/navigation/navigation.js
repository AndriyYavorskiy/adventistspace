angular.module('AMO').component('amoNavigation', {
  templateUrl: './components/navigation/navigation.html',
  controllerAs: 'amoNav',
  controller: ['$window', '$document', '$scope', function ($window, $rootScope, $scope) {
    $ctrl = this;
    $scope.currentPage = $window.location.pathname;

    $scope.$on('$routeChangeSuccess', function () {
      $scope.currentPage = $window.location.pathname;
      // $rootScope.$apply();
    });
  }]
});