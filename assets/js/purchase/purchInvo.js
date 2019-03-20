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
    laydate.render({
        elem: '#datepay',
        value: tody,
        isInitValue: true,
        btns: ['now', 'confirm']
    });
    
});

var dateslit = [];
var materid = [], maternick = [],meaid=[],meanick=[]
var currname=[],currnick=[],currnamshow=[],ratelist=[]
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
            { field: 'PurchaseInvoiceEntry_Material', title: '物料',width:150,align:"left",templet:function(d){
                var index = materid.indexOf(d.PurchaseInvoiceEntry_Material)
                if (index == '-1') {
                    return ''
                } else {
                    return maternick[index]
                }
            }},
            { field: 'PurchaseInvoiceEntry_Specifications', title: '规格型号',align:"left",width:100},
            { field: 'PurchaseInvoiceEntry_Unit', title: '单位' ,align:"center",width:100,templet:function(d){
                if(d.PurchaseInvoiceEntry_Unit){
                    var index1 = meaid.indexOf(d.PurchaseInvoiceEntry_Unit)
                    if (index1 == '-1') {
                        return d.PurchaseInvoiceEntry_Unit
                    } else {
                        return meanick[index1]
                    }
                }else{
                    return ''
                }
                
            }},
            { field: 'PurchaseInvoiceEntry_Currency', title: '币别' ,width:100,align:"center",templet:function(d){
                var index = currname.indexOf(d.PurchaseInvoiceEntry_Currency)
                if (index == '-1') {
                    return ''
                } else {
                    return currnick[index]
                }
            }},
            { field: 'PurchaseInvoiceEntry_BatchNo', title: '批号',width:100,align:"left" },
            { field: 'PurchaseInvoiceEntry_Quantity', title: '数量' ,width:100,align:"right"},
            { field: 'PurchaseInvoiceEntry_Price', title: '单价' ,width:100,align:"right"},
            { field: 'PurchaseInvoiceEntry_TaxPrice', title: '含税单价',width:100 ,align:"right", templet: function (d) {
                if (d.PurchaseInvoiceEntry_TaxPrice) {
                    var num = parseFloat(d.PurchaseInvoiceEntry_TaxPrice);
                    num = num.toFixed(2);
                } else {
                    num = ''
                }
                return num
            }},
            { field: 'PurchaseInvoiceEntry_Amount', title: '入库金额',width:100 ,align:"right", templet: function (d) {
                if (d.PurchaseInvoiceEntry_Amount) {
                    var num = parseFloat(d.PurchaseInvoiceEntry_Amount);
                    num = num.toFixed(2);
                } else {
                    num = ''
                }
                return num
            }},
            { field: 'PurchaseInvoiceEntry_ExRate', title: '汇率(%)',width:80 ,align:"right"},
            { field: 'PurchaseInvoiceEntry_TaxRate', title: '增值税率',width:80,align:"right"},
            { field: 'PurchaseInvoiceEntry_Tax', title: '税额',width:100 ,align:"right", templet: function (d) {   
                if (d.PurchaseInvoiceEntry_Tax) {
                    var num = parseFloat(d.PurchaseInvoiceEntry_Tax);
                    num = num.toFixed(2);
                } else {
                    num = ''
                }

                return num
            } },
            { field: 'total', title: '价税合计' ,width:100,align:"right", templet: function (d) {
                if (d.total) {
                    var num = parseFloat(d.total);
                    num = num.toFixed(2);
                } else {
                    num = ''
                }

                return num
            } },
            { field: 'PurchaseInvoiceEntry_Total', title: '实际开票',width:100 ,align:"right"},
            { field: 'Remark', title: '备注', edit: 'text',width:150 ,align:"left"},
            {
                field: 'F_Id', title: '操作', align: 'center',width:80, templet: function (d) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.F_Id + '">删除</a>';
                }
            }
        ]],
        done: function (res) {
            viewObj.tbData = res.data;
            var scrollHeight = $('#tableRes .layui-table-body.layui-table-main').prop("scrollHeight");
            $('#tableRes .layui-table-body.layui-table-main').animate({ scrollTop: scrollHeight }, 400);

            $(".layui-input-date").each(function (i) {
                layui.laydate.render({
                    elem: this,
                    format: "yyyy-MM-dd",
                    done: function (value) {
                        if (res && res.data[i]) {
                            $.extend(res.data[i], {'FFetchDate': value})
                        }
                    }
                });
            });
            tabledata = res.data;
            $('tr').each(function () {
                var $cr = $(this);
                var dataindex = $cr.attr("data-index");
                $.each(tabledata, function (value) {
                    if (value.LAY_TABLE_INDEX == dataindex) {
                        $cr.find('input').val(value.term);
                        $cr.find('input[name="FFetchDate"]').val(value.FFetchDate);
                    }
                });
            });
            $("#tablelist .layui-table-view .layui-table td[data-field='FMaterialName']").on("click", function () {
                var scrollHeight = $('#tableRes .layui-table-body.layui-table-main').prop("scrollHeight");
                $('#tableRes .layui-table-body.layui-table-main').animate({ scrollTop: scrollHeight}, 600);
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
            var newRow = { tempId: tid, term: "", FQty: "", date: "", FNote: "", state: 0, FMaterialName: ''};
            oldData.push(newRow);
            viewObj.last = tid;
            tableIns.reload({
                data: oldData,
                limit: viewObj.limit
            });
        },
        updateRow: function () {
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
        var data = obj.data;
        if(obj.event === 'del'){
                layer.confirm('真的删除行么', function(index){
                    $.ajax({
                        url:removestockbill,
                        data:{ F_Id: data.F_Id},
                        type:'post',
                        success:function(res){
                            if(res.Succeed===true){
                                obj.del();
                                layer.close(index);
                            }else{
                                layer.msg('删除失败！')
                            }
                        }
                    })
                layer.close(index)
            });
        }
    });
    table.on('edit(dataTable)', function (obj) {
        var value = obj.value //得到修改后的值
        ,data = obj.data //得到所在行所有键值
        ,field = obj.field; //得到字段
        layer.msg('[ID: '+ data.id +'] ' + field + ' 字段更改为：'+ value);
        var oldData = table.cache[layTableId];
        tableIns.reload({
            data: oldData,
            limit: viewObj.limit
        });
    });


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
                    materid.push(data[i].F_Id)
                    maternick.push(data[i].Material_Nick)
                }

            }
        }
    })

    // 	采购发票单号
    $.ajax({
        url: getnum,
        success: function (res) {
            if (res.Succeed) {
                $("#PurchaseInvoice_Name").val(res.Data)
            } else {
                alert(res.Message)
            }
        }
    })

    // 币别
    $.ajax({
        type: "get",
        url: ajaxCurrency,
        success: function (res) {
            var isussecc = res.Succeed;
            var rmbid,rate;
            if (isussecc) {
                var data = res.Data;
                var html = '<option value="">请选择币别</option>';
                var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">请选择币别</dd>'
                for (var i = 0; i < data.length; i++) {
                    var datanow=data[i]
                    if (datanow.Currency_Nick == '人民币') {
                        rmbid = datanow.F_Id;
                        rate = datanow.Currency_ExRate
                    }
                    currname.push(datanow.F_Id)  
                    currnick.push(datanow.Currency_Nick)
                    currnamshow.push(datanow.Currency_Name)
                    ratelist.push(datanow.Currency_ExRate)
                    html += '<option value="' + datanow.F_Id + '">' + datanow.Currency_Nick + '</option>';
                    htmlsel += '<dd lay-value="' + datanow.F_Id + '">' + datanow.Currency_Nick + '</dd>'
                }
                $("#currency").html(html);
                $(".currency .layui-anim.layui-anim-upbit").html(htmlsel);
                renderForm();
                var select = 'dd[lay-value="' + rmbid + '"]';
                $('#currency').siblings("div.layui-form-select").find('dl').find(select).click();
                $("#PurchaseInvoice_ExRate").val(rate)
            } else {
                alert(data.Message)
            }
        }
    })

    form.on('select(currency)', function (data) {
        var value = data.value;
        for (var k = 0; k < currname.length; k++) {
            var nowname = currname[k];
            var nowk = k;
            if (value == nowname) {
                $("#PurchaseInvoice_ExRate").val(ratelist[nowk])
            }
        }

    });

   // 切换客户
   layui.form.on('select(seleccus)', function (data, e) {
    console.log(data)
    var cusnick, curr, rate;
    if (data.elem.selectedOptions) {
        cusnick = data.elem.selectedOptions[0].innerHTML;
        curr = data.elem.selectedOptions[0].attributes[2].value;
        rate = data.elem.selectedOptions[0].attributes[1].value;
        $("#PurchaseInvoice_TaxRate").val(rate)
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
                $("#PurchaseInvoice_TaxRate").val(rate)
                var select = 'dd[lay-value="' + curr + '"]';
                $('#currency').siblings("div.layui-form-select").find('dl').find(select).click();
            }
        }
    }
    $.ajax({
        url: ajaxstockbionelist + cusnick ,
        success: function (res) {
            console.log(res)
            if (res.Succeed) {
                if (res.Data.length >= 1) {
                    $("#PurchaseInvoice_ExRate").val(res.Data[0].StockBill_ExRate)
                    $.ajax({
                        url: ajaxstockbillone + res.Data[0].F_Id,
                        success: function (result) {
                            console.log(result)
                            if (result.Succeed) {
                                var data = result.Data.Details
                                var stockbill=result.Data.F_Id
                                var totalprice = $("#PurchaseInvoice_Total").val();
                                var taxrate = $("#PurchaseInvoice_TaxRate").val();
                                $.each(data, function (i, value) {
                                   value.PurchaseInvoiceEntry_Quantity = value.StockBillEntry_Quantity 
                                   value.PurchaseInvoiceEntry_Price=value.StockBillEntry_Price
                                   value.PurchaseInvoiceEntry_Amount = value.StockBillEntry_Amount 
                                   value.PurchaseInvoiceEntry_ExRate= value.StockBillEntry_ExRate
                                   value.PurchaseInvoiceEntry_BatchNo =value.StockBillEntry_BatchNo 
                                   value.PurchaseInvoiceEntry_Unit= value.StockBillEntry_Unit
                                   value.PurchaseInvoiceEntry_Specifications =value.StockBillEntry_Specifications 
                                   value.PurchaseInvoiceEntry_Material =value.StockBillEntry_Material 
                                   value.PurchaseInvoiceEntry_Currency =value.StockBillEntry_Currency
                                   value.PurchaseInvoiceEntry_StockBill=stockbill
                                   value.F_Id = null
                                   value.PurchaseInvoiceEntry_TaxRate = taxrate
                                    // 含税单价=销售单价*（1+税率/100）
                                    value.PurchaseInvoiceEntry_TaxPrice = parseFloat(value.PurchaseInvoiceEntry_Price) * (1 + parseFloat(rate) / 100)
                                    // 价税合计=数量*含税单价
                                    value.total = parseFloat(value.PurchaseInvoiceEntry_Quantity) * parseFloat(value.PurchaseInvoiceEntry_TaxPrice)
                                    // 税额=未税金额*（税率/100）
                                    value.PurchaseInvoiceEntry_Tax = parseFloat(value.PurchaseInvoiceEntry_Amount) * (parseFloat(rate) / 100)
                                    if (totalprice >= value.PurchaseInvoiceEntry_Amount && totalprice != 0) {
                                        value.PurchaseInvoiceEntry_Total = value.PurchaseInvoiceEntry_Amount
                                        totalprice = parseFloat(totalprice) - parseFloat(value.PurchaseInvoiceEntry_Amount)
                                    } else {
                                        value.PurchaseInvoiceEntry_Total = totalprice
                                    }
                                })
                                console.log(data)
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

    // 供应商
    $(".supplier").on("click", function () {
        var _this = $(this);
        var date = _this.attr("data-type");
        if (date == 'daten') {
            $(".supplier").attr("data-type", "datey");
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
                            html += '<option value="' + data[i].F_Id + '" data-rate="' + data[i].Supplier_TaxRate + '" data-curr="' + data[i].Supplier_Currency + '">' + data[i].Supplier_Nick + '</option>';
                            htmlsel += '<dd lay-value="' + data[i].F_Id + '" data-rate="' + data[i].Supplier_TaxRate + '" data-curr="' + data[i].Supplier_Currency + '">' + data[i].Supplier_Nick + '</dd>'
                        }
                        $("#Supplier_Nick").html(html);
                        $(".supplier .layui-anim.layui-anim-upbit").html(htmlsel);
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
    $("#PurchaseInvoice_Biller").val(mouser)
    $("#PurchaseInvoice_Billername").val(username)


   
    function renderForm() {
        layui.use('form', function () {
            var form = layui.form;
            form.render();
        });
    }

    
    $("#PurchaseInvoice_Total").on("blur", function () {
        var totalprice = $(this).val();
        var oldData = table.cache[layTableId];
        $.each(oldData, function (i, v) {
            if (v.PurchaseInvoiceEntry_Material) {
                if (totalprice >= v.PurchaseInvoiceEntry_Amount && totalprice != 0) {
                    v.PurchaseInvoiceEntry_Total = v.PurchaseInvoiceEntry_Amount
                    totalprice = parseFloat(totalprice) - parseFloat(v.PurchaseInvoiceEntry_Amount)
                } else {
                    v.PurchaseInvoiceEntry_Total = totalprice
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
         var indexlay=layer.load();
        var formlist = $("form").serializeArray()
        var oldData = table.cache[layTableId];
        var data = {}
        for (var j = 0; j < formlist.length; j++) {
            data[formlist[j].name] = formlist[j].value
        }      
        data.Details = oldData
        $.ajax({
            type:"POST",
            url:purchaseAdd,
            data:data,
            success:function(res){
                if(res.Succeed){
                    layer.close(indexlay);
                    layer.msg("新增成功");
                    setInterval(function () {
                        window.location.reload()
                    }, 1000)
                }else{
                    layer.close(indexlay);
                    alert(res.Message)
                }
            }
        })
        return false
    })

});



