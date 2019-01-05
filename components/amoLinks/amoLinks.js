
angular.module('AMO').component('amoLinks', {
  templateUrl: './components/amoLinks/amoLinks.html',
  bindings: {
    wrapperConfig: '<'
  },
  controllerAs: 'amoLinks',
  controller: ['$document', '$window', 'amoLinksManager', function ($document, $window, amoLinksManager) {
    var $ctrl = this,
      form = $document[0].forms['link-form'];
    this.target = null;
    this.currentDirId = 'root';
    this.model = {
      root: [
        {
          name: 'Откровение о Христе',
          link: 'ru:rev:22:16',
          id: '1546711123388'
        }
      ],
      folders: {
        ids: [1546711136829],
        items: {
          1546711136829: {
            name: '',
            links: [
              {
                name: '',
                link: ''
              }
            ],
            id: '1546711136829',
            childOf: 'root'
          }
        }
      }
    };
    refreshState();
    this.close = function () {
      $ctrl.wrapperConfig.open = false;
    }
    setTimeout(function () {
      var form = $document[0].forms['link-form'];
      form.link.value = $ctrl.wrapperConfig.candidateLink || '';
      console.log($ctrl.wrapperConfig);
    });

    // folders management
    this.createFolder = function () {
      var form = $document[0].forms['folder-form'];
      amoLinksManager.createFolder(form.folder.value, $ctrl.currentDirId || $ctrl.currentDir.id);
      refreshState();
    }
    this.deleteFolder = function (folderId) {
      amoLinksManager.deleteFolder(folderId);
      refreshState();
    }

    // links mangement
    this.saveLink = function () {
      var form = $document[0].forms['link-form'];
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
      var form = $document[0].forms['link-form'];
      amoLinksManager.updateOne({link: form.link.value, name: form.name.value, id: link.id}, folder ? folder.id : null);
      $ctrl.target = null;
      form.reset();
      refreshState();
    }
    this.goUpdateLink = function (link, folder) {
      var form = $document[0].forms['link-form'];
      $ctrl.target = {link: link, folder: folder || null};
      form.link.value = link.link;
      form.name.value = link.name;
    }
    this.cancelUpdateLink = function () {
      var form = $document[0].forms['link-form'];
      $ctrl.target = null;
      form.reset();
    }
    function refreshState () {
      $ctrl.model = amoLinksManager.getLinks();
      $ctrl.currentDir = $ctrl.model.folders[$ctrl.currentDirId] || $ctrl.model.folders['root'];
    }
    this.setDir = function (dirId) {
      $ctrl.currentDirId = dirId;
      $ctrl.currentDir = $ctrl.model.folders[dirId];
    }

  }]
});
