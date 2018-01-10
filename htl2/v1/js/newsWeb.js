Vue.config.productionTip = false
var vm = new Vue({
    el:'#app',
    data:{
        mobile:'',
    	list:[],				//消息列表
    	count:1,
    	page:1
    },
    filters:{
    	getAvatar:function(img){
            if(!isUndef(img) && !isNull(img)){
                img += '?imageView2/1/w/500/h/500'
            }else{
                img = 'http://pics.jiuziran.com/Fuk-iFCr5DnXVyzYSQBbJXdhhVN_';
            }
            return img
        },
        getCommentImg:function(num){
        	num = num * 1;
        	if(num == 0){
        		return '../themes/images/shop_star0@2x.png';
        	}else if(num > 0 && num <= 1){
        		return '../themes/images/shop_star1@2x.png';
        	}else if(num > 1 && num <= 2){
        		return '../themes/images/shop_star2@2x.png';
        	}else if(num > 2 && num <= 3){
        		return '../themes/images/shop_star3@2x.png';
        	}else if(num > 3 && num <= 4){
        		return '../themes/images/shop_star4@2x.png';
        	}else if(num >4 && num <= 5){
        		return '../themes/images/shop_star5@2x.png';
        	}
        },
        //格式化时间
        FMtime:function(time){
            if(!isUndef(time) && !isNull(time) && time.length > 10){
                time = time.substring(0,10)
            }
            return time
        }
    }
})
$(function(){

	var mobile = getRequestParameter('mobile');
    vm.mobile = mobile
    var origin = getRequestParameter('origin');
	var token = true;
	var count = 0;

	getNews(mobile,1)
		.then(res=>{
            console.log(res)
			var mylist = res.data.items;
			var pics;
            count = res.data.count;

            if(count > 0){
                for(var i = 0; i < mylist.length; i++){
                    if(mylist[i].push_type.indexOf('order') >= 0){
                        mylist[i].push_type = 'order'
                    }
                    if(mylist[i].push_type.indexOf('default') >= 0){
                        mylist[i].push_type = 'default'
                    }
                    
                    item = mylist[i];
                    if(item.push_type == 'default'){    //评论
                        pics = mylist[i].item[0].ict_photo;
                        if(isUndef(pics) || isNull(pics)){
                            mylist[i].pics = [];
                        }else{
                            mylist[i].pics = pics.split(',');
                        }
                    }
                }
            }
    			

			vm.list = mylist;
			vm.count = res.data.count;	
			count = res.data.count;		
			$('.loading').hide()
		})



    //点击订单
    mui(".mui-content").on('tap','.order_item',function(e){ 
        var sor_id = $(this).attr('sor_id');
        var name = $(this).attr('name');
        var push_read_status = $(this).attr('push_read_status')
        var push_id = $(this).attr('push_id')
        if(push_read_status == 'N'){
            readPush(push_id)
                .then(res=>{
                    console.log(res)
                })
        }
        var is_discount = 0;
        if(name == '优惠买单'){
            //window.location.href = getRootPath() + '/busweb/orderDetail.html?from=web&sor_id='+sor_id+'&is_discount=1&origin='+origin;
            is_discount = 1;
        }
        /*else{
            window.location.href = getRootPath() + '/busweb/orderDetail.html?from=web&sor_id='+sor_id+'&is_discount=0&origin='+origin;
        }*/
        var json = {};
        json.sor_id = sor_id;
        json.is_discount = is_discount;
        if(origin == 'adr'){
            APP.appToOrder(sor_id,is_discount)
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToOrder.postMessage(json)
        }else if(origin == 'wxshop'){
        }
    })

    //点击广告
    mui(".mui-content").on('tap','.guanggao',function(e){ 
        var aid = $(this).attr('aid');
        if(origin == 'adr'){
            APP.appToAdvert(aid)
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToAdvert.postMessage(aid)
        }else if(origin == 'wxshop'){
        }
    })

    //点击评论
    mui(".mui-content").on('tap','.comment_item',function(e){ 
        var push_read_status = $(this).attr('push_read_status')
        var push_id = $(this).attr('push_id')
        if(push_read_status == 'N'){
            readPush(push_id)
                .then(res=>{
                    console.log(res)
                })
        }
        if(origin == 'adr'){
            APP.appToComment()
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToComment.postMessage(1)
        }else if(origin == 'wxshop'){
        }
    })

    //点击返回
    $(document).on('tap','.toback',function(){
    	if(origin == 'adr'){
            APP.appToBack()
        }else if(origin == 'ios'){
            window.webkit.messageHandlers.appToBack.postMessage(12)
        }else if(origin == 'wxshop'){
        }
    })
    
})


mui.init({
    pullRefresh:{
        container: '#pullrefresh',
        down: {
            auto:false,//可选,默认false.自动下拉刷新一次
            callback: pulldownRefresh2
        },
        up: {

            contentrefresh: '正在加载...',
            contentnomore:'没有更多数据了',
            callback: pullupRefresh
        }
    }
});

function pulldownRefresh(){
    return false;
}

//下拉刷新
function pulldownRefresh2(){
    
    getNews(vm.mobile,1)
        .then(res=>{
            var mylist = res.data.items;
            var pics;
            var count = res.data.count;

            if(count > 0){
                for(var i = 0; i < mylist.length; i++){
                    if(mylist[i].push_type.indexOf('order') >= 0){
                        mylist[i].push_type = 'order'
                    }
                    if(mylist[i].push_type.indexOf('default') >= 0){
                        mylist[i].push_type = 'default'
                    }

                    item = mylist[i];
                    if(item.push_type == 'default'){    //评论
                        pics = mylist[i].item[0].ict_photo;
                        if(isUndef(pics) || isNull(pics)){
                            mylist[i].pics = [];
                        }else{
                            mylist[i].pics = pics.split(',');
                        }
                    }
                }
            }

            vm.page = 1
            vm.list = mylist;
            vm.count = res.data.count;  

            mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
        })

}
//上拉加载
function pullupRefresh(){
    //计算总页码
    var pageCount = parseInt((vm.count%10 == 0) ? vm.count/10 : vm.count/10 + 1);
    mui('#pullrefresh').pullRefresh().endPullupToRefresh(vm.page >= pageCount); 
    if(vm.page < pageCount){
        //加载数据
        getNews(vm.mobile,vm.page+1)
            .then(res=>{
                console.log(res)
                var code = res.code
                if(code == 0){
                    var mylist = res.data.items;
                    var pics;
                    for(var i = 0; i < mylist.length; i++){
                        item = mylist[i];
                        if(item.push_type == 'default'){    //评论
                            pics = mylist[i].item[0].ict_photo;
                            if(isUndef(pics) || isNull(pics)){
                                mylist[i].pics = [];
                            }else{
                                mylist[i].pics = pics.split(',');
                            }
                        }
                    }
                    vm.list = vm.list.concat(mylist);
                    vm.page = vm.page + 1;
                    token = true
                }else{
                    alert(res.message);
                    token = true
                }
            })

    }
    
}