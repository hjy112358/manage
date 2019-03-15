$(function(){
    var url=window.location.search;
    var fid=url.split("?")[1].split("=")[1];
    $.ajax({
        url:ajaxstockbillone+fid,
        success:function(res){
            console.log(res)
            if(res.Succeed){
                var data=res.Data
                $("#StockBill_Name").val(data.StockBill_Name)
                getbill(data.StockBill_Sender,data.StockBill_Biller)
                getdepart(data.StockBill_Receiver)
                var datetime='';
                if(data.StockBill_DateTime){
                    datetime=data.StockBill_DateTime.split(" ")[0]
                }
                $("#StockBill_DateTime").val(datetime)
                $("#Rmark").val(data.Rmark)
                tablerender(data.Details)
                
            }
        }
    })
    

    // 变更
    $(".changeStatus").on("click", function () {
        var href = '/views/warehouse/scalestockchange.html?fid=' + fid ;
        window.location.replace(href)
    })

})
var materid = [], maternick = [],meaid=[],meanick=[],matername=[],stockname=[],stockid=[]
function tablerender( data) {
    layui.use(['jquery', 'table'], function () {
        var $ = layui.$,
            table = layui.table;
            tableIns=table.render({
            elem: '#dataTable'
            , toolbar: true
            ,id:"table"
            , cols: [[
                { title: '序号', type: 'numbers' },
                {
                    field: '', title: '物料代码', templet: function (d) {
                        if (d.StockBillEntry_Material) {
                            var index = materid.indexOf(d.StockBillEntry_Material)
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
                    field: '', title: '物料名称', templet: function (d) {
                        if (d.StockBillEntry_Material) {
                            var index1 = materid.indexOf(d.StockBillEntry_Material)
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
                { field: 'StockBillEntry_Specifications', title: '规格型号' },
                { field: 'StockBillEntry_Unit', title: '计量单位' },
                {
                    field: 'StockBillEntry_BatchNo', title: '批号'
                },
                { field: 'StockBillEntry_Price', title: '价格' },
                { field: 'quatity', title: '应发数量' },
                { field: 'StockBillEntry_Quantity', title: '实发数量' },
                { field: 'StockBillEntry_Amount', title: '总额'},
                { field: 'StockBillEntry_Stock', title: '仓库', templet: function (d) {
                    if (d.StockBillEntry_Stock) {
                        var index = stockid.indexOf(d.StockBillEntry_Stock)
                        if (index == '-1') {
                            return ''
                        } else {
                            return stockname[index]
                        }
                    } else {
                        return ''
                    }
                }},
                { field: 'Rmark', title: '备注' }
                
            ]]
            , data: data
            , page: true
            , limits: [1000, 2000, 3000, 4000, 5000]
            , limit: 1000
        });

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
                        matername.push(data[i].Material_Name)
                    }

                }else{
                    alert(res.Message)
                }
                var oldData = table.cache["table"];
                tableIns.reload({
                    data: oldData,
                    limit: oldData.length
                });
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
                var oldData = table.cache["table"];
                tableIns.reload({
                    data: oldData,
                    limit: oldData.length
                });
            }
        })
        // 仓库
        $.ajax({
            url:ajaxstocklist,
            success:function(res){
                console.log(res)
                if(res.Succeed){
                    var data=res.Data
                    for(var i=0;i<data.length;i++){
                        stockid.push(data[i].F_Id) 
                        stockname.push(data[i].Stock_Nick)
                    }
                }
                var oldData = table.cache["table"];
                tableIns.reload({
                    data: oldData,
                    limit: oldData.length
                });
            }
        })

        return false;
    })
}

// 制单人
function getbill(sender,bill){
    $.ajax({
        type: "get",
        url: ajaxUsr,
        success: function (res) {
            var isussecc = res.Succeed;
            if (isussecc) {
                var data = res.Data;
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i];
                    if (datanow.F_Id == bill) {
                        $("#StockBill_Biller").val(datanow.User_Nick)
                    }
                    if(datanow.F_Id == sender){
                        $("#StockBill_Sender").val(datanow.User_Nick)
                    }
                }
               
            } else {
                alert(res.Message)
            }

        }
    })
}

// 部门
function getdepart(id){
    $.ajax({
        type: "get",
        url: ajaxdepart,
        success: function (res) {
            console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data;
            if (isussecc) {
               
                for (var i = 0; i < data.length; i++) {
                    var datanow=data[i]
                    if(datanow.F_Id==id){
                        $("#StockBill_Department").val(datanow.Department_Nick)
                    }
                }
            } else {
                alert(res.Message)
            }

        }
    })
}