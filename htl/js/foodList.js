Vue.config.productionTip = false
var vm = new Vue({
	el:'#app',
	data:{
		showOne:false,	//是否展示最上面那个(总数不等于2)
		showTwo:false,	//展示中间的两个
		showOther:false,//展示剩下的路径
		first:{},		//最上面的菜
		second:[],		//中间横这的两个菜
		foods:[],		//剩下的菜
		second1cla:'iconII',  //中间两的第一个的class
		second2cla:'iconIII',  //中间两的第二个的class
	},
	filters:{
		maxImg:function(value){
			return value + '?imageView2/1/w/355/h/120'
		},
		modImg:function(value){
			return value + '?imageView2/1/w/173/h/173'
		},
		mixImg:function(value){
			return value + '?imageView2/1/w/64/h/64'
		}
	},
	updated:function(){
		$('.loading').hide();
	}

})




$(function(){
	var shop_id = getRequestParameter('shop_id')
	var latitude = getRequestParameter('latitude')
    var longitude = getRequestParameter('longitude')
	var origin = getRequestParameter('origin')
	if(origin ==  'wxshop'){
		$('.top').remove();
		$('.main').css('margin-top','0');
	}
	//获取菜的列表
	getShopFood(shop_id,1)
		.then(res=>{
			var list =res.data.items
			var count = res.data.count
			if(count == 1){			//只有一个
				vm.first = list[0]
				vm.showOne = true
				return
			}else if(count == 2){
				vm.second = list
				vm.second1cla = 'iconI'
				vm.second2cla = 'iconII'
				vm.showTwo = true
				return
			}else if(count == 3){
				vm.first = list[0]
				var seco = []
				seco[0] = list[1]
				seco[1] = list[2]
				vm.second = seco
				vm.showOne = true
				vm.showTwo = true
				return
			}else{
				vm.first = list[0]
				var seco = []
				seco[0] = list[1]
				seco[1] = list[2]
				vm.second = seco
				var othe = []
				for(var i = 3; i < list.length; i++){
					othe[i-3] = list[i]
				}
				vm.foods = othe
				vm.showOne = true
				vm.showTwo = true
				vm.showOther = true
				return
			}

		})







	//点击菜跳转菜的详情
	$(document).on('click','.product',function(){
		var id = $(this).attr('id')
		var rootPath = getRootPath();
		window.location.href = rootPath + '/foodDetail.html?sid_id=' + id + '&latitude=' + latitude + '&longitude=' + longitude+'&origin='+origin
	})




})
















