/* 月账单
 * zx.billstotal.js
 * billstotal feature module for zx
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, zx */

zx.billstotal = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  // 声明所有 zx.billstotal 内可用的变量
  var
    // 静态配置值
    configMap = {
      main_html : String()
        + '<div class="zx-billstotal hidden">'
          + '<div class="zx-team-header row">'
            + '<div class="col-sm-2">'
              + '<h3>月账单汇总</h3>'
            + '</div>'
            + '<div class="col-sm-2">'
              + '<select id="bpmonthSelect" class="form-control input-sm" style="margin-top: 10px;">'
                //+ '<option></option>'
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
            +'<div class="col-sm-7></div>'
          + '</div>'
          + '<div class="zx-team">'
            + '<table class="table table-bordered table-condensed">'
              + '<caption>按公司贡献总额降序</caption>'
              + '<thead>'
                + '<tr>'
            	    + '<th rowspan="2">序号</th>'
                  + '<th rowspan="2">公司名称</th>'
                  + '<th colspan="7">送机-散客</th>'
                  + '<th class="text-primary" colspan="7">送机-包团</th>'
                  + '<th colspan="3">接机</th>'
                  + '<th rowspan="2">贡献合计</th>'
                + '</tr>'
                + '<tr>'
                  + '<th>团数</th>'
                  + '<th>人数</th>'
                  + '<th>验证</th>'
                  + '<th>服务费</th>'
                  + '<th>保险数</th>'
                  + '<th>保险费</th>'
                  + '<th>购买率</th>'
                  + '<th class="text-primary">团数</th>'
                  + '<th class="text-primary">人数</th>'
                  + '<th class="text-primary">验证</th>'
                  + '<th class="text-primary">服务费</th>'
                  + '<th class="text-primary">保险数</th>'
                  + '<th class="text-primary">保险费</th>'
                  + '<th class="text-primary">购买率</th>'
                  + '<th>团数</th>'
                  + '<th>人数</th>'
                  + '<th>服务费</th>'
                + '</tr>'
              + '</thead>'
              + '<tbody id="zx-team-tbody">'
              + '</tbody>'
              + '<tfoot>'
                + '<tr>'
                  + '<td><strong>合计</strong></td>'
                  + '<td></td>'
                  + '<td><strong id="teamNum1_sum"></strong></td>'
                  + '<td><strong id="peopleNum1_sum"></strong></td>'
                  + '<td><strong id="idcardsmfees1_sum"></strong></td>'
                  + '<td><strong id="fees1_sum"></strong></td>'
                  + '<td><strong id="insurance1_sum"></strong></td>'
                  + '<td><strong id="insurance_fee1_sum"></strong></td>'
                  + '<td><strong id="insurance_bi_fee1"></strong></td>'

                  + '<td><strong id="teamNum2_sum" class="text-primary"></strong></td>'
                  + '<td><strong id="peopleNum2_sum" class="text-primary"></strong></td>'
                  + '<td><strong id="idcardsmfees2_sum" class="text-primary"></strong></td>'
                  + '<td><strong id="fees2_sum" class="text-primary"></strong></td>'
                  + '<td><strong id="insurance2_sum" class="text-primary"></strong></td>'
                  + '<td><strong id="insurance_fee2_sum" class="text-primary"></strong></td>'
                  + '<td><strong id="insurance_bi_fee2" class="text-primary"></strong></td>'

                  + '<td><strong id="teamNum3_sum"></strong></td>'
                  + '<td><strong id="peopleNum3_sum"></strong></td>'
                  + '<td><strong id="fees3_sum"></strong></td>'
                  + '<td><strong id="sum_sum"></strong></td>'
                + '</tr>'
              + '</tfoot>'
            + '</table>'
            + '<table class="table table-bordered table-condensed">'
              + '<caption>按日期统计</caption>'
              + '<thead>'
                + '<tr>'
                  + '<th rowspan="2">日期</th>'
                  + '<th colspan="7">送机-散客</th>'
                  + '<th class="text-primary" colspan="7">送机-包团</th>'
                  + '<th colspan="3">接机</th>'
                  + '<th rowspan="2">贡献合计</th>'
                + '</tr>'
                + '<tr>'
                  + '<th>团数</th>'
                  + '<th>人数</th>'
                  + '<th>验证</th>'
                  + '<th>服务费</th>'
                  + '<th>保险数</th>'
                  + '<th>保险费</th>'
                  + '<th>购买率</th>'
                  + '<th class="text-primary">团数</th>'
                  + '<th class="text-primary">人数</th>'
                  + '<th class="text-primary">验证</th>'
                  + '<th class="text-primary">服务费</th>'
                  + '<th class="text-primary">保险数</th>'
                  + '<th class="text-primary">保险费</th>'
                  + '<th class="text-primary">购买率</th>'
                  + '<th>团数</th>'
                  + '<th>人数</th>'
                  + '<th>服务费</th>'
                + '</tr>'
              + '</thead>'
              + '<tbody id="zx-team-date-tbody">'
              + '</tbody>'
              + '<tfoot>'
                + '<tr>'
                  + '<td><strong>合计</strong></td>'
                  + '<td><strong id="date_teamNum1_sum"></strong></td>'
                  + '<td><strong id="date_peopleNum1_sum"></strong></td>'
                  + '<td><strong id="date_idcardsmfees1_sum"></strong></td>'
                  + '<td><strong id="date_fees1_sum"></strong></td>'
                  + '<td><strong id="date_insurance1_sum"></strong></td>'
                  + '<td><strong id="date_insurance_fee1_sum"></strong></td>'
                  + '<td><strong id="date_insurance_bi_fee1"></strong></td>'

                  + '<td><strong id="date_teamNum2_sum" class="text-primary"></strong></td>'
                  + '<td><strong id="date_peopleNum2_sum" class="text-primary"></strong></td>'
                  + '<td><strong id="date_idcardsmfees2_sum" class="text-primary"></strong></td>'
                  + '<td><strong id="date_fees2_sum" class="text-primary"></strong></td>'
                  + '<td><strong id="date_insurance2_sum" class="text-primary"></strong></td>'
                  + '<td><strong id="date_insurance_fee2_sum" class="text-primary"></strong></td>'
                  + '<td><strong id="date_insurance_bi_fee2" class="text-primary"></strong></td>'

                  + '<td><strong id="date_teamNum3_sum"></strong></td>'
                  + '<td><strong id="date_peopleNum3_sum"></strong></td>'
                  + '<td><strong id="date_fees3_sum"></strong></td>'
                  + '<td><strong id="date_sum_sum"></strong></td>'
                + '</tr>'
              + '</tfoot>'
            + '</table>'
            + '<table class="table table-bordered table-condensed">'
              + '<caption>按现场负责人贡献总额降序</caption>'
              + '<thead>'
                + '<tr>'
                  + '<th rowspan="2">序号</th>'
                  + '<th rowspan="2">现场</th>'
                  + '<th colspan="7">送机-散客</th>'
                  + '<th class="text-primary" colspan="7">送机-包团</th>'
                  + '<th colspan="3">接机</th>'
                  + '<th rowspan="2">贡献合计</th>'
                + '</tr>'
                + '<tr>'
                  + '<th>团数</th>'
                  + '<th>人数</th>'
                  + '<th>验证</th>'
                  + '<th>服务费</th>'
                  + '<th>保险数</th>'
                  + '<th>保险费</th>'
                  + '<th>购买率</th>'
                  + '<th class="text-primary">团数</th>'
                  + '<th class="text-primary">人数</th>'
                  + '<th class="text-primary">验证</th>'
                  + '<th class="text-primary">服务费</th>'
                  + '<th class="text-primary">保险数</th>'
                  + '<th class="text-primary">保险费</th>'
                  + '<th class="text-primary">购买率</th>'
                  + '<th>团数</th>'
                  + '<th>人数</th>'
                  + '<th>服务费</th>'
                + '</tr>'
              + '</thead>'
              + '<tbody id="zx-team-sev-tbody">'
              + '</tbody>'
              + '<tfoot>'
                + '<tr>'
                  + '<td><strong>合计</strong></td>'
                  + '<td></td>'
                  + '<td><strong id="sev_teamNum1_sum"></strong></td>'
                  + '<td><strong id="sev_peopleNum1_sum"></strong></td>'
                  + '<td><strong id="sev_idcardsmfees1_sum"></strong></td>'
                  + '<td><strong id="sev_fees1_sum"></strong></td>'
                  + '<td><strong id="sev_insurance1_sum"></strong></td>'
                  + '<td><strong id="sev_insurance_fee1_sum"></strong></td>'
                  + '<td><strong id="sev_insurance_bi_fee1"></strong></td>'

                  + '<td><strong id="sev_teamNum2_sum" class="text-primary"></strong></td>'
                  + '<td><strong id="sev_peopleNum2_sum" class="text-primary"></strong></td>'
                  + '<td><strong id="sev_idcardsmfees2_sum" class="text-primary"></strong></td>'
                  + '<td><strong id="sev_fees2_sum" class="text-primary"></strong></td>'
                  + '<td><strong id="sev_insurance2_sum" class="text-primary"></strong></td>'
                  + '<td><strong id="sev_insurance_fee2_sum" class="text-primary"></strong></td>'
                  + '<td><strong id="sev_insurance_bi_fee2" class="text-primary"></strong></td>'

                  + '<td><strong id="sev_teamNum3_sum"></strong></td>'
                  + '<td><strong id="sev_peopleNum3_sum"></strong></td>'
                  + '<td><strong id="sev_fees3_sum"></strong></td>'
                  + '<td><strong id="sev_sum_sum"></strong></td>'
                + '</tr>'
              + '</tfoot>'
            + '</table>'
          + '</div>'
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
    onCompletegetbillstotal, onSearchBtnClick,
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
    	$container       : $container,
    	$billstotal      : $container.find('.zx-billstotal'),
      $zxteamtbody     : $('#zx-team-tbody'),
      $zxteamdatetbody : $('#zx-team-date-tbody'),
      $zxteamsevtbody  : $('#zx-team-sev-tbody')
    };
  };
  // End DOM method /setJqueryMap/
  //---------------------- END DOM METHODS ---------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  onCompletegetbillstotal = function(event, result){
  	var CITY = zx.config.getConfigMapItem('citys')[zx.config.getStateMapItem('city')].city,
        BAO_XIAN_FEI       = 30,
        obj                = result.obj,
        sms                = result.sms,
        smObj              = {},
        smArr              = [],
        teamNum1_sum       = 0,
        peopleNum1_sum     = 0,
        fees1_sum          = 0,
        idcardsmfees1_sum  = 0,
        insurance1_sum     = 0,
        insurance_fee1_sum = 0,
        teamNum2_sum       = 0,
        peopleNum2_sum     = 0,
        fees2_sum          = 0,
        idcardsmfees2_sum  = 0,
        insurance2_sum     = 0,
        insurance_fee2_sum = 0,
        teamNum3_sum       = 0,
        peopleNum3_sum     = 0,
        fees3_sum          = 0,
        sum_sum            = 0,

        smDateObj               = {},
        smDateArr               = [],
        date_teamNum1_sum       = 0,
        date_peopleNum1_sum     = 0,
        date_fees1_sum          = 0,
        date_idcardsmfees1_sum  = 0,
        date_insurance1_sum     = 0,
        date_insurance_fee1_sum = 0,
        date_teamNum2_sum       = 0,
        date_peopleNum2_sum     = 0,
        date_fees2_sum          = 0,
        date_idcardsmfees2_sum  = 0,
        date_insurance2_sum     = 0,
        date_insurance_fee2_sum = 0,
        date_teamNum3_sum       = 0,
        date_peopleNum3_sum     = 0,
        date_fees3_sum          = 0,
        date_sum_sum            = 0,

        smSevObj               = {},
        smSevArr               = [],
        sev_teamNum1_sum       = 0,
        sev_peopleNum1_sum     = 0,
        sev_fees1_sum          = 0,
        sev_idcardsmfees1_sum  = 0,
        sev_insurance1_sum     = 0,
        sev_insurance_fee1_sum = 0,
        sev_teamNum2_sum       = 0,
        sev_peopleNum2_sum     = 0,
        sev_fees2_sum          = 0,
        sev_idcardsmfees2_sum  = 0,
        sev_insurance2_sum     = 0,
        sev_insurance_fee2_sum = 0,
        sev_teamNum3_sum       = 0,
        sev_peopleNum3_sum     = 0,
        sev_fees3_sum          = 0,
        sev_sum_sum            = 0,

        fees1, fees2, fees3,
        idcardsmfees1, idcardsmfees2,
        insurance1, insurance2,
        insurance_fee1, insurance_fee2,
        smSort, smDateSort, smSevSort,
        i, len,
        item, $tr;

    //console.log(sms[0]);
    // 渲染表格
    $('#bpmonthSelect').val(obj.bpMonth);

    // 团队单费用表
    for(i = 0, len = sms.length; i < len; i++) {
    	// 判断是接机还是送机
    	if(sms[i].flight.flightStartCity === CITY){
    		// 送机
    		// 判断是散客还是包团
    		if(sms[i].team.teamType === '包团') {
    			// 包团
    			setSmObj(smObj, sms[i].company.name, 'bao', {
    				teamNum: 1,
	    			peopleNum: sms[i].smRealNumber,
	    			fees: sms[i].fees + sms[i].addFees,
            idcardsmfees: sms[i].idcardsmfees,
	    			insurance: sms[i].insurance
	    		});
          setSmObj(smDateObj, sms[i].flight.flightDate, 'bao', {
            teamNum: 1,
            peopleNum: sms[i].smRealNumber,
            fees: sms[i].fees + sms[i].addFees,
            idcardsmfees: sms[i].idcardsmfees,
            insurance: sms[i].insurance
          });
          setSmObj(smSevObj, sms[i].serverMan, 'bao', {
            id:sms[i]._id,
            teamNum: 1,
            peopleNum: sms[i].smRealNumber,
            fees: sms[i].fees + sms[i].addFees,
            idcardsmfees: sms[i].idcardsmfees,
            insurance: sms[i].insurance
          });
    		} else {
    			// 散客
    			setSmObj(smObj, sms[i].company.name, 'san', {
    				teamNum: 1,
	    			peopleNum: sms[i].smRealNumber,
	    			fees: sms[i].fees + sms[i].addFees,
            idcardsmfees: sms[i].idcardsmfees,
	    			insurance: sms[i].insurance
	    		});
          setSmObj(smDateObj, sms[i].flight.flightDate, 'san', {
            teamNum: 1,
            peopleNum: sms[i].smRealNumber,
            fees: sms[i].fees + sms[i].addFees,
            idcardsmfees: sms[i].idcardsmfees,
            insurance: sms[i].insurance
          });
          setSmObj(smSevObj, sms[i].serverMan, 'san', {
            id:sms[i]._id,
            teamNum: 1,
            peopleNum: sms[i].smRealNumber,
            fees: sms[i].fees + sms[i].addFees,
            idcardsmfees: sms[i].idcardsmfees,
            insurance: sms[i].insurance
          });
    		}
    	} else {
    		// 接机
    		setSmObj(smObj, sms[i].company.name, 'meet', {
    			teamNum: 1,
    			peopleNum: sms[i].smRealNumber,
    			fees: sms[i].fees + sms[i].addFees
    		});
        setSmObj(smDateObj, sms[i].flight.flightDate, 'meet', {
          teamNum: 1,
          peopleNum: sms[i].smRealNumber,
          fees: sms[i].fees + sms[i].addFees,
          //insurance: sms[i].insurance
        });
        setSmObj(smSevObj, sms[i].serverMan, 'meet', {
          //id:sms[i]._id,
          teamNum: 1,
          peopleNum: sms[i].smRealNumber,
          fees: sms[i].fees + sms[i].addFees,
          //insurance: sms[i].insurance
        });
    	}
    }

    // smObj 转 smArr
    for ( var sm in smObj ) {
      if(smObj.hasOwnProperty(sm)) {
    		fees1 = smObj[sm]['san'].fees / 100;
        idcardsmfees1 = smObj[sm]['san'].idcardsmfees;
    		insurance1 = smObj[sm]['san'].insurance;
    		insurance_fee1 = insurance1 * BAO_XIAN_FEI;

    		fees2 = smObj[sm]['bao'].fees / 100;
        idcardsmfees2 = smObj[sm]['bao'].idcardsmfees;
    		insurance2 = smObj[sm]['bao'].insurance;
    		insurance_fee2 = insurance2 * BAO_XIAN_FEI;

    		fees3 = smObj[sm]['meet'].fees / 100;

    		smArr.push({
    			company: sm,

    			teamNum1: smObj[sm]['san'].teamNum,
    			peopleNum1: smObj[sm]['san'].peopleNum,
    			fees1: fees1,
          idcardsmfees1: idcardsmfees1,
    			insurance1: insurance1,
    			insurance_fee1: insurance_fee1,

    			teamNum2: smObj[sm]['bao'].teamNum,
    			peopleNum2: smObj[sm]['bao'].peopleNum,
    			fees2: fees2,
          idcardsmfees2: idcardsmfees2,
    			insurance2: insurance2,
    			insurance_fee2: insurance_fee2,

    			teamNum3: smObj[sm]['meet'].teamNum,
    			peopleNum3: smObj[sm]['meet'].peopleNum,
    			fees3: fees3,

    			sum: fees1 + insurance_fee1 + fees2 + insurance_fee2 + fees3
    		});

    		teamNum1_sum += smObj[sm]['san'].teamNum;
        peopleNum1_sum += smObj[sm]['san'].peopleNum;
        fees1_sum += fees1;
        idcardsmfees1_sum += idcardsmfees1;
        insurance1_sum += insurance1;
        insurance_fee1_sum += insurance_fee1;

        teamNum2_sum += smObj[sm]['bao'].teamNum;
        peopleNum2_sum += smObj[sm]['bao'].peopleNum;
        fees2_sum += fees2;
        idcardsmfees2_sum += idcardsmfees2;
        insurance2_sum += insurance2;
        insurance_fee2_sum += insurance_fee2;

        teamNum3_sum += smObj[sm]['meet'].teamNum;
        peopleNum3_sum += smObj[sm]['meet'].peopleNum;
        fees3_sum += fees3;
        sum_sum += fees1 + insurance_fee1 + fees2 + insurance_fee2 + fees3;
    	}
    }
    // smDateObj 转 smDateArr
    for (var sm in smDateObj) {
      if(smDateObj.hasOwnProperty(sm)) {
        fees1 = smDateObj[sm]['san'].fees / 100;
        idcardsmfees1 = smDateObj[sm]['san'].idcardsmfees;
        insurance1 = smDateObj[sm]['san'].insurance;
        insurance_fee1 = insurance1 * BAO_XIAN_FEI;

        fees2 = smDateObj[sm]['bao'].fees / 100;
        insurance2 = smDateObj[sm]['bao'].insurance;
        idcardsmfees2 = smDateObj[sm]['bao'].idcardsmfees;
        insurance_fee2 = insurance2 * BAO_XIAN_FEI;

        fees3 = smDateObj[sm]['meet'].fees / 100;

        smDateArr.push({
          date : sm,

          teamNum1: smDateObj[sm]['san'].teamNum,
          peopleNum1: smDateObj[sm]['san'].peopleNum,
          fees1: fees1,
          idcardsmfees1: idcardsmfees1,
          insurance1: insurance1,
          insurance_fee1: insurance_fee1,

          teamNum2: smDateObj[sm]['bao'].teamNum,
          peopleNum2: smDateObj[sm]['bao'].peopleNum,
          fees2: fees2,
          idcardsmfees2: idcardsmfees2,
          insurance2: insurance2,
          insurance_fee2: insurance_fee2,

          teamNum3: smDateObj[sm]['meet'].teamNum,
          peopleNum3: smDateObj[sm]['meet'].peopleNum,
          fees3: fees3,

          sum: fees1 + insurance_fee1 + fees2 + insurance_fee2 + fees3
        });

        date_teamNum1_sum += smDateObj[sm]['san'].teamNum;
        date_peopleNum1_sum += smDateObj[sm]['san'].peopleNum;
        date_fees1_sum += fees1;
        date_idcardsmfees1_sum += idcardsmfees1;
        date_insurance1_sum += insurance1;
        date_insurance_fee1_sum += insurance_fee1;

        date_teamNum2_sum += smDateObj[sm]['bao'].teamNum;
        date_peopleNum2_sum += smDateObj[sm]['bao'].peopleNum;
        date_fees2_sum += fees2;
        date_idcardsmfees2_sum += idcardsmfees2;
        date_insurance2_sum += insurance2;
        date_insurance_fee2_sum += insurance_fee2;

        date_teamNum3_sum += smDateObj[sm]['meet'].teamNum;
        date_peopleNum3_sum += smDateObj[sm]['meet'].peopleNum;
        date_fees3_sum += fees3;
        date_sum_sum += fees1 + insurance_fee1 + fees2 + insurance_fee2 + fees3;
      }
    }
    // smSevObj 转 smSevArr
    for (var sm in smSevObj) {
      if(smSevObj.hasOwnProperty(sm)) {
        fees1 = smSevObj[sm]['san'].fees / 100;
        idcardsmfees1 = smSevObj[sm]['san'].idcardsmfees;
        insurance1 = smSevObj[sm]['san'].insurance;
        insurance_fee1 = insurance1 * BAO_XIAN_FEI;

        fees2 = smSevObj[sm]['bao'].fees / 100;
        idcardsmfees2 = smSevObj[sm]['bao'].idcardsmfees;
        insurance2 = smSevObj[sm]['bao'].insurance;
        insurance_fee2 = insurance2 * BAO_XIAN_FEI;

        fees3 = smSevObj[sm]['meet'].fees / 100;

        smSevArr.push({
          serverMan : sm,

          teamNum1: smSevObj[sm]['san'].teamNum,
          peopleNum1: smSevObj[sm]['san'].peopleNum,
          fees1: fees1,
          idcardsmfees1: idcardsmfees1,
          insurance1: insurance1,
          insurance_fee1: insurance_fee1,

          teamNum2: smSevObj[sm]['bao'].teamNum,
          peopleNum2: smSevObj[sm]['bao'].peopleNum,
          fees2: fees2,
          idcardsmfees2: idcardsmfees2,
          insurance2: insurance2,
          insurance_fee2: insurance_fee2,

          teamNum3: smSevObj[sm]['meet'].teamNum,
          peopleNum3: smSevObj[sm]['meet'].peopleNum,
          fees3: fees3,

          sum: fees1 + insurance_fee1 + fees2 + insurance_fee2 + fees3
        });

        sev_teamNum1_sum += smSevObj[sm]['san'].teamNum;
        sev_peopleNum1_sum += smSevObj[sm]['san'].peopleNum;
        sev_fees1_sum += fees1;
        sev_idcardsmfees1_sum += idcardsmfees1;
        sev_insurance1_sum += insurance1;
        sev_insurance_fee1_sum += insurance_fee1;

        sev_teamNum2_sum += smSevObj[sm]['bao'].teamNum;
        sev_peopleNum2_sum += smSevObj[sm]['bao'].peopleNum;
        sev_fees2_sum += fees2;
        sev_idcardsmfees2_sum += idcardsmfees2;
        sev_insurance2_sum += insurance2;
        sev_insurance_fee2_sum += insurance_fee2;

        sev_teamNum3_sum += smSevObj[sm]['meet'].teamNum;
        sev_peopleNum3_sum += smSevObj[sm]['meet'].peopleNum;
        sev_fees3_sum += fees3;
        sev_sum_sum += fees1 + insurance_fee1 + fees2 + insurance_fee2 + fees3;
      }
    }

    // smArr 排序
    smSort = smArr.sort(function (a, b) {
        return b.sum  - a.sum;
    });

    //console.log(smSort);
    // smDateArr 排序
    smDateSort = smDateArr.sort(function (a, b) {
        return moment(a.date).diff(moment(b.date));
    });
    // smSevArr 排序
    smSevSort = smSevArr.sort(function (a, b) {
        return b.sum  - a.sum;
    });

    // 渲染表单
    for(i = 0, len = smSort.length; i < len; i++) {
    	item = smSort[i];
    	//console.log(item);
    	$tr=$('<tr></tr>');

    	$tr
    		.append($('<td></td>').text(i+1))
    		.append($('<td></td>').text(item.company))
    		.append($('<td></td>').text(item.teamNum1 === 0 ? '' : item.teamNum1))
    		.append($('<td></td>').text(item.teamNum1 === 0 ? '' : item.peopleNum1))
        .append($('<td></td>').text(item.teamNum1 === 0 ? '' : item.idcardsmfees1))
    		.append($('<td></td>').text(item.teamNum1 === 0 ? '' : item.fees1))
    		.append($('<td></td>').text(item.teamNum1 === 0 ? '' : item.insurance1))
    		.append($('<td></td>').text(item.teamNum1 === 0 ? '' : item.insurance_fee1))
    		.append($('<td></td>').text(item.peopleNum1 === 0 ? '' : Math.ceil(item.insurance1 * 100 / item.peopleNum1) + '%'))
    		
        .append($('<td class="text-primary"></td>').text(item.teamNum2 === 0 ? '' : item.teamNum2))
    		.append($('<td class="text-primary"></td>').text(item.teamNum2 === 0 ? '' : item.peopleNum2))
        .append($('<td class="text-primary"></td>').text(item.teamNum2 === 0 ? '' : item.idcardsmfees2))
    		.append($('<td class="text-primary"></td>').text(item.teamNum2 === 0 ? '' : item.fees2))
    		.append($('<td class="text-primary"></td>').text(item.teamNum2 === 0 ? '' : item.insurance2))
    		.append($('<td class="text-primary"></td>').text(item.teamNum2 === 0 ? '' : item.insurance_fee2))
    		.append($('<td class="text-primary"></td>').text(item.peopleNum2 === 0 ? '' : Math.ceil(item.insurance2 * 100 / item.peopleNum2) + '%'))
    		
        .append($('<td></td>').text(item.teamNum3 === 0 ? '' : item.teamNum3))
    		.append($('<td></td>').text(item.teamNum3 === 0 ? '' : item.peopleNum3))
    		.append($('<td></td>').text(item.teamNum3 === 0 ? '' : item.fees3))
    		.append($('<td></td>').text(item.sum));
		  jqueryMap.$zxteamtbody.append($tr);
    }

    $('#teamNum1_sum').text(teamNum1_sum);
    $('#peopleNum1_sum').text(peopleNum1_sum);
    $('#idcardsmfees1_sum').text(idcardsmfees1_sum);
    $('#fees1_sum').text(fees1_sum);
    $('#insurance1_sum').text(insurance1_sum);
    $('#insurance_fee1_sum').text(insurance_fee1_sum);
    $('#insurance_bi_fee1').text(Math.ceil(insurance1_sum * 100 / peopleNum1_sum) + '%');

    $('#teamNum2_sum').text(teamNum2_sum);
    $('#peopleNum2_sum').text(peopleNum2_sum);
    $('#idcardsmfees2_sum').text(idcardsmfees2_sum);
    $('#fees2_sum').text(fees2_sum);
    $('#insurance2_sum').text(insurance2_sum);
    $('#insurance_fee2_sum').text(insurance_fee2_sum);
    $('#insurance_bi_fee2').text(Math.ceil(insurance2_sum * 100 / peopleNum2_sum) + '%');

    $('#teamNum3_sum').text(teamNum3_sum);
    $('#peopleNum3_sum').text(peopleNum3_sum);
    $('#fees3_sum').text(fees3_sum);

    $('#sum_sum').text(sum_sum);

    for(i = 0, len = smDateSort.length; i < len; i++) {
      item = smDateSort[i];
      $tr=$('<tr></tr>');
      $tr
        .append($('<td></td>').text(moment(item.date).format('MM-DD')))
        .append($('<td></td>').text(item.teamNum1 === 0 ? '' : item.teamNum1))
        .append($('<td></td>').text(item.teamNum1 === 0 ? '' : item.peopleNum1))
        .append($('<td></td>').text(item.teamNum1 === 0 ? '' : item.idcardsmfees1))
        .append($('<td></td>').text(item.teamNum1 === 0 ? '' : item.fees1))
        .append($('<td></td>').text(item.teamNum1 === 0 ? '' : item.insurance1))
        .append($('<td></td>').text(item.teamNum1 === 0 ? '' : item.insurance_fee1))
        .append($('<td></td>').text(item.peopleNum1 === 0 ? '' : Math.ceil(item.insurance1 * 100 / item.peopleNum1) + '%'))

        .append($('<td class="text-primary"></td>').text(item.teamNum2 === 0 ? '' : item.teamNum2))
        .append($('<td class="text-primary"></td>').text(item.teamNum2 === 0 ? '' : item.peopleNum2))
        .append($('<td class="text-primary"></td>').text(item.teamNum2 === 0 ? '' : item.idcardsmfees2))
        .append($('<td class="text-primary"></td>').text(item.teamNum2 === 0 ? '' : item.fees2))
        .append($('<td class="text-primary"></td>').text(item.teamNum2 === 0 ? '' : item.insurance2))
        .append($('<td class="text-primary"></td>').text(item.teamNum2 === 0 ? '' : item.insurance_fee2))
        .append($('<td class="text-primary"></td>').text(item.peopleNum2 === 0 ? '' : Math.ceil(item.insurance2 * 100 / item.peopleNum2) + '%'))
        
        .append($('<td></td>').text(item.teamNum3 === 0 ? '' : item.teamNum3))
        .append($('<td></td>').text(item.teamNum3 === 0 ? '' : item.peopleNum3))
        .append($('<td></td>').text(item.teamNum3 === 0 ? '' : item.fees3))
        .append($('<td></td>').text(item.sum));

      jqueryMap.$zxteamdatetbody.append($tr);
    }

    $('#date_teamNum1_sum').text(date_teamNum1_sum);
    $('#date_peopleNum1_sum').text(date_peopleNum1_sum);
    $('#date_idcardsmfees1_sum').text(date_idcardsmfees1_sum);
    $('#date_fees1_sum').text(date_fees1_sum);
    $('#date_insurance1_sum').text(date_insurance1_sum);
    $('#date_insurance_fee1_sum').text(date_insurance_fee1_sum);
    $('#date_insurance_bi_fee1').text(Math.ceil(date_insurance1_sum * 100 / date_peopleNum1_sum) + '%');

    $('#date_teamNum2_sum').text(date_teamNum2_sum);
    $('#date_peopleNum2_sum').text(date_peopleNum2_sum);
    $('#date_idcardsmfees2_sum').text(date_idcardsmfees2_sum);
    $('#date_fees2_sum').text(date_fees2_sum);
    $('#date_insurance2_sum').text(date_insurance2_sum);
    $('#date_insurance_fee2_sum').text(date_insurance_fee2_sum);
    $('#date_insurance_bi_fee2').text(Math.ceil(date_insurance2_sum * 100 / date_peopleNum2_sum) + '%');

    $('#date_teamNum3_sum').text(date_teamNum3_sum);
    $('#date_peopleNum3_sum').text(date_peopleNum3_sum);
    $('#date_fees3_sum').text(date_fees3_sum);

    $('#date_sum_sum').text(date_sum_sum);

    for(i = 0, len = smSevSort.length; i < len; i++) {
      item = smSevSort[i];
      $tr=$('<tr></tr>');
      $tr
        .append($('<td></td>').text(i+1))
        .append($('<td></td>').text(item.serverMan))
        .append($('<td></td>').text(item.teamNum1 === 0 ? '' : item.teamNum1))
        .append($('<td></td>').text(item.teamNum1 === 0 ? '' : item.peopleNum1))
        .append($('<td></td>').text(item.teamNum1 === 0 ? '' : item.idcardsmfees1))
        .append($('<td></td>').text(item.teamNum1 === 0 ? '' : item.fees1))
        .append($('<td></td>').text(item.teamNum1 === 0 ? '' : item.insurance1))
        .append($('<td></td>').text(item.teamNum1 === 0 ? '' : item.insurance_fee1))
        .append($('<td></td>').text(item.peopleNum1 === 0 ? '' : Math.ceil(item.insurance1 * 100 / item.peopleNum1) + '%'))

        .append($('<td class="text-primary"></td>').text(item.teamNum2 === 0 ? '' : item.teamNum2))
        .append($('<td class="text-primary"></td>').text(item.teamNum2 === 0 ? '' : item.peopleNum2))
        .append($('<td class="text-primary"></td>').text(item.teamNum2 === 0 ? '' : item.idcardsmfees2))
        .append($('<td class="text-primary"></td>').text(item.teamNum2 === 0 ? '' : item.fees2))
        .append($('<td class="text-primary"></td>').text(item.teamNum2 === 0 ? '' : item.insurance2))
        .append($('<td class="text-primary"></td>').text(item.teamNum2 === 0 ? '' : item.insurance_fee2))
        .append($('<td class="text-primary"></td>').text(item.peopleNum2 === 0 ? '' : Math.ceil(item.insurance2 * 100 / item.peopleNum2) + '%'))
        
        .append($('<td></td>').text(item.teamNum3 === 0 ? '' : item.teamNum3))
        .append($('<td></td>').text(item.teamNum3 === 0 ? '' : item.peopleNum3))
        .append($('<td></td>').text(item.teamNum3 === 0 ? '' : item.fees3))
        .append($('<td></td>').text(item.sum));

      jqueryMap.$zxteamsevtbody.append($tr);
    }

    $('#sev_teamNum1_sum').text(sev_teamNum1_sum);
    $('#sev_peopleNum1_sum').text(sev_peopleNum1_sum);
    $('#sev_idcardsmfees1_sum').text(sev_idcardsmfees1_sum);
    $('#sev_fees1_sum').text(sev_fees1_sum);
    $('#sev_insurance1_sum').text(sev_insurance1_sum);
    $('#sev_insurance_fee1_sum').text(sev_insurance_fee1_sum);
    $('#sev_insurance_bi_fee1').text(Math.ceil(sev_insurance1_sum * 100 / sev_peopleNum1_sum) + '%');

    $('#sev_teamNum2_sum').text(sev_teamNum2_sum);
    $('#sev_peopleNum2_sum').text(sev_peopleNum2_sum);
    $('#sev_idcardsmfees2_sum').text(sev_idcardsmfees2_sum);
    $('#sev_fees2_sum').text(sev_fees2_sum);
    $('#sev_insurance2_sum').text(sev_insurance2_sum);
    $('#sev_insurance_fee2_sum').text(sev_insurance_fee2_sum);
    $('#sev_insurance_bi_fee2').text(Math.ceil(sev_insurance2_sum * 100 / sev_peopleNum2_sum) + '%');

    $('#sev_teamNum3_sum').text(sev_teamNum3_sum);
    $('#sev_peopleNum3_sum').text(sev_peopleNum3_sum);
    $('#sev_fees3_sum').text(sev_fees3_sum);

    $('#sev_sum_sum').text(sev_sum_sum);

    jqueryMap.$billstotal.removeClass('hidden');

    function setSmObj(smObj, name, objType, obj) {
      if(typeof name === 'undefined' || name === '') {
        name = '待定';
      }

    	if(smObj.hasOwnProperty(name)) {

  			if(objType === 'meet') {
  				smObj[name][objType]['teamNum'] += obj.teamNum;
  				smObj[name][objType]['peopleNum'] += obj.peopleNum;
  				smObj[name][objType]['fees'] += obj.fees;
  			} else {
  				smObj[name][objType]['teamNum'] += 1;
  				smObj[name][objType]['peopleNum'] += obj.peopleNum;
  				smObj[name][objType]['fees'] += obj.fees;
          smObj[name][objType]['insurance'] += obj.insurance;
  				smObj[name][objType]['idcardsmfees'] += obj.idcardsmfees;
  			}

    	} else {
    		// 初始化
    		smObj[name] = {
    			'san': {
    				'teamNum': 0,
    				'peopleNum': 0,
    				'fees': 0,
            'idcardsmfees': 0,
    				'insurance': 0
    			},
    			'bao': {
    				'teamNum': 0,
    				'peopleNum': 0,
    				'fees': 0,
            'idcardsmfees': 0,
    				'insurance': 0
    			},
    			'meet': {
    				'teamNum': 0,
    				'peopleNum': 0,
    				'fees': 0
    			}
    		}

    		// 赋值
    		smObj[name][objType] = obj;
    	}
    }
  };

  onSearchBtnClick = function(){
    var bpmonth = $('#bpmonthSelect').val();

  	$.uriAnchor.setAnchor({ 
  	  'page'    : 'billstotal', 
  	  'bpmonth' : bpmonth
  	}, null, true );
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

    $.gevent.subscribe( jqueryMap.$billstotal, 'zx-getbillstotal', onCompletegetbillstotal );

    zx.model.bp.getbillstotal(argObj);

    jqueryMap.$billstotal.on('click','#searchBtn', onSearchBtnClick );

    return true;
  };
  // End public method /initModule/
   
  // Begin public method /removeThis/
  // Purpose    :
  //   * Removes chatbillstotal DOM element
  //   * Reverts to initial state
  //   * Removes pointers to callbacks and other data
  // Arguments  : none
  // Returns    : true
  // Throws     : none
  //
  removeThis = function () {
    // unwind initialization and state
    // remove DOM container; this removes event bindings too
    if ( jqueryMap.$billstotal ) {
      jqueryMap.$billstotal.remove();
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