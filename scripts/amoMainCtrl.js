angular.module('AMO')
.controller('amoMain', ['amoModal', '$translate', '$window', '$filter', function (amoModal, $translate, $window, $filter){
	var openGraphTitle = document.querySelector('#og-title');

	this.openOnLoad = !!JSON.parse($window.localStorage.getItem('amo-settings') || '{}').openOnLoad;
	if (this.openOnLoad || $window.location.search.match(/(\?|&)read=/i)) {
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
	if ($window.location.hash) {
		openGraphTitle.attributes.content.value = $filter('BibleReference')($window.location.hash.replace('#', ''));
	}

	this.toggleOpenOption = function () {
		var settings = JSON.parse($window.localStorage.getItem('amo-settings') || '{}');

		settings.openOnLoad = this.openOnLoad;
		$window.localStorage.setItem('amo-settings', JSON.stringify(settings));
	};
}]);
