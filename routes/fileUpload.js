var express = require('express');
const http = require('http');
var request = require('request');
var router = express.Router();
var mysql      = require('mysql');
var multer = require('multer');
var path = require('path');
var connection = require('../db/connection');
var sleep = require('sleep');
var fs = require('fs'),
    readline = require('readline');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
    }
  


});

var upload = multer({ storage: storage }).single('avatar');
var objectType, objectCode;


router.post('/', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
        }

        console.log(path.extname(req.file.originalname));


    // GETTING CLIENT DATABASE (GAMBIARRA) SHOUD TAKE DATA GROM USER LOGGED (DO IT LATTER)
    var idclient = 0;
    var clientssql = "INSERT INTO clients (clientId, clientName, type, passw) VALUES ?";
    var clientsvalues = [
    [idclient, 'suanny','client', '1234'],
    ];

    connection.query(clientssql, [clientsvalues] , function (err, result) {
        if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);
    });


    // DEFINING TYPE OF FILE 
    if (path.extname(req.file.originalname) == ".txt"){
            objectCode = 'T';
            objectType = 'Arquivo de Texto';
    }
    else if (path.extname(req.file.originalname) == ".srt"){
            objectCode = 'L';
            objectType = 'Legenda';
    }

    // INSERT DATA INTO TABLE OBJECT TYPES
    var sql = "INSERT INTO objectTypes (objectCode, objectType) VALUES ?";
    var values = [
    [objectCode, objectType],

    ];

    console.log([values]);
      connection.query(sql, [values] , function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
      });

      //TRANSLATION REQUEST ******************************************

    var sqltrans = "INSERT INTO translationRequest (requestId, _clientId, _objectCode, requestDate, requestStatus) VALUES ?";
    var selectrequest;
    var requestId = 0;
    var date = new Date();
    var valuestrans = [
    [requestId, '1' , objectCode, date,'0'],

    ];
      connection.query(sqltrans, [valuestrans] , function (err, result,fields) {
        if (err) throw err;
        console.log("INDICE DO REQUEST: " + result.insertId);
        selectrequest = result.insertId; 


        console.log(selectrequest);
        treatingFile();
      });

/*function readTextFile(filepath) {
    var str = "";
    var txtFile = new File(filepath);
    txtFile.open("r");
    while (!txtFile.eof) {
        // read each line of text
        str += txtFile.readln() + "\n";
    }
    return str;
}
*/
    var postTextFile = function(selectrequest, countline, line) {

        var contador = 0;
        for (var i = 0; i < (line.length -1); i++) {
            countline = countline + 1;

            var secondsql = "INSERT INTO originSentences (_requestId, sentenceId, timeSentence, sentence) VALUES ?";
            var secondvalues = [
            [selectrequest, countline, 'NULL', line[i]], 
            ];

            console.log(i);

            connection.query(secondsql, [secondvalues] , function (err, result) {
                if (err) throw err;
                console.log("Number of records inserted ORIGINAL: " + i + " - " + result.affectedRows );
                contador++;
                if (contador == (line.length -1)) translation();
            });

        }
    }

    var treatingFile = function() {
    lock = 0;
    // READING UPLOADED FILE
    var directory = 'uploads/' + req.file.filename; 
    var rd = readline.createInterface({
        input: fs.createReadStream(directory),
        output: process.stdout,
        console: false
    });


    var countline = 0;
    var list = new Array;
    var sentence = new Array;
    var aux = new Array;
    var count = 0;
    var lock = 1;

    if (objectCode == 'L'){
        rd.on('line', function(line) {

            lista = [];
                contador = 0;
                if (line == 0) return
                else if (line[0] == '0' && line[1] == '0' && line[2] == ':') list[countline-1] = line;
                else {
                countline = countline + 1;
                var secondsql = "INSERT INTO originSentences (_requestId, sentenceId, timeSentence, sentence) VALUES ?";
                var secondvalues = [
                [selectrequest, countline, list[countline-2], line], 
                ];
                connection.query(secondsql, [secondvalues] , function (err, result) {
                    if (err) throw err;
                    console.log("Number of records insertedddd ORIGINAL: " + result.affectedRows);
                    contador++;
                    if (contador == (line.length -1)) translation();
                });

                }



                /*for (var i = 0; i < line.length; i++) {
                    if (line[i] == '.') {
                        for (var j = i; j >= 0; j--) {
                            lista = line[j] + lista;
                        }
                    }
                    else{aux[countline] = line;}

                }
                aux= aux + ' ' + line;            

                var match = aux.split(".");

                con(selectrequest, countline, match);*/
            
            
        

                }); }

    else if (objectCode == 'T'){
    fs.readFile('uploads/' + req.file.filename, 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    var match = (data.replace(/(\n)/g, ' ')).split('.');
    console.log(match);
    postTextFile(selectrequest, countline, match);

    });


    }
   
    countline = 0;



    }




    var translation = function() {
        var time;
        var anotherlist = [];
        var list = ['Período passado vez 3 porquinho', 'que viver passado floresta com sua mãe', 'dia como já estar muito crescido', 'decidir passado ir viver cada sua casa'];
        var i = 0;
        var transsql = "INSERT INTO translatedSentences (_requestId_, sentenceId, timeSentence, statusSentence, pendencyCode, translatedSentence) VALUES ?";


          // text = 'Good morning to you';
          // lang = 'ASL';
          // headers = {"Content-Type": "application/json"};

          // var value = {
          //  text , lang
          // };

        var acounter = 0;
        var bcontador = 0;
        filter = ' WHERE _requestId=' + selectrequest;
         connection.query('SELECT sentence FROM originSentences' + filter, function(error, results, fields){
              if(error) 
                res.json(error);
              else
                res.json(results);

            for (var i = 0; i < results.length; i++) {
            
                  console.log(i);
                  console.log(results[i].sentence);
                  text = results[i].sentence;
                  lang = 'LIBRAS';
                  var value = {
                   text , lang
                  };

                request.post(
                    'http://150.165.205.88/translate',
                    { json: value },
                    function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            sleep.sleep(3);
                            acounter++;
                            anotherlist[i] = body;
                            console.log(anotherlist[i]);


                            var transvalues = [
                            [selectrequest, acounter, 'NULL', 'P', 'FR', anotherlist[i]], 
                            ];            
                            connection.query(transsql, [transvalues] , function (err, result) {
                            if (err) throw err;
                            console.log("Number of records inserted TRANSLATED: " + result.affectedRows);
                            bcontador++;
                            if (bcontador == (results.length-1)) review();
                        });


                        }
                    }
                );                
            }

        });


    };


    var review = function(){

        filter = ' AND translatedSentences._requestId_ =' + selectrequest +  ' AND originSentences._requestId =' + selectrequest;
        connection.query('SELECT originSentences.sentence AS sentence, translatedSentences.translatedSentence AS translatedSentence FROM originSentences JOIN translatedSentences ON translatedSentences.sentenceId = originSentences.sentenceId' + filter, function(error, results, fields){
          if(error) 
            res.json(error);
          else {
            
            for (i = 0; i < results.length; i++) { 
                var sqlreview = "INSERT INTO reviewTable (requestIdReview, sentenceId, dateReview, operator, OS, TS, modificationType) VALUES ?";
                var valuesreview = [
                [selectrequest, i+1, date, '01', results[i].sentence, results[i].translatedSentence, 'Tradução Inicial'],
                ];
              connection.query(sqlreview, [valuesreview] , function (err, result,fields) {
                if (err) throw err;
                console.log('POST ON REVIEW TABLE');

            })
            }


        
            }
        });




    };

    }); 
});


module.exports = router;

