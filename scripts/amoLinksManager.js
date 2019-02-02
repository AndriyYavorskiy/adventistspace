angular.module('AMO')
.factory('amoLinksManager', ['$window', function ($window) {
  var manager = {};
  manager.addOne = function (link, folderId) {
    if (!link && !link.url) {return}
    link.id = new Date().valueOf();
    var freshModel = manager.getLinks();
    freshModel.folders[folderId || 'root'].links.unshift(link);
    _setLinks(freshModel);
  };
  manager.deleteOne = function (link, folderId) {
    if (!link && !link.url) {return}
    var freshModel = manager.getLinks(),
      targetFolder = freshModel.folders[folderId || 'root'];

    targetFolder.links = targetFolder.links.filter(function (item) {
      return item.id !== link.id;
    });
    _setLinks(freshModel);
  }
  manager.updateOne = function (link, folderId) {
    if (!link && !link.url) {return}
    var freshModel = manager.getLinks(),
    targetFolder = freshModel.folders[folderId || 'root'];
    targetFolder.links = targetFolder.links.filter(function (item) {
      return item.id !== link.id;
    });
    targetFolder.links.unshift(link);
    _setLinks(freshModel);
  }
  manager.getLinks = function () {
    return _getLinks() || _getInitialModel();
  }

  // folders management
  manager.createFolder = function (name, childOf) {
    var newFolder = {name: name, id: new Date().valueOf(), links: [], childOf: childOf || 'root'},
      freshModel = manager.getLinks();
      freshModel.folders[newFolder.id] = newFolder;
      freshModel.ids.push(newFolder.id);
      _setLinks(freshModel);
  }
  manager.renameFolder = function (folderId, folderName) {
    var freshModel = manager.getLinks();
    freshModel.folders[folderId].name = folderName;
    _setLinks(freshModel);
  }
  manager.deleteFolder = function (folderId) {
    var freshModel = manager.getLinks();
    delete freshModel.folders[folderId];
    freshModel.ids = freshModel.ids.filter(function (item) {
      return item !== folderId;
    });
    _setLinks(freshModel);
  }

  _modelRevision();
  return manager;

  function _modelRevision () {
    var freshModel = manager.getLinks() || _getInitialModel();

    freshModel = freshModel || {
      ids: ['root'],
      folders: {
        'root': {
          links: [],
          id: 'root'
        }
      }
    };
    freshModel.ids = freshModel.ids || [];
    freshModel.folders = freshModel.folders || {
      'root': {
        links: [],
        id: 'root'
      }
    };
    freshModel.folders.root = freshModel.folders.root || {
      links: [],
      id: 'root'
    };
    freshModel.folders.root.links = freshModel.folders.root.links || [];
    freshModel.folders.root.id = freshModel.folders.root.id || 'root';
    _setLinks(freshModel);
  }

  function _setLinks (links) {
    $window.localStorage.setItem('amo-links', JSON.stringify(links));
  }
  function _getLinks () {
    return JSON.parse($window.localStorage.getItem('amo-links'));
  }
  function _getInitialModel () {
    return {
      ids: ['root'],
      folders: {
        'root': {
          links: [],
          id: 'root'
        }
      }
    };
  }
}]);