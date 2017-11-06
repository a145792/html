Vue.config.productionTip = false
var vm = new Vue({
	el:'#app',
	data:{
		shopinfo:{},		//店铺相关信息
		accountName:'',		//默认支付账户
	},
	filters:{
		//结算方式
		getType:function(type){
			if(type == 0){
				return '手动结算';
			}else if(type == 1){
				return '七天自助结算';
			}else if(type == 2){
				return '单笔结算';
			}
		},
		
		//默认账户
		getBankName:function(name){
			var names = name.split(' ');
			var s1 = names[0];
			var s3 = names[2] + '';
			if(s3.length > 4){
				s1 += '(' + s3.substring(s3.length -4 , s3.length ) + ')';
			}else{
				s1 += '(' + s3 + ')';
			}
			return s1;
		}
	}
})



$(function(){
	//获取店铺id
	var shop_id = getRequestParameter('shop_id');
    var origin = getRequestParameter('origin');
	//是否完成资质认证(0 已认证, 1 未认证)
	var isauth = getRequestParameter('isauth');

	//店铺财务信息
	showInfo(shop_id)
		.then(res=>{
			vm.shopinfo = res.data;
			$(".loading").hide();
		})

	//默认收款账户
	findCardAcct(shop_id)
		.then(res=>{
			vm.accountName = res.data.payname;
		})



	//申请提现
	$(document).on('click','.cash',function(){
		var json = {};
		json.payname = vm.accountName;
		json.orderBalance  = vm.shopinfo.orderBalance;
		json.disBalance = vm.shopinfo.disBalance;
		if(origin == 'adr'){
            APP.appToCash(vm.accountName,vm.shopinfo.orderBalance,vm.shopinfo.disBalance)
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToCash.postMessage(json)
        }else if(origin == 'wxshop'){
        }
	})

	//点击消费订单付款方式
	$('.orderPayType').on('click',function(){
		var type = $(this).attr('type');
		if(origin == 'adr'){
            APP.appToOrderPayType(type)
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToOrderPayType.postMessage(type)
        }else if(origin == 'wxshop'){
        }
	})

	//点击优惠订单付款方式
	$('.disPayType').on('click',function(){
		var type = $(this).attr('type');
		if(origin == 'adr'){
            APP.appToDisPayType(type)
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToDisPayType.postMessage(type)
        }else if(origin == 'wxshop'){
        }
	})

	//跳转到账户页面
	$('.toAccount').on('click',function(){
		var path = getRootPath();
		//vm.location = path + '/busweb/account.html?shop_id=' + shop_id + '&origin=' + origin + '&isauth=' + isauth;
		//vm.location = 'bb'
		window.location.href = path + '/busweb/account.html?shop_id=' + shop_id + '&origin=' + origin + '&isauth=' + isauth;
	})

	//点击跳转到结算历史
	$('.toPayHistory').on('click',function(){
		var path = getRootPath();
		window.location.href = path + '/busweb/payHistory.html?shop_id=' + shop_id + '&origin=' + origin + '&isauth=' + isauth;
	})

	//点击跳转消费买单历史
	$('.toconsum').on('click',function(){
		var path = getRootPath();
		window.location.href = path + '/busweb/consum.html?shop_id='+shop_id+'&origin='+origin;
	})

	//点击跳转优惠买单历史
	$('.todiscountconsum').on('click',function(){
		var path = getRootPath();
		window.location.href = path + '/busweb/countconsum.html?shop_id='+shop_id+'&origin='+origin;
	})
	
	//点击后退
	$(document).on('click','.toback',function(){
		if(origin == 'adr'){
            APP.appToBack()
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToBack.postMessage(12)
        }else if(origin == 'wxshop'){
        }
	})

})



