angular.module('AMO').directive('amoDevice', ['$window', '$document', function ($window, $document) {
  return {
    restrict: 'A',
    link: function (s, e, a) {
      $window.addEventListener('resize', setDevice);
      function setDevice () {
        if ($window.innerWidth < 480) {
          switchDeviceType('mobile');
        }
        if ($window.innerWidth > 480) {
          switchDeviceType('tablet');
        }
        if ($window.innerWidth > 960) {
          switchDeviceType('desktop');
        }
      }

      function switchDeviceType (deviceType) {
        a.amoDevice = deviceType;
        $document[0].body.attributes['amo-device'].value = deviceType;
      }
    }
  }
}]);