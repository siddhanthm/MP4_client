var mp4Controllers = angular.module('mp4Controllers', ['720kb.datepicker']);
var url = "http://www.uiucwp.com:4000/api";
mp4Controllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set: " + $scope.url;

  };

}]);

mp4Controllers.controller('UserController', ['$scope','$http','$window','$location', function ($scope, $http, $window, $location) {
  $scope.users = "";
  var urlselect = '?select={"name":1,"_id":1,"email":1}';
  var url = $window.sessionStorage.baseurl + "/users" + urlselect;
  $http.get(url).success(function(data){
    $scope.users = data.data;
  });

  $scope.delete = function(x){
    console.log(x);
    var deleteurl = $window.sessionStorage.baseurl + '/users/' + x;
    console.log(deleteurl);
    $http.delete(deleteurl).success(function(data){
      console.log(data);
      $http.get(url).success(function(data){
        $scope.users = data.data;
      });
    });
  }
}]);

mp4Controllers.controller('AddUser', ['$scope','$http','$window', function ($scope, $http, $window) {
  $scope.message = "";
  $scope.register = function() {
    if($scope.name == undefined || $scope.email == undefined){
      $scope.message = "Name or Email not filled.";
    }else{
      var url = $window.sessionStorage.baseurl + '/users?where={"email":"' + $scope.email +'"}';
      $http.get(url).success(function(data,status){
        if(data.data.length == 1){
          $scope.message = "User Already Exist";
        }else{
          var data2send = {"name":$scope.name, "email":$scope.email};
          var urlpost = $window.sessionStorage.baseurl + "/users";
          $http.post(urlpost, data2send).success(function(data){
            $scope.message = data.message;
          }).error(function(data){
            $scope.message = data.message;
          });
        }
      }).error(function(data,status,header, config){
        console.log(data);
        console.log(status);
        console.log(config);
      });
    }
  }
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

mp4Controllers.controller('AddTask', ['$scope','$window','$http', function ($scope, $window, $http) {
  $scope.users = "";
  var urlselect = '?select={"name":1,"_id":1}';
  var url = $window.sessionStorage.baseurl + "/users" + urlselect;
  $http.get(url).success(function(data){
    console.log(data);
    $scope.users = data.data;
  }).error(function(data,status,header, config){
    console.log(data);
    console.log(status);
    console.log(config);
  });



  $scope.register = function(){
    var data2send = {"completed":false,"name":$scope.name,"assignedUserName":$scope.tasks_under, "deadline":$scope.deadline
    , "description":$scope.description};
    console.log(data2send);
    var url2send = $window.sessionStorage.baseurl + "/tasks";
    $http.post(url2send, data2send).success(function(data){
      $scope.message = data.message;
    }).error(function(data){
      $scope.message = data.message;
    });

  }

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

  $scope.getData = function(){
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
  }
  $scope.loadcomp = function(){
    $scope.compshow = $scope.comp;
  };

  $scope.makeCompleted = function(x){
    x.completed = true;
    var url2put = $window.sessionStorage.baseurl + "/tasks/" + $routeParams.userID;
    console.log(url2put);
    $http.put(url2put,x).success(function(data){
      console.log(data);
    });
    $scope.getData();
    //console.log("after", x);
  }
  $scope.getData();

}]);

mp4Controllers.controller('TaskdetailCtrl', ['$scope','$routeParams','$http','$window', 
                          function ($scope,$routeParams, $http, $window){

    $scope.task = "";
    console.log($routeParams.taskID);
    var url =$window.sessionStorage.baseurl + '/tasks/' + $routeParams.taskID;
    console.log(url);
    

    $scope.getData = function(){
      $http.get(url).success(function(data){
        console.log(data.data);
        $scope.task = data.data;
        data2put = data.data;
      }).error(function(data){
        console.log(data);
      });
    }
    $scope.changeStatus = function(){
      console.log("changed");
      data2put.completed = !($scope.task.completed);
      console.log(data2put);
      $http.put(url, data2put).success(function(data){
        console.log("returned data" , data);
        $scope.task = data.data;
        data2put = data.data;
      }).error(function(data){
        console.log("returned data error" , data);
      });
    }
    $scope.getData();
}]);


mp4Controllers.controller('EditTaskCtrl', ['$scope','$routeParams','$http','$window', 
                          function ($scope,$routeParams, $http, $window){

    $scope.task = "";
    $scope.users = "";
    console.log($routeParams.taskID);
    var url =$window.sessionStorage.baseurl + '/tasks?where={"_id":"' + $routeParams.taskID+ '"}';
    $http.get(url).success(function(data){
      console.log(data.data[0]);
      $scope.task = data.data[0];
      $scope.users = "";
      $scope.name = data.data[0].name;
      $scope.description = data.data[0].description;
      $scope.deadline = data.data[0].deadline;
      if(data.data[0].completed ==true){
        $scope.task_complete = 1;
      }else{
        $scope.task_complete = -1;
      }
      var urlselect = '?select={"name":1,"_id":1}';
      var url = $window.sessionStorage.baseurl + "/users" + urlselect;
        $http.get(url).success(function(data2){
          console.log(data2);
          $scope.users = data2.data;
        }).error(function(data2,status,header, config){
          console.log(data2);
          console.log(status);
          console.log(config);
        });
    }).error(function(data){
      console.log(data);
    });

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