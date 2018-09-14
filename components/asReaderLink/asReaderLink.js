angular.module('AMO').directive('asReaderLink', function (asModal, $filter){
	var object = {};
	object.restrict = "A";
	object.link = function (s, e, a) {
		var reference = a.asReaderLink,
			isAutoTextOn = Object.keys(a).indexOf("autoText") > -1;
		
		e.addClass("as-reader-link");
		if (isAutoTextOn) {
			e.text($filter("BibleReference")(reference));
		}
		e.on("click", function (event) {
			var ref = reference ? "='" + reference + "'" : "";
			asModal.open("as-reader" + ref);
		});
	}
	return object;
});