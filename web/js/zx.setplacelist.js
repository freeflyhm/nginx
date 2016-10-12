/*
 * zx.setplacelist.js
 * setplacelist feature module for zx
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, zx, moment */

zx.setplacelist = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  // 声明所有 zx.setplacelist 内可用的变量
  var
    // 静态配置值
    configMap = {
      main_html : String()
        + '<div class="zx-list row">'
          +'<div class="col-sm-6">'
            + '<h3>集合地点列表</h3>'
          + '</div>'
          +'<div class="col-sm-6 text-right">'
            + '<button type="button" class="zx-list-top-btn newOperatorBtn btn btn-primary hidden">添加集合地点</button>'
          + '</div>'
          + '<table class="table table-striped table-hover table-responsive">'
            + '<thead>'
              + '<tr>'
                + '<th>序号</th>'
                + '<th>城市</th>'
                + '<th>航空公司</th>'
                + '<th>代码</th>'
                + '<th>候机楼</th>'
                + '<th>值机岛</th>'
                + '<th>值机柜台</th>'
                + '<th>集合地点</th>'
                + '<th>创建日期</th>'
                + '<th>最后更新</th>'
                //+ '<th>修改</th>'
                //+ '<th>删除</th>'
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
    // EVENT HANDLERS
    onCompleteGetlist,
    // DOM METHODS
    setJqueryMap, 

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
    // 初始化
    //jqueryMap.$tbody.html('');
    // 渲染表格
    var result = results[0],
    i, item, $tr;
    for(i=0; i<result.length; i++) {
      item = result[i];
      $tr=$('<tr></tr>').addClass('item-id-' + item._id);

      $tr
        .append($('<td></td>').text(i+1))
        .append($('<td></td>').text(item.city))
        .append($('<td></td>').text(item.airlineCompany))
        .append($('<td></td>').text(item.airCode))
        .append($('<td></td>').text(item.airTerminal))
        .append($('<td></td>').text(item.checkInIsland))
        .append($('<td></td>').text(item.checkInCounter))
        .append($('<td></td>').text(item.place))
        .append($('<td></td>').text(moment(item.meta.createAt).format('YYYY-MM-DD')))
        .append($('<td></td>').text(moment(item.meta.updateAt).format('YYYY-MM-DD')));
        /*.append($('<td></td>')
          .append($('<button class="updateOperatorBtn btn btn-xs btn-primary">修改</button>')
            .data('id',item._id)
            .data('company_abbr',item.companyAbbr)
            .data('name',item.name)
            .data('phone',item.phone)))
        .append($('<td></td>')
          .append($('<button class="deleteOperatorBtn btn btn-xs btn-danger">删除</button>')
            .data('id',item._id)));*/

      jqueryMap.$tbody.append($tr);
    }
  }; 
  // End Event handler /onCompleteGetlist/
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
    
    // getlist
    zx.model.list.getlist(argObj);

    //jqueryMap.$list.on('click','button.newOperatorBtn', onNewOperatorBtnClick );
    //jqueryMap.$list.on('click','button.updateOperatorBtn', onUpdateOperatorBtnClick );
    //jqueryMap.$list.on('click','button.deleteOperatorBtn', onDeleteOperatorBtnClick );

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
    configModule : configModule,
    initModule   : initModule,
    removeThis : removeThis
  };
  //------------------- END PUBLIC METHODS ---------------------
}());