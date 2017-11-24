Vue.config.productionTip = false
var vm = new Vue({
    el:'#app',
    data:{
    	order:{},      //订单详情
    	invoice:{},	   //发票信息	
        uad:{},        //收货地址或提货地址
        send_scope:null,
    },
    filters:{
        //订单状态
        getStatus:function(s){
            if(s == 'ToPaid'){
                return '待付款';
            }else if(s == 'Cancel'){
                return '已取消';
            }else if(s == 'Close'){
                return '已关闭';
            }else if(s == 'ToPickUp'){
                return '待提货';
            }else if(s == 'Refund'){
                return '待退款';
            }else if(s == 'PlatfromRefund'){
                return '平台审核';
            }else if(s == 'ToSend'){
                return '待发货';
            }else if(s == 'Send'){
                return '待收货';
            }else if(s == 'TheEnd'){
                return '已完成';
            }else if(s == 'HasRefund'){
                return '已退款';
            }
        },
        getPrice:function(n){
            if(isUndef(n) || isNull(n)){
                return '0';
            }else{
                if(n < 0){
                    n = -n;
                }
                return n;
            }
        },
        getPayMode:function(m){
            if(m == '0'){
                return '支付宝';
            }else if(m == '1'){
                return '微信支付';
            }else if(m == '5'){
                return '货到付款';
            }else{
                return '';
            }
        },
        //格式化时间
        FMtime:function(time){
            if(!isUndef(time) && !isNull(time) && time.length > 19){
                time = time.substring(0,19)
            }
            return time
        }
    }
})


$(function(){
	var origin = getRequestParameter('origin');
	var so_id = getRequestParameter('so_id');

    var issend = "";
    var uad_id = "";
    var so_dsp_id = "";
	orderDetail(so_id)
		.then(res=>{
            console.log(res)
            $("#loadingdiv").remove();
			vm.order = res.data.item[0];
            issend = res.data.item[0].so_issend;
            uad_id = res.data.item[0].uad_id;
            so_dsp_id = res.data.item[0].so_dsp_id;
            vm.send_scope = res.data.item[0].product_item[0].sod_send_scope;
			//发票id
			var so_inc_id = res.data.item[0].so_inc_id;
			if(so_inc_id){
				invoiceDetail(so_inc_id)
					.then(res=>{
						vm.invoice = res.data.item[0];
					})
			}
            //请求订单地址
            getOrderUad(so_dsp_id,uad_id,issend)
                .then(res=>{
                    vm.uad = res.data.item[0];
                })
		})

    

	//去支付
    mui(".mui-content").on('tap','.topay',function(e){ 
        var json = {};
        json.so_id = vm.order.so_id;
        json.so_price = vm.order.so_price;
        json.so_no = vm.order.so_no;
        json.so_issend = vm.order.so_issend;
        if(origin == 'adr'){
            APP.appToOrderPay(JSON.stringify(json));
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToOrderPay.postMessage(json);
        }
    })

    //联系卖家
    mui(".mui-content").on('tap','.phone',function(e){ 
        e.stopPropagation();
        var phone = $(this).attr('phone');
        if(origin == 'adr'){
            APP.appToPhone(phone);
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToPhone.postMessage(phone);
        }
    })

    //确认退款
    $(document).on('click','.refundtip',function(){
        var so_refund_cause = $(this).html();
        refundOrder(vm.order.so_id,so_refund_cause)
            .then(res=>{
                if(res.code == 0){
                	vm.order.so_status = 'Refund';
                    mui('#refund').popover('toggle');
                    successTips('操作成功!');
                }else{
                    failTips(res.message);
                }
            })
    })




    var to_status = '';

    //取消订单
    mui(".mui-content").on('tap','.Cancel',function(e){ 
        e.stopPropagation();
        to_status = 'Cancel';
        showConfirm("您确认取消此订单吗？");
    })

    //取消退款
    mui(".mui-content").on('tap','.CloseRefund',function(e){ 
        e.stopPropagation();
        to_status = 'CloseRefund';
        showConfirm("您确认取消退款吗？");
    })

    //确认收货
    mui(".mui-content").on('tap','.Confirm',function(e){ 
        e.stopPropagation();
        to_status = 'TheEnd';
        showConfirm("是否确认收货？");
    })

    
    $('.sureli').on('click',function(){
    	if(to_status == 'CloseRefund'){
            closeRefundOrder(vm.order.so_id)
                .then(res=>{
                    if(res.code == 0){
                        successTips('操作成功!');
                        changeStatus(res.data.so_status);
                    }else{
                        failTips(res.message);
                    }
                })
    	}else{
    		updateOrderStatus(vm.order.so_id,to_status)
	            .then(res=>{
	                if(res.code == 0){
	                    successTips('操作成功!');
	                    changeStatus(to_status);
	                }else{
	                    failTips(res.message);
	                }
	            })
    	}
        
        closeConfirm();
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

function changeStatus(s){
	vm.order.so_status = s;
}


