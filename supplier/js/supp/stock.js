Vue.config.productionTip = false;
var vm = new Vue({
    el: '#app',
    data: {
        list:[],
        csr_id:'',
        page:1,
        count:'1',
        pageNumber:0,
        from:''
    }
});


$(function(){
    var csr_id = getRequestParameter('csr_id')
    var from = getRequestParameter('from')
    vm.csr_id = csr_id
    vm.from = from
    init()

    //点击商品
    mui(".mui-content").on('tap','.product',function(e){ 
        e.stopPropagation();
        var spt_id = $(this).attr('spt_id');
        var params = {'spt_id':spt_id,'from':vm.from}
        APPAction('product',params)
    })

})

function init(){
    getSuppProduct(vm.csr_id,1)
        .then(res=>{
            vm.page = 1
            $("#loadingdiv").remove();
            var count = res.data.count
            vm.count = count
            var pageNumber = parseInt((count%10 == 0) ? count/10 : count/10 + 1)
            vm.pageNumber = pageNumber

            var list = res.data.item
            formatList(list)
            vm.list = list
            log(list)
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
        getSuppProduct(vm.csr_id,vm.page*1+1)
            .then(res=>{
                var list = res.data.item
                formatList(list)
                vm.list = vm.list.concat(list)
                vm.page = vm.page*1 + 1
            })

    }
}

function formatList(list){
    if(!list || list.length < 1){
        return []
    }
    for(var i = 0; i < list.length; i++){
        if(list[i].specs){
            list[i].specs = list[i].specs.split(',')
        }else{
            list[i].specs = []
        }
    }
    return list
}