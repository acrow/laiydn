laiydApp.controller('myActCtl', function($scope, $window, Activity, Weixin) {
	$scope.shareAct = function sendMessage(){

 		WeixinJSBridge.invoke('shareTimeline', { 
		 "title": "36氪", 
		 "link": "http://www.36kr.com", 
		 "desc": "关注互联网创业", 
		 "img_url": "http://www.36kr.com/assets/images/apple-touch-icon.png" 
		 }); 
	};
	Weixin.getConfig(
		{url : location.href.split('#')[0]},
		function(result) {
			$scope.sin = result;
			wx.config({
				debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			    appId: result.appId, // 必填，公众号的唯一标识
			    timestamp: result.timestamp, // 必填，生成签名的时间戳
			    nonceStr: result.nonceStr, // 必填，生成签名的随机串
			    signature: result.signature,// 必填，签名，见附录1
			    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'openLocation', 'getLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2

			});
			wx.error(function(res){
				$window.alert('验证失败!');
				$window.alert(location.href.split('#')[0])
			});
			wx.ready(function(res){
				// wx.checkJsApi({
			 //      jsApiList: [
			 //        'getNetworkType',
			 //        'previewImage'
			 //      ],
			 //      success: function (res) {
			 //        alert(JSON.stringify(res));
			 //      }
			 //    });
				wx.onMenuShareAppMessage({
				    title: 'test', // 分享标题
				    desc: 'share', // 分享描述
				    link: 'www.laiyd.cn', // 分享链接
				    imgUrl: '', // 分享图标
				    type: '', // 分享类型,music、video或link，不填默认为link
				    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
				    success: function () { 
				        // 用户确认分享后执行的回调函数
				        $window.alert('分享成功!');
				    },
				    cancel: function () { 
				        // 用户取消分享后执行的回调函数
				        $window.alert('取消分享!');
				    }
				});
			});
		}
	);
	Activity.getAll(
		{},
		function(result) {
			if (result) {
				$scope.activities = result;
			} else {
				$scope.activities = [
	                     {id : '12',type:'羽毛球',date:'2015/02/11', startTime:'17:30', endTime:'19:30', address:'广顺南大街东口民航干部管理学院运动中心', img:'yumaoqiu.png', content:'欢乐羽毛球俱乐部，欢迎大家热情参与。会员每人次30元，非会员每人次40元。含场地费，羽毛用球，不含服装与球拍，要求业余2级以上人员。谢谢合作！'},
	                     {id : '34',type:'足球',date:'2015/02/10',startTime:'09:00',endTime:'11:00',address:'国家奥体中心足球场3号场地', img:'zuqiu.png', content:'NTTDATA足球俱乐部，欢迎大家热情参与。只欢迎本俱乐部内部人员参与，其他人员勿扰。谢谢合作！'},
	                     {id : '34',type:'足球',date:'2015/02/10',startTime:'09:00',endTime:'11:00',address:'国家奥体中心足球场3号场地', img:'zuqiu.png', content:'NTTDATA足球俱乐部，欢迎大家热情参与。只欢迎本俱乐部内部人员参与，其他人员勿扰。谢谢合作！'}
	                     ];
			}
		},
		function(err) {
			$window.alert(err);
		}
	);
	
	$scope.encodeURI = function(url) {
		return encodeURI(encodeURI(angular.toJson(url)));
	};

	$scope.showMap = false;
	//var map = new BMap.Map("mapContainer");          // 创建地图实例  
	// $scope.openMap = function () {
	// 	$('#mapModal').modal('show');
	// 	  var point = new BMap.Point(116.404, 39.915);  // 创建点坐标  
	// 	  map.centerAndZoom(point, 15); 
	// }

	$scope.openMap = function() {
		
		wx.getLocation({
		    success: function (res) {
		        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
		        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
		        var speed = res.speed; // 速度，以米/每秒计
		        var accuracy = res.accuracy; // 位置精度
		        wx.openLocation({
				    latitude: latitude, // 纬度，浮点数，范围为90 ~ -90
				    longitude: longitude, // 经度，浮点数，范围为180 ~ -180。
		
				    scale: 28, // 地图缩放级别,整形值,范围从1~28。默认为最大
				    infoUrl: 'http://www.forallwin.com' // 在查看位置界面底部显示的超链接,可点击跳转
				});
		    }
		});
		
	};

	$scope.openBaiduMap = function() {
		$window.open('baiduMap.html', '_blank');
	};
});

laiydApp.controller('actEditCtl',function($scope, $routeParams, $window, $http, Activity) {
	$scope.types = ['羽毛球','足球','篮球','乒乓球'];
	if ($routeParams.id) {
		$scope.activity = $routeParams.id;
	} else {
		$scope.activity = {
				type : '羽毛球'
		}
	}
	$scope.onSave = function() {
		Activity.create(
			{},
			{activity : $scope.activity},
			function(result) {
				$window.alert(result);
			},
			function(err) {
				$window.alert(err);
			}
		);
		// $http.post('./svc/addAct',  $scope.activity)
		// .success(function() {			
		// 	$window.alert(angular.toJson($scope.activity));
		// });
	}
});

laiydApp.controller('actViewCtl',function($scope, $routeParams) {
    $scope.id = $routeParams.id;
});


laiydApp.controller('actSearchCtl',function($scope, $routeParams) {
	$scope.types = ['羽毛球','足球','篮球','乒乓球'];
	$scope.onSearch=function(){
		$scope.activities = [
		                     {id : '12',type:'羽毛球',date:'2015/02/11'},
		                     {id : '34',type:'足球',date:'2015/02/10'}
		                     ];
	}
});

laiydApp.controller('loginCtl', function($scope, $routeParams) {
	
});

laiydApp.controller('regCtl', function($scope, $routeParams) {
	
});