Vue.config.productionTip = false
var vm = new Vue({
	el:'#app',
	data:{
		text:'hello',
		ict_type:0, 	// 0全部  1 好评 2 差评 3有图   
		page:1,			//当前页码
		count:'1',		//总评论数
        badcount:'',
        goodcount:'',
        picscount:'',
		list:[],			//菜详情数据
        token:true      //防止重复加载数据的锁
	},
    filters:{
        
        FMimg:function(img){
            if(!isUndef(img) && !isNull(img)){
                img += '?imageView2/1/w/500/h/500'
            }else{
                img = 'http://pics.jiuziran.com/Fuk-iFCr5DnXVyzYSQBbJXdhhVN_';
            }
            return img
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
    //获取来源
    var origin = getRequestParameter('origin')
    var shop_id = getRequestParameter('shop_id')
    $(".loading").hide();
    if(origin == 'wxshop'){
        $('.commentFixed').css('padding-top','0');
        $('.commentDetail').hide();
        $('.comment').css('padding-top','41px')
        $('.commentLi').css('top','0')
    }

    //初始化参数
    init(shop_id,0)
    
    
    //切换评论类型
    $(document).on('click','.commentLi',function(){
        var type = $(this).attr('order');
        vm.ict_type = type
        init(shop_id,type)
        vm.page = 1;
    })


    //上拉加载下一页
    $(window).scroll(function() { 
        if ($(document).scrollTop() >= $(document).height() - $(window).height()) {

            if(!vm.token){
                return
            }else{
                vm.token = false;
            }

            //获取当前类型  和总数
            var type = vm.ict_type
            var acount = 0;
            if(type == 0){
                acount = vm.count;
            }else if(type == 1){
                acount = vm.goodcount;
            }else if(type == 2){
                acount = vm.badcount;
            }else if(type == 3){
                acount = vm.picscount;
            }

            //计算总页码
            var pageCount = parseInt((acount%10 == 0) ? acount/10 : acount/10 + 1);

            if(vm.page >= pageCount){
                vm.token = true;
                return;
            }

            //加载数据
            getShopCommentList2(shop_id,vm.page+1,10,type)
                .then(res=>{
                    var code = res.code
                    if(code == 0){
                        var list = res.data.items;
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

    //点击返回
    $(document).on('click','.back_i',function(){
        window.history.back();  //返回上一页
    })


})



function init(shop_id,type){
    getShopCommentList2(shop_id,1,10,type)
        .then(res=>{
            var code = res.code
            if(code == 0){
                //vm.count = res.data.count;
                vm.list = res.data.items;
                vm.count = res.data.count;
                vm.badcount = res.data.badcount;
                vm.goodcount = res.data.goodcount;
                vm.picscount = res.data.picscount;
            }else{
                alert(res.message);
            }
        })
}
