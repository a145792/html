Vue.config.productionTip = false;
var vm = new Vue({
	el:'#app',
	data:{
		begin:'',
		last:'',
		page:1,
		count:'',
		price:'',
		list:[]
	},
	filters:{
		//格式化时间

		FMtime:function(time){
			if(!isUndef(time) && !isNull(time) && time.length >10){
				time = time.substring(0,16);
			}
			return time
		},
		//验证状态码
		order_status:function(order){
			if(order.indexOf("0")!=-1){
				return "待付款";
			}else if(order.indexOf("1")!=-1){
				return "已完成";
			}else if(order.indexOf("2")!=-1){
				return "已取消";
			}else if(order.indexOf("3")!=-1){
				return "待消费";
			}else if(order.indexOf("4")!=-1){
				return "待评价";
			}else if(order.indexOf("5")!=-1){
				return "已关闭";
			}else if(order.indexOf("6")!=-1){
				return "待退款";
			}else if(order.indexOf("7")!=-1){
				return "已退款";
			}else if(order.indexOf("8")!=-1){
				return "待发货";
			}else if(order.indexOf("10")!=-1){
				return "已发货";
			}else if(order.indexOf("11")!=-1){
				return "退款审批中";
			}
		}
	}
})


function getDate(){
	var date = new Date();
	var Y = date.getFullYear() + '-';
	var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	var D = date.getDate();
	return Y+M+D;
}


$(function() {
	//获取日期
	vm.begin = getDate();
	vm.last = getDate();
	//获取店铺id
	var shop_id = getRequestParameter('shop_id');
	//获取列表
	consumList(shop_id, vm.page, 0, vm.begin, vm.last)
		.then(res=> {
			vm.count = res.data.count;
			vm.price = res.data.sumPrice;
			vm.list = res.data.item;
			$(".loading").hide();
		});
	//拨打电话
	$(document).on('click','#telPhone',function(){
		var phone = $(this).attr('phone')
		if(origin == 'adr'){
			APP.appToPhone(phone)
		}else if(origin == 'ios'){
			window.webkit.messageHandlers.appToPhone.postMessage(phone)
		}else if(origin == 'wxshop'){
			window.location.href = 'tel:'+phone
		}
	})
	$(".beginTime").mobiscroll().date({
		theme: "android-ics",
		lang: "zh",
		display: 'bottom',
		dateFormat: 'yy-mm-dd', //返回结果格式化为年月格式
		// wheels:[], 设置此属性可以只显示年月，此处演示，就用下面的onBeforeShow方法,另外也可以用treelist去实现
		//onBeforeShow: function (inst) { inst.settings.wheels[0].length>2?inst.settings.wheels[0].pop():null; }, //弹掉“日”滚轮
		headerText: function (valueText) { //自定义弹出框头部格式
			array = valueText.split('-');
			return array[0] + "年" + array[1] + "月" + array[2] + "日";
		},
		onSelect: function (valueText, inst) {
			//$(this).find(".beginTime").html(valueText);
			var arr = valueText.split('-');
			var crr=vm.last.split('-');
			if(arr[0]<=crr[0]||arr[0]==crr[0]&&arr[1]<=crr[1]||arr[0]==crr[0]&&arr[1]==crr[1]&&arr[2]<=crr[2]){
				vm.begin=valueText;
			}else{
				vm.begin=vm.last;
			}
			vm.list=[];
			//获取这段时间订单列表
			vm.page = 1;
			consumList(shop_id,1,0,vm.begin,vm.last)
				.then(res=>{
					vm.count=res.data.count;
					vm.price=res.data.sumPrice;
					vm.list=res.data.item;
				});
		}
	});
	$(".lastTime").mobiscroll().date({
		theme: "android-ics",
		lang: "zh",
		display: 'bottom',
		dateFormat: 'yy-mm-dd', //返回结果格式化为年月格式
		// wheels:[], 设置此属性可以只显示年月，此处演示，就用下面的onBeforeShow方法,另外也可以用treelist去实现
		//onBeforeShow: function (inst) { inst.settings.wheels[0].length>2?inst.settings.wheels[0].pop():null; }, //弹掉“日”滚轮
		headerText: function (valueText) { //自定义弹出框头部格式
			array = valueText.split('-');
			return array[0] + "年" + array[1] + "月" + array[2] + "日";
		},
		onSelect: function (valueText, inst) {
			//$(this).find(".beginTime").html(valueText);
			var arr = valueText.split('-');
			var crr=vm.begin.split('-');
			var drr=getDate().split('-');
			if(arr[0]<=drr[0]||arr[0]==drr[0]&&arr[1]<=drr[1]||arr[0]==drr[0]&&arr[1]==drr[1]&&arr[2]<=drr[2]){
				vm.last=valueText;
				if(arr[0]<=crr[0]||arr[0]==crr[0]&&arr[1]<=crr[1]||arr[0]==crr[0]&&arr[1]==crr[1]&&arr[2]<=crr[2]){
					vm.begin=vm.last;
				}else{
					vm.last=valueText;

				}
			}else{
				vm.last=getDate();
			}


			vm.page = 1;
			//获取这段时间订单列表
			consumList(shop_id,1,0,vm.begin,vm.last)
				.then(res=>{
					vm.count=res.data.count;
					vm.price=res.data.sumPrice;
					vm.list=res.data.item;
				});
		}

	});

	//加载第二页数据
	$(window).scroll(function() {
		var scrollA=document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
		if (scrollA>= $(document).height() - $(window).height()) {
			//计算总页码
			var pageCount = parseInt((vm.count%10 == 0) ? vm.count/10 : vm.count/10 + 1);
			if(vm.page >= pageCount){
				vm.toke = true;
				return;
			}
			//加载数据
			consumList(shop_id,vm.page+1,0,vm.begin,vm.last)
				.then(res=>{
					var code = res.code
					if(code == 0){
						vm.count=res.data.count;
						vm.price=res.data.sumPrice;
						var list = res.data.item;
						vm.list = vm.list.concat(list);
						vm.page = vm.page + 1;
					}else{
						alert(res.message);
					}

				});
	}
	})
})
