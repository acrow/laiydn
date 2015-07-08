laiydApp.controller('actEditCtl', function($scope, $routeParams, $window, $http, Activity, $rootScope, loading) {
	$scope.usr = $rootScope.usr;
	$scope.types = ['羽毛球','足球','篮球','乒乓球'];
	if ($routeParams.id) {
		$scope.activity = $routeParams.id;
	} else {
		$scope.activity = {
				type : '羽毛球',
				minUsers : 2,
				auditMethod : '自动通过',
				hours : 2,
				allowAnonymous : '1'
		}
	}
	$scope.onSave = function() {

		$scope.activity.members = [{openId : $rootScope.usr.openId, nickName : $rootScope.usr.nickName, headImgUrl : $rootScope.usr.headImgUrl, userCount : 1, owner : true, joinDate : new Date()}];
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
	};
});
