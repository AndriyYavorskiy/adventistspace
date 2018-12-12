
angular.module('AMO').component('amoTheme', {
  templateUrl: './components/amoTheme/amoTheme.html',
  bindings: {},
  controllerAs: 'amoTheme',
  controller: ['$document', '$window', function ($document, $window) {
    var amoTheme = this;
    var themeName = ($window.localStorage.getItem('amo-theme') || 'xalkidon');
    
    $document[0].body.attributes['amo-theme'].value = themeName;
    
    this.stones = [
      {text: 'Аметист', name: 'ametist', id: '#7c5ec5'},
      {text: 'Гиацинт', name: 'giacint', id: '#c36f66'},
      {text: 'Хризопраз', name: 'xrizopraz', id: '#57b7a5'},
      {text: 'Топаз', name: 'topaz', id: '#40b3d6'},
      {text: 'Вирилл', name: 'virill', id: '#54af70'},
      {text: 'Хризолит', name: 'xrizolit', id: '#84ab50'},
      {text: 'Сердолик', name: 'cerdolik', id: '#e06565'},
      {text: 'Сардоникс', name: 'sardonix', id: '#e6896d'},
      {text: 'Смарагд', name: 'smaragd', id: '#52a290'},
      {text: 'Халкидон', name: 'xalkidon', id: '#7195bb'},
      {text: 'Сапфир', name: 'sapfir', id: '#456af3'},
      {text: 'Яспис', name: 'yaspis', id: '#d25f53'}
    ];

    this.currentTheme = this.stones.filter(function (item) {
      return item.name === themeName;
    })[0];

    this.switchTheme = function (theme) {
      $window.localStorage.setItem('amo-theme', theme.name);
      $document[0].body.attributes['amo-theme'].value = theme.name;
      amoTheme.currentTheme = theme;
    }
  }]
});