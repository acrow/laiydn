laiydApp.controller('actMineCtl', function($scope, $window, Activity, Weixin, $rootScope, loading, wxMethods, $location, $q) {
	$scope.isLoaded = false;
	$scope.isEmpty = true;

	// wxMethods.jsConfig().then(wxMethods.getCurrentUser).then(wxMethods.getMyActivities).then(function(activities) {
	// 	if (activities && activities.length > 0) {
	// 		$scope.isEmpty = false;
	// 		$scope.activities = activities;
	// 	}
	// })
	// .catch(function(err) {
	// 	$window.alert(err);
	// })
	// .finally(function() {
	// 	wx.hideOptionMenu(); // 隐藏右上角菜单
	// 	$scope.isLoaded = true;
	// });

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
		$window.alert(id);
		for (var i = 0; i < $scope.activities.length; i++) {
			if ($scope.activities[i]._id == id) {
				$scope.activities.splice(i, 1);
				return;
			}
		};
	};

	$scope.goSearch = function() {
		$location.url('/search');
	};

	$scope.goEdit = function() {
		$location.url('/edit');
	};
});

