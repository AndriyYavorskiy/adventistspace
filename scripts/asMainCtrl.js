angular.module('AS')
.controller('as-main', function ($scope, $window, $rootScope, asModal){
	if ($window.location.hash) {
		//$rootScope.$emit("e:hash-content");
		//$scope.BibleReference = $window.location.hash;
		asModal.open($scope, "as-reader");
	}
	this.showBibleReader = function (ref) {
		var reference = ref ? "='" + ref + "'" : "";
		asModal.open("as-reader" + reference);
	}
});