Vue.config.productionTip = false
var vm = new Vue({
	el:'#app',
	data:{
		hotlist:[],			//热销
		supplist:[],		//供应商
		boomlist:[],		//爆款商品
		activies:[],		//活动列表
		actnum:1,			//活动个数
		boomnum:0,			//爆款商品个数
	}

})

$(function(){
	var user_id = getRequestParameter('user_id');
	var origin = getRequestParameter('origin');

	//获取首页活动列表
	getActivi()
		.then(res=>{
			for(var i = 0; i < res.data.item.length; i++){
				res.data.item[i].free_time = ''
			}
			vm.activies = res.data.item;
			if(res.data.item.length){
				vm.actnum = res.data.item.length;
			}
			var secs;
			var s;
			setInterval(function(){
				for(var i = 0; i < vm.activies.length; i++){
					s = vm.activies[i].spr_create_time;
					if(s && s.length && s.length > 18){
						s = s.substr(0,18);
					}
					secs =  new Date(s.replace("-","/").replace("-","/")) - new Date();
					secs = parseInt(secs / 1000) + vm.activies[i].spr_number*24*60*60;
					
					vm.activies[i].free_time = getBackTime(secs--);
				}

			},1000);

		})


	
	//获取销量最高的10个商品
	getHotProduct()
		.then(res=>{
			$("#loadingdiv").remove();
			var hotlist = res.data.item;
			
			for(var i = 0; i < hotlist.length; i++){
				hotlist[i].hasSalses = 'N';
				hotlist[i].hasMorefree = 'N';
				for(var j = 0; j < hotlist[i].salesAndMorefree.length; j++){
					if(hotlist[i].salesAndMorefree[j].mav_type == 'sales'){
						hotlist[i].hasSalses = 'Y';
						hotlist[i].sales = hotlist[i].salesAndMorefree[j];
					}
					if(hotlist[i].salesAndMorefree[j].mav_type == 'morefree'){
						hotlist[i].hasMorefree = 'Y';
						hotlist[i].morefree = hotlist[i].salesAndMorefree[j];
					}
				}
			}
			vm.hotlist = hotlist;
		})

	//获取爆款商品
	getBoomProduct()
		.then(res=>{
			var boomlist = res.data.item;
			if(boomlist.length){
				vm.boomnum = boomlist.length;
			}
			for(var i = 0; i < boomlist.length; i++){
				boomlist[i].hasSalses = 'N';
				boomlist[i].hasMorefree = 'N';
				for(var j = 0; j < boomlist[i].salesAndMorefree.length; j++){
					if(boomlist[i].salesAndMorefree[j].mav_type == 'sales'){
						boomlist[i].hasSalses = 'Y';
						boomlist[i].sales = boomlist[i].salesAndMorefree[j];
					}
					if(boomlist[i].salesAndMorefree[j].mav_type == 'morefree'){
						boomlist[i].hasMorefree = 'Y';
						boomlist[i].morefree = boomlist[i].salesAndMorefree[j];
					}
				}
			}
			vm.boomlist = boomlist;
		})

	//获取供应商列表
	getSupplist(user_id)
		.then(res=>{
			vm.supplist = res.data.item;
		})



	//----------------------------------------------------------------------------------------------
	

	//活动点击事件
	mui(".mui-content").on('tap','.activies',function(){ 
		var sag_new_prd_id = $(this).attr('sag_new_prd_id');
		var spr_prd_id = $(this).attr('spr_prd_id');
		var spr_prd_child_type = $(this).attr('spr_prd_child_type');
		var spr_sup_id = $(this).attr('spr_sup_id');
		var json = {};
		json.sag_new_prd_id = sag_new_prd_id;
		json.spr_prd_id = spr_prd_id;
		json.spr_prd_child_type = spr_prd_child_type;
		json.spr_sup_id = spr_sup_id;
		console.log(json)
		if(origin == 'adr'){
            APP.appToActivi(JSON.stringify(json));
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToActivi.postMessage(json);
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

	//商品点击事件
	mui(".mui-content").on('tap','.supplier',function(){ 
		var csr_id = $(this).attr('csr_id');
		if(origin == 'adr'){
            APP.appToSupplier(csr_id);
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToSupplier.postMessage(csr_id);
        }
	})

})

function setEndtime(vm){
	if(vm.activies){
		for(var i = 0; i < vm.activies.length; i++){
			var s = vm.activies[i].spr_create_time;
			if(s && s.length && s.length > 18){
				s = s.substr(0,18);
			}
			var secs =  new Date(s.replace("-","/").replace("-","/")) - new Date();
			secs = parseInt(secs / 1000) + vm.activies[i].spr_number*24*60*60;
			vm.activies[i].free_time = getBackTime(secs--);
		}
	}
}
	
