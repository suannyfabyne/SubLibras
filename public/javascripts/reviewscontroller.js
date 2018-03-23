var myApp = angular.module('myApp',[])

.controller('MyCtrl', ['$scope','$http', '$rootScope', function($scope, $http, $rootScope) {


     //This method will call your server, with the GET method and the url /show


      var refresh = function (){
      $http.get("http://localhost:3000/requests/translationRequest").then(function(success) {
      //console.log(success.data);

      if(success.data.length>0)
      {
         $scope.requests=success.data;
      }

    })};

    refresh();


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


     //This method will call your server, with the GET method and the url /show

      var refresh2 = function (id, operator){
      $http.get('http://localhost:3000/requests/reviewtable/').then(function(success) {
      //console.log(success.data);
      if(success.data.length>0) {
         $scope.sentences=success.data;
      }
      })
    };
    refresh2();

      var refresh3 = function(id, idSentence, operator) {
      $http.get('http://localhost:3000/requests/reviewtable/'+ id + '/' + idSentence + '/' + operator).then(function(success) {
      //console.log(success.data);
      if(success.data.length>0) {
         $scope.sentence = success.data[0];
      }
      })
    };
    refresh3(localStorage.id, localStorage.idSentence, localStorage.operator);
    console.log(localStorage.id, localStorage.idSentence, localStorage.operator);


      $scope.postedit = function (TS, requestIdReview, sentenceId, operator){
        var sentence = {
        TS, requestIdReview, sentenceId, operator
        };


      console.log(requestIdReview + ' xxx');
      console.log($scope.sentenceId + ' xxx');

      $http.post('http://localhost:3000/requests/reviewtable/', sentence).then(function(success) {
      //console.log(success.data);

      })
      refresh4(localStorage.id, localStorage.idSentence);

    };

      var refresh4 = function(id, idSentence) {
      $http.get('http://localhost:3000/requests/reviewtablea/'+ id + '/' + idSentence).then(function(success) {
      //console.log(success.data);
      if(success.data.length>0) {
         $scope.reviews = success.data;
      }
      })
    };
    refresh4(localStorage.id, localStorage.idSentence);





  }]);



