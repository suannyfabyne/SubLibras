var express = require('express');
var router = express.Router();
var connection = require('../db/connection');
/* GET home page. */

router.get('/clients', (req, res) =>{
 connection.query('SELECT * FROM clients', function(error, results, fields){
      if(error) 
        res.json(error);
      else
        res.json(results);
      
      console.log('GET clients');
});});




router.get('/originSentences', (req, res) =>{
 connection.query('SELECT * FROM originSentences', function(error, results, fields){
      if(error) 
        res.json(error);
      else
        res.json(results);

      console.log('GET originSentences');
});});




router.get('/translationRequest', (req, res) =>{
 connection.query('SELECT * FROM translationRequest', function(error, results, fields){
      if(error) 
        res.json(error);
      else
        res.json(results);
      
      console.log('GET translationRequest');
});});

router.get('/translationRequest/date', (req, res) =>{
 connection.query('SELECT DISTINCT requestDate FROM translationRequest', function(error, results, fields){
      if(error) 
        res.json(error);
      else
        res.json(results);
      
      console.log('Request Date');
});});


router.get('/reviewtable', (req, res) =>{
 connection.query('SELECT * FROM reviewTable' , function(error, results, fields){
      if(error) 
        res.json(error);
      else
        res.json(results);
      
      console.log('GET joinSentences');
});});


router.get('/reviewtable/:id?', (req, res) =>{
    let filter = '';
    if(req.params.id) filter = ' WHERE requestIdReview=' + parseInt(req.params.id);
    connection.query('SELECT * FROM reviewTable' + filter, function(error, results, fields){
      if(error) 
        res.json(error);
      else{
        res.json(results);
      }
      
      console.log('GET id Sentence review table');
});});



router.get('/reviewtable/:id?/:id2?/:id3?', (req, res) =>{
    let filter = '';
    if(req.params.id && req.params.id2 && req.params.id3) filter = ' WHERE requestIdReview=' + parseInt(req.params.id) + ' AND sentenceId=' + parseInt(req.params.id2) + ' AND operator=' + parseInt(req.params.id3);
    connection.query('SELECT * FROM reviewTable' + filter, function(error, results, fields){
      if(error) 
        res.json(error);
      else{
        res.json(results);
      }
      
      console.log('GET id review table');
});});

router.get('/reviewtablea/:id?/:id2?', (req, res) =>{
    let filter = '';
    if(req.params.id && req.params.id2) filter = ' WHERE requestIdReview=' + parseInt(req.params.id) + ' AND sentenceId=' + parseInt(req.params.id2);
    connection.query('SELECT * FROM reviewTable' + filter, function(error, results, fields){
      if(error) 
        res.json(error);
      else{
        res.json(results);

      }
      
      console.log('GET id review table id and idsentence');
});});


router.post('/reviewtable', (req, res) =>{
    let filter = '';
    console.log(req.body.TS + ' ' + req.body.requestIdReview + ' ' + req.body.sentenceId + ' ' + req.body.operator);
    console.log('AAAAAAAAAAAAAAAA');

    if(req.body.requestIdReview && req.body.sentenceId && req.body.operator) filter = ' WHERE requestIdReview=' + parseInt(req.body.requestIdReview) + ' AND sentenceId=' + parseInt(req.body.sentenceId);
    else console.log("erro");
    connection.query('SELECT * FROM reviewTable' + filter, function(error, results, fields){
      if(error) 
        res.json(error);
      else {
        res.json(results);
        var date = new Date();
        var values = [
        [results[results.length-1].requestIdReview, results[results.length-1].sentenceId, date, results[results.length-1].operator + 1, results[results.length-1].TS, req.body.TS, 'Revisado'],
        ];
      }

        var sqlreview = "INSERT INTO reviewTable (requestIdReview, sentenceId, dateReview, operator, OS, TS, modificationType) VALUES ?";
      connection.query(sqlreview, [values] , function (err, result,fields) {
        if (err) throw err;
        console.log("INDICE DO REQUEST: " + result.insertId);
        console.log('POST review table')

        
        })

});});







module.exports = router;
