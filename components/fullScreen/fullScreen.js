angular.module('AS').component('fullScreen', {
  styles: './components/fullScreen/fullScreen.css',
  templateUrl: './components/fullScreen/fullScreen.html',
  controller: function ($scope, $element, $attrs) {
    this.model = $attrs.book;
    $element.requestFullScreen
  },
  controllerAs: 'fullScreen'
});