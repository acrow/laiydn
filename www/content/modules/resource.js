angular.module('resource', ['ngResource'])
			.config(['$resourceProvider','$httpProvider', function ($resourceProvider,$httpProvider) {
				// Don't strip trailing slashes from calculated URLs
			    //$resourceProvider.defaults.stripTrailingSlashes = false;

				/****************************************************************
				 * Fix IE8 ajax caching issue                                   *
				 ****************************************************************/
				// $httpProvider.defaults.headers.get = $httpProvider.defaults.headers.get || {};
				// $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';

			}]).factory('Activity', ['$resource', function ($resource, appConfig) {
				return $resource(
									'/data/activity',
									null, 
									{
										'getAll' 		:	{ method : 'GET' , isArray : true },
										'getOnePage'	:	{ method : 'GET' , url : '/data/activity/Search/:count/:page', params : {SearchTerm : "", Status:"", count : 5, page : 1 } },

										'getSrById' 	:	{ method : 'GET' , url : '/data/activity/ServiceRequest/:id', params : { id : 0} },
										'update' 		:	{ method : 'PUT'  },
										'create' 		:	{ method : 'POST' },
										'query'			:   { method : 'GET', url : '/data/activity/query/:activity', isArray : true},
										'myActivities'	:   { method : 'GET' , isArray : true , url : '/data/activity/myActivities/:openId' },
										'join'			:   { method : 'GET' , url : '/data/activity/join/:openId/:id' },
										'quit'			:   { method : 'GET' , url : '/data/activity/quit/:openId/:id' },
										'plus'			:   { method : 'GET' , url : '/data/activity/plus/:openId/:id' },
										'minus'			:   { method : 'GET' , url : '/data/activity/minus/:openId/:id' },
										'approve'			:   { method : 'GET' , url : '/data/activity/approve/:openId/:id' },
										'reject'			:   { method : 'GET' , url : '/data/activity/reject/:openId/:id' }
									}
								);


			}]).factory('Weixin', ['$resource', function ($resource, appConfig) {
				return $resource(
									'/weixin',
									null, 
									{
										'getConfig' 	:	{ method : 'GET' , url : '/weixin/getConfig'},
										'getCurrentUser':   { method : 'GET' , url : '/weixin/usr'}
									}
								);


			}
			]);