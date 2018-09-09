
	angular.module('AS')
	.service("asModal", function($document, $compile, $rootScope) {
		this.open = function (component, parent, data) {
			var template = angular.element(component.indexOf('<') > -1 ? component : "<div as-modal " + component + "></div>")[0],
			scope = $rootScope.$new(true);
			scope.modalData = data || {};
			angular.element(parent || $document[0].body).append(template);
			$compile(template)(scope);
		}
	});
	angular.module("AS").directive("asModal", function () {
		var ob = {};
		ob.restrict = "A";
		ob.link = function (s, e, a) {
			s.closeModal = function (callback) {
				if (callback) {
					callback(s);
				}
				s.$destroy();
				angular.element(e).remove();
			}
		}
		return ob;
	});
	