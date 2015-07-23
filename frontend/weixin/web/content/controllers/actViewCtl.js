laiydApp.controller('actViewCtl',function($scope, $routeParams, $window, Activity) {
	$scope.join = function(actid) {
		$window.alert(actid);
	}
});

