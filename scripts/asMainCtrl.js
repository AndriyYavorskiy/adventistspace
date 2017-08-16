angular.module('AS')
.controller('as-main', function ($scope, $window, asModal){
	if ($window.location.hash) {
		asModal.open("as-reader");
	}
	this.showBibleReader = function (ref) {
		var reference = ref ? "='" + ref + "'" : "";
		asModal.open("as-reader" + reference);
	}
});