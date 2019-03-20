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
        data: [],
        limit: 1,
        page: false,
        loading: true,
        even: true,
        cols: [
            [{
                    title: '序号',
                    type: 'numbers'
                },
                {
                    field: 'PurchaseInvoiceEntry_Material',
                    title: '物料',
                    width: 150,
                    align: "left",
                    templet: function (d) {
                        var index = materid.indexOf(d.PurchaseInvoiceEntry_Material)
                        if (index == '-1') {
                            return ''
                        } else {
                            return maternick[index]
                        }
                    }
                },
                {
                    field: 'PurchaseInvoiceEntry_Specifications',
                    title: '规格型号',
                    align: "left",
                    width: 100
                },
                {
                    field: 'PurchaseInvoiceEntry_Unit',
                    title: '单位',
                    align: "center",
                    width: 100,
                    templet: function (d) {
                        if (d.PurchaseInvoiceEntry_Unit) {
                            var index1 = meaid.indexOf(d.PurchaseInvoiceEntry_Unit)
                            if (index1 == '-1') {
                                return d.PurchaseInvoiceEntry_Unit
                            } else {
                                return meanick[index1]
                            }
                        } else {
                            return ''
                        }
                    }
                },
                {
                    field: 'PurchaseInvoiceEntry_Currency',
                    title: '币别',
                    width: 100,
                    align: "center",
                    templet: function (d) {
                        var index = currname.indexOf(d.PurchaseInvoiceEntry_Currency)
                        if (index == '-1') {
                            return ''
                        } else {
                            return currnick[index]
                        }
                    }
                },
                {
                    field: 'PurchaseInvoiceEntry_BatchNo',
                    title: '批号',
                    width: 100,
                    align: "left"
                },
                {
                    field: 'PurchaseInvoiceEntry_Quantity',
                    title: '数量',
                    width: 100,
                    align: "right"
                },
                {
                    field: 'PurchaseInvoiceEntry_Price',
                    title: '单价',
                    width: 100,
                    align: "right"
                },
                {
                    field: 'PurchaseInvoiceEntry_TaxPrice',
                    title: '含税单价',
                    width: 100,
                    align: "right",
                    templet: function (d) {
                        if (d.PurchaseInvoiceEntry_TaxPrice) {
                            var num = parseFloat(d.PurchaseInvoiceEntry_TaxPrice);
                            num = num.toFixed(2);
                        } else {
                            num = ''
                        }
                        return num
                    }
                },
                {
                    field: 'PurchaseInvoiceEntry_Amount',
                    title: '入库金额',
                    width: 100,
                    align: "right",
                    templet: function (d) {
                        if (d.PurchaseInvoiceEntry_Amount) {
                            var num = parseFloat(d.PurchaseInvoiceEntry_Amount);
                            num = num.toFixed(2);
                        } else {
                            num = ''
                        }
                        return num
                    }
                },
                {
                    field: 'PurchaseInvoiceEntry_ExRate',
                    title: '汇率(%)',
                    width: 80,
                    align: "right"
                },
                {
                    field: 'PurchaseInvoiceEntry_TaxRate',
                    title: '增值税率',
                    width: 80,
                    align: "right"
                },
                {
                    field: 'PurchaseInvoiceEntry_Tax',
                    title: '税额',
                    width: 100,
                    align: "right",
                    templet: function (d) {
                        if (d.PurchaseInvoiceEntry_Tax) {
                            var num = parseFloat(d.PurchaseInvoiceEntry_Tax);
                            num = num.toFixed(2);
                        } else {
                            num = ''
                        }
                        return num
                    }
                },
                {
                    field: 'total',
                    title: '价税合计',
                    width: 100,
                    align: "right",
                    templet: function (d) {
                        if (d.total) {
                            var num = parseFloat(d.total);
                            num = num.toFixed(2);
                        } else {
                            num = ''
                        }
                        return num
                    }
                },
                {
                    field: 'PurchaseInvoiceEntry_Total',
                    title: '实际开票',
                    width: 100,
                    align: "right"
                },
                {
                    field: 'Remark',
                    title: '备注',
                    edit: 'text',
                    width: 150,
                    align: "left"
                },

            ]
        ],
        done: function (res) {
            tabledata = res.data;
        }
    });

    //定义事件集合
    var active = {
        updateRow: function () {
            var oldData = table.cache[layTableId];
            tableIns.reload({
                data: oldData,
                limit: oldData.length
            });
        },
        removeEmptyTableCache: function () {
            var oldData = table.cache[layTableId];
            for (var i = 0, row; i < oldData.length; i++) {
                row = oldData[i];
                if (!row || !row.tempId) {
                    oldData.splice(i, 1); //删除一项
                }
                continue;
            }
            tableIns.reload({
                data: oldData,
                limit: oldData.length
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
        var data = obj.data;
        if (obj.event === 'del') {
            layer.confirm('真的删除行么', function (index) {
                $.ajax({
                    url: removestockbill,
                    data: {
                        F_Id: data.F_Id
                    },
                    type: 'post',
                    success: function (res) {
                        if (res.Succeed === true) {
                            obj.del();
                            layer.close(index);
                        } else {
                            layer.msg('删除失败！')
                        }
                    }
                })
                layer.close(index)
            });
        }
    });
    table.on('edit(dataTable)', function (obj) {
        tableIns.reload({
            data: oldData,
            limit: oldData.length
        });
    });

     
    $("#PurchaseInvoice_Total").on("blur", function () {
        var totalprice = $(this).val();
        var oldData = table.cache[layTableId];
        $.each(oldData, function (i, v) {
                if (totalprice >= v.PurchaseInvoiceEntry_Amount && totalprice != 0) {
                    v.PurchaseInvoiceEntry_Total = v.PurchaseInvoiceEntry_Amount
                    totalprice = parseFloat(totalprice) - parseFloat(v.PurchaseInvoiceEntry_Amount)
                } else {
                    v.PurchaseInvoiceEntry_Total = totalprice
                }
        })
        tableIns.reload({
            data: oldData,
            limit: oldData.length
        });
    })
    function renderForm() {
        layui.use('form', function () {
            var form = layui.form;
            form.render();
        });
    }
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
        $.ajax({
            type: "POST",
            url: purchaseedit,
            data: data,
            success: function (res) {
                console.log(res)
                if (res.Succeed) {
                    layer.close(indexlay);
                    layer.msg("修改成功");
                } else {
                    layer.close(indexlay);
                    alert(res.Message)
                }
            }
        })
        return false
    })


    var suppernick = [],
        supperid = [],
        materid = [],
        maternick = [],
        meaid = [],
        meanick = [],
        currname = [],
        currnick = [],
        currnamshow = [],
        userid = [],
        usernick = []

    var layerindex = layer.load()
    var url = window.location.search;
    var fid = url.split("?")[1].split("=")[1]
    $.ajax({
        type: "GET",
        url: purchasedetail + fid,
        success: function (res) {
            if (res.Succeed) {
                var data = res.Data;
                getcurrey(data.PurchaseInvoice_Currency, data.Details)
                getsupper(data.PurchaseInvoice_Supplier)
                getbill(data.PurchaseInvoice_Biller)
                $("#F_Id").val(data.F_Id)
                var datetime = ""
                if (data.PurchaseInvoice_DateTime) {
                    datetime = data.PurchaseInvoice_DateTime.split(" ")[0]
                }
                $("#PurchaseInvoice_DateTime").val(datetime)
                var deadline = ""
                if (data.PurchaseInvoice_Deadline) {
                    deadline = data.PurchaseInvoice_Deadline.split(" ")[0]
                }
                $("#PurchaseInvoice_Deadline").val(deadline)
                $("#PurchaseInvoice_ExRate").val(data.PurchaseInvoice_ExRate)
                $("#PurchaseInvoice_Name").val(data.PurchaseInvoice_Name)
                $("#PurchaseInvoice_Total").val(data.PurchaseInvoice_Total)
                $("#Remark").val(data.Remark)
                setInterval(function () {
                    layer.close(layerindex)
                }, 1500)
            } else {
                alert(res.Message)
            }
        }
    })

    $(".add").on("click", function () {
        parent.newpurchaseinvo();
    })

    // 币别
    function getcurrey(id,detail) {
        $.ajax({
            type: "get",
            url: ajaxCurrency,
            success: function (res) {
                var isussecc = res.Succeed;
                var rmbid, rate;
                if (isussecc) {
                    var data = res.Data;
                    var html = '<option value="">请选择币别</option>';
                    var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">请选择币别</dd>'
                    for (var i = 0; i < data.length; i++) {
                        var datanow = data[i]
                        currname.push(datanow.F_Id)
                        currnick.push(datanow.Currency_Nick)
                        html += '<option value="' + datanow.F_Id + '">' + datanow.Currency_Nick + '</option>';
                        htmlsel += '<dd lay-value="' + datanow.F_Id + '">' + datanow.Currency_Nick + '</dd>'
                    }
                    $("#currency").html(html);
                    $(".currency .layui-anim.layui-anim-upbit").html(htmlsel);
                    renderForm();
                    var select = 'dd[lay-value="' + id + '"]';
                    $('#currency').siblings("div.layui-form-select").find('dl').find(select).click();
                    tableIns.reload({
                        data: detail,
                        limit: detail.length
                    });
                } else {
                    alert(data.Message)
                }
            }
        })
    }

    // 供应商
    function getsupper(id) {
        $.ajax({
            type: "get",
            url: ajaxSupplier,
            success: function (res) {
                var isussecc = res.Succeed;
                var data = res.Data;
                if (isussecc) {
                    var html = '<option value="">全部</option>';
                    var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                    for (var i = 0; i < data.length; i++) {
                        html += '<option value="' + data[i].F_Id + '" >' + data[i].Supplier_Nick + '</option>';
                        htmlsel += '<dd lay-value="' + data[i].F_Id + '">' + data[i].Supplier_Nick + '</dd>'
                    }
                    $("#Supplier_Nick").html(html);
                    $(".supplier .layui-anim.layui-anim-upbit").html(htmlsel);
                    renderForm();
                    var select = 'dd[lay-value="' + id + '"]';
                    $('#Supplier_Nick').siblings("div.layui-form-select").find('dl').find(select).click();
                } else {
                    alert(res.Message)
                }

            }
        })
    }
    // 制单员
    function getbill(id) {
        $.ajax({
            type: "get",
            url: ajaxUsr,
            success: function (res) {
                var isussecc = res.Succeed;
                var data = res.Data;
                if (isussecc) {
                    for (var i = 0; i < data.length; i++) {
                        var datanow = data[i]
                        if (datanow.F_Id == id) {
                            $("#PurchaseInvoice_Billername").val(datanow.User_Nick)
                            $("#PurchaseInvoice_Biller").val(datanow.F_Id)
                        }
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

});