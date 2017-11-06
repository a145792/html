Vue.config.productionTip = false
var vm = new Vue({
	el:'#app',
	data:{
		is_discount:'0',		//0消费 1优惠
		list:[],				//历史
		count:1,   				//总数
		token:true,  			//下一页的锁
		page:1    				//当前页码
	},
	filters:{
		//格式化时间
        FMtime:function(time){
            if(!isUndef(time) && !isNull(time) && time.length > 10){
                time = time.substring(0,10)
            }
            return time;
        },
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
        //获取订单号
        getOrderNo:function(num){
        	if(!isUndef(num) && !isNull(num)){
                return num;
            }else{
            	return '尚未结算';
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

    //init
	getPayHistory(shop_id,0,1)
		.then(res=>{
        console.log(res);
			vm.list = res.data.item;
			vm.count = res.data.count;
            $(".loading").hide();
		})


	//切换优惠与普通订单
	$(document).on('click','.payTable a',function(){
		var is_discount = $(this).attr('is_discount');
		if(is_discount == vm.is_discount){
			return
		}
		getPayHistory(shop_id,is_discount,1)
			.then(res=>{
				vm.list = res.data.item;
				vm.count = res.data.count;
				vm.is_discount = is_discount;
				vm.page = 1;
			})
	})

	//下拉加载下一页
	//上拉加载下一页
    $(window).scroll(function() { 
        if ($(document).scrollTop() >= $(document).height() - $(window).height()) {

            if(!vm.token){
                return
            }else{
                vm.token = false;
            }

            //获取当前类型  和总数
            var is_discount = vm.is_discount;
            var acount = vm.count;

            //计算总页码
            var pageCount = parseInt((acount%10 == 0) ? acount/10 : acount/10 + 1);

            if(vm.page >= pageCount){
                vm.token = true;
                return;
            }

            //加载数据
            getPayHistory(shop_id,is_discount,vm.page+1)
                .then(res=>{
                    var code = res.code
                    if(code == 0){
                        var list = res.data.item;
                        vm.list = vm.list.concat(list);
                        vm.page = vm.page + 1;
                        vm.token = true
                    }else{
                        alert(res.message);
                        vm.token = true
                    }
                })

        }
    })

})

