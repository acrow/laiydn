var db = require('./db');
var ObjectID = require('mongodb').ObjectID;
function Activity(activity) {
	this._id = activity._id;
	this.type = activity.type;
	this.startTime = activity.startTime;
	this.hours = activity.hours;
	this.address = activity.address;
	this.content = activity.content;
	this.maxUsers = activity.maxUsers;
	this.minUsers = activity.minUsers;
	this.amount = activity.amount;
	this.auditMethod = activity.auditMethod;
	this.status = activity.status;
	this.allowAnonymous = activity.allowAnonymous;
	this.applications = activity.applications;
}

module.exports = Activity;

Activity.prototype.save = function save(callback) {
	var activity = {
		_id: this._id,
		type: this.type,
		startTime: this.startTime,
		hours: this.hours,
		address: this.address,
		content: this.content,
		maxUsers: this.maxUsers,
		minUsers: this.minUsers,
		amount: this.amount,
		auditMethod: this.auditMethod,
		status: this.status,
		allowAnonymous: this.allowAnonymous,
		applications: this.applications
	};
	db.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('activities', function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			collection.save(activity, function(err,activity) {
				db.close();
				callback(err, activity);
			});
		});
		
	});
};

Activity.get = function get(id, callback) {
	var _id = new ObjectID(id);
	db.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('activities', function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			if (collection) {
				collection.findOne({_id: _id}, function(err, act) {
					callback(err, act);
				});
			} else {
				callback(err);
			}
		});
	});
};
Activity.getAll = function getAll(callback) {
	db.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('activities', function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			if (collection) {
				collection.find().toArray(function(err, acts) {
					callback(err, acts);
				});
			} else {
				callback(err);
			}
		});
	});
};
Activity.query = function query(act, callback) {
	db.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('activities', function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			if (collection) {
				collection.find(act).toArray(function(err, acts) {
					callback(err, acts);
				});
			} else {
				callback(err);
			}
		});
	});
};

Activity.myActivities = function query(openId, callback) {
	db.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('activities', function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			if (collection) {
				collection.find({'members.openId' : openId}).toArray(function(err, acts) {
					callback(err, acts);
				});
			} else {
				callback(err);
			}
		});
	});
};
// 用户加入活动
Activity.join = function query(openId, id, callback) {
	var _id = new ObjectID(id);
	db.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('activities', function(err, actColl) {
			if (err) {
				db.close();
				return callback(err);
			}
			db.collection('members', function(err, memColl) {
				memColl.findOne({openId : openId}, function(err, mem) { // 取得用户信息
					if (err) {
						db.close();
						return callback(err);
					}
					if (!mem) {
						mem = {openId : openId, nickName: '匿名'};
					}

					actColl.update({_id : _id}, {$push:{members:{openId: mem.openId, nickName: mem.nickName, headImgUrl: mem.headImgUrl, userCount: 1, owner: false, joinDate: new Date(), passed: true}}}, function(err) {
						if (err) {
							db.close();
							return callback(err);
						}
						actColl.findOne({_id : _id}, function(err, act) {
							if (err) {
								db.close();
								return callback(err);
							} 
							callback(err, act);
							if (act.auditMethod == '自动通过') {
								actColl.update({_id : id}, {$set : {'members.$.passed' : true}});
							}
						});
					});
				});

			});
		});
	});
};
// 用户退出活动
Activity.quit = function quit(openId, id, callback) {
	var _id = new ObjectID(id);
	db.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('activities', function(err, actColl) {
			if (err) {
				db.close();
				return callback(err);
			}
			actColl.update({_id : _id}, {$pull:{members:{openId: openId}}}, function(err) {
				if (err) {
					db.close();
					return callback(err);
				}
				actColl.findOne({_id : _id}, function(err, act) {
					if (err) {
						db.close();
						return callback(err);
					} 
					callback(err, act);
				});
			});
		});
	});
};
// 修改用户申请人次
function changeUserCount(openId, id, count, callback) {
	var _id = new ObjectID(id);
	db.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('activities', function(err, actColl) {
			if (err) {
				db.close();
				return callback(err);
			}
			actColl.update({_id : _id, 'members.openId' : openId}, {$inc:{'members.$.userCount' : count}}, function(err) {
				if (err) {
					db.close();
					return callback(err);
				}
				actColl.findOne({_id : _id}, function(err, act) {
					if (err) {
						db.close();
						return callback(err);
					} 
					callback(err, act);
				});
			});
		});
	});
}
// 用户增加申请人次
Activity.plus = function plus(openId, id, callback) {
	changeUserCount(openId, id, 1, callback);
};
// 用户增加申请人次
Activity.minus = function minus(openId, id, callback) {
	changeUserCount(openId, id, -1, callback);
};