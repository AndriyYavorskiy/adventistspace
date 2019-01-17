
angular.module('AMO').component('amoLinks', {
  templateUrl: './components/amoLinks/amoLinks.html',
  bindings: {
    wrapperConfig: '<'
  },
  controllerAs: 'amoLinks',
  controller: ['$document', 'amoLinksManager', '$timeout', function ($document, amoLinksManager, $timeout) {
    var $ctrl = this;

    this.process = null;
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
    $timeout(function () {
      var form = $document[0].forms['link-form'],
        candidate = $ctrl.wrapperConfig.candidateLink;
      form.link.value = candidate || '';
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
      $ctrl.process = null;
      form.reset();
      refreshState();
    }
    this.goDeleteLink = function (link) {
      $ctrl.process = {
        link: link,
        type: 'delete-link',
        discardMessage: 'Отменить',
        commitMessage: 'Подтвердить',
        message: 'Вы удаляете ссылку с названием: "' + link.name + '"'};
    }
    this.goDeleteFolder = function (folder) {
      $ctrl.process = {
        folder: folder,
        type: 'delete-folder',
        discardMessage: 'Отменить',
        commitMessage: 'Подтвердить',
        message: 'Вы удаляете папку с названием: "' + folder.name + '"'};
    }
    this.commitProcess = function (process) {
      switch (process.type) {
        case ('delete-folder'): 
          _deleteFolder(process.folder.id);
          break;
        case ('delete-link'): 
          _deleteLink(process.link);
          break;
        default:
          console.log('[amoLinks] Unknown process type.');
      }
      $ctrl.process = null;
    }
    function _deleteFolder (folderId) {
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
    function _deleteLink (link) {
      amoLinksManager.deleteOne(link, $ctrl.currentDir.id);
      refreshState();
    }
    this.updateLink = function (link, folder) {
      var form = $document[0].forms['link-form'];
      amoLinksManager.updateOne({link: form.link.value, name: form.name.value, id: link.id}, folder ? folder.id : null);
      $ctrl.process = null;
      form.reset();
      refreshState();
    }
    this.goUpdateLink = function (link, folder) {
      var form = $document[0].forms['link-form'];
      $ctrl.process = {
        link: link,
        folder: folder || null,
        type: 'update-link',
        discardMessage: 'Отменить редактирование',
        message: 'Прежнее название ссылки: "' + link.name + '"'};
      form.link.value = link.link;
      form.name.value = link.name;
      form.name.focus();
    }
    this.goUpdateFolder = function (folder) {
      var form = $document[0].forms['folder-form'];
      $ctrl.process = {
        folder: folder,
        type: 'update-folder',
        discardMessage: 'Отменить редактирование',
        message: 'Прежнее название папки: "' + folder.name + '"'};
      form.folder.value = folder.name;
      form.folder.focus();
    }
    this.discardProcess = function () {
      $ctrl.process = null;
      $document[0].forms['link-form'].reset();
      $document[0].forms['folder-form'].reset();
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
