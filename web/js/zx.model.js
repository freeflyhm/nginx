/**
 * zx.model.js 
 * Model module
**/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global TAFFY, $, zx */

zx.model = (function () {
  console.info('开始初始化 zx.model');
  'use strict';
  var
    // 静态配置值
    configMap = {}, // 给匿名用户保留一个特殊ID
    // 动态状态信息
    stateMap  = {
      anon_user        : null,    // 保存匿名用户 people 对象
      user             : null,    // 当前登录用户
      //people_id_map    : {},      // key-value 键值对 person 对象映射，键为 id
      //people_db        : TAFFY(), // people 数据库,初始化为空集合
      myfeestemp       : {},
      bp_companysArr   : null,
      bp_companysObj   : null,
      bp_companysIdObj : null
    },

    //isFakeData = false,         // 切换fake测试数据和data真实数据，true:测试数据
    //sio = isFakeData ? zx.fake.mockSio : zx.data.getSio(),
    sio = zx.data.getSio(),
    // private
    objectCreate,
    personProto, completeRegister, complete_somebody_online, complete_socket_broadcast_kickUser, 
    complete_login, complete_logout, makePerson, //clearPeopleDb,
    complete_changeFeesTemp,
    complete_getMyFeesTempFromSV, complete_getFeesTemp, complete_updateItemFeesTemp, complete_newItemFeesTemp,
    complete_updateFeesTemp, completeUpdateCompany, completeNewUser, completeUpdateUser, 
    completeChangePassword, completeResetPassword, completeChangeStatus, completeSetSendSetTime, 
    completeSetDefaultFlag, complete_setThSetStr,
    //complete_onlineKickUser,
    completeGetlist,

    completeNewFlag,     completeUpdateFlag,     completeDeleteFlag, completeFindOneByCompanyFlag,
    completeNewServerman,     completeUpdateServerman,     completeDeleteServerman,
    completeNewGuide,    completeUpdateGuide,    completeDeleteGuide,
    completeNewOperator, completeUpdateOperator, completeDeleteOperator,
    completeNewGuest, completeUpdateGuest, completeDeleteGuest,

    complete_getUnReadMessage, complete_getMessageBySmId,

    complete_getObjectIdFromServer,    complete_getFlightInfoFromServer, complete_saveTeam, complete_saveTeamWithMessage,
    complete_getTeamById,              complete_deleteTeam,              complete_downloadTeam, 
    complete_lockTeam,                 complete_socket_broadcast_lockTeam, //complete_io_lockTeam,             
    complete_socket_broadcast_delTeam, complete_socket_broadcast_delSm, complete_socket_broadcast_message,
    
    complete_newOrAddSm, complete_getSmById, complete_saveSm, complete_saveSmWithMessage,
    complete_changeSmStatus, complete_changePhoneMsgStatus, complete_changeServerMan, 
    complete_changeAddFees, complete_changeCarFees, complete_changeInsurance, complete_changeSatisfaction,
    complete_downloadSm, complete_alidayuSm,

    completeNewBp, completeUpdateBp, completeDeleteBp, completegetbillsitemised, completegetbillstotal, completegetbillsnow,
    completestatementNew, completegetstatement, completedeleteStatement, completelockStatement,

    complete_getworkplan, complete_saveworkplan, complete_delworkplan,

    complete_getServerManCards, 
    complete_Step_1_2_downloadImg, complete_Step_1_5_postData,
    complete_changeServerMan_pingan, complete_updatePingan,

    completeNewDengjipai,     completeUpdateDengjipai,     completeDeleteDengjipai,
    complete_setName, complete_getusers,
    // public
    people, feestemp, team, sm, list, flag, serverman, guide, operator, guest, message, workplan,
    dengjipai, djp, getusers,
    // 账单 保险 验证身份证
    bp, pingan, idcard,
    initModule;

  objectCreate = function (arg) {
    if( !arg ) { return {};}
    function obj () {};
    obj.prototype = arg;
    return new obj;
  };

  // The people object API
  // ---------------------
  // The people object is available at zx.model.people.
  // The people object provides methods and events to manage
  // a collection of person objects. Its public methods include:
  //   * get_user() - return the current user person object.
  //     If the current user is not signed-in, an anonymous person
  //     object is returned.
  //   * get_db() - return the TaffyDB database of all the person
  //     objects - including the current user - presorted.
  //   * get_by_cid( <client_id> ) - return a person object with
  //     provided unique id.
  //   * login( <user_name> ) - login as the user with the provided
  //     user name. The current user object is changed to reflect
  //     the new identity. Successful completion of login
  //     publishes a 'zx-login' global custom event.
  //   * logout()- revert the current user object to anonymous.
  //     This method publishes a 'zx-logout' global custom event.
  //
  // jQuery global custom events published by the object include:
  //   * zx-login - This is published when a user login process
  //     completes. The updated user object is provided as data.
  //   * zx-logout - This is published when a logout completes.
  //     The former user object is provided as data.
  //
  // Each person is represented by a person object.
  // Person objects provide the following methods:
  //   * get_is_user() - return true if object is the current user
  //   * get_is_anon() - return true if object is anonymous
  //
  // The attributes for a person object include:
  //   * cid - string client id. This is always defined, and
  //     is only different from the id attribute
  //     if the client data is not synced with the backend.
  //   * id - the unique id. This may be undefined if the
  //     object is not synced with the backend.
  //   * name - the string name of the user.
  //   * css_map - a map of attributes used for avatar
  //     presentation.
  //
  personProto = {
    // people 是不是当前用户
    get_is_user : function () {
      return this.user_id === stateMap.user.user_id;
    },
    // people 是不是匿名用户
    get_is_anon : function () {
      return this.user_id === stateMap.anon_user.user_id;
    }
  };
  // 完成注册
  completeRegister = function ( results ) {
    var result = results[0];
    $.gevent.publish( 'zx-register', [ result ] );
  };
  // 完成登录
  complete_login = function ( user_list ) {
    //console.log(user_list);
    var person_map  = user_list[ 0 ];

    if(person_map.success === 1){
      stateMap.user = makePerson({
        //service     : person_map.session_user.service,
        feestemp    : person_map.session_user.feestemp,
        user_id     : person_map.session_user.user_id,
        category    : person_map.session_user.category,
        company_id  : person_map.session_user.company_id,
        userName    : person_map.session_user.userName,
        name        : person_map.session_user.name,
        role        : person_map.session_user.role,
        companyAbbr : person_map.session_user.companyAbbr,
        sendSetTime : person_map.session_user.sendSetTime,
        phone       : person_map.session_user.phone,
        thSetStr    : person_map.session_user.thSetStr,
        defaultFlag : person_map.session_user.defaultFlag
      });
    }

    // 异步请求收费标准并缓存到stateMap.myfeestemp中;
    feestemp.getMyFeesTempFromSV({
      company_id : stateMap.user.company_id,
      categoty   : stateMap.user.category,    
      feestemp   : stateMap.user.feestemp
    });

    $.gevent.publish( 'zx-login', person_map );
  };

  complete_somebody_online = function () {
    //console.log('complete_somebody_online');

    var r=confirm("您的账号已经有人登录\n是否需要踢人");
    if (r===true)
    {
      zx.model.people.online_kickUser();
      //document.write("You pressed OK!")
      //$.uriAnchor.setAnchor( { 'page' : 'home' }, null, true );
    } else {
      $.uriAnchor.setAnchor( { 'page' : 'login' }, null, true );
    }
    //$.uriAnchor.setAnchor( { 'page' : 'online' }, null, true );
    //$.gevent.publish( 'zx-onlineonline');
  };

  // 强制下线
  complete_socket_broadcast_kickUser = function (uid) {
    var user;

    if(stateMap.user.user_id === uid[0]){
      user = stateMap.user;
      stateMap.user = stateMap.anon_user;
      //clearPeopleDb();
      alert("您的账号已在另一个地方登录,\n即将离开此页面。")
      $.gevent.publish( 'zx-logout');
    }
  };

  // 完成登出
  complete_logout = function ( results ) {
    var result = results[0], user;
    //console.log(result);
    // 已检验
    if(result.success === 1 && result.uid === stateMap.user.user_id){
      user = stateMap.user;
      stateMap.user = stateMap.anon_user;
      //clearPeopleDb();

      $.gevent.publish( 'zx-logout');
    }
  };

  complete_changeFeesTemp = function(results){
    $.gevent.publish( 'zx-changeFeesTemp', results );
  };

  makePerson = function ( person_map ) {
    var 
      person,
      //service     = person_map.service,
      feestemp    = person_map.feestemp,
      user_id     = person_map.user_id,
      category    = person_map.category,
      company_id  = person_map.company_id,
      userName    = person_map.userName,
      name        = person_map.name,
      role        = person_map.role,
      companyAbbr = person_map.companyAbbr,
      sendSetTime = person_map.sendSetTime,
      phone       = person_map.phone,
      thSetStr    = person_map.thSetStr,
      defaultFlag = person_map.defaultFlag;

    if ( user_id === undefined || ! name ) {
      throw 'client id and name required';
    }

    Object.create = Object.create || objectCreate;

    person             = Object.create( personProto );
    //person.service     = service;
    person.feestemp    = feestemp;
    person.user_id     = user_id;
    person.category    = category;
    person.company_id  = company_id;
    person.userName    = userName;
    person.name        = name;
    person.role        = role;
    person.companyAbbr = companyAbbr;
    person.sendSetTime = sendSetTime;
    person.phone       = phone;
    person.thSetStr    = thSetStr;
    person.defaultFlag = defaultFlag;

    //stateMap.people_id_map[ user_id ] = person;
    //stateMap.people_db.insert( person );
    return person;
  };

  /*clearPeopleDb = function () {
    var user = stateMap.user;
    stateMap.people_db      = TAFFY();
    stateMap.people_id_map = {};
    if ( user ) {
      stateMap.people_db.insert( user );
      stateMap.people_id_map[ user.id ] = user;
    }
  };*/

  completeUpdateCompany = function( result ){
    $.gevent.publish( 'zx-updateCompany', result );
  };

  completeNewUser = function(result){
    $.gevent.publish( 'zx-newUser', result );
  };

  completeUpdateUser = function( result ){
    $.gevent.publish( 'zx-updateUser', result );
  };

  completeChangePassword = function( result ){
    $.gevent.publish( 'zx-changePassword', result );
  };

  completeResetPassword = function( result ){
    $.gevent.publish( 'zx-resetPassword', result );
  };

  completeChangeStatus = function( result ){
    $.gevent.publish( 'zx-changeStatus', result );
  };

  completeSetSendSetTime = function( results ){
    var result = results[0];
    //console.log(result);
    // 已检验
    if(result.success.ok === 1){
      // 改 cookie 改 stateMap.user.sendSetTime
      zx.util_b.setCookie('sendSetTime', result.sendSetTime, 2);
      stateMap.user.sendSetTime = result.sendSetTime;
    }
    
    $.gevent.publish( 'zx-setSendSetTime', result );
  };

  completeSetDefaultFlag = function( results ){
    var result = results[0];
    //console.log(result);
    // 已检验
    if(result.success.ok === 1){
      // 改 cookie 改 stateMap.user.sendSetTime
      zx.util_b.setCookie('defaultFlag', result.defaultFlag, 2);
      stateMap.user.defaultFlag = result.defaultFlag;
    }
    
    $.gevent.publish( 'zx-setDefaultFlag', result );
  };

  complete_setThSetStr = function( results ) {
    var result = results[0];
    //console.log(result);
    // 已检验
    if(result.success.ok === 1){
      // 改 cookie 改 stateMap.user.thSetStr
      zx.util_b.setCookie('thSetStr', result.thSetStr, 2);
      stateMap.user.thSetStr = result.thSetStr;
    }
    
    $.gevent.publish( 'zx-setThSetStr', result );
  };

  people = (function(){
    var 
      //get_by_id, get_db, 
      get_user, register, login, logout, getMyFeesTemp, changeFeesTemp, changeIsidcard,
      updateCompany, newUser, updateUser, 
      changePassword, resetPassword, changeStatus, setSendSetTime, setThSetStr, 
      setDefaultFlag, online_kickUser;

    sio.on( 'on-somebody-online',           complete_somebody_online           );
    sio.on( 'on-socket-broadcast-kickUser', complete_socket_broadcast_kickUser );
    sio.on( 'on-login',                     complete_login                     );
    sio.on( 'on-register',                  completeRegister                   );
    sio.on( 'on-logout',                    complete_logout                    );
    //sio.on( 'on-getMyFeesTempFromSV',       complete_getMyFeesTempFromSV       );
    //sio.on( 'on-getFeesTemp',               complete_getFeesTemp               );
    //sio.on( 'on-updateItemFeesTemp',        complete_updateItemFeesTemp        );
    sio.on( 'on-changeFeesTemp',            complete_changeFeesTemp            );
    sio.on( 'on-updateCompany',             completeUpdateCompany              );
    sio.on( 'on-newUser',                   completeNewUser                    );
    sio.on( 'on-updateUser',                completeUpdateUser                 );
    sio.on( 'on-changePassword',            completeChangePassword             );
    sio.on( 'on-resetPassword',             completeResetPassword              );
    sio.on( 'on-changeStatus',              completeChangeStatus               );
    sio.on( 'on-setSendSetTime',            completeSetSendSetTime             );
    sio.on( 'on-setDefaultFlag',            completeSetDefaultFlag             );
    sio.on( 'on-setThSetStr',               complete_setThSetStr               );
    //sio.on( 'on-onlineKickUser',            complete_onlineKickUser            );

    /*get_by_id = function ( user_id ) {
      return stateMap.people_id_map[ user_id ];
    };*/

    //get_db = function () { return stateMap.people_db; };

    get_user = function () { return stateMap.user; };

    register = function (obj) {
      sio.emit( 'emit-register', obj);
    };

    login = function ( userObj ) {
      sio.emit( 'emit-login', userObj);
    };

    logout = function (uid) {
      //console.log('logout');
      sio.emit( 'emit-logout', uid);
    };

    getMyFeesTemp = function (company_id) {
      var tmp;

      if(stateMap.myfeestemp.company_feesname_obj){
        tmp = stateMap.myfeestemp.company_feesname_obj[company_id];

      //console.log(tmp);
      //console.log(stateMap.myfeestemp.feesname_fees_obj[tmp]);

        return stateMap.myfeestemp.feesname_fees_obj[tmp];
      }
     
      return null;
    };

    changeFeesTemp = function(obj){
      sio.emit( 'emit-changeFeesTemp', obj);
    };

    changeIsidcard = function(obj, callback) {
      sio.emit( 'emit-changeIsidcard', obj, function(results) {
        callback(results);
      });
    };

    updateCompany = function(obj){
      sio.emit( 'emit-updateCompany', obj);
    };

    newUser = function(obj){
      sio.emit( 'emit-newUser', obj);
    };

    updateUser = function(obj){
      sio.emit( 'emit-updateUser', obj);
    };

    changePassword = function(obj){
      sio.emit( 'emit-changePassword', obj);
    };

    resetPassword = function(obj){
      sio.emit( 'emit-resetPassword', obj);
    };

    changeStatus = function(obj){
      sio.emit( 'emit-changeStatus', obj);
    };

    setSendSetTime = function(obj){
      sio.emit( 'emit-setSendSetTime', obj);
    };

    setThSetStr = function(obj){
      sio.emit( 'emit-setThSetStr', obj);
    };

    setDefaultFlag = function(obj){
      sio.emit( 'emit-setDefaultFlag', obj);
    };

    online_kickUser = function(){
      //console.log('online_kickUser------------------------------------');
      //console.log(zx.util_b.getCookies());
      sio.emit( 'emit-onlineKickUser', zx.util_b.getCookies());
    };

    return {
      //get_by_id           : get_by_id,
      //get_db              : get_db,
      get_user            : get_user,
      register            : register,
      login               : login,
      logout              : logout,
      getMyFeesTemp       : getMyFeesTemp,
      //getMyFeesTempFromSV : getMyFeesTempFromSV,
      //getFeesTemp         : getFeesTemp,
      //updateItemFeesTemp  : updateItemFeesTemp,
      changeFeesTemp      : changeFeesTemp,
      changeIsidcard      : changeIsidcard,
      updateCompany       : updateCompany,
      newUser             : newUser,
      updateUser          : updateUser,
      changePassword      : changePassword,
      resetPassword       : resetPassword,
      changeStatus        : changeStatus,
      setSendSetTime      : setSendSetTime,
      setThSetStr         : setThSetStr,
      setDefaultFlag      : setDefaultFlag,
      online_kickUser     : online_kickUser
    };
  }());
  
  complete_getMyFeesTempFromSV = function ( results ) {
    //console.log(results[0]);
    /*var svfeestemp = results[0].svfeestemp,
        mefeestemp = results[0].mefeestemp,
        myfeestemp = {}, t, i;

    //console.log(svfeestemp);
    //console.log(mefeestemp);
    if(svfeestemp){
      for ( i = 1; i < 9; i++){
        t = {};
        t.basStepPrice = svfeestemp['t' + i].basStepPrice + mefeestemp['t' + i].basStepPrice;
        t.basMaxPrice = svfeestemp['t' + i].basMaxPrice + mefeestemp['t' + i].basMaxPrice;
        t.addStartTime = svfeestemp['t' + i].addStartTime;
        t.addEndTime = svfeestemp['t' + i].addEndTime;
        t.addPrice = svfeestemp['t' + i].addPrice + mefeestemp['t' + i].addPrice;
        t.putPersonNum = svfeestemp['t' + i].putPersonNum + mefeestemp['t' + i].putPersonNum;
        t.putPrice = svfeestemp['t' + i].putPrice + mefeestemp['t' + i].putPrice;

        myfeestemp['t' + i] = t;
      }

      stateMap.myfeestemp = myfeestemp;
      //console.log(stateMap.myfeestemp);
      //$.gevent.publish( 'zx-getMyFeesTempFromSV', myfeestemp );
    }*/

    stateMap.myfeestemp.company_feesname_obj = results[0].company_feesname_obj;
    stateMap.myfeestemp.feesname_fees_obj    = results[0].feesname_fees_obj;

    $.gevent.publish( 'zx-getMyFeesTempFromSV');
  };

  complete_updateFeesTemp = function( result ) {
    $.gevent.publish( 'zx-updateFeesTemp', result );
  };

  complete_updateItemFeesTemp = function( result ){
    $.gevent.publish( 'zx-updateItemFeesTemp', result );
  };

  complete_newItemFeesTemp = function( result ) {
    $.gevent.publish( 'zx-newItemFeesTemp', result );
  };

  complete_getFeesTemp = function ( result ) {
    //console.log(result);
    $.gevent.publish( 'zx-getFeesTemp', result );
  };


  feestemp = (function() {
    var getMyFeesTempFromSV, updateFeesTemp, updateItemFeesTemp, newItemFeesTemp, getFeesTemp;

    sio.on( 'on-getMyFeesTempFromSV',       complete_getMyFeesTempFromSV       );
    sio.on( 'on-updateFeesTemp',            complete_updateFeesTemp            );
    sio.on( 'on-updateItemFeesTemp',        complete_updateItemFeesTemp        );
    sio.on( 'on-newItemFeesTemp',           complete_newItemFeesTemp           );
    sio.on( 'on-getFeesTemp',               complete_getFeesTemp               );

    getMyFeesTempFromSV = function(obj){
      sio.emit( 'emit-getMyFeesTempFromSV', obj);
    };

    updateFeesTemp = function(obj){
      sio.emit( 'emit-updateFeesTemp', obj);
    };

    updateItemFeesTemp = function (obj){
      sio.emit( 'emit-updateItemFeesTemp', obj);
    };

    newItemFeesTemp = function(obj){
      sio.emit( 'emit-newItemFeesTemp', obj);
    }

    getFeesTemp = function () {
      sio.emit( 'emit-getFeesTemp');
    }

    return {
      getMyFeesTempFromSV : getMyFeesTempFromSV,
      updateFeesTemp      : updateFeesTemp,
      updateItemFeesTemp  : updateItemFeesTemp,
      newItemFeesTemp     : newItemFeesTemp,
      getFeesTemp         : getFeesTemp
    };
  }());

  // The team object API
  // ---------------------
  // team 对象 在 zx.model.team 可用
  // team 对象提供了管理 团队单 的方法和事件
  // 在 team 对象集合中，公开的方法包括:
  // * getObjectIdFromServer() - 从服务器获取 ObjectId;
  // 
  // 由 team 对象发布的 jQuery 全局自定义事件包括:
  // 
  complete_getObjectIdFromServer = function(obj){
    obj = obj[0];
    $.gevent.publish( 'zx-getObjectIdFromServer', obj);   
  };

  complete_getFlightInfoFromServer = function(results){
    var result = results[0];
    $.gevent.publish( 'zx-getFlightInfoFromServer', result);
  };

  complete_saveTeam = function(results){
    var result = results[0];
    $.gevent.publish( 'zx-saveTeam', result);
  };

  complete_saveTeamWithMessage = function(results){
    var result = results[0];
    $.gevent.publish( 'zx-saveTeamWithMessage', result);
  };

  complete_getTeamById = function(results) {
    var result = results[0];
    $.gevent.publish( 'zx-getTeamById', result);
  };

  complete_deleteTeam = function(results) {
    var result = results[0];
    $.gevent.publish( 'zx-deleteTeam', result);
  };

  complete_downloadTeam = function( results ) {
    var result = results[0];
    $.gevent.publish( 'zx-downloadTeam', result);
  };

  complete_lockTeam = function( results ) {
    var result = results[0];
    $.gevent.publish( 'zx-lockTeam', result);
  };

  complete_socket_broadcast_lockTeam = function ( results ) {
    var result = results[0];
    //console.log(result.user_id !== people.get_user().user_id);
    /*if( result.user_id !== people.get_user().user_id ) {
      $.gevent.publish( 'zx-io-lockTeam', result);
    }*/
    $.gevent.publish( 'zx-socket-broadcast-lockTeam', result);
  };


  complete_socket_broadcast_delTeam = function( results ) {
    var result = results[0];
    $.gevent.publish( 'zx-socket-broadcast-delTeam', result);
  };

  complete_socket_broadcast_delSm = function( results ) {
    var result = results[0];
    //console.log(result);
    $.gevent.publish( 'zx-socket-broadcast-delSm', result);
  };

  complete_socket_broadcast_message = function( results ) {
    var result = results[0],
        userName = stateMap.user.userName,
        toUsers  = result.toUsers,
        i,
        isShowMsg = false;

    // 判断是不是自己的消息
    for(i = 0; i < toUsers.length; i++){
      if(userName === toUsers[i].userName){
        isShowMsg = true;
        break;
      }
    }

    if(isShowMsg){
      $.gevent.publish( 'zx-socket-broadcast-message', results);
    }    
  };
  
  /*complete_getTeamByIdEdit = function(results) {
    var result = results[0];
    $.gevent.publish( 'zx-getTeamByIdEdit', result);
  };*/

  team = (function(){
    var getObjectIdFromServer, getFlightInfoFromServer, 
    saveTeam, saveTeamWithMessage, getTeamById, deleteTeam, downloadTeam, lockTeam;

    sio.on( 'on-getObjectIdFromServer',   complete_getObjectIdFromServer   );
    sio.on( 'on-getFlightInfoFromServer', complete_getFlightInfoFromServer );
    sio.on( 'on-saveTeam',                complete_saveTeam                );
    sio.on( 'on-saveTeamWithMessage',     complete_saveTeamWithMessage     );
    sio.on( 'on-getTeamById',             complete_getTeamById             );
    sio.on( 'on-deleteTeam',              complete_deleteTeam              );
    sio.on( 'on-downloadTeam',            complete_downloadTeam            );
    sio.on( 'on-lockTeam',                complete_lockTeam                );

    //sio.on( 'on-io-lockTeam',             complete_io_lockTeam             );
    sio.on( 'on-socket-broadcast-lockTeam', complete_socket_broadcast_lockTeam ); // 加锁解锁
    sio.on( 'on-socket-broadcast-delTeam',  complete_socket_broadcast_delTeam  ); // 其它用户删除团队单
    sio.on( 'on-socket-broadcast-delSm',    complete_socket_broadcast_delSm    ); // 其它用户删除服务单
    sio.on( 'on-socket-broadcast-message',    complete_socket_broadcast_message   ); // 其它用户修改服务单

    getObjectIdFromServer = function (obj) {
      $.gevent.publish( 'zx-saveTeamBtnPlusOrMinusOne', 1);
      sio.emit( 'emit-getObjectIdFromServer', obj);
    };

    getFlightInfoFromServer = function (obj) {
      sio.emit( 'emit-getFlightInfoFromServer', obj );
    };

    saveTeam = function( obj ) {
      //console.log(obj);
      sio.emit( 'emit-saveTeam', obj );
    };

    saveTeamWithMessage = function( obj ) {
      sio.emit( 'emit-saveTeamWithMessage', obj );
    };

    getTeamById = function( team_id ) {
      sio.emit( 'emit-getTeamById', team_id );
    };

    deleteTeam = function( obj ) {
      sio.emit( 'emit-deleteTeam', obj );
    };

    downloadTeam = function( data ) {
      sio.emit( 'emit-downloadTeam', data );
    }

    lockTeam = function( obj ) {
      sio.emit( 'emit-lockTeam', obj );
    }

    /*getTeamByIdEdit = function( team_id ) {
      sio.emit( 'emit-getTeamByIdEdit', team_id );
    }*/

    return {
      getObjectIdFromServer   : getObjectIdFromServer,
      getFlightInfoFromServer : getFlightInfoFromServer,
      saveTeam                : saveTeam,
      saveTeamWithMessage     : saveTeamWithMessage,
      getTeamById             : getTeamById,
      deleteTeam              : deleteTeam,
      downloadTeam            : downloadTeam,
      lockTeam                : lockTeam
    };

  }());

  
  // The sm object API
  // ---------------------
  // sm 对象在 zx.model.sm 中可用
  // sm 对象提供了管理 送机单和接机单 的方法和事件
  // 在 sm 对象集合中，公开的方法包括：
  // * newOrAddSm() - 添加送、接机单
  // 
  complete_newOrAddSm = function(results){
    //console.log(results);
    var result = results[0];
    $.gevent.publish( 'zx-newOrAddSm', result);
  };

  complete_getSmById = function(results) {
    var result = results[0];
    $.gevent.publish( 'zx-getSmById', result);
  };

  complete_saveSm = function(results) {
    var result = results[0];
    $.gevent.publish( 'zx-saveSm', result);
  };

  complete_saveSmWithMessage = function(results) {
    var result = results[0];
    $.gevent.publish( 'zx-saveSmWithMessage', result);
  };

  complete_changeSmStatus = function(results) {
    var result = results[0];
    $.gevent.publish( 'zx-changeSmStatus', result);
  };

  complete_changePhoneMsgStatus = function(results) {
    var result = results[0];
    $.gevent.publish( 'zx-changePhoneMsgStatus', result);
  };

  complete_changeServerMan = function(results) {
    var result = results[0];
    $.gevent.publish( 'zx-changeServerMan', result);
  };

  complete_changeAddFees = function(results) {
    var result = results[0];
    $.gevent.publish( 'zx-changeAddFees', result);
  };

  complete_changeCarFees = function(results) {
    var result = results[0];
    $.gevent.publish( 'zx-changeCarFees', result);
  };

  complete_changeInsurance = function(results) {
    var result = results[0];
    $.gevent.publish( 'zx-changeInsurance', result);
  };

  complete_changeSatisfaction = function(results) {
    var result = results[0];
    $.gevent.publish( 'zx-changeSatisfaction', result);
  };

  complete_downloadSm = function(results) {
    var result = results[0];
    $.gevent.publish( 'zx-downloadSm', result);
  };

  complete_alidayuSm = function(response) {
    if (! response[0].result.success) {
      console.log(response[0]);
      alert('发送信息失败');
      $('#phoneMessageBtn').removeClass('hidden');
    }
  };

  sm = (function(){
    var newOrAddSm, getSmById, saveSm, saveSmWithMessage, 
    changeStatus, changePhoneMsgStatus, changeServerMan, 
    changeAddFees, changeCarFees, changeInsurance, changeSatisfaction,
    downloadSm, alidayuSm;

    sio.on( 'on-newOrAddSm', complete_newOrAddSm );
    sio.on( 'on-getSmById', complete_getSmById );
    sio.on( 'on-saveSm', complete_saveSm );
    sio.on( 'on-saveSmWithMessage', complete_saveSmWithMessage );
    sio.on( 'on-changeSmStatus', complete_changeSmStatus );
    sio.on( 'on-changePhoneMsgStatus', complete_changePhoneMsgStatus );
    sio.on( 'on-changeServerMan', complete_changeServerMan );
    sio.on( 'on-changeAddFees', complete_changeAddFees );
    sio.on( 'on-changeCarFees', complete_changeCarFees );
    sio.on( 'on-changeInsurance', complete_changeInsurance );
    sio.on( 'on-changeSatisfaction', complete_changeSatisfaction );
    sio.on( 'on-downloadSm', complete_downloadSm );
    sio.on( 'on-alidayuSm', complete_alidayuSm );

    newOrAddSm = function(obj) {
      sio.emit( 'emit-newOrAddSm', obj );
    };

    getSmById  = function( sm_id ) {
      sio.emit( 'emit-getSmById', sm_id );
    };

    saveSm     = function(obj) {
      sio.emit( 'emit-saveSm', obj );
    };

    saveSmWithMessage = function(obj) {
      sio.emit( 'emit-saveSmWithMessage', obj );
    };

    changeStatus = function(obj) {
      sio.emit( 'emit-changeSmStatus', obj );
    };

    changePhoneMsgStatus = function(obj) {
      sio.emit( 'emit-changePhoneMsgStatus', obj );
    };

    changeServerMan = function(obj) {
      sio.emit( 'emit-changeServerMan', obj );
    };

    changeAddFees = function(obj) {
      sio.emit( 'emit-changeAddFees', obj );
    };

    changeCarFees = function(obj) {
      sio.emit( 'emit-changeCarFees', obj );
    };

    changeInsurance = function(obj) {
      sio.emit( 'emit-changeInsurance', obj );
    };

    changeSatisfaction = function(obj) {
      sio.emit( 'emit-changeSatisfaction', obj );
    };

    downloadSm = function(data) {
      sio.emit( 'emit-downloadSm', data );
    };

    alidayuSm = function(alidayu) {
      sio.emit( 'emit-alidayuSm', alidayu );
    };

    return {
      newOrAddSm           : newOrAddSm,
      getSmById            : getSmById,
      saveSm               : saveSm,
      saveSmWithMessage    : saveSmWithMessage,
      changeStatus         : changeStatus,
      changePhoneMsgStatus : changePhoneMsgStatus,
      changeServerMan      : changeServerMan,
      changeAddFees        : changeAddFees,
      changeCarFees        : changeCarFees,
      changeInsurance      : changeInsurance,
      changeSatisfaction   : changeSatisfaction,
      downloadSm           : downloadSm,
      alidayuSm            : alidayuSm
    };
  }());


  completeGetlist = function(results){
    var result = results[0],
        companysObj   = {},
        companysIdObj = {},
        companysArr   = [],
        companys, i, len, company;

    if(result.obj && result.obj.c === 'bp'){
      companys = result.results.companys;
      for(i = 0, len = companys.length; i < len; i++){
        companysObj[companys[i].name]  = companys[i]._id;
        companysIdObj[companys[i]._id] = companys[i].name;
        companysArr.push(companys[i].name);
      }
      stateMap.bp_companysArr   = companysArr;
      stateMap.bp_companysObj   = companysObj;
      stateMap.bp_companysIdObj = companysIdObj;

      company = companysIdObj[result.obj.bpcompany];

      $.gevent.publish( 'zx-completeGetlist',{
        obj           : {
          company_id : result.obj.bpcompany,
          company    : company,
          bpMonth    : result.obj.bpMonth
        },
        companysArr   : companysArr,
        companysObj   : companysObj,
        companysIdObj : companysIdObj,
        bps           : result.results.bps,
        currentPage   : result.results.currentPage,
        totalPage     : result.results.totalPage
      });

      return;
    }

    $.gevent.publish( 'zx-completeGetlist', results);
  };

  list = (function(){
    var getlist, getBpCompanysArr, getBpCompanysObj;

    sio.on( 'on-getlist', completeGetlist );

    getlist = function ( obj ) {
      sio.emit( 'emit-getlist', obj);
    };

    getBpCompanysArr = function() {
      return stateMap.bp_companysArr;
    }

    getBpCompanysObj = function() {
      return stateMap.bp_companysObj;
    }
    
    return {
      getlist : getlist,
      getBpCompanysArr : getBpCompanysArr,
      getBpCompanysObj : getBpCompanysObj
    };
  }());

  completeNewFlag = function(results){
    $.gevent.publish( 'zx-newFlag', results);
  };

  completeUpdateFlag = function(results){
    $.gevent.publish( 'zx-updateFlag', results);
  };

  completeDeleteFlag = function(results){
    $.gevent.publish( 'zx-deleteFlag', results);
  };

  completeFindOneByCompanyFlag = function(results) {
    $.gevent.publish( 'zx-findOneByCompanyFlag', results);
  };

  flag = (function(){
    var newFlag, updateFlag, deleteFlag,
        findOneByCompanyFlag;

    sio.on( 'on-newFlag',    completeNewFlag    );
    sio.on( 'on-updateFlag', completeUpdateFlag );
    sio.on( 'on-deleteFlag', completeDeleteFlag );
    sio.on( 'on-findOneByCompanyFlag', completeFindOneByCompanyFlag );

    newFlag = function ( obj ) {
      sio.emit( 'emit-newFlag', obj);
    };

    updateFlag = function ( obj ) {
      sio.emit( 'emit-updateFlag', obj);
    };
    
    deleteFlag = function ( obj ) {
      sio.emit( 'emit-deleteFlag', obj);
    };

    findOneByCompanyFlag = function (obj) {
      sio.emit( 'emit-findOneByCompanyFlag', obj);
    };

    return {
      newFlag              : newFlag,
      updateFlag           : updateFlag,
      deleteFlag           : deleteFlag,
      findOneByCompanyFlag : findOneByCompanyFlag
    };
  }());


  completeNewServerman = function(results){
    $.gevent.publish( 'zx-newServerman', results);
  };

  completeUpdateServerman = function(results){
    $.gevent.publish( 'zx-updateServerman', results);
  };

  completeDeleteServerman = function(results){
    $.gevent.publish( 'zx-deleteServerman', results);
  };

  serverman = (function(){
    var newServerman, updateServerman, deleteServerman;

    sio.on( 'on-newServerman',    completeNewServerman    );
    sio.on( 'on-updateServerman', completeUpdateServerman );
    sio.on( 'on-deleteServerman', completeDeleteServerman );

    newServerman = function ( obj ) {
      sio.emit( 'emit-newServerman', obj);
    };

    updateServerman = function ( obj ) {
      sio.emit( 'emit-updateServerman', obj);
    };
    
    deleteServerman = function ( obj ) {
      sio.emit( 'emit-deleteServerman', obj);
    };

    return {
      newServerman    : newServerman,
      updateServerman : updateServerman,
      deleteServerman : deleteServerman
    };
  }());


  completeNewGuide = function(results){
    $.gevent.publish( 'zx-newGuide', results);
  };

  completeUpdateGuide = function(results){
    $.gevent.publish( 'zx-updateGuide', results);
  };

  completeDeleteGuide = function(results){
    $.gevent.publish( 'zx-deleteGuide', results);
  };

  guide = (function(){
    var newGuide, updateGuide, deleteGuide;

    sio.on( 'on-newGuide',    completeNewGuide    );
    sio.on( 'on-updateGuide', completeUpdateGuide );
    sio.on( 'on-deleteGuide', completeDeleteGuide );

    newGuide = function ( obj ) {
      sio.emit( 'emit-newGuide', obj);
    };

    updateGuide = function ( obj ) {
      sio.emit( 'emit-updateGuide', obj);
    };
    
    deleteGuide = function ( obj ) {
      sio.emit( 'emit-deleteGuide', obj);
    };

    return {
      newGuide    : newGuide,
      updateGuide : updateGuide,
      deleteGuide : deleteGuide
    };
  }());

  completeNewOperator = function(results){
    $.gevent.publish( 'zx-newOperator', results);
  };

  completeUpdateOperator = function(results){
    $.gevent.publish( 'zx-updateOperator', results);
  };

  completeDeleteOperator = function(results){
    $.gevent.publish( 'zx-deleteOperator', results);
  };

  operator = (function(){
    var newOperator, updateOperator, deleteOperator;

    sio.on( 'on-newOperator',    completeNewOperator    );
    sio.on( 'on-updateOperator', completeUpdateOperator );
    sio.on( 'on-deleteOperator', completeDeleteOperator );

    newOperator = function ( obj ) {
      sio.emit( 'emit-newOperator', obj);
    };

    updateOperator = function ( obj ) {
      sio.emit( 'emit-updateOperator', obj);
    };
    
    deleteOperator = function ( obj ) {
      sio.emit( 'emit-deleteOperator', obj);
    };

    return {
      newOperator    : newOperator,
      updateOperator : updateOperator,
      deleteOperator : deleteOperator
    };
  }());



  completeNewGuest = function(results){
    $.gevent.publish( 'zx-newGuest', results);
  };

  completeUpdateGuest = function(results){
    $.gevent.publish( 'zx-updateGuest', results);
  };

  completeDeleteGuest = function(results){
    $.gevent.publish( 'zx-deleteGuest', results);
  };

  guest = (function(){
    var newGuest, updateGuest, deleteGuest;

    sio.on( 'on-newGuest',    completeNewGuest    );
    sio.on( 'on-updateGuest', completeUpdateGuest );
    sio.on( 'on-deleteGuest', completeDeleteGuest );

    newGuest = function ( obj ) {
      sio.emit( 'emit-newGuest', obj);
    };

    updateGuest = function ( obj ) {
      sio.emit( 'emit-updateGuest', obj);
    };
    
    deleteGuest = function ( obj ) {
      sio.emit( 'emit-deleteGuest', obj);
    };

    return {
      newGuest    : newGuest,
      updateGuest : updateGuest,
      deleteGuest : deleteGuest
    };
  }());


  complete_getUnReadMessage = function(results) {
    var result = results[0];
    $.gevent.publish( 'zx-getUnReadMessage', result);
  };

  complete_getMessageBySmId = function(results) {
    var result = results[0];
    $.gevent.publish( 'zx-getMessageBySmId', result);
  };

  message = (function(){
    var getUnReadMessage, getMessageBySmId, changeMessageStateTrue;

    sio.on( 'on-getUnReadMessage', complete_getUnReadMessage );
    sio.on( 'on-getMessageBySmId', complete_getMessageBySmId );

    getUnReadMessage = function (obj) {
      sio.emit( 'emit-getUnReadMessage', obj);
    };

    getMessageBySmId = function (obj) {
      sio.emit( 'emit-getMessageBySmId', obj);
    };

    changeMessageStateTrue = function ( obj ) {
      sio.emit( 'emit-changeMessageStateTrue', obj);
    };

    return {
      getUnReadMessage       : getUnReadMessage,
      getMessageBySmId       : getMessageBySmId,
      changeMessageStateTrue : changeMessageStateTrue
    };
  })();

  completeNewBp = function(results){
    $.gevent.publish( 'zx-newBp', results);
  };

  completeUpdateBp = function(results){
    $.gevent.publish( 'zx-updateBp', results);
  };

  completeDeleteBp = function(results){
    $.gevent.publish( 'zx-deleteBp', results);
  };

  completegetbillsitemised = function(results){
    var bps                 = results[0].bps,
        sms                 = results[0].sms,
        companys            = results[0].companys,
        obj                 = results[0].obj,
        hasStatement        = results[0].hasStatement,
        lastMonthBalance    = results[0].lastMonthBalance,
        isLock              = results[0].isLock,
        companysObj         = {},
        companysIdObj       = {},
        companysIdcardfee   = {},
        companysArr         = [],
        i, len;

    for(i = 0, len = companys.length; i < len; i++){
      companysObj[companys[i].name]  = companys[i]._id;
      companysIdObj[companys[i]._id] = companys[i].name;
      companysIdcardfee[companys[i]._id] = companys[i].idcardfee || 1000;
      companysArr.push(companys[i].name);
    }
    stateMap.bp_companysArr   = companysArr;
    stateMap.bp_companysObj   = companysObj;
    stateMap.bp_companysIdObj = companysIdObj;

    obj.idcardsmfees_unit = companysIdcardfee[obj.bpcompany];
    obj.search_company = companysIdObj[obj.bpcompany];

    $.gevent.publish( 'zx-getbillsitemised', {
      obj                : obj,
      companysArr        : companysArr,
      companysObj        : companysObj,
      companysIdObj      : companysIdObj,
      sms                : sms,        
      bps                : bps,
      hasStatement       : hasStatement,
      lastMonthBalance   : lastMonthBalance,
      isLock             : isLock
    });
  };

  completegetbillsnow = function(results) {
    $.gevent.publish( 'zx-getbillsnow', results[0]);
  };

  completegetbillstotal = function(results) {
    $.gevent.publish( 'zx-getbillstotal', results[0]);
  };

  completestatementNew = function(results) {
    $.gevent.publish( 'zx-statementNew', results[0]);
  };

  completegetstatement = function(results) {
    var companys      = results[0].companys,
        obj           = results[0].obj,
        statement     = results[0].statement,
        companysObj   = {},
        companysIdObj = {},
        companysArr   = [],
        i, len;

    for(i = 0, len = companys.length; i < len; i++){
      companysObj[companys[i].company.name]  = companys[i].company._id;
      companysIdObj[companys[i].company._id] = companys[i].company.name;
      companysArr.push(companys[i].company.name);
    }

    obj.search_company = companysIdObj[obj.bpcompany];

    $.gevent.publish( 'zx-getstatement', {
      obj                : obj,
      companysArr        : companysArr,
      companysObj        : companysObj,
      companysIdObj      : companysIdObj,
      statement          : statement
    });
  };

  completedeleteStatement = function(results) {
    $.gevent.publish( 'zx-deleteStatement', results);
  };

  completelockStatement = function(results) {
    $.gevent.publish( 'zx-lockStatement', results);
  };


  bp = (function(){
    var newBp, updateBp, deleteBp,
        getbillsitemised, getbillstotal, getbillsnow,
        statementNew, getstatement, deleteStatement, lockStatement;

    sio.on( 'on-newBp',    completeNewBp    );
    sio.on( 'on-updateBp', completeUpdateBp );
    sio.on( 'on-deleteBp', completeDeleteBp );
    sio.on( 'on-getbillsitemised', completegetbillsitemised );
    sio.on( 'on-getbillsnow', completegetbillsnow );
    sio.on( 'on-getbillstotal', completegetbillstotal );
    sio.on( 'on-statementNew', completestatementNew );
    sio.on( 'on-getstatement', completegetstatement );
    sio.on( 'on-deleteStatement', completedeleteStatement );
    sio.on( 'on-lockStatement', completelockStatement );

    newBp = function ( obj ) {
      sio.emit( 'emit-newBp', obj);
    };

    updateBp = function ( obj ) {
      sio.emit( 'emit-updateBp', obj);
    };
    
    deleteBp = function ( obj ) {
      sio.emit( 'emit-deleteBp', obj);
    };

    getbillsitemised = function ( obj ) {
      sio.emit( 'emit-getbillsitemised', obj);
    };

    getbillsnow = function( obj ){
      sio.emit( 'emit-getbillsnow', obj);
    };

    getbillstotal = function( obj ) {
      sio.emit( 'emit-getbillstotal', obj);
    };

    // 对账单
    statementNew = function( obj ) {
      sio.emit( 'emit-statementNew', obj);
    };

    getstatement = function( obj ) {
      sio.emit( 'emit-getstatement', obj);
    };

    deleteStatement = function (obj) {
      sio.emit( 'emit-deleteStatement', obj);
    };

    lockStatement = function(id) {
      sio.emit( 'emit-lockStatement', id);
    };

    return {
      newBp            : newBp,
      updateBp         : updateBp,
      deleteBp         : deleteBp,
      getbillsitemised : getbillsitemised,
      getbillsnow      : getbillsnow,
      getbillstotal    : getbillstotal,
      statementNew     : statementNew,
      getstatement     : getstatement,
      deleteStatement  : deleteStatement,
      lockStatement    : lockStatement
    };
  })();

  complete_getServerManCards = function(results){
    $.gevent.publish( 'zx-getServerManCards', results);
  };

  complete_Step_1_2_downloadImg = function(obj){
    $.gevent.publish( 'zx-Step_1_2_downloadImg', obj[0]);
  }

  complete_Step_1_5_postData = function(obj){
    $.gevent.publish( 'zx-Step_1_5_postData', obj[0]);
  }

  complete_changeServerMan_pingan = function(results){
    //console.log(results);
    var result = results[0];
    $.gevent.publish( 'zx-changeServerMan_pangan', result);
  }

  complete_updatePingan = function(results){
    //console.log(results);
    var result = results[0];
    $.gevent.publish( 'zx-updatePingan', result);
  }

  pingan = (function(){
    var getServerManCards,
        Step_1_2_downloadImg, Step_1_5_postData,
        savecards, changeServerMan, updatePingan;

    sio.on( 'on-getServerManCards', complete_getServerManCards );
    sio.on( 'on-Step_1_2_downloadImg', complete_Step_1_2_downloadImg );
    sio.on( 'on-Step_1_5_postData', complete_Step_1_5_postData );
    sio.on( 'on-changeServerMan_pangan', complete_changeServerMan_pingan );
    sio.on( 'on-updatePingan', complete_updatePingan );

    getServerManCards = function(obj){
      sio.emit( 'emit-getServerManCards', obj);
    };

    Step_1_2_downloadImg = function(obj){
      sio.emit( 'emit-Step_1_2_downloadImg', obj);
    };

    Step_1_5_postData = function(obj){
      sio.emit( 'emit-Step_1_5_postData', obj);
    };

    savecards = function(arr){
      sio.emit( 'emit-savecards', arr);
    };

    changeServerMan= function(obj){
      sio.emit( 'emit-changeServerMan_pangan', obj);
    };

    updatePingan = function(obj){
      sio.emit( 'emit-updatePingan', obj);
    };

    return {
      getServerManCards    : getServerManCards,
      Step_1_2_downloadImg : Step_1_2_downloadImg,
      Step_1_5_postData    : Step_1_5_postData,
      savecards            : savecards,
      changeServerMan      : changeServerMan,
      updatePingan         : updatePingan
    };
  })();

  idcard = (function () {
    var getAvatarIdcard;
    var getAvatarIdcardCertificate;
    var getgetAvatarIdcardCertificateList;
    var getGoldsFormServer;
    var notifySever;

    var getAvatarIdcardsmCertificate;
    var setIdcardsmfees;

    getAvatarIdcard = function (obj, callback) {
      sio.emit( 'emit-getAvatarIdcard', obj, function (results) {
        callback(results);
      });
    };

    getAvatarIdcardCertificate = function (obj, callback) {
      //console.log(obj);
      sio.emit( 'emit-getAvatarIdcardCertificate', obj, function (results) {
        callback(results);
      });
    };

    getgetAvatarIdcardCertificateList = function (obj, callback) {
      sio.emit('emit-getgetAvatarIdcardCertificateList', obj, function (results) {
        callback(results);
      });
    };

    getGoldsFormServer = function (company, callback) {
      sio.emit('emit-getGoldsFormServer', company, function (sum) {
        callback(sum);
      });
    };

    notifySever = function (company) {
      sio.emit('emit-notifySever', company);
    };

    getAvatarIdcardsmCertificate = function (obj, callback) {
      sio.emit('emit-getAvatarIdcardsmCertificate', obj, function (results) {
        callback(results);
      });
    };

    setIdcardsmfees = function (obj) {
      sio.emit('emit-setIdcardsmfees', obj);
    };

    return {
      getAvatarIdcard : getAvatarIdcard,
      getAvatarIdcardCertificate: getAvatarIdcardCertificate,
      getgetAvatarIdcardCertificateList: getgetAvatarIdcardCertificateList,
      getGoldsFormServer: getGoldsFormServer,
      notifySever: notifySever,

      getAvatarIdcardsmCertificate: getAvatarIdcardsmCertificate,
      setIdcardsmfees: setIdcardsmfees,
    };
  })();

  complete_getworkplan = function(results){
    $.gevent.publish( 'zx-getworkplan', results);
  };

  complete_saveworkplan = function(results){
    $.gevent.publish( 'zx-saveworkplan', results);
  };

  complete_delworkplan = function(results){
    $.gevent.publish( 'zx-delworkplan', results);
  };

  workplan = (function(){
    var getworkplan, saveworkplan, delworkplan;

    sio.on( 'on-getworkplan', complete_getworkplan );
    sio.on( 'on-saveworkplan', complete_saveworkplan );
    sio.on( 'on-delworkplan', complete_delworkplan );

    getworkplan = function (obj) {
      sio.emit( 'emit-getworkplan', obj);
    };

    saveworkplan = function (obj) {
      sio.emit( 'emit-saveworkplan', obj);
    };

    delworkplan = function (id) {
      sio.emit( 'emit-delworkplan', id);
    };

    return {
      getworkplan  : getworkplan,
      saveworkplan : saveworkplan,
      delworkplan  : delworkplan
    };
  })();

  completeNewDengjipai = function(results){
    $.gevent.publish( 'zx-newDengjipai', results);
  };

  completeUpdateDengjipai = function(results){
    $.gevent.publish( 'zx-updateDengjipai', results);
  };

  completeDeleteDengjipai = function(results){
    $.gevent.publish( 'zx-deleteDengjipai', results);
  };

  dengjipai = (function(){
    var newDengjipai, updateDengjipai, deleteDengjipai;

    sio.on( 'on-newDengjipai',    completeNewDengjipai    );
    sio.on( 'on-updateDengjipai', completeUpdateDengjipai );
    sio.on( 'on-deleteDengjipai', completeDeleteDengjipai );

    newDengjipai = function ( obj ) {
      sio.emit( 'emit-newDengjipai', obj);
    };

    updateDengjipai = function ( obj ) {
      sio.emit( 'emit-updateDengjipai', obj);
    };
    
    deleteDengjipai = function ( obj ) {
      sio.emit( 'emit-deleteDengjipai', obj);
    };

    return {
      newDengjipai    : newDengjipai,
      updateDengjipai : updateDengjipai,
      deleteDengjipai : deleteDengjipai
    };
  })();

  complete_setName = function(results){
    $.gevent.publish( 'zx-setName', results);
  };

  djp = (function(){
    var setName;

    sio.on( 'on-setName', complete_setName );

    setName = function ( obj ) {
      sio.emit( 'emit-setName', obj);
    };

    return {
      setName : setName
    }
  })();

  complete_getusers = function(results){
    $.gevent.publish( 'zx-getusers', results);
  };

  getusers = (function(){
    var getusers;

    sio.on( 'on-getusers', complete_getusers );

    getusers = function () {
      sio.emit( 'emit-getusers');
    };

    return {
      getusers : getusers
    }
  })();

  initModule = function(){
    console.info('zx.model.initModule();');
    // initialize anonymous person
    // 初始化匿名用户,确保其有和其他people对象一样的方法和属性，面向质量设计 p155
    // 需要判断 cookie
    var 
      cookies,
      anon_id = zx.config.getConfigMapItem('anon_id');

    console.log('zx.config.setCookies() in model');
    zx.config.setCookies();
    cookies = zx.config.getStateMapItem('cookies');

    stateMap.anon_user = makePerson({
      //service     : null,
      feestemp    : null,
      user_id     : anon_id,  // uid
      category    : null,               // 公司类型
      company_id  : null,
      userName    : null,
      name        : 'anonymous',
      role        : 0,                  // 用户权限
      companyAbbr : null,
      sendSetTime : null,
      phone       : null,
      thSetStr    : null,
      defaultFlag : ''
      //is_online : false               // 是否连接服务器
    });

    if (cookies.user_id === anon_id) {
      stateMap.user = stateMap.anon_user;
    } else {
      // cookie 绕过 登录
      stateMap.user = makePerson({
        //service     : cookies.service,             // 超级管理账号
        feestemp    : cookies.feestemp,
        user_id     : cookies.user_id,             // 用户ID
        userName    : cookies.userName,            // 用户名
        role        : Number(cookies.role),        // 用户权限
        name        : cookies.name,                // 姓名
        phone       : Number(cookies.phone),       // 用户手机
        sendSetTime : Number(cookies.sendSetTime), // 默认送机提前时间
        //isLogin   : false
        company_id  : cookies.company_id,          // 公司ID
        category    : Number(cookies.category),    // 公司类别
        companyAbbr : cookies.companyAbbr,         // 公司简称
        thSetStr    : cookies.thSetStr,            // 导入表头
        defaultFlag : cookies.defaultFlag          // 默认导游旗
      });

      // 异步请求收费标准并缓存到stateMap.myfeestemp中;
      feestemp.getMyFeesTempFromSV({
        company_id : stateMap.user.company_id,
        categoty   : stateMap.user.category,
        feestemp   : stateMap.user.feestemp
      });
    }
  };

  console.info('初始化成功 zx.model');
  return {
    initModule : initModule,
    people     : people,
    feestemp   : feestemp,
    team       : team,
    sm         : sm,
    list       : list,
    flag       : flag,
    serverman  : serverman,
    guide      : guide,
    operator   : operator,
    guest      : guest,
    message    : message,
    bp         : bp,
    workplan   : workplan,
    pingan     : pingan,
    idcard     : idcard,
    dengjipai  : dengjipai,
    djp        : djp,
    getusers   : getusers
  };
}());