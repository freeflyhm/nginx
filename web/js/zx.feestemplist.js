/* isShowFooter
 * zx.feestemplist.js
 * feestemplist feature module for zx
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, zx, moment */

zx.feestemplist = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  // 声明所有 zx.feestemplist 内可用的变量
  var
    // 静态配置值
    configMap = {
      main_html : String()
        + '<div class="zx-list row">'
          +'<div class="col-sm-6">'
            + '<h3>服务费模板列表</h3>'
          + '</div>'
          +'<div class="col-sm-6 text-right">'
            + '<button type="button" id="showFeesTempBtn" class="zx-list-top-btn btn btn-primary">服务费基础模板</button>'
          + '</div>'
          + '<table class="table table-striped table-hover table-responsive">'
          	+ '<thead>'
          		+ '<tr>'
          		  + '<th>序号</th>'
          		  + '<th>模板名称</th>'
          		  + '<th>创建日期</th>'
          		  + '<th>最后更新</th>'
            	  + '<th style="width:100px;">调整服务费</th>'
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

    // DOM METHODS
    setJqueryMap, 
    // EVENT HANDLERS
    onCompleteGetlist, on_updateItemFeesTempBtn_click, 
    on_feesTempBtn_click,
    on_numb_blur, on_numbzz_blur, on_numbZ_blur, on_numbF_blur,
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
  	
    var result = results[0], 
    i, item, $tr, $td,
    sn = 1;
  	
  	//console.log(result);

    if( JSON.stringify(results[0]) === "{}" ) {
      return;
    }

    //console.log(result);
    

    // 渲染表格
    
  	for(i=0; i<result.length; i++) {
  	  item = result[i];

  	  if(item.name === '基础') {
  	  	$('#showFeesTempBtn').data('feestemp',item);
  	  } else {
	      $td  = $('<td></td>')
	      	.append($('<button class="updateItemFeesTempBtn btn btn-xs btn-primary">调整服务费</button>')
	        .data('feestemp',item));

		  $tr  = $('<tr></tr>').addClass('item-id-' + item._id);
	  	  $tr
	  	  	.append($('<td></td>').text(sn))
	  	  	.append($('<td class="fesstempName"></td>').text(item.name))
	  	  	.append($('<td></td>').text(moment(item.meta.createAt).format('YYYY-MM-DD')))
	  	  	.append($('<td></td>').text(moment(item.meta.updateAt).format('YYYY-MM-DD')))
	        .append($td);

	  	  jqueryMap.$tbody.append($tr);
	  	  sn += 1; 
  	  }
  	}

    // 注册事件
    $('#showFeesTempBtn').click( on_feesTempBtn_click );
  }; 
  // End Event handler /onCompleteGetlist/

  // Begin Event handler /on_updateItemFeesTempBtn_click/ 
  on_updateItemFeesTempBtn_click = function () {
  	var $that = $(this),
        itemFeesTemp = $that.data('feestemp'),
        itemFeesTempCopy = {
        	t1 : {},
        	t2 : {},
        	t3 : {},
        	t4 : {},
        	t5 : {},
        	t6 : {},
        	t7 : {},
        	t8 : {}
        },
        feesTemp = $('#showFeesTempBtn').data('feestemp');

    //console.log(itemFeesTemp);
	zx.modal.initModule({
		size      : 'modal-lg',
		$title    : $('<h4 class="modal-title">调整服务费' + itemFeesTemp.name + '模板</h4>'),
		formClass : 'form-updateItemFeesTemp',
		main_html : String()
		  + '<table class="table table-striped table-bordered table-condensed">'
		    + '<thead>' 
		      + '<tr>'
		        + '<th rowspan="2">服务分类</th>'
		        + '<th colspan="4">基本费用</th>'
		        + '<th colspan="4">加班费</th>'
		        + '<th colspan="4">人数补贴</th>'
		      + '</tr>' 
		      + '<tr>'
		        + '<th>元/人</th>'
		        + '<th>+-</th>'
		        + '<th>不超过(元)</th>'
		        + '<th>+-</th>'
		        + '<th>开始时间</th>'
		        + '<th>截止时间</th>'
		        + '<th>费用(元)</th>'
		        + '<th>+-</th>'
		        + '<th>人数下限(人)</th>'
		        + '<th>+-</th>'
		        + '<th>元/人</th>'
		        + '<th>+-</th>'
		      + '</tr>'
		    + '</thead>'
		    +'<tbody>'
		      + '<tr id="t1">'
		        + '<td>机场内送机 散拼</td>'
		        + '<td><div>' + (feesTemp.t1.basStepPrice / 100) + '</div></td>'
		        + '<td id="t1_1" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t1.basStepPrice / 100) + '</div></td>'
		        + '<td><div>' + (feesTemp.t1.basMaxPrice / 100) + '</div></td>'
		        + '<td id="t1_2" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t1.basMaxPrice / 100) + '</div></td>'
		        + '<td><div>' + feesTemp.t1.addStartTime + '</div></td>'
		        + '<td><div>' + feesTemp.t1.addEndTime + '</div></td>'
		        + '<td><div>' + (feesTemp.t1.addPrice / 100) + '</div></td>'
		        + '<td id="t1_5" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t1.addPrice / 100) + '</div></td>'
		        + '<td><div>' + feesTemp.t1.putPersonNum + '</div></td>'
		        + '<td id="t1_6" class="warning numb" contenteditable="true" spellcheck="false"><div>' + itemFeesTemp.t1.putPersonNum + '</div></td>'
		        + '<td><div>' + (feesTemp.t1.putPrice / 100) + '</div></td>'
		        + '<td id="t1_7" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t1.putPrice / 100) + '</div></td>'
		      + '</tr>'
		      + '<tr id="t2">'
		        + '<td>机场内送机 包团</td>'
		        + '<td><div>' + (feesTemp.t2.basStepPrice / 100) + '</div></td>'
		        + '<td id="t2_1" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t2.basStepPrice / 100) + '</div></td>'
		        + '<td><div>' + (feesTemp.t2.basMaxPrice / 100) + '</div></td>'
		        + '<td id="t2_2" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t2.basMaxPrice / 100) + '</div></td>'
		        + '<td><div>' + feesTemp.t2.addStartTime + '</div></td>'
		        + '<td><div>' + feesTemp.t2.addEndTime + '</div></td>'
		        + '<td><div>' + (feesTemp.t2.addPrice / 100) + '</div></td>'
		        + '<td id="t2_5" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t2.addPrice / 100) + '</div></td>'
		        + '<td><div>' + feesTemp.t2.putPersonNum + '</div></td>'
		        + '<td id="t2_6" class="warning numb" contenteditable="true" spellcheck="false"><div>' + itemFeesTemp.t2.putPersonNum + '</div></td>'
		        + '<td><div>' + (feesTemp.t2.putPrice / 100) + '</div></td>'
		        + '<td id="t2_7" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t2.putPrice / 100) + '</div></td>'
		      + '</tr>'
		      + '<tr id="t3">'
		        + '<td>机场内接机 散拼</td>'
		        + '<td><div>' + (feesTemp.t3.basStepPrice / 100) + '</div></td>'
		        + '<td id="t3_1" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t3.basStepPrice / 100) + '</div></td>'
		        + '<td><div>' + (feesTemp.t3.basMaxPrice / 100) + '</div></td>'
		        + '<td id="t3_2" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t3.basMaxPrice / 100) + '</div></td>'
		        + '<td><div>' + feesTemp.t3.addStartTime + '</div></td>'
		        + '<td><div>' + feesTemp.t3.addEndTime + '</div></td>'
		        + '<td><div>' + (feesTemp.t3.addPrice / 100) + '</div></td>'
		        + '<td id="t3_5" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t3.addPrice / 100) + '</div></td>'
		        + '<td><div>' + feesTemp.t3.putPersonNum + '</div></td>'
		        + '<td id="t3_6" class="warning numb" contenteditable="true" spellcheck="false"><div>' + itemFeesTemp.t3.putPersonNum + '</div></td>'
		        + '<td><div>' + (feesTemp.t3.putPrice / 100) + '</div></td>'
		        + '<td id="t3_7" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t3.putPrice / 100) + '</div></td>'
		      + '</tr>'
		      + '<tr id="t4">'
		        + '<td>机场内接机 包团</td>'
		        + '<td><div>' + (feesTemp.t4.basStepPrice / 100) + '</div></td>'
		        + '<td id="t4_1" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t4.basStepPrice / 100) + '</div></td>'
		        + '<td><div>' + (feesTemp.t4.basMaxPrice / 100) + '</div></td>'
		        + '<td id="t4_2" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t4.basMaxPrice / 100) + '</div></td>'
		        + '<td><div>' + feesTemp.t4.addStartTime + '</div></td>'
		        + '<td><div>' + feesTemp.t4.addEndTime + '</div></td>'
		        + '<td><div>' + (feesTemp.t4.addPrice / 100) + '</div></td>'
		        + '<td id="t4_5" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t4.addPrice / 100) + '</div></td>'
		        + '<td><div>' + feesTemp.t4.putPersonNum + '</div></td>'
		        + '<td id="t4_6" class="warning numb" contenteditable="true" spellcheck="false"><div>' + itemFeesTemp.t4.putPersonNum + '</div></td>'
		        + '<td><div>' + (feesTemp.t4.putPrice / 100) + '</div></td>'
		        + '<td id="t4_7" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t4.putPrice / 100) + '</div></td>'
		      + '</tr>'
		      + '<tr id="t5">'
		        + '<td>机场外送机 散拼</td>'
		        + '<td><div>' + (feesTemp.t5.basStepPrice / 100) + '</div></td>'
		        + '<td id="t5_1" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t5.basStepPrice / 100) + '</div></td>'
		        + '<td><div>' + (feesTemp.t5.basMaxPrice / 100) + '</div></td>'
		        + '<td id="t5_2" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t5.basMaxPrice / 100) + '</div></td>'
		        + '<td><div>' + feesTemp.t5.addStartTime + '</div></td>'
		        + '<td><div>' + feesTemp.t5.addEndTime + '</div></td>'
		        + '<td><div>' + (feesTemp.t5.addPrice / 100) + '</div></td>'
		        + '<td id="t5_5" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t5.addPrice / 100) + '</div></td>'
		        + '<td><div>' + feesTemp.t5.putPersonNum + '</div></td>'
		        + '<td id="t5_6" class="warning numb" contenteditable="true" spellcheck="false"><div>' + itemFeesTemp.t5.putPersonNum + '</div></td>'
		        + '<td><div>' + (feesTemp.t5.putPrice / 100) + '</div></td>'
		        + '<td id="t5_7" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t5.putPrice / 100) + '</div></td>'
		      + '</tr>'
		      + '<tr id="t6">'
		        + '<td>机场外送机 包团</td>'
		        + '<td><div>' + (feesTemp.t6.basStepPrice / 100) + '</div></td>'
		        + '<td id="t6_1" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t6.basStepPrice / 100) + '</div></td>'
		        + '<td><div>' + (feesTemp.t6.basMaxPrice / 100) + '</div></td>'
		        + '<td id="t6_2" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t6.basMaxPrice / 100) + '</div></td>'
		        + '<td><div>' + feesTemp.t6.addStartTime + '</div></td>'
		        + '<td><div>' + feesTemp.t6.addEndTime + '</div></td>'
		        + '<td><div>' + (feesTemp.t6.addPrice / 100) + '</div></td>'
		        + '<td id="t6_5" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t6.addPrice / 100) + '</div></td>'
		        + '<td><div>' + feesTemp.t6.putPersonNum + '</div></td>'
		        + '<td id="t6_6" class="warning numb" contenteditable="true" spellcheck="false"><div>' + itemFeesTemp.t6.putPersonNum + '</div></td>'
		        + '<td><div>' + (feesTemp.t6.putPrice / 100) + '</div></td>'
		        + '<td id="t6_7" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t6.putPrice / 100) + '</div></td>'
		      + '</tr>'
		      + '<tr id="t7">'
		        + '<td>机场外接机 散拼</td>'
		        + '<td><div>' + (feesTemp.t7.basStepPrice / 100) + '</div></td>'
		        + '<td id="t7_1" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t7.basStepPrice / 100) + '</div></td>'
		        + '<td><div>' + (feesTemp.t7.basMaxPrice / 100) + '</div></td>'
		        + '<td id="t7_2" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t7.basMaxPrice / 100) + '</div></td>'
		        + '<td><div>' + feesTemp.t7.addStartTime + '</div></td>'
		        + '<td><div>' + feesTemp.t7.addEndTime + '</div></td>'
		        + '<td><div>' + (feesTemp.t7.addPrice / 100) + '</div></td>'
		        + '<td id="t7_5" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t7.addPrice / 100) + '</div></td>'
		        + '<td><div>' + feesTemp.t7.putPersonNum + '</div></td>'
		        + '<td id="t7_6" class="warning numb" contenteditable="true" spellcheck="false"><div>' + itemFeesTemp.t7.putPersonNum + '</div></td>'
		        + '<td><div>' + (feesTemp.t7.putPrice / 100) + '</div></td>'
		        + '<td id="t7_7" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t7.putPrice / 100) + '</div></td>'
		      + '</tr>'
		      + '<tr id="t8">'
		        + '<td>机场外接机 包团</td>'
		        + '<td><div>' + (feesTemp.t8.basStepPrice / 100) + '</div></td>'
		        + '<td id="t8_1" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t8.basStepPrice / 100) + '</div></td>'
		        + '<td><div>' + (feesTemp.t8.basMaxPrice / 100) + '</div></td>'
		        + '<td id="t8_2" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t8.basMaxPrice / 100) + '</div></td>'
		        + '<td><div>' + feesTemp.t8.addStartTime + '</div></td>'
		        + '<td><div>' + feesTemp.t8.addEndTime + '</div></td>'
		        + '<td><div>' + (feesTemp.t8.addPrice / 100) + '</div></td>'
		        + '<td id="t8_5" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t8.addPrice / 100) + '</div></td>'
		        + '<td><div>' + feesTemp.t8.putPersonNum + '</div></td>'
		        + '<td id="t8_6" class="warning numb" contenteditable="true" spellcheck="false"><div>' + itemFeesTemp.t8.putPersonNum + '</div></td>'
		        + '<td><div>' + (feesTemp.t8.putPrice / 100) + '</div></td>'
		        + '<td id="t8_7" class="warning numbF" contenteditable="true" spellcheck="false"><div>' + (itemFeesTemp.t8.putPrice / 100) + '</div></td>'
		      + '</tr>'
		    + '</tboby>'
		  + '</table>',
		  callbackFunction : function(modalJqueryMap){
		    var i;

		    modalJqueryMap.$submitBtn
		    .text( '正在修改调整模板...' )
		    .attr( 'disabled', true );
		    modalJqueryMap.$cancelBtn.attr( 'disabled', true );

		    for ( i = 1; i < 9; i++){
		      itemFeesTemp['t' + i].basStepPrice = Number($('#t' + i + '_1').children(':first').text() * 100 );
		      itemFeesTemp['t' + i].basMaxPrice = Number($('#t' + i + '_2').children(':first').text() * 100 );
		      itemFeesTemp['t' + i].addPrice = Number($('#t' + i + '_5').children(':first').text() * 100 );
		      itemFeesTemp['t' + i].putPersonNum = Number($('#t' + i + '_6').children(':first').text());
		      itemFeesTemp['t' + i].putPrice = Number($('#t' + i + '_7').children(':first').text() * 100 );
		    }
		    
		    zx.model.feestemp.updateItemFeesTemp(itemFeesTemp);
		  },
		  callbackFunction2 : function(modalJqueryMap){
		    var i, len, $tr,
		    	name = $('#feestempName').val().trim(),
		    	$trs = $('.zx-list-tbody').find('tr');

	    	if(name === ''){
	    		alert('模板名称不能为空！');
		    	return;
	    	}

		    if(name === '基础'){
		    	alert('模板名称不能重复！');
		    	return;
		    }

		    for(i = 0, len = $trs.length;i < len ;i++){
		    	$tr = $trs.eq(i);
		    	if($tr.find('td.fesstempName').text() === name){
		    		alert('模板名称不能重复！');
		    		return;
		    	}
		    }

		    modalJqueryMap.$submitBtn
		    .text( '正在新增模板...' )
		    .attr( 'disabled', true );
		    modalJqueryMap.$cancelBtn.attr( 'disabled', true );

		    for ( i = 1; i < 9; i++){
		      itemFeesTempCopy['t' + i].basStepPrice = Number($('#t' + i + '_1').children(':first').text() * 100 );
		      itemFeesTempCopy['t' + i].basMaxPrice = Number($('#t' + i + '_2').children(':first').text() * 100 );
		      itemFeesTempCopy['t' + i].addPrice = Number($('#t' + i + '_5').children(':first').text() * 100 );
		      itemFeesTempCopy['t' + i].putPersonNum = Number($('#t' + i + '_6').children(':first').text());
		      itemFeesTempCopy['t' + i].putPrice = Number($('#t' + i + '_7').children(':first').text() * 100 );
		    }

		    itemFeesTempCopy.name = name;
		    zx.model.feestemp.newItemFeesTemp(itemFeesTempCopy);
		  }
		});
  };
  // End Event handler /on_updateItemFeesTempBtn_click/
   
  // Begin Event handler /on_feesTempBtn_click/ 
  on_feesTempBtn_click = function(){
    var $that = $(this),
        feesTemp = $that.data('feestemp');
    
    zx.modal.initModule({
      size      : 'modal-lg',
      $title    : $('<h4 class="modal-title">修改服务费基础模板</h4>'),
      formClass : 'form-updateFeesTemp',
      main_html : String()
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
            + '<tr id="t1">'
              + '<td>机场内送机 散拼</td>'
              + '<td id="t1_1" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t1.basStepPrice / 100) + '</div></td>'
              + '<td id="t1_2" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t1.basMaxPrice / 100) + '</div></td>'
              + '<td id="t1_3" class="warning"><div style="position: relative;"><input type="text" class="flightTime" value="' + feesTemp.t1.addStartTime + '"></input></div></td>'
              + '<td id="t1_4" class="warning"><div style="position: relative;"><input type="text" class="flightTime" value="' + feesTemp.t1.addEndTime + '"></input></div></td>'
              + '<td id="t1_5" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t1.addPrice / 100) + '</div></td>'
              + '<td id="t1_6" class="warning numbzz" contenteditable="true" spellcheck="false"><div>' + feesTemp.t1.putPersonNum + '</div></td>'
              + '<td id="t1_7" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t1.putPrice / 100) + '</div></td>'
            + '</tr>'
            + '<tr id="t2">'
              + '<td>机场内送机 包团</td>'
              + '<td id="t2_1" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t2.basStepPrice / 100) + '</div></td>'
              + '<td id="t2_2" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t2.basMaxPrice / 100) + '</div></td>'
              + '<td id="t2_3" class="warning"><div style="position: relative;"><input type="text" class="flightTime" value="' + feesTemp.t2.addStartTime + '"></input></div></td>'
              + '<td id="t2_4" class="warning"><div style="position: relative;"><input type="text" class="flightTime" value="' + feesTemp.t2.addEndTime + '"></input></div></td>'
              + '<td id="t2_5" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t2.addPrice / 100) + '</div></td>'
              + '<td id="t2_6" class="warning numbzz" contenteditable="true" spellcheck="false"><div>' + feesTemp.t2.putPersonNum + '</div></td>'
              + '<td id="t2_7" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t2.putPrice / 100) + '</div></td>'
            + '</tr>'
            + '<tr id="t3">'
              + '<td>机场内接机 散拼</td>'
              + '<td id="t3_1" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t3.basStepPrice / 100) + '</div></td>'
              + '<td id="t3_2" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t3.basMaxPrice / 100) + '</div></td>'
              + '<td id="t3_3" class="warning"><div style="position: relative;"><input type="text" class="flightTime" value="' + feesTemp.t3.addStartTime + '"></input></div></td>'
              + '<td id="t3_4" class="warning"><div style="position: relative;"><input type="text" class="flightTime" value="' + feesTemp.t3.addEndTime + '"></input></div></td>'
              + '<td id="t3_5" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t3.addPrice / 100) + '</div></td>'
              + '<td id="t3_6" class="warning numbzz" contenteditable="true" spellcheck="false"><div>' + feesTemp.t3.putPersonNum + '</div></td>'
              + '<td id="t3_7" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t3.putPrice / 100) + '</div></td>'
            + '</tr>'
            + '<tr id="t4">'
              + '<td>机场内接机 包团</td>'
              + '<td id="t4_1" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t4.basStepPrice / 100) + '</div></td>'
              + '<td id="t4_2" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t4.basMaxPrice / 100) + '</div></td>'
              + '<td id="t4_3" class="warning"><div style="position: relative;"><input type="text" class="flightTime" value="' + feesTemp.t4.addStartTime + '"></input></div></td>'
              + '<td id="t4_4" class="warning"><div style="position: relative;"><input type="text" class="flightTime" value="' + feesTemp.t4.addEndTime + '"></input></div></td>'
              + '<td id="t4_5" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t4.addPrice / 100) + '</div></td>'
              + '<td id="t4_6" class="warning numbzz" contenteditable="true" spellcheck="false"><div>' + feesTemp.t4.putPersonNum + '</div></td>'
              + '<td id="t4_7" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t4.putPrice / 100) + '</div></td>'
            + '</tr>'
            + '<tr id="t5">'
              + '<td>机场外送机 散拼</td>'
              + '<td id="t5_1" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t5.basStepPrice / 100) + '</div></td>'
              + '<td id="t5_2" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t5.basMaxPrice / 100) + '</div></td>'
              + '<td id="t5_3" class="warning"><div style="position: relative;"><input type="text" class="flightTime" value="' + feesTemp.t5.addStartTime + '"></input></div></td>'
              + '<td id="t5_4" class="warning"><div style="position: relative;"><input type="text" class="flightTime" value="' + feesTemp.t5.addEndTime + '"></input></div></td>'
              + '<td id="t5_5" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t5.addPrice / 100) + '</div></td>'
              + '<td id="t5_6" class="warning numbzz" contenteditable="true" spellcheck="false"><div>' + feesTemp.t5.putPersonNum + '</div></td>'
              + '<td id="t5_7" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t5.putPrice / 100) + '</div></td>'
            + '</tr>'
            + '<tr id="t6">'
              + '<td>机场外送机 包团</td>'
              + '<td id="t6_1" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t6.basStepPrice / 100) + '</div></td>'
              + '<td id="t6_2" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t6.basMaxPrice / 100) + '</div></td>'
              + '<td id="t6_3" class="warning"><div style="position: relative;"><input type="text" class="flightTime" value="' + feesTemp.t6.addStartTime + '"></input></div></td>'
              + '<td id="t6_4" class="warning"><div style="position: relative;"><input type="text" class="flightTime" value="' + feesTemp.t6.addEndTime + '"></input></div></td>'
              + '<td id="t6_5" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t6.addPrice / 100) + '</div></td>'
              + '<td id="t6_6" class="warning numbzz" contenteditable="true" spellcheck="false"><div>' + feesTemp.t6.putPersonNum + '</div></td>'
              + '<td id="t6_7" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t6.putPrice / 100) + '</div></td>'
            + '</tr>'
            + '<tr id="t7">'
              + '<td>机场外接机 散拼</td>'
              + '<td id="t7_1" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t7.basStepPrice / 100) + '</div></td>'
              + '<td id="t7_2" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t7.basMaxPrice / 100) + '</div></td>'
              + '<td id="t7_3" class="warning"><div style="position: relative;"><input type="text" class="flightTime" value="' + feesTemp.t7.addStartTime + '"></input></div></td>'
              + '<td id="t7_4" class="warning"><div style="position: relative;"><input type="text" class="flightTime" value="' + feesTemp.t7.addEndTime + '"></input></div></td>'
              + '<td id="t7_5" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t7.addPrice / 100) + '</div></td>'
              + '<td id="t7_6" class="warning numbzz" contenteditable="true" spellcheck="false"><div>' + feesTemp.t7.putPersonNum + '</div></td>'
              + '<td id="t7_7" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t7.putPrice / 100) + '</div></td>'
            + '</tr>'
            + '<tr id="t8">'
              + '<td>机场外接机 包团</td>'
              + '<td id="t8_1" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t8.basStepPrice / 100) + '</div></td>'
              + '<td id="t8_2" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t8.basMaxPrice / 100) + '</div></td>'
              + '<td id="t8_3" class="warning"><div style="position: relative;"><input type="text" class="flightTime" value="' + feesTemp.t8.addStartTime + '"></input></div></td>'
              + '<td id="t8_4" class="warning"><div style="position: relative;"><input type="text" class="flightTime" value="' + feesTemp.t8.addEndTime + '"></input></div></td>'
              + '<td id="t8_5" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t8.addPrice / 100) + '</div></td>'
              + '<td id="t8_6" class="warning numbzz" contenteditable="true" spellcheck="false"><div>' + feesTemp.t8.putPersonNum + '</div></td>'
              + '<td id="t8_7" class="warning numbZ" contenteditable="true" spellcheck="false"><div>' + (feesTemp.t8.putPrice / 100) + '</div></td>'
            + '</tr>'
          + '</tboby>'
        + '</table>',
        callbackFunction : function(modalJqueryMap){
          var i;

          modalJqueryMap.$submitBtn
          .text( '正在修改服务费模板...' )
          .attr( 'disabled', true );
          modalJqueryMap.$cancelBtn.attr( 'disabled', true );

          for ( i = 1; i < 9; i++){
            feesTemp['t' + i].basStepPrice = Number($('#t' + i + '_1').children(':first').text() * 100 );
            feesTemp['t' + i].basMaxPrice = Number($('#t' + i + '_2').children(':first').text() * 100 );
            feesTemp['t' + i].addStartTime = $('#t' + i + '_3').find('input').val();
            feesTemp['t' + i].addEndTime = $('#t' + i + '_4').find('input').val();
            feesTemp['t' + i].addPrice = Number($('#t' + i + '_5').children(':first').text() * 100 );
            feesTemp['t' + i].putPersonNum = Number($('#t' + i + '_6').children(':first').text());
            feesTemp['t' + i].putPrice = Number($('#t' + i + '_7').children(':first').text() * 100 );
          }
          
          zx.model.feestemp.updateFeesTemp(feesTemp);
        }
    });
  };
  // End Event handler /on_feesTempBtn_click/

  // 正数, 小数保留两位
  on_numbZ_blur = function(){
    var $money = $(this),
        m = $.trim($money.text()),
        re = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/,
        mInt = 0;

    if (m !== "" && !re.test(m)){
      alert("请输入正整数或小数，小数最多保留两位。");
      $money.text(0);
    }
  };
  // 正数或者负数, 小数保留两位
  on_numbF_blur = function(){
    var $money = $(this),
        m = $.trim($money.text()),
        re = /^(-?[1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/,
        mInt = 0;

    if (m !== "" && !re.test(m)){
      alert("请输入整数或小数，小数最多保留两位。");
      $money.text(0);
    }
  };
  // 正整数或者负整数
  on_numb_blur = function(){
    var $num = $(this),
        m = $.trim($num.text()),
        re = /^[-]?[1-9]{1}[0-9]*$/,
        mInt = 0;

    if (m !== "" && !re.test(m)){
      alert("请输入整数");
      $num.text(0);
    }
  };
  // 正整数
  on_numbzz_blur = function(){
    var $num = $(this),
        m = $.trim($num.text()),
        re = /^[0-9]*$/,
        mInt = 0;

    if (m !== "" && !re.test(m)){
      alert("请输入非负整数");
      $num.text(0);
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

    $.gevent.subscribe( jqueryMap.$list, 'zx-completeGetlist', onCompleteGetlist );
    // getlist
    zx.model.list.getlist(argObj);

    $(document).on( 'blur', 'td.numbZ', on_numbZ_blur );   // 正数, 小数保留两位，用来表示金额
    $(document).on( 'blur', 'td.numbF', on_numbF_blur );   // 正数或负数, 小数保留两位，用来表示金额
    $(document).on( 'blur', 'td.numb', on_numb_blur );     // 正整数或负整数
    $(document).on( 'blur', 'td.numbzz', on_numbzz_blur ); // 正整数

    $(document).on( 'blur', 'td.timestr', on_numbzz_blur ); // 正整数

    jqueryMap.$list.on( 'click', 'button.updateItemFeesTempBtn', on_updateItemFeesTempBtn_click );
    //jqueryMap.$list.on('click','button.updateCompanyBtn', onUpdateCompanyBtnClick );
    
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
      jqueryMap.$list.off('click');
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