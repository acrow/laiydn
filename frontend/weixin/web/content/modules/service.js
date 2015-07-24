// 加载时显示遮罩
laiydApp.factory("loading", ['$modal', function($modal) {

  /***********************************************************************************
   *                                                                                 *
   *  The show/hide methods call be called multiple times.                          *
   *  The loading layer will stay there when "count" is bigger than 0                *
   *                                                                                 *
      Loading sign with 50% opacity black backgrount layer.

      Usage example:
				loading.show();    //show the loading layer
				loading.hide();    //hide the loading layer
   ***********************************************************************************/
  var Spin = function(){};
  Spin.prototype.count = 0;
  Spin.prototype.show  = function(info){
  	if (!info) {
  		info = "请稍后...";
  	}
    this.count++;
    if(this.count === 1){//it hasn't been started, yet.
            this.modalInstance = $modal.open({
              template: '<div class="text-center" style="color:white;"><img src="http://www.laiyd.com/weixin/web/img/loading.gif" /><br><p>' + info + '</p></div>',
              windowClass: 'loading-with-mask',
              backdrop : 'static',
              keyboard : false,
              controller: ['$scope', '$modalInstance',function ($scope, $modalInstance) {}],
              size: 'sm'
            });
    }
  };
  Spin.prototype.hide = function(){
    this.count--;
    if(this.count === 0){
      this.modalInstance.close();
    }
  };

  Spin.prototype.close = function(){
    this.count = 0;
    this.modalInstance.close();
  };

  return new Spin();
}]);

// 加载时显示遮罩
laiydApp.factory("prompt", ['$modal', function($modal) {

  var Spin = function(){};
  Spin.prototype.count = 0;
  Spin.prototype.show  = function(info){
  	if (!info) {
  		info = "确定要继续吗？";
  	}
    this.count++;
    if(this.count === 1){//it hasn't been started, yet.
            this.modalInstance = $modal.open({
              template: '<div class="text-center" style="color:white;"><p>' + info + '</p><p><button type="button" class="btn btn-block btn-primary">确定</button><button type="button" class="btn btn-block btn-default">取消</button></p></div>',
              windowClass: 'loading-with-mask',
              backdrop : 'static',
              keyboard : false,
              controller: ['$scope', '$modalInstance',function ($scope, $modalInstance) {}],
              size: 'sm'
            });
    }
  };
  Spin.prototype.hide = function(){
    this.count--;
    if(this.count === 0){
      this.modalInstance.close();
    }
  };

  Spin.prototype.close = function(){
    this.count = 0;
    this.modalInstance.close();
  };

  return new Spin();
}]);

// 微信
laiydApp.factory('wxMethods', function($window, $q, $rootScope, Activity, Weixin, loading) {
	var methods = {
		jsConfig : function() {
			var deferred = $q.defer();
			if ($rootScope.wxOk) { // 已经成功注入的标志
				deferred.resolve('微信jsSdk注入成功');
			} else {
				// loading.show('');
				Weixin.getConfig( // 去服务器端取得配置
					{url : location.href.split('#')[0]},
					function(result) {  // 取得成功
						// loading.hide();
						// loading.show('');
						wx.config({ // 注册配置到微信
							debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						    appId: result.appId, // 必填，公众号的唯一标识
						    timestamp: result.timestamp, // 必填，生成签名的时间戳
						    nonceStr: result.nonceStr, // 必填，生成签名的随机串
						    signature: result.signature,// 必填，签名，见附录1
						    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'openLocation', 'getLocation', 'hideOptionMenu'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
						});
						wx.error(function(res){ // 注册失败
							// loading.hide();
							deferred.reject('微信jsSdk注入失败');
						});
						wx.ready(function(res){ // 注册成功
							// loading.hide();
							$rootScope.wxOk = true;
							deferred.resolve('微信jsSdk注入成功');
						});
					}
				);	
			}
			
			return deferred.promise;
		},
		getCurrentUser: function() {
			var deferred = $q.defer();
			if ($rootScope.usr) {
				deferred.resolve($rootScope.usr);
			} else {
				// loading.show('正在获取我的信息...');
				Weixin.getCurrentUser( // 取得当前用户
					{},
					function(usr) {
						// loading.hide();
						if (usr) {
							$rootScope.usr = usr;
							deferred.resolve(usr);
						} else {
							deferred.reject('用户不存在');
						}
					},
					function(err) {
						// loading.hide();
						deferred.reject('取得用户信息发生错误：' + JSON.stringify(err));
					}
				);
			}
			return deferred.promise;
		},
		getMyActivities: function(usr) {
			var deferred = $q.defer();
			// loading.show('正在检索我的活动...');
			Activity.query( // 查找当前用户相关活动
				{activity: JSON.stringify({applications : {$elemMatch : {openId : usr.openId}}})},
				function(activities) {
					// loading.hide();
					deferred.resolve(activities);
				},
				function(err) {
					// loading.hide();
					deferred.reject('取得我的活动发生错误：' + JSON.stringify(err));
				}
			);
			return deferred.promise;
		}
	};
	return methods;
});

