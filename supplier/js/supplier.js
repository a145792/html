Vue.config.productionTip = false
var vm = new Vue({//此处采用vue.js
	el: '#app',
	data: {
		order:0,			//商品排序方式0 综合 1销量 2价格 3上新
		addMedia:true,		//切换列表样式
		supp:{},			//供应商详情
		endTime:'0天0:0:0',
		csr_id:''
	},
	filters:{
		//格式化时间
		getFree:function(amjson){
			var amjson = eval('(' + amjson + ')')
			var s = "";
			for(var i = 0; i < amjson.length; i++){
				//if(i == 0){
					s += '满'+ amjson[i].full + '减' + amjson[i].min + " ";
				//}
				//if(i == 1){
					//s += ',' + '满'+ amjson[i].full + '减' + amjson[i].min;
				//}
				//if(i == 2){
					//s += ' ...'
				//}
			}
			return s;
		}
	}
});



$(function(){
	var origin = getRequestParameter('origin');
	var user_id = getRequestParameter('user_id');
	var csr_id = getRequestParameter('csr_id');
	vm.csr_id = csr_id;

	//获取店铺详情
	supplierDetail(csr_id,vm.order)
		.then(res=>{
			vm.supp = res.data;
			$("#loadingdiv").remove();
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
		supplierDetail(csr_id,order)
			.then(res=>{
				vm.supp = res.data;
				vm.order = order;

				if(res.data.spr_id != null){
					var s = res.data.mav_endtime;
					var secs =  new Date(s.replace("-","/").replace("-","/")) - new Date();
				}
			})
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
	supplierDetail(vm.csr_id,vm.order)
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

