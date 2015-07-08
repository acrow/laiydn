laiydApp.controller('myActCtl', function($scope, $window, Activity, Weixin, $rootScope) {
	$rootScope.usr = {openId :'testusr', nickName : 'testusr'};
	$scope.usr = $rootScope.usr;
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
	// Activity.myActivities(
	// 	{openId : $rootScope.usr.openId},
	// 	function(result) {
	// 		if (result) {
	// 			$scope.activities = result;
	// 		} else {
	// 			$scope.activities = [
	//                      {id : '12',type:'羽毛球',date:'2015/02/11', startTime:'17:30', endTime:'19:30', address:'广顺南大街东口民航干部管理学院运动中心', img:'yumaoqiu.png', content:'欢乐羽毛球俱乐部，欢迎大家热情参与。会员每人次30元，非会员每人次40元。含场地费，羽毛用球，不含服装与球拍，要求业余2级以上人员。谢谢合作！'},
	//                      {id : '34',type:'足球',date:'2015/02/10',startTime:'09:00',endTime:'11:00',address:'国家奥体中心足球场3号场地', img:'zuqiu.png', content:'NTTDATA足球俱乐部，欢迎大家热情参与。只欢迎本俱乐部内部人员参与，其他人员勿扰。谢谢合作！'},
	//                      {id : '34',type:'足球',date:'2015/02/10',startTime:'09:00',endTime:'11:00',address:'国家奥体中心足球场3号场地', img:'zuqiu.png', content:'NTTDATA足球俱乐部，欢迎大家热情参与。只欢迎本俱乐部内部人员参与，其他人员勿扰。谢谢合作！'}
	//                      ];
	// 		}
	// 	},
	// 	function(err) {
	// 		$window.alert(err);
	// 	}
	// );

	
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

laiydApp.controller('actEditCtl',function($scope, $routeParams, $window, $http, Activity, $rootScope) {
	$scope.usr = {openId :'testusr', nickName : 'testusr'};
	$scope.types = ['羽毛球','足球','篮球','乒乓球'];
	if ($routeParams.id) {
		$scope.activity = $routeParams.id;
	} else {
		$scope.activity = {
				type : '羽毛球'
		}
	}
	$scope.onSave = function() {
		$scope.activity.members = [{openId : $scope.usr.openId, nickName : $scope.usr.nickName, headImgUrl : $scope.usr.headImgUrl, userCount : 1, owner : true}];
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