var app = angular.module('mp4', ['ngRoute', 'mp4Controllers', 'mp4Services']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/settings', {
    templateUrl: './partials/settings.html',
    controller: 'SettingsController'
  }).
  when('/user', {
    templateUrl: './partials/users.html',
    controller: 'UserController'
  }).
  when('/tasks/', {
    templateUrl: './partials/tasks.html',
    controller: 'TasksCtrl'
  }).when('/adduser', {
    templateUrl: './partials/adduser.html',
    controller: 'AddUser'
  }).when('/addtask', {
    templateUrl: './partials/addtask.html',
    controller: 'AddTask'
  }).when('/user/:userID', {
    templateUrl: './partials/userdetail.html',
    controller: 'UserDetail'
  }).when('/task/:taskID', {
    templateUrl: './partials/taskdetail.html',
    controller: 'TaskdetailCtrl'
  }).when('/edit/:taskID', {
    templateUrl: './partials/edittask.html',
    controller: 'EditTaskCtrl'
  }).
  otherwise({
    redirectTo: '/settings'
  });
}]);

/*
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/firstview', {
    templateUrl: 'partials/firstview.html',
    controller: 'FirstController'
  }).
  when('/secondview', {
    templateUrl: 'partials/secondview.html',
    controller: 'SecondController'
  }).
  when('/settings', {
    templateUrl: 'partials/settings.html',
    controller: 'SettingsController'
  }).
  when('/llamalist', {
    templateUrl: 'partials/llamalist.html',
    controller: 'LlamaListController'
  }).when('/user', {
    templateUrl: 'partials/users.html',
    controller: ''
  }).when('/tasks', {
    templateUrl: 'route.html',
    controller: 'RouteCtrl'
  }).
  otherwise({
    redirectTo: '/settings'
  });
}]);


*/