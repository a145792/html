/**
 * Created by Administrator on 2017/10/17 0017.
 */
/**
 * Created by Administrator on 2017/10/16 0016.
 */
Vue.config.productionTip = false;
var vm = new Vue({
    el: '#app',
    data: {

    }
});


$(function(){
//页面当前时间
    var myDate = new Date();
    $("#end-date").val(myDate.getFullYear()+"-"+(myDate.getMonth()+1)+"-"+myDate.getDate()+"至"+myDate.getFullYear()+"-"+(myDate.getMonth()+1)+"-"+myDate.getDate())
    //顶部数字展示   唱的话会自动缩小字体
    smartSize();

    $("#loadingdiv").remove();
})



mui.init({
    pullRefresh:{
        container: '#pullrefresh',
        down: {
            auto:false,//可选,默认false.自动下拉刷新一次
            callback: pulldownRefresh
        },
        up: {
            contentrefresh: '正在加载...',
            contentnomore:'没有更多数据了',
            callback: pullupRefresh
        }
    }
});

//下拉刷新
function pulldownRefresh(){

    setTimeout(function () {
        //实现更新页面的操作
        mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
    }, 1000);

}
//上拉加载
function pullupRefresh()
{
    setTimeout(function() {
        if(2222==2222)//参数为true代表没有更多数据了。(22> 22)页数对比
        {
            //参数为true代表没有更多数据了。
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
        }
        else
        {
            mui('#pullrefresh').pullRefresh().endPullupToRefresh();
        }
    },500);
}

