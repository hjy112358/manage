var billid = [], billnick = [], departid=[],departnick=[]

// 渲染table
function tablerender(str, data) {
    layui.use(['jquery', 'table'], function () {
        layer = layui.layer;
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
                    //console.log(obj);
                    parent.getpurchapp(obj.data.F_Id)
                });
            }
        });
        return false;
    })
}


var istrue = 0, isclick
$(function () {
    var subindex = layer.load();
    // 制单人、申请人
    $.ajax({
        type: "get",
        url: ajaxUsr,
        success: function (res) {
            //console.log(res)
            var isussecc = res.Succeed;
            if (isussecc) {
                istrue++;
                var data = res.Data;
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i];
                    billid.push(datanow.F_Id)
                    billnick.push(datanow.User_Nick)   
                }
                isclick()
            } else {
                alert(res.Message)
            }
        }
    })
    // 部门
    $.ajax({
        type: "get",
        url: ajaxdepart,
        success: function (res) {
            var isussecc = res.Succeed;
            if (isussecc) {
                istrue++;
                var data = res.Data;
                for (var i = 0; i < data.length; i++) {
                    departid.push(data[i].F_Id)
                    departnick.push(data[i].Department_Nick)
                }
                isclick()
            } else {
                alert(res.Message)
            }
        }
    })
    $(".checklist").on("click", function () {
        var str = [
            { title: '序号', type: 'numbers', width: '80' },
            { field: 'PurchaseApply_Name', title: '单据编号', width: "150", align: "left" },
            {
                field: 'PurchaseApply_DateTime', title: '单据日期', width: "100", align: 'center', templet: function (d) {
                    if (d.PurchaseApply_DateTime) {
                        return d.PurchaseApply_DateTime.split(" ")[0]
                    }
                }
            },
            {
                field: 'PurchaseApply_Deadline', title: '交货日期', width: "100", align: 'center', templet: function (d) {
                    if (d.PurchaseApply_Deadline) {
                        return d.PurchaseApply_Deadline.split(" ")[0]
                    }
                }
            },
           
            {
                field: 'PurchaseApply_Status', title: '单据状态', align: 'center', width: "100",templet:function(d){
                    if(d.PurchaseApply_Status=='10000'){
                        return '已保存'
                    }else if(d.PurchaseApply_Status=='11100'){
                        return '审核中'
                    }else if(d.PurchaseApply_Status=='11500'){
                        return '已审核'
                    }else{
                        return ''
                    }
                }
            },
            
            
            {
                field: 'PurchaseApply_Biller', title: '制单人', width: '150', align: 'left', templet: function (d) {

                    var index1 = billid.indexOf(d.PurchaseApply_Biller)
                    if (index1 == '-1') {
                        return ''
                    } else {
                        return billnick[index1]
                    }
                }
            },
            {
                field: 'PurchaseApply_Employee', title: '申请人', width: '150', align: 'left', templet: function (d) {

                    var index3 = billid.indexOf(d.PurchaseApply_Employee)
                    if (index3 == '-1') {
                        return ''
                    } else {
                        return billnick[index3]
                    }
                }
            },
            {
                field: 'PurchaseApply_Department', title: '部门', width: '180', align: 'left', templet: function (d) {

                    var index2 = departid.indexOf(d.PurchaseApply_Department)
                    if (index2 == '-1') {
                        return ''
                    } else { 
                        return departnick[index2]
                    }
                }
            },
            {
                field: 'IsEnabled', title: '启用', align: 'center', width: "80", templet: function (d) {
                    if (d.IsEnabled) {
                        return "是"
                    } else {
                        return "否"
                    }
                }
            },
            { field: 'Remark', title: '备注', align: 'left', width: "200" },
            {
                field: 'F_Id', title: '操作', align: 'center', width: '100', templet: function (d) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-danger" onclick=delscale("' + d.F_Id + '")>删除</a>';
                }
            }
        ]
        $.ajax({
            type: "GET",
            async: false,
            url: purchaseapplylist,
            success: function (res) {
                var data = res.Data;
                console.log(data)
                var isussecc = res.Succeed;
                if (isussecc) {
                    layer.close(subindex)
                    tablerender(str, data);
                } else {
                    alert(res.Message)
                }
            }
        })

    })

    
    isclick = function () {
        if (istrue == 2) {
            $(".checklist").trigger("click")
        }

    }


    $(".add").on("click", function () {
        parent.newpurchapp()
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
        var token = $.cookie("token");
        $.ajax({
            type: "POST",
            async: false,
            url: purchaseDel,
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

