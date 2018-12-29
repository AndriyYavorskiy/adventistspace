
angular.module('AMO').component('amoLinks', {
  templateUrl: './components/amoLinks/amoLinks.html',
  bindings: {},
  controllerAs: 'amoLinks',
  controller: ['$document', '$window', 'amoLinksManager', function ($document, $window, amoLinksManager) {
    var $ctrl = this,
      form = $document[0].forms['new-link-form'];
    this.target = null;
    this.model = {
      root: [
        {
          name: 'Откровение о Христе',
          link: 'ru:rev:22:16'
        }
      ],
      folders: {
        ids: [1],
        items: {
          1: {
            name: '',
            links: [
              {
                name: '',
                link: ''
              }
            ],
            id: '',
            childOf: ''
          }
        }
      }
    };
    refreshState();

    this.saveLink = function () {
      var form = $document[0].forms['new-link-form'];
      if (!form.link) {
        $ctrl.errors = '';
        return;
      }
      amoLinksManager.addOne({link: form.link.value, name: form.name.value});
      form.reset();
      refreshState();
    }
    this.deleteLink = function (link, folder) {
      amoLinksManager.deleteOne(link);
      refreshState();
    }
    this.updateLink = function (link, folder) {
      var form = $document[0].forms['new-link-form'];
      amoLinksManager.updateOne({link: form.link.value, name: form.name.value, id: link.id}, folder ? folder.id : null);
      $ctrl.target = null;
      form.reset();
      refreshState();
    }
    this.goUpdateLink = function (link, folder) {
      var form = $document[0].forms['new-link-form'];
      $ctrl.target = {link: link, folder: folder || null};
      form.link.value = link.link;
      form.name.value = link.name;
      console.dir(form);
    }
    this.cancelUpdateLink = function () {
      var form = $document[0].forms['new-link-form'];
      $ctrl.target = null;
      form.reset();
    }
    function refreshState () {
      $ctrl.model = amoLinksManager.getLinks();
    }

  }]
});
