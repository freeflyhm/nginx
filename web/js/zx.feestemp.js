/*
 * zx.feestemp.js
 * feestemp feature module for zx
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, zx */

zx.feestemp = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  // 声明所有 zx.feestemp 内可用的变量
  var
    // 静态配置值
    configMap = {
      main_html : String()
        + '<div class="zx-feestemp row">'
          +'<div class="col-sm-6">'
            + '<h3>服务费用标准</h3>'
          + '</div>'
        + '</div>',
	  settable_map : {
        people_model    : true
      },
      people_model      : null
    },
    // 动态状态信息
    stateMap  = { $container : null },
    // jquery对象缓存集合
    jqueryMap = {},
    // DOM METHODS
    setJqueryMap, createTable,
    // EVENT HANDLERS
    onComplete_getMyFeesTempFromSV,
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
    	$feestemp : $container.find('.zx-feestemp')
    };
  };
  // End DOM method /setJqueryMap/
  
  createTable = function(feesTemp){
  	var tableStr = String()
  		+ '<table class="table table-striped table-bordered table-condensed">'
  		  + '<thead>' 
  		    + '<tr>'
  		      + '<th rowspan="2">服务分类</th>'
  		      + '<th colspan="2">基本费用</th>'
  		      + '<th colspan="3">加班费</th>'
  		      + '<th colspan="2">人数补贴</th>'
  		    + '</tr>' 
  		    + '<tr>'
  		      + '<th>元/人</th>'
  		      + '<th>不超过(元)</th>'
  		      + '<th style="width:100px;">开始时间</th>'
  		      + '<th style="width:100px;">截止时间</th>'
  		      + '<th>费用(元)</th>'
  		      + '<th>人数下限(人)</th>'
  		      + '<th>元/人</th>'
  		    + '</tr>'
  		  + '</thead>'
  		  +'<tbody>'
  		    + '<tr>'
  		      + '<td>机场内送机 散拼</td>'
  		      + '<td>' + (feesTemp.t1.basStepPrice / 100) + '</td>'
  		      + '<td>' + (feesTemp.t1.basMaxPrice / 100) + '</td>'
  		      + '<td>' + feesTemp.t1.addStartTime + '</td>'
  		      + '<td>' + feesTemp.t1.addEndTime + '</td>'
  		      + '<td>' + (feesTemp.t1.addPrice / 100) + '</td>'
  		      + '<td>' + feesTemp.t1.putPersonNum + '</td>'
  		      + '<td>' + (feesTemp.t1.putPrice / 100) + '</td>'
  		    + '</tr>'
  		    + '<tr>'
  		      + '<td>机场内送机 包团</td>'
  		      + '<td>' + (feesTemp.t2.basStepPrice / 100) + '</td>'
  		      + '<td>' + (feesTemp.t2.basMaxPrice / 100) + '</td>'
  		      + '<td>' + feesTemp.t2.addStartTime + '</td>'
  		      + '<td>' + feesTemp.t2.addEndTime + '</td>'
  		      + '<td>' + (feesTemp.t2.addPrice / 100) + '</td>'
  		      + '<td>' + feesTemp.t2.putPersonNum + '</td>'
  		      + '<td>' + (feesTemp.t2.putPrice / 100) + '</td>'
  		    + '</tr>'
  		    + '<tr>'
  		      + '<td>机场内接机 散拼</td>'
  		      + '<td>' + (feesTemp.t3.basStepPrice / 100) + '</td>'
  		      + '<td>' + (feesTemp.t3.basMaxPrice / 100) + '</td>'
  		      + '<td>' + feesTemp.t3.addStartTime + '</td>'
  		      + '<td>' + feesTemp.t3.addEndTime + '</td>'
  		      + '<td>' + (feesTemp.t3.addPrice / 100) + '</td>'
  		      + '<td>' + feesTemp.t3.putPersonNum + '</td>'
  		      + '<td>' + (feesTemp.t3.putPrice / 100) + '</td>'
  		    + '</tr>'
  		    + '<tr>'
  		      + '<td>机场内接机 包团</td>'
  		      + '<td>' + (feesTemp.t4.basStepPrice / 100) + '</td>'
  		      + '<td>' + (feesTemp.t4.basMaxPrice / 100) + '</td>'
  		      + '<td>' + feesTemp.t4.addStartTime + '</td>'
  		      + '<td>' + feesTemp.t4.addEndTime + '</td>'
  		      + '<td>' + (feesTemp.t4.addPrice / 100) + '</td>'
  		      + '<td>' + feesTemp.t4.putPersonNum + '</td>'
  		      + '<td>' + (feesTemp.t4.putPrice / 100) + '</td>'
  		    + '</tr>'
  		    + '<tr>'
  		      + '<td>机场外送机 散拼</td>'
  		      + '<td>' + (feesTemp.t5.basStepPrice / 100) + '</td>'
  		      + '<td>' + (feesTemp.t5.basMaxPrice / 100) + '</td>'
  		      + '<td>' + feesTemp.t5.addStartTime + '</td>'
  		      + '<td>' + feesTemp.t5.addEndTime + '</td>'
  		      + '<td>' + (feesTemp.t5.addPrice / 100) + '</td>'
  		      + '<td>' + feesTemp.t5.putPersonNum + '</td>'
  		      + '<td>' + (feesTemp.t5.putPrice / 100) + '</td>'
  		    + '</tr>'
  		    + '<tr>'
  		      + '<td>机场外送机 包团</td>'
  		      + '<td>' + (feesTemp.t6.basStepPrice / 100) + '</td>'
  		      + '<td>' + (feesTemp.t6.basMaxPrice / 100) + '</td>'
  		      + '<td>' + feesTemp.t6.addStartTime + '</td>'
  		      + '<td>' + feesTemp.t6.addEndTime + '</td>'
  		      + '<td>' + (feesTemp.t6.addPrice / 100) + '</td>'
  		      + '<td>' + feesTemp.t6.putPersonNum + '</td>'
  		      + '<td>' + (feesTemp.t6.putPrice / 100) + '</td>'
  		    + '</tr>'
  		    + '<tr>'
  		      + '<td>机场外接机 散拼</td>'
  		      + '<td>' + (feesTemp.t7.basStepPrice / 100) + '</td>'
  		      + '<td>' + (feesTemp.t7.basMaxPrice / 100) + '</td>'
  		      + '<td>' + feesTemp.t7.addStartTime + '</td>'
  		      + '<td>' + feesTemp.t7.addEndTime + '</td>'
  		      + '<td>' + (feesTemp.t7.addPrice / 100) + '</td>'
  		      + '<td>' + feesTemp.t7.putPersonNum + '</td>'
  		      + '<td>' + (feesTemp.t7.putPrice / 100) + '</td>'
  		    + '</tr>'
  		    + '<tr>'
  		      + '<td>机场外接机 包团</td>'
  		      + '<td>' + (feesTemp.t8.basStepPrice / 100) + '</td>'
  		      + '<td>' + (feesTemp.t8.basMaxPrice / 100) + '</td>'
  		      + '<td>' + feesTemp.t8.addStartTime + '</td>'
  		      + '<td>' + feesTemp.t8.addEndTime + '</td>'
  		      + '<td>' + (feesTemp.t8.addPrice / 100) + '</td>'
  		      + '<td>' + feesTemp.t8.putPersonNum + '</td>'
  		      + '<td>' + (feesTemp.t8.putPrice / 100) + '</td>'
  		    + '</tr>'
  		  + '</tboby>'
  		+ '</table>';

	jqueryMap.$feestemp.append(tableStr);
  }
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  onComplete_getMyFeesTempFromSV = function( event ){
    var myfeestemp  = configMap.people_model.getMyFeesTemp(configMap.people_model.get_user().company_id);
  	createTable(myfeestemp);
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
  initModule = function ( $container ) {
  	var myfeestemp;

    $container.html( configMap.main_html );
    stateMap.$container = $container;
    setJqueryMap();

    myfeestemp = configMap.people_model.getMyFeesTemp(configMap.people_model.get_user().company_id);

    if(myfeestemp === null){
		  $.gevent.subscribe( jqueryMap.$feestemp, 'zx-getMyFeesTempFromSV', onComplete_getMyFeesTempFromSV );
    }else{
    	createTable(myfeestemp);
    }

    return true;
  };
  // End public method /initModule/
   
  // Begin public method /removeThis/
  // Purpose    :
  //   * Removes chatfeestemp DOM element
  //   * Reverts to initial state
  //   * Removes pointers to callbacks and other data
  // Arguments  : none
  // Returns    : true
  // Throws     : none
  //
  removeThis = function () {
    // unwind initialization and state
    // remove DOM container; this removes event bindings too
    if ( jqueryMap.$feestemp ) {
      jqueryMap.$feestemp.remove();
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