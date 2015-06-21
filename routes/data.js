var express = require('express');
var router = express.Router();

var Activity = require('../module/activity');
var Member = require('../module/member');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('dataget');
});

router.get('/activity', function(req, res, next) {
	var util = require('util');
	console.log('a:'+ util.inspect(Activity));
	Activity.getAll(function(err, result) {
		if (err) {
			res.json(err);
		} else {
			res.json(result);		
		}
	});
	
});

router.post('/activity', function(req, res, next) {
	console.log(req.param('activity'));
	// var act = new Activity(req.param('activity'));
	// act.Type = req.params.activity.type;
	// act.StartDateTime = req.params.activity.date;
	// res.json(req.param('activity'));
	var act = new Activity(req.param('activity'));
	act.Save(function(err, result) {
		if (err) {
			res.json(err);
		} else {
			res.json('ok');
		}
	});
});

router.post('/login', function(req, res, next) {
	console.log(req.param('userName'));
	Member.login(req.param('userName'), req.param('password'), function(err, result) {
		if (err) {
			res.json(err);
		} else {
			res.json(result);
		}
	})
});

router.post('/member', function(req, res, next) {
	console.log(req.param('member'));
	var act = new Activity(req.param('member'));
	act.Save(function(err, result) {
		if (err) {
			res.json(err);
		} else {
			res.json('ok');
		}
	});
});

module.exports = router;
