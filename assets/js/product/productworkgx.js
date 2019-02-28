$(function(){
    $(".checkorder").on("click", function () {
        var _this = $(this);
        var date = _this.attr("data-type");
        if (date == 'daten') {
            $(".checkorder").attr("data-type", "datey");
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
                        $("#ordernum").html(html);
                        $(".checkorder .layui-anim.layui-anim-upbit").html(htmlsel);
                        renderForm();
                        _this.find("select").next().find('.layui-select-title input').click();
                        _this.find("select").next().find('.layui-select-title input').focus()
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
                    var crafts = res.Data.Crafts
                    // 查询是否有汇报
                    getisreport(obj.value, crafts);

                } else {
                    alert(res.Message)
                }
            }
        })
    })
})

function renderForm() {
    layui.use('form', function () {
        var form = layui.form;
        form.render();
    });
}

function getisreport(id, crafts) {
    $.ajax({
        url: getRepornum + id,
        success: function (res) {
            console.log(res)
            if (res.Succeed) {
                var data = res.Data
                if(data.length>=1){
                    $.each(data, function (i, v) {
                        $.each(crafts, function (index, value) {
                            if (v.ReportEntry_CraftEntry == value.AssignCraft_Process) {
                                value.ReportEntry_Qualified = v.ReportEntry_Qualified
                                value.ReportEntry_Quantity = v.ReportEntry_Quantity
                                value.ReportEntry_Scrap = v.ReportEntry_Scrap
                                value.ReportEntry_Type = v.ReportEntry_Type
                                value.Rmark = v.Rmark
                            }
                        })
                    })
                    tablerender(crafts)
                }else{
                    tablerender(crafts)
                }
               
            }
        }
    })
}

function tablerender(data) {
    layui.use(['jquery', 'table', "layer"], function () {
        var $ = layui.$, table = layui.table, layer = layui.layer;
        tableIns = table.render({
            elem: '#dataTable1'
            , loading: true
            , cols: [[
                { title: '序号', type: 'numbers' },
                { field: 'AssignCraft_Nick', title: '工艺名称' },
                { field: 'ReportEntry_Biller', title: '操作员'},
                { field: '', title: '工时' },
                { field: '', title: '接收数' },
                { field: 'ReportEntry_Quantity', title: '实做数' },
                { field: 'ReportEntry_Qualified', title: '合格数' },//实做数-报废数
                { field: 'ReportEntry_Scrap', title: '报废数' },
                {
                    field: 'Fscrappage', title: '报废率(%)', templet: function (d) {
                        var scrappage = '';
                        if (d.ReportEntry_Qualified) {
                            scrappage = (parseFloat(d.ReportEntry_Scrap) / parseFloat(d.ReportEntry_Quantity)) * 100
                            scrappage = scrappage.toFixed(2)
                        }
                        return scrappage
                    }
                },
                { field: 'Rmark', title: '备注' }
            ]]
            , data: data
            , page: true
            , limits: [1000, 2000, 3000, 4000, 5000]
            , limit: 1000
            , done: function (res) {
                console.log(res.data)
            }
        });

      
        return false;
    })
}