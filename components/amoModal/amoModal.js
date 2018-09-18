
	angular.module('AMO')
	.service("amoModal", function($document, $compile, $rootScope) {
		this.open = function (options) {
			var templateStr = `<amo-modal>
				<${options.component} data="options.data" close-modal="closeModal"></${options.component}>
			</amo-modal>`,
			template = angular.element(templateStr)[0],
			scope = $rootScope.$new(true);
			scope.options = options;
			scope.closeModal = closeModal;
			angular.element(options.parent || $document[0].body).append(template);
			$compile(template)(scope);

			function closeModal (callback) {
				if (callback) {
					callback(scope);
				}
				scope.$destroy();
				angular.element(template)[0].remove();
			}
		}
	});
	angular.module('AMO').component("amoModal", {
		template: '<ng-transclude></ng-transclude>',
		transclude: true,
		controllerAs: "modal",
		controller: [function () {}]
	});




	/*
	angular.module('AMO')
	.service("amoModal", function($document, $compile, $rootScope) {
		this.open = function (component, parent, data) {
			var template = angular.element('<amo-modal data="data" component="' + component + '"></amo-modal>')[0],
			scope = $rootScope.$new(true);
			scope.data = data;
			angular.element(parent || $document[0].body).append(template);
			$compile(template)(scope);
		}
	});
	angular.module('AMO').component("amoModal", {
		bindings: {
			data: '<',
			component: '@'
		},
		controllerAs: "modal",
		controller: ['$scope', '$element', '$compile', function ($scope, $element, $compile) {
			var modal = this, templateStr, template;

			
			setTimeout(function () {
				templateStr = modal.component.indexOf('<') > -1 ? modal.component : createTemplStr(modal.component);
				template = angular.element(templateStr)[0];

				modal.closeModal = closeModal;
				$element[0].append(template);
				$compile(template)($scope);
			}, 0);

			function closeModal (callback) {
				if (callback) {
					callback($scope);
				}
				$scope.$destroy();
				angular.element($element[0]).remove();
			}
			function createTemplStr (comp) {
				return '<' + comp + ' data="modal.data" close-modal="modal.closeModal"></' + comp + '>';
			}
		}]
	});
	*/
