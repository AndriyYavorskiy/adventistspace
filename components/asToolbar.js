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
					console.log(el.parent());
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
angular.module('AMO').directive("asToolbar", function ($templateRequest, $compile) {
		var object = {};
		object.restrict = 'EA';
		object.scope = '@';
		object.link = function (scope, el, attrs) {
			scope.showGiftsModal = 0;
			$templateRequest('components/asToolbar.html').then(function(html){
				// Convert the html to an actual DOM node
				var template = angular.element(html);
				// Append it to the directive element
				el.append(template);
				// And let Angular $compile it
				$compile(template)(scope);
			});
		}
		return object;
	});