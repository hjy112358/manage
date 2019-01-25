$(function () {
    var layer;
    layui.use(['jquery', 'table', 'layer', "form", "layedit", "laydate", "upload"], function () {
        layer = layui.layer;
    })
    //实例化编辑器
    //建议使用工厂方法getEditor创建和引用编辑器实例，如果在某个闭包下引用该编辑器，直接调用UE.getEditor('editor')就能拿到相关的实例
    var ue = UE.getEditor('editor');
    
    var token = $.cookie("token");
    var base = new Base64();
    var url=window.location.search.split("?")[1].split("&")
    console.log(url)
    var type=url[0].split("=")[1];
    $("#Template_BillType").val(type);
    var ver=$.cookie("ver")
    $("#Template_Version").val(ver)
    var id=url[1].split("=")[1];
    var tableid=[];

    $.ajax({
        type: 'GET',
        url: ajaxURl + '/Api/PSIBase/Template/GetEntity?keyValue='+id,
        success: function (res) {
            var html = base.decode(res.Data.Template_Html)
            console.log(html)
            ue.ready(function() {
                ue.setContent(html);
            });
            
            $(".tempoay").html(html);
            // $(".tempoay").addClass("hidden")
            var tables=$(".tempoay table");
            var attlist=''
            for(var i=0;i<tables.length;i++){
                var id=$(tables[i]).attr("id");
                attlist+='<li>'+
                        '<span>编码</span>'+
                        '<input type="text" value="'+id+'">'+
                         '</li>'
            }
            $(".attrlists ul").html(attlist)
            console.log(tableid);

        }
    })


    // 保存修改
    $(".savetemp").on("click", function () {
        var index = layer.load();
        var html = UE.getEditor('editor').getContent()
        console.log(html)
        var newhtml=corres(html);
        // console.log(UE.getEditor('editor').getContent())
        var encodeHTML = base.encode(newhtml);
        var typenew=$("#Template_Version").val();
        var data = {
            Template_BillType: type,
            Template_Version: typenew,
            F_Id:id,
            Template_Html: encodeHTML
        }
        console.log(data);
        $.ajax({
            type: 'POST',
            url: ajaxURl + '/Api/PSIBase/Template/Edit',
            data: data,
            success: function (res) {
                var isussecc = res.Succeed;
                if(isussecc){
                    layer.close(index);
                    layer.msg("修改成功");
                }
            }
        })
    })


  
    $(".addattr").on("click",function(){
        var html='<li>'+
                 '<span>编码</span>'+
                 '<input type="text" value="">'+
                 '</li>';
        $(".attrlists ul").append(html)
    })
})


// 匹配属性和表格
function corres(content){
    var arrs=[];
    var attlist=$(".attrlists ul li input");
    for(var i=0;i<attlist.length;i++){
        console.log(attlist[i])
       var nowarr=$(attlist[i]).val()
       if(nowarr){
        arrs.push(nowarr)
       }else {
           continue
       }
    }
    $(".tempoay").html(content)
    var tables= $(".tempoay table")
    for(var j=0;j<tables.length;j++){
        $(tables[j]).attr("id",arrs[j])
    }
    var newconten=$(".tempoay").html();
    return newconten;
  
}