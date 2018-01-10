/**
 * Created by Administrator on 2017/8/28 0028.
 */
Vue.config.productionTip = false
var vm = new Vue({
    el:'#app',
    data:{
        isOk:1,                 //获取信息错误
        is_discount:0,          //是否为优惠订单
        detail:{},              //订单详情
        service:0,              //服务费
        address:{},              //收获地址
        from:'',
        uad_reciever_tel:''        //收货人电话
    },
    filters:{
        //格式化时间
        FMtime:function(time){
            if(!isUndef(time) && !isNull(time) && time.length > 19){
                time = time.substring(0,19)
            }
            return time
        },
        //获取支付方式
        getPayMode:function(mode){
            // 0 支付宝 1 微信 2 余额 3 支付宝和余额 4 微信和余额
            if(mode == '0'){
                return '支付宝支付';
            }else if(mode == '1'){
                return '微信支付';
            }else if(mode == '2'){
                return '钱包支付';
            }else if(mode == '3'){
                return '支付宝和余额';
            }else if(mode == '4'){
                return '微信和余额';
            }else{
                return '未付款';
            }
        },
        //获取订单状态
        getOrderStaus: function (status) {
            if(status == '0'){
                return '待支付';
            }else if(status == '1'){
                return '已完成';
            }else if(status == '2'){
                return '"已取消';
            }else if(status == '3'){
                return '待消费';
            }else if(status == '4'){
                return '待评价';
            }else if(status == '5'){
                return '已关闭';
            }else if(status == '6'){
                return '待退款';
            }else if(status == '7'){
                return '已退款';
            }else if(status == '8'){
                return '待发货';
            }else if(status == '10'){
                return '待收货';
            }else if(status == '11'){
                return '退款审批中';
            }
        }

    }
})
$(function(){

	var sor_id = getRequestParameter('sor_id');
	var origin = getRequestParameter('origin');
    var is_discount = getRequestParameter('is_discount');//0普通 1优惠
    var from = getRequestParameter('from');
    vm.from = from
    vm.is_discount = is_discount;

    //获取订单详情
    getOrderDetail(sor_id,is_discount)
        .then(res=>{
            console.log(res)
            var code = res.code;
            if(code != 0){
                vm.isOk = 0;
                return;
            }
            vm.detail = res.data;
            //计算服务费
            var service = 0;
            var sv = 0;
            if(is_discount == 0 && res.data.sor_is_send == 0){
                var productlist = res.data.productdetail;
                for(var i = 0; i < productlist.length; i++){
                    sv = productlist[i].sim_service_charge;
                    if(sv == ''){
                        sv = 0;
                    }else{
                        sv = sv * 1;
                    }
                    service += (sv * productlist[i].soi_number);
                }
            }else if(is_discount == 0 && res.data.sor_is_send == 1){
                var uad_id = res.data.uad_id;
                getAddressById(uad_id)
                    .then(res=>{
                        var address = {};
                        var address = '';
                        var code = res.code;
                        if(code == 0){
                            var data = res.data;
                            if(data.uad_province){
                                address = res.data;
                                address.exists = 1;
                            }else{
                                address.exists = 0;
                            }
                            
                        }else{
                            address.exists = 0;
                        }
                        vm.address = address;
                    })
            }
            vm.service = service.toFixed(2);
            $('.loading').hide()
        })
	


    //点击返回
    $(document).on('click','.toback',function(){
        if(origin == 'adr'){
            APP.appToBack()
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToBack.postMessage(12)
        }else if(origin == 'wxshop'){
        }
    })



    //打电话
    $(document).on('click','.phone',function(){
        var phone = $(this).attr('phone');
        if(origin == 'adr'){
            APP.appToPhone(phone)
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToPhone.postMessage(phone)
        }else if(origin == 'wxshop'){
        }
    })

    
})
