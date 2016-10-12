/*
 * zx.userlist.js
 * userlist feature module for zx
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, zx, moment */

zx.userlist = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  // 声明所有 zx.userlist 内可用的变量
  var
    // 静态配置值
    configMap = {
      main_html : String()
        + '<div class="zx-list row">'
          +'<div class="col-sm-6">'
            + '<h3>用户列表&nbsp;&nbsp;<small class="h3-small hidden"><a href="#!page=list&c=company&n=0">返回公司列表</a></small></h3>'
          + '</div>'
          +'<div class="col-sm-6 text-right">'
            + '<button type="button" class="zx-list-top-btn newUserBtn btn btn-primary">添加新用户</button>'
          + '</div>'
          + '<table class="table table-striped table-hover table-responsive">'
            + '<thead>'
              + '<tr>'
                + '<th>序号</th>'
                + '<th>用户名</th>'
                + '<th>手机号</th>'
                + '<th>用户权限</th>'
                + '<th>姓名</th>'
                + '<th>公司简称</th>'
                + '<th>公司ID</th>'
                + '<th>创建日期</th>'
                + '<th>最后更新</th>'
                + '<th>修改</th>'
                + '<th class="zx-list-last-th hidden">审核通过</th>'
              + '</tr>'
            + '</thead>'
            + '<tbody class="zx-list-tbody">'
            + '</tbody>'
          + '</table>'
        + '</div>'
    },
    // 动态状态信息
    stateMap  = { $container : null },
    jqueryMap = {},

    // DOM METHODS
    setJqueryMap, 
    // EVENT HANDLERS
    onCompleteGetlist, onNewUserBtnClick, onUpdateUserBtnClick, onResetPasswordBtnClick, 
    onCheckboxStatusChange, onChangeStatus,
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
      $container : $container,
      $list      : $container.find('.zx-list'        ),
      $tbody     : $container.find('.zx-list-tbody'  ),
      $newUserBtn: $container.find('.newUserBtn'     ),
      $last_th   : $container.find('.zx-list-last-th'),
      $h3_small  : $container.find('.h3-small')
    };
  };
  // End DOM method /setJqueryMap/
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  // Begin Event handler /onCompleteGetlist/
  onCompleteGetlist = function ( event, results ) {
    var result = results[0],
        user_id = zx.model.people.get_user().user_id,
        user_role = Number(zx.model.people.get_user().role),
        company_id = zx.model.people.get_user().company_id,
        i,item,item_role,$tr;
    //表格头 是否 显示 审核通过

    if(user_role === 99) {
      jqueryMap.$newUserBtn.removeClass('hidden').addClass('hidden');
      jqueryMap.$last_th.removeClass('hidden');
      jqueryMap.$h3_small.removeClass('hidden');
    } else if (user_role === 30 && company_id !== result[0].company) {
      jqueryMap.$newUserBtn.removeClass('hidden').addClass('hidden');
      jqueryMap.$last_th.removeClass('hidden');
      jqueryMap.$h3_small.removeClass('hidden');  
    }
    // 初始化
    jqueryMap.$tbody.html('');
    // 渲染表格
    for( i=0; i<result.length; i++ ) {
      item = result[i];
      item_role = '';
      $tr=$('<tr></tr>').addClass('item-id-' + item._id);

      switch(item.role){
        case 0:
          item_role = '禁止登录';
          break;
        case 10:
          item_role = '操作员';
          break;
        case 20:
          item_role = '负责人';
          break;
        case 30:
          item_role = '总负责人';
          break;
        case 99:
          item_role = '超级管理员';
          break;
      }

      $tr
        .append($('<td></td>').text(i+1))
        .append($('<td></td>').text(item.userName))
        .append($('<td></td>').text(item.phone))
        .append($('<td></td>').text(item_role))
        .append($('<td></td>').text(item.name))
        .append($('<td></td>').text(item.companyAbbr))
        .append($('<td></td>').text(item.company))
        .append($('<td></td>').text(moment(item.meta.createAt).format('YYYY-MM-DD')))
        .append($('<td></td>').text(moment(item.meta.updateAt).format('YYYY-MM-DD')));

      if (user_role === 30 && company_id !== result[0].company) {
        $tr
          .append($('<td></td>')
            .append($('<button class="updateUserBtn btn btn-xs btn-primary">修改</button>')
              .data('id',item._id)
              .data('role',user_role)
              .data('rowrole',item.role))
            .append($('<button class="resetPasswordBtn btn btn-xs btn-danger">重置密码</button>')
              .data('id',item._id)
              .data('rowrole',item.role)));
      } else {
        if (user_role > item.role) {
          $tr
            .append($('<td></td>')
              .append($('<button class="updateUserBtn btn btn-xs btn-primary">修改</button>')
                .data('id',item._id)
                .data('role',user_role)
                .data('rowrole',item.role))
              .append($('<button class="resetPasswordBtn btn btn-xs btn-danger">重置密码</button>')
                .data('id',item._id)
                .data('rowrole',item.role)));
        } else {
          if(user_id===item._id){
            $tr
              .append($('<td></td>')
                .append($('<button class="updateUserBtn btn btn-xs btn-primary">修改</button>')
                  .data('id',item._id)
                  .data('role',user_role)
                  .data('rowrole',item.role)));
          }else{
            $tr.append($('<td></td>'));
          }
        }
      }

      if (user_role === 99) {
        if(item.role<31){
          $tr
            .append($('<td></td>')
              .append($('<input class="checkboxStatus" type="checkbox"></input>')
                .data('id',item._id)
                .prop('checked',item.status)));
        }else{
          $tr.append($('<td></td>'));
        }
      } else if (user_role === 30 && company_id !== result[0].company) {
        if(item.role<31){
          $tr
            .append($('<td></td>')
              .append($('<input class="checkboxStatus" type="checkbox"></input>')
                .data('id',item._id)
                .prop('checked',item.status)));
        }else{
          $tr.append($('<td></td>'));
        }
      }

      jqueryMap.$tbody.append($tr);
    }
  };
  // End Event handler /onCompleteGetlist/
  
  // Begin Event handler /onNewUserBtnClick/ 
  onNewUserBtnClick = function(){
    var company_id = zx.model.people.get_user().company_id,
        thisUserRole = Number(zx.model.people.get_user().role),
        companyAbbr = zx.model.people.get_user().companyAbbr,
        select_option_html;

    switch(thisUserRole){
      case 30:
        select_option_html = String()
          + '<option value="0">禁止登录</option>'
          + '<option value="10" selected>操作员</option>'
          + '<option value="20">负责人</option>';
        break;
      case 20:
        select_option_html = String()
          + '<option value="0">禁止登录</option>'
          + '<option value="10" selected>操作员</option>';
        break;
      case 10:
        select_option_html = String()
          + '<option value="0">禁止登录</option>';
        break;
    }

    zx.modal.initModule({
      $title    : $('<h4 class="modal-title">添加新用户</h4>'),
      formClass : 'form-newUser',
      main_html : String()
        + '<input value="' + company_id + '" name="user[company]" type="hidden"></input>'
        + '<div class="form-group">'
          + '<label class="col-sm-3 control-label">*用户权限</label>'
          + '<div class="col-sm-9">'
            + '<select class="form-control" name="user[role]">'
              + select_option_html
            + '</select>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-3 control-label">*用户名</label>'
          + '<div class="col-sm-9">'
            + '<input tabindex="1" name="user[userName]" class="zx-register-form-userName-input form-control" type="text" placeholder="2 ~15 字母或数字" required></input>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-3 control-label">* 密码</label>'
          + '<div class="col-sm-9">'
            + '<input tabindex="2" name="user[password]" class="zx-login-form-password-input form-control" type="password" placeholder="6~20位长度" required></input>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-3 control-label">*确认密码</label>'
          + '<div class="col-sm-9">'
            + '<input tabindex="2" name="user[password_re]" class="zx-login-form-password_re-input form-control" type="password" placeholder="同密码" required></input>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-3 control-label">* 姓名</label>'
          + '<div class="col-sm-9">'
            + '<input name="user[name]" class="zx-register-form-name-input form-control" type="text" placeholder="2 ~ 4 个中文字符" required autofocus></input>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-3 control-label">* 手机</label>'
          + '<div class="col-sm-9">'
            + '<input name="user[phone]" class="zx-register-form-phone-input form-control" type="text" placeholder="11位有效号码" required></input>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-3 control-label">*公司简称</label>'
          + '<div class="col-sm-9">'
            + '<input value="' + companyAbbr + '" name="user[companyAbbr]" class="zx-register-form-companyAbbr-input form-control" type="text" placeholder="2 ~ 8 个字符" required></input>'
          + '</div>'
        + '</div>'
        + '<div class="zx-form-errors"></div>',
      callbackFunction : function(modalJqueryMap){
        var fieldArr,fieldObj = {},userObj = {},
            formValidation =modalJqueryMap.$modalForm.data('formValidation');

        formValidation.validate();
        if(formValidation.isValid()){
          modalJqueryMap.$submitBtn
            .text( '正在添加新用户...' )
            .attr( 'disabled', true );
          modalJqueryMap.$cancelBtn.attr( 'disabled', true );
          fieldArr = modalJqueryMap.$modalForm.serializeArray();
          $.each(fieldArr,function(){
            fieldObj[this.name] = this.value;
          });

          userObj.company     = fieldObj['user[company]'];
          userObj.role        = fieldObj['user[role]'];                   // 用户权限 *
          userObj.userName    = fieldObj['user[userName]'].toLowerCase(); // 用户名   * 转换为小写
          userObj.password    = fieldObj['user[password]'];               // 密码     *
          userObj.name        = fieldObj['user[name]'];                   // 姓名     *
          userObj.phone       = fieldObj['user[phone]'];                  // 手机     *
          userObj.companyAbbr = fieldObj['user[companyAbbr]'];            // 公司简称 *

          zx.model.people.newUser({ obj : userObj, userrole : zx.model.people.get_user().role });
        }
      }
    });
  }
  // End Event handler /onNewUserBtnClick/

  // Begin Event handler /onUpdateUserBtnClick/ 
  onUpdateUserBtnClick = function () {
    var $that = $(this),
        data_id = $that.data('id'),
        thisUserRole = Number($that.data('role')),
        thisRowRole = Number($that.data('rowrole')),
        $tds = $that.parent().parent().children(),
        name = $tds.eq(4).text(),
        phone = $tds.eq(2).text(),
        companyAbbr = $tds.eq(5).text(),
        core_html = String()
          + '<div class="form-group">'
            + '<label class="col-sm-4 control-label">* 姓名</label>'
            + '<div class="col-sm-8">'
              + '<input value="' + name + '" tabindex="1" name="user[name]" class="zx-register-form-name-input form-control" type="text" placeholder="2 ~ 4 个中文字符" required autofocus></input>'
            + '</div>'
          + '</div>'
          + '<div class="form-group">'
            + '<label class="col-sm-4 control-label">* 手机</label>'
            + '<div class="col-sm-8">'
              + '<input value="' + phone + '" tabindex="2" name="user[phone]" class="zx-register-form-phone-input form-control" type="text" placeholder="11位有效号码" required></input>'
            + '</div>'
          + '</div>'
          + '<div class="form-group">'
            + '<label class="col-sm-4 control-label">*公司简称</label>'
            + '<div class="col-sm-8">'
              + '<input value="' + companyAbbr + '" tabindex="3" name="user[companyAbbr]" class="zx-register-form-companyAbbr-input form-control" type="text" placeholder="2 ~ 8 个字符" required></input>'
            + '</div>'
          + '</div>'
          + '<div class="zx-form-errors"></div>',
          role30 = thisRowRole===30?'selected':'',
          role20 = thisRowRole===20?'selected':'',
          role10 = thisRowRole===10?'selected':'',
          main_html, select_option_html;

    // 如果是自己就 hidden 权限
    if(thisUserRole === thisRowRole){
      main_html = String()
        + '<input value="' + data_id + '" name="user[_id]" type="hidden"></input>'
        + '<input value="' + thisRowRole + '" name="user[role]" type="hidden"></input>'
        + core_html;
    }else{
      switch(thisUserRole){
        case 99:
          select_option_html = String()
            + '<option value="0">禁止登录</option>'
            + '<option value="10" ' + role10 + '>操作员</option>'
            + '<option value="20" ' + role20 + '>负责人</option>'
            + '<option value="30" ' + role30 + '>总负责人</option>';
          break;
        case 30:
          select_option_html = String()
            + '<option value="0">禁止登录</option>'
            + '<option value="10" ' + role10 + '>操作员</option>'
            + '<option value="20" ' + role20 + '>负责人</option>';
          break;
        case 20:
          select_option_html = String()
            + '<option value="0">禁止登录</option>'
            + '<option value="10" ' + role10 + '>操作员</option>';
          break;
        case 10:
          select_option_html = String()
            + '<option value="0">禁止登录</option>';
          break;
      }

      main_html = String()
        + '<input value="' + data_id + '" name="user[_id]" type="hidden"></input>'
        + '<div class="form-group">'
          + '<label class="col-sm-4 control-label">*用户权限</label>'
          + '<div class="col-sm-8">'
            + '<select class="form-control" name="user[role]">'
              + select_option_html
            + '</select>'
          + '</div>'
        + '</div>'
        + core_html;
    }

    zx.modal.initModule({
      size      : 'modal-sm',
      $title    : $('<h4 class="modal-title">修改用户信息</h4>'),
      formClass : 'form-updateUser',
      main_html : main_html,
      callbackFunction : function(modalJqueryMap){
        var fieldArr,fieldObj = {},userObj = {};
        modalJqueryMap.$submitBtn
          .text( '正在修改用户信息...' )
          .attr( 'disabled', true );
        modalJqueryMap.$cancelBtn.attr( 'disabled', true );
        fieldArr = modalJqueryMap.$modalForm.serializeArray();
        $.each(fieldArr,function(){
          fieldObj[this.name] = this.value;
        });
        userObj.userrole    = zx.model.people.get_user().role;
        userObj._id         = fieldObj['user[_id]'];
        userObj.role        = fieldObj['user[role]'];        // 用户权限
        userObj.name        = fieldObj['user[name]'];        // 姓名
        userObj.phone       = fieldObj['user[phone]'];       // 手机
        userObj.companyAbbr = fieldObj['user[companyAbbr]']; // 公司简称

        zx.model.people.updateUser(userObj);
      }
    });
  };
  // End Event handler /onUpdateUserBtnClick/
  
  // Begin Event handler /onResetPasswordBtnClick/ 
  onResetPasswordBtnClick = function () {
    var $that = $(this),
        data_id = $that.data('id'),
        thisRowRole = Number($that.data('rowrole'));

    zx.modal.initModule({
      size      : 'modal-sm',
      $title    : $('<h4 class="modal-title">重置密码信息</h4>'),
      formClass : 'form-resetPassword',
      main_html : String()
        + '<input value="' + data_id + '" name="user[_id]" type="hidden"></input>'
        + '<input value="' + thisRowRole + '" name="user[role]" type="hidden"></input>'
        + '<div class="form-group">'
          + '<label class="col-sm-4 control-label">*新密码</label>'
          + '<div class="col-sm-8">'
            + '<input tabindex="1" name="user[password]" class="zx-login-form-password-input form-control" type="password" placeholder="6~20位长度" required autofocus></input>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-4 control-label">*确认密码</label>'
          + '<div class="col-sm-8">'
            + '<input tabindex="2" name="user[password_re]" class="zx-login-form-password_re-input form-control" type="password" placeholder="同密码" required></input>'
          + '</div>'
        + '</div>'
        + '<div class="zx-form-errors"></div>',
      callbackFunction : function(modalJqueryMap){
        var fieldArr,fieldObj = {},userObj = {};
        modalJqueryMap.$submitBtn
          .text( '正在重置密码...' )
          .attr( 'disabled', true );
        modalJqueryMap.$cancelBtn.attr( 'disabled', true );
        fieldArr = modalJqueryMap.$modalForm.serializeArray();
        $.each(fieldArr,function(){
          fieldObj[this.name] = this.value;
        });

        userObj.userrole = zx.model.people.get_user().role;
        userObj._id      = fieldObj['user[_id]'];
        userObj.role     = fieldObj['user[role]'];
        userObj.password = fieldObj['user[password]'];        // 用户权限

        zx.model.people.resetPassword(userObj);
      }
    });
  };
  // End Event handler /onResetPasswordBtnClick/
  
  // Begin Event handler /onCheckboxStatusChange/ 
  onCheckboxStatusChange = function () {
    var $that = $(this),
        userObj = {};

    $that.prop('disabled', true);

    userObj._id = $that.data('id');
    userObj.status = $that.prop('checked');

    zx.model.people.changeStatus(userObj);
  };
  // End Event handler /onCheckboxStatusChange/
  
  // Begin Event handler /onChangeStatus/ 
  onChangeStatus = function ( event, results ) {
    var result = results[0];
    //console.log(result);
    // 已检验
    if(result.success === 1){
      $('tr.item-id-' + result.id).find('input.checkboxStatus').prop('disabled',false);
    }else{
      alert('老板，服务器压力山大，请再试一次！');
    }
  };
  // End Event handler /onChangeStatus/
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
  initModule = function ( $container, argObj ) {
    $container.html( configMap.main_html );
    stateMap.$container = $container;
    setJqueryMap();

    $.gevent.subscribe( jqueryMap.$list, 'zx-completeGetlist', onCompleteGetlist );
    $.gevent.subscribe( jqueryMap.$list, 'zx-changeStatus',       onChangeStatus );
    // getlist
    zx.model.list.getlist(argObj);

    jqueryMap.$list.on( 'click', 'button.newUserBtn',       onNewUserBtnClick       );
    jqueryMap.$list.on( 'click', 'button.updateUserBtn',    onUpdateUserBtnClick    );
    jqueryMap.$list.on( 'click', 'button.resetPasswordBtn', onResetPasswordBtnClick );
    jqueryMap.$list.on( 'change','input.checkboxStatus',    onCheckboxStatusChange  );
    return true;
  };
  // End public method /initModule/
   
  // Begin public method /removeThis/
  // Purpose    :
  //   * Removes chatlist DOM element
  //   * Reverts to initial state
  //   * Removes pointers to callbacks and other data
  // Arguments  : none
  // Returns    : true
  // Throws     : none
  //
  removeThis = function () {
    // unwind initialization and state
    // remove DOM container; this removes event bindings too
    if ( jqueryMap.$list ) {
      jqueryMap.$list.off('click');
      jqueryMap.$list.off('change');
      jqueryMap.$list.remove();
      jqueryMap = {};
    }
    stateMap.$container = null;
    //stateMap.position_type  = 'closed';

    // unwind key configurations
    //configMap.chat_model      = null;
    //configMap.people_model    = null;
    //configMap.set_chat_anchor = null;

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