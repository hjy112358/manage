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
function tablerender( data) {
    layui.use(['jquery', 'table'], function () {
        var $ = layui.$,
            table = layui.table;
        table.render({
            elem: '#dataTable'
            , toolbar: true
            , cols: [[
                { title: '序号', type: 'numbers' },
                { field: 'Assign_Name', title: '工单单号' },
                { field: 'Report_Name', title: '报工单号' },
                // { field: '', title: '工时' },
                // { field: '', title: '接收数' },
                { field: 'Report_Quantity', title: '实做数' },
                { field: 'Report_Qualified', title: '合格数' },//实做数-报废数
                { field: 'Report_Scrap', title: '报废数' },
                {
                    field: 'Fscrappage', title: '报废率(%)', templet: function (d) {
                        var scrappage = '';
                        if (d.Report_Quantity && d.Report_Scrap) {
                            scrappage = parseFloat(d.Report_Scrap) / parseFloat(d.Report_Quantity) * 100
                            scrappage = scrappage.toFixed(2)
                        }
                        return scrappage
                    }
                },
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
                    //console.log(obj);
                    parent.getproductchange(obj.data.F_Id)
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
        
        $.ajax({
            type: "GET",
            async: false,
            url: getReportlist,
            success: function (res) {
                var data = res.Data;
                console.log(data)
                var isussecc = res.Succeed;
                if (isussecc) {
                    tablerender(data);
                } else {
                    alert(res.Message)
                }
            }
        })

    })

    $(".checklist").trigger("click")
    $(".add").on("click", function () {
        parent.newproduct()
    })

    function isclick() {
        // if (islist == 6) {
        //     layer.close(subindex);
        //     $(".checklist").trigger("click")
        // }
    }

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

