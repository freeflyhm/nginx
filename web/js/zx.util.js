/**
 * zx.util.js
 * General JavaScript utilities
**/

/*jslint          browser : true,  continue : true,
  devel  : true,  indent  : 2,     maxerr   : 50,
  newcap : true,  nomen   : true,  plusplus : true,
  regexp : true,  sloppy  : true,  vars     : false,
  white  : true
*/
/*global $, zx */

zx.util = (function () {
  'use strict';
  var 
    countFees, // 计算服务费
    getMyfeestempItem, // 获取服务计费子项
    getSmTimeSpace,
    getSetTime, // 集合时间
    getSmTypeFromStr, // 例子：由'机场内送机' 得到 11
    //-- 检查身份证, 计算年龄, 计算年龄段
    checkIdCardField, checkBirthday, checkSex, checkPhoneNum,
    getAge, getAgeType, getSmSetTimeType,
    makeError, setConfigMap;

  /* obj 参数 计算服务费
  {
    myfeestempItem : 计费模板项, obj
    smRealNumber   : 实际人数,   Number
    smSetTime      : 集合时间,   String
    smDate         : 服务日期    String
  }
  */
  countFees = function(obj){
    var fees            = 0,
        basFees, addFees, putFees,
        startTime, endTime, minusNum,
        myfeestempItem  = obj.myfeestempItem,
        smRealNumber    = obj.smRealNumber,
        smDate          = obj.smDate,
        dateArr         = smDate.split('-'),
        smSetTimeArr    = obj.smSetTime.split(':'),
        smSetTime       = new Date(dateArr[0], dateArr[1], dateArr[2], smSetTimeArr[0], smSetTimeArr[1], '00'),
        addStartTimeArr = myfeestempItem.addStartTime.split(':'),
        addStartTime    = new Date(dateArr[0], dateArr[1], dateArr[2], addStartTimeArr[0], addStartTimeArr[1], '00'),
        addEndTimeArr   = myfeestempItem.addEndTime.split(':'),
        addEndTime      = new Date(dateArr[0], dateArr[1], dateArr[2], addEndTimeArr[0], addEndTimeArr[1], '00');

    //console.log(addEndTime);
    // 基本服务费 : 基本起步价格basStepPrice 最高价格basMaxPrice
    // --取值公式 : Min(basStepPrice * 人数smRealNumber, basMaxPrice)
    // basFees
    //console.log(myfeestempItem.basStepPrice);

    basFees = Math.min( (myfeestempItem.basStepPrice * smRealNumber), myfeestempItem.basMaxPrice );
    //console.log(basFees);
    // 加班费     : 开始时间addStartTime 截止时间addEndTime 收费addPrice
    // --取值公式 : ( addStartTime < 集合时间smSetTime < addEndTime ) ? addPrice : 0
    // addFees
    addFees = 0;
    // 先看 开始时间是否大于截止时间
    if( addStartTime.getTime() > addEndTime.getTime() ) {
        // 取反
        // 集合时间smSetTime 不在 startTime 到 endTime 的范围内 算加班
        startTime = addEndTime.getTime();
        endTime   = addStartTime.getTime();

        if( smSetTime.getTime() <= startTime || smSetTime.getTime() >= endTime ) {
            addFees = myfeestempItem.addPrice;
        }

    } else {
        // 集合时间smSetTime 在 startTime 到 endTime 的范围内 算加班
        startTime = addStartTime.getTime();
        endTime   = addEndTime.getTime();

        if( smSetTime.getTime() >= startTime && smSetTime.getTime() <= endTime ) {
            addFees = myfeestempItem.addPrice;
        }
    }

    // 人数补贴   : 人数下限putPersonNum 超出下限部分人数的收费/人 putPrice
    // --取值公式 : (人数 - putPersonNum > 0) ? (人数 - putPersonNum) * putPrice : 0
    // putFees
    minusNum = smRealNumber - myfeestempItem.putPersonNum;
    putFees  = minusNum > 0 ? minusNum * myfeestempItem.putPrice : 0;

    fees = basFees + addFees + putFees;
    return fees;
  };   

  // 获取计费子项
  // myfeestemp 计费模板                                                   obj
  // teamType   团队类型                                                   String
  // smtype     11 机场内送机 21 机场内接机 || 12 机场外送机 22 机场外接机 Number
  getMyfeestempItem = function(obj){
      var myfeestempItem,
          myfeestemp = obj.myfeestemp,
          teamType   = obj.teamType,
          smtype     = obj.smtype;

      //console.log(myfeestemp);
      //console.log(teamType);
      //console.log(smtype);

      if(teamType === '包团'){
        switch(smtype){
          case 11: // 机场内送机 包团
            myfeestempItem = myfeestemp.t2;
            break;
          case 21: // 机场内接机 包团
            myfeestempItem = myfeestemp.t4;
            break;
          case 12: // 机场外送机 包团
            myfeestempItem = myfeestemp.t6;
            break;
          case 22: // 机场外接机 包团
            myfeestempItem = myfeestemp.t8;
            break;
        }
      } else {
        switch(smtype){
          case 11: // 机场内送机 散拼
            myfeestempItem = myfeestemp.t1;
            break;
          case 21: // 机场内接机 散拼
            myfeestempItem = myfeestemp.t3;
            break;
          case 12: // 机场外送机 散拼
            myfeestempItem = myfeestemp.t5;
            break;
          case 22: // 机场外接机 散拼
            myfeestempItem = myfeestemp.t7;       
            break;
        }
      }


      return myfeestempItem;
  };

  getSmTimeSpace = function(obj){
      //console.log(obj);
      var //flightDate   = obj.flightDate,
          smTime           = obj.smTime,
          smTimeDateStr    = moment(obj.smTime).format('YYYY-MM-DD'),
          smSetTime        = obj.smSetTime,
          moment_smSetTime = moment(smTimeDateStr + ' ' + smSetTime),
          //dateArr      = flightDate.split('-'),
          //smTimeArr    = smTime.split(':'),
          //smSetTimeArr = smSetTime.split(':'),
          //aTime        = new Date(dateArr[0], dateArr[1], dateArr[2], smTimeArr[0], smTimeArr[1], 00),
          //bTime        = new Date(dateArr[0], dateArr[1], dateArr[2], smSetTimeArr[0], smSetTimeArr[1], 00),
          
          //setTime      = (aTime.getTime() - bTime.getTime())/60000;
          setTime = moment(smTime).diff(moment_smSetTime)/60000;

      //console.log(setTime);
      return setTime;
  }

  // obj
  // -- flightDate      String
  // -- smTime          String
  // -- setTimeInputVal Number

  getSetTime = function (obj) {
      var flightDate      = obj.flightDate,
          smTime          = obj.smTime,
          setTimeInputVal = obj.setTimeInputVal,
          dateArr         = flightDate.split('-'),
          timeArr         = smTime.split(':'),
          endTime         = new Date(dateArr[0], dateArr[1], dateArr[2], timeArr[0], timeArr[1], '00'),
          setDate         = new Date(),
          settime;

      setDate.setTime(endTime.getTime() - setTimeInputVal * 60 * 1000);
      settime = (Array(2).join(0) + setDate.getHours()).slice(-2) + ':' + (Array(2).join(0) + setDate.getMinutes()).slice(-2);

      return settime;
  };

  // 例子：由'机场内送机' 得到 11
  getSmTypeFromStr = function(textStr){
      var smtype;

      switch(textStr){
          case '机场内送机':
            smtype = 11;
            break;
          case '机场外送机':
            smtype = 12;
            break;
          case '机场内接机':
            smtype = 21;
            break;
          case '机场外接机':
            smtype = 22;
            break;
      }

      return smtype;
  }

  // Begin UTILITY method /checkIdCardField/
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
  // End UTILITY method /checkIdCardField/
  
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


  // Begin UTILITY method /getAge/
  // 计算年龄
  getAge = function(year) {
    var mydate = new Date,
        now = mydate.getFullYear();
        
    return now - year;
  };
  // End UTILITY method /getAge/

  // Begin UTILITY method /getAge/
  // 计算年龄段
  getAgeType = function(age) {
    if (age < 3) {
      return '婴儿';
    }
    if (age < 13) {
      return '儿童';
    }
    if (age < 66) {
      return '成人';
    }
    return '老人';
  };
  // End UTILITY method /getAge/

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

  // Begin Public constructor /makeError/
  // Purpose: a convenience wrapper to create an error object
  // Arguments:
  //   * name_text - the error name
  //   * msg_text  - long error message
  //   * data      - optional data attached to error object
  // Returns  : newly constructed error object
  // Throws   : none
  //
  makeError = function ( name_text, msg_text, data ) {
    var error     = new Error();
    error.name    = name_text;
    error.message = msg_text;

    if ( data ){ error.data = data; }

    return error;
  };
  // End Public constructor /makeError/

  // Begin Public method /setConfigMap/
  // Purpose: Common code to set configs in feature modules
  // Arguments:
  //   * input_map    - map of key-values to set in config
  //   * settable_map - map of allowable keys to set
  //   * config_map   - map to apply settings to
  // Returns: true
  // Throws : Exception if input key not allowed
  //
  setConfigMap = function ( arg_map ){
    var
      input_map    = arg_map.input_map,
      settable_map = arg_map.settable_map,
      config_map   = arg_map.config_map,
      key_name, error;

    for ( key_name in input_map ){
      if ( input_map.hasOwnProperty( key_name ) ){
        if ( settable_map.hasOwnProperty( key_name ) ){
          config_map[key_name] = input_map[key_name];
        }
        else {
          error = makeError( 'Bad Input',
            'Setting config key |' + key_name + '| is not supported'
          );
          throw error;
        }
      }
    }
  };
  // End Public method /setConfigMap/

  return {
    countFees         : countFees,
    getMyfeestempItem : getMyfeestempItem,
    getSmTimeSpace    : getSmTimeSpace,
    getSetTime        : getSetTime,
    getSmTypeFromStr  : getSmTypeFromStr,
    checkIdCardField  : checkIdCardField,
    checkBirthday     : checkBirthday,
    checkSex          : checkSex,
    checkPhoneNum     : checkPhoneNum,
    getAge            : getAge,
    getAgeType        : getAgeType,
    getSmSetTimeType  : getSmSetTimeType,
    makeError         : makeError,
    setConfigMap      : setConfigMap
  };
}());