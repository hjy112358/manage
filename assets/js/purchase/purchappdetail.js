layui.use(['jquery', 'table', 'layer', "form"], function () {
    var $ = layui.$;
    var table=layui.table,
    layer=layui.layer,
    form=layui.form;
    var url=window.location.search;
    var fid=url.split("?")[1].split("=")[1]
    $.ajax({
        url:purchaseDetails+fid,
        success:function(res){
            if(res.Succeed){
                loadlayer=layer.load()
                var data=res.Data
                getdepart(data.PurchaseApply_Department)
                getbillemle(data.PurchaseApply_Biller,data.PurchaseApply_Employee)
                getmatelist(data.Details)
                $("#PurchaseApply_DateTime").val(data.PurchaseApply_DateTime.split(" ")[0])
                $("#PurchaseApply_Deadline").val(data.PurchaseApply_Deadline.split(" ")[0])
                $("#PurchaseApply_Reason").val(data.PurchaseApply_Reason)
                $("#PurchaseApply_Name").val(data.PurchaseApply_Name)
                $("#Remark").val(data.Remark)
            }
        }
    })

    $(".changeStatus").on("click",function(){
        var href = '/views/purchase/purchappchange.html?fid=' + fid ;
        window.location.replace(href)
    })

     // 新增
     $(".add").on("click", function () {
        var href = '/views/purchase/purchapp.html';
        window.location.replace(href)
    })
});
var materid=[],maternick=[],matername=[],loadlayer;
// 部门
function getdepart(id){
    $.ajax({
        type: "get",
        url: ajaxdepart,
        success: function (res) {
            var isussecc = res.Succeed;
            if (isussecc) {
                var data = res.Data;
                for (var i = 0; i < data.length; i++) {
                    if(id==data[i].F_Id){
                        $("#PurchaseApply_Department").val(data[i].Department_Nick)
                    }
                }
            } else {
                alert(res.Message)
            }
        }
    })
}

// 制单人、申请人
function getbillemle(bill,em){
    $.ajax({
        type: "get",
        url: ajaxUsr,
        success: function (res) {
            var isussecc = res.Succeed;
            if (isussecc) {
                var data = res.Data;
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i];
                    if(bill==datanow.F_Id){
                        $("#PurchaseApply_Biller").val(datanow.User_Nick)
                    }
                    if(em==datanow.F_Id){
                        $("#PurchaseApply_Employee").val(datanow.User_Nick)
                    }
                }
            } else {
                alert(res.Message)
            }
        }
    })
}

function getmatelist(datalist){
    $.ajax({
        type: "get",
        async:false,
        url: ajaxMater,
        success: function (res) {
            var isussecc = res.Succeed;
            if (isussecc) {
                var data = res.Data;
                for (var i = 0; i < data.length; i++) {
                    var nowD = data[i];
                    materid.push(nowD.F_Id) 
                    maternick.push(nowD.Material_Nick)
                    matername.push(nowD.Material_Name)
                }
            } else {
                alert(res.Message)
            }
        }
    })
    var newdata=datalist
    for(var j=0;j<newdata.length;j++){
        var nowdata=newdata[j]
        var index = materid.indexOf(nowdata.PurchaseApplyEntry_Material)
        if (index != '-1') {
            nowdata.Material_Name=matername[index]
            nowdata.Material_Nick=maternick[index]
        } 
    }
    tablerender(newdata)
}


// 渲染table
function tablerender(data) {
    layui.use(['jquery', 'table'], function () {
        var $ = layui.$,
            table = layui.table;
        table.render({
            elem: '#dataTable'
            , cols: [[
                { title: '序号', type: 'numbers', width: '50' },
                { field: 'Material_Name', title: '<span style="color:red">*  </span>物料代码',  width: '120' },
                { field: 'Material_Nick', title: '物料名称', width: '200' },
                { field: 'PurchaseApplyEntry_Specifications', title: '规格型号', width: '100'},
                { field: 'PurchaseApplyEntry_Unit', title: '单位', width: '50', align: "center" },
                {field: 'PurchaseApplyEntry_Deadline', title: '<span style="color:red">*  </span>交货日期', width: '100', align: "center",templet:function(d){
                    if(d.PurchaseApplyEntry_Deadline){
                        return d.PurchaseApplyEntry_Deadline.split(" ")[0]
                    }else{
                        return ''
                    }
                }},
                { field: 'PurchaseApplyEntry_Quantity', title: '数量', width: '100'},
                { field: 'PurchaseApplyEntry_Purchase', title: '已采购数量', width: '100'},
                { field: 'Remark', title: '备注', width: '200' }
                
            ]]
            , data: data
            , page: true
            , limits: [1000, 2000, 3000, 4000, 5000]
            , limit: 1000
            , done: function (res) {
                layer.close(loadlayer)
            }
        });
        return false;
    })
}