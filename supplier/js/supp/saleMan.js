Vue.config.productionTip = false;
var vm = new Vue({
    el: '#app',
    data: {
        list:[],
        csr_id:'',
        page:1,
        count:'1',
        pageNumber:0
    }
});


$(function(){
    var csr_id = getRequestParameter('csr_id')
    vm.csr_id = csr_id
    init()

    //点击业务员
    mui(".mui-content").on('tap','.saleman',function(e){ 
        e.stopPropagation();
        var sm_id = $(this).attr('sm_id');
        var params = {'sm_id':sm_id}
        APPAction('saleMan',params)
    })

    //添加业务员
    mui(".mui-content").on('tap','.toadd',function(e){ 
        e.stopPropagation();
        APPAction('addSaleMan',{})
    })

})

function init(){
    getSaleManList(vm.csr_id,1)
        .then(res=>{
            vm.page = 1
            $("#loadingdiv").remove();
            var count = res.data.count
            vm.count = count
            var pageNumber = parseInt((count%10 == 0) ? count/10 : count/10 + 1)
            vm.pageNumber = pageNumber

            vm.list = res.data.item
            if(vm.count == 0){
                no_Detail("../images/No-such-orders_03.png");
            }else{
                $(".no-shuju").remove();
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

//下拉刷新
function pulldownRefresh(){
    init()
    setTimeout(function () {
        //实现更新页面的操作
        mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
        mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
    }, 1000);

}
//上拉加载
function pullupRefresh(){
    mui('#pullrefresh').pullRefresh().endPullupToRefresh((vm.page >= vm.pageNumber)); 
    if(vm.page < vm.pageNumber){

        getSaleManList(vm.csr_id,vm.page*1+1)
            .then(res=>{
                vm.list = vm.list.concat(res.data.item);
                vm.page = vm.page*1 + 1;
            })

    }
}