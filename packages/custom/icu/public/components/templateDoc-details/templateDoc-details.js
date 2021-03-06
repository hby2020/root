'use strict';

angular.module('mean.icu.ui.templateDocdetails', []).controller('TemplateDocDetailsController', TemplateDocDetailsController);

function TemplateDocDetailsController($rootScope, $scope, $http, entity, tasks, folders, people, templateDocs, context, $state, TemplateDocsService, EntityService, PermissionsService, OfficeDocumentsService, $stateParams) {

  let currentState = $state.current.name;

  if (($state.$current.url.source.includes("search")) || ($state.$current.url.source.includes("templateDocs"))) {
    $scope.item = entity || context.entity;
  } else {
    $scope.item = context.entity || entity;
  }

  if (!$scope.item) {
    $state.go('main.templateDocs.byentity', {
      entity: context.entityName,
      entityId: context.entityId
    });
  } else if ($scope.item && ($state.current.name === 'main.templateDocs.all.details' || $state.current.name === 'main.search.templateDoc' || $state.current.name === 'main.templateDocs.byentity.details')) {
    $state.go('.' + window.config.defaultTab);
  }

  $scope.options = {
    theme: 'bootstrap',
    buttons: ['bold', 'italic', 'underline', 'anchor', 'quote', 'orderedlist', 'unorderedlist']
  };
  $scope.statuses = ['new', 'in-progress', 'canceled', 'done', 'archived'];

  $scope.entity = entity || context.entity;
  $scope.tasks = tasks.data || tasks;
  $scope.folders = folders.data || folders;
  $scope.items = templateDocs.data || templateDocs;

  $scope.people = people.data || people;

  // ==================================================== onChanges ==================================================== //

  var backupEntity = angular.copy($scope.item);

  $scope.onCategory = function(value) {
    var json = {
      name: 'office',
      newVal: value && value._id,
    };
    TemplateDocsService.updateTemplateDoc($scope.item._id, json)
    .then(result => {
      $state.reload();
    });
  };

  // ==================================================== Menu events ==================================================== //
    $scope.recycle = function() {
        EntityService.recycle('templateDocs', $scope.item._id).then(function() {
            $scope.item.recycled = new Date();
            let clonedEntity = angular.copy($scope.item);
            clonedEntity.status = "Recycled";
            refreshList();
            $state.go('^.^');
            $scope.isRecycled = $scope.item.hasOwnProperty('recycled');
            $scope.permsToSee();
            $scope.havePermissions();
            $scope.haveEditiorsPermissions();
        });
    };

    $scope.recycleRestore = function() {
        EntityService.recycleRestore('templateDocs', $scope.item._id).then(function() {
            let clonedEntity = angular.copy($scope.item);
            clonedEntity.status = "un-deleted"
            refreshList();
            $state.go('^.^');
          });
    }

    function refreshList() {
        $rootScope.$broadcast('refreshList');
    }

  $scope.menuItems = [{
    label: 'deleteTemplateDoc',
    fa: 'fa-times-circle',
    display: !$scope.item.hasOwnProperty('recycled'),
    action: $scope.recycle,
  },{
    label: 'unrecycleTemplateDoc',
    fa: 'fa-times-circle',
    display: $scope.item.hasOwnProperty('recycled'),
    action: $scope.recycleRestore
  }];

  // ==================================================== $watch: title / desc ==================================================== //

  $scope.$watch('item.title', function(nVal, oVal) {
    if (nVal !== oVal) {
      delayedUpdateTitle($scope.item, {
        name: 'title',
        oldVal: oVal,
        newVal: nVal,
        action: 'renamed'
      });
    }
  });

  $scope.$watch('item.description', function(nVal, oVal) {
    if (nVal !== oVal) {
      delayedUpdateDesc($scope.item, {
        name: 'description',
        oldVal: oVal,
        newVal: nVal,
        action: 'renamed'
      });
    }
  });

  $scope.updateTitle = function(item, newContext) {
    TemplateDocsService.updateTemplateDoc(item._id, newContext).then(() => {
      TemplateDocsService.createActivity({
        creator: $scope.me,
        entity: item._id,
        updateField: 'title',
        current: item.title,
        prev: backupEntity.title
      }).then(() => {
        backupEntity = angular.copy($scope.item);
        $state.reload();
      })
    });
  }

  $scope.updateDescription = function(item, newContext) {
    TemplateDocsService.updateTemplateDoc(item._id, newContext).then(() => {
      TemplateDocsService.createActivity({
        creator: $scope.me,
        entity: item._id,
        updateField: 'description',
        current: item.description,
        prev: backupEntity.description
      }).then(() => {
        backupEntity = angular.copy($scope.item);
        $state.reload();
      })
    });
  }

  var delayedUpdateTitle = _.debounce($scope.updateTitle, 2000);
  var delayedUpdateDesc = _.debounce($scope.updateDescription, 2000);

  // ==================================================== Update ==================================================== //

    $scope.view = function (document1) {
        if (document1.spPath) {
            var spSite = document1.spPath.substring(0, document1.spPath.indexOf('ICU') + 3);
            var uri = spSite + "/_layouts/15/WopiFrame.aspx?sourcedoc=" + document1.spPath + "&action=default";
            window.open(uri, '_blank');
        } else {
             console.log("PATH");
            var path = document1.path;
            path=path.substring(path.indexOf('/files'),path.length);
            console.log(path);
            path = path.replace(/\//g, '%2f');
            OfficeDocumentsService.getFileFtp(path).then(function (result) {
                if (result.status == 404) {
                    alertify.logPosition("top left");
                    alertify.error("הקובץ לא קיים!");
                }
            });
            // // Check if need to view as pdf
            // if (document1.templateType == "docx" || document1.templateType == "doc" || document1.templateType == "xlsx" || document1.templateType == "xls" || document1.templateType == "ppt" || document1.templateType == "pptx") {
            //     var arr = document1.path.split("." + document1.templateType);
            //     var ToHref = arr[0] + ".pdf";
            //     // Check if convert file exists allready
            //     $http({
            //         url: ToHref.replace('/files/', '/api/files/'),
            //         method: 'HEAD'
            //     }).success(function () {
            //         // There is allready the convert file
            //         window.open(ToHref + '?view=true');
            //     }).error(function () {
            //         // Send to server
            //         $.post('/templateDocsAppend.js', document1).done(function (document2) {
            //             // The convert is OK and now we open the pdf to the client in new window
            //             window.open(ToHref + '?view=true');
            //         }).fail(function (xhr) {
            //             console.error(xhr.responseText);
            //         });
            //     });
            // }
            // // Format is NOT needed to view as pdf
            // else {
            //         window.open(document1.path + '?view=true');
            //     }
        }
    };

  $scope.upload = function(file) {
    $scope.test = file;
    var data = {
      'id': $stateParams.id,
      'officeId': $stateParams.entityId
    };
    if (file.length > 0) {
      TemplateDocsService.uploadTemplate(data, file).then(function(result) {
        $scope.item.title = result.data.title;
        $scope.item.path = result.data.path;
        $scope.item.templateType = result.data.templateType;
        $scope.item.spPath = result.data.spPath;
      });
    }
  }


  // ==================================================== havePermissions ==================================================== //

  $scope.enableRecycled = true;
  $scope.havePermissions = function(type, enableRecycled) {
    enableRecycled = enableRecycled || !$scope.isRecycled;
    return (PermissionsService.havePermissions(entity, type) && enableRecycled);
  }

  $scope.haveEditiorsPermissions = function() {
    return PermissionsService.haveEditorsPerms($scope.entity);
  }

  $scope.permsToSee = function() {
    return PermissionsService.haveAnyPerms($scope.entity);
  }

}
