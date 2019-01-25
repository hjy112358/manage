// 时间
var myDate = new Date();
var nowY = myDate.getFullYear();
var nowM = myDate.getMonth() + 1;
var nowD = myDate.getDate();
var tody = nowY + "-" + (nowM < 10 ? "0" + nowM : nowM) + "-" + (nowD < 10 ? "0" + nowD : nowD);
layui.use(['jquery', 'table', 'layer', "form", "layedit", "laydate"], function () {
    var $ = layui.$;
    table = layui.table,
        form = layui.form,
        layer = layui.layer,
        layedit = layui.layedit,
        laydate = layui.laydate,
        upload = layui.uplaod,
        element = layui.element;
    //日期
    laydate.render({
        elem: '#date',
        value: tody,
        isInitValue: true,
        btns: ['now', 'confirm']
    })
    //日期
    laydate.render({
        elem: '#recdate',
        value: tody,
        isInitValue: true,
        btns: ['now', 'confirm']
    });
});



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
                    parent.getproduct(obj.data.F_Id)
                });
            }
        });
        return false;
    })
}


$(function () {

    
    var islist = false;
  

    $(".checklist").on("click", function () {
        var str = [
            { title: '序号', type: 'numbers', width: '3%' },
            { field: 'Assign_Name', title: '单据编号', width: "5%", align: "right" },
            { field: 'Assign_DateTime', title: '单据日期', width: "12%", align: 'center'},
            { field: 'Assign_Material', title: '物料代码', width: "5%", align: "right" },
            { field: 'Assign_Material', title: '物料名称', width: "5%", align: "right" },
            {field: 'Assign_Specifications', title: '规格', align: 'center', width: "5%"},
            {field: 'Assign_Unit', title: '单位', align: 'center', width: "5%"},
            { field: 'Assign_Quantity', title: '数量', width: "5%"},            
            {field: 'Assign_Deadline', title: '计划完工日期', width: '5%'},
            {field: 'Assign_StartTime', title: '开工日期', align: 'center', width: "5%"},
            {field: 'Assign_Status', title: '单据状态', align: 'center', width: "5%"},
            {field: 'Assign_Type', title: '工单类型', align: 'center', width: "5%"},
            {field: 'IsEnabled', title: '启用', align: 'center', width: "5%"},
            {field: 'Remark', title: '备注', align: 'center', width: "5%"},
            { field: 'Assign_BillOfMaterial', title: 'BOM', width: '5%' },     
            { field: 'Assign_Craft', title: '工艺路线', width: '15%' },      
            { field: 'Assign_Customer', title: '客户', width: "8%" },
            { field: 'Assign_Project', title: '项目', width: "5%" },
            { field: 'Assign_Biller', title: '制单人', width: '12%' },
            {
                field: 'F_Id', title: '操作', align: 'center', templet: function (d) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-danger" onclick=delscale("' + d.F_Id + '")>删除</a>';
                }
            }
        ]
        $.ajax({
            type: "GET",
            async: false,
            url: ajaxURl + "/Api/Manufacture/Assign/GetList?keyword=",
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


    $(".add").on("click",function(){
        parent.newproduct()
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
//             url: ajaxURl + "/Api/PSISales/SalesOrder/Delete",
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

