angular.module('AMO')
.factory('amoLinksManager', ['$window', function ($window) {
  var manager = {};
  manager.addOne = function (link, folderId) {
    if (!link && !link.link) {return}
    link.id = new Date().valueOf();
    var freshModel = manager.getLinks();
    if (folderId) {

    } else {
      freshModel.root.unshift(link);
    }
    _setLinks(freshModel);
  };
  manager.deleteOne = function (link, folderId) {
    if (!link && !link.link) {return}
    var freshModel = manager.getLinks();
    if (folderId) {

    } else {
      freshModel.root = freshModel.root.filter(function (item) {
        return item.id !== link.id;;
      });
    }
    _setLinks(freshModel);
  }
  manager.updateOne = function (link, folderId) {
    if (!link && !link.link) {return}
    var freshModel = manager.getLinks();
    if (folderId) {

    } else {
      freshModel.root = freshModel.root.filter(function (item) {
        return item.id !== link.id;
      });
      freshModel.root.unshift(link);
    }
    _setLinks(freshModel);
  }
  manager.getLinks = function () {
    return _getLinks() || _getInitialModel();
  }
  manager.createFolder = function (name, childOf) {
    var newFolder = {name: name, id: new Date().valueOf(), links: [], childOf: childOf || 'root'},
      freshModel = manager.getLinks();
      freshModel.folders.items.push(newFolder);
      freshModel.folders.ids.push(newFolder.id);
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
    freshModel.folders.ids = freshModel.folders.ids.filter(function (item) {
      return item !== folderId;
    });
    _setLinks(freshModel);
  }

  return manager;

  function _setLinks (links) {
    $window.localStorage.setItem('amo-links', JSON.stringify(links));
  }
  function _getLinks () {
    return JSON.parse($window.localStorage.getItem('amo-links'));
  }
  function _getInitialModel () {
    return {
      "root": [],
      "folders": []
    };
  }
}]);