$(function(){
    var url=window.location.search;
    var fid=url.split("?")[1].split("=")[1]
    $.ajax({
        url:ajaxstockbillone+fid,
        success:function(res){
            console.log(res)
        }
    })
})