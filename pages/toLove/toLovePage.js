angular.module('AMO').controller('2LovePageController', ['$scope', '$interval', function ($scope, $interval) {
  var targetDate = new Date();
  targetDate.setFullYear(2020);
  targetDate.setMonth(1);
  targetDate.setDate(20);
  targetDate.setHours(20);
  targetDate.setMinutes(20);
  targetDate.setSeconds(20);
  $scope.timeLeft = '';


  $interval(function() {
    $scope.timeLeft = getTimeLeft();
  }, 1000);

  function getTimeLeft () {
    var secondsLeft = Math.round((targetDate.valueOf() - new Date().valueOf()) / 1000);
    
    return getDisplayTime(secondsLeft);
  }

  function getDisplayTime(allSeconds) {
    const fullDays = Math.floor(allSeconds / 86400);
    const restSeconds = allSeconds % 86400;
    const hours =  Math.floor(restSeconds / 3600);
    const minutes =  `00${Math.floor((restSeconds % 3600) / 60)}`.substr(-2);
    const seconds = `00${Math.floor(restSeconds % 60)}`.substr(-2);
    return `${fullDays} (полных суток) ${hours}:${minutes}:${seconds}`;
  }
}]);