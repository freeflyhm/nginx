/* isShowFooter phone zx-modal-header serverManSelect
 * zx.pingan.js
 * pingan module for zx
*/

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global $, zx */

zx.pingan = (function() {
	'use strict';
  	//---------------- BEGIN MODULE SCOPE VARIABLES --------------
	var
		// 静态配置值
  	configMap = {
  		captchaData : [
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
			tr_colspan_html : String()
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
			tr_html     : String()
				+ '<tr>'
					+ '<td class="zx-pingan-snTd" style="width:15%;"></td>'
					+ '<td class="zx-pingan-nameTd" style="width:30%; padding:8px 0;"></td>'
					+ '<td class="zx-pingan-cardTd"></td>'
				+ '</tr>',
			header_html : String()
				+ '<div id="zx-pingan-header" style="width: 90%;">'
					+ '<div class="input-group input-group-sm">'
						+ '<span class="input-group-btn">'
							+ '<button id="zx-pingan-submit" class="btn btn-default" type="button">开保险</button>'
						+ '</span>'
						+ '<input id="person_phone" type="text" class="form-control" placeholder="手机号码">'
  				+ '</div>'
  				+ '<div style="padding-top:5px;">'
  					//+ '已开&nbsp;<span id="insuranceCountSpan">0</span>;&nbsp;'
  					+ '选择&nbsp;<span id="nameCountSpan">0</span>;&nbsp;'
  					+ '剩余&nbsp;<span id="cardCountSpan">0</span>;'
  					+ '<input style="float:right; width: 120px;text-align:right;" id="shortNum" type="text">'
  				+ '</div>'
  			+ '</div>',
    		main_html   : String()
    			+ '<table class="table">'
    				/*+ '<thead>'
    					+ '<tr>'
    						+ '<th style="width:10%; height:0; padding:0;"></th>'
    						+ '<th style="width:35%; height:0; padding:0;"></th>'
    						+ '<th style="height:0; padding:0;"></th>'
    					+ '</tr>'
    				+ '</thead>'*/
    				+ '<tbody id="zx-pingan-tbody"></tbody>'
    			+ '</table>',
			tr_second_html : String()
				+ '<tr>'
					+ '<td colspan="3">'
						+ '<div class="input-group input-group-sm">'
		    				+ '<span class="zx-pingan-imgSpan input-group-addon" style="padding: 0;"></span>'
		    				+ '<input type="text" class="zx-pingan-imgInput form-control">'
	    				+ '</div>'
					+ '</td>'
				+ '</tr>',
			tr_err_html : String()
				+ '<tr>'
					+ '<td colspan="3">'
						+ '<span class="tr_err_span" style="color:red;"></span>'
					+ '</td>'
				+ '</tr>'
  	},
  	// 动态状态信息
  	stateMap  = {},
  	// jquery对象缓存集合
  	jqueryMap = {},
  	// UTILITY METHODS
  	isLetter,
  	// DOM METHODS
  	setJqueryMap, getImageStr, decaptcha, popoDetailTd,
  	// EVENT HANDLERS
  	on_complete_Step_1_2_downloadImg, on_complete_Step_1_5_postData,
  	on_snTd_click, on_nameTd_click,
  	on_nameInput_change, on_cardCategorySelect_change,
  	on_cardNumInput_change, on_birthdayInput_change, on_sexInput_change, on_passwordInput_change,
  	on_submit_click,
  	// PUBLIC METHODS
  	initModule;
	//----------------- END MODULE SCOPE VARIABLES ---------------


	//-------------------- BEGIN UTILITY METHODS -----------------
	isLetter = function(pixeldata){ 
    	var sum = pixeldata[0] + pixeldata[1] + pixeldata[2];

	    if (sum<6*3 || sum>250*3){ 
	        return 1; 
	    } else { 
	        return 0; 
	    }
	};
	//--------------------- END UTILITY METHODS ------------------
  
	//--------------------- BEGIN DOM METHODS --------------------
	// Begin DOM method /setJqueryMap/
	setJqueryMap = function(){
		jqueryMap.$modal_header       = stateMap.$modal_header;
		jqueryMap.$modal_body         = stateMap.$modal_body;
		//jqueryMap.$zx_pingan          = $('#zx-pingan');
		//jqueryMap.$zx_pingan_imgDiv   = $('#zx-pingan-imgSpan');
		//jqueryMap.$zx_pingan_imgInput = $('#zx-pingan-imgInput');
	};
	// End DOM method /setJqueryMap/

	// Begin DOM method /setJqueryMap/
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
	// End DOM method /setJqueryMap/

	// Begin DOM method /decaptcha/
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
	// End DOM method /decaptcha/
	
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
	//--------------------- END DOM METHODS ----------------------


	//------------------- BEGIN EVENT HANDLERS -------------------
	on_complete_Step_1_2_downloadImg = function(event, obj){
		//console.log(obj.cookies);
		var 
			date = moment(Date.now()).format('YYYYMMDDhhss'),
			$image, $tr_second, result;

		if(obj.success === 1){
			//$tr = jqueryMap.$tbody.find('tr.zx-pingan-tr-' + obj.sn);

			$image = $('<img id="zx-pingan-img" src="../code/' + obj.userName + obj.ii + '.jpg?' + date + '"/>');
			$tr_second = $(configMap.tr_second_html);
			$tr_second.find('.zx-pingan-imgSpan').html($image);

			$image.load(function(){
				result = getImageStr($image[0]);
	    		$tr_second.find('.zx-pingan-imgInput').val(result);
	    		obj.codeNum = result;
	    		//console.log(obj.codeNum);
	    		//obj.codeNum = '9999';
	    		zx.model.pingan.Step_1_5_postData(obj);
	    	});

	    	//$tr.after($tr_second);
		}
	};

	on_complete_Step_1_5_postData = function(event, obj){
		var $tr = jqueryMap.$tbody.find('tr.zx-pingan-tr-' + obj.sn),
			$nameTd = $tr.find('td.zx-pingan-nameTd'),
			$tr_glyphicon_refresh = $nameTd.find('span.glyphicon-refresh'),
			$cardTd, card_index, $tr_err;

		//$tr_glyphicon_refresh.remove();
		//console.log(obj.success);

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
	  } else if (obj.success === 31) {
			//$cardTd.append('<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>');
			$tr_glyphicon_refresh.removeClass('glyphicon-refresh').addClass('glyphicon-remove');
			$tr_err = $(configMap.tr_err_html);
			$tr_err.find('td').find('span.tr_err_span').text('系统繁忙');
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
			alert('未知错误');
		}
	};

	// 点击序号单元格
	on_snTd_click = function(){
		var $that   = $(this),
			$tr     = $that.parent(),
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

	// 点击姓名单元格
	on_nameTd_click = function(){
		var $that        = $(this),
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
			if(zx.util.checkIdCardField(person.cardNum)){
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
		if(!zx.util.checkBirthday(person.birthday)){
			// 弹出详情页 5
			popoDetailTd({
				errMsg : '出生日期检查不通过',
				person : person,
				$tr    : $tr
			});
			return;
		}

		// 检查性别
		if(!zx.util.checkSex(person.sex)){
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
			var $glyphiconOks = jqueryMap.$modal_body.find('span.glyphicon-ok'),
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
		var $that   = $(this),
			name    = $that.val().trim(),
			$tr     = $that.closest('tr'),
			$tr_pre = $tr.prev(),
			person  = $tr.data('person');

		person.name = name;
		$tr_pre.find('.zx-pingan-nameTd').text(name);
	};

	// 证件类型
	on_cardCategorySelect_change = function(){
		var $that          = $(this),
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
		var $that   = $(this),
			cardNum = $that.val().trim(),
			$tr     = $that.closest('tr'),
			$tr_pre = $tr.prev(),
			person  = $tr.data('person');
		
		person.cardNum = cardNum;
	};

	// 出生日期
	on_birthdayInput_change = function(){
		var $that    = $(this),
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
		var $that   = $(this),
			sex     = $that.val().trim(),
			$tr     = $that.closest('tr'),
			$tr_pre = $tr.prev(),
			person  = $tr.data('person');
		
		person.sex = sex;
	};

	// 保险卡密码
	on_passwordInput_change = function(){
		var $that       = $(this),
			password    = $that.val().trim(),
			$tr         = $that.closest('tr'),
			$tr_pre     = $tr.prev(),
			$cardTd     = $tr_pre.find('.zx-pingan-cardTd'), 
			card        = $cardTd.data('card');

		card.password = password;
		//console.log(card);
	};
	
	// 开保险
	on_submit_click = function(){
		var $that = $(this),
			phone = jqueryMap.$personPhoneInput.val(),
			$glyphiconOks, $nameTd, $tr, person_item, batch_item,
			ii, len_ii, $cardTd, 
			person, card,
			insuranceObj;

		$that.prop( 'disabled', true );
		// 检查手机号码
		if(!zx.util.checkPhoneNum(phone)){
			alert('手机号码检查不通过');
			$that.prop( 'disabled', false );
			return;
		}

		// 需要开保险的数组
		$glyphiconOks = jqueryMap.$modal_body.find('span.glyphicon-ok');

		for(ii = 0, len_ii = $glyphiconOks.length; ii < len_ii; ii++){
			$nameTd     = $glyphiconOks.eq(ii).closest('td');
			$tr         = $nameTd.closest('tr');
			$cardTd     = $tr.find('.zx-pingan-cardTd');

			//$cardTd.append('<span class="glyphicon glyphicon-refresh" aria-hidden="true"></span>');
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
				userName : stateMap.userName,
				sn       : $tr.data('sn'),
				phone    : phone,
				person   : person,
				card     : card,
				sm       : stateMap.smObj._id
			};

			//console.log(insuranceObj);

			//异步向服务器提交请求，自闭合
			(function(insuranceObj){
				// 通知服务器向平安网站请求验证码并下载到 userName+i.jpg
				zx.model.pingan.Step_1_2_downloadImg(insuranceObj);
			})(insuranceObj);

			jqueryMap.$personPhoneInput.val('');
		}

		// 检查开保险的数组是否为空
		if($glyphiconOks.length === 0){
			alert('请选择要开保险的客人');
			$that.prop( 'disabled', false );
			return;
		}

		// 按钮状态
		$that.prop( 'disabled', false );
	};
	//-------------------- END EVENT HANDLERS --------------------


	//------------------- BEGIN PUBLIC METHODS -------------------
	// Begin Public method /initModule/
	initModule = function ( obj ) {
		//console.log(obj);
		var sm_cards_obj = {},
			sn = 1,
			i, len_i, batch,
			k, len_k, person,
			$tr;

		stateMap.userName      = zx.model.people.get_user().userName;
		stateMap.smObj         = obj.smObj;
		stateMap.batchArr      = obj.batchArr;
		stateMap.cards         = obj.cards;
		stateMap.sm_cards      = obj.sm_cards;
		stateMap.$modal_header = obj.$modal_header;
		stateMap.$modal_body   = obj.$modal_body;
		
		//console.log(stateMap.sm_cards);

		for(i = 0, len_i = stateMap.sm_cards.length; i < len_i; i++){
			sm_cards_obj[stateMap.sm_cards[i].cardNum] = stateMap.sm_cards[i].pinganCardNum;
		}
		//console.log(sm_cards_obj);
		stateMap.sm_cards_obj = sm_cards_obj;

		// 初始化 jqueryMap
    	setJqueryMap();


		jqueryMap.$modal_header
			.css('padding-bottom',10)
			.append( configMap.header_html );
		jqueryMap.$modal_body
			//.css('overflow-y','scroll')
			//.css('max-height','440px')
			//.css('padding-top',0)
			.html( configMap.main_html );
		
		// 列表
		jqueryMap.$tbody = $('#zx-pingan-tbody');
		jqueryMap.$personPhoneInput = $('#person_phone');
		jqueryMap.$nameCountSpan = $('#nameCountSpan');
		jqueryMap.$cardCountSpan = $('#cardCountSpan');
		jqueryMap.$shortNumInput = $('#shortNum');
		// 初始化数据
		jqueryMap.$cardCountSpan.text(stateMap.cards.length);
		jqueryMap.$shortNumInput.data('item_index',0);

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

				//console.log(person);
				if(sm_cards_obj[person.cardNum]){
					$tr.css('color','#aaa');
					$tr.children().eq(2).text(sm_cards_obj[person.cardNum]);
					$tr.children().eq(1).append('<span class="glyphicon glyphicon-plane" aria-hidden="true"></span>');
				}

				jqueryMap.$tbody.append($tr);
				sn++;
			}
		}


		// 绑定事件
		// 点击序号单元格
		jqueryMap.$tbody.on('click','.zx-pingan-snTd', on_snTd_click);
		// 点击姓名单元格
		jqueryMap.$tbody.on('click','.zx-pingan-nameTd', on_nameTd_click);
		// 姓名输入框
		jqueryMap.$tbody.on('change','.zx-pingan-td-nameInput', on_nameInput_change);
		// 证件类型
		jqueryMap.$tbody.on('change','.zx-pingan-td-cardCategorySelect', on_cardCategorySelect_change);
		// 证件号码
		jqueryMap.$tbody.on('change','.zx-pingan-td-cardNumInput', on_cardNumInput_change);
		// 出生日期
		jqueryMap.$tbody.on('change','.zx-pingan-td-birthdayInput', on_birthdayInput_change);
		// 性别
		jqueryMap.$tbody.on('change','.zx-pingan-td-sexInput', on_sexInput_change);
		// 保险卡密码
		jqueryMap.$tbody.on('change','.zx-pingan-td-passwordInput', on_passwordInput_change);
		// 开保险
		jqueryMap.$modal_header.on('click','#zx-pingan-submit', on_submit_click);

		jqueryMap.$shortNumInput.change(function(){
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
					checkOkCount = jqueryMap.$tbody.find('span.glyphicon-ok').length,
					i, len;
				for(i = item_index, len = stateMap.cards.length; i < len; i++){
					if(!stateMap.cards[i].isLock) {
						count++;
					}
				}

				jqueryMap.$cardCountSpan.text(count - checkOkCount);
			}
		});
 
    	// 订阅验证码下载完成事件
    	$.gevent.subscribe( jqueryMap.$tbody, 'zx-Step_1_2_downloadImg', on_complete_Step_1_2_downloadImg );
    	$.gevent.subscribe( jqueryMap.$tbody, 'zx-Step_1_5_postData', on_complete_Step_1_5_postData );
    	//zx.model.pingan.Step_1_2_downloadImg( stateMap.userName );
	};
	// End PUBLIC method /initModule/
	
	return { 
		initModule : initModule
	};
	//------------------- END PUBLIC METHODS ---------------------
})();