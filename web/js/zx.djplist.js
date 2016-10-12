/**
 * zx.djplist.js
 * djplist feature module for zx
**/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, zx, moment */

zx.djplist = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  // 声明所有 zx.djplist 内可用的变量
  var
    // 静态配置值
    configMap = {
      name_select_html : String()
        + '<select class="name_select form-control input-sm" style="padding:5px 0;"></select>',
      main_html : String()
        + '<div class="zx-list row">'
          + '<div class="col-sm-2">'
            + '<h3>登机牌列表</h3>'
          + '</div>'
          +'<div class="col-sm-3">'
            + '<div class="zx-list-top-btn input-group input-group-sm pull-left">'
              + '<span class="input-group-btn">'
                + '<button id="preSmDate" class="btn btn-sm btn-default">'
                  + '服务日期'
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
          + '</div>'
          + '<table class="table table-striped table-hover">'
            + '<thead>'
              + '<tr>'
                + '<th style="min-width:50px;">序号</th>'
                + '<th style="min-width:300px;">单号</th>'
                + '<th style="min-width:50px;">导出</th>'
                + '<th style="min-width:50px;">办理</th>'
                + '<th style="min-width:70px;">用户名</th>'
                + '<th style="min-width:650px;">备注</th>'
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
    onCompleteGetlist, 
    onComplete_setName, onNameSelectChange,
    //onComplete_setNote, onDjpNoteInputChange,
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
    //console.log(results);
    // 初始化
    jqueryMap.$tbody.html('');
    // 渲染表格
    var result     = results[0].smSort,
        smDate     = results[0].smDate,
        dengjipais = results[0].dengjipais,
        djpObj     = results[0].djpObj,
        selectHtml = String()
          + '<option value=""></option>',
        k, len_k,
      smTime, smDateStr, smNum,
      i, item, $tr;

  // 初始化
    $('#smDateInput').val(smDate);

    jqueryMap.$tbody.html('');

    // 用户名 select
    // 用户名 options
    for(k = 0, len_k = dengjipais.length; k < len_k; k++){
      selectHtml+= '<option value="' + dengjipais[k].name + '">' + dengjipais[k].name + '</option>';
    }
  // 渲染表格    
    for(i=0; i<result.length; i++) {
      item = result[i];

      // 服务单号
      smTime = moment(item.flight.flightStartTime).format('HHmm');
      smDateStr = smDate.substring(5, 10).replace("-", "");
      smNum = smDateStr + smTime + item.flight.flightNum + (item.operator).substr(0,item.operator.length - 11) + item.smRealNumber +"人" + (item.smType2===1?'内':'外') + '送';

      // 服务航班
      //smFlightNum = item.flight.flightNum + " " + item.flight.flightStartCity + "-" + item.flight.flightEndCity + " " + item.flight.flightStartTime + "-" + item.flight.flightEndTime;
      $tr=$('<tr></tr>')
        .addClass('item-id-' + item._id)
      .data('sm', item._id);

      $tr
        .append($('<td></td>').text(i+1))
        .append($('<td></td>').text(smNum));
      if(djpObj[item._id]) {
        $tr
          .data('id', djpObj[item._id]._id)
          .css('color','blue')
          .append($('<td></td>').text(djpObj[item._id].isDownload ? '已导' : ''))
          .append($('<td></td>').text(djpObj[item._id].isPrint ? '已办' : ''))
          .append($('<td style="padding:0;"></td>').append($(configMap.name_select_html).append(selectHtml).val(djpObj[item._id].name)))
          .append($('<td class="djpNoteTd" style="padding:0;"></td>').append($('<input type="text" class="djpNoteInput form-control input-sm"></input>').val(djpObj[item._id].djpNote)));
      } else {
        $tr
          .append($('<td></td>'))
          .append($('<td></td>'))
          .append($('<td style="padding:0;"></td>').html($(configMap.name_select_html).append(selectHtml)))
          .append($('<td class="djpNoteTd" style="padding:0;"></td>'));
      }
    
        

      jqueryMap.$tbody.append($tr);
    }

    // 结束渲染
    // 开始注册事件
    // 
    // 日期控件
    $('#smDateInput').datetimepicker({
      format: 'YYYY-MM-DD',
      dayViewHeaderFormat: 'YYYY MMMM',
      useCurrent: false,
      locale: 'zh-cn',
      showTodayButton: true
    }).on("dp.change", function(){
      smDate = $(this).val();

      $.uriAnchor.setAnchor({ 
        'page'   : 'list', 
        'c'      : 'djp', 
        'smdate' : smDate,
        'n'      : '0' 
      }, null, true );
    });
    // 前一天后一天
    $('#preSmDate').click(function () {       
        if (smDate === "") {
            smDate = moment().subtract(1, 'day').format('YYYY-MM-DD');
        } else {
            smDate = moment(smDate).subtract(1, 'day').format('YYYY-MM-DD');
        }

        $.uriAnchor.setAnchor({ 
        'page'   : 'list', 
        'c'      : 'djp', 
        'smdate' : smDate,
        'n'      : '0' 
      }, null, true );
    });
    $('#nextSmDate').click(function () {        
        if (smDate === "") {
            smDate = moment().add(1, 'day').format('YYYY-MM-DD');
        } else {
            smDate = moment(smDate).add(1, 'day').format('YYYY-MM-DD');
        }
        
        $.uriAnchor.setAnchor({ 
        'page'   : 'list', 
        'c'      : 'djp', 
        'smdate' : smDate,
        'n'      : '0' 
      }, null, true );
    });
  }; 
  // End Event handler /onCompleteGetlist/
  
  onComplete_setName = function(event, results){
    var result = results[0],
        $tr;

    //console.log(result);
    // 已检验
    
    if((result.success === 1) || (result.success.ok && result.success.ok === 1)){
      $tr = $('.item-id-' + result.obj.sm);
      if(result.obj.name === ''){
        $tr.css('color', '#000');
        $tr.find('input.djpNoteInput').remove();
      }else{
        $tr
          .data('id', result.obj.id)
          .css('color', 'blue');

        if($tr.find('input.djpNoteInput').length === 0){
          $tr.find('td.djpNoteTd').html('<input type="text" class="djpNoteInput form-control input-sm"></input>');
        }
      }
    } 
  }

  onNameSelectChange = function(){
    var 
      $that = $(this),
      $tr   = $that.closest('tr');

    $tr.css('color', 'red');
    zx.model.djp.setName({
      sm  : $tr.data('sm'),
      name : $that.val()
    });
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
    $.gevent.subscribe( jqueryMap.$list, 'zx-setName', onComplete_setName );
    
    // getlist
    zx.model.list.getlist(argObj);

    jqueryMap.$list.on('change','select.name_select', onNameSelectChange );
    //jqueryMap.$list.on('change','input.djpNoteInput', onDjpNoteInputChange );

    jqueryMap.$list.on('change','input.djpNoteInput',function(){
      var 
        $that = $(this),
        req = {
          id : $that.closest('tr').data('id'),
          djpNote : $that.val()     
        };  

      $.post('http://zxsl.net.cn/dengjipai_djpnote', req, function(obj){
        if(!(obj.success === 1 || (obj.success.ok && obj.success.ok === 1))) {
          alert('写入数据库失败！');
        }
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
      jqueryMap.$list.off('click');
      jqueryMap.$list.remove();
      jqueryMap = {};
    }
    stateMap.$container = null;

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