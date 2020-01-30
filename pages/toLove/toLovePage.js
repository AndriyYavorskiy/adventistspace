angular.module('AMO').controller('2LovePageController', ['$scope', '$interval', '$filter', function ($scope, $interval, $filter) {
  var targetDate = new Date();
  targetDate.setYear(2020);
  targetDate.setMonth(1, 20);
  targetDate.setHours(20);
  targetDate.setMinutes(20);
  targetDate.setSeconds(20);
  var allSeconds = Math.round((targetDate.valueOf() - new Date().valueOf()) / 1000);
  $scope.timeLeft = '';

  $interval(function() {
    allSeconds--;

    const fullDays = Math.floor(allSeconds / 86400);
    const restSeconds = allSeconds % 86400;
    const hours =  Math.floor(restSeconds / 3600);
    const minutes = ('00' + Math.floor((restSeconds % 3600) / 60)).substr(-2);
    const seconds = ('00' + Math.floor(restSeconds % 60)).substr(-2);
    $scope.translationData = {
      days: fullDays,
      parts: hours + ':' + minutes + ':' + seconds
    };
  }, 1000);

}]);