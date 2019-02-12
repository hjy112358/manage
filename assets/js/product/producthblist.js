// 时间
var layer;
layui.use(['layer', "laydate"], function () {
    var laydate = layui.laydate;
    layer = layui.layer;
    //日期
    laydate.render({
        elem: '#Assign_StartTime',
        btns: ['now', 'confirm']
    })
    //日期
    laydate.render({
        elem: '#Assign_Deadline',
        btns: ['now', 'confirm']
    })

});

var billid = [], billnick = [], reportid=[],reportname=[]
var checkbgtype;

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
                { field: 'Assign_Name', title: '工单单号' },
                { field: 'ReportEntry_Report', title: '报工单号',templet:function(d){
                
                    var index= reportid.indexOf(d.ReportEntry_Report)
                    if (index == '-1') {
                        return ''
                    } else {
                        return reportname[index]
                    } 
                } },
                { field: 'CraftEntry_Name', title: '工序名称' },
                { field: 'CraftEntry_Nick', title: '工序编号' },
                // { field: '', title: '工时' },
                // { field: '', title: '接收数' },
                { field: 'ReportEntry_Quantity', title: '实做数' },
                { field: 'ReportEntry_Qualified', title: '合格数' },//实做数-报废数
                { field: 'ReportEntry_Scrap', title: '报废数' },
                {
                    field: '', title: '报废率(%)', templet: function (d) {
                        var scrappage = '';
                        if (d.ReportEntry_Quantity && d.ReportEntry_Scrap) {
                            scrappage = parseFloat(d.ReportEntry_Scrap) / parseFloat(d.ReportEntry_Quantity) * 100
                            scrappage = scrappage.toFixed(2)
                        } else if (d.ReportEntry_Scrap == 0) {
                            scrappage = '0.00'
                        }
                        return scrappage
                    }
                },

                { field: 'ReportStatus_StartTime', title: '开工时间' },
                { field: 'ReportStatus_EndTime', title: '结束时间' },
                { field: 'User_Nick', title: '操作人'},
                { field: 'Rmark', title: '备注' },
                {
                    field: 'FNumber', title: '操作', align: 'center', templet: function (d) {
                        return '<a class="layui-btn layui-btn-xs layui-btn-danger btn-hb" href="javascript:void(0)" onclick=delreport("' + d.F_Id + '")>删除</a>';
                    }
                }
            ]]
            , data: data
            , page: true
            , limits: [1000, 2000, 3000, 4000, 5000]
            , limit: 1000
            , done: function () {
                table.on('rowDouble(dataTable)', function (obj) {

                    $(".termask").removeClass("hidden");
                    var select = 'dd[lay-value="' + checkbgtype + '"]';
                    $('#ReportEntry_Type').siblings("div.layui-form-select").find('dl').find(select).click();
                    gethbdata(obj.data.F_Id, obj.data.ReportEntry_Assign)
                });
            }
        });
        return false;
    })
}

var islist = 0;
$(function () {
    // var subindex = layer.load();
    // 制单人
    var mouser = $.cookie("User_Id");
    var cheuser;
    $.ajax({
        type: "get",
        url: ajaxUsr,
        success: function (res) {
            // console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data;
            if (isussecc) {
                var html = '<option value="">全部</option>';
                var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i]
                    html += '<option value="' + datanow.F_Id + '">' + datanow.User_Nick + '</option>';
                    htmlsel += '<dd lay-value="' + datanow.F_Id + '">' + datanow.User_Nick + '</dd>'
                   
                    if (datanow.F_Id == mouser) {
                        cheuser = datanow.F_Id
                    }
                }

                $("#ReportEntry_Biller").html(html);
                $(".checkuser .layui-anim.layui-anim-upbit").html(htmlsel);
                layui.use('form', function () {
                    var form = layui.form;
                    form.render();
                });
                var select = 'dd[lay-value="' + cheuser + '"]';
                $('#ReportEntry_Biller').siblings("div.layui-form-select").find('dl').find(select).click();
               
            } else {
                alert(res.Message)
            }
        }
    })

    // 报工类型
    $.ajax({
        url: craftypesta,
        success: function (res) {
            var isussecc = res.Succeed;
            if (isussecc) {
                var data = res.Data.Details;
                var html = '<option value="">全部</option>';
                var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                for (var i = 0; i < data.length; i++) {
                    var typedata = data[i];
                    if (typedata.DictionaryItem_Nick == '正常') {
                        checkbgtype = typedata.DictionaryItem_Value
                    }
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

    $(".checklist").on("click", function () {
        $.ajax({
            type: "GET",
            async: false,
            url: getreportentrylist,
            success: function (result) {
                var datalist = result.Data;
                console.log(datalist)
                var isussecc1 = result.Succeed;
                if (isussecc1) {
                    $.ajax({
                        url:getReportlist,
                        success:function(res){
                            if(res.Succeed){
                                console.log(res)
                                var data=res.Data
                                for(var i=0;i<data.length;i++){
                                    reportid.push(data[i].F_Id)    
                                    reportname.push(data[i].Report_Name)
                                }
                                tablerender(datalist);
                            }
                        }
                    })
                  
                } else {
                    alert(result.Message)
                }
            }
        })

    })

    $(".checklist").trigger("click")
    $(".add").on("click", function () {
        parent.newproducthb()
    })

    $(".cancel").on("click", function () {
        $(".termask").addClass("hidden")
        $(".terform")[0].reset()
        var select = 'dd[lay-value="' + checkbgtype + '"]';
        $('#ReportEntry_Type').siblings("div.layui-form-select").find('dl').find(select).click();
    })



})

function renderForm() {
    layui.use('form', function () {
        var form = layui.form;
        form.render()
    });
}

// 删除
function delreport(id) {
    var index = layer.confirm('确认删除？', {
        btn: ['确定', '取消'] //按钮
    }, function () {
        var token = $.cookie("token");
        $.ajax({
            type: "POST",
            async: false,
            url: rempveReportlist,
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

var issure = true;
function gethbdata(id, assinId) {
    var oldetails = {};
    $.ajax({
        url: getReportone + '?keyvalue=' + id,
        success: function (res) {
            console.log(res)
            if (res.Succeed) {
                if (res.Data) {
                    var data = res.Data.Details[0]
                    oldetails.ReportEntry_Assign = data.ReportEntry_Assign
                    oldetails.ReportEntry_CraftEntry = data.ReportEntry_CraftEntry
                }

            } else {
                alert(res.Message)
            }
        }
    })


    $.ajax({
        type: "get",
        url: getassone + assinId,
        success: function (res) {
            console.log(res)
            var isussecc = res.Succeed;

            if (isussecc) {
                var data = res.Data;
                if (data) {
                    // 产品代码
                    getprodetail(data.Assign_Material)
                    $(".assigNum").html(data.Assign_Name)
                    // 计划开工日期
                    var start = data.Assign_StartTime
                    if (start) {
                        start = start.split(" ")[0]
                    }
                    $('#Assign_StartTime').val(start)
                    // 计划完工日期
                    var endtime = data.Assign_Deadline
                    if (endtime) {
                        endtime = endtime.split(" ")[0]
                    }
                    $('#Assign_Deadline').val(endtime)


                }

            } else {
                alert(res.Message)
            }
        }
    })



    $(".editsave").on("click", function () {
        console.log(oldetails)
        var issure = true, details = [], data = {};
        var quant = ($("#ReportEntry_Quantity").val()) || 0
        var quanted = ($("#ReportEntry_Qualified").val()) || 0
        var scrp = ($("#ReportEntry_Scrap").val()) || 0
        var correctnum = parseInt(quant) - parseInt(scrp)
        if (correctnum != parseInt(quanted)) {
            alert("请核对数据")
            issure = false
        } else {
            issure = true;
        }
        oldetails.ReportEntry_Biller = $("#ReportEntry_Biller option:selected").val()
        oldetails.ReportEntry_Qualified = $("#ReportEntry_Qualified").val()
        oldetails.ReportEntry_Quantity = $("#ReportEntry_Quantity").val()
        oldetails.ReportEntry_Scrap = $("#ReportEntry_Scrap").val()
        oldetails.ReportEntry_Type = $("#ReportEntry_Type option:selected").val()
        details.push(oldetails)
        data.Details = details
        data.Report_Assign = oldetails.ReportEntry_Assign
        console.log(data)
        if (issure) {
            var subindex = layer.load();
            $.ajax({
                type: 'POST',
                url: ajaxaddReport,
                data: data,
                success: function (res) {
                    if (res.Succeed) {
                        $(".termask").addClass("hidden")
                        $(".terform")[0].reset()
                        var select = 'dd[lay-value="' + checkbgtype + '"]';
                        $('#ReportEntry_Type').siblings("div.layui-form-select").find('dl').find(select).click();
                        layer.close(subindex)
                        layer.msg("汇报成功");

                    } else {
                        layer.close(subindex)
                        alert(res.Message)
                        $(".termask").addClass("hidden")
                        $(".terform")[0].reset()
                        var select = 'dd[lay-value="' + checkbgtype + '"]';
                        $('#ReportEntry_Type').siblings("div.layui-form-select").find('dl').find(select).click();

                    }
                }
            })
        }

    })

}



// 产品详情
function getprodetail(id) {
    $.ajax({
        url: ajaxMaterone + '?keyword=' + id + '&PageIndex=&PageSize=',
        success: function (res) {
            // console.log(res)
            var isussecc = res.Succeed
            if (isussecc) {
                var data = res.Data[0];
                var matername = data.Material_Name
                var maternick = data.Material_Nick
                var matertype = data.Material_Type
                var measure = data.Material_Measure
                var materspe = data.Material_Specifications
                var html = ''
                html += ' <span>' + matername + '</span><i> / </i>' +
                    '<span>' + maternick + '</span><i> / </i>' +
                    '<span>' + matertype + '</span><i> / </i>' +
                    '<span>' + measure + '</span><i> / </i>' +
                    '<span>' + materspe + '</span>';
                $(".assignDetail").html(html)
            }
        }
    })
}