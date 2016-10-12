/* isShowFooter
 * zx.teamlist.js
 * teamlist feature module for zx
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, zx, moment */

zx.teamlist = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  // 声明所有 zx.teamlist 内可用的变量
  var
    // 静态配置值
    configMap = {
      main_html : String()
        + '<div class="zx-list">'
          + '<div class="row">'
            +'<div class="col-sm-2">'
              + '<h3>团队单列表</h3>'
            + '</div>'
            +'<div class="col-sm-3">'
              + '<div class="zx-list-top-btn input-group input-group-sm pull-left">'
                + '<span class="input-group-btn">'
                  + '<button id="preDepartureDate" class="btn btn-sm btn-default">'
                    + '去程日期'
                    + '<span class="glyphicon glyphicon-chevron-left"></span>'
                  + '</button>'
                + '</span>'
                + '<div style="position:relative;">'
                  + '<input id="departuredate" class="inputDate form-control input-sm text-left" type="text"></input>'
                + '</div>'
                + '<span class="input-group-btn">'
                  + '<button id="nextDepartureDate" class="btn btn-sm btn-default">'
                    + '<span class="glyphicon glyphicon-chevron-right"></span>'
                  + '</button>'
                + '</span>'
              + '</div>'
              + '<div style="clear:both"></div>'
            + '</div>'
            +'<div class="col-sm-3">'
              + '<div class="zx-list-top-btn input-group input-group-sm pull-left">'
                + '<span class="input-group-btn">'
                  + '<button id="preReturnDate" class="btn btn-sm btn-default">'
                    + '回程日期'
                    + '<span class="glyphicon glyphicon-chevron-left"></span>'
                  + '</button>'
                + '</span>'
                + '<div style="position:relative;">'
                  + '<input id="returndate" class="inputDate form-control input-sm text-left" type="text"></input>'
                + '</div>'
                + '<span class="input-group-btn">'
                  + '<button id="nextReturnDate" class="btn btn-sm btn-default">'
                    + '<span class="glyphicon glyphicon-chevron-right"></span>'
                  + '</button>'
                + '</span>'
              + '</div>'
              + '<div style="clear:both"></div>'
            + '</div>'
            //+'<div class="col-sm-1" style="padding:0">'
              //+ '<input type="hidden" value="0" name="p1"></input>'
              //+ '<button id="#unScreeningBtn" class="zx-list-top-btn btn btn-sm btn-default btn-block" type="button">取消筛选</button>'
            //+ '</div>'
            +'<div class="col-sm-4 text-right">'
              + '<a href="#!page=team&c=new&n=private" class="zx-list-top-btn btn btn-sm btn-primary active" role="button" title="“独立团单”无法与同事协作，建立后只有本账号可以修改，同公司其它账号只能查看">添加独立团单</a>'
              + '<a href="#!page=team&c=new&n=public" class="zx-list-top-btn btn btn-sm btn-success active" role="button" style="margin-left:10px;" title="“合作团单”可以与同事协作，建立后同公司其它账号都可以修改">添加合作团单</a>'
            + '</div>'
          + '</div>'
          + '<table class="table table-striped table-hover">'
            + '<thead>'
              + '<tr>'
                + '<th style="min-width:40px;">序号</th>'
                + '<th style="min-width:150px;">团号</th>'
                + '<th style="min-width:150px;">线路名</th>'
                + '<th style="min-width:40px;">类型</th>'
                + '<th style="min-width:110px;">去程日期</th>'
                + '<th style="min-width:110px;">回程日期</th>'
                + '<th style="min-width:170px;">操作人</th>'
                + '<th style="min-width:40px;">计划</th>'
                + '<th style="min-width:40px;">人数</th>'
                + '<th style="min-width:90px;">创建日期</th>'
                //+ '<th style="min-width:90px;">最后更新</th>'
                + '<th>导出</th>'
              + '</tr>'
            + '</thead>'
            + '<tbody class="zx-list-tbody">'
            + '</tbody>'
          + '</table>'
          + '<nav>'
            + '<ul id="zx_team_list_page_ul" class="pagination pagination-sm"</ul>'
          + '</nav>'
        + '</div>',
      settable_map : {
        //people_model    : true,
        list_model      : true,
        team_model      : true
      },
      //people_model    : null,
      list_model      : null,
      team_model      : null
    },
    // 动态状态信息
    stateMap  = { $container : null },
    jqueryMap = {},
    // DOM method
    setJqueryMap, 
    // EVENT HANDLERS
    //on_flightDate_focus, 
    onCompleteGetlist, onComplete_downloadTeam,
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
    var 
        result        = results[0].teams,
        departureDate = results[0].departureDate,
        returnDate    = results[0].returnDate,
        currentPage   = results[0].currentPage,
        totalPage     = results[0].totalPage,
        ulStr, class_active, pageSplit = 9, startPage, endPage,
        i, item, $tr, 
        spanHtml, departureDateHtml, returnDateHtml, isDownloadHtml;

    // 初始化
    $('#departuredate').val(departureDate);
    $('#returndate').val(returnDate);

    jqueryMap.$tbody.html('');
    // 渲染表格
    for(i=0; i<result.length; i++) {
      item = result[i];
      // 团号
      spanHtml = String()
        + '<span class="label label-primary" style="margin-right:5px;">独立</span>';
      if(item.isOpen){
        spanHtml = String()
          + '<span class="label label-success" style="margin-right:5px;">合作</span>';
      }

      // 去程日期
      departureDateHtml = '';
      if(item.departureDate){
        departureDateHtml = moment(item.departureDate).format('YYYY-MM-DD');
      }
      //departureDateHtml = item.departureDate;
      if(item.departureTraffics.length > 0){
        if(item.departureTraffics[0].flight.flightStartCity === stateMap.city){
          departureDateHtml += '<s class="s_icon s_icon_send" style="background-position: 0px 0px;"></s>';
        } else {
          departureDateHtml += '<s class="s_icon s_icon_send" style="background-position: 0px -25px;"></s>';
        }
      }

      // 回程日期
      returnDateHtml = '';
      if(item.returnDate) {
        returnDateHtml = moment(item.returnDate).format('YYYY-MM-DD');
      }
      //returnDateHtml = item.returnDate;
      if(item.returnTraffics.length > 0){
        if(item.returnTraffics[0].flight.flightStartCity === stateMap.city){
          returnDateHtml += '<s class="s_icon" style="background-position: 0px 0px;"></s>';
        } else {
          returnDateHtml += '<s class="s_icon" style="background-position: 0px -25px;"></s>';
        }
      }

      // 导出
      if(item.isDownload){
        isDownloadHtml = String()
          + '<button style="padding: 0 5px;" class="btn btn-xs btn-default downloadTeamBtn" type="button" data-isdownload="' + item.isDownload + '" data-id="' + item._id + '">已导出</button>';
      } else {
        isDownloadHtml = String()
          + '<button style="padding: 0 5px;" class="btn btn-xs btn-primary downloadTeamBtn" type="button" data-isdownload="' + item.isDownload + '" data-id="' + item._id + '">未导出</button>';
      }

      $tr=$('<tr></tr>').addClass('item-id-' + item._id);
      $tr
        .append($('<td></td>').text(i+1))
        .append($('<td></td>').html('<a style="text-decoration:none;" href="#!page=team&c=detail&n=' + item._id + '">' + spanHtml + zx.util_b.decodeHtml(item.teamNum) +'</a>'))
        .append($('<td></td>').html(zx.util_b.decodeHtml(item.lineName)))
        .append($('<td></td>').text(item.teamType))
        .append($('<td style="position: relative;"></td>').html(departureDateHtml))
        .append($('<td style="position: relative;"></td>').html(returnDateHtml))
        .append($('<td></td>').html(zx.util_b.decodeHtml(item.operator)))
        .append($('<td></td>').text(item.planNumber))
        .append($('<td></td>').text(item.realNumber))
        .append($('<td></td>').text(moment(item.meta.createAt).format('YYYY-MM-DD')))
        //.append($('<td></td>').text(moment(item.meta.updateAt).format('YYYY-MM-DD')))
        .append($('<td></td>').html(isDownloadHtml));
        /*.append($('<td></td>')
          .append($('<button class="deleteFlagBtn btn btn-xs btn-danger">删除</button>')
            .data('id',item._id)));*/

      jqueryMap.$tbody.append($tr);
    }

    // 分页
    //console.log('currentPage : ' + currentPage + ', totalPage : ' + totalPage);    
    if(totalPage > 1){
      startPage = Math.floor((currentPage - 1 ) / (pageSplit - 1)) * (pageSplit - 1) + 1;
      endPage   = startPage + pageSplit - 1;
      endPage   = endPage < totalPage ? endPage : totalPage;

      ulStr = String();

      if(startPage > 1){
        ulStr += '<li><a href="#!page=list&c=team&departuredate=' + departureDate + '&returndate=' + returnDate + '&n=0">1</a></li>';
        ulStr += '<li><span style="border:0; background-color: transparent; padding: 5px;">...</span></li>';
        ulStr += '<li><a href="#!page=list&c=team&departuredate=' + departureDate + '&returndate=' + returnDate + '&n=' + (startPage - 2) + '">' + (startPage - 1) + '</a></li>';
      }

      for(i = startPage; i <= endPage; i++){
        class_active = currentPage === i ? 'active' : '';
        ulStr += '<li class="' + class_active + '"><a href="#!page=list&c=team&departuredate=' + departureDate + '&returndate=' + returnDate + '&n=' + (i - 1) + '">' + i + '</a></li>';
      }

      if(endPage < totalPage){
        ulStr += '<li><span style="border:0; background-color: transparent; padding: 5px;">...</span></li>';
        ulStr +='<li><a href="#!page=list&c=team&departuredate=' + departureDate + '&returndate=' + returnDate + '&n=' + (totalPage - 1) + '">' + totalPage + '</a></li>';
      }
    }

    //$('#zx_team_list_page_ul').append('<li><a href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>');
    
    $('#zx_team_list_page_ul').append(ulStr);
    
    
    // 结束渲染
      
    // 开始注册事件
    // 
    // 日期控件
    $('input.inputDate').datetimepicker({
      format: 'YYYY-MM-DD',
      dayViewHeaderFormat: 'YYYY MMMM',
      useCurrent: false,
      locale: 'zh-cn',
      showTodayButton: true,
      showClear: true
    }).on("dp.change", function(){
      var $that = $(this);

      if($that.attr('id') === 'departuredate'){
        departureDate = $that.val();
      } else {
        returnDate = $that.val();
      }

      $.uriAnchor.setAnchor({ 
        'page'          : 'list', 
        'c'             : 'team', 
        'departuredate' : departureDate, 
        'returndate'    : returnDate, 
        'n'             : '0' 
      }, null, true );
    });
    // 前一天后一天
    $('#preDepartureDate').click(function () {
        if (departureDate === "") {
            departureDate = moment().subtract(1, 'day').format('YYYY-MM-DD');
        } else {
            departureDate = moment(departureDate).subtract(1, 'day').format('YYYY-MM-DD');
        }

        $.uriAnchor.setAnchor({ 
          'page'          : 'list', 
          'c'             : 'team', 
          'departuredate' : departureDate, 
          'returndate'    : returnDate, 
          'n'             : '0' 
        }, null, true );
    });
    $('#nextDepartureDate').click(function () {        
        if (departureDate === "") {
            departureDate = moment().add(1, 'day').format('YYYY-MM-DD');
        } else {
            departureDate = moment(departureDate).add(1, 'day').format('YYYY-MM-DD');
        }

        $.uriAnchor.setAnchor({ 
          'page'          : 'list', 
          'c'             : 'team', 
          'departuredate' : departureDate, 
          'returndate'    : returnDate, 
          'n'             : '0' 
        }, null, true );
    });
    $('#preReturnDate').click(function () {
        if (returnDate === "") {
            returnDate = moment().subtract(1, 'day').format('YYYY-MM-DD');
        } else {
            returnDate = moment(returnDate).subtract(1, 'day').format('YYYY-MM-DD');
        }

        $.uriAnchor.setAnchor({ 
          'page'          : 'list', 
          'c'             : 'team', 
          'departuredate' : departureDate, 
          'returndate'    : returnDate, 
          'n'             : '0' 
        }, null, true );
    });
    $('#nextReturnDate').click(function () {
        if (returnDate === "") {
            returnDate = moment().add(1, 'day').format('YYYY-MM-DD');
        } else {
            returnDate = moment(returnDate).add(1, 'day').format('YYYY-MM-DD');
        }

        $.uriAnchor.setAnchor({ 
          'page'          : 'list', 
          'c'             : 'team', 
          'departuredate' : departureDate, 
          'returndate'    : returnDate, 
          'n'             : '0' 
        }, null, true );
    });

    // Begin Event handler /downloadTeamBtn_click/
    $('button.downloadTeamBtn').click(function(){
      var $that = $(this),
          data = {
            id         : $that.data('id'),
            isDownload : $that.data('isdownload')
          };

      $that.prop("disabled", true);

      // 向服务器请求数据
      //console.log(data);
      configMap.team_model.downloadTeam(data);
    });
    // End Event handler /downloadTeamBtn_click/
    
  };
  
  
  // Begin Event handler /onComplete_downloadTeam/
  onComplete_downloadTeam = function ( event, result ) {
    //console.log(result);
    var $downloadTeamBtn,
        loadFile, doc, out, setData, tempdocx;
    //console.log(result);
    // 已检验
    if (result.success === 1) {
      $downloadTeamBtn = $('tr.item-id-' + result.id).find('button.downloadTeamBtn');
      $downloadTeamBtn
        .removeClass("btn-primary")
        .addClass("btn-default")
        .text("已导出")
        .data('isdownload', true)
        .prop("disabled", false);

      setData  = result.setData;
      tempdocx = "teamTable";

      // 导出文件
      loadFile=function(url, callback){
        JSZipUtils.getBinaryContent(url, callback);
      };

      loadFile('docxtemp/' + tempdocx + '.docx',function(err,content){
        if (err) { throw e };

        doc = new Docxgen(content);
        doc.setData( setData ); //set the templateVariables

        doc.render(); //apply them (replace all occurences of {first_name} by Hipp, ...)
        out = doc.getZip().generate({type:"blob"}); //Output the document using Data-URI
        saveAs(out, setData.teamNum + '_团.docx');
      });

    } else {
      alert('老板，服务器压力山大，请再试一次！');
    }
  };
  // End Event handler /onComplete_downloadTeam/
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
    stateMap.city       = zx.config.getConfigMapItem('citys')[zx.config.getStateMapItem('city')].city;

    $container.html( configMap.main_html );
    setJqueryMap();

    $.gevent.subscribe( jqueryMap.$list, 'zx-completeGetlist', onCompleteGetlist );
    $.gevent.subscribe( jqueryMap.$list, 'zx-downloadTeam',    onComplete_downloadTeam );
    // getlist
    //argObj.uid = stateMap.uid;
    //argObj.company = stateMap.company;
    //argObj.role = stateMap.role;
    configMap.list_model.getlist(argObj);

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
    stateMap.$container  = null;
    configMap.list_model = null;
    configMap.team_model = null;
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