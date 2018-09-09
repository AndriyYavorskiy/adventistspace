function amoGoFullScreen () {
  var el = document.documentElement,
    rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;

  try {
    if (typeof rfs!="undefined" && rfs) {
        rfs.call(el);
    } else if(typeof window.ActiveXObject!="undefined"){
      var wscript = new ActiveXObject("WScript.Shell");

      if (wscript!=null) {
        wscript.SendKeys("{F11}");
      }
    }
  } catch (error) {
    alert(error);
  }
}
function amoLeaveFullScreen () {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}