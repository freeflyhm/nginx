/* 月账单
 * zx.billsitemised.js
 * billsitemised feature module for zx
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, zx */

zx.billsitemised = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  // 声明所有 zx.billsitemised 内可用的变量
  var
    // 静态配置值
    configMap = {
      main_html : String()
        + '<div class="zx-billsitemised hidden">'
          + '<div class="zx-team-header row">'
            + '<div class="col-sm-2">'
              + '<h3>月账单明细</h3>'
            + '</div>'
            + '<div class="col-sm-5">'
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
                + '<option>2016-01</option>'
                + '<option>2016-02</option>'
                + '<option>2016-03</option>'
                + '<option>2016-04</option>'
                + '<option>2016-05</option>'
                + '<option>2016-06</option>'
                + '<option>2016-07</option>'
                + '<option>2016-08</option>'
                + '<option>2016-09</option>'
                + '<option>2016-10</option>'
                + '<option>2016-11</option>'
                + '<option>2016-12</option>'
              + '</select>'
            + '</div>'
            + '<div class="col-sm-1">'
              + '<button id="searchBtn" type="button" class="btn btn-sm btn-default hidden" style="margin-top: 10px;">查询&nbsp;<span class="glyphicon glyphicon-search" aria-hidden="true"></span></button>'
            + '</div>'
            + '<div class="col-sm-2">'
              + '<button id="statementNewBtn" type="button" class="btn btn-sm btn-primary" style="margin-top: 10px;">生成对账单&nbsp;<span class="glyphicon glyphicon-duplicate" aria-hidden="true"></span></button>'
            + '</div>'
          + '</div>'
          + '<div class="zx-team">'
            + '<table class="table table-bordered table-condensed">'
              + '<caption>团队单费用表</caption>'
              + '<thead>'
                + '<tr>'
                  + '<th>序号</th>'
                  + '<th>团号</th>'
                  + '<th>服务单号</th>'
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
                  + '<th>保险</th>'
                  + '<th>现场</th>'
                + '</tr>'
              + '</thead>'
              + '<tbody id="zx-team-tbody">'
              + '</tbody>'
              + '<tfoot>'
                + '<tr>'
                  + '<td colspan="8"><strong>合计</strong></td>'
                  + '<td><strong id="idcardsmfees_sum"></strong></td>'
                  + '<td><strong id="smAgencyFund_y_sum"></strong></td>'
                  + '<td><strong id="smPayment_y_sum"></strong></td>'
                  + '<td><strong id="fees_sum"></strong></td>'
                  + '<td><strong id="carFees_sum"></strong></td>'
                  + '<td><strong id="insurance_sum"></strong></td>'
                  + '<td></td>'
                + '</tr>'
              + '</tfoot>'
            + '</table>'
            + '<table class="table table-bordered table-condensed">'
              + '<caption>往来账</caption>'
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
      bpNum_sum          : 0
    },
    jqueryMap = {},
    // DOM METHODS
    setJqueryMap, 
    // EVENT HANDLERS
    onCompletegetbillsitemised, onStatementNewBtnClick,
    onCompletestatementNew,
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
    	$container     : $container,
    	$billsitemised : $container.find('.zx-billsitemised'),
      $zxteamtbody     : $('#zx-team-tbody'),
      $zxbptbody     : $('#zx-bp-tbody')
    };
  };
  // End DOM method /setJqueryMap/
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  onCompletegetbillsitemised = function(event, results){
    var
        CITY = zx.config.getConfigMapItem('citys')[zx.config.getStateMapItem('city')].city,
        obj                = results.obj,
        companysArr        = results.companysArr,
        companysObj        = results.companysObj,
        companysIdObj      = results.companysIdObj,
        sms                = results.sms,
        bps                = results.bps,
        hasStatement       = results.hasStatement,
        lastMonthBalance   = results.lastMonthBalance,
        isLock             = results.isLock,
        smAgencyFund_y_sum = 0,
        smPayment_y_sum    = 0,
        fees_sum           = 0,
        carFees_sum        = 0,
        idcardsmfees_sum   = 0,
        insurance_sum      = 0,
        insurance_sum      = 0,
        bpNum_sum          = 0,
        smArr              = [],
        bpArr              = [],  
        smDate, smType, smTime, smNum,
        i, len, item, $tr, bpTypeHtml, 
        $trs, $thisTeam, $upTeam, feesText;

    //console.log(obj);
    // 初始化
    stateMap.companysArr      = companysArr;
    stateMap.companysObj      = companysObj;
    stateMap.companysIdObj    = companysIdObj;
    stateMap.company          = obj.bpcompany;
    stateMap.month            = obj.bpMonth;
    stateMap.lastMonthBalance = lastMonthBalance;
    stateMap.isLock           = isLock;
    // 是否显示生成对账单按钮
    if(hasStatement){
      $('#statementNewBtn').remove();
    }

    // 渲染表格
    $('#companyInput').val(obj.search_company);
    $('#bpmonthSelect').val(obj.bpMonth);

    // 公司名称
    $('#companyInput').autocomplete({
      minLength: 0,
      source: companysArr
    });

    // 团队单费用表
    for(i = 0, len = sms.length; i < len; i++) {
      item = sms[i];

      // 服务单号
      //smDate = item.flight.flightDate.substring(5, 10).replace("-", "");
      smDate = moment(item.flight.flightDate).format('MMDD');
      smType = item.flight.flightStartCity === CITY ? "送" : "接";
      smTime  =
        item.flight.flightStartCity === CITY
        ? smTime = moment(item.flight.flightStartTime).format('HHmm')
        : smTime = moment(item.flight.flightEndTime).format('HHmm');
      smNum = smDate + smTime + item.flight.flightNum + (item.operator).substr(0,item.operator.length - 11) + item.smRealNumber +"人" + (item.smType2===1?"内":"外") + smType;
      
      //console.log(item);
      if(item.addFees === 0){
        feesText = item.fees / 100;
      } else if(item.addFees > 0){
        feesText = ((item.fees + item.addFees)/ 100) + '(' + item.fees/100 + '+' + item.addFees/100 + ' ' + item.addFeesNote + ')';
      } else {
        feesText = ((item.fees + item.addFees)/ 100) + '(' + item.fees/100 + item.addFees/100 + ' ' + item.addFeesNote + ')';
      }

      $tr=$('<tr></tr>');
      $tr
        .append($('<td></td>').text(i + 1))
        .append(
          $('<td class="teamNumTd"></td>')
            .text(item.team.teamNum)
            .data('team', item.team._id)
        )
        .append($('<td></td>').text(smNum))
        .append($('<td></td>').text(moment(item.flight.flightDate).format('YYYY-MM-DD')))
        .append($('<td></td>').text((item.operator).substr(0,item.operator.length - 11)))
        .append($('<td></td>').text(item.team.teamType))
        .append($('<td></td>').text(item.flight.flightNum))
        .append($('<td></td>').text(item.smRealNumber))
        .append($('<td></td>').text(item.idcardsmfees))
        .append($('<td></td>').text(item.smAgencyFund_y / 100))
        .append($('<td></td>').text(item.smPayment_y / 100))
        .append($('<td></td>').text((item.fees + item.addFees)/ 100))
        .append($('<td></td>').text(item.carFees / 100))
        .append($('<td></td>').text(item.insurance))
        .append($('<td></td>').text(item.serverMan));

      jqueryMap.$zxteamtbody.append($tr);

      smArr.push({
        sn            : i + 1,
        teamNum       : item.team.teamNum,
        smDate        : moment(item.flight.flightDate).format('YYYY-MM-DD'),
        operator      : (item.operator).substr(0,item.operator.length - 11),
        teamType      : item.team.teamType,
        flightNum     : item.flight.flightNum,
        smRealNumber  : item.smRealNumber,
        idcardsmfees  : item.idcardsmfees,
        smAgencyFund_y: item.smAgencyFund_y,
        smPayment_y   : item.smPayment_y,
        fees          : item.fees + item.addFees,
        carFees       : item.carFees
      });

      smAgencyFund_y_sum += item.smAgencyFund_y;
      smPayment_y_sum += item.smPayment_y;
      fees_sum += item.fees + item.addFees;
      carFees_sum += item.carFees;
      idcardsmfees_sum += item.idcardsmfees;
      insurance_sum += item.insurance;
    }
    
    $('#smAgencyFund_y_sum').text(smAgencyFund_y_sum / 100);
    $('#smPayment_y_sum').text(smPayment_y_sum / 100);
    $('#fees_sum').text(fees_sum / 100);
    $('#carFees_sum').text(carFees_sum / 100);
    $('#idcardsmfees_sum').text(idcardsmfees_sum);
    $('#insurance_sum').text(insurance_sum);

    //console.log(smArr);
    stateMap.smArr = smArr;
    stateMap.smAgencyFund_y_sum = smAgencyFund_y_sum;
    stateMap.smPayment_y_sum = smPayment_y_sum;
    stateMap.fees_sum = fees_sum;
    stateMap.idcardsmfees_sum = idcardsmfees_sum;
    stateMap.idcardsmfees_unit = obj.idcardsmfees_unit;
    stateMap.carFees_sum = carFees_sum;
    //console.log(stateMap.idcardsmfees_unit);
    /*// 合并相同团号单元格(暂时只能处理两个相同团号)
    $trs = jqueryMap.$zxteamtbody.find('tr');
    len = $trs.length;
    for(i = len; i > 0; i--) {
      $thisTeam = $trs.eq(i).find('.teamNumTd');
      $upTeam = $trs.eq(i-1).find('.teamNumTd');
      if($thisTeam.data('team') === $upTeam.data('team')){
        $thisTeam.remove();
        $upTeam.attr('rowspan',2);
      }
    };*/

    // 收支表
    for(i = 0, len = bps.length; i < len; i++) {
      item = bps[i];
      $tr=$('<tr></tr>');

      if(item.bpType === 1){
        bpTypeHtml = String()
          + '借';
          //+ '<span class="label label-success" style="margin-right:5px;">收</span>';
      } else {
        bpTypeHtml = String()
          + '贷';
          //+ '<span class="label label-danger" style="margin-right:5px;">支</span>';
      }

      $tr
        .append($('<td></td>').text(i + 1))
        .append($('<td></td>').text(item.bpNote))
        .append($('<td></td>').text(moment(item.bpDate).format('YYYY-MM-DD')))
        .append($('<td></td>').html(bpTypeHtml))
        .append($('<td></td>').text(item.bpNum / 100));

      jqueryMap.$zxbptbody.append($tr);

      bpArr.push({
        sn: i + 1,
        bpNote: item.bpNote,
        bpDate: moment(item.bpDate).format('YYYY-MM-DD'),
        bpTypeHtml: bpTypeHtml,
        bpNum: item.bpNum
      });

      bpNum_sum += item.bpNum;
    }
    $('#bpNum_sum').text(bpNum_sum / 100);
    //console.log(bpArr);
    stateMap.bpArr = bpArr;
    stateMap.bpNum_sum = bpNum_sum;

    jqueryMap.$billsitemised.removeClass('hidden');
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
        'page'    : 'billsitemised', 
        'bpcompany' : bpcompany,
        'bpmonth' : bpmonth
      }, null, true );
    } else {
      alert('公司不存在！');
    }
  };*/

  // isLock 临时设置为 true; 生产环境删除此变量。
  onStatementNewBtnClick = function() {
    var idcardsmfees_sum = stateMap.idcardsmfees_sum || 0;
    var idcardsmfees_unit = stateMap.idcardsmfees_unit || 1000;
    var idcardsmfees;
    var lastMonthBalance;
    var thisMonthBalance;

    //console.log(stateMap);
    if(typeof stateMap.lastMonthBalance === 'undefined') {
      lastMonthBalance = prompt("没有找到上个月的对账单,如果要生成对账单,请填写上月余额:","");
      if(lastMonthBalance !== null) {
        lastMonthBalance = Number(lastMonthBalance);
        if(isNaN(lastMonthBalance)){
          alert('请输入正确的金额');
          return;
        }

        lastMonthBalance = lastMonthBalance * 100;
      } else {
        return;
      }
    } else if (stateMap.isLock === false) {
      alert('上个月的对账单等待客户确认，在客户确认前不能生成本月对账单');
      return;
    } else {
      lastMonthBalance = stateMap.lastMonthBalance;
    }

    idcardsmfees = idcardsmfees_sum * idcardsmfees_unit / 1000;

    thisMonthBalance = lastMonthBalance +
                       stateMap.smAgencyFund_y_sum +
                       stateMap.smPayment_y_sum +
                       stateMap.fees_sum +
                       stateMap.carFees_sum +
                       (idcardsmfees * 100) +
                       stateMap.bpNum_sum;

    //console.log(lastMonthBalance);
    zx.model.bp.statementNew({
      company: stateMap.company,
      month: stateMap.month,
      smArr: stateMap.smArr,
      lastMonthBalance: lastMonthBalance,
      smAgencyFund_y_sum: stateMap.smAgencyFund_y_sum,
      smPayment_y_sum: stateMap.smPayment_y_sum,
      fees_sum: stateMap.fees_sum,
      idcardsmfees_sum: idcardsmfees_sum,
      idcardsmfees_unit: idcardsmfees_unit,
      carFees_sum: stateMap.carFees_sum,
      bpArr: stateMap.bpArr,
      bpNum_sum: stateMap.bpNum_sum,
      thisMonthBalance: thisMonthBalance
    });
  };

  onCompletestatementNew = function(event, result) {
    if(result === 1){
      // 跳转到 月账单列表
      $.uriAnchor.setAnchor({ 
        'page'   : 'list', 
        'c'      : 'billsitemised', 
        'bpmonth': stateMap.month 
      }, null, true );
      //$('#statementNewBtn').remove();
    } else {
      alert('生成对账单失败,请再试一次。');
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

    $.gevent.subscribe( jqueryMap.$billsitemised, 'zx-getbillsitemised', onCompletegetbillsitemised );
    $.gevent.subscribe( jqueryMap.$billsitemised, 'zx-statementNew', onCompletestatementNew );

    zx.model.bp.getbillsitemised(argObj);

    //jqueryMap.$billsitemised.on('click','#searchBtn', onSearchBtnClick );
    jqueryMap.$billsitemised.on('click','#statementNewBtn', onStatementNewBtnClick );

    return true;
  };
  // End public method /initModule/
   
  // Begin public method /removeThis/
  // Purpose    :
  //   * Removes chatbillsitemised DOM element
  //   * Reverts to initial state
  //   * Removes pointers to callbacks and other data
  // Arguments  : none
  // Returns    : true
  // Throws     : none
  //
  removeThis = function () {
    // unwind initialization and state
    // remove DOM container; this removes event bindings too
    if ( jqueryMap.$billsitemised ) {
      jqueryMap.$billsitemised.remove();
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