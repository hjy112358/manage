var currname = [], currnick = [], cusid = [], cusnick = [], printdata;
var materid = [], matername = [], maternick = [], subindex, layer;
var fid,userid=[],usernick=[];
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
            console.log(res)
            subindex = layer.load();
            var isussecc = res.Succeed;
            var data = res.Data;
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
                   
                    // 单据状态
                    getstatus(data.Assign_Status)
                  
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
                                tablerender(strwl, data.Children)
                                editableData(data,fid)
                            } else {
                                alert(result.Message)
                            }
                        }
                    })
                    // 查询产品种属
                    getfamily(data.Assign_Material)
                    editableData(data)
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

function editableData(data,fid){
    var strgy = [
        { title: '序号', type: 'numbers' },
        { field: 'CraftEntry_Nick', title: '工艺名称' },
        { field: 'Rmark', title: '备注' },
        // { field: 'Fuser', title: '操作工', templet: "#selectuser" },
        { field: '', title: '工时' },
        { field: '', title: '接收数' },
        { field: 'quantity', title: '实做数' },
        { field: 'qualified', title: '合格数' },
        { field: 'scrap', title: '报废数' },
        { field: '', title: '报废率' },
        { field: '', title: '移交数' },
        { field: '', title: '待制数' },
        { field: '', title: '待交数' },
    ]
    var tablecraft=data.Crafts;
    
    $.ajax({
        url: getRepornum +fid,
        ansyc:false,
        success: function (res) {
            console.log(res)
            if (res.Succeed) {
                var data = res.Data
                if(data.length>=1){
                    $.each(data, function (i, v) {
                        $.each(tablecraft, function (index, value) {
                            value.CraftEntry_Nick=value.AssignCraft_Nick
                            if (v.ReportEntry_CraftEntry == value.F_Id) {
                                value.qualified = v.ReportEntry_Qualified
                                value.quantity = v.ReportEntry_Quantity
                                value.scrap = v.ReportEntry_Scrap
                            }
                        })
                    })
                    tablerendercraft(strgy,tablecraft)
                }else{
                    $.each(tablecraft, function (index, value) {
                        value.CraftEntry_Nick=value.AssignCraft_Nick
                       
                    })
                    console.log(tablecraft)
                    tablerendercraft(strgy,tablecraft)
                }
            }
        }
    })

    // $.ajax({
    //     type: "get",
    //     url: materCraft + data.Assign_Material,
    //     ansyc:false,
    //     success: function (result) {
    //         console.log(result)
    //         var isussecc = result.Succeed;
    //         if (isussecc) { 
    //             tablecraft=result.Data.Details
    //             $.ajax({
    //                 url: getRepornum + fid,
    //                 ansyc:false,
    //                 success: function (res) {
    //                     console.log(res)
    //                     if (res.Succeed) {
    //                         var data = res.Data
    //                         if(data.length>=1){
    //                             $.each(data, function (i, v) {
    //                                 $.each(tablecraft, function (index, value) {
    //                                     if (v.ReportEntry_CraftEntry == value.F_Id) {
    //                                         value.qualified = v.ReportEntry_Qualified
    //                                         value.quantity = v.ReportEntry_Quantity
    //                                         value.scrap = v.ReportEntry_Scrap
    //                                     }
    //                                 })
    //                             })
                                
    //                         }else{
    //                             console.log(tablecraft)
    //                             tablerendercraft(strgy,tablecraft)
    //                         }
    //                     }
    //                 }
    //             })
    //         } else {
    //             alert(result.Message)
    //         }
    //     }
    // })
    $.ajax({
        type: "get",
        url: ajaxUsr,
        ansyc:false,
        success: function (res) {
            var isussecc = res.Succeed;
            var data1 = res.Data;
            if (isussecc) {
                for (var i = 0; i < data1.length; i++) {
                    var datanow = data1[i]
                    userid.push(datanow.F_Id) 
                    usernick.push(datanow.User_Nick)
                    if (datanow.F_Id == data.Assign_Material) {
                        $("#Assign_Biller").val(datanow.User_Nick)
                    }
                }
                $.each(data,function(i,v){
                    if(i=='Assign_Material'){
                        var index = materid.indexOf(v)
                        if (index != '-1') {
                            data.Material_Name=matername[index]
                            data.Material_Nick=maternick[index]
                        } 
                    }else if(i=='Assign_Biller'){
                        var index1 = userid.indexOf(v)
                        if (index1 != '-1') {
                            data.Assign_BillerName=usernick[index1]
                        } 
                    }else if(v==null){
                        data[i]=""
                    }
                })
                printdata=data
                $.each(tablecraft,function(i,value){
                    $.each(value,function(index3,value1){
                        if(value1==null){
                            value[index3]=""
                        }
                    })
                })
                printdata.Details=tablecraft
                console.log(printdata)
            } else {
                alert(res.Message)
            }
        }
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
                                        '<input type="text" value="" id="" readonly>' +
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

$(".print").on("click",function(){
    var base = new Base64();
    $(".printbody").removeClass("hidden");
    $.ajax({
        type: 'GET',
        url:getempone+"1fe9e49d-51e0-4666-93aa-6c5c5f07a500",
        success: function (res) {
            var resdata = res.Data;
            var isussecc = res.Succeed;
            if (isussecc) {
                var templet = resdata.Template_Html;
                var html = base.decode(templet)
                $(".printbody").html(html)
                PraseTable();
                PraseBody();
            }
        }
    })
    function PraseTable() {
        var data;
        $('.printbody table').each(function (index, tb) {
            var tbid = tb.id
            var detail = printdata[tbid];
            if (tbid == 'Details') {
                data = detail;
                $.each(data, function (index, obj) {
                    var row = $('#' + tbid).children().children("tr:last").html();
                    var org = row;
                    $.each(obj, function (key, val) {
                        var reg = new RegExp("{" + key + '}', "g");//g,表示全部替换。
                        row = row.replace(reg, val);
                    });
                    $('#' + tbid).children().children("tr:last").replaceWith("<tr>" + row + "</tr>" + "<tr>" + org + "</tr>")
                });
                $('#' + tbid).children().children("tr:last").replaceWith("");
            } 
        });
    }
    function PraseBody() {
        $(".printbody").each(function (index, body) {
            var ball = body.innerHTML;
            $.each(printdata, function (key, val) {
                if(typeof (val)!='Object'){
                    var reg = new RegExp("{" + key + '}', "g");//g,表示全部替换。
                    ball = ball.replace(reg, val);
                }
            });
            body.innerHTML = (ball);
        });
        $(".printbody").css("padding", "0 30px")
        $(".printbody").print();
        $(".printbody").addClass("hidden");
    }
})


