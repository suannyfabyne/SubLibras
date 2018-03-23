var myApp = angular.module('myApp',[])

.controller('MyCtrl', ['$scope','$http', '$rootScope', function($scope, $http, $rootScope) {


     //This method will call your server, with the GET method and the url /show


      var showRequests = function (){
      $http.get("http://localhost:3000/requests/translationRequest").then(function(success) {
      //console.log(success.data);

      if(success.data.length>0)
      {
         $scope.requests=success.data;
      }

    })};

    showRequests();


      var myfunc = function (){
      $http.get("http://localhost:3000/requests/clients").then(function(success) {
      $scope.clients = success.data[0];
      
      })};
      myfunc();


      $scope.idSelectedVote = null;

      $scope.setSelected = function (idSelectedVote) {
         $scope.idSelectedVote = idSelectedVote;
         localStorage.id = idSelectedVote;

      };

      $scope.idSelectedSentence = null;

      $scope.setSentence = function (idSelectedSentence, operator) {
         $scope.idSelectedSentence = idSelectedSentence;
         localStorage.idSentence = idSelectedSentence;
         localStorage.operator = operator;
         console.log(localStorage.idSentence);
         console.log(localStorage.operator + ' operator value');

          $http.get('http://localhost:3000/requests/reviewtablea/'+ localStorage.id + '/' + localStorage.idSentence).then(function(success) {
            if(success.data.length>0) {
              console.log(success.data[success.data.length-1].operator + 'AAAaa');
              localStorage.maxop = success.data[success.data.length-1].operator;
            }
         })


      };



    $scope.getId = function() {
      return localStorage.id
    }

    $scope.getOperator = function() {
      return localStorage.operator
    }

    $scope.getIdSentence = function() {
      return localStorage.idSentence
    }

    $scope.getmaxOp = function() {
      return localStorage.maxop
    }

     $scope.Teste = function(op) {
        if (op > 1) return 1;
        else return 0;
      }
      $scope.Teste2 = function(op) {
        if (op > 1) return 0;
        else return 1;
      }



     //This method will call your server, with the GET method and the url /show

      var showSentences = function (id){
      $http.get('http://localhost:3000/requests/reviewtable/maxoperator/' + id).then(function(success) {
      //console.log(success.data);
      if(success.data.length>0) {
         $scope.sentences = success.data;
      }
      })
    };

    showSentences(localStorage.id);

      var showSentence = function(id, idSentence, operator) {
      $http.get('http://localhost:3000/requests/reviewtable/'+ id + '/' + idSentence + '/' + operator).then(function(success) {
      //console.log(success.data);
      if(success.data.length>0) {
         $scope.sentence = success.data[0];

      }
      })
    };
    showSentence(localStorage.id, localStorage.idSentence, localStorage.maxop);

    console.log(localStorage.id, localStorage.idSentence, localStorage.operator);


      $scope.postedit = function (TS, requestIdReview, sentenceId, operator){
        var sentence = {
        TS, requestIdReview, sentenceId, operator
        };


      console.log(requestIdReview + ' xxx');
      console.log($scope.sentenceId + ' xxx');

      $http.post('http://localhost:3000/requests/reviewtable/', sentence).then(function(success) {
      //console.log(success.data);
          $http.get('http://localhost:3000/requests/reviewtablea/'+ localStorage.id + '/' + localStorage.idSentence).then(function(success) {
            if(success.data.length>0) {
              console.log(success.data[success.data.length-1].operator + 'AAAaa');
              localStorage.maxop = success.data[success.data.length-1].operator;
              history.go(0);
            }
         })

      })
      

    };

      var showReviews = function(id, idSentence) {
      $http.get('http://localhost:3000/requests/reviewtablea/'+ id + '/' + idSentence).then(function(success) {
      //console.log(success.data);
      if(success.data.length>0) {
         $scope.reviews = success.data;
      }
      })
    };
    showReviews(localStorage.id, localStorage.idSentence);

    var showDates = function() {
      $http.get('http://localhost:3000/requests/translationRequest/date').then(function (success) {
        $scope.arrayDate = success.data;
      })
    }
    showDates();



  }]);



