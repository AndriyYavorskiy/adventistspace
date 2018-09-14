angular.module('AMO')
.controller('as-main', function ($scope, $window, asModal){
  asModal.open("as-reader");
	this.showBibleReader = function (ref) {
		var reference = ref ? "='" + ref + "'" : "";
		asModal.open("as-reader" + reference);
	}
});