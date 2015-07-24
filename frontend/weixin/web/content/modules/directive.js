
// 活动详细
laiydApp.directive('actDetails', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			act: '=data',
			onQuit: '=onQuit'
		},
		templateUrl: 'content/views/actDetails.html',
		require: ['resource'],
		controller: ['$scope', '$rootScope', '$window', 'Activity', 'loading', function($scope, $rootScope, $window, Activity, loading, prompt) {
			
			function refresh() {
				$scope.isWaiting = false; // 是否尚未通过
				$scope.isJoined = false; // 是否已通过
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
				prompt.show('');
				// loading.show('');
				// Activity.quit(
				// 	{openId: $rootScope.usr.openId, id: $scope.act._id},
				// 	function(result) {
				// 		$scope.act = result;
				// 		refresh();
				// 		if (onQuit) {
				// 			onQuit($scope.act._id);
				// 		}
				// 		loading.hide();
				// 	},
				// 	function(err) {
				// 		$window.alert(JSON.stringify(err));
				// 	}
				// );
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

			$scope.modify = function() {
				$window.alert('modify');
			};

			$scope.shareFirend = function() {
				// try {
				// 	var bLevel = {
				//         qq: {forbid: 0, lower: 1, higher: 2},
				//         uc: {forbid: 0, allow: 1}
				//     };
				//     var UA = navigator.appVersion;
				//     var isqqBrowser = (UA.split("MQQBrowser/").length > 1) ? bLevel.qq.higher : bLevel.qq.forbid;
				//     var isucBrowser = (UA.split("UCBrowser/").length > 1) ? bLevel.uc.allow : bLevel.uc.forbid;

				//     $window.alert(browser);
				// } catch (e) {
				// 	$window.alert('err:' + JSON.stringify(e));
				// }
				$window.location.href = 'http://www.laiyd.com/weixin/web/viewAct/' + $scope.act._id + '?isShare=1';
			};

			$scope.shareCircle = function() {
				var Browser = new Object();
                Browser.ios = /iphone/.test(Browser.userAgent); //判断ios系统 
                var title = document.title;
                var img = "";
                var url = location.href;
                if (Browser.ios) {
                    ucbrowser.web_share(title, img, url, 'kWeixinFriend', '', '', '');
                } else {
                    ucweb.startRequest("shell.page_share", [title, img, url, 'WechatTimeline', '', '', '']);
                };
			}
		}]
	};
});
