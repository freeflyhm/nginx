zx.config = (function () {
  console.info('开始初始化 zx.config');
  'use strict';
  var
    // 静态配置值
    configMap = {
      // io.connect
      // server: 'http://47.88.100.75:8080/',
      // server: 'http://192.168.99.100:8080/',
      server:'http://120.24.48.192:8080/',
      citys: {
        sz: { province: '广东', city: '深圳' },
        gz: { province: '广东', city: '广州' },
        hz: { province: '浙江', city: '杭州' }
      },
      anon_id: 'a0',
      setplace_text: {
        '深圳机场T3出发厅6号门'     : '小沈13510543994(6号门)',
        '深圳机场T3出发厅2号门'     : '小沈13603017047(2号门)',
        '白云机场出发厅2号门'       : '小周18802038674(2号门)',
        '白云机场出发厅16号门'      : '小周18802038674(16号门)',
        '萧山机场B航站楼出发厅11号门': '叶先生17767115960',

        '深圳机场到达厅接机口(肯德基门口)': '小汪13798258746',
        '白云机场到达厅接机口'            : '小周18802038674',
        '萧山机场到达厅接机口'            : '叶先生17767115960'
      },
      setplace_phone: {
        '深圳机场T3出发厅6号门'     : '13510543994',
        '深圳机场T3出发厅2号门'     : '13603017047',
        '白云机场出发厅2号门'       : '18802038674',
        '白云机场出发厅16号门'      : '18802038674',
        '萧山机场B航站楼出发厅11号门': '17767115960',

        '深圳机场到达厅接机口(肯德基门口)': '13798258746',
        '白云机场到达厅接机口'            : '18802038674',
        '萧山机场到达厅接机口'            : '17767115960'
      },
      setplace_call: {
        '深圳机场T3出发厅6号门'     : '15814750610',
        '深圳机场T3出发厅2号门'     : '15814750610',
        '白云机场出发厅2号门'       : '13528706248',
        '白云机场出发厅16号门'      : '13528706248',
        '萧山机场B航站楼出发厅11号门': '13905599444',

        '深圳机场到达厅接机口(肯德基门口)': '15814750610',
        '白云机场到达厅接机口'            : '13528706248',
        '萧山机场到达厅接机口'            : '13905599444'
      },
      setplace_name: {
        '深圳机场T3出发厅6号门'     : '小沈',
        '深圳机场T3出发厅2号门'     : '小沈',
        '白云机场出发厅2号门'       : '小周',
        '白云机场出发厅16号门'      : '小周',
        '萧山机场B航站楼出发厅11号门': '叶先生',
        '深圳机场到达厅接机口(肯德基门口)': '小汪',
        '白云机场到达厅接机口'            : '小周',
        '萧山机场到达厅接机口'            : '叶先生'
      },
      setplace_short: {
        '深圳机场T3出发厅6号门'     : '6',
        '深圳机场T3出发厅2号门'     : '2',
        '白云机场出发厅2号门'       : '2',
        '白云机场出发厅16号门'      : '16',
        '萧山机场B航站楼出发厅11号门': '11',
        '深圳机场到达厅接机口(肯德基门口)': '0',
        '白云机场到达厅接机口'            : '0',
        '萧山机场到达厅接机口'            : '0'
      }
    },
    // 动态状态信息
    stateMap = {
      city: '',
      cookies: null
    },
    // private
    // public
    getConfigMapItem, getStateMapItem, 
    setCookies, setStateMapItem;

  getConfigMapItem = function(item) {
    return configMap[item];
  };

  getStateMapItem = function (item) {
    return stateMap[item];
  };

  setCookies = function () {
    var
      cookies = { user_id: configMap.anon_id },
      _cookies;

    if (! stateMap.cookies) {
      if (localStorage.userObj) {
        _cookies = JSON.parse(window.localStorage.userObj);
        if ( _cookies.user_id ) {
          cookies = _cookies;
        }
      }

      stateMap.cookies = cookies;
    }
  };

  setStateMapItem = function(item, value) {
    stateMap[item] = value;
  };

  console.info('初始化成功 zx.config');
  return {
    getConfigMapItem: getConfigMapItem,
    getStateMapItem: getStateMapItem,
    setCookies: setCookies,
    setStateMapItem: setStateMapItem
  };
})();