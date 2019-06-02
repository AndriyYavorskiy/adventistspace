
angular.module('AMO').component('amoLinksForMainPage', {
  templateUrl: './components/amoLinksForMainPage/amoLinksForMainPage.html',
  bindings: {},
  controllerAs: 'amoLinksForMainPage',
  controller: ['amoModal', function (amoModal) {
    var $ctrl = this;
    $ctrl.config = {open: false, dispatch: function (action) {
      switch(action.type) {
        case ('[AMO_LINKS] OPEN_REFERENCE'): 
          this.open = false;
          amoModal.open({component: 'amo-reader', data: {reference: action.payload}});
          break;
        case ('[AMO_LINKS] CLOSE_LINKS_MASTRER'):
          this.open = false;
          break;
        default: 
          console.warn('[AMO_LINKS] Unknown actiontype: ' + action.type);
      }
    }};
  }]
});
