// 时间
var myDate = new Date();
var nowY = myDate.getFullYear();
var nowM = myDate.getMonth() + 1;
var nowD = myDate.getDate();
var tody = nowY + "-" + (nowM < 10 ? "0" + nowM : nowM) + "-" + (nowD < 10 ? "0" + nowD : nowD);
var layer;
layui.use(['jquery', 'table', 'layer', "form", "layedit", "laydate"], function () {
    var $ = layui.$;
    table = layui.table,
        form = layui.form,
        layedit = layui.layedit,
        laydate = layui.laydate,
        upload = layui.uplaod,
        element = layui.element;
    layer = layui.layer;
    //日期
    laydate.render({
        elem: '#date',
        value: tody,
        isInitValue: true,
        btns: ['now', 'confirm']
    })
    //日期
    laydate.render({
        elem: '#recdate',
        value: tody,
        isInitValue: true,
        btns: ['now', 'confirm']
    });
});

var materid = [], maternick = [], matername = [],
    asstypeid = [], asstypename = [], asstypenick = [],
    astatusid = [], astatusnick = [],
    bomid = [], bomnick = [],
    craftid = [], craftnick = [], craftname = [],
    cotnick = [], custid = [],
    billid = [], billnick = []

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
                    //console.log(obj);
                    parent.getproduct(obj.data.F_Id)
                });
            }
        });
        return false;
    })
}

var islist = 0;
$(function () {
    var subindex = layer.load();
    //物料
    $.ajax({
        url: ajaxMater,
        success: function (res) {
            //console.log(res)
            var isussecc = res.Succeed;
            if (isussecc) {
                for (var i = 0; i < res.Data.length; i++) {
                    materid.push(res.Data[i].F_Id)
                    maternick.push(res.Data[i].Material_Nick)
                    matername.push(res.Data[i].Material_Name)
                }
                islist++;
                isclick()
            }
        }
    })
    // 单据状态
    $.ajax({
        url: assginsta,
        success: function (res) {
            //console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data.Details
            //console.log(data)
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    astatusid.push(data[i].DictionaryItem_Value)
                    astatusnick.push(data[i].DictionaryItem_Nick)
                }
                islist++;
                isclick()

            }
        }
    })
    // 订单类型
    $.ajax({
        url: ajaxAsstype,
        success: function (res) {
            //console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data.Details
            //console.log(data)
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    asstypeid.push(data[i].DictionaryItem_Value)
                    asstypenick.push(data[i].DictionaryItem_Nick)
                }
                islist++;
                isclick()

            }
        }
    })
    // BOM
    // $.ajax({
    //     url: bomlist,
    //     success: function (res) {
    //         //console.log(res)
    //         var isussecc = res.Succeed;
    //         var data = res.Data
    //         //console.log(data)
    //         if (isussecc) {
    //             for (var i = 0; i < data.length; i++) {
    //                 bomid.push(data[i].F_Id)
    //                 bomnick.push(data[i].BillOfMaterial_Name)
    //             }
    //             islist++;
    //             isclick()

    //         }
    //     }
    // })
    // 工艺路线
    $.ajax({
        url: craftlist,
        success: function (res) {
            //console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data
            //console.log(data)
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    craftid.push(data[i].F_Id)
                    craftnick.push(data[i].Craft_Nick)
                    craftname.push(data[i].Craft_Name)
                }
                islist++;
                isclick()

            }
        }
    })

    // 客户
    $.ajax({
        url: ajaxCus,
        success: function (res) {
            //console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data
            //console.log(data)
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    custid.push(data[i].F_Id)
                    cotnick.push(data[i].Customer_Nick)
                }
                islist++;
                isclick()

            }
        }
    })
    // 制单人
    $.ajax({
        url: ajaxUsr,
        success: function (res) {
            //console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data
            //console.log(data)
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    billid.push(data[i].F_Id)
                    billnick.push(data[i].User_Nick)
                }
                islist++;
                isclick()

            }
        }
    })

    $(".checklist").on("click", function () {
        var str = [
            { title: '序号', type: 'numbers', width: '80' },
            { field: 'Assign_Name', title: '单据编号', width: "150", align: "right" },
            {
                field: 'Assign_DateTime', title: '单据日期', width: "150", align: 'center', templet: function (d) {
                    if (d.Assign_DateTime) {
                        return d.Assign_DateTime.split(" ")[0]
                    }
                }
            },
            {
                field: 'Assign_Material', title: '物料代码', width: "200", align: "right", templet: function (d) {
                    var index = materid.indexOf(d.Assign_Material)
                    if (index == '-1') {
                        return ''
                    } else {
                        return matername[index]
                    }
                }
            },
            {
                field: 'Assign_Material', title: '物料名称', width: "200", align: "right", templet: function (d) {
                    var index1 = materid.indexOf(d.Assign_Material)
                    if (index1 == '-1') {
                        return ''
                    } else {
                        return maternick[index1]
                    }
                }
            },
            { field: 'Assign_Specifications', title: '规格', align: 'center', width: "150" },
            {
                field: 'Assign_Unit', title: '单位', align: 'center', width: "100", templet: function (d) {
                    if (d.Assign_Unit == "null") {
                        return ''
                    } else {
                        return d.Assign_Unit
                    }
                }
            },
            { field: 'Assign_Quantity', title: '数量', width: "150" },
            {
                field: 'Assign_Deadline', title: '计划完工日期', width: '150', align: 'center', templet: function (d) {
                    if (d.Assign_Deadline) {
                        return d.Assign_Deadline.split(" ")[0]
                    }
                }
            },
            {
                field: 'Assign_StartTime', title: '开工日期', align: 'center', width: "150", templet: function (d) {
                    if (d.Assign_StartTime) {
                        return d.Assign_StartTime.split(" ")[0]
                    }
                }
            },
            {
                field: 'Assign_Status', title: '单据状态', align: 'center', width: "150", templet: function (d) {
                    var index3 = astatusid.indexOf(d.Assign_Status)
                    if (index3 == '-1') {
                        return ''
                    } else {
                        return astatusnick[index3]
                    }
                }
            },
            {
                field: 'Assign_Type', title: '工单类型', align: 'center', width: "150", templet: function (d) {
                    var index2 = asstypeid.indexOf(d.Assign_Type)
                    if (index2 == '-1') {
                        return ''
                    } else {
                        return asstypenick[index2]
                    }
                }
            },
            {
                field: 'IsEnabled', title: '启用', align: 'center', width: "100", templet: function (d) {
                    if (d.IsEnabled) {
                        return "是"
                    } else {
                        return "否"
                    }
                }
            },
            { field: 'Remark', title: '备注', align: 'center', width: "200" },
            {
                field: 'Assign_BillOfMaterial', title: 'BOM', width: '150'
                // ,templet:function(d){
                //     var index4= bomid.indexOf(d.Assign_BillOfMaterial)
                //     if (index4 == '-1') {
                //         return ''
                //     } else {
                //         return bomnick[index4]
                //     } 
                // }
            },
            {
                field: 'Assign_Craft', title: '工艺路线', width: '200', templet: function (d) {
                    var index5 = craftid.indexOf(d.Assign_Craft)
                    if (craftnick[index5]) {
                        return craftnick[index5]
                    } else if (craftname[index5]) {
                        return craftname[index5]
                    } else {
                        return ''
                    }

                }
            },
            {
                field: 'Assign_Customer', title: '客户', width: "180", templet: function (d) {
                    var index6 = custid.indexOf(d.Assign_Customer)
                    if (index6 == '-1') {
                        return ''
                    } else {
                        return cotnick[index6]
                    }
                }
            },
            { field: 'Assign_Project', title: '项目', width: "100" },
            {
                field: 'Assign_Biller', title: '制单人', width: '200', templet: function (d) {

                    var index7 = billid.indexOf(d.Assign_Biller)
                    if (index7 == '-1') {
                        return ''
                    } else {
                        return billnick[index7]
                    }
                }
            },
            {
                field: 'F_Id', title: '操作', align: 'center', width: '100', templet: function (d) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-danger" onclick=delscale("' + d.F_Id + '")>删除</a>';
                }
            }
        ]
        $.ajax({
            type: "GET",
            async: false,
            url: asslist,
            success: function (res) {
                var data = res.Data;
                //console.log(data)
                var isussecc = res.Succeed;
                if (isussecc) {
                    tablerender(str, data);
                } else {
                    alert(res.Message)
                }
            }
        })

    })


    $(".add").on("click", function () {
        parent.newproduct()
    })

    function isclick() {
        if (islist == 6) {
            layer.close(subindex);
            $(".checklist").trigger("click")
        }
    }

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
            url: removecraftlist,
            data: {
                F_Id: id
            },
            success: function (res) {
                var data = res.Data;
                //console.log(data)
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

