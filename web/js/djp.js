/* isShowFooter
 * djp.js
 * Root namespace module
*/

/*jslint           browser : true,   continue : true,
  devel  : true,    indent : 2,       maxerr  : 50,
  newcap : true,     nomen : true,   plusplus : true,
  regexp : true,    sloppy : true,       vars : false,
  white  : true
*/
/*global $*/

var djp = (function () {
  'use strict';
  var 
      configMap = {
        //server: 'http://47.88.100.75:8080/',
        server: 'http://192.168.99.100:8080/',
        // server:'http://120.24.48.192:8080/',
        citys: {
          sz: { province: '广东', city: '深圳' },
          gz: { province: '广东', city: '广州' },
          hz: { province: '浙江', city: '杭州' }
        },
      	tr_html : String()
      	  + '<tr>'
      	    + '<td></td>'
      	    + '<td></td>'
      	    + '<td></td>'
      	    + '<td><button class="is_download_btn btn btn-xs"></button></td>'
      	    + '<td>'
      	      + '<select class="is_print_select">'
      	        + '<option>未办理</option>'
      	        + '<option>已办理</option>'
      	      + '</select>'
      	    + '</td>'
      	    + '<td style="padding:0;">'
      	    	+ '<input type="text" class="djpNoteInput form-control"></input>'
      	    + '</td>'
      	  + '</tr>',
        main_html : String()
          + '<div class="row">'
            + '<div class="col-md-3">'
              + '<h3>登机名单导出</h3>'
            + '</div>'
            + '<div class="col-md-9" style="margin-top:15px;">'
              + '<form class="form-inline">'
                + '<div class="form-group form-group-sm">'
                  + '<label for="name">&nbsp;用户名:</label>'
                  + '<input type="text" class="form-control" id="nameInput">'
                + '</div>'
                + '<div class="form-group form-group-sm">'
                  + '<label for="password">&nbsp;用户口令:</label>'
                  + '<input type="password" class="form-control" id="passwordInput">'
                + '</div>'
                + '<div class="form-group form-group-sm" style="position: relative;">'
                  + '<label for="name">&nbsp;日期:</label>'
                  + '<input type="text" class="form-control" id="smDateInput">'
                + '</div>'
                + '<button class="btn btn-sm btn-default" id="submitBtn">查询</button>'
              + '</form>'
            + '</div>'
            + '<table class="table table-striped table-hover">'
              + '<thead>'
                + '<tr>'
                  + '<th style="width:50px;">序号</th>'
                  + '<th style="width:90px;">航班</th>'
                  + '<th style="width:50px;">人数</th>'
                  + '<th style="width:60px;">导出</th>'
                  + '<th style="width:60px;">办理</th>'
                  + '<th>备注</th>'
                + '</tr>'
              + '</thead>'
              + '<tbody id="listTbody"></tbody>'
            + '</table>'
          + '</div>'
      },
      stateMap = {
        city: ''
      },
      getConfigMapItem, setStateMapItem,
      initModule;

  getConfigMapItem = function(item) {
    return configMap[item];
  };

  setStateMapItem = function(item, value) {
    stateMap[item] = value;
  };

  initModule = function ( $container ) {
    $container.html(configMap.main_html);

    $('#smDateInput').datetimepicker({
      format: 'YYYY-MM-DD',
      dayViewHeaderFormat: 'YYYY MMMM',
      useCurrent: false,
      locale: 'zh-cn',
      showTodayButton: true,
      showClear: true
    });

    $('#submitBtn').click(function(){
    	var req = {
    		name    : $('#nameInput').val().trim(),
    		password: $('#passwordInput').val().trim(),
    		smDate  : $('#smDateInput').val().trim(),
        city    : stateMap.city
    	};

    	$('#listTbody').empty();
    	if(req.name === '' && req.password === '' && req.smDate === ''){
    		alert('用户名、用户口令、日期不能为空');
    	} else {
    		$.post(configMap.server + 'dengjipai', req, function(obj){
    			var djps, i, $tr, btn_class, btn_text, select_text, select_color;

    			if(obj.success === 1){
    				djps = obj.djpArr;
	    			for(i = 0; i < djps.length; i++){
	    				if(djps[i].isDownload){
	    					btn_class = 'btn-default';
	    					btn_text  = '已导出';
	    				} else {
	    					btn_class = 'btn-primary';
	    					btn_text  = '未导出';
	    				}

	    				if(djps[i].isPrint){
	    					select_text = '已办理';
	    					select_color = '#000';
	    				} else {
	    					select_text = '未办理';
	    					select_color = 'red';
	    				}

	    				$tr = $(configMap.tr_html);
	    				$tr
	    					.addClass('item-' + djps[i]._id)
	    					.data('id', djps[i]._id);

						$tr
							.children()
								.eq(0)
									.text(i+1)
								.next()
									.text(moment(djps[i].sm.flight.flightDate).format('YYYY-MM-DD') + ' ' + djps[i].sm.flight.flightNum)
								.next()
									.text(djps[i].sm.smRealNumber)
								.next()
									.find('button')
										.addClass(btn_class)
										.text(btn_text)
									.end()
								.next()
									.find('select')
										.css('color',select_color)
										.val(select_text)
									.end()
								.next()
									.find('input')
										.val(djps[i].djpNote);

						$('#listTbody').append($tr);
	    			}
    			} else {
    				alert('请检查用户名或密码填写是否正确！');
    			}   			
    		});
    	}

    	return false;
    });

  	$('#listTbody').on('change','input.djpNoteInput',function(){
  		var 
  			$that = $(this),
  			req = {
  				id     : $that.closest('tr').data('id'),
  				djpNote: $that.val(),
          city   : stateMap.city		
  			};	

  		$.post(configMap.server + 'dengjipai_djpnote', req, function(obj){
  			//console.log(obj);
  			if(!(obj.success === 1 || (obj.success.ok && obj.success.ok === 1))) {
  				alert('写入数据库失败！');
  			}
  		});

  	}).on('click','button.is_download_btn', function(){
  		var
  			$that = $(this),
  			isDownload = $that.text() === '未导出' ? false : true,
  			req = {
  				id        : $that.closest('tr').data('id'),
  				isDownload: isDownload,
          city      : stateMap.city
  			};

  		$that.prop("disabled", true);

  		$.post(configMap.server + 'dengjipai_isdownload', req, function(obj){
  			var loadFile, doc, out, setData, tempdocx;

  			$that.prop("disabled", false);
  			if(!(obj.success === 1 || (obj.success.ok && obj.success.ok === 1))) {
  				alert('导出失败！');
  			} else {
  				// 导出按钮状态
  				$that
  					.removeClass("btn-primary")
        				.addClass("btn-default")
  					.text("已导出");

  				// 导出 Word
  				setData  = obj.setData;
  				tempdocx = "djpTable";

  				loadFile=function(url, callback){
  			        JSZipUtils.getBinaryContent(url, callback);
  		      	};

  		      	loadFile('docxtemp/' + tempdocx + '.docx',function(err,content){
  		        if (err) { throw e };

  			        doc = new Docxgen(content);
  			        doc.setData( setData ) //set the templateVariables

  			        doc.render(); //apply them (replace all occurences of {first_name} by Hipp, ...)
  			        out = doc.getZip().generate({type:"blob"}); //Output the document using Data-URI
  			        saveAs(out, '阳光服务' + setData.smDate + setData.teamType + setData.smFlight + '航班' + setData.smRealNumber + '人.docx');
  		      	}); 
  			}
  		});

  	}).on('change','select.is_print_select', function(){
  		var
  			$that = $(this),
  			isPrint, select_color, req;

  			if($that.val() === '未办理'){
  				isPrint = false;
  				select_color = 'red';
  			}else{
  				isPrint = true;
  				select_color = '#000';
  			}
  			
  			req = {
  				id     : $that.closest('tr').data('id'),
  				isPrint: isPrint,
          city   : stateMap.city
  			};
  		//console.log(req);
  		$.post(configMap.server + 'dengjipai_isprint', req, function(obj){
  			//console.log(obj);
  			if(obj.success.ok !== 1) {
  				alert('写入数据库失败！');
  			} else {
  				$that.css('color', select_color);
  			}
  		});
  	});
  };

  return { 
    getConfigMapItem: getConfigMapItem,
    setStateMapItem : setStateMapItem,
    initModule      : initModule
  };
}());

$(document).ready(function(){
  var 
    two_level_domain_name = document.location.host.split('.')[0],
    citys = djp.getConfigMapItem('citys');

  // 网页标题
  if (citys[two_level_domain_name]) {
    // 设置 city
    djp.setStateMapItem( 'city', two_level_domain_name );
    document.title = '阳光服务-' + citys[two_level_domain_name]['city'] + '站';

    djp.initModule( $('#dengjipai') );
  } else {
    $('body').html('<div style="text-align: center; font-size: 24px; color: red;">网址错误</div>');
  }

});