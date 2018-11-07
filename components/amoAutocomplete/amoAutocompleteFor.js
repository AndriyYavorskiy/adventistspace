angular.module('AMO')
	.directive('amoAutocompleteFor', function (amoBibleInstanceManager){
		var object = {};
		object.scope = {
			bibleBook: "=",
			switchToBook: "<"
		};
		object.template =
		`<div class="item" ng-class="{ active: $index === candidateIndex }"
		  ng-repeat="candidate in candidates" ng-mousedown="switchToBook(candidate)">
			{{candidate.name}}
		</div>`;
		object.link = function (s, e, a) {
			var input = angular.element(e[0].parentNode)[0].querySelector(a.amoAutocompleteFor);

			s.candidateIndex = 0;
			s.candidates = [];
			angular.element(input).on("keyup", searchForBook);
			function searchForBook (event) {
				if (event.which === 38) {
					s.candidateIndex = s.candidateIndex === 0 ? s.candidates.length - 1 : s.candidateIndex - 1;
					event.preventDefault();
				}
				if (event.which === 40) {
					s.candidateIndex = s.candidateIndex < s.candidates.length - 1 ? s.candidateIndex + 1 : 0;
					event.preventDefault();
				}
				if (event.which === 13){
					s.switchToBook(s.candidates[s.candidateIndex]);
					input.blur();
				}
				if (event.target.value.length > 1) {
					s.candidates = amoBibleInstanceManager.helpToFindBook(event.target.value);
					s.$apply();
				} else {
					s.candidates = [];
				}
			}	
		}

		return object;
	});