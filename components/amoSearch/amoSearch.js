angular.module('AMO').component('amoSearch', {
  templateUrl: './components/amoSearch/amoSearch.html',
  controllerAs: 'amoSearch',
  controller: ['amoModal', function (amoModal) {
    $ctrl = this;

    this.openReader = function (ref) {
      amoModal.open({component: 'amo-reader', data: {reference: ref}});
    }
  }]
});