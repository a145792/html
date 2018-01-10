Vue.config.productionTip = false;
var vm = new Vue({
    el: '#app',
    data: {
        status:'',//status  1获取组合商品选材列表   2促销商品选材列表
        csr_id:'',
        type:'',
        list:[],
        types:[],
        page:1,
        count:'1',
        pageNumber:0
    }
});


$(function(){

    vm.status = getRequestParameter('status')
    vm.csr_id = getRequestParameter('csr_id')
    init()

    $(document).on('click','input:checkbox',function(){
        var spt_id = $(this).attr('spt_id')
        if(vm.status == '2'){
            for(var i = 0; i < vm.list.length; i++){
                if(vm.list[i].spt_id != spt_id){
                    vm.list[i].checked = false
                }
            }
        }
    })
    
    //点击确定
    $(document).on('click','.addSaleMan',function(){
        //获取点选的商品
        var ids = getIds()
        var names = getNames()
        if(!ids || ids == ''){
            failTips('请选择商品!')
            return
        }
        var params = {'ids':ids,'names':names,'status':vm.status}
        APPAction('toActiviSource',params)
    })

    //点击分类
    $(document).on('click','.ite',function(){
        close()
        var ite_id = $(this).attr('ite_id')
        vm.type = ite_id
        init()
    })

    //点击遮罩层
    $(document).on('click','.AdvertDetail',function(){
        close()
    })

})

function init(){
    getActivitySource(vm.csr_id,vm.type,vm.status,vm.page)
        .then(res=>{
            $("#loadingdiv").remove()
            if(res.code != '0'){
                mui.toast(res.message)
            }
            var count = res.data.count
            vm.count = count
            var pageNumber = parseInt((count%10 == 0) ? count/10 : count/10 + 1)
            vm.pageNumber = pageNumber
            var list = res.data.item
            for(var i = 0; i < list.length; i++){
                list[i].checked = false
            }
            vm.list = res.data.item
            if(vm.count == 0){
                no_Detail("../images/No-such-orders_03.png");
            }else{
                $(".no-shuju").remove();
            }
        })

    getSupplierTypes(vm.csr_id)
        .then(res=>{
            vm.types = res.data.items
        })
}

//打开分类
function showTypes(){
    $('.AdvertDetail').show();
    $('.rightCase').removeClass("rightNoRun").addClass("rightRun");
}
//关闭分类
function close(){
    $('.AdvertDetail').fadeOut();
    $('.rightCase').removeClass("rightRun").addClass("rightNoRun");
    $(this).parent().parent().parent().siblings().children().children().removeClass("active");
}
function getIds(){
    var ids = ''
    for(var i = 0; i < vm.list.length; i++){
        if(vm.list[i].checked == true){
            ids += vm.list[i].spt_id + ','
        }
    }
    if(ids != ''){
        ids = ids.substring(0,ids.length - 1)
    }

    return ids
}

function getNames(){
    var names = ''
    for(var i = 0; i < vm.list.length; i++){
        if(vm.list[i].checked == true){
            names += vm.list[i].spt_name + ','
        }
    }
    if(names != ''){
        names = names.substring(0,names.length - 1)
    }

    return names
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

    setTimeout(function () {
        init()
        mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
        mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
    }, 1000);

}
//上拉加载
function pullupRefresh(){
    mui('#pullrefresh').pullRefresh().endPullupToRefresh((vm.page >= vm.pageNumber)); 
    if(vm.page < vm.pageNumber){

        getActivitySource(vm.csr_id,vm.type,vm.status,vm.page*1+1)
            .then(res=>{
                var list = res.data.item
                for(var i = 0; i < list.length; i++){
                    list[i].checked = false
                }
                vm.list = vm.list.concat(list);
                vm.page = vm.page*1 + 1;
            })

    }
}
