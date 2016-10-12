/**
 * 导入保险卡
 * zx.importpingan.js
 * importpingan module for zx
**/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global $, zx */

zx.importpingan = (function(){
  'use strict';
  var
    // 静态配置值
    configMap = {
      main_html: String()
          + '<button id="importpinganBtn" type="button" class="zx-list-top-btn btn btn-sm btn-success"><span class="btn_text">导入保险</span>&nbsp;<span class="glyphicon glyphicon-hand-down"></span></button>',
      import_tr_html: String()
          + '<tr>'
            + '<td></td>'
            + '<td></td>'
            + '<td></td>'
          + '</tr>',
      import_div_html: String()
        + '<div id="importDiv" style="background-color: #fff;">'
          + '<div class="panel panel-default text-left" style="margin-bottom:0;">'
            + '<p style="font-size:15px;font-weight: 700;height:35px;  margin: 15px 0 5px 0;border-bottom:1px solid #ddd">'
                + '<span style="margin-left:15px;">导入保险卡</span>'
                + '<button style="margin-right:15px;" id="importCloseBtn" class="close" type="button"><span>×</span></button>'
              + '</p>'
              + '<div class="row" style="margin: 0;padding: 0 15px 5px 15px;border-bottom: 1px solid #ddd;">'
                + '<div class="col-sm-3">'
                  + '<button id="delTeamTextareaButton" class="btn btn-danger btn-sm" type="button">'
                    + '清空&nbsp;'
                    + '<span class="glyphicon glyphicon-trash"></span>'
                  + '</button>'
                + '</div>'
                + '<div class="col-sm-3">'
                  + '<button id="stepButton" class="btn btn-success btn-sm" style="margin-left:8px;" type="button">'
                    + '<span class="btnText">下一步</span>&nbsp;'
                    + '<span class="glyphicon glyphicon-chevron-right"></span>'
                  + '</button>'
                + '</div>'
                + '<div class="col-sm-3">'
                  + '<span id="inputButton" class="btn btn-primary btn-sm hidden" type="button" style="float:right;">'
                    + '导入&nbsp;'
                    + '<span class="glyphicon glyphicon-arrow-right"></span>'
                  + '</span>'
                  + '</div>'
                + '</div>'
              + '</div>'
              + '<table id="importTb" class="table table-bordered table-condensed hidden" style="background-color: #fff;">'
                + '<thead>'
                  + '<tr>'
                    + '<th>保险卡号</th>'
                    + '<th>密码</th>'
                    + '<th>领用人</th>'
                  + '</tr>'
                + '</thead>'
                + '<tbody></tbody>'
              + '</table>'
              + '<div class="panel-body" style="padding:0; min-width:600px;">'
                + '<div id="teamTextareaErrDiv" style="color:red; padding:0 5px;"></div>'
                + '<div id="teamTextarea" contenteditable="true" style="min-height:320px;width:100%;background-color:#fcf8e3;"></div>'
              + '</div>'
          + '</div>'
        + '</div>'
    },
    // 动态状态信息
    stateMap,
    // jquery对象缓存集合
    jqueryMap,
    // DOM METHODS

    // EVENT HANDLERS
    on_stepButton_click, on_delTeamTextareaButton_click, on_importpinganBtn_click, on_inputButton_click,
    // PUBLIC METHODS
    configModule, initModule, removeThis;


  //--------------------- BEGIN DOM METHODS --------------------


  //--------------------- END DOM METHODS ----------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  // 下一步，返回上一步
  on_stepButton_click = function(){
    var $spanText = $(this).find('span.btnText'),
        $delTeamTextareaButton = $('#delTeamTextareaButton'),
        $inputButton           = $('#inputButton'),
        $teamTextarea = $('#teamTextarea'),
        personRows, k, personRow, $tr, $tds, len, i, $p, $pbrs, $pbr, kk, pb,
        $tbody = $('#importTb').find('tbody'),
        $teamTextarea_tbody;

    if($spanText.text() === '下一步'){
      // 下一步
      if ($("#teamTextarea").html() === "") {
        // 如果待导入文本框为空
        $('#teamTextareaErrDiv').html("导入文本框不能为空！");
        $("#teamTextarea").parent().addClass('has-error');
        return;
      }

      $tbody.empty();

      $teamTextarea_tbody = $("#teamTextarea").find('tbody');

      if($teamTextarea_tbody.length === 0){
        $('#teamTextareaErrDiv').html("目前只考虑从表中导入！");
        $("#teamTextarea").parent().addClass('has-error');
        return;
      }

      personRows = $teamTextarea_tbody.find('tr');

      for (k = 0; k < personRows.length; k++) {
        personRow = personRows.eq(k).children();
        if(personRow.eq(0).text().trim() !== ""){
          $tr = buildTr(personRow);
          $tbody.append($tr);
        }
      }

      $spanText.text('返回上一步');

      $('#importTb').removeClass('hidden');

      $delTeamTextareaButton.addClass('hidden');
      $inputButton.removeClass('hidden');
      $teamTextarea.addClass('hidden');
    }else{
      // 返回上一步
      $tbody.empty();
      $spanText.text('下一步');

      $('#importTb').addClass('hidden');

      $delTeamTextareaButton.removeClass('hidden');
      $inputButton.addClass('hidden');
      $teamTextarea.removeClass('hidden');
    }

    function buildTr(personRow){
      // 生成tr
      var $tr  = $(configMap.import_tr_html),
          $tds = $tr.children(),
          i;

      for(i = 0; i < 3; i++ ){
        $tds.eq(i).text(personRow.eq(i).text().trim());
      }

      return $tr;
    }
  };

  // 清空
  on_delTeamTextareaButton_click = function(){
    $("#teamTextarea").html("");
    $("#teamTextareaErrDiv").html("");
    $("#teamTextarea").parent().removeClass('has-error');
  };

  // 点击 添加名单 按钮
  on_importpinganBtn_click = function(){
    var $importDiv,
      heightSize;
    // 导入框
    $("#importDiv").remove();

    $importDiv = $(configMap.import_div_html);
    $(this).parent().append($importDiv);

    heightSize = $importDiv.height();
    $importDiv.height('0px');
    $importDiv.animate({
        height: heightSize
    }, {
        duration: 'fast'
    });
  };

  on_inputButton_click = function(){
    var
      cards = [],
      $rows = $('#importTb').find('tbody>tr'), 
      card, $row, i, len_i;

    $(this).attr( 'disabled', true );

    for(i = 0, len_i = $rows.length; i < len_i; i++){
    $row = $rows.eq(i).children();
    card = {
      pinganCardNum : $row.eq(0).text().trim(),
      password      : $row.eq(1).text().trim(),
      serverMan     : $row.eq(2).text().trim()
    };
    cards.push(card);
    }

    //console.log(cards);
    zx.model.pingan.savecards({
      cards  : cards,
      argObj : stateMap.argObj
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

  // Begin PUBLIC method /initModule/
  initModule = function ( jquerymap, statemap ) {
    jqueryMap = jquerymap;
    stateMap  = statemap;

    // 初始化 HTML
    jqueryMap.$topBtnDiv.prepend( configMap.main_html );
    jqueryMap.$importpinganBtn = $('#importpinganBtn');

    // 绑定事件
    // 展开收缩导入框
    jqueryMap.$importpinganBtn.on('click', on_importpinganBtn_click);
    // 下一步，返回上一步
    jqueryMap.$topBtnDiv.on('click','#stepButton', on_stepButton_click);
    // 清空按钮
    jqueryMap.$topBtnDiv.on('click','#delTeamTextareaButton', on_delTeamTextareaButton_click);
    // 导入按钮
    jqueryMap.$topBtnDiv.on('click','#inputButton', on_inputButton_click);
    // 关闭按钮
    jqueryMap.$topBtnDiv.on('click','#importCloseBtn', zx.pinganlist.removeImportDiv);
  };
  // End PUBLIC method /initModule/

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
      jqueryMap.$list.remove();
      jqueryMap = {};
    }
    stateMap.$container       = null;
    //configMap.people_model    = null;
    //configMap.sm_model        = null;
    //configMap.list_model      = null;
    //stateMap.position_type  = 'closed';

    return true;
  };
  // End public method /removeThis/

  return {
    configModule : configModule,
    initModule   : initModule,
    removeThis   : removeThis
  };
})();