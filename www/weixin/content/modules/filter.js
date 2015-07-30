laiydApp.filter('actImg',function() {
	return function(input) {
		if (input && input.length) {
			for (var i = 0; i < input.length; i++) {
				var act = input[i];
				if (!act.img) {
					if (act.type == '羽毛球') {
						act.img = 'http://www.laiyd.com/weixin/img/yumaoqiu.png';
					} else if (act.type == '足球') {
						act.img = 'http://www.laiyd.com/weixin/img/zuqiu.png';
					}
				} 
			}
		} else if (input) {
			if (!input.img) {
				if (input.type == '羽毛球') {
					input.img = 'http://www.laiyd.com/weixin/img/yumaoqiu.png';
				} else if (input.type == '足球') {
					input.img = 'http://www.laiyd.com/weixin/img/zuqiu.png';
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
					mem.headImgUrl = 'http://www.laiyd.com/weixin/img/111.png'
				} else {
					mem.headImgUrl = decodeURIComponent(mem.headImgUrl);
				}
			}
		} else if (input) {
			if (!input.headImgUrl) {
				input.headImgUrl = 'http://www.laiyd.com/weixin/img/111.png'
			} else {
				mem.headImgUrl = decodeURIComponent(mem.headImgUrl);
			}
		}
		return input;
	}
});