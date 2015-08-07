
laiydApp.directive('actDetails', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			act: '=data'
		},
		templateUrl: 'content/views/actDetails.html',
		require: ['resource'],
		controller: ['$scope', '$rootScope', '$window', 'Activity', 'loading', 'prompt', function($scope, $rootScope, $window, Activity, loading, prompt) {
			
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
				prompt.show('really?', function() {$window.alert('yes');})
				Activity.join(
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

