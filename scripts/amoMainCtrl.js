angular.module('AMO')
.controller('amoMain', ['amoModal', '$translate', '$window', '$filter', 'amoBibleInstanceManager',
 function (amoModal, $translate, $window, $filter, amoBibleInstanceManager){
	var openGraphTitle = document.querySelector('#og-title');
	var hash = $window.location.hash.replace('#', '');
	var hashIsALink = amoBibleInstanceManager.isValidReference(hash);

	this.openOnLoad = !!JSON.parse($window.localStorage.getItem('amo-settings') || '{}').openOnLoad;
	if (this.openOnLoad || $window.location.search.match(/(\?|&)read=/i) || hashIsALink) {
		amoModal.open({component: "amo-reader"});
	}

	this.showBibleReader = function (ref) {
		amoModal.open({component: 'amo-reader', data: {reference: ref}});
	}
	if (!$window.localStorage.getItem('amo-lang')) {
		amoModal.open({component: 'amo-lang-switcher'});
	}
	this.changeLanguage = changeLanguage;
	function changeLanguage (key) {
		$translate.use(key);
	}
	if (hashIsALink) {
		openGraphTitle.attributes.content.value = $filter('BibleReference')(hash);
	}

	this.toggleOpenOption = function () {
		var settings = JSON.parse($window.localStorage.getItem('amo-settings') || '{}');

		settings.openOnLoad = this.openOnLoad;
		$window.localStorage.setItem('amo-settings', JSON.stringify(settings));
	};
}]);
