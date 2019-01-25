
// 渲染table
var form;
var base = new Base64();
function tablerender(str, data) {
    layui.use(['jquery', 'table','form'], function () {
        var $ = layui.$,
            table = layui.table;
            form=layui.form;
        table.render({
            elem: '#dataTable'
            // , toolbar: true
            , cols: [str]
            , data: data
            , page: true
            , limits: [1000, 2000, 3000, 4000, 5000]
            , limit: 1000
            , done: function () {
                table.on('rowDouble(dataTable)', function (obj) {
                    console.log(obj);
                    var temp=obj.data;
                    $.cookie("ver",temp.Template_Version)
                    parent.gettemplte(temp.Template_BillType,temp.F_Id)
                });
            }
        });
        return false;
    })
}
var token = $.cookie("token");

$(function () {
 
    var islist = false;
 
    $(".checklist").on("click", function () {
        var str = [
            { title: '序号', type: 'numbers'},
            { field: 'Template_BillType', title: '单据类型'},
            { field: 'Template_Version', title: '版本' },
          
            {
                field: 'Template_Id', title: '操作', align: 'center', templet: function (d) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-danger" onclick=deltempte("' + d.Template_Id + '")>移除</a>';
                }
            }
        ]
        var type=$("#cTemplate_BillType").val();
        var ver=$("#cTemplate_Version").val();
        var para=''
    //    if(type&&ver){
            para= '?cTemplate_BillType='+type+'&cTemplate_Version='+ver
        // }else  if(type){
        //     para= '?cTemplate_BillType='+type
        // }
        $.ajax({
            type: "GET",
            async: false,
            // url: ajaxURl + "/Api/ApiService/Get/BASTemplate_Inf?token=" + token+'&cTemplate_BillType='+type+'&cTemplate_Version='+ver,
            url: ajaxURl + "/Api/PSIBase/Template/GetList?keyword=",
            success: function (res) {
                console.log(res)
                var data = res.Data;
                var isussecc = res.Succeed;
                if (isussecc) {                 
                    tablerender(str, data);
                } else {
                    alert(res.Message)
                }
            }
        })

    })

    $(".checklist").trigger("click")


    // 客户

    $(".checkcus").on("click", function () {
        var _this = $(this);
        var date = _this.attr("data-type");
        if (date == 'daten') {
            $(".checkcus").attr("data-type", "datey");
            $.ajax({
                type: "get",
                url: ajaxURl + "/Api/ApiService/Get/BASCustomer_Inf?token=" + token,
                success: function (res) {
                    console.log(JSON.parse(res))
                    var isussecc = JSON.parse(res).Succeed;
                    var data = JSON.parse(res).Data;
                    if (isussecc) {
                        var html = '<option value="">全部</option>';
                        var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                        for (var i = 0; i < data.length; i++) {
                            html += '<option value="' + data[i].Customer_Nick + '" data-rate="' + data[i].Customer_TaxRate + '">' + data[i].Customer_Nick + '</option>';
                            htmlsel += '<dd lay-value="' + data[i].Customer_Nick + '" data-rate="' + data[i].Customer_TaxRate + '">' + data[i].Customer_Nick + '</dd>'
                        }
                        $("#Customer_Nick").html(html);
                        $(".checkcus .layui-anim.layui-anim-upbit").html(htmlsel);
                        renderForm();
                        _this.find("select").next().find('.layui-select-title input').click();
                        // Customer_TaxRate 税率   
                    } else {
                        alert(JSON.parse(res).Message)
                    }

                }
            })
        }
    })

    $(".add").on("click", function () {
        parent.newtemp();
    })

     // 切换单据类型
    layui.form.on('select(type)', function (data) {
        getver(data.value)
    })




})


function renderForm() {
    layui.use('form', function () {
        var form = layui.form;
        form.render();
 
    });
}

// 获取版本号
function getver(type){
    $.ajax({
        type: "get",
        url: ajaxURl + "/Api/ApiService/Get/BASTemplate_Inf?token=" + token+'&cTemplate_BillType='+type,
        success: function (res) {
            console.log(JSON.parse(res))
            var isussecc = JSON.parse(res).Succeed;
            var data = JSON.parse(res).Data;
            if (isussecc) {
                var html = '<option value="">全部</option>';
                var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                for (var i = 0; i < data.length; i++) {
                    html += '<option value="' + data[i].Template_Version + '" >' + data[i].Template_Version + '</option>';
                    htmlsel += '<dd lay-value="' + data[i].Template_Version + '">' + data[i].Template_Version + '</dd>'
                }
                $("#cTemplate_Version").html(html);
                $(".version .layui-anim.layui-anim-upbit").html(htmlsel);
                renderForm();
            } else {
                alert(JSON.parse(res).Message)
            }

        }
    })
}

function deltempte(id) {

    var index = layer.confirm('确认删除？', {
        btn: ['确定', '取消'] //按钮
    }, function () {
        var token = $.cookie("token");
        $.ajax({
            type: "POST",
            async: false,
            url: ajaxURl + "/Api/ApiService/Remove/BASTemplate_Inf?token=" + token,
            data: {
                Template_Id: id
            },
            success: function (res) {
                var data = JSON.parse(res).Data;
                console.log(data)
                var isussecc = JSON.parse(res).Succeed;
                if (isussecc) {
                    layer.close(index)
                    $(".checklist").trigger("click")
                   
                } else {
                    layer.close(index)
                    alert(JSON.parse(res).Message)
                }
            }
        })
    });
   

}

// function printable() {
//     var base = new Base64();
//     $(".printbody").removeClass("hidden");
//     $.ajax({
//         type: 'GET',
//         url: ajaxURl + "/Api/ApiService/Get/BASTemplate_Inf?token=" + token + '&cTemplate_BillType=SalesOrder&cTemplate_Version=v006',
//         success: function (res) {
//             console.log(JSON.parse(res))
           
//             var res = JSON.parse(res);
//             var resdata = res.Data;
//             var isussecc = res.Succeed;
//             if (isussecc) {
//                 var templet = resdata[0].Template_Html;
//                 // var data = res[0].Template_DataUrl;
//                 var html = base.decode(templet)
//                 $(".printbody").html(html)
//                 PraseTable();
//                 PraseBody();
//             }
//         }
//     })

//     var data = {
//         test: [{
//             num: "金蝶专业版"
//             , name: "鼎纳"
//             , Number: "Number@@"
//             , Price: "Price@@"
//             , Amount: "Amount@@"
//             , Remark: "Remark@@"
//         }, {
//             num: "金蝶旗舰版"
//             , name: "恒悦"
//             , Number: "Number##"
//             , Price: "Price##"
//             , Amount: "Amount##"
//             , Remark: "Remark##"
//         }
//         ],
//         test1: [{
//             Name: "一年上门服务"
//             , Customer: "Customer$$"
//             , Number: "Number$$"
//             , Price: "Price$$"
//             , Amount: "Amount$$"
//             , Remark: "Remark$$"
//         }, {
//             Name: "三年远程技术支持"
//             , Customer: "Customer**"
//             , Number: "Number**"
//             , Price: "Price**"
//             , Amount: "Amount**"
//             , Remark: "Remark**"
//         }
//         ],
//         demo: "2019-01-14"
//     };

    




//     function PraseTable() {
//         console.log(1)
//         $('.printbody table').each(function (index, tb) {
//             var detail = data[tb.id];
//             $.each(detail, function (index, obj) {
//                 var row = $('#' + tb.id).children().children("tr:last").html();
//                 var org = row;
//                 console.log(obj);
//                 $.each(obj, function (key, val) {
//                     var reg = new RegExp("{" + key + "}", "g");//g,表示全部替换。
//                     row = row.replace(reg, val);
//                 });
//                 $('#' + tb.id).children().children("tr:last").replaceWith("<tr>" + row + "</tr>" + "<tr>" + org + "</tr>")
//             });
//             //抹除模板行
//             $('#' + tb.id).children().children("tr:last").replaceWith("");
//         });
//     }

//     function PraseBody() {
//         console.log(2)
//         $(".printbody").each(function (index, body) {
//             var ball = body.innerHTML;
//             $.each(data, function (key, val) {
//                 var reg = new RegExp("{" + key + "}", "g");//g,表示全部替换。
//                 ball = ball.replace(reg, val);
//             });
//             body.innerHTML = (ball);
//         });
//         $(".printbody").print();
//         $(".printbody").addClass("hidden");
        
//     }



// }