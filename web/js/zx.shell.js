/*
 * zx.shell.js
 * Shell module for zx
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global $, zx */

zx.shell = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  // 声明所有 zx.shell 内可用的变量
  //var plus1 = 1, plus2 = 1;
  var
    // 静态配置值
    configMap = {
      main_html : String()
        + '<div class="zx-shell-head navbar navbar-default navbar-fixed-top" role="navigation">'
          + '<div class="container">'
            + '<div class="navbar-header">'
              + '<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">'
                + '<span class="sr-only">Toggle navigation</span>'
                + '<span class="icon-bar"></span>'
                + '<span class="icon-bar"></span>'
                + '<span class="icon-bar"></span>'
              + '</button>'
              + '<a tabindex="-1" class="zx-shell-head-logo navbar-brand" href="#!page=home">阳光服务</a>'   
            + '</div>'
            + '<div class="navbar-collapse collapse">'
              + '<ul class="zx-shell-head-nav nav navbar-nav">'
                + '<li id="teamli"><a tabindex="-1" href="#!page=list&c=team&departuredate=&returndate=&n=0">团队单管理</a></li>'
                + '<li id="smli"><a tabindex="-1" href="#!page=list&c=sm&smdate=' + moment().format('YYYY-MM-DD') + '&enddate=' + moment().add(1, 'd').format('YYYY-MM-DD') + '&cp=&n=0">服务单管理</a></li>'
                + '<li id="myli" class="dropdown">' 
                  + '<a class="dropdown-toggle" href="#" data-toggle="dropdown">系统管理<span class="caret"></span></a>'
                  + '<ul class="dropdown-menu" role="menu">'
                    + '<li><a href="#!page=list&c=flag&n=0">导游旗管理</a></li>'
                    + '<li><a href="#!page=list&c=guide&n=0">地接人员管理</a></li>'                    
                    + '<li><a href="#!page=list&c=guest&n=0">收客单位管理</a></li>'
                    + '<li><a href="#!page=list&c=operator&n=0">团队操作人管理</a></li>'
                    + '<li class="divider"></li>'
                    + '<li><a href="#!page=feestemp">服务费用标准</a></li>'
                    + '<li><a href="#!page=list&c=bills">对账单列表</a></li>'
                    + '<li class="divider"></li>'
                    + '<li><a class="zx-shell-head-a-changePassword" role="button">修改密码</a></li>'
                    + '<li><a href="#!page=list&c=user&n=0">用户管理</a></li>'
                  + '</ul>'
                + '</li>'
                + '<li id="sv10li" class="dropdown">'
                  + '<a class="dropdown-toggle" href="#" data-toggle="dropdown">系统管理10<span class="caret"></span></a>'
                  + '<ul class="dropdown-menu" role="menu">'
                    + '<li><a class="zx-shell-head-a-changePassword" role="button">修改密码</a></li>'
                    + '<li class="divider"></li>'
                    + '<li><a tabindex="-1" href="#!page=workplan&c=detail">排班表</a></li>'
                    + '<li><a tabindex="-1" href="#!page=list&c=pingan&livedate=&server=&filter=2&n=0">保险卡</a></li>'
                    + '<li><a tabindex="-1" href="#!page=list&c=djp&smdate=&n=0">登机牌</a></li>'
                  + '</ul>'
                + '</li>'
                + '<li id="sv20li" class="dropdown">' 
                  + '<a class="dropdown-toggle" href="#" data-toggle="dropdown">系统管理20<span class="caret"></span></a>'
                  + '<ul class="dropdown-menu" role="menu">'
                    + '<li><a href="#!page=list&c=serverman&n=0">现场责任人</a></li>'
                    + '<li><a href="#!page=workplan&c=edit">排班表管理</a></li>'
                    + '<li class="divider"></li>'
                    + '<li><a href="#!page=list&c=bp&bpcompany=&bpmonth=&n=0">往来账管理</a></li>'
                    + '<li class="divider"></li>'
                    + '<li><a href="#!page=billsnow">应收款</a></li>'
                    + '<li><a href="#!page=list&c=billsitemised&bpmonth=">月账单列表</a></li>'
                    + '<li><a href="#!page=billstotal&bpmonth=">月账单汇总报表</a></li>'
                  + '</ul>'
                + '</li>'
                + '<li id="sv30li" class="dropdown">' 
                  + '<a class="dropdown-toggle" href="#" data-toggle="dropdown">系统管理30<span class="caret"></span></a>'
                  + '<ul class="dropdown-menu" role="menu">'  
                    + '<li><a href="#!page=list&c=setplace&n=0">集合地点管理</a></li>'
                    + '<li class="divider"></li>'
                    + '<li><a href="#!page=list&c=feestemp&n=0">服务费模板管理</a></li>'
                    + '<li class="divider"></li>'
                    + '<li><a href="#!page=list&c=dengjipai&n=0">登机牌用户管理</a></li>'
                    + '<li class="divider"></li>'
                    /*+ '<li><a href="#!page=list&c=user&n=0">用户管理</a></li>'*/
                    + '<li><a href="#!page=list&c=company&n=0">公司列表</a></li>'
                  + '</ul>'
                + '</li>'
                + '<li id="superli" class="dropdown">' 
                  + '<a class="dropdown-toggle" href="#" data-toggle="dropdown">系统设置99<span class="caret"></span></a>'
                  + '<ul class="dropdown-menu" role="menu">'  
                    + '<li><a class="zx-shell-head-a-changePassword" role="button">修改密码</a></li>'
                    + '<li class="divider"></li>'
                    + '<li><a href="#!page=list&c=company&n=0">公司管理</a></li>'
                    //+ '<li><a href="#!page=list&c=user&n=0">用户管理</a></li>'
                  + '</ul>'
                + '</li>'
              + '</ul>'
              + '<p class="zx-shell-head-navRight navbar-text navbar-right">' 
                + '<span>欢迎您，</span>'
                + '<span class="zx-shell-head-navRight-span-name"></span>'
                + '<span>&nbsp;|&nbsp;</span>'
                + '<a href="#" class="zx-shell-head-navRight-a-logout">登出</a>'
              + '</p>'
            + '</div>'
          + '</div>'
        + '</div>'
        + '<div class="zx-shell-main container"></div>'
    },    
    // 动态状态信息
    stateMap  = { 
      $container : null,                 // initModule 初始化时动态添加
      anchor_map : { 'page' : 'home' },   // 将当前锚的值保存在表示模块状态的映射中
      page       : null
    },
    // jquery对象缓存集合
    jqueryMap = {
      $container : null,
      $zx_shell  : null
    },
    // UTILITY METHODS
    copyAnchorMap,
    // DOM METHODS
    setJqueryMap, // changeAnchorPart,
    // EVENT HANDLERS
    onHashchange, onLogoutClick, onLogout, onChangePasswordClick, on_complete_lockTeam, 
    on_complete_socket_broadcast_message,// on_complete_io_lockTeam,
    // CALLBACKS
    // setPageAnchor,
    // PUBLIC METHODS
    initModule;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //-------------------- BEGIN UTILITY METHODS -----------------
  // UTILITY METHODS 中的函数不和页面元素互交
  // Returns copy of stored anchor map; minimizes overhead
  // 返回 stateMap.anchor_map 拷贝;保证最小开销
  // 
  copyAnchorMap = function () {
    //console.log(stateMap.anchor_map);
    return $.extend( true, {}, stateMap.anchor_map );
  };
  //--------------------- END UTILITY METHODS ------------------
  
  //--------------------- BEGIN DOM METHODS --------------------
  // 创建和操作页面元素的方法都放在 DOM METHODS 中
  // Begin DOM method /setJqueryMap/
  // 此方法用来缓存 jquery 对象集合,一般功能模块中都有这个函数，
  // 可以减少 jquery 对文档的遍历，提高性能；
  setJqueryMap = function () {
    var $container = stateMap.$container;
    jqueryMap = { 
      $container      : $container,
      $zx_shell       : $container.find('.zx-shell-main'), 
      $spanName       : $container.find('.zx-shell-head-navRight-span-name'),
      $aLogout        : $container.find('.zx-shell-head-navRight-a-logout'),
      $aChangePassword: $container.find('.zx-shell-head-a-changePassword'),

      $headLogo: $container.find('.zx-shell-head-logo'),
      $navRight: $container.find('.zx-shell-head-navRight'),
      $teamli  : $('#teamli'),
      $smli    : $('#smli'),
      $myli    : $('#myli'),
      $sv10li  : $('#sv10li'),
      $sv20li  : $('#sv20li'),
      $sv30li  : $('#sv30li'),
      $superli : $('#superli')
    };
  };
  // End DOM method /setJqueryMap/
  
  /*// Begin DOM method /changeAnchorPart/
  // 目的: URI的锚构件变化部分
  // 参数:
  //   * arg_map - 该地图描述我们要改变锚的哪一部分URI
  // 返回: boolean
  //   * true  - URI的锚部分被更新
  //   * false - URI的锚部分无法更新
  // 行动:
  //   当前的锚存储在 stateMap.anchor_map 中.
  //   看一下 uriAnchor 关于 encoding编码的讨论.
  //   This method 这个方法
  //     * Creates a copy of this map using copyAnchorMap().   创建 copy
  //     * Modifies the key-values using arg_map.              修改
  //     * Manages the distinction between independent         管理的独立和依赖的编码值之间的区别。
  //       and dependent values in the encoding.
  //     * Attempts to change the URI using uriAnchor.         尝试使用urianchor改变URI。
  //     * Returns true on success, and false on failure.
  //
  changeAnchorPart = function ( arg_map ) {
    //console.log('changeAnchorPart');
    var
      anchor_map_revise = copyAnchorMap(),
      bool_return       = true,
      key_name, key_name_dep;

    // Begin merge changes into anchor map
    KEYVAL:
    for ( key_name in arg_map ) {
      if ( arg_map.hasOwnProperty( key_name ) ) {

        // skip dependent keys during iteration
        if ( key_name.indexOf( '_' ) === 0 ) { continue KEYVAL; }

        // update independent key value
        anchor_map_revise[key_name] = arg_map[key_name];

        // update matching dependent key
        key_name_dep = '_' + key_name;
        if ( arg_map[key_name_dep] ) {
          anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
        }
        else {
          delete anchor_map_revise[key_name_dep];
          delete anchor_map_revise['_s' + key_name_dep];
        }
      }
    }
    // End merge changes into anchor map

    // Begin attempt to update URI; revert if not successful
    // 如果不能通过模式(schema)验证就不设置锚
    // uriAnchor 会抛出异常
    // 出现异常后将锚回滚到之前的状态
    try {
      $.uriAnchor.setAnchor( anchor_map_revise );
    }
    catch ( error ) {
      // replace URI with existing state
      $.uriAnchor.setAnchor( stateMap.anchor_map,null,true );
      bool_return = false;
    }
    // End attempt to update URI...

    return bool_return;
  };*/
  // End DOM method /changeAnchorPart/ 
  //--------------------- END DOM METHODS ----------------------

  
  //------------------- BEGIN EVENT HANDLERS -------------------
  // 事件处理
  // 
  // Begin Event handler /onHashchange/
  // 处理URI锚的变化；
  // 使用 uriAnchor插件 来将锚转换为映射，与之前的状态比较，以便确定要采用的动作
  // 如果提议的锚变化是无效的，则将锚重置为之前的值
  // 目的: Handles the hashchange event
  // 参数:
  //   * event - jQuery event object.
  // Settings : none
  // Returns  : false
  // Action   :
  //   * Parses the URI anchor component                     解析URI锚组件
  //   * Compares proposed application state with current    比较最近的应用状态
  //   * Adjust the application only where proposed state    调整应用程序只有在提出的状态不同于现有的架构允许和锚
  //     differs from existing and is allowed by anchor schema
  //
  onHashchange = function ( event ) {
    //console.log('onHashchange');
    var
      is_anon = zx.model.people.get_user().get_is_anon(),
      anchor_map_pre = copyAnchorMap(),
      anchor_map_pro, 
      anchor_map_pro_page,
      argObj={};

    $('#zx-shell-sidebar-history').removeClass('active').addClass('hidden');
    $('#zx-shell-sidebar-container-sm').addClass('hidden');
    $('#zx-shell-sidebar-unread').addClass('active');
    $('#zx-shell-sidebar-container').removeClass('hidden');
    // 销毁之前的page
    if(stateMap.page !== null){
      // 团队单解锁
      if((anchor_map_pre.page === 'team' || anchor_map_pre.page === 'sm') && anchor_map_pre.c === 'edit' && !is_anon){
        //console.log('sendLockTeam: false ' + plus1++);
        zx.model.team.lockTeam({
          user_id  : zx.model.people.get_user().user_id,
          editName : zx.model.people.get_user().name,
          isLocked : false,
          page     : anchor_map_pre.page,
          id       : anchor_map_pre.n
        });
      }

      stateMap.page.removeThis();
      stateMap.page = null;
    }

    // attempt to parse anchor 尝试解析锚
    // 如果解析不通过则返回之前的锚
    try { anchor_map_pro = $.uriAnchor.makeAnchorMap(); }
    catch ( error ) {
      alert( '一般错误\n解析锚不通过！' );
      $.uriAnchor.setAnchor( anchor_map_pre, null, true );
      return false;
    }

    if(JSON.stringify(anchor_map_pro) === "{}"){
      $.uriAnchor.setAnchor( anchor_map_pre, null, true );
      return false;
    }

    if('page' in anchor_map_pro){
      anchor_map_pro_page = anchor_map_pro.page;
      if(is_anon && anchor_map_pro_page !== 'login') {
        $.uriAnchor.setAnchor( { 'page' : 'login' }, null, true );
        return false;
      }

      if(!is_anon && anchor_map_pro_page === 'login') {
        $.uriAnchor.setAnchor( { 'page' : 'home' }, null, true );
        return false;
      }

      argObj.uid      = zx.model.people.get_user().user_id;
      argObj.company  = zx.model.people.get_user().company_id;
      argObj.role     = zx.model.people.get_user().role;
      argObj.category = zx.model.people.get_user().category;
      
      argObj.page = anchor_map_pro_page;
      argObj.c    = anchor_map_pro.c;
      argObj.n    = anchor_map_pro.n;

      switch ( argObj.page ) {
        case 'team' :
        case 'sm'   :
          // 团队单加锁 
          if(argObj.c === 'edit'){
            //console.log('sendLockTeam: true ' + plus2++);
            zx.model.team.lockTeam({
              user_id  : argObj.uid,
              editName : zx.model.people.get_user().name,
              isLocked : true,
              page     : argObj.page,
              id       : argObj.n
            });
          }

          zx.team.configModule({
            //set_team_anchor : setChatAnchor,
            people_model    : zx.model.people,
            team_model      : zx.model.team,
            sm_model        : zx.model.sm,
            list_model      : zx.model.list
          });
          zx.team.initModule( jqueryMap.$zx_shell, argObj );
          stateMap.page = zx.team;
          stateMap.anchor_map = anchor_map_pro;
          break;
        case 'list' :
          switch (argObj.c){
            case 'team':
              zx.teamlist.configModule({
                //people_model    : zx.model.people,
                list_model      : zx.model.list,
                team_model      : zx.model.team
              });
              argObj.departuredate = anchor_map_pro.departuredate;
              argObj.returndate = anchor_map_pro.returndate;
              zx.teamlist.initModule( jqueryMap.$zx_shell, argObj );
              stateMap.page = zx.teamlist;
              break;
            case 'sm':
              zx.smlist.configModule({
                people_model    : zx.model.people,
                sm_model        : zx.model.sm,
                list_model      : zx.model.list
              });
              argObj.smdate = anchor_map_pro.smdate;
              argObj.enddate = anchor_map_pro.enddate;
              argObj.cp = anchor_map_pro.cp;
              zx.smlist.initModule( jqueryMap.$zx_shell, argObj );
              stateMap.page = zx.smlist;
              break;
            case 'bp':
              argObj.bpcompany = anchor_map_pro.bpcompany;
              argObj.bpMonth = anchor_map_pro.bpmonth;
              zx.bplist.initModule( jqueryMap.$zx_shell, argObj );
              stateMap.page = zx.bplist;
              break;
            case 'company':
              zx.companylist.initModule( jqueryMap.$zx_shell, argObj );
              stateMap.page = zx.companylist;
              break;
            case 'user':
              argObj.findcompany = anchor_map_pro.findcompany;
              zx.userlist.initModule( jqueryMap.$zx_shell, argObj );
              stateMap.page = zx.userlist;
              break;
            case 'setplace':
              zx.setplacelist.initModule( jqueryMap.$zx_shell, argObj );
              stateMap.page = zx.setplacelist;
              break;
            case 'operator':
              zx.operatorlist.initModule( jqueryMap.$zx_shell, argObj );
              stateMap.page = zx.operatorlist;
              break;
            case 'guide':
              zx.guidelist.initModule( jqueryMap.$zx_shell, argObj );
              stateMap.page = zx.guidelist;
              break;
            case 'flag':
              zx.flaglist.initModule( jqueryMap.$zx_shell, argObj );
              stateMap.page = zx.flaglist;
              break;
            case 'serverman':
              zx.servermanlist.initModule( jqueryMap.$zx_shell, argObj );
              stateMap.page = zx.servermanlist;
              break;
            case 'guest':
              zx.guestlist.initModule( jqueryMap.$zx_shell, argObj );
              stateMap.page = zx.guestlist;
              break;
            case 'feestemp':
              zx.feestemplist.initModule( jqueryMap.$zx_shell, argObj );
              stateMap.page = zx.feestemplist;
              break;
            case 'pingan':
              argObj.livedate = anchor_map_pro.livedate;
              argObj.server   = anchor_map_pro.server;
              argObj.filter   = anchor_map_pro.filter;
              
              zx.pinganlist.initModule( jqueryMap.$zx_shell, argObj );
              stateMap.page = zx.pinganlist;
              break;
            case 'dengjipai':
              zx.dengjipailist.initModule( jqueryMap.$zx_shell, argObj );
              stateMap.page = zx.dengjipailist;
              break;
            case 'djp':
              argObj.smdate = anchor_map_pro.smdate;
              zx.djplist.initModule( jqueryMap.$zx_shell, argObj );
              stateMap.page = zx.djplist;
              break;
            case 'billsitemised':
              argObj.bpmonth = anchor_map_pro.bpmonth;
              zx.billsitemisedlist.initModule( jqueryMap.$zx_shell, argObj );
              stateMap.page = zx.billsitemisedlist;
              break;
            case 'bills':
              zx.billslist.initModule( jqueryMap.$zx_shell, argObj );
              stateMap.page = zx.billslist;
              break;
            default  :
              alert( '一般错误\n目标页面不存在！' );
              $.uriAnchor.setAnchor( anchor_map_pre, null, true );
          }
          stateMap.anchor_map = anchor_map_pro;
          break;
        case 'home' :
          zx.home.initModule( jqueryMap.$zx_shell );
          stateMap.page = zx.home;
          stateMap.anchor_map = anchor_map_pro;
          break;
        case 'workplan' :
          zx.workplan.initModule( jqueryMap.$zx_shell, argObj );
          stateMap.page = zx.workplan;
          stateMap.anchor_map = anchor_map_pro;
          break;
        case 'login':
          // configure and initialize feature modules
          zx.login.configModule({
            people_model    : zx.model.people
          });
          zx.login.initModule( jqueryMap.$zx_shell );
          stateMap.page = zx.login;
          stateMap.anchor_map = anchor_map_pro;
          break;
        case 'feestemp':
          zx.feestemp.configModule({
            people_model    : zx.model.people
          });
          zx.feestemp.initModule( jqueryMap.$zx_shell );
          stateMap.page = zx.feestemp;
          stateMap.anchor_map = anchor_map_pro;
          break;
        /*case 'online':
          if(argObj.c === '553a7e3550a9a8be26e8f052553a4decf2fd60fc0b8d60f8'){
            console.log(argObj.c);
            zx.model.people.online_kickUser();
          } else {
            zx.online.initModule( jqueryMap.$zx_shell );
            stateMap.page = zx.online;
            stateMap.anchor_map = anchor_map_pro;
          }
          break;*/
        case 'billsitemised':
          argObj.bpcompany = anchor_map_pro.bpcompany;
          argObj.bpMonth = anchor_map_pro.bpmonth;
          zx.billsitemised.initModule( jqueryMap.$zx_shell, argObj );
          stateMap.page = zx.billsitemised;
          stateMap.anchor_map = anchor_map_pro;
          break;
        case 'statement':
          argObj.bpcompany = anchor_map_pro.company;
          argObj.bpmonth = anchor_map_pro.month;
          zx.statement.initModule( jqueryMap.$zx_shell, argObj );
          stateMap.page = zx.statement;
          stateMap.anchor_map = anchor_map_pro;
          break;
        case 'billsnow':
          zx.billsnow.initModule( jqueryMap.$zx_shell, argObj );
          stateMap.page = zx.billsnow;
          stateMap.anchor_map = anchor_map_pro;
          break;
        case 'billstotal':
          argObj.bpMonth = anchor_map_pro.bpmonth;
          zx.billstotal.initModule( jqueryMap.$zx_shell, argObj );
          stateMap.page = zx.billstotal;
          stateMap.anchor_map = anchor_map_pro;
          break;
        case 'getusers' :
          zx.getusers.initModule( jqueryMap.$zx_shell );
          stateMap.page = zx.getusers;
          stateMap.anchor_map = anchor_map_pro;
          break;
        default  :
          alert( '一般错误\n目标页面不存在！' );
          $.uriAnchor.setAnchor( anchor_map_pre, null, true );
      }

      return false;
    }

    alert( '一般错误\n目标页面不存在！' );
    $.uriAnchor.setAnchor( anchor_map_pre, null, true );
    return false;
  };
  // End Event handler /onHashchange/

  // Begin Event handler /onLogoutClick/
  onLogoutClick = function ( event ) {
    var uid = zx.model.people.get_user().user_id;
    zx.model.people.logout(uid);
    return false;
  };
  // End Event handler /onLogoutClick/

  // Begin Event handler /onLogout/
  onLogout = function ( event ) {
    //console.log('onLogout');
    $.uriAnchor.setAnchor( { 'page' : 'login' }, null, true );
    zx.util_b.delCookies();

    // 清除消息
    $('#zx-shell-sidebar-container').empty();
    $('#zx-shell-sidebar-info')
      .addClass('hidden')
      .find('span').text(0);
    //location.reload(true);
  }; 
  // End Event handler /onLogout/ 

  /*onLine = function ( event ) {
    console.log('onLine');
    //$.uriAnchor.setAnchor( { 'page' : 'online' }, null, true );
  }; */

  onChangePasswordClick  = function ( event ) {
    var id = zx.model.people.get_user().user_id;

    zx.modal.initModule({
      size      : 'modal-sm',
      $title    : $('<h4 class="modal-title">修改密码</h4>'),
      formClass : 'form-changePassword',
      main_html : String()
        + '<input value="' + id + '" name="user[_id]" type="hidden"></input>'
        + '<div class="form-group">'
          + '<label class="col-sm-4 control-label">*旧密码</label>'
          + '<div class="col-sm-8">'
            + '<input tabindex="1" name="user[password_old]" class="form-control" type="password" placeholder="6~20位长度" required autofocus></input>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-4 control-label">*新密码</label>'
          + '<div class="col-sm-8">'
            + '<input tabindex="1" name="user[password]" class="form-control" type="password" placeholder="6~20位长度" required></input>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-4 control-label">*确认密码</label>'
          + '<div class="col-sm-8">'
            + '<input tabindex="2" name="user[password_re]" class="form-control" type="password" placeholder="同密码" required></input>'
          + '</div>'
        + '</div>'
        + '<div class="zx-form-errors"></div>',
      callbackFunction : function(modalJqueryMap){
        var fieldArr,fieldObj = {},userObj = {};
        modalJqueryMap.$submitBtn
          .text( '正在修改密码...' )
          .attr( 'disabled', true );
        modalJqueryMap.$cancelBtn.attr( 'disabled', true );
        fieldArr = modalJqueryMap.$modalForm.serializeArray();
        $.each(fieldArr,function(){
          fieldObj[this.name] = this.value;
        });

        userObj._id          = fieldObj['user[_id]'];
        userObj.password_old = fieldObj['user[password_old]'];
        userObj.password     = fieldObj['user[password]'];        // 用户权限

        zx.model.people.changePassword(userObj);
      }
    });

    return false;
  };

  on_complete_socket_broadcast_message = function( event,results ){

    var result = results[0],
        messageType = result.action === 'update' ? 'danger' : 'info';
    //console.log(result.action);
    $.notify({
      // options
      icon: 'glyphicon glyphicon-warning-sign',
      title: moment(result.createAt).format('YYYY-MM-DD HH:mm') + ' <span style="font-size:14px;font-weight:700;">' + result.fromName + '</span>：',
      message: '修改了 ' + result.smNum + '<br>' + result.talk,
      //url: '/#!page=sm&c=detail&n=' + result.sm,
      target: '_self'
    },{
      // settings
      //element: '#zx-shell-sidebar-container',
      type: messageType,
      placement: {
          from: "bottom",
          align: "cen"
        },
      allow_dismiss: false,
      newest_on_top: true,
      offset: 50,
      spacing: 3,
      delay: 3000,
      /*onClosed: function(){
        console.log('已读');
        // 这里将 toUsers.status 改为 true; 表示已读
      },*/
      template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
        '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
        '<span data-notify="icon"></span> ' +
        '<span data-notify="title">{1}</span><br>' +
        '<span data-notify="message">{2}</span>' +
        '<div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
        '</div>' +
        '<a href="{3}" target="{4}" data-notify="url"></a>' +
      '</div>' 
    });
    
  };

  on_complete_lockTeam = function( event, result ) {
    //console.log(result);
  };

  /*on_complete_io_lockTeam = function( event, result ) {
    console.log(result);
  };*/
  //-------------------- END EVENT HANDLERS --------------------

  //---------------------- BEGIN CALLBACKS ---------------------
  // 回调函数 setTeamAnchor 给 Team 提供请求更改 URI 的安全方法
  // Begin callback method /setTeamAnchor/
  // Example  : setTeamAnchor( 'closed' );
  // Purpose  : Change the team component of the anchor
  // Arguments:
  //   * position_type - may be 'closed' or 'opened'
  // Action   :
  //   Changes the URI anchor parameter 'team' to the requested
  //   value if possible.
  // Returns  :
  //   * true  - requested anchor part was updated
  //   * false - requested anchor part was not updated
  // Throws   : none
  //
  /*setTeamAnchor = function ( position_type ){
    console.log('setTeamAnchor');
    return changeAnchorPart({ team : position_type });
  };*/
  // End callback method /setTeamAnchor/
  //----------------------- END CALLBACKS ----------------------

  //------------------- BEGIN PUBLIC METHODS -------------------
  // Begin Public method /initModule/
  // 初始化模块 公开方法
  // Example  : zx.shell.initModule( $('#app_div_id') );
  // Purpose  :
  //   Directs the Shell to offer its capability to the user
  // Arguments :
  //   * $container (example: $('#app_div_id')).
  //     A jQuery collection that should represent 
  //     a single DOM container
  // Action    :
  //   Populates $container with the shell of the UI
  //   and then configures and initializes feature modules.
  //   The Shell is also responsible for browser-wide issues
  //   such as URI anchor and cookie management.
  // Returns   : none 
  // Throws    : none
  //
  initModule = function ( $container ) {
    // 初始化 HTML
    stateMap.$container = $container;
    $container.html( configMap.main_html );
    // 初始化 jqueryMap
    setJqueryMap();
    // 插入侧边栏模块
    // 配置
    zx.sidebar.configModule({
      people_model  : zx.model.people,
      message_model : zx.model.message
    });
    // 初始化
    zx.sidebar.initModule($container);

    jqueryMap.$spanName.text(zx.model.people.get_user().name);

    $.gevent.subscribe( $container, 'zx-logout', onLogout );
    $.gevent.subscribe( $container, 'zx-lockTeam', on_complete_lockTeam );
    $.gevent.subscribe( $container, 'zx-socket-broadcast-message',    on_complete_socket_broadcast_message );

    jqueryMap.$aLogout.bind( 'click', onLogoutClick );
    jqueryMap.$aChangePassword.bind( 'click', onChangePasswordClick );

    if(!zx.model.people.get_user().get_is_anon()){

      // 设置导航条显示隐藏
      zx.util_b.setHeaderNav({
        user      : zx.model.people.get_user(),
        jqueryMap : jqueryMap
      });
    }

    // 通知
    //console.log(zx.util_b.getCookie('notNotify060525'));
    /*if (zx.util_b.getCookie('notNotify060525') !== 'yes') {
      var notify_html = String() +
        '<div class="alert alert-success" style="position: fixed; left: 25%; top: 15%; width: 50%;" role="alert">' +
          '<button id="notifyCloseBtn" type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
          '<div class="checkbox" style="width: 150px;">' +
            '<label>' +
              '<input id="notifyCheckbox" type="checkbox"> 以后不再显示此提示' +
            '</label>' +
          '</div>' +
          '<div>' +
            '<h4><strong>重大好消息！！（<span style="color: red; font-size:24px; font-weight: 800; font-family: Microsoft YaHei"> <em>身份验证</em> </span>功能升级）</strong></h4>' +
            '<h5>尊敬的客户，您好！</h5>' +
            '<p style="font-size: 14px;">我们的操作系统现可提供“身份验证”功能。用户可以验证每位客人（使用大陆身份证的）的姓名和身份证号码是否有错误。</p>' +
            '<p style="font-size: 14px;">此功能将为您的工作会带来极大的便利，极大程度的减少您消耗在错姓名错证件号上的精力和财力，让您不用常常在休息的时候被电话吵醒，心惊胆战的处理票务问题。把更多的时间和精力用在其他重要的事情上。</p>' +
            '<p style="font-size: 14px;">为保证稳定性和准确性，此功能将是收费项目，标准是1元/人次。同时，我们将做如下承诺：</p>' +
            '<p style="font-size: 16px;"><strong><em>由我们阳光服务团队提供送机服务的客人，<br>如果验证结果有误，后续产生的改票费用全部由我们承担。</em></strong></p>' +
            '<p style="font-size: 14px;">暑期将至，又到了我们一年最忙碌的季节。希望此功能和我们阳光机场服务团队的工作可以为您带来一点轻松，一丝凉意。</p>' +
            '<p style="font-size: 14px;">最后祝所有客户生意兴隆！暑期快乐！</p>' +
            '<p style="text-align: right;">机场阳光服务团队上</p>' +
            '<p style="text-align: right;">2016-05-26</p>' +
          '</div>' +
        '</div>';
      $('body').append(notify_html);
      $('#notifyCloseBtn').on('click', function () {
        if ($('#notifyCheckbox').prop('checked')) {
          zx.util_b.setCookie('notNotify060525', 'yes', 30);
        }
      });
    }*/

    // 绑定 jquery hashchange 事件并立即触发
    $(window)
      .bind( 'hashchange', onHashchange )
      .trigger( 'hashchange' );
  };
  // End PUBLIC method /initModule/

  // return public methods
  return { 
    initModule : initModule
  };
  //------------------- END PUBLIC METHODS ---------------------
}());