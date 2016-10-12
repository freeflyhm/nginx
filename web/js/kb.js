var kb = (function () {
  'use strict';
  var configMap = {
      // io.connect
      // server: 'http://47.88.100.75:8080/',
      // server: 'http://192.168.99.100:8080/',
      server:'http://120.24.48.192:8080/',
      citys: {
        sz: { province: '广东', city: '深圳' },
        gz: { province: '广东', city: '广州' },
        hz: { province: '浙江', city: '杭州' },
      },
      user_options: {
        sz: [

          // { value: 'huangpeng', text: '黄鹏'  },
          { value: 'wm',    text: '王敏' },
          { value: 'lm',    text: '李敏' },
          { value: 'liusai',    text: '刘赛' },
          { value: 'zwb',   text: '周文斌' },
          { value: 'shenbin',   text: '沈斌' },

          // { value: 'xiaoyu',    text: '郑泽瑜'},
          { value: 'wang',      text: '汪凌云' },
          { value: 'wujidong',  text: '老吴' },
          { value: 'hemiao',    text: '何苗' },
        ],
        gz: [
          { value: 'zhouwenbin', text: '周文斌' },
          { value: 'zhenghaijie', text: '郑海杰' },
          { value: 'lixuanmei', text: '李玄妹' },

          //{value: 'suitianye', text: '隋天野'},
          { value: 'wanggz', text: '汪凌云' },
          { value: 'ygfzgz', text: '郑泽瑜' },
          { value: 'ygfwgz', text: '阳光服务' },
          { value: 'hemiao', text: '何苗' },
        ],
        hz: [
          { value: 'rrly9888', text: '童斌' },
          { value: 'lww', text: '刘威威' },
          { value: 'qiulei', text: '邱磊' },
          { value: 'yt', text: '叶涛' },
          { value: 'ygfwhz', text: '阳光服务' },
          { value: 'wanghz', text: '汪凌云' },
          { value: 'hemiao', text: '何苗' },
        ],
      },
      serverman_options: {
        sz: ['待定', '王敏', '李敏', '刘赛', '周文斌', '沈斌', '汪凌云', '办公室'],
        gz: ['待定', '周文斌', '郑海杰', '李玄妹', '汪凌云', '办公室'],
        hz: ['待定', '刘威威', '邱磊', '叶涛', '童斌', '办公室'],
      },
      setplace_options: {
        sz: ['2', '6', '0'],
        gz: ['2', '16', '0'],
        hz: ['11', '0'],
      },
      FULLCALENDAR_STATE: {
        INIT: 0,
        PLAYONE: 1,
      },
      BASE_URL: document.location.href.split('#')[0], // 网站根域名 get
      HASH_STR: {
        LOGIN_PAGE: '#kb-login-page',
        INDEX_PAGE: '#index',
        DETAIL_PAGE: '#kb-detail-page',
        INSURANCE_PAGE: '#kb-insurance-page',
        MSG_PAGE: '#kb-msg-page',
        EDITDJPNOTE_PAGE: '#kb-editdjpnote-page',
        EDITSERVERNOTE_PAGE: '#kb-editservernote-page',
        EDITFLIGHT_PAGE: '#kb-editflight-page',
        SM_PAGE: '#kb-sm-page',
        FLIGHT_PAGE: '#kb-flight-page',
        HISTORY_PAGE: '#kb-history-page',
      },
      handlebars_send_phone_message_str: String()
        + '{{#if 送机旗号}}'
          + '您好！我是机场送团部小沈，明天{{集合时间_时段}}{{集合时间}}我们在{{集合地点}}集合，到了找{{送机旗号}}或联系{{本机}}，谢谢！祝旅途愉快！提示：办完手续后立即进入安检，最晚在航班起飞前1个小时进入安检。（如需咨询机场问题或对送团工作不满意请联系15814750610）'
        + '{{else}}'
          + '您好！我是机场送团部小沈，明天{{集合时间_时段}}{{集合时间}}我们在{{集合地点}}集合，到了联系{{本机}}，谢谢！祝旅途愉快！提示：办完手续后立即进入安检，最晚在航班起飞前1个小时进入安检。（如需咨询机场问题或对送团工作不满意请联系15814750610）'
        + '{{/if}}',
      handlebars_meet_phone_message_str: String()
        + '{{#if 接机旗号}}'
          + '您好！我是深圳接机人员，明天我在{{集合地点}}拿{{接机旗号}}接机并安排车送你们。起飞前请联系我，祝旅途愉快！'
        + '{{else}}'
          + '您好！我是深圳接机人员，明天我在{{集合地点}}拿"阳光服务"蓝色导游旗接机并安排车送你们。起飞前请联系我，祝旅途愉快！'
        + '{{/if}}',
    },
    stateMap = {
      canOfflineUse    : false,                                        // 默认程序只能在线使用
      online           : true,                                         // 默认true, 在线
      fullCalendarState: configMap.FULLCALENDAR_STATE.INIT,            // 默认 fullCalendar 在初始化状态
      userObj          : {
        name    : '游客',
        userName: ''
      },                                                               // 当前用户
      servermans       : [],                                           // 现场负责人 Array
      events           : [],                                           // 渲染列表数据源 Array
      hash             : configMap.HASH_STR.INDEX_PAGE,                // hash 默认 #index
      thisDate         : moment().startOf('day').format('YYYY-MM-DD'), // 当前日期 默认 当天
      scrollTop        : 0,                                            // 记录滚动条Top位置
      calEvent_id      : '',
      smObj            : null,                                         // 当前 detail 界面 数据源 引用 events 数组对象的子项
      sio              : null,
      smResult         : null,
      city             : '',
      CITY             : ''
    },
    jqueryMap = {
      // login
      $userNameSelect    : null, $passwordInput       : null, $loginBtn               : null,
      // index
      $name_span         : null, $online_span         : null, $kb_list                : null,
      $prevBtn           : null, $nextBtn             : null, $todayBtn               : null,
      // detail
      $$kb_item          : null,
      $detail_mask       : null, $gotoInsurancePageBtn: null, $phoneMsgStatusSelect   : null,
      $servermanSelect   : null, $djpStateSelect      : null, $djpNoteDiv             : null,
      $smSetPlaceSelect  : null, $flightStateSelect   : null, 
      $flightDiv         : null, $flight_del_div_del  : null, $flight_div             : null,
      $smAgencyFund_tr   : null, $smAgencyFund_td     : null, $smAgencyFundStateSelect: null,
      $smPayment_tr      : null, $smPayment_td        : null, $smPaymentStateSelect   : null,
      $serverStateSelect : null, $serverNoteDiv       : null,
      /*// insurance 保险
      $person_phone      : null, $shortNum            : null, $nameCountSpan          : null,
      $cardCountSpan     : null, $kb_pingan_tbody     : null,*/
      // msg 短信
      $msg_main          : null, $sm_msg_phones       : null, $sm_msg_text            : null,
      $sm_msg_switch     : null, $sendMsgBtn          : null,
      $ok_msg_phones     : null, $ok_msg_text         : null,
      // editdjpnote
      $djpNoteEditDiv    : null, $djpNoteSaveBtn      : null,
      // editservernote
      $serverNoteEditDiv : null, $serverNoteSaveBtn   : null,
      // editflight
      $flightDateTd      : null, $flightDateInput     : null,
      $flightNumTd       : null, $flightNumInput      : null,
      $flightStartCityTd : null, $flightStartCityInput: null,
      $flightEndCityTd   : null, $flightEndCityInput  : null,
      $flightStartTimeTd : null, $flightStartTimeInput: null,
      $flightEndTimeTd   : null, $flightEndTimeInput  : null,
      $flightSearchBtn   : null, $flightUpdateBtn     : null,  
      $flightDelBtn      : null, $flightSaveBtn       : null,

      $set_flight_div        : null, $set_flight_field      : null,
      $set_flight_input_one  : null, $set_flight_label_one  : null,
      $set_flight_input_two  : null, $set_flight_label_two  : null,
      $set_flight_input_three: null, $set_flight_label_three: null,

      // sm 名单
      $sm_main           : null, $sm_listview         : null,
      // flight
      $flight_main_before: null, $flight_main         : null, $flight_panel          : null,
      $flight_main_span  : null,
      // history
      $kb_item_history   : null
    },

    pingan,
    myData,
    // UTILITY METHODS
    check_date,
    check_time,

    complete_kb_update,                                                 // 监听其它用户的修改
    //autoRefetchfullCalendar,                                            // 自动更新 fullCalendar
    qunar, render_flight,                                               // 去哪儿
    updateItems,
    update_smObj,
    bindPageEvent,                                                      // 页面事件注册
    bindApplicationCacheEvent,                                          // 绑定离线缓存事件
    come_to_online,
    bindOnHashChangeEvent, onHashChange,                                // hash change
    bindBrowserIsOnlineEvent, changeIsonlineFromEvent,                  // 监听浏览器是否在线
    changeToPage,                                                       // 切换页面
    get_smResult,
    renderPageAs,
    msg_renderPage,
    getSmSetTimeType,
    sm_renderPage,
    // kb-login-page
    login_pageinit, 
    login_pageshow, loginBtn_on_click, checkUserFromServer, onLogined,
    // index
    index_pageinit,                                                     // 初始化 fullCalendar
    index_pageshow, set_online_span_text,
    getNextDate, gotoDateWithOnlineresults, 
    getDataObjWithOnlineresults,                                        // 获取服务器数据后转换
    getSetTime,                                                         // 计算集合时间
    addTongji,                                                          // 添加统计
    // kb-detail-page
    detail_pageinit, on_gotoInsurancePageBtn_tap,
    on_itemSelect_change, detail_pagebeforeshow,
    // kb-insurance-page
    insurance_pageinit, insurance_pagebeforeshow, insurance_pageshow,
    // kb-msg-page
    msg_pageinit, msg_pagebeforeshow, msg_pageshow,
    // kb-editdjpnote-page
    editdjpnote_pageinit, editdjpnote_pagebeforeshow,
    // kb-editservernote-page
    editservernote_pageinit, editservernote_pagebeforeshow,
    // kb-editflight-page
    editflight_pageinit, del_flight_gai_comp, editflight_pagebeforeshow,
    // kb-sm-page
    sm_pageinit, sm_pageshow,
    // kb-flight-page
    flight_pageinit, flight_pageshow,
    // kb-history-page
    history_pageinit, history_pagebeforeshow, updateHistorys,

    set_smObj,
    initModule,

    // 对外暴露的接口
    getConfigMap, getStateMap, getJqueryMap;

  // 保险
  pingan = (function (kb_configMap) {
    'use strict';
    //---------------- BEGIN MODULE SCOPE VARIABLES --------------
    var
      // 静态配置值
      configMap = {
        captchaData: [
          '111000111100000001100111001001111100001111100001111100001111100001111100001111100001111100100111001100000001111000111',
          '111000111100000111100000111111100111111100111111100111111100111111100111111100111111100111111100111100000000100000000',
          '100000111000000011011111001111111001111111001111110011111100111111001111110011111100111111001111111000000001000000001',
          '100000111000000001011111001111111001111110011100000111100000011111110001111111001111111001011110001000000011100000111',
          '111110011111100011111100011111000011110010011110010011100110011100110011000000000000000000111110011111110011111110011',
          '000000001000000001001111111001111111001111111000001111000000011111110001111111001111111001011110001000000011100000111',
          '111000011110000001100111101100111111001111111001000011000000001000111000001111100001111100100111000100000001111000011',
          '100000000100000000111111100111111101111111001111110011111110111111100111111101111111001111111001111110011111110011111',
          '110000011100000001100111001100111001100011011110000011110000011100110001001111100001111100000111000100000001110000011',
          '110000111100000001000111001001111100001111100000111000100000000110000100111111100111111001101111001100000011110000111'
        ],
        tr_err_html : String()
          + '<tr>'
            + '<td colspan="3">'
              + '<span class="tr_err_span" style="color:red;"></span>'
            + '</td>'
          + '</tr>',
        tr_second_html: String()
          + '<tr>'
            + '<td colspan="3">'
              + '<div class="input-group input-group-sm">'
                  + '<span class="zx-pingan-imgSpan input-group-addon" style="padding: 0;"></span>'
                  + '<input type="text" class="zx-pingan-imgInput form-control">'
                + '</div>'
            + '</td>'
          + '</tr>',
        tr_colspan_html: String()
          + '<tr>'
            + '<td colspan="3">'
              + '<span class="zx-pingan-td-errInfoSpan" style="color:red;"></span>'
              + '<input type="text" class="zx-pingan-td-nameInput form-control input-sm" placeholder="姓名">'
              + '<select class="zx-pingan-td-cardCategorySelect form-control input-sm">'
                + '<option>身份证</option>'
                + '<option>护照</option>'
                + '<option>港澳回乡证</option>'
                + '<option>台胞证</option>'
                + '<option>军官证</option>'
                + '<option>其它</option>'
                + '<option></option>'   
              + '</select>'
              + '<input type="text" class="zx-pingan-td-cardNumInput form-control input-sm" placeholder="证件号码">'
              + '<input type="text" class="zx-pingan-td-birthdayInput form-control input-sm hidden" placeholder="出生日期（可简写为：19880102）">'
              + '<select class="zx-pingan-td-sexInput form-control input-sm hidden">'
                + '<option>男</option>'
                + '<option>女</option>'
                + '<option></option>'
              + '</select>'
            +'</td>'
          + '</tr>',
        tr_html: String()
          + '<tr>'
            + '<td class="zx-pingan-snTd" style="width:15%;"></td>'
            + '<td class="zx-pingan-nameTd" style="width:30%; padding:8px 0;"></td>'
            + '<td class="zx-pingan-cardTd"></td>'
          + '</tr>'
      },
      stateMap = {
        smObj       : null,
        userObj     : null,
        cards       : null,
        sm_cards    : null,
        sm_cards_obj: null,
        batchArr    : null,
        zx_pingan_submit_on_taping: false
      },
      jqueryMap = {
        $personPhoneInput  : null, 
        $shortNumInput     : null,
        $insurance_main    : null,
        $nameCountSpan     : null,
        $cardCountSpan     : null, 
        $kb_pingan_tbody   : null,
        $zx_pingan_submit  : null
      },
      setCity,
      checkIdCardField,
      checkBirthday,
      checkSex,
      checkPhoneNum,
      
      //get_pingan_insurance,
      on_complete_Step_1_2_downloadImg,
      on_complete_Step_1_5_postData,
      getImageStr,
      decaptcha,

      popoDetailTd,
      // PUBLIC METHODS
      setJqueryMap,
      getJqueryMap, 
      renderPage,
      getStateMap,

      on_snTd_click,
      on_nameTd_click,
      on_nameInput_change,
      on_cardCategorySelect_change,
      on_cardNumInput_change,
      on_birthdayInput_change,
      on_sexInput_change,
      on_passwordInput_change,
      shortNumInput_on_change,
      zx_pingan_submit_on_tap,
      set_zx_pingan_submit_on_taping;
      //initModule, 
      //removeThis;

    configMap.server = kb_configMap.server;

    setCity = function (city) {
      stateMap.city = city;
    };

    // 检查身份证
    checkIdCardField = function (v_card) {
      var reg = /^\d{15}(\d{2}[0-9X])?$/i,
          n, y, birth, iW, iSum, cCheck,
          i, iC, iVal, iJYM, sJYM;

      if (!reg.test(v_card)) {
        return false;
      }
      if (v_card.length == 15) {
          
        return false;
      }
      if (v_card.length == 18) {
        n = new Date();
        y = n.getFullYear();
        if (parseInt(v_card.substr(6, 4)) < 1900 || parseInt(v_card.substr(6, 4)) > y) {
          return false;
        }
        birth = v_card.substr(6, 4) + "-" + v_card.substr(10, 2) + "-" + v_card.substr(12, 2);
        if (!isDate(birth)) {
          return false;
        }
        iW = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
        iSum = 0;
        for (i = 0; i < 17; i++) {
          iC = v_card.charAt(i);
          iVal = parseInt(iC);
          iSum += iVal * iW[i];
        }
        iJYM = iSum % 11;
        if (iJYM == 0) sJYM = "1";
        else if (iJYM == 1) sJYM = "0";
        else if (iJYM == 2) sJYM = "x";
        else if (iJYM == 3) sJYM = "9";
        else if (iJYM == 4) sJYM = "8";
        else if (iJYM == 5) sJYM = "7";
        else if (iJYM == 6) sJYM = "6";
        else if (iJYM == 7) sJYM = "5";
        else if (iJYM == 8) sJYM = "4";
        else if (iJYM == 9) sJYM = "3";
        else if (iJYM == 10) sJYM = "2";
        cCheck = v_card.charAt(17).toLowerCase();
        if (cCheck != sJYM) {
          return false;
        }
      }

      function isDate(date) {
          return (new Date(date).getDate() == date.substring(date.length - 2));
      }

      return true;
    };

    checkBirthday = function(date){
      var dateY, n, y,
        date_re = /^(\d{4})\-(\d{2})\-(\d{2})$/;

      if(date === ''){
        return false;
      }

      // 格式是不是正确
      if(!date_re.test(date)){
        return false;
      }

      dateY = new Date(date).getFullYear();
      n = new Date();
      y = n.getFullYear();

      if( dateY < y - 80 || dateY > y ){
        return false;
      }

      return (new Date(date).getDate()==date.substring(date.length-2));
    };

    checkSex = function(sex){
      
      if ( sex === '男' || sex === '女' ) {
        return true;
      }

      return false;
    };

    checkPhoneNum = function(phone){
      var phone_re = /^1\d{10}$/;

      if(phone_re.test(phone)){
        return true;
      }

      return false;
    };

    getImageStr = function(image) {
      var canvas = document.createElement("canvas").getContext('2d'),  // 新建一个canvas, 并获取2D上下文
        imageWidth  = 9,
          imageHeight = 13,
          imageStrs = [], 
          imageArr, imageStr,
        i, pixels, j, len_j;

      //console.log(image.width);
      canvas.drawImage(image, 0, 0);

      for(i = 0; i < 4; i++){
      // 获取到每个数字上的像素点
        pixels = canvas.getImageData(7 +　13 * i, 3, imageWidth, imageHeight).data;

        imageArr    = [];
        // 取四个值,分别是一个像素点的r,g,b,a值
        for (j = 0, len_j = pixels.length; j < len_j; j += 4) {
          imageArr.push(+(pixels[j] * 0.3 + pixels[j + 1] * 0.59 + pixels[j + 2] * 0.11 >= 128));
        }

        imageStr = imageArr.join('');
        imageStrs.push(decaptcha(imageStr));
      }

      return imageStrs.join('');
    };

    decaptcha = function(imageStr) {
      var captchaData = configMap.captchaData,
        iArr        = [], 
        i, k, result, iMin, errNum;

      for( i = 0; i < 10; i++ ) {
        errNum = 0;
        for(k = 0; k < 117;k++){
          if(imageStr[k] !== captchaData[i][k]){
            errNum++;
          }
        }

        iArr.push(errNum);
      }

      result = 0;
      iMin = iArr[0];
      for(i = 1; i < 10; i++){
        if(iArr[i] < iMin){
          iMin = iArr[i];
          result = i;
        }
      }

      return result;
    };

    on_complete_Step_1_5_postData = function(result) {
      // console.log(result);
      // return;

      var obj = result.obj;
      //console.log('result');
      if(result.ok === 1){
        var $tr = jqueryMap.$kb_pingan_tbody.find('tr.zx-pingan-tr-' + obj.sn),
          $nameTd = $tr.find('td.zx-pingan-nameTd'),
          $tr_glyphicon_refresh = $nameTd.find('span.glyphicon-refresh'),
          $cardTd, card_index, $tr_err;

        //$tr_glyphicon_refresh.remove();
        //console.log(obj);

        if(obj.success === 10){
          //console.log(obj);
          //$cardTd.append('<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>');
          $tr_glyphicon_refresh.removeClass('glyphicon-refresh').addClass('glyphicon-remove');
          $tr_err = $(configMap.tr_err_html);
          $tr_err.find('td').find('span.tr_err_span').text('验证码错误');
          $tr.after($tr_err);
        } else if (obj.success === 11){
          //$cardTd.append('<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>');
          $tr_glyphicon_refresh.removeClass('glyphicon-refresh').addClass('glyphicon-remove');
          $tr_err = $(configMap.tr_err_html);
          $tr_err.find('td').find('span.tr_err_span').text('该卡已经被使用');

          $cardTd = $tr.find('td.zx-pingan-cardTd');
          $cardTd.find('span.glyphicon-lock').removeClass('glyphicon-lock').addClass('glyphicon-remove');
          card_index = $cardTd.data('card_index');
          stateMap.cards.splice(card_index,1);

          $tr.after($tr_err);
        } else if (obj.success === 12) {
          //$cardTd.append('<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>');
          $tr_glyphicon_refresh.removeClass('glyphicon-refresh').addClass('glyphicon-remove');
          $tr_err = $(configMap.tr_err_html);
          $tr_err.find('td').find('span.tr_err_span').text('卡号不存在');

          $cardTd = $tr.find('td.zx-pingan-cardTd');
          $cardTd.find('span.glyphicon-lock').removeClass('glyphicon-lock').addClass('glyphicon-remove');
          card_index = $cardTd.data('card_index');
          stateMap.cards.splice(card_index,1);

          $tr.after($tr_err);
        } else if (obj.success === 13) {
          //$cardTd.append('<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>');
          $tr_glyphicon_refresh.removeClass('glyphicon-refresh').addClass('glyphicon-remove');
          $tr_err = $(configMap.tr_err_html);
          $tr_err
            .find('td')
              .find('span.tr_err_span').text('您填写的密码错误')
              .after(
                $('<input style="float:right;" type="text" class="zx-pingan-td-passwordInput">').val(obj.card.password));
          $tr.after($tr_err);
        } else if (obj.success === 19) {
          //$cardTd.append('<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>');
          $tr_glyphicon_refresh.removeClass('glyphicon-refresh').addClass('glyphicon-remove');
          $tr_err = $(configMap.tr_err_html);
          $tr_err.find('td').find('span.tr_err_span').text('第一屏未知错误');
          $tr.after($tr_err);
        } else if (obj.success === 21) {
          //$cardTd.append('<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>');
          $tr_glyphicon_refresh.removeClass('glyphicon-refresh').addClass('glyphicon-remove');
          $tr_err = $(configMap.tr_err_html);
          $tr_err.find('td').find('span.tr_err_span').text('英文姓名只能由大写英文字母和空格组成，且不能包含连续两个空格');
          $tr.after($tr_err);
        } else if (obj.success === 22) {
          //$cardTd.append('<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>');
          $tr_glyphicon_refresh.removeClass('glyphicon-refresh').addClass('glyphicon-remove');
          $tr_err = $(configMap.tr_err_html);
          $tr_err.find('td').find('span.tr_err_span').text('累计投保份数超过规定份数;请确认是否原购买的卡还未到期');
          $tr.after($tr_err);
        } else if (obj.success === 23) {
          //$cardTd.append('<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>');
          $tr_glyphicon_refresh.removeClass('glyphicon-refresh').addClass('glyphicon-remove');
          $tr_err = $(configMap.tr_err_html);
          $tr_err.find('td').find('span.tr_err_span').text('姓名只能由中文、半角大写英文字母及“.”组成，且不能有空格');
          $tr.after($tr_err);
        } else if (obj.success === 24) {
          $tr_glyphicon_refresh.removeClass('glyphicon-refresh').addClass('glyphicon-remove');
          $tr_err = $(configMap.tr_err_html);
          $tr_err.find('td').find('span.tr_err_span').text('保险期限的开始日期格式不正确，请重新填写！--找何苗');
          $tr.after($tr_err);
        } else if (obj.success === 25) {
          $tr_glyphicon_refresh.removeClass('glyphicon-refresh').addClass('glyphicon-remove');
          $tr_err = $(configMap.tr_err_html);
          $tr_err.find('td').find('span.tr_err_span').text('第二屏未知错误');
          $tr.after($tr_err);
        } else if (obj.success === 31) {
          //$cardTd.append('<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>');
          $tr_glyphicon_refresh.removeClass('glyphicon-refresh').addClass('glyphicon-remove');
          $tr_err = $(configMap.tr_err_html);
          $tr_err.find('td').find('span.tr_err_span').text('系统繁忙');
          $tr.after($tr_err);
        } else if (obj.success === 32) {
          //$cardTd.append('<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>');
          $tr_glyphicon_refresh.removeClass('glyphicon-refresh').addClass('glyphicon-remove');
          $tr_err = $(configMap.tr_err_html);
          $tr_err.find('td').find('span.tr_err_span').text('请您按照正确的投保流程进行投保');
          $tr.after($tr_err);
        } else if (obj.success === 39) {
          //$cardTd.append('<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>');
          $tr_glyphicon_refresh.removeClass('glyphicon-refresh').addClass('glyphicon-remove');
          $tr_err = $(configMap.tr_err_html);
          $tr_err.find('td').find('span.tr_err_span').text('第四屏未知错误');
          $tr.after($tr_err);
        } else if (obj.success === 99) {
          //$nameTd.find('span.glyphicon-ok').remove();
          //$nameTd.append('<span class="glyphicon glyphicon-plane" aria-hidden="true"></span>');
          $tr_glyphicon_refresh.removeClass('glyphicon-refresh').addClass('glyphicon-plane');
          $tr.css('color','#aaa');
        } else {
          $tr_glyphicon_refresh.removeClass('glyphicon-refresh').addClass('glyphicon-remove');
          $tr_err = $(configMap.tr_err_html);
          $tr_err.find('td').find('span.tr_err_span').text('未知错误');
          $tr.after($tr_err);
          console.log('未知错误');
        }
      } else {
        $.post(configMap.server + 'kanban_Step_1_2_downloadImg', {str: JSON.stringify(obj), city: stateMap.city}, on_complete_Step_1_2_downloadImg).error(function(e){
          console.log('下载验证码时网络异常！');
        });
      }
    };

    on_complete_Step_1_2_downloadImg = function(obj){
      var 
        date = moment().format('YYYYMMDDhhss'),
        $image, $tr_second, result;

      function convertImgToBase64(url, callback, outputFormat){
          var canvas = document.createElement('CANVAS'),
              ctx = canvas.getContext('2d'),
              img = new Image;
          img.crossOrigin = 'Anonymous';
          img.onload = function(){
              canvas.height = img.height;
              canvas.width = img.width;
              ctx.drawImage(img,0,0);
              var dataURL = canvas.toDataURL(outputFormat || 'image/png');
              callback.call(this, dataURL);
              canvas = null; 
          };
          img.src = url;
      }

      if(obj.success === 1){
        // base64
        convertImgToBase64(configMap.server + 'code/' + obj.userName + obj.ii + '.jpg?' + date, function(base64Img){
          // Base64DataURL
          // console.log(base64Img);
          //$tr = jqueryMap.$kb_pingan_tbody.find('tr.zx-pingan-tr-' + obj.sn);

          $image = $('<img id="zx-pingan-img" src="' + base64Img + '"/>');
          $tr_second = $(configMap.tr_second_html);
          $tr_second.find('.zx-pingan-imgSpan').html($image);

          $image.load(function(){  
            //console.log('$image.load');
            var PBK = '00a3acc5de564f3fcd9f3b3f7e9d44a4cb082a8d4706256ec989aba3619ec961e4c09544d5478b82d33d263addd450aa5d13d666ba3a57ca0173672da826d6d1e79aaf36065eb390f1a5d48d0132dcc6f19ce0543f4b23113f356db0765b077e3172928b0bc32a03ec2ac4757a0955c1437dc8a33b9f0f59dfd2cbc75911bdb217';
            var cardpwd;

            result = getImageStr($image[0]);
            $tr_second.find('.zx-pingan-imgInput').val(result);
            obj.codeNum = result;
            obj.card.password = RSA.encrypt({
              key: PBK,
              input: obj.card.password,
            });

            // console.log(obj.card.password);

            // {
            //   city: 'sz',
            //   {
            //     "tryCount":0,
            //     "ii":0,
            //     "userName":"hemiao",
            //     "sn":1,
            //     "phone":"13928720240",
            //     "person":{
            //       "name":"何苗",
            //       "cardNum":"432322197706060039",
            //       "phone":"13928720240",
            //       "birthday":"1977-06-06",
            //       "sex":"男",
            //       "cardCategory":"身份证",
            //       "age":39,
            //       "ageType":"成人",
            //       "room":"",
            //       "teamPersonNote":"",
            //       "sendPersonNote":"",
            //       "meetPersonNote":"",
            //       "_id":"57c019ac723d4d0f001bf9ca",
            //       "isMeet":true,
            //       "isSend":true
            //     },
            //     "card":{
            //       "_id":"57bc292794224154004d05a3",
            //       "pinganCardNum":"0113656000097501",
            //       "password":"116016",
            //       "serverMan":"沈斌",
            //       "isLock":true
            //     },
            //     "sm":"57c017f777aa480f00ba7096",
            //     "cookies":[
            //       "WLS_HTTP_BRIDGE_SICS=3vStXQsLsDrQfk92yK1GTMlv1H273vymYy56PZ4MQtsq2b6QjlTr!-982644605",
            //       "BIGipServerSICS_PrdPool=1074011308.17231.0000",
            //       "WLS_HTTP_BRIDGE_SICS=KnGJXQsLHlvTvKs0xxmCPFh9jvYLQKK27p4Gyx741RZhbbl189JT!-1857158263"
            //     ],
            //     "success":1,
            //     "codeNum":"5330"
            //   }
            // }

            // console.log({str: JSON.stringify(obj), city: stateMap.city});

            $.post(configMap.server + 'kanban_Step_1_5_postData', {str: JSON.stringify(obj), city: stateMap.city}, on_complete_Step_1_5_postData).error(function(e){
              console.log('POST验证码时网络异常！');
            });
          });

          //$tr.after($tr_second);
        });
      }
    };

    // 点击序号单元格
    on_snTd_click = function() {
      var 
        $that = $(this),
        $tr   = $that.parent(),
        $nameTd,
        person_item,
        batch_item,
        person;

      // 如果是展开状态收起
      if($tr.next().length > 0 && $tr.next().children().length === 1){
        $tr.next().remove();
        return;
      }

      $nameTd = $that.next();
      person_item = $nameTd.data('person');
      batch_item = $tr.data('batch');
      person = stateMap['batchArr'][batch_item]['persons'][person_item];

      popoDetailTd({
        errMsg : '',
        person : person,
        $tr    : $tr
      });
    };

    popoDetailTd = function(obj){
      var $tr_colspan = $(configMap.tr_colspan_html);

      $tr_colspan.data('person', obj.person);

      $tr_colspan.find('.zx-pingan-td-errInfoSpan').text(obj.errMsg);
      $tr_colspan.find('.zx-pingan-td-nameInput').val(obj.person.name);
      $tr_colspan.find('.zx-pingan-td-cardCategorySelect').val(obj.person.cardCategory);
      $tr_colspan.find('.zx-pingan-td-cardNumInput').val(obj.person.cardNum);
      if(obj.person.cardCategory !== '身份证'){
        $tr_colspan.find('.zx-pingan-td-birthdayInput')
          .val(obj.person.birthday)
          .removeClass('hidden');
        $tr_colspan.find('.zx-pingan-td-sexInput')
          .val(obj.person.sex)
          .removeClass('hidden');
      }
      obj.$tr.after($tr_colspan);
    };

    // 点击姓名单元格
    on_nameTd_click = function(){
      var 
        $that        = $(this),
        $tr          = $that.parent(),
        phoneNumber  = $that.data('phone'),
        $glyphiconOk = $that.find('span.glyphicon-ok'),
        $cardTd, $cardTd_remove, card,
        person_item,
        batch_item,
        person;

      // 如果已经开过保险了,点击无效
      if($tr.find('span.glyphicon-plane').length > 0){
        return;
      }

      // 如果是展开状态收起
      if($tr.next().length > 0 && $tr.next().children().length === 1){
        $cardTd = $tr.find('td.zx-pingan-cardTd');
        $cardTd_remove = $cardTd.find('span.glyphicon-remove');
        if($cardTd_remove.length === 0){
          $that.find('span.glyphicon-remove').removeClass('glyphicon-remove').addClass('glyphicon-ok');
        } else {
          addNameCountSpan(-1);
          $that.find('span.glyphicon-remove').remove();
          $cardTd.html('');
        }
        
        $tr.next().remove();
        return;
      }

      // 切换选择
      if($glyphiconOk.length > 0){
        $glyphiconOk.remove();
        // 已选择人数 -1
        addNameCountSpan(-1);
        // 剩余保险卡数 +1
        addCardCountSpan(1);
        // 对应保险卡单元格清空
        $cardTd = $tr.find('.zx-pingan-cardTd');
        card    = $cardTd.data('card');
        card.isLock = false;
        $cardTd
          .removeData('card')
          .text('');
        // 分配保险卡
        sendpinganCardNum();

        return;
      }

      // 如果有手机号, 填充手机
      if (phoneNumber !== undefined ) {
        jqueryMap.$personPhoneInput.val(phoneNumber);
      }

      // 看剩余卡够不够
      if(!checkCardCountSpan()){
        alert('大哥。。。没保险卡了');
        return;
      }

      person_item = $that.data('person');
      batch_item = $tr.data('batch');
      person = stateMap.batchArr[batch_item].persons[person_item];
      //console.log(person);
      // 检查person的信息是否齐全
      // 检查姓名
      if(person.name === ''){
        // 弹出详情页 1
        popoDetailTd({
          errMsg : '姓名不能为空',
          person : person,
          $tr    : $tr
        });
        return;
      }

      // 检查证件类型
      if(person.cardCategory === ''){
        // 弹出详情页 2
        popoDetailTd({
          errMsg : '证件类型不能为空',
          person : person,
          $tr    : $tr
        });
        return;
      }

      if(person.cardCategory === '身份证'){
        // 检查身份证
        if(checkIdCardField(person.cardNum)){
          // 身份证检查通过
          //person.isInsurance = true;
        
          $that.append('<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>');
          // 已选择人数 +1
          addNameCountSpan(1);
          // 剩余保险卡数 -1
          addCardCountSpan(-1);
          // 分配保险卡
          sendpinganCardNum();

        } else {
          // 弹出详情页 3
          popoDetailTd({
            errMsg : '身份证号码检查不通过',
            person : person,
            $tr    : $tr
          });
        }

        return;
      }

      // 其它证件类型
      // 检查证件号码
      if(person.cardNum === ''){
        // 弹出详情页 4
        popoDetailTd({
          errMsg : '证件号码不能为空',
          person : person,
          $tr    : $tr
        });
        return;
      }

      // 检查出生日期
      if(!checkBirthday(person.birthday)){
        // 弹出详情页 5
        popoDetailTd({
          errMsg : '出生日期检查不通过',
          person : person,
          $tr    : $tr
        });
        return;
      }

      // 检查性别
      if(!checkSex(person.sex)){
        // 弹出详情页 6
        popoDetailTd({
          errMsg : '性别检查不通过',
          person : person,
          $tr    : $tr
        });
        return;
      }

      // 其它证件检查通过
      //person.isInsurance = true;
      $that.append('<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>');
      // 已选择人数 +1
      addNameCountSpan(1);
      // 剩余保险卡数 -1
      addCardCountSpan(-1);
      // 分配保险卡
      sendpinganCardNum();

      function addNameCountSpan(m){
        var sum =  Number(jqueryMap.$nameCountSpan.text());

        jqueryMap.$nameCountSpan.text(sum + m);
      };

      function addCardCountSpan(m){
        var sum =  Number(jqueryMap.$cardCountSpan.text());

        jqueryMap.$cardCountSpan.text(sum + m);
      };

      function checkCardCountSpan(){
        var num =  Number(jqueryMap.$cardCountSpan.text());
        if(num > 0){
          return true;
        }

        return false;
      };

      function sendpinganCardNum(){
        var 
          $glyphiconOks = jqueryMap.$kb_pingan_tbody.find('span.glyphicon-ok'),
          kkStart       = jqueryMap.$shortNumInput.data('item_index'),
          ii, len_ii, $cardTd,
          kk, len_kk;
        //console.log(kkStart);
        for(ii = 0, len_ii = $glyphiconOks.length; ii < len_ii; ii++){
          $cardTd = $glyphiconOks.eq(ii).closest('tr').find('.zx-pingan-cardTd');
          for(kk = kkStart, len_kk = stateMap.cards.length; kk < len_kk; kk ++){
            kkStart++;
            if(!stateMap.cards[kk].isLock) {
              $cardTd
                .data('card', stateMap.cards[kk])
                .data('card_index', kk)
                .text(stateMap.cards[kk].pinganCardNum);
              break;
            }
          }
        }
      };
    };

    // 姓名输入框
    on_nameInput_change = function(){
      var 
        $that   = $(this),
        name    = $that.val().trim(),
        $tr     = $that.closest('tr'),
        $tr_pre = $tr.prev(),
        person  = $tr.data('person');

      person.name = name;
      $tr_pre.find('.zx-pingan-nameTd').text(name);
    };

    // 证件类型
    on_cardCategorySelect_change = function(){
      var 
        $that          = $(this),
        cardCategory   = $that.val().trim(),
        $tr            = $that.closest('tr'),
        $tr_pre        = $tr.prev(),
        person         = $tr.data('person'),
        $birthdayInput = $tr.find('.zx-pingan-td-birthdayInput'),
        $sexInput      = $tr.find('.zx-pingan-td-sexInput');
      
      person.cardCategory = cardCategory;

      if(cardCategory === '身份证'){
        $birthdayInput.addClass('hidden');
        $sexInput.addClass('hidden');
      } else {
        $birthdayInput
          .val(person.birthday)
          .removeClass('hidden');
        $sexInput
          .val(person.sex)
          .removeClass('hidden');
      }
    };

    // 证件号码
    on_cardNumInput_change = function(){
      var 
        $that   = $(this),
        cardNum = $that.val().trim(),
        $tr     = $that.closest('tr'),
        $tr_pre = $tr.prev(),
        person  = $tr.data('person');
      
      person.cardNum = cardNum;
    };

    // 出生日期
    on_birthdayInput_change = function(){
      var 
        $that    = $(this),
        birthday = $that.val().trim(),
        $tr      = $that.closest('tr'),
        $tr_pre  = $tr.prev(),
        person   = $tr.data('person');
      
      if(birthday.length === 8){
        birthday = birthday.substr(0,4) + '-' + birthday.substr(4,2) + '-' + birthday.substr(6,2);
      }

      person.birthday = birthday;
    };

    // 性别
    on_sexInput_change = function(){
      var 
        $that   = $(this),
        sex     = $that.val().trim(),
        $tr     = $that.closest('tr'),
        $tr_pre = $tr.prev(),
        person  = $tr.data('person');
      
      person.sex = sex;
    };

    // 保险卡密码
    on_passwordInput_change = function(){
      var 
        $that       = $(this),
        password    = $that.val().trim(),
        $tr         = $that.closest('tr'),
        $tr_pre     = $tr.prev(),
        $cardTd     = $tr_pre.find('.zx-pingan-cardTd'), 
        card        = $cardTd.data('card');

      card.password = password;
      //console.log(card);
    };

    shortNumInput_on_change = function(){
      var $that = $(this),
        shortNum = $that.val().trim(),
        item_index = -1,
        i, len, shortPinganCardNum;

      if(shortNum === ''){
        item_index = 0;
      }

      for(i = 0, len = stateMap.cards.length; i < len; i++){
        shortPinganCardNum = stateMap.cards[i].pinganCardNum.substr((16-shortNum.length),shortNum.length);
        if(shortPinganCardNum === shortNum){
          item_index = i;
          break;
        }
      }

      if(item_index === -1){
        alert('出错: 没找到这个尾号的卡');
        item_index = 0;
      }

      $that.data('item_index', item_index);
      
      countCardCountSpan();

      //console.log(item_index);

      function countCardCountSpan(){
        var count = 0,
          checkOkCount = jqueryMap.$kb_pingan_tbody.find('span.glyphicon-ok').length,
          i, len;
        for(i = item_index, len = stateMap.cards.length; i < len; i++){
          if(!stateMap.cards[i].isLock) {
            count++;
          }
        }

        jqueryMap.$cardCountSpan.text(count - checkOkCount);
      }
    };

    setJqueryMap = function() {
     //------------------- BEGIN PUBLIC METHODS -------------------
      jqueryMap.$personPhoneInput= $('#person_phone');
      jqueryMap.$shortNumInput   = $('#shortNumInput');
      jqueryMap.$nameCountSpan   = $('#nameCountSpan');
      jqueryMap.$insurance_main  = $('#insurance-main');
      jqueryMap.$cardCountSpan   = $('#cardCountSpan');
      jqueryMap.$kb_pingan_tbody = $('#kb-pingan-tbody');
      jqueryMap.$zx_pingan_submit= $('#zx-pingan-submit');
    };

    getJqueryMap = function() {
      return jqueryMap;
    };

    renderPage = function(obj) {
      //console.log(obj);
      var 
          batchArr     = [],
          sm_cards_obj = {},
          team         = obj.team,
          sn           = 1,
          userArr_t, i_ut, userObj_t,
          batchArr_t, i_bt, batchObj_t,
          personArr_t, i_pt, personObj_t,
          i, len_i, batch,
          k, len_k, person,
          $tr;

      stateMap.smObj    = obj.smObj,
      stateMap.userObj  = obj.userObj,
      stateMap.cards    = obj.cards;
      stateMap.sm_cards = obj.sm_cards;

      userArr_t = team.users;

      for( i_ut = 0; i_ut < userArr_t.length; i_ut++ ) {
        userObj_t = userArr_t[i_ut];
        batchArr_t = userObj_t.batchs;

        for( i_bt = 0; i_bt < batchArr_t.length; i_bt++ ) {
          batchObj_t = batchArr_t[i_bt];
          if(( batchObj_t.departureTraffic._id === stateMap.smObj.id && batchObj_t.departureTraffic.isSm === true ) 
            || ( batchObj_t.returnTraffic._id === stateMap.smObj.id && batchObj_t.returnTraffic.isSm ===true )){

            personArr_t = batchObj_t.persons;

            for( i_pt = personArr_t.length - 1; i_pt > -1; i_pt-- ) {
              personObj_t = personArr_t[i_pt];
              if(!personObj_t.isSend){
                personArr_t.splice(i_pt, 1);
              }
            }

            batchArr.push(batchObj_t);
          }
        }
      }

      //console.log(batchArr);
      stateMap.batchArr = batchArr;

      for(i = 0, len_i = stateMap.sm_cards.length; i < len_i; i++){
        sm_cards_obj[stateMap.sm_cards[i].cardNum] = stateMap.sm_cards[i].pinganCardNum;
      }
      //console.log(sm_cards_obj);
      stateMap.sm_cards_obj = sm_cards_obj;

      // 初始化数据
      jqueryMap.$nameCountSpan.text('0');
      jqueryMap.$cardCountSpan.text(stateMap.cards.length);
      jqueryMap.$shortNumInput.data('item_index',0);

      jqueryMap.$kb_pingan_tbody.empty();
      for(i = 0, len_i = stateMap.batchArr.length; i < len_i; i++){
        batch = stateMap.batchArr[i];
        for(k = 0, len_k = batch.persons.length; k < len_k; k++){
          person = batch.persons[k];
          $tr = $(configMap.tr_html);
          $tr
            .data('batch',i)
            .data('sn',sn)
            .addClass('zx-pingan-tr-' + sn);

          if(i % 2 === 0){
            $tr.addClass('info');
          }

          $tr.children().eq(0).text(sn);

          $tr.children().eq(1)
            .data('person',k)
            .text(person.name);

          if(person.phone !== ""){
            $tr.children().eq(1)
              .data('phone',person.phone)
              .append('<span class="glyphicon glyphicon-phone" aria-hidden="true"></span>');
          }

          if(sm_cards_obj[person.cardNum]){
            $tr.css('color','#aaa');
            $tr.children().eq(2).text(sm_cards_obj[person.cardNum]);
            $tr.children().eq(1).append('<span class="glyphicon glyphicon-plane" aria-hidden="true"></span>');
          }
          //console.log($tr);
          jqueryMap.$kb_pingan_tbody.append($tr);
          //console.log(jqueryMap.$kb_pingan_tbody.find('tr').length);
          sn++;
        }
      }

      jqueryMap.$insurance_main.show();
      $.mobile.loading('hide');

      /*// 初始化 jqueryMap
      jqueryMap.$insuranceBtn           = $('#insuranceBtn');
      jqueryMap.$insuranceDiv           = $('#insuranceDiv');
      jqueryMap.$zx_pingan_submit       = $('#zx-pingan-submit');
      jqueryMap.$personPhoneInput       = $('#person_phone');
      jqueryMap.$close_insuranceDiv_btn = $('#close-insuranceDiv-btn');
      jqueryMap.$nameCountSpan          = $('#nameCountSpan');
      jqueryMap.$cardCountSpan          = $('#cardCountSpan');
      jqueryMap.$shortNumInput          = $('#shortNum');
      jqueryMap.$kb_pingan_tbody                  = $('#kb-pingan-tbody');
      //console.log(jqueryMap.$kb_pingan_tbody.length);
      // 界面初始化
      jqueryMap.$insuranceBtn.hide();
      jqueryMap.$insuranceDiv.show();

      // 初始化数据 
      jqueryMap.$cardCountSpan.text(stateMap.cards.length);
      jqueryMap.$shortNumInput.data('item_index',0);
      //console.log(stateMap.batchArr);
      for(i = 0, len_i = stateMap.batchArr.length; i < len_i; i++){
        batch = stateMap.batchArr[i];
        for(k = 0, len_k = batch.persons.length; k < len_k; k++){
          person = batch.persons[k];
          $tr = $(configMap.tr_html);
          $tr
            .data('batch',i)
            .data('sn',sn)
            .addClass('zx-pingan-tr-' + sn);

          if(i % 2 === 0){
            $tr.addClass('info');
          }

          $tr.children().eq(0).text(sn);

          $tr.children().eq(1)
            .data('person',k)
            .text(person.name);

          if(person.phone !== ""){
            $tr.children().eq(1)
              .data('phone',person.phone)
              .append('<span class="glyphicon glyphicon-phone" aria-hidden="true"></span>');
          }

          if(sm_cards_obj[person.cardNum]){
            $tr.css('color','#aaa');
            $tr.children().eq(2).text(sm_cards_obj[person.cardNum]);
            $tr.children().eq(1).append('<span class="glyphicon glyphicon-plane" aria-hidden="true"></span>');
          }
          //console.log($tr);
          jqueryMap.$kb_pingan_tbody.append($tr);
          //console.log(jqueryMap.$kb_pingan_tbody.find('tr').length);
          sn++;
        }
      }

      jqueryMap.$insuranceDiv.fixedDiv('fix-div');
      // 注册事件
      jqueryMap.$close_insuranceDiv_btn.on('tap', function(e) {
        removeThis();
        e.stopPropagation();
      });
      
      jqueryMap.$kb_pingan_tbody
        // 点击序号单元格
        .on('tap','.zx-pingan-snTd', on_snTd_click)
        // 点击姓名单元格
        .on('tap','.zx-pingan-nameTd', on_nameTd_click)
        // 姓名输入框
        .on('change','.zx-pingan-td-nameInput', on_nameInput_change)
        // 证件类型
        .on('change','.zx-pingan-td-cardCategorySelect', on_cardCategorySelect_change)
        // 证件号码
        .on('change','.zx-pingan-td-cardNumInput', on_cardNumInput_change)
        // 出生日期
        .on('change','.zx-pingan-td-birthdayInput', on_birthdayInput_change)
        // 性别
        .on('change','.zx-pingan-td-sexInput', on_sexInput_change)
        // 保险卡密码
        .on('change','.zx-pingan-td-passwordInput', on_passwordInput_change);

      // 开保险
      jqueryMap.$zx_pingan_submit.on('tap', on_submit_click);*/

      //jqueryMap.$shortNumInput.on('change', shortNumInput_on_change);
      /*jqueryMap.$shortNumInput.on('change', function(){
        var $that = $(this),
          shortNum = $that.val().trim(),
          item_index = -1,
          i, len, shortPinganCardNum;

        if(shortNum === ''){
          item_index = 0;
        }

        for(i = 0, len = stateMap.cards.length; i < len; i++){
          shortPinganCardNum = stateMap.cards[i].pinganCardNum.substr((16-shortNum.length),shortNum.length);
          if(shortPinganCardNum === shortNum){
            item_index = i;
            break;
          }
        }

        if(item_index === -1){
          alert('出错: 没找到这个尾号的卡');
          item_index = 0;
        }

        $that.data('item_index', item_index);
        
        countCardCountSpan();

        //console.log(item_index);

        function countCardCountSpan(){
          var count = 0,
            checkOkCount = jqueryMap.$kb_pingan_tbody.find('span.glyphicon-ok').length,
            i, len;
          for(i = item_index, len = stateMap.cards.length; i < len; i++){
            if(!stateMap.cards[i].isLock) {
              count++;
            }
          }

          jqueryMap.$cardCountSpan.text(count - checkOkCount);
        }
      });*/
    };

    zx_pingan_submit_on_tap = function() {
      var 
        //$that = $(this),
        phone = jqueryMap.$personPhoneInput.val(),
        $glyphiconOks, $nameTd, $tr, person_item, batch_item,
        ii, len_ii, $cardTd, 
        person, card,
        insuranceObj;

      stateMap.zx_pingan_submit_on_taping = true;
      //$that.prop( 'disabled', true );
      // 检查手机号码
      if(!checkPhoneNum(phone)){
        console.log('手机号码检查不通过');
        alert('手机号码检查不通过');
        stateMap.zx_pingan_submit_on_taping = false;
        //$that.prop( 'disabled', false );
        return;
      }

      // 需要开保险的数组
      $glyphiconOks = jqueryMap.$kb_pingan_tbody.find('span.glyphicon-ok');

      // 检查开保险的数组是否为空
      if($glyphiconOks.length === 0){
        alert('请选择要开保险的客人');
        stateMap.zx_pingan_submit_on_taping = false;
        //$that.prop( 'disabled', false );
        return;
      }

      for(ii = 0, len_ii = $glyphiconOks.length; ii < len_ii; ii++){
        $nameTd     = $glyphiconOks.eq(ii).closest('td');
        $tr         = $nameTd.closest('tr');
        $cardTd     = $tr.find('.zx-pingan-cardTd');

        $nameTd.find('span.glyphicon-ok').removeClass('glyphicon-ok').addClass('glyphicon-refresh');
        person_item = $nameTd.data('person');
        batch_item  = $tr.data('batch');

        person      = stateMap['batchArr'][batch_item]['persons'][person_item];
        card        = $cardTd.data('card');
        // 锁定 card
        if($cardTd.find('span.glyphicon-lock').length === 0){
          $cardTd.append('<span class="glyphicon glyphicon-lock" aria-hidden="true"></span>');
        }
        card.isLock = true;

        insuranceObj = {
          tryCount : 0,
          ii       : ii,
          userName : stateMap.userObj.userName,
          sn       : $tr.data('sn'),
          phone    : phone,
          person   : person,
          card     : card,
          sm       : stateMap.smObj.id
        };

        // {
        //   str: {
        //     tryCount: 0,
        //     "ii":0,
        //     "userName":"hemiao",
        //     "sn":1,
        //     "phone":"13928720240",
        //     "person":{
        //       "name":"何苗",
        //       "cardNum":"432322197706060039",
        //       "phone":"13928720240",
        //       "birthday":"1977-06-06",
        //       "sex":"男",
        //       "cardCategory":"身份证",
        //       "age":39,
        //       "ageType":"成人",
        //       "room":"",
        //       "teamPersonNote":"",
        //       "sendPersonNote":"",
        //       "meetPersonNote":"",
        //       "_id":"57c019ac723d4d0f001bf9ca",
        //       "isMeet":true,
        //       "isSend":true
        //     },
        //     "card":{
        //       "_id":"57bc292794224154004d05a3",
        //       "pinganCardNum":"0113656000097501",
        //       "password":"116016",
        //       "serverMan":"沈斌",
        //       "isLock":true
        //     },
        //     "sm":"57c017f777aa480f00ba7096"
        //   },
        //   city: 'sz'
        // }
        $.post(configMap.server + 'kanban_Step_1_2_downloadImg', {str: JSON.stringify(insuranceObj), city: stateMap.city}, on_complete_Step_1_2_downloadImg).error(function(e){
          console.log('下载验证码时网络异常！');
        });

        jqueryMap.$personPhoneInput.val('');
      }

      // 按钮状态
      stateMap.zx_pingan_submit_on_taping = false;
      //$that.prop( 'disabled', false );
    };

    getStateMap = function() {
      return stateMap;
    };

    set_zx_pingan_submit_on_taping = function(bool) {
      stateMap.zx_pingan_submit_on_taping = bool;
    };

    // return public methods
    return {
      setCity                       : setCity,
      setJqueryMap                  : setJqueryMap,
      getJqueryMap                  : getJqueryMap,
      renderPage                    : renderPage,
      getStateMap                   : getStateMap,
      on_snTd_click                 : on_snTd_click,
      on_nameTd_click               : on_nameTd_click,
      on_nameInput_change           : on_nameInput_change,
      on_cardCategorySelect_change  : on_cardCategorySelect_change,
      on_cardNumInput_change        : on_cardNumInput_change,
      on_birthdayInput_change       : on_birthdayInput_change,
      on_sexInput_change            : on_sexInput_change,
      on_passwordInput_change       : on_passwordInput_change,
      shortNumInput_on_change       : shortNumInput_on_change,
      zx_pingan_submit_on_tap       : zx_pingan_submit_on_tap,
      set_zx_pingan_submit_on_taping: set_zx_pingan_submit_on_taping
      //initModule  : initModule,
      //removeThis  : removeThis
    };
    //----------------- END MODULE SCOPE VARIABLES ---------------
  }(configMap));
  
  // data
  myData = (function () {
    'use strict';
    var
      stateMap = { sio : null },
      makeSio, getSio, initModule;

    makeSio = function (){
      var socket = io.connect(configMap.server);

      return {
        emit : function ( event_name, data ) {
          socket.emit( event_name, data );
        },
        on   : function ( event_name, callback ) {
          socket.on( event_name, function (){
            callback( arguments );
          });
        }
      };
    };

    getSio = function (){
      if ( ! stateMap.sio ) { stateMap.sio = makeSio(); }
      return stateMap.sio;
    };

    initModule = function (){};

    return {
      getSio     : getSio,
      initModule : initModule
    };
  }());

  // UTILITY METHODS 中的函数不和页面元素互交
  check_date = function(date) {
    var date_re = /^(\d{4})\-(\d{2})\-(\d{2})$/;

    if(date === ''){
      return false;
    }

    // 格式是不是正确
    if(!date_re.test(date)){
      return false;
    }

    return (new Date(date).getDate()==date.substring(date.length-2));
  };
  check_time = function(time) {
    var time_re = /^(\d{2})\:(\d{2})$/,
        time_arr;

    if(time === ''){
      return false;
    }

    // 格式是不是正确
    if(!time_re.test(time)){
      return false;
    }

    time_arr = time.split(':');

    if(Number(time_arr[0]) > 23 || Number(time_arr[1]) > 59){
      return false;
    }

    return true;
  };

  // 监听其它用户的修改
  complete_kb_update = function(results) {
    var emit_kb_obj = results[0],
        id          = emit_kb_obj.id,
        route       = emit_kb_obj.route,
        i, len, item,
        type, val,
        flightObj;

    //console.log(emit_kb_obj);
    for(i = 0, len = stateMap.events.length; i < len; i++) {
      item = stateMap.events[i];
      //console.log(item.id);
      if(item.id === id) {
        if (route === 1) {
          type = emit_kb_obj.type;
          val = emit_kb_obj.val;
          item[type] = val;
          if(emit_kb_obj.type === 'serverState'){
            if(emit_kb_obj.val === '完成') {
              item.backgroundColor = '#77B5D3';
              item.djpState = '全部OK';
            } else {
              item.backgroundColor = '#3a87ad';
            }
          }
        } else if (route === 2) {
          item.flight_gai = emit_kb_obj.flight_gai;
          item.flight     = emit_kb_obj.flight;

          if(item.smType1 === 2) {
            item.start = getSetTime(emit_kb_obj.flight.flightEndTime, item.smTimeSpace);
          } else {
            item.start = getSetTime(emit_kb_obj.flight.flightStartTime, item.smTimeSpace);
          } 
        } else if (route === 3) {
          type = emit_kb_obj.type;
          val = emit_kb_obj.val;
          
          if(item[type] === emit_kb_obj.val) {
            return false;
          }

          item[type] = val;

          flightObj = JSON.parse(emit_kb_obj.flightObj);
          stateMap.flightsObj[flightObj.id] = flightObj;
        } else if (route === 4) {
          delete item.flight_gai;
          item.flight = emit_kb_obj.flight;
          if(item.smType1 === 2) {
            item.start = getSetTime(emit_kb_obj.flight.flightEndTime, item.smTimeSpace);
          } else {
            item.start = getSetTime(emit_kb_obj.flight.flightStartTime, item.smTimeSpace);
          }
          //item.start = emit_kb_obj.start;
          //item.backgroundColor = '#3a87ad';
        } else if (route === 5) {
          item.flight     = emit_kb_obj.flight;

          if(item.smType1 === 2) {
            item.start = getSetTime(emit_kb_obj.flight.flightEndTime, item.smTimeSpace);
          } else {
            item.start = getSetTime(emit_kb_obj.flight.flightStartTime, item.smTimeSpace);
          } 
        }

        item.historys = emit_kb_obj.historys;
        item.isHasNews = true;
        // 本地储存
        if (localStorage){
          localStorage.setItem('events', JSON.stringify(stateMap.events));
        }

        // 自动更新
        addTongji();
        jqueryMap.$kb_list.fullCalendar('refetchEvents');
        break;
      }
    }
  };

  // 去哪儿
  qunar = function(smObj) {
    var
      flightNo  = smObj.flight.flightNum,
      startDate = moment(smObj.flight.flightDate).format('YYYY-MM-DD'),
      on_kanban_qunar, flightObj;

    on_kanban_qunar = function(result) {
      var
        obj = {}, 
        flightStatus, flyingStatusClass;

      if(result.success === 1) {

        flightObj = {
          result   : result,
          name     : stateMap.userObj.name,
          createAt : moment(),
          id       : smObj.id
        };

        // 保存到内存
        //stateMap.flightsObj[smObj.id] = flightObj;

        // 渲染页面
        flightStatus = render_flight(flightObj);

        switch (flightStatus) {
          case '正常': // 计划
            //$flying.css('background', '#777');    // default      info #5bc0de
            flyingStatusClass = 'default';
            break;
          /*case 1: // 在途
            progress = (data.active_info.passed_voyage / data.active_info.total_voyage).toFixed(2) * 273;
            $progress.width(progress);
            $plane.show();
            $flying.css('background', '#5cb85c'); // success
            flyingStatusClass = 'success';
            break;*/
          case '到达': // 到达
            /*$progress.width(273);
            $plane.show();
            $flying.css('background', '#5cb85c'); // success*/
            flyingStatusClass = 'success';
            break;
          case '延误': // 延误
            //$flying.css('background', '#f0ad4e'); // warning
            flyingStatusClass = 'warning';
            break;
          case '取消': // 取消
            //$flying.css('background', '#d9534f'); // danger
            flyingStatusClass = 'danger';
            break;
          case '起飞': // 起飞
            //$flying.css('background', '#5cb85c'); // success
            flyingStatusClass = 'success';
            break;
          /*case 7: // 经停
            $flying.css('background', '#f0ad4e'); // warning
            progress = (data.active_info.passed_voyage / data.active_info.total_voyage).toFixed(2) * 273;
            $progress.width(progress);
            flyingStatusClass = 'warning';
            break;*/
          default:
            flyingStatusClass = 'warning';
        }

        // 更新列表状态 改航班动态看板颜色
        // 改航班动态看板颜色
        if (!(smObj.flyingStatusClass && smObj.flyingStatusClass === flyingStatusClass)) {

          // 保存服务器
          obj.name      = stateMap.userObj.name;
          obj.sm        = smObj.id;
          obj.elementId = 'flyingStatusClass';
          obj.type      = 'flyingStatusClass';
          obj.val       = flyingStatusClass;
          obj.flightObj = JSON.stringify(flightObj);

          obj.city = stateMap.city;
          $.post(configMap.server + 'kanban_update', obj, updateItems).error(function(e){
            console.log('改航班动态看板颜色, 网络异常！');
          });
        }

      } else {
        console.log('服务器无响应！获取航班信息失败。');
      }
    };
    
    // 异步加载去哪儿数据, 通过服务器
    // jqueryMap.$flight_panel.text('获取航班信息中...');
    $.post(
      configMap.server + 'kanban_qunar', 
      {
        flightNo : flightNo,
        startDate: startDate
      }, 
      on_kanban_qunar
    ).error(function(e){
      console.log('网络异常！获取航班信息失败。');
    });
  };
  render_flight = function (flightObj) {
    var flight_html1, flight_hr, flight_html2, finf1, finf2,
        foot_info_html,
        flightStatus,

        render_flight_html;

    render_flight_html = function (finf) {
      var 
        depCityTempImage_html = '',
        arrCityTempImage_html = '';

      if(finf.depCityTempImageUrl1 !== '') {
        depCityTempImage_html = '<img class="qn_vmiddle" src="http://simg1.qunarzz.com/site/images/wap/weather/mflight/32/' + finf.depCityTempImageUrl1.substr(-9) + '" width="16" height="16">';
      }

      if(finf.arrCityTempImageUrl1 !== '') {
        arrCityTempImage_html = '<img class="qn_vmiddle" src="http://simg1.qunarzz.com/site/images/wap/weather/mflight/32/' + finf.arrCityTempImageUrl1.substr(-9) + '" width="16" height="16">';
      }

      return String()
        + '<div>' + finf.before_desc + '</div>'
        + '<div class="flightinfo">'
          + '<div class="flightinfo_main">'
            + '<div class="flightinfo_desc">'
              + '<div class="item text-right">'
                + '<div class="city font-bold">'
                  + finf.depCity // '深圳'
                + '</div>'
                + '<div class="airport font15 font-bold">'
                  + finf.depAirport + ' ' + finf.depTerminal //'宝安机场 T3'
                + '</div>'
                + '<div class="weather font15">'
                  + depCityTempImage_html // http://simg1.qunarzz.com/site/images/wap/weather/mflight/32/Day01.png
                  + '<span class="qn_vmiddle">'
                    + finf.depCityTemp //33°C
                  + '</span>'
                + '</div>'
              + '</div>'
              + '<div class="item text-center">'
                + '<div class="icon"></div>'
              + '</div>'
              + '<div class="item text-lesf">'
                + '<div class="city font-bold">'
                  + finf.arrCity // '海口'
                + '</div>'
                + '<div class="airport font15 font-bold">'
                  + finf.arrAirport + ' ' + finf.arrTerminal // '美兰机场 --'
                + '</div>'
                + '<div class="weather font15">'
                  + arrCityTempImage_html // http://simg1.qunarzz.com/site/images/wap/weather/mflight/32/Day01.png
                  + '<span class="qn_vmiddle">'
                    + finf.arrCityTemp //33°C
                  + '</span>'
                + '</div>' 
              + '</div>'
            + '</div>'
            + '<div class="flightinfo_detail">'
              + '<div class="item text-right">'
                + '<div class="planned font15">'
                  + '计划起飞' + finf.dPtime // 06:50
                + '</div>'
                + '<div class="actually">'
                  + finf.depTimeDescribe // '预计' 
                  + '<span class="font22">' + finf.depTime + '</span>' // 06:50
                + '</div>'
              + '</div>'
              + '<div class="item text-center">'
                + '<div class="flight_status font20 font-bold">'
                  + finf.flightStatus // '正常'
                + '</div>'
              + '</div>'
              + '<div class="item text-left">'
                + '<div class="planned font15">'
                  + finf.aPtime + '计划到达' // 08:00
                + '</div>'
                + '<div class="actually">'
                  + '<span class="font22">' + finf.arrTime + '</span>' // 08:00
                  + finf.arrTimeDescribe // '预计'
                + '</div>'
              + '</div>'
            + '</div>'
          + '</div>'
        + '</div>'
        + '<div>登机口: <strong>' + finf.boardgate + '</strong></div>';
    };
    
    finf1 = flightObj.result.flightInfo;
    flightStatus = finf1.flightStatus;

    flight_html1 = render_flight_html(finf1);

    flight_hr = '';
    flight_html2 = '';
    //console.log(flightObj);
    foot_info_html = '<div class="text-right">' + flightObj.name + '查询于' + moment(flightObj.createAt).fromNow() + '</div>';
    
    if(flightObj.result.flightInfo2) {
      finf2 = flightObj.result.flightInfo2;
      flightStatus = finf2.flightStatus;

      flight_hr = '<hr style="margin: 0;">';
      flight_html2 = render_flight_html(finf2);
    }

    jqueryMap.$flight_panel.html(flight_html1 + flight_hr + flight_html2 + foot_info_html);
    jqueryMap.$flight_main.show();
    $.mobile.loading('hide');

    return flightStatus;
  };

  updateItems = function(result) {
    console.log('updateItems');
    var emit_kb_obj;
    //console.log(result.obj);
    if(result.kanban === null) {
      alert('异步更新服务器数据失败！将回滚原状态');
      // 回滚
      if(result.obj.elementId !== 'flyingStatusClass') {
        //huigun(result.obj.elementId);
      }
    } else {
      switch(result.obj.elementId) {
        case 'djpNoteTd':
          emit_kb_obj = {
            type: result.obj.type,
            val: result.obj.val,
            historys: result.kanban.historys,
            route: 1
          };
          update_smObj({
            type: result.obj.type,
            val: result.obj.val,
            historys: result.kanban.historys
          }, 1);

          changeToPage(configMap.HASH_STR.DETAIL_PAGE);
          //jqueryMap.$djpNoteTd.html(result.obj.val);
          //$('#kbModal').modal('hide');
          break;
        case 'serverNoteTd':
          emit_kb_obj = {
            type: result.obj.type,
            val: result.obj.val,
            historys: result.kanban.historys,
            route: 1
          };
          update_smObj({
            type: result.obj.type,
            val: result.obj.val,
            historys: result.kanban.historys
          }, 1);

          changeToPage(configMap.HASH_STR.DETAIL_PAGE);
          //jqueryMap.$serverNoteTd.html(result.obj.val);
          //$('#kbModal').modal('hide');
          break;
        case 'flightTd':
          //console.log(result);
          //return;
          if(result.obj.change){
            emit_kb_obj = {
              flight: {
                flightDate      : result.obj.flightDate,
                flightNum       : result.obj.flightNum,
                flightStartCity : result.obj.flightStartCity,
                flightEndCity   : result.obj.flightEndCity,
                flightStartTime : result.obj.flightStartTime,
                flightEndTime   : result.obj.flightEndTime
              },
              historys: result.kanban.historys,
              route: 5
            };
            update_smObj({
              flight: {
                flightDate      : result.obj.flightDate,
                flightNum       : result.obj.flightNum,
                flightStartCity : result.obj.flightStartCity,
                flightEndCity   : result.obj.flightEndCity,
                flightStartTime : result.obj.flightStartTime,
                flightEndTime   : result.obj.flightEndTime
              },
              historys: result.kanban.historys
            }, 5);
          } else {
            emit_kb_obj = {
              flight_gai: result.kanban.flight_gai,
              flight: {
                flightDate      : result.obj.flightDate,
                flightNum       : result.obj.flightNum,
                flightStartCity : result.obj.flightStartCity,
                flightEndCity   : result.obj.flightEndCity,
                flightStartTime : result.obj.flightStartTime,
                flightEndTime   : result.obj.flightEndTime
              },
              historys: result.kanban.historys,
              route: 2
            };
            update_smObj({
              flight_gai: result.kanban.flight_gai,
              flight: {
                flightDate      : result.obj.flightDate,
                flightNum       : result.obj.flightNum,
                flightStartCity : result.obj.flightStartCity,
                flightEndCity   : result.obj.flightEndCity,
                flightStartTime : result.obj.flightStartTime,
                flightEndTime   : result.obj.flightEndTime
              },
              historys: result.kanban.historys
            }, 2);
            /*jqueryMap.$flight_del_div_del.text(
              moment(stateMap.smObj.flight_gai.flightDate_old).format('MM-DD') + ' ' +
              stateMap.smObj.flight_gai.flightNum_old + ' ' +
              stateMap.smObj.flight_gai.flightStartCity_old + '-' +
              stateMap.smObj.flight_gai.flightEndCity_old + ' ' +
              moment(stateMap.smObj.flight_gai.flightStartTime_old).format('HH:mm') + '-' +
              moment(stateMap.smObj.flight_gai.flightEndTime_old).format('HH:mm')
            );*/
          }
          
          /*jqueryMap.$flight_div.text(
            moment(stateMap.smObj.flight.flightDate).format('MM-DD') + ' ' +
            stateMap.smObj.flight.flightNum + ' ' +
            stateMap.smObj.flight.flightStartCity + '-' +
            stateMap.smObj.flight.flightEndCity + ' ' +
            moment(stateMap.smObj.flight.flightStartTime).format('HH:mm') + '-' +
            moment(stateMap.smObj.flight.flightEndTime).format('HH:mm')
          );*/

          // 集合时间
          //jqueryMap.$start_td.text(moment(stateMap.smObj.start).format('HH:mm'));

          //$('#kbModal').modal('hide');
          changeToPage(configMap.HASH_STR.DETAIL_PAGE);
          break;
        case 'serverStateSelect':
          if(result.obj.val === '完成'){
            //console.log('全部OK');
            jqueryMap.$djpStateSelect.val('全部OK');
          }

          emit_kb_obj = {
            type: result.obj.type,
            val: result.obj.val,
            historys: result.kanban.historys,
            route: 1
          };
          update_smObj({
            type: result.obj.type,
            val: result.obj.val,
            historys: result.kanban.historys
          }, 1);
          break;
        case 'flyingStatusClass':
          emit_kb_obj = {
            flightObj:result.obj.flightObj,
            type: result.obj.type,
            val: result.obj.val,
            historys: result.kanban.historys,
            route: 3
          };
          update_smObj({
            flightObj:result.obj.flightObj,
            type: result.obj.type,
            val: result.obj.val,
            historys: result.kanban.historys
          }, 3);

          break;
        default:
          emit_kb_obj = {
            type: result.obj.type,
            val: result.obj.val,
            historys: result.kanban.historys,
            route: 1
          };
          update_smObj({
            type: result.obj.type,
            val: result.obj.val,
            historys: result.kanban.historys
          }, 1);
      }

      // 操作记录
      /*jqueryMap.$kb_item_history.empty();
      if(result.kanban.historys) {
        updateHistorys(result.kanban.historys);
      }*/

      // 通知他人
      emit_kb_obj.id = result.kanban.sm;
      stateMap.sio.emit( 'emit-kb-update', emit_kb_obj);
    }
  };

  update_smObj = function(obj, route) {
    var flightObj;
    // 更新 stateMap.smObj 实际上是更新了stateMap.events
    if (route === 1) {
      stateMap.smObj[obj.type] = obj.val;
      if(obj.type === 'serverState'){
        if(obj.val === '完成') {
          stateMap.smObj.backgroundColor = '#77B5D3';
          stateMap.smObj.djpState = '全部OK';
        } else {
          stateMap.smObj.backgroundColor = '#3a87ad';
        }
      }
    } else if (route === 2) {
      stateMap.smObj.flight_gai = obj.flight_gai;
      stateMap.smObj.flight     = obj.flight;

      if(stateMap.smObj.smType1 === 2) {
        stateMap.smObj.start = getSetTime(obj.flight.flightEndTime, stateMap.smObj.smTimeSpace);
      } else {
        stateMap.smObj.start = getSetTime(obj.flight.flightStartTime, stateMap.smObj.smTimeSpace);
      }
      /*if(obj.flight_gai.flightDate !== stateMap.thisDate) {
        stateMap.smObj.backgroundColor = '#FF8000';
      } else {
        stateMap.smObj.backgroundColor = '#3a87ad';
      }*/
    } else if (route === 3) {
      stateMap.smObj[obj.type] = obj.val;

      flightObj = JSON.parse(obj.flightObj);
      //stateMap.flightsObj[flightObj.id] = flightObj;
    } else if (route === 4) {
      delete stateMap.smObj.flight_gai;
      stateMap.smObj.flight = obj.flight;
      if(stateMap.smObj.smType1 === 2) {
        stateMap.smObj.start = getSetTime(obj.flight.flightEndTime, stateMap.smObj.smTimeSpace);
      } else {
        stateMap.smObj.start = getSetTime(obj.flight.flightStartTime, stateMap.smObj.smTimeSpace);
      }
      //stateMap.smObj.backgroundColor = '#3a87ad';
    } else if (route === 5) {
      stateMap.smObj.flight     = obj.flight;
      if(stateMap.smObj.smType1 === 2) {
        stateMap.smObj.start = getSetTime(obj.flight.flightEndTime, stateMap.smObj.smTimeSpace);
      } else {
        stateMap.smObj.start = getSetTime(obj.flight.flightStartTime, stateMap.smObj.smTimeSpace);
      }
    }

    stateMap.smObj.historys = obj.historys;

    // 本地储存
    if (localStorage){
      localStorage.setItem('events', JSON.stringify(stateMap.events));
    }

    //stateMap.isRefetch = true;
  };

  // 页面事件注册 
  bindPageEvent = function() {
    $(document)
      // kb-login-page
      .on('pageinit', configMap.HASH_STR.LOGIN_PAGE, login_pageinit) // login 页面初始化
      .on('pageshow', configMap.HASH_STR.LOGIN_PAGE,  login_pageshow)
      // index
      .on('pageinit', configMap.HASH_STR.INDEX_PAGE,  index_pageinit)
      .on('pageshow', configMap.HASH_STR.INDEX_PAGE,  index_pageshow)
      // kb-detail-page
      .on('pageinit', configMap.HASH_STR.DETAIL_PAGE, detail_pageinit)
      .on('pagebeforeshow', configMap.HASH_STR.DETAIL_PAGE, detail_pagebeforeshow)
      // kb-insurance-page
      .on('pageinit', configMap.HASH_STR.INSURANCE_PAGE, insurance_pageinit)
      .on('pagebeforeshow', configMap.HASH_STR.INSURANCE_PAGE, insurance_pagebeforeshow)
      .on('pageshow', configMap.HASH_STR.INSURANCE_PAGE, insurance_pageshow)
      // kb-msg-page
      .on('pageinit', configMap.HASH_STR.MSG_PAGE, msg_pageinit)
      .on('pagebeforeshow', configMap.HASH_STR.MSG_PAGE, msg_pagebeforeshow)
      .on('pageshow', configMap.HASH_STR.MSG_PAGE, msg_pageshow)
      // kb-editdjpnote-page
      .on('pageinit', configMap.HASH_STR.EDITDJPNOTE_PAGE, editdjpnote_pageinit)
      .on('pagebeforeshow', configMap.HASH_STR.EDITDJPNOTE_PAGE, editdjpnote_pagebeforeshow)
      // kb-editservernote-page
      .on('pageinit', configMap.HASH_STR.EDITSERVERNOTE_PAGE, editservernote_pageinit)
      .on('pagebeforeshow', configMap.HASH_STR.EDITSERVERNOTE_PAGE, editservernote_pagebeforeshow)
      // kb-editflight-page
      .on('pageinit', configMap.HASH_STR.EDITFLIGHT_PAGE, editflight_pageinit)
      .on('pagebeforeshow', configMap.HASH_STR.EDITFLIGHT_PAGE, editflight_pagebeforeshow)
      // kb-sm-page
      .on('pageinit', configMap.HASH_STR.SM_PAGE, sm_pageinit)
      .on('pageshow', configMap.HASH_STR.SM_PAGE, sm_pageshow)
      // kb-flight-page
      .on('pageinit', configMap.HASH_STR.FLIGHT_PAGE, flight_pageinit)
      .on('pageshow', configMap.HASH_STR.FLIGHT_PAGE, flight_pageshow)
      // kb-history-page
      .on('pageinit', configMap.HASH_STR.HISTORY_PAGE, history_pageinit)
      .on('pagebeforeshow', configMap.HASH_STR.HISTORY_PAGE, history_pagebeforeshow);
  };

  // 绑定离线缓存事件
  bindApplicationCacheEvent = function() {
    window.applicationCache.oncached = function(e) {
      // console.log('---- applicationCache event cached 进入在线流程 ----');
      // console.log(window.applicationCache.status);
      // IDLE       : 1  空闲
      come_to_online(true);
    };

    window.applicationCache.onnoupdate = function(e) {
      // console.log('1-1-1-2 applicationCache event noupdate 进入在线流程 -- online: true;');
      // console.log(location.hash);
      // IDLE       : 1  空闲
      come_to_online(true);
    };

    window.applicationCache.onobsolete = function(e) {
      // console.log('---- event onobsolete 进入离线流程 ----');
      // console.log(window.applicationCache.status);
      come_to_online(false);
    };

    window.applicationCache.onerror = function(e) {
      // console.log('---- event error 进入离线流程 ----');
      // console.log(window.applicationCache.status);
      // IDLE       : 1  空闲
      come_to_online(false);
    };

    window.applicationCache.onupdateready = function(e) {
      if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
        window.applicationCache.swapCache(); //更新成功后,切换到新的缓存
        if (confirm('检查到新版本，是否立即更新? \n如果选择否，应用将进入离线状态')) {
          window.location.reload();

          return;
        }
      }

      // console.log('1-1-1-5 event updateready 不更新 进入离线流程 -- online: false;');
      // console.log(window.applicationCache.status);
      // IDLE       : 1  空闲
      come_to_online(false);
    };
  };

  come_to_online = function(bool) {
    stateMap.online = bool;

    // hash change
    bindOnHashChangeEvent();

    if(stateMap.online === true) {
      // 监听其它用户的修改
      stateMap.sio = myData.getSio();
      stateMap.sio.on( 'on-socket-broadcast-kb-update', complete_kb_update );
    }
    
    // 监听浏览器是否在线
    bindBrowserIsOnlineEvent();
  };

  // hash change
  bindOnHashChangeEvent = function() {
    $(window)
      .bind( 'hashchange', onHashChange )
      .trigger( 'hashchange' );
  };
  onHashChange =function() {
    if(location.hash){
      stateMap.hash = location.hash;
    }

    // 如果当前页面不是login页面 && 不存在 userObj
    if(stateMap.hash !== configMap.HASH_STR.LOGIN_PAGE && (!stateMap.userObj.userName)){
      // 切换到登录页面
      //console.log('-- 切换到登录页面');
      changeToPage(configMap.HASH_STR.LOGIN_PAGE);
    }
  };

  // 监听浏览器是否在线
  bindBrowserIsOnlineEvent = function() {
    if(window.addEventListener){
      window.addEventListener('online', function(){changeIsonlineFromEvent(true);}, false);
      window.addEventListener('offline', function(){changeIsonlineFromEvent(false);}, false);
    } else {
      document.body.ononline = function(){changeIsonlineFromEvent(true);};
      document.body.onoffline = function(){changeIsonlineFromEvent(false);};
    }
  };
  changeIsonlineFromEvent = function(bool) {

    stateMap.online = bool;
    set_online_span_text(bool);

    if(stateMap.online === true) {
      // 监听其它用户的修改
      stateMap.sio = myData.getSio();
      stateMap.sio.on( 'on-socket-broadcast-kb-update', complete_kb_update );
    } else {
      stateMap.sio.removeListener( 'on-socket-broadcast-kb-update', complete_kb_update );
      stateMap.sio = null;
    }
  };

  // 切换页面
  changeToPage = function(hash) {

    document.location.href = configMap.BASE_URL + hash;
  };

  get_smResult = function(route) {
    if(route === configMap.HASH_STR.INSURANCE_PAGE || stateMap.smResult === null) {
      $.get(
        configMap.server + 'kanban_pingan', 
        {
          sm_id: stateMap.smObj.id, 
          team_id: stateMap.smObj.team, 
          serverMan: stateMap.smObj.serverMan, 
          t: moment().valueOf(),
          city: stateMap.city
        }, 
        function(smResult){
          stateMap.smResult = smResult;
          renderPageAs({
            route: route,
            smResult: stateMap.smResult
          });
        }
      ).error(function() {
        alert('网络异常！获取数据失败。');
        changeToPage(configMap.HASH_STR.DETAIL_PAGE);
      });
    } else {
      renderPageAs({
        route: route,
        smResult: stateMap.smResult
      });
    }
  };

  renderPageAs = function(obj) {
    if (obj.route === configMap.HASH_STR.INSURANCE_PAGE) {
      pingan.renderPage({
        smObj   : stateMap.smObj,
        userObj : stateMap.userObj,
        team    : obj.smResult.team,
        cards   : obj.smResult.cards,
        sm_cards: obj.smResult.sm_cards
      });
    } else if (obj.route === configMap.HASH_STR.MSG_PAGE) {
      msg_renderPage({
        smObj: stateMap.smObj,
        team : obj.smResult.team,
        sm   : obj.smResult.sm
      });

    } else if (obj.route === configMap.HASH_STR.SM_PAGE) {
      sm_renderPage({
        team: obj.smResult.team,
        sm  : obj.smResult.sm
      });
    }
  };

  msg_renderPage = function(obj) {
    //console.log(obj);
    var
      CITY     = stateMap.CITY,
      smType   = obj.sm.flight.flightStartCity === CITY ? '送' : '接',
      phoneObj = {},
      phoneArr = [], // 电话号码数组
      smTime, smNum,
      operatorPhoneTo,
      smSetTimeType = '',
      msgObj, smSetPlace, localPhone,
      msgTemplate, msgStr,
      userArr_t, i_ut, userObj_t,
      batchArr_t, i_bt, batchObj_t,
      personArr_t, i_pt, personObj_t,
      isSendOrMeet,
      phoneTo, item;

    smTime =
      smType === '送' ?
      smTime = moment(obj.sm.flight.flightStartTime).format('HHmm') :
      smTime = moment(obj.sm.flight.flightEndTime).format('HHmm');
    smNum = 
      moment(obj.sm.flight.flightDate).format('MMDD') + 
      smTime + 
      obj.sm.flight.flightNum + 
      (obj.sm.operator).substr(0, obj.sm.operator.length - 11) + 
      obj.sm.smRealNumber +
      "人" + 
      (obj.sm.smType2===1?'内':'外') + 
      smType;

    // 操作人
    operatorPhoneTo = obj.sm.operator.match(/\d{11}$/);   

    if(obj.smObj.smSetPlace === '2') {
      smSetPlace = '深圳机场T3出发厅2号门';
      localPhone = '13603017047';
    } else if (obj.smObj.smSetPlace === '6') {
      smSetPlace = '深圳机场T3出发厅6号门';
      localPhone = '13510543994';
    } else {
      smSetPlace = '深圳机场到达厅接机口(肯德基门口)';
    }

    if(smType === '送'){
      isSendOrMeet = 'isSend';
      smSetTimeType = getSmSetTimeType(obj.smObj.start);

      msgObj = {
        集合时间_时段: smSetTimeType,
        集合时间: obj.smObj.start,
        集合地点: smSetPlace,
        本机: localPhone
      };

      if(obj.team.smFlag !== '' && obj.team.smFlag !== '无'){
        msgObj.送机旗号 = obj.team.smFlag; //.replace(/\"/g,'');
      }

      msgTemplate = Handlebars.compile(configMap.handlebars_send_phone_message_str);
      msgStr = msgTemplate(msgObj);

    } else {
      isSendOrMeet = 'isMeet';

      msgObj = {
        集合地点: smSetPlace
      };

      if(obj.team.smFlag !== '' && obj.team.smFlag !== '无'){
        msgObj.接机旗号 = obj.team.smFlag; //.replace(/\"/g,'');
      }

      msgTemplate = Handlebars.compile(configMap.handlebars_meet_phone_message_str);
      msgStr = msgTemplate(msgObj);
    }

    userArr_t = obj.team.users;
    for( i_ut = 0; i_ut < userArr_t.length; i_ut++ ) {
      userObj_t  = userArr_t[i_ut];
      batchArr_t = userObj_t.batchs;
      for( i_bt = 0; i_bt < batchArr_t.length; i_bt++ ) {
        batchObj_t = batchArr_t[i_bt];
        if(( batchObj_t.departureTraffic._id === stateMap.smObj.id && batchObj_t.departureTraffic.isSm === true ) 
          || ( batchObj_t.returnTraffic._id === stateMap.smObj.id && batchObj_t.returnTraffic.isSm ===true )){

          personArr_t = batchObj_t.persons;
          for( i_pt = personArr_t.length - 1; i_pt > -1; i_pt-- ) {
            personObj_t = personArr_t[i_pt];
            if(!personObj_t[isSendOrMeet]){
              personArr_t.splice(i_pt, 1);
            }
          }

          for( i_pt = 0; i_pt < personArr_t.length; i_pt++ ) {
            personObj_t = personArr_t[i_pt];
            if (personObj_t.phone !== '') {
              phoneTo = personObj_t.phone.match(/\d{11}$/);
              if(phoneTo !== null) {
                phoneObj[phoneTo[0]] = 1;
              }
            }
          }
        }

      }
    }

    for(item in phoneObj){
      if (phoneObj.hasOwnProperty(item)) {
        phoneArr.push(item);
      }
    }

    if(operatorPhoneTo === null){
      jqueryMap.$ok_msg_phones.html('');
    } else {
      jqueryMap.$ok_msg_phones.html(operatorPhoneTo[0]);
    }
    jqueryMap.$ok_msg_text.html('您好,' + smNum +'团已完成,一切顺利!(阳光服务)');

    jqueryMap.$sm_msg_phones.html(phoneArr.join(';'));
    jqueryMap.$sm_msg_text.html(msgStr);

    if(jqueryMap.$sm_msg_switch.val() === 'down') {
      jqueryMap.$sm_msg_phones.hide();
      jqueryMap.$sm_msg_text.hide();

      jqueryMap.$sendMsgBtn.attr('href','sms:' + jqueryMap.$ok_msg_phones.text() + '?body=' + jqueryMap.$ok_msg_text.text());
 
      jqueryMap.$ok_msg_phones.show();
      jqueryMap.$ok_msg_text.show();
    } else {
      jqueryMap.$sendMsgBtn.attr('href','sms:' + jqueryMap.$sm_msg_phones.text() + '?body=' + jqueryMap.$sm_msg_text.text());
      
      jqueryMap.$sm_msg_phones.show();
      jqueryMap.$sm_msg_text.show();

      jqueryMap.$ok_msg_phones.hide();
      jqueryMap.$ok_msg_text.hide();
    }

    jqueryMap.$msg_main.show();
  
    $.mobile.loading('hide');
  };

  getSmSetTimeType = function(smSetTime) {
    var h = Number(smSetTime.split(':')[0]);

    if (h < 9) {

      return '早上';
    } else if (h < 12) {

      return '上午';
    } else if (h < 14) {

      return '中午';
    } else if (h < 19) {

      return '下午';
    } else if (h < 24) {

      return '晚上';
    }

    return '';
  };

  sm_renderPage = function(obj) {
    var
      CITY = stateMap.CITY,
      otherSm = null,
      phoneTo,
      departureTrafficArr, returnTrafficArr, i, trafficObj, 
      flightDate_text, flightStartTime_text, flightEndTime_text,
      smType, smTime, smNum,
      $collapsible, $collapsible_ul,
      teamNum,
      sm_sn,
      userArr_t, i_ut, userObj_t,
      batchArr_t, i_bt, batchObj_t,
      personArr_t, i_pt, personObj_t,
      isSendOrMeet, batchNote, peopleNote,
      li_people_sn_name, li_people_phone, li_people_note;

    // jqueryMap.$sm_listview
    smType = obj.sm.flight.flightStartCity === CITY ? '送' : '接';
    smTime =
      smType === '送' ?
      smTime = moment(obj.sm.flight.flightStartTime).format('HHmm') :
      smTime = moment(obj.sm.flight.flightEndTime).format('HHmm');
    smNum = 
      moment(obj.sm.flight.flightDate).format('MMDD') + 
      smTime + 
      obj.sm.flight.flightNum + 
      (obj.sm.operator).substr(0, obj.sm.operator.length - 11) + 
      obj.sm.smRealNumber +
      "人" + 
      (obj.sm.smType2===1?'内':'外') + 
      smType;

    jqueryMap.$sm_listview.empty();
    // 单号
    jqueryMap.$sm_listview.append('<li>' + smNum + '</li>');
    // 航班
    jqueryMap.$sm_listview.append(
      '<li>' + 
      moment(obj.sm.flight.flightDate).format('MM-DD') + " " +
      obj.sm.flight.flightNum + " " + 
      obj.sm.flight.flightStartCity + "-" + 
      obj.sm.flight.flightEndCity + " " + 
      moment(obj.sm.flight.flightStartTime).format('HH:mm') + "-" + 
      moment(obj.sm.flight.flightEndTime).format('HH:mm') +
      '</li>'
    );
    // 关联航班
    // 找出一个不等于当前的 sm._id 的 trafficObj
    departureTrafficArr = obj.team.departureTraffics;
    for( i = 0; i < departureTrafficArr.length; i++ ) {
      trafficObj = departureTrafficArr[i];
      if(trafficObj._id !== obj.sm._id){
        otherSm = trafficObj;
        break;
      }
    }
    if(otherSm === null){
      returnTrafficArr = obj.team.returnTraffics;
      for( i = 0; i < returnTrafficArr.length; i++ ) {
        trafficObj = returnTrafficArr[i];
        if(trafficObj._id !== obj.sm._id){
          otherSm = trafficObj;
          break;
        }
      }
    }
    if(otherSm !== null){
      // 关联航班
      flightDate_text      = '';
      flightStartTime_text = '';
      flightEndTime_text   = '';
      if(otherSm.flight.flightDate) {
        flightDate_text      = moment(otherSm.flight.flightDate).format('MM-DD');
        flightStartTime_text = moment(otherSm.flight.flightStartTime).format('HH:mm');
        flightEndTime_text   = moment(otherSm.flight.flightEndTime).format('HH:mm');
      }

      jqueryMap.$sm_listview.append(
        '<li style="color:#ddd;">' + 
        flightDate_text + " " + otherSm.flight.flightNum + " " + otherSm.flight.flightStartCity + "-" + otherSm.flight.flightEndCity + " " + flightStartTime_text + "-" + flightEndTime_text +
        '</li>'
      );
    }

    // 团号
    if(obj.team.teamNum !== '') {
      jqueryMap.$sm_listview.append('<li><span class="li-people-key">团号</span><span class="li-people-value">' + obj.team.teamNum + '</span></li>');
    }
    // 线路
    if(obj.team.lineName !== '') {
     jqueryMap.$sm_listview.append('<li><span class="li-people-key">线路</span><span class="li-people-value">' + obj.team.lineName + '</span></li>');
    }
    // 团队类型
    jqueryMap.$sm_listview.append('<li><span class="li-people-key">团队类型</span><span class="li-people-value">' + obj.team.teamType + '</span></li>');
    // 旗号
    jqueryMap.$sm_listview.append('<li><span class="li-people-key">' + smType + '机旗号</span><span class="li-people-value">' + obj.team.smFlag + '</span></li>');
    if(smType === '送'){
      // 地接人员
      if(obj.team.guide !== '') {
        jqueryMap.$sm_listview.append('<li><span class="li-people-key">地接人员</span><span class="li-people-value">' + obj.team.guide + '</span></li>');
      }
      // 地接旗号
      if(obj.team.sendDestinationFlag !== '') {
        jqueryMap.$sm_listview.append('<li><span class="li-people-key">地接旗号</span><span class="li-people-value">' + obj.team.sendDestinationFlag + '</span></li>');
      }
    }

    // 备注
    if(obj.sm.smNote !== '') {
      jqueryMap.$sm_listview.append('<li>' + obj.sm.smNote + '</li>');
    } else {
      jqueryMap.$sm_listview.append('<li>无备注</li>');
    }
    // 操作人
    phoneTo = obj.sm.operator.match(/\d{11}$/);
    //console.log(phoneTo);
    if(phoneTo === null){
      jqueryMap.$sm_listview.append('<li>' + obj.sm.operator + '</li>');
    } else {
      jqueryMap.$sm_listview.append('<li><div><a href="tel:' + phoneTo[0] + '" style="text-decoration: none;">' + obj.sm.operator + ' <span class="glyphicon glyphicon-earphone"></span></a></div></li>');
    }
    jqueryMap.$sm_listview.listview("refresh");

    jqueryMap.$sm_main.find('.sm-collapsible').remove();

    if(smType === '送'){
      isSendOrMeet = 'isSend';
      batchNote    = 'sendBatchNote';
      peopleNote   = 'sendPersonNote';
    } else {
      isSendOrMeet = 'isMeet';
      batchNote    = 'meetBatchNote';
      peopleNote   = 'meetPersonNote';
    }
    userArr_t = obj.team.users;
    for( i_ut = 0; i_ut < userArr_t.length; i_ut++ ) {
      sm_sn = 1;
      userObj_t = userArr_t[i_ut];
      //console.log(userObj_t);

      $collapsible = $('<div class="sm-collapsible" data-role="collapsible" data-collapsed="false" data-mini="true"></div>');
      $collapsible.append('<h2>' + userObj_t._id.name + '</h2>');

      $collapsible_ul = $('<ul data-role="listview"></ul>');
      if (userObj_t._id.phone) {
        $collapsible_ul.append(
          '<li><div><a href="tel:' + 
          userObj_t._id.phone + 
          '" style="text-decoration: none;">' + 
          userObj_t._id.name + 
          userObj_t._id.phone + 
          ' <span class="glyphicon glyphicon-earphone"></span></div></a></li>');
      }

      batchArr_t = userObj_t.batchs;
      //console.log(batchArr_t);

      for( i_bt = 0; i_bt < batchArr_t.length; i_bt++ ) {
        batchObj_t = batchArr_t[i_bt];
        if(( batchObj_t.departureTraffic._id === stateMap.smObj.id && batchObj_t.departureTraffic.isSm === true ) 
          || ( batchObj_t.returnTraffic._id === stateMap.smObj.id && batchObj_t.returnTraffic.isSm ===true )){

          personArr_t = batchObj_t.persons;

          for( i_pt = personArr_t.length - 1; i_pt > -1; i_pt-- ) {
            personObj_t = personArr_t[i_pt];
            if(!personObj_t[isSendOrMeet]){
              personArr_t.splice(i_pt, 1);
            }
          }

          //console.log(batchObj_t);
          $collapsible_ul.append('<li data-role="list-divider">' + batchObj_t.batchNum + '组<span class="ui-li-count">' + personArr_t.length + '人</span></li>');
          if (batchObj_t[batchNote] !== '') {
            $collapsible_ul.append('<li data-role="list-divider">' + batchObj_t[batchNote] + '</li>');
          }

          for( i_pt = 0; i_pt < personArr_t.length; i_pt++ ) {
            personObj_t = personArr_t[i_pt];
            //console.log(personObj_t);
            li_people_sn_name = 
              '<span class="li-people-sn">' + 
              sm_sn + 
              '</span><span class="li-people-name">' + 
              personObj_t.name + ' ' + 
              personObj_t.cardNum + '</span>';

            li_people_phone   = 
              personObj_t.phone === '' ? 
              '' : 
              '<p><a href="tel:' + personObj_t.phone + '" style="text-decoration: none;">' + personObj_t.phone + ' <span class="glyphicon glyphicon-earphone"></span></a></p>';

            li_people_note    = 
              personObj_t[peopleNote] === '' ? 
              '' : 
              '<p>' + personObj_t[peopleNote] + '</p>';

            $collapsible_ul.append('<li>' + li_people_sn_name + li_people_phone + li_people_note + '</li>');
            sm_sn++;
          }
        }
      }

      $collapsible.append($collapsible_ul);

      jqueryMap.$sm_main.append($collapsible);
      jqueryMap.$sm_main.trigger('create');
    }



    jqueryMap.$sm_main.show();
    $.mobile.loading('hide');
  };
  
  // login 页面
  // login 页面初始化
  login_pageinit = function(event) {
    console.log('login_pageinit');
    jqueryMap.$userNameSelect = $('#userNameSelect');
    jqueryMap.$passwordInput  = $('#passwordInput');
    jqueryMap.$loginBtn       = $('#loginBtn');
    
    // 注册事件-点击登录按钮
    jqueryMap.$loginBtn.on('tap', loginBtn_on_click);
  };

  login_pageshow = function() {
    window.localStorage.setItem('userObj', '{}');
    stateMap.userObj = {
      name    : '游客',
      userName: ''
    };
  };

  // 点击登录按钮
  loginBtn_on_click = function(e) {
    var 
      $that_loginBtn = $(this),
      password = jqueryMap.$passwordInput.val(),
      userName, name;

    if(password === '') {
      alert('密码不能为空');
      return;
    }

    userName = jqueryMap.$userNameSelect.val();
    name     = jqueryMap.$userNameSelect.find('.' + userName).text();

    $that_loginBtn
      .data('name', name)
      .prop('disabled', true);

    $.mobile.loading('show');

    // 向服务器验证用户
    checkUserFromServer({
      $that_loginBtn : $that_loginBtn,
      userObj : {
        userName : userName,
        password : password
      }
    });
    // e.preventDefault();
    e.stopPropagation();
  };
  // 向服务器验证用户
  checkUserFromServer = function(obj) {
    // $.post('http://120.76.232.12:8080/api/login/', obj.userObj , function(result){
    //   console.log(result);
    // }).error(function (e) {
    //   console.log(e);
    // });

    $.post(configMap.server + 'kb_login', obj.userObj , function(result){
      onLogined({
        $that_loginBtn : obj.$that_loginBtn,
        result         : result
      });
    }).error(function(e){
      alert('网络异常！用户认证失败');
      obj.$that_loginBtn.prop('disabled', false);
      $.mobile.loading('hide');
    });
  };
  // 服务器返回验证用户结果
  onLogined = function(obj) {
    var userObj;

    if(obj.result.isMatch === 1) {
      userObj = {
        name     : obj.$that_loginBtn.data('name'),
        userName : obj.result.userName
      };

      stateMap.userObj = userObj;

      changeToPage(configMap.HASH_STR.INDEX_PAGE);

      // 将 userObj 序列化为JSON并储存到本地储存 Local Storage
      if (stateMap.canOfflineUse){
        window.localStorage.setItem('userObj', JSON.stringify(userObj));
      }
    } else if (obj.result.isMatch === 2) {
      alert('用户认证失败\n请检查用户名是否有效');
    } else if (obj.result.isMatch === 3) {
      alert('用户认证失败\n请检查密码是否正确');
    } else {
      alert('用户认证失败');
    }

    obj.$that_loginBtn.prop('disabled', false);
    $.mobile.loading('hide');
  };

  // 获取服务器数据后转换
  getDataObjWithOnlineresults = function(results) {
    var 
        CITY         = stateMap.CITY,
        events       = [],
        //dataObj      = {},
        kanbansObj   = {},
        setPlacesObj = {},
        kanbanItem, sm,
        i, len;

    // kanbans Array 转 obj
    results.kanbans.forEach(function(item) {
      kanbansObj[item.sm] = item;
    });

    results.setPlaces.forEach(function(item) {
      if(item.place === '深圳机场T3出发厅6号门') {
        setPlacesObj[item.airCode] = '6';
      } else if(item.place === '深圳机场T3出发厅2号门') {
        setPlacesObj[item.airCode] = '2';
      } else if(item.place === '白云机场出发厅2号门') {
        setPlacesObj[item.airCode] = '2';
      } else if(item.place === '白云机场出发厅16号门') {
        setPlacesObj[item.airCode] = '16';
      } else if(item.place === '萧山机场B航站楼出发厅11号门') {
        setPlacesObj[item.airCode] = '11';
      }
    });

    results.sms.forEach(function(item){
      sm = {};

      sm.id             = item._id;
      sm.team           = item.team;
      sm.smType2        = item.smType2;
      sm.operator       = item.operator;
      sm.flight         = item.flight;
      sm.smRealNumber   = item.smRealNumber;
      sm.smTimeSpace    = item.smTimeSpace;
      sm.smAgencyFund   = item.smAgencyFund;
      sm.phoneMsgStatus = item.phoneMsgStatus.toString();
      sm.smPayment      = item.smPayment;

      if (sm.flight.flightEndCity.indexOf(CITY) === 0) {
        sm.smType1 = 2;
        sm.start = getSetTime(sm.flight.flightEndTime, sm.smTimeSpace);
        sm.city_html = '';
        sm.smSetPlace = '0';
      } else {
        sm.smType1 = 1;
        sm.start = getSetTime(sm.flight.flightStartTime, sm.smTimeSpace);
        sm.city_html = '<span>' + sm.flight.flightEndCity.split('(')[0] + '</span><br>';

        sm.smSetPlace = setPlacesObj[sm.flight.flightNum.substr(0, 2)];
        if(typeof sm.smSetPlace === 'undefined'){
          sm.smSetPlace = 'n';
        }
      }

      if(sm.smAgencyFund === 0) {
        sm.smAgencyFund_html = '';
      } else {
        sm.smAgencyFund_html = '<span class="label label-warning" style="padding-top: 0; padding-bottom: 0;">代收' + (sm.smAgencyFund / -100) + '</span><br>';
      }

      if(sm.smPayment === 0) {
        sm.smPayment_html = '';
      } else {
        sm.smPayment_html = '<span class="label label-warning" style="padding-top: 0; padding-bottom: 0;">代付' + (sm.smPayment / 100) + '</span><br>';
      }
      // console.log(item.serverMan);
      // 有BUG item.serverMan 有 undefined
      if(item.serverMan) {
        sm.serverMan = item.serverMan;
      } else {
        sm.serverMan = '待定';
      }
      //sm.serverMan = item.serverMan === '' ? '待定' : item.serverMan;
      sm.backgroundColor = '#3a87ad';
      sm.borderColor  = '#2e6da4';

      if(kanbansObj[sm.id]){
        kanbanItem = kanbansObj[sm.id];
        
        if(kanbanItem.news) {
          for(i = 0, len = kanbanItem.news.length; i < len; i++) {
            /*if(kanbanItem.news[i] === stateMap.userObj.name) {
              sm.isHasNews = true;
              break;
            }*/
          }
        }

        /*if(kanbanItem.serverMan) {
          sm.serverMan = kanbanItem.serverMan;
        }*/
        if(kanbanItem.djpState) {
          sm.djpState = kanbanItem.djpState;
        }
        if(kanbanItem.smSetPlace) {
          sm.smSetPlace = kanbanItem.smSetPlace;
        }
        if(kanbanItem.flightState) {
          sm.flightState = kanbanItem.flightState;
        }
        if(kanbanItem.smAgencyFundState) {
          sm.smAgencyFundState = kanbanItem.smAgencyFundState;
        }
        if(kanbanItem.smPaymentState) {
          sm.smPaymentState = kanbanItem.smPaymentState;
        }
        if(kanbanItem.serverState) {
          sm.serverState = kanbanItem.serverState;
          if(sm.serverState === '完成') {
            sm.backgroundColor = '#77B5D3';
          }
        }
        if(kanbanItem.djpNote) {
          sm.djpNote = kanbanItem.djpNote;
        }
        if(kanbanItem.serverNote) {
          sm.serverNote = kanbanItem.serverNote;
        }
        if(kanbanItem.flight_gai) {
          //sm.flight     = kanbanItem.flight_old;
          sm.flight_gai = kanbanItem.flight_gai;
          //sm.start = kanbanItem.flight_gai.start;

          /*if(sm.smType1 === 2) {
            sm.start = getSetTime(sm.flight_gai.flightDate, sm.flight_gai.flightEndTime, sm.smTimeSpace);
          }*/

          /*if(kanbanItem.flight_gai.flightDate !== stateMap.thisDate) {
            sm.backgroundColor = '#FF8000';
          }*/
        }
        if(kanbanItem.historys) {
          sm.historys = kanbanItem.historys;
        }
        if(kanbanItem.flyingStatusClass) {
          sm.flyingStatusClass = kanbanItem.flyingStatusClass;
        }
        //console.log(sm);
      }

      events.push(sm);
    });

    // 将数据序列化为JSON并储存到本地 Local Storage
    if (stateMap.canOfflineUse){
      window.localStorage.setItem('thisDate', stateMap.thisDate);
      window.localStorage.setItem('servermans', JSON.stringify(results.servermans));
      window.localStorage.setItem('events', JSON.stringify(events));
    }

    return {
      servermans: results.servermans,
      events: events
    };
  };
  // 计算集合时间
  getSetTime = function (flightTime, miniter) {
    // console.log(flightTime);
    return moment(flightTime).subtract(miniter, 'm').format('HH:mm');
  };

  // 添加统计
  addTongji = function() {
    var
        team_sum           = 0, 
        send_sum           = 0, 
        meet_sum           = 0, 
        smRealNumber_sum   = 0,
        serverStateOk_sum  = 0,
        isPush             = true,
        totalObj, endObj;

    stateMap.events.forEach(function(item) {
      if(item.allDay) {
        isPush = false;
        if(item.itemType === 'total') {
          totalObj = item;
        } else {
          endObj = item;
        }
      } else {
        if(moment(stateMap.thisDate).isSame(item.flight.flightDate, 'day')) {
        //if(moment(item.flight.flightDate).format('YYYY-MM-DD') === stateMap.thisDate){
          team_sum ++;
          if(item.smType1 === 1){
            send_sum ++;
          } else {
            meet_sum ++;
          }
          smRealNumber_sum += item.smRealNumber;

          if(item.serverState === '完成') {
            serverStateOk_sum ++;
          }
        }
      }
    });

    if(isPush) {
      stateMap.events.push({
        title: '今日共计: ' + team_sum + '团 ' + send_sum + '送 ' + meet_sum + '接 ' + smRealNumber_sum + '人',
        start: stateMap.thisDate,
        allDay: true,
        itemType: 'total'
      });
      stateMap.events.push({
        title: '已经完成: ' + serverStateOk_sum + '团',
        start: stateMap.thisDate,
        allDay: true
      });  
    } else {
      totalObj.title = '今日共计: ' + team_sum + '团 ' + send_sum + '送 ' + meet_sum + '接 ' + smRealNumber_sum + '人';
      endObj.title = '已经完成: ' + serverStateOk_sum + '团';
    }
  };

  // index 页面
  // index 页面初始化
  index_pageinit = function(event) {
    //console.log('index_pageinit');
    jqueryMap.$name_span   = $('#name-span');
    jqueryMap.$online_span = $('#online-span');
    jqueryMap.$kb_list     = $('#kb-list');
    jqueryMap.$prevBtn     = $('#prevBtn');
    jqueryMap.$todayBtn    = $('#todayBtn');
    jqueryMap.$nextBtn     = $('#nextBtn');

    // 初始化 fullCalendar
    //console.log('初始化 fullCalendar');
    jqueryMap.$kb_list.fullCalendar({
      header: false,
      contentHeight: 'auto',
      defaultView: 'agendaDay',
      axisFormat: 'HH:mm',
      allDayText: '统计',
      minTime: '00:00:00',
      maxTime: '26:00:00',
      slotDuration: '00:15:00',
      slotEventOverlap: false,
      views: {
        day: {
          columnFormat: 'YYYY-MM-DD dddd'
        }
      },
      events: function( start, end, timezone, callback ) {
        callback(stateMap.events);
      },
      eventRender: function(event, element) {        
        var djpStateClass          = 'default',
            flyingStatusClass      = 'default',         // 航班动态
            smAgencyFundStateClass = 'danger',
            smPaymentStateClass    = 'danger',
            smSetPlaceClass        = 'info',
            news_html              = '',
            smSetPlaceStyle        = '',
            phoneMsgStatus_html    = '',
            gai_span_html          = '',
            flightState_html       = '',
            flightNum;

        if (event.allDay){
          return;
        }

        if (event.isHasNews){
          news_html = ' <span class="glyphicon glyphicon-volume-up" aria-hidden="true" style="color: red;"></span><br>';
        }
        if (event.phoneMsgStatus === '0') {
          phoneMsgStatus_html = '<span class="label label-warning" style="padding-top: 0; padding-bottom: 0;">集合短信</span><br>';
        } else if (event.phoneMsgStatus === '1') {
          phoneMsgStatus_html = '<span class="label label-success" style="padding-top: 0; padding-bottom: 0;">集合短信</span><br>';
        } else if (event.phoneMsgStatus === '2') {
          phoneMsgStatus_html = '<span class="label label-info" style="padding-top: 0; padding-bottom: 0;">集合短信</span><br>';
        }

        if (event.flight_gai) {
          gai_span_html = '<span class="label label-warning" style="padding-top: 0; padding-bottom: 0;">改签</span><br>';
          //flightNum = event.flight_gai.flightNum;
        }

        flightNum = event.flight.flightNum;

        switch(event.flightState){
          case '计划':
            flightState_html = '<span class="label label-default" style="padding-top: 0; padding-bottom: 0;">计划</span><br>';
            break;
          case '延误':
            flightState_html = '<span class="label label-warning" style="padding-top: 0; padding-bottom: 0;">延误</span><br>';
            //flightStateClass = 'warning';
            break;
          case '取消':
            flightState_html = '<span class="label label-danger" style="padding-top: 0; padding-bottom: 0;">取消</span><br>';
            //flightStateClass = 'danger';
            break;
          case '起飞':
            //flightStateClass = 'success';
            flightState_html = '<span class="label label-success" style="padding-top: 0; padding-bottom: 0;">起飞</span><br>';
            break;
          default:
        }

        // 航班动态
        // ["计划", "在途", "到达", "延误", "未知", "取消", "起飞", "经停", "折返", "备降", "暂无"]
        // info    计划
        // warning 延误 未知 折返 备降 暂无
        // danger  取消 
        // success 起飞 在途 到达 经停
        // -------------------------------------
        // info    计划
        // warning 延误 
        // danger  取消 
        // success 到达
        // primary 起飞 在途
        // default 经停 未知 折返 备降 暂无
        if(event.flyingStatusClass){
          flyingStatusClass = event.flyingStatusClass;
        }

        switch(event.djpState){
          case '已办理':
            djpStateClass = 'danger';
            break;
          case '部分已领':
            djpStateClass = 'warning';
            break;
          case '全部OK':
            djpStateClass = 'success';
            break;
        }


        if(event.smAgencyFundState === '已收') {
          smAgencyFundStateClass = 'success';
        }

        if(event.smPaymentState === '已付') {
          smPaymentStateClass = 'success';
        }

        if(event.smSetPlace === 'n') {
          smSetPlaceClass = 'danger';
        }

        switch(event.smSetPlace){
          case '6':
            smSetPlaceStyle = ' style="color: #000;"';
            break;
          case '0':
            smSetPlaceClass = 'success';
            break;
          case 'n':
            smSetPlaceClass = 'danger';
            break;
        }

        var event_html = String()
          // 未读消息
          + news_html
          + '<span' + smSetPlaceStyle + ' class="label label-' + smSetPlaceClass + '">'
            + event.smSetPlace
          + '</span>'
          + '<span>'
            + event.start.format('HH:mm')
          + '</span>'
          + '<br>'
          + phoneMsgStatus_html
          + gai_span_html // 改签
          + flightState_html // 航班状态
          // 航班动态
          + '<span class="label label-' + flyingStatusClass + '" style="padding-top: 0; padding-bottom: 0;">'
            + flightNum
          + '</span><br>'
          + '<span class="label label-' + djpStateClass + '" style="padding-top: 0; padding-bottom: 0;">'
            + '登机牌'
          + '</span><br>'
          + event.smAgencyFund_html.replace('warning', smAgencyFundStateClass)
          + event.smPayment_html.replace('warning', smPaymentStateClass)
          + event.city_html
          + '<span>'
            //+ event.operator.substr(0, event.operator.length - 11)
            + event.operator.substr(0, 4)
          + '</span><br>'
          + '<span>'
            + event.smRealNumber
            + '人'
            + (event.smType2 === 1 ? '内' : '外')
            + (event.smType1 === 1 ? '送' : '接')
          + '</span></br>'
          + '<span>'
            + event.serverMan
          + '</span>';

        element.html(event_html);
      },
      eventClick: function(calEvent, jsEvent, view) {
        if(calEvent.allDay){
          return false;
        }
        stateMap.scrollTop   = $(window).scrollTop();
        stateMap.calEvent_id = calEvent.id;
        stateMap.smResult    = null;
        set_smObj(stateMap.calEvent_id);

        // 储存到 本地储存 Local Storage
        if (stateMap.canOfflineUse){
          window.localStorage.setItem('calEvent_id', stateMap.calEvent_id);
        }
        // 切换到详情页
        //$.mobile.changePage( "#kb-detail-page", { transition: "none", changeHash: true });
        changeToPage(configMap.HASH_STR.DETAIL_PAGE);


        if(stateMap.smObj.isHasNews && stateMap.online === true){
          // 已看消息
          // 离弦之箭 修改服务器不返回结果

          $.post(configMap.server + 'kanban_update_new', {
            sm: stateMap.smObj.id,
            name: stateMap.userObj.name,
            city: stateMap.city
          });
          stateMap.smObj.isHasNews = false;
          stateMap.isRefetch = true;
        }
      }
    });

    // 注册事件-上一天
    jqueryMap.$prevBtn.on('tap', function(e) {
      $.mobile.loading('show');
      // thisDate - 1
      stateMap.thisDate = getNextDate(moment(stateMap.thisDate), -1);
      $.get(configMap.server + 'kb_sms', {  
          thisDate: stateMap.thisDate,
          t: moment().valueOf(),
          city: stateMap.city
        }, 
        function(results) {
          gotoDateWithOnlineresults({
            thisDate: stateMap.thisDate,
            results : results
          });
        }
      ).error(function(e) {
        $.mobile.loading('hide');
        stateMap.thisDate = getNextDate(moment(stateMap.thisDate), 1);
        alert('网络异常！更新最新数据失败');
      });
      //e.stopPropagation();
    });
    // 注册事件-今天
    jqueryMap.$todayBtn.on('tap', function(e) {
      var thisDate = stateMap.thisDate;

      $.mobile.loading('show');

      if(moment(stateMap.thisDate).isSame(moment(), 'day')) {
        stateMap.thisDate = moment().startOf('day').format('YYYY-MM-DD');

        $.get(configMap.server + 'kb_sms', { 
            thisDate: stateMap.thisDate, 
            t: moment().valueOf(),
            city: stateMap.city
          },
          function(results) {
            gotoDateWithOnlineresults({
              thisDate: stateMap.thisDate,
              results : results,
              refetchEvents : true     
            });
          }
        ).error(function(e) {
          $.mobile.loading('hide');
          stateMap.thisDate = thisDate;
          alert('网络异常！更新最新数据失败');
        });
      } else {
        stateMap.thisDate = moment().startOf('day').format('YYYY-MM-DD');

        $.get(configMap.server + 'kb_sms', {  
            thisDate: stateMap.thisDate, 
            t: moment().valueOf(),
            city: stateMap.city
          },
          function(results) {
            gotoDateWithOnlineresults({
              thisDate: stateMap.thisDate,
              results : results
            });
          }
        ).error(function(e) {
          $.mobile.loading('hide');
          stateMap.thisDate = thisDate;
          alert('网络异常！更新最新数据失败');
        });
      }
      //e.stopPropagation();
    });
    // 注册事件-下一天
    jqueryMap.$nextBtn.on('tap', function(e) {
      $.mobile.loading('show');
      // thisDate + 1
      stateMap.thisDate = getNextDate(moment(stateMap.thisDate), 1);
      $.get(configMap.server + 'kb_sms', {  
          thisDate: stateMap.thisDate, 
          t: moment().valueOf(),
          city: stateMap.city
        }, 
        function(results) {
          gotoDateWithOnlineresults({
            thisDate: stateMap.thisDate,
            results : results
          });
        }
      ).error(function(e) {
        $.mobile.loading('hide');
        stateMap.thisDate = getNextDate(moment(stateMap.thisDate), -1);
        alert('网络异常！更新最新数据失败');
      });
      //e.stopPropagation();
    });
  };
  getNextDate = function(thisDate, num) {
    var date = thisDate.add(num, 'day');
    return date.format('YYYY-MM-DD');
  };
  gotoDateWithOnlineresults = function(obj) {
    //console.log(results);
    // 获取服务器数据后转换
    var dataObj = getDataObjWithOnlineresults(obj.results);
    //console.log(JSON.stringify(dataObj.events));
    stateMap.events = dataObj.events;

    // 添加统计
    addTongji();
    if(obj.refetchEvents) {
      jqueryMap.$kb_list.fullCalendar('refetchEvents');
    } else {
      jqueryMap.$kb_list.fullCalendar('gotoDate', obj.thisDate);
    }

    $.mobile.loading('hide');
  };

  // index show
  index_pageshow = function(event) {
    console.log('index_pageshow');
    // 渲染页面
    jqueryMap.$name_span.text(stateMap.userObj.name);
    set_online_span_text(stateMap.online);

    if(stateMap.fullCalendarState === configMap.FULLCALENDAR_STATE.INIT) {
      console.log('FULLCALENDAR_STATE.INIT');
      stateMap.fullCalendarState++;
      if(stateMap.userObj.userName !== ''){
        console.log('FULLCALENDAR_STATE.PLAYONE');
        stateMap.fullCalendarState++;

        $.mobile.loading('show');
        $.get(configMap.server + 'kb_sms', { 
            thisDate: stateMap.thisDate,
            t: moment().valueOf(),
            city: stateMap.city
          },
          function(results) {
            gotoDateWithOnlineresults({
              thisDate: stateMap.thisDate,
              results : results
            });
          }
        ).error(function(e) {
          $.mobile.loading('hide');
          alert('网络异常！更新最新数据失败');
        });
      }
    } else if(stateMap.fullCalendarState === configMap.FULLCALENDAR_STATE.PLAYONE) {
      console.log('FULLCALENDAR_STATE.PLAYONE');
      stateMap.fullCalendarState++;

      $.get(configMap.server + 'kb_sms', { 
          thisDate: stateMap.thisDate, 
          t: moment().valueOf(),
          city: stateMap.city
        },
        function(results) {
          gotoDateWithOnlineresults({
            thisDate: stateMap.thisDate,
            results : results
          });
        }
      ).error(function(e) {
        alert('网络异常！更新最新数据失败');
      });
    } else {
      addTongji();
      jqueryMap.$kb_list.fullCalendar('refetchEvents');
    }

    $(window).scrollTop(stateMap.scrollTop);
  };

  set_online_span_text = function(bool) {
    if (bool) {
      jqueryMap.$online_span
        .text('在线')
        .parent().css('color', '#fff');
    } else {
      jqueryMap.$online_span
        .text('离线')
        .parent().css('color', 'red');
    }
  };

  // kb-detail-page
  // detail 页面初始化
  detail_pageinit = function(event) {
    console.log('detail_pageinit');
    jqueryMap.$detail_mask            = $('#detail-mask'),
    jqueryMap.$gotoInsurancePageBtn   = $('#gotoInsurancePageBtn');
    jqueryMap.$kb_item                = $('#kb-item'),
    jqueryMap.$phoneMsgStatusSelect   = $('#phoneMsgStatusSelect'),
    jqueryMap.$servermanSelect        = $('#servermanSelect');
    jqueryMap.$djpStateSelect         = $('#djpStateSelect');
    jqueryMap.$djpNoteDiv             = $('#djpNoteDiv');
    jqueryMap.$smSetPlaceSelect       = $('#smSetPlaceSelect');
    jqueryMap.$flightStateSelect      = $('#flightStateSelect');
    jqueryMap.$flightDiv              = $('#flightDiv');
    jqueryMap.$flight_del_div_del     = $('#flight_del_div_del');
    jqueryMap.$flight_div             = $('#flight_div');
    jqueryMap.$smAgencyFund_tr        = $('#smAgencyFund_tr');
    jqueryMap.$smAgencyFund_td        = $('#smAgencyFund_td');
    jqueryMap.$smAgencyFundStateSelect= $('#smAgencyFundStateSelect');
    jqueryMap.$smPayment_tr           = $('#smPayment_tr');
    jqueryMap.$smPayment_td           = $('#smPayment_td');
    jqueryMap.$smPaymentStateSelect   = $('#smPaymentStateSelect');
    jqueryMap.$serverStateSelect      = $('#serverStateSelect');
    jqueryMap.$serverNoteDiv          = $('#serverNoteDiv');

    // 注册事件
    jqueryMap.$gotoInsurancePageBtn.on('tap', on_gotoInsurancePageBtn_tap);
    jqueryMap.$kb_item.on('change', '.itemSelect', on_itemSelect_change);
  };
  on_gotoInsurancePageBtn_tap = function(e) {
    // 检查是否有现场负责人
    if(stateMap.smObj.serverMan === '待定'){
      alert('保险领用人=现场负责人\n现场负责人不能为待定\n请先指定现场负责人');
      return;
    }

    /*pingan.initModule({
      userObj: stateMap.userObj,
      smObj  : stateMap.smObj
    });*/

    // 跳转到保险页面
    changeToPage(configMap.HASH_STR.INSURANCE_PAGE);

    e.preventDefault();
    e.stopPropagation();
  };
  on_itemSelect_change = function(e) {
    var $that  = $(this),
        obj = {},
        elementId;

    obj.name = stateMap.userObj.name;
    obj.sm = stateMap.smObj.id;
    obj.elementId = $that.attr('id');

    switch(obj.elementId) {
      case 'phoneMsgStatusSelect': // 集合短信
        obj.type = 'phoneMsgStatus';
        obj.val = $that.val();
        break;
      case 'servermanSelect': // 现场负责人
        obj.type = 'serverMan';
        obj.val = $that.val();
        break;
      case 'djpStateSelect': // 登机牌状态
        obj.type = 'djpState';
        obj.val = $that.val();
        break;
      case 'smSetPlaceSelect': // 门
        obj.type = 'smSetPlace';
        obj.val = $that.val();
        break;
      case 'flightStateSelect': // 航班状态
        obj.type = 'flightState';
        obj.val = $that.val();
        break;
      case 'smAgencyFundStateSelect': // 代收状态 
        obj.type = 'smAgencyFundState';
        obj.val = $that.val();
        break;
      case 'smPaymentStateSelect': // 代付状态 
        obj.type = 'smPaymentState';
        obj.val = $that.val();
        break;
      case 'serverStateSelect': // 服务状态
        obj.type = 'serverState';
        obj.val = $that.val();
        break;
      default:
    }

    obj.city = stateMap.city;
    $.post(configMap.server + 'kanban_update', obj, updateItems).error(function(e){
      alert('网络异常！将回滚原状态');
      // 回滚
      //huigun(obj.elementId);
    });

    e.stopPropagation();
  };
  // detail show
  detail_pagebeforeshow = function(event) {
    console.log('detail_pagebeforeshow');
    var 
      CITY                                     = stateMap.CITY,
      smObj                                    = null,
      djpStateSelect_first_option_val          = '',
      smSetPlaceSelect_first_option_val        = '',
      smAgencyFundStateSelect_first_option_val = '',
      smPaymentStateSelect_first_option_val    = '',
      serverStateSelect_first_option_val       = '',
      smObj_phoneMsgStatus                     = '待发';

    if (!stateMap.smObj) {
      // 切换到 #index 页面
      changeToPage(configMap.HASH_STR.INDEX_PAGE);
      return;
    }

    smObj = stateMap.smObj;

    // 渲染页面

    // 遮罩层
    if(stateMap.online === true) {
      jqueryMap.$detail_mask.hide();
    } else {
      jqueryMap.$detail_mask.show();
    }

    // 开保险按钮是否可用
    if (smObj.flight.flightStartCity === CITY) {
      jqueryMap.$gotoInsurancePageBtn.prop('disabled', false);
    } else {
      jqueryMap.$gotoInsurancePageBtn.prop('disabled', true);
    }

    // 集合短信
    if (smObj.phoneMsgStatus === '0') {
      smObj_phoneMsgStatus = '待发';
    } else if (smObj.phoneMsgStatus === '1') {
      smObj_phoneMsgStatus = '已发';
    } else if (smObj.phoneMsgStatus === '2') {
      smObj_phoneMsgStatus = '不发';
    }

    jqueryMap.$phoneMsgStatusSelect
      .val(smObj.phoneMsgStatus)
      .prev().text(smObj_phoneMsgStatus);

    // 现场负责
    jqueryMap.$servermanSelect
      .val(smObj.serverMan)
      .prev().text(smObj.serverMan);
    // 登机牌状态
    if(smObj.djpState) {
      jqueryMap.$djpStateSelect
        .val(smObj.djpState)
        .prev().text(smObj.djpState);
    } else {
      djpStateSelect_first_option_val = jqueryMap.$djpStateSelect.children().eq(0).val();
      jqueryMap.$djpStateSelect
        .val(djpStateSelect_first_option_val)
        .prev().text(djpStateSelect_first_option_val);
    }
    // 登机牌备注
    if(smObj.djpNote) {
      jqueryMap.$djpNoteDiv.html(smObj.djpNote);
    } else {
      jqueryMap.$djpNoteDiv.html('');
    }
    // 门
    if(smObj.smSetPlace) {
      jqueryMap.$smSetPlaceSelect
        .val(smObj.smSetPlace)
        .prev().text(smObj.smSetPlace);
    } else {
      smSetPlaceSelect_first_option_val = jqueryMap.$smSetPlaceSelect.children().eq(0).val();
      jqueryMap.$smSetPlaceSelect
        .val(smSetPlaceSelect_first_option_val)
        .prev().text(smSetPlaceSelect_first_option_val);
    }
    //航班状态
    if(smObj.flightState) {
      jqueryMap.$flightStateSelect
        .val(smObj.flightState)
        .prev().text(smObj.flightState);
    } else {
      jqueryMap.$flightStateSelect
        .val('')
        .prev().html('&nbsp;');
    }
    // 航班号
    // 原航班
    if(smObj.flight_gai){
      jqueryMap.$flight_del_div_del.text(
        moment(smObj.flight_gai.flightDate_old).format('MM-DD') + ' ' +
        smObj.flight_gai.flightNum_old + ' ' +
        smObj.flight_gai.flightStartCity_old + '-' +
        smObj.flight_gai.flightEndCity_old + ' ' +
        moment(smObj.flight_gai.flightStartTime_old).format('HH:mm') + '-' +
        moment(smObj.flight_gai.flightEndTime_old).format('HH:mm')
      );
    } else {
      jqueryMap.$flight_del_div_del.text('');
    }
    // 航班
    jqueryMap.$flight_div.text(
      moment(smObj.flight.flightDate).format('MM-DD') + ' ' +
      smObj.flight.flightNum + ' ' +
      smObj.flight.flightStartCity + '-' +
      smObj.flight.flightEndCity + ' ' +
      moment(smObj.flight.flightStartTime).format('HH:mm') + '-' +
      moment(smObj.flight.flightEndTime).format('HH:mm')
    );
    // 代收
    if(smObj.smAgencyFund === 0) {
      jqueryMap.$smAgencyFund_tr.hide();
    } else {
      jqueryMap.$smAgencyFund_td.text(smObj.smAgencyFund / -100);
      // 代收状态
      if(smObj.smAgencyFundState) {
        jqueryMap.$smAgencyFundStateSelect
          .val(smObj.smAgencyFundState)
          .prev().text(smObj.smAgencyFundState);
      } else {
        smAgencyFundStateSelect_first_option_val = jqueryMap.$smAgencyFundStateSelect.children().eq(0).val();
        jqueryMap.$smAgencyFundStateSelect
          .val(smAgencyFundStateSelect_first_option_val)
          .prev().text(smObj.smAgencyFundStateSelect_first_option_val);
      }
      jqueryMap.$smAgencyFund_tr.show();
    }
    // 代付
    if(smObj.smPayment  === 0) {
      jqueryMap.$smPayment_tr.hide();
    } else {
      jqueryMap.$smPayment_td.text(smObj.smPayment / 100);
      // 代付状态
      if(smObj.smPaymentState) {
        jqueryMap.$smPaymentStateSelect
          .val(smObj.smPaymentState)
          .prev().text(smObj.smPaymentState);
      } else {
        smPaymentStateSelect_first_option_val = jqueryMap.$smPaymentStateSelect.children().eq(0).val();
        jqueryMap.$smPaymentStateSelect
          .val(smPaymentStateSelect_first_option_val)
          .prev().text(smPaymentStateSelect_first_option_val);
      }
      jqueryMap.$smPayment_tr.show();
    }
    // 服务状态
    if(smObj.serverState) {
      jqueryMap.$serverStateSelect
        .val(smObj.serverState)
        .prev().text(smObj.serverState);
    } else {
      serverStateSelect_first_option_val = jqueryMap.$serverStateSelect.children().eq(0).val();
      jqueryMap.$serverStateSelect
        .val(serverStateSelect_first_option_val)
        .prev().text(serverStateSelect_first_option_val);
    }
    // 服务备注
    if(smObj.serverNote) {
      jqueryMap.$serverNoteDiv.html(smObj.serverNote);
    } else {
      jqueryMap.$serverNoteDiv.html('');
    }
  };
  // 操作-保险
  insurance_pageinit = function(event) {
    console.log('insurance_pageinit');
    pingan.setJqueryMap();

    pingan.getJqueryMap().$zx_pingan_submit.on('tap', function(e) {
      if (pingan.getStateMap().zx_pingan_submit_on_taping === false) {
        //pingan.set_zx_pingan_submit_on_taping(true);
        pingan.zx_pingan_submit_on_tap();
      } else {
        console.log('pingan.getStateMap().zx_pingan_submit_on_taping:' + pingan.getStateMap().zx_pingan_submit_on_taping);
      }
      
      e.preventDefault();
      //e.stopPropagation();
    });

    pingan.getJqueryMap().$kb_pingan_tbody
      // 点击序号单元格
      .on('tap','.zx-pingan-snTd', pingan.on_snTd_click)
      // 点击姓名单元格
      .on('tap','.zx-pingan-nameTd', pingan.on_nameTd_click)
      // 姓名输入框
      .on('change','.zx-pingan-td-nameInput', pingan.on_nameInput_change)
      // 证件类型
      .on('change','.zx-pingan-td-cardCategorySelect', pingan.on_cardCategorySelect_change)
      // 证件号码
      .on('change','.zx-pingan-td-cardNumInput', pingan.on_cardNumInput_change)
      // 出生日期
      .on('change','.zx-pingan-td-birthdayInput', pingan.on_birthdayInput_change)
      // 性别
      .on('change','.zx-pingan-td-sexInput', pingan.on_sexInput_change)
      // 保险卡密码
      .on('change','.zx-pingan-td-passwordInput', pingan.on_passwordInput_change);

    pingan.getJqueryMap().$shortNumInput.on('change', pingan.shortNumInput_on_change);

  };
  insurance_pagebeforeshow = function(event) {
    console.log('insurance_pagebeforeshow');
    pingan.getJqueryMap().$insurance_main.hide();
  };
  insurance_pageshow = function(event) {
    console.log('insurance_pageshow');
    $.mobile.loading('show');
    get_smResult(configMap.HASH_STR.INSURANCE_PAGE);
  };

  // 操作-短信
  msg_pageinit = function(event) {
    console.log('msg_pageinit');
    jqueryMap.$msg_main      = $('#msg-main');
    jqueryMap.$sm_msg_phones = $('#sm-msg-phones');
    jqueryMap.$sm_msg_text   = $('#sm-msg-text');
    jqueryMap.$sm_msg_switch = $('#sm-msg-switch');
    jqueryMap.$sendMsgBtn    = $('#sendMsgBtn');
    jqueryMap.$ok_msg_phones = $('#ok-msg-phones');
    jqueryMap.$ok_msg_text   = $('#ok-msg-text');

    jqueryMap.$sm_msg_switch.on('change', function() {
      if($(this).val() === 'down') {
        jqueryMap.$sm_msg_phones.hide();
        jqueryMap.$sm_msg_text.hide();

        jqueryMap.$ok_msg_phones.show();
        jqueryMap.$ok_msg_text.show();
        jqueryMap.$sendMsgBtn.attr('href','sms:' + jqueryMap.$ok_msg_phones.text() + '?body=' + jqueryMap.$ok_msg_text.text());
      } else {
        jqueryMap.$sm_msg_phones.show();
        jqueryMap.$sm_msg_text.show();
        jqueryMap.$sendMsgBtn.attr('href','sms:' + jqueryMap.$sm_msg_phones.text() + '?body=' + jqueryMap.$sm_msg_text.text());

        jqueryMap.$ok_msg_phones.hide();
        jqueryMap.$ok_msg_text.hide();
      }
    });
  };
  msg_pagebeforeshow = function(event) {
    console.log('msg_pagebeforeshow');

    jqueryMap.$msg_main.hide();
  };
  msg_pageshow = function(event) {
    console.log('msg_pageshow');
    $.mobile.loading('show');
    get_smResult(configMap.HASH_STR.MSG_PAGE);
  };
  // 操作-编辑登机牌备注
  // kb-editdjpnote-page
  editdjpnote_pageinit = function(event) {
    console.log('editdjpnote_pageinit');
    jqueryMap.$djpNoteEditDiv = $('#djpNoteEditDiv');
    jqueryMap.$djpNoteSaveBtn  = $('#djpNoteSaveBtn');

    // 注册事件
    jqueryMap.$djpNoteSaveBtn.on('tap', function(e) {
      var obj = {};
      $(this)
        .text( '正在保存...' )
        .attr( 'disabled', true );

      obj.name      = stateMap.userObj.name;
      obj.sm        = stateMap.smObj.id;
      obj.elementId = 'djpNoteTd';
      obj.type      = 'djpNote';
      obj.val       = jqueryMap.$djpNoteEditDiv.html();
      obj.txt       = jqueryMap.$djpNoteEditDiv.text();

      obj.city = stateMap.city;
      $.post(configMap.server + 'kanban_update', obj, updateItems).error(function(e){
        alert('网络异常！保存失败');
        $(this)
          .text( '保存' )
          .attr( 'disabled', false );
      });

      e.stopPropagation();
    });
  };
  editdjpnote_pagebeforeshow = function(event) {
    console.log('editdjpnote_pagebeforeshow');
    var smObj = stateMap.smObj;
    if(smObj.djpNote) {
      jqueryMap.$djpNoteEditDiv.html(smObj.djpNote);
    } else {
      jqueryMap.$djpNoteEditDiv.html('');
    }

    jqueryMap.$djpNoteSaveBtn
      .text( '保存' )
      .attr( 'disabled', false );
  };

  // 操作-编辑服务备注
  // kb-editservernote-page
  editservernote_pageinit = function(event) {
    console.log('editservernote_pageinit');
    jqueryMap.$serverNoteEditDiv = $('#serverNoteEditDiv');
    jqueryMap.$serverNoteSaveBtn  = $('#serverNoteSaveBtn');

    // 注册事件
    jqueryMap.$serverNoteSaveBtn.on('tap', function(e) {
      var obj = {};
      $(this)
        .text( '正在保存...' )
        .attr( 'disabled', true );

      obj.name      = stateMap.userObj.name;
      obj.sm        = stateMap.smObj.id;
      obj.elementId = 'serverNoteTd';
      obj.type      = 'serverNote';
      obj.val       = jqueryMap.$serverNoteEditDiv.html();
      obj.txt       = jqueryMap.$serverNoteEditDiv.text();

      obj.city = stateMap.city;
      $.post(configMap.server + 'kanban_update', obj, updateItems).error(function(e){
        alert('网络异常！保存失败');
        $(this)
          .text( '保存' )
          .attr( 'disabled', false );
      });

      e.stopPropagation();
    });
  };
  editservernote_pagebeforeshow = function(event) {
    console.log('editservernote_pagebeforeshow');
    var smObj = stateMap.smObj;
    if(smObj.serverNote) {
      jqueryMap.$serverNoteEditDiv.html(smObj.serverNote);
    } else {
      jqueryMap.$serverNoteEditDiv.html('');
    }

    jqueryMap.$serverNoteSaveBtn
      .text( '保存' )
      .attr( 'disabled', false );
  };

  // 操作-修改删除改签航班
  // kb-editflight-page
  editflight_pageinit = function(event) {
    console.log('editflight_pageinit');
    jqueryMap.$flightDateTd         = $('#flightDateTd'); 
    jqueryMap.$flightDateInput      = $('#flightDateInput');
    jqueryMap.$flightNumTd          = $('#flightNumTd'); 
    jqueryMap.$flightNumInput       = $('#flightNumInput');
    jqueryMap.$flightStartCityTd    = $('#flightStartCityTd'); 
    jqueryMap.$flightStartCityInput = $('#flightStartCityInput');
    jqueryMap.$flightEndCityTd      = $('#flightEndCityTd'); 
    jqueryMap.$flightEndCityInput   = $('#flightEndCityInput');
    jqueryMap.$flightStartTimeTd    = $('#flightStartTimeTd'); 
    jqueryMap.$flightStartTimeInput = $('#flightStartTimeInput');
    jqueryMap.$flightEndTimeTd      = $('#flightEndTimeTd'); 
    jqueryMap.$flightEndTimeInput   = $('#flightEndTimeInput');
    jqueryMap.$flightSearchBtn      = $('#flightSearchBtn'); 
    jqueryMap.$flightUpdateBtn      = $('#flightUpdateBtn');  
    jqueryMap.$flightDelBtn         = $('#flightDelBtn'); 
    jqueryMap.$flightSaveBtn        = $('#flightSaveBtn');

    jqueryMap.$set_flight_div        = $('#set_flight_div');
    jqueryMap.$set_flight_field      = $('#set_flight_field');
    /*jqueryMap.$set_flight_input_one  = $('#set_flight_input_one'); 
    jqueryMap.$set_flight_label_one  = $('#set_flight_label_one');
    jqueryMap.$set_flight_input_two  = $('#set_flight_input_two'); 
    jqueryMap.$set_flight_label_two  = $('#set_flight_label_two');
    jqueryMap.$set_flight_input_three= $('#set_flight_input_three'); 
    jqueryMap.$set_flight_label_three= $('#set_flight_label_three');*/

    // 注册事件
    jqueryMap.$set_flight_field.on('change', '.set_flight_input', function(e) {
      var $that = $(this),
          data_flight;

      if ($that.val() === '0') {
        data_flight = jqueryMap.$set_flight_input_one.data('flight');
        jqueryMap.$flightStartCityInput.val(data_flight.flightStartCity);
        jqueryMap.$flightEndCityInput.val(data_flight.flightEndCity);
        jqueryMap.$flightStartTimeInput.val(data_flight.flightStartTime);
        jqueryMap.$flightEndTimeInput.val(data_flight.flightEndTime);
      } else if ($that.val() === '1') {
        data_flight = jqueryMap.$set_flight_input_two.data('flight');
        jqueryMap.$flightStartCityInput.val(data_flight.flightStartCity);
        jqueryMap.$flightEndCityInput.val(data_flight.flightEndCity);
        jqueryMap.$flightStartTimeInput.val(data_flight.flightStartTime);
        jqueryMap.$flightEndTimeInput.val(data_flight.flightEndTime);
      } else if ($that.val() === '2') {
        data_flight = jqueryMap.$set_flight_input_three.data('flight');
        jqueryMap.$flightStartCityInput.val(data_flight.flightStartCity);
        jqueryMap.$flightEndCityInput.val(data_flight.flightEndCity);
        jqueryMap.$flightStartTimeInput.val(data_flight.flightStartTime);
        jqueryMap.$flightEndTimeInput.val(data_flight.flightEndTime);
      }

      e.preventDefault();
      e.stopPropagation();
    });
    jqueryMap.$flightSearchBtn.on('tap', function(e) {
      var 
        $that      = $(this),
        obj        = {},
        appkey     = '4ebfb6d8b4603b42fdb094172cb8bc46',
        url        = 'http://apis.juhe.cn/plan/s',
        result     = [],
        flightInfo = [],
        i, len;

      obj.flightDate      = jqueryMap.$flightDateInput.val().trim();
      if(obj.flightDate.length === 8) {
        obj.flightDate = obj.flightDate.substr(0, 4) + '-' + obj.flightDate.substr(4, 2) + '-' + obj.flightDate.substr(6, 2);
      }
      obj.flightNum       = jqueryMap.$flightNumInput.val().trim();

      // 验证字段有效性
      try {
        // flightDate
        if(!check_date(obj.flightDate)) {
          throw new Error("请检查航班日期格式是否正确！");
        }

        // flightNum 不能为空
        if(obj.flightNum === '') {
          throw new Error("航班不能为空！");
        }

        $that
          .text( '正在查询...' )
          .attr( 'disabled', true );

        $.mobile.loading('show');

        $.getJSON(url+"?callback=?", {
          "name" : obj.flightNum,
          "date" : obj.flightDate,
          "dtype" : "jsonp",
          "key" : appkey
        }, function(data) {
          var errorcode = data.error_code;
          if( errorcode ==0){
            //数据正常返回
            if(Array.isArray(data.result)) {
              result = data.result;

              if(result.length === 1 || result.length === 3) {
                for(i = 0, len = result.length; i < len; i++) {
                  flightInfo.push(getF(result[i]));
                }

                //console.log(flightInfo);

                if(flightInfo.length === 1){
                  jqueryMap.$flightStartCityInput.val(flightInfo[0].flightStartCity);
                  jqueryMap.$flightEndCityInput.val(flightInfo[0].flightEndCity);
                  jqueryMap.$flightStartTimeInput.val(flightInfo[0].flightStartTime);
                  jqueryMap.$flightEndTimeInput.val(flightInfo[0].flightEndTime);
                } else if (flightInfo.length === 3) {
                  jqueryMap.$set_flight_field.children().eq(0).nextAll().remove();
                  jqueryMap.$set_flight_field.append(
                    '<input class="set_flight_input" type="radio" name="set_flight_input" id="set_flight_input_one" value="0">' + 
                    '<label id="set_flight_label_one" for="set_flight_input_one">1</label>' + 
                    '<input class="set_flight_input" type="radio" name="set_flight_input" id="set_flight_input_two" value="1">' +  
                    '<label id="set_flight_label_two" for="set_flight_input_two">2</label>' + 
                    '<input class="set_flight_input" type="radio" name="set_flight_input" id="set_flight_input_three" value="2">' +  
                    '<label id="set_flight_label_three" for="set_flight_input_three">3</label>'
                  );

                  jqueryMap.$set_flight_field.trigger('create');

                  jqueryMap.$set_flight_input_one  = $('#set_flight_input_one'); 
                  jqueryMap.$set_flight_label_one  = $('#set_flight_label_one');
                  jqueryMap.$set_flight_input_two  = $('#set_flight_input_two'); 
                  jqueryMap.$set_flight_label_two  = $('#set_flight_label_two');
                  jqueryMap.$set_flight_input_three= $('#set_flight_input_three'); 
                  jqueryMap.$set_flight_label_three= $('#set_flight_label_three');


                  jqueryMap.$set_flight_label_one.text('1 ' + getS(flightInfo[0]));
                  jqueryMap.$set_flight_label_two.text('2 ' + getS(flightInfo[1]));
                  jqueryMap.$set_flight_label_three.text('3 ' + getS(flightInfo[2]));

                  jqueryMap.$set_flight_input_one.data('flight', flightInfo[0]);
                  jqueryMap.$set_flight_input_two.data('flight', flightInfo[1]);
                  jqueryMap.$set_flight_input_three.data('flight', flightInfo[2]);

                  jqueryMap.$set_flight_div.show(); // dz6253
                } else {
                  alert('1+1 = ?');
                }
              } else {
                alert('长度不对');
              }
            } else {
              alert('查无此航班');
            }
          }else{
            alert('查询失败,' + errorcode+":"+data.reason);
          }

          $.mobile.loading('hide');

          $that
            .text( '查询' )
            .attr( 'disabled', false );
        });
      } catch(err) {
        alert(err);
      }

      function getF(obj){
        //console.log(obj);
        var f = {};
        // 始发地
        if(obj.DepCode === 'PEK'){
            f.flightStartCity = '北京首都';
        } else if(obj.DepCode === 'NAY'){
            f.flightStartCity = '北京南苑';
        } else if(obj.DepCode === 'SHA'){
            f.flightStartCity = '上海虹桥';
        } else if(obj.DepCode === 'PVG'){
            f.flightStartCity = '上海浦东';
        } else {
            f.flightStartCity = obj.start;
        }

        // 抵达地
        if(obj.ArrCode === 'PEK'){
            f.flightEndCity = '北京首都';
        } else if(obj.DepCode === 'NAY'){
            f.flightEndCity = '北京南苑';
        } else if(obj.DepCode === 'SHA'){
            f.flightEndCity = '上海虹桥';
        } else if(obj.DepCode === 'PVG'){
            f.flightEndCity = '上海浦东';
        } else {
            f.flightEndCity = obj.end;
        }

        // 经停
        if(obj.AllJingTing){
            f.flightEndCity += '(经停:' + obj.AllJingTing.JingTing.JTCity + ')';
        }

        f.flightStartTime = obj.DepTime.split(' ')[1].substr(0, 5);
        f.flightEndTime = obj.ArrTime.split(' ')[1].substr(0, 5);
        //console.log(f);
        return f;
      }

      function getS(obj){

        return obj.flightStartCity + '-' + obj.flightEndCity + ' ' +
          obj.flightStartTime + '-' + obj.flightEndTime;
      }
    });
    jqueryMap.$flightUpdateBtn.on('tap', function(e) {
      var 
        CITY = stateMap.CITY,
        obj  = {};

      obj.name = stateMap.userObj.name;
      obj.sm = stateMap.smObj.id;
      obj.elementId = 'flightTd';

      obj.change = true;

      obj.flightDate_old      = stateMap.smObj.flight.flightDate;
      obj.flightNum_old       = stateMap.smObj.flight.flightNum;
      obj.flightStartCity_old = stateMap.smObj.flight.flightStartCity;
      obj.flightEndCity_old   = stateMap.smObj.flight.flightEndCity;
      obj.flightStartTime_old = stateMap.smObj.flight.flightStartTime;
      obj.flightEndTime_old   = stateMap.smObj.flight.flightEndTime;

      obj.flightDate      = jqueryMap.$flightDateInput.val().trim();
      if(obj.flightDate.length === 8) {
        obj.flightDate = obj.flightDate.substr(0, 4) + '-' + obj.flightDate.substr(4, 2) + '-' + obj.flightDate.substr(6, 2);
      }

      obj.flightNum       = jqueryMap.$flightNumInput.val().trim();
      obj.flightStartCity = jqueryMap.$flightStartCityInput.val().trim();
      obj.flightEndCity   = jqueryMap.$flightEndCityInput.val().trim();

      obj.flightStartTime = jqueryMap.$flightStartTimeInput.val().trim();
      if(obj.flightStartTime.length === 4) {
        obj.flightStartTime = obj.flightStartTime.substr(0, 2) + ':' + obj.flightStartTime.substr(2, 2);
      }
      obj.flightEndTime   = jqueryMap.$flightEndTimeInput.val().trim();
      if(obj.flightEndTime.length === 4) {
        obj.flightEndTime = obj.flightEndTime.substr(0, 2) + ':' + obj.flightEndTime.substr(2, 2);
      }

      // 验证字段有效性
      try {
        // flightDate
        if(!check_date(obj.flightDate)) {
          throw new Error("请检查航班日期格式是否正确！");
        }

        // flightNum 不能为空
        if(obj.flightNum === '') {
          throw new Error("航班不能为空！");
        }

        if(obj.flightStartCity === '') {
          throw new Error("始发城市不能为空！");
        }

        if(obj.flightEndCity === '') {
          throw new Error("抵达城市不能为空！");
        }

        if(obj.flightStartCity !== CITY && obj.flightEndCity.indexOf(CITY) === -1) {
          throw new Error("城市必须有一个是" + CITY);
        }

        if(obj.flightStartCity_old === CITY && obj.flightStartCity !== CITY) {
          throw new Error("始发城市必须是" + CITY);
        }

        if(obj.flightEndCity_old.indexOf(CITY) !== -1 && obj.flightEndCity.indexOf(CITY) === -1) {
          throw new Error("抵达城市必须是" + CITY);
        }

        if(obj.flightStartCity === CITY && obj.flightEndCity.indexOf(CITY) !== -1) {
          throw new Error("城市必须有一个不是" + CITY);
        }

        if(!check_time(obj.flightStartTime)) {
          throw new Error("请检查起飞时间格式是否正确！");
        }

        if(!check_time(obj.flightEndTime)) {
          throw new Error("请检查落地时间格式是否正确！");
        }

        $(this)
          .text( '正在修改...' )
          .attr( 'disabled', true );

        obj.city = stateMap.city;
        $.post(configMap.server + 'kanban_update', obj, updateItems).error(function(e){
          alert('网络异常！保存失败');
          $(this)
            .text( '修改' )
            .attr( 'disabled', false );
        });
      } catch(err) {
        alert(err);
      }

      e.preventDefault();
      e.stopPropagation();
    });
    jqueryMap.$flightDelBtn.on('tap', function(e) {
      var obj = {};

      obj.name = stateMap.userObj.name;
      obj.sm = stateMap.smObj.id;
      obj.elementId = 'flightTd';

      obj.flightDate      = stateMap.smObj.flight_gai.flightDate_old;
      obj.flightNum       = stateMap.smObj.flight_gai.flightNum_old;
      obj.flightStartCity = stateMap.smObj.flight_gai.flightStartCity_old;
      obj.flightEndCity   = stateMap.smObj.flight_gai.flightEndCity_old;
      obj.flightStartTime = stateMap.smObj.flight_gai.flightStartTime_old;
      obj.flightEndTime   = stateMap.smObj.flight_gai.flightEndTime_old;

      $(this)
        .text( '正在删除改签...' )
        .attr( 'disabled', true );

      obj.city = stateMap.city;
      $.post(configMap.server + 'kanban_del_flight_gai', obj, del_flight_gai_comp).error(function(e){
        alert('网络异常！保存失败');
        $(this)
          .text( '删除改签' )
          .attr( 'disabled', false );
      });

      e.preventDefault();
      e.stopPropagation();
    });
    jqueryMap.$flightSaveBtn.on('tap', function(e) {
      var 
        CITY = stateMap.CITY,
        obj  = {};

      obj.name = stateMap.userObj.name;
      obj.sm = stateMap.smObj.id;
      obj.elementId = 'flightTd';

      obj.flightDate_old      = stateMap.smObj.flight.flightDate;
      obj.flightNum_old       = stateMap.smObj.flight.flightNum;
      obj.flightStartCity_old = stateMap.smObj.flight.flightStartCity;
      obj.flightEndCity_old   = stateMap.smObj.flight.flightEndCity;
      obj.flightStartTime_old = stateMap.smObj.flight.flightStartTime;
      obj.flightEndTime_old   = stateMap.smObj.flight.flightEndTime;

      obj.flightDate      = jqueryMap.$flightDateInput.val().trim();
      if(obj.flightDate.length === 8) {
        obj.flightDate = obj.flightDate.substr(0, 4) + '-' + obj.flightDate.substr(4, 2) + '-' + obj.flightDate.substr(6, 2);
      }

      obj.flightNum       = jqueryMap.$flightNumInput.val().trim();
      obj.flightStartCity = jqueryMap.$flightStartCityInput.val().trim();
      obj.flightEndCity   = jqueryMap.$flightEndCityInput.val().trim();

      obj.flightStartTime = jqueryMap.$flightStartTimeInput.val().trim();
      if(obj.flightStartTime.length === 4) {
        obj.flightStartTime = obj.flightStartTime.substr(0, 2) + ':' + obj.flightStartTime.substr(2, 2);
      }
      obj.flightEndTime = jqueryMap.$flightEndTimeInput.val().trim();
      if(obj.flightEndTime.length === 4) {
        obj.flightEndTime = obj.flightEndTime.substr(0, 2) + ':' + obj.flightEndTime.substr(2, 2);
      }

      // 验证字段有效性
      try {
        // flightDate
        if(!check_date(obj.flightDate)) {
          throw new Error("请检查航班日期格式是否正确！");
        }

        // flightNum 不能为空
        if(obj.flightNum === '') {
          throw new Error("航班不能为空！");
        }

        if(obj.flightStartCity === '') {
          throw new Error("始发城市不能为空！");
        }

        if(obj.flightEndCity === '') {
          throw new Error("抵达城市不能为空！");
        }

        if(obj.flightStartCity !== CITY && obj.flightEndCity.indexOf(CITY) === -1) {
          throw new Error("城市必须有一个是" + CITY);
        }

        if(obj.flightStartCity_old === CITY && obj.flightStartCity !== CITY) {
          throw new Error("始发城市必须是" + CITY);
        }

        if(obj.flightEndCity_old.indexOf(CITY) !== -1 && obj.flightEndCity.indexOf(CITY) === -1) {
          throw new Error("抵达城市必须是" + CITY);
        }

        if(obj.flightStartCity === CITY && obj.flightEndCity.indexOf(CITY) !== -1) {
          throw new Error("城市必须有一个不是" + CITY);
        }

        if(!check_time(obj.flightStartTime)) {
          throw new Error("请检查起飞时间格式是否正确！");
        }

        if(!check_time(obj.flightEndTime)) {
          throw new Error("请检查落地时间格式是否正确！");
        }

        $(this)
          .text( '正在改签...' )
          .attr( 'disabled', true );

        obj.city = stateMap.city;
        $.post(configMap.server + 'kanban_update', obj, updateItems).error(function(e){
          alert('网络异常！保存失败');
          $(this)
            .text( '改签' )
            .attr( 'disabled', false );
        });
      } catch(err) {
        alert(err);
      }

      e.preventDefault();
      e.stopPropagation();
    });
  };
  del_flight_gai_comp = function (result) {
    var emit_kb_obj;
    //console.log(result);
    //return;
    if(result.kanban === null) {
      alert('改签航班失败！');
      // 回滚
      //huigun_del_gai();
    } else {
      emit_kb_obj = {
        //start: result.obj.start,
        flight: {
          flightDate      : result.obj.flightDate,
          flightNum       : result.obj.flightNum,
          flightStartCity : result.obj.flightStartCity,
          flightEndCity   : result.obj.flightEndCity,
          flightStartTime : result.obj.flightStartTime,
          flightEndTime   : result.obj.flightEndTime
        },
        historys: result.kanban.historys,
        route: 4
      };
      update_smObj({
        //start: result.obj.start,
        flight: {
          flightDate      : result.obj.flightDate,
          flightNum       : result.obj.flightNum,
          flightStartCity : result.obj.flightStartCity,
          flightEndCity   : result.obj.flightEndCity,
          flightStartTime : result.obj.flightStartTime,
          flightEndTime   : result.obj.flightEndTime
        },
        historys: result.kanban.historys
      }, 4);

      changeToPage(configMap.HASH_STR.DETAIL_PAGE);

      // 通知他人
      emit_kb_obj.id = result.kanban.sm;
      stateMap.sio.emit( 'emit-kb-update', emit_kb_obj);
    }
  };

  editflight_pagebeforeshow = function(event) {
    console.log('editflight_pagebeforeshow');

    jqueryMap.$set_flight_div.hide();

    jqueryMap.$flightUpdateBtn
      .text( '修改' )
      .attr( 'disabled', false );

    jqueryMap.$flightDelBtn
      .text( '删除改签' )
      .attr( 'disabled', false );

    jqueryMap.$flightSaveBtn
      .text( '改签' )
      .attr( 'disabled', false );

    if(stateMap.smObj.flight_gai) {
      jqueryMap.$flightDelBtn.show();
    } else {
      jqueryMap.$flightDelBtn.hide();
    }

    jqueryMap.$flightDateTd.text(moment(stateMap.smObj.flight.flightDate).format('YYYY-MM-DD')); 
    jqueryMap.$flightNumTd.text(stateMap.smObj.flight.flightNum); 
    jqueryMap.$flightStartCityTd.text(stateMap.smObj.flight.flightStartCity); 
    jqueryMap.$flightEndCityTd.text(stateMap.smObj.flight.flightEndCity); 
    jqueryMap.$flightStartTimeTd.text(moment(stateMap.smObj.flight.flightStartTime).format('HH:mm')); 
    jqueryMap.$flightEndTimeTd.text(moment(stateMap.smObj.flight.flightEndTime).format('HH:mm'));

    jqueryMap.$flightDateInput.val(moment(stateMap.smObj.flight.flightDate).format('YYYY-MM-DD'));     
    jqueryMap.$flightNumInput.val(stateMap.smObj.flight.flightNum);            
    jqueryMap.$flightStartCityInput.val(stateMap.smObj.flight.flightStartCity);      
    jqueryMap.$flightEndCityInput.val(stateMap.smObj.flight.flightEndCity);        
    jqueryMap.$flightStartTimeInput.val(moment(stateMap.smObj.flight.flightStartTime).format('HH:mm'));      
    jqueryMap.$flightEndTimeInput.val(moment(stateMap.smObj.flight.flightEndTime).format('HH:mm'));
  };

  // 名单
  sm_pageinit = function(event) {
    console.log('sm_pageinit');
    jqueryMap.$sm_main     = $('#sm-main');
    jqueryMap.$sm_listview = $('#sm-listview');
  };
  sm_pageshow = function(event) {
    console.log('sm_pageshow');
    $.mobile.loading('show');
    jqueryMap.$sm_main.hide();
    get_smResult(configMap.HASH_STR.SM_PAGE);
  };

  // kb-flight-page
  // flight 页面初始化
  flight_pageinit = function(event) {
    console.log('flight_pageinit');
    jqueryMap.$flight_main_before = $('#flight-main-before');
    jqueryMap.$flight_main        = $('#flight-main');
    jqueryMap.$flight_main_span   = $('#flight-main-span');
    jqueryMap.$flight_panel       = $('#flight-panel');
  };
  flight_pageshow = function(event) {
    console.log('flight_pageshow');

    if (!stateMap.smObj) {
      // 切换到 #index 页面
      changeToPage(configMap.HASH_STR.INDEX_PAGE);
      return;
    }

    jqueryMap.$flight_main_before.hide();
    jqueryMap.$flight_main.hide();
    jqueryMap.$flight_panel.empty();

    if(moment(stateMap.thisDate).isSame(moment(), 'day')) {
      jqueryMap.$flight_main_span.text(stateMap.smObj.flight.flightNum);
      //jqueryMap.$flight_main.show();
      $.mobile.loading('show');
      //异步获取航班信息
      // 去哪儿
      qunar(stateMap.smObj);

      return;
    }

    jqueryMap.$flight_main_before.show();
  };

  // kb-history-page
  // history 页面初始化
  history_pageinit = function(event) {
    console.log('history_pageinit');
    jqueryMap.$kb_item_history = $('#kb-item-history');
  };
  // history show
  history_pagebeforeshow = function(event) {
    var smObj = stateMap.smObj;
    // 操作记录
    jqueryMap.$kb_item_history.empty();
    if(smObj.historys) {
      updateHistorys(smObj.historys);
    }
  };
  updateHistorys = function(historys) {
    historys.forEach(function(item) {
      jqueryMap.$kb_item_history.append('<li class="list-group-item">' + item.iTime + ' ' + item.iText + '</li>');
    });
    jqueryMap.$kb_item_history.listview("refresh");
  };


  // --------------------------------
  set_smObj = function(id) {
    var i, len, item;

    stateMap.smObj = null;
    for(i = 0, len = stateMap.events.length; i < len; i++) {
      item = stateMap.events[i];
      
      if(id === item.id){
        stateMap.smObj = item;
        break;
      }
    };
  };

  // 程序初始化
  initModule = function() {
    var 
      two_level_domain_name = document.location.host.split('.')[0],
      citys                 = configMap.citys,
      user_option_html_arr  = [],
      serverman_option_html_arr = [],
      setplace_option_html_arr = [],
      user_option_arr, serverman_option_arr, setplace_option_arr,
      userObj, i, len, user;
    
    if (citys[two_level_domain_name]) {
      // 设置 city
      stateMap.city = two_level_domain_name;
      pingan.setCity(stateMap.city);
      stateMap.CITY = citys[two_level_domain_name].city;

      // 初始化用户列表
      user_option_arr = configMap.user_options[two_level_domain_name];
      //console.log(user_option_arr);
      user_option_arr.forEach(function(item) {
        user_option_html_arr.push('<option class="' + item.value + '" value="' + item.value + '">' + item.text + '</option>');
      });
      $('#userNameSelect').html(user_option_html_arr.join(''));

      // 初始化现场负责 <option value="待定">待定</option>
      serverman_option_arr = configMap.serverman_options[two_level_domain_name];
      serverman_option_arr.forEach(function(item) {
        serverman_option_html_arr.push('<option value="' + item + '">' + item + '</option>');
      });
      $('#servermanSelect').html(serverman_option_html_arr.join(''));

      // 初始化集合地点 <option value="2">2</option>
      setplace_option_arr = configMap.setplace_options[two_level_domain_name];
      setplace_option_arr.forEach(function(item) {
        setplace_option_html_arr.push('<option value="' + item + '">' + item + '</option>');
      });
      $('#smSetPlaceSelect').html(setplace_option_html_arr.join(''));
    
      // 检查浏览器是否支持离线缓存与本地储存
      if (window.applicationCache && window.localStorage) {
        stateMap.canOfflineUse = true;
      }

      if (stateMap.canOfflineUse) {
        // 用本地储存初始化stateMap中的 userObj thisDate servermans events calEvent_id
        if(window.localStorage.userObj) {
          userObj = JSON.parse(window.localStorage.userObj);
          if (userObj.userName) {
            for (i = 0, len = user_option_arr.length; i < len; i++) {
              user = user_option_arr[i];
              if (user.value === userObj.userName) {
                stateMap.userObj = userObj;
                break;
              }
            }
          }
        }

        if(window.localStorage.thisDate && window.localStorage.servermans && window.localStorage.events) {
          stateMap.thisDate   = window.localStorage.thisDate;
          stateMap.servermans = JSON.parse(window.localStorage.servermans);
          stateMap.events     = JSON.parse(window.localStorage.events);

          if(window.localStorage.calEvent_id) {
            stateMap.calEvent_id = window.localStorage.calEvent_id;
            set_smObj(stateMap.calEvent_id);
          }
        }
      }

      // 页面事件注册
      bindPageEvent();


      // 如果可以离线使用本程序
      if (stateMap.canOfflineUse) {
        // 监听离线缓存事件
        bindApplicationCacheEvent();
        return;
      }

      // 不能离线使用，待找到这个浏览器后测试使用
      alert('告诉我你用的什么浏览器，何苗短号：559');
    } else {
      document.body.innerHTML = '<div style="text-align: center; font-size: 24px; color: red;">网址错误</div>';
    }
  };

  // 立即执行
  initModule();


  // 对外暴露的接口
  getConfigMap = function() {

    return configMap;
  };
  getStateMap = function() {

    return stateMap;
  };
  getJqueryMap = function() {

    return jqueryMap;
  };
  return {
    getConfigMap : getConfigMap,
    getStateMap  : getStateMap,
    getJqueryMap : getJqueryMap
  };
})();