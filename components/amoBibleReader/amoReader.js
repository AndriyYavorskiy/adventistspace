console.log('http://adventamo.com/#ru:ezek:20:19');
angular.module('AMO').component('amoReader', {
	template: `
		<div class="readers-wrapper">
			<button class="btn m blank close-modal" ng-click="reader.closeModal()">✖</button>
			<div class="books-wrapper">
				<div class="reader-toolbar"></div>
			</div>
			<div class="links-master" ng-if="reader.linksMasterConfig.open">
				<amo-links wrapper-config="reader.linksMasterConfig"></amo-links>
			</div>
		</div>
	`,
	bindings: {
		closeModal: '<',
		data: '<'
	},
	controllerAs: 'reader',
	controller: ['$scope', '$element', '$compile', '$window', 'amoBibleInstanceManager', '$rootScope',
	  function ($scope, $element, $compile, $window, amoBibleInstanceManager) {
			var reader = this;
			this.addInstance = addInstance;
			this.$onInit = function () {
				var state = getLastState();
				if (state instanceof Array) {
					state.forEach(function (ref) {
						addInstance(ref);
					});	
				} else {
					addInstance(state);
				}
			}
			reader.delegator = {
				displayLinksMaster: displayLinksMaster
			};
			reader.linksMasterConfig = {
				open: false,
				dispatch: function (action) {
					switch(action.type) {
						case ('[AMO_LINKS] OPEN_REFERENCE'): 
							this.open = false;
							addInstance(action.payload);
							break;
						case ('[AMO_LINKS] CLOSE_LINKS_MASTRER'):
							this.open = false;
							break;
						default: 
							console.warn('[AMO_LINKS] Unknown actiontype: ' + action.type);
					}
				}
			}
			$scope.$on('appeal:add-bookmark', function (event, ref) {
				amoBibleInstanceManager.addToLastBookmarks(ref);
			});
			$scope.$on('appeal:add-instance', function (event, ref) {
				addInstance(ref);
			});
			$scope.$on('appeal:remove-instance', function (event, node) {
				var readersParent = node[0].parentNode;
				node.remove();
				if (!readersParent.querySelector('.book-wrapper')) {
					reader.closeModal();
					$scope.$destroy();
				}
			});
			$scope.$on('$destroy', function () {
				amoBibleInstanceManager.clearLastBookmarks();
			});

			function addInstance (reference) {
				var template = angular.element(
					"<amo-bible-instance reference='" + reference + "' class='book-wrapper' parent='reader.delegator'></amo-bible-instance>"
				);

				angular.element($element[0].querySelector(".books-wrapper")).append(template[0]);
				$compile(template)($scope.$new());
			}
			function displayLinksMaster (candidate) {
				reader.linksMasterConfig.open = true;
				reader.linksMasterConfig.message = 'Сохранение ссылки';
				reader.linksMasterConfig.candidateLink = candidate;
			}
			function getLastState () {
				if (reader.data && reader.data.reference) {
					return reader.data.reference;
				} else if ($window.location.hash) {
					return $window.location.hash.replace("#", "");
				} else {
					var lastBookmark = amoBibleInstanceManager.remindLastState();
					return lastBookmark.length ? lastBookmark : "ru:matt:1";
				}
			}
	  }
	]
});
