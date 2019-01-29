$(function () {
    $(".hignckick").on("click", function () {
        var _this = $(this)
        var type = _this.attr("data-type");
        if (type == 'daten') {
            _this.attr("data-type", "datey");
            $(".more").addClass("hidden");
            $(".hignckick").html("更多")
        } else {
            _this.attr("data-type", "daten");
            $(".more").removeClass("hidden");
            $(".hignckick").html("收起")
        }
    })

    // 报工类型
    $.ajax({
        url:craftypesta,
        success:function(res){
            var isussecc=res.Succeed;
            if(isussecc){
                var data=res.Data.Details;
                var html = '<option value="">全部</option>';
                var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                for (var i = 0; i < data.length; i++) {
                    var typedata = data[i];
                    html += '<option value="' + typedata.DictionaryItem_Value + '">' + typedata.DictionaryItem_Nick + '</option>';
                    htmlsel += '<dd lay-value="' + typedata.DictionaryItem_Value + '">' + typedata.DictionaryItem_Nick + '</dd>'
                }
                $("#ReportEntry_Type").html(html);
                $(".craftype .layui-anim.layui-anim-upbit").html(htmlsel);
                layui.use('form', function () {
                    var form = layui.form;
                    form.render();
                });
            }
        }

    })

    //生产订单列表
    $(".checknum").on("click", function () {
        var _this = $(this);
        var date = _this.attr("data-type");
        if (date == 'daten') {
            $(".checknum").attr("data-type", "datey");
            $.ajax({
                type: "get",
                url: asslist,
                success: function (res) {
                    console.log(res)
                    var isussecc = res.Succeed;
                    var data = res.Data;
                    if (isussecc) {
                        var html = '<option value="">全部</option>';
                        var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                        for (var i = 0; i < data.length; i++) {
                            html += '<option value="' + data[i].F_Id + '" ">' + data[i].Assign_Name + '</option>';
                            htmlsel += '<dd lay-value="' + data[i].F_Id + '" >' + data[i].Assign_Name + '</dd>'
                        }
                        $("#Report_Name").html(html);
                        $(".checknum .layui-anim.layui-anim-upbit").html(htmlsel);
                        renderForm();
                        _this.find("select").next().find('.layui-select-title input').click();
                    } else {
                        alert(res.Message)
                    }
                }
            })
        }
    })

    // 切换单号
    layui.form.on("select(num)", function (obj) {
        console.log(obj.value)
        $.ajax({
            type: "get",
            url: getassone + obj.value,
            success: function (res) {
                console.log(res)
                var isussecc = res.Succeed;
                var data = res.Data;
                if (isussecc) {
                    $(".morebtn").removeClass("hidden")
                    $(".more").removeClass("hidden");
                    $(".hignckick").html("收起")
                    // 单据日期
                    var datetime = data.Assign_DateTime
                    if (datetime) {
                        datetime = datetime.split(" ")[0]
                    }
                    $("#Assign_DateTime").val(datetime)
                    // 产品代码
                    getprodetail(data.Assign_Material)

                    // 交货日期

                    // bom
                    getbomdetail(data.Assign_BillOfMaterial)
                    // 工艺路线
                    getcraftdetail(data.Assign_Craft)
                    // 计划生产数量
                    $('#Assign_Quantity').val(data.Assign_Quantity)
                    // 计划开工日期
                    var start = data.Assign_StartTime
                    if (start) {
                        start = start.split(" ")[0]
                    }
                    $('#Assign_StartTime').val(start)
                    // 计划完工日期
                    var endtime = data.Assign_Deadline
                    if (start) {
                        endtime = endtime.split(" ")[0]
                    }
                    $('#Assign_Deadline').val(endtime)

                    var crafts = res.Data.Crafts
                    tablerender(crafts)

                } else {
                    alert(res.Message)
                }
            }
        })
    })

    $(".sure").on("click",function(){

    })

    $(".cancel").on("click",function(){
        $(".mark").addClass("hidden")
        $(".form-box1")[0].reset()
    })
})

function tablerender(data) {
    layui.use(['jquery', 'table'], function () {
        var $ = layui.$, table = layui.table;
        table.render({
            elem: '#tableCpm'
            , toolbar: true
            , loading: true
            , cols: [[
                { title: '序号', type: 'numbers' },
                { field: 'AssignCraft_Nick', title: '工艺名称' },
                { field: '', title: '操作员' },
                { field: '', title: '工时' },
                { field: '', title: '接收数' },
                { field: 'ReportEntry_Quantity', title: '实做数' },
                { field: 'ReportEntry_Qualified', title: '合格数' },//实做数-报废数
                { field: 'ReportEntry_Scrap', title: '报废数' },
                { field: 'Ftruecout', title: '报废率' },
                { field: 'Rmark', title: '备注' },
                {
                    field: 'FNumber', title: '操作', align: 'center', templet: function (d) {
                        return '<a class="layui-btn layui-btn-xs layui-btn-danger btn-hb" href="javascript:void(0)" onclick=addreport("' + d.F_Id + '")>汇报</a>';
                    }
                }
            ]]
            , data: data
            , page: true
            , limits: [1000, 2000, 3000, 4000, 5000]
            , limit: 1000

        });
        return false;
    })
}

function renderForm() {
    layui.use('form', function () {
        var form = layui.form;
        form.render();

    });
}


function addreport(id) {
    $(".mark").removeClass("hidden")
    $(".mark").attr("data-id",id)
}

// 产品详情
function getprodetail(id) {
    $.ajax({
        url: ajaxMaterone + '?keyword=' + id + '&PageIndex=&PageSize=',
        success: function (res) {
            console.log(res)
            var isussecc = res.Succeed
            if (isussecc) {
                var data = res.Data[0];
                $("#Assign_Material").val(data.Material_Name)
                $("#maternick").val(data.Material_Nick)
                matertypelist(data.Material_Type)
                $("#measure").val(data.Material_Measure)
                $("#specifications").val(data.Material_Specifications)
            }
        }
    })
}


// bom
function getbomdetail(id) {
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
}


// 工艺路线
function getcraftdetail(id) {
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

// 物料种属
function matertypelist(id) {
    $.ajax({
        url: materFlistone + '?keyword=' + id + '&PageIndex=&PageSize=',
        success: function (res) {
            var isussecc = res.Succeed;
            if (isussecc) {
                var data = res.Data;
                var html = ''
                if (data.length >= 1) {
                    for (var i = 0; i < data.length; i++) {
                        html += '<div class="layui-form-lsit fl ">' +
                            '<label class="layui-form-label">' + data[i].FamilyEntry_Nick + '：</label>' +
                            '<div class="layui-input-block disinput">' +
                            '<input type="text" value="" id="" name="' + data[i].FamilyEntry_Name + '">' +
                            '</div>' +
                            '</div>';
                    }
                    $(".isAttribute").html(html)
                    $(".isAttribute").css("padding", "10px")
                } else {
                    $(".isAttribute").html(html)
                    $(".isAttribute").css("padding", "0")
                }
            }
        }
    })
}