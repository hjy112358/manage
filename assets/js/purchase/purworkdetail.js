$(function () {
    var url = window.location.search;
    var fid = url.split("?")[1].split("=")[1]
    $.ajax({
        url: ajaxpurchaseone + fid,
        success: function (res) {
            console.log(res)
            if (res.Succeed) {
                var data = res.Data;
                $("#PurchaseOrder_ExRate").val(data.PurchaseOrder_ExRate)
                $("#PurchaseOrder_Name").val(data.PurchaseOrder_Name)
                $("#PurchaseOrder_TaxRate").val(data.PurchaseOrder_TaxRate)
                var datetime=""
                if(data.PurchaseOrder_DateTime){
                    datetime=data.PurchaseOrder_DateTime.split(" ")[0]
                }
                $("#PurchaseOrder_DateTime").val(datetime)
                var deadime=""
                if(data.PurchaseOrder_Deadline){
                    deadime=data.PurchaseOrder_Deadline.split(" ")[0]
                }
                $("#PurchaseOrder_Deadline").val(deadime)
                getbillEm(data.PurchaseOrder_Biller, data.PurchaseOrder_Employee)
                getstatus(data.PurchaseOrder_Status)
                getsupplier(data.PurchaseOrder_Supplier)
                gettype(data.PurchaseOrder_Type)
                getmat(data.Details,data.PurchaseOrder_Currency)

            }
        }
    })

    $(".changeStatus").on("click",function(){
        var href = '/views/purchase/purworkchange.html?fid=' + fid ;
        window.location.replace(href)
    })
     // 新增
     $(".add").on("click", function () {
        var href = '/views/purchase/purchwork.html';
        window.location.replace(href)
    })
})

var materid = [], maternick = [], matername = []
var measureid=[],measurnick=[],materfid=[]
var currfid=[],currnick=[];
// 渲染table
function tablerender(data) {
    layui.use(['jquery', 'table'], function () {
        layer = layui.layer;
        var $ = layui.$,
            table = layui.table;
        layTableId = "layTable";
        tableIns = table.render({
            elem: '#dataTable'
            , toolbar: true
            , id: layTableId
            , cols: [[
                { title: '序号', type: 'numbers' },
                {
                    field: 'PurchaseOrderEntry_Material', title: '物料代码', width: '120', templet: function (d) {
                        if (d.PurchaseOrderEntry_Material) {
                            var index = materid.indexOf(d.PurchaseOrderEntry_Material)
                            if (index == '-1') {
                                return ''
                            } else {
                                return matername[index]
                            }
                        } else {
                            return ''
                        }
                    }
                },
                {
                    field: 'PurchaseOrderEntry_Material', title: '物料名称', width: '200', templet: function (d) {
                        if (d.PurchaseOrderEntry_Material) {
                            var index1 = materid.indexOf(d.PurchaseOrderEntry_Material)
                            if (index1 == '-1') {
                                return ''
                            } else {
                                return maternick[index1]
                            }
                        } else {
                            return ''
                        }
                    }
                },
                { field: 'PurchaseOrderEntry_Specifications', title: '规格' },
                { field: 'PurchaseOrderEntry_Unit', title: '单位' },
                { field: 'PurchaseOrderEntry_Price', title: '价格', edit: 'text', width: '100' },
                { field: 'PurchaseOrderEntry_Quantity', title: '数量', width: '100' },
                { field: 'PurchaseOrderEntry_Amount', title: '总额', width: '100' },
                {
                    field: 'PurchaseOrderEntry_Deadline', title: '交货日期', width: '100', align: "center", templet: function (d) {
                        if (d.PurchaseOrderEntry_Deadline) {
                            return d.PurchaseOrderEntry_Deadline.split(" ")[0]
                        }else{
                            return ''
                        }
                    }
                },
                { field: 'PurchaseOrderEntry_Currency', title: '币别', width: '100', templet: function (d) {
                    if (d.PurchaseOrderEntry_Currency) {
                        var index2 = currfid.indexOf(d.PurchaseOrderEntry_Currency)
                        if (index2 == '-1') {
                            return ''
                        } else {
                            return currnick[index2]
                        }
                    } else {
                        return ''
                    }
                } },
                { field: 'PurchaseOrderEntry_TaxRate', title: '税率' },
                { field: 'PurchaseOrderEntry_ExRate', title: '汇率' },
                { field: 'Rmark', title: '备注' }
            ]]
            , data: data
            , page: true
            , limits: [1000, 2000, 3000, 4000, 5000]
            , limit: 1000
            , done: function () {
                table.on('rowDouble(dataTable)', function (obj) {
                    //console.log(obj);
                    // parent.getpurwork(obj.data.F_Id)
                });
            }
        });

        // reloadtable=function(){
        //     var oldData = table.cache[layTableId];
        //     tableIns.reload({
        //         data: oldData,
        //         limit: oldData.length
        //     });
        // }
        

        return false;
    })
}

// 制单人、业务员
function getbillEm(bill, em) {
    $.ajax({
        type: "get",
        url: ajaxUsr,
        success: function (res) {
            //console.log(res)
            var isussecc = res.Succeed;
            if (isussecc) {
                var data = res.Data;
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i];
                    var datanow = data[i]
                    if (datanow.F_Id == bill) {
                        $("#PurchaseOrder_Biller").val(datanow.User_Nick)
                    }
                    if (datanow.F_Id == em) {
                        $("#PurchaseOrder_Employee").val(datanow.User_Nick)
                    }
                }
            } else {
                alert(res.Message)
            }
        }
    })
}


// 状态
function getstatus(id) {
    if (id == '10000') {
        $("#PurchaseOrder_Status").val('已保存')
    } else if (id == '11100') {
        $("#PurchaseOrder_Status").val('审核中')
    } else if (id == '11500') {
        $("#PurchaseOrder_Status").val('已审核')
    } else {
        $("#PurchaseOrder_Status").val('')
    }
}

// 供应商
function getsupplier(id) {
    $.ajax({
        type: "get",
        url: ajaxsupplist,
        success: function (res) {
            var isussecc = res.Succeed;
            if (isussecc) {
                var data = res.Data;
                for (var i = 0; i < data.length; i++) {
                    var suppnow = data[i]
                    if (suppnow.F_Id == id) {
                        $("#PurchaseOrder_Supplier").val(suppnow.Supplier_Nick)
                    }
                }
            } else {
                alert(res.Message)
            }

        }
    })
}

// 类型
function gettype(id) {
    $.ajax({
        type: "get",
        url: ajaxchasetype,
        success: function (res) {
            var isussecc = res.Succeed;
            if (isussecc) {
                var data = res.Data.Details;
                for (var i = 0; i < data.length; i++) {
                    var typenow = data[i]
                    if (typenow.F_Id == id) {
                        $("#PurchaseOrder_Type").val(typenow.DictionaryItem_Nick)
                    }
                }
            } else {
                alert(res.Message)
            }
        }
    })
}

function getmat(tabledata,currid) {
    // 物料
    $.ajax({
        url: ajaxMater,
        async:false,
        success: function (res) {
            var data = res.Data;
            var isussecc = res.Succeed;
            console.log(data)
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    materid.push(data[i].F_Id)
                    maternick.push(data[i].Material_Nick)
                    matername.push(data[i].Material_Name)
                }
                
            } else {
                alert(res.Message)
            }
        }
    })

    // 计量单位  
    $.ajax({
        url: ajaxMea,
        async:false,
        success: function (res) {
            var data = res.Data;
            var isussecc = res.Succeed;
            console.log(data)
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    measureid.push(data[i].Measure_Manufacture) 
                    measurnick.push(data[i].Measure_Nick)
                    materfid.push(data[i].F_Id)
                }
                
            }else{
                alert(res.Message)
            }
        }
    })

    // 币别
    $.ajax({
        type: "get",
        async:false,
        url: ajaxCurrency,
        success: function (res) {
            var isussecc = res.Succeed;
            if (isussecc) {
                var data = res.Data;
                for (var i = 0; i < data.length; i++) {
                    var currnow = data[i]
                    if (currnow.F_Id == currid) {
                        currfid.push(currnow.F_Id) 
                        currnick.push(currnow.Currency_Nick)
                        $("#PurchaseOrder_Currency").val(currnow.Currency_Nick)
                    }
                }
            } else {
                alert(data.Message)
            }
        }
    })

    tablerender(tabledata)
}