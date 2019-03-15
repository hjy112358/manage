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
                getbill(data.StockBill_Receiver,data.StockBill_Biller)
                getsender(data.StockBill_Sender)
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
        var href = '/views/warehouse/otherInchange.html?fid=' + fid ;
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
            , cols: [ [{title: '序号', type: 'numbers' },
            {field: 'Material_Name',title: '物料代码',width:120, templet: function (d) {
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
            }},
            {field: 'Material_Nick',title: '物料名称',width:120, templet: function (d) {
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
            }},
            {field: 'StockBillEntry_Specifications',title: '规格型号',width:80},
            {field: 'StockBillEntry_BatchNo',title: '批号',width:80 },
            {field: 'StockBillEntry_Unit',title: '计量单位',width:80,align:'center'},
            {field: 'StockBillEntry_Price',title: '价格',width:100},
            {field: 'StockBillEntry_Quantity',title: '实收数量',width:100},
            {field: 'StockBillEntry_Amount',title: '总额',width:100},
            {field: 'StockBillEntry_Stock', title: '收货仓库',width:100, templet: function (d) {
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
            { field: 'Rmark',title: '备注',width:100},
            {field: 'F_Id',title: '操作',align: 'center', templet: function (d) {
                return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.F_Id + '">删除</a>';
            }}
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
function getbill(receive,bill){
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
                        $("#StockBill_Billername").val(datanow.User_Nick)
                    }
                    if(datanow.F_Id == receive){
                        $("#StockBill_Receiver").val(datanow.User_Nick)
                    }
                }
               
            } else {
                alert(res.Message)
            }

        }
    })
}

//  部门-供应商-客户
function getsender(id){
// 部门
    $.ajax({
        type: "get",
        url: ajaxdepart,
        success: function (res) {
            var isussecc = res.Succeed;
            var data = res.Data;
            if (isussecc) {
                var deparnick='';
                for (var i = 0; i < data.length; i++) {
                    var datanow=data[i]
                    if(datanow.F_Id==id){
                        deparnick=datanow.Department_Nick 
                    }
                }
                if(deparnick==''){
                    getsupper(id)
                }else{
                    $("#stockdepartment").val(datanow.Department_Nick);
                }
            } else {
                getsupper(id)
                alert(res.Message)
            }
        }
    })
    return false
}
// 供应商
function getsupper(id){
    $.ajax({
        type: "get",
        url: ajaxsupplist,
        success: function (res) {
            var isussecc = res.Succeed;
            if (isussecc) {
                var suppernick=''
                var data = res.Data;
                for (var i = 0; i < data.length; i++) { 
                    var datanow=data[i]
                    if(datanow.F_Id==id){
                        suppernick=datanow.Supplier_Nick
                    }
                }
                if(suppernick==''){
                    getcustom(id)
                }else{
                    $("#stocksuper").val(suppernick)
                }
            } else {
                getcustom(id)
                alert(res.Message)
            }
        }
    })
    return false
}


// 客户
function getcustom(id){
    $.ajax({
        type: "get",
        url: ajaxCus,
        success: function (res) {
            var isussecc = res.Succeed;
            var data = res.Data;
            if (isussecc) {
                var customnick=''
                for (var i = 0; i < data.length; i++) {
                    var datanow=data[i]
                    if(datanow.F_Id==id){
                        customnick=datanow.Customer_Nick
                    }
                }
                if(customnick!=''){
                    $("#stockcustom").val(datanow.customnick)
                }
            } else {
                alert(res.Message)
            }

        }
    })
    return false
}