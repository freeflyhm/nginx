/* 身份证 isShowFooter
 * zx.importpeople.js
 * importpeople module for zx
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global $, zx */

zx.importpeople = (function(){
  'use strict';
  var
  	// 静态配置值
    configMap = {
      main_html: String()
        + '<button id="importBtn" type="button" class="zx-list-top-btn btn btn-sm btn-success"><span class="btn_text">添加名单</span>&nbsp;<span class="glyphicon glyphicon-hand-down"></span></button>',
      import_btn_group_html: String()
      	+ '<div class="btn-group" style="width:100%;">'
      	  + '<button class="btn btn-info btn-xs btn-block dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">'
      	    + '<span class="btnText"></span>&nbsp;<span class="caret"></span>'
      	  + '</button>'
      	  + '<ul class="dropdown-menu dropdown-menu-right" style="min-width: 100px;" role="menu">'
      	    + '<li class="setitemLi"><a href="javascript:;" data-thsetitem="name">姓名</a></li>'
      	    + '<li class="setitemLi"><a href="javascript:;" data-thsetitem="cardNum">证件号码</a></li>'
      	    + '<li class="setitemLi"><a href="javascript:;" data-thsetitem="phone">手机</a></li>'
      	    + '<li class="setitemLi"><a href="javascript:;" data-thsetitem="birthday">出生日期</a></li>'
      	    + '<li class="setitemLi"><a href="javascript:;" data-thsetitem="sex">性别</a></li>'
      	    + '<li class="setitemLi"><a href="javascript:;" data-thsetitem="cardCategory">证件类型</a></li>'
      	    + '<li class="setitemLi"><a href="javascript:;" data-thsetitem="age">年龄</a></li>'
      	    + '<li class="setitemLi"><a href="javascript:;" data-thsetitem="ageType">年龄段</a></li>'
      	    + '<li class="setitemLi"><a href="javascript:;" data-thsetitem="room">分房</a></li>'
      	    + '<li class="setitemLi"><a href="javascript:;" data-thsetitem="teamPersonNote">单人备注</a></li>'
      	    + '<li class="setitemLi"><a href="javascript:;" data-thsetitem="other">忽略</a></li>'
      	  + '</ul>'
      	+ '</div>',
      import_tr_html: String()
        + '<tr>'
          + '<td></td>'
          + '<td></td>'
          + '<td></td>'
          + '<td></td>'
          + '<td></td>'
          + '<td></td>'
          + '<td></td>'
          + '<td></td>'
          + '<td></td>'
          + '<td></td>'
        + '</tr>',
      import_div_html: String()
  	    + '<div id="importDiv">'
          + '<div class="panel panel-default text-left">'
            + '<p style="font-size:15px;font-weight: 700;height:35px;  margin: 15px 0 5px 0;border-bottom:1px solid #ddd">'
              + '<span style="margin-left:15px;">导入客户名单</span>'
              + '<button style="margin-right:15px;" id="importCloseBtn" class="close" type="button"><span>×</span></button>'
            + '</p>'
            + '<div class="row" style="margin: 0;padding: 0 15px 5px 15px;border-bottom: 1px solid #ddd;">'
              + '<div id="import-step1" class="col-sm-12" style="border-bottom: 1px solid #ddd;margin:0 5px 5px 5px; padding:5px;">'
                + '1、 如果名单是表格,就把表格粘贴到下面的文本框中，然后点“下一步”<br >'
                + '2、 如果名单是文本文档（如QQ信息等），也粘贴到下面，并用“空格”把各项内容隔开，然后点“下一步”<br >' 
                + '    如：张三 H76789987 13521123333 男 1976-03-12 吃素 <br >'
              + '</div>'
              + '<div id="import-step2" class="col-sm-12 hidden" style="border-bottom: 1px solid #ddd;margin:0 5px 5px 5px; padding:5px;">'
                + '1、 请核对每一列的内容与每列上面的“名称”(天蓝色框中)是否相符，如果不符可以点击“名称”修改<br >'
                + '    比如：如果这一列的内容是“证件号码”，而上面的名称是“手机”，就要把蓝色框中的“手机”改成“证件号码”<br >'
                + '2、 点击“导入”完成名单导入，关闭此框。（细节可在导入后修改）<br >'
              + '</div>'
              + '<div class="col-sm-3">'
                + '<button id="delTeamTextareaButton" class="btn btn-danger btn-sm" type="button">'
                  + '清空&nbsp;'
                  + '<span class="glyphicon glyphicon-trash"></span>'
                + '</button>'
              + '</div>'
              + '<div class="col-sm-3">'
                + '<button id="saveTheadButton" class="btn btn-primary btn-sm hidden" style="margin-left:8px;" type="button" title="保存您的常用表头设置，这样您下次再使用此格式导入时就不用再修改了">'
                  + '保存当前表头设置&nbsp;'
                  + '<span class="glyphicon glyphicon-floppy-saved"></span>'
                + '</button>'
              + '</div>'
              + '<div class="col-sm-3">'
                + '<button id="stepButton" class="btn btn-success btn-sm" style="margin-left:8px;" type="button">'
                  + '<span class="btnText">下一步</span>&nbsp;'
                  + '<span class="glyphicon glyphicon-chevron-right"></span>'
                + '</button>'
              + '</div>'
              + '<div class="col-sm-3">'
                + '<div id="importPersonDropdown" class="input-group input-group-sm hidden">'
                  + '<span class="input-group-btn">'
                    + '<span id="inputButton" class="btn btn-primary btn-sm" type="button" style="float:right;">'
                      + '导入&nbsp;'
                      + '<span class="glyphicon glyphicon-arrow-right"></span>'
                    + '</span>'
                  + '</span>'
                  + '<input id="importPersonInput" class="form-control dropdown-toggle" type="button" data-toggle="dropdown"></input>'
                  + '<ul class="dropdown-menu dropdown-menu-right" role="menu" style="padding:0;margin:0;min-width:100px;text-align:center;cursor:pointer;"></ul>'
                + '</div>'
              + '</div>'
            + '</div>'
            + '<table id="importTb" class="table table-bordered table-condensed hidden">'
              + '<thead>'
                + '<tr>'
                  + '<th style="padding:0;"></th>'
                  + '<th style="padding:0;"></th>'
                  + '<th style="padding:0;"></th>'
                  + '<th style="padding:0;"></th>'
                  + '<th style="padding:0;"></th>'
                  + '<th style="padding:0;"></th>'
                  + '<th style="padding:0;"></th>'
                  + '<th style="padding:0;"></th>'
                  + '<th style="padding:0;"></th>'
                  + '<th style="padding:0;"></th>'
                + '</tr>'
              + '</thead>'
              + '<tbody></tbody>'
            + '</table>'
            + '<div class="panel-body" style="padding:0; min-width:600px;">'
              + '<div id="teamTextareaErrDiv" style="color:red; padding:0 5px;"></div>'
              + '<div id="teamTextarea" contenteditable="true" style="min-height:300px;width:100%;background-color:#fcf8e3;"></div>'
            + '</div>'
          + '</div>'
        + '</div>',
      settable_map : {
        people_model    : true,
        team_model   : true
      },
      people_model    : null,
      team_model   : true
    },
  	// 动态状态信息
    stateMap  = {},
    // jquery对象缓存集合
    jqueryMap = {},
    // DOM METHODS
    initModuleTh, setTh,
    // EVENT HANDLERS
    on_importBtn_click, on_importPersonDropdown_show, on_setitemLi_click, 
    on_stepButton_click, on_delTeamTextareaButton_click, on_teamTextarea_focus,
    on_inputButton_click, on_saveTheadButton_click, //on_teamTextarea_paste,
    onComplete_setThSetStr,
  	// PUBLIC METHODS
    configModule, initModule, removeThis;


  //--------------------- BEGIN DOM METHODS --------------------
  /*setJqueryMap = function () {
  	var $container = stateMap.$container;

  	jqueryMap.$container          = $container;
  	jqueryMap.$importBtn          = $('#importBtn');
  };*/
  initModuleTh = function(){

    var thSetStr = configMap.people_model.get_user().thSetStr;

  	var thSets, i;
    thSets = thSetStr.split('|');
  	jqueryMap.$importDivTableTh = $('#importDiv').find('table th');

  	for( i = 0; i < 10; i++ ){
  		//jqueryMap.$importDivTableTh.eq(i).addClass(thSet[i] + 'Th');
  		setTh(jqueryMap.$importDivTableTh.eq(i), thSets[i]);
  	}
  };

  setTh = function($th, thSet){
  	var $btn_group = $(configMap.import_btn_group_html),
  		$btn_group_a = $btn_group.find('a'), $a,
  		k;

	for(k = 0; k < $btn_group_a.length; k++){
		$a = $btn_group_a.eq(k);
		if($a.data('thsetitem') === thSet){
			$btn_group.find('span.btnText').text($a.text());
			$th
		  		.addClass(thSet + 'Th')
		  		.data('thsetitem', thSet)
		  		.append($btn_group);
			break;
		}
	}

  	

  };
  //--------------------- END DOM METHODS ----------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  // 点击 添加名单 按钮
  on_importBtn_click = function(){
  	var us_id = stateMap.us_id,
        $userTables = jqueryMap.$userBatchDiv.find('table.userTable'),
        $uTable, i, //$batchTh,
        lenBatchs, $tr_firsts,
        $importDiv, importPersonInputVal,
        heightSize;

    jqueryMap.$userTable = null;

    // 定位当前用户要导入的容器
    for( i=0; i<$userTables.length; i++ ){
      $uTable = $userTables.eq(i);
      //console.log($uTable.data('us_id'));
      //$batchTh = $uTable.find('th.batchTh');
      if($uTable.data('id') === us_id){
        jqueryMap.$userTable = $uTable;
        break;
      }
    }

    // 如果没有找到就新建一个
    if(jqueryMap.$userTable === null){
      jqueryMap.$userTable = zx.team.newUserTable();
      jqueryMap.$userBatchDiv.append(jqueryMap.$userTable);

      // 初始化数据
      stateMap.bt_id = '';
      configMap.team_model.getObjectIdFromServer({ id : 'bt1' });

      return;
    }

    // 获取已有组数
    $tr_firsts = jqueryMap.$userTable.find('tr.tr_first');
    lenBatchs = $tr_firsts.length;
    importPersonInputVal = '第' + lenBatchs + '组';
    
    // 导入框
    $("#importDiv").remove();
    $importDiv = $(configMap.import_div_html);
    $(this).parent().append($importDiv);

    // 初始化表头
  	initModuleTh();

    $('#importPersonInput').val(importPersonInputVal).data('id', $tr_firsts.last().data('id'));
    //console.log($('#importPersonInput').data('id'));
    heightSize = $importDiv.height();
    $importDiv.height('0px');
    $importDiv.animate({
        height: heightSize
    }, {
        duration: 'fast'
        //specialEasing: {
        //    width: 'easeOutBounce'
        //}
    });
    // 清空 （ie需要）
    $("#teamTextarea").val("");
  };

  // Begin Event handler /on_importPersonDropdown_show/
  // 导入名单下拉框
  on_importPersonDropdown_show = function () {
    var $importPersonDropdown = $(this),
        $dropdown_menu,
        htmlString = String()
          + '<li class="list-group-item" style="padding:3px 10px;" data-id="0">新加组</li>',
        lenBatchs, i, $tr_firsts, $tr_first;

    // 获取已有组数
    if(jqueryMap.$userTable){
      $tr_firsts = jqueryMap.$userTable.find('tr.tr_first');
      lenBatchs = $tr_firsts.length;
    } else {
      lenBatchs = 0; // 需要新建用户及组
    }

    for (i = 1; i <= lenBatchs; i++) {
      $tr_first = $tr_firsts.eq( i - 1 );
      htmlString += '<li class="list-group-item" style="padding:3px 10px;" data-id="' + $tr_first.data('id') + '">第' + i + '组</li>';
    }

    $dropdown_menu = $importPersonDropdown.find('ul.dropdown-menu');
    $dropdown_menu.empty().append(htmlString);

    $importPersonDropdown.find("li.list-group-item").click(function () {
      var $that = $(this);
      $('#importPersonInput').val($that.text()).data('id', $that.data('id'));
      //console.log($('#importPersonInput').data('id'));
    });
  };
  // End Event handler /on_importPersonDropdown_show/
  
  // 设置表头
  on_setitemLi_click = function() {
  	var $that = $(this),
        thsetitem = $that.find('a').data('thsetitem'),
		    $btn_group = $that.closest('div.btn-group'),
        $th = $btn_group.closest('th'),
        $othetThs = $th.siblings();

    // 去掉同类
    if(thsetitem !== 'other'){
      $.each($othetThs,function(){
        if($(this).data('thsetitem') === thsetitem){
          $(this)
            .attr('class','otherTh')
            .data('thsetitem','other')
            .find('span.btnText').text('忽略');
        }
      });
    }
    
    // 改变自己
    $btn_group.find('span.btnText').text($that.find('a').text());
    $th
      .attr('class',thsetitem + 'Th')
      .data('thsetitem', thsetitem);
  };

  // 下一步，返回上一步 importTb
  on_stepButton_click = function(){
    var $spanText = $(this).find('span.btnText'),
        $delTeamTextareaButton = $('#delTeamTextareaButton'),
        $importPersonDropdown = $('#importPersonDropdown'),
        $teamTextarea = $('#teamTextarea'),
        personRows, k, personRow, $tr, $tds, len, i, $p, $pbrs, $pbr, kk, pb,
        $tbody = $('#importTb').find('tbody'),
        $teamTextarea_tbody;

    if($spanText.text() === '下一步'){
      // 下一步
      if ($("#teamTextarea").html() === "") {
        // 如果待导入文本框为空
        $('#teamTextareaErrDiv').html("导入文本框不能为空！");
        $("#teamTextarea").parent().addClass('has-error');
        return;
      }

      $tbody.empty();

      $teamTextarea_tbody = $("#teamTextarea").find('tbody');
      
      if($teamTextarea_tbody.length === 0){
        // 文本 \s空格
        // 分列
        //personRows = $("#teamTextarea").text().split(/\r?\n/);
        personRows = $("#teamTextarea").find('div');
        if(personRows.length === 0){
          personRows = $("#teamTextarea").find('p');
        }

        //console.log(personRows);
        
      } else {
        // 表格
        personRows = $teamTextarea_tbody.find('tr');
      }

      for (k = 0; k < personRows.length; k++) {

        if ($teamTextarea_tbody.length === 0) {
          // 文本 \s空格
          //personRow = personRows[k].split(/\s+/);
          $p = personRows.eq(k);

          if($p.find('br').length > 0){
            //console.log($p.html());
            $pbrs = $('<div></div>').append('<p>'+ $p.html().replace(/<br\s*\/*>/,'</p><p>') + '</p>');
            //console.log($pbrs.html());
            $pbr = $pbrs.find('p');

            for (kk = 0; kk < $pbr.length; kk++) {
              pb = $pbr.eq(kk).text().split(/\s+/);
              $tr = buildTr(pb,0);
              $tbody.append($tr);
            }

          } else {

            personRow = $p.text().split(/\s+/);
            $tr = buildTr(personRow,0);
            $tbody.append($tr);
          }
        } else {
          // 表格
          personRow = personRows.eq(k).children();
          $tr = buildTr(personRow,1);
          $tbody.append($tr);
        }
      }

      $spanText.text('返回上一步');

      $('#saveTheadButton').removeClass('hidden');
      $('#importTb').removeClass('hidden');

      $('#import-step1').addClass('hidden');
      $('#import-step2').removeClass('hidden');

      $delTeamTextareaButton.addClass('hidden');
      $importPersonDropdown.removeClass('hidden');
      $teamTextarea.addClass('hidden');

    } else {
      // 返回上一步
      $tbody.empty();
      $spanText.text('下一步');

      $('#saveTheadButton').addClass('hidden');
      $('#importTb').addClass('hidden');

      $('#import-step1').removeClass('hidden');
      $('#import-step2').addClass('hidden');

      $delTeamTextareaButton.removeClass('hidden');
      $importPersonDropdown.addClass('hidden');
      $teamTextarea.removeClass('hidden');
    }

    function buildTr(personRow,l){
      // 生成tr
      var $tr  = $(configMap.import_tr_html),
          $tds = $tr.children(),
          len  = personRow.length > 10 ? 10 : personRow.length,
          i;

      for(i = 0; i < len; i++ ){
        if (l === 0) {
          // 文本 \s空格
          $tds.eq(i).text(personRow[i].trim());

        } else {
          // 表格
          $tds.eq(i).text(personRow.eq(i).text().trim());
        }
      }

      return $tr;
    }
  };

  // 清空
  on_delTeamTextareaButton_click = function(){
    $("#teamTextarea").html("");
    $("#teamTextareaErrDiv").html("");
    $("#teamTextarea").parent().removeClass('has-error');
  };

  // teamTextarea 获得焦点
  on_teamTextarea_focus = function(){
    $("#teamTextareaErrDiv").html("");
    $("#teamTextarea").parent().removeClass('has-error');
  }
  
  // 导入按钮
  on_inputButton_click = function(){
    var repeatUserArray = [], // 重复名单数组
        persons = [],
        $personThs = $('#importTb').find('thead th'), $th, pMap = {},
        $personRows = $('#importTb').find('tbody>tr'), $personRow,
        k, personRow, p, isOk,
        i,
        personsOK = [], // 不重复名单
        $batchPersons,
        cardNum,
        err_html,
        id = $('#importPersonInput').data('id'), lenBatchs,
        $trs=$('<div></div>'), personObj, $person_tr, 
        $nameTd, $cardNumTd, $phoneTd, $birthdayTd, $birthday, $sexTd,
        $cardCategoryTd, $ageTd, $age, $ageTypeTd, $roomTd, $teamPersonNoteTd,
        year, birth, sex, age, ageType,
        phone_re = /^1\d{10}$/,
        $userTableTbody, len,
        $batchTrFirst, $firstTd, rowspan, $beforeAddTr,
        data_departure, data_return;

    // 从表头personThs得到pMap映射
    for(k = 0; k < 10; k++){
      $th = $personThs.eq(k);
      if($th.data('thsetitem') !== 'other'){
        pMap[$th.data('thsetitem')] = k;
      }
    }

    //console.log(pMap.name);

    for (k = 0; k < $personRows.length; k++) {
      personRow = $personRows.eq(k);

      p = {
        name           : pMap.name           === undefined ? '' : personRow.children().eq(pMap.name           ).text(),
        cardNum        : pMap.cardNum        === undefined ? '' : personRow.children().eq(pMap.cardNum        ).text(),
        phone          : pMap.phone          === undefined ? '' : personRow.children().eq(pMap.phone          ).text(),
        birthday       : pMap.birthday       === undefined ? '' : personRow.children().eq(pMap.birthday       ).text(),
        sex            : pMap.sex            === undefined ? '' : personRow.children().eq(pMap.sex            ).text(),
        cardCategory   : pMap.cardCategory   === undefined ? '' : personRow.children().eq(pMap.cardCategory   ).text(),
        age            : pMap.age            === undefined ? '' : personRow.children().eq(pMap.age            ).text(),
        ageType        : pMap.ageType        === undefined ? '' : personRow.children().eq(pMap.ageType        ).text(),
        room           : pMap.room           === undefined ? '' : personRow.children().eq(pMap.room           ).text(),
        teamPersonNote : pMap.teamPersonNote === undefined ? '' : personRow.children().eq(pMap.teamPersonNote ).text()
      };
      
      //console.log(p);
      
      isOk = true;

      if (isOk && p.cardNum != "") {
        // 与已经 push 的数据对比 是否重复 (自检)
        for (i = 0; i < persons.length; i++) {
          if (persons[i].cardNum === p.cardNum) {
            repeatUserArray.push(p);
            isOk = false;
            break;
          }
        }
      }
      
      if (isOk) {
        persons.push(p);
      }
    }

    // --------------------------------------------
    // find 表格中重复名单 -- 证件号
    // 获取表单 persons
    $batchPersons = jqueryMap.$userBatchDiv.find('tbody > tr');

    for (k = 0; k < persons.length; k++) {
      isOk = true;
      for (i = 0; i < $batchPersons.length; i++) {
        cardNum = $.trim($batchPersons.eq(i).find('td.cardNumTd').children().first().text());
        if (cardNum != "" && cardNum == persons[k].cardNum) {
          repeatUserArray.push(persons[k]);
          isOk = false;
          break;
        }
      }
      if (isOk) {
        personsOK.push(persons[k]);
      }
    }

    // --------------------------------------------
    // 报错
    err_html = "";
    for (i = 0; i < repeatUserArray.length; i++) {
        err_html += repeatUserArray[i].name + " " + repeatUserArray[i].cardNum + "<br />";
    }
    if (err_html != "") {
        $("#teamTextareaErrDiv").html("<p>" + repeatUserArray.length + "位客户证件号码重复：</p>" + err_html);
        $("#teamTextarea").parent().removeClass('has-error').addClass('has-error');
    }
    
    // --------------------------------------------
    // 得到导入数据的容器并导入
    len = personsOK.length;
    if (len > 0) {
      // 生成 $trs
      for(i = 0; i < len; i++){
        personObj = personsOK[i];
        $person_tr = $(stateMap.person_tr_edit_html);

        $nameTd           = $person_tr.find('td.nameTd');
        $cardNumTd        = $person_tr.find('td.cardNumTd');
        $phoneTd          = $person_tr.find('td.phoneTd');
        $birthdayTd       = $person_tr.find('td.birthdayTd');
        $sexTd            = $person_tr.find('td.sexTd');
        $cardCategoryTd   = $person_tr.find('td.cardCategoryTd');
        $ageTd            = $person_tr.find('td.ageTd');
        $ageTypeTd        = $person_tr.find('td.ageTypeTd');
        $roomTd           = $person_tr.find('td.roomTd');
        $teamPersonNoteTd = $person_tr.find('td.teamPersonNoteTd');

        $nameTd.children().text(personObj.name);
        $cardNumTd.children().text(personObj.cardNum);
        $phoneTd.children().text(personObj.phone);
        $birthdayTd.children().text(personObj.birthday);
        $sexTd.children().text(personObj.sex);
        $cardCategoryTd.children().text(personObj.cardCategory);
        $ageTd.children().text(personObj.age);
        $ageTypeTd.children().text(personObj.ageType);
        $roomTd.children().text(personObj.room);
        $teamPersonNoteTd.children().text(personObj.teamPersonNote);
        
        // 验证身份证
        if(personObj.cardNum !== ''){
          if (zx.util.checkIdCardField(personObj.cardNum)){
            $cardNumTd.children().addClass('cardNum-check-ok');
            // 填出生日期--性别--证件类型（身份证）
            //// --年龄 (验证出生日期时填写)
            //// --年龄段 (验证年龄时填写)
            year = personObj.cardNum.substr(6, 4);
            birth = year + "-" + personObj.cardNum.substr(10, 2) + "-" + personObj.cardNum.substr(12, 2); // 出生日期
            sex = (personObj.cardNum.substr(16, 1) % 2 === 0)?"女":"男";                         // 性别
            
            //age = zx.util.getAge(year);                                                       // 年龄
            //ageType = zx.util.getAgeType(age);                                                // 年龄段

            $birthdayTd.children().text(birth);
            $sexTd.children().first().text(sex);
            $cardCategoryTd.children().first().text('身份证');
            
            //$ageTd.children().text(age);
            //$ageTypeTd.children().first().text(ageType);

          } else {
            if(personObj.cardCategory ==='' || personObj.cardCategory === '身份证'){
              $cardNumTd.children().addClass('person-check-err');
            }
          }
        }

        // 验证 -- 手机号码 出生日期 性别 证件类型 年龄 年龄段
        $phoneTd.zxvalid('phone');

        $birthdayTd.zxvalid('birthday');
        $birthday = $birthdayTd.children().first();
        if($birthday.text() !== '' && !$birthday.hasClass('person-check-err')){
          year = $birthday.text().substr(0, 4);
          age = zx.util.getAge(year);                                                       // 年龄
          //ageType = zx.util.getAgeType(age);                                                // 年龄段
          $ageTd.children().text(age);
          //$ageTypeTd.children().first().text(ageType);
        }

        $sexTd.zxvalid('sex');
        $cardCategoryTd.zxvalid('cardCategory');

        $ageTd.zxvalid('age');
        $age = $ageTd.children().first();
        if($age.text() !== '' && !$age.hasClass('person-check-err')){
          ageType = zx.util.getAgeType($age.text());                                                // 年龄段
          $ageTypeTd.children().first().text(ageType);
        }

        $ageTypeTd.zxvalid('ageType');

        $trs.append($person_tr);
      }




      // 将数据导入容器
      if(id === 0){
        lenBatchs = jqueryMap.$userTable.find('tr.tr_first').length;
        //console.log(lenBatchs)
        // 新加组
        $trs.children().eq(0)
          .attr('id','bt' + (lenBatchs + 1))
          .addClass('tr_first')
          .prepend(
            $(stateMap.person_first_td_edit_html).attr('rowspan', len)
              .find('span.batchNum').text(lenBatchs + 1)
              .end()
              .find('div.batchPersonCount').text(len)
              .end()
        );
        jqueryMap.$userTable.find('tbody').append($trs.html());

        configMap.team_model.getObjectIdFromServer({ id : 'bt' + (lenBatchs + 1) });

      } else {
        //setPersonTrEdit($trs);
        // 定位组
        $batchTrFirst = jqueryMap.$userTable.find('#bt' + id);
        // 定位将要 after 的 行
        $firstTd = $batchTrFirst.children().first();
        rowspan = Number($firstTd.attr('rowspan'));
        $firstTd.attr('rowspan',rowspan + len)
          .find('div.batchPersonCount').text(rowspan + len);

        $beforeAddTr = $batchTrFirst;
        for(i=1; i<rowspan; i++){
          $beforeAddTr = $beforeAddTr.next();
        }

        $beforeAddTr.after($trs.html());
        // 判断这一行是否为空
        if($beforeAddTr.find('td.snTd').nextAll().text()===""){
          rowspan = Number($firstTd.attr('rowspan'))-1;
          $firstTd.attr('rowspan',rowspan)
            .find('div.batchPersonCount').text(rowspan);
          // 判断这一行是不是首行
          if($beforeAddTr.hasClass('tr_first')){
            data_departure = $beforeAddTr.data('dt_id');
            if(data_departure !== undefined){
              $beforeAddTr.next().data('dt_id', data_departure);
            }
            data_return = $beforeAddTr.data('rt_id');
            if(data_return !== undefined){
              $beforeAddTr.next().data('rt_id', data_return);
            }

            $beforeAddTr.next()
              .attr('id', $beforeAddTr.attr('id'))
              .data('id', $beforeAddTr.data('id'))
              .data('batch_obj', $beforeAddTr.data('batch_obj'))
              .addClass('tr_first')
              .prepend($firstTd);
          }
          
          $beforeAddTr.remove();
        } 
      }
      
      zx.team.writeSN(jqueryMap.$userTable);
    }
  };

  // 保存当前表头设置
  on_saveTheadButton_click = function(){
    var $that = $(this),
        $personThs = $('#importDiv').find('thead th'), 
        k, $th, thSetArr = [], thSetStr;

    $that.prop('disabled', true);

    // 从表头personThs得到thSetArr
    for(k = 0; k < 10; k++){
      $th = $personThs.eq(k);
      thSetArr.push($th.data('thsetitem'));
    }

    thSetStr = thSetArr.join('|');

    zx.model.people.setThSetStr({
      _id      : stateMap.us_id,
      thSetStr : thSetStr
    });
  };

  // 表头设置完成
  onComplete_setThSetStr = function( event, result ){
    //console.log(result);
    // 已检验
    if(result.success.ok === 1){
      $('#saveTheadButton').prop('disabled',false);
    }else{
      alert('老板，服务器压力山大，请再试一次！');
    }
  };

  /*on_teamTextarea_paste = function(){
    var $that = $(this);

    setTimeout(function(){
        var t = $that.val();
        // 先
      },300);
  };*/
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
  
  initModule = function ( jquerymap, statemap ) {
  	jqueryMap = jquerymap;
  	stateMap  = statemap;
  	// 初始化 HTML
  	jqueryMap.$topBtnDiv.prepend( configMap.main_html );
  	jqueryMap.$importBtn = $('#importBtn');

    // 绑定事件
    // 展开收缩导入框
    jqueryMap.$importBtn.on('click', on_importBtn_click);
    // 设置表头
    jqueryMap.$topBtnDiv.on('click','li.setitemLi', on_setitemLi_click);
    // 下一步，返回上一步
    jqueryMap.$topBtnDiv.on('click','#stepButton', on_stepButton_click);
    // 清空按钮
    jqueryMap.$topBtnDiv.on('click','#delTeamTextareaButton', on_delTeamTextareaButton_click);
    // 关闭按钮
    jqueryMap.$topBtnDiv.on('click','#importCloseBtn', zx.team.removeImportDiv);
    // 导入名单下拉框
    jqueryMap.$topBtnDiv.on('show.bs.dropdown','#importPersonDropdown', on_importPersonDropdown_show);
    // #teamTextarea 获得焦点
    jqueryMap.$topBtnDiv.on('focus','#teamTextarea', on_teamTextarea_focus);
    // 导入按钮
    jqueryMap.$topBtnDiv.on('click','#inputButton', on_inputButton_click);
    // 保存当前表头设置
    jqueryMap.$topBtnDiv.on('click','#saveTheadButton', on_saveTheadButton_click);
    // 监听粘贴事件
    //jqueryMap.$topBtnDiv.on('paste','#teamTextarea', on_teamTextarea_paste);
    // 监听表头设置完成事件
    $.gevent.subscribe( jqueryMap.$topBtnDiv, 'zx-setThSetStr', onComplete_setThSetStr );


  };
  // End PUBLIC method /initModule/

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
    //configMap.people_model    = null;
    //configMap.sm_model        = null;
    //configMap.list_model      = null;
    //stateMap.position_type  = 'closed';

    return true;
  };
  // End public method /removeThis/

  return {
  	configModule : configModule,
    initModule   : initModule,
    removeThis   : removeThis
  };
})();