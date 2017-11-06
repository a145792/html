Vue.config.productionTip = false
var vm = new Vue({
	el:'#app',
	data:{
		list:[]
	}
})



$(function(){
	var ccr_id = getRequestParameter('userId');
	var isNoWx = getRequestParameter('isNoWx');
	var shop_id = getRequestParameter("shop_id");
	if(isNoWx==1){
		$('.top').show();
		$("body").css("padding-top","62px");
	}else{
		$(".top").hide();
	}
	if(shop_id == ''){
		getCouponList(ccr_id)
			.then(res=>{
				console.log(res)
				vm.list=res.data.item
			})
	}else{
		getShopCoupon(shop_id)
			.then(res=>{
				console.log(res)
				vm.list=res.data.item
			})
	}
	
})


