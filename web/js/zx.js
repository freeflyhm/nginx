/**
 * zx.js
 * Root namespace module
**/

/*jslint           browser : true,   continue : true,
  devel  : true,    indent : 2,       maxerr  : 50,
  newcap : true,     nomen : true,   plusplus : true,
  regexp : true,    sloppy : true,       vars : false,
  white  : true
*/
/* globals $, moment*/

var zx = (function () {
  console.info('开始初始化 zx');

  //'use strict';

  var initModule = function ($container) {
    console.info('zx.initModule();');
    var timestampBefore;
    var len;
    var i;
    var key;
    var valueLocal;

    // 删除1分钟以前的 本地储存 localstorage 440306195804100113_李小章
    if (window.localStorage) {
      timestampBefore = moment().subtract(1, 'm').valueOf(); // 1分钟前
      len = localStorage.length;
      for (i = len - 1; i > -1; i--) {
        key = localStorage.key(i);
        if (key.indexOf('_') === 18) {
          valueLocal = localStorage.getItem(key);
          try {
            if (JSON.parse(valueLocal).timestamp < timestampBefore) {
              localStorage.removeItem(key);
            }
          } catch (e) {
            console.log(e);
          }
        }
      }
    }

    zx.model.initModule();
    zx.shell.initModule($container);
  };

  console.info('初始化成功 zx');
  return { initModule: initModule };
}());

// 检查浏览器是否支持离线缓存与本地储存
if (!window.applicationCache && !window.localStorage) {
  $('body').html('<div style="text-align: center; font-size: 24px; color: red;">您的浏览器不支持离线缓存与本地储存<br>为了使您得到更好的体验，请更换新版浏览器<br>建议: <a href="https://www.baidu.com/s?wd=chrome">Chrome</a> 或者 <a href="https://www.baidu.com/s?wd=360浏览器">360浏览器</a></div>');
} else {
  // 监听 onupdateready 事件
  window.applicationCache.onupdateready = function (e) {
    if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
      //更新成功后,切换到新的缓存
      window.applicationCache.swapCache();
      if (confirm('检查到新版本，是否立即更新? \n如果选择否，应用将在下次刷新或加载时更新')) {
        window.location.reload();
      }
    }
  };

  $(document).ready(function(){
    console.info('document.ready');
    var 
      two_level_domain_name = document.location.host.split('.')[0],
      citys = zx.config.getConfigMapItem('citys');

    // 网页标题
    if (citys[two_level_domain_name]) {
      // 设置 city
      zx.config.setStateMapItem( 'city', two_level_domain_name );
      document.title = '阳光服务-' + citys[two_level_domain_name]['city'];

      // fadeOut 页面进度
      $('#loadingDiv').fadeOut();

      zx.initModule( $('#zx') );
    } else {
      $('body').html('<div style="text-align: center; font-size: 24px; color: red;">网址错误</div>');
    }
  });
}