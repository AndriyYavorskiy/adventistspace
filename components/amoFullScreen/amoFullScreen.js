angular.module('AMO').component('amoFullScreen', {
  templateUrl: './components/amoFullScreen/amoFullScreen.html',
  bindings: {
    closeModal: '<',
    data: '<'
  },
  controllerAs: 'fullScreen',
  controller: ['$scope', '$element', 'fullScreenAPI', function ($scope, $element, fullScreenAPI) {
    var html = document.querySelector('html'),
        fullScreen = this;

    fullScreen.$onInit =function () {
      fullScreen.model = angular.copy(fullScreen.data.book);
      fullScreen.reference = fullScreen.data.reference;
    };
    this.showNav = true;
    setTimeout(function () {
      var target = document.getElementById(fullScreen.reference.split('-')[0]);
      if (target) {
        scrollTo(fullScreen.reference.split('-')[0]).classList.add('spotlight');
      }
    }, 0);

    html.style.overflow = 'hidden';

    document.addEventListener(fullScreenAPI.fullscreenchangeEvent, escCallback);

    this.leaveFullScreen = leaveFullScreen;

    this.createID = function (model, chapterIndex, verseIndex) {
      var vi = verseIndex ? ':' + (++verseIndex) : '';
      return model.lang + ':' + model.id + ':' + (++chapterIndex) + vi;
    }

    this.navigate = function (event) {
      angular.element($element)[0].querySelector('.spotlight').classList.remove('spotlight');
      event.currentTarget.classList.add('spotlight');
      this.reference = event.currentTarget.id;
    }
    this.scrollTo = scrollTo;

    function scrollTo (id) {
      var target = document.getElementById(id);
      if (target) {
        target.scrollIntoView();
      }
      return target;
    }
    
    function escCallback ( event ) {
      setTimeout(function () {
        if (!document[fullScreenAPI.fullscreenElement]) {
          $scope.$destroy();
          // angular.element($element).remove();
          html.style.overflow = '';
          document.removeEventListener(fullScreenAPI.fullscreenchangeEvent, escCallback);
          fullScreen.closeModal();
        }
      });
    }
    function leaveFullScreen () {
      html.style.overflow = '';
      $scope.$destroy();
      // angular.element($element).remove();
      fullScreen.closeModal();
    }
  }],
  controllerAs: 'fullScreen'
});

angular.module('AMO').factory('fullScreenAPI', ['browser', function (browser) {
  var exitFullscreen = 'exitFullscreen',
  fullscreenchangeEvent = 'fullscreenchange';
  fullscreenElement = 'fullscreenElement';

  if (browser.isChrome()) {
    exitFullscreen = 'webkitExitFullscreen';
    fullscreenchangeEvent = 'webkitfullscreenchange';
    fullscreenElement = 'webkitFullscreenElement';
  }
  if (browser.isFirefox()) {
    exitFullscreen = 'mozCancelFullScreen';
    fullscreenchangeEvent = 'mozfullscreenchange';
    fullscreenElement = 'mozFullscreenElement';
  }
  if (browser.isIE()) {
    exitFullscreen = 'msExitFullscreen';
    fullscreenchangeEvent = 'MSFullscreenChange';
    fullscreenElement = 'msFullscreenElement';
  }
  
  return {
    exitFullscreen: exitFullscreen,
    fullscreenchangeEvent: fullscreenchangeEvent,
    fullscreenElement: fullscreenElement
  };
}]);

angular.module('AMO').factory('browser', function () {
  var name,
  isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,
  isIE = /*@cc_on!@*/false || !!document.documentMode,
  isChrome = !!window.chrome && !!window.chrome.webstore;

  return {
    isOpera: function () {
      return isOpera;
    },
    isFirefox: function () {
      return typeof InstallTrigger !== 'undefined';
    },
    isIE: function () {
      return isIE;
    },
    isEdge: function () {
      !isIE && !!window.StyleMedia;
    },
    isSafari: function () {
      /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
    },
    isChrome: function () {
      return isChrome;
    },
    isBlink: function () {
      return (isChrome || isOpera) && !!window.CSS;
    },
    name: name
  }; 
});