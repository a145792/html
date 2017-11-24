Vue.config.productionTip = false
var vm = new Vue({
	el:'#app',
	data:{
        order:2,        //商品排序方式  
		shop:{},              //店铺基本信息
		productList:[],       //商品列表
        comment:[],            //评论
        albumls:[] ,             //相册
        GroomItems:[],           //推荐的商品列表
        GroomShops:[],          //推荐的商铺列表
        isPush:true,				//上拉到底是否加载
        isFav:0,         //是否已经收藏
        footCount:0,     //菜个数
        photoCount:0,
        commentCount:0,
        GroomItemCount:0,
        cartcount:0,
        isLoading:0,
        isShowAdvert:0,      //展示广告
        itemType:{},         //商品类型
        ste_id:'',           //当前选择的商品分类
        ismedia:0,           //是否变形  0 不变默认的   1变形 加class ismedia
        allProductList:[],   //储存全部商品列表
        couponlist:[],        //优惠券列表
        ccr_id:''
    },
    //自定义拦截器
    filters:{
        //格式化时间
        FMtime:function(time){
            if(!isUndef(time) && !isNull(time) && time.length > 10){
                time = time.substring(0,10)
            }
            return time;
        },
        //转换两位小数
        ToDou2:function(str){
            var num
            if(isUndef(str) || isNull(str)){
                num = 0.00
            }else{
                str = str*1;
                num = str.toFixed(2);
            }
            return num
        },
        //格式化数字
        FMint:function(num){
            if(isUndef(num) || isNull(num)){
                num = 0
            }
            return num
        },
        //格式化图片
        FMimg:function(img){
            if(!isUndef(img) && !isNull(img) ){
                img += '?imageView2/1/w/205/h/205'
            }
            return img
        },
        getAvatar:function(avatar){
            if(isUndef(avatar) || isNull(avatar)){
                avatar = 'http://pics.jiuziran.com/Fuk-iFCr5DnXVyzYSQBbJXdhhVN_';
            }
            return avatar;
        },
        getBigImg:function(img){
            if(!isUndef(img) && !isNull(img) ){
                img += '?imageView2/1/w/375/h/240'
            }
            return img
        }
    },
    methods:{

    }

})

$(function(){

    //ios无限刷新问题
    var lock = true;
    var isNoWx="";
    var ccr_id = getRequestParameter('ccr_id')
    vm.ccr_id = ccr_id
    var shop_id = getRequestParameter('shop_id')
    var latitude = getRequestParameter('latitude')
    var longitude = getRequestParameter('longitude')
    var cty_id = getRequestParameter('cty_id')
    var origin = getRequestParameter('origin')
    var wxpath = getWxPath()

    if(origin == 'adr' || origin == 'ios'){
    	$("#share").css('display','block')
    	$("#back_a").css('display','block')
        isNoWx="1";
    }

    if(origin == 'wxshop'){
        removeStyle();
        setWxGonfig();
        $('.caseHeader').css("padding-top","0")
    }

    //分布加载策略
    //基本信息
    getShopDetailInfo(shop_id,ccr_id)
        .then(res=>{
            $(".loading").hide();
            vm.shop = res.data;
            vm.isFav = res.data.dsp_isfav;

            //商品列表
            getShopDetailProduct(shop_id,vm.order,vm.ste_id)
                .then(res=>{
                vm.productList = res.data.sim_items;
                vm.allProductList = res.data.sim_items;
            })

            //获取推荐菜
            getShopDetailFoot(shop_id)
                .then(res=>{
                vm.shop.disitems = res.data.disitems;
            vm.footCount = res.data.disitems.length;
            })

            //获取店铺优惠券
            getShopCoupon(shop_id,ccr_id)
                .then(res=>{
                var couponlist = res.data.item;
                if(couponlist.length > 0){
                    vm.isShowAdvert = 1;
                    vm.couponlist = res.data.item;
                }
            })

            //获取购物车数量
            if(ccr_id != ''){
                getCartNum(ccr_id)
                    .then(res=>{
                    vm.cartcount = res.data.count;
                })
            }

            //获取产品类型
            getItemType(shop_id)
                .then(res=>{
                vm.itemType = res.data.items;
            })
    })
    
    
    

    

//-------------------------------------------------进入领取页面--------------------
    /*//点击优惠券
    $(document).on('click','.alertAdvert',function(){
        $('.AdvertDetail').fadeIn();
        $('.AdvertDetail-img').fadeIn();
    })


    $(document).on('click','.AdvertDetail',function(){
        $('.AdvertDetail-img').fadeOut();
        $('.AdvertDetail').fadeOut();
        $('.rightCase').removeClass("rightRun").addClass("rightNoRun");
        ModalHelper.beforeClose();
    })*/
    
    //点击优惠券
    $(document).on('click','.getCoupon',function(){
        $('.AdvertDetail').fadeIn();
        $('.alertList').animate({bottom:"0"});
        ModalHelper.afterOpen();
    })
    //关闭
    var alertHeight;
    $(document).on('click','.AdvertDetail',function(){
        alertHeight=$(".alertList").height();
        $('.alertList').animate({bottom:"-"+alertHeight+"px"});
        $('.AdvertDetail').fadeOut();
        if($(".rightRun").length>0){
            $('.rightCase').removeClass("rightRun").addClass("rightNoRun");
        }
        ModalHelper.beforeClose();
    })

    /*$(document).on('click','.AdvertDetail-img',function(){
        if(ccr_id == ''){
            if(origin == 'adr'){
                APP.appToLogin()
            }else if(origin == 'ios'){
                window.webkit.messageHandlers.appToLogin.postMessage(404)
            }else if(origin == 'wxshop'){
                window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb36c2d54f3a2ad60&redirect_uri=http://a.jiuziran.com/ForwardServlet?biz=toweb3&response_type=code&scope=snsapi_userinfo&state=0#wechat_redirect';
            }
            return
        }
        $('.AdvertDetail-img').fadeOut();
        $('.AdvertDetail').fadeOut();
        if(origin == 'wxshop'){
            window.location.href= getRootPath() + "/advert/advert.html?userId="+ccr_id+"&origin="+origin+"&isNoWx=0"+"&shop_id="+shop_id;
        }else{
            window.location.href= getRootPath() + "/advert/advert.html?userId="+ccr_id+"&origin="+origin+"&isNoWx=1"+"&shop_id="+shop_id;
        }

    })*/
    //点击优惠券领取
    $(document).on('click','.catCoupon',function(){
        if(vm.ccr_id == ''){
            if(origin == 'adr'){
                APP.appToLogin()
            }else if(origin == 'ios'){
                window.webkit.messageHandlers.appToLogin.postMessage(404)
            }else if(origin == 'wxshop'){
                window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb36c2d54f3a2ad60&redirect_uri=http://a.jiuziran.com/ForwardServlet?biz=toweb3&response_type=code&scope=snsapi_userinfo&state=0#wechat_redirect';
            }
            return
        }
        var cpr_id = $(this).attr('cpr_id');
        console.log(cpr_id)
        createNewCoupon(vm.ccr_id,cpr_id)
            .then(res=>{
                console.log(res)
                var code = res.code;
                if(code = '0'){
                    $(".alertTan").html("领取成功");
                    for(var i = 0; i < vm.couponlist.length; i++){
                        if(vm.couponlist[i].cpr_id == cpr_id){
                            vm.couponlist[i].isShow = '0';
                            vm.couponlist[i].tips = '已领取';
                        }
                    }
                }else{
                    $(".alertTan").html(res.message);
                }
                alertHeight=$(".alertList").height();
                $('.alertList').animate({bottom:"-"+alertHeight+"px"});
                $('.AdvertDetail').fadeOut();
                
                $(".alertTan").show();
                setTimeout(function(){
                    $('.alertTan').hide();
                },1000);
                ModalHelper.beforeClose();
            })
    })


//--------------------------------------------------页面的事件----------------------------------------------------------------

    //加入购物车
    $(document).on('click','.toBuyCart',function(e){
        var sim_id = $(this).attr('sim_id')
        var shop_id = $(this).attr('shop_id')
        e.stopPropagation();
        if(vm.ccr_id == ''){
            if(origin == 'adr'){
                APP.appToLogin()
            }else if(origin == 'ios'){
                window.webkit.messageHandlers.appToLogin.postMessage(404)
            }else if(origin == 'wxshop'){
                window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb36c2d54f3a2ad60&redirect_uri=http://a.jiuziran.com/ForwardServlet?biz=toweb3&response_type=code&scope=snsapi_userinfo&state=0#wechat_redirect';
            }
            return
        }
        addToCart(vm.ccr_id,shop_id,1,sim_id)
            .then(res=>{
                var code = res.code
                if(code == 0){
                    $('.alertTan>span').html('加入购物车成功');
                    $('.alertTan').show();
                    vm.cartcount += 1;
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
    })

    //拨打电话
    $(document).on('click','.telPhone',function(){
        var phone = $(this).attr('phone')
        if(origin == 'adr'){
            APP.appToPhone(phone)
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToPhone.postMessage(phone)
        }else if(origin == 'wxshop'){
            window.location.href = 'tel:'+phone
        }
    })

    //优惠买单详情
    /*$(document).on('click','#discountDetail',function(){
        var shop_id = vm.shop.dsp_id
        
        if(origin == 'ios'){
            window.webkit.messageHandlers.appToDiscountDes.postMessage(shop_id)
        }else{
            window.location.href = wxpath + '/payexplain.html?shop_id=' + shop_id
        }
    })*/

    //改变商品排序方式
    $(document).on('click','.changeOrder',function(){
        var order = $(this).attr('order')
        if(order == vm.order){
            return
        }

        if(order == 0){//销量
            jsonSort(vm.productList,"sim_sale_count",true);
        }else if(order == 1){//好评
            jsonSort(vm.productList,"good_percent",true);
        }else if(order == 2){//价格
            jsonSort(vm.productList,"sim_target_price",false);
        }
        vm.order = order
        //按排序 加载店铺
        /*getShopDetail(ccr_id,shop_id,order)
            .then(res=>{
                vm.order = order
                vm.productList = res.data.sim_items
            })*/
    })

    //改变商品摆放姿势
    $(document).on('click','.changeArray',function(){
        if(vm.ismedia == 0){
            vm.ismedia = 1;
        }else{
            vm.ismedia = 0
        }
        /*if($('.productList').children("div:first-child").hasClass('media')){
            $("#changeArrayPhoto").attr('src','themes/images//Product-list_Horizontal@2x.png');
            $('.productList').children("div").removeClass('media');
            $('.itemAImg').attr("src","themes/images/New product_cart@2x.png");
        }else{
            $("#changeArrayPhoto").attr('src','themes/images//Product-list_Vertical@2x.png');
            $('.productList').children("div").addClass('media');
            $('.itemAImg').attr("src","themes/images/Combined Shape Copy@2x.png");
        }*/
    })
    

    //跳转商品详情
    $(document).on('click','.productDetail',function(){
        var sim_id = $(this).attr('sim_id')
        var photo = $(this).attr('sphoto')
        //判断微信商城还是app
        if(origin == 'adr'){
            APP.appToItemDetail(sim_id,photo,shop_id)
        }else if(origin == 'ios'){
            var json = {};
            json.sim_id = sim_id;
            json.photo = photo;
            window.webkit.messageHandlers.appToItemDetail.postMessage(json)
        }else if(origin == 'wxshop'){
            window.location.href = wxpath + '/shopitemdetial.html?item_id=' + sim_id
        }
    })

    //点击商铺相册(所有相册)
    $(document).on('click','.ShopAlbumLs',function(){
        var dsp_name = vm.shop.dsp_name;
        var json = {};
        json.dsp_name = dsp_name;
        json.shop_id = shop_id;
        //判断微信商城还是app
        if(origin == 'adr'){
            APP.appToShopAlbumLs(shop_id,dsp_name)
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToShopAlbumLs.postMessage(json)

        }else if(origin == 'wxshop'){
            var path = getWxPath();
            window.location.href = path + '/photoList.html?shop_id=' + shop_id;
        }
    })
    
    //点击具体某个相册
    $(document).on('click','.albumLsDetail',function(){
        var pid = $(this).attr('pid')
        var pname = $(this).children('p').html();
        var json = {};
        json.pid = pid;
        json.pname = pname;
        json.shop_id = shop_id;
        //判断微信商城还是app
        if(origin == 'adr'){
            APP.appToAlbumLDetail(pid,shop_id,pname)
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToAlbumLDetail.postMessage(json)
        }else if(origin == 'wxshop'){
            window.location.href = wxpath + '/photoDetail.html?pa_id=' + pid
        }
    })

    //点击推荐菜
    $(document).on('click','.foodList',function(){
        var rootPath = getRootPath();
        window.location.href = rootPath + '/foodList.html?shop_id='+shop_id + '&latitude=' + latitude + '&longitude=' + longitude+'&origin='+origin
    })
    
    //点击返回
    $(document).on('click','.back_i',function(){
    	if(origin == 'adr'){
            APP.appToBack(12)
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToBack.postMessage(12)
        }
    })

    //点击购物车
    $(document).on('click','.shopcar_a',function(){
        //判断微信商城还是app
        if(origin == 'adr'){
            APP.appToMyCart(12)
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToMyCart.postMessage(12)
        }else if(origin == 'wxshop'){
            window.location.href = wxpath + '/shopcar.html';
        }
    })


    //分享
    $(document).on('click','.share',function(){
        var name = vm.shop.dsp_name
        var photo = vm.shop.dsp_photo
        //判断微信商城还是app
        if(origin == 'adr'){
            APP.appToShare(shop_id,name,photo)
        }else if(origin == 'ios'){
            var json = {};
            json.name = name;
            json.photo = photo;
            json.shop_id = shop_id;
            window.webkit.messageHandlers.appToShare.postMessage(json)
        }
    })
    
    //收藏或取消收藏
    $(document).on('click','.shoucang',function(){
        var isFav = $(this).attr('isFav');
        if(ccr_id == ''){
            if(origin == 'adr'){
                APP.appToLogin()
            }else if(origin == 'ios'){
                window.webkit.messageHandlers.appToLogin.postMessage(404)
            }else if(origin == 'wxshop'){
                window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb36c2d54f3a2ad60&redirect_uri=http://a.jiuziran.com/ForwardServlet?biz=toweb3&response_type=code&scope=snsapi_userinfo&state=0#wechat_redirect';
            }
            return
        }
    	//获取图片
    	if(isFav == 0){
    		shopFav(ccr_id,shop_id)
	    		.then(res=>{
	    			var code = res.code
	    			if(code == 0){
	    				/*$(".shoucang").children('img').attr('src','themes/images/Shop details_collected@2x.png')
                        $(".shoucang").attr('isFav','1')*/
                        vm.isFav = 1;
	    			}else{
	    				alert(res.message)
	    			}
	    		})
    	}else if(isFav == 1){
    		shopRemFav(ccr_id,shop_id)
    			.then(res=>{
	    			var code = res.code
    				if(code == 0){
                       /* $(".shoucang").children('img').attr('src','themes/images/Shop details_Collection@2x.png')
                        $(".shoucang").attr('isFav','0')*/
                        vm.isFav = 0;
	    			}else{
	    				alert(res.message)
	    			}
    			})
    	}
    })


    //点击地理位置
    $(document).on('click','#address_div',function(){
        var dsp_name = vm.shop.dsp_name;
        var lat = vm.shop.dsp_latitude
        var lon = vm.shop.dsp_longitude
        var address = vm.shop.dsp_address;
        var photo = vm.shop.dsp_photo;

        var json = {};
        json.dsp_name = dsp_name;
        json.lat = lat;
        json.lon = lon;
        json.address = address;
        json.photo = photo;
        json.shop_id = shop_id;
        //判断微信商城还是app
        if(origin == 'adr'){
            APP.appToAddress(dsp_name,lat,lon,address,photo,shop_id)
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToAddress.postMessage(json)
        }else if(origin == 'wxshop'){
            loadmap(lon,lat,address,dsp_name);
        }
    })


    //点击店铺
    $(document).on('click','.toShopDetail',function(){
        var s_id =  $(this).attr('sid')
        var path = getRootPath();

        window.location.href = path + '/shopDetail.html?ccr_id=' + ccr_id + '&latitude=' + latitude + '&longitude=' + longitude + '&cty_id=' + cty_id + '&origin=' + origin + '&shop_id=' + s_id
    })

    //点击全部评论
    $(document).on('click','.allComment',function(){
        var path = getRootPath();
        window.location.href = path + '/comment.html?shop_id='+shop_id + '&origin=' + origin
    })

    /*setInterval(function(){
        var scrollTop=$(document).scrollTop();
        if(scrollTop>0){
            $('.topImg').hide();
            $('.topImg-bg').show();
        }else{
            $('.topImg-bg').hide();
            $('.topImg').show();
        }
    },100);*/
        


    //加载第二页数据
    $(window).scroll(function() { 

        var scrollA=document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        if(origin != 'wxshop'){
            if(scrollA > 0){
                $('.topImg').hide();
                $('.topImg-bg').show();
            }else{
                $('.topImg-bg').hide();
                $('.topImg').show();
            }
        }
    	
    	
        if ($(document).scrollTop() >= $(document).height() - $(window).height()) { 
            if(!lock){
                return
            }else{
                lock = false;
            }

            //加载评论
            getShopCommentList(shop_id,1,2,'')
                .then(res=>{
                    vm.commentCount = res.data.count;
                    var list = res.data.items;
                    vm.comment = list;
                })

            //加载店铺相册
            getShopAlbumLs(shop_id)
                .then(res=>{
                    vm.albumls = res.data.item
                    vm.photoCount = res.data.item.length
                })

            //获取推荐商品
            getGroomItem(ccr_id,latitude,longitude,cty_id)
                .then(res=>{
                    console.log(res)
                    var list = res.data.item
                    for(var i = 0; i < list.length; i++){
                        list[i].mile = ((list[i].mile*1) / 1000 ).toFixed(2)
                    }
                    if(vm.isPush){
                        vm.GroomItems = list;
                        vm.GroomItemCount = list.length;
                    }
                })
            

            //获取推荐店铺
            getGroomShop(cty_id,latitude,longitude)
                .then(res=>{
                    var list = res.data.dsp_items
                    vm.GroomShops = list
                })

            setTimeout(function(){
                $("#towPage").css('display','block')
                vm.isLoading = 1;
            },1000);
            
        }
    })

    $(document).on('click','#quanjing_div',function(event){
    	var lat = vm.shop.dsp_latitude
        var lon = vm.shop.dsp_longitude
        var path = getRootPath();
        window.location.href = path + '/dituquanjing.html?lat='+lat + '&lon=' + lon;
        event.stopPropagation();
    })

    //跳转优惠买单
    $(document).on('click','#toDisCount',function(){
        //判断微信商城还是app
        if(origin == 'adr'){
            APP.appToDiscount(shop_id)
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToDiscount.postMessage(shop_id)
        }else if(origin == 'wxshop'){
            window.location.href = wxpath + '/youhuibuy.html?shop_id=' + shop_id
        }
    })
    //点击全部分类
    $(document).on('click','.custom',function(){
        $('.AdvertDetail').show();
        $('.rightCase').removeClass("rightNoRun").addClass("rightRun");
        ModalHelper.afterOpen();
    })
    //    点击返回顶部
    $(document).on('click','.BackTop',function(){
        $('html, body').animate({scrollTop: 0});
    })
    //点击全部分类中的小类
    $(document).on('click','.caseList-ob ul li>span',rightCase);
    //小类中的全部分类
    $(document).on('click','.allste',rightCase);

    jQuery.fn.shake = function (intShakes /*Amount of shakes*/, intDistance /*Shake distance*/, intDuration /*Time duration*/) {
    this.each(function () {
        var jqNode = $(this);
        jqNode.css({ position: 'relative' });
        for (var x = 1; x <= intShakes; x++) {
            jqNode.animate({ left: (intDistance * -1) }, (((intDuration / intShakes) / 4)))
            .animate({ left: intDistance }, ((intDuration / intShakes) / 2))
            .animate({ left: 0 }, (((intDuration / intShakes) / 4)));
        }
    });
    return this;
}

})
var ModalHelper = (function(bodyCls) {
            var scrollTop;
            return {
                afterOpen: function() {
                    scrollTop = document.scrollingElement.scrollTop;
                    document.body.classList.add(bodyCls);
                    document.body.style.top = -scrollTop + 'px';
                },
                beforeClose: function() {
                    document.body.classList.remove(bodyCls);
                    // scrollTop lost after set position:fixed, restore it back.
                    document.scrollingElement.scrollTop = scrollTop;
                }
            };
      })('modal-open');
function removeStyle(){
    $('.topImg-bg').remove();
    $('.topImg').css('position','absolute');
    $('.topImg').css('top','10px');
    $('.shopcar_a').css('right','50px');
}


function loadmap(dsp_longitude,dsp_latitude,dsp_address,dsp_name){
    wx.openLocation({
        latitude: parseFloat(dsp_latitude), // 纬度，浮点数，范围为90 ~ -90
        longitude: parseFloat(dsp_longitude), // 经度，浮点数，范围为180 ~ -180。
        name: dsp_name, // 位置名
        address: dsp_address, // 地址详情说明
        scale: 28, // 地图缩放级别,整形值,范围从1~28。默认为最大
        infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
    });
}

function setWxGonfig(){
    var url = document.location.href;
    getWxConfig(url)
        .then(res=>{
            wx.config({  
                debug: false,  
                appId: 'wxb36c2d54f3a2ad60',                                   
                timestamp:res.timestamp,  
                nonceStr:res.nonceStr,  
                signature:res.sign,  
                jsApiList : [//需要使用的JS接口列表,分享默认这几个，如果有其他的功能比如图片上传之类的，需要添加对应api进来
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'openLocation'
                ]
            })
        })
}


//点击全部分类中的小类
function rightCase(){
    $('.AdvertDetail').fadeOut();
    $('.rightCase').removeClass("rightRun").addClass("rightNoRun");
    ModalHelper.beforeClose();
    $(this).parent().addClass("active");
    $(this).parent().siblings().removeClass("active");
    $(this).parent().parent().parent().siblings().children().children().removeClass("active");
    //获取选择的分类id
    var ste_id = $(this).attr('ste_id');
    //获取当前的排序字段
    var order = vm.order;
    //获取当前分类的商品列表
    vm.productList = [];
    for(var i = 0; i < vm.allProductList.length; i++){
        if(vm.allProductList[i].sim_child_type == ste_id){
            vm.productList.push(vm.allProductList[i])
        }
    }

}
//滑动处理
var startX, startY;
document.addEventListener('touchstart',function (ev) {
    startX = ev.touches[0].pageX;
    startY = ev.touches[0].pageY;
}, false);
document.addEventListener('touchend',function (ev) {
    var endX, endY;
    endX = ev.changedTouches[0].pageX;
    endY = ev.changedTouches[0].pageY;
    var direction = GetSlideDirection(startX, startY, endX, endY);
    switch(direction) {
        case 0:
            break;
        case 1:
            // 向上
            $('.colorFixed').animate({bottom:"-46px"},300);
            break;
        case 2:
            // 向下
            $('.colorFixed').animate({bottom:"0"},300);
            break;

        default:
    }
}, false);
function GetSlideDirection(startX, startY, endX, endY) {
    var dy = startY - endY;
    //var dx = endX - startX;
    var result = 0;
    if(dy>0) {//向上滑动
        result=1;
    }else if(dy<0){//向下滑动
        result=2;
    }
    else
    {
        result=0;
    }
    return result;
}


function setUser(ccr_id){
    vm.ccr_id = ccr_id;
}




