Vue.config.productionTip = false
var vm = new Vue({//此处采用vue.js
	el: '#app',
	data: {
		order:0,			//商品排序方式0 综合 1销量 2价格 3上新
		addMedia:true,		//切换列表样式
		supp:{},			//供应商详情
		csr_id:'',
		type:''
	},
	filters:{
		//格式化时间
		getFree:function(amjson){
			var amjson = eval('(' + amjson + ')')
			var s = "";
			for(var i = 0; i < amjson.length; i++){
					s += '满'+ amjson[i].full + '减' + amjson[i].min + " ";
			}
			return s;
		}
	}
});

$(function(){
	var origin = getRequestParameter('origin');
	var user_id = getRequestParameter('user_id');
	var csr_id = getRequestParameter('csr_id');
	var type = getRequestParameter('type');
	vm.csr_id = csr_id;
	vm.type = type;

	//获取店铺详情
	supplierDetail2(csr_id,vm.order,type)
		.then(res=>{
			var supp = res.data;
			if(res.data.spr_id != null){
				var s = res.data.spr_create_time;
				if(s && s.length && s.length > 18){
					s = s.substr(0,18)
				}
				var secs =  new Date(s.replace("-","/").replace("-","/")) - new Date();
				secs = secs / 1000 + res.data.spr_number*24*60*60;
				setInterval(function(){
					vm.endTime = getBackTime(secs--);
				},1000)
			}
			setPromotionInfo(res.data.items)
				.then(res=>{
					supp.items = res;
					vm.supp = supp;
					$("#loadingdiv").remove();
				})
		})

	

	//商品点击事件
	mui(".mui-content").on('tap','.product',function(){
		var spt_id = $(this).attr('spt_id');
		if(origin == 'adr'){
            APP.appToProduct(spt_id);
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToProduct.postMessage(spt_id);
        }
	})


    mui(".mui-content").on('tap','#activi',function(){
        mui('#shopAlert').popover('toggle');
    })

	//切换排序方式
	$(document).on('click','.order',function(){
		var order = $(this).attr('order');
		if(vm.order == order){
			return;
		}

		//0 综合 1销量 2价格 3上新
		if(order == 0){//综合
            jsonSort(vm.supp.items,"qz",true);
        }else if(order == 1){//销量
            jsonSort(vm.supp.items,"sale_count",true);
        }else if(order == 2){//价格
            jsonSort(vm.supp.items,"spt_price",false);
        }else if(order == 3){//上新
        	jsonSort(vm.supp.items,"spt_id",true);
        }
		
		vm.order = order;
			
	})

})



mui.init({
	pullRefresh:{
		container: '#pullrefresh',
		down: {
			auto:false,//可选,默认false.自动下拉刷新一次
			callback: pulldownRefresh
		}
	}
});

/** 下拉刷新具体业务实现*/
function pulldownRefresh(){
	supplierDetail2(vm.csr_id,vm.order,vm.type)
		.then(res=>{
			vm.supp = res.data;

			if(res.data.spr_id != null){
				var s = res.data.mav_endtime;
				var secs =  new Date(s.replace("-","/").replace("-","/")) - new Date();
			}
		})
	mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
}

//切换排列方式
mui(".whose-tab").on("tap",".addmedia",function(){
	vm.addMedia = !vm.addMedia;
})

