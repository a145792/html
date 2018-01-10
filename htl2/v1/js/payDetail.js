Vue.config.productionTip = false
var vm = new Vue({
	el:'#app',
	data:{
		page:1,
		count:'',
		list:[]
	},
	filters:{
		//头像过滤
		MePhoto:function(abc){
			if(abc==''){
				abc="../themes/images/Buyers@2x.png";
				return abc;
			}else{
				return abc;
			}
		},
		//格式化时间
		FMtime:function(time){
			if(!isUndef(time) && !isNull(time) && time.length >10){
				time = time.substring(0,16);
			}
			return time
		},
		//支付方式图片过滤
		payPhoneImg:function(orde){
			if(orde==0){
				return "../themes/images/zhifubao.png";
			}else if(orde==1){
				return "../themes/images/wechat@2x.png";
			}else if(orde==2){
				return "../themes/images/Personal Center_wallet@2x.png";
			}else if(orde==3){
				return "../themes/images/zhifubao.png";
			}else if(orde==4){
				return "../themes/images/wechat@2x.png";
			}
		},
		//支付方式文本过滤
		payText:function(text){
			if(text==0){
				return "支付宝";
			}else if(text==1){
				return "微信";
			}else if(text==2){
				return "钱包";
			}else if(text==3){
				return "支付宝+钱包";
			}else if(text==4){
				return "微信+钱包";
			}
		}
	}
})



$(function(){
	//获取店铺id
	var shop_id = getRequestParameter('shop_id');
	var origin = getRequestParameter('origin');
	//获取明细列表
	payDetail(shop_id,vm.page)
		.then(res=> {
			vm.count=res.data.count;
			vm.list=res.data.items;
			$(".loading").hide();
		});
	//加载第二页数据
	$(window).scroll(function() {
		var scrollA=document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
		if (scrollA>= $(document).height() - $(window).height()) {
			//计算总页码
			var pageCount = parseInt((vm.count%10 == 0) ? vm.count/10 : vm.count/10 + 1);
			if(vm.page >= pageCount){
				return;
			}
			//加载数据
			payDetail(shop_id,vm.page+1)
				.then(res=> {
					var code = res.code;
					if(code == 0){
						vm.count=res.data.count;
						var list = res.data.items;
						vm.list = vm.list.concat(list);
						vm.page = vm.page + 1;
					}else{
						alert(res.message);
					}

				});
		}
	})

	$(document).on('click','.payList',function(){
		var sor_id = $(this).attr('sor_id');
		//window.location.href = getRootPath() + '/busweb/orderDetail.html?is_discount=1&sor_id='+sor_id+'&origin='+origin+'&from=web';
		var url = getRootPath() + 'busweb/orderDetail.html?is_discount=1&sor_id='+sor_id+'&origin='+origin+'&from=web';
		if(origin == 'adr'){
            APP.appToUrl(url);
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToUrl.postMessage(url);
        }
	})

});


