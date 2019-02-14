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
    // 收款日期
    laydate.render({
        elem: '#datepay',
        value: tody,
        isInitValue: true,
        btns: ['now', 'confirm']
    });
});

var dateslit = [];
var first = new Date().valueOf();
window.viewObj = {
    tbData: [{
        tempId: first,
        term: '',
        FQty: '',
        FNote: '',
        state: 0,
        FFetchDate: '',
        FMaterialName: ''
    }],
    limit: 1,
    last: first
};
var tableIns;
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
    var layTableId = "layTable";
    tableIns = table.render({
        elem: '#dataTable',
        id: layTableId,
        data: viewObj.tbData,
        limit: viewObj.limit,
        page: false,
        loading: true,
        even: true,
        cols: [[
            { title: '序号', type: 'numbers' },
            { field: 'term', title: '物料', templet: '#selectTool' },
            { field: 'FQty', title: '客户料号', edit: 'text' },
            { field: 'FNote', title: '规格型号', edit: 'text' },
            { field: 'FNote', title: '单位', edit: 'text' },
            { field: 'FNote', title: '数量', edit: 'text' },
            { field: 'FNote', title: '单价', edit: 'text' },
            { field: 'FNote', title: '含税单价', edit: 'text' },
            { field: 'FNote', title: '金额', edit: 'text' },
            { field: 'FNote', title: '税率(%)', edit: 'text' },
            { field: 'FNote', title: '税额', edit: 'text' },
            { field: 'FNote', title: '价税合计', edit: 'text' },
            {field: 'FFetchDate', title: '源单单号', edit: 'text' },
            { field: 'FNote', title: '备注', edit: 'text' },
            {
                field: 'tempId', title: '操作', align: 'center', templet: function (d) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.tempId + '">删除</a>';
                }
            }
        ]],
        done: function (res, curr, count) {
            viewObj.tbData = res.data;
            var scrollHeight = $('#tableRes .layui-table-body.layui-table-main').prop("scrollHeight");
            $('#tableRes .layui-table-body.layui-table-main').animate({ scrollTop: scrollHeight }, 400);
            $(".layui-input-date").each(function (i) {
                layui.laydate.render({
                    elem: this,
                    format: "yyyy-MM-dd",
                    done: function (value, date) {
                        if (res && res.data[i]) {
                            $.extend(res.data[i], { 'FFetchDate': value })
                        }
                    }
                });
            });
            tabledata = res.data;
            $('tr').each(function (e) {
                var $cr = $(this);
                var dataindex = $cr.attr("data-index");
                $.each(tabledata, function (index, value) {
                    if (value.LAY_TABLE_INDEX == dataindex) {
                        $cr.find('input').val(value.term);
                        $cr.find('input[name="FFetchDate"]').val(value.FFetchDate);
                    }
                });
            });
            $("#tablelist .layui-table-view .layui-table td[data-field='FMaterialName']").on("click", function () {
                console.log(1);
                var scrollHeight = $('#tableRes .layui-table-body.layui-table-main').prop("scrollHeight");
                $('#tableRes .layui-table-body.layui-table-main').animate({ scrollTop: scrollHeight }, 600);
            })
        }
    });

    //定义事件集合
    var active = {
        add: function () {	//添加一行
            viewObj.limit = viewObj.limit + 1;
            var oldData = table.cache[layTableId];
            // console.log(oldData);
            var tid = new Date().valueOf();
            var newRow = { tempId: tid, term: "", FQty: "", date: "", FNote: "", state: 0, FMaterialName: '' };
            oldData.push(newRow);
            viewObj.last = tid;
            tableIns.reload({
                data: oldData,
                limit: viewObj.limit
            });
        },
        updateRow: function (obj) {
            var oldData = table.cache[layTableId];
            // console.log(oldData);
            tableIns.reload({
                data: oldData,
                limit: viewObj.limit
            });
        },
        removeEmptyTableCache: function () {
            var oldData = table.cache[layTableId];
            // console.log(oldData)
            for (var i = 0, row; i < oldData.length; i++) {
                row = oldData[i];
                if (!row || !row.tempId) {
                    oldData.splice(i, 1);    //删除一项
                }
                continue;
            }
            viewObj.last = oldData[oldData.length - 1].tempId;
            tableIns.reload({
                data: oldData,
                limit: viewObj.limit
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
    table.on('tool(dataTable)', function (obj) {
        var data = obj.data, event = obj.event, tr = obj.tr; //获得当前行 tr 的DOM对象;
        console.log('监听工具条');
        console.log(data);
        switch (event) {
            case "state":
                var stateVal = tr.find("input[name='state']").prop('checked') ? 1 : 0;
                $.extend(obj.data, { 'state': stateVal })
                activeByType('updateRow', obj.data);	//更新行记录对象
                break;
            case "del":
                if (viewObj.limit == 1) {
                    alert("删除失败，至少应有一条数据")
                } else {
                    viewObj.limit = viewObj.limit - 1;
                    layer.confirm('确定删除？', function (index) {
                        obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                        layer.close(index);
                        activeByType('removeEmptyTableCache');

                    });
                }
                break;
        }
    });
    table.on('edit(dataTable)', function (obj) {
        var oldData = table.cache[layTableId];
        // console.log(oldData)
        // if (!$.isNumeric(obj.value)) {
        //     for (var i = 0; i < oldData.length; i++) {
        //         var datenow = oldData[i];
        //         if (datenow.tempId === obj.data.tempId) {
        //             datenow.dates = "";
        //             layer.alert("请输入数字");
        //         }
        //     }
        // }
        // if (obj.data.tempId == viewObj.last) {
        //     activeByType("add");
        // }
        tableIns.reload({
            data: oldData,
            limit: viewObj.limit
        });
    });
   
    var lastid;
   
    // 新增
    $(".add").on("click", function () {
      window.location.reload()
    })

  
   
    // 物料
    $.ajax({
        url: ajaxMater,
        success: function (res) {
            var data = res.Data;
            var isussecc = res.Succeed;
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                   
                }
               
            }
        }
    })

   
    // 币别
    $(".currency").on("click", function () {
        var _this = $(this);
        var date = _this.attr("data-type");
        if (date == 'daten') {
            $(".currency").attr("data-type", "datey");
            $.ajax({
                type: "get",
                url: ajaxCurrency,
                success: function (res) {
                    var isussecc = res.Succeed;
                    var data =res.Data;
                    if (isussecc) {
                        var html = '<option value="">请选择币别</option>';
                        var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">请选择币别</dd>'
                        for (var i = 0; i < data.length; i++) {
                            html += '<option value="' + data[i].Currency_Name+ '">' + data[i].Currency_Nick + '</option>';
                            htmlsel += '<dd lay-value="' +data[i].Currency_Name + '">' + data[i].Currency_Nick + '</dd>'
                        }
                        $("#currency").html(html);
                        $(".currency .layui-anim.layui-anim-upbit").html(htmlsel);
                        renderForm();
                        _this.find("select").next().find('.layui-select-title input').click();
                    } else {
                        alert(data.Message)
                    }
                }
            })
        }
    })

    // 切换客户
    layui.form.on('select(seleccus)', function (data, e) {
        console.log(data)
        var cusid=data.value;
        $.ajax({
            url:ajaxstockbionelist+'keyword='+cusid+'&PageSize=&PageIndex=',
            success:function(res){
                console.log(res)
            }
        })
     })
 
     // 客户--
     $(".checkcus").on("click", function () {
        var _this = $(this);
        var date = _this.attr("data-type");
        if (date == 'daten') {
            $(".checkcus").attr("data-type", "datey");
            $.ajax({
                type: "get",
                url:ajaxCus,
                success: function (res) {

                    var isussecc = res.Succeed;
                    var data = res.Data;
                    if (isussecc) {
                        var html = '<option value="">全部</option>';
                        var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                        for (var i = 0; i < data.length; i++) {
                            html += '<option value="' + data[i].F_Id + '" data-rate="' + data[i].Customer_TaxRate + '">' + data[i].Customer_Nick + '</option>';
                            htmlsel += '<dd lay-value="' + data[i].F_Id + '" data-rate="' + data[i].Customer_TaxRate + '">' + data[i].Customer_Nick + '</dd>'
                        }
                        $("#checkprobegin").html(html);
                        $(".checkcus .layui-anim.layui-anim-upbit").html(htmlsel);
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


    function renderForm() {
        layui.use('form', function () {
            var form = layui.form;
            form.render();
        });
    }



     // 保存
     $(".sub").on("click", function () {
        console.log(datelist)
        return false
    })


});



