angular.module('AMO')
.controller('amoMain', ['amoModal', '$translate', '$window', function (amoModal, $translate, $window){
  amoModal.open({component: "amo-reader"});
	this.showBibleReader = function (ref) {
		amoModal.open({component: 'amo-reader', data: {reference: ref}});
	}
	if (!$window.localStorage.getItem('amo-lang')) {
		amoModal.open({component: 'amo-lang-switcher'});
	}
	this.changeLanguage = changeLanguage;
	function changeLanguage (key) {
		$translate.use(key);
	}
}]).constant('ayep', function () {
	return 
});

/*
function getUserIP() {
	var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
	var pc = new myPeerConnection({
			iceServers: []
	}),
	noop = function() {},
	localIPs = {},
	ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
	key;

	function iterateIP(ip) {
			if (!localIPs[ip]) onNewIP(ip);
			localIPs[ip] = true;
	}

	pc.createDataChannel("");

	pc.createOffer().then(function(sdp) {
			sdp.sdp.split('\n').forEach(function(line) {
					if (line.indexOf('candidate') < 0) return;
					line.match(ipRegex).forEach(iterateIP);
			});
			
			pc.setLocalDescription(sdp, noop, noop);
	}).catch(function(reason) {

	});

	pc.onicecandidate = function(ice) {
			if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
			ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
	};
}

getUserIP(function(ip){
	alert("Got IP! :" + ip);
});
*/