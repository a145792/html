Vue.config.productionTip = false
var vm = new Vue({//此处采用vue.js
    el: '#pullrefresh',
    data: {
    	ste_id:'',
        productlist:[],
        count:0,
        page:1,
        pageNumber:0,
        scope_id:'',
        order:''
    }
});



$(function(){
	var ste_id = getRequestParameter('ste_id');
	var origin = getRequestParameter('origin');
	vm.ste_id = ste_id;

	//获取该类型的商品列表
	getProductListSteId(ste_id,vm.scope_id,vm.order,1)
		.then(res=>{
			
			var list = res.data.items;
			list = formatList(list);
			
			var count = res.data.count;
			vm.count = count;
			if(count > 0){
				setPromotionInfo(list)
					.then(res=>{
						vm.productlist = list;
						$("#loadingdiv").remove();
					})
			}else{
				$("#loadingdiv").remove();
			}	
			var pageNumber = parseInt((count%10 == 0) ? count/10 : count/10 + 1);
			vm.pageNumber = pageNumber;
			if(vm.count==0){
                no_Detail("../images/No-the-goods_03.png");
			}else{
				$(".no-shuju").remove();
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

})

//改变区域id和排序
function search(scope_id,order){
	vm.productlist = []
	vm.page = 1;
	vm.scope_id = scope_id;
	vm.order = order;
	
	getProductListSteId(vm.ste_id,vm.scope_id,vm.order,1)
	.then(res=>{
		
		var list = res.data.items;
		list = formatList(list);
		
		var count = res.data.count;
		vm.count = count;
		if(count > 0){
			setPromotionInfo(list)
				.then(res=>{
					vm.productlist = list;
				})
		}
		var pageNumber = parseInt((count%10 == 0) ? count/10 : count/10 + 1);
		vm.pageNumber = pageNumber;
		if(vm.count==0){
            no_Detail("../images/No-the-goods_03.png");
		}else{
			$(".no-shuju").remove();
		}
	})
}


function formatList(list){
	for(var i = 0; i < list.length; i++){
		list[i].hasSalses = 'N';
		list[i].hasMorefree = 'N';
		for(var j = 0; j < list[i].salesAndMorefree.length; j++){
			if(list[i].salesAndMorefree[j].mav_type == 'sales'){
				list[i].hasSalses = 'Y';
				list[i].sales = list[i].salesAndMorefree[j];
			}
			if(list[i].salesAndMorefree[j].mav_type == 'morefree'){
				list[i].hasMorefree = 'Y';
				list[i].morefree = list[i].salesAndMorefree[j];
			}
		}
	}

	return list;
}


mui.init({
	  pullRefresh: {
		  container: '#pullrefresh',
		  down: {
			  auto:false,//可选,默认false.自动下拉刷新一次
			  callback: pulldownRefresh
		  },
		  up: {
			  auto:false,//可选,默认false.自动下拉刷新一次
			  contentrefresh: '正在加载...',
			  callback: pullupRefresh
		  }
 	  }
});
 /** 下拉刷新具体业务实现*/
 function pulldownRefresh() {
	 setTimeout(function() {
	  location.reload()

	  mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
	 }, 1500);
 }
 var count = 0;
 /*
 * 上拉加载具体业务实现
 */
 function pullupRefresh()  {
	 //setTimeout(function() {
	  mui('#pullrefresh').pullRefresh().endPullupToRefresh((vm.page >= vm.pageNumber)); 
	  
	  if(vm.page < vm.pageNumber){
	  		getProductListSteId(vm.ste_id,vm.scope_id,vm.order,vm.page*1+1)
	  			.then(res=>{
	  				var list = res.data.items;
					list = formatList(list);
					setPromotionInfo(list)
						.then(res=>{
							vm.productlist = vm.productlist.concat(list);
							vm.page = vm.page*1 + 1;
						})
					
	  			})
	  }
	  
 }	