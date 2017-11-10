Vue.config.productionTip = false
var vm = new Vue({
    el:'#app',
    data:{
    	order:{},      //订单详情
    	invoice:{},	   //发票信息	
        uad:{},        //收货地址或提货地址
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
                return n;
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
    orderDetailNew(so_id)
		.then(res=>{
        $("#loadingdiv").remove();
            console.log(res)
			vm.order = res.data;
            issend = res.data.so_issend;
            uad_id = res.data.so_uad_id;
            so_dsp_id = res.data.so_dsp_id;
			//发票id
			var so_inc_id = res.data.so_inc_id;
			if(so_inc_id){
				invoiceDetail(so_inc_id)
					.then(res=>{
						console.log(res)
						vm.invoice = res.data.item[0];
					})
			}
            //请求订单地址
            getOrderUad(so_dsp_id,uad_id,issend)
                .then(res=>{
                    console.log(res)
                    vm.uad = res.data.item[0];
                })

		})

    
    //联系卖家
    mui(".mui-content").on('tap','.phone',function(e){ 
        e.stopPropagation();
        var phone = $(this).attr('phone');
        console.log(phone)
        if(origin == 'adr'){
            APP.appToPhone(phone);
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToPhone.postMessage(phone);
        }
    })






    var to_status = '';

    //确认退款
    $(document).on('click','.CloseRefund',function(e){
        e.stopPropagation();
        to_status = 'PlatfromRefund';
        showConfirm("确认退款？");
    })

    //我已发货
    mui(".mui-content").on('tap','.imSend',function(e){
        e.stopPropagation();
        to_status = 'Send';
        showConfirm("确认发货？");
    })

    //修改运费
    mui(".mui-content").on('tap','.promptBtn',function(e){
        e.detail.gesture.preventDefault(); //修复iOS 8.x平台存在的bug，使用plus.nativeUI.prompt会造成输入法闪一下又没了
        var btnArray = ['取消', '确定'];
        mui.prompt('', '', '修改运费', btnArray, function(e) {
            if (e.index == 1) {
                if(! /^\d+(\.\d{1,2})?$/.test(e.value)){
                    mui.toast("请输正确的金额,暂只支持两位小数");
                    return;
                }
                if(e.value==''){
                    mui.toast("输入金额不能为空");
                    return;
                }else{
                    //获取订单数据
                    var so_price = parseFloat(vm.order.so_price);
                    var so_source_price = parseFloat(vm.order.so_source_price);
                    var so_send_price = parseFloat(vm.order.so_send_price);
                    var new_send_price = parseFloat(e.value);
                    so_price = so_price - so_send_price + new_send_price;
                    so_source_price = so_source_price - so_send_price + new_send_price;

                    updateOrderSendPrice(so_id,so_price,so_source_price,new_send_price)
                        .then(res=>{
                            console.log(res)
                            if(res.code == '0'){
                                successTips('修改成功')
                                vm.order.so_price = so_price;
                                vm.order.so_source_price = so_source_price;
                                vm.order.so_send_price = new_send_price;
                            }
                        })

                }

            } else {
                return false;
            }
        })
        document.querySelector('.mui-popup-input input').type='number'
    })


    $('.sureli').on('click',function(){
        updateOrderStatus(so_id,to_status)
            .then(res=>{
                if(res.code == 0){
                    successTips('操作成功!');
                    vm.order.so_status = to_status;
                }else{
                    failTips(res.message);
                }
                closeConfirm()
            })
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


