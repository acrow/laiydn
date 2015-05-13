var db = require('./db');
function Member() {
	this.userName = mem.userName;
	this.password = mem.password;
	this.displayName = mem.displayName;
	this.icon = mem.icon;
	this.openId = mem.openId;
}

module.exports = Member;

Member.prototype.Save = function Save(callback) {
	var mem = {
		userName : this.userName,
		password : this.password,
		displayName : this.displayName,
		icon : this.icon,
		openId : this.openId
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
		db.collection('activities', function(err, collection) {
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
		db.collection('activities', function(err, collection) {
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

Member.getUserByOpenId = function getUserByOpenId(oId, callback) {
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
				collection.find({openId:oId})(function(err, mem) {
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