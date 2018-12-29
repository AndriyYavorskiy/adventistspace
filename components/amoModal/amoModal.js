
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
