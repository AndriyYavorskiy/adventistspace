angular.module('AMO')
.controller('amoMain', ['amoModal', '$translate', '$window', '$filter', 'amoBibleInstanceManager',
 function (amoModal, $translate, $window, $filter, amoBibleInstanceManager){
	var openGraphTitle = document.querySelector('#og-title');
	var hash = $window.location.hash.replace('#', '');
	var hashIsALink = amoBibleInstanceManager.isValidReference(hash);
	var langUrlParamMatch = $window.location.search.match(/(\?|&)lang=(en|ru|ua)/i);

	if (langUrlParamMatch) {
		var lang = langUrlParamMatch[0].split('=')[1];
		changeLanguage(lang);
	}

	this.openOnLoad = !!JSON.parse($window.localStorage.getItem('amo-settings') || '{}').openOnLoad;
	if (this.openOnLoad || $window.location.search.match(/(\?|&)read=/i) || hashIsALink) {
		amoModal.open({component: "amo-reader"});
	}

	this.showBibleReader = function (ref) {
		amoModal.open({component: 'amo-reader', data: {reference: ref}});
	}
	if (!$window.localStorage.getItem('amo-lang')) {
		changeLanguage('ru');
	}
	this.changeLanguage = changeLanguage;
	function changeLanguage (key) {
		$translate.use(key);
		$window.localStorage.setItem('amo-lang', key);
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
