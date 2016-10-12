/**
 * zx.data.js
 * Data module
**/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global $, io, zx */

zx.data = (function () {
  console.info('开始初始化 zx.data');
  'use strict';
  var
    _stateMap = { sio : null },
    _makeSio, 
    getSio;

  _makeSio = function (){
    var socket = io.connect(zx.config.getConfigMapItem('server'));

    // 连接成功
    socket.on('connect', function() {
      console.info('socket.on.connect');
      var cookies;

      console.log('zx.config.setCookies() in data 保险做法');
      zx.config.setCookies(); // 保险做法
      cookies = zx.config.getStateMapItem('cookies');

      // 将当前 cookies 发送给服务器
      if ( cookies.user_id !== zx.config.getConfigMapItem('anon_id') ) {
        socket.emit( 'send-cookies', cookies );
      }
    });

    // 错误
    socket.on('error', function(err) {
      //console.info('socket.on.error');
      //console.log(err.message);
    });

    // 断开
    socket.on('disconnect', function() {
      //console.info('socket.on.disconnect');
    });

    // 重新连接尝试
    socket.on('reconnect_attempt', function() {
      //console.info('socket.on.reconnect_attempt');
    });

    // 重新连接中...
    socket.on('reconnecting', function(num) {
      //console.info('socket.on.reconnecting');
      //console.log(num);
    });

    // 重新连接错误
    socket.on('reconnect_error', function(err) {
      //console.info('socket.on.reconnect_error');
      //console.log(err.message);
    });

    // 重连成功
    socket.on('reconnect', function(num) {
      //console.info('socket.on.reconnect');
      //console.log(num);
    });

    return {
      emit : function ( event_name, data, callback) {
        socket.emit( event_name, data, callback);
      },
      on   : function ( event_name, callback ) {
        socket.on( event_name, function (){
          callback( arguments );
        });
      }
    };
  };

  getSio = function (){
    console.info('zx.data.getSio();');
    if (! _stateMap.sio) {
      _stateMap.sio = _makeSio();
    }

    return _stateMap.sio;
  };

  console.info('初始化成功 zx.data');
  return {
    getSio: getSio
  };
}());