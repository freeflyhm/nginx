/* isShowFooter
 * zx.guestlist.js
 * guestlist feature module for zx
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, zx, moment */

zx.guestlist = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  // 声明所有 zx.guestlist 内可用的变量
  var
    // 静态配置值
    configMap = {
      main_html : String()
        + '<div class="zx-list row">'
          +'<div class="col-sm-6">'
            + '<h3>收客单位列表</h3>'
          + '</div>'
          +'<div class="col-sm-6 text-right">'
            + '<button type="button" class="zx-list-top-btn newGuestBtn btn btn-primary">添加收客单位</button>'
          + '</div>'
          + '<table class="table table-striped table-hover table-responsive">'
            + '<thead>'
              + '<tr>'
                + '<th>序号</th>'
                + '<th>收客单位简称</th>'
                + '<th>姓名</th>'
                + '<th>手机</th>'
                + '<th>创建日期</th>'
                + '<th>最后更新</th>'
                + '<th>修改</th>'
                + '<th>删除</th>'
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
    onCompleteGetlist, onNewGuestBtnClick, onUpdateGuestBtnClick, onDeleteGuestBtnClick, 
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
    	$list      : $container.find('.zx-list'),
      $tbody     : $container.find('.zx-list-tbody')
    };
  };
  // End DOM method /setJqueryMap/
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  // Begin Event handler /onCompleteGetlist/
  onCompleteGetlist = function ( event, results ) {
    // 初始化
    jqueryMap.$tbody.html('');
    // 渲染表格
    var result = results[0].results,
    i, item, $tr;
    for(i=0; i<result.length; i++) {
      item = result[i];
      $tr=$('<tr></tr>').addClass('item-id-' + item._id);

      $tr
        .append($('<td></td>').text(i+1))
        .append($('<td></td>').text(item.companyAbbr))
        .append($('<td></td>').text(item.name))
        .append($('<td></td>').text(item.phone))
        .append($('<td></td>').text(moment(item.meta.createAt).format('YYYY-MM-DD')))
        .append($('<td></td>').text(moment(item.meta.updateAt).format('YYYY-MM-DD')))
        .append($('<td></td>')
          .append($('<button class="updateGuestBtn btn btn-xs btn-primary">修改</button>')
            .data('id',item._id)
            .data('company_abbr',item.companyAbbr)
            .data('name',item.name)
            .data('phone',item.phone)))
        .append($('<td></td>')
          .append($('<button class="deleteGuestBtn btn btn-xs btn-danger">删除</button>')
            .data('id',item._id)));

      jqueryMap.$tbody.append($tr);
    }
  }; 
  // End Event handler /onCompleteGetlist/
  
  // Begin Event handler /onNewGuestBtnClick/
  onNewGuestBtnClick = function(){
    var company = zx.model.people.get_user().company_id;

    zx.modal.initModule({
      size      : 'modal-sm',
      $title    : $('<h4 class="modal-title">添加收客单位</h4>'),
      formClass : 'form-newGuest',
      main_html : String()
        + '<input value="' + company + '" name="guest[company]" type="hidden"></input>'
        + '<div class="form-group">'
          + '<label class="col-sm-4 control-label">*单位简称</label>'
          + '<div class="col-sm-8">'
            + '<input tabindex="1" name="guest[companyAbbr]" class="zx-register-form-companyAbbr-input form-control" type="text" placeholder="2 ~ 8 个字符" required></input>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-4 control-label">* 姓名</label>'
          + '<div class="col-sm-8">'
            + '<input tabindex="2" name="guest[name]" class="form-control" type="text" placeholder="2 ~ 4 个中文字符" required autofocus></input>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-4 control-label">* 手机</label>'
          + '<div class="col-sm-8">'
            + '<input tabindex="3" name="guest[phone]" class="form-control" type="text" placeholder="11位有效号码" required></input>'
          + '</div>'
        + '</div>'
        + '<div class="zx-form-errors"></div>',
      callbackFunction : function(modalJqueryMap){
        var fieldArr,fieldObj = {},guestObj = {},
            formValidation =modalJqueryMap.$modalForm.data('formValidation');

        formValidation.validate();
        if(formValidation.isValid()){
          modalJqueryMap.$submitBtn
            .text( '正在添加收客单位...' )
            .attr( 'disabled', true );
          modalJqueryMap.$cancelBtn.attr( 'disabled', true );
          fieldArr = modalJqueryMap.$modalForm.serializeArray();
          $.each(fieldArr,function(){
            fieldObj[this.name] = this.value;
          });
          guestObj.company     = fieldObj['guest[company]']; // 公司 ID
          guestObj.companyAbbr = fieldObj['guest[companyAbbr]'];    // 公司简称
          guestObj.name        = fieldObj['guest[name]'];    // 姓名
          guestObj.phone       = fieldObj['guest[phone]'];   // 手机

          zx.model.guest.newGuest(guestObj);
        }
      }
    });
  };
  // End Event handler /onNewGuestBtnClick/

  // Begin Event handler /onUpdateGuestBtnClick/
  onUpdateGuestBtnClick = function() {
    var $that       = $(this),
        id          = $that.data('id'          ),
        companyAbbr = $that.data('company_abbr'),
        name        = $that.data('name'        ),
        phone       = $that.data('phone'       );

    zx.modal.initModule({
      size      : 'modal-sm',
      $title    : $('<h4 class="modal-title">修改收客单位</h4>'),
      formClass : 'form-updateGuest',
      main_html : String()
        + '<input value="' + id + '" name="guest[id]" type="hidden"></input>'
        + '<div class="form-group">'
          + '<label class="col-sm-4 control-label">*单位简称</label>'
          + '<div class="col-sm-8">'
            + '<input value="' + companyAbbr + '" tabindex="1" name="guest[companyAbbr]" class="zx-register-form-companyAbbr-input form-control" type="text" placeholder="2 ~ 8 个字符" required></input>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-4 control-label">* 姓名</label>'
          + '<div class="col-sm-8">'
            + '<input value="' + name + '" tabindex="2" name="guest[name]" class="form-control" type="text" placeholder="2 ~ 4 个中文字符" required autofocus></input>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-4 control-label">* 手机</label>'
          + '<div class="col-sm-8">'
            + '<input value="' + phone + '" tabindex="3" name="guest[phone]" class="form-control" type="text" placeholder="11位有效号码" required></input>'
          + '</div>'
        + '</div>'
        + '<div class="zx-form-errors"></div>',
      callbackFunction : function(modalJqueryMap){
        var fieldArr,fieldObj = {},guestObj = {};
        modalJqueryMap.$submitBtn
          .text( '正在修改收客单位...' )
          .attr( 'disabled', true );
        modalJqueryMap.$cancelBtn.attr( 'disabled', true );
        fieldArr = modalJqueryMap.$modalForm.serializeArray();
        $.each(fieldArr,function(){
          fieldObj[this.name] = this.value;
        });
        guestObj._id         = fieldObj['guest[id]'   ]; // _id
        guestObj.companyAbbr = fieldObj['guest[companyAbbr]' ]; // 公司简称
        guestObj.name        = fieldObj['guest[name]' ]; // 姓名
        guestObj.phone       = fieldObj['guest[phone]']; // 手机

        zx.model.guest.updateGuest(guestObj);
      }
    });
  };
  // End Event handler /onUpdateGuestBtnClick/
  
  // Begin Event handler /onDeleteGuestBtnClick/
  onDeleteGuestBtnClick = function() {
    var $that = $(this),
        id = $that.data('id');

    //$that.prop('disabled', true);
    
    zx.modal.initModule({
      size      : 'modal-sm',
      $title    : $('<h4 class="modal-title">删除收客单位</h4>'),
      formClass : 'form-deleteGuest',
      main_html : String()
        + '<div class="alert alert-warning" role="alert">确定删除吗？</div>',
      callbackFunction : function(modalJqueryMap){
        modalJqueryMap.$submitBtn
          .text( '正在删除收客单位...' )
          .attr( 'disabled', true );

        zx.model.guest.deleteGuest(id);
      }
    });
  };
  // End Event handler /onDeleteGuestBtnClick/
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
    
    // getlist
    zx.model.list.getlist(argObj);

    jqueryMap.$list.on('click','button.newGuestBtn', onNewGuestBtnClick );
    jqueryMap.$list.on('click','button.updateGuestBtn', onUpdateGuestBtnClick );
    jqueryMap.$list.on('click','button.deleteGuestBtn', onDeleteGuestBtnClick );

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
    removeThis : removeThis
  };
  //------------------- END PUBLIC METHODS ---------------------
}());
