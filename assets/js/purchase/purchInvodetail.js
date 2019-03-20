var suppernick = [],
    supperid = [],
    materid = [],
    maternick = [],
    meaid = [],
    meanick = [],
    currname = [],
    currnick = [],
    currnamshow = [],
    userid = [],
    usernick = []
var layer;
layui.use(['layer'], function () {
    layer = layui.layer
});
var layerindex = layer.load()
$(function () {
    var url = window.location.search;
    var fid = url.split("?")[1].split("=")[1]
    // 物料
    $.ajax({
        url: ajaxMater,
        ansyc: false,
        success: function (res) {
            var data = res.Data;
            var isussecc = res.Succeed;
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    materid.push(data[i].F_Id)
                    maternick.push(data[i].Material_Nick)
                }
            }
        }
    })
    // 计量单位
    $.ajax({
        type: "GET",
        url: ajaxMea,
        ansyc: false,
        success: function (res) {
            var data = res.Data;
            var isussecc = res.Succeed;
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    meaid.push(data[i].Measure_Manufacture)
                    meanick.push(data[i].Measure_Nick)
                }
            } else {
                alert(data.Message)
            }
        }
    })

    $.ajax({
        type: "GET",
        url: purchasedetail + fid,
        success: function (res) {
            if (res.Succeed) {
                var data = res.Data;
                getcurrey(data.PurchaseInvoice_Currency, data.Details)
                getsupper(data.PurchaseInvoice_Supplier)
                getbill(data.PurchaseInvoice_Biller)
                var datetime = ""
                if (data.PurchaseInvoice_DateTime) {
                    datetime = data.PurchaseInvoice_DateTime.split(" ")[0]
                }
                $("#PurchaseInvoice_DateTime").val(datetime)
                var deadline = ""
                if (data.PurchaseInvoice_Deadline) {
                    deadline = data.PurchaseInvoice_Deadline.split(" ")[0]
                }
                $("#PurchaseInvoice_Deadline").val(deadline)
                $("#PurchaseInvoice_ExRate").val(data.PurchaseInvoice_ExRate)
                $("#PurchaseInvoice_Name").val(data.PurchaseInvoice_Name)
                $("#PurchaseInvoice_Total").val(data.PurchaseInvoice_Total)
                $("#Remark").val(data.Remark)

                setInterval(function () {
                    layer.close(layerindex)
                }, 1500)
            } else {
                alert(res.Message)
            }
        }
    })

    $(".changeStatus").on("click", function () {
        var href = '/views/purchase/purchInvochange.html?fid=' + fid;
        window.location.replace(href)
    })

    $(".add").on("click", function () {
        parent.newpurchaseinvo();
    })

})
// 币别
function getcurrey(id, details) {
    $.ajax({
        type: "get",
        ansyc: false,
        url: ajaxCurrency,
        success: function (res) {
            var isussecc = res.Succeed;
            if (isussecc) {
                var data = res.Data;
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i]
                    currname.push(datanow.F_Id)
                    currnick.push(datanow.Currency_Nick)
                    if (datanow.F_Id == id) {
                        $("#PurchaseInvoice_Currency").val(datanow.Currency_Nick)
                    }
                }
                tablerender(details)
            } else {
                alert(data.Message)
            }
        }
    })
}
// 供应商
function getsupper(id) {
    $.ajax({
        type: "get",
        ansyc: false,
        url: ajaxSupplier,
        success: function (res) {
            var isussecc = res.Succeed;
            var data = res.Data;
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i]
                    if (datanow.F_Id == id) {
                        $("#PurchaseInvoice_Supplier").val(datanow.Supplier_Nick)
                    }
                }
            } else {
                alert(res.Message)
            }

        }
    })
}
// 制单人
function getbill(id) {
    $.ajax({
        type: "get",
        url: ajaxUsr,
        ansyc: false,
        success: function (res) {
            var isussecc = res.Succeed;
            var data = res.Data;
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i]
                    if (datanow.F_Id == id) {
                        $("#PurchaseInvoice_Billername").val(datanow.User_Nick)
                    }
                }
            } else {
                alert(res.Message)
            }
        }
    })
}

function tablerender(data) {
    layui.use(['jquery', 'table'], function () {
        var $ = layui.$,
            table = layui.table;
        table.render({
            elem: '#dataTable',
            toolbar: true,
            cols: [
                [{
                        title: '序号',
                        type: 'numbers'
                    },
                    {
                        field: 'PurchaseInvoiceEntry_Material',
                        title: '物料',
                        width: 150,
                        align: "left",
                        templet: function (d) {
                            var index = materid.indexOf(d.PurchaseInvoiceEntry_Material)
                            if (index == '-1') {
                                return ''
                            } else {
                                return maternick[index]
                            }
                        }
                    },
                    {
                        field: 'PurchaseInvoiceEntry_Specifications',
                        title: '规格型号',
                        align: "left",
                        width: 100
                    },
                    {
                        field: 'PurchaseInvoiceEntry_Unit',
                        title: '单位',
                        align: "center",
                        width: 100,
                        templet: function (d) {
                            if (d.PurchaseInvoiceEntry_Unit) {
                                var index1 = meaid.indexOf(d.PurchaseInvoiceEntry_Unit)
                                if (index1 == '-1') {
                                    return d.PurchaseInvoiceEntry_Unit
                                } else {
                                    return meanick[index1]
                                }
                            } else {
                                return ''
                            }
                        }
                    },
                    {
                        field: 'PurchaseInvoiceEntry_Currency',
                        title: '币别',
                        width: 100,
                        align: "center",
                        templet: function (d) {
                            var index = currname.indexOf(d.PurchaseInvoiceEntry_Currency)
                            if (index == '-1') {
                                return ''
                            } else {
                                return currnick[index]
                            }
                        }
                    },
                    {
                        field: 'PurchaseInvoiceEntry_BatchNo',
                        title: '批号',
                        width: 100,
                        align: "left"
                    },
                    {
                        field: 'PurchaseInvoiceEntry_Quantity',
                        title: '数量',
                        width: 100,
                        align: "right"
                    },
                    {
                        field: 'PurchaseInvoiceEntry_Price',
                        title: '单价',
                        width: 100,
                        align: "right"
                    },
                    {
                        field: 'PurchaseInvoiceEntry_TaxPrice',
                        title: '含税单价',
                        width: 100,
                        align: "right",
                        templet: function (d) {
                            if (d.PurchaseInvoiceEntry_TaxPrice) {
                                var num = parseFloat(d.PurchaseInvoiceEntry_TaxPrice);
                                num = num.toFixed(2);
                            } else {
                                num = ''
                            }
                            return num
                        }
                    },
                    {
                        field: 'PurchaseInvoiceEntry_Amount',
                        title: '入库金额',
                        width: 100,
                        align: "right",
                        templet: function (d) {
                            if (d.PurchaseInvoiceEntry_Amount) {
                                var num = parseFloat(d.PurchaseInvoiceEntry_Amount);
                                num = num.toFixed(2);
                            } else {
                                num = ''
                            }
                            return num
                        }
                    },
                    {
                        field: 'PurchaseInvoiceEntry_ExRate',
                        title: '汇率(%)',
                        width: 80,
                        align: "right"
                    },
                    {
                        field: 'PurchaseInvoiceEntry_TaxRate',
                        title: '增值税率',
                        width: 80,
                        align: "right"
                    },
                    {
                        field: 'PurchaseInvoiceEntry_Tax',
                        title: '税额',
                        width: 100,
                        align: "right",
                        templet: function (d) {
                            if (d.PurchaseInvoiceEntry_Tax) {
                                var num = parseFloat(d.PurchaseInvoiceEntry_Tax);
                                num = num.toFixed(2);
                            } else {
                                num = ''
                            }
                            return num
                        }
                    },
                    {
                        field: 'total',
                        title: '价税合计',
                        width: 100,
                        align: "right",
                        templet: function (d) {
                            if (d.total) {
                                var num = parseFloat(d.total);
                                num = num.toFixed(2);
                            } else {
                                num = ''
                            }

                            return num
                        }
                    },
                    {
                        field: 'PurchaseInvoiceEntry_Total',
                        title: '实际开票',
                        width: 100,
                        align: "right"
                    },
                    {
                        field: 'Remark',
                        title: '备注',
                        edit: 'text',
                        width: 150,
                        align: "left"
                    }

                ]
            ],
            data: data,
            page: true,
            limits: [1000, 2000, 3000, 4000, 5000],
            limit: 1000
        });
        return false;
    })
}