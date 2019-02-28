$(function(){
    var url=window.location.search;
    var cusname=url.split("?")[1].split("=")[1]
    $.ajax({
        url:ajaxCus+cusname,
        success:function(res){
            console.log(res)
        }
    })
})