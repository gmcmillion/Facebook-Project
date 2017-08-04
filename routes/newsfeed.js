var express = require('express');
var router = express.Router();

// GET newsfeed page
router.get('/', function(req, res, next) {
  res.render('newsfeed');
});

// GET newsfeed page w/ id
router.get('/:id', function(req, res, next) {
  res.render('newsfeed');


  console.log('news feed w/ id: '+req.params.id);
});

module.exports = router;