angular.module('AMO')
.directive('amoStopProp', function (){
	return {
		link: function (s, e, a) {
			e.on("click", function (event) {
				event.stopPropagation();
			});
		}
	}
});