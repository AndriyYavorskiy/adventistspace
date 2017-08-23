angular.module('AS')
.directive('asStopProp', function (){
	return {
		link: function (s, e, a) {
			e.on("click", function (event) {
				event.stopPropagation();
			});
		}
	}
});