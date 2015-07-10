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
  		info = "loading";
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

// 微信jsSdk注入
laiydApp.factory('wxMethods', function($window, Activity, Weixin, loading) {
	var methods = {
		jsSdkConfig : function(callback) {
			loading.show('正在准备配置...');
			Weixin.getConfig( // 去服务器端取得配置
				{url : location.href.split('#')[0]},
				function(result) {  // 取得成功
					loading.hide();
					loading.show('正在应用配置...');
					wx.config({ // 注册配置到微信
						debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					    appId: result.appId, // 必填，公众号的唯一标识
					    timestamp: result.timestamp, // 必填，生成签名的时间戳
					    nonceStr: result.nonceStr, // 必填，生成签名的随机串
					    signature: result.signature,// 必填，签名，见附录1
					    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'openLocation', 'getLocation', 'hideOptionMenu'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2

					});
					wx.error(function(res){ // 注册失败
						loading.hide();
						$window.alert('验证失败!' + location.href.split('#')[0]);
					});
					wx.ready(function(res){ // 注册成功
						// wx.checkJsApi({
					 //      jsApiList: [
					 //        'getNetworkType',
					 //        'previewImage'
					 //      ],
					 //      success: function (res) {
					 //        alert(JSON.stringify(res));
					 //      }
					 //    });
						// wx.onMenuShareAppMessage({
						//     // title: 'test', // 分享标题
						//     // desc: 'share', // 分享描述
						//     link: location.href.split('?code')[0], // 分享链接
						//     // imgUrl: '', // 分享图标
						//     // type: '', // 分享类型,music、video或link，不填默认为link
						//     // dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
						//     success: function () { 
						//         // 用户确认分享后执行的回调函数
						//         $window.alert('分享成功!');
						//     },
						//     cancel: function () { 
						//         // 用户取消分享后执行的回调函数
						//         $window.alert('取消分享!');
						//     }
						// });
						
						
						loading.hide();
						if (callback) {
							callback();
						}
					});
				}
			);
		}
	};
	return methods;
});

