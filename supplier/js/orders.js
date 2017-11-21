/**
 * Created by Administrator on 2017/9/27 0027.
 */
Vue.config.productionTip = false
var vm = new Vue({//此处采用vue.js
    el: '#app',
    data: {
        orders:[],
        page:1,
        status:0,       //0 代付款  1待收货 2待提货 3退款/售后 
        user_id:'',
        count:'1',
        pageNumber:0
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
        getPayMode:function(m){
            if(m == '0'){
                return '微信支付';
            }else if(m == '1'){
                return '支付宝';
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
});

$(function(){
    var origin = getRequestParameter('origin');
    var user_id = getRequestParameter('user_id');
    vm.user_id = user_id;

    //获取我的订单列表
    orderList(user_id,0,1)
        .then(res=>{
            $("#loadingdiv").remove();
            var count = res.data.count;
            vm.count = count;

            var pageNumber = parseInt((count%10 == 0) ? count/10 : count/10 + 1);
            vm.pageNumber = pageNumber;

            vm.orders = res.data.item;
            if(vm.count==0){
                no_Detail("../images/No-such-orders_03.png");
            }else{
                $(".no-shuju").remove();
            }
        })


    //切换订单类型
    $(document).on('tap','.orderstatus',function(){
        var status = $(this).attr('status');
        //获取我的订单列表
        orderList(user_id,status,1)
            .then(res=>{
                var count = res.data.count;
                vm.count = count;

                var pageNumber = parseInt((count%10 == 0) ? count/10 : count/10 + 1);
                vm.pageNumber = pageNumber;

                vm.orders = res.data.item;
                vm.status = status;
                if(vm.count==0){
                    no_Detail("../images/No-such-orders_03.png");
                }else{
                    $(".no-shuju").remove();
                }
                mui('#pullrefresh').pullRefresh().scrollTo(0,0);
            })
    })

    //去支付
    mui(".mui-content").on('tap','.topay',function(e){ 
        e.stopPropagation();
        var so_id = $(this).attr('so_id');
        var so_no = $(this).attr('so_no');
        var price = $(this).attr('price');
        var so_issend = $(this).attr('so_issend');
        var json = {};
        json.so_id = so_id;
        json.so_no = so_no;
        json.so_price = price;
        json.so_issend = so_issend;
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

    //点击订单
    mui(".mui-content").on('tap','.order',function(e){ 
        var so_id = $(this).attr('so_id');
        if(origin == 'adr'){
            APP.appToOrder(so_id);
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToOrder.postMessage(so_id);
        }
    })

    var c_so_id = '';
    var c_type = '';

    //取消订单
    mui(".mui-content").on('tap','.Cancel',function(e){ 
        e.stopPropagation();

        var so_id = $(this).attr('so_id');
        c_so_id = so_id;
        c_type = 'Cancel';
        showConfirm("您确认取消此订单吗？");
    })

    //点取消事件
    $(".abolish").on('click',function(){
      //  e.stopPropagation();
        closeConfirm();
    })

    //退款
    mui(".mui-content").on('tap','.Refund',function(e){ 
        e.stopPropagation();
        var so_id = $(this).attr('so_id');
        c_so_id = so_id;
        mui('#refund').popover('toggle');
    })

    //取消退款
    mui(".mui-content").on('tap','.CloseRefund',function(e){ 
        e.stopPropagation();
        var so_id = $(this).attr('so_id');
        c_so_id = so_id;
        c_type = 'closeRefund';
        showConfirm("您确认取消退款吗？");
    })

    //确认收货
    mui(".mui-content").on('tap','.Confirm',function(e){ 
        e.stopPropagation();
        var so_id = $(this).attr('so_id');
        c_so_id = so_id;
        c_type = 'TheEnd';
        showConfirm("是否确认收货？");
    })


    $(document).on('click','.refundtip',function(){
        var so_refund_cause = $(this).html();
        refundOrder(c_so_id,so_refund_cause)
            .then(res=>{
                if(res.code == 0){
                    cleanOrder(c_so_id);
                    mui('#refund').popover('toggle');
                }else{
                    failTips(res.message);
                }
            })
    })

   //mui(".mui-content").on('tap','.sureli',function(e){ 
    $('.sureli').on('click',function(){
        if(c_type == 'Cancel'){
            //取消
            updateOrderStatus(c_so_id,'Cancel')
                .then(res=>{
                    if(res.code == 0){
                        successTips('操作成功!');
                        cleanOrder(c_so_id);
                    }else{
                        failTips(res.message);
                    }
                })

        }else if(c_type == 'closeRefund'){
            //取消退款
            closeRefundOrder(c_so_id)
                .then(res=>{
                    if(res.code == 0){
                        successTips('操作成功!');
                        cleanOrder(c_so_id);
                    }else{
                        failTips(res.message);
                    }
                })
        }else if(c_type == 'TheEnd'){
            //确认收货
            updateOrderStatus(c_so_id,'TheEnd')
                .then(res=>{
                    if(res.code == 0){
                        successTips('操作成功!');
                        cleanOrder(c_so_id);
                    }else{
                        failTips(res.message);
                    }
                })
        }
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

//删除dom  
function cleanOrder(so_id){
    for(i in vm.orders){
        if(vm.orders[i].so_id == so_id){
            vm.orders.splice(i,1);
        }
    }
}



mui.init({
    pullRefresh:
    {
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
function pulldownRefresh(){
    orderList(vm.user_id,vm.status,1)
        .then(res=>{
            vm.orders = res.data.item;
            vm.page =  1;
            var count = res.data.count;
            vm.count = count;

            var pageNumber = parseInt((count%10 == 0) ? count/10 : count/10 + 1);
            vm.pageNumber = pageNumber;
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
        })
      
    
}

/*
 * 上拉加载具体业务实现
 */
function pullupRefresh(){
    mui('#pullrefresh').pullRefresh().endPullupToRefresh(((vm.page >= vm.pageNumber))); 
    if(vm.page < vm.pageNumber){

        orderList(vm.user_id,vm.status,vm.page*1+1)
            .then(res=>{
                vm.orders = vm.orders.concat(res.data.item);
                vm.page = vm.page*1 + 1;
            })

    }
}



