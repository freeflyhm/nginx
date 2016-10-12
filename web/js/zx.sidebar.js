/**
 * zx.sidebar.js
 * sidebar module for zx
**/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global $, zx */

zx.sidebar = (function(){
  'use strict';

  var
    // 静态配置值
    configMap = {
      msg_sm_html: String()
        + '<div class="sidebar-container-sm-div">'
          + '<div class="popover">'
            + '<div class="arrow"></div>'
            + '<h3 class="popover-title"></h3>'
            + '<div class="popover-content"></div>'
          + '</div>'
          + '<div style="clear:both;"></div>'
        + '</div>',
      msg_html  : String()
        + '<div class="alert-msg alert alert-dismissible" role="alert">'
          + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
          + '<a><span class="glyphicon glyphicon-warning-sign" aria-hidden="true"></span> '
            + '<span class="alert-msg-title"></span><br>'
            + '<span class="alert-msg-message"></span></a>'
        + '</div>',
      main_html : String()
        + '<div id="zx-shell-sidebar-toggle"></div>'
        + '<div id = "zx-shell-sidebar"  class="sidebar-move-left">'
          + '<div id="zx-shell-sidebar-close"><span class="glyphicon glyphicon-remove"></span></div>'
          + '<div id = "zx-shell-sidebar-container"></div>'
          + '<div style="height:100%">'
            + '<div id = "zx-shell-sidebar-container-sm" class="hidden"></div>'
            + '<div style="height:5%;">'
              + '<div id = "zx-shell-sidebar-ptop"><div></div></div>'
              + '<ul id="zx-shell-sidebar-pills" class="nav nav-pills" style="font-family: 微软雅黑;">'
                + '<li id="zx-shell-sidebar-unread" class="active zx-shell-sidebar-li" role="presentation"><span>所有未读消息</span></li>'
                //+ '<li id="zx-shell-sidebar-history-all" class="" role="presentation"><span>所有历史消息</span></li>'
                + '<li id="zx-shell-sidebar-history" class="hidden zx-shell-sidebar-li" role="presentation"><span>本单相关消息</span></li>'
              + '</ul>'
            + '</div>'
          + '</div>'
        + '</div>'
        + '<div id = "zx-shell-sidebar-open" class="closebar-move-left">'
          + '<div id ="zx-shell-sidebar-info" class="hidden"><span class="badge"></span></div>'
        + '</div>',
      settable_map : {
        people_model    : true,
        message_model   : true
      },
      people_model    : null,
      message_model   : null
    },
    // 动态状态信息
    stateMap  = {},
    // jquery对象缓存集合
    jqueryMap = {
      $container : null
    },
    // DOM METHODS
    setJqueryMap, prependMessages,
    // EVENT HANDLERS
    onComplete_getUnReadMessage, onComplete_getMessageBySmId,
    on_closeBar_click, on_openBar_click, on_sidebar_mouseenter, on_complete_socket_broadcast_message,
    // PUBLIC METHODS
    configModule, initModule;


  //--------------------- BEGIN DOM METHODS --------------------
  setJqueryMap = function () {
    var $container = stateMap.$container;

    jqueryMap.$container          = $container;
    jqueryMap.$sidebarToggle      = $('#zx-shell-sidebar-toggle');
    jqueryMap.$sidebar            = $('#zx-shell-sidebar');
    jqueryMap.$sidebarContainer   = $('#zx-shell-sidebar-container');
    jqueryMap.$sidebarContainerSm = $('#zx-shell-sidebar-container-sm');
    jqueryMap.$closeBar           = $('#zx-shell-sidebar-close');
    jqueryMap.$openBar            = $('#zx-shell-sidebar-open');
    jqueryMap.$sidebarInfo        = $('#zx-shell-sidebar-info');
    jqueryMap.$sidebarPills       = $('#zx-shell-sidebar-pills');
    jqueryMap.$sidebarUnread      = $('#zx-shell-sidebar-unread');
    jqueryMap.$sidebarHistory     = $('#zx-shell-sidebar-history');
  };

  prependMessages = function(arr){
    var i, result, $msg, messageType, title, message, url;

    for(i=0;i<arr.length;i++){
      result      = arr[i];
      $msg        = $(configMap.msg_html);
      messageType = result.action === 'update' ? 'danger' : 'info';
      title       = moment(result.createAt).format('YYYY-MM-DD HH:mm') + ' <span style="font-size:14px;font-weight:700;">' + result.fromName + '</span>：';
      message     = result.smNum + '<br>' + result.talk;
      url         = '#!page=sm&c=detail&n=' + result.sm;

      $msg
        .data('mid', result._id)
        .addClass('alert-' + messageType)
        .find('.alert-msg-title').html(title)
        .end()
        .find('.alert-msg-message').html(message)
        .end()
        .find('a').attr('href',url);

      jqueryMap.$sidebarContainer.prepend($msg);
    }
  };
  //--------------------- END DOM METHODS ----------------------
  

  //------------------- BEGIN EVENT HANDLERS -------------------
  onComplete_getUnReadMessage = function( event , result ) {
    jqueryMap.$sidebarInfo.find('span').text(result.count);
    if(result.count > 0){
      jqueryMap.$sidebarInfo.removeClass('hidden');
      prependMessages(result.messages);
    }
  };

  onComplete_getMessageBySmId = function( event , results ) {
    var arr = results.messages, 
        i, result, $msg, messageType, title, message, talk;

    jqueryMap.$sidebarContainerSm.empty();

    for(i = 0; i < arr.length; i++){
      result      = arr[i];
      $msg        = $(configMap.msg_sm_html);
      if(result.fromUserName === 'ygfw' + zx.config.getStateMapItem('city')) {
        messageType = 'left';
        title       = '<small>' + moment(result.createAt).format('YYYY-MM-DD HH:mm') + '</small><span>' + result.fromName + '</span>';
      } else {
        messageType = 'right';
        title       = '<span>' + result.fromName + '</span><small>' + moment(result.createAt).format('YYYY-MM-DD HH:mm') + '</small>';
      }

      talk        = result.talk === '' ? '修改' : result.talk;
      message     = '<small>' +  talk + '</small>';

      $msg
        .find('.popover').addClass(messageType)
        .end()
        .find('.popover-title').addClass(messageType).html(title)
        .end()
        .find('.popover-content').html(message)
        .end();

      jqueryMap.$sidebarContainerSm.append($msg);
    }

    jqueryMap.$sidebarContainerSm.append('<div style="height:30px;"><div>');
  };

  on_closeBar_click = function () {
    jqueryMap.$sidebar.removeClass('sidebar-move-right').addClass('sidebar-move-left');
    stateMap.state = 'closed'; 
  };

  on_openBar_click  = function () {
    jqueryMap.$sidebar.removeClass('sidebar-move-left').addClass('sidebar-move-right');
    stateMap.state = 'opened';
  };

  on_sidebar_mouseenter = function () {
    if(stateMap.state === 'closed'){
      jqueryMap.$sidebar.removeClass('sidebar-move-left').addClass('sidebar-move-right');
      stateMap.state = 'opened';
    }else{
      jqueryMap.$sidebar.removeClass('sidebar-move-right').addClass('sidebar-move-left');
      stateMap.state = 'closed'; 
    }
  }

  on_complete_socket_broadcast_message = function( event, results ){
    var sidebarInfoCount = Number(jqueryMap.$sidebarInfo.find('span').text());
    if(sidebarInfoCount === 0){
      jqueryMap.$sidebarInfo.removeClass('hidden');
    }
    sidebarInfoCount++;
    jqueryMap.$sidebarInfo.find('span').text(sidebarInfoCount);
    prependMessages(results);
    $('#chatAudio')[0].play(); //播放声音
  };
  //-------------------- END EVENT HANDLERS --------------------


  //------------------- BEGIN PUBLIC METHODS -------------------
  // Begin public method /configModule/
  // Purpose    : Adjust configuration of allowed keys
  // Arguments  : A map of settable keys and values
  //   * color_name - color to use
  // Settings   :
  //   * configMap.  declares allowed keys
  // Returns    : true
  // Throws     : none
  //
  configModule = function ( input_map ) {
    zx.util.setConfigMap({
      input_map    : input_map,
      settable_map : configMap.settable_map,
      config_map   : configMap
    });
    return true;
  };
  // End public method /configModule/
  
  initModule = function ( $container ) {
    // 初始化 HTML
    stateMap.$container = $container;
    $container.append( configMap.main_html );

    // 初始化状态
    stateMap.state      = 'closed';
    //console.log(configMap.people_model.get_user().userName);
    // 初始化 jqueryMap
    setJqueryMap();

    // 渲染 未读消息
    
    $.gevent.subscribe( $container, 'zx-socket-broadcast-message',    on_complete_socket_broadcast_message );
    $.gevent.subscribe( jqueryMap.$sidebar, 'zx-getUnReadMessage', onComplete_getUnReadMessage );
     $.gevent.subscribe( jqueryMap.$sidebar, 'zx-getMessageBySmId', onComplete_getMessageBySmId );
    if(configMap.people_model.get_user().userName){
      //console.log("获取未读信息");
      configMap.message_model.getUnReadMessage({ userName : configMap.people_model.get_user().userName });
    }
    
    // 绑定事件
    // 展开收缩侧边栏
    jqueryMap.$closeBar.on('click', on_closeBar_click);
    jqueryMap.$openBar.on('click',  on_openBar_click)
    jqueryMap.$sidebarToggle.on('mouseenter', on_sidebar_mouseenter);
    // 未读消息 相关消息切换
    jqueryMap.$sidebarPills.on('click','.zx-shell-sidebar-li', function(){
      var $that = $(this);

      if($that.attr('id') === 'zx-shell-sidebar-unread') {
        jqueryMap.$sidebarContainer.removeClass('hidden');
        jqueryMap.$sidebarContainerSm.addClass('hidden');
      } else {
        // 本单相关消息
        jqueryMap.$sidebarContainer.addClass('hidden');
        jqueryMap.$sidebarContainerSm.removeClass('hidden');
        jqueryMap.$sidebarContainerSm.scrollTop(jqueryMap.$sidebarContainerSm[0].scrollHeight);
      }

      $that
        .addClass('active')
        .siblings().removeClass('active');
    });

    // 点击关闭时改变未读的状态为已读
    jqueryMap.$sidebarContainer.on('click', 'button.close', function(){
      var $msg = $(this).closest('div.alert-msg'),
        sidebarInfoCount = Number(jqueryMap.$sidebarInfo.find('span').text());
      configMap.message_model.changeMessageStateTrue({ mid : $msg.data('mid'), userName : configMap.people_model.get_user().userName });
      
      if(sidebarInfoCount > 0){
        sidebarInfoCount--;
        jqueryMap.$sidebarInfo.find('span').text(sidebarInfoCount);
        if(sidebarInfoCount === 0){
          jqueryMap.$sidebarInfo.addClass('hidden');
        }
      }
    });

    // 点击 a 标签时做检测
    jqueryMap.$sidebarContainer.on('click', 'a', function(){
      var anchor_map = $.uriAnchor.makeAnchorMap();

      if(anchor_map.c === 'edit' || anchor_map.c === 'new'){
        alert('您现在处于编辑状态,\n请先退出编辑状态后再点击消息链接。')
        return false;
      }
      
    });
  };
  // End PUBLIC method /initModule/
  
  return {
    configModule : configModule,
    initModule   : initModule
  };
})();