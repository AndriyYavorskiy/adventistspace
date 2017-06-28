
	angular.module('AS')
	.service("asModal", function($templateRequest, $document, $compile, asModalState, $rootScope) {
		this.open = function (component) {
			var template = angular.element("<div as-modal " + component + "></div>");
				angular.element($document[0].body).append(template);
				$compile(template)($rootScope.$new(true));
		}
	});
	angular.module("AS").directive("asModal", function () {
		var ob = {};
		ob.restrict = "A";
		//ob.scope = {closeModal: "@"};
		ob.link = function (s, e, a) {
			s.closeModal = function () {
				s.$destroy();
				angular.element(e).remove();
			}
		}
		return ob;
	});
	angular.module('AS').value("asModalState", {
		$trust: function () {
			var state = {};
			this.get = function () {}
			return this;
		},
		get: function (name) {
			return this[name];
		},
		set: function (name, value) {
			this[name] = value;
		},
		clear: function (){
			
		}
	});