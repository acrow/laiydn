var db = require('./db');
function Member() {
	this.userName = mem.userName;
	this.password = mem.password;
	this.displayName = mem.displayName;
	this.icon = mem.icon;
	this.openId = mem.openId;
	this.nikeName = mem.nikeName;
	this.sex = mem.sex;
	this.city = mem.city;
	this.country = mem.country;
	this.province = mem.province;
	this.language = mem.language;
	this.headImgUrl = mem.headImgUrl;
	this.subscribTime = mem.subscribTime;
	this.unionId = mem.unionId;
	this.remark = mem.remark;
	this.groupId = mem.groupId;
}

module.exports = Member;

Member.prototype.Save = function Save(callback) {
	var mem = {
		userName : this.userName,
		password : this.password,
		displayName : this.displayName,
		icon : this.icon,
		openId : this.openId,
		nikeName : this.nikeName,
		sex : this.sex,
		city : this.city,
		country : this.country,
		province : this.province,
		language : this.language,
		headImgUrl : this.headimgUrl,
		subscribTime : this.subscribTime,
		unionId : this.unionId,
		remark : this.remark,
		groupId : this.groupId
	};

	db.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('members', function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			collection.insert(mem, {safe: true}, function(err,mem) {
				db.close();
				callback(err, mem);
			});
		});
		
	});
};

Member.login = function login(usrName, pwd, callback) {
	db.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('members', function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			if (collection) {
				collection.find({userName:usrName})(function(err, mem) {
					if (err) {
						return callback(err);
					}
					if (mem.password != pwd) {
						return callback(err);
					}
					callback(err, mem);
					console.log(docs);
				});
			} else {
				callback(err, null);
			}
		});
	});
};

Member.getUserById = function getUserById(id, callback) {
	db.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('members', function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			if (collection) {
				collection.find({_id:id})(function(err, mem) {
					if (err) {
						return callback(err);
					}
					callback(err, mem);
					console.log(docs);
				});
			} else {
				callback(err, null);
			}
		});
	});
};

Member.getUserByOpenId = function getUserByOpenId(openId, callback) {
	db.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('members', function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			if (collection) {
				collection.find({openId:openId})(function(err, mem) {
					if (err) {
						return callback(err);
					}
					callback(err, mem);
					console.log(docs);
				});
			} else {
				callback(err, null);
			}
		});
	});
};