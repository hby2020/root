'use strict';

function TaskListController($scope, $timeout, $state, tasks, DiscussionsService, TasksService, ProjectsService, context, $stateParams, EntityService, MultipleSelectService) {

    $scope.items = tasks.data || tasks;

    var subTasks = [];
    $scope.items.forEach(function (item) {
        if (item.subTasks && item.subTasks.length > 0) {
            return subTasks = subTasks.concat(item.subTasks.filter(function (subTask) {
                return subTask !== 'undefined';
            }));
        }
    });

    subTasks && subTasks.forEach(function (item) {
        $scope.items.push(item);
    });

    $scope.loadNext = tasks.next;
    $scope.loadPrev = tasks.prev;

    $scope.entityName = 'tasks';
    $scope.entityRowTpl = '/icu/components/task-list/task-row.html';

    var creatingStatuses = {
        NotCreated: 0,
        Creating: 1,
        Created: 2
    };

    $scope.update = function(item) {
        return TasksService.update(item);
    }

    $scope.create = function(item) {
        var newItem = {
            title: '',
            watchers: [],
            tags: [],
            __state: creatingStatuses.NotCreated,
            __autocomplete: false
        };
        return TasksService.create(newItem).then(function(result) {
            $scope.items.push(result);
            TasksService.data.push(result);
            return result;
        });
    };

    $scope.refreshSelected = function (entity) {
        MultipleSelectService.refreshSelectedList(entity);
        $scope.$broadcast('refreshList', {})
    };

    $scope.$on('changeCornerState', function(event, cornerState){
        setAllSelected(cornerState === 'all')
    });

    function setAllSelected(status){
        for(let i = 0; i < $scope.items.length; i++){
            $scope.items[i].selected = status;
        }
    }

    $scope.loadMore = function(start, LIMIT, sort) {
        if (!$scope.isLoading && $scope.loadNext) {
            $scope.isLoading = true;
            $scope.loadNext().then(function(items) {

                _(items.data).each(function(p) {
                    p.__state = creatingStatuses.Created;
                });

                var offset = $scope.displayOnly ? 0 : 1;

                if (items.data.length) {
                    var index = $scope.items.length - offset;
                    var args = [index, 0].concat(items.data);

                    [].splice.apply($scope.items, args);
                }

                $scope.loadNext = items.next;
                $scope.loadPrev = items.prev;
                $scope.isLoading = false;
            });
        }
    }

    $scope.excel = function() {
        TasksService.excel();
        var me;
        UsersService.getMe().then(function(me1) {
            me = me1;
            window.open(window.origin + '/api/Excelfiles/notes/' + me.id + 'Tasks.xlsx');
        });
    }

    $scope.getFilter = function() {
        var a = TasksService.filterValue;
        switch (a) {
        case 'today':
            return 'tasksDueToday';
        case 'week':
            return 'tasksDueThisWeek';
        case 'watched':
            return 'watchedTasks';
        case 'overdue':
            return 'overdueTasks';
        default:
            return ''
        }
    }

    function init() {
        if (context.entity) {
            if (!context.entity.parent) {
                if (context.entity.project) {
                    $scope.parentState = 'byentity';
                    $scope.parentEntity = 'project';
                    $scope.parentEntityId = context.entity.project._id;
                    $scope.parentId = context.entity.id;
                } else if (context.entity.discussions) {
                    $scope.parentState = 'byentity';
                    $scope.parentEntity = 'discussion';
                    if (context.entity.discussions[0])
                        $scope.parentEntityId = context.entity.discussions[0]._id;
                    $scope.parentId = context.entity.id;
                }
            }
            if (context.entityName === 'project') {
                ProjectsService.selected = context.entity;
            } else if (context.entityName === 'discussion') {
                $scope.discussionContext = context.entity;
                $scope.firstStr = '';
                $scope.secondStr = '';
                if ($scope.discussionContext.startDate) {
                    $scope.discussionContext.startDate = new Date($scope.discussionContext.startDate);
                    var startStr = $scope.discussionContext.startDate.getDate() + "/" + ($scope.discussionContext.startDate.getMonth() + 1) + "/" + $scope.discussionContext.startDate.getFullYear();
                    $scope.firstStr = startStr;
                }
                if ($scope.discussionContext.allDay) {
                    $scope.secondStr = "All day long";
                } else {
                    if ($scope.discussionContext.startTime) {
                        $scope.discussionContext.startTime = new Date($scope.discussionContext.startTime);
                        var ho = $scope.discussionContext.startTime.getHours().toString().length == 1 ? "0" + $scope.discussionContext.startTime.getHours().toString() : $scope.discussionContext.startTime.getHours().toString();
                        var min = $scope.discussionContext.startTime.getMinutes().toString().length == 1 ? "0" + $scope.discussionContext.startTime.getMinutes().toString() : $scope.discussionContext.startTime.getMinutes().toString();
                        startStr = ho + ":" + min;
                        $scope.firstStr = $scope.discussionContext.startDate ? $scope.firstStr + " " + startStr : '';
                    }
                    if ($scope.discussionContext.endDate) {
                        $scope.discussionContext.endDate = new Date($scope.discussionContext.endDate);
                        if ($scope.firstStr != 'deadline') {
                            $scope.firstStr = $scope.firstStr;
                        } else {
                            $scope.firstStr = "";
                        }
                        var endStr = $scope.discussionContext.endDate.getDate() + "/" + ($scope.discussionContext.endDate.getMonth() + 1) + "/" + $scope.discussionContext.endDate.getFullYear();
                        $scope.secondStr = endStr;
                        if ($scope.discussionContext.endTime) {
                            $scope.discussionContext.endTime = new Date($scope.discussionContext.endTime);
                            var ho = $scope.discussionContext.endTime.getHours().toString().length == 1 ? "0" + $scope.discussionContext.endTime.getHours().toString() : $scope.discussionContext.endTime.getHours().toString();
                            var min = $scope.discussionContext.endTime.getMinutes().toString().length == 1 ? "0" + $scope.discussionContext.endTime.getMinutes().toString() : $scope.discussionContext.endTime.getMinutes().toString();
                            endStr = ho + ":" + min;
                            $scope.secondStr = $scope.secondStr + " " + endStr;
                        }
                    }
                }

            }
        } else {
            $scope.parentState = 'byparent';
            $scope.parentEntity = 'task';
            if (context.entity) {
                $scope.parentEntityId = context.entity.parent;
                $scope.parentId = context.entity.id;
            }
        }
    }

    init();

    $scope.getProjName = function() {
        var entityType = $scope.currentContext.entityName;
        if ($scope.currentContext != undefined && $scope.currentContext.entity != undefined && $scope.currentContext.entity.title != undefined) {
            return $scope.currentContext.entity.title;
        } else if ($scope.currentContext != undefined && $scope.currentContext.entity != undefined && $scope.currentContext.entity.name != undefined) {
            return $scope.currentContext.entity.name;
        } else {
            if (entityType == "discussion" && DiscussionsService.currentDiscussionName != undefined) {
                return DiscussionsService.currentDiscussionName;
            } else if (ProjectsService.currentProjectName != undefined) {
                return ProjectsService.currentProjectName;
            } else {
                var tasks = $scope.tasks;
                if (tasks.length == 1) {
                    $state.go('401');
                    return "you dont have permission";
                } else if (tasks.length) {
                    var task = tasks[0];
                    var result;
                    if (task.project != undefined) {
                        result = task.project.title
                    } else if (task.discussions != undefined && task.discussions.title != undefined) {
                        result = task.discussions[0].title;
                    } else {
                        result = "you dont have permission";
                    }
                    return result;
                }
            }

        }
    };

    $scope.subEntity = $scope.getProjName();

}

angular.module('mean.icu.ui.tasklist', []).controller('TaskListController', TaskListController);
