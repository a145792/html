Vue.config.productionTip = false;
var vm = new Vue({
    el: '#app',
    data: {
        status:0,    //0 未分配1已分配
        sm_id:'',
        shop_name:'',
        list:[],
        page:1,
        count:'1',
        pageNumber:0
    }
});


$(function(){
    var status = getRequestParameter('status')
    if(status && status != ''){
        vm.status = status
    }
    vm.sm_id = getRequestParameter('sm_id')

    init()

    //切换是否已经分配
    $('.shoptype').on('click',function(e){ 
        e.stopPropagation();
        var status = $(this).attr('status');
        if(status != vm.status){
            mui('#pullrefresh').pullRefresh().scrollTo(0,0);
            mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
            vm.status = status
            init()
        }
    })

    //确定添加
    $('.toAdd').on('click',function(){
            var ids = getIds()
            if(ids == ''){
                mui.toast('请选择要分配的店铺!')
            }else{
                saleManAddShop(vm.sm_id,ids)
                    .then(res=>{
                        if(res.code == 0){
                            removeShop(ids)
                        }
                        mui.toast(res.message)
                    })
            }
    })

    var confirm = myConfirm(
        '确定要取消分配店铺吗?'
        ,function(){
            var ids = getIds()
            if(ids == ''){
                mui.toast('请选择要取消分配的店铺!')
            }else{
                saleManDelShop(vm.sm_id,ids)
                    .then(res=>{
                        if(res.code == 0){
                            removeShop(ids)
                        }
                        mui.toast(res.message)
                    })
            }
        }
        ,null  
    )
    //点击删除
    $('.toDel').on('click',function(){
        confirm.show()
    })

    //点击搜索
    $('.seach-click').on('click',function(){
        init()
    })


})

function init(){
    getSMShops(vm.status,vm.shop_name,vm.sm_id,1)
        .then(res=>{
            log(res)
            if(res.code != '0'){
                mui.toast(res.message)
                return
            }
            vm.page = 1
            $("#loadingdiv").remove();
            var count = res.data.count
            vm.count = count
            var pageNumber = parseInt((count%10 == 0) ? count/10 : count/10 + 1)
            vm.pageNumber = pageNumber

            var list = formatList(res.data.item)
            vm.list = list

            $('.shop').css('display','block')
            
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
        mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
        mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
    }, 1000);

}
//上拉加载
function pullupRefresh(){
    mui('#pullrefresh').pullRefresh().endPullupToRefresh((vm.page >= vm.pageNumber)); 
    if(vm.page < vm.pageNumber){
        getSMShops(vm.status,vm.shop_name,vm.sm_id,vm.page*1+1)
            .then(res=>{
                var list = formatList(res.data.item)
                vm.list = vm.list.concat(list)
                vm.page = vm.page*1 + 1
            })
    }
}
 
function formatList(list){
    if(!list || list.length <= 0){
        return []
    }
    var s = ''
    for(var i = 0; i < list.length; i++){
        s = ''
        if(isNull(list[i].usersname)){
            list[i].usersname = '未分配'
        }else{
            for(var j = 0; j < list[i].usersname.split(',').length; j++){
                if(!isNull(list[i].usersname.split(',')[j])){
                    s += list[i].usersname.split(',')[j] + ' '
                }
            }
            list[i].usersname = s
        }
        list[i].checked = (vm.status == 1)
    }
    return list
}

function getIds(){
    var ids = ''
    for(var i = 0; i < vm.list.length; i++){
        if(vm.list[i].checked == true){
            ids += vm.list[i].dsp_id + ','
        }
    }
    if(ids != ''){
        ids = ids.substring(0,ids.length - 1)
    }

    return ids
}

function removeShop(ids){
    ids = ids.split(',')
    for(var i = 0; i < ids.length; i++){
        $('.shop[dsp_id='+ids[i]+']').css('display','none')
    }
}