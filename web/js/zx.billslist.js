/* 地接社对账单列表
 * zx.billslist.js
 * billslist feature module for zx
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, zx */

zx.billslist = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  // 声明所有 zx.billslist 内可用的变量
  var
    // 静态配置值
    configMap = {
      main_html : String()
        + '<div class="zx-list hidden">'
          + '<div class="zx-team-header row">'
            + '<div class="col-sm-12">'
              + '<h3>对账单列表</h3>'
            + '</div>'
          + '</div>'
          + '<div class="zx-team row">'
            + '<table style="width:600px;" class="table table-bordered table-condensed">'
              + '<thead>'
                + '<tr>'
                  + '<th>序号</th>'
                  + '<th>对账单</th>'
                  + '<th>金额</th>'
                  + '<th>是否已确认</th>'
                + '</tr>'
              + '</thead>'
              + '<tbody id="zx-team-tbody">'
              + '</tbody>'
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
    onCompleteGetlist,
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
    var obj = result[0].obj,
        statements = result[0].statements,
        i, len, item, $tr,
        to_statement_html, isLock_text, fee_text;

    //console.log(statements);

    for (i = 0, len = statements.length; i < len; i++) {
      item = statements[i];

      isLock_text = '';

      to_statement_html = '<a href="' + '#!page=statement&company=' + obj.company + '&month=' + moment(item.month).format('YYYY-MM-DD') + '">' + moment(item.month).format('YYYY年MM月') + '对账单</a>';
      fee_text = item.thisMonthBalance / 100;
      if(item.isLock === true) {
		isLock_text = '已确认';
	  }

      $tr = $('<tr></tr>');

      $tr
        .append($('<td></td>').text(i+1))
        .append($('<td></td>').html(to_statement_html))
        .append($('<td></td>').text(fee_text))
        .append($('<td></td>').text(isLock_text));

      jqueryMap.$tbody.append($tr);
    }

    jqueryMap.$list.removeClass('hidden');
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

    return true;
  };
  // End public method /initModule/
   
  // Begin public method /removeThis/
  // Purpose    :
  //   * Removes chatbillslist DOM element
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