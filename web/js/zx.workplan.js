/**
 * zx.workplan.js
 * workplan feature module for zx
**/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, zx */

zx.workplan = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  // 声明所有 zx.workplan 内可用的变量
  var
    // 静态配置值
    configMap = {
      btn_group_html : String()
        + '<div class="btn-group" role="group" style="margin-top:8px;">'
          + '<button type="button" id="prevBtn" class="btn btn-default"><span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span></button>'
          + '<button type="button" id="nextBtn" class="btn btn-default"><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>'
        + '</div>',
      form_html : String()
        + '<form id="workplanForm" class="form-horizontal">'
          + '<div class="form-group form-group-sm">'
            + '<label class="col-sm-4 control-label">班次</label>'
            + '<div class="col-sm-8">'
              + '<select id="typeSelect" class="form-control" name="workplan[type]">'
                + '<option value="早">早</option>'
                + '<option value="中">中</option>'
                + '<option value="晚">晚</option>'
                + '<option value="外">外</option>'
              + '</select>'
            + '</div>'
          + '</div>'
          + '<div class="form-group form-group-sm">'
            + '<label class="col-sm-4 control-label">好汉</label>'
            + '<div class="col-sm-8">'
              + '<select id="nameSelect" class="form-control" name="workplan[name]"></select>'
            + '</div>'
          + '</div>'
          + '<div id="priceDiv" class="form-group form-group-sm hidden">'
            + '<label class="col-sm-4 control-label">银子</label>'
            + '<div class="col-sm-8">'
              + '<input id="priceInput" class="form-control" type="text" placeholder="0.00" name="workplan[price]">'
            + '</div>'
          + '</div>'
          + '<div class="zx-form-errors"></div>'
        + '</form>',
      main_html : String()
        + '<div class="zx-workplan"></div>',
      workplan_modal_html : String()
        + '<div id="workplan-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">'
          + '<div class="modal-dialog modal-sm">'
            + '<div class="modal-content">'
              + '<div class="modal-header">'
                + '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                + '<h4 id="workplan-modal-title" class="modal-title"></h4>'
              + '</div>'
              + '<div id="workplan-modal-body" class="modal-body"></div>'
              + '<div class="modal-footer">'
                + '<button id="delBtn" type="button" class="btn btn-danger hidden">删除</button>'
                + '<button id="saveBtn" type="button" class="btn btn-primary">保存</button>'
                + '<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>'
              + '</div>'
            + '</div>'
          + '</div>'
        + '</div>'
    },
    // 动态状态信息
    stateMap  = {
      thisMonth      : '',
      $container     : null,
      argObj         : null,
      events         : null,
      servermans     : null,
      modelEvent     : null,
      modelTypeIsNew : true,
      workplanDate   : ''
    },
    jqueryMap = {},

    on_getworkplan, on_saveworkplan, on_delworkplan,
    on_dayClick, on_eventClick,
    getWorkspan, getNextMonth,
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
      $container          : $container,
      $workplan           : $container.find('.zx-workplan'),
      $workplanModal      : $('#workplan-modal'),
      $workplanModalTitle : $('#workplan-modal-title'),
      $workplanModalBody  : $('#workplan-modal-body'),
      $delBtn             : $('#delBtn'),
      $saveBtn            : $('#saveBtn')
    };
  };
  // End DOM method /setJqueryMap/
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  on_getworkplan = function( event, results ) {
    //console.log(results[0]);
    var workplans = results[0].workplans,
        servermansMap;
    // 初始化
    if(!results[0].findSVM){
      stateMap.events = workplans.map(function(item, index, array) {
        return getWorkspan(item);
      });

      jqueryMap.$workplan.fullCalendar( 'refetchEvents' );
      
      if(results[0].num === 1) {
        jqueryMap.$workplan.fullCalendar('next');
      } else if(results[0].num === -1){
        jqueryMap.$workplan.fullCalendar('prev');
      }
      return;
    }

    servermansMap = results[0].servermans.map(function(item) {
      return '<option value="' + item + '">' + item + '</option>';
    });
    stateMap.servermansHtml = servermansMap.join('');

    stateMap.events = workplans.map(function(item, index, array) {
      return getWorkspan(item);
    });

    if(stateMap.argObj.c === 'edit'){
      jqueryMap.$workplan.fullCalendar({
        header: {
          left: 'title',
          center: '',
          right: ''
        },      
        weekMode: 'variable', // 周的显示模式：周数不定，每周的高度固定，整个日历的高度可变
        timeFormat: 't',  // 每个事件默认显示的时间格式
        events: function( start, end, timezone, callback ) { 
          callback(stateMap.events);
        },
        dayClick: on_dayClick,
        eventClick: on_eventClick
      });

      jqueryMap.$workplan.find('.fc-left').append(configMap.btn_group_html);
    } else {
      jqueryMap.$workplan.fullCalendar({
        header: {
          left: 'title',
          center: '',
          right: ''
        },      
        weekMode: 'variable', // 周的显示模式：周数不定，每周的高度固定，整个日历的高度可变
        timeFormat: 't',  // 每个事件默认显示的时间格式
        events: function( start, end, timezone, callback ) { 
          callback(stateMap.events);
        }
      });

      jqueryMap.$workplan.find('.fc-left').append(configMap.btn_group_html);
    }
  };

  on_saveworkplan = function( event, results ) {
    var result = results[0],
        i, len, item;
    //console.log(result);
    if(result.success === 1){
      if(result.isNew) {
        stateMap.events.push(getWorkspan(result.workplan));      
      } else {
        for(i = 0, len = stateMap.events.length; i < len; i++) {
          item = stateMap.events[i];
          //console.log(item);
          if(item._id === stateMap.modelEvent._id) {
            item.workplanType = result.workplan.workplanType;
            item.name = result.workplan.name;
            item.price = result.workplan.price;

            item = getWorkspan(item);
            break;
          }
        }

      }
      jqueryMap.$workplan.fullCalendar( 'refetchEvents' );
    } else {
      alert('写入数据库失败，请再试一次...');
    }

    jqueryMap.$saveBtn
      .prop( 'disabled', false )
      .text( '保存' );
    jqueryMap.$workplanModal.modal('hide');
  };

  on_delworkplan = function( event, results ) {
    var result = results[0],
        i, len, item;

    if(result.success.ok === 1) {
      for(i = 0, len = stateMap.events.length; i < len; i++) {
        item = stateMap.events[i];
        //console.log(item._id);
        if(item._id === result._id) {
          stateMap.events.splice(i,1);
          break;
        }
      }

      jqueryMap.$workplan.fullCalendar( 'refetchEvents' );
    } else {
      alert('删除数据失败，请再试一次...');
    }

    jqueryMap.$delBtn
      .prop( 'disabled', false )
      .text( '删除' );
    jqueryMap.$workplanModal.modal('hide');
  };

  on_dayClick = function(date, jsEvent, view) {
    /*console.log(date.format());
    console.log(view.intervalStart.format());
    console.log(view.intervalEnd.format());*/

    if(date >= view.intervalStart && date < view.intervalEnd){
      stateMap.modelTypeIsNew = true;
      // 在状态中存储当前单元格的日期
      stateMap.workplanDate = date.format();

      jqueryMap.$workplanModal.modal({
        backdrop: 'static'
      });
    }
  };

  on_eventClick = function(event, jsEvent, view) {
    stateMap.modelTypeIsNew = false;
    stateMap.modelEvent = event;
    //console.log(event);
    jqueryMap.$workplanModal.modal({
      backdrop: 'static'
    });
  };
  //-------------------- END EVENT HANDLERS --------------------

  getWorkspan = function(item) {
    switch(item.workplanType){
      case '早':
        item.title = item.name;
        item.backgroundColor = '#5bc0de';
        item.borderColor = '#46b8da';
        item.start = moment(item.workplanDate).add(8, 'h');
        break;
      case '中':
        item.title = item.name;
        item.backgroundColor = '#337ab7';
        item.borderColor = '#2e6da4';
        item.start = moment(item.workplanDate).add(12, 'h');
        break;
      case '晚':
        item.title = item.name;
        item.backgroundColor = '#d9534f';
        item.borderColor = '#d43f3a';
        item.start = moment(item.workplanDate).add(14, 'h');
        break;
      case '外':
        item.title = item.name + '+' + (item.price / 100);
        item.backgroundColor = '#5cb85c';
        item.borderColor = '#4cae4c';
        item.start = moment(item.workplanDate).add(23, 'h');
        break;
    }
    return item;
  };

  getNextMonth = function(month, num) {
    var nextMonth;

    if (num === -1) {
      nextMonth = moment(month).subtract(1, 'M').format('YYYY-MM-DD');
    } else {
      nextMonth = moment(month).add(1, 'M').format('YYYY-MM-DD');
    }

    return nextMonth;
  };

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
    stateMap.thisMonth = moment().startOf('month').format('YYYY-MM-DD');

    stateMap.argObj = argObj;
    stateMap.$container = $container;

    $container.html( configMap.main_html );
    $container.append( configMap.workplan_modal_html );

    setJqueryMap();

    $.gevent.subscribe( jqueryMap.$workplan, 'zx-getworkplan', on_getworkplan );
    $.gevent.subscribe( jqueryMap.$workplan, 'zx-saveworkplan', on_saveworkplan );
    $.gevent.subscribe( jqueryMap.$workplan, 'zx-delworkplan', on_delworkplan );

    zx.model.workplan.getworkplan({
      month   : stateMap.thisMonth,
      findSVM : true,
      num     : 0
    });

    if(argObj.c === 'edit'){
      jqueryMap.$workplanModal.on('show.bs.modal', function () {
        // 初始化弹出框
        jqueryMap.$workplanModalBody.html(configMap.form_html);

        $('#nameSelect').html(stateMap.servermansHtml);

        if(stateMap.modelTypeIsNew){
          jqueryMap.$workplanModalTitle.text('排班表-新增项目');
          jqueryMap.$delBtn.addClass('hidden');
        } else {
          jqueryMap.$workplanModalTitle.text('排班表-修改项目');
          jqueryMap.$delBtn.removeClass('hidden');

          $('#typeSelect').val(stateMap.modelEvent.workplanType);
          $('#nameSelect').val(stateMap.modelEvent.name);
          //console.log(stateMap.modelEvent);
          if(stateMap.modelEvent.workplanType === '外'){
            $('#priceInput').val(stateMap.modelEvent.price / 100);
            $('#priceDiv').removeClass('hidden');
          }
        }

        jqueryMap.$workplanForm = $('#workplanForm');
        jqueryMap.$workplanForm.formValidation({
          framework: 'bootstrap',
          icon: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
          },
          fields: {
            'workplan[price]': {
              validators: {
                regexp: {
                  regexp: /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/,
                  message: '非负数，可保留两位小数'
                }
              }
            }
          }
        }).on('err.field.fv', function (e, data) {
          jqueryMap.$saveBtn.attr( 'disabled', true );
        }).on('success.field.fv', function (e,data) {
          jqueryMap.$saveBtn.attr( 'disabled', false );
        });
      });
    }

    jqueryMap.$workplanModalBody.on('change', '#typeSelect', function() {
      var $that = $(this);
      if($that.val() === '外'){
        $('#priceDiv').removeClass('hidden');
      } else {
        $('#priceDiv').addClass('hidden');
      }
    });

    jqueryMap.$saveBtn.click(function() {
      var $that = $(this),
          fieldObj = {},
          workplanSVObj = {},
          formValidation = jqueryMap.$workplanForm.data('formValidation'),
          fieldArr,
          i, len, item;

      formValidation.validate();
      if(formValidation.isValid()){

        fieldArr = jqueryMap.$workplanForm.serializeArray();
        $.each(fieldArr,function(){
          fieldObj[this.name] = this.value;
        });

        if(stateMap.modelTypeIsNew) {
          // 新增
          workplanSVObj.workplanType = fieldObj['workplan[type]'];
          workplanSVObj.name = fieldObj['workplan[name]'];
          workplanSVObj.workplanDate = stateMap.workplanDate;
          if(workplanSVObj.workplanType === '外'){
            workplanSVObj.price = Number(fieldObj['workplan[price]']) * 100;
          } else {
            workplanSVObj.price = 0;
          }

          $that
            .prop( 'disabled', true )
            .text( '正在保存...' );
          // 写入服务器
          zx.model.workplan.saveworkplan({
            workplanSVObj : workplanSVObj,
            isNew : true
          });
        } else {
          // 修改
          for(i = 0, len = stateMap.events.length; i < len; i++) {
            item = stateMap.events[i];
            //console.log(item._id);
            if(item._id === stateMap.modelEvent._id) {
              workplanSVObj._id = item._id;
              workplanSVObj.workplanType = fieldObj['workplan[type]'];
              workplanSVObj.name = fieldObj['workplan[name]'];
              workplanSVObj.workplanDate = stateMap.modelEvent.workplanDate;
              if(workplanSVObj.workplanType === '外'){
                workplanSVObj.price = Number(fieldObj['workplan[price]']) * 100;
              } else {
                workplanSVObj.price = 0;
              }
              break;
            }
          }

          $that
            .prop( 'disabled', true )
            .text( '正在保存...' );
          // 写入服务器
          zx.model.workplan.saveworkplan({
            workplanSVObj : workplanSVObj,
            isNew : false
          });
        }
      }
    });

    jqueryMap.$delBtn.click(function() {
      //console.log(stateMap.modelEvent);
      var $that = $(this);

      $that
        .prop( 'disabled', true )
        .text( '正在删除...' );

      zx.model.workplan.delworkplan(stateMap.modelEvent._id);
    });

    jqueryMap.$workplan.on('click', '#prevBtn', function() {     
      stateMap.thisMonth = getNextMonth(stateMap.thisMonth, -1);

      zx.model.workplan.getworkplan({
        month   : stateMap.thisMonth,
        findSVM : false,
        num     : -1
      });

      /*// 初始化
      stateMap.events = workplans7.map(function(item, index, array) {
          return getWorkspan(item);
      });*/

      //jqueryMap.$calendar.fullCalendar( 'refetchEvents' );
      //jqueryMap.$workplan.fullCalendar('prev');
    });

    jqueryMap.$workplan.on('click', '#nextBtn', function() {
      stateMap.thisMonth = getNextMonth(stateMap.thisMonth, 1);

      zx.model.workplan.getworkplan({
        month   : stateMap.thisMonth,
        findSVM : false,
        num     : 1
      });

      /*// 初始化
      stateMap.events = workplans8.map(function(item, index, array) {
          return getWorkspan(item);
      });

      jqueryMap.$calendar.fullCalendar( 'refetchEvents' );
      jqueryMap.$calendar.fullCalendar('next');*/
    });

    return true;
    
  };
  // End public method /initModule/
   
  // Begin public method /removeThis/
  // Purpose    :
  //   * Removes chatworkplan DOM element
  //   * Reverts to initial state
  //   * Removes pointers to callbacks and other data
  // Arguments  : none
  // Returns    : true
  // Throws     : none
  //
  removeThis = function () {
    // unwind initialization and state
    // remove DOM container; this removes event bindings too
    if ( jqueryMap.$workplan ) {
      jqueryMap.$workplan.remove();
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