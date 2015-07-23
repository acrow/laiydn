laiydApp.controller('actEditCtl', function($scope, $routeParams, $window, Activity, $rootScope, loading, wxMethods, Weixin) {
	$scope.isLoaded = false;
	$scope.types = ['羽毛球','足球','篮球','乒乓球'];
	$scope.hours = ['1小时','2小时','3小时','4小时','5小时','6小时','7小时','8小时','8小时','10小时','11小时','12小时','不限时'];
	$scope.auditMethods = ['自动通过','需要我批准'];
	$window.alert("start");
	wxMethods.jsConfig().then(wxMethods.getCurrentUser)
	.catch(function(err) {
		$window.alert(err);
	})
	.finally(function() {
		wx.hideOptionMenu(); // 隐藏右上角菜单
		$scope.isLoaded = true;
	});

	if ($routeParams.id) {
		$scope.activity = $routeParams.id;
	} else {
		$scope.activity = {
				type : '羽毛球',
				minUsers : 2,
				auditMethod : '自动通过',
				hours : '2小时',
				allowAnonymous :'是'
		};
	}
	$scope.onSave = function() {
		$scope.activity.applications = [{openId : $rootScope.usr.openId}];
		loading.show('正在保存...');
		Activity.create(
			{},
			{activity : $scope.activity},
			function(result) {
				loading.hide();
				$window.alert(result);
			},
			function(err) {
				loading.hide();
				$window.alert(JSON.stringify(err));
			}
		);
	};
});
