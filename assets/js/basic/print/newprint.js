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
    $(".savetemp").on("click", function () {
        var index = layer.load();
        var html = UE.getEditor('editor').getContent()
        var newhtml=corres(html);
        // console.log(UE.getEditor('editor').getContent())
        var encodeHTML = base.encode(newhtml);
        var type=$("#Template_BillType").val();
        var version=$("#Template_Version").val()
        var data = {
            Template_BillType: type,
            Template_Version: version,
            Template_Html: encodeHTML
        }
        console.log(data)
      
        $.ajax({
            type: 'POST',
            url: ajaxURl + '/Api/PSIBase/Template/Add?',
            data: data,
            success: function (res) {
                console.log(res) 
                var isussecc = res.Succeed;
                if(isussecc){
                    layer.close(index);
                    layer.msg("新增成功");
                }
            }
        })
    })


    // $(".gettemp").on("click", function () {
    //     $.ajax({
    //         type: 'GET',
    //         url: ajaxURl + '/Api/ApiService/Get/BASTemplate_Inf?token=' + token + '&cTemplate_BillType=SalesOrder',
    //         success: function (res) {
    //             console.log(JSON.parse(res))
    //             // var html = htmlEscape(JSON.parse(res).Data[0].Template_Html);
    //             var html = base.decode(JSON.parse(res).Data[0].Template_Html)
    //             console.log(html)
    //             UE.getEditor('editor').setContent(html);
    //         }
    //     })
    // })


    $(".addattr").on("click",function(){
        var html='<li>'+
                 '<span>编码</span>'+
                 '<input type="text" value="">'+
                 '</li>';
        $(".attrlists ul").append(html)
    })



})

// 创建编辑器
function createEditor() {
    enableBtn();
    UE.getEditor('editor');
}
// 获得整个html的内容
function getAllHtml() {
    // alert(UE.getEditor('editor').getAllHtml())
    console.log(UE.getEditor('editor').getAllHtml())
}
function getContent() {

    console.log(UE.getEditor('editor').getContent())
}
//
function enableBtn() {
    var div = document.getElementById('btns');
    var btns = UE.dom.domUtils.getElementsByTagName(div, "button");
    for (var i = 0, btn; btn = btns[i++];) {
        UE.dom.domUtils.removeAttributes(btn, ["disabled"]);
    }
}
// 写入内容
function setContent(isAppendTo) {
    var arr = [];
    arr.push("使用editor.setContent('欢迎使用ueditor')方法可以设置编辑器的内容");
    UE.getEditor('editor').setContent('欢迎使用ueditor', isAppendTo);
    alert(arr.join("\n"));
}
// 判断是否有内容
function hasContent() {
    var arr = [];
    arr.push("使用editor.hasContents()方法判断编辑器里是否有内容");
    arr.push("判断结果为：");
    arr.push(UE.getEditor('editor').hasContents());
    alert(arr.join("\n"));
}
// 删除编辑器
function deleteEditor() {
    disableBtn();
    UE.getEditor('editor').destroy();
}
function disableBtn(str) {
    var div = document.getElementById('btns');
    var btns = UE.dom.domUtils.getElementsByTagName(div, "button");
    for (var i = 0, btn; btn = btns[i++];) {
        if (btn.id == str) {
            UE.dom.domUtils.removeAttributes(btn, ["disabled"]);
        } else {
            btn.setAttribute("disabled", "true");
        }
    }
}
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