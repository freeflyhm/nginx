/*  isShowFooter
 * zx.bplist.js
 * bplist feature module for zx
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, zx, moment */

zx.bplist = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  // 声明所有 zx.bplist 内可用的变量
  var
    // 静态配置值
    configMap = {
      main_html : String()
        + '<div class="zx-list row">'
          + '<div class="col-sm-2">'
            + '<h3>往来账明细</h3>'
          + '</div>'
          + '<div class="col-sm-4">'
          	+ '<input type="text" class="form-control input-sm" id="companyInput" placeholder="公司名称" style="margin-top: 10px;">'
            //+ '<input type="hidden" id="company_id">'
          + '</div>'
          + '<div class="col-sm-2">'
            + '<select id="bpmonthSelect" class="form-control input-sm" style="margin-top: 10px;">'
              + '<option value=""></option>'
              + '<option value="2015-05-01">2015-05</option>'
              + '<option value="2015-06-01">2015-06</option>'
              + '<option value="2015-07-01">2015-07</option>'
              + '<option value="2015-08-01">2015-08</option>'
              + '<option value="2015-09-01">2015-09</option>'
              + '<option value="2015-10-01">2015-10</option>'
              + '<option value="2015-11-01">2015-11</option>'
              + '<option value="2015-12-01">2015-12</option>'
              + '<option value="2016-01-01">2016-01</option>'
              + '<option value="2016-02-01">2016-02</option>'
              + '<option value="2016-03-01">2016-03</option>'
              + '<option value="2016-04-01">2016-04</option>'
              + '<option value="2016-05-01">2016-05</option>'
              + '<option value="2016-06-01">2016-06</option>'
              + '<option value="2016-07-01">2016-07</option>'
              + '<option value="2016-08-01">2016-08</option>'
              + '<option value="2016-09-01">2016-09</option>'
              + '<option value="2016-10-01">2016-10</option>'
              + '<option value="2016-11-01">2016-11</option>'
              + '<option value="2016-12-01">2016-12</option>'
            + '</select>'
          + '</div>'
          + '<div class="col-sm-1">'
            +'<button id="searchBtn" type="button" class="btn btn-sm btn-default" style="margin-top: 10px;">查询&nbsp;<span class="glyphicon glyphicon-search" aria-hidden="true"></span></button>'
          + '</div>'
          +'<div class="col-sm-3 text-right">'
            + '<button type="button" class="zx-list-top-btn newBpBtn btn btn-primary">添加借贷项目&nbsp;<span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>'
          + '</div>'
          + '<table class="table table-striped table-hover table-responsive">'
            + '<thead>'
              + '<tr>'
                + '<th>序号</th>'
                + '<th>公司</th>'
                + '<th>项目</th>'
                + '<th>金额</th>'
                + '<th>备注</th>'
                + '<th>日期</th>'
                + '<th>创建日期</th>'
                + '<th>最后更新</th>'
                + '<th>修改</th>'
                + '<th>删除</th>'
              + '</tr>'
            + '</thead>'
            + '<tbody class="zx-list-tbody">'
            + '</tbody>'
          + '</table>'
          + '<nav>'
            + '<ul id="zx_bp_list_page_ul" class="pagination pagination-sm"></ul>'
          + '</nav>'
        + '</div>'
    },
    // 动态状态信息
    stateMap  = { 
      $container    : null,
      companysArr   : null,
      companysObj   : null,
      companysIdObj : null
    },
    jqueryMap = {},
    
    // DOM METHODS
    setJqueryMap, 
    // EVENT HANDLERS
    onCompleteGetlist, onNewBpBtnClick, onUpdateBpBtnClick, onDeleteBpBtnClick, onSearchBtnClick,
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
    var obj           = results.obj,
        companysArr   = results.companysArr,
        companysObj   = results.companysObj,
        companysIdObj = results.companysIdObj,
        result        = results.bps,
        currentPage   = results.currentPage,
        totalPage     = results.totalPage,
        pageSplit     = 9,
        ulStr, class_active, startPage, endPage,
        i, len, item, $tr, bpTypeHtml;
    // 初始化
    jqueryMap.$tbody.html('');

    stateMap.companysArr   = companysArr;
    stateMap.companysObj   = companysObj;
    stateMap.companysIdObj = companysIdObj;

    //console.log(obj);
    // 渲染表格
    $('#companyInput').val(obj.company);
    $('#bpmonthSelect').val(obj.bpMonth);

    // 公司名称
    $('#companyInput').autocomplete({
      minLength: 0,
      source: companysArr
    });
    
    for(i = 0, len = result.length; i < len; i++) {
      item = result[i];
      $tr=$('<tr></tr>').addClass('item-id-' + item._id);

      if(item.bpType === 1){
        bpTypeHtml = String()
          + '<span class="label label-success" style="margin-right:5px;">借</span>';
      } else {
        bpTypeHtml = String()
          + '<span class="label label-danger" style="margin-right:5px;">贷</span>';
      }

      $tr
        .append($('<td></td>').text(i+1))
        .append($('<td></td>').text(companysIdObj[item.company]))
        .append($('<td></td>').html(bpTypeHtml))
        .append($('<td></td>').text(item.bpNum / 100))
        .append($('<td></td>').text(item.bpNote))
        .append($('<td></td>').text(moment(item.bpDate).format('YYYY-MM-DD')))
        .append($('<td></td>').text(moment(item.meta.createAt).format('YYYY-MM-DD')))
        .append($('<td></td>').text(moment(item.meta.updateAt).format('YYYY-MM-DD')))
        .append($('<td></td>')
          .append($('<button class="updateBpBtn btn btn-xs btn-primary">修改</button>')
            .data('item',item)))
        .append($('<td></td>')
          .append($('<button class="deleteBpBtn btn btn-xs btn-danger">删除</button>')
            .data('id',item._id)));

      jqueryMap.$tbody.append($tr);
    }

    // 分页
    if(totalPage > 1){
      startPage = Math.floor((currentPage - 1 ) / (pageSplit - 1)) * (pageSplit - 1) + 1;
      endPage   = startPage + pageSplit - 1;
      endPage   = endPage < totalPage ? endPage : totalPage;

      ulStr = String();

      if(startPage > 1){
        ulStr += '<li><a href="#!page=list&c=bp&bpcompany=' + obj.company_id + '&bpmonth=' + obj.bpMonth + '&n=0">1</a></li>';
        ulStr += '<li><span style="border:0; background-color: transparent; padding: 5px;">...</span></li>';
        ulStr += '<li><a href="#!page=list&c=bp&bpcompany=' + obj.company_id + '&bpmonth=' + obj.bpMonth + '&n=' + (startPage - 2) + '">' + (startPage - 1) + '</a></li>';
      }

      for(i = startPage; i <= endPage; i++){
        class_active = currentPage === i ? 'active' : '';
        ulStr += '<li class="' + class_active + '"><a href="#!page=list&c=bp&bpcompany=' + obj.company_id + '&bpmonth=' + obj.bpMonth + '&n=' + (i - 1) + '">' + i + '</a></li>';
      }

      if(endPage < totalPage){
        ulStr += '<li><span style="border:0; background-color: transparent; padding: 5px;">...</span></li>';
        ulStr +='<li><a href="#!page=list&c=bp&bpcompany=' + obj.company_id + '&bpmonth=' + obj.bpMonth + '&n=' + (totalPage - 1) + '">' + totalPage + '</a></li>';
      }
    }
    
    $('#zx_bp_list_page_ul').append(ulStr);
  }; 
  // End Event handler /onCompleteGetlist/
  
  // Begin Event handler /onNewBpBtnClick/
  onNewBpBtnClick = function(){
    var company = $( "#companyInput" ).val();

    zx.modal.initModule({
      $title    : $('<h4 class="modal-title">添加借贷项目</h4>'),
      formClass : 'form-newBp',
      main_html : String()
        + '<div class="form-group">'
          + '<label class="col-sm-3 control-label">* 公司</label>'
          + '<div class="col-sm-9">'
            + '<input tabindex="1001" id="modal_bp_company_input" name="bp[company]" value="' + company + '" tabindex="1" class="form-control" type="text" placeholder="公司名称" required autofocus></input>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-3 control-label">* 日期</label>'
          + '<div class="col-sm-4">'
            + '<input id="modal_bpDate_input" tabindex="1002" name="bp[bpDate]" class="form-control" type="text" required></input>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-3 control-label">* 项目</label>'
          + '<div class="col-sm-3">'
            + '<select tabindex="1003" name="bp[bpType]" class="form-control">'
              + '<option value=1>借</option>'
              + '<option value=-1>贷</option>'
            + '</select>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-3 control-label">* 金额</label>'
          + '<div class="col-sm-4">'
            + '<input tabindex="1004" name="bp[bpNum]" class="form-control" type="text" placeholder="保留两位小数" required></input>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-3 control-label">* 备注</label>'
          + '<div class="col-sm-9">'
            + '<input tabindex="1005" name="bp[bpNote]" class="form-control" type="text" required></input>'
          + '</div>'
        + '</div>'
        + '<div class="zx-form-errors"></div>',
      callbackFunction : function(modalJqueryMap){
        var fieldObj = {},
            bpObj = {},
            formValidation = modalJqueryMap.$modalForm.data('formValidation'),
            fieldArr, company;

        formValidation.validate();
        if(formValidation.isValid()){
          modalJqueryMap.$submitBtn
            .text( '正在添加借贷...' )
            .attr( 'disabled', true );
          modalJqueryMap.$cancelBtn.attr( 'disabled', true );
          fieldArr = modalJqueryMap.$modalForm.serializeArray();
          $.each(fieldArr,function(){
            fieldObj[this.name] = this.value;
          });

          company = fieldObj['bp[company]'];

          bpObj.company = stateMap.companysObj[company];       // 公司 ID
          bpObj.bpDate  = fieldObj['bp[bpDate]'];              // 日期
          bpObj.bpType  = Number(fieldObj['bp[bpType]']);      // 项目 -1 贷, 1 借
          bpObj.bpNum   = Number(fieldObj['bp[bpNum]']) * 100 * bpObj.bpType; // 金额
          bpObj.bpNote  = fieldObj['bp[bpNote]'];              // 备注

          //console.log(bpObj);
          zx.model.bp.newBp(bpObj);
        }   
      }
    });
  };
  // End Event handler /onNewBpBtnClick/

  // Begin Event handler /onUpdateBpBtnClick/
  onUpdateBpBtnClick = function() {
    var $that       = $(this),
        item        = $that.data('item'),
        companyid   = item.company,
        companyName = stateMap.companysIdObj[companyid];

    zx.modal.initModule({
      $title    : $('<h4 class="modal-title">修改借贷项目</h4>'),
      formClass : 'form-updateBp',
      main_html : String()
        + '<input value="' + item._id + '" name="bp[id]" type="hidden"></input>'
        + '<div class="form-group">'
          + '<label class="col-sm-3 control-label">  公司</label>'
          + '<div class="col-sm-9">'
            + '<label class="col-sm-3 control-label" style="text-align:left;">' + companyName + '</label>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-3 control-label">* 日期</label>'
          + '<div class="col-sm-4">'
            + '<input value="' + item.bpDate + '" id="modal_bpDate_input" tabindex="1002" name="bp[bpDate]" class="form-control" type="text" required></input>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-3 control-label">* 项目</label>'
          + '<div class="col-sm-3">'
            + '<select tabindex="1003" name="bp[bpType]" class="form-control">'
              + '<option value=1 ' + (item.bpType===1?'selected':'') + '>借</option>'
              + '<option value=-1 ' + (item.bpType===-1?'selected':'') + '>贷</option>'
            + '</select>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-3 control-label">* 金额</label>'
          + '<div class="col-sm-4">'
            + '<input value="' + (item.bpNum/100 * item.bpType) + '" tabindex="1004" name="bp[bpNum]" class="form-control" type="text" placeholder="保留两位小数" required></input>'
          + '</div>'
        + '</div>'
        + '<div class="form-group">'
          + '<label class="col-sm-3 control-label">* 备注</label>'
          + '<div class="col-sm-9">'
            + '<input value="' + item.bpNote + '" tabindex="1005" name="bp[bpNote]" class="form-control" type="text" required></input>'
          + '</div>'
        + '</div>'
        + '<div class="zx-form-errors"></div>',
      callbackFunction : function(modalJqueryMap){
        var fieldObj = {},
            bpObj = {},
            formValidation = modalJqueryMap.$modalForm.data('formValidation'),
            fieldArr;

        formValidation.validate();
        if(formValidation.isValid()){
          modalJqueryMap.$submitBtn
            .text( '正在修改借贷...' )
            .attr( 'disabled', true );
          modalJqueryMap.$cancelBtn.attr( 'disabled', true );
          fieldArr = modalJqueryMap.$modalForm.serializeArray();
          $.each(fieldArr,function(){
            fieldObj[this.name] = this.value;
          });
          bpObj._id     = fieldObj['bp[id]'];                  // _id
          bpObj.bpDate  = fieldObj['bp[bpDate]'];              // 日期
          bpObj.bpType  = Number(fieldObj['bp[bpType]']);      // 项目 -1 贷, 1 借
          bpObj.bpNum   = Number(fieldObj['bp[bpNum]']) * 100 * bpObj.bpType; // 金额
          bpObj.bpNote  = fieldObj['bp[bpNote]'];              // 备注

          //console.log(bpObj);
          zx.model.bp.updateBp(bpObj);
        }
      }
    });
  };
  // End Event handler /onUpdateBpBtnClick/
  
  // Begin Event handler /onDeleteBpBtnClick/
  onDeleteBpBtnClick = function() {
    var $that = $(this),
        id = $that.data('id');

    //$that.prop('disabled', true);

    zx.modal.initModule({
      size      : 'modal-sm',
      $title    : $('<h4 class="modal-title">删除借贷</h4>'),
      formClass : 'form-deleteBp',
      main_html : String()
        + '<div class="alert alert-warning" role="alert">确定删除吗？</div>',
      callbackFunction : function(modalJqueryMap){
        modalJqueryMap.$submitBtn
          .text( '正在删除借贷...' )
          .attr( 'disabled', true );

        zx.model.bp.deleteBp(id);
      }
    });
  };
  // End Event handler /onDeleteBpBtnClick/
 
  onSearchBtnClick = function() {
    var companyName = $('#companyInput').val(),
        bpmonth = $('#bpmonthSelect').val(),
        bpcompany = '';

    //console.log(bpmonth);
    if(companyName !== ''){
      bpcompany = stateMap.companysObj[companyName];
    }
    
    if(typeof(bpcompany) !== "undefined"){
      $.uriAnchor.setAnchor({ 
        'page'    : 'list', 
        'c'       : 'bp', 
        'bpcompany' : bpcompany,
        'bpmonth' : bpmonth,
        'n'      : '0' 
      }, null, true );
    } else {
      alert('公司不存在！');
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

    jqueryMap.$list.on('click','button.newBpBtn',    onNewBpBtnClick    );
    jqueryMap.$list.on('click','button.updateBpBtn', onUpdateBpBtnClick );
    jqueryMap.$list.on('click','button.deleteBpBtn', onDeleteBpBtnClick );

    jqueryMap.$list.on('click','#searchBtn', onSearchBtnClick );

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