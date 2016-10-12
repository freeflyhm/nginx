/* 月账单
 * zx.billsitemisedlist.js
 * billsitemisedlist feature module for zx
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, zx */

zx.billsitemisedlist = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  // 声明所有 zx.billsitemisedlist 内可用的变量
  var
    // 静态配置值
    configMap = {
      main_html : String()
        + '<div class="zx-list hidden">'
          + '<div class="zx-team-header row">'
            + '<div class="col-sm-2">'
              + '<h3>月账单列表</h3>'
            + '</div>'
            + '<div class="col-sm-2">'
              + '<select id="bpmonthSelect" class="form-control input-sm" style="margin-top: 10px;">'
                + '<option value="2015-05-01">2015-05</option>'
                + '<option value="2015-06-01">2015-06</option>'
                + '<option value="2015-07-01">2015-07</option>'
                + '<option value="2015-08-01">2015-08</option>'
                + '<option value="2015-09-01">2015-09</option>'
                + '<option value="2015-10-01">2015-10</option>'
                + '<option value="2015-11-01">2015-11</option>'
                + '<option value="2015-12-01">2015-12</option>'
                + '<option value="2016-01-01">2016-01</option>'
                + '<option value="2016-02-01">2016-02</option>'
                + '<option value="2016-03-01">2016-03</option>'
                + '<option value="2016-04-01">2016-04</option>'
                + '<option value="2016-05-01">2016-05</option>'
                + '<option value="2016-06-01">2016-06</option>'
                + '<option value="2016-07-01">2016-07</option>'
                + '<option value="2016-08-01">2016-08</option>'
                + '<option value="2016-09-01">2016-09</option>'
                + '<option value="2016-10-01">2016-10</option>'
                + '<option value="2016-11-01">2016-11</option>'
                + '<option value="2016-12-01">2016-12</option>'
              + '</select>'
            + '</div>'
            + '<div class="col-sm-1">'
              +'<button id="searchBtn" type="button" class="btn btn-sm btn-default" style="margin-top: 10px;">查询&nbsp;<span class="glyphicon glyphicon-search" aria-hidden="true"></span></button>'
            + '</div>'
            +'<div class="col-sm-7></div>'
          + '</div>'
          + '<div class="zx-team">'
            + '<table class="table table-bordered table-condensed">'
              + '<thead>'
                + '<tr>'
                  + '<th>序号</th>'
                  + '<th>公司</th>'
                  + '<th>对账单</th>'
                  + '<th>金额</th>'
                  + '<th>客户是否已确认</th>'
                + '</tr>'
              + '</thead>'
              + '<tbody id="zx-team-tbody">'
              + '</tbody>'
              + '<tfoot>'
                + '<tr>'
                  + '<td colspan="3"><strong>合计</strong></td>'
                  + '<td><strong id="fee_sum"></strong></td>'
                  + '<td></td>'
                + '</tr>'
              + '</tfoot>'
            + '</table>'
          + '</div>'
        + '</div>'
    },
    // 动态状态信息
    stateMap  = { 
      $container    : null
    },
    jqueryMap = {},
    // DOM METHODS
    setJqueryMap, 
    // EVENT HANDLERS
    onCompleteGetlist, onSearchBtnClick,
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
      $tbody     : $('#zx-team-tbody')
    };
  };
  // End DOM method /setJqueryMap/
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  onCompleteGetlist = function(event, result){
    var obj               = result[0].obj,
        companys          = result[0].companys,
        statements        = result[0].statements,
        statement_obj     = {},
        statement_fee_obj = {},
        fee_sum           = 0,
        i, len, item, $tr,
        to_statement_html, isLock_text, fee_text;

    //console.log(statements);
    // 月份选择框
    $('#bpmonthSelect').val(obj.bpmonth);

    for (i = 0, len = statements.length; i < len; i++) {
      statement_obj[statements[i].company] = statements[i].isLock;
      statement_fee_obj[statements[i].company] = statements[i].thisMonthBalance;
    }

    for (i = 0, len = companys.length; i < len; i++) {
      item = companys[i];

      to_statement_html = '';
      isLock_text = '';
      fee_text    = '';
      if(typeof statement_obj[item._id] !== 'undefined') {
        //#!page=statementlist&&month=
        to_statement_html = '<a href="' + '#!page=statement&company=' + item._id + '&month=' + obj.bpmonth + '">查看对账单</a>';
        fee_text = statement_fee_obj[item._id] / 100;
        fee_sum += statement_fee_obj[item._id];
        if(statement_obj[item._id] === true) {
          isLock_text = '已确认';
        } 
      }

      $tr = $('<tr></tr>');

      $tr
        .append($('<td></td>').text(i+1))
        .append($('<td></td>').html('<a href="' + '#!page=billsitemised&bpcompany=' + item._id + '&bpmonth=' + obj.bpmonth + '">' + item.name + '</a>'))
        .append($('<td></td>').html(to_statement_html))
        .append($('<td></td>').text(fee_text))
        .append($('<td></td>').text(isLock_text));

      jqueryMap.$tbody.append($tr);
    }

    $('#fee_sum').text(fee_sum / 100);

    jqueryMap.$list.removeClass('hidden');
  };

  onSearchBtnClick = function(){
    var bpmonth = $('#bpmonthSelect').val();

  	$.uriAnchor.setAnchor({ 
  	  'page'    : 'list',
  	  'c'       : 'billsitemised',
  	  'bpmonth' : bpmonth
  	}, null, true );
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

     zx.model.list.getlist(argObj);

    jqueryMap.$list.on('click','#searchBtn', onSearchBtnClick );

    return true;
  };
  // End public method /initModule/
   
  // Begin public method /removeThis/
  // Purpose    :
  //   * Removes chatbillsitemisedlist DOM element
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