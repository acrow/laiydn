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
