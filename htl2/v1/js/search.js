Vue.config.productionTip = false;
var vm = new Vue({
    el:'#app',
    data:{
    	shop_id:'',
    	key:'',
    	ccr_id:'',
    	list:[]
    },
    methods:{
    	search:function(){
    		init()
    	},
    	addToCart:function(sim_id){
    		if(vm.ccr_id == ''){
    			window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb36c2d54f3a2ad60&redirect_uri=http://a.jiuziran.com/ForwardServlet?biz=toweb3&response_type=code&scope=snsapi_userinfo&state=0#wechat_redirect';
    			return
    		}
    		addToCart(vm.ccr_id,vm.shop_id,1,sim_id)
    			.then(res=>{
    				if(res.code == '0'){
    					$('.alertTan>span').html('加入购物车成功');
	                    $('.alertTan').show();
	                    setTimeout(function(){
	                        $('.alertTan').hide();
	                    },1000);
    				}else{
    					$('.alertTan>span').html(res.message);
	                    $('.alertTan').show();
	                    setTimeout(function(){
	                        $('.alertTan').hide();
	                    },1000);
    				}
    			})
    	}
    }
})

$(function() {
	vm.shop_id = getRequestParameter('shop_id')
	vm.ccr_id = getRequestParameter('ccr_id')
	init()
})

function init(){
	$(".loading").remove();
	if(vm.key == ''){
		vm.list = []
		return
	}
	searchByShop(vm.shop_id,vm.key)
		.then(res=>{
			vm.list = res.data.item
		})
}

