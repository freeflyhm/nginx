/**
 * zx.validator.js
 * validator feature module for zx
**/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global FormValidation, jQuery */

(function($) {
    'use strict';
    // 自定义 表单验证
    // 
    // success:10 - 公司不合法       errCompanyName
    // success:11 - 公司已存在       companyIsFind
    // success:12 - 用户名不合法     errUserName
    // success:13 - 用户名已存在     userNameIsFind
    // success:14 - 密码不合法       errPassword
    // success:15 - 公司简称不合法   errCompanyAbbr
    // success:16 - 姓名不合法       errName
    // success:17 - 手机号不合法     errPhone
    // success:18 - 用户名不存在     notFind
    // success:19 - 禁止登录         canNotLogin
    // success:20 - 密码错误         errPassword2
    // success:21 - 账号审核中...    examine
    // success:22 - 公司类型不合法   errCompanyCategory
    // success:23 - 用户权限不合法   errRole
    // success:24 - 密码与用户名相同 errUserPws
    // success:25 - 旗子名不合法     errFlag
    // success:26 - 颜色不合法       errColor
    // success:27 - 旧密码不合法     errPasswordOld
    // success:28 - 新密码不合法     errPasswordNew
    // success:29 - 城市不合法       errCity
    //
    FormValidation.Validator.companyIsNotFind = {
        validate: function(validator, $field, options) {
            var value = $field.val(),
                bpCompanysObj = zx.model.list.getBpCompanysObj();
            //console.log(value);
            if(bpCompanysObj[value]){
                return true;
            }
            
            return false;
        }
    };


    FormValidation.Validator.errCompanyName = {
        validate: function(validator, $field, options) {
            return true;
        }
    };
    FormValidation.Validator.companyIsFind = {
        validate: function(validator, $field, options) {
            return true;
        }
    };
    FormValidation.Validator.errUserName = {
        validate: function(validator, $field, options) {
            return true;
        }
    };
    FormValidation.Validator.userNameIsFind = {
        validate: function(validator, $field, options) {
            return true;
        }
    };
    FormValidation.Validator.errPassword = {
        validate: function(validator, $field, options) {
            return true;
        }
    };
    FormValidation.Validator.errCompanyAbbr = {
        validate: function(validator, $field, options) {
            return true;
        }
    };
    FormValidation.Validator.errName = {
        validate: function(validator, $field, options) {
            return true;
        }
    };
    FormValidation.Validator.errPhone = {
        validate: function(validator, $field, options) {
            return true;
        }
    };
    FormValidation.Validator.notFind = {
        validate: function(validator, $field, options) {
            return true;
        }
    };
    FormValidation.Validator.canNotLogin = {
        validate: function(validator, $field, options) {
            return true;
        }
    };
    FormValidation.Validator.errPassword2 = {
        validate: function(validator, $field, options) {
            return true;
        }
    };
    FormValidation.Validator.examine = {
        validate: function(validator, $field, options) {
            return true;
        }
    };
    FormValidation.Validator.errCity = {
        validate: function(validator, $field, options) {
            return true;
        }
    };
    FormValidation.Validator.errCompanyCategory = {
        validate: function(validator, $field, options) {
            return true;
        }
    };
    FormValidation.Validator.errRole = {
        validate: function(validator, $field, options) {
            return true;
        }
    };
    FormValidation.Validator.errUserPws = {
        validate: function(validator, $field, options) {
            return true;
        }
    };
    FormValidation.Validator.errFlag = {
        validate: function(validator, $field, options) {
            return true;
        }
    };
    FormValidation.Validator.errColor = {
        validate: function(validator, $field, options) {
            return true;
        }
    };
    FormValidation.Validator.errPasswordOld = {
        validate: function(validator, $field, options) {
            return true;
        }
    };
    FormValidation.Validator.errPasswordNew = {
        validate: function(validator, $field, options) {
            return true;
        }
    };
}(jQuery));