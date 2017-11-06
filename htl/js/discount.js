Vue.config.productionTip = false
var vm = new Vue({
	el:'#app',
	data:{
		weekOfDiscount:'',
		weekOfDisOrderLucre:'',
		discount:'',
		disDspid:'',
		disList:[],
		HisList:[]
	},
	filters:{
		//格式化时间
		FMtime:function(time){
			if(!isUndef(time) && !isNull(time) && time.length >10){
				time = time.substring(0,10);
			}
			return time
		}
	}
})



$(function(){
	//获取来源
	var origin = getRequestParameter('origin');
	var shop_id = getRequestParameter('shop_id');
	discount(shop_id)
		.then(res=>{
			vm.weekOfDiscount=res.data.weekOfDiscount;
			vm.weekOfDisOrderLucre=res.data.weekOfDisOrderLucre;
			vm.disDspid=res.data.dsp_id;
		});
	ShopDisCount(shop_id)
		.then(res=>{
			vm.discount=res.data.is_discount;
			vm.disList=res.data.items;
		});
	HistoryDisCount(shop_id)
		.then(res=>{
			vm.HisList=res.data.items;
			if(vm.disList.length!=0){
				vm.HisList.splice(0,1)
			}
			$(".loading").hide();
		});
	//活动进行中跳转
	$(document).on('click','.huodong',function(){
		var dc_id = $(this).attr('dc-id');
		if(origin == 'adr'){
			APP.appToDcId(dc_id)
		}else if(origin == 'ios'){
			window.webkit.messageHandlers.appToDcId.postMessage(vm.disList)
		}
	})
	//活动返回
	$(document).on('click','.countFan',function(){
		if(origin == 'adr'){
			APP.appToBack()
		}else if(origin == 'ios'){
			window.webkit.messageHandlers.appToBack.postMessage(250)
		}
	})
	//明细跳转
	$(document).on('click','.mingxi',function(){
		window.location.href = getRootPath()+"/busweb/payDetail.html?shop_id="+shop_id+'&origin='+origin;
	})
});


