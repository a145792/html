Vue.config.productionTip = false;
var vm = new Vue({
    el: '#app',
    data: {
        money:'',
        csr_id:'',
        orders:[],
        page:1,
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
    var csr_id = getRequestParameter('csr_id');
    vm.csr_id = csr_id;
    var origin = getRequestParameter('origin');
    var money = getRequestParameter('money');
    vm.money = money;

    pageInit();

    //点击订单
    mui(".mui-content").on('tap','.order',function(e){ 
        var so_id = $(this).attr('so_id');
        if(origin == 'adr'){
            APP.appToOrder(so_id);
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToOrder.postMessage(so_id);
        }
    })
})

var myDate = new Date();
var time = myDate.getFullYear()+"-"+(myDate.getMonth()+1)+"-"+myDate.getDate();

function pageInit(){
    suppSerchOrders(vm.csr_id,'TheEnd','',time,time,1)
        .then(res=>{
            smartSize();
            var count = res.data.count;
            if(count==0){
                empty("../images/No-such-orders_03.png");
            }
            vm.count = count;

            var pageNumber = parseInt((count%10 == 0) ? count/10 : count/10 + 1);
            vm.pageNumber = pageNumber;

            vm.orders = res.data.item;
            vm.page = 1;
            if($("#loadingdiv").length > 0){
                $("#loadingdiv").remove();
            }
        })
}

mui.init({
    pullRefresh:{
        container: '#pullrefresh',
        down: {
            auto:false,//可选,默认false.自动下拉刷新一次
            callback: pulldownRefresh
        },
        up: {

            contentrefresh: '正在加载...',
            contentnomore:'没有更多数据了',
            callback: pullupRefresh
        }
    }
});

function pulldownRefresh(){
    pageInit();
    mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); 
    mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
}

//上拉加载
function pullupRefresh(){
    mui('#pullrefresh').pullRefresh().endPullupToRefresh(((vm.page >= vm.pageNumber))); 
    if(vm.page < vm.pageNumber){

        suppSerchOrders(vm.csr_id,'TheEnd','',time,time,vm.page*1+1)
            .then(res=>{
                vm.orders = vm.orders.concat(res.data.item);
                vm.page = vm.page*1 + 1;
            })

    }
}


