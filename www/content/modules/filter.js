laiydApp.filter('actImg',function() {
	return function(input) {
		if (input && input.length) {
			for (var i = 0; i < input.length; i++) {
				var act = input[i];
				if (!act.img) {
					if (act.type == '羽毛球') {
						act.img = '/img/yumaoqiu.png';
					} else if (act.type == '足球') {
						act.img = '/img/zuqiu.png';
					} else if (act.type == '篮球') {
						act.img = '/img/lanqiu.png';
					} else if (act.type == '乒乓球') {
						act.img = '/img/pingpangqiu.png';
					} else if (act.type == '骑行') {
						act.img = '/img/qixing.png';
					} else if (act.type == '远足') {
						act.img = '/img/yuanzu.png';
					} else if (act.type == '聚餐') {
						act.img = '/img/jucan.png';
					}
				} 
			}
		} else if (input) {
			if (!input.img) {
				if (input.type == '羽毛球') {
					input.img = '/img/yumaoqiu.png';
				} else if (input.type == '足球') {
					input.img = '/img/zuqiu.png';
				} else if (input.type == '篮球') {
					input.img = '/img/lanqiu.png';
				} else if (input.type == '乒乓球') {
					input.img = '/img/pingpangqiu.png';
				} else if (input.type == '骑行') {
					input.img = '/img/qixing.png';
				} else if (input.type == '远足') {
					input.img = '/img/yuanzu.png';
				} else if (input.type == '聚餐') {
					input.img = '/img/jucan.png';
				}
			} 
		}

		return input;
	}
});

laiydApp.filter('memImg',function() {
	return function(input) {
		if (input && input.length) {
			for (var i = 0; i < input.length; i++) {
				var mem = input[i];
				if (!mem.headImgUrl) {
					mem.headImgUrl = '/img/111.png'
				} else {
					mem.headImgUrl = decodeURIComponent(mem.headImgUrl);
				}
			}
		} else if (input) {
			if (!input.headImgUrl) {
				input.headImgUrl = '/img/111.png'
			} else {
				mem.headImgUrl = decodeURIComponent(mem.headImgUrl);
			}
		}
		return input;
	}
});