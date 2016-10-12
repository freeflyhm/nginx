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
          + '<div id="sitelink" class="col-sm-12"><a style="color: blue;" href="http://hz.zxsl.net.cn/">杭州站</a> . <a style="color: blue;" href="http://gz.zxsl.net.cn/">广州站</a> . <span style="color: green;">您现在位于深圳站</span></div>'
          + '<div class="col-sm-8">'
            +'<div class="row" style="margin-top:20px;">'
              + '<div class="col-sm-12">'
                + '<h4 style="font-family:Microsoft Yahei;">深圳宝安机场T3航站楼送机--集合地点</h4>'
              + '</div>'
              + '<table id="zx-home-table" class="table table-bordered table-condensed">'
                + '<tbody>'
                  //+ '<tr>'
                    //+ '<td rowspan="11" style="display:table-cell;vertical-align: middle;text-align:center;font-size:18px;font-family:Microsoft Yahei;">2号门<br>集合</td>'
                    //+ '<td>航空公司</td>'
                    //+ '<td>简称</td>'
                    
                    //+ '<td>航空公司</td>'
                    //+ '<td>简称</td>'
                  //+ '</tr>'
                  + '<tr>'
                    + '<td rowspan="10" style="display:table-cell;vertical-align: middle;text-align:center;font-size:18px;font-family:Microsoft Yahei;">2号门<br>集合</td>'
                    + '<td>南方航空</td>'
                    + '<td>CZ</td>'
                    + '<td rowspan="3" style="display:table-cell;vertical-align: middle;text-align:center;font-size:24px;font-family:Microsoft Yahei;">阳光<br>机场接送中心</td>'
                    + '<td rowspan="12" style="display:table-cell;vertical-align: middle;text-align:center;font-size:18px;font-family:Microsoft Yahei;">6号门<br>集合</td>'
                    + '<td>深圳航空</td>'
                    + '<td>ZH</td>'
                  + '</tr>'
                  + '<tr>'
                    + '<td>海南航空</td>'
                    + '<td>HU</td>'
                    + '<td>国际航空</td>'
                    + '<td>CA</td>'
                  + '</tr>'
                  + '<tr>'
                    + '<td>厦门航空</td>'
                    + '<td>MF</td>'
                    + '<td>大连航空</td>'
                    + '<td>CA</td>'
                  + '</tr>'
                  + '<tr>'
                    + '<td>四川航空</td>'
                    + '<td>3U</td>'
                    + '<td rowspan="9" style="display:table-cell;vertical-align: middle;text-align:center;font-size:14px;font-family:Microsoft Yahei;">电话：0755-29539901<br>QQ：2246506846<br>调度：美玲13691993661</td>'
                    + '<td>昆明航空</td>'
                    + '<td>KY</td>'
                  + '</tr>'
                  + '<tr>'
                    + '<td>成都航空</td>'
                    + '<td>EU</td>'
                    + '<td>西藏航空</td>'
                    + '<td>TV</td>'
                  + '</tr>'
                  + '<tr>'
                    + '<td>春秋航空</td>'
                    + '<td>9C</td>'
                    + '<td>奥凯航空</td>'
                    + '<td>BK</td>'
                  + '</tr>'
                  + '<tr>'
                    + '<td>西部航空</td>'
                    + '<td>PN</td>'
                    //+ '<td rowspan="6" style="display:table-cell;vertical-align: middle;text-align:center;font-size:24px;font-family:Microsoft Yahei;">让客户安心<br>让客人顺心</td>'
                    + '<td>中联航空</td>'
                    + '<td>KN</td>'
                  + '</tr>'
                  + '<tr>'
                    + '<td>东海航空</td>'
                    + '<td>DZ</td>'
                    + '<td>东方航空</td>'
                    + '<td>MU</td>'
                  + '</tr>'
                  + '<tr>'
                    + '<td>祥鹏航空</td>'
                    + '<td>8L</td>'
                    + '<td>上海航空</td>'
                    + '<td>FM</td>'
                  + '</tr>'
                  + '<tr>'
                    + '<td>长龙航空</td>'
                    + '<td>GJ</td>'
                    + '<td>山东航空</td>'
                    + '<td>SC</td>'
                  + '</tr>'
                  + '<tr>'
                    + '<td rowspan="2" style="display:table-cell;vertical-align: middle;text-align:center;font-size:18px;font-family:Microsoft Yahei;">4号门<br>集合</td>'
                    + '<td>国际航班</td>'
                    + '<td></td>'
                    + '<td>吉祥航空</td>'
                    + '<td>HO</td>'
                  + '</tr>'
                  + '<tr>'
                    + '<td>港澳台航班</td>'
                    + '<td></td>'
                    + '<td>河北航空</td>'
                    + '<td>NS</td>'
                  + '</tr>'
                + '</tbody>'
              + '</table>'
              + '<div class="col-sm-12">'
                + '<h4 style="font-family:Microsoft Yahei;">航空公司电话及网址</h4>'
              + '</div>'
              + '<div class="col-sm-6">'
                + '<ul>'
                  + '<li> <a href="http://www.szairport.com/" target="_blank">深圳宝安机场--0755-23456789</a></li>'
                  + '<li> <a href="http://www.hnair.com/" target="_blank">海南航空HU--950718</a></li>'
                  + '<li> <a href="http://www.shenzhenair.com" target="_blank">深圳航空ZH--95080</a></li>'
                  + '<li> <a href="http://www.ceair.com" target="_blank">东方航空MU--95530</a></li>'
                  + '<li> <a href="http://www.xiamenair.com/cn/cn/" target="_blank">厦门航空MF--95557</a></li>'
                  + '<li> <a href="http://www.scal.com.cn/B2C" target="_blank">四川航空3U--4008300999</a></li>'
                  + '<li> <a href="http://www.chengduair.cc/" target="_blank">成都航空EU--02866668888</a></li>'
                  + '<li> <a href="http://www.china-sss.com/" target="_blank">春秋航空9C--95524</a></li>'
                  + '<li> <a href="http://www.juneyaoair.com" target="_blank">吉祥航空HO--95520</a></li>'
                  + '<li> <a href="http://bk.travelsky.com" target="_blank">奥凯航空BK--4000668866</a></li>'
                  + '<li> <a href="http://www.tibetairlines.com.cn" target="_blank">西藏航空TV--4008089188</a></li>'
                + '</ul>'
              + '</div>'
              + '<div class="col-sm-6">'
                + '<ul>'
                  + '<li> <a href="http://www.airkunming.com" target="_blank">昆明航空KY--4008876737</a></li>'
                  + '<li> <a href="http://www.ceair.com/mu/main/sh/index.html" target="_blank">上海航空FM--95530</a></li>'
                  + '<li> <a href="http://www.ceair.com//mu/main/lh/index.html" target="_blank">中联航空KN--95530</a></li>'
                  + '<li> <a href="http://www.shandongair.com.cn" target="_blank">山东航空SC--96777</a></li>'
                  + '<li> <a href="http://www.csair.com" target="_blank">南方航空CZ--95539</a></li>'
                  + '<li> <a href="http://www.airchina.com.cn/" target="_blank">国际航空CA--95583</a></li>'
                  + '<li> <a href="http://www.donghaiair.cn/" target="_blank">东海航空DZ-4000888666</a></li>'
                  + '<li> <a href="http://www.luckyair.net/" target="_blank">祥鹏航空8L-95071950</a></li>'
                  + '<li> <a href="http://www.loongair.cn/loongB2C/index.jsp" target="_blank">长龙航空GJ-057189999999</a></li>'
                  + '<li> <a href="http://www.dalianair-china.com/" target="_blank">大连航空CA-95583</a></li>'
                + '</ul>'
              + '</div>'
             // + '<div class="col-sm-12">'
             // + '<h4 style="font-family:Microsoft Yahei;">常用电话</h4>'
             // + '</div>'
             // + '<div class="col-sm-6">'
             //   + '<ul class="list_001">'
             //     + '<li>深圳机场问询处：0755-23456789</li>'
             //   + '</ul>'
             // + '</div>'
            + '</div>'
          + '</div>'
          + '<div class="col-sm-3 col-sm-offset-1">'
            + '<div style="min-height: 150px;">'
              + '<h4 style="font-family:Microsoft Yahei;"><strong>客户须知</strong></h4>'
              + '<ol>' 
                + '<li><strong>我们会将所有团队在提前一天办理登机牌（南航、春秋）除外。如果不需要我们提前办理，请在下单的时候告诉我们。</strong></li>'
                + '<li><strong>各位订票的时候一定要注意，出票证件号一定是要客人本人的有效证件号码。</strong></li>'
                + '<li><strong>港澳台的客人名字是繁体字的，最好出客人证件上的英文名（不是汉字拼音）如不明白请联系我们。</strong></li>'
                + '<li><strong>提醒港澳台及持护照客人，一定要带上证件。机场派出所只受理临时身份证的办理。</strong></li>'
                + '<li><strong>12周岁一下儿童可以使用户口簿及出生证登机。</strong></li>'
                + '<li><strong>机场派出所上班时间为5:30-21:00，所以，早班机的客人如果忘带身份证基本就无法登机了。</strong></li>'
                + '<li><strong>错名字：'
                  + '<ul>' 
                    + '<li>任何航空公司：姓错了就无法盖章，需要出票点修改或者重新买票。</li>'
                    + '<li>名错，没有同家航空公司的返程票可以盖章。</li>'
                    + '<li>同音字如果错两个 如："王彤彤" 打成 "王瞳瞳" 也是不可盖章的。</li>'
                    + '<li>无法修改无法盖章的，我们现场人员尽量帮助处理。</li>'
                  + '</ul>'
                + '</strong></li>'
              + '</ol>'
            + '</div>'
            + '<div>'
              + '<h4 style="font-family:Microsoft Yahei;">操作视频</h4>'
              //+ '<p><a href="http://v.youku.com/v_show/id_XMTI1Mzc4MTI5Ng==.html" target="_blank">点击进入：基本发单流程</a></p>'
              + '<p><a href="http://sz.zxsl.net.cn/leanzx/leanzx.html" target="_blank">点击进入：发单流程（快速）</a></p>'
              //+ '<p><a href="http://v.youku.com/v_show/id_XMTI1MzY5NTI2MA==.html" target="_blank">点击进入：复杂表格名单导入</a></p>'
              + '<p><a href="http://sz.zxsl.net.cn/leanzx/leanzx-formimport.html" target="_blank">点击进入：名单导入（表格名单）</a></p>'
              //+ '<p><a href="http://v.youku.com/v_show/id_XMTI1MzYxMDY4MA==.html" target="_blank">点击进入：文本名单导入</a></p>'
              + '<p><a href="http://sz.zxsl.net.cn/leanzx/leanzx-textimport.html" target="_blank">点击进入：名单导入（文本名单）</a></p>'
            + '</div>'
          + '</div>'
        + '</div>'
    },
    // 动态状态信息
    stateMap  = { $container: null },
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
      .css('color','#006801')
      .css('background-color','#8ebc8e'); 
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
      .css('background-color','#eee'); 

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