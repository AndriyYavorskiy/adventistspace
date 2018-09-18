angular.module('AMO')
.controller('amoMain', function (amoModal){
  amoModal.open({component: "amo-reader"});
	this.showBibleReader = function (ref) {
		amoModal.open({component: 'amo-reader', data: {reference: ref}});
	}
});