angular.module('AMO')
.controller('amoMain', ['amoModal', '$translate', '$window', '$filter', function (amoModal, $translate, $window, $filter){
	var openGraphTitle = document.querySelector('#og-title');

  amoModal.open({component: "amo-reader"});
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
}]);
