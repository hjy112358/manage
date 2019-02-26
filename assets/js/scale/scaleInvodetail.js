$(function () {
    var url = window.location.search;
    var fid = url.split("?")[1].split("=")[1]
    $.ajax({
        url: ajaxinvolistonedetail + fid,
        success: function (res) {
            console.log(res)
            if (res.Succeed) {
                var data = res.Data;
                $("#SalesInvoice_Currency").val(data.Currency_Nick)
                $("#SalesInvoice_Customer").val(data.Customer_Nick)
                var datetime=''
                if(data.SalesInvoice_DateTime){
                    datetime=data.SalesInvoice_DateTime.split(" ")[0]
                }
                $("#SalesInvoice_DateTime").val(datetime)
                var dealtime=''
                if(data.SalesInvoice_Deadline){
                    dealtime=data.SalesInvoice_Deadline.split(" ")[0]
                }
                $("#SalesInvoice_Deadline").val(dealtime)
                $("#SalesInvoice_ExRate").val(data.SalesInvoice_ExRate)
                $("#SalesInvoice_Name").val(data.SalesInvoice_Name)
                $("#SalesInvoice_TaxRate").val(data.SalesInvoice_TaxRate)
                $("#SalesInvoice_Total").val(data.SalesInvoice_Total)
                getcurr(data.SalesInvoice_Currency)
                getcus(data.SalesInvoice_Customer)
                getbill(data.SalesInvoice_Biller)
                tablerender(data.Details)
            }
        }
    })


     // 物料
     $.ajax({
        url: ajaxMater,
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
        type:"GET",
        url: ajaxMea,
        success: function (res) {
            console.log(res)
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
})
var materid = [], maternick = [],meaid=[],meanick=[]
function tablerender( data) {
    layui.use(['jquery', 'table'], function () {
        var $ = layui.$,
            table = layui.table;
        table.render({
            elem: '#dataTable'
            , toolbar: true
            , cols: [[
                { title: '序号', type: 'numbers' },
                { field: 'SalesInvoiceEntry_Material', title: '物料' ,templet:function(d){
                    var index = materid.indexOf(d.SalesInvoiceEntry_Material)
                    if (index == '-1') {
                        return ''
                    } else {
                        return maternick[index]
                    }
                }},
                // { field: 'StockBillEntry_Material', title: '客户料号', edit: 'text' },
                { field: 'SalesInvoiceEntry_Specifications', title: '规格型号'},
                { field: 'SalesInvoiceEntry_Unit', title: '单位' ,templet:function(d){
                    if(d.SalesInvoiceEntry_Unit){
                        var index1 = meaid.indexOf(d.SalesInvoiceEntry_Unit)
                        if (index1 == '-1') {
                            return d.SalesInvoiceEntry_Unit
                        } else {
                            return meanick[index1]
                        }
                    }else{
                        return ''
                    }
                    
                }},
                { field: 'SalesInvoiceEntry_BatchNo', title: '批号' },
                { field: 'SalesInvoiceEntry_Quantity', title: '数量' },
                { field: 'SalesInvoiceEntry_Price', title: '单价' },
                { field: 'SalesInvoiceEntry_TaxPrice', title: '含税单价' , templet: function (d) {
                    if (d.SalesInvoiceEntry_TaxPrice) {
                        var num = parseFloat(d.SalesInvoiceEntry_TaxPrice);
                        num = num.toFixed(2);
                    } else {
                        num = ''
                    }
                    return num
                }},
                { field: 'SalesInvoiceEntry_Amount', title: '金额' , templet: function (d) {
                    if (d.SalesInvoiceEntry_Amount) {
                        var num = parseFloat(d.SalesInvoiceEntry_Amount);
                        num = num.toFixed(2);
                    } else {
                        num = ''
                    }
                    return num
                }},
                { field: 'SalesInvoiceEntry_ExRate', title: '税率(%)' },
                { field: 'SalesInvoiceEntry_Tax', title: '税额' , templet: function (d) {   
                    if (d.SalesInvoiceEntry_Tax) {
                        var num = parseFloat(d.SalesInvoiceEntry_Tax);
                        num = num.toFixed(2);
                    } else {
                        num = ''
                    }
    
                    return num
                } },
                { field: 'total', title: '价税合计' , templet: function (d) {
                    if (d.total) {
                        var num = parseFloat(d.total);
                        num = num.toFixed(2);
                    } else {
                        num = ''
                    }
    
                    return num
                } },
                { field: 'SalesInvoiceEntry_Total', title: '开票金额' },
                // { field: 'FFetchDate', title: '源单单号'},
                { field: 'Remark', title: '备注', edit: 'text' }
                
            ]]
            , data: data
            , page: true
            , limits: [1000, 2000, 3000, 4000, 5000]
            , limit: 1000
        });
        return false;
    })
}
// 币别
function getcurr(id){
    $.ajax({
        type: "get",
        url: ajaxCurrency,
        success: function (res) {
            var isussecc = res.Succeed;
            if (isussecc) {
                var data = res.Data;
                for (var i = 0; i < data.length; i++) {
                    var datanow=data[i]
                    if (id == datanow.F_Id) {
                        $("#SalesInvoice_Currency").val(datanow.Currency_Nick)
                    }
                }
            } else {
                alert(res.Message)
            }
        }
    })
}

// 客户
function getcus(id){
    $.ajax({
        type: "get",
        url: ajaxCus,
        success: function (res) {
            var isussecc = res.Succeed;
            if (isussecc) {
                var data = res.Data;
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i];
                    if (id == datanow.F_Id) {
                        $("#SalesInvoice_Customer").val(datanow.Customer_Nick)
                    }
                }
            } else {
                alert(res.Message)
            }

        }
    })
}
// 制单人
function getbill(id){
    $.ajax({
        type: "get",
        url: ajaxUsr,
        success: function (res) {
            var isussecc = res.Succeed;
            if (isussecc) {
                var data = res.Data;
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i];
                    if (datanow.F_Id == id) {
                        $("#SalesInvoice_Biller").val(datanow.F_Id)
                        $("#SalesInvoice_Billername").val(datanow.User_Nick)
                    }
                }
               
            } else {
                alert(res.Message)
            }

        }
    })
}