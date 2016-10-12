/**
 * zx.util_b.js
 * JavaScript browser utilities
**/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global $, zx */
zx.util_b = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  var
    configMap = {
      regex_encode_html  : /[&"'><]/g,
      regex_encode_noamp : /["'><]/g,
      html_encode_map    : {
        '&' : '&#38;',
        '"' : '&#34;',
        "'" : '&#39;',
        '>' : '&#62;',
        '<' : '&#60;'
      }
    },
    validators = {
      bpCompanyName : {
        validators: {
          notEmpty: {
            message: '公司是必填字段'
          },
          companyIsNotFind: {
            message: '公司不存在'
          }
        }
      }, 
      bpNoteValidators : {
        validators: {
          notEmpty: {
            message: '备注是必填字段'
          }
        }
      },
      bpNumValidators : {
        validators: {
          notEmpty: {
            message: '金额是必填字段'
          },
          regexp: {
            regexp: /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/,
            message: '保留两位小数'
          }
        }
      },
      companyIdcardfeeValidators: {
        validators: {
          notEmpty: {
            message: '验证费是必填字段'
          },
          regexp: {
            regexp: /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/,
            message: '保留两位小数'
          }
        }
      },
      datetimePicker : {
        validators: {
          notEmpty: {
            message: '日期是必填字段'
          },
          date: {
            format: 'YYYY-MM-DD'
          }
        }
      },
      userNameValidators : {
        validators: {
          notEmpty: {
            message: '用户名是必填字段'
          },
          stringLength: {
            min: 2,
            max: 15,
            message: '用户名长度2~15位'
          },
          different: {
            field: 'user[password]',
            message: '用户名和密码不能相同'
          },
          /*regexp: {
            regexp: /^[a-zA-Z0-9]*$/,
            message: '字母或数字组合'
          },*/
          errUserName: {
            message: '用户名不合法'
          },
          notFind: {
            message: '不存在此用户'
          },
          canNotLogin: {
            message: '无登录权限'
          },
          examine: {
            message: '账户审核中...'
          },
          errCity: {
            message: '你没有权限登录这个城市, 如有业务需求, 请向管理员申请权限.'
          }
        }
      }, 
      passwordValidators : {
        validators: {
          notEmpty: {
            message: '密码是必填字段'
          },
          stringLength: {
            min: 6,
            max: 20,
            message: '密码长度6~20位'
          },
          different: {
            field: 'user[userName]',
            message: '密码不能和用户名相同'
          },
          errPassword: {
            message: '密码不合法'
          },
          errPassword2: {
            message: '密码错误'
          }
        }
      }, 
      companyName : {
        validators: {
          notEmpty: {
            message: '公司是必填字段'
          },
          stringLength: {
            min: 2,
            max: 15,
            message: '公司长度介于 2 和 15 之间'
          },
          errCompanyName: {
            message: '公司不合法'
          },
          companyIsFind: {
            message: '公司已存在'
          }
        }
      }, 
      registerUserName : {
        validators: {
          notEmpty: {
            message: '用户名是必填字段'
          },
          stringLength: {
            min: 2,
            max: 15,
            message: '用户名长度介于 2 和 15 之间'
          },
          different: {
            field: 'user[password]',
            message: '用户名和密码不能相同'
          },
          regexp: {
            regexp: /^[a-zA-Z0-9]*$/,
            message: '用户名是字母或数字组合'
          },
          errUserName: {
            message: '用户名不合法'
          },
          userNameIsFind: {
            message: '用户名已存在'
          }
        }
      }, 
      registerPassword : {
        validators: {
          notEmpty: {
            message: '密码是必填字段'
          },
          stringLength: {
            min: 6,
            max: 20,
            message: '密码长度介于 6 和 20 之间'
          },
          different: {
            field: 'user[userName]',
            message: '密码不能和用户名相同'
          },
          identical: {
            field: 'user[password_re]',
            message: '密码和确认密码必须一致'
          },
          errPassword: {
            message: '密码不合法'
          }
        }
      }, 
      password_re : {
        validators: {
          notEmpty: {
            message: '确认密码是必填字段'
          },
          identical: {
            field: 'user[password]',
            message: '确认密码必须和密码一致'
          },
          errPassword_re: {
            message: '确认密码不合法'
          }
        }
      }, 
      user_name : {
        validators: {
          notEmpty: {
            message: '姓名是必填字段'
          },
          stringLength: {
            min: 2,
            max: 4,
            message: '姓名长度介于 2 和 4 之间'
          },
          regexp: {
            regexp: /^[\u4E00-\uFA29]*$/,
            message: '姓名必须是中文字符'
          },
          errName: {
            message: '姓名不合法'
          }
        }
      }, 
      phone : {
        validators: {
          notEmpty: {
            message: '手机号是必填字段'
          },
          regexp: {
            regexp: /^1\d{10}$/,
            message: '11位有效手机号码'
          },
          errPhone: {
            message: '手机号不合法'
          }
        }
      }, 
      companyAbbr : {
        validators: {
          notEmpty: {
            message: '公司简称是必填字段'
          },
          stringLength: {
            min: 2,
            max: 8,
            message: '公司简称长度介于 2 和 8 之间'
          },
          errCompanyAbbr: {
            message: '公司简称不合法'
          }
        }
      }, 
      companyTel : {
        validators: {
          regexp: {
            regexp: /^((\d{3,4})-)(\d{7,8})(-(\d{1,3}))?$/,
            message: '电话格式不对'
          }
        }
      }, 
      companyFax : {
        validators: {
          regexp: {
            regexp: /^(\d{3,4}-)?\d{7,8}$/,
            message: '传真格式不对'
          }
        }
      }, 
      userQQ : {
        validators: {
          regexp: {
            regexp: /^\d*$/,
            message: 'QQ格式不对'
          }
        }
      }, 
      resetPassword : {
        validators: {
          notEmpty: {
            message: '密码是必填字段'
          },
          stringLength: {
            min: 6,
            max: 20,
            message: '密码长度介于 6 和 20 之间'
          },                       
          identical: {
            field: 'user[password_re]',
            message: '密码和确认密码必须一致'
          },
          errPasswordName: {
            message: '密码不能和用户名相同'
          },
          errPassword: {
            message: '密码不合法'
          }
        }
      }, 
      password_old : {
        validators: {
          notEmpty: {
            message: '旧密码是必填字段'
          },
          stringLength: {
            min: 6,
            max: 20,
            message: '旧密码长度介于 6 和 20 之间'
          },    
          different: {
            field: 'user[password]',
            message: '旧密码不能和新密码相同'
          },                                           
          errPasswordOld: {
            message: '旧密码不正确'
          }
        }
      }, 
      password_new : {
        validators: {
          notEmpty: {
            message: '新密码是必填字段'
          },
          stringLength: {
            min: 6,
            max: 20,
            message: '新密码长度介于 6 和 20 之间'
          }, 
          different: {
            field: 'user[password_old]',
            message: '新密码不能和旧密码相同'
          },                      
          identical: {
            field: 'user[password_re]',
            message: '新密码和确认密码必须一致'
          },
          errPasswordName: {
            message: '新密码不能和用户名相同'
          },
          errPassword: {
            message: '新密码不合法'
          }
        }
      }, 
      airCode : {
        validators: {
          notEmpty: {
            message: '代码是必填字段'
          },
          regexp: {
            regexp: /^[A-Z0-9]{2}$/,
            message: '代码是两位大写字母或数字'
          },
          errAirCode: {
            message: '代码不合法'
          },
          airCodeIsFind: {
            message: '代码已存在'
          }
        }
      }, 
      place : {
        validators: {
          notEmpty: {
            message: '集合地点是必填字段'
          },
          errPlace: {
            message: '集合地点不合法'
          }
        }
      }, 
      flagName : {
        validators: {
          notEmpty: {
            message: '旗子名是必填字段'
          },
          stringLength: {
            min: 2,
            max: 15,
            message: '旗子名2~15个字符'
          }
        }
      }, 
      flagColor : {
        validators: {
          notEmpty: {
            message: '颜色是必填字段'
          },
          stringLength: {
            min: 2,
            max: 15,
            message: '颜色长度2~15个字符'
          }
        }
      },
      teamNum : {
        validators: {
          notEmpty: {
            message: '团号是必填字段'
          }
        }
      }, 
      planNumber : {
        validators: {
          greaterThan: {
            value: 1,
            message: '计划人数是>0的整数'
          }
        }
      }, 
      airportCity : {
        validators: {
          notEmpty: {
            message: '城市是必填字段'
          }
        }
      }, 
      airportName : {
        validators: {
          notEmpty: {
            message: '机场是必填字段'
          },
          errAirportName : {
            message: '机场已存在'
          }
        }
      },
      companyCategory : {
        validators: {
          errCompanyCategory: {
            message: '公司类型不合法'
          }
        }
      }
    },
    // 私有方法
    getCookie,  delCookie,
    // 公开方法
    setCookie,
    setCookies, getCookies, delCookies,
    decodeHtml,  encodeHtml, getEmSize,
    setHeaderNav;

  configMap.encode_noamp_map = $.extend(
    {}, configMap.html_encode_map
  );
  delete configMap.encode_noamp_map['&'];
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //------------------- BEGIN UTILITY METHODS ------------------
  setCookie = function ( c_name,value,expiredays ) {
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + expiredays );
    document.cookie = c_name+ "=" + escape(value) + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
  };

  getCookie = function( c_name ) {
    var cArr, i, len,
        cStrArr;

    if( document.cookie.length > 0 ) {
      cArr = document.cookie.split(';');
      for(i = 0, len = cArr.length; i < len; i++) {
        cStrArr = cArr[i].trim().split('=');
        if(c_name === cStrArr[0]) {
          return unescape(cStrArr[1]);
        }
      }
    }

    return "";
  };


  //为了删除指定名称的cookie，可以将其过期时间设定为一个过去的时间
  delCookie = function ( c_name ){
    var date = new Date();
    date.setTime(date.getTime() - 10000);
    document.cookie = c_name + "=a; expires=" + date.toGMTString();
  };

  setCookies = function ( result ) {
    localStorage.setItem('userObj', JSON.stringify(result.session_user));
  };

  getCookies = function () {
    var userObj = {};

    if(localStorage.userObj) {
      userObj = JSON.parse(window.localStorage.userObj);
    }

    return userObj;
  };

  delCookies = function () {
    //delCookie('service');
    /*delCookie('feestemp');
    delCookie('user_id');
    delCookie('userName');
    delCookie('role');
    delCookie('name');
    delCookie('phone');
    delCookie('sendSetTime');
    delCookie('company_id');
    delCookie('category');
    delCookie('companyAbbr');
    delCookie('thSetStr');
    delCookie('defaultFlag');*/
    localStorage.setItem('userObj', JSON.stringify({}));
  };

  // Begin decodeHtml
  // Decodes HTML entities in a browser-friendly way
  // See http://stackoverflow.com/questions/1912501/\
  //   unescape-html-entities-in-javascript
  //
  decodeHtml = function ( str ) {
    return $('<div/>').html(str || '').text();
  };
  // End decodeHtml


  // Begin encodeHtml
  // This is single pass encoder for html entities and handles
  // an arbitrary number of characters
  //
  encodeHtml = function ( input_arg_str, exclude_amp ) {
    var
      input_str = String( input_arg_str ),
      regex, lookup_map
      ;

    if ( exclude_amp ) {
      lookup_map = configMap.encode_noamp_map;
      regex      = configMap.regex_encode_noamp;
    }
    else {
      lookup_map = configMap.html_encode_map;
      regex      = configMap.regex_encode_html;
    }
    return input_str.replace(regex,
      function ( match, name ) {
        return lookup_map[ match ] || '';
      }
    );
  };
  // End encodeHtml

  // Begin getEmSize
  // returns size of ems in pixels
  //
  getEmSize = function ( elem ) {
    return Number(
      getComputedStyle( elem, '' ).fontSize.match(/\d*\.?\d*/)[0]
    );
  };
  // End getEmSize

  setHeaderNav = function( obj ) {
    var user      = obj.user,
        jqueryMap = obj.jqueryMap;
    //console.log(jqueryMap);
    jqueryMap.$headLogo.text(user.companyAbbr);
    
    jqueryMap.$navRight.removeClass('hidden');
    jqueryMap.$teamli.removeClass('hidden');
    jqueryMap.$smli.removeClass('hidden');
    jqueryMap.$myli.removeClass('hidden');
    jqueryMap.$sv10li.removeClass('hidden');
    jqueryMap.$sv20li.removeClass('hidden');
    jqueryMap.$sv30li.removeClass('hidden');
    jqueryMap.$superli.removeClass('hidden');

    if(Number(user.category) === 20){
      switch(Number(user.role)){
        case 99:
          jqueryMap.$teamli.addClass('hidden');
          jqueryMap.$smli.addClass('hidden');
          jqueryMap.$myli.addClass('hidden');
          jqueryMap.$sv10li.addClass('hidden');
          jqueryMap.$sv20li.addClass('hidden');
          jqueryMap.$sv30li.addClass('hidden');
          break;
        case 30:
          jqueryMap.$superli.addClass('hidden');
          jqueryMap.$sv10li.addClass('hidden');
          jqueryMap.$sv20li.addClass('hidden');
          jqueryMap.$sv30li.addClass('hidden');
          break;
        case 20:
          jqueryMap.$superli.addClass('hidden');
          jqueryMap.$sv10li.addClass('hidden');
          jqueryMap.$sv20li.addClass('hidden');
          jqueryMap.$sv30li.addClass('hidden');
          break;
        case 10:
          jqueryMap.$superli.addClass('hidden');
          jqueryMap.$sv10li.addClass('hidden');
          jqueryMap.$sv20li.addClass('hidden');
          jqueryMap.$sv30li.addClass('hidden');
          break;
        default:
      }
    } else if (Number(user.category) === 30) {
      switch(Number(user.role)){
        case 99:
          jqueryMap.$teamli.addClass('hidden');
          jqueryMap.$smli.addClass('hidden');
          jqueryMap.$myli.addClass('hidden');
          jqueryMap.$sv10li.addClass('hidden');
          jqueryMap.$sv20li.addClass('hidden');
          jqueryMap.$sv30li.addClass('hidden');
          break;
        case 30:
          jqueryMap.$superli.addClass('hidden');
          jqueryMap.$teamli.addClass('hidden');
          jqueryMap.$myli.addClass('hidden');
          break;
        case 20:
          jqueryMap.$superli.addClass('hidden');
          jqueryMap.$teamli.addClass('hidden');
          jqueryMap.$myli.addClass('hidden');
          jqueryMap.$sv30li.addClass('hidden');
          break;
        case 10:
          jqueryMap.$superli.addClass('hidden');
          jqueryMap.$teamli.addClass('hidden');
          jqueryMap.$myli.addClass('hidden');
          jqueryMap.$sv20li.addClass('hidden');
          jqueryMap.$sv30li.addClass('hidden');
          break;
        default:
      }
    }
  }

  // export methods
  return {
    validators : validators,
    decodeHtml : decodeHtml,
    encodeHtml : encodeHtml,
    getEmSize  : getEmSize,
    setCookie  : setCookie,
    getCookie  : getCookie,
    delCookie  : delCookie,
    setCookies : setCookies,
    getCookies : getCookies,
    delCookies : delCookies,
    setHeaderNav : setHeaderNav
  };
  //------------------- END PUBLIC METHODS ---------------------
}());