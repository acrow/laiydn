var express = require('express');
var router = express.Router();

var Activity = require('../module/activity');
var Member = require('../module/member');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('dataget');
});

/********************************** 活动相关 ***********************************/
router.route('/activity/:id?')
.get(function(req, res, next) {
	// Activity.get(req.param('id'), function(err, result) {
	// 	if (err) {
	// 		res.json(err);
	// 	} else {
	// 		res.json(result);		
	// 	}
	// });
	Activity.getAll(function(err, result) {
		if (err) {
			res.json(err);
		} else {
			res.json(result);		
		}
	});
	
})
.post(function(req, res, next) {
	console.log(req.param('activity'));
	// var act = new Activity(req.param('activity'));
	// act.Type = req.params.activity.type;
	// act.StartDateTime = req.params.activity.date;
	// res.json(req.param('activity'));
	var act = new Activity(req.param('activity'));
	act.save(function(err, result) {
		if (err) {
			res.json(err);
		} else {
			res.json('ok');
		}
	});
})
.delete(function(req, res, next) {
	Activity.delete(req.param('id'), function(err, result) {
		if (err) {
			res.json(err);
		} else {
			res.json(result);		
		}
	});
});

// 通用查询
router.get('/activity/query/:activity', function(req, res, next) {
	var act = JSON.parse(req.param('activity'));
	Activity.query(act, function(err, result) {
		if (err) {
			res.json(err);
		} else {
			res.json(result);		
		}
	});
});
// 查询用户参与的活动
router.get('/activity/myActivities/:openId', function(req, res, next) {
	Activity.myActivities(req.param('openId'), function(err, result) {
		if (err) {
			res.json(err);
		} else {
			res.json(result);		
		}
	});
});
// 用户加入活动
router.get('/activity/join/:openId/:id', function(req, res, next) {
	Activity.join(req.param('openId'), req.param('id'), function(err, result) {
		if (err) {
			res.json(err);
		} else {
			res.json(result);		
		}
	});
});
// 用户退出活动
router.get('/activity/quit/:openId/:id', function(req, res, next) {
	Activity.quit(req.param('openId'), req.param('id'), function(err, result) {
		if (err) {
			res.json(err);
		} else {
			res.json(result);		
		}
	});
});
// 用户追加一个人
router.get('/activity/plus/:openId/:id', function(req, res, next) {
	Activity.plus(req.param('openId'), req.param('id'), function(err, result) {
		if (err) {
			res.json(err);
		} else {
			res.json(result);		
		}
	});
});
// 用户减少一个人
router.get('/activity/minus/:openId/:id', function(req, res, next) {
	Activity.minus(req.param('openId'), req.param('id'), function(err, result) {
		if (err) {
			res.json(err);
		} else {
			res.json(result);		
		}
	});
});

/************************************* 用户相关 **********************************/
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
	act.save(function(err, result) {
		if (err) {
			res.json(err);
		} else {
			res.json('ok');
		}
	});
});

module.exports = router;
