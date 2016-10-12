/* isShowFooter
 * zx.servermanlist.js
 * servermanlist feature module for zx
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, zx, moment */

zx.servermanlist = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  // 声明所有 zx.servermanlist 内可用的变量
  var
    // 静态配置值
    configMap = {
      main_html : String()
        + '<div class="zx-list row">'
          +'<div class="col-sm-6">'
            + '<h3>现场责任人列表</h3>'
          + '</div>'
          +'<div class="col-sm-6 text-right">'
            + '<button type="button" class="zx-list-top-btn newServermanBtn btn btn-primary">添加现场责任人</button>'
          + '</div>'
          + '<table class="table table-striped table-hover table-responsive">'
            + '<thead>'
              + '<tr>'
                + '<th>序号</th>'
                + '<th>姓名</th>'
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
    onCompleteGetlist, onNewServermanBtnClick, onUpdateServermanBtnClick, onDeleteServermanBtnClick, 
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
    //console.log(result);
    for(i=0; i<result.length; i++) {
      item = result[i];
      $tr=$('<tr></tr>').addClass('item-id-' + item._id);

      $tr
        .append($('<td></td>').text(i+1))
        .append($('<td></td>').text(item.name))
        .append($('<td></td>').text(moment(item.meta.createAt).format('YYYY-MM-DD')))
        .append($('<td></td>').text(moment(item.meta.updateAt).format('YYYY-MM-DD')))
        .append($('<td></td>')
          .append($('<button class="updateServermanBtn btn btn-xs btn-primary">修改</button>')
            .data('id',item._id)
            .data('name',item.name)))
        .append($('<td></td>')
          .append($('<button class="deleteServermanBtn btn btn-xs btn-danger">删除</button>')
            .data('id',item._id)));

      jqueryMap.$tbody.append($tr);
    }
  }; 
  // End Event handler /onCompleteGetlist/
  
  // Begin Event handler /onNewServermanBtnClick/
  onNewServermanBtnClick = function(){
    var company = zx.model.people.get_user().company_id;

    zx.modal.initModule({
      size      : 'modal-sm',
      $title    : $('<h4 class="modal-title">添加现场责任人</h4>'),
      formClass : 'form-newServerman',
      main_html : String()
        + '<input value="' + company + '" name="serverman[company]" type="hidden"></input>'
        + '<div class="form-group">'
          + '<label class="col-sm-3 control-label">* 姓名</label>'
          + '<div class="col-sm-9">'
            + '<input tabindex="1" name="serverman[name]" class="form-control" type="text" placeholder="2 ~ 15 个字符" required autofocus></input>'
          + '</div>'
        + '</div>'
        + '<div class="zx-form-errors"></div>',
      callbackFunction : function(modalJqueryMap){
        var fieldArr,fieldObj = {},servermanObj = {},
            formValidation =modalJqueryMap.$modalForm.data('formValidation');

        formValidation.validate();
        if(formValidation.isValid()){
          modalJqueryMap.$submitBtn
            .text( '正在添加现场责任人...' )
            .attr( 'disabled', true );
          modalJqueryMap.$cancelBtn.attr( 'disabled', true );
          fieldArr = modalJqueryMap.$modalForm.serializeArray();
          $.each(fieldArr,function(){
            fieldObj[this.name] = this.value;
          });
          servermanObj.company     = fieldObj['serverman[company]']; // 公司 ID
          servermanObj.name     = fieldObj['serverman[name]'];    // 姓名

          zx.model.serverman.newServerman(servermanObj);
        }   
      }
    });
  };
  // End Event handler /onNewServermanBtnClick/

  // Begin Event handler /onUpdateServermanBtnClick/
  onUpdateServermanBtnClick = function() {
    var $that = $(this),
        id = $that.data('id'),
        name = $that.data('name');

    zx.modal.initModule({
      size      : 'modal-sm',
      $title    : $('<h4 class="modal-title">修改现场负责人</h4>'),
      formClass : 'form-updateServerman',
      main_html : String()
        + '<input value="' + id + '" name="serverman[id]" type="hidden"></input>'
        + '<div class="form-group">'
          + '<label class="col-sm-3 control-label">* 姓名</label>'
          + '<div class="col-sm-9">'
            + '<input value="' + name + '" tabindex="1" name="serverman[name]" class="form-control" type="text" placeholder="2 ~ 15 个字符" required autofocus></input>'
          + '</div>'
        + '</div>'
        + '<div class="zx-form-errors"></div>',
      callbackFunction : function(modalJqueryMap){
        var fieldArr,fieldObj = {},servermanObj = {};
        modalJqueryMap.$submitBtn
          .text( '正在修改现场责任人...' )
          .attr( 'disabled', true );
        modalJqueryMap.$cancelBtn.attr( 'disabled', true );
        fieldArr = modalJqueryMap.$modalForm.serializeArray();
        $.each(fieldArr,function(){
          fieldObj[this.name] = this.value;
        });
        servermanObj._id     = fieldObj['serverman[id]'];    // _id
        servermanObj.name     = fieldObj['serverman[name]']; // 姓名

        zx.model.serverman.updateServerman(servermanObj);
      }
    });
  };
  // End Event handler /onUpdateServermanBtnClick/
  
  // Begin Event handler /onDeleteServermanBtnClick/
  onDeleteServermanBtnClick = function() {
    var $that = $(this),
        id = $that.data('id');

    //$that.prop('disabled', true);

    zx.modal.initModule({
      size      : 'modal-sm',
      $title    : $('<h4 class="modal-title">删除现场责任人</h4>'),
      formClass : 'form-deleteServerman',
      main_html : String()
        + '<div class="alert alert-warning" role="alert">确定删除吗？</div>',
      callbackFunction : function(modalJqueryMap){
        modalJqueryMap.$submitBtn
          .text( '正在删除现场责任人...' )
          .attr( 'disabled', true );

        zx.model.serverman.deleteServerman(id);
      }
    });
  };
  // End Event handler /onDeleteServermanBtnClick/
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
    //console.log(argObj);
    zx.model.list.getlist(argObj);

    jqueryMap.$list.on('click','button.newServermanBtn', onNewServermanBtnClick );
    jqueryMap.$list.on('click','button.updateServermanBtn', onUpdateServermanBtnClick );
    jqueryMap.$list.on('click','button.deleteServermanBtn', onDeleteServermanBtnClick );

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