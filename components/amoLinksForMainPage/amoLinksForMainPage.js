
angular.module('AMO').component('amoLinksForMainPage', {
  templateUrl: './components/amoLinksForMainPage/amoLinksForMainPage.html',
  bindings: {},
  controllerAs: 'amoLinksForMainPage',
  controller: [function () {
    var $ctrl = this;
    $ctrl.config = {open: false};
  }]
});
