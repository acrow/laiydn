laiydApp.controller('actSearchCtl',function($scope, $rootScope, $routeParams, $window, Activity, loading, wxMethods, Weixin) {
	$scope.isLoaded = false;
	$scope.types = ['羽毛球','足球','篮球','乒乓球'];
	wxMethods.jsConfig().then(wxMethods.getCurrentUser)
	.catch(function(err) {
		$window.alert(err);
	})
	.finally(function() {
		wx.hideOptionMenu(); // 隐藏右上角菜单
		$scope.isLoaded = true;
	});
	$scope.onSearch = function(){
		loading.show('正在搜索活动...');
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
				loading.hide();
			},
			function(err) {
				$window.alert(JSON.stringify(err));
			}
		);
	};
	$scope.isLoaded = true;
});

