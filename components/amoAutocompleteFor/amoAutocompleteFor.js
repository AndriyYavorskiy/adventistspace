angular.module('AMO')
	.directive('amoAutocompleteFor', function (amoBibleInstanceManager){
		var object = {};
		object.scope = {
			bibleBook: "=",
			callback: "<"
		};
		object.template =
		`<div class="item" ng-class="{ active: $index === candidateIndex }"
		  ng-repeat="candidate in candidates" ng-mousedown="callback(candidate)">
			{{candidate | BibleReference}}
		</div>`;
		object.link = function (s, e, a) {
			var input = angular.element(e[0].parentNode)[0].querySelector(a.amoAutocompleteFor);

			s.candidateIndex = 0;
			s.candidates = [];
			angular.element(input).on("keyup", handleKeys);
			function handleKeys (event) {
				if (event.which === 38) {
					s.candidateIndex = s.candidateIndex === 0 ? s.candidates.length - 1 : s.candidateIndex - 1;
					event.preventDefault();
				}
				if (event.which === 40) {
					s.candidateIndex = s.candidateIndex < s.candidates.length - 1 ? s.candidateIndex + 1 : 0;
					event.preventDefault();
				}
				if (event.which === 13){
					s.callback(s.candidates[s.candidateIndex]);
					input.blur();
				}
				if (event.target.value.length > 1) {
					var chars = _getChars(event.target.value),
          	numbers = _getNumbers(event.target.value),
						searchParams = {
							query: chars[0] || '',
							chapter: numbers[0] || 0,
							verse: numbers[1] || 0
						};

					s.candidates = amoBibleInstanceManager.findDestinations(searchParams);
					s.$apply();
				} else {
					s.candidates = [];
				}
			}	
		}

		return object;

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
	});