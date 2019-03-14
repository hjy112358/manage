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
var materid = [], maternick = [], meaid = [], meanick = []
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
            {
                field: 'SalesInvoiceEntry_Material', title: '物料', templet: function (d) {
                    var index = materid.indexOf(d.SalesInvoiceEntry_Material)
                    if (index == '-1') {
                        return ''
                    } else {
                        return maternick[index]
                    }
                }
            },
            // { field: 'StockBillEntry_Material', title: '客户料号', edit: 'text' },
            { field: 'SalesInvoiceEntry_Specifications', title: '规格型号' },
            {
                field: 'SalesInvoiceEntry_Unit', title: '单位', templet: function (d) {
                    if (d.SalesInvoiceEntry_Unit) {
                        var index1 = meaid.indexOf(d.SalesInvoiceEntry_Unit)
                        if (index1 == '-1') {
                            return d.SalesInvoiceEntry_Unit
                        } else {
                            return meanick[index1]
                        }
                    } else {
                        return ''
                    }

                }
            },
            { field: 'SalesInvoiceEntry_BatchNo', title: '批号' },
            { field: 'SalesInvoiceEntry_Quantity', title: '数量' },
            { field: 'SalesInvoiceEntry_Price', title: '单价' },
            {
                field: 'SalesInvoiceEntry_TaxPrice', title: '含税单价', templet: function (d) {
                    if (d.SalesInvoiceEntry_TaxPrice) {
                        var num = parseFloat(d.SalesInvoiceEntry_TaxPrice);
                        num = num.toFixed(2);
                    } else {
                        num = '0.00'
                    }
                    return num
                }
            },
            {
                field: 'SalesInvoiceEntry_Amount', title: '金额', templet: function (d) {
                    if (d.SalesInvoiceEntry_Amount) {
                        var num = parseFloat(d.SalesInvoiceEntry_Amount);
                        num = num.toFixed(2);
                    } else {
                        num = '0.00'
                    }
                    return num
                }
            },
            { field: 'SalesInvoiceEntry_ExRate', title: '税率(%)' },
            {
                field: 'SalesInvoiceEntry_Tax', title: '税额', templet: function (d) {
                    if (d.SalesInvoiceEntry_Tax) {
                        var num = parseFloat(d.SalesInvoiceEntry_Tax);
                        num = num.toFixed(2);
                    } else {
                        num = '0.00'
                    }

                    return num
                }
            },
            {
                field: 'total', title: '价税合计', templet: function (d) {
                    if (d.total) {
                        var num = parseFloat(d.total);
                        num = num.toFixed(2);
                    } else {
                        num = '0.00'
                    }

                    return num
                }
            },
            { field: 'SalesInvoiceEntry_Total', title: '开票金额' },
            // { field: 'FFetchDate', title: '源单单号'},
            { field: 'Remark', title: '备注', edit: 'text' },
            {
                field: 'F_Id', title: '操作', align: 'center', templet: function (d) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.F_Id + '">删除</a>';
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

    // 获取单据编号
    $.ajax({
        url: getnum,
        success: function (res) {
            if (res.Succeed) {
                $("#SalesInvoice_Name").val(res.Data)
            } else {
                alert(res.Message)
            }
        }
    })


    // 物料
    $.ajax({
        url: ajaxMater,
        success: function (res) {
            var data = res.Data;
            var isussecc = res.Succeed;
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    materid.push(data[i].F_Id)
                    maternick.push(data[i].Material_Nick)
                }

            }
        }
    })

    // 计量单位
    $.ajax({
        type: "GET",
        url: ajaxMea,
        success: function (res) {
            console.log(res)
            var data = res.Data;
            var isussecc = res.Succeed;
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    meaid.push(data[i].Measure_Manufacture)
                    meanick.push(data[i].Measure_Nick)
                }
            } else {
                alert(data.Message)
            }
        }
    })

    // 币别
    $.ajax({
        type: "get",
        url: ajaxCurrency,
        success: function (res) {
            var isussecc = res.Succeed;
            var data = res.Data;
            if (isussecc) {
                var html = '<option value="">请选择币别</option>';
                var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">请选择币别</dd>'
                for (var i = 0; i < data.length; i++) {
                    html += '<option value="' + data[i].F_Id + '">' + data[i].Currency_Nick + '</option>';
                    htmlsel += '<dd lay-value="' + data[i].F_Id + '">' + data[i].Currency_Nick + '</dd>'
                }
                $("#currency").html(html);
                $(".currency .layui-anim.layui-anim-upbit").html(htmlsel);
                renderForm();

            } else {
                alert(data.Message)
            }
        }
    })


    // 切换客户
    layui.form.on('select(seleccus)', function (data, e) {
        console.log(data)
        var cusnick, curr, rate;
        if (data.elem.selectedOptions) {
            cusnick = data.elem.selectedOptions[0].innerHTML;
            curr = data.elem.selectedOptions[0].attributes[2].value;
            rate = data.elem.selectedOptions[0].attributes[1].value;
            $("#SalesInvoice_TaxRate").val(rate)
            var select = 'dd[lay-value="' + curr + '"]';
            $('#currency').siblings("div.layui-form-select").find('dl').find(select).click();
        } else {
            var elems = data.elem;
            for (var i = 0; i < elems.length; i++) {
                var elemnow = elems[i];
                if (elemnow.selected) {
                    cusnick = elemnow.text;
                    curr = elemnow.attributes[2].value;
                    rate = elemnow.attributes[1].value;
                    $("#SalesInvoice_TaxRate").val(rate)
                    var select = 'dd[lay-value="' + curr + '"]';
                    $('#currency').siblings("div.layui-form-select").find('dl').find(select).click();
                }
            }
        }
        $.ajax({
            url: ajaxstockbionelist +  cusnick ,
            success: function (res) {
                console.log(res)
                if (res.Succeed) {
                    if (res.Data.length >= 1) {
                        $("#SalesInvoice_ExRate").val(res.Data[0].StockBill_ExRate)
                        $.ajax({
                            url: ajaxstockbillone + res.Data[0].F_Id,
                            success: function (result) {
                                console.log(result)
                                if (result.Succeed) {
                                    var data = result.Data.Details
                                    var totalprice = $("#SalesInvoice_Total").val();
                                    $.each(data, function (i, value) {
                                        value.SalesInvoiceEntry_Quantity = value.StockBillEntry_Quantity
                                        value.SalesInvoiceEntry_Price = value.StockBillEntry_Price
                                        value.SalesInvoiceEntry_Amount = value.StockBillEntry_Amount
                                        value.SalesInvoiceEntry_ExRate = value.StockBillEntry_ExRate
                                        value.SalesInvoiceEntry_BatchNo = value.StockBillEntry_BatchNo
                                        value.SalesInvoiceEntry_Unit = value.StockBillEntry_Unit
                                        value.SalesInvoiceEntry_Specifications = value.StockBillEntry_Specifications
                                        value.SalesInvoiceEntry_Material = value.StockBillEntry_Material
                                        value.F_Id = null
                                        // 含税单价=销售单价*（1+税率/100）
                                        value.SalesInvoiceEntry_TaxPrice = parseFloat(value.SalesInvoiceEntry_Price) * (1 + parseFloat(rate) / 100)
                                        // 价税合计=数量*含税单价
                                        value.total = parseFloat(value.SalesInvoiceEntry_Quantity) * parseFloat(value.SalesInvoiceEntry_TaxPrice)
                                        // 税额=未税金额*（税率/100）
                                        value.SalesInvoiceEntry_Tax = parseFloat(value.SalesInvoiceEntry_Amount) * (parseFloat(rate) / 100)
                                        if (totalprice >= value.SalesInvoiceEntry_Amount && totalprice != 0) {
                                            value.SalesInvoiceEntry_Total = value.SalesInvoiceEntry_Amount
                                            totalprice = parseFloat(totalprice) - parseFloat(value.SalesInvoiceEntry_Amount)
                                        } else {
                                            value.SalesInvoiceEntry_Total = totalprice
                                        }
                                    })
                                    tableIns.reload({
                                        data: data,
                                        limit: data.length
                                    })
                                }
                            }
                        })
                    } else {
                        tableIns.reload({
                            data: [],
                            limit: 1
                        })
                    }

                }
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
                url: ajaxCus,
                success: function (res) {

                    var isussecc = res.Succeed;
                    var data = res.Data;
                    if (isussecc) {
                        var html = '<option value="">全部</option>';
                        var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                        for (var i = 0; i < data.length; i++) {
                            html += '<option value="' + data[i].F_Id + '" data-rate="' + data[i].Customer_TaxRate + '" data-curr="' + data[i].Customer_Currency + '">' + data[i].Customer_Nick + '</option>';
                            htmlsel += '<dd lay-value="' + data[i].F_Id + '" data-rate="' + data[i].Customer_TaxRate + '" data-curr="' + data[i].Customer_Currency + '">' + data[i].Customer_Nick + '</dd>'
                        }
                        $("#checkprobegin").html(html);
                        $(".checkcus .layui-anim.layui-anim-upbit").html(htmlsel);
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

    // 制单人
    var mouser = $.cookie("Modify_User");
    var username = $.cookie("User_Nick")
    $("#SalesInvoice_Biller").val(mouser)
    $("#SalesInvoice_Billername").val(username)



    function renderForm() {
        layui.use('form', function () {
            var form = layui.form;
            form.render();
        });
    }


    $("#SalesInvoice_Total").on("blur", function () {
        var totalprice = $(this).val();
        var oldData = table.cache[layTableId];
        $.each(oldData, function (i, v) {
            if (v.SalesInvoiceEntry_Material) {
                if (totalprice >= v.StockBillEntry_Amount && totalprice != 0) {
                    v.SalesInvoiceEntry_Total = v.StockBillEntry_Amount
                    totalprice = parseFloat(totalprice) - parseFloat(v.StockBillEntry_Amount)
                } else {
                    v.SalesInvoiceEntry_Total = totalprice
                }
            }
        })
        tableIns.reload({
            data: oldData,
            limit: oldData.length
        });
    })

    // 保存
    $(".sub").on("click", function () {
        var indexlay = layer.load();
        var formlist = $("form").serializeArray()
        var oldData = table.cache[layTableId];
        var data = {}
        for (var j = 0; j < formlist.length; j++) {
            data[formlist[j].name] = formlist[j].value
        }

        data.Details = oldData
        console.log(data)
        $.ajax({
            type: "POST",
            url: ajaxaddinvo,
            data: data,
            success: function (res) {
                console.log(res)
                if (res.Succeed) {
                    layer.close(indexlay);
                    layer.msg("新增成功");
                    setInterval(function () {
                        window.location.reload()
                    }, 1000)
                } else {
                    alert(res.Message)
                }
            }

        })
        return false
    })


});



