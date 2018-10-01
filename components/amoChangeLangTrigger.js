angular.module('AMO').component('amoChangeLangTrigger', {
  template: `
    <div class="amo-change-lang-trigger wrapper" ng-click="trigger.open()">{{'langSwitcher.x_lang' | translate}}<div>
    <style>
      .amo-change-lang-trigger.wrapper {
        background: #6383b5;
        border-radius: 0 0 2px 2px;
        color: #fff;
        cursor: pointer;
        opacity: .4;
        padding: 4px 8px;
        position: absolute;
        right: 36px;
        top: 0;
      }
      .amo-change-lang-trigger.wrapper:hover {
        box-shadow: 0 0 6px rgba(0,0,0, .05);
        opacity: 1;
      }
    </style>
  `,
  controllerAs: 'trigger',
  controller: ['amoModal', '$window', function (amoModal, $window) {
    this.getLang = function () {
      return $window.localStorage.getItem('amo-lang');
    }
    this.open = function () {
      amoModal.open({component: 'amo-lang-switcher'});
    }
  }]
});