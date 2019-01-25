var token = $.cookie("token");
var currname = [], currnick = [], cusid = [], cusnick = [], printdata;
$(function () {
    var strwl = [
        { title: '序号', type: 'checkbox' },
        { field: 'materialName', title: '物料代码'},
        { field: 'materialNick', title: '物料名称' },
        { field: 'AssignEntry_Specifications', title: '规格型号' },
        // { field: 'term3', title: '辅助属性', edit: 'text' },
        { field: 'AssignEntry_Unit', title: '计量单位' },
        // { field: 'term5', title: '批号', edit: 'text' },
        { field: 'AssignEntry_Quantity', title: '计划用料数量'},
        { field: '', title: '实际用料数量'},
        { field: 'AssignEntry_ScrapRate', title: '损耗率'},
        { field: 'AssignEntry_Total', title: '理论用量'},//计划用料数量*损耗率
        { field: '', title: '领料差异' },
        // 领料差异=计划用量-实际用料
        { field: '', title: '领料差异率' },
        { field: 'Rmark', title: '备注' }
    ];
    var strgy=[
        { title: '序号', type: 'checkbox' },
        { field: 'CraftEntry_Nick', title: '工艺名称' },
        { field: 'Rmark', title: '备注' },
        // { field: 'Fuser', title: '操作工', templet: "#selectuser" },
        { field: '', title: '工时' },
        { field: '', title: '接收数' },
        { field: '', title: '实做数'},
        { field: '', title: '合格数'},
        { field: '', title: '报废数'},
        { field: '', title: '报废率'},
        { field: '', title: '移交数'},
        { field: '', title: '待制数'},
        { field: '', title: '待交数'},
    ]
    var url = window.location.search;
    var fid = url.split("?")[1].split("=")[1]
    $.ajax({
        type: "get",
        url: ajaxURl + '/Api/Manufacture/Assign/GetEntity?keyValue=' + fid,
        success: function (res) {
            console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data;
            // printdata = res
            if (isussecc) {
                if (data) {
                    $("#Assign_Customer").val(data.Assign_Customer)
                    $("#Assign_DateTime").val(data.Assign_DateTime)
                    $("#Assign_Name").val(data.Assign_Name)
                    $("#Assign_Material").val(data.Assign_Material)//物料
                    $("#nick").val()//物料
                    $("#specifications").val()//物料
                    $("#Assign_Unit").val()//物料
                    $("#Assign_BillOfMaterial").val(data.Assign_BillOfMaterial)
                    $("#Assign_Craft").val(data.Assign_Craft)
                    $("#Assign_Type").val(data.Assign_Type)//类型
                    $("#Assign_Quantity").val(data.Assign_Quantity)
                    $("#Assign_StartTime").val(data.Assign_StartTime)
                    $("#Assign_Deadline").val(data.Assign_Deadline)
                    $("#Rmark").val(data.Rmark)
                    
                    
                   getmarter(data.Assign_Material)
                   gettype(Assign_Type)
                    tablerender(strwl, data.Details)
                }

            } else {
                alert(res.Message)
            }
        }
    })


    

    $(".audit").on("click", function () {
        var href = '/views/product/productchange.html?scaleorder=' + fid;
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
            // $(".ordernext").addClass("hidden");
            // $(".gynext").removeClass("hidden");

        } else {
            $(".taplist").attr("data-staut", "2")
            $("#tablelist").removeClass("hidden");
            $("#tablelist1").addClass("hidden");
            $(".checkorder").addClass("active");
            $(".checkgy").removeClass("active");
            // $(".ordernext").removeClass("hidden");
            // $(".gynext").addClass("hidden");

        }
    })


})




//物料
function getmarter(id){
    console.log(id)
    $.ajax({
        type: "get",
        url: ajaxURl + "/Api/PSIBase/Material/GetList?keyword=&PageIndex=&PageSize=",
        success: function (res) {
            console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data;
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i]
                    if (datanow.Material_Name == id) {
                        $("#Assign_Material").val(datanow.Material_Name)
                        $("#nick").val(datanow.Material_Nick)
                        $("#specifications").val(datanow.Material_Specifications)
                        $("#Assign_Unit").val(datanow.Material_Measure)
                    }
                }
            } else {
                alert(res.Message)
            }
        }
    })
}

function gettype(){

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


