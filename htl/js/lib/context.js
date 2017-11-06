//document.write('<script language=javascript src="js/lib/tripledes2.js"></script>');
//document.write('<script language=javascript src="../js/lib/tripledes2.js"></script>');

function fetchApi(params){
    //console.log(params)
    params = {'params':encryptByDES(params.params)}
	var  url = 'http://admin.jiuziran.com/api';
    if(getRequestParameter('origin')=='ios'){
		url = 'http://114.55.73.221:8080/api';
    }
    //console.log(url)
    return new Promise(function (resolve, reject) {
		$.ajax({
			//url:'http://114.55.73.221:8080/api',
            url:url,
            //url:'http://127.0.0.1:8080/adminsystem/api',
			data:params,
			type:"post",
			dataType:"json",
			success:function(data){
				resolve(data)
			},
			fail:function(data){
				reject('error')
			}
		})
	})
}

function fetchUrlApi(feturi,params){
    return new  Promise(function (resolve, reject) {
        $.ajax({
            url:feturi,
            data:params,
            type:"post",
            dataType:"json",
            success:function(data){
                resolve(data)
            },
            fail:function(data){
                reject('error')
            }
        })
    })
}





//微信商城路径
function getWxPath(){
    return 'http://wxshop.jiuziran.com'
    //return 'http://wxtest.jiuziran.com'
    //return 'http://192.168.1.126:8083/frwwx/';
}

//当前项目根路径
function getRootPath(){
    //return 'http://192.168.1.126:8081/static/htl'
    return 'http://admin.jiuziran.com/htl/'
    //return 'http://localhost:3306/htl'
    //return 'http://114.55.73.221:8080/htl/'
    //return 'http://min_jw.tunnel.echomod.cn/static/htl'
    //return 'file://E:/workspace/workspace_01/static/WebContent/htl'
    //return 'http://mjwadmin.tunnel.echomod.cn/static/htl';
    //return 'http://localhost:63342/htl/';
}

//获取微信js权限路径
function getWxConfig(url){
    var params = {"url":url};
    return fetchUrlApi("http://wxshop.jiuziran.com/getWxConfig.html",params)
       .then(res=>res)
}

//查看店铺详情  0销量1好评率2价格
function getShopDetail(ccr_id,dsp_id,order){
	var params = {"params":"{'biz':'com.api.v2.distributor.detail','data':{'usr_id':'"+ccr_id+"','dsp_id':'"+dsp_id+"','order':'"+order+"','page':'1','limit':'500'}}"}
    return fetchApi(params)
       .then(res=>res)
}

//查看店铺详情  带分类查询的
function getShopDetail2(ccr_id,dsp_id,order,ste_id){
    var params = {"params":"{'biz':'com.api.v2.distributor.detail','data':{'ste_id':'"+ste_id+"','usr_id':'"+ccr_id+"','dsp_id':'"+dsp_id+"','order':'"+order+"','page':'1','limit':'500'}}"}
    return fetchApi(params)
       .then(res=>res)
}

//获取店铺评论列表 ict_type 0全部  1 好评 2 差评 3有图   
function getShopCommentList(dsp_id,page,limit,ict_type){
	var params = {"params":"{'biz':'com.api.v1.shop.comment.find','data':{'dsp_id':'"+dsp_id+"','page':'"+page+"','limit':'"+limit+"','ict_type':'"+ict_type+"'}}"}
    return fetchApi(params)
    	.then(res=>res)
}

//获取店铺评论列表 ict_type 0全部  1 好评 2 差评 3有图   
function getShopCommentList2(dsp_id,page,limit,ict_type){
    var params = {"params":"{'biz':'com.api.comment.shop.find','data':{'shop_id':'"+dsp_id+"','page':'"+page+"','limit':'"+limit+"','ict_type':'"+ict_type+"'}}"}
    return fetchApi(params)
        .then(res=>res)
}

//获取店铺详情的基本信息
function getShopDetailInfo(dsp_id,user_id){
    var params = {"params":"{'biz':'com.shop.detail.info','data':{'usr_id':'"+user_id+"','dsp_id':'"+dsp_id+"'}}"}
    return fetchApi(params)
        .then(res=>res)
}

//获取店铺详情中商品列表
function getShopDetailProduct(dsp_id,order,ste_id){
    var params = {"params":"{'biz':'com.shop.detail.item','data':{'dsp_id':'"+dsp_id+"','ste_id':'"+ste_id+"','order':'"+order+"'}}"}
    return fetchApi(params)
        .then(res=>res)
}

//获取店铺详情中推荐菜列表
function getShopDetailFoot(dsp_id){
    var params = {"params":"{'biz':'com.shop.detail.foot.list','data':{'dsp_id':'"+dsp_id+"'}}"}
    return fetchApi(params)
        .then(res=>res)
}


//获取相册列表
function getShopAlbumLs(dsp_id){
    var params = {"params":"{'biz':'com.api.shop.shopPhotoAlbumLs','data':{'dsp_id':'"+dsp_id+"','page':'1','limit':'20'}}"}
    return fetchApi(params)
        .then(res=>res)
}

//获取推荐商品
function getGroomItem(user_id,latitude,longitude,city_id){
    if(city_id){
     }else{
        city_id = '';
    }
    var params = {"params":"{'biz':'com.api.shopitem.groomItem','data':{'user_id':'"+user_id+"','latitude':'"+latitude+"','longitude':'"+longitude+"','city_id':'"+city_id+"'}}"}
    return fetchApi(params)
        .then(res=>res)
}

//获取推荐商铺列表
function getGroomShop(cty_id,latitude,longitude){
    var params = {"params":"{'biz':'com.api.v2.distributor.groom.find','data':{'cty_id':'"+cty_id+"','dis_id':'','dsp_latitude':'"+latitude+"','dsp_longitude':'"+longitude+"'}}"}
    return fetchApi(params)
        .then(res=>res)
}

//加入购物车
function addToCart(ccr_id,shop_id,number,sim_id){
    var params = {"params":"{'biz':'com.api.v2.store.cart.create','data':{'usr_id':'"+ccr_id+"','dsp_id':'"+shop_id+"','sim_number':'"+number+"','sim_id':'"+sim_id+"'}}"}
    return fetchApi(params)
        .then(res=>res)
}   

//获取推荐菜
function getShopFood(shop_id,page){
    var params = {"params":"{'biz':'com.api.v1.distributor.shopitemdisplay.find','data':{'sid_shop_id':'"+shop_id+"','sid_isup':'2','page':'"+page+"','limit':'10'}}"}
    return fetchApi(params)
        .then(res=>res)
}

//获取菜品详情
function foodDetail(sid_id,latitude,longitude){
    var params = {"params":"{'biz':'com.api.food.detail','data':{'sid_id':'"+sid_id+"','latitude':'"+latitude+"','longitude':'"+longitude+"'}}"}
    return fetchApi(params)
        .then(res=>res)
}

//收藏商铺
function shopFav(ccr_id,shop_id){
    var params = {"params":"{'biz':'com.api.v1.consumer.favorite.shop.create','data':{'ccr_id':'"+ccr_id+"','dsp_id':'"+shop_id+"'}}"}
    return fetchApi(params)
        .then(res=>res)
}

//取消收藏店铺
function shopRemFav(ccr_id,shop_id){
	 var params = {"params":"{'biz':'com.api.v1.consumer.favorite.shop.remove','data':{'ccr_id':'"+ccr_id+"','cfs_shop_id':'"+shop_id+"'}}"}
	    return fetchApi(params)
	        .then(res=>res)
}

//获取购物车数量
function getCartNum(ccr_id){
     var params = {"params":"{'biz':'com.api.v1.store.cart.findcount','data':{'usr_id':'"+ccr_id+"'}}"}
        return fetchApi(params)
            .then(res=>res)
}

//获取商品类型
function getItemType(shop_id){
     var params = {"params":"{'biz':'com.api.item.type.shop.find','data':{'shop_id':'"+shop_id+"'}}"}
        return fetchApi(params)
            .then(res=>res)
}



//===================================BUSWEB========================================

//获取商户资金绑定列表
function findDspAcct(shop_id,page){
     var params = {"params":"{'biz':'com.api.alipay.findDspAcct','data':{'dsp_id':'"+shop_id+"','page':'"+page+"','limit':'20'}}"}
        return fetchApi(params)
            .then(res=>res)
}

//设置为默认收款方式
function accountToDef(shop_id,type,bankId){
    var params = {"params":"{'biz':'com.api.shopsettle.defaultAccount','data':{'dsp_id':'" + shop_id + "','paymentType':'"
                    + type + "','bankId':'" + bankId + "'}}"}
        return fetchApi(params)
            .then(res=>res)
}

//获取店铺财务管理信息
function showInfo(shop_id){
    var params = {"params":"{'biz':'com.api.shopsettle.showInfo','data':{'dsp_id':'" + shop_id + "'}}"}
        return fetchApi(params)
            .then(res=>res)
}

//获取店铺默认结款账户
function findCardAcct(shop_id){
    var params = {"params":"{'biz':'com.api.alipay.findCardAcct','data':{'dsp_id':'" + shop_id + "'}}"}
        return fetchApi(params)
            .then(res=>res)
}

//获取商家结算历史( is_discount 1 优惠买单  0 普通买单)
function getPayHistory(shop_id,is_discount,page){
    var params = {"params":"{'biz':'com.api.shopsettle.historySettle','data':{'dsp_id':'" + shop_id + "','is_discount':'"+is_discount+"','page':'"+page+"','limit':'10'}}"}
        return fetchApi(params)
            .then(res=>res)
}

//获取消费订单列表
function consumList(dsp_id,page,is_discount,starttime,endtime){
    var params = {"params":"{'biz':'com.api.shopsettle.findConsumeOrder','data':{'dsp_id':'"+dsp_id+"','page':'"+page+"','limit':'10','is_discount':'"+is_discount+"','starttime':'"+starttime+"','endtime':'"+endtime+"'}}"}
    return fetchApi(params)
        .then(res=>res)
}
//获取优惠活动首页
function discount(dsp_id){
    var params = {"params":"{'biz':'com.api.shopsettle.showInfo','data':{'dsp_id':'"+dsp_id+"'}}"}
    return fetchApi(params)
        .then(res=>res)
}
//获取当前优惠活动详情
function ShopDisCount(shop_id){
    var params = {"params":"{'biz':'com.api.v1.shop.discount.findShopDisCount','data':{'shop_id':'"+shop_id+"'}}"}
    return fetchApi(params)
        .then(res=>res)
}
//获取当前优惠历史活动列表
function HistoryDisCount(shop_id){
    var params = {"params":"{'biz':'com.api.v1.shop.discount.findHis','data':{'shop_id':'"+shop_id+"'}}"}
    return fetchApi(params)
        .then(res=>res)
}
//获取活动明细列表
function payDetail(shop_id,page){
    var params = {"params":"{'biz':'com.api.v1.shop.discount.findOrders','data':{'shop_id':'"+shop_id+"','usr_id':'','page':'"+page+"','limit':'10'}}"}
    return fetchApi(params)
        .then(res=>res)
}


//获取商家消息列表
function getNews(mobile,page){
    var params = {"params":"{'biz':'com.api.v1.advert.busiLs','data':{'mobile':'"+mobile+"','page':'"+page+"','limit':'10'}}"}
    console.log(params)
    return fetchApi(params)
        .then(res=>res)
}

//获取订单详情is_discount  0普通 1优惠
function getOrderDetail(sor_id,is_discount){
    var params = {"params":"{'biz':'com.api.v2.store.order.detail','data':{'sor_id':'"+sor_id+"','is_discount':'"+is_discount+"','longitude':'0','latitude':'0'}}"}
    return fetchApi(params)
        .then(res=>res)
}

//获取收货地址
function getAddressById(uad_id){
    var params = {"params":"{'biz':'com.api.v1.consumeraddress.findbyid','data':{'uad_id':'"+uad_id+"'}}"}
    return fetchApi(params)
        .then(res=>res)
}
//==================================== 广告======================================================================

//获取店铺优惠券列表
function getShopCoupon(shop_id){
    var params = {"params":"{'biz':'com.api.shop.couponlist','data':{'shop_id':'"+shop_id+"'}}"}
        return fetchApi(params)
            .then(res=>res)
}

//获取优惠券列表
function getCouponList(ccr_id){
    var params = {"params":"{'biz':'com.api.coupon.couponProLs','data':{'cpr_user_id':'"+ccr_id+"'}}"}
        return fetchApi(params)
            .then(res=>res)
}


//发送验证码
function sendCode(mobile,type){
    var params = {"params":"{'biz':'com.api.v1.customer.send.sms.code','data':{'mobile':'"+mobile+"','type':'"+type+"'}}"}
        return fetchApi(params)
            .then(res=>res)
}

//快捷登录
function codeLogin(username,code){
    var params = {"params":"{'biz':'com.api.v1.customer.code.login','data':{'userName':'"+username+"','smsCode':'"+code+"'}}"}
        return fetchApi(params)
            .then(res=>res) 
}

//领取优惠券
function createNewCoupon(userId,cpr_id){
    var params = {"params":"{'biz':'com.api.coupon.createNewCoupon','data':{'cpr_user_id':'"+userId+"','cpr_id':'"+cpr_id+"'}}"}
        return fetchApi(params)
            .then(res=>res) 
}


//===========================test======================
function getSuppDetail(){
    var params = {"params":"{'biz':'com.supp.product.detail','data':{'spt_id':'10','user_id':'5'}}"}
        return fetchApi(params)
            .then(res=>res) 
}

function getSuppList(){
    var params = {"params":"{'biz':'com.supp.home.supplist','data':{}}"}
        return fetchApi(params)
            .then(res=>res) 
}
//=====================================win=======================================================

function isUndef(str){
    if (typeof(str) == "undefined"){
        return true
    }else{
        return false
    }
}

function isNull(s){
    if(s == null || s == '' || s == 'null' || s == 'NULL' ){
        return true;
    }
    return false;
}

//获取get请求参数
function getRequestParameter(name){
    //获取当前URL
    var local_url = document.location.href; 
    //获取要取得的get参数位置
    var get = local_url.indexOf(name +"=");
    if(get == -1){
        return '';   
    }   
    //截取字符串
    var get_par = local_url.slice(name.length + get + 1);    
    //判断截取后的字符串是否还有其他get参数
    var nextPar = get_par.indexOf("&");
    if(nextPar != -1){
        get_par = get_par.slice(0, nextPar);
    }
    return get_par;
}


/*
 * @description     根据某个字段实现对json数组的排序
 * @param   array   要排序的json数组对象
 * @param   field   排序字段（此参数必须为字符串）
 * @param   reverse 是否倒序（默认为false）
 * @return  array   返回排序后的json数组
*/
function jsonSort(array, field, reverse) {
  //数组长度小于2 或 没有指定排序字段 或 不是json格式数据
  if(array.length < 2 || !field || typeof array[0] !== "object") return array;
  //数字类型排序
  if(typeof array[0][field] === "number") {
    array.sort(function(x, y) { return x[field] - y[field]});
  }
  //字符串类型排序
  if(typeof array[0][field] === "string") {
    array.sort(function(x, y) { return x[field]*1 - y[field]*1});
  }
  //倒序
  if(reverse) {
    array.reverse();
  }
  return array;
}
