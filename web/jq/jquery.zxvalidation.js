/**
 * 身份证
 * jquery 验证单元格格式
 * 
 * 参数: option :'cardNum', 'phone'
 *           示例 $('.cardNumTd').valid('cardNum');
 */

;(function ($) {
	var checkDate,
		checkIdCardField, 
		phone_re = /^1\d{10}$/,
		age_re = /^[0-9]*$/;


	// 检测日期
	checkDate = function (date){
		var dateY, n, y,
			date_re = /^(\d{4})\-(\d{2})\-(\d{2})$/;

		// 先看格式是不是正确
		if(!date_re.test(date)){
			return false;
		}

		dataY = new Date(date).getFullYear();
	    n = new Date();
	    y = n.getFullYear();
	    
	    if( dataY < 1900 || dataY > y ){
	    	return false;
	    }

	    return (new Date(date).getDate()==date.substring(date.length-2));
	}

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

	$.fn.zxvalid = function (option) {
		var $that, that_text,
			$person_tr, $cardCategoryTd, cardCategory;

		if(option === 'cardNum'){
			return this.each(function(){
				$that     = $(this).children(':first');
				that_text = $that.text();
				$that.removeClass('person-check-err cardNum-check-ok');
				if( that_text !== ""){
					if( checkIdCardField(that_text) ) {
						$that.addClass('cardNum-check-ok');
					} else {
						$person_tr = $(this).closest('tr');
						$cardCategoryTd = $person_tr.find('td.cardCategoryTd');
						cardCategory = $cardCategoryTd.children().first().text();
						if(cardCategory ==='' || cardCategory  === '身份证'){
							$that.addClass('person-check-err');
						}
					}
				}				
			});
		}

		if(option === 'phone'){
			return this.each(function(){
				$that = $(this).children(':first');
				that_text = $that.text();

				if ( that_text === "" || phone_re.test(that_text) ) {
					$that.removeClass('person-check-err');
				} else {
					$that.addClass('person-check-err');
				}
			});
		}	

		if(option === 'birthday'){
			return this.each(function(){
				$that = $(this).children(':first');
				that_text = $that.text();

				if ( that_text === "" || checkDate(that_text) ) {
					$that.removeClass('person-check-err');
				} else {
					$that.addClass('person-check-err');
				}
			});
		}

		if(option === 'sex'){
			return this.each(function(){
				$that = $(this).children(':first');
				that_text = $that.text();

				if ( that_text === "" || that_text==='男' || that_text==='女' ) {
					$that.removeClass('person-check-err');
				} else {
					$that.addClass('person-check-err');
				}
			});
		}

		if(option === 'cardCategory'){
			return this.each(function(){
				$that = $(this).children(':first');
				that_text = $that.text();

				if ( that_text === "" || 
					 that_text==='身份证' || 
					 that_text==='护照' ||
					 that_text==='港澳回乡证' ||
					 that_text==='台胞证' ||
					 that_text==='军官证' ||
					 that_text==='其它') {
					$that.removeClass('person-check-err');
				} else {
					$that.addClass('person-check-err');
				}
			});
		}

		if(option === 'age'){
			return this.each(function(){
				$that = $(this).children(':first');
				that_text = $that.text();

				if ( that_text === "" || ( age_re.test(that_text) && parseInt(that_text) > 0 && parseInt(that_text) < 100 )) {
					$that.removeClass('person-check-err');
				} else {
					$that.addClass('person-check-err');
				}
			});
		}

		if(option === 'ageType'){
			return this.each(function(){
				$that = $(this).children(':first');
				that_text = $that.text();

				if ( that_text === "" || 
					 that_text==='成人' ||
					 that_text==='老人' ||
					 that_text==='儿童' ||
					 that_text==='婴儿' ) {
					$that.removeClass('person-check-err');
				} else {
					$that.addClass('person-check-err');
				}
			});
		}
	}
})(jQuery);