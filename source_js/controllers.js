var mp4Controllers = angular.module('mp4Controllers', []);
var url = "http://www.uiucwp.com:4000/api";
mp4Controllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set: " + $scope.url;

  };

}]);

mp4Controllers.controller('UserController', ['$scope','$http','$window', function ($scope, $http, $window) {
  $scope.users = "";
  var urlselect = '?select={"name":1,"_id":1,"email":1}';
  var url = $window.sessionStorage.baseurl + "/users" + urlselect;
  $http.get(url).success(function(data){
    console.log(data);
    console.log(data.data);
    $scope.users = data.data;
  });
}]);

mp4Controllers.controller('AddUser', ['$scope', function ($scope) {
   $scope.register = function() {
    console.log($scope.user);
  };
}]);

mp4Controllers.controller('TasksCtrl', ['$scope','$http','$window', function ($scope, $http, $window) {
  $scope.tasks_orderby = "name";
  $scope.task_filter = "2";
  $scope.task_order = 1;
  var page_number = 0;
  var elementleft = 0;
  var urllast = "";
  var urlmid = "";
  var urlpage = '&skip='+(page_number*10)+'&limit=10';
  var urlselect = '&select={"_id":1,"assignedUserName":1,"deadline":1,"name":1}';
  var urlstart = $window.sessionStorage.baseurl +'/tasks?sort={"name":1}&where={"completed":false}' + urlselect + urlpage;
  console.log(urlstart);
  $http.get(urlstart).success(function(data2){
      $scope.tasks = data2.data;
      elementleft = data2.data.length;
  });

  $scope.pagination = function(x){
    if(x==1){
      if(elementleft == 10){
         page_number++;
      }  
    }else{
      if(page_number !=0){
        page_number--;
      }
    }
    $scope.update();
  }
  $scope.submit = function(){
    page_number = 0;
    $scope.update();
  }
  $scope.update = function(){
    if($scope.task_filter ==2){
      urllast = '&where={"completed":false}'
    }
    else if ($scope.task_filter == 1) {
      urllast = '&where={"completed":true}';
    }
    else{
      urllast = "";
    }
    urlpage = '&skip='+(page_number*10)+'&limit=10';
    urlmid = '/tasks?sort={"'+$scope.tasks_orderby+'":'+$scope.task_order+'}';
    var url_final = $window.sessionStorage.baseurl + urlmid + urllast + urlselect + urlpage;
    $http.get(url_final).success(function(data){
      $scope.tasks = data.data;
      elementleft = data.data.length;
    });
  }
}]);

mp4Controllers.controller('AddTask', ['$scope', function ($scope) {
  
}]);

mp4Controllers.controller('UserDetail', ['$scope','$routeParams','$http','$window', 
                          function ($scope,$routeParams, $http, $window) {
  console.log($routeParams.userID);
  $scope.user = "";
  $scope.intask = "";
  $scope.comp = "";
  $scope.compshow = "";
  var url2;
  var url3;
  var url = $window.sessionStorage.baseurl + '/users?where={"_id":"' + $routeParams.userID +'"}';
  $http.get(url).success(function(data){
    $scope.user = data.data[0];
    url2 = $window.sessionStorage.baseurl + '/tasks?where={"assignedUserName":"'+$scope.user.name+'","completed":false}';
    url3 =  $window.sessionStorage.baseurl + '/tasks?where={"assignedUserName":"'+$scope.user.name+'","completed":true}';
    $http.get(url2).success(function(data2){
      $scope.intask = data2.data;
    });
    $http.get(url3).success(function(data3){
      $scope.comp = data3.data;
      console.log($scope.comp);
    });

  });

  $scope.loadcomp = function(){
    $scope.compshow = $scope.comp;
  };

}]);
/*
mp4Controllers.controller('FirstController', ['$scope', 'CommonData'  , function($scope, CommonData) {
  $scope.data = "";
   $scope.displayText = ""

  $scope.setData = function(){
    CommonData.setData($scope.data);
    $scope.displayText = "Data set"

  };

}]);

mp4Controllers.controller('SecondController', ['$scope', 'CommonData' , function($scope, CommonData) {
  $scope.data = "";

  $scope.getData = function(){
    $scope.data = CommonData.getData();

  };

}]);


mp4Controllers.controller('LlamaListController', ['$scope', '$http', 'Llamas', '$window' , function($scope, $http,  Llamas, $window) {

  Llamas.get().success(function(data){
    $scope.llamas = data;
  });


}]);
*/