var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/reviews', function(req, res, next) {
  res.render('reviews', { title: 'Express' });
});

router.get('/sentences', function(req, res, next) {
  res.render('sentences', { title: 'Express' });
});

router.get('/modify', function(req, res, next) {
  res.render('modify', { title: 'Express' });
});


module.exports = router;
