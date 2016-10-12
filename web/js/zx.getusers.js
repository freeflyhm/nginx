/*  isShowFooter
 * zx.getusers.js
 * getusers feature module for zx
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, zx */

zx.getusers = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  // 声明所有 zx.getusers 内可用的变量
  var
    // 静态配置值
    configMap = {
      main_html : String()
        + '<div class="zx-getusers">'
      	  + '<div class="col-sm-6">'
              + '<h3>users</h3>'
            + '</div>'
            + '<table id="getusers_table" class="table table-bordered table-condensed">'
              + '<thead>'
                + '<tr>'
                  + '<th>from</th>'
                  + '<th>user_id</th>'
                  + '<th>userName</th>'
                  + '<th>role</th>'
                  + '<th>name</th>'
                  + '<th>phone</th>'
                  + '<th>sendSetTime</th>'
                  + '<th>company_id</th>'
                  + '<th>category</th>'
                  + '<th>companyAbbr</th>'
                  + '<th>socket_id</th>'
                  + '<th>isLock</th>'
                + '</tr>'
              + '</thead>'
              + '<tbody id="getusers_table_tbody">'
              + '</tbody>'
            + '</table>'
            + '<pre id="cardIdAdds"></pre>'
            + '<table id="userslist_table" class="table table-bordered table-condensed">'
              + '<thead>'
                + '<tr>'
                  + '<th>_id</th>'
                  + '<th>FromUserName</th>'
                  + '<th>userName</th>'
                  + '<th>name</th>'
                  + '<th>phone</th>'
                  + '<th>qq</th>'
                  + '<th>role</th>'
                  + '<th>status</th>'
                  + '<th>companyAbbr</th>'
                  + '<th>_id</th>'
                  + '<th>name</th>'
                  + '<th>category</th>'
                  + '<th>city</th>'
                + '</tr>'
              + '</thead>'
              + '<tbody id="userslist_table_tbody">'
              + '</tbody>'
            + '</table>'
          + '</div>'
        + '</div>'
    },
    // 动态状态信息
    stateMap  = { $container : null },
    jqueryMap = {},

    on_getusers,

    setJqueryMap, configModule, initModule,
    removeThis;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //------------------- BEGIN UTILITY METHODS ------------------
  //-------------------- END UTILITY METHODS -------------------

  //--------------------- BEGIN DOM METHODS --------------------
  // Begin DOM method /setJqueryMap/
  setJqueryMap = function () {
    var $container = stateMap.$container;
    jqueryMap = {
    	$container : $container,
    	$getusers  : $container.find('.zx-getusers'),
      $tbody     : $container.find('#getusers_table_tbody'),
      $listtbody : $container.find('#userslist_table_tbody'),
    };
  };
  // End DOM method /setJqueryMap/
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  on_getusers = function( event, results ) {
  	var result = results[0].cookieUsers,
        key, objFrom, k, obj, $tr;
    
    for (key in result) {
      if (result.hasOwnProperty(key)) {
        objFrom = result[key];
        for (k in objFrom) {
          if (objFrom.hasOwnProperty(k)) {
            obj = objFrom[k];
            $tr=
              $('<tr></tr>')
                .append($('<td></td>').text(key))
                .append($('<td></td>').text(obj.user_id))
                .append($('<td></td>').text(obj.userName))
                .append($('<td></td>').text(obj.role))
                .append($('<td></td>').text(unescape(obj.name)))
                .append($('<td></td>').text(obj.phone))
                .append($('<td></td>').text(obj.sendSetTime))
                .append($('<td></td>').text(obj.company_id))
                .append($('<td></td>').text(obj.category))
                .append($('<td></td>').text(unescape(obj.companyAbbr)))
                .append($('<td></td>').text(obj.socket_id));

            if(obj.lock){
              $tr.append($('<td></td>').text(obj.lock.isLocked));
            } else {
              $tr.append($('<td></td>'));
            }
                
            jqueryMap.$tbody.append($tr);
          }
        }
      }
    }

    var userslist = results[0].userslist;
    var u_len = userslist.length;
    var u_i;
    for (u_i = 0; u_i < u_len; u_i++) {
      obj = userslist[u_i];
      $tr = $('<tr></tr>')
              .append($('<td></td>').text(obj._id))
              .append($('<td></td>').text(obj.FromUserName))
              .append($('<td></td>').text(obj.userName))
              .append($('<td></td>').text(unescape(obj.name)))
              .append($('<td></td>').text(obj.phone))
              .append($('<td></td>').text(obj.qq))
              .append($('<td></td>').text(obj.role))
              .append($('<td></td>').text(obj.status))
              .append($('<td></td>').text(unescape(obj.companyAbbr)))
              .append($('<td></td>').text(obj.company._id))
              .append($('<td></td>').text(obj.company.name))
              .append($('<td></td>').text(obj.company.category))
              .append($('<td></td>').text(obj.company.city));

      jqueryMap.$listtbody.append($tr);
    }


    if (window.localStorage) {
      var res_cards = results[0].cardIdAdds;
      var cardIdAdds = {};
      if (window.localStorage.cardIdAdds) {
        cardIdAdds = JSON.parse(window.localStorage.cardIdAdds);
      }

      for (key in res_cards) {
        cardIdAdds[key] = res_cards[key];
      }

      localStorage.setItem('cardIdAdds', JSON.stringify(cardIdAdds));

      $('#cardIdAdds').text(JSON.stringify(cardIdAdds, null, 2));

      return;
    }
    $('#cardIdAdds').text(JSON.stringify(results[0].cardIdAdds, null, 2));
  
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
  	//console.log(argObj);
    $container.html( configMap.main_html );
    stateMap.$container = $container;
    setJqueryMap();

    // 向服务器获取数据
    $.gevent.subscribe( jqueryMap.$getusers, 'zx-getusers', on_getusers );
    
    zx.model.getusers.getusers();

    return true;   
  };
  // End public method /initModule/
   
  // Begin public method /removeThis/
  // Purpose    :
  //   * Removes chatgetusers DOM element
  //   * Reverts to initial state
  //   * Removes pointers to callbacks and other data
  // Arguments  : none
  // Returns    : true
  // Throws     : none
  //
  removeThis = function () {
    // unwind initialization and state
    // remove DOM container; this removes event bindings too
    if ( jqueryMap.$getusers ) {
      jqueryMap.$getusers.remove();
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