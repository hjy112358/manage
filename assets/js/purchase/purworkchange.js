var first = new Date().valueOf();
var dateslit = [];
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
        value: today,
        isInitValue: true,
        btns: ['now', 'confirm']
    });
    //日期
    laydate.render({
        elem: '#PurchaseOrder_Deadline',
        value: today,
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
            { field: 'unit', title: '单位' },
            { field: 'PurchaseOrderEntry_Price', title: '价格', edit: 'text' , width: '100'},
            { field: 'PurchaseOrderEntry_Quantity', title: '数量', width: '100' },
            { field: 'PurchaseOrderEntry_Amount', title: '总额' , width: '100'},
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
            { field: 'Rmark', title: '备注', edit: 'text' },
            {
                field: 'F_Id', title: '操作', align: 'center', templet: function (d) {
                    // return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.F_Id + '">删除</a>';
                    return '<a class="layui-btn layui-btn-xs layui-btn-danger" onclick=del("' + d.F_Id + '")>删除</a>';

                }
            }
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
                        $cr.find('input[id="PurchaseOrderEntry_Deadline"]').val(value.PurchaseOrderEntry_Deadline);
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

    // 单号
    $(".chaselist").on("click", function () {
        var _this = $(this);
        var date = _this.attr("data-type");
        if (date == 'daten') {
            $(".chaselist").attr("data-type", "datey");
            $.ajax({
                type: "get",
                url: purchaseOrderlist,
                success: function (res) {
                    console.log(res)
                    var isussecc = res.Succeed;
                    var data = res.Data;
                    if (isussecc) {
                        var html = '<option value="">全部</option>';
                        var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                        for (var i = 0; i < data.length; i++) {
                            html += '<option value="' + data[i].F_Id + '" >' + data[i].PurchaseApply_Name + '</option>';
                            htmlsel += '<dd lay-value="' + data[i].F_Id + '" >' + data[i].PurchaseApply_Name + '</dd>'
                        }
                        $("#chaselist").html(html);
                        $(".chaselist .layui-anim.layui-anim-upbit").html(htmlsel);
                        renderForm();
                        _this.find("select").next().find('.layui-select-title input').click();
                    } else {
                        alert(res.Message)
                    }

                }
            })
        }
    })
    // 物料
    $.ajax({
        url: ajaxMater,
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
            }
        }
    })
    // 计量单位
    $.ajax({
        url: ajaxMea,
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
            }
        }
    })
    var materid = [], maternick = [], matername = []
    var measureid = [], measurnick = [], materfid = [];

    // 切换单号
    layui.form.on('select(chaseorder)', function (data) {
        if (data.value != '') {
            $.ajax({
                type: "get",
                url: purchaseDetails + data.value,
                success: function (res) {
                    // console.log(res)
                    var isussecc = res.Succeed;

                    if (isussecc) {
                        var data = res.Data;
                        console.log(data)
                        if (data.Details) {
                            // console.log(data.Children)
                            // 数据对应
                            $.each(data.Details, function (index, value) {
                                value.PurchaseOrderEntry_Quantity = value.PurchaseApplyEntry_Quantity
                                value.PurchaseOrderEntry_Specifications = value.PurchaseApplyEntry_Specifications
                                value.PurchaseOrderEntry_Unit = value.PurchaseApplyEntry_Unit
                                if (value.PurchaseApplyEntry_Deadline) {
                                    var dealinetime = value.PurchaseApplyEntry_Deadline.split(" ")[0]
                                    value.PurchaseOrderEntry_Deadline = dealinetime
                                } else {
                                    value.PurchaseOrderEntry_Deadline = $("#PurchaseOrder_Deadline").val()
                                }

                                value.PurchaseOrderEntry_Material = value.PurchaseApplyEntry_Material
                                var index = measureid.indexOf(value.PurchaseApplyEntry_Unit)
                                if (index != '-1') {
                                    value.unit = measurnick[index]
                                } else {
                                    value.unit = value.PurchaseApplyEntry_Unit
                                }

                                var exrate = $("#PurchaseOrder_ExRate").val()
                                var taxrate = $("#PurchaseOrder_TaxRate").val()
                                var curr = $("#PurchaseOrder_Currency").val()
                                if (value.PurchaseApplyEntry_TaxRate) {
                                    value.PurchaseOrderEntry_TaxRate = value.PurchaseApplyEntry_TaxRate
                                } else {
                                    value.PurchaseOrderEntry_TaxRate = taxrate
                                }
                                if (value.PurchaseApplyEntry_ExRate) {
                                    value.PurchaseOrderEntry_ExRate = value.PurchaseApplyEntry_ExRate
                                } else {
                                    value.PurchaseOrderEntry_ExRate = exrate
                                }
                                if (value.PurchaseApplyEntry_Currency) {
                                    value.PurchaseOrderEntry_Currency = value.PurchaseApplyEntry_Currency
                                    var index1 = currname.indexOf(value.PurchaseApplyEntry_Currency)
                                    if (index1 != '-1') {
                                        value.Currency_Nick = currnick[index1]
                                    } 
                                } else {
                                    value.PurchaseOrderEntry_Currency = curr
                                    var index2 = currname.indexOf(curr)
                                    if (index2 != '-1') {
                                        value.Currency_Nick = currnick[index2]
                                    } 
                                }
                            })
                            tableIns.reload({
                                data: data.Details,
                                limit: data.Details.length
                            });
                        }

                    } else {
                        alert(res.Message)
                    }
                }
            })
        }
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

    // 制单人
 

    // 业务员
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
                    var datanow = data[i];
                    html += '<option value="' + datanow.F_Id + '">' + datanow.User_Nick + '</option>';
                    htmlsel += '<dd lay-value="' + datanow.F_Id + '" >' + datanow.User_Nick + '</dd>';
                }
                $("#PurchaseOrder_Employee").html(html);
                $(".employees .layui-anim.layui-anim-upbit").html(htmlsel);
                renderForm()
                var select = 'dd[lay-value="' + mouser + '"]';
                $('#PurchaseOrder_Employee').siblings("div.layui-form-select").find('dl').find(select).click();
            } else {
                alert(res.Message)
            }
        }
    })
    var currname = [], currnick = [], currnamshow = [], ratelist = []
    // 币别--
    $.ajax({
        type: "get",
        url: ajaxCurrency,
        success: function (res) {
            var isussecc = res.Succeed;
            var data = res.Data;
            var rmbid = '';
            var rate = "";
            if (isussecc) {
                var html = '<option value="">请选择币别</option>';
                var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">请选择币别</dd>'
                for (var i = 0; i < data.length; i++) {
                    dateslit.push(data[i])
                    var datanow = data[i];
                    if (datanow.Currency_Nick == '人民币') {
                        rmbid = datanow.F_Id;
                        rate = datanow.Currency_ExRate
                    }
                    html += '<option value="' + datanow.F_Id + '" >' + datanow.Currency_Nick + '</option>';
                    htmlsel += '<dd lay-value="' + datanow.F_Id + '">' + datanow.Currency_Nick + '</dd>'
                    currname.push(datanow.F_Id)
                    currnick.push(datanow.Currency_Nick)
                    currnamshow.push(datanow.Currency_Name)
                    ratelist.push(datanow.Currency_ExRate)
                }
                $("#PurchaseOrder_Currency").html(html);
                $(".currey .layui-anim.layui-anim-upbit").html(htmlsel);
                renderForm();
                var select = 'dd[lay-value="' + rmbid + '"]';
                $('#PurchaseOrder_Currency').siblings("div.layui-form-select").find('dl').find(select).click();
                $("#PurchaseOrder_ExRate").val(rate)

            } else {
                alert(res.Message)
            }
        }
    })
    // 切换币别
    form.on('select(currlist)', function (data) {
        var value = data.value;
        for (var k = 0; k < currname.length; k++) {
            var nowname = currname[k];
            var nowk = k;
            if (value == nowname) {
                // viewObj.currtype = nowname;
                // viewObj.rate = ratelist[nowk]
                $("#PurchaseOrder_ExRate").val(ratelist[nowk])
                // var oldData = table.cache[layTableId];
                // $.each(tabledata, function (index, value) {
                //     if (value.currchange == 0) {
                //         value.SalesOrderEntry_Currency = viewObj.currtype
                //         // value.SalesOrderEntry_ExRate = viewObj.rate
                //     }
                // });
                // tableIns.reload({
                //     data: oldData,
                //     limit: viewObj.limit
                // });
            }
        }

    });

    // 单据类型
    $(".orderlist").on("click", function () {
        var _this = $(this);
        var date = _this.attr("data-type");
        if (date == 'daten') {
            $(".orderlist").attr("data-type", "datey");
            $.ajax({
                type: "get",
                url: ajaxchasetype,
                success: function (res) {
                    console.log(res)
                    var isussecc = res.Succeed;
                    var data = res.Data.Details;
                    if (isussecc) {
                        var html = '<option value="">全部</option>';
                        var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                        for (var i = 0; i < data.length; i++) {
                            html += '<option value="' + data[i].F_Id + '">' + data[i].DictionaryItem_Nick + '</option>';
                            htmlsel += '<dd lay-value="' + data[i].F_Id + '">' + data[i].DictionaryItem_Nick + '</dd>'
                        }
                        $("#PurchaseOrder_Type").html(html);
                        $(".orderlist .layui-anim.layui-anim-upbit").html(htmlsel);
                        renderForm();
                        _this.find("select").next().find('.layui-select-title input').click();
                    } else {
                        alert(res.Message)
                    }

                }
            })
        }
    })

    // 供应商
    $(".supplier").on("click", function () {
        var _this = $(this);
        var date = _this.attr("data-type");
        if (date == 'daten') {
            $(".supplier").attr("data-type", "datey");
            $.ajax({
                type: "get",
                url: ajaxsupplist,
                success: function (res) {
                    console.log(res)
                    var isussecc = res.Succeed;
                    var data = res.Data;
                    if (isussecc) {
                        var html = '<option value="">全部</option>';
                        var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                        for (var i = 0; i < data.length; i++) {
                            html += '<option value="' + data[i].F_Id + '" data-rate="' + data[i].Supplier_TaxRate + '">' + data[i].Supplier_Nick + '</option>';
                            htmlsel += '<dd lay-value="' + data[i].F_Id + '" data-rate="' + data[i].Supplier_TaxRate + '">' + data[i].Supplier_Nick + '</dd>'
                        }
                        $("#PurchaseOrder_Supplier").html(html);
                        $(".supplier .layui-anim.layui-anim-upbit").html(htmlsel);
                        renderForm();
                        _this.find("select").next().find('.layui-select-title input').click();

                    } else {
                        alert(res.Message)
                    }

                }
            })
        }
    })
    // 切换供应商
    form.on('select(supper)', function (data) {
        console.log(data);
        var rate = ''
        if (data.value) {
            if (data.elem.selectedOptions) {
                rate = data.elem.selectedOptions[0].attributes[1].value;
            } else {
                var elems = data.elem;
                for (var i = 0; i < elems.length; i++) {
                    var elemnow = elems[i];
                    if (elemnow.selected) {
                        rate = elemnow.attributes[1].value;
                    }
                }

            }
            $("#PurchaseOrder_TaxRate").val(rate);
            $.each(tableData, function (index, value) {
                if (value.PurchaseOrderEntry_Material && value.PurchaseOrderEntry_TaxRate == '') {
                    value.PurchaseOrderEntry_TaxRate = rate;
                }
            });
        }
        var oldData = table.cache[layTableId];
        console.log(oldData)
        tableIns.reload({
            data: oldData,
            limit: oldData.length
        });

    })
    // 保存
    var isSend = true;
    $(".sub").on("click", function () {
        // var data = {};
        // var oldData = table.cache[layTableId];
        // if (!($(this).hasClass("disclick"))) {
        //     if (isSend) {
        //         var index = layer.load();
              
        //         var list = $("form").serializeArray();
        //         for (var j = 0; j < list.length; j++) {
        //             console.log(list[j])
        //             data[list[j].name] = list[j].value
        //         }
        //         data.Details = oldData;
        //         console.log(data)
        //         $.ajax({
        //             type: "POST",
        //             url: purchaseOrderAdd,
        //             data: data,
        //             success: function (res) {
        //                 console.log(res)
        //                 var isussecc = res.Succeed;
        //                 var data = res.Data;
        //                 if (isussecc) {
        //                     layer.close(index);
        //                     layer.msg("新增成功");
        //                     setInterval(function(){
        //                         window.location.reload()
        //                     },1000)
        //                 } else {
        //                     layer.close(index);
        //                     alert(res.Message)
        //                 }
        //             },
        //             error: function (res) {
        //                 layer.close(index);
        //                 alert(res.Message)
        //             }
        //         })
        //     }
        // }
    })
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

