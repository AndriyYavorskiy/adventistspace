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
					var alfaPart = input.value.split(/\d/i)[0].trim(),
						numbers = _getNumbersFrom(input.value),
						searchParams = {
							query: alfaPart,
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

		function _getNumbersFrom (str) {
			var raw = str.split(/\D+/i), nums = [];
			raw.forEach(function (rawItem) {
				if (rawItem && typeof +rawItem === 'number') {
					nums.push(+rawItem);
				}
			});
			return nums;
		}
	});