
// 活动详细
laiydApp.directive('actDetails', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			act: '=data',
			onQuit: '=onQuit'
		},
		templateUrl: '/view/weixin/content/views/actDetails.html',
		require: ['resource'],
		controller: ['$scope', '$rootScope', '$window', 'Activity', 'loading', 'prompt', function($scope, $rootScope, $window, Activity, loading, prompt) {
			
			function refresh() {
				$scope.isWaiting = false; // 是否尚未通过
				$scope.isJoined = false; // 是否已通过申请
				$scope.isReject = false; // 是否被拒绝
				$scope.isOwner = false; // 是否是发起者
				$scope.isOver1 = false; // 是否大于1人（带朋友一起参加）
				$scope.userCount = 1;
				$scope.acceptCount = 0; // 已接受人数
				$scope.waitingCount = 0; // 申请中人数
				if ($scope.act.applications) {
					for(var i = 0; i < $scope.act.applications.length; i++) {
						var mem = $scope.act.applications[i];
						if ($rootScope.usr && mem.openId == $rootScope.usr.openId) {
							if (mem.status == '通过') {
								$scope.isJoined = true;	
							} else if (mem.status == '拒绝') {
								$scope.isReject = true;	
							} else {
								$scope.isWaiting = true;
							}
							
							if (mem.owner == '是') {
								$scope.isOwner = true;
							}
							$scope.userCount = mem.userCount;
							if (mem.userCount > 1) {
								$scope.isOver1 = true;
							}
						}
						if (mem.status == '通过') {
							$scope.acceptCount += mem.userCount;
						} else if (mem.status == '申请中') {
							$scope.waitingCount += mem.userCount;	
						}
						
						
						
					}
				}	
			}
			refresh();
			$scope.join = function() {
				loading.show('');
				Activity.join(
					{openId: $rootScope.usr.openId, id: $scope.act._id},
					function(result) {
						$scope.act = result;
						refresh();
						loading.hide();
					},
					function(err) {
						$window.alert(JSON.stringify(err));
					}
				);
			};

			$scope.quit = function() {
				prompt.show('就这样退出了吗？', function() {
					loading.show('');
					Activity.quit(
						{openId: $rootScope.usr.openId, id: $scope.act._id},
						function(result) {
							$scope.act = result;
							refresh();
							if (onQuit) {
								onQuit($scope.act._id);
							}
							loading.hide();
						},
						function(err) {
							$window.alert(JSON.stringify(err));
						}
					);	
				});
				
			};

			$scope.plus = function() {
				loading.show('');
				Activity.plus(
					{openId: $rootScope.usr.openId, id: $scope.act._id},
					function(result) {
						$scope.act = result;
						refresh();
						loading.hide();
					},
					function(err) {
						$window.alert(JSON.stringify(err));
					}
				);
			};

			$scope.minus = function() {
				loading.show('');
				Activity.minus(
					{openId: $rootScope.usr.openId, id: $scope.act._id},
					function(result) {
						$scope.act = result;
						refresh();
						loading.hide();
					},
					function(err) {
						$window.alert(JSON.stringify(err));
					}
				);
			};

			$scope.approve = function(openId) {
				loading.show('');
				Activity.approve(
					{openId: openId, id: $scope.act._id},
					function(result) {
						$scope.act = result;
						refresh();
						loading.hide();
					},
					function(err) {
						$window.alert(JSON.stringify(err));
					}
				);
			};

			$scope.reject = function(openId) {


				loading.show('');
				Activity.reject(
					{openId: openId, id: $scope.act._id},
					function(result) {
						$scope.act = result;
						refresh();
						loading.hide();
					},
					function(err) {
						$window.alert(JSON.stringify(err));
					}
				);
			};

			$scope.modify = function() {
				$window.alert('modify');
			};

			$scope.showShare = function() {
				$window.location.href = '/weixin/actview?actId=' + $scope.act._id + '&isShare=1';
			};

		}]
	};
});
