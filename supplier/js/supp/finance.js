Vue.config.productionTip = false
var vm = new Vue({
    el:'#app',
    data:{
        info:{},            //数据载体
        account:{}         //账户信息和结算信息
    }

})




$(function(){
    //顶部数字展示   唱的话会自动缩小字体
    smartSize();

    var csr_id = getRequestParameter('csr_id');
    var origin = getRequestParameter('origin');

    csrFinance(csr_id)
        .then(res=>{
        $("#loadingdiv").remove();
        vm.info = res.data;
        vm.account = res.data.item[0];
    })

    //销售统计点击事件
    mui(".mui-content").on('tap','#salecount',function(){ 
        if(origin == 'adr'){
            APP.appToSale();
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToSale.postMessage(1);
        }
    })

    //最后结算时间
    mui(".mui-content").on('tap','.lastdate',function(){ 
        if(origin == 'adr'){
            APP.appToLastDate();
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToLastDate.postMessage(1);
        }
    })

    //结算账户
    mui(".mui-content").on('tap','#acount',function(){ 
        if(origin == 'adr'){
            APP.appToAcount();
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToAcount.postMessage(1);
        }
    })

    //结算方式
    mui(".mui-content").on('tap','#paytype',function(){ 
        if(origin == 'adr'){
            APP.appToPayType();
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToPayType.postMessage(1);
        }
    })


})



mui.init({

});



