/*
 * zx.companylist.js
 * companylist feature module for zx
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, zx, moment */

zx.companylist = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  // 声明所有 zx.companylist 内可用的变量
  var
    // 静态配置值
    configMap = {
      feestempLi_html : String()
        + '<li class="feestempLi"><a href="javascript:;"></a></li>',
      main_html : String()
        + '<div class="zx-list row">'
          +'<div class="col-sm-6">'
            + '<h3>公司列表</h3>'
          + '</div>'
          + '<table class="table table-striped table-hover table-responsive">'
            + '<thead>'
              + '<tr>'
                + '<th style="width:60px;">序号</th>'
                //+ '<th style="width:60px;">省份</th>'
                + '<th style="width:60px;">城市</th>'
                + '<th>公司名称</th>'
                + '<th style="width:80px;">公司类型</th>'
                + '<th>银行账号</th>'
                + '<th class="role30 hidden" style="width:60px;">验证</th>'
                + '<th class="role30 hidden" style="width:60px;" title="每月生成对账单的那一刻需要此数据">验证费</th>'
                + '<th style="width:80px;">创建日期</th>'
                //+ '<th>最后更新</th>'
                + '<th class="role30 hidden" style="width:100px;">服务费</th>'
                + '<th class="role30 hidden" style="width:60px;">修改</th>'
                + '<th class="role30 hidden" style="width:60px;">用户</th>'
              + '</tr>'
            + '</thead>'
            + '<tbody class="zx-list-tbody">'
            + '</tbody>'
          + '</table>'
        + '</div>'
    },
    // 动态状态信息
    stateMap  = { 
      $container : null,
      fees       : null
    },
    jqueryMap = {},

    // DOM METHODS
    setJqueryMap, 
    // EVENT HANDLERS
    onCompleteGetlist, onUpdateCompanyBtnClick, on_feestempLi_click, on_changeFeesTemp, on_isidcard_change,
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
    var result = results[0].companys,
        fees   = results[0].fees,
        obj    = results[0].obj,
        $ul    = $('<ul></ul>'),
        $li,
        i, item, $tr, $td, fees_html, fees_btn_html;
        //$input_is, $td_is;
    
    stateMap.role = obj.role;

    if( JSON.stringify(results[0]) === "{}" ) {
      return;
    }

    for(i = 0; i<fees.length; i++) {
      $li =  $(configMap.feestempLi_html);
      $li.find('a').text(fees[i].name);
      $ul.append($li);
    }

    // 渲染表格
    for(i = 0; i<result.length; i++) {
      item = result[i];
      $tr  = $('<tr></tr>').addClass('item-id-' + item._id);
      $td  = $('<td class="role30 hidden"></td>');
      //$td_is  = $('<td class="role30 hidden"></td>');

      if(item.category === 20 ){

        fees_btn_html = String()
          + '<button class="updateItemFeesTempBtn btn btn-xs btn-primary" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' + item.feestemp + '&nbsp;<span class="caret"></span></button>';      
        fees_html = String()
          + '<div class="updateItemFees dropdown">'
            + fees_btn_html
            + '<ul class="dropdown-menu" role="menu" style="min-width:0" data-id="' + item._id + '">'
              + $ul.html()
            + '</ul>'
          + '</div>';
        
        $td.append(fees_html);

        /*$input_is = $('<input type="checkbox" data-id="' + item._id + '">');
        if (item.isidcard) {
          $input_is.prop('checked', true);
        }
        $td_is.append($input_is);*/
      }

      $tr
        .append($('<td></td>').text(i+1))
        //.append($('<td></td>').text(item.province))
        .append($('<td></td>').text(item.city))
        .append($('<td></td>').text(item.name))
        .append($('<td></td>').text(item.category===20?'地接社':'服务商'))
        .append($('<td></td>').text(item.bankCard))
        .append($('<td></td>').text(item.isidcard?'是':'否'))
        .append($('<td></td>').text(item.idcardfee?item.idcardfee/1000:''))
        .append($('<td></td>').text(moment(item.meta.createAt).format('YYYY-MM-DD')))
        .append($td)
        //.append($td_is)
        .append($('<td class="role30 hidden"></td>')
          .append($('<button class="updateCompanyBtn btn btn-xs btn-primary">修改</button>')
            .data('id',item._id)
            .data('name',item.name)
            .data('category',item.category)
            .data('bankcard',item.bankCard)
            .data('isidcard',item.isidcard)
            .data('idcardfee',item.idcardfee)
          ))
        .append($('<td class="role30 hidden"></td>')
          .append($('<a class="btn btn-xs btn-info" href="#!page=list&c=user&findcompany=' + item._id + '&n=0" role="button">进入用户页 >></a>')));

      jqueryMap.$tbody.append($tr);
    }
    if(obj.role >= 30) {
      $('.role30').removeClass('hidden');
    }
  }; 

  //------------------- BEGIN EVENT HANDLERS -------------------
  // Begin Event handler /onUpdateCompanyBtnClick/ 
  onUpdateCompanyBtnClick = function(){
    var $that = $(this),
        id = $that.data('id'),
        name = $that.data('name'),
        bankCard = (typeof $that.data('bankcard')) === 'undefined' ? '' : $that.data('bankcard'),
        category = Number($that.data('category')),
        category30 = category===30?'selected':'',
        disabledStr = stateMap.role === 99 ? '' : 'disabled';

    var isidcard = !!$that.data('isidcard');
    var isidcardFalse = isidcard ? '' : 'selected';
    var idcardfee = (typeof $that.data('idcardfee')) === 'undefined' ? 1000 : $that.data('idcardfee');

    //console.log(idcardfee);

    zx.modal.initModule({
      $title    : $('<h4 class="modal-title">修改公司信息</h4>'),
      formClass : 'form-updateCompany',
      main_html : String()
        + '<input value="' + id + '" name="company[id]" type="hidden"></input>'
        + '<div class="form-group">'
          + '<label class="col-sm-3 control-label">*公司名称</label>'
          + '<div class="col-sm-9">'
            + '<input value="' + name + '" tabindex="1" name="company[name]" class="zx-register-form-companyName-input form-control" type="text" placeholder="2 ~ 15 个字符" required autofocus></input>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-3 control-label">*公司类型</label>'
          + '<div class="col-sm-9">'
            + '<select class="form-control" name="company[category]" ' + disabledStr + '>'
              + '<option value="20">地接社</option>'
              + '<option value="30" ' + category30 + '>服务商</option>'
            + '</select>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-3 control-label">银行账号</label>'
          + '<div class="col-sm-9">'
            + '<input value="' + bankCard + '" name="company[bankCard]" class="zx-register-form-companyName-input form-control" type="text"></input>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-3 control-label">是否验证</label>'
          + '<div class="col-sm-9">'
            + '<select class="form-control" name="company[isidcard]">'
              + '<option value="true">验证</option>'
              + '<option value="false"  ' + isidcardFalse + '>不验证</option>'
            + '</select>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-3 control-label">验证费（元/次）</label>'
          + '<div class="col-sm-9">'
            + '<input class="form-control" value="' + idcardfee/1000 + '" name="company[idcardfee]" type="text">'
          + '</div>'
        + '</div>'
        + '<div class="zx-form-errors"></div>',
      callbackFunction : function(modalJqueryMap){
        var idcardfee;
        var fieldArr,fieldObj = {},companyObj = {};
        modalJqueryMap.$submitBtn
          .text( '正在修改公司信息...' )
          .attr( 'disabled', true );
        modalJqueryMap.$cancelBtn.attr( 'disabled', true );
        fieldArr = modalJqueryMap.$modalForm.serializeArray();
        $.each(fieldArr,function(){
          fieldObj[this.name] = this.value;
        });
        companyObj._id       = fieldObj['company[id]'];
        companyObj.name      = fieldObj['company[name]'];     // 公司名称
        companyObj.category  = fieldObj['company[category]'] || category; // 公司类型
        companyObj.bankCard  = fieldObj['company[bankCard]']; // 银行账号
        companyObj.isidcard  = fieldObj['company[isidcard]'] === 'true' ? true : false;

        idcardfee = Number(fieldObj['company[idcardfee]']);
        if (!idcardfee) {
          idcardfee = 1; // 默认 1元
        }
        //console.log(idcardfee);
        companyObj.idcardfee = idcardfee * 1000;
        //console.log(companyObj);
        zx.model.people.updateCompany(companyObj);
      } 
    });
  };
  // End Event handler /onUpdateCompanyBtnClick/
  // 
  on_feestempLi_click = function(){
    var $that = $(this),
        feestemp = $that.find('a').text(),
        $updateItemFeesTempBtn = $that.closest('div').find('button.updateItemFeesTempBtn'),
        id = $that.parent().data("id");

    $updateItemFeesTempBtn.prop("disabled", true);

    // 提交服务器修改服务费模板
    //console.log({
    zx.model.people.changeFeesTemp({
      id       : id,
      feestemp : feestemp
    });
  };

  on_isidcard_change = function () {
    var $that = $(this);
    var checked = $that.prop('checked');

    zx.model.people.changeIsidcard({
      id       : $that.data('id'),
      isidcard : checked
    }, function(results) {
      if (results.success !== 0) {
        alert('修改失败，重试一次');
        $that.prop('checked', !checked);
      }
    });
  };

  on_changeFeesTemp = function(event, results){
    var result = results[0],
        $updateItemFeesTempBtn, btn_text;
    
    //console.log(result);
    // 已检验
    if(result.success.ok === 1){
      $updateItemFeesTempBtn = $('tr.item-id-' + result.obj.id).find('button.updateItemFeesTempBtn');
      $updateItemFeesTempBtn
        .html( result.obj.feestemp + '&nbsp;<span class="caret"></span>')
        .prop("disabled", false);
    } else {
      alert('老板，服务器压力山大，请再试一次！');
    }
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
    $.gevent.subscribe( jqueryMap.$list, 'zx-changeFeesTemp',  on_changeFeesTemp );

    zx.model.list.getlist(argObj);

    jqueryMap.$list.on('click','button.updateCompanyBtn', onUpdateCompanyBtnClick );
    jqueryMap.$list.on('click','li.feestempLi', on_feestempLi_click );
    jqueryMap.$list.on('change', 'input[type=checkbox]', on_isidcard_change);
    
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