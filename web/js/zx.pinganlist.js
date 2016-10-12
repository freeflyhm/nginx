/**
 * zx.pinganlist.js
 * pinganlist feature module for zx
**/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, zx, moment */

zx.pinganlist = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  // 声明所有 zx.pinganlist 内可用的变量
  var
    // 静态配置值
    configMap = {
      main_html : String()
        + '<div class="zx-list row">'
          +'<div class="col-sm-2">'
            + '<h3>保险卡</h3>'
          + '</div>'
          + '<div class="col-sm-2">'
            + '<select id="filterSelect" class="form-control input-sm" style="margin-top: 10px;">'
              + '<option value="0"></option>'
              + '<option value="1">问题卡</option>'
              + '<option value="2">未开卡</option>'
              + '<option value="3">已开卡</option>'     
            + '</select>'
          + '</div>'
          + '<div class="col-sm-2">'
            + '<select id="serverManSelect" class="form-control input-sm" style="margin-top: 10px;"></select>'
          + '</div>'
          +'<div class="col-sm-3">'
            + '<div class="zx-list-top-btn input-group input-group-sm pull-left">'
              + '<span class="input-group-btn">'
                + '<button id="preSmDate" class="btn btn-sm btn-default">'
                  + '激活日期'
                  + '<span class="glyphicon glyphicon-chevron-left"></span>'
                + '</button>'
              + '</span>'
              + '<div style="position:relative;">'
                + '<input id="smDateInput" class="inputDate form-control input-sm text-left" type="text"></input>'
              + '</div>'
              + '<span class="input-group-btn">'
                + '<button id="nextSmDate" class="btn btn-sm btn-default">'
                  + '<span class="glyphicon glyphicon-chevron-right"></span>'
                + '</button>'
              + '</span>'
            + '</div>'
            + '<div style="clear:both"></div>'
          + '</div>'
          +'<div id="topBtnDiv" class="col-sm-3 text-right"></div>'
          +'<div class="col-sm-12">'
            + '<nav>'
              + '<ul id="zx_pingan_list_page_ul_top" class="pagination pagination-sm" style="margin: 0;"></ul>'
            + '</nav>'
          + '</div>'  
          + '<div class="row">'
            + '<table class="table table-striped table-hover table-responsive">'
              + '<thead>'
                + '<tr>'
                  + '<th>序号</th>'
                  + '<th>保险卡号</th>'
                  + '<th>密码</th>'
                  + '<th>领用人</th>'
                  + '<th>领用日期</th>'
                  + '<th>状态</th>'
                  + '<th>备注</th>'
                  + '<th>修改</th>'
                  + '<th>姓名</th>'
                  + '<th>手机</th>'
                  + '<th>证件号码</th>'
                  + '<th>证件类型</th>'
                  + '<th>出生日期</th>'
                  + '<th>性别</th>'
                  + '<th>激活时间</th>'
                + '</tr>'
              + '</thead>'
              + '<tbody class="zx-list-tbody">'
              + '</tbody>'
            + '</table>'
          + '</div>'
          + '<nav>'
            + '<ul id="zx_pingan_list_page_ul" class="pagination pagination-sm" style="margin: 0;"></ul>'
          + '</nav>'
        + '</div>'
    },
    // 动态状态信息
    stateMap  = { $container : null },
    jqueryMap = {},
    // EVENT HANDLERS
    onCompleteGetlist, onUpdateInsuranceBtnClick, onChangeServerMan,
    // DOM METHODS
    setJqueryMap, 

    // PUBLIC METHODS
    removeImportDiv, configModule, initModule, removeThis;
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
      $topBtnDiv : $('#topBtnDiv'),
      $tbody     : $container.find('.zx-list-tbody')
    };
  };
  // End DOM method /setJqueryMap/
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  // Begin Event handler /onCompleteGetlist/
  onCompleteGetlist = function ( event, results ) {  
    var result      = results[0].cards,
        liveDate    = results[0].liveDate,
        server      = results[0].server,
        filter      = results[0].filter,
        currentPage = results[0].currentPage,
        totalPage   = results[0].totalPage,
        pageSplit   = 9,
        serverManSelectHtml = String()
          + '<option value=""></option>',
        serverManHtml_lis = '',
        serverManHtml     = '',
        k, len_k,
        ulStr, class_active, startPage, endPage,
        i, item, $tr, theState;

    //console.log(servermans);
    // 初始化
    if(!stateMap.servermans){
      stateMap.servermans  = results[0].servermans;
    }
    
    jqueryMap.$tbody.html('');
    //渲染选项区
    $('#filterSelect').val(filter);
    // 填充领用人选项卡
    for(k = 0, len_k = stateMap.servermans.length; k < len_k; k++){
      serverManSelectHtml+= '<option value="' + stateMap.servermans[k].name + '">' + stateMap.servermans[k].name + '</option>';
    }
    $('#serverManSelect')
      .html(serverManSelectHtml)
      .val(server);

    $('#smDateInput').val(liveDate);


    // 渲染表格

    for(k = 0, len_k = stateMap.servermans.length; k < len_k; k++){
      serverManHtml_lis += '<li class="serverManLi"><a href="javascript:;">' + stateMap.servermans[k].name + '</a></li>';
    }

    for(i=0; i<result.length; i++) {
      item = result[i];
      $tr=$('<tr></tr>').addClass('item-id-' + item._id);

      serverManHtml = String()
          + '<div class="btn-group">'
            + '<button class="serverManBtn btn btn-xs btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">' + item.serverMan + '&nbsp;<span class="caret"></span></button>'
            + '<ul class="dropdown-menu" role="menu" style="min-width:0" data-id="' + item._id + '">'
              + serverManHtml_lis
            + '</ul>'
          + '</div>';

      switch(item.isInsurance){
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
        .append($('<td></td>').text(i+1))
        .append($('<td></td>').text(item.pinganCardNum))
        .append($('<td></td>').text(item.password))
        .append($('<td class="serverMan" style="padding:5px 0;"></td>').html(serverManHtml))
        .append($('<td></td>').text(moment(item.meta.createAt).format('YYYY-MM-DD')))
        .append($('<td></td>').text(theState))
        .append($('<td></td>').text(item.notes))
        .append($('<td></td>')
          .append($('<button class="updateInsuranceBtn btn btn-xs btn-primary">修改</button>')
              .data('item',item)))
        .append($('<td></td>').text(item.name))
        .append($('<td></td>').text(item.phone))
        .append($('<td></td>').text(item.cardCategory))
        .append($('<td></td>').text(item.cardNum))
        .append($('<td></td>').text(item.birthday))
        .append($('<td></td>').text(item.sex))
        .append($('<td></td>').text(moment(item.liveTime).format('YYYY-MM-DD HH:mm')));

      jqueryMap.$tbody.append($tr);
    }

    // 分页
    if(totalPage > 1){
      startPage = Math.floor((currentPage - 1 ) / (pageSplit - 1)) * (pageSplit - 1) + 1;
      endPage   = startPage + pageSplit - 1;
      endPage   = endPage < totalPage ? endPage : totalPage;

      ulStr = String();

      if(startPage > 1){
        ulStr += '<li><a href="#!page=list&c=pingan&livedate=' + liveDate + '&server=' + server + '&filter=' + filter + '&n=0">1</a></li>';
        ulStr += '<li><span style="border:0; background-color: transparent; padding: 5px;">...</span></li>';
        ulStr += '<li><a href="#!page=list&c=pingan&livedate=' + liveDate + '&server=' + server + '&filter=' + filter + '&n=' + (startPage - 2) + '">' + (startPage - 1) + '</a></li>';
      }

      for(i = startPage; i <= endPage; i++){
        class_active = currentPage === i ? 'active' : '';
        ulStr += '<li class="' + class_active + '"><a href="#!page=list&c=pingan&livedate=' + liveDate + '&server=' + server + '&filter=' + filter + '&n=' + (i - 1) + '">' + i + '</a></li>';
      }

      if(endPage < totalPage){
        ulStr += '<li><span style="border:0; background-color: transparent; padding: 5px;">...</span></li>';
        ulStr +='<li><a href="#!page=list&c=pingan&livedate=' + liveDate + '&server=' + server + '&filter=' + filter + '&n=' + (totalPage - 1) + '">' + totalPage + '</a></li>';
      }
    }
    
    $('#zx_pingan_list_page_ul').html(ulStr);
    $('#zx_pingan_list_page_ul_top').html(ulStr);

    removeImportDiv();


    // 结束渲染
    // 开始注册事件
    // 
    // 日期控件
    $('#smDateInput').datetimepicker({
      format: 'YYYY-MM-DD',
      dayViewHeaderFormat: 'YYYY MMMM',
      useCurrent: false,
      locale: 'zh-cn',
      showTodayButton: true,
      showClear: true
    }).on("dp.change", function(){
      var filter = $('#filterSelect').val(),
          server = $('#serverManSelect').val();

      $.uriAnchor.setAnchor({ 
        'page'     : 'list', 
        'c'        : 'pingan', 
        'livedate' : $(this).val(),
        'server'   : server,
        'filter'   : filter,
        'n'        : '0' 
      }, null, true );
    });
    // 前一天后一天
    $('#preSmDate').click(function () {
      var livedate = $('#smDateInput').val().trim(),
          filter   = $('#filterSelect').val(),
          server   = $('#serverManSelect').val();
      if (livedate === "") {
          livedate = moment().subtract(1, 'day').format('YYYY-MM-DD');
      } else {
          livedate = moment(livedate).subtract(1, 'day').format('YYYY-MM-DD');
      }

      $.uriAnchor.setAnchor({ 
        'page'     : 'list', 
        'c'        : 'pingan', 
        'livedate' : livedate,
        'server'   : server,
        'filter'   : filter,
        'n'        : '0' 
      }, null, true );
    });
    $('#nextSmDate').click(function () {
      var livedate = $('#smDateInput').val().trim(),
          filter   = $('#filterSelect').val(),
          server   = $('#serverManSelect').val();

      if (livedate === "") {
          livedate = moment().add(1, 'day').format('YYYY-MM-DD');
      } else {
          livedate = moment(livedate).add(1, 'day').format('YYYY-MM-DD');
      }
      
      $.uriAnchor.setAnchor({ 
        'page'     : 'list', 
        'c'        : 'pingan', 
        'livedate' : livedate,
        'server'   : server,
        'filter'   : filter,
        'n'        : '0' 
      }, null, true );
    });
  }; 
  // End Event handler /onCompleteGetlist/
  
  onUpdateInsuranceBtnClick = function(){
    var $that = $(this),
        item = $that.data('item');
    
    zx.modal.initModule({
      size      :'modal-sm',
      $title    : $('<h4 class="modal-title">修改保险卡状态</h4>'),
      formClass : 'form-updatePingan',
      main_html : String()
        + '<input value="' + item._id + '" name="pingan[id]" type="hidden"></input>'
        + '<div class="form-group">'
          + '<label class="col-sm-3 control-label">状态</label>'
          + '<div class="col-sm-9">'
            + '<select class="form-control" name="pingan[isInsurance]">'
              + '<option value="1">问题卡</option>'
              + '<option value="2">未开卡</option>'
              + '<option value="3">已开卡</option>'
            + '</select>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-3 control-label">备注</label>'
          + '<div class="col-sm-9">'
            + '<input tabindex="2" name="pingan[notes]" class="form-control" type="text"></input>'
          + '</div>'
        + '</div>'
        + '<div class="zx-form-errors"></div>',
      callbackFunction : function(modalJqueryMap){
        var fieldArr,fieldObj = {},pinganObj = {};
        modalJqueryMap.$submitBtn
          .text( '正在修改...' )
          .attr( 'disabled', true );
        modalJqueryMap.$cancelBtn.attr( 'disabled', true );
        fieldArr = modalJqueryMap.$modalForm.serializeArray();
        $.each(fieldArr,function(){
          fieldObj[this.name] = this.value;
        });
        pinganObj._id     = fieldObj['pingan[id]'];    // _id
        pinganObj.isInsurance    = fieldObj['pingan[isInsurance]']; 
        pinganObj.notes = fieldObj['pingan[notes]']; 

        //console.log(pinganObj);
        zx.model.pingan.updatePingan(pinganObj);
      }
    });
  };

  onChangeServerMan = function(event, result){
    var $serverManBtn, btn_text;
    //console.log(result);
    // 已检验
    if(result.success.ok === 1){

      btn_text = result.serverMan;

      $serverManBtn = $('tr.item-id-' + result.pingan_id).find('button.serverManBtn');
      $serverManBtn
        .html( btn_text + '&nbsp;<span class="caret"></span>')
        .prop("disabled", false);

    } else {
      alert('老板，服务器压力山大，请再试一次！');
    }
  };
  //-------------------- END EVENT HANDLERS --------------------

  //------------------- BEGIN PUBLIC METHODS -------------------
  removeImportDiv = function(){
    if($("#importDiv").length !== 0){
      $("#importDiv").animate({
        height: 'toggle'
      }, 'fast').promise().done(function () {
        $(this).remove();
      });
    }
  };
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
    stateMap.argObj     = argObj;

    setJqueryMap();

    // 导入保险
    zx.importpingan.initModule(jqueryMap, stateMap);

    $.gevent.subscribe( jqueryMap.$list, 'zx-completeGetlist', onCompleteGetlist );
    $.gevent.subscribe( jqueryMap.$list, 'zx-changeServerMan_pangan', onChangeServerMan );
    
    // getlist
    zx.model.list.getlist(argObj);

    //jqueryMap.$list.on('click','button.newOperatorBtn', onNewOperatorBtnClick );
    jqueryMap.$list.on('click','button.updateInsuranceBtn', onUpdateInsuranceBtnClick );

    //jqueryMap.$list.on('click','button.deleteOperatorBtn', onDeleteOperatorBtnClick );
    
    $('#filterSelect').change(function(){
      var livedate = $('#smDateInput').val(),
          server   = $('#serverManSelect').val();

      $.uriAnchor.setAnchor({ 
        'page'     : 'list', 
        'c'        : 'pingan', 
        'livedate' : livedate, 
        'server'   : server,
        'filter'   : $(this).val(), 
        'n'        : '0' 
      }, null, true );
    });

    $('#serverManSelect').change(function(){
      var livedate = $('#smDateInput').val(),
          filter   = $('#filterSelect').val();

      $.uriAnchor.setAnchor({ 
        'page'     : 'list', 
        'c'        : 'pingan', 
        'livedate' : livedate, 
        'server'   : $(this).val(),
        'filter'   : filter, 
        'n'        : '0' 
      }, null, true );
    });

    // 修改领用人
    jqueryMap.$list.on('click','li.serverManLi', function () {
      var $that = $(this),
          serverMan = $that.text(),
          $serverManBtn = $that.closest('div.btn-group').find('button.serverManBtn'),
          id = $that.parent().data("id");

      $serverManBtn.prop("disabled", true);
      // 提交服务器修改领用人
      zx.model.pingan.changeServerMan({
        pingan_id : id,
        serverMan : serverMan
      });
    });

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
      //jqueryMap.$list.off('click');
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
    removeImportDiv : removeImportDiv,
    configModule : configModule,
    initModule   : initModule,
    removeThis : removeThis
  };
  //------------------- END PUBLIC METHODS ---------------------
}());