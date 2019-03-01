var billid = [], billnick = [],curryid=[],currynick=[],suppid=[],suppnick=[]
var tableIns,reloadtable;
// 渲染table
function tablerender(str, data) {
    layui.use(['jquery', 'table'], function () {
        layer = layui.layer;
        var $ = layui.$,
            table = layui.table;
            layTableId = "layTable";
            tableIns = table.render({
            elem: '#dataTable'
            , toolbar: true
            , id: layTableId
            , cols: [str]
            , data: data
            , page: true
            , limits: [1000, 2000, 3000, 4000, 5000]
            , limit: 1000
            , done: function () {
                table.on('rowDouble(dataTable)', function (obj) {
                    //console.log(obj);
                    parent.getpurwork(obj.data.F_Id)
                });
            }
        });

        reloadtable=function(){
            var oldData = table.cache[layTableId];
            tableIns.reload({
                data: oldData,
                limit: oldData.length
            });
        }
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
   
     // 币别
     $.ajax({
        type: "get",
        url: ajaxCurrency,
        success: function (res) {
            var isussecc = res.Succeed;
            if (isussecc) { 
                istrue++;
                var data = res.Data;
                for (var i = 0; i < data.length; i++) {
                    curryid.push(data[i].F_Id)  
                    currynick.push(data[i].Currency_Nick)
                }
                isclick()
            } else {
                alert(data.Message)
            }
        }
    })
    // 供应商
    $.ajax({
        type: "get",
        url: ajaxsupplist,
        success: function (res) {
            console.log(res)
            var isussecc = res.Succeed;
            if (isussecc) {
                istrue++;
                var data = res.Data;
                for (var i = 0; i < data.length; i++) {
                    suppid.push(data[i].F_Id)  
                    suppnick.push(data[i].Supplier_Nick)
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
            { field: 'PurchaseOrder_Name', title: '单据编号', width: "150", align: "center" },
            {
                field: 'PurchaseOrder_DateTime', title: '单据日期', width: "100", align: 'center', templet: function (d) {
                    if (d.PurchaseOrder_DateTime) {
                        return d.PurchaseOrder_DateTime.split(" ")[0]
                    }else{
                        return ''
                    }
                }
            },
            {
                field: 'PurchaseOrder_Deadline', title: '交货日期', width: "100", align: 'center', templet: function (d) {
                    if (d.PurchaseOrder_Deadline) {
                        return d.PurchaseOrder_Deadline.split(" ")[0]
                    }else{
                        return ''
                    }
                }
            },

            {
                field: 'PurchaseOrder_Status', title: '单据状态', align: 'center', width: "100", templet: function (d) {
                    if (d.PurchaseOrder_Status == '10000') {
                        return '已保存'
                    } else if (d.PurchaseOrder_Status == '11100') {
                        return '审核中'
                    } else if (d.PurchaseOrder_Status == '11500') {
                        return '已审核'
                    } else {
                        return ''
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
            {
                field: 'PurchaseOrder_Currency', title: '币别', width: '150', align: 'center',templet:function(d){
                    if (d.PurchaseOrder_Currency) {
                        var index = curryid.indexOf(d.PurchaseOrder_Currency)
                        if (index == '-1') {
                            return ''
                        } else {
                            return currynick[index]
                        }
                    } else {
                        return ''
                    }
            }},
            { field: 'PurchaseOrder_TaxRate', title: '税率', width: '80', align: 'center'},
            { field: 'PurchaseOrder_ExRate', title: '汇率', width: '80', align: 'center'},
            {
                field: 'PurchaseOrder_Biller', title: '制单人', width: '150', align: 'center',templet:function(d){
                    if (d.PurchaseOrder_Biller) {
                        var index1 = billid.indexOf(d.PurchaseOrder_Biller)
                        if (index1 == '-1') {
                            return ''
                        } else {
                            return billnick[index1]
                        }
                    } else {
                        return ''
                    }
            }},
            {
                field: 'PurchaseOrder_Employee', title: '业务员', width: '150', align: 'center',templet:function(d){
                    if (d.PurchaseOrder_Employee) {
                        var index2 = billid.indexOf(d.PurchaseOrder_Employee)
                        if (index2 == '-1') {
                            return ''
                        } else {
                            return billnick[index2]
                        }
                    } else {
                        return ''
                    }
            }},
            {
                field: 'PurchaseOrder_Supplier', title: '供应商', width: '180', align: 'center',templet:function(d){
                    if (d.PurchaseOrder_Supplier) {
                        var index3 = suppid.indexOf(d.PurchaseOrder_Supplier)
                        if (index3 == '-1') {
                            return ''
                        } else {
                            return suppnick[index3]
                        }
                    } else {
                        return ''
                    }
            }},
            { field: 'Remark', title: '备注', align: 'center', width: "200" },
            {
                field: 'F_Id', title: '操作', align: 'center', width: '100', templet: function (d) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-danger" onclick=delscale("' + d.F_Id + '")>删除</a>';
                }
            }
        ]
        $.ajax({
            type: "GET",
            async: false,
            url: ajaxchaseorderlist,
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
        if (istrue == 3) {
            $(".checklist").trigger("click")
        }

    }


    $(".add").on("click", function () {
        parent.newpurwork()
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
            url: purchaseOrderListDel,
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

