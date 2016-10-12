/**
 * zx.home.js
 * home feature module for zx
**/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, zx */

zx.home = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  // 声明所有 zx.home 内可用的变量
  var
    // 静态配置值
    configMap = {
      main_html : String()
        + '<div class="zx-home row">'
          + '<div id="sitelink" class="col-sm-12"><a style="color: #0AB3FF;" href="http://gz.zxsl.net.cn/">广州站</a> . <a style="color: #0AB3FF;" href="http://sz.zxsl.net.cn/">深圳站</a> . <span>您现在位于杭州站</span></div>'
          + '<div class="col-md-9 col-md-offset-1 col-xs-12">'
            //+ '<img style="width: 30%;" src="../img/logo.png">'
            //+ '<div style="border-top: 2px solid">'
              //+ '<img style="width: 100%;" src="../gz/kaiye.png">'
            //+ '</div>'
            //+ '<h1 style="color: #ffdd66; font-family: 微软雅黑;">杭州站 <small style="color: #ffdd66; font-family: 微软雅黑;">免收送机费</small></h1>'
            /*+ '<div style="text-align: left;">'
              + '<h4 style="color: #ffdd66; font-family: 微软雅黑;">我们秉承“让客户安心，让客人顺心”的工作原则。全心全意做好机场服务工作，做您的机场好帮手！</h4>'
              + '<table style="color: white;">'
                + '<tr>'
                  + '<td>杭州分公司负责人：</td>'
                  + '<td>童斌 13905599444 邱磊 13795592349</td>'
                + '</tr>'
                + '<tr>'
                  + '<td>送机工作电话：</td>'
                  + '<td>叶先生 17767115960</td>'
                + '</tr>'
                + '<tr>'
                  + '<td>工作 QQ：</td>'
                  + '<td>31952767</td>'
                + '</tr>'
              + '</table>'
            + '</div>'
          + '</div>'*/
          + '<div style="position: fixed; bottom: 30px; right: 30px;">'
            + '<h4>&nbsp;</h4>'
            + '<h4 style="font-family:Microsoft Yahei;">操作视频</h4>'
            //+ '<p><a href="http://v.youku.com/v_show/id_XMTI1Mzc4MTI5Ng==.html" target="_blank">点击进入：基本发单流程</a></p>'
            + '<p><a href="http://hz.zxsl.net.cn/leanzx/leanzx.html" target="_blank">点击进入：发单流程（快速）</a></p>'
            //+ '<p><a href="http://v.youku.com/v_show/id_XMTI1MzY5NTI2MA==.html" target="_blank">点击进入：复杂表格名单导入</a></p>'
            + '<p><a href="http://sz.zxsl.net.cn/leanzx/leanzx-formimport.html" target="_blank">点击进入：名单导入（表格名单）</a></p>'
            //+ '<p><a href="http://v.youku.com/v_show/id_XMTI1MzYxMDY4MA==.html" target="_blank">点击进入：文本名单导入</a></p>'
            + '<p><a href="http://hz.zxsl.net.cn/leanzx/leanzx-textimport.html" target="_blank">点击进入：名单导入（文本名单）</a></p>'
          + '</div>'
        + '</div>'
    },
    // 动态状态信息
    stateMap  = { $container : null },
    jqueryMap = {},

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
      $home : $container.find('.zx-home')
    };
  };
  // End DOM method /setJqueryMap/
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
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
    $container.html( configMap.main_html );
    stateMap.$container = $container;
    setJqueryMap();

    $('body')
      .css('color','#F5F6F7')
      .css('background','#555657 url(../img/background.png) no-repeat fixed 0 50px')
      .css('background-size', '100% auto');
    return true;
  };
  // End public method /initModule/

  // Begin public method /removeThis/
  // Purpose    :
  //   * Removes chathome DOM element
  //   * Reverts to initial state
  //   * Removes pointers to callbacks and other data
  // Arguments  : none
  // Returns    : true
  // Throws     : none
  //
  removeThis = function () {
    // unwind initialization and state
    // remove DOM container; this removes event bindings too
    if ( jqueryMap.$home ) {
      jqueryMap.$home.remove();
      jqueryMap = {};
    }

    $('body')
      .css('color','#000000')
      .css('background','#dcdcff');

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
