var laiydApp = angular.module('laiyd', ['ngRoute','resource', 'ui.bootstrap']);

laiydApp.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
	.when('/mine', {
		templateUrl:'/view/weixin/content/views/actMine.html',
		controller: 'actMineCtl'
	})
	.when('/edit', {
		templateUrl:'/view/weixin/content/views/actEdit.html',
		controller: 'actEditCtl'
	})
	.when('/edit/:id', {
		templateUrl:'/view/weixin/content/views/actEdit.html',
		controller: 'actEditCtl'
	})
	.when('/view/:id', {
		templateUrl:'/view/weixin/content/views/actView.html',
		controller: 'actViewCtl'
	})
	.when('/apply/:id', {
		templateUrl:'/view/weixin/content/views/actApply.html',
		controller: 'actApplyCtl'
	})
	.when('/search', {
		templateUrl:'/view/weixin/content/views/actSearch.html',
		controller: 'actSearchCtl'
	})
	.when('/login', {
		templateUrl:'/view/weixin//views/login.html',
		controller: 'loginCtl'
	})
	.when('/reg', {
		templateUrl:'/view/weixin/content/views/reg.html',
		controller: 'regCtl'
	})
	.otherwise({
        redirectTo: '/mine'
    });
}]);

laiydApp.run( function($rootScope) {
	
});
