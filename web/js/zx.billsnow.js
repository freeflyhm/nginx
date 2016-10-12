/* 应收款
 * zx.billsnow.js
 * billsnow feature module for zx
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, zx */

zx.billsnow = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  // 声明所有 zx.billsnow 内可用的变量
  var
    // 静态配置值
    configMap = {
      main_html : String()
        + '<div class="zx-billsnow hidden">'
          + '<div class="zx-team-header row">'
            + '<div class="col-sm-2">'
              + '<h3>应收款</h3>'
            + '</div>'
            +'<div class="col-sm-10></div>'
          + '</div>'
          + '<div class="zx-team">'
            + '<table class="table table-bordered table-condensed">'
              + '<caption>按当前余额降序</caption>'
              + '<thead>'
                + '<tr>'
                  + '<th>序号</th>'
                  + '<th>公司名称</th>'
                  + '<th>上月余额</th>'
                  + '<th>本月已收</th>'
                  + '<th>本月已付</th>'
                  + '<th>本月往来</th>'
                  + '<th>当前余额</th>'
                + '</tr>'
              + '</thead>'
              + '<tbody id="zx-team-tbody">'
              + '</tbody>'
              + '<tfoot>'
                + '<tr>'
                  + '<td colspan="2"><strong>合计</strong></td>'
                  + '<td><strong id="lastMonthBalance_sum"></strong></td>'
                  + '<td><strong id="smAgencyFund_y_sum"></strong></td>'
                  + '<td><strong id="smPayment_y_sum"></strong></td>'
                  + '<td><strong id="bpNum_sum"></strong></td>'
                  + '<td><strong id="thisMonthBalance_sum"></strong></td>'
                + '</tr>'
              + '</tfoot>'
            + '</table>'
          + '</div>'
        + '</div>'
    },
    // 动态状态信息
    stateMap  = { 
      $container    : null,
      companysArr   : null,
      companysObj   : null,
      companysIdObj : null
    },
    jqueryMap = {},
    // DOM METHODS
    setJqueryMap, 
    // EVENT HANDLERS
    onCompletegetbillsnow,
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
      $billsnow : $container.find('.zx-billsnow'),
      $zxteamtbody     : $('#zx-team-tbody'),
      $zxbptbody     : $('#zx-bp-tbody')
    };
  };
  // End DOM method /setJqueryMap/
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  onCompletegetbillsnow = function(event, result){
    //console.log(result);
    var 
        obj                  = result.obj,
        companys             = result.companys,
        statements           = result.statements,
        sms                  = result.sms,
        bps                  = result.bps,
        statementsObj        = {}, 
        smsObj               = {}, 
        bpsObj               = {},
        lastMonthBalance_sum = 0,
        smAgencyFund_y_sum   = 0,
        smPayment_y_sum      = 0,
        bpNum_sum            = 0,
        thisMonthBalance_sum = 0,
        companysSort, i, len, item, $tr,
        nameHtml, lastMonthBalanceHtml;

    // 上月余额
    statements.forEach(function(item, index, array) {
      statementsObj[item.company] = item;
    });

    // 本月已收或已付
    sms.forEach(function(item, index, array) {
      smsObj[item._id] = item;
    });

    // 本月往来
    bps.forEach(function(item, index, array) {
      bpsObj[item._id] = item;
    });

    // 填充 companys
    companys.forEach(function(item, index, array) {
      var lastMonthBalance = 0, // 上月余额
          smAgencyFund_y   = 0, // 已收款项
          smPayment_y      = 0, // 已付款项
          bpNum            = 0, // 本月往来
          thisMonthBalance;     // 本月余额
          
      // 上月余额
      if(statementsObj[item._id]){
        item.is_statement = true;

        lastMonthBalance = statementsObj[item._id].thisMonthBalance;
      }
      // 已收已付款项
      if(smsObj[item._id]){
        item.is_billsitemised = true;

        smAgencyFund_y = smsObj[item._id].smAgencyFund_y_sum;
        smPayment_y    = smsObj[item._id].smPayment_y_sum;
      }
      // 本月往来
      if(bpsObj[item._id]){
        item.is_billsitemised = true;

        bpNum = bpsObj[item._id].bpNum_sum;
      }
      // 本月余额
      thisMonthBalance = lastMonthBalance + smAgencyFund_y + smPayment_y + bpNum;

      item.lastMonthBalance = lastMonthBalance;
      item.smAgencyFund_y   = smAgencyFund_y;
      item.smPayment_y      = smPayment_y;
      item.bpNum            = bpNum;
      item.thisMonthBalance = thisMonthBalance;

    });
    
    // companys 排序 thisMonthBalance 本月余额降序
    companysSort = companys.sort(function (a, b) {
        return b.thisMonthBalance  - a.thisMonthBalance;
    });

    //console.log(companysSort);

    // 渲染表单
    for(i = 0, len = companysSort.length; i < len; i++) {
      item = companysSort[i];

      if(item.is_billsitemised){
        //console.log(obj.bpMonth);
        nameHtml = '<a href="#!page=billsitemised&bpcompany=' + item._id + '&bpmonth=' + moment(obj.bpMonth).format('YYYY-MM-DD') + '">' + item.name + '</a>'
      } else {
        nameHtml = '<span style="color: red; font-weight: 700;">' + item.name + '</span>';
      }

      if(item.is_statement){
        lastMonthBalanceHtml = '<a href="#!page=statement&company=' + item._id + '&month=' + obj.lastMonth + '">' + (item.lastMonthBalance / 100) + '</a>'
      } else {
        lastMonthBalanceHtml = '<span style="color: red; font-weight: 700;">' + (item.lastMonthBalance / 100) + '</span>';
      }

      $tr  = $('<tr></tr>');
      $tr
        .append($('<td></td>').text(i+1))
        .append($('<td></td>').html(nameHtml))
        .append($('<td></td>').html(lastMonthBalanceHtml))
        .append($('<td></td>').text(item.smAgencyFund_y / 100))
        .append($('<td></td>').text(item.smPayment_y / 100))
        .append($('<td></td>').text(item.bpNum / 100))
        .append($('<td></td>').text(item.thisMonthBalance / 100));

      jqueryMap.$zxteamtbody.append($tr);

      lastMonthBalance_sum += item.lastMonthBalance;
      smAgencyFund_y_sum   += item.smAgencyFund_y;
      smPayment_y_sum      += item.smPayment_y;
      bpNum_sum            += item.bpNum;
      thisMonthBalance_sum += item.thisMonthBalance;
    }

    $('#lastMonthBalance_sum').text(lastMonthBalance_sum / 100);
    $('#smAgencyFund_y_sum').text(smAgencyFund_y_sum / 100);
    $('#smPayment_y_sum').text(smPayment_y_sum / 100);
    $('#bpNum_sum').text(bpNum_sum / 100);
    $('#thisMonthBalance_sum').text(thisMonthBalance_sum / 100);

    jqueryMap.$billsnow.removeClass('hidden');

    /*var obj = result.obj,

    $('#teamNum1_sum').text(teamNum1_sum);
    $('#peopleNum1_sum').text(peopleNum1_sum);
    $('#fees1_sum').text(fees1_sum);
    $('#insurance1_sum').text(insurance1_sum);
    $('#insurance_fee1_sum').text(insurance_fee1_sum);
    $('#insurance_bi_fee1').text(Math.ceil(insurance1_sum * 100 / peopleNum1_sum) + '%');

    $('#teamNum2_sum').text(teamNum2_sum);
    $('#peopleNum2_sum').text(peopleNum2_sum);
    $('#fees2_sum').text(fees2_sum);
    $('#insurance2_sum').text(insurance2_sum);
    $('#insurance_fee2_sum').text(insurance_fee2_sum);
    $('#insurance_bi_fee2').text(Math.ceil(insurance2_sum * 100 / peopleNum2_sum) + '%');

    $('#teamNum3_sum').text(teamNum3_sum);
    $('#peopleNum3_sum').text(peopleNum3_sum);
    $('#fees3_sum').text(fees3_sum);

    $('#sum_sum').text(sum_sum);

    jqueryMap.$billsnow.removeClass('hidden');

    function setSmObj(smObj, name, objType, obj) {
      if(smObj.hasOwnProperty(name)) {

      if(objType === 'meet') {
        smObj[name][objType]['teamNum'] += obj.teamNum;
        smObj[name][objType]['peopleNum'] += obj.peopleNum;
        smObj[name][objType]['fees'] += obj.fees;
      } else {
        smObj[name][objType]['teamNum'] += 1;
        smObj[name][objType]['peopleNum'] += obj.peopleNum;
        smObj[name][objType]['fees'] += obj.fees;
        smObj[name][objType]['insurance'] += obj.insurance;
      }

      } else {
        // 初始化
        smObj[name] = {
          'san': {
            'teamNum': 0,
            'peopleNum': 0,
            'fees': 0,
            'insurance': 0
          },
          'bao': {
            'teamNum': 0,
            'peopleNum': 0,
            'fees': 0,
            'insurance': 0
          },
          'meet': {
            'teamNum': 0,
            'peopleNum': 0,
            'fees': 0
          }
        }

        // 赋值
        smObj[name][objType] = obj;
      }
    }*/
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

    $.gevent.subscribe( jqueryMap.$billsnow, 'zx-getbillsnow', onCompletegetbillsnow );

    zx.model.bp.getbillsnow(argObj);

    return true;
  };
  // End public method /initModule/
   
  // Begin public method /removeThis/
  // Purpose    :
  //   * Removes chatbillsnow DOM element
  //   * Reverts to initial state
  //   * Removes pointers to callbacks and other data
  // Arguments  : none
  // Returns    : true
  // Throws     : none
  //
  removeThis = function () {
    // unwind initialization and state
    // remove DOM container; this removes event bindings too
    if ( jqueryMap.$billsnow ) {
      jqueryMap.$billsnow.remove();
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