
angular.module('AMO').component('amoBibleLinks', {
  templateUrl: './components/amoBibleLinks/amoBibleLinks.html',
  bindings: {
    wrapperConfig: '<'
  },
  controllerAs: '$ctrl',
  controller: ['$element', 'amoLinksManager', '$timeout', '$rootScope', function ($element, amoLinksManager, $timeout, $rootScope) {
    var $ctrl = this,
      linkForm = $element[0].querySelector('.link-form'),
      folderForm = $element[0].querySelector('.folder-form');

    this.process = null;
    this.currentDirId = 'root';
    this.active = '';
    this.model;
    $rootScope.$on('[amoBibleLinks] LOCAL_LINKS_STORAGE_UPDATE', _applyLatestData);
    _refreshState();
    this.close = function () {
      $ctrl.wrapperConfig.dispatch({type: '[AMO_LINKS] CLOSE_LINKS_MASTRER'});
    }
    this.visitRef = function (ref) {
      $ctrl.wrapperConfig.dispatch({type: '[AMO_LINKS] OPEN_REFERENCE', payload: ref});
    }
    $timeout(function () {
      linkForm.link.value = $ctrl.wrapperConfig.candidateLink || '';
    });

    this.goToDir = function (dirId) {
      _setDir(dirId);
    }
    this.commitProcess = function (process) {
      _finalizeProcess(process, true);
    }
    this.discardProcess = function (process) {
      _finalizeProcess(process, false);
    }

    this.createFolder = function () {
      amoLinksManager.createFolder(folderForm.folder.value || 'Новая папка', $ctrl.currentDirId || $ctrl.currentDir.id);
      _refreshState();
    }
    this.goUpdateFolder = function (folder) {
      $ctrl.process = {
        folder: folder,
        type: 'update-folder',
        discardMessage: 'Отменить редактирование',
        message: 'Прежнее название папки: "' + folder.name + '"'};
      folderForm.folder.value = folder.name;
      folderForm.folder.focus();
    }
    this.goDeleteFolder = function (folder) {
      $ctrl.process = {
        folder: folder,
        type: 'delete-folder',
        discardMessage: 'Отменить',
        commitMessage: 'Подтвердить',
        message: 'Вы удаляете папку с названием: "' + folder.name + '"'};
    }

    this.saveLink = function () {
      if (!linkForm.link) {
        $ctrl.errors = '';
        return;
      }
      amoLinksManager.addOne({url: linkForm.link.value, name: linkForm.name.value}, $ctrl.currentDir.id);
      linkForm.reset();
      _refreshState();
    }
    this.updateFolder = function (folder) {
      var newName = folderForm.folder.value;

      amoLinksManager.renameFolder(folder.id, newName);
      $ctrl.process = null;
      folderForm.reset();
      _refreshState();
    }
    this.goUpdateLink = function (link, folder) {
      $ctrl.process = {
        link: link,
        folder: folder || null,
        type: 'update-link',
        discardMessage: 'Отменить редактирование',
        message: 'Прежнее название ссылки: "' + link.name + '"'};
      linkForm.link.value = link.url;
      linkForm.name.value = link.name;
      linkForm.name.focus();
    }
    this.updateLink = function (link, folder) {
      amoLinksManager.updateOne({url: linkForm.link.value, name: linkForm.name.value, id: link.id}, folder ? folder.id : null);
      $ctrl.process = null;
      linkForm.reset();
      _refreshState();
    }
    this.goDeleteLink = function (link) {
      $ctrl.process = {
        link: link,
        type: 'delete-link',
        discardMessage: 'Отменить',
        commitMessage: 'Подтвердить',
        message: 'Вы удаляете ссылку с названием: "' + link.name + '"'};
    }

    function _finalizeProcess (process, isConfirmed) {
      switch (process.type) {
        case ('delete-folder'):
        isConfirmed ? _deleteFolder(process.folder.id) : folderForm.reset();
          break;
        case ('delete-link'):
        isConfirmed ? _deleteLink(process.link) : linkForm.reset();
          break;
        default:
          console.log('[amoBibleLinks] ERROR - Unknown process type.');
      }
      $ctrl.process = null;
    }
    function _deleteFolder (folderId) {
      amoLinksManager.deleteFolder(folderId);
      _refreshState();
    }
    function _deleteLink (link) {
      amoLinksManager.deleteOne(link, $ctrl.currentDir.id);
      _refreshState();
    }
    function _refreshState () {
      $rootScope.$emit('[amoBibleLinks] LOCAL_LINKS_STORAGE_UPDATE');
    }
    function _applyLatestData() {
      $ctrl.model = amoLinksManager.getLinks();
      _setDir($ctrl.currentDirId);
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
