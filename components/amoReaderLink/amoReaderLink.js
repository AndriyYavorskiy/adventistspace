angular.module('AMO').directive('amoReaderLink', function (amoModal, $filter){
	var object = {};
	object.restrict = "A";
	object.link = function (s, e, a) {
		var reference = a.amoReaderLink,
			isAutoTextOn = Object.keys(a).indexOf("autoText") > -1,
			pre = a.preText || '', post = a.postText || '',
			pattern = a.pattern;

		e.addClass("amo-reader-link");
		if (isAutoTextOn) {
			e.text(pre + $filter("BibleReference")(reference, pattern) + post);
		}
		e.on("click", function () {
			amoModal.open({ component: "amo-reader", data: {reference: reference} });
		});
	}
	return object;
});