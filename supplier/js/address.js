Vue.config.productionTip = false;
var vm = new Vue({
    el: '#app',
    data: {
        shop:{},
        addressList:[],
    }
});

var user_id = '';
$(function(){
    var origin = getRequestParameter('origin');
    user_id = getRequestParameter('user_id');

    init();

    //点击选择地址
    mui(".mui-content").on('tap','.address',function(){ 
        var uad_id = $(this).attr('uad_id');
        var address = {};
        if(uad_id == ''){
            address = vm.shop;
        }else{
            for(var i = 0; i < vm.addressList.length; i++){
                if(vm.addressList[i].uad_id == uad_id){
                    address = vm.addressList[i];
                }
            }
        }
        
        if(origin == 'adr'){
            APP.appToAddressChoose(JSON.stringify(address));
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToAddressChoose.postMessage(address);
        }
    })

    //默认
    mui(".mui-content").on('tap','.todef',function(e){ 
        e.stopPropagation();
        var uad_id = $(this).attr('uad_id');
        defAddress(uad_id,user_id)
            .then(res=>{
                if(res.code == 0){
                    for(var i = 0; i < vm.addressList.length; i++){
                        if(vm.addressList[i].uad_id == uad_id){
                            vm.addressList[i].uad_default_add = 'Y';
                        }else{
                            vm.addressList[i].uad_default_add = 'N';
                        }
                    }

                    var address = {};
                    if(uad_id == ''){
                        address = vm.shop;
                    }else{
                        for(var i = 0; i < vm.addressList.length; i++){
                            if(vm.addressList[i].uad_id == uad_id){
                                address = vm.addressList[i];
                            }
                        }
                    }

                    if(origin == 'adr'){
                        APP.appToDef(JSON.stringify(address));
                    }else if(origin == 'ios'){
                        window.webkit.messageHandlers.appToDef.postMessage(address);
                    }
                }else{
                    failTips(res.message);
                }
            })


    })

    //编辑
    mui(".mui-content").on('tap','.editAddre',function(e){ 
        e.stopPropagation();
        var uad_id = $(this).attr('uad_id');

        var address = {};
        for(var i = 0; i < vm.addressList.length; i++){
            if(vm.addressList[i].uad_id == uad_id){
                address = vm.addressList[i];
            }
        }

        if(origin == 'adr'){
            APP.appToEdit(JSON.stringify(address));
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToEdit.postMessage(address);
        }
    })

    //添加收货地址
    $('.addAddress').on('click',function(){
        if(origin == 'adr'){
            APP.appToAdd();
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToAdd.postMessage(666);
        }
    })

    //点击删除
    var del_uad_id = '0';
    mui(".mui-content").on('tap','.delAddre',function(e){ 
        e.stopPropagation();
        var uad_id = $(this).attr('uad_id');
        del_uad_id = uad_id;
        showConfirm('确定要删除吗 ?');
        return false;
    })

    //$(document).on('click','#sureDel',function(){
    $('.sureDel').on('click',function(){
        delAddress(del_uad_id)
            .then(res=>{
                if(res.code == 0){
                    $('.address[uad_id='+del_uad_id+']').remove();
                    closeConfirm();
                }else{
                    failTips(res.message);
                }
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

function init(){
    addressList(user_id)
        .then(res=>{
            $("#loadingdiv").remove();
            vm.addressList = res.data.item;
        })

    getShopAddress(user_id)
        .then(res=>{
            vm.shop = res.data.item[0];
        })
}

mui.init({
    pullRefresh:{
        container: '#pullrefresh',
        down: {
            auto:false,//可选,默认false.自动下拉刷新一次
            callback: pulldownRefresh
        }
    }
});


function pulldownRefresh(){
    init();
    mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
}



