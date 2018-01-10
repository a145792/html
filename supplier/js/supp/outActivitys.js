Vue.config.productionTip = false;
var vm = new Vue({
    el: '#app',
    data: {
    	csr_id:'',
    	list:[],
    	count:''
    }
});


$(function(){
    
    vm.csr_id = getRequestParameter('csr_id')
	init()

	$(document).on('click','.makeAct',function(){
		var mav_id = $(this).attr('mav_id')
		var mav_type = $(this).attr('mav_type')

		if(mav_type == 'morefree'){
			if(vm.count != '0'){
				mui.toast('您的店铺已有满减活动呢!')
				return
			}
		}

		var params = {'mav_id':mav_id,'mav_type':mav_type}
        APPAction('createActivity',params)
	})

})

function init(){
	getOutActivity(vm.csr_id)
		.then(res=>{
			$("#loadingdiv").remove()
			if(res.code != '0'){
				mui.toast(res.message)
			}else{
				vm.list = res.data.item
				vm.count = res.data.count
			}
		})

}


