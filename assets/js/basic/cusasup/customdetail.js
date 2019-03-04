$(function(){
    var url=window.location.search;
    var cusname=url.split("?")[1].split("=")[1]
    $.ajax({
        url:ajaxCus+cusname,
        success:function(res){
            console.log(res)
            assigncustomMsg(res.Data)
            $("#customid").val(res.Data[0].F_Id)
        }
    })


    // 
    $(".sub").on("click", function () {
        var cuslist = $("#customMsg").serializeArray()
        var data = {};
        var customnick = $("#Customer_Nick").val()
        var customname = $("#Customer_Name").val()
        for (var j = 0; j < cuslist.length; j++) {
            data[cuslist[j].name] = cuslist[j].value
        }
        data.Customer_Nick = customnick
        data.Customer_Name = customname
        // var contact = getcontract()
        // var materList = getmater()
        // var addresslist = getaddress()
        // var financelist = []
        // var fincenum = $("#Finance_Account").val()
        // var finalist = $("#finaceMsg").serializeArray()
        // if (fincenum != '') {
        //     var findata = {}
        //     for (var i = 0; i < finalist.length; i++) {
        //         findata[finalist[i].name] = finalist[i].value
        //     }
        //     financelist.push(findata)
        // }
        // data.Contact = contact
        // data.Address = addresslist
        // data.Finance = financelist
        // data.Material = materList
        console.log(data)
        var index = layer.load();
        $.ajax({
            url: ajaxCusedit,
            type: "post",
            data: data,
            success: function (res) {
                console.log(res)
                if (res.Succeed) {
                    layer.close(index);
                    layer.msg("修改成功");
                    setInterval(function () {
                        window.location.reload()
                    }, 1000)
                } else {
                    layer.close(index);
                    alert(res.Message)
                }
            }
        })
    })
})

function assigncustomMsg(data){
    var customMsg=$('#customMsg').serializeArray();
    $.each(customMsg,function(i,v){
        var fornName=(v.name).toString()
        $("#Customer_Nick").val(data[0].Customer_Nick)
        $("#Customer_Name").val(data[0].Customer_Name)
        $("#"+v.name+"").val(data[0][fornName])
    })
}