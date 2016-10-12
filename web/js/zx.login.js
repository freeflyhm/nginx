/**
 * zx.login.js
 * login feature module for zx
**/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, zx */

zx.login = (function () {
  'use strict';

  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  // 声明所有 zx.login 内可用的变量
  var
    // 静态配置值
    configMap = {
      main_html: String()
        + '<div class="zx-login row">'
          + '<div id="sitelink" class="col-sm-12"></div>'
          + '<div class="col-sm-3 col-sm-offset-4">'
            + '<div class="zx-login-head">'
              + '<span class="zx-login-title">请登录</span>'
              + '<a tabindex="4" href="#" class="zx-login-a-register">注册</a>'
            + '</div>'
            + '<form class="zx-login-form">'
              + '<div class="form-group zx-login-form-username">'
                + '<label class="sr-only">用户名</label>'
                + '<input tabindex="1" name="user[userName]" class="zx-login-form-username-input form-control" type="text" placeholder="用户名" required autofocus></input>'
              + '</div>'
              + '<div class="form-group">'
                + '<label class="sr-only">密码</label>'
                + '<input tabindex="2" name="user[password]" class="zx-login-form-password-input form-control" type="password" placeholder="密码" required></input>'
              + '</div>'
              + '<div class="zx-form-errors"></div>'
              + '<div class="checkbox">'
                + '<label><input class="zx-form-rem-password" type="checkbox">&nbsp;<span>记住密码 (有效期: 30天)</span></label>'
              + '</div>'
              + '<div class="form-group">'
                + '<button tabindex="3" class="zx-login-form-submit-btn btn btn-primary btn-block">登录</button>'
              + '</div>'
              + '<div class="form-group">'
                + '<h5 style="color: red;">* 如果点击登录时，系统没有反应，请刷新网页再试一次。</h5>'
              + '</div>'
            + '</form>'
          + '</div>'
        + '</div>',
      settable_map: {
        people_model: true
      },
      people_model: null
    },
    // 动态状态信息
    stateMap  = { $container: null },
    // jquery对象缓存集合
    jqueryMap = {},
    // DOM METHODS
    setJqueryMap, 
    // EVENT HANDLERS
    onLogin, onRegisterClick, onSubmitClick,
    // PUBLIC METHODS
    configModule, initModule, removeThis;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //------------------- BEGIN UTILITY METHODS ------------------
  //-------------------- END UTILITY METHODS -------------------

  //--------------------- BEGIN DOM METHODS --------------------
  // Begin DOM method /setJqueryMap/
  setJqueryMap = function () {
    var $container = stateMap.$container;
    jqueryMap = { 
      $container    : $container,
      $login        : $container.find('.zx-login'),
      $aRegister    : $container.find('.zx-login-a-register'),
      $loginForm    : $container.find('.zx-login-form'),
      $userNameInput: $container.find('.zx-login-form-username-input'),
      $passwordInput: $container.find('.zx-login-form-password-input'),
      $errorsDiv    : $container.find('.zx-form-errors'),
      $remPassword  : $container.find('.zx-form-rem-password'),
      $submitBtn    : $container.find('.zx-login-form-submit-btn'),

      $spanName     : $('.zx-shell-head-navRight-span-name'),
      $headLogo     : $('.zx-shell-head-logo'),
      $navRight     : $('.zx-shell-head-navRight'),
      $teamli       : $('#teamli'),      // 团队单管理
      $smli         : $('#smli'),        // 服务单管理
      $myli         : $('#myli'),        // 地接社
      $sv10li       : $('#sv10li'),      // 排班表 保险卡 登机牌
      $sv20li       : $('#sv20li'),      // 服务商负责人 20
      $sv30li       : $('#sv30li'),      // 服务商负责人 30
      $superli      : $('#superli')      // 超级管理员
    };
  };
  // End DOM method /setJqueryMap/
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  // Begin Event handler /onLogin/
  onLogin = function ( event, result ) {
    //console.log(result);
    //console.log(zx.util_b.getCookie('category'));
    var formValidation = jqueryMap.$loginForm.data('formValidation');
    jqueryMap.$submitBtn.text( '确定' );
    
    // 已检验
    switch(result.success){
      case 1:  // ok
        zx.util_b.setCookies(result);

        if(result.isSombodyOnline){
          //$.uriAnchor.setAnchor( { 'page' : 'online' }, null, true );
          // 弹出框 是否需要踢人
          var r=confirm("您的账号已经有人登录\n是否需要踢人");
          if (r===true)
          {
            zx.model.people.online_kickUser();

            $.uriAnchor.setAnchor( { 'page' : 'home' }, null, true );

          } else {

            jqueryMap.$submitBtn
              .text('登录')
              .attr( 'disabled', false );

            return;
          }

        }else{

          $.uriAnchor.setAnchor( { 'page' : 'home' }, null, true );
        }


        zx.util_b.setHeaderNav({
          user      : result.session_user,
          jqueryMap : jqueryMap
        });
        
        jqueryMap.$spanName.text(result.session_user.name);
        jqueryMap.$navRight.removeClass('hidden');

        zx.model.message.getUnReadMessage({ userName : result.session_user.userName });

        break;
      case 12: // 用户名不合法
        formValidation.updateStatus('user[userName]', 'INVALID', 'errUserName');
        break;
      case 14: // 密码不合法
        formValidation.updateStatus('user[password]', 'INVALID', 'errPassword');
        break;
      case 18: // 用户名不存在 
        formValidation.updateStatus('user[userName]', 'INVALID', 'notFind');
        break;
      case 19: // 禁止登录
        formValidation.updateStatus('user[userName]', 'INVALID', 'canNotLogin');
        break;
      case 20: // 密码错误
        formValidation.updateStatus('user[password]', 'INVALID', 'errPassword2');
        break;
      case 21: // 账号审核中...
        formValidation.updateStatus('user[userName]', 'INVALID', 'examine');
        break;
      case 29: // 城市不合法...
        formValidation.updateStatus('user[userName]', 'INVALID', 'errCity');
        break;
      default:
        alert("未知错误，请联系管理员");
    }
  };
  // End Event handler /onLogin/
  
  // Begin Event handler /onRegisterClick/
  onRegisterClick = function() {
    var cityObj = zx.config.getConfigMapItem('citys')[zx.config.getStateMapItem('city')];
    // configure and initialize feature modules
    zx.modal.configModule({
      people_model    : configMap.people_model
    });
    zx.modal.initModule({
      size      : 'modal-lg',
      $title    : $('<h4 class="modal-title">请注册</h4>'),
      formClass : 'form-register',
      main_html : String()
        + '<div class="row">'
          +'<div class="col-sm-6">'
            + '<div class="form-group">'
              + '<label class="col-sm-2 control-label">省份</label>'
              + '<div class="col-sm-10">'
                + '<input value="' + cityObj.province + '" class="zx-register-form-phone-input form-control" type="text" disabled></input>'
              + '</div>'
            + '</div>'
          + '</div>'
          +'<div class="col-sm-6">'
            + '<div class="form-group">'
              + '<label class="col-sm-3 control-label">城市</label>'
              + '<div class="col-sm-9">'
                + '<input value="' + cityObj.city + '" class="zx-register-form-companyAbbr-input form-control" type="text" disabled></input>'
              + '</div>'
            + '</div>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-1 control-label">* 公司</label>'
          + '<div class="col-sm-11">'
            + '<input tabindex="1000" name="company[name]" class="zx-register-form-companyName-input form-control" type="text" placeholder="2 ~ 15 个字符" required autofocus></input>'
          + '</div>'
        + '</div>'
        + '<div class="row">'
          +'<div class="col-sm-6">'
            + '<div class="form-group">'
              + '<label class="col-sm-2 control-label">*用户名</label>'
              + '<div class="col-sm-10">'
                + '<input tabindex="1001" name="user[userName]" class="zx-register-form-userName-input form-control" type="text" placeholder="2 ~15 字母或数字" required></input>'
              + '</div>'
            + '</div>'
          + '</div>'
          +'<div class="col-sm-6">'
            + '<div class="form-group">'
              + '<label class="col-sm-3 control-label">* 姓名</label>'
              + '<div class="col-sm-9">'
                + '<input tabindex="1002" name="user[name]" class="zx-register-form-name-input form-control" type="text" placeholder="2 ~ 4 个中文字符" required></input>'
              + '</div>'
            + '</div>'
          + '</div>'
          +'<div class="col-sm-6">'
            + '<div class="form-group">'
              + '<label class="col-sm-2 control-label">* 密码</label>'
              + '<div class="col-sm-10">'
                + '<input tabindex="1003" name="user[password]" class="zx-login-form-password-input form-control" type="password" placeholder="6~20位长度" required></input>'
              + '</div>'
            + '</div>'
          + '</div>'
          +'<div class="col-sm-6">'
            + '<div class="form-group">'
              + '<label class="col-sm-3 control-label">*确认密码</label>'
              + '<div class="col-sm-9">'
                + '<input tabindex="1004" name="user[password_re]" class="zx-login-form-password_re-input form-control" type="password" placeholder="同密码" required></input>'
              + '</div>'
            + '</div>'
          + '</div>'
          +'<div class="col-sm-6">'
            + '<div class="form-group">'
              + '<label class="col-sm-2 control-label">* 手机</label>'
              + '<div class="col-sm-10">'
                + '<input tabindex="1005" name="user[phone]" class="zx-register-form-phone-input form-control" type="text" placeholder="11位有效号码" required></input>'
              + '</div>'
            + '</div>'
          + '</div>'
          +'<div class="col-sm-6">'
            + '<div class="form-group">'
              + '<label class="col-sm-3 control-label">*公司简称</label>'
              + '<div class="col-sm-9">'
                + '<input tabindex="1006" name="user[companyAbbr]" class="zx-register-form-companyAbbr-input form-control" type="text" placeholder="2 ~ 8 个字符" required></input>'
              + '</div>'
            + '</div>'
          + '</div>'
          + '<div class="col-sm-4">'
            + '<div class="form-group">'
              + '<label class="col-sm-3 control-label">联系</label>'
              + '<div class="col-sm-9">'
                + '<div class="input-group">'
                  + '<div class="input-group-addon">QQ</div>'
                  + '<input tabindex="1007" name="user[qq]" class="zx-register-form-qq-input form-control" type="text" placeholder="纯数字"></input>'
                + '</div>'
              + '</div>'
            + '</div>'
          + '</div>'
          + '<div class="col-sm-4">'
            + '<div class="form-group">'
              + '<div class="col-sm-12">'
                + '<div class="input-group">'
                  + '<div class="input-group-addon">电话</div>'
                  + '<input tabindex="1008" name="company[tel]" class="zx-register-form-tel-input form-control" type="text" placeholder="0000-00000000-000"></input>'
                + '</div>'
              + '</div>'
            + '</div>'
          + '</div>'
          + '<div class="col-sm-4">'
            + '<div class="form-group">'
              + '<div class="col-sm-12">'
                + '<div class="input-group">'
                  + '<div class="input-group-addon">传真</div>'
                  + '<input tabindex="1009" name="company[fax]" class="zx-register-form-fax-input form-control" type="text" placeholder="0000-00000000"></input>'
                + '</div>'
              + '</div>'
            + '</div>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-1 control-label" for="address">地址</label>'
          + '<div class="col-sm-11">'
            + '<input tabindex="1013" class="form-control" type="text" name="company[address]" placeholder="请填写详细地址;" value="">'
          + '</div>'
        + '</div>'
        + '<div class="zx-form-errors"></div>',
      callbackFunction : function(modalJqueryMap){
        var fieldArr,fieldObj = {},companyObj = {},userObj = {},
            formValidation =modalJqueryMap.$modalForm.data('formValidation');

        formValidation.validate();
        if(formValidation.isValid()){
          modalJqueryMap.$submitBtn
            .text( '正在注册...' )
            .attr( 'disabled', true );
          modalJqueryMap.$cancelBtn.attr( 'disabled', true );

          fieldArr = modalJqueryMap.$modalForm.serializeArray();
          $.each(fieldArr,function(){
            fieldObj[this.name] = this.value;
          });

          companyObj.name     = fieldObj['company[name]'];     // 公司名称 *
          // category 公司类型 default: 20 地接社
          if(fieldObj['company[tel]'] !== "") {           companyObj.tel = fieldObj['company[tel]']; }      // 电话

          if(fieldObj['company[fax]'] !== "") {           companyObj.fax = fieldObj['company[fax]']; }      // 传真
          //if(fieldObj['company[province]'] !== "") { companyObj.province = fieldObj['company[province]']; } // 省
          //if(fieldObj['company[city]'] !== "") {         companyObj.city = fieldObj['company[city]']; }     // 地区
          //if(fieldObj['company[town]'] !== "") {         companyObj.town = fieldObj['company[town]']; }     // 市
          companyObj.province = cityObj.province;
          companyObj.city = cityObj.city;
          companyObj.town = '';
          if(fieldObj['company[address]'] !== "") {   companyObj.address = fieldObj['company[address]']; }  // 地址

          userObj.userName    = fieldObj['user[userName]'].toLowerCase(); // 用户名 * 转换为小写
          userObj.password    = fieldObj['user[password]'];    // 密码     *
          userObj.name        = fieldObj['user[name]'];        // 姓名     *
          userObj.phone       = fieldObj['user[phone]'];       // 手机     *
          if(fieldObj['user[qq]'] !== "") {                   userObj.qq = fieldObj['user[qq]']; }          // QQ
          // role   用户权限 default: 0    匿名用户 注册时为 99 或 30 在服务器判断
          // status 用户状态 default: true 审核通过 注册时在服务器判断
          // sendSetTime 默认送机提前时间 default: 120
          userObj.companyAbbr = fieldObj['user[companyAbbr]']; // 公司简称 *

          configMap.people_model.register({
            companyObj : companyObj,
            userObj    : userObj
          });
        }
      }
    });

    return false;
  };
  // End Event handler /onRegisterClick/
  
  // Begin Event handler /onSubmitClick/
  onSubmitClick = function() {
    //console.log('onSubmitClick');
    var fieldArr, fieldObj = {}, userObj = {},
        formValidation =jqueryMap.$loginForm.data('formValidation');
    formValidation.validate();

    if(formValidation.isValid()){
      jqueryMap.$submitBtn
        .text( '正在登录...' )
        .attr( 'disabled', true );

      fieldArr = jqueryMap.$loginForm.serializeArray();
      $.each(fieldArr,function(){
        fieldObj[this.name] = this.value;
      });

      userObj.userName = fieldObj['user[userName]'].toLowerCase(); // 用户名 * 转换为小写
      userObj.password = fieldObj['user[password]'];    // 密码     *
      userObj.city = zx.config.getConfigMapItem('citys')[zx.config.getStateMapItem('city')].city;

      // 记住用户名密码
      zx.util_b.setCookie('remUserName', userObj.userName, 30);
      if(jqueryMap.$remPassword.prop('checked')) {
        zx.util_b.setCookie('remPassword', userObj.password, 30);
      }

      configMap.people_model.login( userObj );
    }

    return false;
  };
  // End Event handler /onSubmitClick/
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

  // Begin public method /initModule/
  // Purpose    : Initializes module
  // Arguments  :
  //  * $container the jquery element used by this feature
  // Returns    : true
  // Throws     : none
  //
  initModule = function ( $container ) {
    var validators = zx.util_b.validators;
    var sitelinkArr = [];
    var zxConfigCity, zxConfigCitys, citysItem;

    $container.html( configMap.main_html );
    stateMap.$container = $container;
    setJqueryMap();

    jqueryMap.$headLogo.text('阳光服务');
    jqueryMap.$navRight.addClass('hidden');
    jqueryMap.$teamli.addClass('hidden');
    jqueryMap.$smli.addClass('hidden');
    jqueryMap.$myli.addClass('hidden');
    jqueryMap.$sv10li.addClass('hidden');
    jqueryMap.$sv20li.addClass('hidden');
    jqueryMap.$sv30li.addClass('hidden');
    jqueryMap.$superli.addClass('hidden');

    // 生成邻站链接
    zxConfigCity = zx.config.getStateMapItem('city');
    zxConfigCitys = zx.config.getConfigMapItem('citys');
    for(citysItem in zxConfigCitys) {
      if(zxConfigCitys.hasOwnProperty(citysItem)) {
        if (citysItem === zxConfigCity) {
          sitelinkArr.push('<span style="color: green;">您现在位于' + zxConfigCitys[citysItem].city + '站</span>');
        } else {
          sitelinkArr.unshift('<a style="color: blue;" href="http://' + citysItem + '.zxsl.net.cn/">' + zxConfigCitys[citysItem].city + '站</a>');
        }
      }   
    }
    $('#sitelink').html(sitelinkArr.join(' . '));

    // 记住用户名密码
    jqueryMap.$userNameInput.val(zx.util_b.getCookie('remUserName'));
    //console.log(typeof zx.util_b.getCookie('remBool'));
    if(zx.util_b.getCookie('remBool')){
      jqueryMap.$remPassword.prop('checked', true);
      jqueryMap.$passwordInput.val(zx.util_b.getCookie('remPassword'));
    }


    jqueryMap.$loginForm.formValidation({
      framework: 'bootstrap',
      icon: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      fields: {
        'user[userName]' : validators.userNameValidators,
        'user[password]' : validators.passwordValidators
      }
    }).on('err.field.fv', function (e, data) {
      // data.fv      --> The BootstrapValidator instance
      // data.field   --> The field name
      // data.element --> The field element
      
      // Get the messages of field
      var messages = data.fv.getMessages(data.element);
      // Remove the field messages if they're already available
      jqueryMap.$errorsDiv.find('li[data-field="' + data.field + '"]').remove();
      // Loop over the messages
      for (var i in messages) {
        // Create new 'li' element to show the message
        $('<li/>')
          .attr('data-field', data.field)
          .wrapInner(
            $('<a/>')
            .attr('href', 'javascript: void(0);')
            .html(messages[i])
            .on('click', function (e) {
              // Focus on the invalid field
              data.element.focus();
            }))
          .appendTo(jqueryMap.$errorsDiv);
      }
      // Hide the default message
      // $field.data('fv.messages') returns the default element containing the messages
      data.element
        .data('fv.messages')
        .find('.help-block[data-fv-for="' + data.field + '"]')
        .hide();

      jqueryMap.$submitBtn.attr( 'disabled', true );
    }).on('success.field.fv', function (e,data) {
      // Remove the field messages
      jqueryMap.$errorsDiv.find('li[data-field="' + data.field + '"]').remove();
      if(jqueryMap.$errorsDiv.find('li').length === 0){
        jqueryMap.$submitBtn.attr( 'disabled', false );
      }
    });

    jqueryMap.$aRegister.bind( 'click', onRegisterClick );

    jqueryMap.$loginForm.on( 'submit', function() {
      //console.log('submit');
      return false;
    });


    // 记住用户名密码
    jqueryMap.$remPassword.bind( 'change',  function() {
      var is_rem = jqueryMap.$remPassword.prop('checked');

      if(is_rem){
        zx.util_b.setCookie('remBool', true, 30);
      }else{
        zx.util_b.delCookie('remBool');
        zx.util_b.delCookie('remPassword');
      }
    });


    jqueryMap.$submitBtn.bind( 'click',  onSubmitClick );

    $.gevent.subscribe( jqueryMap.$login, 'zx-login', onLogin );

    // return true;
  };
  // End public method /initModule/
   
  // Begin public method /removeThis/
  // Purpose    :
  //   * Removes chatlogin DOM element
  //   * Reverts to initial state
  //   * Removes pointers to callbacks and other data
  // Arguments  : none
  // Returns    : true
  // Throws     : none
  //
  removeThis = function () {
    // unwind initialization and state
    // remove DOM container; this removes event bindings too
    if ( jqueryMap.$login ) {

      jqueryMap.$login.remove();
      jqueryMap = {};
    }
    stateMap.$container = null;

    // unwind key configurations
    configMap.people_model    = null;

    return true;
  };
  // End public method /removeThis/

  // return public methods
  return {
    configModule : configModule,
    initModule   : initModule,
    removeThis   : removeThis
  };
  //------------------- END PUBLIC METHODS ---------------------
}());