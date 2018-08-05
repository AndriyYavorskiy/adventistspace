
	angular.module('AS')
	.service("asModal", function($document, $compile, $rootScope) {
		this.open = function (component, parent) {
			var template = component.indexOf('<') > -1 ? component : angular.element("<div as-modal " + component + "></div>");
				angular.element(parent || $document[0].body).append(template);
				$compile(template)($rootScope.$new(true));
		}
	});
	angular.module("AS").directive("asModal", function () {
		var ob = {};
		ob.restrict = "A";
		ob.link = function (s, e, a) {
			s.closeModal = function () {
				s.$destroy();
				angular.element(e).remove();
			}
		}
		return ob;
	});
	