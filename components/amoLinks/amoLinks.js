
angular.module('AMO').component('amoLinks', {
  templateUrl: './components/amoLinks/amoLinks.html',
  bindings: {
    wrapperConfig: '<'
  },
  controllerAs: 'amoLinks',
  controller: ['$document', '$window', 'amoLinksManager', function ($document, $window, amoLinksManager) {
    var $ctrl = this;

    this.target = null;
    this.currentDirId = 'root';
    this.active = '';
    this.model;
    refreshState();
    this.close = function () {
      $ctrl.wrapperConfig.dispatch({type: '[AMO_LINKS] CLOSE_LINKS_MASTRER'});
    }
    this.visitRef = function (ref) {
      $ctrl.wrapperConfig.dispatch({type: '[AMO_LINKS] OPEN_RERERENCE', payload: ref});
    }
    setTimeout(function () {
      var form = $document[0].forms['link-form'];
      form.link.value = $ctrl.wrapperConfig.candidateLink || '';
    });

    // folders management
    this.createFolder = function () {
      var form = $document[0].forms['folder-form'];
      amoLinksManager.createFolder(form.folder.value || 'Новая папка', $ctrl.currentDirId || $ctrl.currentDir.id);
      refreshState();
    }
    this.updateFolder = function (folder) {
      var form = $document[0].forms['folder-form'],
      newName = form.folder.value;

      amoLinksManager.renameFolder(folder.id, newName);
      $ctrl.target = null;
      form.reset();
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
      amoLinksManager.addOne({link: form.link.value, name: form.name.value}, $ctrl.currentDir.id);
      form.reset();
      refreshState();
    }
    this.deleteLink = function (link, folder) {
      amoLinksManager.deleteOne(link, $ctrl.currentDir.id);
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
      $ctrl.target = {link: link, folder: folder || null, type: 'link'};
      form.link.value = link.link;
      form.name.value = link.name;
    }
    this.goUpdateFolder = function (folder) {
      var form = $document[0].forms['folder-form'];
      $ctrl.target = {folder: folder, type: 'folder'};
      form.folder.value = folder.name;
    }
    this.cancelUpdateProcess = function () {
      var form = $document[0].forms['link-form'];
      $ctrl.target = null;
      form.reset();
    }
    function refreshState () {
      $ctrl.model = amoLinksManager.getLinks();
      // $ctrl.currentDir = $ctrl.model.folders[$ctrl.currentDirId] || $ctrl.model.folders['root'];
      _setDir($ctrl.currentDirId);
    }
    this.setDir = function (dirId) {
      _setDir(dirId);
    }
    function _setDir (dirId) {
      var pointer;

      $ctrl.currentDirId = dirId || 'root';
      $ctrl.currentDir = $ctrl.model.folders[dirId] || $ctrl.model.folders['root'];
      pointer = $ctrl.model.folders[dirId]
      $ctrl.breadcrumbs = [pointer];
      var i = 0;
      while (pointer.id !== 'root' && i < 100) {
        i++;
        pointer = $ctrl.model.folders[pointer.childOf];
        $ctrl.breadcrumbs.unshift(pointer);
      }
    }

  }]
});
