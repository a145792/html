document.write('<script language=javascript src="../js/lib/tripledes2.js"></script>');
//请求后台的总方法
function fetchApi(params){
    params = {'params':encryptByDES(params.params)};
	var  url = 'http://admin.jiuziran.com/api';
    if(getRequestParameter('origin')=='ios'){
		url = 'http://114.55.73.221:8080/api';
    }
	//url = 'http://admin.jiuziran.com/api';
	//url = 'http://127.0.0.1:8080/adminsystem/api';
	return new  Promise(function (resolve, reject) {
		$.ajax({
            url:url,
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

//当前项目根路径
function getRootPath(){
    return 'http://dev.jiuziran.com/supplier/'
}

//-----------------------------------------------------------------------

//商品详情
function getSuppDetail(spt_id,user_id){
    var params = {"params":"{'biz':'com.supp.product.detail','data':{'spt_id':'"+spt_id+"','user_id':'"+user_id+"'}}"}
        return fetchApi(params)
            .then(res=>res) 
}

//加入购物车
function addToCart(user_id,spt_id,sct_spt_id,sct_number){
    var params = {"params":"{'biz':'com.supp.cart.addCart','data':{'sct_dsp_id':'"+user_id+"','sct_item_id':'"+spt_id+"','sct_number':'"+sct_number+"','sct_spt_id':'"+sct_spt_id+"'}}"}
        return fetchApi(params)
            .then(res=>res) 
}

//销量最高的10个商品
function getHotProduct(){
    var params = {"params":"{'biz':'com.supp.home.hot.product','data':{}}"}
        return fetchApi(params)
            .then(res=>res) 
}

//首页供应商列表
function getSupplist(csr_id){
    var params = {"params":"{'biz':'com.supp.home.supplist','data':{'csr_id':'"+csr_id+"'}}"}
        return fetchApi(params)
            .then(res=>res) 
}

//领取优惠券
function createNewCoupon(userId,cpr_id){
    var params = {"params":"{'biz':'com.api.coupon.createNewCoupon','data':{'cpr_user_id':'"+userId+"','cpr_id':'"+cpr_id+"','is_normal':'N'}}"}
        return fetchApi(params)
            .then(res=>res) 
}

//根据二级分类查询商品列表
function getProductListSteId(ste_id,page){
    var params = {"params":"{'biz':'com.supp.child.type.product','data':{'ste_id':'"+ste_id+"','page':'"+page+"','limit':'10'}}"}
        return fetchApi(params)
            .then(res=>res) 
}

//获取用户发票列表
function getShopInvoice(user_id){
    var params = {"params":"{'biz':'com.action.api.shopInc.show','data':{'inc_shop_id':'"+user_id+"','page':'1','limit':'999'}}"}
        return fetchApi(params)
            .then(res=>res) 
}

//获取用户发票列表
function invoiceDetail(inc_id){
    var params = {"params":"{'biz':'com.action.api.shopInc.show','data':{'inc_id':'"+inc_id+"','page':'1','limit':'1'}}"}
        return fetchApi(params)
            .then(res=>res) 
}

//设置为默认发票
function toDefInvoice(user_id,inc_id){
    var params = {"params":"{'biz':'com.action.api.shopInc.defInc','data':{'inc_shop_id':'"+user_id+"','id':'"+inc_id+"'}}"}
        return fetchApi(params)
            .then(res=>res) 
}

//删除发票
function delInvoice(inc_id){
    var params = {"params":"{'biz':'com.action.api.shopInc.delete','data':{'id':'"+inc_id+"'}}"}
        return fetchApi(params)
            .then(res=>res) 
}

//订单列表
function orderList(user_id,status,page){
    var params = {"params":"{'biz':'com.supp.order.list','data':{'dsp_id':'"+user_id+"','status':'"+status+"','page':'"+page+"','limit':'10'}}"}
        return fetchApi(params)
            .then(res=>res) 
}

//供应商查看订单列表
function suppOrderList(csr_id,status,page){
    var params = {"params":"{'biz':'com.supp.supp.order.list','data':{'csr_id':'"+csr_id+"','status':'"+status+"','page':'"+page+"','limit':'10'}}"}
        return fetchApi(params)
            .then(res=>res)
}



//供应商详情0 综合 1销量 2价格 3上新
function supplierDetail(csr_id,order){
    var params = {"params":"{'biz':'com.supp.supplier.detail','data':{'csr_id':'"+csr_id+"','order':'"+order+"'}}"}
        return fetchApi(params)
            .then(res=>res)
}

//修改订单状态
function updateOrderStatus(so_id,so_status){
    var params = {"params":"{'biz':'com.api.store.changeStatus','data':{'id':'"+so_id+"','so_status':'"+so_status+"'}}"}
        return fetchApi(params)
            .then(res=>res)
}

//修改订单运费
function updateOrderSendPrice(so_id,so_price,so_source_price,so_send_price){
    var params = {"params":"{'biz':'com.api.store.changeStatus','data':{'id':'"+so_id+"','so_price':'"+so_price+"','so_source_price':'"+so_source_price+"','so_send_price':'"+so_send_price+"'}}"}
        return fetchApi(params)
            .then(res=>res)
}

//申请退款
function refundOrder(so_id,so_refund_cause){
    var params = {"params":"{'biz':'com.supp.order.refund','data':{'so_id':'"+so_id+"','so_refund_cause':'"+so_refund_cause+"'}}"}
        return fetchApi(params)
            .then(res=>res)
}

//取消退款
function closeRefundOrder(so_id){
    var params = {"params":"{'biz':'com.supp.order.close.refund','data':{'so_id':'"+so_id+"'}}"}
        return fetchApi(params)
            .then(res=>res)
}

//收货地址列表
function addressList(user_id){
    var params = {"params":"{'biz':'com.api.supplier.allshow','data':{'uad_shop_id':'"+user_id+"'}}"}
        return fetchApi(params)
            .then(res=>res)
}

//删除收货地址
function delAddress(uad_id){
    var params = {"params":"{'biz':'com.action.api.changeAddress','data':{'id':'"+uad_id+"','uad_stt':'0'}}"}
        return fetchApi(params)
            .then(res=>res)
}

//设置为默认
function defAddress(uad_id,user_id){
    var params = {"params":"{'biz':'com.action.api.defAddress','data':{'id':'"+uad_id+"','uad_shop_id':'"+user_id+"'}}"}
        return fetchApi(params)
            .then(res=>res)
}

//店铺地址
function getShopAddress(dsp_id){
    var params = {"params":"{'biz':'com.supp.addressShow','data':{'dsp_id':'"+dsp_id+"'}}"}
    return fetchApi(params)
       .then(res=>res)
}

//订单详情
function orderDetail(so_id){
    var params = {"params":"{'biz':'com.api.store.orderDetail','data':{'so_id':'"+so_id+"'}}"}
    return fetchApi(params)
       .then(res=>res)
}

//新的订单详情
function orderDetailNew(so_id){
    var params = {"params":"{'biz':'com.supp.order.detail.new','data':{'so_id':'"+so_id+"'}}"}
    return fetchApi(params)
            .then(res=>res)
}


//获取订单收货地址或提货地址
function getOrderUad(so_dsp_id,uad_id,issend){
    var params = {"params":"{'biz':'com.supp.order.getuad','data':{'so_dsp_id':'"+so_dsp_id+"','uad_id':'"+uad_id+"','issend':'"+issend+"'}}"}
    return fetchApi(params)
       .then(res=>res)
}

//获取爆款商品
function getBoomProduct(){
    var params = {"params":"{'biz':'com.supp.boom.product','data':{}}"}
    return fetchApi(params)
       .then(res=>res)
}

//获取首页活动
function getActivi(){
    var params = {"params":"{'biz':'com.shop.activi.index','data':{}}"}
    return fetchApi(params)
       .then(res=>res)
}

//财务管理
function csrFinance(dsp_id){
    var params = {"params":"{'biz':'com.supp.finance.index','data':{'dsp_id':'"+dsp_id+"'}}"}
    return fetchApi(params)
        .then(res=>res)
}

//结算历史
function payHistory(csr_id,page){
    var params = {"params":"{'biz':'com.supp.finance.history','data':{'csr_id':'"+csr_id+"','page':'"+page+"','limit':'10'}}"}
    return fetchApi(params)
        .then(res=>res)
}
//-----------------------------------------------全局------------------------------------------------
// 数据为空页面
function no_Detail(data){
    var crr='<div class="no-shuju">'+
        '<img src='+data +' alt="">'+
        '</div>';
    if($(".no-shuju") ){
        $(".no-shuju").remove();
        $("body").append(crr);
    }else{
        $("body").append(crr);
    }
}
// 数据为空页面
function no_Detail(data){
    var crr='<div class="no-shuju">'+
        '<img src='+data +' alt="">'+
        '</div>';
    if($(".no-shuju") ){
        $(".no-shuju").remove();
        $("body").append(crr);
    }else{
        $("body").append(crr);
    }
}
//成功提示
function successTips(data){
  var arr='<div class="getShop">'+
    '<img src="../images/Add to cart success@2x.png" alt="" />'+
    '<p>'+data+
    '</p>'+
    '</div>';
  $("body").append(arr);
  var t=setTimeout("$('.getShop').remove()",800);
}

//失败提示
function failTips(data){
  var arr='<div class="getShop">'+
    '<img src="../images/Add to cart fail@2x.png" alt="" />'+
    '<p>'+data+
    '</p>'+
    '</div>';
  $("body").append(arr);
  var t=setTimeout("$('.getShop').remove()",800);
}

//获取秒数的时间格式
function getBackTime(t){
    t = Math.abs(t);
    var s = Math.floor(t%60) < 10 ? '0' : '';
    var m = Math.floor(t/60%60) < 10 ? '0' : '';
    var h = Math.floor(t/60/60%24) < 10 ? '0' : '';
    return Math.floor(t/60/60/24) + '天' + h + Math.floor(t/60/60%24) + ':' + m + Math.floor(t/60%60) + ':' + s + Math.floor(t%60);
}

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

function smartSize(){
    var h=window.getComputedStyle(document.getElementById("userSum")).height;
    var w=window.getComputedStyle(document.getElementById("userSum")).width;
    if( parseInt(h) >"74"||parseInt(w)>document.body.clientWidth ){
        document.getElementById("userSum").style.fontSize="32px"
    }
}


