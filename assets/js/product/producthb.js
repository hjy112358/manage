var reload, subdata;
var custid = [], custnick = []
var issure = true;
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
        url: craftypesta,
        success: function (res) {
            var isussecc = res.Succeed;
            if (isussecc) {
                var data = res.Data.Details;
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
    // 制单人
    var mouser = $.cookie("User_Id");
    var cheuser;
    $.ajax({
        type: "get",
        url: ajaxUsr,
        success: function (res) {
            //console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data;
            if (isussecc) {
                var html = '<option value="">全部</option>';
                var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i]
                    html += '<option value="' + datanow.F_Id + '">' + datanow.User_Nick + '</option>';
                    htmlsel += '<dd lay-value="' + datanow.F_Id + '">' + datanow.User_Nick + '</dd>'
                    custid.push(datanow.F_Id)
                    custnick.push(datanow.User_Nick)
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
                    // console.log(res)
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
        // console.log(obj.value)
        $('.mark').attr("data-fid", obj.value)
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
                    $(".sub").attr('data-fid', obj.value)
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
                    // 查询是否有汇报
                    getisreport(obj.value, crafts);

                } else {
                    alert(res.Message)
                }
            }
        })



    })
    $(".sure").on("click", function () {
        var issure = true;
        // ReportEntry_Quantity  实做数量
    // ReportEntry_Qualified  合格数量
    // ReportEntry_Scrap  报废数量
        var quant=($("#ReportEntry_Quantity").val())||0
        var quanted=($("#ReportEntry_Qualified").val())||0
        var scrp=($("#ReportEntry_Scrap").val())||0
        var correctnum=parseInt(quant)-parseInt(scrp)
        if(!quant){
            alert("实做数量不能为空")
        }else if(correctnum!=parseInt(quanted)){
            alert("请核对数据")
            issure=false
        }else{
            issure=true;
        }

        if (issure) {
            $(".mark").addClass("hidden");
            var id = $(".mark").attr("data-craid")
            var data = $(".form-box1").serializeArray()
            reloadtable(id, data)
            $(".mark").attr("data-fid", "")
            $(".form-box1")[0].reset()
            var select = 'dd[lay-value="' + cheuser + '"]';
            $('#ReportEntry_Biller').siblings("div.layui-form-select").find('dl').find(select).click();
        }
    })
    $(".cancel").on("click", function () {
        $(".mark").addClass("hidden")
        $(".form-box1")[0].reset()
        var select = 'dd[lay-value="' + cheuser + '"]';
        $('#ReportEntry_Biller').siblings("div.layui-form-select").find('dl').find(select).click();
    })
    // ReportEntry_Quantity  实做数量
    // ReportEntry_Qualified  合格数量
    // ReportEntry_Scrap  报废数量


})

function tablerender(data) {
    layui.use(['jquery', 'table', "layer"], function () {
        var $ = layui.$, table = layui.table, layer = layui.layer;
        var layTableId = "layTable";
        var tableIns = table.render({
            elem: '#tableCpm'
            , toolbar: true
            , id: layTableId
            , loading: true
            , cols: [[
                { title: '序号', type: 'numbers' },
                { field: 'AssignCraft_Nick', title: '工艺名称' },
                {
                    field: 'ReportEntry_Biller', title: '操作员', templet: function (d) {
                        if (d.ReportEntry_Biller) {
                            var index = custid.indexOf(d.ReportEntry_Biller)
                            if (index == '-1') {
                                return ''
                            } else {
                                return custnick[index]
                            }
                        } else {
                            return ''
                        }
                    }
                },
                { field: '', title: '工时' },
                { field: '', title: '接收数' },
                { field: 'ReportEntry_Quantity', title: '实做数' },
                { field: 'ReportEntry_Qualified', title: '合格数' },//实做数-报废数
                { field: 'ReportEntry_Scrap', title: '报废数' },
                {
                    field: 'Fscrappage', title: '报废率(%)', templet: function (d) {
                        var scrappage = '';
                        if (d.ReportEntry_Qualified) {
                            if (d.ReportEntry_Quantity == d.ReportEntry_Qualified) {
                                scrappage = '0.00'
                            } else {
                                scrappage = (parseFloat(d.ReportEntry_Scrap) / parseFloat(d.ReportEntry_Quantity)) * 100
                                scrappage = scrappage.toFixed(2)
                            }
                        }
                        return scrappage
                    }
                },
                { field: 'Rmark', title: '备注' },
                {
                    field: 'FNumber', title: '操作', align: 'center', templet: function (d) {
                        return '<a class="layui-btn layui-btn-xs layui-btn-danger btn-hb" href="javascript:void(0)" onclick=addreport("' + d.F_Id + '","' + d.cfid + '")>汇报</a>';
                    }
                }
            ]]
            , data: data
            , page: true
            , limits: [1000, 2000, 3000, 4000, 5000]
            , limit: 1000
            , done: function (res) {
                // console.log(res.data)
            }
        });

        reloadtable = function (id, data) {
            var oldData = table.cache[layTableId];
            var isadd = true;
            $.each(oldData, function (index, value) {
                if (value.F_Id == id || value.cfid == id) {
                    if (value.cfid) {
                        isadd = false
                    }
                    // console.log(value)
                    var addnum = 0;
                    for (var i = 0; i < data.length; i++) {
                        var datanow = data[i]
                        var name = datanow.name
                        if (name == "Rmark" || name == "ReportEntry_Type" || name == "ReportEntry_Biller") {
                            value[name] = datanow.value
                        } else {
                            if (value[name]) {
                                addnum = parseInt(value[name])
                            }
                            addnum = parseInt(addnum)
                            value[name] = parseInt(datanow.value) + addnum;
                        }
                    }

                    subdata(isadd, value)
                }
            })
            // console.log(oldData)
            // tableIns.reload({
            //     data: oldData,
            //     limit: 1000
            // });
        }

        subdata = function (isadd, updata) {
            var id = $('#Report_Name option:selected').val()
            console.log(id)
            var oldData = table.cache[layTableId];
            if (isadd) {
                var subindex = layer.load();
                updata.ReportEntry_CraftEntry = updata.AssignCraft_Process
                var craid = updata.F_Id//存放工单工序ID
                updata.cfid = updata.F_Id
                updata.ReportEntry_Assign = id
                updata.F_Id = null
                var data = {}
                data.Details = []
                data.Details.push(updata)
                data.Report_Assign = id
                $.ajax({
                    type: 'POST',
                    url: ajaxaddReport,
                    data: data,
                    success: function (res) {
                        console.log(res)
                        var isussecc = res.Succeed
                        if (isussecc) {
                            var fid = res.Data.Details[0].F_Id
                            var mfid = res.Data.F_Id
                            // var oldData = table.cache[layTableId];
                            $.each(data.Details, function (i, v) {
                                if (craid == v.cfid) {
                                    v.F_Id = fid
                                    v.mfid = mfid
                                }
                            })
                            var noramldata = data.Details[0]
                            var reloaddata = []
                            $.each(oldData, function (i, v) {
                                if (v.AssignCraft_Process == noramldata.ReportEntry_CraftEntry) {
                                    reloaddata.push(noramldata)
                                } else {
                                    reloaddata.push(v)
                                }
                            })
                            tableIns.reload({
                                data: reloaddata,
                                limit: 1000
                            });
                            layer.close(subindex);
                            layer.msg("汇报成功");
                        } else {
                            layer.close(subindex);
                            alert(res.Message)
                        }
                    }
                })
            } else {
                var subindex = layer.load();
                var editdata = {}
                editdata.Report_Assign = id
                editdata.F_Id = updata.mfid
                editdata.Details = []
                editdata.Details.push(updata)
                console.log(editdata)
                $.ajax({
                    type: 'POST',
                    url: editReportone,
                    data: editdata,
                    success: function (res) {
                        console.log(res)
                        var isussecc = res.Succeed
                        if (isussecc) {

                            var noramldata = editdata.Details[0]
                            var reloaddata = []
                            $.each(oldData, function (i, v) {
                                if (v.AssignCraft_Process == noramldata.ReportEntry_CraftEntry) {
                                    reloaddata.push(noramldata)
                                } else {
                                    reloaddata.push(v)
                                }
                            })
                            tableIns.reload({
                                data: reloaddata,
                                limit: 1000
                            });
                            layer.close(subindex);
                            layer.msg("汇报成功");
                        } else {
                            layer.close(subindex);
                            alert(res.Message)
                        }
                    }
                })
            }


        }
        return false;
    })
}

function getisreport(id, crafts) {
    console.log(crafts)
    // 查询报工列表
    $.ajax({
        type: "GET",
        async: false,
        url: getReportlist,
        success: function (res) {
            var isussecc = res.Succeed;
            if (isussecc) {
                var data = res.Data;
                console.log(data)
                if (data.length >= 1) {
                    $.each(data, function (i, v) {
                        if (v.Report_Assign == id) {
                            // 查询报工
                            $.ajax({
                                url: getReportone + '?keyvalue=' + v.F_Id,
                                success: function (res) {
                                    console.log(res)
                                    if (res.Succeed) {
                                        if (res.Data.Details.length >= 1) {
                                            $.each(res.Data.Details, function (i, v) {
                                                $.each(crafts, function (index, value) {
                                                    if (v.ReportEntry_CraftEntry == value.AssignCraft_Process) {
                                                        value.ReportEntry_Qualified = v.ReportEntry_Qualified
                                                        value.ReportEntry_Quantity = v.ReportEntry_Quantity
                                                        value.ReportEntry_Scrap = v.ReportEntry_Scrap
                                                        value.ReportEntry_Type = v.ReportEntry_Type
                                                        value.Rmark = v.Rmark
                                                        value.ReportEntry_Biller = v.ReportEntry_Biller
                                                        value.ReportEntry_CraftEntry = value.AssignCraft_Process
                                                        value.cfid = v.F_Id
                                                        value.ReportEntry_Assign = id
                                                        value.mfid = res.Data.F_Id
                                                        value.F_Id = null
                                                    }
                                                })
                                            })
                                            tablerender(crafts)
                                        }
                                    }
                                }
                            })
                        } else {
                            tablerender(crafts)
                        }
                    })
                } else {
                    tablerender(crafts)
                }

            } else {
                alert(res.Message)
            }
        }
    })



}

function renderForm() {
    layui.use('form', function () {
        var form = layui.form;
        form.render();

    });
}


function addreport(id, cfid) {
    $(".mark").removeClass("hidden")
    if (cfid != 'undefined') {
        $(".mark").attr("data-craid", cfid);
    } else {
        $(".mark").attr("data-craid", id);

    }

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
    var familyid;
    $.ajax({
        url: materFlist,
        success: function (res) {

            var isussecc = res.Succeed;
            if (isussecc) {
                var data = res.Data;
                var html = ''
                for (var i = 0; i < data.length; i++) {
                    var materdata1 = data[i]
                    if (id == materdata1.Family_Nick) {
                        familyid = materdata1.F_Id

                    }
                }

                $.ajax({
                    url: materFlistone + '?keyword=' + familyid + '&PageIndex=&PageSize=',
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
        }
    })

}