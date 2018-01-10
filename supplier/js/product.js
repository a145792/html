Vue.config.productionTip = true

var vm = new Vue({
	el:'#app',
	data:{
		addreList:[],
		address:{},
		user_id:'',
		spt_id:'',			//商品id
		detail:'',			//商品详情
		couponList:[],		//优惠券活动列表
		sales:{},			//促销活动
		morefree:{},        //满减活动
		give:{},			//满增活动
		hasSalses:'N',		//是否有促销活动
		hasMorefree:'N',	//是否有满减活动
		hasGive:'N',		//是否有满增活动
		//sale_time:'',	
		//free_time:'',
		//give_time:'',
		first_coupon_name:'',  //第一个优惠券名称
        buy_num:0,              //购买数量
        photolist:[],		//轮播图
        specs:[],			//商品规格列表
        spec:{},			//当前选择的商品规格
        parentProduct:[],	//本商品组成的组合商品
        chirldProduct:[],	//本商品的组成商品单元
        groupInfo:{},		//组合活动信息
        buy_temp:'',		//0 购买 1 加入购物车
	},
	methods:{
		changespec(spec_id){
			for(var i = 0; i < vm.specs.length; i++){
				if(vm.specs[i].spec_id == spec_id){
					vm.spec = vm.specs[i];
					vm.buy_num = vm.specs[i].spec_unit_number;
				}
			}
		}
	}
})



$(function(){
    //获取弹出矿的高度
    var addHeight=$(".addBuy").height();
    $(".addBuy").css("bottom","-"+addHeight+"px");
	/**
	 * 获取页面参数
	 */
	var spt_id = getRequestParameter('spt_id');
	var user_id = getRequestParameter('user_id');
	var origin = getRequestParameter('origin');

	vm.user_id = user_id
	vm.spt_id = spt_id;


	//设置地址id
	initAddressList()
	//获取商品详情
	getSuppDetail(spt_id,user_id)
		.then(res=>{
			log(res)
			if(res.code != '0'){
				mui.toast(res.message)
			}
			var detail = res.data;
			getPromotionInfo(spt_id)
				.then(res=>{
					detail.spt_price = res.data.item[0].spt_price;
					detail.unit = res.data.item[0].unit;
					vm.detail = detail;
					$("#loadingdiv").remove();
				})
			vm.specs = res.data.specs;
			vm.spec = res.data.specs[0];
            vm.buy_num = res.data.specs[0].spec_unit_number;
			vm.couponList=res.data.couponList;
			var photos = res.data.photolist;
			if(photos){
				vm.photolist = photos.split(',');
			}else{
				vm.photolist = ["http://pics.jiuziran.com/FuToK3vEBwWKl7RTgXBQXCKVSriA?imageView2/1/w/200/h/200"];
			}
			
			vm.$nextTick(function () {
			   var slider = mui("#slider");
			   var gallery = mui('.mui-slider');
			   gallery.slider({
			      interval:0//自动轮播周期，若为0则不自动播放，默认为0；
			   });
			})
			var name = '';
			if(res.data.couponList.length > 0){
				name = res.data.couponList[0].cpr_desc;
			}
			vm.first_coupon_name = name;
			//获取商品的满减和促销
			var saandfree = res.data.salesAndMorefree;

			//var canCart = 'Y';
			for(var i = 0; i < saandfree.length; i++){
				if(saandfree[i].mav_type == 'sales'){
					//canCart = 'N';
					vm.hasSalses = 'Y';
					vm.sales = saandfree[i];
					/*var s = saandfree[i].spr_create_time;
					if(saandfree[i].spr_number == 0){
						s = saandfree[i].mav_endtime;
					}
					if(s){
						if(s.length){
							if(s.length > 18){
								s = s.substr(0,18);
							}
						}
					}
					var secs =  new Date(s.replace("-","/").replace("-","/")) - new Date();
					
					secs = parseInt(secs / 1000) + saandfree[i].spr_number*24*60*60;
					
					setInterval(function(){
						vm.sale_time = getBackTime(secs--);
					},1000)*/
				}
				if(saandfree[i].mav_type == 'morefree'){
					vm.hasMorefree = 'Y';
					var obj = formatMorefree(saandfree[i])
					vm.morefree = obj;
					/*var s = saandfree[i].spr_create_time;
					if(saandfree[i].spr_number == 0){
						s = saandfree[i].mav_endtime;
					}
					if(s){
						if(s.length){
							if(s.length > 18){
								s = s.substr(0,18);
							}
						}
					}
					var secs1 =  new Date(s.replace("-","/").replace("-","/")) - new Date();
					secs1 = parseInt(secs1 / 1000) + saandfree[i].spr_number*24*60*60;
					
					setInterval(function(){
						vm.free_time = getBackTime(secs1--);
					},1000)*/
				}
				if(saandfree[i].mav_type == 'fullgive'){
					vm.hasGive = 'Y';
					var obj = saandfree[i]
					vm.give = obj;
					/*var s = saandfree[i].spr_create_time;
					if(saandfree[i].spr_number == 0){
						s = saandfree[i].mav_endtime;
					}
					if(s){
						if(s.length){
							if(s.length > 18){
								s = s.substr(0,18);
							}
						}
					}
					var secs1 =  new Date(s.replace("-","/").replace("-","/")) - new Date();
					secs1 = parseInt(secs1 / 1000) + saandfree[i].spr_number*24*60*60;
					
					setInterval(function(){
						vm.give_time = getBackTime(secs1--);
					},1000)*/
				}
			}
			//vm.canCart = canCart;
		})

	//获取商品的组合信息
	getGroupInfo(spt_id)
		.then(res=>{
			log(res)
			vm.groupInfo = res.data.groupInfo;
			setPromotionInfo(res.data.parentProduct)
				.then(res=>{
					vm.parentProduct = res;
				})
			setPromotionInfo(res.data.chirldProduct)
				.then(res=>{
					vm.chirldProduct = res;
				})
		})


	//打电话
	$('#telephone').on('click',function(){
		var phone = $(this).attr('phone');
        if(origin == 'adr'){
            APP.appToPhone(phone);
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToPhone.postMessage(phone);
        }
	})

	//跳转供应商
	$('#suppshop').on('click',function(){
		var csrid = $(this).attr('csrid');
		if(origin == 'adr'){
            APP.appToSupp(csrid);
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToSupp.postMessage(csrid);
        }
	})

	//新建收货地址
	$('.new-location').on('click',function(){
		if(origin == 'adr'){
            APP.addAddress();
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.addAddress.postMessage(1);
        }
	})

	//选择地址
	$(document).on('click','.sendUad',function(){
		var uad_id = $(this).attr('uad_id')
		for(var i = 0; i < vm.addreList.length; i++){
			if(vm.addreList[i].uad_id == uad_id){
				vm.address = vm.addreList[i]
			}
		}
		//mui('location')
		mui('#location').popover('toggle');
	})


	//点击商品
	$(document).on('click','.product',function(){
		var spt_id = $(this).attr('spt_id');
		if(origin == 'adr'){
            APP.appToProduct(spt_id);
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToProduct.postMessage(spt_id);
        }
	})

	/*//立即购买
	$('#allToBuy').on('click',function(){
        var json = {};
        json.spt_id = spt_id;
        json.spt_num = 1;
		if(origin == 'adr'){
            APP.appToBuy(spt_id,1);
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToBuy.postMessage(json);
        }
	})*/

    //立即购买
    $('#allToBuy').on('click',function(){
    	vm.buy_temp = '0'
		showBuyFrame()
    })
    //点击已选
    $('#onCheck').on('click',function(){
    	vm.buy_temp = '0'
		showBuyFrame()
    })
    //点击加入购物车
	$('#addToCart').on('click',function(){
		vm.buy_temp = '1'
		showBuyFrame()
	})

	//点击促销
	$(document).on('click','.activety-cart',function(){
		$("#sales").css("display","block");
		$(".zhezhao").fadeIn();
		$("#sales").css({bottom:"0"});
	})
    

    //数量减
    $('.minus').on('click',function(){
        var num = vm.buy_num*1 - vm.spec.spec_unit_number*1;
        if(!checkBuyNum(num)){
            return;
        }
        vm.buy_num = num;
    })

    //数量加
    $('.add').on('click',function(){
        var num = vm.buy_num*1 + vm.spec.spec_unit_number*1;
        if(!checkBuyNum(num)){
            return;
        }
        vm.buy_num = num;
    })

    //点击输入数量
    var interval;
    var bfscrolltop = document.body.scrollTop;//获取软键盘唤起前浏览器滚动部分的高度
    $("input#numValue").focus(function(){//在这里‘input.inputframe’是我的底部输入栏的输入框，当它获取焦点时触发事件
        var min=$("#numValue").attr("data-min");
        interval = setInterval(function () {//设置一个计时器，时间设置与软键盘弹出所需时间相近
            document.body.scrollTop = document.body.scrollHeight;//获取焦点后将浏览器内所有内容高度赋给浏览器滚动部分高度
        }, 100);
    })

	$("#numValue").blur(function(){
		clearInterval(interval);//清除计时器
		//document.body.scrollTop = bfscrolltop;//将软键盘唤起前的浏览器滚动部分高度重新赋给改变后的高度
	})
    //点击确定
    $('.ripple').on('click',function(e){

    	if(vm.buy_temp == '0'){
    		//购买
    		if(vm.buy_num <= 0){
	    		failTips('请输入正确的购买数量')
	    		return
	    	}
	        checkNum(spt_id,vm.buy_num,vm.detail.csr_id,vm.spec.spec_id)
	        	.then(res=>{
	        		var code = res.code;
	        		if(code == 0){
						$(".addBuy").css("display","none")
				        $(".zhezhao").fadeOut();
				        $(".addBuy").animate({bottom:"-"+addHeight});

				        var json = {};
				        json.spt_id = spt_id;
				        json.spt_num = vm.buy_num;
				        json.spec_id = vm.spec.spec_id;
				        json.uad_id = vm.address.uad_id;
				        if(origin == 'adr'){
				            APP.appToBuy(spt_id,vm.buy_num,vm.spec.spec_id,vm.address.uad_id);
				        }else if(origin == 'ios'){
				            window.webkit.messageHandlers.appToBuy.postMessage(json);
				        }
	        		}else{
	        			failTips(res.message)
	        		}
	        	})

    	}else if(vm.buy_temp == '1'){
    		//加入购物车
    		if(vm.spec.spec_is_promotion == 'Y'){
	            mui.toast('促销商品不能加入购物车');
				return;
			}
			addToCart(user_id,spt_id,vm.detail.csr_id,vm.spec.spec_unit_number,vm.spec.spec_id)
				.then(res=>{
					if(res.code == 0){
						successTips("加入购物车成功");
						$(".zhezhao,.chahao").click()
	                    if(origin == 'adr'){
	                        APP.appToCart(vm.spec.spec_unit_number);
	                    }else if(origin == 'ios'){
	                        window.webkit.messageHandlers.appToCart.postMessage(vm.spec.spec_unit_number);
	                    }
					}else{
						failTips(res.message);
					}
				})
    	}

    	

		
    })

    //领券
	$(document).on('click','.catCoupon',function(){
		var cpr_id = $(this).attr('cpr_id');
		createNewCoupon(user_id,cpr_id)
			.then(res=>{
				if(res.code == '0'){
					for(var i = 0; i < vm.couponList.length; i++){
						if(cpr_id == vm.couponList[i].cpr_id){
							vm.couponList[i].isShow = '0';
                            vm.couponList[i].tips = '已领取';
						}
					}
					mui('#activeList').popover('hide',document.getElementById("list")); 
					successTips('领取优惠券成功');
				}else{
					failTips(res.message)
				}
				
			})
	})


    //检查购买数量
    function checkBuyNum(num){
        var re = /^[0-9]+$/ ;
        if(!re.test(num)){
            mui.toast('请输入正确的购买数量!');
            return false;
        }
        num = parseInt(num);
        if(num > vm.spec.spec_stock){
            mui.toast('库存不足!');
            return false;
        }
        if(num <= 0){
        	mui.toast('请输入正确的购买数量!');
            return false;
        }
        if( num < vm.spec.spec_unit_number){
            if(num != vm.spec.spec_stock){
                mui.toast('最小起批数量为'+vm.spec.spec_unit_number+'!');
                return false;
            }
        }
        return true;
    }





    var sty = 0; 
	document.querySelector('.mui-scroll-wrapper').addEventListener('scroll', function(e) {
	   var tr = $ ('.mui-scroll').css ('-webkit-transform')
	   var values = tr.split('(')[1].split(')')[0].split(',');
	   var x = values[5];
	   
	   if(x<0 && Number(x)<-64){
		    //大于64px的样式
		   	if(sty == 1){
		   	    sty = 0;
		   	  	if(origin == 'adr'){
		            APP.appToRed();
		        }else if(origin == 'ios'){
		            window.webkit.messageHandlers.appToRed.postMessage(1);
		        }
		   	}
	   }else{
		    //小于64px的样式
		   	if(sty == 0){
		   	  	sty = 1;
		   	  	if(origin == 'adr'){
		            APP.appToWrite();
		        }else if(origin == 'ios'){
		            window.webkit.messageHandlers.appToWrite.postMessage(1);
		        }
		   	}
	   }

	});

	//获取推荐活动高度
	var groupHeight=$(".Alert_active").height();
	$(".Alert_active").css("bottom","-"+groupHeight+"px");

	//点击推荐活动
	$('.active-alert').on('click',function(){
		groupHeight=$(".Alert_active").height();
		$(".Alert_active").css("bottom","-"+groupHeight+"px");
	   $(".zhezhao").fadeIn();
	   $(".Alert_active").css("display","block")
	   $(".Alert_active").animate({bottom:"0"});
	})

	//弹出购买框
	function showBuyFrame(){
		$(".addBuy").css("display","block")
        $(".zhezhao").fadeIn();
        $(".addBuy").css({bottom:"0"});
	}

	//关闭购买框
    $(".zhezhao,.chahao").on('click',function(){
    	addHeight=$(".addBuy").height();
    	$(".addBuy").css("bottom","-"+addHeight+"px");
		$(".addBuy").css("display","none")
        $(".zhezhao").fadeOut();
        $(".addBuy").css({bottom:"-"+addHeight+"px"});
		if($(".Alert_active").css("display")=="block"){
		   $(".Alert_active").css({bottom:"-"+groupHeight+"px"});
		}
		$("#sales").css("bottom","-380px");
		$("#sales").css("display","none")
    })
    
  
})

//获取收货地址列表  id代表默认选中  若无则取默认
function initAddressList(id){
	var addreList = []
	addressList(vm.user_id)
		.then(res=>{
			if(res.code != '0'){
				mui.toast(res.message)
			}
			addreList = res.data.item
			getShopAddress(vm.user_id)
		        .then(res=>{
		        	var shop = res.data.item[0]
		        	var hasdef = false
		        	for(var i = 0; i < addreList.length; i++){
		        		if(addreList[i].uad_default_add == 'Y'){
		        			hasdef = true
		        		}
		        	}
		            addreList.push({'uad_add_detail':shop.dsp_address,'uad_city':shop.cty_name,'uad_district':shop.dis_name
		        		,'uad_id':'','uad_province':shop.pvc_name,'uad_reciever_name':shop.dsp_name,'uad_reciever_tel':shop.dsp_mobile
		        		,'uad_default_add':hasdef?'N':'Y'})

		            vm.addreList = addreList
		            //app添加地址回调
		            if(id){
		            	for(var i = 0; i < addreList.length; i++){
			        		if(addreList[i].uad_id == id){
			        			vm.address = addreList[i]
			        		}
			        	}
		            }else{//初始化
		            	for(var i = 0; i < addreList.length; i++){
			        		if(addreList[i].uad_default_add == 'Y'){
			        			vm.address = addreList[i]
			        		}
			        	}
		            }

		            log(addreList)
		        })
		})
	
}


//点击查看大图
function click_img(obj){
	var json = {}
	json.img = $(obj).attr('imgsrc')
	json.list = vm.photolist
	APPAction('bigImg',json)
}

/**
 * 格式化满减信息,处理中间的json
 * $param  {[type]} obj [description]
 * $return {[type]}     [description]
 */
function formatMorefree(obj){
	var amjson = eval('(' + obj.am_json + ')')
    return amjson;
}






