/* 
 * zx.team.js
 * team feature module for zx
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, zx, moment */

/*function on_paste_html_to_text() {
  console.log($(this));
}*/

zx.team = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  // 声明所有 zx.team 内可用的变量
  var
    realNumber_html = String()
        + '<span>名单人数</span>&nbsp;<span style="cursor:pointer;" class="glyphicon glyphicon-question-sign" aria-hidden="true" title="名单人数由系统自动生成且不可手动修改，\n名单人数等于名单表格内的行数(包括空白行)，\n请通过增减行数调节名单人数。"></span>',
    // 静态配置值
    configMap = {
      zx_footbox_div_html: String()
        + '<div id="zxFootBoxDiv" style="bottom:50px;" class="navbar navbar-default navbar-fixed-bottom hidden">'
          + '<div class="container">'
            + '<div class="row" style="padding:4px; float: right;">'
              + '<span style="color:red;font-size:14px;">* 说明: 为了简化您的工作量, 点击确认按钮时系统会将团队注意事项、组备注、单人备注拷贝一份副本到服务单中。但两边对备注的后续修改是独立且互不影响的！</span>'
            + '</div>'
            + '<div class="row" style="padding:4px;">'
              + '<div id="zxFootBoxContainer" class="col-sm-10"></div>'
              + '<div class="col-sm-2">'
                + '<button style="margin:4px 0 0 6px; float:right;" id="cancelAddServerBtn" type="button" class="btn btn-sm btn-default">取消&nbsp;<span class="glyphicon glyphicon-remove"></span></button>'
                + '<button style="margin-top:4px;; float:right;" id="okAddServerBtn" type="button" class="btn btn-sm btn-primary"><span class="btn_text">确认</span>&nbsp;<span class="glyphicon glyphicon-ok"></span></button>'              
              +'</div>'
            + '</div>'
          + '</div>'
        + '</div>',
      server_tag_html : String()
        + '<div class="serverTagDiv alert alert-success role="alert">'
          + '<button type="button" class="closeTag close"><span aria-hidden="true">&times;</span></button>'
          //+ '<strong>悠悠</strong>-1组'
        + '</div>',
      dropdown_ul_html : String()
        + '<ul class="dropdown-menu" role="menu"></ul>',
      dropdown_li_html : String()
        + '<li><a></a></li>',
      top_edit_div_html : String()
        + '<div class="btn-group hidden">'
          + '<button type="button" data-toggle="dropdown" class="zx-list-top-btn btn btn-sm btn-primary dropdown-toggle">添加该团使用的航班&nbsp;<span class="caret"></span></button>'
          + '<ul class="dropdown-menu" role="menu">'
            + '<li><a>去程航班</a></li>'
            + '<li><a>回程航班</a></li>'
          + '</ul>'
        + '</div>'
        //+ '<button id="importBtn" type="button" class="zx-list-top-btn btn btn-sm btn-primary"><span class="btn_text">添加名单</span>&nbsp;<span class="glyphicon glyphicon-hand-down"></span></button>'   
        + '<a href="#" id="gobackDetailTeamBtn" type="button" class="zx-list-top-btn btn btn-sm btn-danger active hidden">不保存直接退出&nbsp;<span class="glyphicon glyphicon-floppy-remove"></span></a>'
        + '<button id="saveTeamBtn" type="button" class="zx-list-top-btn btn btn-sm btn-primary"><span class="btn_text">保存并退出编辑</span>&nbsp;<span class="glyphicon glyphicon-floppy-saved"></span></button>',
      sm_top_edit_div_html : String()
        + '<a href="#" id="gobackDetailSmBtn" type="button" class="zx-list-top-btn btn btn-sm btn-danger active">不保存直接退出&nbsp;<span class="glyphicon glyphicon-floppy-remove"></span></a>'
        + '<button id="saveSmBtn" type="button" class="zx-list-top-btn btn btn-sm btn-primary"><span class="btn_text">保存并退出编辑</span>&nbsp;<span class="glyphicon glyphicon-floppy-saved"></span></button>',
      top_detail_div_html : String()
        + '<button id ="showCardCityBtn" class="zx-list-top-btn btn btn-sm btn-default hidden" type="button" style="margin-left:8px;">身份验证&nbsp;<span class="glyphicon glyphicon-user"></span></button>'
        + '<div id="owndiv" style="float:right;">'
          + '<div id="addServerDiv" class="btn-group" style="margin-left:8px;">'
            + '<button id="addServerBtn" type="button" data-toggle="dropdown" style="box-shadow: #5fff00 0px 0px 0px 0px;" class="zx-list-top-btn btn btn-sm btn-success dropdown-toggle">添加送机、接机服务&nbsp;<span id="addServerBtnSpan" class="glyphicon glyphicon-hand-left"></span></button>'
            + '<ul class="dropdown-menu dropdown-menu-right" role="menu">'
              + '<li class="dropdown-header" role="presentation"><strong>机场服务</strong></li>'
              + '<li class="text-right"><a data-type="11">送机导游服务</a></li>'
              + '<li class="text-right"><a data-type="21">接机导游服务</a></li>'
            + '</ul>'
          + '</div>'
          + '<button id ="downloadTeamBtn" class="zx-list-top-btn btn btn-sm btn-default" type="button" style="margin-left:8px;">导出 Word&nbsp;<span class="glyphicon glyphicon-open-file"></span></button>'
          + '<button id="deleteTeamBtn" type="button" class="zx-list-top-btn btn btn-sm btn-danger" style="margin-left:8px;">删除&nbsp;<span class="glyphicon glyphicon-trash"></span></button>'
          + '<a href="#" id="gotoEditTeamBtn" type="button" class="zx-list-top-btn btn btn-sm btn-primary active">进入编辑模式&nbsp;<span class="glyphicon glyphicon-pencil"></span></a>'
        + '</div>',
      sm_top_detail_div_html : String()
        //+ '<button id ="insuranceBtn" class="zx-list-top-btn btn btn-sm btn-default hidden" type="button" style="margin-left:8px;">保险&nbsp;<span class="glyphicon glyphicon-plane"></span></button>'
        + '<button id ="phoneMessageBtn" class="zx-list-top-btn btn btn-sm btn-default hidden" type="button" style="margin-left:8px;">短信&nbsp;<span class="glyphicon glyphicon-phone"></span></button>'
        + '<button id ="downloadSmBtn" class="zx-list-top-btn btn btn-sm btn-default" type="button" style="margin-left:8px;">导出 Word&nbsp;<span class="glyphicon glyphicon-open-file"></span></button>'
        + '<div id="owndiv" style="float:right;">'
          + '<button id="deleteSmBtn" type="button" class="zx-list-top-btn btn btn-sm btn-danger" style="margin-left:8px;">删除&nbsp;<span class="glyphicon glyphicon-trash"></span></button>'
          + '<a href="#" id="gotoEditSmBtn" type="button" class="zx-list-top-btn btn btn-sm btn-primary active">进入编辑模式&nbsp;<span class="glyphicon glyphicon-pencil"></span></a>'
        + '</div>',
      send_info_table_html : String()
        + '<table class="sm_info_table table table-striped table-bordered table-condensed">'
          + '<tbody>'
            + '<tr>'
              + '<td id="teamNumTdTh" class="tdTh">团号</td>'
              + '<td id="teamNumTd"><div id="teamNumTdDiv"></div></td>'
              + '<td id="lineNameTdTh" class="tdTh">线路</td>'
              + '<td id="lineNameTd"><div id="lineNameTdDiv"></div></td>'
              + '<td id="teamTypeTdTh" class="tdTh">团队类型</td>'
              + '<td><div id="teamTypeTdDiv"></div></td>'
            + '</tr>'
            + '<tr>'
              + '<td class="tdTh">操作人</td>'
              + '<td><div id="operatorTdDiv"></div></td>'
              + '<td class="tdTh text-danger"><span>送机航班</span></td>'
              + '<td id="smFlightTd" class="text-danger"></td>'
              + '<td class="tdTh">送机日期</td>'
              + '<td id="smDateTd"></td>'
            + '</tr>'
            + '<tr>'
              + '<td class="tdTh">服务类型</td>'
              + '<td class="canEdit"><div id="smType2TdDiv"></div></td>' 
              + '<td class="tdTh">送机旗号</td>'
              + '<td><div id="smFlagTdDiv"></div></td>'
              + '<td class="tdTh">' + realNumber_html + '</td>'
              + '<td id="smRealNumberTd"></td>'
            + '</tr>'
            + '<tr>'
              + '<td class="tdTh">送机人员</td>'
              + '<td id="smServerTd"><div id="smServerTdDiv"></div></td>'
              + '<td class="tdTh"><span>集合地点</span></td>'
              + '<td id="smSetPlaceTd"></td>'
              + '<td class="tdTh"><span>集合时间</span></td>'
              + '<td class="smSetTimeTd canEditStyle"><div id="smSetTimeDiv" style="position: relative;"></div></td>'
            + '</tr>'
            + '<tr>'
              + '<td class="tdTh">地接人员</td>'
              + '<td><div id="guideTdDiv"></div></td>'
              + '<td class="tdTh">地接旗号</td>'
              + '<td><div id="sendDestinationFlagTdDiv"></div></td>'
              + '<td></td>'
              + '<td style="position: relative;">'
                + '<div id="sendSetTimeDiv" class="input-group-btn" style="display:none;">'
                  + '<button class="sendSetTimeBtn btn btn-sm btn-default">'
                    + '选择提前时间&nbsp;'
                    + '<span class="caret" />'
                  + '</button>'
                + '</div>'
              + '</td>'
            + '</tr>'
            + '<tr>'
              + '<td class="tdTh">送机司机</td>'
              + '<td><div id="sendDriverTdDiv"></div></td>'
              + '<td class="tdTh" style="color: #aaa;">关联航班</td>'
              + '<td colspan="3" id="smNumTd" style="color: #aaa;"></td>'
            + '</tr>'
            + '<tr>'
              + '<td id="smNoteTdTh">送机备注</td>'
              + '<td colspan="5" class="noteTd canEdit"><div id="smNoteTdDiv"></div></td>'
            + '</tr>'
          + '</tbody>'
          + '<tfoot>'
            + '<tr>'
              + '<td colspan="4">'
                +'<div style="float:left;">'
                  + '代收：'
                  + '<span id="smAgencyFund">0</span>'
                  + '; 已收：'
                  + '<span id="smAgencyFund_y">0</span>'
                  + ' | 代付：'
                  + '<span id="smPayment">0</span>'
                  + '; 已付：'
                  + '<span id="smPayment_y">0</span>'
                  + ' | 服务费：'
                  + '<span id="fees">0</span>'
                  + '<span id="addFees"></span>'
                  + ' | 收费验证次数：'
                  + '<span id="idcardsmfees">0</span>'
                  + ' | 交通费：'
                + '</div>'
                + '<div id="carFees" class="tfoot_canEdit tfoot_canEdit_left">0</div>'
              + '</td>'
              + '<td colspan="2">'
                + '<div id="insuranceDiv" class="hidden" style="margin-right:10px;">'
                  + '<div style="float:left;">现场：</div>'
                  + '<div class="tfoot_canEdit_left" style="position: relative;">'
                    + '<div id="serverMan" class="tfoot_canEdit"></div>'
                  + '</div>'
                  + '<div id="insurance" class="tfoot_canEdit tfoot_canEdit_right">0</div>'
                  + '<div style="float:right;">保险：</div>'
                + '</div>'
              + '</td>'
            + '</tr>'
          + '</tfoot>'
        + '</table>',
      meet_info_table_html : String()
        + '<table class="sm_info_table table table-striped table-bordered table-condensed">'
          + '<tbody>'
            + '<tr>'
              + '<td id="teamNumTdTh" class="tdTh">团号</td>'
              + '<td id="teamNumTd"><div id="teamNumTdDiv"></div></td>'
              + '<td id="lineNameTdTh" class="tdTh">线路</td>'
              + '<td id="lineNameTd"><div id="lineNameTdDiv"></div></td>'
              + '<td id="teamTypeTdTh" class="tdTh">团队类型</td>'
              + '<td><div id="teamTypeTdDiv"></div></td>'
            + '</tr>'
            + '<tr>'
              + '<td class="tdTh">操作人</td>'
              + '<td><div id="operatorTdDiv"></div></td>'
              + '<td class="tdTh text-danger"><span>接机航班</span></td>'
              + '<td id="smFlightTd" class="text-danger"></td>'
              + '<td class="tdTh">接机日期</td>'
              + '<td id="smDateTd"></td>'
            + '</tr>'
            + '<tr>'
              + '<td class="tdTh">服务类型</td>'
              + '<td class="canEdit"><div id="smType2TdDiv"></div></td>'
              + '<td class="tdTh">接机旗号</td>'
              + '<td><div id="smFlagTdDiv"></div></td>'
              + '<td class="tdTh">' + realNumber_html + '</td>'
              + '<td id="smRealNumberTd"></td>'
            + '</tr>'
            + '<tr>'
              + '<td class="tdTh">接机人员</td>'
              + '<td id="smServerTd"><div id="smServerTdDiv"></div></td>'
              + '<td class="tdTh"><span>集合地点</span></td>'
              + '<td id="smSetPlaceTd"></td>'
              + '<td class="tdTh"><span>集合时间</span></td>'
              + '<td class="smSetTimeTd canEditStyle"><div id="smSetTimeDiv" style="position: relative;"></div></td>'
            + '</tr>'
            + '<tr>'
              + '<td class="tdTh">接机司机</td>'
              + '<td><div id="meetDriverTdDiv"></div></td>'
              + '<td class="tdTh" style="color: #aaa;">关联航班</td>'
              + '<td colspan="3" id="smNumTd" style="color: #aaa;"></td>'
            + '</tr>'
            + '<tr>'
              + '<td id="smNoteTdTh">接机备注</td>'
              + '<td colspan="5" class="noteTd canEdit"><div id="smNoteTdDiv"></div></td>'
            + '</tr>'
          + '</tbody>'
          + '<tfoot>'
            + '<tr>' 
              + '<td colspan="4">'
                +'<div style="float:left;">'
                  + '代收：'
                  + '<span id="smAgencyFund">0</span>'
                  + '; 已收：'
                  + '<span id="smAgencyFund_y">0</span>'
                  + ' | 代付：'
                  + '<span id="smPayment">0</span>'
                  + '; 已付：'
                  + '<span id="smPayment_y">0</span>'
                  + ' | 服务费：'
                  + '<span id="fees">0</span>'
                  + '<span id="addFees"></span>'
                  + ' | 交通费：'
                + '</div>'
                + '<div id="carFees" class="tfoot_canEdit tfoot_canEdit_left">0</div>'
              + '</td>'
              + '<td colspan="2">'
                + '<div id="insuranceDiv" class="hidden" style="margin-right:10px;">'
                  + '<div style="float:left;">现场：</div>'
                  + '<div class="tfoot_canEdit_left" style="position: relative;">'
                    + '<div id="serverMan" class="tfoot_canEdit"></div>'
                  + '</div>'
                  + '<div id="insurance" class="tfoot_canEdit tfoot_canEdit_right">0</div>'
                  + '<div style="float:right;">保险：</div>'
                + '</div>'
              + '</td>'
            + '</tr>'
          + '</tfoot>'
        + '</table>',
      team_info_table_html : String()
        + '<table id="tm" class="team_info_table table table-striped table-bordered table-condensed">'
          + '<tbody>'
            //+ '<tr colspan="5" height="22px;"></tr>'
            + '<tr>'
              + '<td id="teamNumTdTh" class="tdTh">团号</td>'
              + '<td id="teamNumTd" class="canEdit"><div id="teamNumTdDiv"></div></td>'
              + '<td id="lineNameTdTh" class="tdTh">线路</td>'
              + '<td id="lineNameTd" class="canEdit"><div id="lineNameTdDiv"></div></td>'
              + '<td id="teamNoteTdTh" style="text-align:left;">团队注意事项</td>'
            + '</tr>'
            + '<tr>'
              + '<td class="tdTh">* 操作人</td>'
              + '<td class="canEdit"><div id="operatorTdDiv"></div></td>'
              + '<td class="tdTh">* 团队类型</td>'
              + '<td class="canEdit"><div id="teamTypeTdDiv"></div></td>'
              + '<td rowspan="5" class="noteTd canEdit"><div id="teamNoteTdDiv"></div></td>' //  onpaste="on_paste_html_to_text()"
            + '</tr>'
            + '<tr>'
              + '<td class="tdTh">计划人数</td>'
              + '<td class="canEdit"><div id="planNumberTdDiv"></div></td>'
              + '<td class="tdTh">' + realNumber_html + '</td>'
              + '<td id="realNumberTd"></td>'
            + '</tr>'
            + '<tr>'
              + '<td class="tdTh">去程送机司机</td>'
              + '<td class="canEdit"><div id="sendDriverTdDiv"></div></td>'
              + '<td class="tdTh">*出发地旗号</td>'
              + '<td class="canEdit"><div id="smFlagTdDiv"></div></td>'
            + '</tr>'
            + '<tr>'
              + '<td class="tdTh">回程接机司机</td>'
              + '<td class="canEdit"><div id="meetDriverTdDiv"></div></td>'
              + '<td></td>'
              + '<td style="position: relative;">'
                + '<button id="setDefaultFlagBtn" class="btn btn-sm btn-default" title="设置默认导游旗">'
                  + '<span class="glyphicon glyphicon-cog" aria-hidden="true"></span>'
                + '</button>'
              + '</td>'
            + '</tr>'
            + '<tr>'
              + '<td class="tdTh">地接人员</td>'
              + '<td class="canEdit"><div id="guideTdDiv"></div></td>'
              + '<td class="tdTh">地接旗号</td>'
              + '<td class="canEdit"><div id="sendDestinationFlagTdDiv"></div></td>'
            + '</tr>'
          + '</tbody>'
        + '</table>',
      traffic_tr_html : String()
        + '<tr>'
          + '<td class="text-center"></td>'
          + '<td class="text-center" style="position: relative;"></td>'
          + '<td class="flightDateTd canEditStyle text-center"><div style="position: relative;"></div></td>'
          + '<td class="flightNumTd canEdit text-center"><div class="flightNumTdDiv"></div></td>'
          + '<td class="refreshTd text-center team-op"><button class="refreshBtn btn btn-xs btn-primary">查询</button></td>'
          + '<td class="flightStartCityTd canEdit text-right"><div class="flightCityTdDiv"></div></td>'
          + '<td class="flightEndCityTd canEdit"><div class="flightCityTdDiv"></div></td>'
          + '<td class="flightTimeTd flightStartTimeTd canEditStyle text-right"><div style="position: relative;"></div></td>'
          + '<td class="flightTimeTd flightEndTimeTd canEditStyle"><div style="position: relative;"></div></td>'
          + '<td class="flightBacthTd">'
            //+ '<ul class="flightBacthTdUl list-group"></ul>'
          + '</td>'
        + '</tr>',
      traffic_tr_li_html : String()
        + '<li class="userBatchLi list-group-item">'
          + '<span></span>'
        + '</li>',
      user_table_html : String()
        + '<table class="userTable table table-striped table-bordered table-condensed">'
          + '<thead>'
            + '<th class="batchTh"></th>'
            + '<th class="opTh team-op hidden">删&nbsp;增</th>'
            + '<th class="snTh">序号</th>'
            + '<th class="nameTh">姓名</th>'
            + '<th class="cardNumTh">证件号码</th>'
            + '<th class="phoneTh">手机</th>'
            + '<th class="birthdayTh">出生日期</th>'
            + '<th class="sexTh">性别</th>'
            + '<th class="cardCategoryTh">证件类型</th>'
            + '<th class="ageTh">年龄</th>'
            + '<th class="ageTypeTh">年龄段</th>'
            + '<th class="roomTh">分房</th>'
            + '<th class="teamPersonNoteTh hidden">单人备注</th>'
            + '<th class="sendPersonNoteTh hidden">送机备注</th>'
            + '<th class="isSendTh hidden" style="width:20px;">送</th>'
            + '<th class="meetPersonNoteTh hidden">接机备注</th>'           
            + '<th class="isMeetTh hidden" style="width:20px;">接</th>'
          + '</thead>'
          + '<tbody></tbody>'
        + '</table>',
      person_tr_html : String()
        + '<tr>'
          + '<td class="opTd team-op hidden">'
            + '<span class="spanRemoveTr glyphicon glyphicon-minus" title="减人"></span>'
            + '<span class="spanNewTr glyphicon glyphicon-plus" title="加人"></span>'
          + '</td>'
          + '<td class="snTd"></td>'
          + '<td class="nameTd canEdit"><div></div></td>'
          + '<td class="cardNumTd canEdit"><div></div></td>'
          + '<td class="phoneTd canEdit"><div></div></td>'
          + '<td class="birthdayTd canEdit"><div></div></td>'
          + '<td class="sexTd canEdit"><div class="sexTdDiv"></div></td>'
          + '<td class="cardCategoryTd canEdit"><div class="cardCategoryTdDiv"></div></td>'
          + '<td class="ageTd canEdit"><div></div></td>'
          + '<td class="ageTypeTd canEdit"><div class="ageTypeTdDiv"></div></td>'
          + '<td class="roomTd canEdit"><div></div></td>'
          + '<td class="teamPersonNoteTd canEdit hidden"><div></div></td>'
          + '<td class="sendPersonNoteTd canEdit hidden"><div></div></td>'
          + '<td class="isSendTd hidden"><input class="checkboxIsSend" type="checkbox" checked></input></td>'
          + '<td class="meetPersonNoteTd canEdit hidden"><div></div></td>'
          + '<td class="isMeetTd hidden"><input class="checkboxIsMeet" type="checkbox" checked></input></td>'
        + '</tr>',
      person_first_td_html : String()
        + '<td class="batch-td-rowspan" rowspan="1">'
          + '<div class="batchSpans team-op hidden">'
            + '<span class="spanRemoveBatch glyphicon glyphicon-minus" title="删除组"></span>'
            + '<span class="spanAddBatch glyphicon glyphicon-plus" title="添加组"></span>'
          + '</div>'
          + '<div>'
            + '<div class="batchNumTitle">'
              + '<span class="batch-td-span">'
                + '<span class="batchNum"></span>'
                + '组'
              + '</span>'
              + '<span class="batchPersonTitle batch-td-span">人</span>'
            + '</div>'
            + '<div class="batchPersonCount canEditDiv"></div>'
            + '<div class="clearDiv"></div>'
          + '</div>'
          + '<div>'
            + '<div class="batchInfoTdTitle">收客单位：</div>'
            + '<div style="position:relative;"><div class="guest canEditDiv"></div></div>'
            + '<div class="clearDiv"></div>'
          + '</div>'
          + '<div>'
            //+ '<div class="batchInfoTdTitle">组备注：</div>'
            + '<div class="teamBatchNote canEditDiv" style="margin-left: 0;">组备注:</div>'
            + '<div class="clearDiv"></div>'
          + '</div>'
          + '<div class="batch_td_icon_check_div" style="display: none;">'
            + '<s class="s_icon s_icon_send" style="background-position: 0 -50px;"></s>'
            + '<s class="s_icon s_icon_meet" style="background-position: 0 -75px;"></s>'
            + '<input type="checkbox" style="display:none;"></input>'
          + '</div>'
        + '</td>',
      sm_person_first_td_html : String()
        + '<td class="batch-td-rowspan" rowspan="1">'
          + '<div class="batchSpans team-op hidden">'
            + '<span class="spanRemoveBatch glyphicon glyphicon-minus" title="删除组"></span>'
            + '<span class="spanAddBatch glyphicon glyphicon-plus" title="添加组"></span>'
          + '</div>'
          + '<div>'
            + '<div class="batchNumTitle">'
              + '<span class="batch-td-span">'
                + '<span class="batchNum"></span>'
                + '组'
              + '</span>'
              + '<span class="batchPersonTitle batch-td-span">人</span>'
            + '</div>'
            + '<div class="batchPersonCount"></div>'
            + '<div class="clearDiv"></div>'
          + '</div>'
          + '<div>'
            + '<div class="batchInfoTdTitle">收客单位：</div>'
            + '<div class="guest"></div>'
            + '<div class="clearDiv"></div>'
          + '</div>'
          + '<div>'
            + '<div class="batchInfoTdTitle">代收/已收</div>'
            + '<div class="smAgencyFundDiv">'
              + '<div class="smAgencyFund canEditDiv" style="width:45%;float:left;"></div>'
              + '<div style="width:10%;float:left;">&nbsp;/&nbsp;</div>'
              + '<div class="smAgencyFund_y" style="width:45%;float:left;"></div>'
            + '</div>'
            + '<div class="clearDiv"></div>'
          + '</div>'
          + '<div>'
            + '<div class="batchInfoTdTitle">代付/已付</div>'
            + '<div class="smPaymentDiv">'
              + '<div class="smPayment canEditDiv" style="width:45%;float:left;"></div>'
              + '<div style="width:10%;float:left;">&nbsp;/&nbsp;</div>'
              + '<div class="smPayment_y" style="width:45%;float:left;"></div>'
            + '</div>'
            + '<div class="clearDiv"></div>'
          + '</div>'
          + '<div>'
            + '<div class="batchInfoTdTitle">组备注：</div>'
            + '<div class="smBatchNote canEditDiv"></div>'
            + '<div class="clearDiv"></div>'
          + '</div>'
        + '</td>',
      team_main_html : String()
        + '<div class="zx-team" style="display: none;">'
          + '<div class="zx-team-header row">'
            + '<div style="padding-left:0;" class="col-sm-6">'
              //+ '<h4 id="zx-nav-pills-h" style="color:red;" class="hidden">亲~ 您已进入编辑状态, 不要忘记保存哦！</h4>'
              + '<h4 id="zx-nav-pills-h" style="color:red;" class="hidden"></h4>'
              + '<ul id="zx-nav-pills" class="nav nav-pills hidden" style="font-family: 微软雅黑;">'
                + '<li role="presentation" title="公司内部使用"><a id="team_a" style="font-size: 12px; margin-top: 16px; padding: 6px 15px; border-radius:6px 6px 0 0;">团队单-公司内部单据</a></li>'
                + '<li role="presentation" class="hidden"><a id="send_a" style="font-size: 18px; border-radius:6px 6px 0 0;">送机单-<small>含实名验证结果</small></a></li>'
                + '<li role="presentation" class="hidden"><a id="meet_a" style="font-size: 12px; margin-top: 16px; padding: 6px 15px;border-radius:6px 6px 0 0;">接机单</a></li>'
              + '</ul>'
              //+ '<div><h3 style="float:left;"><span id="titleSpan"></span></h3><h3 style="float:left;"><small id="beginEditTime"></small></h3></div>'
            + '</div>'
            + '<div class="col-sm-6 text-right">' 
              + '<div id="beginEditTime"></div>'
              + '<div id="topBtnDiv"></div>'
            + '</div>'     
          + '</div>'
          + '<div  id="zx-nav-pills-bottom" style="background-color: #337ab7; height:6px; border-radius: 0 6px 0 0;" class="row"></div>'
          + '<div class="zx-team-body row">'
            + '<div id="teamInfoDiv"></div>'
            //+ '<div class="table-responsive">'
            + '<table id="trafficTable" class="table table-striped table-bordered table-condensed">'
              + '<thead>'
                + '<th id="flightTdTh" class="text-center">航班</th>'
                + '<th id="serversTdTh" class="text-center">服务单</th>'
                + '<th id="flightDateTdTh" class="text-center">日期</th>'
                + '<th id="flightNumTdTh" class="text-center">航班号</th>'
                + '<th id="refreshTh" class="text-center team-op">查询</th>'
                + '<th id="flightStartCityTdTh" class="text-right">始发地</th>'
                + '<th id="flightEndCityTdTh">抵达地</th>'
                + '<th id="flightStartTimeTdTh" class="text-right">始发时间</th>'
                + '<th id="flightEndTimeTdTh">抵达时间</th>'
                + '<th id="flightBacthTdTh" class="text-center"></th>'/*使用此航班的客人(组号)*/
              + '</thead>'
              + '<tbody></tbody>'
            + '</table>'
            //+ '</div>'
            + '<div id="userBatchDiv"></div>'
          + '</div>'         
          + '<div class="zx-team-foot text-right row">'
            + '制单：'
            + '<span id="companyAbbrSpan"></span>'
            + '&nbsp;-&nbsp;'
            + '<span id="nameSpan"></span>'
            + '&nbsp;&nbsp;日期：'
            + '<span id="dateSpan"></span>'
          + '</div>'
        + '</div>',
      // 您好！我是机场送团部${name}，明天${smSetTimeType_smSetTime}我们在${smSetPlace}集合，到了找${smFlag}或联系${smPhone}，谢谢！祝旅途愉快！提示：办完手续后请立即进入安检，最晚在航班起飞前1个小时进入安检。（如需咨询机场问题或对送团工作不满意请联系${call}）
      // 您好！我是机场送团部${name}，明天${smSetTimeType_smSetTime}我们在${smSetPlace}集合，到了联系${smPhone}，谢谢！祝旅途愉快！提示：办完手续后请立即进入安检，最晚在航班起飞前1个小时进入安检。（如需咨询机场问题或对送团工作不满意请联系${call}）
      // 您好！我是${city}接机人员，明天我在${smSetPlace}拿${smFlag}接机并安排车送你们。起飞前请联系${smPhone}，祝旅途愉快！
      // 您好！我是${city}接机人员，明天我在${smSetPlace}拿"阳光服务"蓝色导游旗接机并安排车送你们。起飞前请联系${smPhone}，祝旅途愉快！
      handlebars_send_phone_message_str: String()
        + '{{#if smFlag}}'
          + '您好！我是机场送团部{{name}}，明天{{smSetTimeType_smSetTime}}我们在{{smSetPlace}}集合，到了找{{smFlag}}或联系{{smPhone}}，谢谢！祝旅途愉快！提示：办完手续后请立即进入安检，最晚在航班起飞前1个小时进入安检。（如需咨询机场问题或对送团工作不满意请联系{{call}}）'
        + '{{else}}'
          + '您好！我是机场送团部{{name}}，明天{{smSetTimeType_smSetTime}}我们在{{smSetPlace}}集合，到了联系{{smPhone}}，谢谢！祝旅途愉快！提示：办完手续后请立即进入安检，最晚在航班起飞前1个小时进入安检。（如需咨询机场问题或对送团工作不满意请联系{{call}}）'
        + '{{/if}}',
      handlebars_meet_phone_message_str: String()
        + '{{#if smFlag}}'
          + '您好！我是{{city}}接机人员，明天我在{{smSetPlace}}拿{{smFlag}}接机并安排车送你们。起飞前请联系{{smPhone}}，祝旅途愉快！'
        + '{{else}}'
          + '您好！我是{{city}}接机人员，明天我在{{smSetPlace}}拿"阳光服务"蓝色导游旗接机并安排车送你们。起飞前请联系{{smPhone}}，祝旅途愉快！'
        + '{{/if}}',
      settable_map : {
        people_model    : true,
        team_model      : true,
        sm_model        : true,
        list_model      : true
        //set_team_anchor : true
      },
      people_model    : null,
      team_model      : null,
      sm_model        : null,
      list_model      : null
      //set_team_anchor : true
    },
    // 动态状态信息
    stateMap  = { 
      $container: null,
      city      : '',
      alidayu   : null 
    },
    // jquery对象缓存集合
    jqueryMap = {},
    // UTILITY method

    // DOM method
    // 将 jQuery 对象 写入 jquery对象缓存集合
    setJqueryMap, 
    // -- 显示新建团队单
    showPageTeamNew,
    // 删除导入框
    removeImportDiv,
    getSm, getBatch, getPerson, 
    getAlidayu,
    newUserTable,
    batchNumChange, writeSN, findFirstTr, removeUserTable, removeBatch, removeFirstTr, removeTr,
    newMultiselect, updadeMultiselect,
    // EVENT HANDLERS --------------
    //on_paste_html_to_text,
    // 新建团队单
    onComplete_saveTeamBtnPlusOrMinusOne,
    onComplete_getObjectIdFromServer, //onComplete_trafficTableIsAlready,
    // 团队信息
    // -- 团队操作人
    onCompleteGetlist,        onSetSendSetTime,           on_hidden_td_dropdown,
    on_smFlagTdDiv_focus,     on_setDefaultFlagBtn_click, on_sendDestinationFlagTdDiv_focus, on_guideTdDiv_focus, 
    on_operatorTdDiv_focus,   on_teamTypeTdDiv_focus,            
    //on_flightDate_focus,      
    //on_flightTime_focus,               
    on_flightNumTdDiv_blur,            
    //on_flightCityTdDiv_blur,  
    on_refreshBtn_click,               onComplete_getFlightInfoFromServer,
    // 证件号码 手机号码 出生日期 年龄 失去焦点时验证
    on_cardNumTd_blur, on_phoneTd_blur, on_birthdayTd_blur, on_ageTd_blur,
    // 收客单位 性别 证件类型 年龄段
    on_guest_focus,           on_sexTdDiv_focus,        on_cardCategoryTdDiv_focus,        on_ageTypeTdDiv_focus,
    // 加组减组、加行减行
    on_spanRemoveBatch_click, on_spanRemoveTr_click, 
    on_spanAddBatch_click,    on_spanNewTr_click, 
    // 快速分组
    on_batchPersonCount_blur,
    // 没有默认导游旗时，从服务器获取一个导游旗填充出发地旗号
    onComplete_findOneByCompanyFlag,
    // 添加名单
    //on_importBtnClick,  on_importPersonDropdown_show,

    // -- 查看团队单
    onComplete_getTeamById, on_deleteTeamBtn_click,
    // onComplete_deleteTeam, 
    onComplete_newOrAddSm, on_addServerDivA_click, select_opTdClick,

    // -- 编辑更新团队单
    onComplete_getTeamByIdEdit,

    on_saveTeamBtnClick,     onComplete_saveTeam,

    // 送机单接机单
    onComplete_getSmById, on_deleteSmBtnClick,
    onComplete_getSmByIdEdit, on_saveSmBtnClick, onComplete_saveSm,
    on_smType2TdDiv_focus, on_sendSetTimePopover_show,
    // 代收代付已收已付失去焦点验证 现场责任人获得焦点 保险失去焦点验证
    on_AgencyFund_Payment_blur, on_serverman_focus, on_insurance_blur,

    on_complete_socket_broadcast_lockTeam, on_complete_socket_broadcast_delTeam, on_complete_socket_broadcast_delSm,
    onComplete_downloadTeam, onComplete_downloadSm, set_focus,
    // PUBLIC METHODS
    configModule, initModule, removeThis;
  //----------------- END MODULE SCOPE VARIABLES ---------------


  //------------------- BEGIN UTILITY METHODS ------------------
  //-------------------- END UTILITY METHODS -------------------

  //--------------------- BEGIN DOM METHODS --------------------
  // Begin DOM method /setJqueryMap/
  setJqueryMap = function (n) {
    var $container = stateMap.$container;

    switch(n){
      // 新增团队单 - team_main_html
      case 11 :
        jqueryMap = {
          $container             : $container,
          $team                  : $container.find('.zx-team'),
          $zxNavPills            : $('#zx-nav-pills'),
          //$titleSpan             : $('#titleSpan'),
          $beginEditTime         : $('#beginEditTime'),
          $topBtnDiv             : $('#topBtnDiv'),

          $teamInfoDiv           : $('#teamInfoDiv'),
          $trafficTable          : $('#trafficTable'),
          $serversTdTh           : $('#serversTdTh'),
          $refreshTh             : $('#refreshTh'),
          $userBatchDiv          : $('#userBatchDiv'),
        
          $companyAbbrSpan       : $('#companyAbbrSpan'),
          $nameSpan              : $('#nameSpan'),
          $dateSpan              : $('#dateSpan')

          //$zxFootBoxDiv          : $('#zxFootBoxDiv'),
          //$zxFootBoxContainer    : $('#zxFootBoxContainer'),
          //$cancelAddServerBtn    : $('#cancelAddServerBtn'),
          //$okAddServerBtn        : $('#okAddServerBtn')
        };
        break;
      // 新增团队单 - top_edit_div_html
      case 21 :
        jqueryMap.$gobackDetailTeamBtn      = $('#gobackDetailTeamBtn'); // 不保存直接退出
        //jqueryMap.$importBtn                = $('#importBtn');           // 添加名单
        jqueryMap.$saveTeamBtn              = $('#saveTeamBtn');         // 保存并退出编辑
        break;
      case 22 :
        jqueryMap.$deleteTeamBtn            = $('#deleteTeamBtn');       // 删除团队单
        jqueryMap.$addServerDiv             = $('#addServerDiv');        // 添加服务
        jqueryMap.$gotoEditTeamBtn          = $('#gotoEditTeamBtn');     // 进入编辑模式
        break;
      // 新增团队单 - team_info_table_html
      case 31 :
        //jqueryMap.$teamInfoTable            = jqueryMap.$team.find('table.team_info_table');
        jqueryMap.$teamNumTdDiv             = $('#teamNumTdDiv');     
        jqueryMap.$lineNameTdDiv            = $('#lineNameTdDiv');
        jqueryMap.$operatorTdDiv            = $('#operatorTdDiv');
        jqueryMap.$teamTypeTdDiv            = $('#teamTypeTdDiv');
        jqueryMap.$teamNoteTdDiv            = $('#teamNoteTdDiv');
        jqueryMap.$planNumberTdDiv          = $('#planNumberTdDiv');
        jqueryMap.$realNumberTd             = $('#realNumberTd');
        jqueryMap.$sendDriverTdDiv          = $('#sendDriverTdDiv');
        jqueryMap.$smFlagTdDiv              = $('#smFlagTdDiv');
        jqueryMap.$meetDriverTdDiv          = $('#meetDriverTdDiv');
        jqueryMap.$setDefaultFlagBtn        = $('#setDefaultFlagBtn');
        jqueryMap.$guideTdDiv               = $('#guideTdDiv');
        jqueryMap.$sendDestinationFlagTdDiv = $('#sendDestinationFlagTdDiv');
        break;
      case 51 :
        jqueryMap.$gobackDetailSmBtn      = $('#gobackDetailSmBtn'); // 不保存直接退出
        jqueryMap.$saveSmBtn              = $('#saveSmBtn');         // 保存并退出编辑
        break;
      case 52 :
        jqueryMap.$deleteSmBtn          = $('#deleteSmBtn');     // 进入编辑模式
        jqueryMap.$gotoEditSmBtn          = $('#gotoEditSmBtn');     // 进入编辑模式
        break;
      case 61 :
        jqueryMap.$teamNumTdDiv             = $('#teamNumTdDiv');             // 团号   
        jqueryMap.$lineNameTdDiv            = $('#lineNameTdDiv');            // 线路
        jqueryMap.$operatorTdDiv            = $('#operatorTdDiv');            // 操作人
        jqueryMap.$teamTypeTdDiv            = $('#teamTypeTdDiv');            // 团队类型
        jqueryMap.$smNoteTdDiv              = $('#smNoteTdDiv');              // 备注
        jqueryMap.$smRealNumberTd           = $('#smRealNumberTd');           // 名单人数
        jqueryMap.$sendDriverTdDiv          = $('#sendDriverTdDiv');          // 送机司机
        jqueryMap.$smFlagTdDiv              = $('#smFlagTdDiv');              // 出发地旗号
        jqueryMap.$meetDriverTdDiv          = $('#meetDriverTdDiv');          // 接机司机
        jqueryMap.$guideTdDiv               = $('#guideTdDiv');               // 地接人员 送机
        jqueryMap.$sendDestinationFlagTdDiv = $('#sendDestinationFlagTdDiv'); // 地接旗号 送机

        jqueryMap.$smDateTd     = $('#smDateTd');     // 送机日期
        jqueryMap.$smNumTd      = $('#smNumTd');      // 送机单号
        jqueryMap.$smFlightTd   = $('#smFlightTd');   // 送机航班
        jqueryMap.$smServerTd   = $('#smServerTd');   // 送机人员
        jqueryMap.$smServerTdDiv= $('#smServerTdDiv');   // 送机人员
        jqueryMap.$smSetPlaceTd = $('#smSetPlaceTd'); // 集合地点
        jqueryMap.$smSetTimeDiv = $('#smSetTimeDiv');  // 集合时间
        jqueryMap.$smType2TdDiv = $('#smType2TdDiv'); // 送机类型

        jqueryMap.$sendSetTimeDiv = $('#sendSetTimeDiv'); // 选择集合时间
    }
  };
  // End DOM method /setJqueryMap/
  
  // Begin DOM method /showPageTeamNew/
  showPageTeamNew = function () {
    //console.log(stateMap);
    var $teamInfoTable,
        $userTable, $person_tr, $person_first_td,
        $trafficTr = $(configMap.traffic_tr_html),
        $departureTrafficTr, $returnTrafficTr,
        $departureTrafficTrLi = $(configMap.traffic_tr_li_html),
        $returnTrafficTrLi = $(configMap.traffic_tr_li_html),
        defaultFlag;

    // ---------- 开始渲染UI
    // main
    stateMap.$container.append( configMap.team_main_html );
    setJqueryMap(11);
    //jqueryMap.$titleSpan.text('团队单 - 新增');
    //jqueryMap.$beginEditTime.text(moment(stateMap.beginEditTime).format('YYYY-MM-DD HH:mm'));

    $.gevent.subscribe( jqueryMap.$team, 'zx-getObjectIdFromServer', onComplete_getObjectIdFromServer );
    $.gevent.subscribe( jqueryMap.$team, 'zx-saveTeam', onComplete_saveTeam );

    // top
    $('#zx-nav-pills-h')
      .removeClass('hidden')
      .html('亲~ 您正在编辑<span style="font-size: 22px;font-weight: 800;color: blue;">团队单</span>, 不要忘记保存哦！');


    $('#zx-nav-pills-bottom').addClass('hidden');

    jqueryMap.$topBtnDiv.append(configMap.top_edit_div_html);
    setJqueryMap(21);
    $.gevent.subscribe( jqueryMap.$saveTeamBtn, 'zx-saveTeamBtnPlusOrMinusOne' , onComplete_saveTeamBtnPlusOrMinusOne);
    
    // 团队信息
    // 初始化样式
    $teamInfoTable = 
      $(configMap.team_info_table_html)
        .find('.canEdit')
          .addClass('warning')
          .children()
            .attr('contenteditable',true)
            .attr('spellcheck',false)
            .end()
          .end();
    jqueryMap.$teamInfoDiv.append($teamInfoTable);
    setJqueryMap(31);
    
    // 初始化数据
    stateMap.tm_id = '';
    //team_obj.user        = stateMap.us_id;
    //team_obj.companyAbbr = stateMap.companyAbbr;
    //team_obj.name        = stateMap.name;
    //team_obj.isOpen      = stateMap.isOpen;
    configMap.team_model.getObjectIdFromServer({ id : 'tm' });
    //jqueryMap.$realNumberTd.text(1);

    
    // 航班信息
    // 初始化样式
    jqueryMap.$serversTdTh.addClass('hidden');

    $trafficTr
      .find('.canEditStyle')
        .addClass('warning')
      .end()
      .find('.flightDateTd')
        .children()
          .append($('<input type="text" class="flightDate"></input>'))
        .end()
        .prev()
          .addClass('hidden')
        .end()
      .end()
      .find('.flightTimeTd')
        .children()
          .append($('<input type="text" class="flightTime"></input>'))
        .end()
      .end()
      .find('.canEdit')
        .addClass('warning')
        .children()
          .attr('contenteditable',true)
          .attr('spellcheck',false)
        .end()
      .end();

    // 缓存到状态集合 stateMap 中，以备后用
    stateMap.traffic_tr_edit_html = $('<div></div>').append($trafficTr).html();

    // 初始化数据
    //$departureTrafficTrLi
    //  .data('us_id', stateMap.us_id)
    //  .children().first().text(stateMap.name + ':');
    //jqueryMap.$teamTypeTdDiv.text('散拼');

    $departureTrafficTr = $(stateMap.traffic_tr_edit_html);
    $departureTrafficTr
      .attr('id', 'dt1')
      .data('sm_status',0)
      .addClass('departureTraffics')
      .children()
        .eq(0).text('去程航班')
      .end();
      //.find('ul.flightBacthTdUl')
      //  .append($departureTrafficTrLi)
      //.end();

    //$returnTrafficTrLi
    //  .data('us_id', stateMap.us_id)
    //  .children().first().text(stateMap.name + ':');

    $returnTrafficTr = $(stateMap.traffic_tr_edit_html);
    $returnTrafficTr
      .attr('id', 'rt1')
      .data('sm_status',0)
      .addClass('returnTraffics')
      .children()
        .eq(0).text('回程航班')
      .end();
      //.find('ul.flightBacthTdUl')
      //  .append($returnTrafficTrLi)
      //.end();

    jqueryMap.$trafficTable.find('tbody')
      .append($departureTrafficTr)
      .append($returnTrafficTr);
    
    $.gevent.subscribe( jqueryMap.$trafficTable, 'zx-getFlightInfoFromServer', onComplete_getFlightInfoFromServer );

    // 组信息
    // 初始化样式
    $person_first_td = 
      $(configMap.person_first_td_html)
        .find('.canEditDiv')
          .addClass('warning')
          .attr('contenteditable',true)
        .end()
        .find('.team-op')
          .removeClass('hidden')
        .end();
    $person_tr = 
      $(configMap.person_tr_html)
        .find('.team-op')
          .removeClass('hidden')
        .end()
        .find('.canEdit')
          .addClass('warning')
          .children()
            .attr('contenteditable',true)
            .attr('spellcheck',false)
          .end()
        .end()
        .find('td.teamPersonNoteTd')
          .removeClass('hidden')
          /*.nextAll()
            .remove()
          .end()*/
        .end();
    $userTable = 
      $(configMap.user_table_html)
        .find('.team-op')
          .removeClass('hidden')
        .end()
        .find('th.teamPersonNoteTh')
          .removeClass('hidden')
          /*.nextAll()
            .remove()
          .end()*/
        .end();
    // 缓存到状态集合 stateMap 中，以备后用
    stateMap.person_first_td_edit_html = $('<div></div>').append($person_first_td).html();
    stateMap.person_tr_edit_html = $('<div></div>').append($person_tr).html();
    stateMap.user_table_edit_html = $('<div></div>').append($userTable).html();


    jqueryMap.$userBatchDiv.append(newUserTable());
    // 初始化数据
    stateMap.dt_id = '';
    stateMap.rt_id = '';
    stateMap.bt_id = '';
    configMap.team_model.getObjectIdFromServer({ id : 'dt1' });
    configMap.team_model.getObjectIdFromServer({ id : 'rt1' });
    configMap.team_model.getObjectIdFromServer({ id : 'bt1' });

    
    // footer
    jqueryMap.$companyAbbrSpan.text(stateMap.companyAbbr);
    jqueryMap.$nameSpan.text(stateMap.name);
    jqueryMap.$dateSpan.text(moment(stateMap.beginEditTime).format('YYYY-MM-DD'));

    /*// 验证 证件号码 手机号码
    $('.cardNumTd').zxvalid('cardNum');
    $('.phoneTd').zxvalid('phone');*/

    jqueryMap.$team.show();
    // ---------- 结束渲染UI

    // 添加一段检查是否设置默认导游旗的代码
    defaultFlag = configMap.people_model.get_user().defaultFlag;
    if(typeof defaultFlag === 'undefined' || defaultFlag === 'undefined') {
      // 没有设置默认出发地旗号
      // 从服务器获取一个出发地旗号
      $.gevent.subscribe( jqueryMap.$smFlagTdDiv, 'zx-findOneByCompanyFlag', onComplete_findOneByCompanyFlag );
      zx.model.flag.findOneByCompanyFlag(stateMap.company);
    } else {
      // 用默认导游旗自动填充 出发地旗号 字段
      jqueryMap.$smFlagTdDiv.text(defaultFlag);
    }

    jqueryMap.$setDefaultFlagBtn.show();

    // ---------- 开始注册事件
    
    //newMultiselect($departureTrafficTrLi, 0);
    //newMultiselect($returnTrafficTrLi, 1);
    //updadeMultiselect();

    $.gevent.subscribe( jqueryMap.$team, 'zx-completeGetlist', onCompleteGetlist );
    // 所有 hidden.bs.dropdown 事件， 销毁 dropdown控件
    jqueryMap.$team.on('hidden.bs.dropdown','.dropdown',     on_hidden_td_dropdown);
    //jqueryMap.$team.on('hidden.bs.dropdown','td.dropdown',     on_hidden_td_dropdown);

    // 出发地旗号
    jqueryMap.$smFlagTdDiv.focus(              on_smFlagTdDiv_focus );
    // 设置默认导游旗
    jqueryMap.$setDefaultFlagBtn.click( on_setDefaultFlagBtn_click );
    // 地接旗号
    jqueryMap.$sendDestinationFlagTdDiv.focus( on_sendDestinationFlagTdDiv_focus );
    // 地接人员
    jqueryMap.$guideTdDiv.focus(               on_guideTdDiv_focus );
    // 操作人
    jqueryMap.$operatorTdDiv.focus(            on_operatorTdDiv_focus );
    // 团队类型
    jqueryMap.$teamTypeTdDiv.focus(            on_teamTypeTdDiv_focus );
    

    // 日期控件
    $('input.flightDate').datetimepicker({
      format: 'YYYY-MM-DD',
      dayViewHeaderFormat: 'YYYY MMMM',
      //useCurrent: false,
      locale: 'zh-cn',
      showTodayButton: true,
      showClear: true
    });
    // 时间控件
     $('input.flightTime').datetimepicker({
      format: 'HH:mm',
      useCurrent: false
    });

    // 航班号-小写转大写
    jqueryMap.$trafficTable.on('blur', 'div.flightNumTdDiv',    on_flightNumTdDiv_blur);
    // 始发地 抵达地 含 深圳
    //jqueryMap.$trafficTable.on('blur', 'div.flightCityTdDiv',   on_flightCityTdDiv_blur);
    // 从服务器获取航班
    jqueryMap.$trafficTable.on('click', 'button.refreshBtn',   on_refreshBtn_click);

    /*// 验证 证件号码 手机号码 出生日期 性别 证件类型 年龄 年龄段
    $('.cardNumTd').zxvalid('cardNum');
    $('.phoneTd').zxvalid('phone');
    $('.birthdayTd').zxvalid('birthday');
    $('.sexTd').zxvalid('sex');
    $('.cardCategoryTd').zxvalid('cardCategory'); 
    $('.ageTd').zxvalid('age');
    $('.ageTypeTd').zxvalid('ageType');*/

    // 证件号码 手机号码 出生日期 年龄 失去焦点时验证
    jqueryMap.$userBatchDiv
      .on('blur','td.cardNumTd', on_cardNumTd_blur )
      .on('blur','td.phoneTd', on_phoneTd_blur )
      .on('blur','td.birthdayTd', on_birthdayTd_blur )
      .on('blur','td.ageTd', on_ageTd_blur );

    // 收客单位 性别 证件类型 年龄段
    jqueryMap.$userBatchDiv.on('focus','div.guest',             on_guest_focus);
    jqueryMap.$userBatchDiv.on('focus','div.sexTdDiv',          on_sexTdDiv_focus);
    jqueryMap.$userBatchDiv.on('focus','div.cardCategoryTdDiv', on_cardCategoryTdDiv_focus);
    jqueryMap.$userBatchDiv.on('focus','div.ageTypeTdDiv',      on_ageTypeTdDiv_focus);
    // 加组减组、加行减行
    jqueryMap.$userBatchDiv.on('click','span.spanRemoveBatch',  on_spanRemoveBatch_click);
    jqueryMap.$userBatchDiv.on('click','span.spanAddBatch',     on_spanAddBatch_click);
    jqueryMap.$userBatchDiv.on('click','span.spanRemoveTr',     on_spanRemoveTr_click);
    jqueryMap.$userBatchDiv.on('click','span.spanNewTr',        on_spanNewTr_click);

    // 快速分组
    jqueryMap.$userBatchDiv.on('blur','div.batchPersonCount',   on_batchPersonCount_blur);

    // 添加航班 添加名单 保存
    //jqueryMap.$importBtn.click(   on_importBtnClick ); // 导入名单
    jqueryMap.$saveTeamBtn.click( function(){ on_saveTeamBtnClick(true); } );
    // ---------- 结束注册事件
    // 
    /*$('#teamNoteTdDiv').on('paste',function(){
      var $that = $(this);

      setTimeout(function(){
        var t = $that.text();
        $that.text(t);
      },300);
    });*/
    
  };
  // End DOM method /showPageTeamNew/

  // Begin DOM method /removeImportDiv/
  removeImportDiv = function () {
    if($("#importDiv").length !== 0){
      $("#importDiv").animate({
        height: 'toggle'
      }, 'fast').promise().done(function () {
        $(this).remove();
      });
    }
  };
  // End DOM method /removeImportDiv/

  // Begin DOM method /getSm/
  getSm = function($tr, TRAFFIC, DATA_ID) {
    var 
      CITY = stateMap.city, 
      sm_obj = $tr.data('sm_obj'),
      CHECKEDBOX,
      SM_MEET_TIME_SPACE = 15,
      $userTables = jqueryMap.$userBatchDiv.find('table.userTable'),
      k, len_k, $userTable, $batchFirstTrs,
      i, len_i, $batchFirstTr, batch_obj, $bacthTrs, 
      j, len_j, $bacthTr,
      smRealNumber,
      myFeesTempItem, smSetTime, smTime, setTimeInputVal,
      smType1, 
      smType2 = sm_obj.smType2; // 类型2：1 内   2 外

    //_id             : smId,
    //user            : stateMap.team_us_id,
    //company         : '',
    //companyAbbr     : stateMap.team_companyAbbr,
    //name            : stateMap.team_name,
    //isOpen          : stateMap.team_isOpen, // Boolean
    //team            : stateMap.tm_id,
    //smType2         : '',
      
    sm_obj.operator = jqueryMap.$operatorTdDiv.text();

    sm_obj.flight = {
        flightDate      : $tr.find("td.flightDateTd").find('input').val(),                 // 日期
        flightNum       : $tr.find("td.flightNumTd").children().text(),                    // 航班号
        flightStartCity : $tr.find("td.flightStartCityTd").children().text().trim(),       // 始发城市
        flightEndCity   : $tr.find("td.flightEndCityTd").children().text().trim(),         // 抵达城市
        flightStartTime : $tr.find("td.flightStartTimeTd").children().find('input').val(), // 始发时间
        flightEndTime   : $tr.find("td.flightEndTimeTd").children().find('input').val()    // 抵达时间
    };

    //smRealNumber
    if(sm_obj.flight.flightStartCity === CITY){
      // send
      CHECKEDBOX = 'input.checkboxIsSend';
      smType1 = '1';
      smTime = sm_obj.flight.flightStartTime;
      setTimeInputVal = sm_obj.smTimeSpace || stateMap.sendSetTime;
    } else if (sm_obj.flight.flightEndCity.indexOf(CITY) === 0) {
      // meet
      CHECKEDBOX = 'input.checkboxIsMeet';
      smType1 = '2';
      smTime = sm_obj.flight.flightEndTime;
      setTimeInputVal = SM_MEET_TIME_SPACE;
    }

    smRealNumber = 0;
    for( k = 0, len_k = $userTables.length; k < len_k; k++ ) {
      $userTable     = $userTables.eq(k);
      $batchFirstTrs = $userTable.find('tr.tr_first');

      for( i = 0, len_i = $batchFirstTrs.length; i < len_i; i++ ) {
        $batchFirstTr = $batchFirstTrs.eq(i);
        batch_obj = $batchFirstTr.data('batch_obj');

        if( (batch_obj[TRAFFIC] && batch_obj[TRAFFIC]['isSm'] === true) && sm_obj._id === $batchFirstTr.data(DATA_ID)){
          smRealNumber += $batchFirstTr.find(CHECKEDBOX).prop('checked') ? 1 : 0;

          $bacthTrs = $batchFirstTr.nextUntil('tr.tr_first');
          for( j = 0, len_j = $bacthTrs.length; j<len_j; j++ ){
            $bacthTr = $bacthTrs.eq(j);
            smRealNumber += $bacthTr.find(CHECKEDBOX).prop('checked') ? 1 : 0;
          }
        }
      }
    }
    sm_obj.smRealNumber = smRealNumber;

    // 计算服务费的条件 状态大于0 小于 3
    if(sm_obj.smStatus > 0 && sm_obj.smStatus < 3){
      // 获取计费规则
      myFeesTempItem = zx.util.getMyfeestempItem({
        myfeestemp : configMap.people_model.getMyFeesTemp(stateMap.team.company), // 计费模板 obj
        teamType   : jqueryMap.$teamTypeTdDiv.text(),
        smtype     : Number(smType1 + smType2)
      });
      // 集合时间
      smSetTime = zx.util.getSetTime({
        flightDate      : sm_obj.flight.flightDate,
        smTime          : smTime,
        setTimeInputVal : setTimeInputVal
      });
      // 计算服务费
      sm_obj.fees = zx.util.countFees({
        myfeestempItem : myFeesTempItem,
        smRealNumber   : smRealNumber,
        smSetTime      : smSetTime,
        smDate         : sm_obj.flight.flightDate
      });
    }

    return sm_obj;
  };
  // End DOM method /getSm/
  
  // Begin DOM method /getBatch/
  getBatch = function($tr, type) {
    var batch_obj = $tr.data('batch_obj'),
        $batchFirstTd = $tr.children().first(),
        data_departure, data_return,
        isSm, isSmNote,
        ps, personObj, persons = [], $bacthTrs, 
        j, len_j, $bacthTr;

    batch_obj.batchNum = Number($batchFirstTd.find("span.batchNum").text());

    data_departure = $tr.data('dt_id');
    //batch_obj.departureTraffic = null;
    if(data_departure){
      if(batch_obj.departureTraffic){
        batch_obj.departureTraffic._id = data_departure;
      } else {
        batch_obj.departureTraffic = {
          _id : data_departure
        }
      }
    }

    data_return = $tr.data('rt_id');
    //batch_obj.returnTraffic = null;
    if(data_return){
      if(batch_obj.returnTraffic){
        batch_obj.returnTraffic._id = data_return;
      } else {
        batch_obj.returnTraffic = {
          _id : data_return
        }
      }
    }

    if(type.tp === 0) {
      // 团队单
      batch_obj.guest         = $batchFirstTd.find("div.guest").text();                               // 收客单位
      //batch_obj.teamBatchNote = zx.util_b.encodeHtml($batchFirstTd.find("div.teamBatchNote").html()); // 组备注
      batch_obj.teamBatchNote = $batchFirstTd.find("div.teamBatchNote").text(); // 组备注
    } else if (type.tp === 1) {
      // 送机单
      batch_obj.sendAgencyFund   = Number($batchFirstTd.find("div.smAgencyFund").text()) * (-100);
      batch_obj.sendAgencyFund_y = Number($batchFirstTd.find("div.smAgencyFund_y").text()) * (-100);
      batch_obj.sendPayment      = Number($batchFirstTd.find("div.smPayment").text()) * 100;
      batch_obj.sendPayment_y    = Number($batchFirstTd.find("div.smPayment_y").text()) * 100;
      //batch_obj.sendBatchNote    = zx.util_b.encodeHtml($batchFirstTd.find("div.smBatchNote").html());
      batch_obj.sendBatchNote    = $batchFirstTd.find("div.smBatchNote").text().trim();
    } else if (type.tp === 2) {
      // 接机单
      batch_obj.meetAgencyFund   = Number($batchFirstTd.find("div.smAgencyFund").text()) * (-100);
      batch_obj.meetAgencyFund_y = Number($batchFirstTd.find("div.smAgencyFund_y").text()) * (-100);
      batch_obj.meetPayment      = Number($batchFirstTd.find("div.smPayment").text()) * 100;
      batch_obj.meetPayment_y    = Number($batchFirstTd.find("div.smPayment_y").text()) * 100;
      //batch_obj.meetBatchNote    = zx.util_b.encodeHtml($batchFirstTd.find("div.smBatchNote").html());
      batch_obj.meetBatchNote    = $batchFirstTd.find("div.smBatchNote").text().trim();
    }
    
    // 送机接机单 判断 组 是否需要送机或接机
    isSm = false;
    // 送机接机单 判断 是否有行备注
    isSmNote = false;
    // person 信息
    ps = getPerson($tr, type.tp);
    personObj = ps.person;

    if((type.tp === 1 || type.tp === 2) && (isSm === false && ps.isSm === true)){
      isSm = true;
    }

    if((type.tp === 1 || type.tp === 2) && (isSmNote === false && ps.isSmPersonNote === true)){
      isSmNote = true;
    }

    persons.push(personObj);

    $bacthTrs = $tr.nextUntil('tr.tr_first');

    for( j = 0, len_j = $bacthTrs.length; j<len_j; j++ ){
      $bacthTr = $bacthTrs.eq(j);
      ps = getPerson($bacthTr, type.tp);
      personObj = ps.person;

      if((type.tp === 1 || type.tp === 2) && (isSm === false && ps.isSm === true)){
        isSm = true;
      }

      if((type.tp === 1 || type.tp === 2) && (isSmNote === false && ps.isSmPersonNote === true)){
        isSmNote = true;
      }

      persons.push(personObj);
    }

    if(isSm === false && (type.tp === 1 || type.tp === 2)){
      // 送机接机单 组 departureTraffic or returnTraffic isSm改false
      
      if(batch_obj.departureTraffic._id === type.sm_id) {
        batch_obj.departureTraffic.isSm = false;
      } else if (batch_obj.returnTraffic._id === type.sm_id) {
        batch_obj.returnTraffic.isSm = false;
      }

      if( type.tp === 1 ) {
        // 所有people的isSend 改 true 
        for( j = 0, len_j = persons.length; j < len_j; j++ ) {
          persons[j].isSend = true;
        }
      } else if ( type.tp === 2 ) {
        // 所有people的isMeet 改 true
        for( j = 0, len_j = persons.length; j < len_j; j++ ) {
          persons[j].isMeet = true;
        }
      }

    } 

    batch_obj.persons = persons; 
    
    if(isSmNote === false){
      if(type.tp === 1 && batch_obj.sendBatchNote !== '') {
        isSmNote = true;
      } else if(type.tp === 2 && batch_obj.meetBatchNote !== '') {
        isSmNote = true;
      }
    }

    //console.log(isSmNote);
    return {
      batch_obj : batch_obj,
      isSmNote  : isSmNote
    };
  }
  // End DOM method /getBatch/

  // Begin DOM method /getPerson/
  getPerson = function($tr, tp) {
    var isSm;
    var isSmPersonNote;
    var person;
    var name = $tr.find('td.nameTd').children().text().trim();
    var cardCategory = $tr.find('td.cardCategoryTd').children().first().text();

    if (cardCategory === '身份证') {
      name = name.replace(/\s/g, '');
    }

    person = {
      name           : name,         // 姓名
      cardNum        : $tr.find('td.cardNumTd').children().text(),      // 证件号码
      phone          : $tr.find('td.phoneTd').children().text(),        // 手机
      birthday       : $tr.find('td.birthdayTd').children().text(),     // 出生日期 （不用反馈）
      sex            : $tr.find('td.sexTd').children().first().text(),          // 性别 （不用反馈）
      cardCategory   : cardCategory, // 证件类型 （不用反馈）
      age            : Number($tr.find('td.ageTd').children().text()),  // 年龄 （不用反馈）
      ageType        : $tr.find('td.ageTypeTd').children().first().text(),      // 年龄段 （服务商只读）（不用反馈）
      room           : $tr.find('td.roomTd').children().text(),         // 分房 （服务商不需要）
      //teamPersonNote : zx.util_b.encodeHtml($tr.find('td.teamPersonNoteTd').children().html()), // 单人备注 （对服务商不可见）（不用反馈）
      //sendPersonNote : zx.util_b.encodeHtml($tr.find('td.sendPersonNoteTd').children().html()), // 送机备注
      teamPersonNote : $tr.find('td.teamPersonNoteTd').children().text(), // 单人备注 （对服务商不可见）（不用反馈）
      sendPersonNote : $tr.find('td.sendPersonNoteTd').children().text().trim(), // 送机备注
      isSend         : $tr.find('input.checkboxIsSend').prop('checked'),
      //meetPersonNote : zx.util_b.encodeHtml($tr.find('td.meetPersonNoteTd').children().html()), // 接机备注
      meetPersonNote : $tr.find('td.meetPersonNoteTd').children().text().trim(), // 接机备注
      isMeet         : $tr.find('input.checkboxIsMeet').prop('checked')
    };

    if (tp === 0) {
      return { person : person };
    } else if (tp === 1) {
      isSm = person.isSend;
      isSmPersonNote = person.sendPersonNote === '' ? false : true;
    } else if ( tp === 2) {
      isSm = person.isMeet;
      isSmPersonNote = person.meetPersonNote === '' ? false : true;
    }
    return { person : person, isSm : isSm,  isSmPersonNote : isSmPersonNote };
  };
  // End DOM method /getPerson/

  getAlidayu = function() {
    return stateMap.alidayu;
  };

  // Begin DOM method /newUserTable/
  newUserTable = function () {
    var $person_tr = 
          $(stateMap.person_tr_edit_html)
            .attr('id','bt1')
            .addClass('tr_first')
            .prepend(
              $(stateMap.person_first_td_edit_html)
                .find('span.batchNum').text(1)
              .end()
                .find('div.batchPersonCount').text(1)
              .end()
            )
            .find('td.snTd').text(1)
            .end(),
        $userTable = 
          $(stateMap.user_table_edit_html)
            .attr('id','us' + stateMap.us_id)
            .data('id',stateMap.us_id)
            .find('th.batchTh')
              .text(stateMap.name + '-' + stateMap.phone)
            .end();
            
    $userTable.find('tbody').append($person_tr);

    return $userTable;
  }
  // End DOM method /newUserTable/

  // Begin DOM method /batchNumChange/
  // 修改组号 ...1组...2组
  batchNumChange = function($trs, num) {
    var i, len, $tr, $firstTd, $span_batchNum, batchNum_new;

    len = $trs.length - 1;
    for(i = len; i >= 0; i--){
      $tr = $trs.eq(i);
      $firstTd = $tr.find('td.batch-td-rowspan');
      $span_batchNum = $firstTd.find('span.batchNum');
      batchNum_new = Number($span_batchNum.text()) + num;
      $span_batchNum.text( batchNum_new);
      /*$tr
        .attr('id','bt' + batchNum_new);*/
    }
  }
  // End DOM method /batchNumChange/
  
  // Begin DOM method /writeSN/
  // 写序号
  writeSN = function($table) {
    var i, len, $trs, $tr,
        $userTables = jqueryMap.$userBatchDiv.find('table.userTable');

    // 写序号
    $trs = $table.find('tbody').find('tr');
    len = $trs.length;
    for(i = 0; i < len; i++){
      $tr = $trs.eq(i);
      $tr.find('td.snTd').text(i + 1);
    }

    // 名单人数
    jqueryMap.$realNumberTd.text($userTables.find('tbody > tr').length);
  }
  // End DOM method /writeSN/

  // Begin DOM method /findFirstTr/
  findFirstTr = function($tr) {
    
    while(!$tr.hasClass('tr_first')){
      $tr = $tr.prev();
    }
    return $tr;
  }
  // End DOM method /findFirstTr/

  // Begin DOM method /removeUserTable/
  removeUserTable = function($table) {
    $table.remove();
  }
  // End DOM method /removeUserTable/

  // Begin DOM method /removeBatch/
  removeBatch = function($firstTr) {
    var $thatTable = $firstTr.closest('table'),
        $removeTrs, $nextAllFirstTrs;

    // 整个表格是否只有一组,删表
    if($thatTable.find('tr.tr_first').length === 1){
      removeUserTable($thatTable);
      return;
    }

    $removeTrs = $firstTr.nextUntil('tr.tr_first');
    $nextAllFirstTrs = $firstTr.nextAll('tr.tr_first');

    // 删组
    $firstTr.remove();
    $removeTrs.remove();

    // 删组之后修改后面的 batchNum
    if($nextAllFirstTrs.length !== 0){
      batchNumChange($nextAllFirstTrs, -1);
    }
  }
  // End DOM method /removeBatch/

  // Begin DOM method /removeFirstTr/
  removeFirstTr = function($firstTr) {
    var departureTraffic_sm = $firstTr.data('dt_id'),
        returnTraffic_sm = $firstTr.data('rt_id'),
        $firstTd = $firstTr.find('td.batch-td-rowspan'),
        rowspan  = Number($firstTd.attr('rowspan')),
        batchNum = Number($firstTd.find('span.batchNum').text()),
        $firstTrNext;

    $firstTd
      .attr('rowspan', rowspan - 1 )
      .find('div.batchPersonCount').text( rowspan- 1 );

    $firstTrNext = $firstTr.next();

    if(departureTraffic_sm){
      $firstTrNext.data('dt_id', departureTraffic_sm);
    }

    if(returnTraffic_sm){
      $firstTrNext.data('rt_id', returnTraffic_sm);
    }

    $firstTrNext
      .attr('id', $firstTr.attr('id'))
      .data('id', $firstTr.data('id'))
      .data('batch_obj', $firstTr.data('batch_obj'))
      .addClass('tr_first')
      .prepend($firstTd);

    $firstTr.remove();
  }
  // End DOM method /removeFirstTr/

  // Begin DOM method /removeTr/
  removeTr = function($tr) {
    var $firstTr = findFirstTr($tr),
        $firstTd = $firstTr.find('td.batch-td-rowspan'),
        rowspan  = Number($firstTd.attr('rowspan'));

    $firstTd
      .attr('rowspan', rowspan - 1 )
      .find('div.batchPersonCount').text( rowspan- 1 );

    $tr.remove();
  }
  // End DOM method /removeTr/

  // Begin DOM method /newMultiselect/
  newMultiselect = function($userBatchLi, index) {
    var DATA_SM = 'rt_id',
    li_us_id = $userBatchLi.data('us_id'),
    $userTables = jqueryMap.$userBatchDiv.find('table.userTable'),
    $utable, $userTable = null, i,
    $firstTrs, $firstTr, $firstTd, batchNum,
    o = "", select;

    if (index === 0) {
      DATA_SM = 'dt_id';
    }

    // 通过 us_id 寻找对应的 user
    for( i = 0; i < $userTables.length; i++ ) {
      $utable = $userTables.eq(i);
      //console.log($utable.data('id'));
      if($utable.data('id') === li_us_id){
        $userTable = $utable;
        break;
      }
    }

    // 请选择组
    if($userTable !== null){
      $firstTrs = $userTable.find('tr.tr_first');
      for( i = 0; i < $firstTrs.length; i++ ) {
        $firstTr = $firstTrs.eq(i);
        $firstTd = $firstTr.find('.batch-td-rowspan');
        batchNum = Number($firstTd.find('span.batchNum').text());
        //console.log(batchNum);
        o += '<option value=' + batchNum + '>' + batchNum + '</option>';
      }
    }

    select = '<select class="userBatchSelect" multiple="multiple">'+ o +'<select>';
    $userBatchLi.append(select);
    
    $userBatchLi.find('.userBatchSelect').multiselect({
      disableIfEmpty: true,
      nonSelectedText:'可多选',
      buttonClass: '',
      templates: {
        button: '<span class="multiselect dropdown-toggle" data-toggle="dropdown"></span>'
      },
      buttonText: function (options, select) {
        if (select.children().length === 0) {
          return '无可选项';
        } else {
          if (options.length === 0) {
            return '请选择组 <b class="caret"></b>';
          }
          else {
            var labels = [];
            options.each(function () {
              if ($(this).attr('label') !== undefined) {
                labels.push($(this).attr('label'));
              }
              else {
                labels.push('<span class="alert alert-info" role="alert">' + $(this).html() + '</span>');
              }
            });
            return labels.join(' ') + ' <b class="caret"></b>';
          }
        } 
      },
      includeSelectAllOption: true,
      selectAllText: '全选',
      onChange: function (option, checked) {
        var $select = this.$select,
            $DFpoint = $select.closest('.departureTraffics'),
            $elseDFpoint = $DFpoint.siblings(),
            smId = $DFpoint.find("input.smId").val();

        if ($(option).val() !== undefined) {
          if (checked) {
            // 去掉其它航班相同组 checked
            $elseDFpoint.find('.userBatchSelect').multiselect('deselect',[$(option).val()]);
            
            $("#batch" + $(option).val()).find(INPUT_SM).val(smId);
          } else {
            $("#batch" + $(option).val()).find(INPUT_SM).val("");
          }
        }
        else {
          var allOptions = $select.find("option");
          allOptions.each(function () {
            if (checked) {
              // 去掉其它航班相同组 checked
              $elseDFpoint.find('.userBatchSelect').multiselect('deselect', [$(this).html()]);

              $("#batch" + $(this).html()).find(INPUT_SM).val(smId);
            } else {
              $("#batch" + $(this).html()).find(INPUT_SM).val("");
            }
          });
        }
      }
    });
  }
  // End DOM method /newMultiselect/

  // Begin DOM method /updadeMultiselect/
  updadeMultiselect = function() {
    var $departureTraffics = $("#departureTraffics"),
        $returnTraffics = $("#returnTraffics"),
        $divBatch = $(".divBatch"),
        departureBatchArr = [],
        returnBatchArr = [];

    $.each($divBatch, function () {
      var $that = $(this),
          x = $that.data('bt'),
          departureTraffic_sm = $that.find("input.departureTraffic_sm").val(),
          returnTraffic_sm = $that.find("input.returnTraffic_sm").val();

      departureBatchArr.push({
        x: x,
        smId: departureTraffic_sm
      });

      returnBatchArr.push({
        x: x,
        smId: returnTraffic_sm
      });
    });

    // 更新
    var $departureDFpoint = $departureTraffics.find(".DFpoint"),
        $returnDFpoint = $returnTraffics.find(".DFpoint");

    $.each($departureDFpoint, function () {
        var $DFpoint = $(this);
        updadeThis($DFpoint, departureBatchArr);
    });

    $.each($returnDFpoint, function () {
        var $DFpoint = $(this);
        updadeThis($DFpoint, returnBatchArr);
    });

    function updadeThis($DFpoint, arr) {
      var $userBatchSelect = $DFpoint.find('.userBatchSelect'),
          smId = $DFpoint.find("input.smId").val(),
          o = "";   

      for (var i = 0; i < arr.length; i++) {
        var selected = "";
        if (smId !== "" && smId === arr[i].smId) {
            selected = " selected";
        }
        o += '<option value=' + arr[i].x + selected + '>' + arr[i].x + '</option>';
      }
      
      $userBatchSelect
        .html(o)
        .multiselect('rebuild');
    }
  }
  // End DOM method /updadeMultiselect/

  // Begin DOM method /updadeMultiselect/
  /*getFlightsFromNet = function( obj ) {
    
  }*/
  // End DOM method /updadeMultiselect/
  //---------------------- END DOM METHODS ---------------------
  

  //------------------- BEGIN EVENT HANDLERS -------------------

  /*on_paste_html_to_text = function(){
    console.log($(this).text());
  };*/

  // Begin Event handler /onComplete_saveTeamBtnPlusOrMinusOne/
  onComplete_saveTeamBtnPlusOrMinusOne = function(event, n) {
    // 参数 n 取值 为 1 或者 -1；
    var $that = $(this),
        isDisabled = $that.data('is_disabled');

    if(isDisabled){
      isDisabled += n;
    } else {
      isDisabled = n;
    }
    $that.data('is_disabled', isDisabled);

    if (isDisabled > 0) {
      $that.prop('disabled', true);
    } else {
      $that.prop('disabled', false);
    }
  };
  // End Event handler /onComplete_saveTeamBtnPlusOrMinusOne/


  // Begin Event handler /onComplete_getObjectIdFromServer/
  onComplete_getObjectIdFromServer = function( event, obj ){
    // XX -- id两字头 团tm 去dt 回rt 组bt
    var XX = (obj.id).substr(0,2),
        team_obj, sm_obj, batch_obj,
        $thisTr, prev_batch_obj,

        realNumber_old;

    $('#' + obj.id)
      .data('id',obj.oid)
      .attr('id', XX + obj.oid);
    
    // 团单
    if (obj.id === 'tm'){
      stateMap.tm_id = obj.oid;
      jqueryMap.$teamInfoTable = $('#tm' + obj.oid);

      team_obj = {
        _id         : obj.oid,
        user        : stateMap.us_id,
        company     : stateMap.company,
        companyAbbr : stateMap.companyAbbr,
        name        : stateMap.name,
        isOpen      : stateMap.isOpen
      }

      jqueryMap.$teamInfoTable.data('team_obj', team_obj);
    } 
    // 去程1
    else if (obj.id === 'dt1'){
      stateMap.dt_id = obj.oid;

      sm_obj = {
        _id             : obj.oid,
        user            : stateMap.us_id,
        company         : stateMap.company,
        companyAbbr     : stateMap.companyAbbr,
        name            : stateMap.name,
        isOpen          : stateMap.isOpen, // Boolean
        team            : stateMap.tm_id,
        //smType2         : 1,
        //flight          : null,
        //smRealNumber    : 1,
        //smTimeSpace     : 120,
        //smNote          : '',
        smStatus        : 0
        //smServer        : ''
      }

      $('#dt' + obj.oid).data('sm_obj', sm_obj);

      if(stateMap.bt_id !== ''){
        $('#bt' + stateMap.bt_id).data('dt_id',stateMap.dt_id);
      }
    }
    // 回程1
    else if (obj.id === 'rt1'){
      stateMap.rt_id = obj.oid;

      sm_obj = {
        _id         : obj.oid,
        user        : stateMap.us_id,
        company     : stateMap.company,
        companyAbbr : stateMap.companyAbbr,
        name        : stateMap.name,
        isOpen      : stateMap.isOpen, // Boolean
        team        : stateMap.tm_id,
        smStatus    : 0
      }

      $('#rt' + obj.oid).data('sm_obj', sm_obj);


      if(stateMap.bt_id !== ''){
        $('#bt' + stateMap.bt_id).data('rt_id',stateMap.rt_id);
      }
    }
    // 组
    else if (XX === 'bt'){
      // 组1
      if (obj.id === 'bt1'){
        stateMap.bt_id = obj.oid;

        batch_obj = {
          _id  : obj.oid,
          user : stateMap.us_id,
          team : stateMap.tm_id
        }

        $('#bt' + obj.oid).data('batch_obj', batch_obj);

        // 名单人数
        realNumber_old = Number(jqueryMap.$realNumberTd.text());
        jqueryMap.$realNumberTd.text(realNumber_old + 1);
      }
      else {
        $thisTr        = $('#bt' + obj.oid);
        prev_batch_obj = $thisTr.prevAll('tr.tr_first').first().data('batch_obj');
        batch_obj = {
          _id  : obj.oid,
          user : prev_batch_obj.user,
          team : prev_batch_obj.team
        }
        $thisTr.data('batch_obj', batch_obj);
      }


      if(stateMap.rt_id !== ''){
        $('#bt' + obj.oid).data('rt_id',stateMap.rt_id);
      }

      if(stateMap.dt_id !== ''){
        $('#bt' + obj.oid).data('dt_id',stateMap.dt_id);
      }
    }

    $.gevent.publish( 'zx-saveTeamBtnPlusOrMinusOne', -1);
  };
  // End Event handler /onComplete_getObjectIdFromServer/

  /*// Begin Event handler /onComplete_trafficTableIsAlready/
  onComplete_trafficTableIsAlready = function( event, n ){
    // 参数 n 取值 为 1, 当 isAlready 为 2 时，说明航班信息已经准备好了，可以开始渲染组信息
    var $that = $(this),
        isAlready = $that.data('is_already');

    if(isAlready){
      isAlready += n;
    } else {
      isAlready = n;
    }
    $that.data('is_already', isAlready);

    if (isAlready === 2) {
      // 开始渲染组信息
      
    }
  };
  // End Event handler /onComplete_trafficTableIsAlready/*/

  // Begin Event handler /onCompleteGetlist/
  onCompleteGetlist = function( event, results ) {
    var that = results[0].obj.that || '',
        $that,
        itemArr,
        $parent,
        i, itemObj, $ul, $iteamLi,
        defaultFlag;

    if(that){
      $that = jqueryMap['$' + that];
      itemArr = results[0].results;
      $parent = $that.parent();

      $ul = $(configMap.dropdown_ul_html).css('min-width',110);

      switch(that){
        case 'guest' :
          if( !$parent.hasClass('dropdown') ) {
            for( i = 0; i < itemArr.length; i++ ) {
              itemObj = itemArr[i];
              $iteamLi = $(configMap.dropdown_li_html);
              $iteamLi.children().text(itemObj.companyAbbr);
              $ul.append($iteamLi);
            }
            $ul.append("<p class='list-group-item text-right text-primary' style='padding:4px 15px;cursor: pointer;'><span class='newGuest' data-company=" + stateMap.company + ">添加收客单位<span></p>");

            $parent
              .addClass('dropdown')
              .children()
                .attr('data-toggle','dropdown')
                .after($ul);
                
            $parent.find('li').click(function(){
                $that.text($(this).text());
            });

            $parent.find('.newGuest').click(function(){
              var company = $(this).data('company');

              zx.modal.initModule({
                size      : 'modal-sm',
                $title    : $('<h4 class="modal-title">添加收客单位</h4>'),
                formClass : 'form-newGuest',
                main_html : String()
                  + '<input value="' + company + '" name="guest[company]" type="hidden"></input>'
                  + '<div class="form-group">'
                    + '<label class="col-sm-4 control-label">*单位简称</label>'
                    + '<div class="col-sm-8">'
                      + '<input tabindex="1" name="guest[companyAbbr]" class="zx-register-form-companyAbbr-input form-control" type="text" placeholder="2 ~ 8 个字符" required></input>'
                    + '</div>'
                  + '</div>'
                  + '<div class="form-group">'
                    + '<label class="col-sm-4 control-label">* 姓名</label>'
                    + '<div class="col-sm-8">'
                      + '<input tabindex="2" name="guest[name]" class="form-control" type="text" placeholder="2 ~ 4 个中文字符" required autofocus></input>'
                    + '</div>'
                  + '</div>'
                  + '<div class="form-group">'
                    + '<label class="col-sm-4 control-label">* 手机</label>'
                    + '<div class="col-sm-8">'
                      + '<input tabindex="3" name="guest[phone]" class="form-control" type="text" placeholder="11位有效号码" required></input>'
                    + '</div>'
                  + '</div>'
                  + '<div class="zx-form-errors"></div>',
                callbackFunction : function(modalJqueryMap){
                  var fieldArr,fieldObj = {},guestObj = {},
                      formValidation =modalJqueryMap.$modalForm.data('formValidation');

                  formValidation.validate();
                  if(formValidation.isValid()){
                    modalJqueryMap.$submitBtn
                      .text( '正在添加收客单位...' )
                      .prop( 'disabled', true );
                    modalJqueryMap.$cancelBtn.prop( 'disabled', true );
                    fieldArr = modalJqueryMap.$modalForm.serializeArray();
                    $.each(fieldArr,function(){
                      fieldObj[this.name] = this.value;
                    });
                    guestObj.company     = fieldObj['guest[company]']; // 公司 ID
                    guestObj.companyAbbr = fieldObj['guest[companyAbbr]'];    // 公司简称
                    guestObj.name        = fieldObj['guest[name]'];    // 姓名
                    guestObj.phone       = fieldObj['guest[phone]'];   // 手机

                    zx.model.guest.newGuest(guestObj);
                  }
                }
              });
            });
          }
          break;
        case 'operatorTdDiv':
          if( !$parent.hasClass('dropdown') ) {
            for( i = 0; i < itemArr.length; i++ ) {
              itemObj = itemArr[i];
              $iteamLi = $(configMap.dropdown_li_html);
              $iteamLi.children().text(itemObj.companyAbbr + itemObj.name + itemObj.phone);
              $ul.append($iteamLi);
            }
            $ul.append("<p class='list-group-item text-right text-primary' style='padding:4px 15px;cursor: pointer;'><span class='newOperator' data-company=" + stateMap.company + ">添加操作人<span></p>");

            $parent
              .addClass('dropdown')
              .children()
                .attr('data-toggle','dropdown')
                .after($ul);
                
            $parent.find('li').click(function(){
                $that.text($(this).text());
            });

            $parent.find('.newOperator').click(function(){
              var company = $(this).data('company');

              zx.modal.initModule({
                size      : 'modal-sm',
                $title    : $('<h4 class="modal-title">添加团队操作人</h4>'),
                formClass : 'form-newOperator',
                main_html : String()
                  + '<input value="' + company + '" name="operator[company]" type="hidden"></input>'
                  + '<div class="form-group">'
                    + '<label class="col-sm-4 control-label">*公司简称</label>'
                    + '<div class="col-sm-8">'
                      + '<input value="' + stateMap.companyAbbr + '" tabindex="1" name="operator[companyAbbr]" class="zx-register-form-companyAbbr-input form-control" type="text" placeholder="2 ~ 8 个字符" required></input>'
                    + '</div>'
                  + '</div>'
                  + '<div class="form-group">'
                    + '<label class="col-sm-4 control-label">* 姓名</label>'
                    + '<div class="col-sm-8">'
                      + '<input tabindex="2" name="operator[name]" class="form-control" type="text" placeholder="2 ~ 4 个中文字符" required autofocus></input>'
                    + '</div>'
                  + '</div>'
                  + '<div class="form-group">'
                    + '<label class="col-sm-4 control-label">* 手机</label>'
                    + '<div class="col-sm-8">'
                      + '<input tabindex="3" name="operator[phone]" class="form-control" type="text" placeholder="11位有效号码" required></input>'
                    + '</div>'
                  + '</div>'
                  + '<div class="zx-form-errors"></div>',
                callbackFunction : function(modalJqueryMap){
                  var fieldArr,fieldObj = {},operatorObj = {},
                      formValidation =modalJqueryMap.$modalForm.data('formValidation');

                  formValidation.validate();
                  if(formValidation.isValid()){
                    modalJqueryMap.$submitBtn
                      .text( '正在添加团队操作人...' )
                      .prop( 'disabled', true );
                    modalJqueryMap.$cancelBtn.prop( 'disabled', true );
                    fieldArr = modalJqueryMap.$modalForm.serializeArray();
                    $.each(fieldArr,function(){
                      fieldObj[this.name] = this.value;
                    });
                    operatorObj.company     = fieldObj['operator[company]']; // 公司 ID
                    operatorObj.companyAbbr = fieldObj['operator[companyAbbr]'];    // 公司简称
                    operatorObj.name        = fieldObj['operator[name]'];    // 姓名
                    operatorObj.phone       = fieldObj['operator[phone]'];   // 手机

                    zx.model.operator.newOperator(operatorObj);
                  }
                }
              });
            });
          }
          break;
        case 'guideTdDiv':
          if( !$parent.hasClass('dropdown') ){
            for( i = 0; i < itemArr.length; i++ ){
              itemObj = itemArr[i];
              $iteamLi = $(configMap.dropdown_li_html);
              $iteamLi.children().text(itemObj.name + '(' + itemObj.sex + ')' + itemObj.phone);
              $ul.append($iteamLi);
            }
            $ul.append("<p class='list-group-item text-right text-primary' style='padding:4px 15px;cursor: pointer;'><span class='newGuide' data-company=" + stateMap.company + ">添加地接人员<span></p>");
            
            $parent
              .addClass('dropdown')
              .children()
                .attr('data-toggle','dropdown')
                .after($ul);
                
            $parent.find('li').click(function(){
                $that.text($(this).text());
            });

            $parent.find('.newGuide').click(function(){
              var company = $(this).data('company');

              zx.modal.initModule({
                size      : 'modal-sm',
                $title    : $('<h4 class="modal-title">添加地接人员</h4>'),
                formClass : 'form-newGuide',
                main_html : String()
                  + '<input value="' + company + '" name="guide[company]" type="hidden"></input>'
                  + '<div class="form-group">'
                    + '<label class="col-sm-4 control-label">* 姓名</label>'
                    + '<div class="col-sm-8">'
                      + '<input tabindex="1" name="guide[name]" class="form-control" type="text" placeholder="2 ~ 4 个中文字符" required autofocus></input>'
                    + '</div>'
                  + '</div>'
                  + '<div class="form-group">'
                    + '<label class="col-sm-4 control-label">* 性别</label>'
                    + '<div class="col-sm-8">'
                      + '<select class="form-control" name="guide[sex]">'
                        + '<option value="男">男</option>'
                        + '<option value="女">女</option>'
                      + '</select>'
                    + '</div>'
                  + '</div>'
                  + '<div class="form-group">'
                    + '<label class="col-sm-4 control-label">* 手机</label>'
                    + '<div class="col-sm-8">'
                      + '<input tabindex="2" name="guide[phone]" class="form-control" type="text" placeholder="11位有效号码" required></input>'
                    + '</div>'
                  + '</div>'
                  + '<div class="zx-form-errors"></div>',
                callbackFunction : function(modalJqueryMap){
                  var fieldArr,fieldObj = {},guideObj = {},
                      formValidation =modalJqueryMap.$modalForm.data('formValidation');

                  formValidation.validate();
                  if(formValidation.isValid()){
                    modalJqueryMap.$submitBtn
                      .text( '正在添加地接人员...' )
                      .prop( 'disabled', true );
                    modalJqueryMap.$cancelBtn.prop( 'disabled', true );
                    fieldArr = modalJqueryMap.$modalForm.serializeArray();
                    $.each(fieldArr,function(){
                      fieldObj[this.name] = this.value;
                    });
                    guideObj.company = fieldObj['guide[company]']; // 公司 ID
                    guideObj.name    = fieldObj['guide[name]'];    // 姓名
                    guideObj.sex     = fieldObj['guide[sex]'];     // 性别
                    guideObj.phone   = fieldObj['guide[phone]'];   // 手机

                    zx.model.guide.newGuide(guideObj);
                  }
                }
              });
            });
          }
          break;
        case 'setDefaultFlagBtn':
          var option_html = '';

          for( i = 0; i < itemArr.length; i++ ){
            itemObj = itemArr[i];
            option_html += '<option>"' + itemObj.name + '"' + itemObj.color + '导游旗</option>';
          }

          defaultFlag = configMap.people_model.get_user().defaultFlag;
          //console.log(defaultFlag);
          if(typeof defaultFlag === 'undefined' || defaultFlag === 'undefined') {
            defaultFlag = '';
          }
          //console.log(typeof defaultFlag);
          zx.modal.initModule({
            //size      : 'modal-sm',
            $title    : $('<h4 class="modal-title">设置默认导游旗</h4>'),
            formClass : 'form-setDefaultFlag',
            main_html : String()
              + '<div class="form-group">'
                + '<label class="col-sm-4 control-label">当前默认导游旗</label>'
                + '<div class="col-sm-8">'
                  + '<label class="control-label">' + defaultFlag + '</label>'
                + '</div>'
              + '</div>'
              + '<div class="form-group">'
                + '<label class="col-sm-4 control-label">重设默认导游旗</label>'
                + '<div class="col-sm-8">'
                  + '<select id="defaultFlagSelect" class="form-control">'
                    + '<option>无</option>'
                    + option_html
                  + '</select>'
                + '</div>'
              + '</div>',
            callbackFunction : function(modalJqueryMap){
              var userObj = {};

              modalJqueryMap.$submitBtn
                .text( '正在设置默认导游旗...' )
                .prop( 'disabled', true );
              modalJqueryMap.$cancelBtn.prop( 'disabled', true );

              userObj.defaultFlag = $('#defaultFlagSelect').val();
              userObj._id         = stateMap.us_id;

              zx.model.people.setDefaultFlag(userObj);
            }
          });
          break;
        case 'smFlagTdDiv':
        case 'sendDestinationFlagTdDiv':
          if( !$parent.hasClass('dropdown') ){

            $iteamLi = $(configMap.dropdown_li_html);
            $iteamLi.children().text('无');
            $ul.append($iteamLi);

            for( i = 0; i < itemArr.length; i++ ){
              itemObj = itemArr[i];
              $iteamLi = $(configMap.dropdown_li_html);
              $iteamLi.children().text('"' + itemObj.name + '"' + itemObj.color + '导游旗');
              $ul.append($iteamLi);
            }
            $ul.append("<p class='list-group-item text-right text-primary' style='padding:4px 15px;cursor: pointer;'><span class='newFlag' data-company=" + stateMap.company + ">添加导游旗<span></p>");
            
            $parent
              .addClass('dropdown')
              .children()
                .attr('data-toggle','dropdown')
                .after($ul);
                
            $parent.find('li').click(function(){
                $that.text($(this).text());
            });

            $parent.find('.newFlag').click(function(){
              var company = $(this).data('company');

              zx.modal.initModule({
                $title    : $('<h4 class="modal-title">添加导游旗</h4>'),
                formClass : 'form-newFlag',
                main_html : String()
                  + '<input value="' + company + '" name="flag[company]" type="hidden"></input>'
                  + '<div class="form-group">'
                    + '<label class="col-sm-3 control-label">* 旗号</label>'
                    + '<div class="col-sm-9">'
                      + '<input tabindex="1" name="flag[name]" class="form-control" type="text" placeholder="2 ~ 15 个字符" required autofocus></input>'
                    + '</div>'
                  + '</div>'
                  + '<div class="form-group">'
                    + '<label class="col-sm-3 control-label">* 颜色</label>'
                    + '<div class="col-sm-7">'
                      + '<input tabindex="2" name="flag[color]" class="form-control" type="text" placeholder="2 ~ 15 个字符" required></input>'
                    + '</div>'
                    + '<div class="col-sm-2">导游旗</div>'
                  + '</div>'
                  + '<div class="zx-form-errors"></div>',
                callbackFunction : function(modalJqueryMap){
                  var fieldArr,fieldObj = {},flagObj = {},
                      formValidation =modalJqueryMap.$modalForm.data('formValidation');

                  formValidation.validate();
                  if(formValidation.isValid()){
                    modalJqueryMap.$submitBtn
                      .text( '正在添加导游旗...' )
                      .prop( 'disabled', true );
                    modalJqueryMap.$cancelBtn.prop( 'disabled', true );
                    fieldArr = modalJqueryMap.$modalForm.serializeArray();
                    $.each(fieldArr,function(){
                      fieldObj[this.name] = this.value;
                    });
                    flagObj.company     = fieldObj['flag[company]']; // 公司 ID
                    flagObj.name     = fieldObj['flag[name]'];    // 旗子名称
                    flagObj.color = fieldObj['flag[color]'];   // 旗子颜色

                    zx.model.flag.newFlag(flagObj);
                  }   
                }
              });
            });
          }
          break;
        case 'serverMan' : 
          if( !$parent.hasClass('dropdown') ) {
            //console.log(itemArr); guest
            for( i = 0; i < itemArr.length; i++ ) {
              itemObj = itemArr[i];
              $iteamLi = $(configMap.dropdown_li_html);
              $iteamLi.children().text(itemObj.name);
              $ul.append($iteamLi);
            }
            $ul.append("<p class='list-group-item text-right text-primary' style='padding:4px 15px;cursor: pointer;'><span class='newServerman' data-company=" + stateMap.company + ">添加责任人<span></p>");

            $parent
              .addClass('dropdown')
              .children()
                .attr('data-toggle','dropdown')
                .after($ul);
                
            $parent.find('li').click(function(){
                $that.text($(this).text());
            });

            $parent.find('.newServerman').click(function(){
              var company = stateMap.company;

              zx.modal.initModule({
                size      : 'modal-sm',
                $title    : $('<h4 class="modal-title">添加现场责任人</h4>'),
                formClass : 'form-newServerman',
                main_html : String()
                  + '<input value="' + company + '" name="serverman[company]" type="hidden"></input>'
                  + '<div class="form-group">'
                    + '<label class="col-sm-3 control-label">* 姓名</label>'
                    + '<div class="col-sm-9">'
                      + '<input tabindex="1" name="serverman[name]" class="form-control" type="text" placeholder="2 ~ 15 个字符" required autofocus></input>'
                    + '</div>'
                  + '</div>'
                  + '<div class="zx-form-errors"></div>',
                callbackFunction : function(modalJqueryMap){
                  var fieldArr,fieldObj = {},servermanObj = {},
                      formValidation =modalJqueryMap.$modalForm.data('formValidation');

                  formValidation.validate();
                  if(formValidation.isValid()){
                    modalJqueryMap.$submitBtn
                      .text( '正在添加现场责任人...' )
                      .attr( 'disabled', true );
                    modalJqueryMap.$cancelBtn.attr( 'disabled', true );
                    fieldArr = modalJqueryMap.$modalForm.serializeArray();
                    $.each(fieldArr,function(){
                      fieldObj[this.name] = this.value;
                    });
                    servermanObj.company     = fieldObj['serverman[company]']; // 公司 ID
                    servermanObj.name     = fieldObj['serverman[name]'];    // 姓名

                    zx.model.serverman.newServerman(servermanObj);
                  }   
                }
              });
            });
          }
          break;
      }
    }
  };
  // End Event handler /onCompleteGetlist/

  // Begin Event handler /on_hidden_td_dropdown/
  on_hidden_td_dropdown = function () {
    var $that = $(this),
            $TdDiv = $that.children().eq(0);

        $that.removeClass('dropdown');
        $TdDiv
          .removeAttr('data-toggle')
          .removeAttr('aria-expanded')
          .nextAll().remove();
  };
  // End Event handler /on_hidden_td_dropdown/
  
  // Begin Event handler /on_smFlagTdDiv_focus/
  on_smFlagTdDiv_focus = function () {
    var $parent = $(this).parent();

    if( !$parent.hasClass('dropdown') ){
      configMap.list_model.getlist({
        company : stateMap.company,
        c: "flag", 
        that: 'smFlagTdDiv' 
      });
    }
  };
  // End Event handler /on_smFlagTdDiv_focus/

  on_setDefaultFlagBtn_click = function() {
    // 异步获取本公司所有 flag;
    configMap.list_model.getlist({
      company : stateMap.company,
      c: "flag", 
      that: 'setDefaultFlagBtn' 
    });
  };

  // Begin Event handler /on_sendDestinationFlagTdDiv_focus/
  on_sendDestinationFlagTdDiv_focus = function () {
    var $parent = $(this).parent();

    if( !$parent.hasClass('dropdown') ){
      configMap.list_model.getlist({
        company : stateMap.company,
        c: "flag", 
        that: 'sendDestinationFlagTdDiv' 
      });
    }
  };
  // End Event handler /on_sendDestinationFlagTdDiv_focus/

  // Begin Event handler /on_guideTdDiv_focus/
  on_guideTdDiv_focus = function () {
    var $parent = $(this).parent();

    if( !$parent.hasClass('dropdown') ){
      configMap.list_model.getlist({
        company : stateMap.company,
        c: "guide", 
        that: 'guideTdDiv' 
      });
    }
  };
  // End Event handler /on_guideTdDiv_focus/

  // Begin Event handler /on_operatorTdDiv_focus/
  on_operatorTdDiv_focus = function () {
    var $parent = $(this).parent();
    
    if( !$parent.hasClass('dropdown') ){
      configMap.list_model.getlist({ 
        company : stateMap.company,
        c: "operator", 
        that: 'operatorTdDiv' 
      });
    }
  };
  // End Event handler /on_operatorTdDiv_focus/

  // Begin Event handler /on_operatorTdDiv_focus/
  // 操作员字段获取焦点，向 model 请求 操作员列表
  /*on_operatorTdDiv_focus = function () {
    console.log(configMap);
    $.gevent.subscribe( jqueryMap.$team, 'zx-completeGetlist', onCompleteGetlist );
    configMap.list_model.getList({ c: "operator" });
  };*/
  // End Event handler /on_operatorTdDiv_focus/
  
  // Begin Event handler /on_smType2TdDiv_focus/
  // 送机接机类型字段获取焦点
  on_smType2TdDiv_focus = function () {
    var flightDate = jqueryMap.$smSetTimeDiv.data('flightdate'),
        $that = $(this),
        dropdown = $that.data('dropdown'),
        
        $teamTypeTd = $that.parent();

    if( !$teamTypeTd.hasClass('dropdown') ){
      $teamTypeTd
        .addClass('dropdown')
          .children()
            .attr('data-toggle','dropdown')
            .after(
              $(configMap.dropdown_ul_html)
                .css('min-width', 60)
                .append(
                  $(configMap.dropdown_li_html)
                    //.data('sm_type2', 1)
                    .children()
                      .text(dropdown[0])
                    .end()
                )
                .append(
                  $(configMap.dropdown_li_html)
                    //.data('sm_type2', 2)
                    .children()
                      .text(dropdown[1])
                    .end()
                )
            );
            
      $teamTypeTd.find('li').click(function(){
        var $li     = $(this),
            textStr = $li.children().text(),
            setplace_text = zx.config.getConfigMapItem('setplace_text'),
            myFeesTempItem, fees;

        $that
          .text(textStr);
          //.data('sm_type2', $li.data('sm_type2'));

        if(textStr === '机场内送机' || textStr === '机场内接机'){

          jqueryMap.$smServerTdDiv.text(setplace_text[jqueryMap.$smSetPlaceTd.text()] || '待定');
        } else {

          jqueryMap.$smServerTdDiv.text('待定');
        }

        // 获取计费规则
        myFeesTempItem = zx.util.getMyfeestempItem({
          myfeestemp : configMap.people_model.getMyFeesTemp(stateMap.team.company), // 计费模板 obj
          teamType   : jqueryMap.$teamTypeTdDiv.text(),
          smtype     : zx.util.getSmTypeFromStr(textStr)
        });
        // 计算服务费
        //console.log($('#smSetTimeInput').val());
        fees = zx.util.countFees({
          myfeestempItem : myFeesTempItem,
          smRealNumber   : Number(jqueryMap.$smRealNumberTd.text()),
          smSetTime      : $('#smSetTimeInput').val(),
          smDate         : flightDate
        });

        $('#fees').text(fees / 100);

      });
    }
  };
  // End Event handler /on_smType2TdDiv_focus/

  // Begin Event handler /on_teamTypeTdDiv_focus/
  // 团队类型字段获取焦点
  on_teamTypeTdDiv_focus = function () { 
    var $that = $(this),
        $teamTypeTd = $that.parent();

    if( !$teamTypeTd.hasClass('dropdown') ){
      $teamTypeTd
        .addClass('dropdown')
          .children()
            .attr('data-toggle','dropdown')
            .after(
              $(configMap.dropdown_ul_html)
                .css('min-width', 60)
                .append(
                  $(configMap.dropdown_li_html)
                    .children().text('散拼')
                    .end()
                )
                .append(
                  $(configMap.dropdown_li_html)
                    .children().text('包团')
                    .end()
                )
            );
            
      $teamTypeTd.find('li').click(function(){
        $that.text($(this).text());
      });
    }
  };
  // End Event handler /on_teamTypeTdDiv_focus/
  
  // Begin Event handler /on_flightDate_focus/
  /*on_flightDate_focus = function () {
    $(this).datetimepicker({
      format: 'YYYY-MM-DD',
      dayViewHeaderFormat: 'YYYY MMMM',
      useCurrent: false,
      locale: 'zh-cn',
      showTodayButton: true,
      showClear: true
    });
  };*/
  // End Event handler /on_flightDate_focus/

  // Begin Event handler /on_flightTime_focus/
  /*on_flightTime_focus = function () {
    $(this).datetimepicker({
      format: 'HH:mm',
      useCurrent: false
    });
  };*/
  // End Event handler /on_flightTime_focus/

  // Begin Event handler /on_flightNumTdDiv_blur/
  on_flightNumTdDiv_blur = function () {
    var $that = $(this);
      
    $that.text($that.text().trim().toUpperCase());
  };    
  // End Event handler /on_flightNumTdDiv_blur/

  /*// Begin Event handler /on_flightCityTdDiv_blur/
  on_flightCityTdDiv_blur = function () {
    //console.log('dd');
    var $that = $(this), 
        thatText = $that.text().trim();

    if (thatText.indexOf("深") >= 0 && thatText.indexOf("圳") >= 0) {
      $that.text("深圳");
    } else {
      $that.text(thatText)
    }
  };
  // End Event handler /on_flightCityTdDiv_blur/*/

  // Begin Event handler /on_refreshBtn_click/
  on_refreshBtn_click = function () {
    var $that = $(this),
        $tr = $that.closest('tr'),
        id  = $tr.attr('id'),
        obj = {
          $flightNum     : $tr.find('td.flightNumTd').children(),
          $flightDate    : $tr.find("td.flightDateTd").find('input'),
          $startCity     : $tr.find("td.flightStartCityTd").children(),
          $endCity       : $tr.find("td.flightEndCityTd").children(),
          $startTime     : $tr.find("td.flightStartTimeTd").find('input'),
          $endTime       : $tr.find("td.flightEndTimeTd").find('input'),
          $flightBacthTd : $tr.find("td.flightBacthTd")
        },
        flightDate = obj.$flightDate.val(),
        flightNum = obj.$flightNum.text(),
        flightObj;

    /*// 初始化，把相关值清空
    obj.$startCity.text("");
    obj.$endCity.text("");
    obj.$startTime.val("");
    obj.$endTime.val("");
*/
    // 如果日期为空或航班号长度小于5，则结束此函数
    if (flightDate == "" || flightNum.length < 5) {
      alert('请检查航班日期和航班号是否有误。');
      return;
    }

    
    $that.prop('disabled', true);

    obj.$flightBacthTd.text('搜索中...');

    flightObj = {
      id         : id,
      flightNum  : flightNum,
      flightDate : flightDate
    };

    configMap.team_model.getFlightInfoFromServer(flightObj);
  }
  // End Event handler /on_refreshBtn_click/

  // Begin Event handler /onComplete_getFlightInfoFromServer/
  onComplete_getFlightInfoFromServer = function (event, result) {
    //console.log(result);
    var
      CITY = stateMap.city,
      $tr = $('#' + result.id),
      sm_obj = $tr.data('sm_obj'),
      flightInfo = result.flightInfo;

    //console.log(result);
    // 已检验
    if(result.success === 1){
      if(flightInfo.length == 1) {
        $tr.find('td.flightStartCityTd').children().text(flightInfo[0].flightStartCity);
        $tr.find("td.flightEndCityTd").children().text(flightInfo[0].flightEndCity);
        $tr.find("td.flightStartTimeTd").find('input').val(flightInfo[0].flightStartTime);
        $tr.find("td.flightEndTimeTd").find('input').val(flightInfo[0].flightEndTime);

        $tr.find('td.flightBacthTd').text("");
      } else {
        zx.modal.initModule({
          size      : 'modal-sm',
          $title    : $('<h4 class="modal-title">请选择航班</h4>'),
          formClass : 'form-selectFlight',
          main_html : String()
            + '<ul id="flightInfoUl" class="list-group">'
              + '<li class="flightInfoItem list-group-item">'
                + '<input style="margin-right:10px;" class="flightInfoRadio" type="radio" name="flightInfoRadios" value="0" checked></input>'
                + flightInfo[0].flightStartCity + '-' + flightInfo[0].flightEndCity + '&nbsp;' + flightInfo[0].flightStartTime + '-' + flightInfo[0].flightEndTime
              + '</li>'
              + '<li class="flightInfoItem list-group-item">'
                + '<input style="margin-right:10px;" class="flightInfoRadio" type="radio" name="flightInfoRadios" value="1"></input>'
                + flightInfo[1].flightStartCity + '-' + flightInfo[1].flightEndCity + '&nbsp;' + flightInfo[1].flightStartTime + '-' + flightInfo[1].flightEndTime
              + '</li>'
              + '<li class="flightInfoItem list-group-item">'
                + '<input style="margin-right:10px;" class="flightInfoRadio" type="radio" name="flightInfoRadios" value="2"></input>'
                + flightInfo[2].flightStartCity + '-' + flightInfo[2].flightEndCity + '&nbsp;' + flightInfo[2].flightStartTime + '-' + flightInfo[2].flightEndTime
              + '</li>'
            + '</ul>',
          callbackFunction : function(){
            var item = $("input.flightInfoRadio:checked").val();
            $tr.find('td.flightStartCityTd').children().text(flightInfo[item].flightStartCity);
            $tr.find("td.flightEndCityTd").children().text(flightInfo[item].flightEndCity);
            $tr.find("td.flightStartTimeTd").find('input').val(flightInfo[item].flightStartTime);
            $tr.find("td.flightEndTimeTd").find('input').val(flightInfo[item].flightEndTime);
            
            $('.zx-modal').modal('hide');

            if(sm_obj.smStatus > 0){
              if(sm_obj.flight.flightStartCity === CITY){
                if(flightInfo[item].flightStartCity !== CITY){
                  alert('该航班始发地与关联送机单的始发地不符, \n如果确定修改请先删除关联的送机单。');
                  $tr.find('td.flightNumTd').children().text(sm_obj.flight.flightNum);
                  $tr.find('td.flightStartCityTd').children().text(sm_obj.flight.flightStartCity);
                  $tr.find("td.flightEndCityTd").children().text(sm_obj.flight.flightEndCity);
                  $tr.find("td.flightStartTimeTd").find('input').val(sm_obj.flight.flightStartTime);
                  $tr.find("td.flightEndTimeTd").find('input').val(sm_obj.flight.flightEndTime);
                }
              } else if(sm_obj.flight.flightEndCity.indexOf(CITY) === 0) {
                if(flightInfo[item].flightEndCity.indexOf(CITY) !== 0){
                  alert('该航班抵达地与关联接机单的抵达地不符, \n如果确定修改请先删除关联的接机单。');
                  $tr.find('td.flightNumTd').children().text(sm_obj.flight.flightNum);
                  $tr.find('td.flightStartCityTd').children().text(sm_obj.flight.flightStartCity);
                  $tr.find("td.flightEndCityTd").children().text(sm_obj.flight.flightEndCity);
                  $tr.find("td.flightStartTimeTd").find('input').val(sm_obj.flight.flightStartTime);
                  $tr.find("td.flightEndTimeTd").find('input').val(sm_obj.flight.flightEndTime);
                }
              }
            }
          }
        });
      }
    } else {
      alert('抱歉，没有找到对应航班！');
      
      $tr.find('td.flightBacthTd').text("");

      if(sm_obj.smStatus > 0){
        $tr.find('td.flightNumTd').children().text(sm_obj.flight.flightNum);
        $tr.find('td.flightStartCityTd').children().text(sm_obj.flight.flightStartCity);
        $tr.find("td.flightEndCityTd").children().text(sm_obj.flight.flightEndCity);
        $tr.find("td.flightStartTimeTd").find('input').val(sm_obj.flight.flightStartTime);
        $tr.find("td.flightEndTimeTd").find('input').val(sm_obj.flight.flightEndTime);
      }
    }

    $tr.find('button.refreshBtn').prop('disabled',false);
  }
  // End Event handler /onComplete_getFlightInfoFromServer/

  // 证件号码 手机号码 出生日期 年龄 失去焦点时验证
  on_cardNumTd_blur = function(){
    var $that = $(this),
        $that_children_first = $that.children(':first'),
        cardNum = $that_children_first.text(),
        $person_tr, $birthdayTd, $sexTd, $cardCategoryTd, $ageTd, $ageTypeTd,
        year, birth, sex, age, ageType;

    $that.zxvalid('cardNum');
    if($that_children_first.hasClass('cardNum-check-ok')){
      // 填出生日期--性别--证件类型（身份证）--年龄--年龄段
      $person_tr      = $that.closest('tr');
      $birthdayTd     = $person_tr.find('td.birthdayTd');
      $sexTd          = $person_tr.find('td.sexTd');
      $cardCategoryTd = $person_tr.find('td.cardCategoryTd');
      $ageTd          = $person_tr.find('td.ageTd');
      $ageTypeTd      = $person_tr.find('td.ageTypeTd');

      year = cardNum.substr(6, 4);
      birth = year + "-" + cardNum.substr(10, 2) + "-" + cardNum.substr(12, 2); // 出生日期
      sex = (cardNum.substr(16, 1) % 2 == 0)?"女":"男";                         // 性别
      age = zx.util.getAge(year);                                                       // 年龄
      ageType = zx.util.getAgeType(age);                                                // 年龄段

      $birthdayTd.children(':first').removeClass('person-check-err').text(birth);
      $sexTd.children(':first').removeClass('person-check-err').text(sex);
      $cardCategoryTd.children(':first').removeClass('person-check-err').text('身份证');
      $ageTd.children(':first').removeClass('person-check-err').text(age);
      $ageTypeTd.children(':first').removeClass('person-check-err').text(ageType);
    }
  };
  on_phoneTd_blur = function(){
    $(this).zxvalid('phone');
  };
  on_birthdayTd_blur = function(){
    var $that = $(this),
        $that_children_first = $that.children(':first'), birthday,
        $person_tr = $that.closest('tr'), 
        $cardNumTd = $person_tr.find('td.cardNumTd'), 
        $cardNumTd_children_first = $cardNumTd.children(':first'),
        cardNum, year, birth, age, ageType, $ageTd, $ageTypeTd;

    if($cardNumTd_children_first.hasClass('cardNum-check-ok')){
      cardNum = $cardNumTd_children_first.text();
      year = cardNum.substr(6, 4);
      birth = year + "-" + cardNum.substr(10, 2) + "-" + cardNum.substr(12, 2); // 出生日期
      $that_children_first.removeClass('person-check-err').text(birth);
      return;
    }
    birthday = $that_children_first.text();
    // 将 19880101 转换为 1988-01-01
    if(birthday.length === 8){
      birthday = birthday.substr(0, 4) + '-' + birthday.substr(4, 2) + '-' + birthday.substr(6, 2);
      $that_children_first.text(birthday);
    }

    $that.zxvalid('birthday');
    
    if(birthday !== '' && !$that_children_first.hasClass('person-check-err')){
      $ageTd          = $person_tr.find('td.ageTd');
      $ageTypeTd      = $person_tr.find('td.ageTypeTd');

      year = birthday.substr(0, 4);
      age = zx.util.getAge(year);        // 年龄
      ageType = zx.util.getAgeType(age); // 年龄段

      $ageTd.children(':first').removeClass('person-check-err').text(age);
      $ageTypeTd.children(':first').removeClass('person-check-err').text(ageType);
    }
  };
  on_ageTd_blur = function(){
    var $that = $(this),
        $that_children_first = $that.children(':first'),
        $person_tr = $that.closest('tr'), 
        $birthdayTd = $person_tr.find('td.birthdayTd'), 
        $birthdayTd_children_first = $birthdayTd.children(':first'),
        birthday = $birthdayTd_children_first.text(),
        year, age;

    if(birthday !== '' && !$birthdayTd_children_first.hasClass('person-check-err')){
      year = birthday.substr(0, 4);
      age = zx.util.getAge(year); // 年龄
      $that.children(':first').removeClass('person-check-err').text(age);
    }

    $that.zxvalid('age');
    age = $that_children_first.text();
    if(age !== '' && !$that_children_first.hasClass('person-check-err')){
      $ageTypeTd      = $person_tr.find('td.ageTypeTd');

      ageType = zx.util.getAgeType(age); // 年龄段

      $ageTypeTd.children(':first').removeClass('person-check-err').text(ageType);
    }
  };


  // 收客单位 性别 证件类型 年龄段 获取焦点
  on_guest_focus = function(){
    var $that = $(this),
        $parent = $that.parent(),
        $td = $that.closest('td'),
        batchNum = Number($td.find('span.batchNum').text());

      $that.attr('id', 'guest' + batchNum );
      jqueryMap.$guest = $('#guest' + batchNum);

      if( !$parent.hasClass('dropdown') ){
        configMap.list_model.getlist({
          company : stateMap.company,
          c: "guest", 
          that: 'guest'
        });
      }
    
      /*if( !$parentDiv.hasClass('dropdown') ){
        $parentDiv
          .addClass('dropdown')
            .children()
              .attr('data-toggle','dropdown')
              .after(
                $(configMap.dropdown_ul_html)
                  .addClass('dropdown-menu-right')
                  .append(
                    $(configMap.dropdown_li_html)
                      .children().text('男')
                      .end()
                  )
                  .append(
                    $(configMap.dropdown_li_html)
                      .children().text('女')
                      .end()
                  )
              );
        $parentDiv.find('li').click(function(){
          $that.text($(this).text());
        });
      }*/
  }

  // Begin Event handler /on_sexTdDiv_focus/
  // 性别字段获取焦点
  on_sexTdDiv_focus = function () {
    var $that = $(this),
        $parentTd = $that.parent(),
        $person_tr = $parentTd.closest('tr'),
        $cardNumTd = $person_tr.find('td.cardNumTd'),
        $cardNumTd_children_first = $cardNumTd.children(':first'),
        cardNum;

    if( !$parentTd.hasClass('dropdown') ){
      //console.log('dropdown');
      $parentTd
        .addClass('dropdown')
          .children()
            .attr('data-toggle','dropdown')
            .after(
              $(configMap.dropdown_ul_html)
                .css('min-width',55)
                .append(
                  $(configMap.dropdown_li_html)
                    .children().text('男')
                    .end()
                )
                .append(
                  $(configMap.dropdown_li_html)
                    .children().text('女')
                    .end()
                )
            );

      $parentTd.find('li').click(function(){
        $that.removeClass('person-check-err');

        if($cardNumTd_children_first.hasClass('cardNum-check-ok')){
          cardNum = $cardNumTd_children_first.text();
          sex = (cardNum.substr(16, 1) % 2 == 0)?"女":"男"; // 性别
          $that.text(sex);
          return;
        }

        $that.text($(this).text());
        //$parentTd.removeClass('open');
        //return false;
      });

      /*$parentTd.find('li > a')
        .focus(function(){
          $that.text($(this).text());
        });*/
      /*$parentTd.find('li').keydown(function(event){
        if(event.keyCode == 13)
          return false;
      });*/

      //$that.dropdown('toggle');
      //console.log($('.open').length);
      //return false;
    }
  };
  // End Event handler /on_sexTdDiv_focus/
  
  /*on_sexTdDiv_click = function() {
    console.log('on_sexTdDiv_click');
    //var $that = $(this);
    //$that.dropdown('toggle');
    //if()
    //$(this).focus();
    //$that.dropdown('toggle');
    //console.log($('.open').length);
    //return false;
  };*/
  
  // Begin Event handler /on_cardCategoryTdDiv_focus/
  // 证件类型字段获取焦点
  on_cardCategoryTdDiv_focus = function () {
    var $that = $(this),
        $parentTd = $that.parent(),
        $person_tr = $parentTd.closest('tr'),
        $cardNumTd = $person_tr.find('td.cardNumTd'),
        $cardNumTd_children_first = $cardNumTd.children(':first');

    if( !$parentTd.hasClass('dropdown') ){
      $parentTd
        .addClass('dropdown')
          .children()
            .attr('data-toggle','dropdown')
            .after(
              $(configMap.dropdown_ul_html)
                .css('min-width',100)
                .append(
                  $(configMap.dropdown_li_html)
                    .children().text('身份证')
                    .end()
                )
                .append(
                  $(configMap.dropdown_li_html)
                    .children().text('护照')
                    .end()
                )
                .append(
                  $(configMap.dropdown_li_html)
                    .children().text('港澳回乡证')
                    .end()
                )
                .append(
                  $(configMap.dropdown_li_html)
                    .children().text('台胞证')
                    .end()
                )
                .append(
                  $(configMap.dropdown_li_html)
                    .children().text('军官证')
                    .end()
                )
                .append(
                  $(configMap.dropdown_li_html)
                    .children().text('其它')
                    .end()
                )
            );
            
      $parentTd.find('li').click(function(){
        $that.removeClass('person-check-err');

        if($cardNumTd_children_first.hasClass('cardNum-check-ok')){
          $that.text('身份证');
          return;
        }

        $that.text($(this).text());

        if($that.text() !== '身份证'){
          $cardNumTd_children_first.removeClass('person-check-err');
        } else {
          $cardNumTd_children_first.addClass('person-check-err');
        }
      });
    }
  };
  // End Event handler /on_cardCategoryTdDiv_focus/

  // Begin Event handler /on_ageTypeTdDiv_focus/
  // 年龄字段获取焦点
  on_ageTypeTdDiv_focus = function () {
    var $that = $(this),
        $parentTd = $that.parent(),
        $person_tr = $parentTd.closest('tr'),
        $ageTd = $person_tr.find('td.ageTd'),
        $ageTd_children_first = $ageTd.children(':first'),
        age;

    if( !$parentTd.hasClass('dropdown') ){
      $parentTd
        .addClass('dropdown')
          .children()
            .attr('data-toggle','dropdown')
            .after(
              $(configMap.dropdown_ul_html)
                .css('min-width', 60)
                .append(
                  $(configMap.dropdown_li_html)
                    .children().text('成人')
                    .end()
                )
                .append(
                  $(configMap.dropdown_li_html)
                    .children().text('老人')
                    .end()
                )
                .append(
                  $(configMap.dropdown_li_html)
                    .children().text('儿童')
                    .end()
                )
                .append(
                  $(configMap.dropdown_li_html)
                    .children().text('婴儿')
                    .end()
                )
            );
            
      $parentTd.find('li').click(function(){
        $that.removeClass('person-check-err');

        age = $ageTd_children_first.text();
        if(age !=='' && !$ageTd_children_first.hasClass('person-check-err')){
          
          ageType = zx.util.getAgeType(age); // 年龄段
          $that.text(ageType);
          return;
        }

        $that.text($(this).text());
      });
    }
  };
  // End Event handler /on_ageTypeTdDiv_focus/
  
  
  // Begin Event handler /on_spanRemoveBatch_click/
  on_spanRemoveBatch_click = function () {
    var $that      = $(this),
        $firstTr   = $that.closest('tr'),
        $thatTable = $firstTr.closest('table');
    // 如果有导入框，remove
    removeImportDiv();

    // 删组
    removeBatch($firstTr);

    // 写序号
    writeSN($thatTable);
  };
  // End Event handler /on_spanRemoveBatch_click/

  // Begin Event handler /on_spanRemoveTr_click/
  on_spanRemoveTr_click = function () {
    var $that      = $(this),
        $thatTr    = $that.closest('tr'),
        $thatTable = $thatTr.closest('table'),
        $firstTr, $firstTd, rowspan;

    // 如果有导入框，remove
    removeImportDiv();
    // 组是否只有一行，删组
    $firstTr = findFirstTr($thatTr);
    $firstTd = $firstTr.find('td.batch-td-rowspan');
    rowspan = Number($firstTd.attr('rowspan'));
    if(rowspan ===1){
      removeBatch($firstTr);

      // 写序号
      writeSN($thatTable);
      return;
    }

    // 当前行是否是第一行
    if($thatTr.hasClass('tr_first')){
      removeFirstTr($thatTr);

      // 写序号
      writeSN($thatTable);
      return;
    }

    // 删行
    removeTr($thatTr);

    // 写序号
    writeSN($thatTable);
  };
  // End Event handler /on_spanRemoveTr_click/
  
  // Begin Event handler /on_spanAddBatch_click/
  on_spanAddBatch_click = function () {
    var $that            = $(this),
        $firstTd         = $that.closest('td'), batchNum,
        $firstTr         = $firstTd.parent(), 
        $thatTable       = $firstTr.closest('table'),
        $nextAllFirstTrs = $firstTr.nextAll('tr.tr_first'),
        rowspan          = Number($firstTd.attr('rowspan')),
        $nextUntilTrs, $beforeAddTr, i, $newBatch;

    // 如果有导入框，remove
    removeImportDiv();
    batchNum = Number($firstTd.find('span.batchNum').text()) + 1;

    /*$beforeAddTr = $firstTr;
    for(i=1; i<rowspan; i++){
      $beforeAddTr = $beforeAddTr.next();
    }*/

    // 定位将要 after 的行
    $beforeAddTr = $firstTr;
    $nextUntilTrs = $firstTr.nextUntil('tr.tr_first');
    if($nextUntilTrs.length > 0) {
      $beforeAddTr = $nextUntilTrs.last();
    }

    $newBatch = $(stateMap.person_tr_edit_html);
    $newBatch
      .attr('id','bt' + batchNum)
      .addClass('tr_first')
      .prepend(
        $(stateMap.person_first_td_edit_html).attr('rowspan', 1)
          .find('span.batchNum').text(batchNum)
        .end()
          .find('div.batchPersonCount').text(1)
        .end()
      );

    // 插入组之前修改后面的batchNum
    if($nextAllFirstTrs.length !== 0){
      batchNumChange($nextAllFirstTrs, 1);
    }

    // 插入组
    $beforeAddTr.after($newBatch);

    configMap.team_model.getObjectIdFromServer({ id : 'bt' + batchNum });

    // 写序号
    writeSN($thatTable);
  };
  // End Event handler /on_spanAddBatch_click/

  // Begin Event handler /on_spanNewTr_click/
  on_spanNewTr_click = function () {
    var $that = $(this),
        $thatTr = $that.closest('tr'),
        $firstTr, $firstTd, 
        rowspan,
        $thatTable = $thatTr.closest('table');
    
    // 如果有导入框，remove
    removeImportDiv();
    $firstTr = findFirstTr($thatTr);
    $firstTd = $firstTr.find('td.batch-td-rowspan');
    rowspan = Number($firstTd.attr('rowspan'));

    $firstTd
      .attr('rowspan',rowspan + 1)
      .find('div.batchPersonCount').text(rowspan + 1);

    // 插入行
    $thatTr.after(stateMap.person_tr_edit_html);

    // 写序号
    writeSN($thatTable);
  };
  // End Event handler /on_spanNewTr_click/

  // Begin Event handler /on_batchPersonCount_blur/
  // -- 快速分组
  // * vInt - 用户请求的行数(用户输入)
  //   比较本组行数与vInt:
  //   * 1 - 本组行数 > vInt
  //     分出多的行到下组
  //     * 1.1 下组不存在, 创建新组
  //     * 1.2 下一组存在
  //   * 2 - 本组行数 < vInt
  //     从下面组补上来少的行数
  //     * 2.1 vInt 超出了下面所有组的行数, 所有行移上来
  //     * 2.2 循环移动组, 判断是否溢出,是就删除，不是就移动
  //   * 3 - 本组行数 = vInt
  //     不做处理
  //     
  on_batchPersonCount_blur = function () {
    var $rowstotal = $(this),
        v = $.trim($rowstotal.text()), vInt,
        re = /^[0-9]*$/,
        $firstTd = $rowstotal.closest('td'),
        rowspan = Number($firstTd.attr('rowspan')),
        $firstTr, 
        $nextAllFirstTrs, batchNum,
        $newTrPlace,
        $nextFirstTr, $nextFirstTd, nextRowspan_old, nextRowspan_new,
        v_,
        nextFirstTr_id, nextFirstTr_departureTraffic_sm, nextFirstTr_returnTraffic_sm, nextFirstTr_data_id, nextFirstTr_data_batch_obj,
        $nextAllTrs, nextAllTrs_length, i, len, $newTrPlace_next,
        nextRowspan_old_sum, leftRow;

    // 如果有导入框，remove
    removeImportDiv();

    if (v !== "" && re.test(v)){
      vInt = parseInt(v);
      if (vInt > 0 && vInt < 1000) {
        //$rowstotal.removeClass('person-check-err');

        $firstTr = $firstTd.closest('tr');

        //$nextUntilTrs    = $firstTr.nextUntil('tr.tr_first');

        // 对比本组行数与vInt
        if (rowspan > vInt) {
          v_ = rowspan - vInt;
          // 没有跨组，分出多的行到下组
          // 修改本组 rowspan
          $firstTd.attr('rowspan', vInt);

          // 定位到此位置所在行
          $newTrPlace = $firstTr.nextAll().eq(vInt - 1);

          // 看下一组fistTd是否存在，不存在建新fistTd,
          // 只要在相应位置行首插入这个fistTd
          $nextAllFirstTrs = $firstTr.nextAll('tr.tr_first');
          if($nextAllFirstTrs.length === 0 ){
            batchNum = Number($firstTd.find('span.batchNum').text()); // 组号，第几组 
            // 不存在 fistTd
            $nextFirstTd = 
              $(stateMap.person_first_td_edit_html)
                .attr('rowspan', v_)
                .find('span.batchNum').text(batchNum + 1)
              .end()
                .find('div.batchPersonCount').text(v_)
              .end();

            $newTrPlace
              .attr('id', 'bt' + (batchNum + 1))
              .addClass('tr_first')
              .prepend($nextFirstTd);

            configMap.team_model.getObjectIdFromServer({ id : 'bt' + (batchNum + 1) });
          } else {
            // 存在 fistTd
            $nextFirstTr = $nextAllFirstTrs.first();
            
            nextFirstTr_id = $nextFirstTr.attr('id');
            nextFirstTr_departureTraffic_sm = $nextFirstTr.data('dt_id');
            nextFirstTr_returnTraffic_sm    = $nextFirstTr.data('rt_id');
            nextFirstTr_data_id             = $nextFirstTr.data('id');
            nextFirstTr_data_batch_obj      = $nextFirstTr.data('batch_obj');
             
            $nextFirstTd = $nextFirstTr.find('td.batch-td-rowspan');
            nextRowspan_old = Number($nextFirstTd.attr('rowspan'));
            nextRowspan_new = nextRowspan_old + v_;

            $nextFirstTd
              .attr('rowspan', nextRowspan_new)
              .find('div.batchPersonCount').text(nextRowspan_new)
            .end();

            $newTrPlace
              .attr('id', nextFirstTr_id)
              .addClass('tr_first')
              .data('dt_id', nextFirstTr_departureTraffic_sm)
              .data('rt_id', nextFirstTr_returnTraffic_sm)
              .data('batch_obj', nextFirstTr_data_batch_obj)
              .data('id', nextFirstTr_data_id)
              .prepend($nextFirstTd);

            $nextFirstTr
              .removeAttr('id')
              .removeClass('tr_first')
              .removeData('dt_id')
              .removeData('rt_id')
              .removeData('batch_obj')
              .removeData('id');
          }
           
          return;
        } 

        if(rowspan < vInt) {
          // 从下面组补上来少的行数
          // 循环向下移动组的firstTd
          // 
          // 定位到此位置所在行
          $nextAllTrs = $firstTr.nextAll();
          nextAllTrs_length = $nextAllTrs.length;
          if( vInt > nextAllTrs_length ) {
            // 所有行移上来
            vInt = nextAllTrs_length + 1;
            $firstTd = $firstTr.find('td.batch-td-rowspan');
            $firstTd
              .attr('rowspan', vInt)
              .find('div.batchPersonCount').text(vInt);

            // 删除下面所有节点
            $nextAllFirstTrs = $firstTr.nextAll('tr.tr_first');
            len = $nextAllFirstTrs.length;
            for( i = len - 1; i >= 0 ; i-- ) {
              $nextFirstTr = $nextAllFirstTrs.eq(i);
              $nextFirstTd = $nextFirstTr.find('td.batch-td-rowspan');

              $nextFirstTr
                .removeAttr('id')
                .removeClass('tr_first')
                .removeData('dt_id')
                .removeData('rt_id')
                .removeData('batch_obj')
                .removeData('id');
              $nextFirstTd.remove();
            }
          } else {
            v_ = vInt - rowspan;
            $newTrPlace = $nextAllTrs.eq(v_);
            
            $nextAllFirstTrs = $firstTr.nextAll('tr.tr_first');
            len = $nextAllFirstTrs.length;

            nextRowspan_old_sum = 0;
            for( i = len - 1; i >= 0 ; i-- ) {
              $nextFirstTr = $nextAllFirstTrs.eq(i);
              $nextFirstTd = $nextFirstTr.find('td.batch-td-rowspan');
              nextRowspan_old = Number($nextFirstTd.attr('rowspan'));
              nextRowspan_old_sum += nextRowspan_old;
              if( nextRowspan_old_sum > v_ ){
                // 可以移动
                // 向下移动 v_ 个单位
                // 定位到此位置所在行
                $newTrPlace_next = $nextFirstTr.nextAll().eq(v_ - 1);
                
                nextFirstTr_id = $nextFirstTr.attr('id');
                nextFirstTr_departureTraffic_sm = $nextFirstTr.data('dt_id');
                nextFirstTr_returnTraffic_sm    = $nextFirstTr.data('rt_id');
                nextFirstTr_data_id             = $nextFirstTr.data('id');
                nextFirstTr_data_batch_obj      = $nextFirstTr.data('batch_obj');

                nextRowspan_new = nextRowspan_old;
                leftRow = nextRowspan_old_sum - v_;
                if( nextRowspan_old > leftRow ) {
                  nextRowspan_new = leftRow;
                }

                $nextFirstTd
                  .attr('rowspan', nextRowspan_new)
                  .find('div.batchPersonCount').text(nextRowspan_new);

                $newTrPlace_next
                  .attr('id', nextFirstTr_id)
                  .addClass('tr_first')
                  .data('dt_id', nextFirstTr_departureTraffic_sm)
                  .data('rt_id', nextFirstTr_returnTraffic_sm)
                  .data('batch_obj', nextFirstTr_data_batch_obj)
                  .data('id', nextFirstTr_data_id)
                  .prepend($nextFirstTd);

                $nextFirstTr
                  .removeAttr('id')
                  .removeClass('tr_first')
                  .removeData('dt_id')
                  .removeData('rt_id')
                  .removeData('batch_obj')
                  .removeData('id');
                

              } else {
                // 溢出
                // 删除此节点
                $nextFirstTr
                  .removeAttr('id')
                  .removeClass('tr_first')
                  .removeData('dt_id')
                  .removeData('rt_id')
                  .removeData('batch_obj')
                  .removeData('id');
                $nextFirstTd.remove();
              }  
            }

            $firstTd = $firstTr.find('td.batch-td-rowspan');
            $firstTd
              .attr('rowspan', vInt)
              .find('div.batchPersonCount').text(vInt);
          }

          return;
        }
        // rowspan = vInt 时不做动作
        return;
      }

      alert("请输入1~999之间的整数！");
      $rowstotal.text(rowspan);
      return;
      //$rowstotal.focus();
    }

    alert("请输入1~999之间的整数！");
    $rowstotal.text(rowspan);
    //$rowstotal.focus();
  };
  // End Event handler /on_batchPersonCount_blur/

  onComplete_findOneByCompanyFlag = function(event, result) {
    var $that =  $(this),
        flag  = result[0];

    if(flag){
      $that.text('"' + flag.name + '"' + flag.color + '导游旗');
    } else {
      $that.text('无');
    }
  };

  // Begin Event handler /on_saveTeamBtnClick/
  on_saveTeamBtnClick = function (is_new) {
    var 
      CITY = stateMap.city,
      $that = $(this),
      sm_arr, smNum,
      message_arr = [], smDate, CHINAWORD, smTime, message, 
      message_html, message_html_item, message_html_arr = [],
      i, len_i, $trafficTr, sm_obj,
      departureTrafficsArr,
      $departureTraffics = jqueryMap.$trafficTable.find('tr.departureTraffics'),
      departureDate = $departureTraffics.eq(0).find("td.flightDateTd").find('input').val(),
      returnTrafficsArr,
      $returnTraffics = jqueryMap.$trafficTable.find('tr.returnTraffics'),
      returnDate = $returnTraffics.eq(0).find("td.flightDateTd").find('input').val(),
       
      batch_arr, batchIdArr,
      users, k, len_k, $userTable, userObj,
      $userTables = jqueryMap.$userBatchDiv.find('table.userTable'), 
      $batchFirstTrs, $batchFirstTr, batch_obj,

      team_obj,
      $teamInfoTable = jqueryMap.$teamInfoTable;
    
    // team_obj
    team_obj = $teamInfoTable.data('team_obj');
    // 操作人必填    
    team_obj.operator = jqueryMap.$operatorTdDiv.text();            // 操作人       蜀之旅-刘备-13569863654
    if(team_obj.operator === ''){
      alert('操作人不能为空！');
      return;
    }

    // 团队类型必填
    team_obj.teamType = jqueryMap.$teamTypeTdDiv.text();
    if(team_obj.teamType === ''){
      alert('团队类型不能为空！');
      return;
    }

    // 出发地旗号必填
    team_obj.smFlag = jqueryMap.$smFlagTdDiv.text();
    if(team_obj.smFlag === ''){
      alert('出发地旗号不能为空！');
      return;
    }

    stateMap.$saveTeamBtn = $that;
    $that.find('span.btn_text').text( '正在保存单据...' )
         .prop( 'disabled', true );

    // sm_arr
    sm_arr = [];
    departureTrafficsArr = [];

    for( i = 0, len_i = $departureTraffics.length; i < len_i; i++ ) {
      $trafficTr = $departureTraffics.eq(i);
      sm_obj = getSm($trafficTr, 'departureTraffic', 'dt_id');
      sm_arr.push(sm_obj);
      departureTrafficsArr.push(sm_obj._id);

      if(sm_obj.smStatus > 1){
        smDate  = sm_obj.flight.flightDate.substring(5, 10).replace("-", "");
        CHINAWORD = sm_obj.flight.flightStartCity === CITY ? '送' : '接';
        smTime  =
          sm_obj.flight.flightStartCity === CITY
          ? smTime = sm_obj.flight.flightStartTime.replace(":", "") 
          : smTime = sm_obj.flight.flightEndTime.replace(":", "");
        //smNum = smDate + smTime + sm_obj.flight.flightNum + sm_obj.companyAbbr + sm_obj.smRealNumber +"人" + (sm_obj.smType2===1?"内":"外") + CHINAWORD;
        smNum = smDate + smTime + sm_obj.flight.flightNum + (sm_obj.operator).substr(0,sm_obj.operator.length - 11) + sm_obj.smRealNumber +"人" + (sm_obj.smType2===1?"内":"外") + CHINAWORD;
        message = {
          sm           : sm_obj._id,
          smNum        : smNum,
          fromUserName : stateMap.userName,
          fromName     : stateMap.name,
          toUsers      : [{
            userName : "ygfw" + zx.config.getStateMapItem('city'),
            status   : false
          }],
          toNames      : ["阳光服务"],
          action       : 'update'   
        };

        message_arr.push(message);
      }
    }
    returnTrafficsArr = [];
    for( i = 0, len_i = $returnTraffics.length; i < len_i; i++ ) {
      $trafficTr = $returnTraffics.eq(i);
      sm_obj = getSm($trafficTr, 'returnTraffic', 'rt_id');
      sm_arr.push(sm_obj);
      returnTrafficsArr.push(sm_obj._id);

      if(sm_obj.smStatus > 1){
        smDate  = sm_obj.flight.flightDate.substring(5, 10).replace("-", "");
        CHINAWORD = sm_obj.flight.flightStartCity === CITY ? '送' : '接';
        smTime  =
          sm_obj.flight.flightStartCity === CITY
          ? smTime = sm_obj.flight.flightStartTime.replace(":", "") 
          : smTime = sm_obj.flight.flightEndTime.replace(":", "");
        //smNum = smDate + smTime + sm_obj.flight.flightNum + sm_obj.companyAbbr + sm_obj.smRealNumber +"人" + (sm_obj.smType2===1?"内":"外") + CHINAWORD;
        smNum = smDate + smTime + sm_obj.flight.flightNum + (sm_obj.operator).substr(0,sm_obj.operator.length - 11) + sm_obj.smRealNumber +"人" + (sm_obj.smType2===1?"内":"外") + CHINAWORD;
        message = {
          sm           : sm_obj._id,
          smNum        : smNum,
          fromUserName : stateMap.userName,
          fromName     : stateMap.name,
          toUsers      : [{
            userName : "ygfw" + zx.config.getStateMapItem('city'),
            status   : false
          }],
          toNames      : ["阳光服务"],
          action       : 'update'   
        };

        message_arr.push(message);
      }
    }

    // batch_arr
    batch_arr = [];
    users  = [];
    
    for( k = 0, len_k = $userTables.length; k < len_k; k++ ) {

      $userTable     = $userTables.eq(k);
      userObj        = {};
      userObj._id    = $userTable.data('id');
      batchIdArr     = [];
      $batchFirstTrs = $userTable.find('tr.tr_first');
      
      for( i = 0, len_i = $batchFirstTrs.length; i < len_i; i++ ) {
        $batchFirstTr = $batchFirstTrs.eq(i);
        batch_obj = getBatch($batchFirstTr, { tp : 0 });
        //console.log(batch_obj);
        batch_arr.push(batch_obj.batch_obj);
        batchIdArr.push(batch_obj.batch_obj._id);
      }

      userObj.batchs = batchIdArr;
      users.push(userObj);
    }

    

      //_id                 : stateMap.tm_id,
      //user                : stateMap.team_us_id,
      //companyAbbr         : stateMap.team_companyAbbr,
      //name                : stateMap.team_name,
      //isOpen              : stateMap.team_isOpen,         // 是否公有     Boolean

    /*team_obj.teamNum             = zx.util_b.encodeHtml(jqueryMap.$teamNumTdDiv.html());             // 团号         ZX-20150322DF
    team_obj.lineName            = zx.util_b.encodeHtml(jqueryMap.$lineNameTdDiv.html());            // 线路         黄山三天包团豪华游
    team_obj.operator            = zx.util_b.encodeHtml(jqueryMap.$operatorTdDiv.html());            // 操作人       蜀之旅-刘备-13569863654
    team_obj.teamType            = jqueryMap.$teamTypeTdDiv.text();                                  // 团队类型     散拼
    team_obj.teamNote            = zx.util_b.encodeHtml(jqueryMap.$teamNoteTdDiv.html());            // 团队注意事项 没有什么要说的
    team_obj.planNumber          = Number(jqueryMap.$planNumberTdDiv.text());                        // 计划人数     20
    team_obj.realNumber          = Number(jqueryMap.$realNumberTd.text());                           // 名单人数     2
    team_obj.sendDriver          = zx.util_b.encodeHtml(jqueryMap.$sendDriverTdDiv.html());          // 去程送机司机 阿里-12999993333
    team_obj.smFlag              = zx.util_b.encodeHtml(jqueryMap.$smFlagTdDiv.html());              // 出发地旗号   蜀之旅-黄色导游旗
    team_obj.guide               = zx.util_b.encodeHtml(jqueryMap.$guideTdDiv.html());               // 地接人员     汪凌云(男)-13526856369
    team_obj.meetDriver          = zx.util_b.encodeHtml(jqueryMap.$meetDriverTdDiv.html());          // 回程接机司机 范德-13456665454
    team_obj.sendDestinationFlag = zx.util_b.encodeHtml(jqueryMap.$sendDestinationFlagTdDiv.html()); // 地接旗号     蜀之旅-才色导游旗*/
    
    team_obj.teamNum             = jqueryMap.$teamNumTdDiv.text();             // 团号         ZX-20150322DF
    team_obj.lineName            = jqueryMap.$lineNameTdDiv.text();            // 线路         黄山三天包团豪华游
    //team_obj.operator            = jqueryMap.$operatorTdDiv.text();            // 操作人       蜀之旅-刘备-13569863654
    //team_obj.teamType            = jqueryMap.$teamTypeTdDiv.text();            // 团队类型     散拼
    team_obj.teamNote            = jqueryMap.$teamNoteTdDiv.text();            // 团队注意事项 没有什么要说的
    team_obj.planNumber          = Number(jqueryMap.$planNumberTdDiv.text());  // 计划人数     20
    team_obj.realNumber          = Number(jqueryMap.$realNumberTd.text());     // 名单人数     2
    team_obj.sendDriver          = jqueryMap.$sendDriverTdDiv.text();          // 去程送机司机 阿里-12999993333
    //team_obj.smFlag              = jqueryMap.$smFlagTdDiv.text();              // 出发地旗号   蜀之旅-黄色导游旗
    team_obj.guide               = jqueryMap.$guideTdDiv.text();               // 地接人员     汪凌云(男)-13526856369
    team_obj.meetDriver          = jqueryMap.$meetDriverTdDiv.text();          // 回程接机司机 范德-13456665454
    team_obj.sendDestinationFlag = jqueryMap.$sendDestinationFlagTdDiv.text(); // 地接旗号     蜀之旅-才色导游旗

    team_obj.departureDate       = departureDate;
    team_obj.departureTraffics   = departureTrafficsArr;
    team_obj.returnDate          = returnDate;
    team_obj.returnTraffics      = returnTrafficsArr;

    team_obj.users               = users;

    if(is_new === false && message_arr.length > 0) {
      // 显示修改单据消息对话框通知服务商
      //console.log(message_arr);
      for(i = 0; i < message_arr.length; i++){
        message_html_item = String()
          + '<div class="team-message-div">'
            + '<span>服务商已确认关联单: ' + message_arr[i].smNum + '</span><br >'
            + '<span class="text-danger">是否将您本次的修改通知服务商？</span>'
            + '<input class="team-message-checkbox" type="checkbox" checked></input>'
            + '<textarea class="messageTextarea form-control" rows="2"></textarea>'
          + '</div>';

        message_html_arr.push(message_html_item);
        message_html = message_html_arr.join('<div style="height:30px;"></div>');
      }
      


      zx.modal.initModule({
        $title    : $('<h4 class="modal-title">To：阳光服务</h4>'),
        formClass : 'form-saveTeamWithMessage',
        main_html : message_html,
        callbackFunction : function(modalJqueryMap){

          var $teamMessageDiv = $('.team-message-div'),
              sendMessages = [], $div, $checkbox, talkStr;

          for(i = 0;i < $teamMessageDiv.length; i++){
            $div = $teamMessageDiv.eq(i);
            $checkbox = $div.find('.team-message-checkbox');

            if($checkbox.prop('checked')){
              talkStr = $div.find('textarea.messageTextarea').val().trim();
              message_arr[i].talk = talkStr;
              sendMessages.push(message_arr[i]);
            }
          }

          modalJqueryMap.$submitBtn
            .text( '正在保存单据...' )
            .attr( 'disabled', true );
          modalJqueryMap.$cancelBtn.attr( 'disabled', true );

          //console.log(batch_arr);
          configMap.team_model.saveTeamWithMessage({
            sm_arr       : sm_arr,
            batch_arr    : batch_arr,
            team_obj     : team_obj,
            is_new       : is_new,
            sendMessages : sendMessages
          });
        }
      });

      return;
    }

    //console.log(batch_arr);

    configMap.team_model.saveTeam({
      sm_arr    : sm_arr,
      batch_arr : batch_arr,
      team_obj  : team_obj,
      is_new    : is_new
    });
  };
  // End Event handler /on_saveTeamBtnClick/
  
  // Begin Event handler /onComplete_saveTeam/
  onComplete_saveTeam = function ( event, result ) {
    //console.log(result);
    // 已检验
    if(result.success === 1){
      $.uriAnchor.setAnchor( { 'page' : 'team', 'c' : 'detail', 'n' : result.tm_id }, null, true );
    } else {
      alert('写入数据库失败，请再试一次...');
      stateMap.$saveTeamBtn.find('span.btn_text').text( '保存并退出编辑' )
           .prop( 'disabled', false );
    }
  };
  // End Event handler /onComplete_saveTeam/
  
  // Begin Event handler /on_saveSmBtnClick/
  // 保存 sm batches
  on_saveSmBtnClick = function () {
    //console.log('on_saveSmBtnClick');
    var $that = $(this),
        $smInfoTable = jqueryMap.$smInfoTable,
        sm_obj = $smInfoTable.data('sm_obj'),
        batch_arr, batchIdArr,
        $userTables = jqueryMap.$userBatchDiv.find('table.userTable'), 
        k, len_k, $userTable, $batchFirstTrs,
        i, len_i, $batchFirstTr, batch_obj,
        smDate, smTime, smNum, CHINAWORD,
        fromUserName, fromName, toUsers, toNames,
        isPointSmNote;

    // sm_obj
    //if(sm_obj.smType1 === 1){
      // send 集合时间提前量
    sm_obj.smTimeSpace = jqueryMap.$smSetTimeDiv.data('sm_time_space');
    //}
    sm_obj.smRealNumber = Number(jqueryMap.$smRealNumberTd.text());
    sm_obj.smType2 = (jqueryMap.$smType2TdDiv.text()).indexOf('内') === -1 ? 2 : 1;   // 送机接机smType2 
    //sm_obj.smNote = zx.util_b.encodeHtml(jqueryMap.$smNoteTdDiv.html());            // 送机接机注意事项
    sm_obj.smNote = jqueryMap.$smNoteTdDiv.text().trim();                             // 送机接机注意事项

    // 钱
    sm_obj.smPayment = Number($('#smPayment').text()) * 100;              // 代付款项 +
    sm_obj.smPayment_y = Number($('#smPayment_y').text()) * 100;          // 已付款项 +
    sm_obj.smAgencyFund = Number($('#smAgencyFund').text()) * (-100);     // 代收款项 -
    sm_obj.smAgencyFund_y = Number($('#smAgencyFund_y').text()) * (-100); // 已收款项 -
    sm_obj.fees = Number($('#fees').text()) * 100;
    sm_obj.carFees = Number($('#carFees').text()) * 100;
    sm_obj.smServer = $('#smServerTdDiv').text();
    sm_obj.serverMan = $('#serverMan').text();
    sm_obj.insurance = Number($('#insurance').text());

    // batch_arr
    batch_arr   = [];
    batchIdArr  = [];
    toUsers     = [];
    toNames     = [];

    isPointSmNote = false;

    for( k = 0, len_k = $userTables.length; k < len_k; k++ ) {
      $userTable     = $userTables.eq(k);
      toUsers.push({
        userName : $userTable.data('user_name'),
        status   : false
      });
      toNames.push($userTable.data('name'));
      $batchFirstTrs = $userTable.find('tr.tr_first');

      for( i = 0, len_i = $batchFirstTrs.length; i < len_i; i++ ) {
        $batchFirstTr = $batchFirstTrs.eq(i);
        batch_obj = getBatch($batchFirstTr, { tp : sm_obj.smType1, sm_id : sm_obj._id });
        batch_arr.push(batch_obj.batch_obj);
        batchIdArr.push({ _id: batch_obj.batch_obj._id });

        if(!isPointSmNote && batch_obj.isSmNote){
          isPointSmNote = true;
        }
      }
    }

    if(isPointSmNote){
      if(sm_obj.smNote === '') {
        sm_obj.smNote = '.';
      }
    } else {
      if(sm_obj.smNote === '.') {
        sm_obj.smNote = '';
      }
    }

    if(sm_obj.smStatus > 1) {
      // 表明服务商已经确认此单，显示修改单据消息对话框通知对方
      // 送机单号
      smDate  = sm_obj.flight.flightDate.substring(5, 10).replace("-", "");
      CHINAWORD = sm_obj.smType1 === 1 ? '送' : '接';
      smTime  =
          sm_obj.smType1 === 1
          ? smTime = sm_obj.flight.flightStartTime.replace(":", "") 
          : smTime = sm_obj.flight.flightEndTime.replace(":", "");
      //smNum = smDate + smTime + sm_obj.flight.flightNum + sm_obj.companyAbbr + sm_obj.smRealNumber +"人" + (sm_obj.smType2===1?"内":"外") + CHINAWORD;
      smNum = smDate + smTime + sm_obj.flight.flightNum + (sm_obj.operator).substr(0,sm_obj.operator.length - 11) + sm_obj.smRealNumber +"人" + (sm_obj.smType2===1?"内":"外") + CHINAWORD;
      fromUserName  = "ygfw" + zx.config.getStateMapItem('city');
      fromName      = "阳光服务";

      if(stateMap.category === 20){
        fromUserName = stateMap.userName,
        fromName     = stateMap.name;
        toUsers      = [{
          userName : "ygfw" + zx.config.getStateMapItem('city'),
          status   : false
        }],
        
        toNames      = ["阳光服务"];
      }

      zx.modal.initModule({
        $title    : $('<h4 class="modal-title">To：' + toNames.join(',') + '</h4>'),
        formClass : 'form-saveSmWithMessage',
        main_html : String()
          + '<textarea id="messageTextarea" class="form-control" rows="2"></textarea>'
          + '<span class="text-danger">(此单已确认！请将您修改的信息通知此单相关人员。)</span>',
        callbackFunction : function(modalJqueryMap){
          var talkStr = $('#messageTextarea').val().trim(),
              talk    = talkStr,
              message = {
                sm           : sm_obj._id,
                smNum        : smNum,
                fromUserName : fromUserName,
                fromName     : fromName,
                toNames      : toNames,
                toUsers      : toUsers,
                action       : 'update',
                talk         : talk       
              };

          modalJqueryMap.$submitBtn
            .text( '正在保存单据...' )
            .attr( 'disabled', true );
          modalJqueryMap.$cancelBtn.attr( 'disabled', true );

          configMap.sm_model.saveSmWithMessage({
            sm_obj     : sm_obj,
            batch_arr  : batch_arr,
            batchIdArr : batchIdArr,
            from       : 'save',
            tm_id      : stateMap.tm_id,
            message    : message
          });
        }
      });

      return;
    }

    stateMap.$saveSmBtn = $that;
    $that.find('span.btn_text').text( '正在保存单据...' )
         .prop( 'disabled', true );

    configMap.sm_model.saveSm({
      sm_obj     : sm_obj,
      batch_arr  : batch_arr,
      batchIdArr : batchIdArr,
      from       : 'save',
      tm_id      : stateMap.tm_id
    });
  }
  // End Event handler /on_saveSmBtnClick/


  // Begin Event handler /onComplete_saveSm/
  onComplete_saveSm = function ( event, result ) {
    //console.log(result)
    // 已检验
    if(result.success === 1){
      $.uriAnchor.setAnchor( { 'page' : 'sm', 'c' : 'detail', 'n' : stateMap.anchor_map.n }, null, true );
    } else {
      if(result.from === 'save'){
        alert('写入数据库失败，请再试一次...');
        stateMap.$saveSmBtn.find('span.btn_text').text( '保存并退出编辑' )
          .prop( 'disabled', false );
      } /*else {
        alert('写入数据库失败，请再试一次...');
        stateMap.$deleteSmBtn.find('span.btn_text').text( '删除' )
          .prop( 'disabled', false );
      } */
    }
  }
  // End Event handler /onComplete_saveSm/

  // Begin Event handler /onComplete_getTeamById/
  onComplete_getTeamById = function ( event, team ) {
    //console.log(team);
    var
      CITY = stateMap.city,
      $teamInfoTable,
      spanHtml, is_has_sm,
      smText, send_position, meet_position,
      userArr,   i_u, userObj,   $userTable, $userTableTbody,
      batchArr,  i_b, batchObj,
      personArr, i_p, personObj, $person_tr, len, $person_first_td,
      i_sn,
      stateMap_user = [],
      departureTrafficArr, returnTrafficArr, i, iPlus, trafficObj, 
      $trafficTableTbody = jqueryMap.$trafficTable.find('tbody'), $trafficTr,
      sendTrafficObj = {}, meetTrafficObj = {},

      $zxFootBoxDiv = $(configMap.zx_footbox_div_html);

    stateMap.team = team;
    stateMap.tm_id = stateMap.team._id;
    // ---------- 开始渲染UI
    // 初始化UI界面数据
    jqueryMap.$topBtnDiv.empty().show();
    jqueryMap.$teamInfoDiv.empty();
    $trafficTableTbody.empty();
    jqueryMap.$userBatchDiv.empty();
    $('#zxFootBoxDiv').remove();

    // top
    $('#team_a').parent().addClass('active');
    $('#send_a').parent().addClass('hidden');
    $('#meet_a').parent().addClass('hidden');
    //jqueryMap.$titleSpan
      //.addClass('label label-primary')
      //.text('团队单');
    //jqueryMap.$beginEditTime.text('');
    jqueryMap.$beginEditTime.addClass('hidden');
    if(stateMap.us_id !== team.lock.user_id && team.lock.isLocked === true){   
      jqueryMap.$beginEditTime
        .html(
          String()
            + '<span class="text-primary">'
              + team.lock.editName + '正在编辑, 始于 ' + moment(team.lock.beginTime).format('YYYY-MM-DD HH:mm')
            + '</span>'
        ).removeClass('hidden');

      jqueryMap.$topBtnDiv.hide();
    }
    jqueryMap.$topBtnDiv.append(configMap.top_detail_div_html);
    setJqueryMap(22);
    jqueryMap.$gotoEditTeamBtn.attr('href','#!page=team&c=edit&n=' + team._id);

    //$.gevent.subscribe( jqueryMap.$team, 'zx-deleteTeam' , onComplete_deleteTeam);
    $.gevent.subscribe( jqueryMap.$team, 'zx-newOrAddSm' , onComplete_newOrAddSm);

    // 如果是服务商
    if(Number(stateMap.category) === 30){
      //$('#addServerDiv').addClass('hidden');
      //$('#downloadTeamBtn').addClass('hidden');
      //$('#deleteTeamBtn').addClass('hidden');
      //$('#gotoEditTeamBtn').addClass('hidden');
      $('#owndiv').addClass('hidden');
    } else if (team.isOpen === false && team.user !== stateMap.us_id){
      $('#owndiv').addClass('hidden');
    }

    // 团队信息
    $teamInfoTable = $(configMap.team_info_table_html);
    jqueryMap.$teamInfoDiv.append($teamInfoTable);
    setJqueryMap(31);
    // 初始化数据
    jqueryMap.$teamInfoTable = 
      $teamInfoTable
        .data('users', team.users)
        .data('id', team._id)
        .data('company', team.company.toString())
        .attr('id','tm' + team._id);

    spanHtml = String()
      + '<span class="label label-primary" style="margin-right:5px;">独立</span>';
    if(stateMap.team.isOpen){
      spanHtml = String()
        + '<span class="label label-success" style="margin-right:5px;">合作</span>';
    }

    jqueryMap.$teamNumTdDiv.html(  spanHtml + zx.util_b.decodeHtml(stateMap.team.teamNum             ));
    jqueryMap.$lineNameTdDiv.html(            zx.util_b.decodeHtml(stateMap.team.lineName            ));
    jqueryMap.$operatorTdDiv.html(            zx.util_b.decodeHtml(stateMap.team.operator            ));
    jqueryMap.$teamTypeTdDiv.text(            stateMap.team.teamType                                  ); // 团队类型     散拼
    jqueryMap.$teamNoteTdDiv.html(            zx.util_b.decodeHtml(stateMap.team.teamNote            ));
    jqueryMap.$planNumberTdDiv.text(          stateMap.team.planNumber                                ); // 计划人数     20
    jqueryMap.$realNumberTd.text(             stateMap.team.realNumber                                ); // 名单人数     2
    jqueryMap.$sendDriverTdDiv.html(          zx.util_b.decodeHtml(stateMap.team.sendDriver          ));
    jqueryMap.$smFlagTdDiv.html(              zx.util_b.decodeHtml(stateMap.team.smFlag              ));
    jqueryMap.$meetDriverTdDiv.html(          zx.util_b.decodeHtml(stateMap.team.meetDriver          ));
    jqueryMap.$guideTdDiv.html(               zx.util_b.decodeHtml(stateMap.team.guide               ));
    jqueryMap.$sendDestinationFlagTdDiv.html( zx.util_b.decodeHtml(stateMap.team.sendDestinationFlag ));
    

    // 航班信息
    
    is_has_sm = false; 
    
    // 在状态集合中缓存送机和接机的信息
    // sendTrafficObj, meetTrafficObj
    jqueryMap.$refreshTh.addClass('hidden');
    departureTrafficArr = stateMap.team.departureTraffics;
    iPlus = 0;

    for( i = 0; i < departureTrafficArr.length; i++ ) {
      trafficObj = departureTrafficArr[i];
      iPlus += 1;

      $trafficTr = $(configMap.traffic_tr_html);
      $trafficTr
        .data('id',trafficObj._id)
        .attr('id', 'dt' + trafficObj._id)
        .addClass('departureTraffics');

      $trafficTr.find('td.refreshTd').addClass('hidden');

      $trafficTr.children().eq(0).text('去程航班' + iPlus);

      if(trafficObj.smStatus > 0){
        is_has_sm = true;

        if(trafficObj.flight.flightStartCity === CITY){
          smText = '送机单';

          $('#send_a')
            .css('background-color','#FFF')
            .attr('href','#!page=sm&c=detail&n=' + trafficObj._id)
            .parent().removeClass('hidden');
        } else if (trafficObj.flight.flightEndCity.indexOf(CITY) === 0) {
          smText = '接机单';

          $('#meet_a')
            .css('background-color','#FFF')
            .attr('href','#!page=sm&c=detail&n=' + trafficObj._id)
            .parent().removeClass('hidden');
        }

        $trafficTr.children().eq(1)
          .data('smstatus',trafficObj.smStatus)
          .html('<a class="trafficA btn btn-xs btn-info active" href="#!page=sm&c=detail&n=' + trafficObj._id + '">' + smText + '</a>');
      }

      //console.log(trafficObj.flight);
      if(trafficObj.flight.flightDate) {
        $trafficTr.find('td.flightDateTd').children().text(moment(trafficObj.flight.flightDate).format('YYYY-MM-DD'));
      }
      
      $trafficTr.find('td.flightNumTd').children().text(trafficObj.flight.flightNum);
      $trafficTr.find('td.flightStartCityTd').children().text(trafficObj.flight.flightStartCity);
      if(trafficObj.smStatus > 0 && trafficObj.flight.flightStartCity === CITY){
        $trafficTr.find('td.flightStartCityTd')
          .append('<s class="s_icon"></s>');
      } else {
        $trafficTr.find('td.flightStartCityTd')
          .append($('<s class="s_icon"></s>')
            .css('background-position', '0px -50px'));
      }

      $trafficTr.find('td.flightEndCityTd').children().text(trafficObj.flight.flightEndCity);
      if(trafficObj.smStatus > 0 && trafficObj.flight.flightEndCity.indexOf(CITY) === 0){
        $trafficTr.find('td.flightEndCityTd')
          .append($('<s class="s_icon"></s>')
          .css('background-position', '0px -25px'));
      } else {
        $trafficTr.find('td.flightEndCityTd')
          .append($('<s class="s_icon"></s>')
          .css('background-position', '0px -75px'));
      }
      
      //console.log(trafficObj.flight);
      if(trafficObj.flight.flightStartTime) {
        $trafficTr.find('td.flightStartTimeTd').children().text(moment(trafficObj.flight.flightStartTime).format('HH:mm'));
      }
      if(trafficObj.flight.flightEndTime) {
        $trafficTr.find('td.flightEndTimeTd').children().text(moment(trafficObj.flight.flightEndTime).format('HH:mm'));
      }

      $trafficTableTbody.append($trafficTr);

      if(trafficObj.flight.flightStartCity === CITY){
        sendTrafficObj[trafficObj._id] = trafficObj.flight;
      } else if(trafficObj.flight.flightEndCity.indexOf(CITY) === 0) {
        meetTrafficObj[trafficObj._id] = trafficObj.flight;
      }
    }
    
    returnTrafficArr = stateMap.team.returnTraffics;
    iPlus = 0;
    for( i = 0; i < returnTrafficArr.length; i++ ) {
      trafficObj = returnTrafficArr[i];
      iPlus += 1;

      $trafficTr = $(configMap.traffic_tr_html);
      $trafficTr
        .data('id', trafficObj._id)
        .attr('id', 'rt' + trafficObj._id)
        .addClass('returnTraffics');

      $trafficTr.find('td.refreshTd').addClass('hidden');

      if(trafficObj.smStatus > 0){
        is_has_sm = true;

        if(trafficObj.flight.flightStartCity === CITY){
          smText = '送机单';

          $('#send_a')
            .css('background-color','#FFF')
            .attr('href','#!page=sm&c=detail&n=' + trafficObj._id)
            .parent().removeClass('hidden');
        } else if (trafficObj.flight.flightEndCity.indexOf(CITY) === 0) {
          smText = '接机单';

          $('#meet_a')
            .css('background-color','#FFF')
            .attr('href','#!page=sm&c=detail&n=' + trafficObj._id)
            .parent().removeClass('hidden');
        }

        $trafficTr.children().eq(1)
          .data('smstatus',trafficObj.smStatus)
          .html('<a class="trafficA  btn btn-xs btn-info active" href="#!page=sm&c=detail&n=' + trafficObj._id + '">' + smText + '</a>');
      } 

      $trafficTr.children().eq(0).text('回程航班'  + iPlus);

      //console.log(moment(trafficObj.flight.flightDate).format('YYYY-MM-DD'));
      if(trafficObj.flight.flightDate) {
        $trafficTr.find('td.flightDateTd').children().text(moment(trafficObj.flight.flightDate).format('YYYY-MM-DD'));
      }

      $trafficTr.find('td.flightNumTd').children().text(trafficObj.flight.flightNum);
      $trafficTr.find('td.flightStartCityTd').children().text(trafficObj.flight.flightStartCity);
      if(trafficObj.smStatus > 0 && trafficObj.flight.flightStartCity === CITY){
        $trafficTr.find('td.flightStartCityTd')
          .append('<s class="s_icon"></s>');
      } else {
        $trafficTr.find('td.flightStartCityTd')
          .append($('<s class="s_icon"></s>')
            .css('background-position', '0px -50px'));
      }

      $trafficTr.find('td.flightEndCityTd').children().text(trafficObj.flight.flightEndCity);
      if(trafficObj.smStatus > 0 && trafficObj.flight.flightEndCity.indexOf(CITY) === 0){
        $trafficTr.find('td.flightEndCityTd')
          .append($('<s class="s_icon"></s>')
          .css('background-position', '0px -25px'));
      } else {
        $trafficTr.find('td.flightEndCityTd')
          .append($('<s class="s_icon"></s>')
          .css('background-position', '0px -75px'));
      }

      if(trafficObj.flight.flightStartTime) {
        $trafficTr.find('td.flightStartTimeTd').children().text(moment(trafficObj.flight.flightStartTime).format('HH:mm'));
      }
      if(trafficObj.flight.flightEndTime) {
        $trafficTr.find('td.flightEndTimeTd').children().text(moment(trafficObj.flight.flightEndTime).format('HH:mm'));
      }

      $trafficTableTbody.append($trafficTr);

      if(trafficObj.flight.flightStartCity === CITY){
        sendTrafficObj[trafficObj._id] = trafficObj.flight;
      } else if(trafficObj.flight.flightEndCity.indexOf(CITY) === 0) {
        meetTrafficObj[trafficObj._id] = trafficObj.flight;
      }
    }

    stateMap.sendTrafficObj = sendTrafficObj;
    stateMap.meetTrafficObj = meetTrafficObj;

    jqueryMap.$teamInfoTable.data('is_has_sm', is_has_sm);

    //top 导航
    jqueryMap.$zxNavPills.removeClass('hidden');
    //$('#zx-nav-pills-h').addClass('hidden');
    // 组信息
    // 初始化样式
    $person_first_td = 
      $(configMap.person_first_td_html)
        .find('.batch_td_icon_check_div')
          .css('display','block')
        .end();

    $person_tr = $(configMap.person_tr_html);
    $person_tr.find('td.teamPersonNoteTd')
      .removeClass('hidden')
      .nextAll().remove();

    $userTable = $(configMap.user_table_html);
    $userTable.find('th.teamPersonNoteTh')
      .removeClass('hidden')
      .nextAll().remove();
    // 缓存到状态集合 stateMap 中，以备后用
    stateMap.person_first_td_detail_html = $('<div></div>').append($person_first_td).html();
    stateMap.person_tr_detail_html = $('<div></div>').append($person_tr).html();
    stateMap.user_table_detail_html = $('<div></div>').append($userTable).html();

    
    userArr = stateMap.team.users;
    for( i_u = 0; i_u < userArr.length; i_u++ ) {
      userObj  = userArr[i_u];
      batchArr = userObj.batchs;

      $userTable = $(stateMap.user_table_detail_html);
      $userTable
        .attr('id', 'us' + userObj._id._id)
        .data('id', userObj._id._id)
        .data('name', userObj._id.name)
        .find('th.batchTh').text(userObj._id.name + '-' + userObj._id.phone);
      $userTableTbody = $userTable.find('tbody');

      i_sn = 0;
      for( i_b = 0; i_b < batchArr.length; i_b++ ) {
        batchObj  = batchArr[i_b];
        personArr = batchObj.persons;

        for( i_p = 0, len = personArr.length; i_p < len; i_p++ ) {
          i_sn++;
          personObj = personArr[i_p];
          $person_tr = $(stateMap.person_tr_detail_html);

          $person_tr.find('td.snTd').text(i_sn);
          $person_tr.find('td.nameTd').children().text(personObj.name);
          $person_tr.find('td.cardNumTd').children().text(personObj.cardNum);
          $person_tr.find('td.phoneTd').children().text(personObj.phone);
          $person_tr.find('td.birthdayTd').children().text(personObj.birthday);
          $person_tr.find('td.sexTd').children().text(personObj.sex);
          $person_tr.find('td.cardCategoryTd').children().text(personObj.cardCategory);
          $person_tr.find('td.ageTd').children().text(personObj.age===0?'' : personObj.age);
          $person_tr.find('td.ageTypeTd').children().text(personObj.ageType);
          $person_tr.find('td.roomTd').children().text(personObj.room);
          $person_tr.find('td.teamPersonNoteTd').children().html(zx.util_b.decodeHtml(personObj.teamPersonNote));
          
          if(i_p === 0) {

            if(batchObj.departureTraffic._id){
              $person_tr
                .data('dt_id', batchObj.departureTraffic._id)
                .data('departuretraffic_issm', batchObj.departureTraffic.isSm)
                .data('person_arr', personArr);

              if(stateMap['sendTrafficObj'][batchObj.departureTraffic._id]){
                if(batchObj.departureTraffic.isSm){
                  send_position = '0 0';
                } else {
                  send_position = '0 -50px';
                }
              } else if (stateMap['meetTrafficObj'][batchObj.departureTraffic._id]){
                if(batchObj.departureTraffic.isSm){
                  //console.log(batchObj.departureTraffic.isSm);
                  meet_position = '0 -25px';
                } else {
                  meet_position = '0 -75px';
                }
              }
            }

            if(batchObj.returnTraffic._id){

              $person_tr
                .data('rt_id', batchObj.returnTraffic._id)
                .data('returntraffic_issm', batchObj.returnTraffic.isSm)
                .data('person_arr', personArr);

              if(stateMap['sendTrafficObj'][batchObj.returnTraffic._id]){

                if(batchObj.returnTraffic.isSm){
                  send_position = '0 0';
                } else {
                  send_position = '0 -50px';
                }
              } else if (stateMap['meetTrafficObj'][batchObj.returnTraffic._id]){
                if(batchObj.returnTraffic.isSm){
                  meet_position = '0 -25px';
                } else {
                  meet_position = '0 -75px';
                }
              }
            }
            $person_tr
              .data('id',batchObj._id)
              .attr('id', 'bt' + batchObj._id)
              .addClass('tr_first')
              .prepend(
                $(stateMap.person_first_td_detail_html).attr('rowspan', len)
                  .find('span.batchNum').text(batchObj.batchNum)
                  .end()
                  .find('div.batchPersonCount').text(len)
                  .end()
                  .find('div.guest').text(batchObj.guest)
                  .end()
                  .find('div.teamBatchNote').html(zx.util_b.decodeHtml(batchObj.teamBatchNote))
                  .end()
                  .find('s.s_icon_send').css('background-position',send_position)
                  .end()
                  .find('s.s_icon_meet').css('background-position',meet_position)
                  .end()
              );
          }
          $userTableTbody.append($person_tr);
        }
      }
      jqueryMap.$userBatchDiv.append($userTable);
    }

    // footer
    jqueryMap.$team.append($zxFootBoxDiv);
    jqueryMap.$zxFootBoxDiv = $zxFootBoxDiv;
    jqueryMap.$zxFootBoxContainer = $('#zxFootBoxContainer');
    jqueryMap.$okAddServerBtn     = $('#okAddServerBtn');
    jqueryMap.$cancelAddServerBtn     = $('#cancelAddServerBtn');

    jqueryMap.$companyAbbrSpan.text(stateMap.team.companyAbbr);
    jqueryMap.$nameSpan.text(stateMap.team.name);
    jqueryMap.$dateSpan.text(moment(stateMap.team.meta.createAt).format('YYYY-MM-DD'));

    // 验证 证件号码 手机号码 出生日期 性别 证件类型 年龄 年龄段
    $('.cardNumTd').zxvalid('cardNum');
    $('.phoneTd').zxvalid('phone');
    $('.birthdayTd').zxvalid('birthday');
    $('.sexTd').zxvalid('sex');
    $('.cardCategoryTd').zxvalid('cardCategory'); 
    $('.ageTd').zxvalid('age');
    $('.ageTypeTd').zxvalid('ageType');


    jqueryMap.$team.show();
    // ---------- 结束渲染UI 
    
    $('#addServerBtn').velocity(
      { borderColor: "#00dd00", backgroundColor: "#00dd00", boxShadowBlur: 15 },
      { duration: 500, delay: 500, loop: true }
    );
    $('#addServerBtnSpan').velocity(
      { translateX: 5 }, 
      { duration: 200, delay: 10, easing: [ 300, 8 ], loop: true }
    );
    
    // Begin Event handler /downloadTeamBtn_click/
    jqueryMap.$team.on('click', '#downloadTeamBtn', function(){
      var 
        $that = $(this),
        data = {
          id         : stateMap.tm_id,
          isDownload : stateMap.team.isDownload
        };

      $that.prop("disabled", true);

      // 向服务器请求数据
      //console.log(data);
      configMap.team_model.downloadTeam(data);
    });
    // End Event handler /downloadTeamBtn_click/
    
    // 查询户籍地
    // Begin Event handler /showCardCityBtn_click/
    jqueryMap.$team.on('click', '#showCardCityBtn', function(){
      zx.modal.initModule({
        //size      : 'modal-sm',
        $title    : $('<h4 class="modal-title">检测实名身份证</h4>'),
        formClass : 'form-showCardCity',
        isHideFooter : true,
        main_html : String()
          + '<div id="showCardCityDiv></div>'
      });
    });
    // End Event handler /showCardCityBtn_click/
  };
  // End Event handler /onComplete_getTeamById/

  // Begin Event handler /onComplete_newOrAddSm/
  onComplete_newOrAddSm = function(event, result) {
    //console.log(result);
    $.uriAnchor.setAnchor( { 'page' : 'sm', 'c' : 'edit','n' : result.sm }, null, true );
  };
  // End Event handler /onComplete_newOrAddSm/

  // Begin Event handler /on_deleteTeamBtn_click/
  on_deleteTeamBtn_click = function() {
    var $that     = $(this),
        team_id   = jqueryMap.$teamInfoTable.data('id'),
        is_has_sm = jqueryMap.$teamInfoTable.data('is_has_sm');

    if(is_has_sm === true){
      alert('有关联的服务单，不能删除。');
      return;
    }

    zx.modal.initModule({
      size      : 'modal-sm',
      $title    : $('<h4 class="modal-title">删除此单</h4>'),
      formClass : 'form-deleteTeam',
      main_html : String()
        + '<div class="alert alert-warning" role="alert">确定删除吗？</div>',
      callbackFunction : function(modalJqueryMap){
        modalJqueryMap.$submitBtn
          .text( '正在删除...' )
          .attr( 'disabled', true );

        configMap.team_model.deleteTeam({
          team_id : team_id,
          name    : stateMap.name
        });
      }
    });     
  }
  // End Event handler /on_deleteTeamBtn_click/

  // Begin Event handler /onComplete_deleteTeam/
  /*onComplete_deleteTeam = function(event, result) {
    console.log(result);
    // $.uriAnchor.setAnchor( { 'page' : 'sm', 'c' : 'edit','n' : result.sm }, null, true );
  };*/
  // End Event handler /onComplete_deleteTeam/

  // Begin Event handler /on_addServerDivA_click/
  on_addServerDivA_click = function () {
    var $zxFootBoxDiv         = jqueryMap.$zxFootBoxDiv,
        $zxFootBoxContainer   = jqueryMap.$zxFootBoxContainer, 
        $okAddServerBtn       = jqueryMap.$okAddServerBtn,
        k, len_k, $userTables = jqueryMap.$userBatchDiv.find('table.userTable'), $userTable,
        i, len_i, $batchFirstTrs, $batchFirstTr, $batchFirstTd,
        data_departure, data_departure_isSm, data_return, data_return_isSm,
        type = $(this).data('type'),
        smId,
        $batchDivs = $(".divBatch"),
        batchsArr = [],
        SM_TRAFFIC_STR,
        $trafficTr,
        $departureTraffics = jqueryMap.$trafficTable.find('tr.departureTraffics'),
        $returnTraffics = jqueryMap.$trafficTable.find('tr.returnTraffics');
    // 初始化
    $zxFootBoxContainer
      .empty()
      .html('<h4 style="padding:10px; margin:0; color:#d43f3a;" class="bg-danger">请在用户名单中选择需要服务的组！</h4>');
    if (type == 11 || type == 12) {
      SM_TRAFFIC_STR = "sendTrafficObj";

      // 检查 送机单状态
      for( k = 0, len_k = $departureTraffics.length; k < len_k; k++ ) {
        $trafficTr = $departureTraffics.eq(k);
        if($trafficTr.children().eq(1).text() === '送机单' && $trafficTr.children().eq(1).data('smstatus') > 2 ){
          alert('送机单状态为已完成！');
          return;
        }
      }
      for( k = 0, len_k = $returnTraffics.length; k < len_k; k++ ) {
        $trafficTr = $returnTraffics.eq(k);
        if($trafficTr.children().eq(1).text() === '送机单' && $trafficTr.children().eq(1).data('smstatus') > 2 ){
          alert('送机单状态为已完成！');
          return;
        }
      }
      
    } else if (type == 21 || type == 22) {
      SM_TRAFFIC_STR = "meetTrafficObj";

      // 检查接机单状态
      for( k = 0, len_k = $departureTraffics.length; k < len_k; k++ ) {
        $trafficTr = $departureTraffics.eq(k);
        if($trafficTr.children().eq(1).text() === '接机单' && $trafficTr.children().eq(1).data('smstatus') > 2 ){
          alert('接机单状态为已完成！');
          return;
        }
      }
      for( k = 0, len_k = $returnTraffics.length; k < len_k; k++ ) {
        $trafficTr = $returnTraffics.eq(k);
        if($trafficTr.children().eq(1).text() === '接机单' && $trafficTr.children().eq(1).data('smstatus') > 2 ){
          alert('接机单状态为已完成！');
          return;
        }
      }

    }   

    for( k = 0, len_k = $userTables.length; k < len_k; k++ ) {
      $userTable     = $userTables.eq(k);
      $batchFirstTrs = $userTable.find('tr.tr_first');

      for( i = 0, len_i = $batchFirstTrs.length; i < len_i; i++ ) {
        $batchFirstTr = $batchFirstTrs.eq(i);
        $batchFirstTd = $batchFirstTr.children().first();
        // 初始化
        $batchFirstTd.removeClass('danger success opTdClick')
        $batchFirstTd.find(':checkbox').prop('checked', false);

        data_departure = $batchFirstTr.data('dt_id');
        data_departure_isSm = $batchFirstTr.data('departuretraffic_issm');
        data_return = $batchFirstTr.data('rt_id');
        data_return_isSm = $batchFirstTr.data('returntraffic_issm');

        if (data_departure && !data_departure_isSm && stateMap[SM_TRAFFIC_STR][data_departure]) {

          $batchFirstTd
            .addClass('danger opTdClick')
            .data('sm', data_departure)
            .data('flighttype','departureTraffic')
            .data('name',$userTable.data('name'))
            .data('bt_id', $batchFirstTr.data('id'))
            .data('person_arr', $batchFirstTr.data('person_arr'));

          $batchFirstTd.find(':checkbox')
            .prop('disabled', false)
            .show();
        } else if (data_return && !data_return_isSm && stateMap[SM_TRAFFIC_STR][data_return]) {

          $batchFirstTd
            .addClass('danger opTdClick')
            .data('sm', data_return)
            .data('flighttype','returnTraffic')
            .data('name',$userTable.data('name'))
            .data('bt_id', $batchFirstTr.data('id'))
            .data('person_arr', $batchFirstTr.data('person_arr'));

          $batchFirstTd.find(':checkbox')
            .prop('disabled', false)
            .show();
        } else {
          $batchFirstTd.find(':checkbox')
            .prop('disabled', true)
            .show();
        }
      }
    }

    if($userTables.find('.opTdClick').length === 0){
      jqueryMap.$userBatchDiv.find(':checkbox').hide();
      alert('没有可以使用该服务的航班, \n或所有客人都已使用了该服务。\n您可在服务单中查看和修改。');
      return;
    }

    $okAddServerBtn.data('smtype', type);
    $zxFootBoxDiv.removeClass('hidden');
    //return false;
  };
  // End Event handler /on_addServerDivA_click/

  // Begin Event handler /select_opTdClick/
  select_opTdClick = function (bt_id) {
    //console.log("dd");
    var $that = $('#bt'+bt_id).children().first(),
        k, len_k, $opTdClicks = jqueryMap.$userBatchDiv.find('td.opTdClick'), $opTdClick,
        data_departure, data_return,
        $zxFootBoxContainer = jqueryMap.$zxFootBoxContainer,
        $serverTagDiv;

    $zxFootBoxContainer.find('h4').remove();
    if($that.hasClass('danger')){
      // 判断整个表格现在是不是没有 success
      if($opTdClicks.filter('td.success').length === 0){
        // 把相同航班的组颜色全部变色
        jqueryMap.$okAddServerBtn.data('sm_id', $that.data('sm'));
        for( k = 0, len_k = $opTdClicks.length; k < len_k; k++ ) {
          $opTdClick     = $opTdClicks.eq(k);
          if($opTdClick.data('sm') === $that.data('sm')){
            $opTdClick.removeClass('danger').addClass('success'); 
            // :checkbox
            $opTdClick.find(':checkbox').prop('checked', true);
            // 添加到底部
            $serverTagDiv = $(configMap.server_tag_html);

            $serverTagDiv
              .attr('id', $opTdClick.data('bt_id'))
              .data('rows', $opTdClick.attr('rowspan'))
              .data('flighttype', $opTdClick.data('flighttype'))
              .data('teamBatchNote', $opTdClick.find('div.teamBatchNote').text().replace('组备注:',''))
              .data('person_arr',$opTdClick.data('person_arr'))
              .append('<strong>' + $opTdClick.data('name') + '</strong>-' + $opTdClick.find("span.batchNum").text() + '组')
            $zxFootBoxContainer.append($serverTagDiv);
          }else{
            alert('多航班时，锁定其他航班的组不能选择');
          }
        }
      } else {
        // 只改变自己的颜色
        $that.removeClass('danger').addClass('success'); 
        // :checkbox
        $that.find(':checkbox').prop('checked', true);
        // 添加到底部
        $serverTagDiv = $(configMap.server_tag_html);

        $serverTagDiv
          .attr('id', $that.data('bt_id'))
          .data('rows', $that.attr('rowspan'))
          .data('flighttype', $that.data('flighttype'))
          .data('teamBatchNote', $that.find('div.teamBatchNote').text().replace('组备注:',''))
          .data('person_arr',$that.data('person_arr'))
          .append('<strong>' + $that.data('name') + '</strong>-' + $that.find("span.batchNum").text() + '组')
        $zxFootBoxContainer.append($serverTagDiv);
      }

    } else if ($that.hasClass('success')) {
      $that.removeClass('success').addClass('danger'); 
      // :checkbox
      $that.find(':checkbox').prop('checked', false);
      // 从底部移除
      $('#' + $that.data('bt_id')).remove();


      // 判断整个表格现在是不是没有 success
      if($opTdClicks.filter('td.success').length === 0){

        $opTdClicks.addClass('danger'); 
        // :checkbox
        $opTdClicks.find(':checkbox').prop('checked', false);
      }
    }
  };
  // End Event handler /select_opTdClick/


  // Begin Event handler /onComplete_getTeamByIdEdit/
  onComplete_getTeamByIdEdit = function( event, team ) {
    //console.log(stateMap);
    var $teamInfoTable,
        userArr,   i_u, userObj,   $userTable, $userTableTbody,
        batchArr,  i_b, batchObj,
        personArr, i_p, personObj, $person_tr, len, $person_first_td, 
        i_sn,
        stateMap_user = [],
        departureTrafficArr, returnTrafficArr, i, iPlus, trafficObj, 
        $trafficTableTbody = jqueryMap.$trafficTable.find('tbody'), $trafficTrEdit, $trafficTr;

    //console.log(team);
    stateMap.team = team;
    stateMap.tm_id            = team._id;
    // ---------- 开始渲染UI
    
    // top
    $('#zx-nav-pills-h')
      .removeClass('hidden')
      .html('亲~ 您正在编辑<span style="font-size: 22px;font-weight: 800;color: blue;">团队单</span>, 不要忘记保存哦！');

    $('#zx-nav-pills-bottom').addClass('hidden');
    //jqueryMap.$titleSpan.text('团队单 - 编辑');
    //jqueryMap.$beginEditTime.text(moment().format('YYYY-MM-DD HH:mm'));

    $.gevent.subscribe( jqueryMap.$team, 'zx-getObjectIdFromServer', onComplete_getObjectIdFromServer );
    $.gevent.subscribe( jqueryMap.$team, 'zx-saveTeam', onComplete_saveTeam );
    jqueryMap.$topBtnDiv.append(configMap.top_edit_div_html);
    setJqueryMap(21);
    $.gevent.subscribe( jqueryMap.$saveTeamBtn, 'zx-saveTeamBtnPlusOrMinusOne' , onComplete_saveTeamBtnPlusOrMinusOne);

    jqueryMap
      .$gobackDetailTeamBtn
        .attr('href','#!page=team&c=detail&n=' + team._id)
        .removeClass('hidden');

    // 团队信息
    // 初始化样式
    $teamInfoTable = 
      $(configMap.team_info_table_html)
        .find('.canEdit')
          //.data('id', team._id)
          .addClass('warning')
          .children()
            .attr('contenteditable',true)
            .attr('spellcheck',false)
            .end()
          .end();

    jqueryMap.$teamInfoDiv.append($teamInfoTable);
    setJqueryMap(31);
    // 初始化数据
    jqueryMap.$teamInfoTable = 
      $teamInfoTable
        .data('id', team._id)
        .data('team_obj', team)
        .attr('id','tm' + team._id);
    jqueryMap.$teamNumTdDiv.html(             zx.util_b.decodeHtml(team.teamNum             ));
    jqueryMap.$lineNameTdDiv.html(            zx.util_b.decodeHtml(team.lineName            ));
    jqueryMap.$operatorTdDiv.html(            zx.util_b.decodeHtml(team.operator            ));
    jqueryMap.$teamTypeTdDiv.text(            team.teamType                                  ); // 团队类型     散拼
    jqueryMap.$teamNoteTdDiv.html(            zx.util_b.decodeHtml(team.teamNote            ));
    jqueryMap.$planNumberTdDiv.text(          team.planNumber                                ); // 计划人数     20
    jqueryMap.$realNumberTd.text(             team.realNumber                                ); // 名单人数     2
    jqueryMap.$sendDriverTdDiv.html(          zx.util_b.decodeHtml(team.sendDriver          ));
    jqueryMap.$smFlagTdDiv.html(              zx.util_b.decodeHtml(team.smFlag              ));
    jqueryMap.$meetDriverTdDiv.html(          zx.util_b.decodeHtml(team.meetDriver          ));
    jqueryMap.$guideTdDiv.html(               zx.util_b.decodeHtml(team.guide               ));
    jqueryMap.$sendDestinationFlagTdDiv.html( zx.util_b.decodeHtml(team.sendDestinationFlag ));
    

    // 航班信息
    // 初始化样式
    jqueryMap.$serversTdTh.addClass('hidden');
    
    $trafficTrEdit = $(configMap.traffic_tr_html);
    $trafficTrEdit
      .find('.canEditStyle')
        .addClass('warning')
      .end()
      .find('.flightDateTd')
        .children()
          .append($('<input type="text" class="flightDate"></input>'))
        .end()
        .prev()
          .addClass('hidden')
        .end()
      .end()
      .find('.flightTimeTd')
        .children()
          .append($('<input type="text" class="flightTime"></input>'))
        .end()
      .end()
      .find('.canEdit')
        .addClass('warning')
        .children()
          .attr('contenteditable',true)
          .attr('spellcheck',false)
        .end()
      .end();

    // 缓存到状态集合 stateMap 中，以备后用
    stateMap.traffic_tr_edit_html = $('<div></div>').append($trafficTrEdit).html();

    // 初始化数据
    departureTrafficArr = team.departureTraffics;
    iPlus = 0;
    for( i = 0; i < departureTrafficArr.length; i++ ) {
      trafficObj = departureTrafficArr[i];
      iPlus += 1;

      $trafficTr = $(stateMap.traffic_tr_edit_html);
      $trafficTr
        .data('id', trafficObj._id)
        .data('sm_obj', trafficObj)
        .attr('id', 'dt' + trafficObj._id)
        .addClass('departureTraffics');

      //console.log(moment(trafficObj.flight.flightDate).format('YYYY-MM-DD'));
      $trafficTr.children().eq(0).text('去程航班' + iPlus);
      
      if(trafficObj.flight.flightDate) {
        $trafficTr.find('td.flightDateTd').find('input').val(moment(trafficObj.flight.flightDate).format('YYYY-MM-DD'));
      }

      $trafficTr.find('td.flightNumTd').children().text(trafficObj.flight.flightNum);
      $trafficTr.find('td.flightStartCityTd').children().text(trafficObj.flight.flightStartCity);
      $trafficTr.find('td.flightEndCityTd').children().text(trafficObj.flight.flightEndCity);
      $trafficTr.find('td.flightStartTimeTd').find('input').val(moment(trafficObj.flight.flightStartTime).format('HH:mm'));
      $trafficTr.find('td.flightEndTimeTd').find('input').val(moment(trafficObj.flight.flightEndTime).format('HH:mm'));

      $trafficTableTbody.append($trafficTr);

      if(i === 0) {
        stateMap.dt_id = trafficObj._id;
      }
      //$trafficTr.data('id',trafficObj._id);
    }
    
    returnTrafficArr = team.returnTraffics;
    iPlus = 0;
    for( i = 0; i < returnTrafficArr.length; i++ ) {
      trafficObj = returnTrafficArr[i];
      iPlus += 1;

      $trafficTr = $(stateMap.traffic_tr_edit_html);
      $trafficTr
        .data('id', trafficObj._id)
        .data('sm_obj', trafficObj)
        .attr('id', 'rt' + trafficObj._id)
        .addClass('returnTraffics');

      //console.log(moment(trafficObj.flight.flightDate).format('YYYY-MM-DD'));
      $trafficTr.children().eq(0).text('回程航班' + iPlus);
      if(trafficObj.flight.flightDate) {
        $trafficTr.find('td.flightDateTd').find('input').val(moment(trafficObj.flight.flightDate).format('YYYY-MM-DD'));
      }
      $trafficTr.find('td.flightNumTd').children().text(trafficObj.flight.flightNum);
      $trafficTr.find('td.flightStartCityTd').children().text(trafficObj.flight.flightStartCity);
      $trafficTr.find('td.flightEndCityTd').children().text(trafficObj.flight.flightEndCity);
      $trafficTr.find('td.flightStartTimeTd').find('input').val(moment(trafficObj.flight.flightStartTime).format('HH:mm'));
      $trafficTr.find('td.flightEndTimeTd').find('input').val(moment(trafficObj.flight.flightEndTime).format('HH:mm'));

      $trafficTableTbody.append($trafficTr);

      if(i === 0) {
        stateMap.rt_id = trafficObj._id;
      }
    }

    $.gevent.subscribe( jqueryMap.$trafficTable, 'zx-getFlightInfoFromServer', onComplete_getFlightInfoFromServer );
    
    // 组信息
    // 初始化样式
    $person_first_td = 
      $(configMap.person_first_td_html)
        .find('.canEditDiv')
          .addClass('warning')
          .attr('contenteditable',true)
        .end()
        .find('.team-op')
          .removeClass('hidden')
        .end();

    $person_tr = 
      $(configMap.person_tr_html)
        .find('.team-op')
          .removeClass('hidden')
        .end()
        .find('.canEdit')
          .addClass('warning')
          .children()
            .attr('contenteditable',true)
            .attr('spellcheck',false)
          .end()
        .end()
        .find('td.teamPersonNoteTd')
          .removeClass('hidden')
          /*.nextAll()
            .remove()
          .end()*/
        .end();

    $userTable = 
      $(configMap.user_table_html)
        .find('.team-op')
          .removeClass('hidden')
        .end()
        .find('th.teamPersonNoteTh')
          .removeClass('hidden')
          /*.nextAll()
            .remove()
          .end()*/
        .end();
    // 缓存到状态集合 stateMap 中，以备后用
    stateMap.person_first_td_edit_html = $('<div></div>').append($person_first_td).html();
    stateMap.person_tr_edit_html = $('<div></div>').append($person_tr).html();
    stateMap.user_table_edit_html = $('<div></div>').append($userTable).html();

    // 初始化数据
    userArr = team.users;
    for( i_u = 0; i_u < userArr.length; i_u++ ) {
      userObj  = userArr[i_u];
      batchArr = userObj.batchs;

      $userTable = $(stateMap.user_table_edit_html);
      $userTable
        .attr('id', 'us' + userObj._id._id)
        .data('id', userObj._id._id)
        .find('th.batchTh').text(userObj._id.name + '-' + userObj._id.phone);
      $userTableTbody = $userTable.find('tbody');
      i_sn=0;
      for( i_b = 0; i_b < batchArr.length; i_b++ ) {
        batchObj  = batchArr[i_b];
        personArr = batchObj.persons;

        for( i_p = 0, len = personArr.length; i_p < len; i_p++ ) {
          i_sn++;
          personObj = personArr[i_p];
          $person_tr = $(stateMap.person_tr_edit_html);

          $person_tr.find('td.snTd').text(i_sn);
          $person_tr.find('td.nameTd').children().text(personObj.name);
          $person_tr.find('td.cardNumTd').children().text(personObj.cardNum);
          $person_tr.find('td.phoneTd').children().text(personObj.phone);
          $person_tr.find('td.birthdayTd').children().text(personObj.birthday);
          $person_tr.find('td.sexTd').children().text(personObj.sex);
          $person_tr.find('td.cardCategoryTd').children().text(personObj.cardCategory);
          $person_tr.find('td.ageTd').children().text(personObj.age === 0?'':personObj.age);
          $person_tr.find('td.ageTypeTd').children().text(personObj.ageType);
          $person_tr.find('td.roomTd').children().text(personObj.room);
          $person_tr.find('td.teamPersonNoteTd').children().html(zx.util_b.decodeHtml(personObj.teamPersonNote));
          $person_tr.find('td.sendPersonNoteTd').children().html(zx.util_b.decodeHtml(personObj.sendPersonNote));
          $person_tr.find('input.checkboxIsSend').prop('checked',personObj.isSend);
          $person_tr.find('td.meetPersonNoteTd').children().html(zx.util_b.decodeHtml(personObj.meetPersonNote));
          $person_tr.find('input.checkboxIsMeet').prop('checked',personObj.isMeet);
          
          if(i_p === 0) {
            //console.log(batchObj);
            if(batchObj.departureTraffic._id){
              $person_tr.data('dt_id', batchObj.departureTraffic._id);
            }
            if(batchObj.returnTraffic._id){
              $person_tr.data('rt_id', batchObj.returnTraffic._id);
            }
            $person_tr
              .data('id',batchObj._id)
              .data('batch_obj', batchObj)
              .attr('id', 'bt' + batchObj._id)
              .addClass('tr_first')
              .prepend(
                $(stateMap.person_first_td_edit_html).attr('rowspan', len)
                  .find('span.batchNum').text(batchObj.batchNum)
                  .end()
                  .find('div.batchPersonCount').text(len)
                  .end()
                  .find('div.guest').text(batchObj.guest)
                  .end()
                  .find('div.teamBatchNote').html(zx.util_b.decodeHtml(batchObj.teamBatchNote))
                  .end()
              );
          }
          $userTableTbody.append($person_tr);
        }
      }
      jqueryMap.$userBatchDiv.append($userTable);
    }
    

    // footer
    jqueryMap.$companyAbbrSpan.text(team.companyAbbr);
    jqueryMap.$nameSpan.text(team.name);
    jqueryMap.$dateSpan.text(moment(team.meta.createAt).format('YYYY-MM-DD'));

    // 验证 证件号码 手机号码 出生日期 性别 证件类型 年龄 年龄段
    $('.cardNumTd').zxvalid('cardNum');
    $('.phoneTd').zxvalid('phone');
    $('.birthdayTd').zxvalid('birthday');
    $('.sexTd').zxvalid('sex');
    $('.cardCategoryTd').zxvalid('cardCategory'); 
    $('.ageTd').zxvalid('age');
    $('.ageTypeTd').zxvalid('ageType');

    jqueryMap.$team.show();
    // ---------- 结束渲染UI

    //jqueryMap.$setDefaultFlagBtn.show();
    
    // ---------- 开始注册事件
    //newMultiselect($departureTrafficTrLi, 0);
    //newMultiselect($returnTrafficTrLi, 1);
    //updadeMultiselect();

    $.gevent.subscribe( jqueryMap.$team, 'zx-completeGetlist', onCompleteGetlist );
    // 所有 hidden.bs.dropdown 事件， 销毁 dropdown控件
    jqueryMap.$team.on('hidden.bs.dropdown','.dropdown',     on_hidden_td_dropdown);

    // 出发地旗号
    jqueryMap.$smFlagTdDiv.focus(              on_smFlagTdDiv_focus );
    // 地接旗号
    jqueryMap.$sendDestinationFlagTdDiv.focus( on_sendDestinationFlagTdDiv_focus );
    // 地接人员
    jqueryMap.$guideTdDiv.focus(               on_guideTdDiv_focus );
    // 操作人
    jqueryMap.$operatorTdDiv.focus(            on_operatorTdDiv_focus );
    // 团队类型
    jqueryMap.$teamTypeTdDiv.focus(            on_teamTypeTdDiv_focus );
    

    // 日期控件
    $('input.flightDate').datetimepicker({
      format: 'YYYY-MM-DD',
      dayViewHeaderFormat: 'YYYY MMMM',
      //useCurrent: false,
      locale: 'zh-cn',
      showTodayButton: true,
      showClear: true
    });

    $('input.flightDate').blur(function(){
      var $that = $(this),
          $tr = $that.closest('tr'),
          sm_obj = $tr.data('sm_obj');

      if(sm_obj.smStatus > 0 && $that.val() ===''){
        alert('该字段已经关联了服务单, 可以修改, 但不能删除');
        $that.val(sm_obj.flight.flightDate);
        //$that.focus();
      }
    });

    // 时间控件
    $('input.flightTime').datetimepicker({
      format: 'HH:mm'
      //useCurrent: false
    });

    $('input.flightTime').blur(function(){
      var 
        $that = $(this),
        $td = $that.closest('td'),
        $tr = $td.closest('tr'),
        sm_obj = $tr.data('sm_obj');

      if(sm_obj.smStatus > 0 && $that.val() ===''){
        alert('该字段已经关联了服务单, 可以修改, 但不能删除');
        if($td.hasClass('flightStartTimeTd')){
          $that.val(sm_obj.flight.flightStartTime);
        } else {
          $that.val(sm_obj.flight.flightEndTime);
        }
      }
    });

    // 航班号
    jqueryMap.$trafficTable.on('blur', 'div.flightNumTdDiv', function(){
      var $that = $(this),
          $tr = $that.closest('tr'),
          sm_obj = $tr.data('sm_obj');

      if(sm_obj.smStatus > 0 && $that.text() ===''){
        alert('该字段已经关联了服务单, 可以修改, 但不能删除');
        $that.text(sm_obj.flight.flightNum);
        //$that.focus();
      }
    });

    // 始发地 抵达地 含 深圳
    jqueryMap.$trafficTable.on('blur', 'div.flightCityTdDiv', function(){
      var 
        CITY = stateMap.city,
        $that = $(this),
        $td = $that.closest('td'),
        $tr = $td.closest('tr'),
        sm_obj = $tr.data('sm_obj'),
        city;

      if(sm_obj.smStatus > 0){
        if($td.hasClass('flightStartCityTd')){
          city = sm_obj.flight.flightStartCity;
        } else {
          city = sm_obj.flight.flightEndCity;
        }

        if(city.indexOf(CITY) === 0){
          if($that.text() !== city ){
            alert('该字段已经关联了服务单, 不能修改和删除');
            $that.text(city);
          }

        } else {
          if($that.text() ===''){
            alert('该字段已经关联了服务单, 可以修改, 但不能删除');
            $that.text(city);
          }
        }
      }
    });

    // 航班号-小写转大写
    jqueryMap.$trafficTable.on('blur', 'div.flightNumTdDiv',    on_flightNumTdDiv_blur);
    // 始发地 抵达地 含 深圳
    //jqueryMap.$trafficTable.on('blur', 'div.flightCityTdDiv',   on_flightCityTdDiv_blur);
    // 从服务器获取航班
    jqueryMap.$trafficTable.on('click', 'button.refreshBtn',   on_refreshBtn_click);

    // 证件号码 手机号码 出生日期 年龄 失去焦点时验证
    jqueryMap.$userBatchDiv
      .on('blur','td.cardNumTd', on_cardNumTd_blur )
      .on('blur','td.phoneTd', on_phoneTd_blur )
      .on('blur','td.birthdayTd', on_birthdayTd_blur )
      .on('blur','td.ageTd', on_ageTd_blur );
      
    // 收客单位 性别 证件类型 年龄段
    jqueryMap.$userBatchDiv.on('focus','div.guest',             on_guest_focus);
    jqueryMap.$userBatchDiv.on('focus','div.sexTdDiv',          on_sexTdDiv_focus);
    jqueryMap.$userBatchDiv.on('focus','div.cardCategoryTdDiv', on_cardCategoryTdDiv_focus);
    jqueryMap.$userBatchDiv.on('focus','div.ageTypeTdDiv',      on_ageTypeTdDiv_focus);
    // 加组减组、加行减行
    jqueryMap.$userBatchDiv.on('click','span.spanRemoveBatch',  on_spanRemoveBatch_click);
    jqueryMap.$userBatchDiv.on('click','span.spanAddBatch',     on_spanAddBatch_click);
    jqueryMap.$userBatchDiv.on('click','span.spanRemoveTr',     on_spanRemoveTr_click);
    jqueryMap.$userBatchDiv.on('click','span.spanNewTr',        on_spanNewTr_click);

    // 快速分组
    jqueryMap.$userBatchDiv.on('blur','div.batchPersonCount',   on_batchPersonCount_blur);

    // 添加航班 添加名单 保存
    //jqueryMap.$importBtn.click(   on_importBtnClick ); // 导入名单
    jqueryMap.$saveTeamBtn.click( function(){ on_saveTeamBtnClick(false); } );
    // ---------- 结束注册事件

    jqueryMap.$team.show(); 
  };
  // End Event handler /onComplete_getTeamByIdEdit/

  // Begin Event handler /onComplete_getSmById/
  onComplete_getSmById = function( event, obj ){
    var timeout_count = 1;
    var idcardsms = obj.idcardsms || [];
    var len_cards = idcardsms.length;
    var isidcard = obj.isidcard;
    var team = obj.team;
    var sm = obj.sm;
    var sm_idcardsmfees = sm.idcardsmfees || 0;
    var otherSm = null;
    var userArr = [];
    var batch_arr = [];
    var batch_pingan_arr = [];
    var check_idcardsms_sum = 0;
    var check_smSetTime_to_next = moment(sm.smSetTime).isAfter(moment());
    var i_cards;
    var check_idcardsms_to_next;
    var spanHtml,
        CHINAWORD,
        $smInfoTable,
        smDate, smTime, smType,
        departureTrafficArr, returnTrafficArr, i, trafficObj, 
        //otherSm = null,
        userArr_t, i_ut, userObj_t,
        batchArr_t, i_bt, batchObj_t,
        personArr_t, i_pt, personObj_t, batchArr_t_push, personArr_t_push,
        i_sn,
        $person_first_td, $person_tr, $person_name_td, $person_cardNum_td,
        $userTable, $userTableTbody,
        // userArr = [],
        i_u, userObj, 
        batchArr, i_b, batchObj,
        // batch_arr = [],
        // batch_pingan_arr = [],
        personArr, i_p, len, personObj,
        smAgencyFund, smAgencyFund_y, smPayment, smPayment_y, smBatchNote,
        flightDate_text, flightStartTime_text, flightEndTime_text;

    var personObj_key;

    var test_i;
    var test_card;
    var test_obj = {};
    var test_arr = [];
    // idcardsms 去重
    if (len_cards) {
      for (test_i = 0; test_i < len_cards; test_i++) {
        test_card = idcardsms[test_i];
        personObj_key = test_card.cardNum + test_card.name;
        if (!test_obj[personObj_key]) {
          test_obj[personObj_key] = true;
          test_arr.push(test_card);
        }
      }

      idcardsms = test_arr;
      len_cards = idcardsms.length;
    }

    // if (len_cards) {
    //   var $test_table = $('<table></table>');
    //   var $test_tr;
    //   for (test_i = 0; test_i < len_cards; test_i++) {
    //     test_card = idcardsms[test_i];
    //     $test_tr = $('<tr></tr>');
    //     $test_tr.append('<td>' + test_i + '</td>');
    //     $test_tr.append('<td>' + test_card._id + '</td>');
    //     $test_tr.append('<td>' + test_card.cardNum + '</td>');
    //     $test_tr.append('<td>' + moment(test_card.createAt).format('YYYY-MM-DD HH:mm:ss:SSS') + '</td>');
    //     $test_tr.append('<td>' + test_card.message + '</td>');
    //     $test_tr.append('<td>' + test_card.name + '</td>');
    //     $test_table.append($test_tr);
    //   }
    //   $('body').append($test_table);
    // }

    stateMap.team = team;
    stateMap.tm_id = team._id;
    stateMap.isDownload = sm.isDownload;
    stateMap.isSVDownload = sm.isSVDownload;
    // ---------- 开始渲染UI
    // 初始化UI界面数据
    // 侧边栏
    $('#zx-shell-sidebar-history').removeClass('hidden');
    zx.model.message.getMessageBySmId({ sm_id : sm._id });

    jqueryMap.$topBtnDiv.empty().show();
    jqueryMap.$teamInfoDiv.empty();
    jqueryMap.$userBatchDiv.empty();

    CHINAWORD = sm.smType1 === 1 ? '送' : '接';

    // top
    //jqueryMap.$titleSpan.text( CHINAWORD + '机单 - 详情页' );
    //jqueryMap.$beginEditTime.text('');
    
    jqueryMap.$beginEditTime.addClass('hidden');
    if(stateMap.us_id !== team.lock.user_id && team.lock.isLocked === true){   
      jqueryMap.$beginEditTime.html(
        String()
          + '<span class="text-primary">'
            + team.lock.editName + '正在编辑, 始于 ' + moment(team.lock.beginTime).format('YYYY-MM-DD HH:mm')
          + '</span>'
      ).removeClass('hidden');
      jqueryMap.$topBtnDiv.hide();
    }
    jqueryMap.$topBtnDiv.append(configMap.sm_top_detail_div_html);
    
    //$.gevent.subscribe( jqueryMap.$team, 'zx-saveSm', onComplete_saveSm );
    setJqueryMap(52);
    jqueryMap.$gotoEditSmBtn.attr('href','#!page=sm&c=edit&n=' + sm._id);

    if(team.isOpen === false && Number(stateMap.category) === 20 && team.user !== stateMap.us_id){
      $('#owndiv').addClass('hidden');
    }

    //$smInfoTable = sm.smType1 === 1 ? $(configMap.send_info_table_html) : $(configMap.meet_info_table_html); 
    $smInfoTable = 
      sm.smType1 === 1 
      ? $(configMap.send_info_table_html)
          .find('#smNoteTdDiv')
            .css('min-height', 0)
          .end()
      : $(configMap.meet_info_table_html)
          .find('#smNoteTdDiv')
            .css('min-height', 0)
          .end();
    jqueryMap.$teamInfoDiv.append($smInfoTable);
    setJqueryMap(61);

    // -- smInfo 送机接机信息
    // 初始化样式
    // 找出一个不等于当前的 sm._id 的 trafficObj
    departureTrafficArr = team.departureTraffics;
    for( i = 0; i < departureTrafficArr.length; i++ ) {
      trafficObj = departureTrafficArr[i];
      if(trafficObj._id !== sm._id){
        otherSm = trafficObj;
        break;
      }
    }
    if(otherSm === null){
      returnTrafficArr = team.returnTraffics;
      for( i = 0; i < returnTrafficArr.length; i++ ) {
        trafficObj = returnTrafficArr[i];
        if(trafficObj._id !== sm._id){
          otherSm = trafficObj;
          break;
        }
      }
    }
    if(sm.smType1 === 1){
      $('#send_a').parent().addClass('active').removeClass('hidden');
      if(otherSm !== null){
        if(otherSm.smStatus > 0){
          $('#meet_a')
            .css('background-color','#FFF')
            .attr('href','#!page=sm&c=detail&n=' + otherSm._id)
              .parent().removeClass('hidden');
        }
        // 关联航班
        flightDate_text      = '';
        flightStartTime_text = '';
        flightEndTime_text   = '';
        if(otherSm.flight.flightDate) {
          flightDate_text      = moment(otherSm.flight.flightDate).format('YYYY-MM-DD');
          flightStartTime_text = moment(otherSm.flight.flightStartTime).format('HH:mm');
          flightEndTime_text   = moment(otherSm.flight.flightEndTime).format('HH:mm');
        }

        jqueryMap.$smNumTd.text(flightDate_text + " " + otherSm.flight.flightNum + " " + otherSm.flight.flightStartCity + "-" + otherSm.flight.flightEndCity + " " + flightStartTime_text + "-" + flightEndTime_text);
      }
    } else {
      $('#meet_a').parent().addClass('active').removeClass('hidden');
      if(otherSm !== null){
        if(otherSm.smStatus > 0){
          $('#send_a')
            .css('background-color','#FFF')
            .attr('href','#!page=sm&c=detail&n=' + otherSm._id)
              .parent().removeClass('hidden');
        }
        // 关联航班
        flightDate_text      = '';
        flightStartTime_text = '';
        flightEndTime_text   = '';
        if(otherSm.flight.flightDate) {
          flightDate_text      = moment(otherSm.flight.flightDate).format('YYYY-MM-DD');
          flightStartTime_text = moment(otherSm.flight.flightStartTime).format('HH:mm');
          flightEndTime_text   = moment(otherSm.flight.flightEndTime).format('HH:mm');
        }

        jqueryMap.$smNumTd.text(flightDate_text + " " + otherSm.flight.flightNum + " " + otherSm.flight.flightStartCity + "-" + otherSm.flight.flightEndCity + " " + flightStartTime_text + "-" + flightEndTime_text);
      }
    }

    
    // 初始化数据
    jqueryMap.$smInfoTable = 
      $smInfoTable
        .data('sm_obj', sm)
        .data('id', sm._id)
        .attr('id','sm' + sm._id);

    // 团号
    spanHtml = String()
      + '<span class="label label-primary" style="margin-right:5px;">独立</span>';
    if(team.isOpen){
      spanHtml = String()
        + '<span class="label label-success" style="margin-right:5px;">合作</span>';
    }
    //console.log(Number(stateMap.category) === 20);
    $('#team_a')
      .css('background-color','#FFF')
      .attr('href','#!page=team&c=detail&n=' + team._id);
    if(Number(stateMap.category) === 20){
      jqueryMap.$teamNumTdDiv.html('<a style="text-decoration:none;" href="#!page=team&c=detail&n=' + team._id + '">' + spanHtml + zx.util_b.decodeHtml(team.teamNum)  +'</a>'); // 团号
      /*$('#team_a')
        .css('background-color','#FFF')
        .attr('href','#!page=team&c=detail&n=' + team._id);*/
    } else {
      if(sm.smType1 === 1){
        $('#insuranceBtn').removeClass('hidden');
      }

      if (sm.phoneMsgStatus === 0) {
        $('#phoneMessageBtn').removeClass('hidden');
      }
      //$('#team_a').parent().remove();
      jqueryMap.$teamNumTdDiv.html(           zx.util_b.decodeHtml(team.teamNum             )); // 团号
    }
    jqueryMap.$lineNameTdDiv.html(            zx.util_b.decodeHtml(team.lineName            )); // 线路
    jqueryMap.$operatorTdDiv.html(            zx.util_b.decodeHtml(team.operator            )); // 操作人
    jqueryMap.$teamTypeTdDiv.text(            team.teamType                                  ); // 团队类型     散拼
    jqueryMap.$smNoteTdDiv.html(              zx.util_b.decodeHtml(sm.smNote                )); // 备注
    jqueryMap.$smRealNumberTd.text(           sm.smRealNumber                                ); // 名单人数     2
    jqueryMap.$sendDriverTdDiv.html(          zx.util_b.decodeHtml(team.sendDriver          )); // 送机司机
    jqueryMap.$smFlagTdDiv.html(              zx.util_b.decodeHtml(team.smFlag              )); // 出发地旗号
    jqueryMap.$meetDriverTdDiv.html(          zx.util_b.decodeHtml(team.meetDriver          )); // 接机司机
    jqueryMap.$guideTdDiv.html(               zx.util_b.decodeHtml(team.guide               )); // 地接人员 送机
    jqueryMap.$sendDestinationFlagTdDiv.html( zx.util_b.decodeHtml(team.sendDestinationFlag )); // 地接旗号 送机

    /*// 送机单号
    smDate  = sm.flight.flightDate.substring(5, 10).replace("-", "");
    smTime  =
        sm.smType1 === 1
        ? smTime = sm.flight.flightStartTime.replace(":", "") 
        : smTime = sm.flight.flightEndTime.replace(":", "");
    jqueryMap.$smNumTd.html(smDate + smTime + sm.flight.flightNum + sm.companyAbbr +"<span>" + sm.smRealNumber +"</span>人" + (sm.smType2===1?"内":"外") + CHINAWORD);
    */
    // 送机航班
    jqueryMap.$smDateTd.text(moment(sm.flight.flightDate).format('YYYY-MM-DD'));
    jqueryMap.$smFlightTd.text(sm.flight.flightNum + " " + sm.flight.flightStartCity + "-" + sm.flight.flightEndCity + " " + moment(sm.flight.flightStartTime).format('HH:mm') + "-" + moment(sm.flight.flightEndTime).format('HH:mm'));
    
    //if(sm.smType2 === 1) {
    jqueryMap.$smServerTdDiv.text(sm.smServer);         // 送机人员
    /*} else {
      jqueryMap.$smServerTdDiv.text('待定');
    }*/

    jqueryMap.$smSetPlaceTd.text(sm.smSetPlace);     // 集合地点
    jqueryMap.$smSetTimeDiv.text(moment(sm.smSetTime).format('HH:mm'));       // 集合时间

    smType = sm.smType2 === 1 ? "机场内"+CHINAWORD+"机" : "机场外"+CHINAWORD+"机";
    jqueryMap.$smType2TdDiv.text(smType);       // 送机类型

    // 钱
    $('#smPayment').text(sm.smPayment / 100);              // 代付款项 +
    $('#smPayment_y').text(sm.smPayment_y / 100);          // 已付款项 +
    $('#smAgencyFund').text(sm.smAgencyFund / (-100));     // 代收款项 -
    $('#smAgencyFund_y').text(sm.smAgencyFund_y / (-100)); // 已收款项 -
    $('#fees').text(sm.fees / 100);
    if(sm.addFees < 0) {
      $('#addFees').text(sm.addFees / 100 + ' ' + sm.addFeesNote);
    } else if(sm.addFees > 0) {
      $('#addFees').text('+' + sm.addFees / 100 + ' ' + sm.addFeesNote);
    }
    $('#carFees').text(sm.carFees / 100);
    // 现场操作
    $('#serverMan').text(sm.serverMan);
    // 保险
    $('#insurance').text(sm.insurance); //单位 : 份
    (sm.smType1 !== 1) 
    && $('#insurance')
          .addClass('hidden')
          .next().addClass('hidden');

    // 如果是服务商
    if(Number(stateMap.category) === 30){
      //$('#team_a').parent().addClass('hidden');
      $('#insuranceDiv').removeClass('hidden');
    }

    // 航班信息 隐藏 
    jqueryMap.$trafficTable.hide();

    // top 导航
    jqueryMap.$zxNavPills.removeClass('hidden');
    //$('#zx-nav-pills-h').addClass('hidden');
    // -- 名单 组信息
    // 初始化样式
    $person_first_td = $(configMap.sm_person_first_td_html);

    $person_tr = $(configMap.person_tr_html);

    if(sm.smType1 === 1) {
      $person_tr
        .find('td.sendPersonNoteTd')
          .removeClass('hidden')
        .end();
        /*.find('td.isSendTd')
          .removeClass('hidden')
        .end();*/
    } else if ( sm.smType1 === 2 ) {
      $person_tr
        .find('td.meetPersonNoteTd')
          .removeClass('hidden')
        .end();
        /*.find('td.isMeetTd')
          .removeClass('hidden')
        .end();*/
    }

    $userTable = $(configMap.user_table_html);

    if(sm.smType1 === 1) {
      $userTable
        .find('th.sendPersonNoteTh')
          .removeClass('hidden')
        .end();
        /*.find('th.isSendTh')
          .removeClass('hidden')
        .end();*/
    } else if ( sm.smType1 === 2 ) {
      $userTable
        .find('th.meetPersonNoteTh')
          .removeClass('hidden')
        .end();
        /*.find('th.isMeetTh')
          .removeClass('hidden')
        .end();*/
    }

    // 缓存到状态集合 stateMap 中，以备后用
    stateMap.person_first_td_detail_html = $('<div></div>').append($person_first_td).html();
    stateMap.person_tr_detail_html = $('<div></div>').append($person_tr).html();
    stateMap.user_table_detail_html = $('<div></div>').append($userTable).html();

    userArr_t = team.users;
    // 判断每个user有没有满足条件的组
    // 找出满足条件的组
    // 1 sm_id
    // 2 sm.smType1 = 1 && people.isSend = true || sm.smType1 = 2 && isMeet = true
    for( i_ut = 0; i_ut < userArr_t.length; i_ut++ ) {
      userObj_t = userArr_t[i_ut];
      batchArr_t = userObj_t.batchs;
      batchArr_t_push = [];

      for( i_bt = 0; i_bt < batchArr_t.length; i_bt++ ) {
        batchObj_t = batchArr_t[i_bt];
        if(( batchObj_t.departureTraffic._id === sm._id && batchObj_t.departureTraffic.isSm === true ) 
          || ( batchObj_t.returnTraffic._id === sm._id && batchObj_t.returnTraffic.isSm ===true )){

          batch_arr.push($.extend( true, {}, batchObj_t ));

          personArr_t = batchObj_t.persons;
          personArr_t_push = [];
          for( i_pt = 0; i_pt < personArr_t.length; i_pt++ ) {
            personObj_t = personArr_t[i_pt];
            if((sm.smType1 === 1 && personObj_t.isSend) || (sm.smType1 === 2 && personObj_t.isMeet)){
              personArr_t_push.push(personObj_t);
            }
          }
          
          //batch_id_arr.push({ _id: batchObj_t._id });

          batchObj_t.persons = personArr_t_push;
          batchArr_t_push.push(batchObj_t);
          batch_pingan_arr.push(batchObj_t);
        } 
      }
      if(batchArr_t_push.length !== 0){
        userObj_t.batchs = batchArr_t_push;
        userArr.push(userObj_t);
      }
    }

    jqueryMap.$smInfoTable.data('batch_pingan_arr', batch_pingan_arr);
    jqueryMap.$smInfoTable.data('batch_arr', batch_arr);

    for( i_u = 0; i_u < userArr.length; i_u++ ) {
      userObj  = userArr[i_u];
      batchArr = userObj.batchs;

      $userTable = $(stateMap.user_table_detail_html);
      $userTable
        .attr('id', 'us' + userObj._id._id)
        .data('id', userObj._id._id)
        .data('name', userObj._id.name)
        .find('th.batchTh').text(userObj._id.name + '-' + userObj._id.phone);
      $userTableTbody = $userTable.find('tbody');
      i_sn=0;
      for( i_b = 0; i_b < batchArr.length; i_b++ ) {
        batchObj  = batchArr[i_b];
        personArr = batchObj.persons;

        for( i_p = 0, len = personArr.length; i_p < len; i_p++ ) {
          i_sn++;
          personObj = personArr[i_p];
          $person_tr = $(stateMap.person_tr_detail_html);
          $person_name_td = $person_tr.find('td.nameTd');
          $person_cardNum_td = $person_tr.find('td.cardNumTd');

          $person_tr.find('td.snTd').text(i_sn);
          $person_name_td.children().text(personObj.name);
          $person_cardNum_td.children().text(personObj.cardNum);
          $person_tr.find('td.phoneTd').children().text(personObj.phone);
          $person_tr.find('td.birthdayTd').children().text(personObj.birthday);
          $person_tr.find('td.sexTd').children().text(personObj.sex);
          $person_tr.find('td.cardCategoryTd').children().text(personObj.cardCategory);
          $person_tr.find('td.ageTd').children().text(personObj.age===0?'' : personObj.age);
          $person_tr.find('td.ageTypeTd').children().text(personObj.ageType);
          $person_tr.find('td.roomTd').children().text(personObj.room);
          $person_tr.find('td.sendPersonNoteTd').children().html(zx.util_b.decodeHtml(personObj.sendPersonNote));
          $person_tr.find('td.meetPersonNoteTd').children().html(zx.util_b.decodeHtml(personObj.meetPersonNote));
          
          // 匹配历史纪录
          check_idcardsms_to_next = true;
          for (i_cards = 0; i_cards < len_cards; i_cards++) {
            if (idcardsms[i_cards].name === personObj.name 
                && idcardsms[i_cards].cardNum === personObj.cardNum) {

              // 本地储存如果有，删除
              personObj_key = personObj.cardNum + '_' + personObj.name;
              if (window.localStorage && localStorage[personObj_key]) {
                localStorage.removeItem(personObj_key);
              }

              if (idcardsms[i_cards].message === '一致') {
                $person_name_td.children(':first').addClass('person-check-ok');
              } else {
                $person_name_td.children(':first').addClass('person-check-err');
              }
              check_idcardsms_sum++;
              check_idcardsms_to_next = false;
              break;
            }
          }

          if (personObj.cardCategory === '身份证') {
            if (zx.util.checkIdCardField(personObj.cardNum)) {
              // 自动验证为真 && 不匹配历史纪录 && 没到集合时间 && 姓名不为空
              if (isidcard && check_idcardsms_to_next && check_smSetTime_to_next && personObj.name !== '' ) {

                //console.log(sm.company);
                //console.log(stateMap.city);
                //console.log(sm._id);
                //console.log(personObj.name);
                //console.log(personObj.cardNum);

                (function ($person_name_td_child, name, cardNum, timeout_count) {
                  setTimeout(function () {
                    var key = cardNum + '_' + name;
                    if (!(window.localStorage && localStorage[key])) {
                      // 本地储存如果没有，加入
                      if (window.localStorage) {
                        localStorage.setItem(key, JSON.stringify({
                          timestamp: moment().valueOf()
                        }));
                      }
                      // 查询身份证与姓名是否一致
                      //console.log('查询身份证与姓名是否一致');

                      zx.model.idcard.getAvatarIdcardsmCertificate({
                        company: sm.company,
                        city: stateMap.city,
                        user: stateMap.name,
                        sm: sm._id,
                        name: name,
                        cardNum: cardNum,
                      }, function (results) {
                        //console.log(results);
                        // 本地储存如果有，删除
                        if (window.localStorage && localStorage[key]) {
                          localStorage.removeItem(key);
                        }

                        if (results.error_code === 0) {
                          if (results.result.message === '一致') {
                            $person_name_td_child.addClass('person-check-ok');
                          } else {
                            $person_name_td_child.addClass('person-check-err');
                          }
                        } else {
                          $person_name_td_child.addClass('person-check-err');
                        }
                        //$person_name_td_child.addClass('person-check-ok');
                      });
                    }
                  }, timeout_count * 200);
                })($person_name_td.children(':first'), personObj.name, personObj.cardNum, timeout_count);
                timeout_count++;
              }
            } else {
              $person_cardNum_td.children(':first').addClass('person-check-err');
            }
          } else if (personObj.cardCategory === '') {
            $person_cardNum_td.children(':first').addClass('person-check-err');
          }

          if(i_p === 0) {

            if(batchObj.departureTraffic._id){
              $person_tr.data('dt_id', batchObj.departureTraffic._id);
              $person_tr.data('departuretraffic_issm', batchObj.departureTraffic.isSm);
            }
            if(batchObj.returnTraffic._id){
              $person_tr.data('rt_id', batchObj.returnTraffic._id);
              $person_tr.data('returntraffic_issm', batchObj.returnTraffic.isSm);
            }

            if(sm.smType1 === 1) {
              smAgencyFund   = (batchObj.sendAgencyFund)/(-100);
              smAgencyFund_y = (batchObj.sendAgencyFund_y)/(-100);
              smPayment      = (batchObj.sendPayment)/100;
              smPayment_y    = (batchObj.sendPayment_y)/100;
              smBatchNote    = zx.util_b.decodeHtml(batchObj.sendBatchNote);
            } else {
              smAgencyFund   = (batchObj.meetAgencyFund)/(-100);
              smAgencyFund_y = (batchObj.meetAgencyFund_y)/(-100);
              smPayment      = (batchObj.meetPayment)/100;
              smPayment_y    = (batchObj.meetPayment_y)/100;
              smBatchNote    = zx.util_b.decodeHtml(batchObj.meetBatchNote);
            }

            $person_tr
              .data('id',batchObj._id)
              .attr('id', 'bt' + batchObj._id)
              .addClass('tr_first')
              .prepend(
                $(stateMap.person_first_td_detail_html).attr('rowspan', len)
                  .find('span.batchNum').text(batchObj.batchNum)
                  .end()
                  .find('div.batchPersonCount').text(len)
                  .end()
                  .find('div.guest').text(batchObj.guest)
                  .end()
                  .find('div.smAgencyFund').html(smAgencyFund === 0 ? 0 : '<span style="color: red; font-weight: 700;">' + smAgencyFund + '</span>')       // 代收款项 -
                  .end()
                  .find('div.smAgencyFund_y').html(smAgencyFund_y === 0 ? 0 : '<span style="color: red; font-weight: 700;">' + smAgencyFund_y + '</span>') // 已收款项 -
                  .end()
                  .find('div.smPayment').html(smPayment === 0 ? 0 : '<span style="color: red; font-weight: 700;">' + smPayment + '</span>')                // 代付款项
                  .end()
                  .find('div.smPayment_y').html(smPayment_y === 0 ? 0 : '<span style="color: red; font-weight: 700;">' + smPayment_y + '</span>')          // 已付款项
                  .end()
                  .find('div.smBatchNote').html(smBatchNote)
                  .end()
              );
          }
          $userTableTbody.append($person_tr);

          //personObj[IS_CHECKED] = true;
        }

        //batchObj[TRAFFIC]['isSm'] = false; 
        //batch_arr.push(batchObj);
        //batch_id_arr.push({ _id: batchObj._id });
      }
      jqueryMap.$userBatchDiv.append($userTable);
    }

    //console.log(len_cards);
    //console.log(check_idcardsms_sum);
    //console.log(sm_idcardsmfees);
    // 送机单不管
    if (isidcard && (sm_idcardsmfees !== len_cards - check_idcardsms_sum)) {
      sm_idcardsmfees = len_cards - check_idcardsms_sum;
      // 写回数据库, 离铉之箭
      zx.model.idcard.setIdcardsmfees({
        id: sm._id,
        idcardsmfees: sm_idcardsmfees,
      });
    }
    $('#idcardsmfees').text(sm_idcardsmfees);

    // footer
    jqueryMap.$companyAbbrSpan.text(team.companyAbbr);
    jqueryMap.$nameSpan.text(team.name);
    jqueryMap.$dateSpan.text(moment(team.meta.createAt).format('YYYY-MM-DD'));

    // 验证 证件号码 手机号码 出生日期 性别 证件类型 年龄 年龄段
    //$('.cardNumTd').zxvalid('cardNum');
    $('.phoneTd').zxvalid('phone');
    $('.birthdayTd').zxvalid('birthday');
    $('.sexTd').zxvalid('sex');
    $('.cardCategoryTd').zxvalid('cardCategory'); 
    $('.ageTd').zxvalid('age');
    $('.ageTypeTd').zxvalid('ageType');

    jqueryMap.$team.show();
    // ---------- 结束渲染UI:
    
    // Begin Event handler /downloadSmBtn_click/
    jqueryMap.$team.on('click', '#downloadSmBtn', function(){
      var 
        $that = $(this),
        data;

      if(stateMap.category === 20){
        data = {
          id         : sm._id,
          isDownload : stateMap.isDownload,
          isSV       : false
        };
      } else if (stateMap.category === 30){
        data = {
          id           : sm._id,
          isSVDownload : stateMap.isSVDownload,
          isSV         : true
        };
      }

      $that.prop("disabled", true);

      // 向服务器请求数据
      //console.log(configMap.sm_model);
      configMap.sm_model.downloadSm(data);
    });
    // End Event handler /downloadSmBtn_click/
    
    // 一键复制手机号码
    jqueryMap.$team.on('click', '#phoneMessageBtn', function(){
      var
        alidayu   = {
          sms_type: 'normal',
          sms_free_sign_name: '阳光服务'
        },
        $phoneTds = $('.phoneTd'),
        phoneArr  = [], // 电话号码数组
        smFlag    = $('#smFlagTdDiv').text(),
        smSetTime = $('#smSetTimeDiv').text(),
        smSetPlace= $('#smSetPlaceTd').text(),
        setplace_name = zx.config.getConfigMapItem('setplace_name'),
        setplace_phone = zx.config.getConfigMapItem('setplace_phone'),
        setplace_call = zx.config.getConfigMapItem('setplace_call'),
        i, len_i, k, len_k, $div, div_text, isAdd, smSetTimeType,
        
        msgStr,
        msgTemplate, msgObj;   // 短信模板

      for(i = 0, len_i = $phoneTds.length; i < len_i; i++){
        $div = $phoneTds.eq(i).find('div');
        div_text = $div.text();
        if(!$div.hasClass('person-check-err') && div_text !== ""){
          isAdd = true;
          for(k = 0, len_k = phoneArr.length; k < len_k; k++){
            if(phoneArr[k] === div_text){
              isAdd = false;
              break;
            }
          }

          if(isAdd){
            phoneArr.push(div_text);
          }
        }
      }

      // 消息
      // -- 送机
      // -- 外送不生成消息(-- 暂定没有实现 --)
      // ---- 有导游旗   ：您好！我是旅行社送机人员小沈，明天{{集合时间_时段}}{{集合时间}}我们在{{集合地点}}集合，到了找{{送机旗号}}或打我电话。祝旅途愉快！
      // ---- 没有导游旗 ：您好！我是旅行社送机人员小沈，明天{{集合时间_时段}}{{集合时间}}我们在{{集合地点}}集合，到了打我电话。祝旅途愉快！
      // -- 接机
      // ---- 有导游旗   ：您好！我是深圳接机人员，明天我在{{集合地点}}拿{{接机旗号}}接机，并安排车送你们。找不到就打我电话，祝旅途愉快！
      // ---- 没有导游旗 ：您好！我是深圳接机人员，明天我在{{集合地点}}拿"阳光服务"蓝色导游旗接机，并安排车送你们。找不到就打我电话，祝旅途愉快！

      // 送机
      if(sm.smType1 === 1){
        // {{集合时间_时段}}
        // 按集合时间分 早上 上午 中午 下午 晚上
        smSetTimeType = zx.util.getSmSetTimeType(smSetTime);

        /*if(smFlag === ''){
          //送机 没有导游旗
          msgStr = '您好！我是旅行社送机人员小沈，明天' + smSetTimeType + smSetTime + '我们在' + smSetPlace + '集合，到了打我电话。祝旅途愉快！'
        } else {
          //送机 有导游旗
          msgStr = '您好！我是旅行社送机人员小沈，明天' + smSetTimeType + smSetTime + '我们在' + smSetPlace + '集合，到了找' + smFlag + '或打我电话。祝旅途愉快！'
        }*/

        msgObj = {
          //集合时间_时段: smSetTimeType,
          //集合时间: smSetTime,
          smSetTimeType_smSetTime: smSetTimeType + smSetTime,
          smSetPlace: smSetPlace
        };

        msgObj.name = setplace_name[smSetPlace] || '待定';
        msgObj.smPhone = setplace_phone[smSetPlace] || '待定';
        msgObj.call = setplace_call[smSetPlace] || '待定';

        /*msgObj.送机电话 = '13510543994';

        if(smSetPlace === '深圳机场T3出发厅2号门') {
          msgObj.送机电话 = '13603017047';
        } else if(smSetPlace === '深圳机场T3出发厅6号门') {
          msgObj.送机电话 = '13603014507';
        }*/
        

        if (smFlag !== '' && smFlag !== '无') {
          msgObj.smFlag = smFlag;
          alidayu.sms_template_code = 'SMS_7485395'; // 送机（含旗号）
        } else {
          alidayu.sms_template_code = 'SMS_7430436'; // 送机
        }
        
        msgTemplate = Handlebars.compile(configMap.handlebars_send_phone_message_str);
      } else {

        /*if(smFlag === ''){
          //接机 没有导游旗
          msgStr = '您好！我是深圳接机人员，明天我在' + smSetPlace + '拿"阳光服务"蓝色导游旗接机并安排车送你们。起飞前请联系我，祝旅途愉快！'
        } else {
          //接机 有导游旗
          msgStr = '您好！我是深圳接机人员，明天我在' + smSetPlace + '拿' + smFlag + '接机并安排车送你们。起飞前请联系我，祝旅途愉快！'
        }*/

        msgObj = {
          city: stateMap.city,
          smSetPlace: smSetPlace
        };

        msgObj.smPhone = setplace_phone[smSetPlace] || '待定';

        if (smFlag !== '' && smFlag !== '无') {
          msgObj.smFlag = smFlag;
          alidayu.sms_template_code = 'SMS_7260788'; // 接机（动态旗号）
        } else {
          alidayu.sms_template_code = 'SMS_7260789'; // 接机（阳光服务导游旗)
        }

        msgTemplate = Handlebars.compile(configMap.handlebars_meet_phone_message_str);
      }

      //console.log(msgObj);
      msgStr = msgTemplate(msgObj);

      alidayu.sms_param = msgObj;
      alidayu.rec_num = phoneArr.join(',');
      stateMap.alidayu = {
        sm_id  : jqueryMap.$smInfoTable.data('sm_obj')._id,
        alidayu: alidayu
      };

      zx.modal.initModule({
        size      : 'modal-sm',
        $title    : $('<h4 class="modal-title">手机短信</h4>'),
        formClass : 'form-phoneMessage',
        main_html : String()
          + '<div id="phoneMessage_nums" style="word-break:break-word;margin-bottom: 8px;" class="alert alert-info" role="alert">' 
            + phoneArr.join(';')
          + '</div>'
          //+ '<button id="phoneMessage_nums_btn" class="btn btn-default" style="margin-bottom: 16px;">一键复制手机号码</button>'
          + '<div id="phoneMessage_msg" style="word-break:break-word;margin-bottom: 8px;" class="alert alert-info" role="alert">'
            + msgStr
          + '</div>'
          + '<button id="phoneMessage_msg_btn" class="btn btn-default">发送短信</button>'
      });
    });

    // 保险
    jqueryMap.$team.on('click', '#insuranceBtn', function(){
      // 检查是否有现场负责人
      if(sm.serverMan === ''){
        alert('保险领用人=现场负责人\n现场负责人不能为空\n请先指定现场负责人');
        return;
      }

      zx.modal.initModule({
        size      : 'modal-sm',
        $title    : $('<h4 class="modal-title">开保险</h4>'),
        formClass : 'form-insurance',
        isHideFooter : true,
        main_html : String()
          + '<div id="insuranceDiv></div>'
      });
    });
  };
  // End Event handler /onComplete_getSmById/

  // Begin Event handler /on_deleteSmBtnClick/
  on_deleteSmBtnClick = function () {
    var $that = $(this),
        $smInfoTable = jqueryMap.$smInfoTable,
        sm_obj = $smInfoTable.data('sm_obj'),
        batch_arr = $smInfoTable.data('batch_arr'),
        batch_id_arr = [],
        //TRAFFIC = sm_obj.smType1 === 1 ? 'departureTraffic' : 'returnTraffic',
        IS_CHECKED = sm_obj.smType1 === 1 ? 'isSend' : 'isMeet',
        i_b, batchObj,
        personArr, i_p, len, personObj;

    if(sm_obj.smStatus > 1){
      alert('服务商已经确认此单，请联系服务商。');
      return;
    }

    zx.modal.initModule({
      size      : 'modal-sm',
      $title    : $('<h4 class="modal-title">删除此单</h4>'),
      formClass : 'form-deleteSm',
      main_html : String()
        + '<div class="alert alert-warning" role="alert">确定删除吗？</div>',
      callbackFunction : function(modalJqueryMap){
        modalJqueryMap.$submitBtn
          .text( '正在删除...' )
          .attr( 'disabled', true );

        sm_obj.smStatus = 0;
        sm_obj.isDownload = false;
        sm_obj.isSVDownload = false;
        sm_obj.phoneMsgStatus = 0;
        sm_obj.serverMan = '';
        sm_obj.smRealNumber = 0;

        for( i_b = 0; i_b < batch_arr.length; i_b++ ) {
          batchObj  = batch_arr[i_b];
          personArr = batchObj.persons;

          for( i_p = 0, len = personArr.length; i_p < len; i_p++ ) {
            personObj = personArr[i_p];
            personObj[IS_CHECKED] = true;
          }

          if(sm_obj._id === batchObj.departureTraffic._id){
            batchObj.departureTraffic.isSm = false;
          } else {
            batchObj.returnTraffic.isSm = false;
          }
          //batchObj[TRAFFIC]['isSm'] = false;
          batch_id_arr.push({ _id: batchObj._id });
        }

        //console.log(batch_arr);
        configMap.sm_model.saveSm({
          sm_obj     : sm_obj,
          batch_arr  : batch_arr,
          batchIdArr : batch_id_arr,
          from       : 'delete',
          tm_id      : stateMap.tm_id,
          name       : stateMap.name
        });
      }
    });
  };
  // End Event handler /on_deleteSmBtnClick/

  // Begin Event handler /onComplete_getSmByIdEdit/
  onComplete_getSmByIdEdit = function( event, obj ){
    //console.log(obj.sm);
    var team = obj.team, sm = obj.sm, 
        CHINAWORD,
        $smInfoTable,
        smDate, smTime, smType,

        userArr_t, i_ut, userObj_t,
        batchArr_t, i_bt, batchObj_t, //isPush,
        batchArr_t_push, //personObj_t, personArr_t, i_pt, 
        i_sn,
        $person_first_td, $person_tr, $userTable, $userTableTbody,
        userArr = [], i_u, userObj, 
        batchArr, i_b, batchObj,
        personArr, i_p, len, personObj,
        departureTrafficArr, returnTrafficArr, i, trafficObj, 
        otherSm = null,
        flightDate_text, flightStartTime_text, flightEndTime_text;

    stateMap.team = team;
    stateMap.tm_id = team._id;

    // ---------- 开始渲染UI
    // 侧边栏
    $('#zx-shell-sidebar-history').removeClass('hidden');
    zx.model.message.getMessageBySmId({ sm_id : sm._id });


    CHINAWORD = sm.smType1 === 1 ? '送' : '接';
    // top
    $('#zx-nav-pills-h')
      .removeClass('hidden')
      .html('亲~ 您正在编辑<span style="font-size: 22px;font-weight: 800;color: blue;">' + CHINAWORD + '机单</span>, 不要忘记保存哦！');
    
    $('#zx-nav-pills-bottom').addClass('hidden');

    //jqueryMap.$titleSpan.text( CHINAWORD + '机单 - 编辑' );
    //jqueryMap.$beginEditTime.text(moment().format('YYYY-MM-DD HH:mm'));

    $.gevent.subscribe( jqueryMap.$team, 'zx-saveSm', onComplete_saveSm );
    jqueryMap.$topBtnDiv.append(configMap.sm_top_edit_div_html);
    setJqueryMap(51);

    jqueryMap.$gobackDetailSmBtn.attr('href','#!page=sm&c=detail&n=' + sm._id);

    // -- smInfo 送机接机信息
    // 初始化样式
    $smInfoTable = 
      sm.smType1 === 1 
      ? $(configMap.send_info_table_html)
          .find('#smNoteTdDiv')
            .css('min-height', 0)
          .end()
      : $(configMap.meet_info_table_html)
          .find('#smNoteTdDiv')
            .css('min-height', 0)
          .end();
    $smInfoTable
      .find('.canEdit')
        //.data('id', team._id)
        .addClass('warning')
        .children()
          .attr('contenteditable',true)
          .attr('spellcheck',false)
          .end()
        .end();
    $smInfoTable
      .find('.canEditStyle')
        .addClass('warning');

    jqueryMap.$teamInfoDiv.append($smInfoTable);
    setJqueryMap(61);
    // 初始化数据
     
    // 关联航班
    // 找出一个不等于当前的 sm._id 的 trafficObj
    departureTrafficArr = team.departureTraffics;
    for( i = 0; i < departureTrafficArr.length; i++ ) {
      trafficObj = departureTrafficArr[i];
      if(trafficObj._id !== sm._id){
        otherSm = trafficObj;
        break;
      }
    }
    if(otherSm === null){
      returnTrafficArr = team.returnTraffics;
      for( i = 0; i < returnTrafficArr.length; i++ ) {
        trafficObj = returnTrafficArr[i];
        if(trafficObj._id !== sm._id){
          otherSm = trafficObj;
          break;
        }
      }
    }
    if(sm.smType1 === 1){
      if(otherSm !== null){
        flightDate_text      = '';
        flightStartTime_text = '';
        flightEndTime_text   = '';
        if(otherSm.flight.flightDate) {
          flightDate_text      = moment(otherSm.flight.flightDate).format('YYYY-MM-DD');
          flightStartTime_text = moment(otherSm.flight.flightStartTime).format('HH:mm');
          flightEndTime_text   = moment(otherSm.flight.flightEndTime).format('HH:mm');
        }
        jqueryMap.$smNumTd.text(flightDate_text + " " + otherSm.flight.flightNum + " " + otherSm.flight.flightStartCity + "-" + otherSm.flight.flightEndCity + " " + flightStartTime_text + "-" + flightEndTime_text);
      }
    } else {
      if(otherSm !== null){
        flightDate_text      = '';
        flightStartTime_text = '';
        flightEndTime_text   = '';
        if(otherSm.flight.flightDate) {
          flightDate_text      = moment(otherSm.flight.flightDate).format('YYYY-MM-DD');
          flightStartTime_text = moment(otherSm.flight.flightStartTime).format('HH:mm');
          flightEndTime_text   = moment(otherSm.flight.flightEndTime).format('HH:mm');
        }
        jqueryMap.$smNumTd.text(flightDate_text + " " + otherSm.flight.flightNum + " " + otherSm.flight.flightStartCity + "-" + otherSm.flight.flightEndCity + " " + flightStartTime_text + "-" + flightEndTime_text);
      }
    }
    
    jqueryMap.$smInfoTable = 
      $smInfoTable
        .data('id', sm._id)
        .data('sm_obj', sm)
        .attr('id','sm' + sm._id);

    jqueryMap.$teamNumTdDiv.html(             zx.util_b.decodeHtml(team.teamNum             )); // 团号
    jqueryMap.$lineNameTdDiv.html(            zx.util_b.decodeHtml(team.lineName            )); // 线路
    jqueryMap.$operatorTdDiv.html(            zx.util_b.decodeHtml(team.operator            )); // 操作人
    jqueryMap.$teamTypeTdDiv.text(            team.teamType                                  ); // 团队类型     散拼
    jqueryMap.$smNoteTdDiv.html(              zx.util_b.decodeHtml(sm.smNote                )); // 备注
    jqueryMap.$smRealNumberTd.text(           sm.smRealNumber                                ); // 名单人数     2
    jqueryMap.$sendDriverTdDiv.html(          zx.util_b.decodeHtml(team.sendDriver          )); // 送机司机
    jqueryMap.$smFlagTdDiv.html(              zx.util_b.decodeHtml(team.smFlag              )); // 出发地旗号
    jqueryMap.$meetDriverTdDiv.html(          zx.util_b.decodeHtml(team.meetDriver          )); // 接机司机
    jqueryMap.$guideTdDiv.html(               zx.util_b.decodeHtml(team.guide               )); // 地接人员 送机
    jqueryMap.$sendDestinationFlagTdDiv.html( zx.util_b.decodeHtml(team.sendDestinationFlag )); // 地接旗号 送机

    /*// 送机单号
    smDate  = sm.flight.flightDate.substring(5, 10).replace("-", "");
    smTime  =
        sm.smType1 === 1
        ? smTime = sm.flight.flightStartTime.replace(":", "") 
        : smTime = sm.flight.flightEndTime.replace(":", "");
    jqueryMap.$smNumTd.html(smDate + smTime + sm.flight.flightNum + sm.companyAbbr +"<span>" + sm.smRealNumber +"</span>人" + (sm.smType2===1?"内":"外") + CHINAWORD);
    */
    // 送机航班
    jqueryMap.$smDateTd.text(moment(sm.flight.flightDate).format('YYYY-MM-DD'));
    jqueryMap.$smFlightTd.text(sm.flight.flightNum + " " + sm.flight.flightStartCity + "-" + sm.flight.flightEndCity + " " + moment(sm.flight.flightStartTime).format('HH:mm') + "-" + moment(sm.flight.flightEndTime).format('HH:mm'));         
    
    //if(sm.smType2 === 1) {
      //jqueryMap.$smServerTd
        //.data('server', sm.smServer);
    jqueryMap.$smServerTdDiv.text(sm.smServer);         // 送机人员
    //} else {
      /*jqueryMap.$smServerTd
        .data('server', sm.smServer);
      jqueryMap.$smServerTdDiv
        .text('待定');
    }*/
    
    jqueryMap.$smSetPlaceTd.text(sm.smSetPlace);     // 集合地点

    if(sm.smType1 === 1){
      jqueryMap.$smSetTimeDiv
        .data('flightdate', sm.flight.flightDate)
        .data('smtime', sm.flight.flightStartTime)
        .data('sm_time_space', sm.smTimeSpace)
        .append($('<input type="text" id="smSetTimeInput" style="padding: 0;border:0;background-color:transparent;width: 100%;"></input>').val(moment(sm.smSetTime).format('HH:mm')));
    } else {
      jqueryMap.$smSetTimeDiv
        .data('flightdate', sm.flight.flightDate)
        .data('smtime', sm.flight.flightEndTime)
        .data('sm_time_space', sm.smTimeSpace)
        .append($('<input type="text" id="smSetTimeInput" style="padding: 0;border:0;background-color:transparent;width: 100%;"></input>').val(moment(sm.smSetTime).format('HH:mm')));
    }

    // 送机接机类型
    smType = sm.smType2 === 1 ? "机场内"+CHINAWORD+"机" : "机场外"+CHINAWORD+"机";
    jqueryMap.$smType2TdDiv
      .text(smType)
      //.data('sm_type2', sm.smType2)
      .data('dropdown', ["机场内"+CHINAWORD+"机", "机场外"+CHINAWORD+"机"]);       

    // 选择送机集合时间 显示
    jqueryMap.$sendSetTimeDiv.show();

    // 钱
    $('#smPayment').text(sm.smPayment / 100);              // 代付款项 +
    $('#smPayment_y').text(sm.smPayment_y / 100);          // 已付款项 +
    $('#smAgencyFund').text(sm.smAgencyFund / (-100));     // 代收款项 -
    $('#smAgencyFund_y').text(sm.smAgencyFund_y / (-100)); // 已收款项 -
    $('#fees').text(sm.fees / 100);
    if(sm.addFees < 0) {
      $('#addFees').text(sm.addFees / 100 + ' ' + sm.addFeesNote);
    } else if(sm.addFees > 0) {
      $('#addFees').text('+' + sm.addFees / 100 + ' ' + sm.addFeesNote);
    }
    $('#carFees').text(sm.carFees / 100);
    // 现场操作
    $('#serverMan').text(sm.serverMan);
    // 保险
    $('#insurance').text(sm.insurance); // 单位 : 份
    (sm.smType1 !== 1) 
    && $('#insurance')
          .addClass('hidden')
          .next().addClass('hidden');

    // 如果是服务商
    /*if(Number(stateMap.category) === 30){
      // tfoot可编辑
      $('div.tfoot_canEdit')
        .css('width',60)
        .addClass('warning')
        .attr('contenteditable',true)
        .attr('spellcheck',false);
      $('#insuranceDiv').removeClass('hidden');
    }*/
    if(Number(stateMap.category) === 30){
      $('#insuranceDiv').removeClass('hidden');

      jqueryMap.$smServerTd
        .addClass('warning')
        .children()
          .attr('contenteditable',true)
          .attr('spellcheck',false)
          .end()
        .end();
    }


    // 航班信息 隐藏 
    jqueryMap.$trafficTable.hide();

    // -- 名单 组信息
    // 初始化样式
    // 如果是服务商
    if(Number(stateMap.category) === 30){
      $person_first_td = 
        $(configMap.sm_person_first_td_html)
          .find('.smAgencyFund_y')
            .addClass('canEditDiv')
          .end()
          .find('.smPayment_y')
            .addClass('canEditDiv')
          .end();
    } else {
      $person_first_td =  $(configMap.sm_person_first_td_html);
    }

    $person_first_td
      .find('.canEditDiv')
        .addClass('warning')
        .attr('contenteditable',true)
        .attr('spellcheck',false)
      .end();

    $person_tr = 
      $(configMap.person_tr_html)
        .find('.canEdit')
          .addClass('warning')
          .children()
            .attr('contenteditable',true)
            .attr('spellcheck',false)
          .end()
        .end();

    if(sm.smType1 === 1) {
      $person_tr
        .find('td.sendPersonNoteTd')
          .removeClass('hidden')
        .end()
        .find('td.isSendTd')
          .removeClass('hidden')
        .end();
    } else if ( sm.smType1 === 2 ) {
      $person_tr
        .find('td.meetPersonNoteTd')
          .removeClass('hidden')
        .end()
        .find('td.isMeetTd')
          .removeClass('hidden')
        .end();
    }

    /*$userTable = 
      $(configMap.user_table_html)
        .find('th.teamPersonNoteTh')
          .text(sm.smType1 === 1 ? '送机备注' : '接机备注')
        .end()
        .find('th.isSmTh')
          .text(sm.smType1 === 1 ? '送' : '接')
        .end();*/
    $userTable = $(configMap.user_table_html);
    if(sm.smType1 === 1) {
      $userTable
        .find('th.sendPersonNoteTh')
          .removeClass('hidden')
        .end()
        .find('th.isSendTh')
          .removeClass('hidden')
        .end();
    } else if ( sm.smType1 === 2 ) {
      $userTable
        .find('th.meetPersonNoteTh')
          .removeClass('hidden')
        .end()
        .find('th.isMeetTh')
          .removeClass('hidden')
        .end();
    }

    // 缓存到状态集合 stateMap 中，以备后用
    stateMap.person_first_td_detail_html = $('<div></div>').append($person_first_td).html();
    stateMap.person_tr_detail_html = $('<div></div>').append($person_tr).html();
    stateMap.user_table_detail_html = $('<div></div>').append($userTable).html();

    userArr_t = team.users;
    // 判断每个user有没有满足条件的组
    // 找出满足条件的组 sm_id && isSm = true
    for( i_ut = 0; i_ut < userArr_t.length; i_ut++ ) {
      userObj_t = userArr_t[i_ut];
      batchArr_t = userObj_t.batchs;
      batchArr_t_push = [];

      for( i_bt = 0; i_bt < batchArr_t.length; i_bt++ ) {
        batchObj_t = batchArr_t[i_bt];
        if(( batchObj_t.departureTraffic._id === sm._id && batchObj_t.departureTraffic.isSm === true ) 
          || ( batchObj_t.returnTraffic._id === sm._id && batchObj_t.returnTraffic.isSm ===true )){


          batchArr_t_push.push(batchObj_t);

          /*personArr_t = batchObj_t.persons;
          for( i_pt = 0; i_pt < personArr_t.length; i_pt++ ) {
            personObj_t = personArr_t[i_pt];
            isPush = (sm.smType1 === 1 && personObj_t.isSend);
            if (isPush) { break ;}
            isPush = (sm.smType1 === 2 && personObj_t.isMeet);
            if (isPush) { break ;}
          }

          if (isPush) { 
            batchArr_t_push.push(batchObj_t);
          }*/
        } 
      }
      if(batchArr_t_push.length !== 0){
        userObj_t.batchs = batchArr_t_push;
        userArr.push(userObj_t);
      }
    }

    i_sn = 0;
    for( i_u = 0; i_u < userArr.length; i_u++ ) {
      userObj  = userArr[i_u];
      batchArr = userObj.batchs;
      

      $userTable = $(stateMap.user_table_detail_html);
      $userTable
        .attr('id', 'us' + userObj._id._id)
        .data('id', userObj._id._id)
        .data('user_name',userObj._id.userName)
        .data('name', userObj._id.name)
        .find('th.batchTh').text(userObj._id.name + '-' + userObj._id.phone);
      $userTableTbody = $userTable.find('tbody');

      for( i_b = 0; i_b < batchArr.length; i_b++ ) {
        batchObj  = batchArr[i_b];
        personArr = batchObj.persons;

        for( i_p = 0, len = personArr.length; i_p < len; i_p++ ) {
          i_sn++;
          personObj = personArr[i_p];

          $person_tr = $(stateMap.person_tr_detail_html);

          $person_tr.find('td.snTd').text(i_sn);
          $person_tr.find('td.nameTd').children().text(personObj.name);
          $person_tr.find('td.cardNumTd').children().text(personObj.cardNum);
          $person_tr.find('td.phoneTd').children().text(personObj.phone);
          $person_tr.find('td.birthdayTd').children().text(personObj.birthday);
          $person_tr.find('td.sexTd').children().text(personObj.sex);
          $person_tr.find('td.cardCategoryTd').children().text(personObj.cardCategory);
          $person_tr.find('td.ageTd').children().text(personObj.age===0?'' : personObj.age);
          $person_tr.find('td.ageTypeTd').children().text(personObj.ageType);
          $person_tr.find('td.roomTd').children().text(personObj.room);
          $person_tr.find('td.teamPersonNoteTd').children().html(zx.util_b.decodeHtml(personObj.teamPersonNote));
          $person_tr.find('td.sendPersonNoteTd').children().html(zx.util_b.decodeHtml(personObj.sendPersonNote));
          $person_tr.find('input.checkboxIsSend').prop('checked',personObj.isSend);
          $person_tr.find('td.meetPersonNoteTd').children().html(zx.util_b.decodeHtml(personObj.meetPersonNote));
          $person_tr.find('input.checkboxIsMeet').prop('checked',personObj.isMeet);
          if(i_p === 0) {
            //console.log(batchObj);
            if(batchObj.departureTraffic._id){
              $person_tr.data('dt_id', batchObj.departureTraffic._id);
              $person_tr.data('departuretraffic_issm', batchObj.departureTraffic.isSm);
            }
            //console.log($person_tr.data('dt_id'));
            if(batchObj.returnTraffic._id){
              $person_tr.data('rt_id', batchObj.returnTraffic._id);
              $person_tr.data('returntraffic_issm', batchObj.returnTraffic.isSm);
            }
            $person_tr
              .data('id',batchObj._id)
              .data('batch_obj', batchObj)
              .attr('id', 'bt' + batchObj._id)
              .addClass('tr_first')
              .prepend(
                $(stateMap.person_first_td_detail_html).attr('rowspan', len)
                  .find('span.batchNum').text(batchObj.batchNum)
                  .end()
                  .find('div.batchPersonCount').text(len)
                  .end()
                  .find('div.guest').text(batchObj.guest)
                  .end()
                  .find('div.smAgencyFund').text(sm.smType1 === 1 ? (batchObj.sendAgencyFund)/(-100) : (batchObj.meetAgencyFund)/(-100))       // 代收款项 -
                  .end()
                  .find('div.smAgencyFund_y').text(sm.smType1 === 1 ? (batchObj.sendAgencyFund_y)/(-100) : (batchObj.meetAgencyFund_y)/(-100)) // 已收款项 -
                  .end()
                  .find('div.smPayment').html(sm.smType1 === 1 ? (batchObj.sendPayment)/100 : (batchObj.meetPayment)/100)
                  .end()
                  .find('div.smPayment_y').html(sm.smType1 === 1 ? (batchObj.sendPayment_y)/100 : (batchObj.meetPayment_y)/100)
                  .end()
                  .find('div.smBatchNote').html(sm.smType1 === 1 ? zx.util_b.decodeHtml(batchObj.sendBatchNote) : zx.util_b.decodeHtml(batchObj.meetBatchNote))
                  .end()
              );
          }
          $userTableTbody.append($person_tr);
        }
      }
      jqueryMap.$userBatchDiv.append($userTable);
    }

    // footer
    jqueryMap.$companyAbbrSpan.text(team.companyAbbr);
    jqueryMap.$nameSpan.text(team.name);
    jqueryMap.$dateSpan.text(moment(team.meta.createAt).format('YYYY-MM-DD'));

    // 验证 证件号码 手机号码 出生日期 性别 证件类型 年龄 年龄段
    $('.cardNumTd').zxvalid('cardNum');
    $('.phoneTd').zxvalid('phone');
    $('.birthdayTd').zxvalid('birthday');
    $('.sexTd').zxvalid('sex');
    $('.cardCategoryTd').zxvalid('cardCategory'); 
    $('.ageTd').zxvalid('age');
    $('.ageTypeTd').zxvalid('ageType');

    jqueryMap.$team.show();
    // ---------- 结束渲染UI
    // 
    // 
    // ---------- 开始注册事件
    $.gevent.subscribe( jqueryMap.$team, 'zx-completeGetlist', onCompleteGetlist );
    $.gevent.subscribe( jqueryMap.$teamInfoDiv, 'zx-setSendSetTime', onSetSendSetTime );
    // 所有 hidden.bs.dropdown 事件， 销毁 dropdown控件
    jqueryMap.$team.on('hidden.bs.dropdown','.dropdown', on_hidden_td_dropdown);
    // 集合时间获得焦点 显示时间控件
    $('#smSetTimeInput').datetimepicker({
      format: 'HH:mm'
      //useCurrent: false
    });
    $('#smSetTimeInput').blur(function(){
      //console.log('blur');
      var $that = $(this),
          flightDate    = jqueryMap.$smSetTimeDiv.data('flightdate'),
          smTime        = jqueryMap.$smSetTimeDiv.data('smtime'),
          sm_time_space = jqueryMap.$smSetTimeDiv.data('sm_time_space'),
          smSetTime     = $that.val(),
          textStr       = jqueryMap.$smType2TdDiv.text(),
          sm_time_space_new, myFeesTempItem, fees;

      //console.log('flightDate:' + flightDate);   
      //console.log('smTime:' + smTime);
      //console.log('sm_time_space:' + sm_time_space);
      //console.log('smSetTime:' + smSetTime);

      sm_time_space_new = zx.util.getSmTimeSpace({
        flightDate : flightDate, 
        smTime     : smTime,
        smSetTime  : smSetTime
      });

      //console.log(sm_time_space_new);

      //console.log('sm_time_space_new:' + sm_time_space_new)
      jqueryMap.$smSetTimeDiv.data('sm_time_space', sm_time_space_new);

      // 获取计费规则
      myFeesTempItem = zx.util.getMyfeestempItem({
        myfeestemp : configMap.people_model.getMyFeesTemp(stateMap.team.company), // 计费模板 obj
        teamType   : jqueryMap.$teamTypeTdDiv.text(),
        smtype     : zx.util.getSmTypeFromStr(textStr)
      });

      //console.log(myFeesTempItem);
      // 计算服务费
      fees = zx.util.countFees({
        myfeestempItem : myFeesTempItem,
        smRealNumber   : Number(jqueryMap.$smRealNumberTd.text()),
        smSetTime      : smSetTime,
        smDate         : flightDate
      });

      //console.log(fees);
      $('#fees').text(fees / 100);
    });
    // 送机集合时间下拉框
    jqueryMap.$sendSetTimeDiv.click( on_sendSetTimePopover_show );
    // 送机接机类型
    jqueryMap.$smType2TdDiv.focus( on_smType2TdDiv_focus );
    // 选择默认提前时间
    jqueryMap.$teamInfoDiv.on('change','.optionsRadios', function () {
        var $that = $(this),
            userObj = {};

        $that.prop('disabled', true);

        userObj._id         = stateMap.us_id;
        userObj.sendSetTime = Number($that.val());
        userObj.option_id   = $that.attr('id');
        
        zx.model.people.setSendSetTime(userObj);
    });
    // 交通费
    $('#carFees').blur(on_AgencyFund_Payment_blur);
    // 现场责任人
    $('#serverMan').focus(on_serverman_focus);
    // 保险
    $('#insurance').blur(on_insurance_blur);
    $('#carFees').blur(on_AgencyFund_Payment_blur);
    // 代收代付已收已付失去焦点验证
    jqueryMap.$userBatchDiv.on('blur','div.smAgencyFund',   on_AgencyFund_Payment_blur);
    jqueryMap.$userBatchDiv.on('blur','div.smAgencyFund_y',   on_AgencyFund_Payment_blur);
    jqueryMap.$userBatchDiv.on('blur','div.smPayment',   on_AgencyFund_Payment_blur);
    jqueryMap.$userBatchDiv.on('blur','div.smPayment_y',   on_AgencyFund_Payment_blur);

    // 证件号码 手机号码 出生日期 年龄 失去焦点时验证
    jqueryMap.$userBatchDiv
      .on('blur','td.cardNumTd', on_cardNumTd_blur )
      .on('blur','td.phoneTd', on_phoneTd_blur )
      .on('blur','td.birthdayTd', on_birthdayTd_blur )
      .on('blur','td.ageTd', on_ageTd_blur );

    // 性别 证件类型 年龄段
    jqueryMap.$userBatchDiv.on('focus','div.sexTdDiv',          on_sexTdDiv_focus);
    jqueryMap.$userBatchDiv.on('focus','div.cardCategoryTdDiv', on_cardCategoryTdDiv_focus);
    jqueryMap.$userBatchDiv.on('focus','div.ageTypeTdDiv',      on_ageTypeTdDiv_focus);

    // checked 加人减人 checkedBox
    jqueryMap.$userBatchDiv.on('change','input.checkboxIsSend', function(){
      var textStr = jqueryMap.$smType2TdDiv.text(),
          flightDate = jqueryMap.$smSetTimeDiv.data('flightdate'),
          smRealNumber = jqueryMap.$userBatchDiv.find('input.checkboxIsSend:checked').length,
          myFeesTempItem, fees;
      // 改 jqueryMap.$smRealNumberTd.text
      jqueryMap.$smRealNumberTd.text(smRealNumber);
      //jqueryMap.$smNumTd.find('span').text(smRealNumber);

      // 获取计费规则
      //console.log(jqueryMap.$teamTypeTdDiv.text());
      //console.log(textStr);
      myFeesTempItem = zx.util.getMyfeestempItem({
        myfeestemp : configMap.people_model.getMyFeesTemp(stateMap.team.company), // 计费模板 obj
        teamType   : jqueryMap.$teamTypeTdDiv.text(),
        smtype     : zx.util.getSmTypeFromStr(textStr)
      });
      // 计算服务费
      //console.log($('#smSetTimeInput').val());
      fees = zx.util.countFees({
        myfeestempItem : myFeesTempItem,
        smRealNumber   : smRealNumber,
        smSetTime      : $('#smSetTimeInput').val(),
        smDate         : flightDate
      });
      $('#fees').text(fees / 100);
    });
    jqueryMap.$userBatchDiv.on('change','input.checkboxIsMeet', function(){
      var textStr = jqueryMap.$smType2TdDiv.text(),
          flightDate = jqueryMap.$smSetTimeDiv.data('flightdate'),
          smRealNumber = jqueryMap.$userBatchDiv.find('input.checkboxIsMeet:checked').length,
          myFeesTempItem, fees;
      // 改 jqueryMap.$smRealNumberTd.text
      jqueryMap.$smRealNumberTd.text(smRealNumber);
      //jqueryMap.$smNumTd.find('span').text(smRealNumber);

      // 获取计费规则
      myFeesTempItem = zx.util.getMyfeestempItem({
        myfeestemp : configMap.people_model.getMyFeesTemp(stateMap.team.company), // 计费模板 obj
        teamType   : jqueryMap.$teamTypeTdDiv.text(),
        smtype     : zx.util.getSmTypeFromStr(textStr)
      });
      // 计算服务费
      fees = zx.util.countFees({
        myfeestempItem : myFeesTempItem,
        smRealNumber   : smRealNumber,
        smSetTime      : $('#smSetTimeInput').val(),
        smDate         : flightDate
      });
      $('#fees').text(fees / 100);
    });
    // 保存
    jqueryMap.$saveSmBtn.click( on_saveSmBtnClick );
    // ---------- 结束注册事件

  }
  // End Event handler /onComplete_getSmByIdEdit/

  // Begin Event handler /on_sendSetTimePopover_show/
  on_sendSetTimePopover_show = function( event ) {
    var $lastPopoverDiv = $('#sendSetTimePopoverDiv'),
        $sendSetPopover = $(event.target), 
        $infoHtml = $('<div id="sendSetTimePopoverDiv" style="padding:10px;"></div>'),
        $tb = $('<table style="width:170px;"></table>'),
        timeInputVal = configMap.people_model.get_user().sendSetTime,
        arr = [90, 120, 150, 180],
        i, k, $tr,
        $hh = $('<div></div>').append($infoHtml),
        options = {
            html: true,
            placement: 'bottom'
        };

    if ($lastPopoverDiv.length === 0) {
      $infoHtml.append('<p class="text-right"><button id="sendSetTimePopoverDivCloseBtn" class="close" type="button"><span>&times;</span></button></p>');
      $tb.append('<tr><th style="width:100px;">选择提前量</th><th>设为默认</th></tr>');

      for (i = 0; i < 4; i++) {
          k = i + 1;
          
          if (arr[i] == timeInputVal) {
              $tr = $('<tr><td><span class="sendSetTimeSpan btn btn-default btn-block" type="button" data-settimeval="' + arr[i] + '">提前' + arr[i] + '分钟</span></td><td style="text-align:center"><input type="radio" class="optionsRadios" name="optionsRadios" id="optionsRadios' + k + '" value="' + arr[i] + '" checked></td></tr>');
          } else {
              $tr = $('<tr><td><span class="sendSetTimeSpan btn btn-default btn-block" type="button" data-settimeval="' + arr[i] + '">提前' + arr[i] + '分钟</span></td><td style="text-align:center"><input type="radio" class="optionsRadios" name="optionsRadios" id="optionsRadios' + k + '" value="' + arr[i] + '"></td></tr>');
          }
          $tb.append($tr);
      }
      
      $infoHtml.append($tb);
      
      $sendSetPopover.attr('data-content', $hh.html());
      $sendSetPopover.popover(options);   
      $sendSetPopover.popover('show');
    }

    $('.sendSetTimeSpan').click(function () {
        //console.log(jqueryMap.$smSetTimeDiv.data('flightdate'));
        //console.log(jqueryMap.$smSetTimeDiv.data('smtime'));
        //console.log(jqueryMap.$smSetTimeDiv.data('sm_time_space'));
        //console.log($(this).data('settimeval'));

        var $that = $(this),
            flightDate = jqueryMap.$smSetTimeDiv.data('flightdate'),
            smTime     = jqueryMap.$smSetTimeDiv.data('smtime'),
            sendSetTimeInputVal = parseInt($that.data('settimeval')),
            sendSetTime = zx.util.getSetTime({
              flightDate      : moment(flightDate).format('YYYY-MM-DD'), 
              smTime          : moment(smTime).format('HH:mm:ss'), 
              setTimeInputVal : sendSetTimeInputVal
            }),
            textStr = jqueryMap.$smType2TdDiv.text(),
            myFeesTempItem, fees;
        //console.log(sendSetTime);
        jqueryMap.$smSetTimeDiv
          .data('sm_time_space', sendSetTimeInputVal)
          .find('#smSetTimeInput').val(sendSetTime);
          //.text(sendSetTime);

        // 获取计费规则
        myFeesTempItem = zx.util.getMyfeestempItem({
          myfeestemp : configMap.people_model.getMyFeesTemp(stateMap.team.company), // 计费模板 obj
          teamType   : jqueryMap.$teamTypeTdDiv.text(),
          smtype     : zx.util.getSmTypeFromStr(textStr)
        });
        //console.log(myFeesTempItem);
        // 计算服务费
        fees = zx.util.countFees({
          myfeestempItem : myFeesTempItem,
          smRealNumber   : Number(jqueryMap.$smRealNumberTd.text()),
          smSetTime      : sendSetTime,
          smDate         : flightDate
        });
        //console.log(fees);
        $('#fees').text(fees / 100); 

        $sendSetPopover.popover('destroy');
    });

    $("#sendSetTimePopoverDivCloseBtn").click(function () {
      //console.log('ss');
      $sendSetPopover.popover('destroy');
    });

    /*function getSendSetTime(flightDate, smTime, sendSetTimeInputVal) {
      var dateArr = flightDate.split('-'),
          timeArr = smTime.split(':'),
          endTime = new Date(dateArr[0], dateArr[1], dateArr[2], timeArr[0], timeArr[1], 00),
          sendSetDate = new Date(),
          sendSetTime;

      sendSetDate.setTime(endTime.getTime() - sendSetTimeInputVal * 60 * 1000);
      sendSetTime = (Array(2).join(0) + sendSetDate.getHours()).slice(-2) + ':' + (Array(2).join(0) + sendSetDate.getMinutes()).slice(-2);
      
      return sendSetTime;
    }*/
  }
  // End Event handler /on_sendSetTimePopover_show/

  // Begin Event handler /onSetSendSetTime/
  onSetSendSetTime = function( event, result ){
    //var result = results[0];
    //console.log(result);
    // 已检验
    if(result.success.ok === 1){
      $('#' + result.option_id).prop('disabled',false);
    }else{
      alert('老板，服务器压力山大，请再试一次！');
    }
  }
  // End Event handler /onSetSendSetTime/

  // 保险失去焦点验证
  on_insurance_blur = function(){
    var $num = $(this),
        m = $.trim($num.text()),
        re = /^[0-9]*$/,
        mInt = 0;

    if (m !== "" && !re.test(m)){
      alert("请输入非负整数");
      $num.text(0);
    }
  };


  // 代收代付失去焦点验证
  on_AgencyFund_Payment_blur = function(){
    var $money = $(this),
        m = $.trim($money.text()),
        re = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/,
        mInt = 0;

    if (m !== "" && !re.test(m)){
      alert("请输入正确整数或小数，小数最多保留两位。");
      $money.text("");
    }

    if($money.hasClass('smAgencyFund')){
      $.each($('.smAgencyFund'),function(){
        mInt += Number($(this).text()) * 100;
      });
      $('#smAgencyFund').text(mInt / 100);

    } else if($money.hasClass('smPayment')){
      $.each($('.smPayment'),function(){
        mInt += Number($(this).text()) * 100;
      });
      $('#smPayment').text( mInt / 100 );

    } else if($money.hasClass('smAgencyFund_y')){
      $.each($('.smAgencyFund_y'),function(){
        mInt += Number($(this).text()) * 100;
      });
      $('#smAgencyFund_y').text( mInt / 100 );

    } else if($money.hasClass('smPayment_y')){
      $.each($('.smPayment_y'),function(){
        mInt += Number($(this).text()) * 100;
      });
      $('#smPayment_y').text( mInt / 100 );
    } 
  };

  // 现场责任人获得焦点
  on_serverman_focus = function(){
    var $that = $(this),
        $parent = $that.parent();

      jqueryMap.$serverMan = $('#serverMan');

      if( !$parent.hasClass('dropdown') ){
        configMap.list_model.getlist({
          company : stateMap.company,
          c       : "serverman",
          that    : "serverMan"
        });
      }
  };

  on_complete_socket_broadcast_lockTeam = function ( event, result ) {
    //console.log(result);
    jqueryMap.$beginEditTime.addClass('hidden');
    if( stateMap.tm_id === result.team_id ) {
      if(result.isLocked){
        jqueryMap.$beginEditTime.html(
          String()
            + '<span class="text-primary">'
              + result.editName + '正在编辑, 始于 ' + moment(result.beginTime).format('YYYY-MM-DD HH:mm')
            + '</span>'
        ).removeClass('hidden');
        jqueryMap.$topBtnDiv.hide();
      } else {
        if(stateMap.anchor_map.page === 'team' ) {
          //console.log(stateMap.anchor_map.n);
          configMap.team_model.getTeamById( stateMap.anchor_map.n );
        } else {
          configMap.sm_model.getSmById( stateMap.anchor_map.n );
        }
        //configMap.team_model.getTeamById( stateMap.anchor_map.n );
        /*if(stateMap.anchor_map.n === result.id) {
          configMap.team_model.getTeamById( stateMap.anchor_map.n );
        } else {
          jqueryMap.$beginEditTime.text('');
          jqueryMap.$topBtnDiv.show();
        }*/
      }
    }  
  };

  // 监听别人删除团队单
  on_complete_socket_broadcast_delTeam = function ( event, result ) {
    //console.log(result);
    if( stateMap.tm_id === result.tm_id ) {
      alert('此单刚刚被' + result.name + '删除');
      $.uriAnchor.setAnchor({ 
        'page'          : 'list', 
        'c'             : 'team', 
        'departuredate' : '', 
        'returndate'    : '', 
        'n'             : '0' 
      }, null, true );
    }
  };
  
  // 监听别人删除服务单
  on_complete_socket_broadcast_delSm = function ( event, result ) {
    //console.log(result);
    if( stateMap.tm_id === result.tm_id ) {
      if(stateMap.anchor_map.n === stateMap.tm_id){
        configMap.team_model.getTeamById( result.tm_id );
      } else {
        alert('此单刚刚被' + result.name + '删除');
        if(stateMap.category === 20){
          $.uriAnchor.setAnchor({ 
            'page'   : 'team', 
            'c'      : 'detail', 
            'n'      : result.tm_id 
          }, null, true );
        } else if(stateMap.category === 30){
          $.uriAnchor.setAnchor({ 
            'page'   : 'list', 
            'c'      : 'sm', 
            'smdate' : '',
            'n'      : '0' 
          }, null, true );
        }
      } 
    }
  };

  // Begin Event handler /onComplete_downloadTeam/
  onComplete_downloadTeam = function ( event, result ) {
    var $downloadTeamBtn,
        loadFile, doc, out, setData, tempdocx;
    
    //console.log(result);
    // 已检验
    if (result.success === 1) {
      stateMap.team.isDownload = true;

      $downloadTeamBtn = $('#downloadTeamBtn');
      $downloadTeamBtn.prop("disabled", false);

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

  onComplete_downloadSm = function( event, result ){
    //console.log(result);
    var $downloadSmBtn,
        loadFile, doc, out, setData, tempdocx;

    //console.log(result);
    // 已检验
    if (result.success === 1) {
      $downloadSmBtn = $('#downloadSmBtn');
      if(result.isSV){
        stateMap.isSVdownload = true;
      }else{
        stateMap.isdownload = true;
      }

      $downloadSmBtn.prop("disabled", false);
      
      setData  = result.setData;
      if(setData.CHINAWORD == '送'){
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


  set_focus = function(el) {
    el=el[0];  // jquery 对象转dom对象
    el.focus();
    if(document.selection)
    {
      var rng;
      el.focus();
      rng = document.selection.createRange();
      rng.moveStart('character', -el.innerText.length);
      var text = rng.text;
      for (var i = 0; i < el.innerText.length; i++) {
        if (el.innerText.substring(0, i + 1) == text.substring(text.length - i - 1, text.length)) {
          result = i + 1;
        }
      }
      }
    else
    {
      var range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  /*on_enterOKKeydown = function(event){

    function enterToTab(event){
      var e = event?event:window.event  
      if(e.keyCode == 13){  
         e.keyCode = 9;  
      }  
    }

    enterToTab();
  }*/
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
    //console.log(Date.now());
    //console.log(stateMap);
    //console.log(configMap.people_model.get_user());
    stateMap.beginEditTime    = moment();                                           // 开始编辑时间

    stateMap.$container       = $container;
    stateMap.city             = zx.config.getConfigMapItem('citys')[zx.config.getStateMapItem('city')].city;
    stateMap.anchor_map       = argObj;
    stateMap.us_id            = configMap.people_model.get_user().user_id;          // us_id
    stateMap.category         = configMap.people_model.get_user().category;         // category 20地接社 30服务商
    stateMap.role             = configMap.people_model.get_user().role;             // 用户权限
    stateMap.userName         = configMap.people_model.get_user().userName;         // 用户名
    stateMap.company          = configMap.people_model.get_user().company_id;       // company_id
    stateMap.companyAbbr      = configMap.people_model.get_user().companyAbbr;      // 公司简称
    stateMap.name             = configMap.people_model.get_user().name;             // 姓名
    stateMap.phone            = configMap.people_model.get_user().phone;            // 手机
    stateMap.sendSetTime      = configMap.people_model.get_user().sendSetTime;      // 送机提前时间-20：地接社
    stateMap.thSetStr         = configMap.people_model.get_user().thSetStr;         // 导入表头：地接社
    //stateMap.defaultFlag      = configMap.people_model.get_user().defaultFlag;      // 默认导游旗
    stateMap.sendPhoneMessage = configMap.people_model.get_user().sendPhoneMessage;
    stateMap.meetPhoneMessage = configMap.people_model.get_user().meetPhoneMessage;

    // 团队单
    if(stateMap.anchor_map.page === "team"){
      // 新建团队单
      if(stateMap.anchor_map.c === "new"){
        // false : 添加独立团单 true : 添加合作团单 
        stateMap.isOpen = false;
        if(stateMap.anchor_map.n === "public"){
          stateMap.isOpen = true;
        }

        //渲染
        showPageTeamNew();
        // 插件 导入名单模块
        zx.importpeople.configModule({
          people_model  : configMap.people_model,
          team_model    : configMap.team_model
        });
        zx.importpeople.initModule(jqueryMap, stateMap);

      // 查看团队单
      } else if (stateMap.anchor_map.c === "detail"){

        $container.append( configMap.team_main_html );
        setJqueryMap(11);

        // ---------- 开始注册事件
        // 删除此单
        jqueryMap.$team.on('click', '#deleteTeamBtn', on_deleteTeamBtn_click);
        //jqueryMap.$deleteTeamBtn.click( on_deleteTeamBtn_click );
        // 添加服务
        jqueryMap.$team.on('click', '#addServerDiv a', on_addServerDivA_click);
        //jqueryMap.$addServerDiv.on('click', 'a', on_addServerDivA_click);

        // 移除选择
        jqueryMap.$team.on('click','button.closeTag',function(){
          var $that = $(this).parent(),
            bt_id = $that.attr('id');

          select_opTdClick(bt_id);
          $that.remove();
        });

        // 确认选择，生成送、接机单
        jqueryMap.$team.on('click', '#okAddServerBtn', function(){
          //console.log(stateMap.team);
          var $that = $(this),
              $serverTags = jqueryMap.$zxFootBoxContainer.find('div.serverTagDiv'),
              i, len, $serverTag, 
              smtype, sm_id, smObj, batchsArr = [], smRealNumber = 0, traffic, obj,
              myfeestempItem, 
              personArr, pi;

          $that.prop('disabled', true);

          len = $serverTags.length;
          //console.log('len:'+len);
          if(len === 0){
            alert('没有找到关联的组');
            $that.prop('disabled', false);
            return;
          }

          smtype = $that.data('smtype');
          sm_id = $that.data('sm_id');
          for( i = 0; i < len; i++ ) {
            $serverTag = $serverTags.eq(i);

            obj = {};
            traffic = $serverTag.data('flighttype');
            obj[traffic] = {
              _id  : sm_id,
              isSm : true
            };

            personArr = $serverTag.data('person_arr');
            if (smtype == 11 || smtype == 12) {
              obj.sendBatchNote = $serverTag.data('teamBatchNote');
              for(pi = 0; pi < personArr.length; pi++){
                personArr[pi].sendPersonNote = personArr[pi].teamPersonNote;
              }
            } else {
              obj.meetBatchNote = $serverTag.data('teamBatchNote');
              for(pi = 0; pi < personArr.length; pi++){
                personArr[pi].meetPersonNote = personArr[pi].teamPersonNote;
              }
            }
            obj.persons = personArr;

            //console.log($serverTag.data('rows'));
            smRealNumber += Number($serverTag.data('rows'));

            batchsArr.push({
              _id : $serverTag.attr('id'),
              traffic : obj
            })
          }

          // 要传到数据库的计算服务费的条件
          myfeestempItem = zx.util.getMyfeestempItem({
            myfeestemp : configMap.people_model.getMyFeesTemp(stateMap.team.company), // 计费模板 obj
            teamType   : jqueryMap.$teamTypeTdDiv.text(),        // 团队类型 String
            smtype     : smtype                                  // 11 机场内送机 21 机场内接机 || 12 机场外送机 22 机场外接机 Number
          });

          //console.log(jqueryMap.$operatorTdDiv.text());
          smObj = {
            //operator       : jqueryMap.$operatorTdDiv.text(),
            //city: stateMap.city,
            fromUserName   : stateMap.userName,
            fromName　　   : stateMap.name,
            myfeestempItem : myfeestempItem,     // 服务费计费规则
            sendSetTime  : stateMap.sendSetTime, // 送机集合时间提前量 用户默认
            smType       : smtype,               // 11 机场内送机 21 机场内接机 || 12 机场外送机 22 机场外接机
            smId         : sm_id,
            smRealNumber : smRealNumber,         // 名单人数
            smNote       : jqueryMap.$teamNoteTdDiv.text(),
            batchsArr    : batchsArr
          }

          //console.log(smObj);
          configMap.sm_model.newOrAddSm(smObj); 
        });
        

        // 取消选择服务
        jqueryMap.$team.on('click', '#cancelAddServerBtn', function(){
          //jqueryMap.$cancelAddServerBtn.click(function(){
          var $opTdClicks = jqueryMap.$userBatchDiv.find('td.opTdClick');

          $opTdClicks.removeClass('success warning opTdClick');
          jqueryMap.$userBatchDiv.find(':checkbox').hide();
          jqueryMap.$zxFootBoxDiv.addClass('hidden');
        });

        // 选择组
        jqueryMap.$team.on('click','td.opTdClick', function(){
          //console.log('ddd');
          var $that = $(this),
            bt_id = $that.data('bt_id');

          select_opTdClick(bt_id);
        });

        $.gevent.subscribe( jqueryMap.$team, 'zx-getTeamById', onComplete_getTeamById );
        configMap.team_model.getTeamById( stateMap.anchor_map.n );

      // 编辑团队单
      } else if (stateMap.anchor_map.c === "edit") {
        $container.append( configMap.team_main_html );
        setJqueryMap(11);

        $.gevent.subscribe( jqueryMap.$team, 'zx-getTeamById', onComplete_getTeamByIdEdit );
        configMap.team_model.getTeamById( stateMap.anchor_map.n );

        // 插件 导入名单模块
        zx.importpeople.configModule({
          people_model  : configMap.people_model,
          team_model : configMap.team_model
        });
        zx.importpeople.initModule(jqueryMap, stateMap);
      }

    } else {

      if(stateMap.anchor_map.c === "detail"){
        $container.append( configMap.team_main_html );
        setJqueryMap(11);

        // ---------- 开始注册事件
    
        // 删除单据
        // if(stateMap.category === 20){}
        jqueryMap.$team.on('click', '#deleteSmBtn', on_deleteSmBtnClick);
        //jqueryMap.$deleteSmBtn.click( on_deleteSmBtnClick );

        $.gevent.subscribe( jqueryMap.$team, 'zx-getSmById', onComplete_getSmById );
        configMap.sm_model.getSmById( stateMap.anchor_map.n );
      } else if (stateMap.anchor_map.c === "edit") {
        $container.append( configMap.team_main_html );
        setJqueryMap(11);

        $.gevent.subscribe( jqueryMap.$team, 'zx-getSmById', onComplete_getSmByIdEdit );
        configMap.sm_model.getSmById( stateMap.anchor_map.n );
      }
    }


    jqueryMap.$team.on('focus','div[contenteditable=true]',function(){
      set_focus($(this));
    });
    // 监听粘贴事件
    // jqueryMap.$team.on('paste','div[contenteditable=true]',function(){
    jqueryMap.$team.on('paste','div[spellcheck=false]',function(){
      var r, s,
          $that = $(this);

      setTimeout(function(){
        var t = $that.text().replace('\n','').trim();
        $that.text(t);

        set_focus($that);
      },300);
    });
    
    $.gevent.subscribe( jqueryMap.$team, 'zx-socket-broadcast-lockTeam', on_complete_socket_broadcast_lockTeam );
    $.gevent.subscribe( jqueryMap.$team, 'zx-socket-broadcast-delTeam',  on_complete_socket_broadcast_delTeam );
    $.gevent.subscribe( jqueryMap.$team, 'zx-socket-broadcast-delSm',    on_complete_socket_broadcast_delSm );
    $.gevent.subscribe( jqueryMap.$team, 'zx-downloadTeam',              onComplete_downloadTeam );
    $.gevent.subscribe( jqueryMap.$team, 'zx-downloadSm',                onComplete_downloadSm );

    return true;
  };
  // End public method /initModule/
   
  // Begin public method /removeThis/
  // Purpose    :
  //   * Removes $Team DOM element
  //   * Reverts to initial state
  //   * Removes pointers to callbacks and other data
  // Arguments  : none
  // Returns    : true
  // Throws     : none
  //
  removeThis = function () {
    // unwind initialization and state
    // remove DOM container; this removes event bindings too
    if ( jqueryMap.$team ) {
      jqueryMap.$team.off('click');
      jqueryMap.$smFlagTdDiv && jqueryMap.$smFlagTdDiv.off('focus');
      jqueryMap.$sendDestinationFlagTdDiv && jqueryMap.$sendDestinationFlagTdDiv.off('focus');
      jqueryMap.$guideTdDiv && jqueryMap.$guideTdDiv.off('focus');
      jqueryMap.$operatorTdDiv && jqueryMap.$operatorTdDiv.off('focus');
      jqueryMap.$teamTypeTdDiv && jqueryMap.$teamTypeTdDiv.off('focus');
      jqueryMap.$trafficTable.off('focus');
      jqueryMap.$trafficTable.off('blur');
      jqueryMap.$trafficTable.off('click');
      jqueryMap.$userBatchDiv.off('focus');
      jqueryMap.$userBatchDiv.off('click');
      jqueryMap.$userBatchDiv.off('blur');
      /*if(jqueryMap.$importBtn){
        jqueryMap.$importBtn.off('click');
        jqueryMap.$saveTeamBtn.off('click');
      }*/
      
      
      //jqueryMap.$team.off('keydown');
      jqueryMap.$team.remove();
      jqueryMap = {};
    }
    stateMap.$container = null;

    // unwind key configurations
    //configMap.chat_model      = null;
    configMap.people_model    = null;
    configMap.team_model      = null;
    configMap.sm_model        = null;
    configMap.list_model      = null;
    //configMap.set_team_anchor = null;

    return true;
  };
  // End public method /removeThis/

  // return public methods
  return {
    getAlidayu      : getAlidayu,
    newUserTable    : newUserTable,
    removeImportDiv : removeImportDiv,
    writeSN         : writeSN,
    configModule    : configModule,
    initModule      : initModule,
    removeThis      : removeThis
  };
  //------------------- END PUBLIC METHODS ---------------------
}());