var myDate = new Date();
var nowY = myDate.getFullYear();
var nowM = myDate.getMonth() + 1;
var nowD = myDate.getDate();
var tody = nowY + "-" + (nowM < 10 ? "0" + nowM : nowM) + "-" + (nowD < 10 ? "0" + nowD : nowD);
//layui 模块化引用

layui.use(['jquery', 'table', 'layer', "form", "layedit", "laydate"], function () {
    var $ = layui.$;
    table = layui.table,
        form = layui.form,
        layer = layui.layer,
        layedit = layui.layedit,
        laydate = layui.laydate,
        element = layui.element;
    //日期
    laydate.render({
        elem: '#date',
        value: tody,
        isInitValue: true,
        btns: ['now', 'confirm']
    });
});



var dateslit1 = [];
var renderForm;
var tablelist;
var firstone = 'a' + new Date().valueOf();
var viewObjcra = {
    tbData1: [{
        FNote: '',
        state: 0,
        FName: '',
        crsId: firstone,
        CraftEntry_Nick: ''
    }],
    limit: 1,
    last: firstone
};
//layui 模块化引用
layui.use(['jquery', 'table', 'layer', "form", "layedit", "laydate"], function () {
    var $ = layui.$,
        form = layui.form,
        layer = layui.layer,
        layedit = layui.layedit,
        laydate = layui.laydate,
        element = layui.element,
        table = layui.table;

    //数据表格实例化		
    var layTableId = "layTable1";
    var tablecrm = table.render({
        elem: '#tableCpm',
        data: viewObjcra.tbData1,
        limit: viewObjcra.limit,
        page: false,
        id: layTableId,
        loading: true,
        // even: true,
        cols: [[
            { title: '序号', type: 'numbers' },
            { field: 'CraftEntry_Nick', title: '工艺名称', templet: "#selectcrp" },
            { field: 'Fuser', title: '操作工', templet: "#selectuser" },
            { field: 'Ftruecout', title: '工时', edit: 'text' },
            { field: 'Ftruecout', title: '接收数' },
            { field: 'Ftruecout', title: '实做数', edit: 'text' },
            { field: 'Ftruecout', title: '合格数', edit: 'text' },
            { field: 'Ftruecout', title: '报废数', edit: 'text' },
            { field: 'Ftruecout', title: '报废率' },
            { field: 'FNote', title: '备注', edit: 'text' },
            {
                field: 'FNumber', title: '操作', align: 'center', templet: function (d) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.crsId + '"><i class="layui-icon layui-icon-delete"></i>移除</a>';
                }
            }
        ]],
        done: function (res, curr, count) {
            viewObjcra.tbData1 = res.data;
            // var scrollHeight = $('#tablecpm .layui-table-body.layui-table-main').prop("scrollHeight");
            // $('#tablecpm .layui-table-body.layui-table-main').animate({ scrollTop: scrollHeight }, 400);
            tablelist = res.data;
            checklist();
            $('#tablecpm tr').each(function (e) {
                var $cr = $(this);
                var dataindex = $cr.attr("data-index");
                $.each(tablelist, function (index, value) {
                    if (value.LAY_TABLE_INDEX == dataindex) {
                        $cr.find('td[data-field="CraftEntry_Nick"]').find("input").val(value.CraftEntry_Nick);
                        // $cr.find('td[data-field="FName"]').find("input").val(value.FName);
                        // $cr.find('td[data-field="Fuser"]').find("input").val(value.Fuser);
                    }
                });
            });

            // $("#tablelist1 .layui-table-view .layui-table td[data-field='FName']").on("click", function () {
            //     var scrollHeight = $('#tablecpm .layui-table-body.layui-table-main').prop("scrollHeight");
            //     $('#tablecpm .layui-table-body.layui-table-main').animate({ scrollTop: scrollHeight }, 600);
            // })


        }
    });


    //定义事件集合
    var active = {
        add: function () {	//添加一行
            viewObjcra.limit = viewObjcra.limit + 1;
            var oldData = table.cache[layTableId];
            // console.log(oldData);
            var tid = 'a' + new Date().valueOf();
            var newRow = { FNote: "", state: 0, FName: '', crsId: tid };
            oldData.push(newRow);
            viewObjcra.last = tid;

            oldData.push(newRow);
            // viewObjcra.last = tid;
            tablecrm.reload({
                data: oldData,
                limit: viewObjcra.limit
            });
        },
        updateRow: function (obj) {
            var oldData = table.cache[layTableId];
            // console.log(oldData);
            tablecrm.reload({
                data: oldData,
                limit: viewObjcra.limit
            });
        },
        removeEmptyTableCache: function () {
            var oldData = table.cache[layTableId];
            // console.log(oldData)
            for (var i = 0, row; i < oldData.length; i++) {
                row = oldData[i];
                if (!row || !row.crsId) {
                    oldData.splice(i, 1);    //删除一项
                }
                continue;
            }
            viewObjcra.last = oldData[oldData.length - 1].tempId;
            tablecrm.reload({
                data: oldData,
                limit: viewObjcra.limit
            });
        }
    }
    //激活事件
    var activeByType = function (type, arg) {
        if (arguments.length === 2) {
            active[type] ? active[type].call(this, arg) : '';
        } else {
            active[type] ? active[type].call(this) : '';
        }
    }
    //注册按钮事件
    $('.layui-btn[data-type]').on('click', function () {
        var type = $(this).data('type');
        activeByType(type);
    });
    //监听工具条
    table.on('tool(tableCpm)', function (obj) {
        var data = obj.data, event = obj.event, tr = obj.tr; //获得当前行 tr 的DOM对象;
        switch (event) {
            case "state":
                var stateVal = tr.find("input[name='state']").prop('checked') ? 1 : 0;
                $.extend(obj.data, { 'state': stateVal })
                activeByType('updateRow', obj.data);	//更新行记录对象
                break;
            case "del":
                if (viewObjcra.limit == 1) {
                    alert("删除失败，至少应有一条数据")
                } else {
                    viewObjcra.limit = viewObjcra.limit - 1;
                    layer.confirm('确定删除？', function (index) {
                        obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                        layer.close(index);
                        activeByType('removeEmptyTableCache');

                    });
                }
                break;
        }
    });
    table.on('edit(tableCpm)', function (obj) {
        var oldData = table.cache[layTableId];
        tablecrm.reload({
            data: oldData,
            limit: viewObjcra.limit
        });
    });


    form.on('select(CraftEntry_Nick)', function (data, e) {
        var elem = data.othis.parents('tr');
        var dataindex = elem.attr("data-index");
        $.each(tablelist, function (index, value) {
            if (value.LAY_TABLE_INDEX == dataindex) {
                value.CraftEntry_Name = data.value;
                if (data.elem.selectedOptions) {
                    value.CraftEntry_Nick = data.elem.selectedOptions[0].innerHTML;

                } else {
                    var elems = data.elem;
                    for (var i = 0; i < elems.length; i++) {
                        var elemnow = elems[i];
                        if (elemnow.selected) {
                            value.CraftEntry_Nick = elemnow.text;
                        }
                    }

                }
                if (value.crsId == viewObjcra.last && data.value != '') {
                    activeByType("add");
                }
            }
        });
    })
    // 工艺
    $.ajax({
        type: "GET",
        url: ajaxURl + '/Api/PSIBase/Process/GetList?keyword=0',
        success: function (res) {
            console.log(res)
            var data = res.Data;
            var isussecc = res.Succeed;
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    dateslit1.push(data[i]);
                }
                console.log(dateslit1)
                var oldData = table.cache[layTableId];
                tablecrm.reload({
                    data: oldData,
                    limit: viewObjcra.limit
                });
            }
        }
    })



    renderForm = function () {
        layui.use('form', function () {
            var form = layui.form;
            form.render();
            var oldData = table.cache[layTableId];
            console.log(oldData)
            tablecrm.reload({
                data: oldData,
                limit: viewObjcra.limit
            });
        });
    }



    function checklist() {
        $("#tablelist1 td[data-field='CraftEntry_Nick']").each(function () {
            var curnow = $(this);
            curnow.on("click", function () {
                console.log(dateslit1)
                $("#tablelist1 .layui-table-body").addClass("overvis");
                $("#tablelist1 .layui-table-box").addClass("overvis");
                $("#tablelist1 .layui-table-view").addClass("overvis");
            })
        })
    }



});




$(function () {

    $(".hignckick").on("click", function () {
        var _this = $(this)
        var type = _this.attr("data-type");
        if (type == 'daten') {
            _this.attr("data-type", "datey");
            $(".more").removeClass("hidden");
            $(".hignckick").html("收起")
        } else {
            _this.attr("data-type", "daten");
            $(".more").addClass("hidden");
            $(".hignckick").html("更多")
        }
    })
    $(document).on("click", function () {
        $("#tablelist1 .layui-table-body").addClass("overvis");
        $("#tablelist1 .layui-table-box").addClass("overvis");
        $("#tablelist1 .layui-table-view").addClass("overvis");
    })


    //工序汇报列表
    $(".checknum").on("click", function () {
        var _this = $(this);
        var date = _this.attr("data-type");
        if (date == 'daten') {
            $(".checknum").attr("data-type", "datey");
            $.ajax({
                type: "get",
                url: ajaxURl + "/Api/Manufacture/Report/GetList?keyword=0",
                success: function (res) {
                    console.log(res)
                    var isussecc = res.Succeed;
                    var data = res.Data;
                    if (isussecc) {
                        var html = '<option value="">全部</option>';
                        var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                        for (var i = 0; i < data.length; i++) {
                            html += '<option value="' + data[i].F_Id + '" data-mater="' + data[i].Report_Material + '">' + data[i].Report_Name + '</option>';
                            htmlsel += '<dd lay-value="' + data[i].F_Id + '" data-mater="' + data[i].Report_Material + '">' + data[i].Report_Name + '</dd>'
                        }
                        $("#Report_Name").html(html);
                        $(".checknum .layui-anim.layui-anim-upbit").html(htmlsel);
                        renderForm();
                        _this.find("select").next().find('.layui-select-title input').click();
                        // Customer_TaxRate 税率   
                    } else {
                        alert(res.Message)
                    }

                }
            })
        }
    })


    layui.form.on('select(num)', function (data) {
        console.log("chamge");
        var selectdata;
        if (data.value) {
            if (data.elem.selectedOptions) {
                selectdata = data.elem.selectedOptions[0].outerHTML;
            } else {
                var elems = data.elem;
                for (var i = 0; i < elems.length; i++) {
                    var elemnow = elems[i];
                    if (elemnow.selected) {
                        selectdata = elemnow.outerHTML
                    }
                }
            }
            var marterid = $(selectdata).attr("data-mater")
            getmater(marterid)
        }

    })

})


function getmater(id) {
    $.ajax({
        type: 'GET',
        url: ajaxURl + "/Api/PSIBase/Material/GetList?keyword=&PageIndex=&PageSize=",
        success: function (res) {
            console.log(res)
            var isussecc = res.Succeed;
            if (isussecc) {
                for (var i = 0; i < res.Data.length; i++) {
                    if (res.Data[i].F_Id == id) {
                        $("#maternick").val(res.Data[i].Material_Nick)
                        $("#matername").val(res.Data[i].Material_Name)
                    }
                }
            } else {
                alert(res.Message)
            }
        }
    })
}






