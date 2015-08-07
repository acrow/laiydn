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
			collection.save(activity, function(err, result) {
				db.close();
				callback(err, result.ops[0]);
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

Activity.myActivities = function myActivities(openId, callback) {
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
				collection.find({'applications.openId' : openId}).toArray(function(err, acts) {
					callback(err, acts);
				});
			} else {
				callback(err);
			}
		});
	});
};

// 用户加入活动
Activity.join = function join(openId, id, callback) {
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

					actColl.findOne({_id : _id}, function(err, act) { // 查找活动信息
						if (err) {
							db.close();
							return callback(err);
						} 
						// 检查用户是否申请过了（有可能被拒绝了），修改状态为申请中，然后返回
						var isApplied = false;
						if (act.applications) {
							for(var i = 0; i < act.applications.length; i++) {
								if (act.applications[i].openId == openId) {
									act.applications[i].status = '申请中';
									actColl.update({_id : _id, 'applications.openId' : openId}, {$set:{'applications.$.status' : '申请中'}}, function(err) {
										db.close();
										if (err) {
											return callback(err);
										}
										return callback(err, act); 
									});
									isApplied = true;
									break;
								}
							}	
						}
						if (!isApplied) {
							// 用户新申请
							var application = Activity.newApplication(mem, false);
							if (act.auditMethod == '自动通过') {
								application.status = '通过';
								//actColl.update({_id : id}, {$set : {'applications.$.status' : '通过'}});
							}
							actColl.update({_id : _id}, {$push:{applications: application}}, function(err) {
								if (err) {
									db.close();
									return callback(err);
								}
								act.applications.push(application);
								callback(err, act);
							});	
						}
						
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
			actColl.update({_id : _id}, {$pull:{applications:{openId: openId}}}, function(err) {
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
			actColl.update({_id : _id, 'applications.openId' : openId}, {$inc:{'applications.$.userCount' : count}}, function(err) {
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
// 接受用户申请
Activity.approve = function approve(openId, id, callback) {
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
			actColl.update({_id : _id, 'applications.openId' : openId}, {$set:{'applications.$.status' : '通过'}}, function(err) {
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
// 拒绝用户申请
Activity.reject = function reject(openId, id, callback) {
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
			actColl.update({_id : _id, 'applications.openId' : openId}, {$set:{'applications.$.status' : '拒绝'}}, function(err) {
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

// 返回新的申请信息
Activity.newApplication = function newApplication(mem, isOwner) {
	apl = {openId: mem.openId, nickName: mem.nickName, headImgUrl: mem.headImgUrl, userCount: 1, owner: '否', applicationTime: new Date(), status: '申请中'};
	if (isOwner) {
		apl.owner = '是';
		apl.status = '通过';
	}
	return apl;
}
