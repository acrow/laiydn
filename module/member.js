var db = require('./db');
var _collectionName = 'members';
function Member(mem) {
	if (!mem) {
		return;
	}
	this._id = mem._id;	
	this.userName = mem.userName;
	this.password = mem.password;
	this.displayName = mem.displayName;
	this.icon = mem.icon;
	this.openId = mem.openId;
	this.nickName = mem.nickName;
	this.sex = mem.sex;
	this.city = mem.city;
	this.country = mem.country;
	this.province = mem.province;
	this.language = mem.language;
	this.headImgUrl = mem.headImgUrl;
	this.subscribeTime = mem.subscribeTime;
	this.unionId = mem.unionId;
	this.remark = mem.remark;
	this.groupId = mem.groupId;
	this.location = mem.location;
}

module.exports = Member;

Member.prototype.save = function save(callback) {
	var mem = {
		_id : this._id,
		userName : this.userName,
		password : this.password,
		displayName : this.displayName,
		icon : this.icon,
		openId : this.openId,
		nickName : this.nickName,
		sex : this.sex,
		city : this.city,
		country : this.country,
		province : this.province,
		language : this.language,
		headImgUrl : this.headimgUrl,
		subscribeTime : this.subscribeTime,
		unionId : this.unionId,
		remark : this.remark,
		groupId : this.groupId,
		location : this.location
	};
	if (!mem.nickName) {
		mem.nickName = '匿名';
	}
	db.open(function(err, db) {
		if (err) {
			db.close();
			return callback(err);
		}
		db.collection(_collectionName, function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			collection.save(mem, function(err,mem) { // save 方法会自动根据_id判断是插入还是更新
				db.close();
				callback(err, mem);
			});
		});
		
	});
};

Member.login = function login(usrName, pwd, callback) {
	db.open(function(err, db) {
		if (err) {
			db.close();
			return callback(err);
		}
		db.collection(_collectionName, function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			if (collection) {
				collection.findOne({userName:usrName}, function(err, mem) {
					db.close();
					if (err) {
						return callback(err);
					}
					if (!mem) {
						return callback('用户不存在！');
					}
					if (mem.password != pwd) {
						return callback('密码不正确！');
					}
					callback(err, mem);
				});
			} else {
				db.close();
				callback(err, null);
			}
		});
	});
};

Member.getUserById = function getUserById(id, callback) {
	db.open(function(err, db) {
		if (err) {
			db.close();
			return callback(err);
		}
		db.collection(_collectionName, function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			if (collection) {
				collection.findOne({_id:id}, function(err, mem) {
					db.close();
					if (err) {
						return callback(err);
					}
					if (mem) {
						callback(err, new Member(mem));	
					} else {
						callback(err, null);		
					}
				});
			} else {
				db.close();
				callback(err, null);
			}
		});
	});
};

Member.getUserByOpenId = function getUserByOpenId(openId, callback) {
	db.open(function(err, db) {
		if (err) {
			db.close();
			return callback(err);
		}
		db.collection(_collectionName, function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			if (collection) {
				collection.findOne({openId:openId}, function(err, mem) {
					db.close();
					if (err) {
						return callback(err);
					} 
					if (mem) {
						callback(err, new Member(mem));	
					} else {
						callback(err, null);		
					}
				});
			} else {
				db.close();
				callback(err, null);
			}
		});
	});
};

Member.updateLocation = function updateLocation(openId, location, callback) {
	db.open(function(err, db) {
		if (err) {
			db.close();
			return callback(err);
		}
		db.collection(_collectionName, function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			if (collection) {
				collection.update({openId:openId}, {$set: {location: location}}, {multi:true}, function(err) {
					db.close();
					if (err) {
						return callback(err);
					}
					callback(err);
				});
			} else {
				db.close();
				callback(err);
			}
		});
	});
}