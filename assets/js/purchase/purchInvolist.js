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
        laydate = layui.laydate,
        upload = layui.uplaod
  
});

var userid=[],usernick=[];
$.ajax({
    type: "get",
    url: ajaxUsr,
    success: function (res) {
        var isussecc = res.Succeed;
        var data = res.Data;
        if (isussecc) {
            for (var i = 0; i < data.length; i++) {
                var datanow = data[i]
                userid.push(datanow.F_Id)
                usernick.push(datanow.User_Nick)
            }  
        } else {
            alert(res.Message)
        }
    }
})

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
                    parent.getpurchaseinvo(obj.data.F_Id)
                });
            }
        });
        return false;
    })
}


$(function () {
    $(".checklist").on("click", function () {
        var str = [
            { title: '序号', type: 'numbers' },
            { field: 'PurchaseInvoice_Name', title: '编号' ,width:150,align:"center"},
            { field: 'PurchaseInvoice_DateTime', title: '单据日期',width:80 ,align:"center",templet:function(d){
                var dete=''
                if(d.PurchaseInvoice_DateTime){
                    dete=d.PurchaseInvoice_DateTime.split(" ")[0]
                }
                return dete
            }},
            { field: 'Supplier_Nick', title: '供应商' ,width:150,align:"left"},
            { field: 'Currency_Nick', title: '币别' ,width:80,align:"center"},
            { field: 'PurchaseInvoice_ExRate', title: '汇率(%)',width:80 ,align:"right"},
            { field: 'PurchaseInvoice_Total', title: '实际开票',width:100 ,align:"right"},
            { field: 'PurchaseInvoice_Deadline', title: '付款日期',width:80 ,align:"center",templet:function(d){
                var dealine=''
                if(d.PurchaseInvoice_Deadline){
                    dealine=d.PurchaseInvoice_Deadline.split(" ")[0]
                }
                return dealine
            }},
            { field: 'User_Nick', title: '业务员',width:100 ,align:"left"},
            {
                field: 'F_Id', title: '操作', align: 'center',width:80, templet: function (d) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-danger" onclick=delscale("' + d.F_Id + '")>删除</a>';
                }
            }
        ]
        $.ajax({
            url: purchaselist,
            success: function (res) {
                var isussecc = res.Succeed;
                if (isussecc) {
                    var data = res.Data;
                    tablerender(str, data);
                } else {
                    alert(res.Message)
                }
            }
        })
    })

 
    $(".checklist").trigger("click")

    $(".add").on("click", function () {
        parent.newpurchaseinvo();
    })

})


function renderForm() {
    layui.use('form', function () {
        var form = layui.form;
        form.render()
    });
}

// 删除
function delscale(id) {
    var index = layer.confirm('确认删除？', {
        btn: ['确定', '取消'] //按钮
    }, function () {
        $.ajax({
            type: "POST",
            url: Delpurchase,
            data: {
                F_Id: id
            },
            success: function (res) {
                var data = res.Data;
                var isussecc = res.Succeed;
                if (isussecc) {
                    layer.close(index)
                    $(".checklist").trigger("click");
                } else {
                    layer.close(index)
                    alert(res.Message)
                }
            }
        })
    }); 
}

