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
	// Activity.get(req.params.id, function(err, result) {
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
	var act = new Activity(req.body.activity);
	Member.getUserByOpenId(act.applications[0].openId, function(err, mem) {
		if (err) {
			res.json(err);
		} else {
			act.applications[0] = Activity.newApplication(mem, true); // 活动发起人
			act.save(function(err, result) {
				if (err) {
					res.json(err);
				} else {
					res.json('ok');
				}
			});
		}
	});
})
.delete(function(req, res, next) {
	Activity.delete(req.params.id, function(err, result) {
		if (err) {
			res.json(err);
		} else {
			res.json(result);		
		}
	});
});

// 通用查询
router.get('/activity/query/:activity', function(req, res, next) {
	var act = JSON.parse(req.params.activity);
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
	Activity.myActivities(req.params.openId, function(err, result) {
		if (err) {
			res.json(err);
		} else {
			res.json(result);		
		}
	});
});
// 用户加入活动
router.get('/activity/join/:openId/:id', function(req, res, next) {
	Activity.join(req.params.openId, req.params.id, function(err, result) {
		if (err) {
			res.json(err);
		} else {
			res.json(result);		
		}
	});
});
// 用户退出活动
router.get('/activity/quit/:openId/:id', function(req, res, next) {
	Activity.quit(req.params.openId, req.params.id, function(err, result) {
		if (err) {
			res.json(err);
		} else {
			res.json(result);		
		}
	});
});
// 用户追加一个人
router.get('/activity/plus/:openId/:id', function(req, res, next) {
	Activity.plus(req.params.openId, req.params.id, function(err, result) {
		if (err) {
			res.json(err);
		} else {
			res.json(result);		
		}
	});
});
// 用户减少一个人
router.get('/activity/minus/:openId/:id', function(req, res, next) {
	Activity.minus(req.params.openId, req.params.id, function(err, result) {
		if (err) {
			res.json(err);
		} else {
			res.json(result);		
		}
	});
});
// 接受用户申请
router.get('/activity/approve/:openId/:id', function(req, res, next) {
	Activity.approve(req.params.openId, req.params.id, function(err, result) {
		if (err) {
			res.json(err);
		} else {
			res.json(result);		
		}
	});
});
// 拒绝用户申请
router.get('/activity/reject/:openId/:id', function(req, res, next) {
	Activity.reject(req.params.openId, req.params.id, function(err, result) {
		if (err) {
			res.json(err);
		} else {
			res.json(result);		
		}
	});
});

/************************************* 用户相关 **********************************/
// 登录
router.post('/login', function(req, res, next) {
	console.log(req.query.userName);
	Member.login(req.query.userName, req.query.password, function(err, result) {
		if (err) {
			res.json(err);
		} else {
			res.json(result);
		}
	})
});

// 追加用户
router.post('/member', function(req, res, next) {
	console.log(req.body.member);
	var mem = new Member(req.body.member);
	mem.save(function(err, result) {
		if (err) {
			res.json(err);
		} else {
			res.json('ok');
		}
	});
});

module.exports = router;
