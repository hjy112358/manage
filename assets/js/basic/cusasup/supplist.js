// 渲染table
function tablerender(str, data) {
    layui.use(['jquery', 'table'], function () {
        var $ = layui.$,
            table = layui.table;
        table.render({
            elem: '#dataTable'
            , toolbar: true
            , cols: [str]
            , data: data
            , page: true
            , limits: [1000, 2000, 3000, 4000, 5000]
            , limit: 1000
            , done: function () {
                table.on('rowDouble(dataTable)', function (obj) {
                    console.log(obj);
                    // parent.getscale(obj.data.SalesOrder_Name, obj.data.F_Id)
                });
            }
        });
        return false;
    })
}
var token = $.cookie("token");

$(function () {
   
    var islist = false;
//  查询
    $(".checklist").on("click", function () {
        var str = [
            { title: '序号', type: 'numbers' },
            { field: 'Supplier_Nick', title: '客户名称'},
            { field: 'Supplier_Name', title: '客户代码'},
            {
                field: 'F_Id', title: '操作', align: 'center', templet: function (d) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-danger" onclick=delscale("' + d.F_Id + '")>删除</a>';
                }
            }
        ]
        $.ajax({
            type: "GET",
            async: false,
            url: ajaxURl + "/api/PSIBase/Supplier/GetList?keyword=0&PageSize=3&PageIndex=1&Total=&PageCount=",
            success: function (res) {
                var data = res.Data;
                console.log(data)
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

    $(".add").on("click", function () {
        parent.newsupp();
    })
})


function renderForm() {
    layui.use('form', function () {
        var form = layui.form;
        form.render()
    });
}

// 删除
// function delscale(id) {
//     var index = layer.confirm('确认删除？', {
//         btn: ['确定', '取消'] //按钮
//     }, function () {
//         var token = $.cookie("token");
//         $.ajax({
//             type: "POST",
//             async: false,
//             url: ajaxURl + "/api/PSIBase/Supplier/Remove",
//             data: {
//                 F_Id: id
//             },
//             success: function (res) {
//                 var data = res.Data;
//                 console.log(data)
//                 var isussecc = res.Succeed;
//                 if (isussecc) {
//                     layer.close(index)
//                     $(".checklist").trigger("click");
//                 } else {
//                     layer.close(index)
//                     alert(res.Message)
//                 }
//             }
//         })
//     }); 
// }

