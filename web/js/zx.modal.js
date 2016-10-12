/**
 * zx.modal.js
 * modal feature module for zx
**/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, zx */

zx.modal = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  // 声明所有 zx.modal 内可用的变量
  var
    // 静态配置值
    configMap = {
      main_html : String()
        + '<div tabindex="-1" data-backdrop="static" class="zx-modal modal fade">'
          + '<div class="zx-modal-dialog modal-dialog">'
            + '<div class="modal-content">'
              + '<div class="zx-modal-header modal-header">'
                + '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
              + '</div>'
              + '<div class="modal-body">'
                + '<form class="zx-modal-form form-horizontal">'
                + '</form>'
              + '</div>'
              + '<div class="zx-modal-footer modal-footer">'
                + '<input id="feestempName" class="hidden" type="text" style="float:left;padding: 5px;height: 34px;" placeholder="新模板名称"></input>'
                + '<button id="zx-modal-new-btn" class="btn btn-primary hidden" style="float:left;">复制新增</button>'
                + '<button class="zx-modal-submit-btn btn btn-primary">确定</button>'
                + '<button class="zx-modal-cancel-btn btn btn-default" data-dismiss="modal">取消</button>'
              + '</div>'
            + '</div><!-- /.modal-content -->'
          + '</div><!-- /.modal-dialog -->'
        + '</div>',
    settable_map : {
        people_model    : true
      },
      people_model      : null
    },
    // 动态状态信息
    stateMap  = { $modal : null },
    // jquery对象缓存集合
    jqueryMap = {},
    // DOM METHODS
    setJqueryMap,
    // EVENT HANDLERS
    onRegister, on_updateItemFeesTemp, on_newItemFeesTemp, on_updateFeesTemp, onUpdateCompany, 
    onNewUser, onUpdateUser, onChangePassword, onResetPassword,
    onNewFlag, onUpdateFlag, onDeleteFlag, onSetDefaultFlag,
    onNewServerman, onUpdateServerman, onDeleteServerman,
    onNewGuide, onUpdateGuide, onDeleteGuide,
    onNewOperator, onUpdateOperator, onDeleteOperator, 
    onNewGuest, onUpdateGuest, onDeleteGuest,
    onDeleteTeam, onDeleteSm, on_saveSmWithMessage, on_saveTeamWithMessage, onComplete_updatePingan,

    onNewBp, onUpdateBp, onDeleteBp,

    ondeleteStatement, onlockStatement,

    onNewDengjipai, onUpdateDengjipai, onDeleteDengjipai,

    on_complete_getServerManCards,
    // PUBLIC METHODS
    configModule, initModule, removeThis;
  //----------------- END MODULE SCOPE VARIABLES ---------------


  //------------------- BEGIN UTILITY METHODS ------------------
  //-------------------- END UTILITY METHODS -------------------
  

  //--------------------- BEGIN DOM METHODS --------------------
  // Begin DOM method /setJqueryMap/
  setJqueryMap = function () {
    var $modal = stateMap.$modal;
    jqueryMap = { 
      $modal       : $modal,
      $modalDialog : $modal.find('.zx-modal-dialog'),
      $modalHeader : $modal.find('.zx-modal-header'),
      $modalForm   : $modal.find('.zx-modal-form'),
      $modalFooter : $modal.find('.zx-modal-footer'),
      $cancelBtn   : $modal.find('.zx-modal-cancel-btn'),
      $submitBtn   : $modal.find('.zx-modal-submit-btn')
    };
  };
  // End DOM method /setJqueryMap/

  //---------------------- END DOM METHODS ---------------------
  

  //------------------- BEGIN EVENT HANDLERS -------------------
  // Begin Event handler /onRegister/
  onRegister = function ( event, result ) {
    var formValidation = jqueryMap.$modalForm.data('formValidation');

    jqueryMap.$submitBtn.text( '确定' );
    jqueryMap.$cancelBtn.attr( 'disabled', false );
    //已检验
    switch(result.success){
      case 1:  // ok
        jqueryMap.$modal.modal('hide');
        alert("注册成功!");
        break;
      case 10: // 公司不合法
        formValidation.updateStatus('company[name]', 'INVALID', 'errCompanyName');
        break;
      case 11: // 公司已存在
        formValidation.updateStatus('company[name]', 'INVALID', 'companyIsFind');
        break;
      case 12: // 用户名不合法
        formValidation.updateStatus('user[userName]', 'INVALID', 'errUserName');
        break;
      case 13: // 用户名已存在
        formValidation.updateStatus('user[userName]', 'INVALID', 'userNameIsFind');
        break;
      case 14: // 密码不合法
        formValidation.updateStatus('user[password]', 'INVALID', 'errPassword');
        break;
      case 15: // 公司简称不合法 
        formValidation.updateStatus('user[companyAbbr]', 'INVALID', 'errCompanyAbbr');
        break;
      case 16: // 姓名不合法
        formValidation.updateStatus('user[name]', 'INVALID', 'errName');
        break;
      case 17: // 手机号不合法
        formValidation.updateStatus('user[phone]', 'INVALID', 'errPhone');
        break;
      default:
        alert("未知错误，请联系管理员");
    }
  };
  // End Event handler /onRegister/
   
  // Begin Event handler /on_updateFeesTemp/
  on_updateItemFeesTemp = function(event, results) {
    var result = results[0];

    jqueryMap.$submitBtn.text( '确定' );
    jqueryMap.$cancelBtn.attr( 'disabled', false );

    //console.log(result);
    // 已检验
    switch(result.success){
      case 1:  // ok
        jqueryMap.$modal.modal('hide');
        break;
    }
  };
  // End Event handler /onRegister/

  on_newItemFeesTemp  = function(event, results) {
    var result = results[0],
        $td, $tr, item;

    
    jqueryMap.$submitBtn.text( '确定' );
    jqueryMap.$cancelBtn.attr( 'disabled', false );
    
    //console.log(result);
    // 已检验
    switch(result.success){
      case 1:  // ok
        // 增加一行
        item = result.fees;
        $td  = $('<td></td>')
          .append($('<button class="updateItemFeesTempBtn btn btn-xs btn-primary">调整服务费</button>')
          .data('feestemp',item));

        $tr  = $('<tr></tr>').addClass('item-id-' + item._id);
        $tr
          .append($('<td></td>').text( $('.zx-list-tbody').find('tr').length + 1 ))
          .append($('<td class="fesstempName"></td>').text(item.name))
          .append($('<td></td>').text(moment(item.meta.createAt).format('YYYY-MM-DD')))
          .append($('<td></td>').text(moment(item.meta.updateAt).format('YYYY-MM-DD')))
          .append($td);

        $('.zx-list-tbody').append($tr);

        jqueryMap.$modal.modal('hide');
        break;
    }
  };

  // Begin Event handler /on_updateFeesTemp/
  on_updateFeesTemp = function (event, results) {
    var result = results[0];

    jqueryMap.$submitBtn.text( '确定' );
    jqueryMap.$cancelBtn.attr( 'disabled', false );
    
    //console.log(result);
    // 已检验
    switch(result.success){
      case 1:  // ok
        $('#showFeesTempBtn').data('feestemp',result.fees);
        jqueryMap.$modal.modal('hide');
        break;
    }
  };
  // End Event handler /on_updateFeesTemp/

  // Begin Event handler /onUpdateCompany/
  onUpdateCompany = function(event,results){
    var result = results[0],
        formValidation = jqueryMap.$modalForm.data('formValidation'),
        $tr;

    jqueryMap.$submitBtn.text( '确定' );
    jqueryMap.$cancelBtn.attr( 'disabled', false );
    // 已检验
    switch(result.success){
      case 1:  // ok
        jqueryMap.$modal.modal('hide');
        $tr = $('.item-id-' + result.companyObj._id);
        //console.log(result.companyObj);
        $tr
          .children()
          .eq(2).text(result.companyObj.name)
          .next().text(Number(result.companyObj.category)===20?'地接社':'服务商')
          .next().text(result.companyObj.bankCard)
          .next().text(result.companyObj.isidcard?'是':'否')
          .next().text(result.companyObj.idcardfee/1000);
        $tr
          .find('.updateCompanyBtn')
            .data('name',result.companyObj.name)
            .data('category',result.companyObj.category)
            .data('bankcard',result.companyObj.bankCard)
            .data('isidcard',result.companyObj.isidcard)
            .data('idcardfee',result.companyObj.idcardfee);
        break;
      case 10: // 公司不合法
        formValidation.updateStatus('company[name]', 'INVALID', 'errCompanyName');
        break;
      case 11: // 公司已存在
        formValidation.updateStatus('company[name]', 'INVALID', 'companyIsFind');
        break;
      case 22: // 公司类型不合法
        formValidation.updateStatus('company[category]', 'INVALID', 'errCompanyCategory');
        break;
      default:
        alert("未知错误，请联系管理员");
    }
  };
  // End Event handler /onUpdateCompany/

  // Begin Event handler /onNewUser/
  onNewUser = function( event, results ){
    var result = results[0],
        formValidation = jqueryMap.$modalForm.data('formValidation');
        //$tr, item_role;

    jqueryMap.$submitBtn.text( '确定' );
    jqueryMap.$cancelBtn.attr( 'disabled', false );

    switch(result){
      case 1:  // ok
        zx.model.list.getlist({ 
          role    : zx.model.people.get_user().role,
          company : zx.model.people.get_user().company_id,
          c       : 'user', 
          n       : '0' 
        });
        jqueryMap.$modal.modal('hide');
        break;
      case 12: // 用户名不合法
        formValidation.updateStatus('user[userName]', 'INVALID', 'errUserName');
        break;
      case 13: // 用户名已存在
        formValidation.updateStatus('user[userName]', 'INVALID', 'userNameIsFind');
        break;
      case 14: // 密码不合法
        formValidation.updateStatus('user[password]', 'INVALID', 'errPassword');
        break;
      case 15: // 公司简称不合法
        formValidation.updateStatus('user[companyAbbr]', 'INVALID', 'errCompanyAbbr');
        break;
      case 16: // 姓名不合法
        formValidation.updateStatus('user[name]', 'INVALID', 'errName');
        break;
      case 17: // 手机号不合法
        formValidation.updateStatus('user[phone]', 'INVALID', 'errPhone');
        break;
      case 23: // 用户权限不合法
        formValidation.updateStatus('user[role]', 'INVALID', 'errRole');
        break;
      default:
        alert("未知错误，请联系管理员");
    }
  };
  // End Event handler /onNewUser/

  // Begin Event handler /onUpdateUser/
  onUpdateUser = function( event, results ){
    var result = results[0],
        formValidation = jqueryMap.$modalForm.data('formValidation'),
        $tr, item_role;

    jqueryMap.$submitBtn.text( '确定' );
    jqueryMap.$cancelBtn.attr( 'disabled', false );
    
    // 已检验
    switch(result.success){
      case 1:  // ok

        switch(Number(result.userObj.role)) {
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

        jqueryMap.$modal.modal('hide');
        $tr = $('.item-id-' + result.userObj._id);
        $tr
          .children()
          .eq(2).text(result.userObj.phone)
          .next().text(item_role)
          .next().text(result.userObj.name)
          .next().text(result.userObj.companyAbbr);
        $tr
          .find('.updateUserBtn')
            .data('rowrole',result.userObj.role);
        break;
      case 15: // 公司简称不合法
        formValidation.updateStatus('user[companyAbbr]', 'INVALID', 'errCompanyAbbr');
        break;
      case 16: // 姓名不合法
        formValidation.updateStatus('user[name]', 'INVALID', 'errName');
        break;
      case 17: // 手机号不合法
        formValidation.updateStatus('user[phone]', 'INVALID', 'errPhone');
        break;
      case 23: // 用户权限不合法
        formValidation.updateStatus('user[role]', 'INVALID', 'errRole');
        break;
      default:
        alert("未知错误，请联系管理员");
    }
  };
  // End Event handler /onUpdateUser/
 
  // Begin Event handler /onChangePassword/
  onChangePassword = function( event, results ) {
    var result = results[0],
        formValidation = jqueryMap.$modalForm.data('formValidation');

    jqueryMap.$submitBtn.text( '确定' );
    jqueryMap.$cancelBtn.attr( 'disabled', false );

    switch(result){
      case 1:  // ok
        jqueryMap.$modal.modal('hide');
        break;
      case 27: // 旧密码不合法
        formValidation.updateStatus('user[password_old]', 'INVALID', 'errPasswordOld');
        break;
      case 28: // 新密码不合法
        formValidation.updateStatus('user[password]', 'INVALID', 'errPasswordNew');
        break;
      default:
        alert("未知错误，请联系管理员");
    }
  };
  // End Event handler /onChangePassword/

  // Begin Event handler /onResetPassword/
  onResetPassword = function( event, results ) {
    var result = results[0],
        formValidation = jqueryMap.$modalForm.data('formValidation');

    jqueryMap.$submitBtn.text( '确定' );
    jqueryMap.$cancelBtn.attr( 'disabled', false );

    switch(result){
      case 1:  // ok
        jqueryMap.$modal.modal('hide');
        break;
      case 14: // 密码不合法
        formValidation.updateStatus('user[password]', 'INVALID', 'errPassword');
        break;
      case 23: // 用户权限不合法
        formValidation.updateStatus('user[password]', 'INVALID', 'errRole');
        break;
      case 24: // 密码与用户名相同
        formValidation.updateStatus('user[password]', 'INVALID', 'errUserPws');
        break;
      default:
        alert("未知错误，请联系管理员");
    }
  };
  // End Event handler /onResetPassword/
 
  // Begin Event handler /onNewFlag/ 
  onNewFlag = function( event, results ){
    var result = results[0],
        formValidation = jqueryMap.$modalForm.data('formValidation');

    jqueryMap.$submitBtn.text( '确定' );
    jqueryMap.$cancelBtn.attr( 'disabled', false );

    switch(result){
      case 1:  // ok
        zx.model.list.getlist({ 
          company : zx.model.people.get_user().company_id,
          c       : 'flag', 
          n       : '0' 
        });
        jqueryMap.$modal.modal('hide');
        break;
      case 25: // 旗子名不合法
        formValidation.updateStatus('flag[name]', 'INVALID', 'errFlag');
        break;
      case 26: // 颜色不合法
        formValidation.updateStatus('flag[color]', 'INVALID', 'errColor');
        break;
      default:
        alert("未知错误，请联系管理员");
    }
  };
  // End Event handler /onNewFlag/
  
  // Begin Event handler /onUpdateFlag/ 
  onUpdateFlag = function( event, results ){
    var result = results[0],
        formValidation = jqueryMap.$modalForm.data('formValidation'),
        $tr;

    jqueryMap.$submitBtn.text( '确定' );
    jqueryMap.$cancelBtn.attr( 'disabled', false );
    
    // 已检验
    switch(result.success){
      case 1:  // ok
        jqueryMap.$modal.modal('hide');
        $tr = $('.item-id-' + result.flag._id);
        $tr
          .children()
          .eq(1).text(result.flag.name)
          .next().text(result.flag.color);
        $tr
          .find('.updateFlagBtn')
            .data('name',result.flag.name)
            .data('color',result.flag.color);
        break;
      case 25: // 旗子名不合法
        formValidation.updateStatus('flag[name]', 'INVALID', 'errFlag');
        break;
      case 26: // 颜色不合法
        formValidation.updateStatus('flag[color]', 'INVALID', 'errColor');
        break;
      default:
        alert("未知错误，请联系管理员");
    }
  };
  // End Event handler /onUpdateFlag/
  
  // Begin Event handler /onDeleteFlag/
  onDeleteFlag = function( event, results ) {
    var result = results[0];

    jqueryMap.$modal.modal('hide');
    
    // 已检验
    if(result.success.ok === 1){
      $('.item-id-' + result._id).remove();
    } else {
      alert('亲，服务器忙，请再试一次。');
    }
  };
  // End Event handler /onDeleteFlag/

  onSetDefaultFlag = function(event, results) {
    //console.log(results);

    jqueryMap.$submitBtn.text( '确定' );
    jqueryMap.$cancelBtn.attr( 'disabled', false );

    if(results.success.ok === 1){
      jqueryMap.$modal.modal('hide');
    } else {
      alert('亲，服务器忙，请再试一次。');
    }
  };

  // Begin Event handler /onDeleteBp/
  onDeleteBp = function( event, results ) {
    //console.log(results);
    var result = results[0];

    jqueryMap.$modal.modal('hide');

    // 已检验
    if(result.success.ok === 1){
      $('.item-id-' + result._id).remove();
    }else{
      alert('亲，服务器忙，请再试一次。');
    }
  };
  // End Event handler /onDeleteBp/

  ondeleteStatement = function(event, results) {
    var result = results[0];
    //console.log(result);
    jqueryMap.$modal.modal('hide');

    if(result.success.ok === 1){
      // 跳转到 月账单列表页
      $.uriAnchor.setAnchor({ 
        'page'   : 'list', 
        'c'      : 'billsitemised', 
        'bpmonth': result.month 
      }, null, true );
    }else{
      alert('亲，服务器忙，请再试一次。');
    }
  };

  onlockStatement = function(event, results) {
    var result = results[0];
    //console.log(result);

    jqueryMap.$modal.modal('hide');

    if(result.success.ok === 1){
      $('#statementLockBtn').remove();
      $('#statementImportBtn').data('isLock', true);
    }else{
      alert('亲，服务器忙，请再试一次。');
    }
  };

  // Begin Event handler /onUpdateBp/ 
  onUpdateBp = function( event, results ){
    //console.log(results[0]);
    var result = results[0],
        formValidation = jqueryMap.$modalForm.data('formValidation'),
        $tr;

    jqueryMap.$submitBtn.text( '确定' );
    jqueryMap.$cancelBtn.attr( 'disabled', false );

    //console.log(result);
    // 已检验
    switch(result.success){
      case 1:  // ok
        jqueryMap.$modal.modal('hide');

        if(result.bp.bpType === 1){
          bpTypeHtml = String()
            + '<span class="label label-success" style="margin-right:5px;">借</span>';
        } else {
          bpTypeHtml = String()
            + '<span class="label label-danger" style="margin-right:5px;">贷</span>';
        }

        $tr = $('.item-id-' + result.bp._id);
        $tr
          .children()
          .eq(2).html(bpTypeHtml)
          .next().text(result.bp.bpNum / 100)
          .next().text(result.bp.bpNote)
          .next().text(result.bp.bpDate);
        $tr
          .find('.updateBpBtn')
            .data('item',result.bp);
        break;
      /*case 25: // 旗子名不合法
        formValidation.updateStatus('flag[name]', 'INVALID', 'errFlag');
        break;
      case 26: // 颜色不合法
        formValidation.updateStatus('flag[color]', 'INVALID', 'errColor');
        break;*/
      default:
        alert("未知错误，请联系管理员");
    }
  };
  // End Event handler /onUpdateBp/

  
  // Begin Event handler /onNewBp/ 
  onNewBp = function( event, results ){
    var result = results[0],
        formValidation = jqueryMap.$modalForm.data('formValidation');

    jqueryMap.$submitBtn.text( '确定' );
    jqueryMap.$cancelBtn.attr( 'disabled', false );

    switch(result){
      case 1:  // ok
        zx.model.list.getlist({ 
          bpcompany : '',
          bpMonth : '',
          c       : 'bp',
          n       : '0' 
        });
        jqueryMap.$modal.modal('hide');
        break;
      /*case 25: // 旗子名不合法
        formValidation.updateStatus('flag[name]', 'INVALID', 'errFlag');
        break;
      case 26: // 颜色不合法
        formValidation.updateStatus('flag[color]', 'INVALID', 'errColor');
        break;*/
      default:
        alert("未知错误，请联系管理员");
    }
  };
  // End Event handler /onNewBp/ 


  // Begin Event handler /onNewServerman/ 
  onNewServerman = function( event, results ){
    var result = results[0],
        formValidation = jqueryMap.$modalForm.data('formValidation');

    jqueryMap.$submitBtn.text( '确定' );
    jqueryMap.$cancelBtn.attr( 'disabled', false );

    switch(result){
      case 1:  // ok
        zx.model.list.getlist({ 
          company : zx.model.people.get_user().company_id,
          c       : 'serverman', 
          n       : '0' 
        });
        jqueryMap.$modal.modal('hide');
        break;
      default:
        alert("未知错误，请联系管理员");
    }
  };
  // End Event handler /onNewServerman/
  
  // Begin Event handler /onUpdateServerman/ 
  onUpdateServerman = function( event, results ){
    var result = results[0],
        formValidation = jqueryMap.$modalForm.data('formValidation'),
        $tr;

    jqueryMap.$submitBtn.text( '确定' );
    jqueryMap.$cancelBtn.attr( 'disabled', false );

    //console.log(result);
    // 已检验
    switch(result.success){
      case 1:  // ok
        jqueryMap.$modal.modal('hide');
        $tr = $('.item-id-' + result.serverman._id);
        $tr
          .children()
          .eq(1).text(result.serverman.name);
        $tr
          .find('.updateServermanBtn')
            .data('name',result.serverman.name);
        break;
      default:
        alert("未知错误，请联系管理员");
    }
  };
  // End Event handler /onUpdateServerman/
  
  // Begin Event handler /onDeleteServerman/
  onDeleteServerman = function( event, results ) {
    var result = results[0];

    jqueryMap.$modal.modal('hide');
    // 已检验
    if(result.success.ok === 1){
      $('.item-id-' + result._id).remove();
    }else{
      alert('亲，服务器忙，请再试一次。');
    }
  };
  // End Event handler /onDeleteServerman/
  
  
  // Begin Event handler /onNewGuide/ 
  onNewGuide = function( event, results ){
    var result = results[0],
        formValidation = jqueryMap.$modalForm.data('formValidation');

    jqueryMap.$submitBtn.text( '确定' );
    jqueryMap.$cancelBtn.attr( 'disabled', false );

    switch(result){
      case 1:  // ok
        zx.model.list.getlist({ 
          company : zx.model.people.get_user().company_id,
          c       : 'guide', 
          n       : '0' 
        });
        jqueryMap.$modal.modal('hide');
        break;
      case 16: // 姓名不合法
        formValidation.updateStatus('guide[name]', 'INVALID', 'errName');
        break;
      case 17: // 手机号不合法
        formValidation.updateStatus('guide[phone]', 'INVALID', 'errPhone');
        break;
      default:
        alert("未知错误，请联系管理员");
    }
  };
  // End Event handler /onNewGuide/
  
  // Begin Event handler /onUpdateGuide/ 
  onUpdateGuide = function( event, results ){
    var result = results[0],
        formValidation = jqueryMap.$modalForm.data('formValidation'),
         $tr;

    jqueryMap.$submitBtn.text( '确定' );
    jqueryMap.$cancelBtn.attr( 'disabled', false );
    // 已检验
    switch(result.success){
      case 1:  // ok
        jqueryMap.$modal.modal('hide');
        $tr = $('.item-id-' + result.guide._id);
        $tr
          .children()
          .eq(1).text(result.guide.name)
          .next().text(result.guide.sex)
          .next().text(result.guide.phone);
        $tr
          .find('.updateGuideBtn')
            .data('name',result.guide.name)
            .data('sex',result.guide.sex)
            .data('phone',result.guide.phone);
        break;
      case 16: // 姓名不合法
        formValidation.updateStatus('guide[name]', 'INVALID', 'errName');
        break;
      case 17: // 手机号不合法
        formValidation.updateStatus('guide[phone]', 'INVALID', 'errPhone');
        break;
      default:
        alert("未知错误，请联系管理员");
    }
  };
  // End Event handler /onUpdateGuide/
  
  // Begin Event handler /onDeleteGuide/
  onDeleteGuide = function( event, results ) {
    var result = results[0];

    jqueryMap.$modal.modal('hide');
    // 已检验
    if(result.success.ok === 1){
      $('.item-id-' + result._id).remove();
    }else{
      alert('亲，服务器忙，请再试一次。');
    }
  };
  // End Event handler /onDeleteGuide/
  
  // Begin Event handler /onNewOperator/ 
  onNewOperator = function( event, results ){
    var result = results[0],
        formValidation = jqueryMap.$modalForm.data('formValidation');

    jqueryMap.$submitBtn.text( '确定' );
    jqueryMap.$cancelBtn.attr( 'disabled', false );

    switch(result){
      case 1:  // ok
        zx.model.list.getlist({
          company : zx.model.people.get_user().company_id,
          c       : 'operator', 
          n       : '0' 
        });
        jqueryMap.$modal.modal('hide');
        break;
      case 15: // 公司简称不合法
        formValidation.updateStatus('operator[companyAbbr]', 'INVALID', 'errCompanyAbbr');
        break;
      case 16: // 姓名不合法
        formValidation.updateStatus('operator[name]', 'INVALID', 'errName');
        break;
      case 17: // 手机号不合法
        formValidation.updateStatus('operator[phone]', 'INVALID', 'errPhone');
        break;
      default:
        alert("未知错误，请联系管理员");
    }
  };
  // End Event handler /onNewOperator/
  
  // Begin Event handler /onUpdateOperator/ 
  onUpdateOperator = function( event, results ){
    var result = results[0],
        formValidation = jqueryMap.$modalForm.data('formValidation'),
         $tr;

    jqueryMap.$submitBtn.text( '确定' );
    jqueryMap.$cancelBtn.attr( 'disabled', false );
    // 已检验
    switch(result.success){
      case 1:  // ok
        jqueryMap.$modal.modal('hide');
        $tr = $('.item-id-' + result.operator._id);
        $tr
          .children()
          .eq(1).text(result.operator.companyAbbr)
          .next().text(result.operator.name)
          .next().text(result.operator.phone);
        $tr
          .find('.updateOperatorBtn')
            .data('company_abbr',result.operator.companyAbbr)
            .data('name',result.operator.name)
            .data('phone',result.operator.phone);
        break;
      case 15: // 公司简称不合法
        formValidation.updateStatus('operator[companyAbbr]', 'INVALID', 'errCompanyAbbr');
        break;
      case 16: // 姓名不合法
        formValidation.updateStatus('operator[name]', 'INVALID', 'errName');
        break;
      case 17: // 手机号不合法
        formValidation.updateStatus('operator[phone]', 'INVALID', 'errPhone');
        break;
      default:
        alert("未知错误，请联系管理员");
    }
  };
  // End Event handler /onUpdateOperator/
  
  // Begin Event handler /onDeleteOperator/
  onDeleteOperator = function( event, results ) {
    var result = results[0];

    jqueryMap.$modal.modal('hide');
    // 已检验
    if(result.success.ok === 1){
      $('.item-id-' + result._id).remove();
    }else{
      alert('亲，服务器忙，请再试一次。');
    }
  };
  // End Event handler /onDeleteOperator/ 
  

  // Begin Event handler /onNewGuest/ 
  onNewGuest = function( event, results ){
    var result = results[0],
        formValidation = jqueryMap.$modalForm.data('formValidation');

    jqueryMap.$submitBtn.text( '确定' );
    jqueryMap.$cancelBtn.attr( 'disabled', false );

    switch(result){
      case 1:  // ok
        zx.model.list.getlist({
          company : zx.model.people.get_user().company_id,
          c       : 'guest', 
          n       : '0' 
        });
        jqueryMap.$modal.modal('hide');
        break;
      case 15: // 公司简称不合法
        formValidation.updateStatus('guest[companyAbbr]', 'INVALID', 'errCompanyAbbr');
        break;
      case 16: // 姓名不合法
        formValidation.updateStatus('guest[name]', 'INVALID', 'errName');
        break;
      case 17: // 手机号不合法
        formValidation.updateStatus('guest[phone]', 'INVALID', 'errPhone');
        break;
      default:
        alert("未知错误，请联系管理员");
    }
  };
  // End Event handler /onNewGuest/
  
  // Begin Event handler /onUpdateOperator/ 
  onUpdateGuest = function( event, results ){
    var result = results[0],
        formValidation = jqueryMap.$modalForm.data('formValidation'),
         $tr;

    jqueryMap.$submitBtn.text( '确定' );
    jqueryMap.$cancelBtn.attr( 'disabled', false );
    // 已检验
    switch(result.success){
      case 1:  // ok
        jqueryMap.$modal.modal('hide');
        $tr = $('.item-id-' + result.guest._id);
        $tr
          .children()
          .eq(1).text(result.guest.companyAbbr)
          .next().text(result.guest.name)
          .next().text(result.guest.phone);
        $tr
          .find('.updateGuestBtn')
            .data('company_abbr',result.guest.companyAbbr)
            .data('name',result.guest.name)
            .data('phone',result.guest.phone);
        break;
      case 15: // 公司简称不合法
        formValidation.updateStatus('guest[companyAbbr]', 'INVALID', 'errCompanyAbbr');
        break;
      case 16: // 姓名不合法
        formValidation.updateStatus('guest[name]', 'INVALID', 'errName');
        break;
      case 17: // 手机号不合法
        formValidation.updateStatus('guest[phone]', 'INVALID', 'errPhone');
        break;
      default:
        alert("未知错误，请联系管理员");
    }
  };
  // End Event handler /onUpdateGuest/
  
  // Begin Event handler /onDeleteGuest/
  onDeleteGuest = function( event, results ) {
    var result = results[0];

    jqueryMap.$modal.modal('hide');
    // 已检验
    if(result.success.ok === 1){
      $('.item-id-' + result._id).remove();
    }else{
      alert('亲，服务器忙，请再试一次。');
    }
  };
  // End Event handler /onDeleteGuest/ 


  
  // Begin Event handler /onDeleteTeam/
  onDeleteTeam = function( event, result ) {
    //console.log(result);
    //var result = results[0];

    jqueryMap.$modal.modal('hide');
    // 已检验
    if(result.success === 1){
      //$('.item-id-' + result._id).remove();
      $.uriAnchor.setAnchor({ 
        'page'          : 'list', 
        'c'             : 'team', 
        'departuredate' : '', 
        'returndate'    : '', 
        'n'             : '0' 
      }, null, true );
    }else{
      alert('亲，服务器忙，请再试一次。');
    }
  };
  // End Event handler /onDeleteTeam/ 

  // Begin Event handler /onDeleteSm/
  onDeleteSm = function( event, result ) {
    var category;
    //var result = results[0];
    //console.log(result);
    jqueryMap.$modal.modal('hide');
    // 已检验
    if(result.success === 1){
      //$('.item-id-' + result._id).remove();

      category = zx.model.people.get_user().category;
      if(category === 20){
        $.uriAnchor.setAnchor({ 
          'page'   : 'team', 
          'c'      : 'detail', 
          'n'      : result.tm_id 
        }, null, true );
      } else if(category === 30){
        $.uriAnchor.setAnchor({ 
          'page'   : 'list', 
          'c'      : 'sm', 
          'smdate' : '',
          'n'      : '0' 
        }, null, true );
      }
      

    }else{
      alert('亲，服务器忙，请再试一次。');
    }
  };
  // End Event handler /onDeleteSm/ 


  on_saveSmWithMessage = function( event, result ) {
    //console.log(result);
    jqueryMap.$modal.modal('hide');
    $.uriAnchor.setAnchor( { 'page' : 'sm', 'c' : 'detail', 'n' : result.sm_id }, null, true );
    // 已检验
    if(result.success !== 1){
      alert('亲，服务器忙，请再试一次。');
    }
  };

  on_saveTeamWithMessage = function( event, result ) {
    //console.log(result);
    jqueryMap.$modal.modal('hide');
    $.uriAnchor.setAnchor( { 'page' : 'team', 'c' : 'detail', 'n' : result.tm_id }, null, true );
    // 已检验
    if(result.success !== 1){
      alert('亲，服务器忙，请再试一次。');
    }
  };
  

  on_complete_getServerManCards = function(event, results){
    //console.log(results[0]);
    stateMap.$modal.on('show.bs.modal', function(){
      var $smInfoTable  = $('.sm_info_table'),
          smObj         = $smInfoTable.data('sm_obj'),
          batchArr      = $smInfoTable.data('batch_pingan_arr'),
          $modal_title  = stateMap.$modal.find('.modal-title'),
          $modal_header = stateMap.$modal.find('.modal-header');
          $modal_body   = stateMap.$modal.find('.modal-body');

      $modal_title.remove();

      zx.pingan.initModule({
        $modal_header : $modal_header,
        $modal_body   : $modal_body,
        cards         : results[0].cards,
        sm_cards      : results[0].sm_cards,
        smObj         : smObj,
        batchArr      : batchArr
      });
    });

    jqueryMap.$modal.modal('show');
  };


  onComplete_updatePingan = function(event, result){
    var $tr, theState;

    jqueryMap.$submitBtn.text( '确定' );
    jqueryMap.$cancelBtn.attr( 'disabled', false );
    // 已检验
    switch(result.success.ok){
      case 1:  // ok
        jqueryMap.$modal.modal('hide');
        $tr = $('.item-id-' + result.pingan_id);

        switch(result.isInsurance){
          case 1:
            theState = '问题卡';
            break;
          case 2:
            theState = '未开卡';
            break;
          case 3:
            theState = '已开卡';
            break;
        }

        $tr
          .children()
          .eq(5).text(theState)
          .next().text(result.notes);
        break;
      default:
        alert("未知错误，请联系管理员");
    }
  };


  // Begin Event handler /onNewDengjipai/ 
  onNewDengjipai = function( event, results ){
    var result = results[0];

    jqueryMap.$submitBtn.text( '确定' );
    jqueryMap.$cancelBtn.attr( 'disabled', false );

    switch(result){
      case 1:  // ok
        zx.model.list.getlist({ 
          c       : 'dengjipai', 
          n       : '0' 
        });
        jqueryMap.$modal.modal('hide');
        break;
      default:
        alert("未知错误，请联系管理员");
    }
  };
  // End Event handler /onNewDengjipai/
  
  // Begin Event handler /onUpdateDengjipai/ 
  onUpdateDengjipai = function( event, results ){
    //console.log(results);
    var result = results[0],
        $tr;

    jqueryMap.$submitBtn.text( '确定' );
    jqueryMap.$cancelBtn.attr( 'disabled', false );
    //console.log(result);
    // 已检验
    switch(result.success.ok){
      case 1:  // ok
        jqueryMap.$modal.modal('hide');
        $tr = $('.item-id-' + result.dengjipaiObj._id);
        $tr
          .children()
          .eq(1).text(result.dengjipaiObj.name)
          .next().text(result.dengjipaiObj.password);
        $tr
          .find('.updateDengjipaiBtn')
            .data('name',result.dengjipaiObj.name)
            .data('password',result.dengjipaiObj.password);
        break;
      default:
        alert("未知错误，请联系管理员");
    }
  };
  // End Event handler /onUpdateDengjipai/
  
  // Begin Event handler /onDeleteDengjipai/
  onDeleteDengjipai = function( event, results ) {
    var result = results[0];
    
    jqueryMap.$modal.modal('hide');
    //console.log(result);
    // 已检验
    if(result.success.ok === 1){
      $('.item-id-' + result._id).remove();
    }else{
      alert('亲，服务器忙，请再试一次。');
    }
  };
  // End Event handler /onDeleteDengjipai/
  
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
  //  * $modal the jquery element used by this feature
  // Returns    : true
  // Throws     : none
  //
  initModule = function ( obj ) {
    var s = ["s1", "s2", "s3"],
        opt0 = ["", "", ""],
        validators = zx.util_b.validators;

    $('body').append( configMap.main_html );
    stateMap.$modal = $('.zx-modal');
    setJqueryMap();

    if(obj.size){
      jqueryMap.$modalDialog.addClass(obj.size);
    }
    jqueryMap.$modalHeader.append(obj.$title);
    jqueryMap.$modalForm
      .addClass(obj.formClass)
      .html(obj.main_html);
    if( obj.isHideFooter ){
      jqueryMap.$modalFooter.addClass('hidden');
    } else {
      if(obj.callbackFunction){
        jqueryMap.$submitBtn.bind( 'click', function() {
          obj.callbackFunction(jqueryMap);
        });
      } else {
        jqueryMap.$submitBtn.addClass('hidden');
      }

      if(obj.callbackFunction2){
        $('#feestempName').removeClass('hidden');
        $('#zx-modal-new-btn').removeClass('hidden');

        $('#zx-modal-new-btn').bind('click', function(){
          obj.callbackFunction2(jqueryMap);
        });
      }
    }

    jqueryMap.$errorsDiv = jqueryMap.$modal.find('.zx-form-errors');
    jqueryMap.$modalForm.formValidation({
      framework: 'bootstrap',
      icon: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      fields: {
        'company[name]'         : validators.companyName,
        'user[userName]'        : validators.registerUserName,

        'user[password]'        : validators.registerPassword,
        'user[password_re]'     : validators.password_re,
        'user[password_old]'    : validators.password_old,
        'user[name]'            : validators.user_name,
        'user[phone]'           : validators.phone,
        'user[companyAbbr]'     : validators.companyAbbr,
        'company[tel]'          : validators.companyTel,
        'company[fax]'          : validators.companyFax,
        'user[qq]'              : validators.userQQ,
        'company[category]'     : validators.companyCategory,

        'flag[name]'            : validators.flagName,
        'flag[color]'           : validators.flagColor,

        'guide[name]'           : validators.user_name,
        'guide[phone]'          : validators.phone,

        'operator[companyAbbr]' : validators.companyAbbr,
        'operator[name]'        : validators.user_name,
        'operator[phone]'       : validators.phone,

        'guest[companyAbbr]'    : validators.companyAbbr,
        'guest[name]'           : validators.user_name,
        'guest[phone]'          : validators.phone,

        'bp[company]'           : validators.bpCompanyName,
        'bp[bpDate]'            : validators.datetimePicker,
        'bp[bpNum]'             : validators.bpNumValidators,
        'bp[bpNote]'            : validators.bpNoteValidators,

        'company[idcardfee]'    : validators.companyIdcardfeeValidators
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

    jqueryMap.$modalForm.bind( 'submit', function(){
      return false;
    });

    if(obj.formClass === 'form-register'){
      $.gevent.subscribe( jqueryMap.$modalForm,  'zx-register', onRegister  );
    }

    // 添加借贷项目
    if(obj.formClass === 'form-newBp'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-newBp', onNewBp );
      stateMap.$modal.on( 'shown.bs.modal', function(){

        // 公司名称
        $('#modal_bp_company_input').autocomplete({
          minLength: 0,
          source: zx.model.list.getBpCompanysArr(),
          focus: function(){
            jqueryMap.$modalForm.formValidation('revalidateField', 'bp[company]');
          },
          select: function(){
            jqueryMap.$modalForm.formValidation('revalidateField', 'bp[company]');
          }
        }).blur(function(){
          jqueryMap.$modalForm.formValidation('revalidateField', 'bp[company]');
        });

        // 日期
        $('#modal_bpDate_input').datetimepicker({
          format: 'YYYY-MM-DD',
          dayViewHeaderFormat: 'YYYY MMMM',
          locale: 'zh-cn',
          showTodayButton: true,
          showClear: true
        }).on('dp.change dp.show', function (e) {
          jqueryMap.$modalForm.formValidation('revalidateField', 'bp[bpDate]');
        });
      });
    }
    // 更新借贷项目
    if(obj.formClass === 'form-updateBp'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-updateBp', onUpdateBp );
      stateMap.$modal.on( 'shown.bs.modal', function(){
        // 日期
        $('#modal_bpDate_input').datetimepicker({
          format: 'YYYY-MM-DD',
          dayViewHeaderFormat: 'YYYY MMMM',
          locale: 'zh-cn',
          showTodayButton: true,
          showClear: true
        }).on('dp.change dp.show', function (e) {
          jqueryMap.$modalForm.formValidation('revalidateField', 'bp[bpDate]');
        });
      });
    }
    if(obj.formClass === 'form-deleteBp'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-deleteBp', onDeleteBp );
    }

    if(obj.formClass === 'form-updateItemFeesTemp'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-updateItemFeesTemp', on_updateItemFeesTemp );
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-newItemFeesTemp', on_newItemFeesTemp );
    }

    if(obj.formClass === 'form-updateFeesTemp'){

      // 时间控件
      $('input.flightTime').datetimepicker({
        format: 'HH:mm',
        useCurrent: false
      });
     
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-updateFeesTemp', on_updateFeesTemp );
    }

    if(obj.formClass === 'form-updateCompany'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-updateCompany', onUpdateCompany );
    }

    if(obj.formClass === 'form-newUser'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-newUser', onNewUser );
    }
    if(obj.formClass === 'form-updateUser'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-updateUser', onUpdateUser );
    }
    if(obj.formClass === 'form-resetPassword'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-resetPassword', onResetPassword );
    }
    if(obj.formClass === 'form-changePassword'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-changePassword', onChangePassword );
    }
    
    if(obj.formClass === 'form-newFlag'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-newFlag', onNewFlag );
    }
    if(obj.formClass === 'form-updateFlag'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-updateFlag', onUpdateFlag );
    }
    if(obj.formClass === 'form-deleteFlag'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-deleteFlag', onDeleteFlag );
    }

    // 设置默认导航旗
    if(obj.formClass === 'form-setDefaultFlag'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-setDefaultFlag', onSetDefaultFlag );
    }

    // 登机牌
    if(obj.formClass === 'form-newDengjipai'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-newDengjipai', onNewDengjipai );
    }
    if(obj.formClass === 'form-updateDengjipai'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-updateDengjipai', onUpdateDengjipai );
    }
    if(obj.formClass === 'form-deleteDengjipai'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-deleteDengjipai', onDeleteDengjipai );
    }


    if(obj.formClass === 'form-newServerman'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-newServerman', onNewServerman );
    }
    if(obj.formClass === 'form-updateServerman'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-updateServerman', onUpdateServerman );
    }
    if(obj.formClass === 'form-deleteServerman'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-deleteServerman', onDeleteServerman );
    }


    if(obj.formClass === 'form-newGuide'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-newGuide', onNewGuide );
    }
    if(obj.formClass === 'form-updateGuide'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-updateGuide', onUpdateGuide );
    }
    if(obj.formClass === 'form-deleteGuide'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-deleteGuide', onDeleteGuide );
    }

    if(obj.formClass === 'form-newOperator'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-newOperator', onNewOperator );
    }
    if(obj.formClass === 'form-updateOperator'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-updateOperator', onUpdateOperator );
    }
    if(obj.formClass === 'form-deleteOperator'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-deleteOperator', onDeleteOperator );
    }

    if(obj.formClass === 'form-newGuest'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-newGuest', onNewGuest );
    }
    if(obj.formClass === 'form-updateGuest'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-updateGuest', onUpdateGuest );
    }
    if(obj.formClass === 'form-deleteGuest'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-deleteGuest', onDeleteGuest );
    }

    if(obj.formClass === 'form-deleteTeam'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-deleteTeam', onDeleteTeam );
    }
    if(obj.formClass === 'form-deleteSm'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-saveSm', onDeleteSm );
    }

    if(obj.formClass === 'form-saveSmWithMessage'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-saveSmWithMessage', on_saveSmWithMessage );
    }

    if(obj.formClass === 'form-updatePingan'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-updatePingan', onComplete_updatePingan );
    }

    if(obj.formClass === 'form-deleteStatement'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-deleteStatement', ondeleteStatement );
    }

    if(obj.formClass === 'form-lockStatement'){
      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-lockStatement', onlockStatement );
    }

    if(obj.formClass === 'form-saveTeamWithMessage'){
      $('.team-message-checkbox').change(function(){
        var $that = $(this),
            isChecked = $that.prop('checked'),
            $thisDiv = $that.closest('div');
        if(isChecked) {
          $thisDiv.find('textarea.messageTextarea').removeClass('hidden');
        }else{
          $thisDiv.find('textarea.messageTextarea').addClass('hidden');
        }
      });

      $.gevent.subscribe( jqueryMap.$modalForm, 'zx-saveTeamWithMessage', on_saveTeamWithMessage );
    }

    if(obj.formClass === 'form-selectFlight'){
      stateMap.$modal.on('hidden.bs.modal', function(){
        /*if($('.flightCityTdDiv').text() === '搜索中...'){
          $('.flightCityTdDiv').text('');
        }*/
        $('.flightBacthTd').text('');
      });
    }

    if(obj.formClass === 'form-phoneMessage'){
      stateMap.$modal.on('shown.bs.modal', function(){
        /*$('#phoneMessage_nums_btn').zclip({
          path: "img/ZeroClipboard.swf",
          copy: function(){ 
            return $('#phoneMessage_nums').text(); 
          }
        });

        $('#phoneMessage_msg_btn').zclip({
          path: "img/ZeroClipboard.swf",
          copy: function(){ 
            return $('#phoneMessage_msg').text(); 
          }
        });*/

        $('#phoneMessage_msg_btn').on('click', function() {
          var alidayu = zx.team.getAlidayu();


          if (alidayu.alidayu.rec_num) {
            // 提交到后台服务器
            $('#phoneMessageBtn').addClass('hidden');
            zx.model.sm.alidayuSm(alidayu);
            jqueryMap.$modal.modal('hide');
          } else {
            alert('没有用来发送信息的手机号码！');
          }

        });
      });
    }

    // 查询户籍地
    if(obj.formClass === 'form-showCardCity'){
      var userArr = $('.team_info_table').data('users');

      //console.log({
      zx.cardcity.initModule({
        $modal_body : stateMap.$modal.find('.modal-body'),
        userArr     : userArr
      });
    }

    jqueryMap.$modal.modal('show');

    if(obj.formClass === 'form-insurance'){
      var serverMan = $('.sm_info_table').data('sm_obj').serverMan;
      var sm_obj_id = $('.sm_info_table').data('sm_obj')._id;

      $.gevent.subscribe( stateMap.$modal, 'zx-getServerManCards', on_complete_getServerManCards );
      zx.model.pingan.getServerManCards({ sm_id : sm_obj_id, serverMan : serverMan });
    }

    stateMap.$modal.on('hidden.bs.modal', removeThis  );
    

    return true;
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
    // remove DOM modal; this removes event bindings too
    if ( jqueryMap.$modal ) {
      jqueryMap.$modal.remove();
      jqueryMap = {};
    }
    stateMap.$modal = null;

    // unwind key configurations
    //configMap.people_model    = null;

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