/* isShowFooter
 * zx.guidelist.js
 * guidelist feature module for zx
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, zx, moment */

zx.guidelist = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  // 声明所有 zx.guidelist 内可用的变量
  var
    // 静态配置值
    configMap = {
      main_html : String()
        + '<div class="zx-list row">'
          +'<div class="col-sm-6">'
            + '<h3>地接人员列表</h3>'
          + '</div>'
          +'<div class="col-sm-6 text-right">'
            + '<button type="button" class="zx-list-top-btn newGuideBtn btn btn-primary">添加地接人员</button>'
          + '</div>'
          + '<table class="table table-striped table-hover table-responsive">'
            + '<thead>'
              + '<tr>'
                + '<th>序号</th>'
                + '<th>姓名</th>'
                + '<th>性别</th>'
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
    onCompleteGetlist, onNewGuideBtnClick, onUpdateGuideBtnClick, onDeleteGuideBtnClick, 
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
        .append($('<td></td>').text(item.name))
        .append($('<td></td>').text(item.sex))
        .append($('<td></td>').text(item.phone))
        .append($('<td></td>').text(moment(item.meta.createAt).format('YYYY-MM-DD')))
        .append($('<td></td>').text(moment(item.meta.updateAt).format('YYYY-MM-DD')))
        .append($('<td></td>')
          .append($('<button class="updateGuideBtn btn btn-xs btn-primary">修改</button>')
            .data('id',item._id)
            .data('name',item.name)
            .data('sex',item.sex)
            .data('phone',item.phone)))
        .append($('<td></td>')
          .append($('<button class="deleteGuideBtn btn btn-xs btn-danger">删除</button>')
            .data('id',item._id)));

      jqueryMap.$tbody.append($tr);
    }
  }; 
  // End Event handler /onCompleteGetlist/
  
  // Begin Event handler /onNewGuideBtnClick/
  onNewGuideBtnClick = function(){
    var company = zx.model.people.get_user().company_id;

    zx.modal.initModule({
      size      : 'modal-sm',
      $title    : $('<h4 class="modal-title">添加地接人员</h4>'),
      formClass : 'form-newGuide',
      main_html : String()
        + '<input value="' + company + '" name="guide[company]" type="hidden"></input>'
        + '<div class="form-group">'
          + '<label class="col-sm-4 control-label">* 姓名</label>'
          + '<div class="col-sm-8">'
            + '<input tabindex="1" name="guide[name]" class="form-control" type="text" placeholder="2 ~ 4 个中文字符" required autofocus></input>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-4 control-label">* 性别</label>'
          + '<div class="col-sm-8">'
            + '<select class="form-control" name="guide[sex]">'
              + '<option value="男">男</option>'
              + '<option value="女">女</option>'
            + '</select>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-4 control-label">* 手机</label>'
          + '<div class="col-sm-8">'
            + '<input tabindex="2" name="guide[phone]" class="form-control" type="text" placeholder="11位有效号码" required></input>'
          + '</div>'
        + '</div>'
        + '<div class="zx-form-errors"></div>',
      callbackFunction : function(modalJqueryMap){
        var fieldArr,fieldObj = {},guideObj = {},
            formValidation =modalJqueryMap.$modalForm.data('formValidation');

        formValidation.validate();
        if(formValidation.isValid()){
          modalJqueryMap.$submitBtn
            .text( '正在添加地接人员...' )
            .attr( 'disabled', true );
          modalJqueryMap.$cancelBtn.attr( 'disabled', true );
          fieldArr = modalJqueryMap.$modalForm.serializeArray();
          $.each(fieldArr,function(){
            fieldObj[this.name] = this.value;
          });
          guideObj.company = fieldObj['guide[company]']; // 公司 ID
          guideObj.name    = fieldObj['guide[name]'];    // 姓名
          guideObj.sex     = fieldObj['guide[sex]'];     // 性别
          guideObj.phone   = fieldObj['guide[phone]'];   // 手机

          zx.model.guide.newGuide(guideObj);
        }
      }
    });
  };
  // End Event handler /onNewGuideBtnClick/

  // Begin Event handler /onUpdateGuideBtnClick/
  onUpdateGuideBtnClick = function() {
    var $that   = $(this),
        id      = $that.data('id'     ),
        name    = $that.data('name'   ),
        sex     = $that.data('sex'    ),
        phone   = $that.data('phone'  ),
        sexMan  = sex==="男"?'':'selected';

    zx.modal.initModule({
      size      : 'modal-sm',
      $title    : $('<h4 class="modal-title">修改地接人员</h4>'),
      formClass : 'form-updateGuide',
      main_html : String()
        + '<input value="' + id + '" name="guide[id]" type="hidden"></input>'
        + '<div class="form-group">'
          + '<label class="col-sm-4 control-label">* 姓名</label>'
          + '<div class="col-sm-8">'
            + '<input value="' + name + '" tabindex="1" name="guide[name]" class="form-control" type="text" placeholder="2 ~ 4 个中文字符" required autofocus></input>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-4 control-label">* 性别</label>'
          + '<div class="col-sm-8">'
            + '<select class="form-control" name="guide[sex]">'
              + '<option value="男">男</option>'
              + '<option value="女" ' + sexMan + '>女</option>'
            + '</select>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-4 control-label">* 手机</label>'
          + '<div class="col-sm-8">'
            + '<input value="' + phone + '" tabindex="2" name="guide[phone]" class="form-control" type="text" placeholder="11位有效号码" required></input>'
          + '</div>'
        + '</div>'
        + '<div class="zx-form-errors"></div>',
      callbackFunction : function(modalJqueryMap){
        var fieldArr,fieldObj = {},guideObj = {};
        modalJqueryMap.$submitBtn
          .text( '正在修改地接人员...' )
          .attr( 'disabled', true );
        modalJqueryMap.$cancelBtn.attr( 'disabled', true );
        fieldArr = modalJqueryMap.$modalForm.serializeArray();
        $.each(fieldArr,function(){
          fieldObj[this.name] = this.value;
        });
        guideObj._id     = fieldObj['guide[id]'   ]; // _id
        guideObj.name    = fieldObj['guide[name]' ]; // 姓名
        guideObj.sex     = fieldObj['guide[sex]'  ]; // 性别
        guideObj.phone   = fieldObj['guide[phone]']; // 手机

        zx.model.guide.updateGuide(guideObj);
      }
    });
  };
  // End Event handler /onUpdateGuideBtnClick/
  
  // Begin Event handler /onDeleteGuideBtnClick/
  onDeleteGuideBtnClick = function() {
    var $that = $(this),
        id = $that.data('id');

    //$that.prop('disabled', true);
    
    zx.modal.initModule({
      size      : 'modal-sm',
      $title    : $('<h4 class="modal-title">删除地接人员</h4>'),
      formClass : 'form-deleteGuide',
      main_html : String()
        + '<div class="alert alert-warning" role="alert">确定删除吗？</div>',
      callbackFunction : function(modalJqueryMap){
        modalJqueryMap.$submitBtn
          .text( '正在删除地接人员...' )
          .attr( 'disabled', true );

        zx.model.guide.deleteGuide(id);
      }
    });
  };
  // End Event handler /onDeleteGuideBtnClick/
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

    jqueryMap.$list.on('click','button.newGuideBtn', onNewGuideBtnClick );
    jqueryMap.$list.on('click','button.updateGuideBtn', onUpdateGuideBtnClick );
    jqueryMap.$list.on('click','button.deleteGuideBtn', onDeleteGuideBtnClick );

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