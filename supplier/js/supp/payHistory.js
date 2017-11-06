Vue.config.productionTip = false;
var vm = new Vue({
    el: '#app',
    data: {
        list:[],
        page:1,
        csr_id:'',
        count:'1',
        pageNumber:0
    },
    filters:{
        //格式化时间
        FMtime19:function(time){
            if(!isUndef(time) && !isNull(time) && time.length > 18){
                time = time.substring(0,19)
            }
            return time;
        },
        //获取结算状态
        getStatus:function(status){
            if(status == 0){
                return '发起申请';
            }else if(status == 1){
                return '处理中';
            }else if(status == 2){
                return '已结算';
            }else if(status == 3){
                return '已拒绝';
            }
        },
    }
});


$(function(){

    var csr_id = getRequestParameter('csr_id');
    var origin = getRequestParameter('origin');
    vm.csr_id = csr_id;

    payHistory(csr_id,1)
        .then(res=>{
            $("#loadingdiv").remove();
            console.log(res)
            var count = res.data.count;
            vm.count = count;
            vm.list = res.data.item;

            var pageNumber = parseInt((count%10 == 0) ? count/10 : count/10 + 1);
            vm.pageNumber = pageNumber;
        })


    //点击结算凭证
    mui(".mui-content").on('tap','.finpic',function(e){ 
        e.stopPropagation();
        var pic = $(this).attr('pic');
        if(origin == 'adr'){
            APP.appToPic(pic);
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToPic.postMessage(pic);
        }
    })

    //电话
    mui(".mui-content").on('tap','.phone',function(e){ 
        e.stopPropagation();
        var phone = $(this).attr('phone');
        if(origin == 'adr'){
            APP.appToPhone(phone);
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToPhone.postMessage(phone);
        }
    })


})

mui.init({
    pullRefresh:{
        container: '#pullrefresh',
        down: {
            auto:false,//可选,默认false.自动下拉刷新一次
            callback: pulldownRefresh
        },
        up:{
            contentrefresh: '正在加载...',
            contentnomore:'没有更多数据了',
            callback: pullupRefresh
        }
    }
});

//下拉刷新
function pulldownRefresh(){

    setTimeout(function () {
        //实现更新页面的操作
        mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
    }, 1000);

}
//上拉加载
function pullupRefresh(){
    if(2222==2222){
        mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
    }else{
        mui('#pullrefresh').pullRefresh().endPullupToRefresh();
    }
}
