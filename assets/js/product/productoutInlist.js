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
                    console.log(obj);
                    parent.getstock(obj.data.StockBill_Direction,obj.data.F_Id)
                });
            }
        });
        return false;
    })
}

var islist = 0;
$(function () {
    // var subindex = layer.load();


    $(".checklist").on("click", function () {
        var str = [
            { title: '序号', type: 'numbers'},
            { field: 'StockBill_Name', title: '编号'},
            { field: 'StockBill_Project', title: '项目号'},
            { field: 'Currency_Nick', title: '币别'},
            { field: 'Direction_Nick', title: '方向'},
            {
                field: 'StockBill_DateTime', title: '日期', templet: function (d) {
                    if (d.StockBill_DateTime) {
                        return d.StockBill_DateTime.split(" ")[0]
                    }
                }
            },
            { field: 'Status_Nick', title: '状态'},
            { field: 'StockBill_Biller', title: '制单人'} ,
            { field: 'StockBill_Receiver', title: '收货方'},
            { field: 'StockBill_Sender', title: '发货方'},
            { field: 'StockBill_Type', title: '单据类型',templet:function(d){
                if(d.StockBill_Type=='400200'){
                    return "生产发料"
                }else if(d.StockBill_Type=="400100"){
                    return "生产领料"
                }else{
                    return ""
                }
            }},
            {
                field: 'IsEnabled', title: '启用',templet: function (d) {
                    if (d.IsEnabled) {
                        return "是"
                    } else {
                        return "否"
                    }
                }
            },
            { field: 'Remark', title: '备注'},
            {
                field: 'F_Id', title: '操作', templet: function (d) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-danger" onclick=delscale("' + d.F_Id + '")>删除</a>';
                }
            }
        ]
        $.ajax({
            type: "GET",
            async: false,
            url: ajaxstockbilist,
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


    // $(".add").on("click", function () {
    //     parent.newstock()
    // })

    $(".checklist").trigger("click")

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
        $.ajax({
            type: "POST",
            async: false,
            url: removestockbill,
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

