Vue.config.productionTip = false;
var vm = new Vue({
    el: '#app',
    data: {
        csr_id:'',
        time:'',
        info:{},
        orders:[],
        page:'',
        count:1,
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
    //页面当前时间
    var myDate = new Date();
    //$("#end-date").val()
    vm.time = myDate.getFullYear()+"-"+(myDate.getMonth()+1)+"-"+myDate.getDate()+"至"+myDate.getFullYear()+"-"+(myDate.getMonth()+1)+"-"+myDate.getDate();
    
    var csr_id = getRequestParameter('csr_id');
    var origin =getRequestParameter('origin');
    vm.csr_id = csr_id;
    
    pageInit(getBeginTime(),getEndTime());
    
    //改变时间
    $(document).on('click','#d-confirm',function(){
        var time = $("#end-date").val();
        vm.time = time;
        pageInit(getBeginTime(),getEndTime());
    })

    //点击订单
    mui(".mui-content").on('tap','.order',function(e){ 
        var so_id = $(this).attr('soid');
        if(origin == 'adr'){
            APP.appToOrder(so_id);
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToOrder.postMessage(so_id);
        }
    })

})

//加载页面数据
function pageInit(begin,end){
    saleInfo(vm.csr_id,getBeginTime(),getEndTime())
        .then(res=>{
            smartSize();
            vm.info = res.data;
            if($("#loadingdiv").length > 0){
                $("#loadingdiv").remove();
            }
        })

    suppSerchOrders(vm.csr_id,'','Y',getBeginTime(),getEndTime(),1)
        .then(res=>{
            var count = res.data.count;
            vm.count = count;
            if(count==0){
                empty("../images-such-orders_03.png");
            }

            var pageNumber = parseInt((count%10 == 0) ? count/10 : count/10 + 1);
            vm.pageNumber = pageNumber;

            vm.orders = res.data.item;
            vm.page = 1;
        })

}

function getBeginTime(){
    var s = vm.time.split('至')[0];
    var myDate = new Date(s.replace("-","/").replace("-","/"));
    myDate = (new Date(myDate - 86400000))

    return myDate.getFullYear()+"-"+(myDate.getMonth()+1)+"-"+myDate.getDate();
}
function getEndTime(){
    var s = vm.time.split('至')[1];
    var myDate = new Date(s.replace("-","/").replace("-","/"));
    myDate = (new Date(myDate - 86400000))

    return myDate.getFullYear()+"-"+(myDate.getMonth()+1)+"-"+myDate.getDate();
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

    pageInit(getBeginTime(),getEndTime());
    mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); 

}

function pullupRefresh(){
    mui('#pullrefresh').pullRefresh().endPullupToRefresh(((vm.page >= vm.pageNumber))); 
    if(vm.page < vm.pageNumber){

        suppSerchOrders(vm.csr_id,'','Y',getBeginTime(),getEndTime(),vm.page*1+1)
            .then(res=>{
                console.log(res)
                vm.orders = vm.orders.concat(res.data.item);
                vm.page = vm.page*1 + 1;
            })

    }
}

