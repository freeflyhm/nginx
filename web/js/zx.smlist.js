/* isShowFooter onChangeServerMan 深圳
 * zx.smlist.js
 * smlist feature module for zx
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, zx, moment */

zx.smlist = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  // 声明所有 zx.smlist 内可用的变量
  var
    // 静态配置值
    configMap = {
      main_html : String()
        + '<div class="zx-list">'
          + '<div class="row">'
            +'<div class="col-sm-2">'
              + '<h3>服务单列表</h3>'
            + '</div>'
            +'<div class="col-sm-3">'
              + '<div class="zx-list-top-btn input-group input-group-sm pull-left">'
                + '<span class="input-group-btn">'
                  + '<button id="preSmDate" class="btn btn-sm btn-default">'
                    + '服务日期'
                    + '<span class="glyphicon glyphicon-chevron-left"></span>'
                  + '</button>'
                + '</span>'
                + '<div style="position:relative;">'
                  + '<input id="smDateInput" class="inputDate form-control input-sm text-left" type="text"></input>'
                + '</div>'
                + '<span class="input-group-btn">'
                  + '<button id="nextSmDate" class="btn btn-sm btn-default">'
                    + '<span class="glyphicon glyphicon-chevron-right"></span>'
                  + '</button>'
                + '</span>'
              + '</div>'
              + '<div style="clear:both;"></div>'
            + '</div>'
            + '<div class="col-sm-3">'
              + '<div id="endDateDiv" class="zx-list-top-btn input-group input-group-sm pull-left">'
                + '<span class="input-group-addon" id="basic-addon1">截止日期</span>'
                + '<div style="position:relative;">'
                  + '<input id="endDateInput" class="inputDate form-control input-sm text-left" type="text"></input>'
                + '</div>'
                + '<span class="input-group-btn">'
                  + '<button id="endDateBtn" class="btn btn-sm btn-default">'
                    + '<span class="glyphicon glyphicon-search"></span>'
                  + '</button>'
                + '</span>'
              + '</div>'
              + '<div style="clear:both;"></div>'
            + '</div>'
            + '<div class="col-sm-3">'
              + '<select id="companySelect" class="form-control input-sm hidden" style="margin-top: 10px;">'
                + '<option value=""></option>'
              + '</select>'
            + '</div>'
            +'<div class="col-sm-1 text-right">'
              + '<button type="button" id="importSmsBtn" class="zx-list-top-btn btn btn-sm btn-primary hidden">导出列表</button>'
            + '</div>'
          + '</div>'
          + '<table class="table table-striped table-hover table-responsive">'
            + '<thead>'
              + '<tr>'
                + '<th class="smlist-th" style="min-width:40px;">序号</th>'
                + '<th class="smlist-th" style="min-width:170px;">服务单号</th>'
                + '<th class="smlist-th" style="min-width:80px;">服务日期</th>'
                + '<th class="smlist-th" style="min-width:170px;">服务航班</th>'
                + '<th class="smlist-th" style="min-width:60px;">集合时间</th>'
                + '<th class="smlist-th" style="min-width:40px;">代收</th>'
                + '<th class="smlist-th" style="min-width:40px;">代付</th>'
                + '<th class="smlist-th" style="min-width:40px;">服务</th>'
                + '<th class="smlist-th" style="min-width:40px;">交通</th>'
                + '<th class="smlist-th" style="min-width:40px;">状态</th>'
                + '<th class="smlist-th" style="min-width:40px;">短信</th>'
                + '<th class="smlist-th" style="min-width:40px;">导出</th>'
                + '<th class="smlist-th serverMan hidden" style="min-width:40px;">现场</th>'
                + '<th class="smlist-th insurance hidden" style="min-width:40px;">保险</th>'
                + '<th class="smlist-th" style="min-width:100px;">服务满意度</th>'
              + '</tr>'
            + '</thead>'
            + '<tbody class="zx-list-tbody">'
            + '</tbody>'
            + '<tfoot id="tfoot" class="hidden">'
              + '<tr>'
                + '<td colspan="5"></td>'
                + '<td><strong id="smAgencyFund_sum"></strong></td>'
                + '<td><strong id="smPayment_sum"></strong></td>'
                + '<td><strong id="fee_sum"></strong></td>'
                + '<td><strong id="carfee_sum"></strong></td>'
                + '<td colspan="4"></td>'
                + '<td><strong id="insurance_sum"></strong></td>'
                + '<td></td>'
              + '</tr>'
            + '</tfoot>'
          + '</table>'
          + '<nav>'
            + '<ul id="zx_sm_list_page_ul" class="pagination pagination-sm"></ul>'
          + '</nav>'
        + '</div>',
      settable_map : {
        people_model    : true,
        sm_model        : true,
        list_model      : true
      },
      people_model    : null,
      sm_model        : null,
      list_model      : null
    },
    // 动态状态信息
    stateMap  = { 
      $container : null,
      result: null,
      serverManHtml_lis: ''
    },
    jqueryMap = {},
    // UTILITY METHODS
    check_insurance, check_carFees, check_fees, change_stateMap_result,
    // DOM method
    setJqueryMap, renderTable,
    // EVENT HANDLERS
    onCompleteGetlist, onChangeStatus, onChangePhoneMsgStatus, onChangeServerMan, 
    onChangeAddFees, onChangeCarFees, onChangeInsurance, onChangeSatisfaction,
    onComplete_downloadSm,
    // PUBLIC METHODS
    configModule, initModule, removeThis;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //------------------- BEGIN UTILITY METHODS ------------------
  check_insurance = function(m){
    var re = /^[0-9]*$/;

    if (m !== "" && !re.test(m)){
      return false;
    }

    return true;
  };

  check_carFees = function(m){
    var re = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;

    if (m !== "" && !re.test(m)){
      return false;
    }

    return true;
  };

  check_fees = function(m){
    var re = /^\-?([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;

    if (m !== "" && !re.test(m)){
      return false;
    }

    return true;
  };

  change_stateMap_result = function( obj ) {
    var i , len, item;

    for(i = 0, len = stateMap.result.length; i < len; i++) {
      item = stateMap.result[i];
      if(item._id === obj._id){
        
        if(obj.field === 'addFees'){
          item[obj.field2] = obj[obj.field2];
        }

        item[obj.field] = obj[obj.field];
        return;
      }
    }
  }
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

  renderTable = function (result, serverManHtml_lis, company) {
    var serverManHtml     = '',
        insuranceHtml     = '',
        //serverManHtml_lis = '',
        insurance_sum     = 0,
        fee_sum           = 0,
        i, len_i, item, $tr,
        spanHtml, smDate, smType, smTime, smNum, text_style, smFlightNum,
        smStatusHtml, smStatusHtml_sv, isDownloadHtml,
        phoneMsgStatusHtml, phoneMsgStatusHtml_sv,
        $glyphicon_star, glyphicon_star_html,
        fees_title,
        smAgencyFund_text, smPayment_text;

    for(i = 0, len_i = result.length; i < len_i; i++) {
      item = result[i];

      if(company !== '' && company !== item.company){
        //console.log(company);
        //console.log(item.company);
        //console.log(company === item.company);
        continue;
      }
      //console.log(item);
      // 服务单号
      if(item.isOpen){
        spanHtml = String()
          + '<span class="label label-success" style="margin-right:5px;">合作</span>';
      } else {
        spanHtml = String()
          + '<span class="label label-primary" style="margin-right:5px;">独立</span>';
      }
      smDate  = moment(item.flight.flightDate).format('MMDD');
      smType = item.smType1 === 1 ? "送" : "接";
      text_style = item.smType1 === 1 ? "text-primary" : "text-danger";
      smTime  =
        item.smType1 === 1
        ? smTime = moment(item.flight.flightStartTime).format('HHmm')
        : smTime = moment(item.flight.flightEndTime).format('HHmm');
      //smNum = smDate + smTime + item.flight.flightNum + item.companyAbbr + item.smRealNumber +"人" + (item.smType2===1?"内":"外") + smType;
      smNum = smDate + smTime + item.flight.flightNum + (item.operator).substr(0,item.operator.length - 11) + item.smRealNumber +"人" + (item.smType2===1?'内':'<span class="label label-danger">外</span>&nbsp;') + smType;

      // 服务航班
      smFlightNum = item.flight.flightNum + " " + item.flight.flightStartCity + "-" + item.flight.flightEndCity + " " + moment(item.flight.flightStartTime).format('HH:mm') + "-" + moment(item.flight.flightEndTime).format('HH:mm');
      // 状态
      //console.log(stateMap.category);
      if(Number(stateMap.category) === 20){
        // 地接社
        switch(item.phoneMsgStatus){
          case 0: // 待发送
            phoneMsgStatusHtml = String()
              + '<span class="label label-warning">待发</span>';
            break;
          case 1: // 已发送
            phoneMsgStatusHtml = String()
              + '<span class="label label-success">已发</span>';
            break;
          case 2: // 不用发
            phoneMsgStatusHtml = String()
              + '<span class="label label-info">不发</span>';
            break;
        }   
         
        switch (item.smStatus ){
          case 1:
            smStatusHtml = String()
              + '<span class="label label-warning">待审</span>';
            break;
          case 2:
            smStatusHtml = String()
              + '<span class="label label-primary">确认</span>';
            break;
          case 3:
            smStatusHtml = String()
              + '<span class="label label-info">完成</span>';
            break;
          case 4:
            smStatusHtml = String()
              + '<span class="label label-success">结清</span>';
            break;
        }

      } else if (Number(stateMap.category) === 30){
        // 服务商
        switch(item.phoneMsgStatus){
          case 0: // 待发送
            phoneMsgStatusHtml_sv = String()
              + '<button class="phoneMsgStatusBtn btn btn-xs btn-warning dropdown-toggle" data-toggle="dropdown" aria-expanded="false">待发&nbsp;<span class="caret"></span></button>';
            break;
          case 1: // 已发送
            phoneMsgStatusHtml_sv = String()
              + '<button class="phoneMsgStatusBtn btn btn-xs btn-success dropdown-toggle" data-toggle="dropdown" aria-expanded="false">已发&nbsp;<span class="caret"></span></button>';
            break;
          case 2: // 不用发
            phoneMsgStatusHtml_sv = String()
              + '<button class="phoneMsgStatusBtn btn btn-xs btn-info dropdown-toggle" data-toggle="dropdown" aria-expanded="false">不发&nbsp;<span class="caret"></span></button>';
            break;
        } 

        switch (item.smStatus ) {
          case 1:
            smStatusHtml_sv = String()
              + '<button class="smStatusBtn btn btn-xs btn-warning dropdown-toggle" data-toggle="dropdown" aria-expanded="false">待审&nbsp;<span class="caret"></span></button>';
            break;
          case 2:
            smStatusHtml_sv = String()
              + '<button class="smStatusBtn btn btn-xs btn-primary dropdown-toggle" data-toggle="dropdown" aria-expanded="false">确认&nbsp;<span class="caret"></span></button>';
            break;
          case 3:
            smStatusHtml_sv = String()
              + '<button class="smStatusBtn btn btn-xs btn-info dropdown-toggle" data-toggle="dropdown" aria-expanded="false">完成&nbsp;<span class="caret"></span></button>';
            break;
          case 4:
            smStatusHtml_sv = String()
              + '<button class="smStatusBtn btn btn-xs btn-success dropdown-toggle" data-toggle="dropdown" aria-expanded="false">结清&nbsp;<span class="caret"></span></button>';
            break;
        }

        phoneMsgStatusHtml = String()
          + '<div class="btn-group">'
            + phoneMsgStatusHtml_sv
            + '<ul class="dropdown-menu" role="menu" style="min-width:0" data-id="' + item._id + '">'
              + '<li class="phoneMsgStatusLi" data-phonemsgstatus=0><a href="javascript:;">待发</a></li>'
              + '<li class="phoneMsgStatusLi" data-phonemsgstatus=1><a href="javascript:;">已发</a></li>'
              + '<li class="phoneMsgStatusLi" data-phonemsgstatus=2><a href="javascript:;">不发</a></li>'
            + '</ul>'
          + '</div>';

        smStatusHtml = String()
          + '<div class="btn-group">'
            + smStatusHtml_sv
            + '<ul class="dropdown-menu" role="menu" style="min-width:0" data-id="' + item._id + '">'
              + '<li class="smStatusLi" data-smstatus=1><a href="javascript:;">待审</a></li>'
              + '<li class="smStatusLi" data-smstatus=2><a href="javascript:;">确认</a></li>'
              + '<li class="smStatusLi" data-smstatus=3><a href="javascript:;">完成</a></li>'
              + '<li class="smStatusLi" data-smstatus=4><a href="javascript:;">结清</a></li>'
            + '</ul>'
          + '</div>';

        if(!item.serverMan){
          item.serverMan = '';
        }

        serverManHtml = String()
          + item.serverMan;
          /*+ '<div class="btn-group">'
            + '<button class="serverManBtn btn btn-xs btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">' + item.serverMan + '&nbsp;<span class="caret"></span></button>'
            + '<ul class="dropdown-menu" role="menu" style="min-width:0" data-id="' + item._id + '">'
              + serverManHtml_lis
            + '</ul>'
          + '</div>';*/

        insuranceHtml = item.insurance;

        insurance_sum += item.insurance;
      }

      // 服务满意度
      glyphicon_star_html = String()
        + '<span class="glyphicon glyphicon-star glyphicon-star-low" aria-hidden="true" title="那谁~你过来，我保证不打死你！"></span>'
        + '<span class="glyphicon glyphicon-star glyphicon-star-low" aria-hidden="true" title="不怎么好，我可以不选他吗？"></span>'
        + '<span class="glyphicon glyphicon-star glyphicon-star-low" aria-hidden="true" title="一般般吧，没什么特别的。"></span>'
        + '<span class="glyphicon glyphicon-star glyphicon-star-low" aria-hidden="true" title="挺好的，我看好你哦！"></span>'
        + '<span class="glyphicon glyphicon-star glyphicon-star-low" aria-hidden="true" title="太棒了，我要给他32个赞！"></span>';
      $glyphicon_star = $('<td class="satisfaction" style="position: relative;"></td>').append(glyphicon_star_html);

      if(item.satisfaction > 0 && item.satisfaction < 6){
        if(item.satisfactionNote){
          $glyphicon_star.attr('title', item.satisfactionNote);
        }

        $glyphicon_star
          .find('span').eq(item.satisfaction-1)
            .removeClass('glyphicon-star-low').addClass('glyphicon-star-high')
            .prevAll()
              .removeClass('glyphicon-star-low').addClass('glyphicon-star-high');
      }

      // 导出
      if(Number(stateMap.category) === 20){
        if(item.isDownload){
          isDownloadHtml = String()
            + '<button style="padding: 0 5px;" class="btn btn-xs btn-default downloadSmBtn" type="button" data-isdownload="' + item.isDownload + '" data-id="' + item._id + '">已导</button>';
        } else {
          isDownloadHtml = String()
            + '<button style="padding: 0 5px;" class="btn btn-xs btn-primary downloadSmBtn" type="button" data-isdownload="' + item.isDownload + '" data-id="' + item._id + '">未导</button>';
        }
      } else if (Number(stateMap.category) === 30) {
        //console.log(item.isSVDownload);
        if(item.isSVDownload){
          isDownloadHtml = String()
            + '<button style="padding: 0 5px;" class="btn btn-xs btn-default downloadSmBtn" type="button" data-issvdownload="' + item.isSVDownload + '" data-id="' + item._id + '">已导</button>';
        } else {
          isDownloadHtml = String()
            + '<button style="padding: 0 5px;" class="btn btn-xs btn-primary downloadSmBtn" type="button" data-issvdownload="' + item.isSVDownload + '" data-id="' + item._id + '">未导</button>';
        }
      }

      $tr=$('<tr></tr>')
        .addClass('item-id-' + item._id)
        .data('id', item._id);

      smAgencyFund_text = (item.smAgencyFund / (-100)) + '/' + (item.smAgencyFund_y / (-100));
      smPayment_text    = (item.smPayment / 100) + '/' + (item.smPayment_y / 100);

      $tr
        .append($('<td></td>').text(i+1)) // 序号
        .append($('<td class="' + text_style + '"></td>').html('<a style="text-decoration:none;" href="#!page=sm&c=detail&n=' + item._id + '">' + spanHtml + smNum +'</a>')) // 服务单号
        .append($('<td></td>').text(moment(item.flight.flightDate).format('YYYY-MM-DD'))) // 服务日期
        .append($('<td></td>').text(smFlightNum))            // 服务航班
        .append($('<td></td>').text(moment(item.smSetTime).format('HH:mm')))         // 集合时间
        .append($('<td></td>').html(smAgencyFund_text === '0/0' ? '0/0' : '<span style="color: red; font-weight: 700;">' + smAgencyFund_text + '</span>')) // 代收已收 -
        .append($('<td></td>').html(smPayment_text === '0/0' ? '0/0' : '<span style="color: red; font-weight: 700;">' + smPayment_text + '</span>'))       // 代付已付
        .append($('<td class="fees warning" style="position:relative;"></td>')
          .data('fees',item.fees)
          .text((item.fees + item.addFees) / 100))
        .append($('<td class="carFees warning"></td>').text(item.carFees /100))
        .append($('<td style="padding:5px 0;"></td>').html(smStatusHtml))
        .append($('<td style="padding:5px 0;"></td>').html(phoneMsgStatusHtml))
        .append($('<td style="padding:5px 0;"></td>').html(isDownloadHtml))
        .append($('<td class="serverMan hidden" style="padding:5px 0;"></td>').html(serverManHtml))
        .append($('<td class="insurance warning hidden"></td>').text(insuranceHtml))
        .append($glyphicon_star);

      jqueryMap.$tbody.append($tr);

      if(item.addFees !== 0){
        if(item.addFees > 0){
          fees_title = item.fees/100 + '+' + item.addFees/100 + '\n' + item.addFeesNote;
        } else {
          fees_title = item.fees/100 + '' + item.addFees/100 + '\n' + item.addFeesNote;
        }

        $tr.find('td.fees')
          .attr('title', fees_title)
          .append('<span class="glyphicon glyphicon-pushpin" aria-hidden="true" style="position: absolute; top: -5px; color:red;"></span>');
      }

      fee_sum += item.fees + item.addFees;
    }
    
    if(Number(stateMap.category) === 30){
      // 服务商显示保险和现场
      $('.insurance').removeClass('hidden');
      $('.serverMan').removeClass('hidden');
    } else if (Number(stateMap.category) === 20){
      // 地接社可以编辑服务满意度，不能编辑交通
      $('span.glyphicon-star').addClass('glyphicon-star-change');
      $('.fees').removeClass('warning');
      $('.carFees').removeClass('warning');
    }

    $('#insurance_sum').text(insurance_sum);
    $('#fee_sum').text(fee_sum / 100);
  };

  // End DOM method /setJqueryMap/
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  onCompleteGetlist = function ( event, results ) {
    var result            = results[0].smSort,
        smSearchDate      = results[0].smDate,
        endDate           = results[0].endDate,
        cp                = results[0].cp,
        currentPage       = results[0].currentPage,
        totalPage         = results[0].totalPage,
        servermans        = results[0].servermans,
        smFlags           = results[0].smFlags,
        setPlaces         = results[0].setPlaces,
        //serverManHtml     = '',
        //insuranceHtml     = '',
        pageSplit         = 9,
        serverManHtml_lis = '',
        //fee_sum           = 0,
        //insurance_sum     = 0,
        ulStr, class_active, startPage, endPage,
        i, len_i, 
        //item, $tr, 
        //spanHtml, smDate, smType, smTime, smNum, text_style, smFlightNum, smStatusHtml, smStatusHtml_sv, isDownloadHtml,
        //phoneMsgStatusHtml, phoneMsgStatusHtml_sv, 
        //$glyphicon_star, glyphicon_star_html,
        k, len_k,
        //fees_title,
        //smAgencyFund_text, smPayment_text,
        companys;

    stateMap.result = result;
    //console.log(stateMap.result);
    // 初始化
    $('#smDateInput').val(smSearchDate);
    // 截至日期
    $('#endDateInput').val(endDate);

    $('#endDateInput').datetimepicker({
      format: 'YYYY-MM-DD',
      dayViewHeaderFormat: 'YYYY MMMM',
      useCurrent: false,
      locale: 'zh-cn',
      showTodayButton: true,
      showClear: true
    });
    $('#endDateBtn').on('click', function(e) {
      endDate = $('#endDateInput').val();

      if(endDate === '') {
        alert('请选择截止日期。');
        return;
      }

      if(!(moment(smSearchDate).isBefore(endDate))) {
        alert('截止日期必须大于服务日期！');
        return;
      }

      $.uriAnchor.setAnchor({ 
        'page'   : 'list', 
        'c'      : 'sm', 
        'smdate' : smSearchDate,
        'enddate': endDate,
        'cp'     : '',
        'n'      : '0' 
      }, null, true );

      e.preventDefault();
      e.stopPropagation();
    });

    if(smSearchDate !== '' && Number(stateMap.category) === 30) {
      // 截至日期
      //$('#endDateDiv').removeClass('hidden');

      // 填充下拉框
      companys = results[0].companys;
      for(i = 0, len_i = companys.length; i < len_i; i++) {
        $('#companySelect').append('<option value="' + companys[i]._id + '">' + companys[i].name + '</option>');
      }

      $('#companySelect').val(cp);

      $('#companySelect')
        .removeClass('hidden');

      $('#importSmsBtn')
        .data('results', {result: result, smFlags: smFlags, setPlaces: setPlaces, smSearchDate: smSearchDate})
        .removeClass('hidden');

      $('#tfoot').removeClass('hidden');

      $('#companySelect').change(function() {
        var company = $(this).val(),
            endDate = $('#endDateInput').val();

        if (endDate === '') {
          jqueryMap.$tbody.empty();
          renderTable(stateMap.result, stateMap.serverManHtml_lis, company);
        } else {
          $.uriAnchor.setAnchor({ 
            'page'   : 'list', 
            'c'      : 'sm', 
            'smdate' : smSearchDate,
            'enddate': endDate,
            'cp'     : company,
            'n'      : '0' 
          }, null, true );
        }
        
      });
      $('#importSmsBtn').click(function() {
        var results      = $(this).data('results'),
            result       = results.result,
            smFlags      = results.smFlags,
            setPlaces    = results.setPlaces,
            smFlagsObj   = {},
            setPlacesObj = {},
            sms          = [],
            setPlace,
            i, i_len, sn, item,
            flightEndCity,
            operator, smNote,
            loadFile, doc, out, setData;

        for(i = 0, i_len = smFlags.length; i < i_len; i++) {
          smFlagsObj[smFlags[i]._id] = smFlags[i].smFlag;
        }

        for(i = 0, i_len = setPlaces.length; i < i_len; i++) {
          setPlacesObj[setPlaces[i].airCode] = zx.config.getConfigMapItem('setplace_short')[setPlaces[i].place];
        }

        for(i = 0, i_len = result.length; i < i_len; i++) {
          sn = i + 1;
          item = result[i];

          operator = (item.operator).substr(0,item.operator.length - 11);

          if(item.smType1 === 1) {
            flightEndCity = item.flight.flightEndCity;
          } else {
            flightEndCity = '';
          }

          smNote = '';
          if(item.smAgencyFund !== 0) {
            smNote += '代收';

          }
          if(item.smPayment !== 0) {
            if(smNote === '') {
              smNote += '代付';
            } else {
              smNote += '/代付';
            }
          }
          if(item.smNote !== ''){       
            if(smNote === '') {
              smNote += item.smNote;
            } else {
              smNote += '/' + item.smNote;
            }
          }

          if(typeof setPlacesObj[item.flight.flightNum.substr(0, 2)] === 'undefined') {
            setPlace = '';
          } else {
            setPlace = setPlacesObj[item.flight.flightNum.substr(0, 2)];
          }

          sms.push({
            sn              : sn,
            flightNum       : item.flight.flightNum,                                      // 航班
            flightEndCity   : flightEndCity,                                              // 抵达地
            operator        : operator,                                                   // 客户/专线
            smFlag          : smFlagsObj[item.team].replace('导游旗','').replace('"',''), // 旗号
            smRealNumber    : item.smRealNumber,                                          // 人数
            smSetTime       : moment(item.smSetTime).format('HH:mm'),                     // 集合
            setPlace        : setPlace,                                                   // 门
            smNote          : smNote                                                      // 备注                                                                               
          });
        }

        setData = {smSearchDate: results.smSearchDate, sms: sms};
        //console.log(setData);
        // 导出文件
        loadFile=function(url, callback){
          JSZipUtils.getBinaryContent(url, callback);
        };

        loadFile('docxtemp/smsTable.docm',function(err,content){
          if (err) { throw e };

          doc = new Docxgen(content);
          doc.setData( setData ) //set the templateVariables

          doc.render(); //apply them (replace all occurences of {first_name} by Hipp, ...)
          out = doc.getZip().generate({type:"blob"}); //Output the document using Data-URI
          saveAs(out, setData.smSearchDate + '.docm');
        }); 
      });
    }
    
    jqueryMap.$tbody.html('');

    if(servermans) {
      for(k = 0, len_k = servermans.length; k < len_k; k++){
        serverManHtml_lis += '<li class="serverManLi"><a href="javascript:;">' + servermans[k].name + '</a></li>';
      }
    }
  
    stateMap.serverManHtml_lis = serverManHtml_lis;
    // 渲染表格
    renderTable(result, serverManHtml_lis, '');

    // 分页
    //console.log('currentPage : ' + currentPage + ', totalPage : ' + totalPage); 
    if(totalPage > 1){
      startPage = Math.floor((currentPage - 1 ) / (pageSplit - 1)) * (pageSplit - 1) + 1;
      endPage   = startPage + pageSplit - 1;
      endPage   = endPage < totalPage ? endPage : totalPage;

      ulStr = String();

      if(startPage > 1){
        ulStr += '<li><a href="#!page=list&c=sm&smdate=' + smSearchDate + '&enddate=' + endDate + '&cp=' + cp + '&n=0">1</a></li>';
        ulStr += '<li><span style="border:0; background-color: transparent; padding: 5px;">...</span></li>';
        ulStr += '<li><a href="#!page=list&c=sm&smdate=' + smSearchDate + '&enddate=' + endDate + '&cp=' + cp + '&n=' + (startPage - 2) + '">' + (startPage - 1) + '</a></li>';
      }

      for(i = startPage; i <= endPage; i++){
        class_active = currentPage === i ? 'active' : '';
        ulStr += '<li class="' + class_active + '"><a href="#!page=list&c=sm&smdate=' + smSearchDate + '&enddate=' + endDate + '&cp=' + cp + '&n=' + (i - 1) + '">' + i + '</a></li>';
      }

      if(endPage < totalPage){
        ulStr += '<li><span style="border:0; background-color: transparent; padding: 5px;">...</span></li>';
        ulStr +='<li><a href="#!page=list&c=sm&smdate=' + smSearchDate + '&enddate=' + endDate + '&cp=' + cp + '&n=' + (totalPage - 1) + '">' + totalPage + '</a></li>';
      }
    }

    //$('#zx_team_list_page_ul').append('<li><a href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>');
    
    $('#zx_sm_list_page_ul').append(ulStr);

    // 结束渲染
    // 开始注册事件
    // 
    // 日期控件
    $('#smDateInput').datetimepicker({
      format: 'YYYY-MM-DD',
      dayViewHeaderFormat: 'YYYY MMMM',
      useCurrent: false,
      locale: 'zh-cn',
      showTodayButton: true,
      showClear: true
    }).on("dp.change", function(e){
      smSearchDate = $(this).val();
      $.uriAnchor.setAnchor({ 
        'page'   : 'list', 
        'c'      : 'sm', 
        'smdate' : smSearchDate,
        'enddate': '',
        'cp'     : '',
        'n'      : '0' 
      }, null, true );
    });
    // 前一天后一天
    $('#preSmDate').click(function () {       
      if (smSearchDate === "") {
          smSearchDate = moment().subtract(1, 'day').format('YYYY-MM-DD');
      } else {
          smSearchDate = moment(smSearchDate).subtract(1, 'day').format('YYYY-MM-DD');
      }

      $.uriAnchor.setAnchor({ 
        'page'   : 'list', 
        'c'      : 'sm', 
        'smdate' : smSearchDate,
        'enddate': '',
        'cp'     : '',
        'n'      : '0' 
      }, null, true );
    });
    $('#nextSmDate').click(function () {
      if (smSearchDate === "") {
        smSearchDate = moment().add(1, 'day').format('YYYY-MM-DD');
      } else {
        smSearchDate = moment(smSearchDate).add(1, 'day').format('YYYY-MM-DD');
      }
      
      $.uriAnchor.setAnchor({ 
        'page'   : 'list', 
        'c'      : 'sm', 
        'smdate' : smSearchDate,
        'enddate': '',
        'cp'     : '',
        'n'      : '0' 
      }, null, true );
    });
  };
  
  // 状态
  onChangeStatus = function ( event, result ) {
    var $smStatusBtn, st, btn_text;
    //console.log(result);
    // 已检验
    if(result.success.ok === 1){

      switch (result.smStatus) {
        case 1:
          st = "btn-warning";
          btn_text = "待审";
          break;
        case 2:
          st = "btn-primary";
          btn_text = "确认";
          break;
        case 3:
          st = "btn-info";
          btn_text = "完成";
          break;
        case 4:
          st = "btn-success";
          btn_text = "结清";
          break;
      }

      $smStatusBtn = $('tr.item-id-' + result.sm_id).find('button.smStatusBtn');
      $smStatusBtn
        .removeClass("btn-warning btn-primary btn-info btn-success")
        .addClass(st)
        .html( btn_text + '&nbsp;<span class="caret"></span>')
        .prop("disabled", false);

      // 修改 stateMap.result
      change_stateMap_result({
        _id: result.sm_id,
        field: 'smStatus',
        smStatus: result.smStatus
      });

    } else {
      alert('老板，服务器压力山大，请再试一次！');
    }
  };

  // 短信状态
  onChangePhoneMsgStatus = function( event, result ){
    var $phoneMsgStatusBtn, st, btn_text;
    //console.log(result);
    // 已检验
    if(result.success.ok === 1){

      switch (result.phoneMsgStatus) {
        case 0:
          st = "btn-warning";
          btn_text = "待发";
          break;
        case 1:
          st = "btn-success";
          btn_text = "已发";
          break;
        case 2:
          st = "btn-info";
          btn_text = "不发";
          break;
      }

      $phoneMsgStatusBtn = $('tr.item-id-' + result.sm_id).find('button.phoneMsgStatusBtn');
      $phoneMsgStatusBtn
        .removeClass("btn-warning btn-info btn-success")
        .addClass(st)
        .html( btn_text + '&nbsp;<span class="caret"></span>')
        .prop("disabled", false);

      // 修改 stateMap.result
      change_stateMap_result({
        _id: result.sm_id,
        field: 'phoneMsgStatus',
        phoneMsgStatus: result.phoneMsgStatus
      });

    } else {
      alert('老板，服务器压力山大，请再试一次！');
    }
  };

  // 现场
  onChangeServerMan = function(event, result){
    var $serverManBtn, btn_text;

    //console.log(result);
    // 已检验
    if(result.success.ok === 1){

      btn_text = result.serverMan;

      $serverManBtn = $('tr.item-id-' + result.sm_id).find('button.serverManBtn');
      $serverManBtn
        .html( btn_text + '&nbsp;<span class="caret"></span>')
        .prop("disabled", false);

      // 修改 stateMap.result
      change_stateMap_result({
        _id: result.sm_id,
        field: 'serverMan',
        serverMan: result.serverMan
      });

    } else {
      alert('老板，服务器压力山大，请再试一次！');
    }
  };

  // 调价
  onChangeAddFees = function(event, result){
    var $td, fees, addFees, addFeesNote, fees_title;
    //console.log(result);
    // 已检验
    if(result.success.ok === 1){
      fees        = result.fees;
      addFees     = result.addFees;
      addFeesNote = result.addFeesNote;

      if(addFees !== 0){
        if(addFees > 0){
          fees_title = fees/100 + '+' + addFees/100 + '\n' + addFeesNote;
        } else {
          fees_title = fees/100 + '' + addFees/100 + '\n' + addFeesNote;
        }
      }

      $td = $('tr.item-id-' + result.sm_id).find('td.fees');

      $td
        .attr('title', fees_title)
        .text((fees + addFees) / 100);

      if($td.find('span.glyphicon-pushpin').length === 0){
        $td.append('<span class="glyphicon glyphicon-pushpin" aria-hidden="true" style="position: absolute; top: -5px; color:red;"></span>');
      }

      // 修改 stateMap.result
      change_stateMap_result({
        _id: result.sm_id,
        field: 'addFees',
        addFees: addFees,
        field2: 'addFeesNote',
        addFeesNote: addFeesNote
      });

    } else {
      alert('老板，服务器压力山大，请再试一次！');
    }
  };
  // 交通
  onChangeCarFees = function(event, result){
    var $td, carFees;
    // 已检验
    if(result.success.ok === 1){

      carFees = result.carFees;

      $td = $('tr.item-id-' + result.sm_id).find('td.carFees');

      $td.text( carFees / 100 );

      // 修改 stateMap.result
      change_stateMap_result({
        _id: result.sm_id,
        field: 'carFees',
        carFees: carFees
      });

    } else {
      alert('老板，服务器压力山大，请再试一次！');
    }
  };
  // 保险
  onChangeInsurance  = function(event, result){
    var $td, insurance;
    // 已检验
    if(result.success.ok === 1){

      insurance = result.insurance;

      $td = $('tr.item-id-' + result.sm_id).find('td.insurance');

      $td.text( insurance );

      // 修改 stateMap.result
      change_stateMap_result({
        _id: result.sm_id,
        field: 'insurance',
        insurance: insurance
      });

    } else {
      alert('老板，服务器压力山大，请再试一次！');
    }
  };
  // 服务满意度
  onChangeSatisfaction = function(event, result){
    var $td, satisfaction, satisfactionNote;
    //console.log(result);
    // 已检验
    if(result.success.ok === 1){
      satisfaction     = result.satisfaction;
      satisfactionNote = result.satisfactionNote;

      $td = $('tr.item-id-' + result.sm_id).find('td.satisfaction');

      if(satisfactionNote){
        $td.attr('title',satisfactionNote);
      }else{
        $td.removeAttr('title');
      }

      $td
        .find('span')
          .removeClass('glyphicon-star-high').addClass('glyphicon-star-low')
          .eq(satisfaction-1)
            .removeClass('glyphicon-star-low').addClass('glyphicon-star-high')
            .prevAll()
              .removeClass('glyphicon-star-low').addClass('glyphicon-star-high');
    }
  };

  onComplete_downloadSm = function( event, result ){
    var $downloadSmBtn, id,
        loadFile, doc, out, setData, tempdocx;

    //console.log(result);
    // 已检验
    if (result.success === 1) {
      $downloadSmBtn = $('tr.item-id-' + result.id).find('button.downloadSmBtn');
      if(result.isSV){
        $downloadSmBtn
          .removeClass("btn-primary")
          .addClass("btn-default")
          .text("已导")
          .data('issvdownload', true)
          .prop("disabled", false);

        // 修改 stateMap.result
        change_stateMap_result({
          _id: result.id,
          field: 'isSVDownload',
          isSVDownload: true
        }); 

      }else{
        $downloadSmBtn
          .removeClass("btn-primary")
          .addClass("btn-default")
          .text("已导")
          .data('isdownload', true)
          .prop("disabled", false);
      }
      
      setData  = result.setData;
      //console.log(setData);
      if(setData.CHINAWORD === '送'){
        tempdocx = "sendTable";
      } else {
        tempdocx = "meetTable";
      }

      // 导出文件
      loadFile=function(url, callback){
        JSZipUtils.getBinaryContent(url, callback);
      };

      loadFile('docxtemp/' + tempdocx + '.docx',function(err,content){
        if (err) { throw e };

        doc = new Docxgen(content);
        doc.setData( setData ) //set the templateVariables

        doc.render(); //apply them (replace all occurences of {first_name} by Hipp, ...)
        out = doc.getZip().generate({type:"blob"}); //Output the document using Data-URI
        saveAs(out, setData.smNum + '.docx');
      });  

    } else {
      alert('老板，服务器压力山大，请再试一次！');
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
    stateMap.$container = $container;
    stateMap.anchor_map = argObj;
    //stateMap.uid        = configMap.people_model.get_user()._id;          // uid
    //stateMap.company    = configMap.people_model.get_user().company_id;   // company_id
    stateMap.category       = configMap.people_model.get_user().category;         // 地接社 20 服务商 30

    $container.html( configMap.main_html );   
    setJqueryMap();

    $.gevent.subscribe( jqueryMap.$list, 'zx-completeGetlist',      onCompleteGetlist      );
    $.gevent.subscribe( jqueryMap.$list, 'zx-changeSmStatus',       onChangeStatus         );
    $.gevent.subscribe( jqueryMap.$list, 'zx-changePhoneMsgStatus', onChangePhoneMsgStatus );
    //$.gevent.subscribe( jqueryMap.$list, 'zx-changeServerMan',      onChangeServerMan      );
    $.gevent.subscribe( jqueryMap.$list, 'zx-changeAddFees',        onChangeAddFees        );
    $.gevent.subscribe( jqueryMap.$list, 'zx-changeCarFees',        onChangeCarFees        );
    $.gevent.subscribe( jqueryMap.$list, 'zx-changeInsurance',      onChangeInsurance      );
    $.gevent.subscribe( jqueryMap.$list, 'zx-changeSatisfaction',   onChangeSatisfaction   );
    $.gevent.subscribe( jqueryMap.$list, 'zx-downloadSm',           onComplete_downloadSm  );
    // getlist
    //argObj.uid = stateMap.uid;
    //argObj.company = stateMap.company;
    //argObj.role = stateMap.role;
    //console.log(argObj);
    configMap.list_model.getlist(argObj);

    jqueryMap.$list.on('click', '#smlistInputDiv', function( event ){
      return false;
    });

    jqueryMap.$list.on('click', 'td.warning', function( event ){
      var $that = $(this),
          inputDivHtml = String()
            + '<div id="smlistInputDiv" style="position:absolute;z-index:9999; padding:5px;border: 1px solid #ddd;background: #fff;width:110px;">'
              + '<input id="smlistInput" type="text" style="width:100px;"></input>'
              + '<input id="smlistNoteInput" class="hidden" type="text" style="width:100px;" placeholder="备注"></input>'
              + '<br><button id="smlistInputBtnCancel" class="btn btn-xs btn-default" style="margin-top:3px;">取消</button>'
              + '<button id="smlistInputBtnOk" class="btn btn-xs btn-primary" style="margin-top:3px;float:right;">确定</button>'
            + '</div>',
          //$td = $that,
          $tr = $that.closest('tr'),
          id  = $tr.data('id');

      // 初始化
      $('#smlistInputDiv').remove();

      $that.append(inputDivHtml);

      if($that.hasClass('fees')){
        $('#smlistNoteInput').removeClass('hidden');
      }

      //$('#smlistInputDiv').css('left',0);
      //$('#smlistInputDiv').css('top',0);
      $('#smlistInput').focus();

      $('#smlistInputBtnOk').click(function(){
        var m, note;

        if($that.hasClass('carFees')){
          // 交通
          m = $('#smlistInput').val().trim();
          if(check_carFees(m)){
            configMap.sm_model.changeCarFees({
              sm_id   : id,
              carFees : Number(m) * 100
            });
          }
        }
        else if($that.hasClass('insurance')){
          // 保险
          m = $('#smlistInput').val().trim();
          if(check_insurance(m)){
            configMap.sm_model.changeInsurance({
              sm_id     : id,
              insurance : Number(m)
            });
          }
        }
        else if($that.hasClass('fees')){
          // 服务费调价
          m = $('#smlistInput').val().trim();
          note = $('#smlistNoteInput').val().trim();

          //console.log(Number($that.data('fees')));

          if(check_fees(m) && note !==''){
            configMap.sm_model.changeAddFees({
              sm_id       : id,
              fees        : Number($that.data('fees')),
              addFees     : Number(m) * 100,
              addFeesNote : note
            });

            $('#smlistInputDiv').remove();
          }else{
            alert('请检查输入的调价是否合法,备注必填');
          }
        }

        return false;
      });
      /*$('#smlistInputDiv').keydown(function(event){
        var m;

        if(event.which === 13){

          if($that.hasClass('carFees')){
            m = $('#smlistInput').val().trim();
            if(check_carFees(m)){
              configMap.sm_model.changeCarFees({
                sm_id   : id,
                carFees : Number(m) * 100
              });
            }
          }else if($that.hasClass('insurance')){
            m = $('#smlistInput').val().trim();
            if(check_insurance(m)){
              configMap.sm_model.changeInsurance({
                sm_id     : id,
                insurance : Number(m)
              });
            }
          }

          $('#smlistInputDiv').remove();
        }
      });*/

      $('#smlistInputBtnCancel').click(function(){
        $('#smlistInputDiv').remove();
        return false;
      });
      /*$('#smlistInputDiv').mouseleave(function(){
        $('#smlistInputDiv').remove();
      }); */   
    });
    
    // 服务满意度
    jqueryMap.$list.on('click', 'span.glyphicon-star-change', function( event ){
      var $that = $(this),
          satisfaction = $that.index() + 1,
          inputDivHtml = String()
            + '<div id="smlistInputDiv" style="position:absolute;z-index:9999; padding:5px;border: 1px solid #ddd;background: #fff;width:200px;">'
              + '<p><strong>您的建议:</strong><span id="smlistStarSpan" style="float:right;"></span></p>'
              + '<div id="smlistDiv" contenteditable="true" style="background-color: #fcf8e3;min-height:50px;"></div>'
              + '<button id="smlistInputBtnCancel" class="btn btn-xs btn-default" style="margin-top:8px;">取消</button>'
              + '<button id="smlistInputBtnOk" class="btn btn-xs btn-primary" style="margin-top:8px; float:right;">确定</button>'
            + '</div>',
          $td = $that.closest('td'),
          $tr = $td.closest('tr'),
          id  = $tr.data('id');

      // 初始化
      $('#smlistInputDiv').remove();

      $td.append(inputDivHtml);

      switch(satisfaction){
        case 1:
          $('#smlistStarSpan').text('(1 星: 很不满意)');
          break;
        case 2:
          $('#smlistStarSpan').text('(2 星: 不满意)');
          break;
        case 3:
          $('#smlistStarSpan').text('(3 星: 一般)');
          break;
        case 4:
          $('#smlistStarSpan').text('(4 星: 满意)');
          break;
        case 5:
          $('#smlistStarSpan').text('(5 星: 很满意)');
          break;
      }

      $('#smlistDiv').text($td.attr('title'));

      $('#smlistInputDiv').css('right',0);


      $('#smlistInputBtnOk').click(function(){
        var satisfactionNote = $('#smlistDiv').text().trim();

        configMap.sm_model.changeSatisfaction({
          sm_id            : id,
          satisfaction     : satisfaction,
          satisfactionNote : satisfactionNote
        });

        /*if(satisfactionNote){
          $td.attr('title',satisfactionNote);
        }*/

        /*$that
          .removeClass('glyphicon-star-low').addClass('glyphicon-star-high')
          .prevAll()
              .removeClass('glyphicon-star-low').addClass('glyphicon-star-high');*/

        $('#smlistInputDiv').remove();
        return false;
      });

      $('#smlistInputBtnCancel').click(function(){
        $('#smlistInputDiv').remove();
        return false;
      });
      /*$('#smlistInputDiv').mouseleave(function(){
        $('#smlistInputDiv').remove();
      });*/
    });

    // 服务商 改变状态 列表
    jqueryMap.$list.on('click', 'li.smStatusLi', function () {
      var $that        = $(this),
          smStatus     = $that.data("smstatus"),
          $smStatusBtn = $that.closest('div.btn-group').find('button.smStatusBtn'),
          id           = $that.parent().data("id");
          //st = "btn-warning";

      $smStatusBtn.prop("disabled", true);

      // 提交服务器修改状态
      //console.log(configMap.sm_model);
      configMap.sm_model.changeStatus({
        sm_id    : id,
        smStatus : Number(smStatus)
      });
    });

    // 服务商 短信 列表
    jqueryMap.$list.on('click', 'li.phoneMsgStatusLi', function () {
      var $that              = $(this),
          phoneMsgStatus     = $that.data("phonemsgstatus"),
          $phoneMsgStatusBtn = $that.closest('div.btn-group').find('button.phoneMsgStatusBtn'),
          id                 = $that.parent().data("id");

      $phoneMsgStatusBtn.prop("disabled", true);

      // 提交服务器修改短信状态
      configMap.sm_model.changePhoneMsgStatus({
        sm_id : id,
        phoneMsgStatus : Number(phoneMsgStatus)
      });
    });

    // 服务商 现场 列表
    /*jqueryMap.$list.on('click', 'li.serverManLi', function () {
      var $that = $(this),
          serverMan = $that.text(),
          $serverManBtn = $that.closest('div.btn-group').find('button.serverManBtn'),
          id = $that.parent().data("id");

      $serverManBtn.prop("disabled", true);

      // 提交服务器修改现场
      configMap.sm_model.changeServerMan({
        sm_id    : id,
        serverMan : serverMan
      });
    });*/

    // 导出服务单
    // Begin Event handler /downloadSmBtn_click/
    jqueryMap.$list.on('click', 'button.downloadSmBtn', function(){
      var $that = $(this),
          isDownload = $that.data('isdownload'),
          isSVDownload = $that.data('issvdownload'),
          data;

      if(isDownload !== undefined){
        data = {
          id         : $that.data('id'),
          isDownload : $that.data('isdownload'),
          isSV       : false
        };
      } else if (isSVDownload !== undefined){
        data = {
          id           : $that.data('id'),
          isSVDownload : $that.data('issvdownload'),
          isSV         : true
        };
      }

      $that.prop("disabled", true);

      // 向服务器请求数据
      configMap.sm_model.downloadSm(data);
    });
    // End Event handler /downloadSmBtn_click/

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
      jqueryMap.$list.remove();
      jqueryMap = {};
    }
    stateMap.$container       = null;
    configMap.people_model    = null;
    configMap.sm_model        = null;
    configMap.list_model      = null;
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