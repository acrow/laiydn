laiydApp.controller('actMineCtl', function($scope, $window, Activity, Weixin, $rootScope, loading, wxMethods) {
	$scope.isLoaded = false;
	wxMethods.jsSdkConfig(function() {
		wx.hideOptionMenu(); // 隐藏右上角菜单
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
				    // title: 'test', // 分享标题
				    // desc: 'share', // 分享描述
				    link: location.href.split('?code')[0], // 分享链接
				    // imgUrl: '', // 分享图标
				    // type: '', // 分享类型,music、video或link，不填默认为link
				    // dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
				    success: function () { 
				        // 用户确认分享后执行的回调函数
				        $window.alert('分享成功!');
				    },
				    cancel: function () { 
				        // 用户取消分享后执行的回调函数
				        $window.alert('取消分享!');
				    }
				});
				loading.hide();
				loading.show('正在获取我的信息...');
				Weixin.getCurrentUser( // 取得当前用户
					{},
					function(result) {
						$rootScope.usr = result;
						$scope.usr = $rootScope.usr;
						loading.hide();
						loading.show('正在检索我的活动...');
						Activity.query( // 查找当前用户相关活动
							{activity: JSON.stringify({members : {$elemMatch : {openId : $rootScope.usr.openId}}})},
							function(result) {
								if (result) {
									$scope.activities = result;
								} else {

								}
								loading.hide();
								$scope.isLoaded = true;
							},
							function(err) {
								$window.alert(err);
								loading.hide();
							}
						);
					}
				);
		$scope.isLoaded = true;
	});

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

	$scope.onQuitActivity = function(id) {
		for (var i = 0; i < $scope.activities.length; i++) {
			if ($scope.activities[i]._id = id) {
				$scope.activities.splice(i, 1);
				return;
			}
		};
	};

	$scope.goSearch = function() {
		$window.location.href='http://www.laiyd.com/weixin/web/searchAct';
	};

	$scope.goEdit = function() {
		$window.location.href='http://www.laiyd.com/weixin/web/editAct';
	};
});

