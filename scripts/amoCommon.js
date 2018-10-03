angular.module('AMO')
.directive('amoStopProp', function (){
	return {
		link: function (s, e, a) {
			e.on("click", function (event) {
				event.stopPropagation();
			});
		}
	}
})
.directive('amoPreventDefault', function (){
	return {
		link: function (s, e, a) {
			e.on("click", function (event) {
				event.preventDefault();
			});
			e.on("dblclick", function (event) {
				event.preventDefault();
			});
			e.on("contextmenu", function (event) {
				event.preventDefault();
			});
		}
	}
});