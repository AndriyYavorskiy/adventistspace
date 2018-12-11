
angular.module('AMO').component('amoTheme', {
  templateUrl: './components/amoTheme/amoTheme.html',
  bindings: {},
  controllerAs: 'amoTheme',
  controller: ['$scope', '$element', '$document', '$window', function ($scope, $element, $document, $window) {
    var amoTheme = this;
    this.stones = [
      {text: 'Яспис', name: 'yaspis', id: '#b56249'},
      {text: 'Сапфир', name: 'sapfir', id: '#456af3'},
      {text: 'Халкидон', name: 'xalkidon', id: '#7195bb'},
      {text: 'Смарагд', name: 'smaragd', id: '#52a290'},
      {text: 'Сардоникс', name: 'sardonix', id: '#e8a055'},
      {text: 'Сердолик', name: 'cerdolik', id: '#e06565'},
      {text: 'Хризолит', name: 'xrizolit', id: '#84ab50'},
      {text: 'Вирилл', name: 'virill', id: '#54af70'},
      {text: 'Топаз', name: 'topaz', id: '#40b3d6'},
      {text: 'Хризопраз', name: 'xrizopraz', id: '#57b7a5'},
      {text: 'Гиацинт', name: 'giacint', id: '#bd6b52'},
      {text: 'Аметист', name: 'ametist', id: '#9182ce'}
    ];
    var themeName = ($window.localStorage.getItem('amo-theme') || 'xalkidon');
    $document[0].body.attributes['amo-theme'].value = themeName;
    this.currentTheme = this.stones.filter(function (item) {
      return item.name === themeName;
    });

    this.switchTheme = function (theme) {
      $window.localStorage.setItem('amo-theme', theme.name);
      $document[0].body.attributes['amo-theme'].value = theme.name;
      amoTheme.currentTheme = theme;
    }
  }]
});