angular.module('AMO')
	.directive('close', function ($window){
		var ob = {};
		
		ob.link = function (scope, element, attrs){
			element.on('click', function (e){
				e.stopPropagation();
				//$window.document.body.style.overflow = 'auto';
			});
		}
		
		return ob;
	}).directive('expander', function (){
		var ob = {};
		ob.restrict = 'C';
		ob.link = function (scope, el, attrs) {
			el.on('click', function (e){
				e.stopPropagation();
				//el.toggleClass('collapsed');
				if (el.hasClass('collapsed')) {
					el.removeClass('collapsed');
				} else {
					el.addClass('collapsed');
				}
			});
		}
		return ob;
	});
angular.module('AMO').component("amoToolbar", {
		controllerAs: '$ctrl',
		controller: ['$scope', '$element', '$templateRequest', '$compile',
		  function ($scope, $element, $templateRequest, $compile) {
			$scope.showGiftsModal = 0;
			$templateRequest('components/amoToolbar.html').then(function(html){
				var template = angular.element(html);
				$element.append(template);
				$compile(template)($scope);
			});
		}]
	}
);