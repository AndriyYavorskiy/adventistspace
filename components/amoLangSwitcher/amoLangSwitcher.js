angular.module('AMO').component('amoLangSwitcher', {
  controllerAs: 'langSwitcher',
  template: `
    <div class="lang-switcher backdrop">
      <div class="wrapper">
        <div class="head clearfix">
          <span class="inherit color" ng-bind="'langSwitcher.select_lang' | translate"></span>
          <button class="btn s blank close go-right" ng-click="langSwitcher.closeModal()">✖</button>
        </div>
        <div class="body">
          <div ng-dblclick="langSwitcher.switchLang(lang); langSwitcher.closeModal()" class="lang" ng-class="{ active: langSwitcher.currentLang === lang }" ng-repeat="lang in langSwitcher.langs"
            ng-click="langSwitcher.switchLang(lang)" ng-bind="::lang.description"></div>
        </div>
      </div>
    </div>
    <style>
      .lang-switcher.backdrop {
        background: rgba(224, 220, 197, 0.75);
        display: flex;
        height: 100%;
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 2;
      }
      .lang-switcher .wrapper {
        margin: auto;
        width: 250px;
      }
      .lang-switcher .wrapper:hover {
        box-shadow: 0 0 6px rgba(0,0,0, .05);
      }
      .head {
        border-radius: 3px 3px 0 0;
        color: #fff;
      }
      .close {
        color: #fff;
        margin: -3px;
        opacity: 0.4;
      }
      .close:hover {
        opacity: 1;
      }
      .head, .body {
        padding: 8px;
      }
      .body {
        background: #fff;
        border-radius: 0 0 3px 3px;
      }
      .lang {
        cursor: pointer;
        padding: 8px;
      }
      .lang:hover {
        background: #eee;
      }
      .lang.active {
        color: #fff;
      }
    </style>
  `,
  bindings: {
    closeModal: '<'
  },
  controller: ['$translate', '$window', function ($translate, $window) {
    var switcher = this;
    this.langs = [
      // {code: 'pl', description: 'Język polski'},
      // {code: 'it', description: 'Lingua italiana'},
      {code: 'en', description: 'English language'},
      {code: 'ru', description: 'Русский язык'},
      {code: 'ua', description: 'Українська мова'}];
    this.currentLang = this.langs.find(function (lang) {
      return lang.code === ($window.localStorage.getItem('amo-lang') || 'en');
    });
    this.switchLang = function (lang) {
      $translate.use(lang.code);
      $window.localStorage.setItem('amo-lang', lang.code);
      switcher.currentLang = lang;
    }
  }]
});

