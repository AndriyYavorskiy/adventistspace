angular.module('AMO').directive('amoReaderLink', function (amoModal, $filter){
	var object = {};
	object.restrict = "A";
	object.link = function (s, e, a) {
		var reference = a.amoReaderLink,
			isAutoTextOn = Object.keys(a).indexOf("autoText") > -1;
		
		e.addClass("amo-reader-link");
		if (isAutoTextOn) {
			e.text($filter("BibleReference")(reference));
		}
		e.on("click", function (event) {
			amoModal.open({ component: "amo-reader", data: {reference: reference} });
		});
	}
	return object;
});