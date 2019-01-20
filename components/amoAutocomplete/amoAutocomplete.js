angular.module('AMO').component('amoAutocomplete', {
  templateUrl: './components/amoAutocomplete/amoAutocomplete.html',
  controllerAs: 'amoAutocomplete',
  transclude: true,
  bindings: {
    callback: '<'
  },
  controller: ['$element', '$timeout', 'amoBibleInstanceManager', '$scope', function ($element, $timeout, amoBibleInstanceManager, $scope) {
    var input,
        $ctrl = this;

    $scope.candidateIndex = 0;
    $scope.candidates = [];
    $timeout(function () {
      input = $element[0].getElementsByTagName('input')[0];
      angular.element(input).on('keyup', handleKeys);
      angular.element(input).on('focus', function () {
        $scope.focus = true
        $scope.$apply();
      })
      angular.element(input).on('blur', function () {
        $scope.focus = false;
        $scope.$apply();
      })
    });

    function handleKeys (event) {
      if (event.which === 38) {
        $scope.candidateIndex = $scope.candidateIndex === 0 ? $scope.candidates.length - 1 : $scope.candidateIndex - 1;
        event.preventDefault();
      }
      if (event.which === 40) {
        $scope.candidateIndex = $scope.candidateIndex < $scope.candidates.length - 1 ? $scope.candidateIndex + 1 : 0;
        event.preventDefault();
      }
      if (event.which === 13){
        $ctrl.callback($scope.candidates[$scope.candidateIndex]);
        input.blur();
      }
      if (event.target.value.length > 1) {
        var chars = _getChars(event.target.value),
          numbers = _getNumbers(event.target.value),
          searchParams = {
            query: chars[0],
            chapter: numbers[0] || 0,
            verse: numbers[1] || 0
          };
        $scope.candidates = amoBibleInstanceManager.findDestinations(searchParams);
      } else {
        $scope.candidates = [];
      }
      $scope.$apply();
    }
    function _getChars(str) {
      var chars = [], particles = str.split(/\b/i);

      particles.forEach(function (particle) {
        if (/^([а-я]|\w+)+$/.test(particle.trim())) {
          chars.push(particle.trim());
        }
      });
      return chars;
    }
    function _getNumbers(str) {
      var numbers = [], particles = str.split(/[\D+]/i);

      particles.forEach(function (particle) {
        if (/^\d+$/.test(particle)) {
          numbers.push(+particle);
        }
      });
      return numbers;
    }
  }]
});
