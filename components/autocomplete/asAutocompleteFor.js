angular.module('AMO')
	.directive('asAutocompleteFor', function (asBibleInstanceManager){
		var object = {};
		object.scope = {
			bibleBook: "=",
			switchToBook: "="
		};
		object.template = `<div class="item" ng-repeat="candidate in candidates" ng-mousedown="switchToBook(candidate)">
							  {{candidate.name}}
						   </div>`;
		object.link = function (s, e, a) {
			var input = angular.element(e[0].parentNode)[0].querySelector(a.asAutocompleteFor);
			s.candidates = [];
			angular.element(input).on("keyup", searchForBook);
			function searchForBook () {
				if (s.bibleBook.length > 2) {
					s.candidates = asBibleInstanceManager.helpToFindBook(s.bibleBook);
				} else {
					s.candidates = [];
				}
			}	
		}

		return object;
	});