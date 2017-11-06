Vue.config.productionTip = false
var vm = new Vue({//此处采用vue.js
    el: '#pullrefresh',
    data: {
        involist:[],
		count:1,
    }
});

$(function(){
	var origin = getRequestParameter('origin');
	var user_id = getRequestParameter('user_id');

	//获取发票列表
	getShopInvoice(user_id)
		.then(res=>{
			$("#loadingdiv").remove();
			vm.involist = res.data.item;
			vm.count=res.data.item.length;
			if(vm.count==0){
				no_Detail("../images/No-invoice_03.png");
			}else{
				$(".no-shuju").remove();
			}
		})



	//设置为默认
	mui(".mui-content").on('tap','.todef',function(e){ 
		e.stopPropagation();
		var inc_id = $(this).attr('inc_id');
		toDefInvoice(user_id,inc_id)
			.then(res=>{
				if(res.code == 0){
					var list = vm.involist;
					for(var i = 0; i < list.length; i++){
						if(list[i].inc_id == inc_id){
							list[i].inc_isdef = 'Y';
						}else{
							list[i].inc_isdef = 'N';
						}
					}
					vm.involist = list;
				}else{
					failTips(res.message)
				}
				return false;
			})
	})

	//点击删除
	var del_inc_id = '0';
	mui(".mui-content").on('tap','.delinvo',function(){ 
		var inc_id = $(this).attr('inc_id');
		del_inc_id = inc_id;
		showConfirm('确定要删除吗 ?');
		return false;
	})

	//确认删除
	$(document).on('click','.sureDel',function(){ 
		delInvoice(del_inc_id)
			.then(res=>{
				if(res.code == 0){
					$('.invoice[inc_id='+del_inc_id+']').remove();
				}else{
					failTips(res.message)
				}
				closeConfirm();
			})
	})

	//点击发票
	mui(".mui-content").on('tap','.invoice',function(){ 
		var inc_id = $(this).attr('inc_id');
		var inc = {};
		for(var i = 0; i < vm.involist.length; i++){
			if(vm.involist[i].inc_id == inc_id){
				inc = vm.involist[i];
			}
		}
		if(origin == 'adr'){
            APP.appToChoose(JSON.stringify(inc));
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToChoose.postMessage(inc);
        }
	})

	//点击编辑发票
	mui(".mui-content").on('tap','.edit',function(){ 
		var inc_id = $(this).attr('inc_id');
		var inc = {};
		for(var i = 0; i < vm.involist.length; i++){
			if(vm.involist[i].inc_id == inc_id){
				inc = vm.involist[i];
			}
		}
		if(origin == 'adr'){
            APP.appToEditInvoice(JSON.stringify(inc));
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToEditInvoice.postMessage(inc);
        }
        return false
	})

	//点击新增发票
	$(document).on('tap','.addInvocice',function(){ 
		if(origin == 'adr'){
            APP.appToAddInvoice();
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToAddInvoice.postMessage(666);
        }
	})



	//点取消事件
    $(".abolish").on('click',function(){
      //  e.stopPropagation();
        closeConfirm();
    })

    //弹出确认框
    function showConfirm(msg){
        $(".alertWait>.a1").html(msg);
        $(".zhezhao").fadeIn();
        $(".alertWait").fadeIn();
    }

    //关闭确认框
    function closeConfirm(){
        $(".zhezhao").fadeOut();
        $(".alertWait").fadeOut();
    }


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
	 setTimeout(function() {
	  location.reload();
	  
	  mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
	 }, 1500);
 }
 var count = 0;

		
