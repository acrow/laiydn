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
									'http://www.laiyd.com/data/activity',
									null, 
									{
										'getAll' 		:	{ method : 'GET' , isArray : true },
										'getOnePage'	:	{ method : 'GET' , url : 'http://www.laiyd.com/data/activity/Search/:count/:page', params : {SearchTerm : "", Status:"", count : 5, page : 1 } },

										'getSrById' 	:	{ method : 'GET' , url : 'http://www.laiyd.com/data/activity/ServiceRequest/:id', params : { id : 0} },
										'update' 		:	{ method : 'PUT'  },
										'create' 		:	{ method : 'POST' },
										'query'			:   { method : 'GET', url : 'http://www.laiyd.com/data/activity/query/:activity', isArray : true},
										'myActivities'	:   { method : 'GET' , isArray : true , url : 'http://www.laiyd.com/data/activity/myActivities/:openId' },
										'join'			:   { method : 'GET' , url : 'http://www.laiyd.com/data/activity/join/:openId/:id' },
										'quit'			:   { method : 'GET' , url : 'http://www.laiyd.com/data/activity/quit/:openId/:id' },
										'plus'			:   { method : 'GET' , url : 'http://www.laiyd.com/data/activity/plus/:openId/:id' },
										'minus'			:   { method : 'GET' , url : 'http://www.laiyd.com/data/activity/minus/:openId/:id' },
										'approve'			:   { method : 'GET' , url : 'http://www.laiyd.com/data/activity/approve/:openId/:id' },
										'reject'			:   { method : 'GET' , url : 'http://www.laiyd.com/data/activity/reject/:openId/:id' }
									}
								);


			}]).factory('Weixin', ['$resource', function ($resource, appConfig) {
				return $resource(
									'http://www.laiyd.com/weixin',
									null, 
									{
										'getConfig' 	:	{ method : 'GET' , url : 'http://www.laiyd.com/weixin/getConfig'},
										'getCurrentUser':   { method : 'GET' , url : 'http://www.laiyd.com/weixin/usr'}
									}
								);


			}
			]);