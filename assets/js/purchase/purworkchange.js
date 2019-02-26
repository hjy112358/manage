var first = new Date().valueOf();
var dateslit = [];
var materid = [], maternick = [], matername = []
var measureid = [], measurnick = [], materfid = []
var currfid = [], currnick = [];
window.viewObj = {
    tbData: [],
    limit: 1,
    last: first
};
var tableIns;
var upload, table;
var layTableId;
//layui 模块化引用
layui.use(['jquery', 'table', 'layer', "form", "layedit", "laydate", "upload"], function () {
    // 获取当天日期
    var myDate = new Date();
    var nowY = myDate.getFullYear();
    var nowM = myDate.getMonth() + 1;
    var nowD = myDate.getDate();
    var today = nowY + "-" + (nowM < 10 ? "0" + nowM : nowM) + "-" + (nowD < 10 ? "0" + nowD : nowD);

    var $ = layui.$;
    table = layui.table,
        form = layui.form,
        layer = layui.layer,
        laydate = layui.laydate,
        upload = layui.upload,
        element = layui.element;
    //日期
    laydate.render({
        elem: '#PurchaseOrder_DateTime',
        // value: today,
        isInitValue: true,
        btns: ['now', 'confirm']
    });
    //日期
    laydate.render({
        elem: '#PurchaseOrder_Deadline',
        // value: today,
        isInitValue: true,
        btns: ['now', 'confirm']
    });

    //数据表格实例化		
    layTableId = "layTable";
    tableIns = table.render({
        elem: '#dataTable',
        id: layTableId,
        data: viewObj.tbData,
        limit: viewObj.limit,
        page: false,
        loading: true,
        cols: [[
            { title: '序号', type: 'numbers' },
            {
                field: 'PurchaseOrderEntry_Material', title: '物料代码', width: '120', templet: function (d) {
                    if (d.PurchaseOrderEntry_Material) {
                        var index = materid.indexOf(d.PurchaseOrderEntry_Material)
                        if (index == '-1') {
                            return ''
                        } else {
                            return matername[index]
                        }
                    } else {
                        return ''
                    }
                }
            },
            {
                field: 'PurchaseOrderEntry_Material', title: '物料名称', width: '200', templet: function (d) {
                    if (d.PurchaseOrderEntry_Material) {
                        var index1 = materid.indexOf(d.PurchaseOrderEntry_Material)
                        if (index1 == '-1') {
                            return ''
                        } else {
                            return maternick[index1]
                        }
                    } else {
                        return ''
                    }
                }
            },
            { field: 'PurchaseOrderEntry_Specifications', title: '规格' },
            { field: 'PurchaseOrderEntry_Unit', title: '单位' },
            { field: 'PurchaseOrderEntry_Price', title: '价格', edit: 'text', width: '100' },
            { field: 'PurchaseOrderEntry_Quantity', title: '数量', width: '100' },
            { field: 'PurchaseOrderEntry_Amount', title: '总额', width: '100' },
            {
                field: 'PurchaseOrderEntry_Deadline', title: '交货日期', width: '100', align: "center", templet: function (d) {
                    var deadline = ""
                    if (d.PurchaseOrderEntry_Deadline) {
                        deadline = d.PurchaseOrderEntry_Deadline.split(" ")[0]
                    }
                    return '<input type="text" id="PurchaseOrderEntry_Deadline" verify lay-verify="verify" value="' + deadline + '"  autocomplete="off" class="layui-input layui-input-date"/>';
                }
            },
            { field: 'Currency_Nick', title: '币别', width: '100', templet: "#selectcrp" },
            { field: 'PurchaseOrderEntry_TaxRate', title: '税率', edit: 'text' },
            { field: 'PurchaseOrderEntry_ExRate', title: '汇率', edit: 'text' },
            { field: 'Rmark', title: '备注', edit: 'text' }
        ]],
        done: function (res) {
            console.log(res.data)
            viewObj.tbData = res.data;
            $(".layui-input-date").each(function (i) {
                layui.laydate.render({
                    elem: this,
                    format: "yyyy-MM-dd",
                    done: function (value, date) {
                        if (res && res.data[i]) {
                            $.extend(res.data[i], { 'PurchaseOrderEntry_Deadline': value })
                        }
                    }
                });
            });
            tableData = res.data;
            $('tr').each(function (e) {
                var $cr = $(this);
                var dataIndex = $cr.attr("data-index");
                $.each(tableData, function (index, value) {
                    if (value.LAY_TABLE_INDEX == dataIndex) {
                        // $cr.find('input').val(value.Material_Name);
                        var deadime = ""
                        if (value.PurchaseOrderEntry_Deadline) {
                            deadime = value.PurchaseOrderEntry_Deadline.split(" ")[0]
                        }
                        $cr.find('input[id="PurchaseOrderEntry_Deadline"]').val(deadime);
                        var index1 = currfid.indexOf(value.PurchaseOrderEntry_Currency)
                        if (index1 != '-1') {
                            value.Currency_Nick = currnick[index1]
                        } 
                        $cr.find('td[data-field="Currency_Nick"]').find("input").val(value.Currency_Nick);
                    }
                });
            });
        }
    });
    //定义事件集合
    var active = {
        // 更新每行数据
        updateRow: function () {
            var oldData = table.cache[layTableId];
            // console.log(oldData);
            tableIns.reload({
                data: oldData,
                limit: viewObj.limit
            });
        },
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
        console.log(obj)
        var dataindex = $(obj.tr).attr("data-index");
        if (obj.field == 'PurchaseOrderEntry_Price') {
            $.each(tableData, function (index, value) {
                if (value.LAY_TABLE_INDEX == dataindex) {
                    if (!$.isNumeric(obj.value)) {
                        value.PurchaseOrderEntry_Price = parseFloat(obj.value);
                    }
                    value.PurchaseOrderEntry_Amount = parseFloat(value.PurchaseOrderEntry_Price) * parseFloat(value.PurchaseApplyEntry_Quantity)
                }
            });
        }
        var oldData = table.cache[layTableId];
        tableIns.reload({
            data: oldData,
            limit: oldData.length
        });
    });
    // 获取单据编号
    // $.ajax({
    //     url: getnum,
    //     success: function (res) {
    //         if (res.Succeed) {
    //             $("#PurchaseOrder_Name").val(res.Data)
    //         } else {
    //             alert(res.Message)
    //         }
    //     }
    // })

    $(document).on("click", "td[data-field='Currency_Nick']", function () {
        var scrollHeight = $('#tableRes .layui-table-body.layui-table-main').prop("scrollHeight");
        var height = $('#tableRes .layui-table-body.layui-table-main').height() + scrollHeight;
        $('#tableRes .layui-table-body.layui-table-main').css("height", height)
    })
    layui.form.on('select(Currency_Nick)', function (data) {
        var elem = data.othis.parents('tr');
        var dataindex = elem.attr("data-index");
        $.each(tableData, function (index, value) {
            if (value.LAY_TABLE_INDEX == dataindex) {
                value.PurchaseOrderEntry_Currency = data.value
                if (data.elem.selectedOptions) {
                    value.Currency_Nick = data.elem.selectedOptions[0].innerHTML;
                    var elems = data.elem;
                    for (var i = 0; i < elems.length; i++) {
                        var elemnow = elems[i];
                        if (elemnow.selected) {
                            value.Currency_Nick = elemnow.text;
                        }
                    }

                }
            }
        });
        var oldData = table.cache[layTableId];
        tableIns.reload({
            data: oldData,
            limit: oldData.length
        });
    })


    renderForm = function () {
        layui.use('form', function () {
            var form = layui.form;
            form.render();
            var oldData = table.cache[layTableId];
            tableIns.reload({
                data: oldData,
                limit: oldData.length
            });
        });
    }


    var isSend = true;
    $(".sub").on("click", function () {
        var data = {};
        var oldData = table.cache[layTableId];
        if (!($(this).hasClass("disclick"))) {
            if (isSend) {
                var index = layer.load();
                var list = $("form").serializeArray();
                for (var j = 0; j < list.length; j++) {
                    console.log(list[j])
                    data[list[j].name] = list[j].value
                }
               
                data.Details = oldData;
                console.log(data)
                $.ajax({
                    type: "POST",
                    url: purchaseOrderEdit,
                    data: data,
                    success: function (res) {
                        console.log(res)
                        var isussecc = res.Succeed;
                        var data = res.Data;
                        if (isussecc) {
                            layer.close(index);
                            layer.msg("修改成功");
                            setInterval(function(){
                                window.location.reload()
                            },1000)
                        } else {
                            layer.close(index);
                            alert(res.Message)
                        }
                    },
                    error: function (res) {
                        layer.close(index);
                        alert(res.Message)
                    }
                })
            }
        }
    })



    var url = window.location.search;
    var fid = url.split("?")[1].split("=")[1]
    $.ajax({
        url: ajaxpurchaseone + fid,
        success: function (res) {
            console.log(res)
            if (res.Succeed) {
                var data = res.Data;
                $("#PurchaseOrder_ExRate").val(data.PurchaseOrder_ExRate)
                $("#PurchaseOrder_Name").val(data.PurchaseOrder_Name)
                $("#PurchaseOrder_TaxRate").val(data.PurchaseOrder_TaxRate)
                var datetime = ""
                if (data.PurchaseOrder_DateTime) {
                    datetime = data.PurchaseOrder_DateTime.split(" ")[0]
                }
                $("#PurchaseOrder_DateTime").val(datetime)
                var deadime = ""
                if (data.PurchaseOrder_Deadline) {
                    deadime = data.PurchaseOrder_Deadline.split(" ")[0]
                }
                $("#PurchaseOrder_Deadline").val(deadime)
                $("#F_Id").val(data.F_Id)
                getbillEm(data.PurchaseOrder_Biller, data.PurchaseOrder_Employee)
                getstatus(data.PurchaseOrder_Status)
                getsupplier(data.PurchaseOrder_Supplier)
                gettype(data.PurchaseOrder_Type)
                getmat(data.Details, data.PurchaseOrder_Currency)

            }
        }
    })


    // 制单人、业务员
    function getbillEm(bill, em) {
        $.ajax({
            type: "get",
            url: ajaxUsr,
            success: function (res) {
                //console.log(res)
                var isussecc = res.Succeed;
                if (isussecc) {
                    var data = res.Data;
                    var html = '<option value="">全部</option>';
                    var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                    for (var i = 0; i < data.length; i++) {
                        html += '<option value="' + data[i].F_Id + '" >' + data[i].User_Nick + '</option>';
                        htmlsel += '<dd lay-value="' + data[i].F_Id + '" >' + data[i].User_Nick + '</dd>'
                        var datanow = data[i];
                        if (datanow.F_Id == bill) {
                            $("#PurchaseOrder_Billername").val(datanow.User_Nick)

                        }

                    }
                    $("#PurchaseOrder_Biller").val(bill)
                    $("#PurchaseOrder_Employee").html(html);
                    $(".employees .layui-anim.layui-anim-upbit").html(htmlsel);
                    renderForm();
                    var select = 'dd[lay-value="' + em + '"]';
                    $('#PurchaseOrder_Employee').siblings("div.layui-form-select").find('dl').find(select).click();
                } else {
                    alert(res.Message)
                }
            }
        })
    }


    // 状态
    function getstatus(id) {
        $("#PurchaseOrder_Status").val(id)
        if (id == '10000') {
            $("#PurchaseOrder_Statusname").val('已保存')
        } else if (id == '11100') {
            $("#PurchaseOrder_Statusname").val('审核中')
        } else if (id == '11500') {
            $("#PurchaseOrder_Statusname").val('已审核')
        } else {
            $("#PurchaseOrder_Statusname").val('')
        }
    }

    // 供应商
    function getsupplier(id) {
        $.ajax({
            type: "get",
            url: ajaxsupplist,
            success: function (res) {
                var isussecc = res.Succeed;
                if (isussecc) {
                    var html = '<option value="">全部</option>';
                    var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                    var data = res.Data;
                    for (var i = 0; i < data.length; i++) {
                        var suppnow = data[i]
                        html += '<option value="' + suppnow.F_Id + '" >' + suppnow.Supplier_Nick + '</option>';
                        htmlsel += '<dd lay-value="' + suppnow.F_Id + '" >' + suppnow.Supplier_Nick + '</dd>'
                    }
                    $("#PurchaseOrder_Supplier").html(html);
                    $(".supplier .layui-anim.layui-anim-upbit").html(htmlsel);
                    renderForm();
                    var select = 'dd[lay-value="' + id + '"]';
                    $('#PurchaseOrder_Supplier').siblings("div.layui-form-select").find('dl').find(select).click();
                } else {
                    alert(res.Message)
                }

            }
        })
    }

    // 类型
    function gettype(id) {
        $.ajax({
            type: "get",
            url: ajaxchasetype,
            success: function (res) {
                var isussecc = res.Succeed;
                if (isussecc) {
                    var html = '<option value="">全部</option>';
                    var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                    var data = res.Data.Details;
                    for (var i = 0; i < data.length; i++) {
                        var typenow = data[i]
                        html += '<option value="' + typenow.F_Id + '" >' + typenow.DictionaryItem_Nick + '</option>';
                        htmlsel += '<dd lay-value="' + typenow.F_Id + '" >' + typenow.DictionaryItem_Nick + '</dd>'
                    }
                    $("#PurchaseOrder_Type").html(html);
                    $(".orderlist .layui-anim.layui-anim-upbit").html(htmlsel);
                    renderForm();
                    var select = 'dd[lay-value="' + id + '"]';
                    $('#PurchaseOrder_Type').siblings("div.layui-form-select").find('dl').find(select).click();
                } else {
                    alert(res.Message)
                }
            }
        })
    }

    function getmat(tabledata, currid) {
        // 物料
        $.ajax({
            url: ajaxMater,
            async: false,
            success: function (res) {
                var data = res.Data;
                var isussecc = res.Succeed;
                console.log(data)
                if (isussecc) {
                    for (var i = 0; i < data.length; i++) {
                        materid.push(data[i].F_Id)
                        maternick.push(data[i].Material_Nick)
                        matername.push(data[i].Material_Name)
                    }

                } else {
                    alert(res.Message)
                }
            }
        })

        // 计量单位  
        $.ajax({
            url: ajaxMea,
            async: false,
            success: function (res) {
                var data = res.Data;
                var isussecc = res.Succeed;
                console.log(data)
                if (isussecc) {
                    for (var i = 0; i < data.length; i++) {
                        measureid.push(data[i].Measure_Manufacture)
                        measurnick.push(data[i].Measure_Nick)
                        materfid.push(data[i].F_Id)
                    }

                } else {
                    alert(res.Message)
                }
            }
        })

        // 币别
        $.ajax({
            type: "get",
            async: false,
            url: ajaxCurrency,
            success: function (res) {
                var isussecc = res.Succeed;
                if (isussecc) {
                    var html = '<option value="">全部</option>';
                    var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                    var data = res.Data;
                    for (var i = 0; i < data.length; i++) {
                        var currnow = data[i]
                        currfid.push(currnow.F_Id)
                        currnick.push(currnow.Currency_Nick)
                        html += '<option value="' + currnow.F_Id + '" >' + currnow.Currency_Nick + '</option>';
                        htmlsel += '<dd lay-value="' + currnow.F_Id + '" >' + currnow.Currency_Nick + '</dd>'
                    }
                    $("#PurchaseOrder_Currency").html(html);
                    $(".currey .layui-anim.layui-anim-upbit").html(htmlsel);
                    renderForm();
                    var select = 'dd[lay-value="' + currid + '"]';
                    $('#PurchaseOrder_Currency').siblings("div.layui-form-select").find('dl').find(select).click();
                } else {
                    alert(data.Message)
                }
            }
        })

        tableIns.reload({
            data: tabledata,
            limit: tabledata.length
        });
    }
});







//多文件上传列表示例
var tablehead = $('#tablehead');
var tablebody = $('#tablebody');
var imgcount = 0;
var headhtml = "<tr><th>文件名</th><th>大小</th><th>操作</th></tr>";
var uploadListIns = upload.render({
    elem: '#testList',
    url: '/Api/PSIBase/FileInput/SetFile'
    , accept: 'file'
    , multiple: true
    , auto: false
    , bindAction: '#testListAction'
    , choose: function (obj) {
        //将每次选择的文件追加到文件队列
        var files = this.files = obj.pushFile();
        tablehead.html(headhtml)
        //读取本地文件 可多次追加
        obj.preview(function (index, file) {
            imgcount++;
            var tr = $(['<tr id="upload-' + index + '">'
                , '<td>' + file.name + '</td>'
                , '<td class="textc">' + (file.size / 1014).toFixed(1) + 'kb</td>'
                , '<td class="textc">'
                , '<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>'
                , '</td>'
                , '</tr>'].join(''));
            //删除选中
            tr.find('.demo-delete').on('click', function () {
                //删除对应的文件
                delete files[index];
                tr.remove();
                //清空，以免删除后出现同名文件不可选
                uploadListIns.config.elem.next()[0].value = '';
                imgcount--;
                if (imgcount == 0) {
                    tablehead.html("")
                }

            });
            // 上传文件到列表
            tablebody.append(tr);
        });
    }

});

