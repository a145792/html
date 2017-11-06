Vue.config.productionTip = false
var vm = new Vue({
	el:'#app',
	data:{
		item:{}			//菜详情数据
	}
})


$(function(){
	$('.headerTop').height($('.header').width());

	var sid_id = getRequestParameter('sid_id')
	var latitude = getRequestParameter('latitude')
    var longitude = getRequestParameter('longitude')
	var origin = getRequestParameter('origin');
	if(origin ==  'wxshop'){
		$('.top').remove();
		$('.header').css('margin-top','0');
	}
	//获取菜的详情
	foodDetail(sid_id,latitude,longitude)
		.then(res=>{
			vm.item = res.data;
			$('.loading').hide();
		})

})