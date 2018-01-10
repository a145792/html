Vue.config.productionTip = false
var vm = new Vue({
	el:'#app',
	data:{
		list:[],			//账户列表
		count:1,			//已绑定的个数
		origin:''
	},
	filters:{
		//截取后五位
        getNum:function(num){
        	if(num.length <= 5){
        		return num;
        	}else{
        		return num.substring(num.length - 5,num.length);
        	}
        },
		//获取账户图片
        getBankImg:function(bind_name){
            if (bind_name.indexOf("建设") != -1) {
				return "../themes/images/bank/jianshe.png";
			} else if (bind_name.indexOf("邮政") != -1) {
				return "../themes/images/bank/youzheng.png";
			} else if (bind_name.indexOf("招商") != -1) {
				return "../themes/images/bank/zhaoshang.png";
			} else if (bind_name.indexOf("中国银行") != -1) {
				return "../themes/images/bank/zhongguo.png";
			} else if (bind_name.indexOf("交通") != -1) {
				return "../themes/images/bank/jiaotong.png";
			} else if (bind_name.indexOf("农业") != -1) {
				return "../themes/images/bank/nongye.png";
			} else if (bind_name.indexOf("工商") != -1) {
				return "../themes/images/bank/gongshang.png";
			} else if (bind_name.indexOf("广发") != -1) {
				return "../themes/images/bank/guangfa.png";
			} else if (bind_name.indexOf("兴业") != -1) {
				return "../themes/images/bank/xingye.png";
			} else if (bind_name.indexOf("中信") != -1) {
				return "../themes/images/bank/zhongxin.png";
			} else if (bind_name.indexOf("浦发") != -1) {
				return "../themes/images/bank/pufa.png";
			} else if (bind_name.indexOf("光大") != -1) {
				return "../themes/images/bank/guangda.png";
			} else {
				// 剩下的使用银联
				return "../themes/images/bank/yinlian.png";
			}
        },
        getBankColor:function(string){
			if (string.indexOf("建设") != -1) {
				return 'background: #003A8F'
			} else if (string.indexOf("邮政") != -1) {
				return 'background: #0F7D40';
			} else if (string.indexOf("招商") != -1) {
				return 'background: #C22325';
			} else if (string.indexOf("中国银行") != -1) {
				return 'background: #B51C21';
			} else if (string.indexOf("交通") != -1) {
				return 'background: #1D2088';
			} else if (string.indexOf("农业") != -1) {
				return 'background: #169274';
			} else if (string.indexOf("工商") != -1) {
				return 'background: #E60012';
			} else if (string.indexOf("广发") != -1) {
				return 'background: #ED1A2E';
			} else if (string.indexOf("兴业") != -1) {
				return 'background: #004186';
			} else if (string.indexOf("中信") != -1) {
				return 'background: #E60012';
			} else if (string.indexOf("浦发") != -1) {
				return 'background: #1D2088';
			} else if (string.indexOf("光大") != -1) {
				return 'background: #F8E900';
			} else {
				return 'background: #DC3C4F';
			}
        }

	}
})



$(function(){
	//获取店铺id
	var shop_id = getRequestParameter('shop_id');
	//是否完成资质认证(0 已认证, 1 未认证)
	var isauth = getRequestParameter('isauth');

    var origin = getRequestParameter('origin');
    vm.origin = origin;



	//获取绑定账户列表
	findDspAcct(shop_id,1)
		.then(res=>{
			vm.count = res.data.count;
			vm.list = res.data.item;
			$(".loading").hide();
		})




	//设置为默认收款方式
	$(document).on('click','.defaltcart',function(){
		var isdef = $(this).attr('isdef');
		var type = $(this).attr('type');
		var bid = $(this).attr('bid');
		if(isdef == 1){
			return 
		}
		accountToDef(shop_id,type,bid)
			.then(res=>{
				var code = res.code
				if(code == 0){
					findDspAcct(shop_id,1)
						.then(res=>{
							vm.count = res.data.count;
							vm.list = res.data.item;
						})
				}else{
					alert(res.message);
				}
			})
	})


	//点击绑定银行卡
	$('.foot').on('click',function(){
		//是否已经认证
		if(isauth == 1){
			 $('.renzheng').show();
			 return;
		}
		if(origin == 'adr'){
            APP.appToBindBankCard()
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToBindBankCard.postMessage(12)
        }else if(origin == 'wxshop'){
        }
	})


	//点击绑定支付宝
	$('#to_bind_alipay_a').on('click',function(){
		//是否已经认证
		if(isauth == 1){
			 $('.renzheng').show();
			 return;
		}
		if(origin == 'adr'){
            APP.appToAlipay()
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToAlipay.postMessage(12)
        }else if(origin == 'wxshop'){
        }
	})


	//点击取消模态框
    $('.delete').on('click',function(){
        $('.renzheng').hide();
    });
	
	
	//去认证
	$('.toauth_td').on('click',function(){
		if(origin == 'adr'){
            APP.appToAuth()
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToAuth.postMessage(12)
        }else if(origin == 'wxshop'){
        }
        $('.renzheng').hide();
	})

	//返回财务管理
	/*$(document).on('click','.to_financial_a',function(){
		//var path = getRootPath();
		//window.location.href = path + '/busweb/financial.html?shop_id=' + shop_id + '&origin=' + origin + '&isauth=' + isauth;
		if(origin == 'adr'){
            APP.appToBackUp()
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToBackUp.postMessage()
        }else if(origin == 'wxshop'){
        }
	})*/

})














