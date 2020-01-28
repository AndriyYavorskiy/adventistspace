angular.module('AMO').controller('homePageController', ['$scope', function ($scope) {
  $scope.targetSource = document.getElementsByName('content-source')[0].content;
  $scope.targetContent = document.getElementsByName('content-data')[0].content;
}]);