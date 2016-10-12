/* isShowFooter
 * zx.flaglist.js
 * flaglist feature module for zx
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, zx, moment */

zx.flaglist = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  // 声明所有 zx.flaglist 内可用的变量
  var
    // 静态配置值
    configMap = {
      main_html : String()
        + '<div class="zx-list row">'
          + '<div class="col-sm-6">'
            + '<h3>导游旗列表</h3>'
          + '</div>'
          + '<div class="col-sm-6 text-right">'
            + '<button type="button" class="zx-list-top-btn newFlagBtn btn btn-primary">添加导游旗</button>'
          + '</div>'
          + '<table class="table table-striped table-hover table-responsive">'
            + '<thead>'
              + '<tr>'
                + '<th>序号</th>'
                //+ '<th>公司临时</th>'
                + '<th>旗号</th>'
                + '<th>颜色</th>'
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
    onCompleteGetlist, onNewFlagBtnClick, onUpdateFlagBtnClick, onDeleteFlagBtnClick, 
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
        //.append($('<td></td>').text(item.company._id)) // 临时
        .append($('<td></td>').text(item.name))
        .append($('<td></td>').text(item.color))
        .append($('<td></td>').text(moment(item.meta.createAt).format('YYYY-MM-DD')))
        .append($('<td></td>').text(moment(item.meta.updateAt).format('YYYY-MM-DD')))
        .append($('<td></td>')
          .append($('<button class="updateFlagBtn btn btn-xs btn-primary">修改</button>')
            .data('id',item._id)
            .data('name',item.name)
            .data('color',item.color)))
        .append($('<td></td>')
          .append($('<button class="deleteFlagBtn btn btn-xs btn-danger">删除</button>')
            .data('id',item._id)));

      jqueryMap.$tbody.append($tr);
    }
  }; 
  // End Event handler /onCompleteGetlist/
  
  // Begin Event handler /onNewFlagBtnClick/
  onNewFlagBtnClick = function(){
    var company = zx.model.people.get_user().company_id;

    zx.modal.initModule({
      $title    : $('<h4 class="modal-title">添加导游旗</h4>'),
      formClass : 'form-newFlag',
      main_html : String()
        + '<input value="' + company + '" name="flag[company]" type="hidden"></input>'
        + '<div class="form-group">'
          + '<label class="col-sm-3 control-label">* 旗号</label>'
          + '<div class="col-sm-9">'
            + '<input tabindex="1" name="flag[name]" class="form-control" type="text" placeholder="2 ~ 15 个字符" required autofocus></input>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-3 control-label">* 颜色</label>'
          + '<div class="col-sm-7">'
            + '<input tabindex="2" name="flag[color]" class="form-control" type="text" placeholder="2 ~ 15 个字符" required></input>'
          + '</div>'
          + '<div class="col-sm-2">导游旗</div>'
        + '</div>'
        + '<div class="zx-form-errors"></div>',
      callbackFunction : function(modalJqueryMap){
        var fieldArr,fieldObj = {},flagObj = {},
            formValidation =modalJqueryMap.$modalForm.data('formValidation');

        formValidation.validate();
        if(formValidation.isValid()){
          modalJqueryMap.$submitBtn
            .text( '正在添加导游旗...' )
            .attr( 'disabled', true );
          modalJqueryMap.$cancelBtn.attr( 'disabled', true );
          fieldArr = modalJqueryMap.$modalForm.serializeArray();
          $.each(fieldArr,function(){
            fieldObj[this.name] = this.value;
          });
          flagObj.company     = fieldObj['flag[company]']; // 公司 ID
          flagObj.name     = fieldObj['flag[name]'];    // 旗子名称
          flagObj.color = fieldObj['flag[color]'];   // 旗子颜色

          zx.model.flag.newFlag(flagObj);
        }   
      }
    });
  };
  // End Event handler /onNewFlagBtnClick/

  // Begin Event handler /onUpdateFlagBtnClick/
  onUpdateFlagBtnClick = function() {
    var $that = $(this),
        id = $that.data('id'),
        name = $that.data('name'),
        color = $that.data('color');

    zx.modal.initModule({
      $title    : $('<h4 class="modal-title">修改导游旗</h4>'),
      formClass : 'form-updateFlag',
      main_html : String()
        + '<input value="' + id + '" name="flag[id]" type="hidden"></input>'
        + '<div class="form-group">'
          + '<label class="col-sm-3 control-label">* 旗号</label>'
          + '<div class="col-sm-9">'
            + '<input value="' + name + '" tabindex="1" name="flag[name]" class="form-control" type="text" placeholder="2 ~ 15 个字符" required autofocus></input>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-3 control-label">* 颜色</label>'
          + '<div class="col-sm-7">'
            + '<input value="' + color + '" tabindex="2" name="flag[color]" class="form-control" type="text" placeholder="2 ~ 15 个字符" required></input>'
          + '</div>'
          + '<div class="col-sm-2">导游旗</div>'
        + '</div>'
        + '<div class="zx-form-errors"></div>',
      callbackFunction : function(modalJqueryMap){
        var fieldArr,fieldObj = {},flagObj = {};
        modalJqueryMap.$submitBtn
          .text( '正在修改导游旗...' )
          .attr( 'disabled', true );
        modalJqueryMap.$cancelBtn.attr( 'disabled', true );
        fieldArr = modalJqueryMap.$modalForm.serializeArray();
        $.each(fieldArr,function(){
          fieldObj[this.name] = this.value;
        });
        flagObj._id     = fieldObj['flag[id]'];    // _id
        flagObj.name     = fieldObj['flag[name]']; // 旗子名称
        flagObj.color = fieldObj['flag[color]'];   // 旗子颜色

        zx.model.flag.updateFlag(flagObj);
      }
    });
  };
  // End Event handler /onUpdateFlagBtnClick/
  
  // Begin Event handler /onDeleteFlagBtnClick/
  onDeleteFlagBtnClick = function() {
    var $that = $(this),
        id = $that.data('id');

    //$that.prop('disabled', true);

    zx.modal.initModule({
      size      : 'modal-sm',
      $title    : $('<h4 class="modal-title">删除导游旗</h4>'),
      formClass : 'form-deleteFlag',
      main_html : String()
        + '<div class="alert alert-warning" role="alert">确定删除吗？</div>',
      callbackFunction : function(modalJqueryMap){
        modalJqueryMap.$submitBtn
          .text( '正在删除导游旗...' )
          .attr( 'disabled', true );

        zx.model.flag.deleteFlag(id);
      }
    });
  };
  // End Event handler /onDeleteFlagBtnClick/
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

    jqueryMap.$list.on('click','button.newFlagBtn', onNewFlagBtnClick );
    jqueryMap.$list.on('click','button.updateFlagBtn', onUpdateFlagBtnClick );
    jqueryMap.$list.on('click','button.deleteFlagBtn', onDeleteFlagBtnClick );

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