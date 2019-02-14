$(function(){
    var url=window.location.search;
    var fid=url.split("?")[1].split("=")[1]
    $.ajax({
        url:ajaxstockbillone+fid,
        success:function(res){
            console.log(res)
            if(res.Succeed){
                var data=res.Data
                $.each(data.Details,function(i,v){
                    var index = measurnick.indexOf(v.AssignEntry_Unit)
                    if (index != '-1') {
                        v.StockBillEntry_Unit=measureid[index]
                        v.unit=measurnick[index]
                    } 
                })
                tablerender(data.Details)
                getdepart(data.StockBill_Sender)
                var time=data.StockBill_DateTime
                if(time){
                    time=time.split(" ")[0]
                }
                $("#date").val(time)
                $("#StockBill_Name").val(data.StockBill_Name)
                $("#Rmark").val(data.Rmark)
                getper(data.StockBill_Biller,data.StockBill_Receiver)
            }else{
                alert(res.Message)
            }
        }
    })

// 变更
    $(".change").on("click", function () {
        var href = '/views/product/productprochange.html?fid=' + fid ;
        window.location.replace(href)
    })
    
    // 新增
    $(".add").on("click", function () {
        var href = '/views/product/productpro.html';
        window.location.replace(href)
    })

})
var materid=[],maternick=[],matername=[],stockid=[],stocknick=[], measureid=[],measurnick=[]
// 物料
$.ajax({
    url: ajaxMater,
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
        }
    }
})
// 计量单位
$.ajax({
    url: ajaxMea,
    success: function (res) {
        var data = res.Data;
        var isussecc = res.Succeed;
        console.log(data)
        if (isussecc) {
            for (var i = 0; i < data.length; i++) {
                measureid.push(data[i].Measure_Manufacture)  
                measurnick.push(data[i].Measure_Nick) 
            }
        }
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
                stocknick.push(data[i].Stock_Nick)
            }
        }
    }
})
// 制单人/发料人
function getper(biller,receiver){
    $.ajax({
        type: "get",
        url: ajaxUsr,
        success: function (res) {
            console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data;
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i]
                    if (datanow.F_Id == biller) {
                        $("#StockBill_Billername").val(datanow.User_Nick)
                    }
                    if(datanow.F_Id == receiver){
                        $("#StockBill_Receiver").val(datanow.User_Nick)
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
            var isussecc = res.Succeed;
            var data =res.Data;
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i]
                    if (datanow.F_Id == id) {
                        $("#StockBill_Sender").val(datanow.Department_Nick)
                    }
                }
            } else {
                alert(res.Message)
            }
        }
    })
}

// 渲染table
function tablerender(data) {
    layui.use(['jquery', 'table'], function () {
        var $ = layui.$,
            table = layui.table;
        table.render({
            elem: '#dataTable'
            , toolbar: true
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
                { field: 'unit', title: '计量单位',templet:function(d){
                    if (d.StockBillEntry_Unit) {
                        var index2 = measureid.indexOf(d.StockBillEntry_Unit)
                        if (index2 == '-1') {
                            return ''
                        } else {
                            return measurnick[index2]
                        }
                    } else {
                        return ''
                    }
                } },
                {
                    field: 'StockBillEntry_BatchNo', title: '批号'
                },
                { field: 'StockBillEntry_Price', title: '价格', edit: 'text'  },
                { field: 'quatity', title: '应发数量' },
                { field: 'StockBillEntry_Quantity', title: '实发数量', edit: 'text' },
                { field: 'StockBillEntry_Amount', title: '总额'},
                { field: 'StockBillEntry_Stock', title: '仓库', templet: function (d) {
                    if (d.StockBillEntry_Stock) {
                        var index2 = stockid.indexOf(d.StockBillEntry_Stock)
                        if (index2 == '-1') {
                            return ''
                        } else {
                            return stocknick[index2]
                        }
                    } else {
                        return ''
                    }
                }},
                { field: 'Rmark', title: '备注', edit: 'text' }
                // {
                //     field: 'F_Id', title: '操作', align: 'center', templet: function (d) {
                //         return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.F_Id + '">删除</a>';
                //     }
                // }
            ]]
            , data: data
            , page: true
            , limits: [1000, 2000, 3000, 4000, 5000]
            , limit: 1000
            , done: function () {
               
            }
        });
        return false;
    })
}