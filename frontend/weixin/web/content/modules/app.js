var laiydApp = angular.module('laiyd', ['ngRoute','resource']);

laiydApp.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
	.when('/mine', {
		templateUrl:'content/views/myAct.html',
		controller: 'myActCtl'
	})
	.when('/edit', {
		templateUrl:'content/views/actEdit.html',
		controller: 'actEditCtl'
	})
	.when('/edit/:id', {
		templateUrl:'content/views/actEdit.html',
		controller: 'actEditCtl'
	})
	.when('/view/:id', {
		templateUrl:'content/views/actView.html',
		controller: 'actViewCtl'
	})
	.when('/apply/:id', {
		templateUrl:'content/views/actApply.html',
		controller: 'actApplyCtl'
	})
	.when('/search', {
		templateUrl:'content/views/actSearch.html',
		controller: 'actSearchCtl'
	})
	.when('/login', {
		templateUrl:'content/views/login.html',
		controller: 'loginCtl'
	})
	.when('/reg', {
		templateUrl:'content/views/reg.html',
		controller: 'regCtl'
	})
	.otherwise({
        redirectTo: '/mine'
    });
}]);

laiydApp.directive('actDetails', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			act: '=data'
		},
		templateUrl: 'content/views/actDetails.html',
		require: ['resource'],
		controller: ['$scope', '$rootScope', '$window', 'Activity', function($scope, $rootScope, $window, Activity) {
			
			function refresh() {
				$scope.isJoined = false; // 是否是参与者
				$scope.isOwner = false; // 是否是发起者
				$scope.isOver1 = false; // 是否大于1人（带朋友一起参加）
				$scope.userCount = 0;
				if ($rootScope.usr && $scope.act.members) {
					for(var i = 0; i < $scope.act.members.length; i++) {
						var mem = $scope.act.members[i];
						if (mem.openId == $rootScope.usr.openId) {
							$scope.isJoined = true;
							if (mem.owner == true) {
								$scope.isOwner = true;
							}
							if (mem.userCount > 1) {
								$scope.isOver1 = true;
							}
						}
						$scope.userCount += mem.userCount;
					}
				}	
			}
			refresh();
			$scope.join = function() {
				Activity.join(
					{openId: $rootScope.usr.openId, id: $scope.act._id},
					function(result) {
						$scope.act = result;
						refresh();
					},
					function(err) {
						$window.alert(JSON.stringify(err));
					}
				);
			};

			$scope.quit = function() {
				Activity.quit(
					{openId: $rootScope.usr.openId, id: $scope.act._id},
					function(result) {
						$scope.act = result;
						refresh();
					},
					function(err) {
						$window.alert(err);
					}
				);
			};

			$scope.plus = function() {
				Activity.plus(
					{openId: $rootScope.usr.openId, id: $scope.act._id},
					function(result) {
						$scope.act = result;
						refresh();
					},
					function(err) {
						$window.alert(err);
					}
				);
			};

			$scope.minus = function() {
				Activity.minus(
					{openId: $rootScope.usr.openId, id: $scope.act._id},
					function(result) {
						$scope.act = result;
						refresh();
					},
					function(err) {
						$window.alert(err);
					}
				);
			};

			$scope.modify = function() {
				$window.alert('mofify');
			};
		}]
	};
});

laiydApp.run( function($rootScope) {
	
});
