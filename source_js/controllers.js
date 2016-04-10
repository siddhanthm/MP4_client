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
  $scope.message = "";
  var urlselect = '?select={"name":1,"_id":1,"email":1}';
  var url = $window.sessionStorage.baseurl + "/users" + urlselect;
  $scope.getData = function(){  
    $http.get(url).success(function(data){
      $scope.users = data.data;
    });
  }
  $scope.getData();

  $scope.delete = function(x){
    console.log(x);
    $http.get($window.sessionStorage.baseurl + "/users/" + x).then(function(datas){
      tasks = datas.data.data.pendingTasks;
      console.log(tasks);
      if(tasks.length > 0){
        tasks.forEach(function(a){
          $http.get($window.sessionStorage.baseurl + "/tasks/" + a).success(function(data1){
            console.log(data1.data);
            var data2send = {"_id":data1.data._id, "completed": data1.data.completed,
                            "dateCreated": data1.data.dateCreated, "deadline":data1.data.deadline,
                            "description": data1.data.description, "name": data1.data.name};
           $http.put($window.sessionStorage.baseurl + "/tasks/" + a, data2send);
          });
        });
      }
    });
    $http.delete($window.sessionStorage.baseurl + "/users/" + x).success(function(data2){
      $scope.message = data2.message;
      $scope.getData();
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
          $scope.message = "User Already Exists";
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
        $scope.message = "User cannot be lookedup";
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
  $scope.deleteTask = function(x){
    //console.log(x);
    if(x.assignedUserName == "unassigned"){
      console.log("delete without prejudice", x._id);
      $http.delete($window.sessionStorage.baseurl + "/tasks/" + x._id).then(function(data){
        $scope.message = data.data.message;
        $scope.update();
      });
    }else{
      $http.get($window.sessionStorage.baseurl + '/tasks/'+ x._id).then(function(data){
        if(data.data.data.completed == false){
           var user2deleteid = data.data.data.assignedUser;
           $http.get($window.sessionStorage.baseurl + '/users/' + user2deleteid).then(function(data){
            var user2put = data.data.data;
            for(item in user2put.pendingTasks){
              if(user2put.pendingTasks[item] == x._id){
                user2put.pendingTasks.splice(item, 1);
              }
            }

            $http.put($window.sessionStorage.baseurl + '/users/' + user2deleteid, user2put).then(function(data2){
              console.log("changed data");
            });
          });
        }
        $http.delete($window.sessionStorage.baseurl + "/tasks/" + x._id).then(function(data){
          $scope.message = data.data.message;
          $scope.update();
        });
      });
    }
   
  }
}]);

mp4Controllers.controller('AddTask', ['$scope','$window','$http', function ($scope, $window, $http) {
  $scope.users = "";
  var urlselect = '';
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
    console.log($scope.tasks_under);
    //console.log("name", $scope.tasks_under.subsrt(0,$scope.tasks_under.find(":")));
    var description;
    if($scope.description == undefined){
      description = "";
    }else{
      description = $scope.description;
    }
    if($scope.tasks_under != undefined){
      var name = $scope.users[$scope.tasks_under].name;
      var id = $scope.users[$scope.tasks_under]._id;
      var data2send = {"completed":false,"name":$scope.name,"assignedUserName":name, "deadline":$scope.deadline
      , "description":description, "assignedUser":id};
    }else{
      var data2send = {"completed":false,"name":$scope.name,"deadline":$scope.deadline
      , "description":description};
    }
    //console.log(data2send);
    //var userpending = $scope.users[$scope.tasks_under].pendingTasks.push();
    var url2send = $window.sessionStorage.baseurl + "/tasks";
    $http.post(url2send, data2send).success(function(data){
      $scope.message = data.message;
      if($scope.tasks_under != undefined){
        var persontoedit = $scope.users[$scope.tasks_under];
        persontoedit.pendingTasks.push(data.data._id);
        $http.put(url + "/" + id, persontoedit);
      }
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
  $scope.refresh = false; 
  var url2;
  var url3;
  var url = $window.sessionStorage.baseurl + '/users?where={"_id":"' + $routeParams.userID +'"}';

  $scope.getData = function(){
    $http.get(url).success(function(data){
      $scope.user = data.data[0];

      url2 = $window.sessionStorage.baseurl + '/tasks?where={"assignedUser":"'+$scope.user._id+'","completed":false}';
      url3 =  $window.sessionStorage.baseurl + '/tasks?where={"assignedUser":"'+$scope.user._id+'","completed":true}';
      $http.get(url2).success(function(data2){
        $scope.intask = data2.data;
      });
      $http.get(url3).success(function(data3){
        $scope.comp = data3.data;
        console.log($scope.comp);
      }).error(function(){
        console.log("can't get completed task");
      });
    });
  }
  $scope.loadcomp = function(){
    $scope.compshow = $scope.comp;
    $scope.refresh = true; 
  };

  $scope.makeCompleted = function(x){
    x.completed = true;
    var url2put = $window.sessionStorage.baseurl + "/tasks/" + x._id;
    console.log(url2put);
    pendingtask = $scope.user.pendingTasks;

    var item;
    for(item in pendingtask){
      console.log("x._id", x._id);
      console.log("pendingtask[item]", pendingtask[item]);
      if(pendingtask[item] == x._id){
        console.log("inside for loop");
        pendingtask.splice(item, 1);
      }
    }
    console.log("after",pendingtask);
    $scope.user.pendingTasks = pendingtask;
    console.log("user", $scope.user);
    var data2send = $scope.user;


    $http.put(url2put,x).then(function(data){
      console.log(data);
      $http.put($window.sessionStorage.baseurl + "/users/"+ $routeParams.userID,data2send).then(function(data2){
        console.log("user updated", data2);
        $scope.getData();
      });
    });
   
    console.log("Reached here");
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
      //console.log("changed");
      var current = $scope.task.completed;
      data2put.completed = !($scope.task.completed);
      //console.log(data2put);
      $http.put(url, data2put).then(function(data){
        //console.log("returned data" , data);
        $scope.task = data.data.data;
        //console.log("Into task", $scope.task);
        data2put = data.data.data;
        var id = data.data.data.assignedUser;
        if(id !=""){
          $http.get($window.sessionStorage.baseurl + "/users/" + id).then(function(data){
            var userdata = data.data.data;
            //console.log("userdata",userdata);
            if(current == true){
              userdata.pendingTasks.push($routeParams.taskID);
              $http.put($window.sessionStorage.baseurl + "/users/" + id, userdata).then(function(data2){
                console.log(data2);
              });
            }else{
              for(item in userdata.pendingTasks){
                  if(userdata.pendingTasks[item] == $routeParams.taskID){
                      //console.log("inside for loop");
                      userdata.pendingTasks.splice(item, 1);
                  }
              }
              $http.put($window.sessionStorage.baseurl + "/users/" + id, userdata).then(function(data2){
                console.log(data2);
              });
            }
          });

        }
      }, function(data2){
        console.log("returned data error" , data2);
      });
    }
    $scope.getData();
}]);


mp4Controllers.controller('EditTaskCtrl', ['$scope','$routeParams','$http','$window', 
                          function ($scope,$routeParams, $http, $window){

    $scope.task = "";
    $scope.users = "";
    var originalname, originalcomplete, originalid;
    console.log($routeParams.taskID);
    var url =$window.sessionStorage.baseurl + '/tasks?where={"_id":"' + $routeParams.taskID+ '"}';
    $scope.getData = function(){
      $http.get(url).success(function(data){
        console.log(data.data[0]);
        $scope.task = data.data[0];
        $scope.users = "";
        $scope.name = $scope.task.name;
        $scope.id = $scope.task._id;
        originalid = $scope.task.assignedUser;
        $scope.description = $scope.task.description;
        $scope.deadline = $scope.task.deadline;
        originalname = $scope.task.assignedUserName;
        originalcomplete = data.data[0].completed;
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
    } 

    $scope.register = function(){
      var description2send, completed2send;
      if($scope.task_complete == 1){
        completed2send = true;
      }else{
        completed2send = false;
      }
      if($scope.description == undefined){
        description2send = "";
      }else{
        description2send = $scope.description;
      }
      if($scope.tasks_under != undefined){
        var name2send = $scope.users[$scope.tasks_under].name;
        var id2send = $scope.users[$scope.tasks_under]._id;
        var data2send = {"completed":completed2send,"name":$scope.name,"assignedUserName":name2send, "deadline":$scope.deadline
        , "description":description2send, "assignedUser":id2send};
      }else{
        var data2send = {"completed":completed2send,"name":$scope.name,"deadline":$scope.deadline
        , "description":description2send};
      }
      console.log(data2send);
      console.log("name",originalname);
      console.log("completed",originalcomplete);

      if(originalname != "unassigned"){
        if(originalcomplete == false){
          $http.get($window.sessionStorage.baseurl + "/users/" + originalid).then(function(data){
            var userdata2put = data.data.data;
            for(item in userdata2put.pendingTasks){
              if(userdata2put.pendingTasks[item] == $routeParams.taskID){
                userdata2put.pendingTasks.splice(item, 1);
              }
            }
            $http.put($window.sessionStorage.baseurl + "/users/" + originalid, userdata2put).then(function(data){
              console.log("REACHED HERE");
            });
          });
        }
      }
      if(name2send != undefined){
        if(completed2send == false){
            $http.get($window.sessionStorage.baseurl + "/users/" + id2send).then(function(data){
            var userdata2put = data.data.data;
            userdata2put.pendingTasks.push($routeParams.taskID);
            $http.put($window.sessionStorage.baseurl + "/users/" + id2send, userdata2put).then(function(data){
              console.log("REACHED HERE ALSO");
            });
          });
        }
      }

      $http.put($window.sessionStorage.baseurl + "/tasks/" + $routeParams.taskID, data2send).then(function(data){
        $scope.message = data.data.message;
      });
    }
    $scope.getData();
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