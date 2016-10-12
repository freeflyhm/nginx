/* 对账单
 * zx.statement.js
 * statement feature module for zx
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, zx */

zx.statement = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  // 声明所有 zx.statement 内可用的变量
  var
    // 静态配置值
    configMap = {
      main_html : String()
        + '<div class="zx-statement hidden">'
          + '<div class="zx-team-header row">'
            + '<div class="col-sm-2">'
              + '<h3>对账单</h3>'
            + '</div>'
            + '<div class="col-sm-3">'
              + '<input type="text" class="form-control input-sm" id="companyInput" placeholder="公司名称" style="margin-top: 10px;" readonly>'
            + '</div>'
            + '<div class="col-sm-2">'
              + '<select id="bpmonthSelect" class="form-control input-sm hidden" style="margin-top: 10px;">'
                // + '<option></option>'
                + '<option>2015-04</option>'
                + '<option>2015-05</option>'
                + '<option>2015-06</option>'
                + '<option>2015-07</option>'
                + '<option>2015-08</option>'
                + '<option>2015-09</option>'
                + '<option>2015-10</option>'
                + '<option>2015-11</option>'
                + '<option>2015-12</option>'
              + '</select>'
            + '</div>'
            + '<div class="col-sm-1">'
              + '<button id="searchBtn" type="button" class="btn btn-sm btn-default hidden" style="margin-top: 10px;">查询&nbsp;<span class="glyphicon glyphicon-search" aria-hidden="true"></span></button>'
            + '</div>'
            + '<div class="col-sm-4">'
              + '<button id="statementDelBtn" type="button" class="btn btn-sm btn-danger" style="margin-top: 10px;">删除对账单&nbsp;<span class="glyphicon glyphicon-duplicate" aria-hidden="true"></span></button>'
              + '<button id="statementLockBtn" type="button" class="btn btn-sm btn-success" style="margin-top: 10px;">确认对账单&nbsp;<span class="glyphicon glyphicon-duplicate" aria-hidden="true"></span></button>'
              + '<button id="statementImportBtn" type="button" class="btn btn-sm btn-default" style="margin-top: 10px;margin-left: 8px;">导出对账单&nbsp;<span class="glyphicon glyphicon-duplicate" aria-hidden="true"></span></button>'
            + '</div>'
          + '</div>'
          + '<div class="zx-team">'
            + '<table class="table table-bordered table-condensed">'
              + '<caption>尊敬的客户您好，贵公司<span class="span_year"></span>年<span class="span_month"></span>月产生的费用明细如下，请核对：</caption>'
              + '<thead>'
                + '<tr>'
                  + '<th>序号</th>'
                  + '<th>团号</th>'
                  + '<th>日期</th>'
                  + '<th>操作人</th>'
                  + '<th>团队类型</th>'
                  + '<th>航班号</th>'
                  + '<th>人数</th>'
                  + '<th>验证</th>'
                  + '<th>代收款</th>'
                  + '<th>代付款</th>'
                  + '<th>服务费(调价)</th>'
                  + '<th>交通费</th>'
                + '</tr>'
              + '</thead>'
              + '<tbody id="zx-team-tbody">'
              + '</tbody>'
              + '<tfoot>'
                + '<tr>'
                  + '<td colspan="7"><strong>合计</strong></td>'
                  + '<td><strong id="idcardsmfees_sum"></strong></td>'
                  + '<td><strong id="smAgencyFund_y_sum"></strong></td>'
                  + '<td><strong id="smPayment_y_sum"></strong></td>'
                  + '<td><strong id="fees_sum"></strong></td>'
                  + '<td><strong id="carFees_sum"></strong></td>'
                + '</tr>'
              + '</tfoot>'
            + '</table>'
            + '<table class="table table-bordered table-condensed">'
              + '<caption><span class="span_year"></span>年<span class="span_month"></span>月我处与贵公司发生的往来账明细</caption>'
              + '<thead>'
                + '<tr>'
                  + '<th>序号</th>'
                  + '<th>备注</th>'
                  + '<th>日期</th>'
                  + '<th>借贷</th>'
                  + '<th>金额</th>'
                + '</tr>'
              + '</thead>'
              + '<tbody id="zx-bp-tbody">'
              + '</tbody>'
              + '<tfoot>'
                + '<tr>'
                  + '<td colspan="4"><strong>合计</strong></td>'
                  + '<td><strong id="bpNum_sum"></strong></td>'
                + '</tr>'
              + '</tfoot>'
            + '</table>'
            + '<table style="width: 600px;" class="table table-bordered table-condensed">'
              + '<caption><span class="span_year"></span>年<span class="span_month"></span>月汇总如下:</caption>'
              + '<thead>'
                + '<tr>'
                  + '<th>序号</th>'
                  + '<th>项目</th>'
                  + '<th>金额</th>'
                + '</tr>'
              + '</thead>'
              + '<tbody id="zx-bp-tbody">'
                + '<tr>'
                  + '<td>1</td>'
                  + '<td>上月余额</td>'
                  + '<td id="lastMonthBalance_td"></td>'
                + '</tr>'
                + '<tr>'
                  + '<td>2</td>'
                  + '<td>代收款合计</td>'
                  + '<td id="smAgencyFund_y_sum_td"></td>'
                + '</tr>'
                + '<tr>'
                  + '<td>3</td>'
                  + '<td>代付款合计</td>'
                  + '<td id="smPayment_y_sum_td"></td>'
                + '</tr>'
                + '<tr>'
                  + '<td>4</td>'
                  + '<td>服务费合计</td>'
                  + '<td id="fees_sum_td"></td>'
                + '</tr>'
                + '<tr>'
                  + '<td>5</td>'
                  + '<td>交通费合计</td>'
                  + '<td id="carFees_sum_td"></td>'
                + '</tr>'
                + '<tr>'
                  + '<td>6</td>'
                  + '<td>验证费合计 (<span id="idcardsmfees_sum_span"></span>次 x <span id="idcardsmfees_unit_span"></span>元/次)</td>'
                  + '<td id="idcardsmfees_sum_td"></td>'
                + '</tr>'
                + '<tr>'
                  + '<td>7</td>'
                  + '<td>往来合计</td>'
                  + '<td id="bpNum_sum_td"></td>'
                + '</tr>'
              + '</tbody>'
              + '<tfoot>'
                + '<tr>'
                  + '<td colspan="2"><strong>本月余额</strong></td>'
                  + '<td><strong id="thisMonthBalance_td"></strong></td>'
                + '</tr>'
              + '</tfoot>'
            + '</table>'
            + '<h4>贵公司的<span id="typename_p_span"></span>为<span id="thisMonthBalance_p_span"></span>元，如账单有误请告知我们核对，如无误请于每月10日前结清应付款，谢谢支持！祝生意兴隆！</h4>'
            + '<table style="width: 600px;" class="table table-bordered table-condensed">'
              + '<caption>银行账号：</caption>'
              + '<thead>'
                + '<tr">'
                  + '<th style="width:40%">开户行</th>'
                  + '<th style="width:40%">账号</th>'
                  + '<th style="width:20%">开户名</th>'
                + '</tr>'
              + '</thead>'
              + '<tbody id="zx-bp-tbody">'
                + '<tr >'
                  + '<td>建设银行深圳分行笋岗支行</td>'
                  + '<td>6227007200510200126</td>'
                  + '<td>汪凌云</td>'
                + '</tr>'
                + '<tr>'
                  + '<td>招商银行深圳分行</td>'
                  + '<td>6226097806243813</td>'
                  + '<td>汪凌云</td>'
                + '</tr>'
                /*+ '<tr>'
                  + '<td>加微信支付</td>'
                  + '<td>13528706248</td>'
                  + '<td>汪凌云</td>'
                + '</tr>'
                + '<tr>'
                  + '<td>支付宝付款</td>'
                  + '<td><img src="../img/er.jpg"></td>'
                  + '<td>汪凌云</td>'
                + '</tr>'*/
              + '</tbody>'
            + '</table>'
          + '</div>'
        + '</div>'
    },
    // 动态状态信息
    stateMap  = { 
      $container         : null,
      companysArr        : null,
      companysObj        : null,
      companysIdObj      : null,
      company            : '',
      month              : '',
      smArr              : [],
      lastMonthBalance   : undefined,
      isLock             : false,
      smAgencyFund_y_sum : 0,
      smPayment_y_sum    : 0,
      fees_sum           : 0,
      carFees_sum        : 0,
      bpArr              : [],
      bpNum_sum          : 0,
      thisMonthBalance   : 0,
      setData            : {}
    },
    jqueryMap = {},
    // DOM METHODS
    setJqueryMap, 
    // EVENT HANDLERS
    onCompletegetstatement, onStatementDelBtnClick, onStatementLockBtnClick, onStatementImportBtnClick,
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
    	$container  : $container,
    	$statement  : $container.find('.zx-statement'),
        $zxteamtbody: $('#zx-team-tbody'),
        $zxbptbody  : $('#zx-bp-tbody')
    };
  };
  // End DOM method /setJqueryMap/
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  onCompletegetstatement = function(event, results){
    var obj                = results.obj,
        companysArr        = results.companysArr,
        companysObj        = results.companysObj,
        companysIdObj      = results.companysIdObj,
        statement          = results.statement,
        s_smArr            = [],
        s_bpArr            = [],
        setData_title_un   = '',
        bpmonthArr,
        i, len, item, $tr;

    var idcardsmfees_sum_span_text;
    var idcardsmfees_unit_span_text;
    var idcardsmfees_sum_td_text;

    //console.log(results);
    // 初始化
    stateMap.companysArr      = companysArr;
    stateMap.companysObj      = companysObj;
    stateMap.companysIdObj    = companysIdObj;

    $('#statementDelBtn').data('obj', {id: statement._id, month: obj.bpmonth});
    $('#statementLockBtn').data('id', statement._id);
    // 按钮
    if(!statement) {
      $('#statementDelBtn').remove();
      $('#statementLockBtn').remove();
      $('#statementImportBtn').remove();
    } else {
      
      if(obj.category === 20) {
        $('#statementDelBtn').remove();

        if(statement.isLock) {
          $('#statementLockBtn').remove();
        } else {
          setData_title_un = '(未确认)';
        }
      }

      if(obj.category === 30){
        //$('#statementLockBtn').remove();
        if(statement.isLock) {
          // $('#statementDelBtn').remove();
        } else {
          setData_title_un = '(未确认)';
        }
      }
    }

    // 渲染表格
    $('#companyInput').val(obj.search_company);
    $('#bpmonthSelect').val(obj.bpmonth);

    bpmonthArr = obj.bpmonth.split('-');

    $('.span_year').text(bpmonthArr[0]);
    $('.span_month').text(bpmonthArr[1]);

    stateMap.setData.y_m = bpmonthArr[0] + '年' + bpmonthArr[1] + '月';
    stateMap.setData.title = obj.search_company + stateMap.setData.y_m + '对账单' + setData_title_un;
    
    // 公司名称
    $('#companyInput').autocomplete({
      minLength: 0,
      source: companysArr
    });

    if(!statement){
      jqueryMap.$statement.removeClass('hidden');
      return;
    }

    // 团队单费用表
    for(i = 0, len = statement.smArr.length; i < len; i++) {
      item = statement.smArr[i];

      $tr=$('<tr></tr>');
      $tr
        .append($('<td></td>').text(item.sn))
        .append($('<td></td>').text(item.teamNum))
        .append($('<td></td>').text(item.smDate))
        .append($('<td></td>').text(item.operator))
        .append($('<td></td>').text(item.teamType))
        .append($('<td></td>').text(item.flightNum))
        .append($('<td></td>').text(item.smRealNumber))
        .append($('<td></td>').text(item.idcardsmfees))
        .append($('<td></td>').text(item.smAgencyFund_y / 100))
        .append($('<td></td>').text(item.smPayment_y / 100))
        .append($('<td></td>').text(item.fees / 100))
        .append($('<td></td>').text(item.carFees / 100));

      jqueryMap.$zxteamtbody.append($tr);

      s_smArr.push({
        sn: item.sn,
        teamNum: item.teamNum,
        smDate: item.smDate,
        operator: item.operator,
        teamType: item.teamType,
        flightNum: item.flightNum,
        smRealNumber: item.smRealNumber,
        idcardsmfees: item.idcardsmfees || 0,
        smAgencyFund_y: item.smAgencyFund_y / 100,
        smPayment_y: item.smPayment_y / 100,
        fees: item.fees / 100,
        carFees: item.carFees / 100
      });
    }

    stateMap.setData.s_smArr = s_smArr;
    
    $('#idcardsmfees_sum').text(statement.idcardsmfees_sum);
    $('#smAgencyFund_y_sum').text(statement.smAgencyFund_y_sum / 100);
    $('#smPayment_y_sum').text(statement.smPayment_y_sum / 100);
    $('#fees_sum').text(statement.fees_sum / 100);
    $('#carFees_sum').text(statement.carFees_sum / 100);

    stateMap.setData.idcardsmfees_sum = statement.idcardsmfees_sum || 0;
    stateMap.setData.smAgencyFund_y_sum = statement.smAgencyFund_y_sum / 100;
    stateMap.setData.smPayment_y_sum = statement.smPayment_y_sum / 100;
    stateMap.setData.fees_sum = statement.fees_sum / 100;
    stateMap.setData.carFees_sum = statement.carFees_sum / 100;

    // 往来账明细
    for(i = 0, len = statement.bpArr.length; i < len; i++) {
      item = statement.bpArr[i];
      $tr=$('<tr></tr>');

      $tr
        .append($('<td></td>').text(item.sn))
        .append($('<td></td>').text(item.bpNote))
        .append($('<td></td>').text(item.bpDate))
        .append($('<td></td>').html(item.bpTypeHtml))
        .append($('<td></td>').text(item.bpNum / 100));

      jqueryMap.$zxbptbody.append($tr);

      s_bpArr.push({
        sn: item.sn,
        bpNote: item.bpNote,
        bpDate: item.bpDate,
        bpTypeHtml: item.bpTypeHtml,
        bpNum: item.bpNum / 100
      });
    }

    stateMap.setData.s_bpArr = s_bpArr;

    $('#bpNum_sum').text(statement.bpNum_sum / 100);

    stateMap.setData.bpNum_sum = statement.bpNum_sum / 100;

    // 往来账
    $('#lastMonthBalance_td').text(statement.lastMonthBalance / 100);
    $('#smAgencyFund_y_sum_td').text(statement.smAgencyFund_y_sum / 100);
    $('#smPayment_y_sum_td').text(statement.smPayment_y_sum / 100);
    $('#fees_sum_td').text(statement.fees_sum / 100);
    $('#carFees_sum_td').text(statement.carFees_sum / 100);

    idcardsmfees_sum_span_text = statement.idcardsmfees_sum || 0;
    idcardsmfees_unit_span_text = statement.idcardsmfees_unit || 1000;
    idcardsmfees_sum_td_text = idcardsmfees_sum_span_text * idcardsmfees_unit_span_text / 1000;
    $('#idcardsmfees_sum_span').text(idcardsmfees_sum_span_text);
    $('#idcardsmfees_unit_span').text(idcardsmfees_unit_span_text / 1000);
    $('#idcardsmfees_sum_td').text(idcardsmfees_sum_td_text);
    stateMap.setData.idcardsmfees_unit_span_text = idcardsmfees_unit_span_text / 1000;
    stateMap.setData.idcardsmfees_sum_td_text = idcardsmfees_sum_td_text;

    $('#bpNum_sum_td').text(statement.bpNum_sum / 100);
    $('#thisMonthBalance_td').text(statement.thisMonthBalance / 100);

    stateMap.setData.lastMonthBalance = statement.lastMonthBalance / 100;
    stateMap.setData.thisMonthBalance = statement.thisMonthBalance / 100;
    

    // 最后的话
    if(statement.thisMonthBalance < 0) {
      $('#typename_p_span').text('预付款余额');
      stateMap.setData.typename = '预付款余额';
    } else {
      $('#typename_p_span').text('应付款');
      stateMap.setData.typename = '应付款';
    }

    $('#thisMonthBalance_p_span').text(Math.abs(statement.thisMonthBalance / 100));

    stateMap.setData.thisMonthBalance_abs = Math.abs(statement.thisMonthBalance / 100);

    jqueryMap.$statement.removeClass('hidden');
  };

  /*onSearchBtnClick = function() {
    var companyName = $('#companyInput').val(),
        bpmonth = $('#bpmonthSelect').val(),
        bpcompany = '';

    if(companyName !== ''){
      bpcompany = stateMap.companysObj[companyName];
    }

    if(typeof(bpcompany) !== "undefined"){
      $.uriAnchor.setAnchor({ 
        'page'    : 'statement', 
        'company' : bpcompany,
        'month' : bpmonth
      }, null, true );
    } else {
      alert('公司不存在！');
    }
  };*/

  onStatementDelBtnClick = function() {
    var $that = $(this),
        obj = $that.data('obj');

    zx.modal.initModule({
      size      : 'modal-sm',
      $title    : $('<h4 class="modal-title">删除对账单</h4>'),
      formClass : 'form-deleteStatement',
      main_html : String()
        + '<div class="alert alert-warning" role="alert">确定删除吗？</div>',
      callbackFunction : function(modalJqueryMap){
        modalJqueryMap.$submitBtn
          .text( '正在删除对账单...' )
          .attr( 'disabled', true );

        zx.model.bp.deleteStatement(obj);
      }
    });
  };

  onStatementLockBtnClick = function() {
    var $that = $(this),
        id = $that.data('id');

    zx.modal.initModule({
      size      : 'modal-sm',
      $title    : $('<h4 class="modal-title">确认对账单</h4>'),
      formClass : 'form-lockStatement',
      main_html : String()
        + '<div class="alert alert-warning" role="alert">确定后账单正式生效且不可修改！如后期发现错误只可冲账！</div>',
      callbackFunction : function(modalJqueryMap){
        modalJqueryMap.$submitBtn
          .text( '正在确认对账单...' )
          .attr( 'disabled', true );

        zx.model.bp.lockStatement(id);
      }
    });
  };

  onStatementImportBtnClick = function() {
    var setData = stateMap.setData,
        loadFile, doc, out;
    //console.log(setData);
    if($(this).data('isLock')){
      setData.title = setData.title.replace('(未确认)','');
    }
    
    // 导出文件
    loadFile=function(url, callback){
      JSZipUtils.getBinaryContent(url, callback);
    };

    loadFile('docxtemp/statementTable.docx',function(err,content){
      if (err) { throw err };

      doc = new Docxgen(content);
      doc.setData( setData ) //set the templateVariables

      doc.render(); //apply them (replace all occurences of {first_name} by Hipp, ...)
      out = doc.getZip().generate({type:"blob"}); //Output the document using Data-URI
      saveAs(out, setData.title + '.docx');
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

    $.gevent.subscribe( jqueryMap.$statement, 'zx-getstatement', onCompletegetstatement );

    zx.model.bp.getstatement(argObj);

    //jqueryMap.$statement.on('click','#searchBtn', onSearchBtnClick );
    
    // 删除对账单
    jqueryMap.$statement.on('click','#statementDelBtn', onStatementDelBtnClick );
    // 确认对账单
    jqueryMap.$statement.on('click','#statementLockBtn', onStatementLockBtnClick );
    // 导出对账单
    jqueryMap.$statement.on('click','#statementImportBtn', onStatementImportBtnClick );
    return true;
  };
  // End public method /initModule/
   
  // Begin public method /removeThis/
  // Purpose    :
  //   * Removes chatstatement DOM element
  //   * Reverts to initial state
  //   * Removes pointers to callbacks and other data
  // Arguments  : none
  // Returns    : true
  // Throws     : none
  //
  removeThis = function () {
    // unwind initialization and state
    // remove DOM container; this removes event bindings too
    if ( jqueryMap.$statement ) {
      jqueryMap.$statement.remove();
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