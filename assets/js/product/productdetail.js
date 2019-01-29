var token = $.cookie("token");
var currname = [], currnick = [], cusid = [], cusnick = [], printdata;
var materid = [], matername = [], maternick = [], subindex, layer;
var fid;

layui.use(['layer'], function () {
    layer = layui.layer;

});
$(function () {
    var strwl = [
        { title: '序号', type: 'numbers' },
        {
            field: 'AssignEntry_Material', title: '物料代码', templet: function (d) {
                var index1 = materid.indexOf(d.AssignEntry_Material)
                if (index1 == '-1') {

                    return ''
                } else {
                    return matername[index1]
                }
            }
        },
        {
            field: 'AssignEntry_Material', title: '物料名称', templet: function (d) {
                var index2 = materid.indexOf(d.AssignEntry_Material)
                if (index2 == '-1') {
                    return ''
                } else {
                    return maternick[index2]
                }
            }
        },
        { field: 'AssignEntry_Specifications', title: '规格型号' },
        // { field: 'term3', title: '辅助属性', edit: 'text' },
        { field: 'AssignEntry_Unit', title: '计量单位' },
        // { field: 'term5', title: '批号', edit: 'text' },
        { field: 'AssignEntry_Quantity', title: '计划用料数量' },
        // { field: '', title: '实际用料数量' },
        {
            field: 'AssignEntry_ScrapRate', title: '损耗率(%)', templet: function (d) {
                var num = '0.00'
                if (d.AssignEntry_ScrapRate) {
                    num = parseFloat(d.AssignEntry_ScrapRate).toFixed(2);
                }
                return num

            }
        },
        { field: 'AssignEntry_Total', title: '理论用量' },//计划用料数量*损耗率
        { field: '', title: '领料差异' },
        // 领料差异=计划用量-实际用料
        { field: '', title: '领料差异率' },
        { field: 'Rmark', title: '备注' }
    ];
    var url = window.location.search;
    fid = url.split("?")[1].split("=")[1]
    $.ajax({
        type: "get",
        url: getassone + fid,
        success: function (res) {
            subindex = layer.load();
            //console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data;
            // printdata = res
            if (isussecc) {
                if (data) {
                    $("#Assign_DateTime").val(data.Assign_DateTime.split(" ")[0])
                    $("#Assign_Name").val(data.Assign_Name)
                    $("#Assign_Quantity").val(data.Assign_Quantity)
                    $("#Assign_Project").val(data.Assign_Project)
                    $("#Assign_StartTime").val(data.Assign_StartTime.split(" ")[0])
                    $("#Assign_Deadline").val(data.Assign_Deadline.split(" ")[0])
                    $("#Rmark").val(data.Rmark)
                    setInterval(function () {
                        layer.close(subindex)
                    }, 1500)
                    //单据类型
                    gettype(data.Assign_Type)
                    // bom
                    // getbom(data.Assign_BillOfMaterial)
                    // 工艺路线
                    getcraft(data.Assign_Craft)
                    // 客户
                    getcustom(data.Assign_Customer)
                    // 制单人
                    getbil(data.Assign_Biller)
                    // 单据状态
                    getstatus(data.Assign_Status)

                    // 工艺加载
                    getcraflist(data.Assign_Material)
                    // 产品
                    $.ajax({
                        type: "get",
                        url: ajaxMater,
                        success: function (result) {
                            //console.log(result)
                            var isussecc1 = result.Succeed;
                            var datamater = result.Data;
                            if (isussecc1) {
                                for (var i = 0; i < datamater.length; i++) {
                                    var datanow = datamater[i]
                                    materid.push(datanow.F_Id)
                                    matername.push(datanow.Material_Name)
                                    maternick.push(datanow.Material_Nick)
                                    if (datanow.F_Id == data.Assign_Material) {
                                        $("#Assign_Material").val(datanow.Material_Name)
                                        $("#nick").val(datanow.Material_Nick)
                                        $("#specifications").val(datanow.Material_Specifications)
                                        $("#Assign_Unit").val(datanow.Material_Measure)

                                    }
                                }
                                // 物料加载
                                //console.log(data.Details)
                                tablerender(strwl, data.Details)
                            } else {
                                alert(result.Message)
                            }
                        }
                    })

                    // 查询产品种属
                    getfamily(data.Assign_Material)

                }

            } else {
                alert(res.Message)
            }
        }
    })

    // 变更
    $(".changeStatus").on("click", function () {
        var href = '/views/product/productchange.html?scaleorder=' + fid;
        console.log(href)
        window.location.replace(href)
    })

    $(".checkone").click(function () {
        var stau = $(this).attr("data-status");
        if (stau == '1') {
            $(".taplist").attr("data-staut", "1")
            $("#tablelist1").removeClass("hidden");
            $("#tablelist").addClass("hidden");
            $(".checkgy").addClass("active");
            $(".checkorder").removeClass("active");
            $(".ordernext").addClass("hidden");
            $(".gynext").removeClass("hidden");

        } else {
            $(".taplist").attr("data-staut", "2")
            $("#tablelist").removeClass("hidden");
            $("#tablelist1").addClass("hidden");
            $(".checkorder").addClass("active");
            $(".checkgy").removeClass("active");
            $(".ordernext").removeClass("hidden");
            $(".gynext").addClass("hidden");

        }
    })


})
// 工单类型
function gettype(id) {
    $.ajax({
        type: "get",
        url: ajaxAsstype,
        success: function (res) {
            //console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data.Details;
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i]
                    if (datanow.DictionaryItem_Value == id) {
                        $("#Assign_Type").val(datanow.DictionaryItem_Nick)
                    }
                }
            } else {
                alert(res.Message)
            }
        }
    })
}

// bom
// function getbom(id) {
//     $.ajax({
//         type: "get",
//         url: bomlist,
//         success: function (res) {
//             //console.log(res)
//             var isussecc = res.Succeed;
//             var data = res.Data;
//             if (isussecc) {
//                 for (var i = 0; i < data.length; i++) {
//                     var datanow = data[i]
//                     if (datanow.F_Id == id) {
//                         $("#Assign_BillOfMaterial").val(datanow.BillOfMaterial_Name)
//                     }
//                 }
//             } else {
//                 alert(res.Message)
//             }
//         }
//     })
// }

// 客户
function getcustom(id) {
    $.ajax({
        type: "get",
        url: ajaxCus,
        success: function (res) {
            //console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data;
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i]
                    if (datanow.F_Id == id) {
                        $("#Assign_Customer").val(datanow.Customer_Nick)
                    }
                }
            } else {
                alert(res.Message)
            }
        }
    })
}

// 工艺路线
function getcraft(id) {
    $.ajax({
        type: "get",
        url: craftlist,
        success: function (res) {
            //console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data;
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i]
                    if (datanow.F_Id == id) {
                        var nick;
                        if (datanow.Craft_Nick) {
                            nick = datanow.Craft_Nick
                        } else {
                            nick = datanow.Craft_Name
                        }
                        $("#Assign_Craft").val(nick)
                    }
                }
            } else {
                alert(res.Message)
            }
        }
    })
}

//制单人
function getbil(id) {
    $.ajax({
        type: "get",
        url: ajaxUsr,
        success: function (res) {
            //console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data;
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i]
                    if (datanow.F_Id == id) {
                        $("#Assign_Biller").val(datanow.User_Nick)
                    }
                }
            } else {
                alert(res.Message)
            }
        }
    })
}

//单据状态
function getstatus(id) {
    $.ajax({
        type: "get",
        url: assginsta,
        success: function (res) {
            //console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data.Details;
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i]
                    if (datanow.DictionaryItem_Value == id) {
                        $("#Assign_Status").val(datanow.DictionaryItem_Nick)
                    }
                }
            } else {
                alert(res.Message)
            }
        }
    })
}

function getcraflist(id) {
    var strgy = [
        { title: '序号', type: 'numbers' },
        { field: 'CraftEntry_Nick', title: '工艺名称' },
        { field: 'Rmark', title: '备注' },
        // { field: 'Fuser', title: '操作工', templet: "#selectuser" },
        { field: '', title: '工时' },
        { field: '', title: '接收数' },
        { field: '', title: '实做数' },
        { field: '', title: '合格数' },
        { field: '', title: '报废数' },
        { field: '', title: '报废率' },
        { field: '', title: '移交数' },
        { field: '', title: '待制数' },
        { field: '', title: '待交数' },
    ]
    $.ajax({
        type: "get",
        url: materCraft + id,
        success: function (res) {
            console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data.Details;

            if (isussecc) {
                tablerendercraft(strgy, data)
            } else {
                alert(res.Message)
            }
        }
    })
}

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
        });
        return false;
    })
}

function tablerendercraft(str, data) {
    var layTableId = "layTable1";
    layui.use(['jquery', 'table'], function () {
        var $ = layui.$,
            table = layui.table;
        table.render({
            elem: '#dataTable1'
            , id: layTableId
            , toolbar: true
            , cols: [str]
            , data: data
            , page: true
            , limits: [1000, 2000, 3000, 4000, 5000]
            , limit: 1000

        });
    })
}

function getfamily(id) {
    $.ajax({
        url: ajaxMaterone + '?keyword=' + id + '&PageIndex=&PageSize=',
        success: function (res) {
            //console.log(res)
            var isussecc = res.Succeed;
            if (isussecc) {
                var data = res.Data;
                matertypelist(data[0].Material_Type)

            }
        }
    })
}
// 物料种属
function matertypelist(id) {
    //console.log(id)
    var familyid;
    $.ajax({
        url: materFlist,
        success: function (res) {
            //console.log(res)
            var isussecc = res.Succeed;
            if (isussecc) {
                var data = res.Data;
                var html = ''
                for (var i = 0; i < data.length; i++) {
                    var materdata = data[i]
                    if (id == materdata.Family_Nick) {
                        familyid = materdata.F_Id

                    }
                }
                //console.log(familyid)
                $.ajax({
                    url: materFlistone + '?keyword=' + familyid + '&PageIndex=&PageSize=',
                    success: function (res) {
                        //console.log(res)
                        var isussecc = res.Succeed;
                        if (isussecc) {
                            var data = res.Data;
                            var html = ''
                            if (data.length >= 1) {
                                for (var i = 0; i < data.length; i++) {
                                    html += '<div class="layui-form-lsit fl ">' +
                                        '<label class="layui-form-label">' + data[i].FamilyEntry_Nick + '：</label>' +
                                        '<div class="layui-input-block disinput">' +
                                        '<input type="text" value="" id="">' +
                                        '</div>' +
                                        '</div>';
                                }
                                $(".isAttribute").html(html)
                                $(".isAttribute").css("padding", "10px")
                            }

                        }
                    }
                })
            }
        }
    })


}



