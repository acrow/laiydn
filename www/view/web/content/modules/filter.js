laiydApp.filter('actImg',function() {
	return function(input) {
		if (input && input.length) {
			for (var i = 0; i < input.length; i++) {
				var act = input[i];
				if (!act.img) {
					if (act.type == '羽毛球') {
						act.img = './img/yumaoqiu.png';
					} else if (act.type == '足球') {
						act.img = './img/zuqiu.png';
					}
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
					mem.headImgUrl = './img/111.png'
				}
			}
		}
		return input;
	}
});