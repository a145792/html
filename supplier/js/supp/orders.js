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
        csr_id:'',
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
                return '已发货';
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
});

$(function(){
    var origin = getRequestParameter('origin');
    var csr_id = getRequestParameter('csr_id');
    var status = getRequestParameter('status');
    if(!status || status == ''){
        status = 0;
    }

    vm.csr_id = csr_id;
    vm.status = status;

    //获取我的订单列表
    suppOrderList(csr_id,status,1)
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
        suppOrderList(csr_id,status,1)
            .then(res=>{
                var count = res.data.count;
                vm.count = count;

                var pageNumber = parseInt((count%10 == 0) ? count/10 : count/10 + 1);
                vm.pageNumber = pageNumber;
                vm.page = 1;

                vm.orders = res.data.item;
                vm.status = status;
                if(vm.count==0){
                    no_Detail("../images/No-such-orders_03.png");
                }else{
                    $(".no-shuju").remove();
                }
                mui('#pullrefresh').pullRefresh().scrollTo(0,0);
                mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
            })
    })

    //联系买家
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


    //我已发货
    mui(".mui-content").on('tap','.imSend',function(e){
        e.stopPropagation();
        var so_id = $(this).attr('so_id');
        c_type = 'Send';
        c_so_id = so_id;
        showConfirm("确认发货？");
    })

    //确认退款
    mui(".mui-content").on('tap','.CloseRefund',function(e){ 
        e.stopPropagation();
        var so_id = $(this).attr('so_id');
        c_so_id = so_id;
        c_type = 'PlatfromRefund';
        showConfirm("确认退款？");
    })

    //完成订单
    mui(".mui-content").on('tap','.toEnd',function(e){ 
        e.stopPropagation();
        var so_id = $(this).attr('so_id');
        c_so_id = so_id;
        c_type = 'TheEnd';
        showConfirm("客户已经取货,确认完成订单?");
    })

    //修改运费
    mui(".mui-content").on('tap','.promptBtn',function(e){
        e.stopPropagation();
        e.detail.gesture.preventDefault();
        var so_id = $(this).attr('so_id')
        var btnArray = ['取消', '确定'];
        mui.prompt('', '', '修改运费', btnArray, function(e) {
            if (e.index == 1) {
                if(! /^\d+(\.\d{1,2})?$/.test(e.value)){
                    mui.toast("请输正确的金额,暂只支持两位小数");
                    return;
                }
                if(e.value==''){
                    mui.toast("输入金额不能为空");
                }else{
                    var temp;
                    //修改当下运费$("#info)的值
                    for(var i = 0; i < vm.orders.length; i++){
                        if(vm.orders[i].so_id == so_id){
                            temp = i;
                            //获取订单数据
                            var so_price = parseFloat(vm.orders[i].so_price);
                            var so_source_price = parseFloat(vm.orders[i].so_source_price);
                            var so_send_price = parseFloat(vm.orders[i].so_send_price);
                            var new_send_price = parseFloat(e.value);

                            so_price = so_price - so_send_price + new_send_price;
                            so_source_price = so_source_price - so_send_price + new_send_price;

                            updateOrderSendPrice(so_id,so_price,so_source_price,new_send_price)
                                .then(res=>{
                                if(res.code == '0'){
                                    successTips('修改成功')
                                    vm.orders[temp].so_price = so_price;
                                    vm.orders[temp].so_source_price = so_source_price;
                                    vm.orders[temp].so_send_price = new_send_price;
                                }
                            })

                        }
                    }
                    mui.toast("修改成功");
                }

            } else {
                return false;
            }
        })
        document.querySelector('.mui-popup-input input').type='number'
    })


    //点取消事件
    $(".abolish").on('click',function(){
      //  e.stopPropagation();
        closeConfirm();
    })


   
    $('.sureli').on('click',function(){

        updateOrderStatus(c_so_id,c_type)
            .then(res=>{
                if(res.code == 0){

                    successTips('操作成功!');
                    setOrderStatus(c_so_id,c_type);
                }else{
                    failTips(res.message);
                }
            })


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

//设置订单状态
function setOrderStatus(so_id,status){
    for(i in vm.orders){
        if(vm.orders[i].so_id == so_id){
            vm.orders[i].so_status = status;
        }
    }
}



var s = mui.init({
    pullRefresh:{
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
s();

function pulldownRefresh(){
    suppOrderList(vm.csr_id,vm.status,1)
        .then(res=>{
        vm.orders = res.data.item;
        vm.page =  1;
        var count = res.data.count;
        vm.count = count;

        var pageNumber = parseInt((count%10 == 0) ? count/10 : count/10 + 1);
        vm.pageNumber = pageNumber;
        mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
        mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
    })
    
}

function pullupRefresh(){
    mui('#pullrefresh').pullRefresh().endPullupToRefresh((vm.page >= vm.pageNumber)); 
    if(vm.page < vm.pageNumber){

        suppOrderList(vm.csr_id,vm.status,vm.page*1+1)
            .then(res=>{
                vm.orders = vm.orders.concat(res.data.item);
                vm.page = vm.page*1 + 1;
            })

    }
}



