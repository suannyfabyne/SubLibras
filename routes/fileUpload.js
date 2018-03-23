var express = require('express');
var router = express.Router();
var mysql      = require('mysql');
var multer = require('multer');
var path = require('path');
var connection = require('../db/connection');
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
    var objectType, objectCode;
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
        translation();
        review();
      });



    var treatingFile = function() {

    // READING UPLOADED FILE
    var directory = 'uploads/' + req.file.filename; 
    var rd = readline.createInterface({
        input: fs.createReadStream(directory),
        output: process.stdout,
        console: false
    });


    // CREATING ORIGINALSENTENCESTABLE
    var countline = 0;
    var list = new Array;

    rd.on('line', function(line) {


        if (objectType = 'L'){


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
                console.log("Number of records inserted: " + result.affectedRows);
            });
            }
        } else {

            if (line == 0) return
            else {
            countline = countline + 1;
            var secondsql = "INSERT INTO originSentences (_requestId, sentenceId, timeSentence, sentence) VALUES ?";
            var secondvalues = [
            [selectrequest, countline, 'NULL', line], 
            ];

            connection.query(secondsql, [secondvalues] , function (err, result) {
                if (err) throw err;
                console.log("Number of records inserted: " + result.affectedRows);
            });
            }



        }


    });

    countline = 0;
    }





    var translation = function() {
        var time;
        var list = ['Período passado vez 3 porquinho', 'que viver passado floresta com sua mãe', 'dia como já estar muito crescido', 'decidir passado ir viver cada sua casa'];
        var i = 0;
        var transsql = "INSERT INTO translatedSentences (_requestId_, sentenceId, timeSentence, statusSentence, pendencyCode, translatedSentence) VALUES ?";


        for (i = 0; i < list.length; i++) { 
                var transvalues = [
                [selectrequest, i+1, 'NULL', 'P', 'FR', list[i]], 
                ];            
                connection.query(transsql, [transvalues] , function (err, result) {
                if (err) throw err;
                console.log("Number of records inserted: " + result.affectedRows);
            });
            }   



    };


    var review = function(){

        os = ['Teste texto1', 'Teste texto2', 'Teste texto3'];
        ts = ['Texte glosa1', 'Teste glosa2', 'Teste glosa3'];

        for (i = 0; i < ts.length; i++) { 
        var sqlreview = "INSERT INTO reviewTable (requestIdReview, sentenceId, dateReview, operator, OS, TS, modificationType) VALUES ?";
        var valuesreview = [
        [selectrequest, i+1, date, '01', os[i], ts[i], 'Tradução Inicial'],
        ];
      connection.query(sqlreview, [valuesreview] , function (err, result,fields) {
        if (err) throw err;
        console.log("INDICE DO REQUEST: " + result.insertId);

        })
        }

    };




    }); 
});


module.exports = router;

/* app.post('/users', function (req, res) {
    connection.query('INSERT INTO users SET ?', req.body, 
        function (err, result) {
            if (err) throw err;
            res.send('User added to database with ID: ' + result.insertId);
        }
    ); */