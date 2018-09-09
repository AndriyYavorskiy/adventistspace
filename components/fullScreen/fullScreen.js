angular.module('AS').component('fullScreen', {
  styles: ['./components/fullScreen/fullScreen.css'],
  templateUrl: './components/fullScreen/fullScreen.html',
  bindings: {

  },
  controller: ['$scope', '$element', 'fullScreenAPI', function ($scope, $element, fullScreenAPI) {

    var html = document.querySelector('html'), self = this;

    this.model = angular.copy($scope.$parent.modalData.book);
    this.reference = $scope.$parent.modalData.reference;

    setTimeout(function () {
      var target = document.getElementById(self.reference);
      if (target) {
        target.classList.add('spotlight');
        scrollTo(self.reference);
      }
    }, 0);

    html.style.overflow = 'hidden';

    document.addEventListener(fullScreenAPI.fullscreenchangeEvent, escCallback);

    this.leaveFullScreen = function () {
      $scope.$destroy();
      angular.element($element).remove();
      html.style.overflow = '';
    }

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
    }
    
    function escCallback ( event ) {
      setTimeout(function () {
        if (!document[fullScreenAPI.fullscreenElement]) {
          $scope.$destroy();
          angular.element($element).remove();
          html.style.overflow = '';
          document.removeEventListener(fullScreenAPI.fullscreenchangeEvent, escCallback);
        }
      });
    }
  }],
  controllerAs: 'fullScreen'
});

angular.module('AS').factory('fullScreenAPI', ['browser', function (browser) {
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

angular.module('AS').factory('browser', function () {
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