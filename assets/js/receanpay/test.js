var first = new Date().valueOf();
var dateslit = [];
var materid = [], maternick = [], matername = []
var measureid = [], measurnick = [], materfid = [];
var currname = [], currnick = [], currnamshow = [], ratelist = []
window.viewObj = {
    tbData: [],
    limit: 1,
    last: first
};
var tableIns;
var upload, table;
var layTableId;
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
var isBox = false; // 定义一个触发焦点事件的开关，默认为不开启状态 || 也可以给input设置一个属性，来判断
var isenter = true;//是否是点击事件
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
            { field: 'PurchaseOrderEntry_Specifications', title: '规格', width: '100' },
            { field: 'unit', title: '单位' },
            { field: 'PurchaseOrderEntry_Price', title: '价格', edit: 'text', width: '100' },
            { field: 'PurchaseOrderEntry_Quantity', title: '数量', width: '100' },
            {
                field: 'PurchaseOrderEntry_Amount', title: '总额', width: '100', templet: function (d) {
                    if (d.PurchaseOrderEntry_Amount) {
                        return d.PurchaseOrderEntry_Amount.toFixed(2)
                    } else {
                        return ''
                    }
                }
            },
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
                    return '<a class="layui-btn layui-btn-xs layui-btn-danger" onclick=del("' + d.F_Id + '")>删除</a>';
                }
            }
        ]],
        done: function (res) {

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
                $.each(res.data, function (index, value) {
                    if (value.LAY_TABLE_INDEX == dataIndex) {
                        $cr.find('input[id="PurchaseOrderEntry_Deadline"]').val(value.PurchaseOrderEntry_Deadline);
                        $cr.find('td[data-field="Currency_Nick"]').find("input").val(value.Currency_Nick);
                    }
                });
            });
            //    return false
        }
    });
    //定义事件集合
    var active = {
        // 更新每行数据
        updateRow: function () {
            var oldData = table.cache[layTableId];

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
                        _this.find("select").next().find('.layui-select-title input').focus()
                    } else {
                        alert(res.Message)
                    }

                }
            })
        }
    })

    // 客户--
    // $(".checkcus").on("click", function () {
    //     var _this = $(this);
    //     var date = _this.attr("data-type");
    //     if (date == 'daten') {
    //         $(".checkcus").attr("data-type", "datey");
    //         $.ajax({
    //             type: "get",
    //             url: ajaxCus,
    //             success: function (res) {
    //                 var isussecc = res.Succeed;
    //                 var data = res.Data;
    //                 if (isussecc) {
    //                     var html = '<option value="">全部</option>';
    //                     var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
    //                     for (var i = 0; i < data.length; i++) {
    //                         var datanow = data[i]
    //                         html += '<option value="' + datanow.F_Id + '" >' + datanow.Customer_Nick + '</option>';
    //                         htmlsel += '<dd lay-value="' + datanow.F_Id + '" >' + datanow.Customer_Nick + '</dd>'
    //                     }
    //                     $("#Customer_Nick").html(html);
    //                     $(".checkcus .layui-anim.layui-anim-upbit").html(htmlsel);
    //                     renderForm();
    //                     _this.find("select").next().find('.layui-select-title input').click();
    //                     _this.find("select").next().find('.layui-select-title input').focus()
    //                     // Customer_TaxRate 税率   
    //                 } else {
    //                     alert(res.Message)
    //                 }

    //             }
    //         })
    //     }
    // })

    $(".changeinputlist").hide();
    $(".changeinput").focus(function () { // input绑定焦点事件，触发时打开焦点开关
        isBox = true;
        var _this = $(this)
        _this.bind("propertychange change  input paste", function () {
            var requestMsg = $(this).val()
            console.log(isenter)
            if (isenter) {
                var changethis = $(this)
                // var html = '<li class="active">123</li>' +
                //     '<li>123456</li>' +
                //     '<li>123456789</li>' +
                //     '<li>1234567890</li>';
                // changethis.siblings(".changeinputlist").show();
                // changethis.siblings(".changeinputlist ").html(html);
                // getdata()
                $.ajax({
                    type: "get",
                    url: ajaxCus + requestMsg,
                    success: function (res) {
                        console.log(res)
                        var isussecc = res.Succeed;
                        if (isussecc) {
                            var data = res.Data;
                            if (data.length == 0) {
                                changethis.siblings(".changeinputlist ").html("<span class='noData'>无匹配项</span>");
                            } else {
                                var html = ''
                                for (var i = 0; i < data.length; i++) {
                                    var datanow = data[i]
                                    if (i == 0) {
                                        html += '<li data-id="' + datanow.F_Id + '" class="active">' + datanow.Customer_Nick + '</option>';
                                    } else {
                                        html += '<li data-id="' + datanow.F_Id + '" >' + datanow.Customer_Nick + '</option>';
                                    }
                                }
                                // html += '</ul>'
                                changethis.siblings(".changeinputlist ").html(html);
                            }

                            changethis.siblings(".changeinputlist").show();
                        } else {
                            $(".changeinputlist ").html("");
                            changethis.siblings(".changeinputlist").show();
                            alert(res.Message)
                        }
                    }
                })
            }else{
                isenter=true;
            }
        });
    });
    $(".checkcus").mousemove(function () { // 鼠标进入input-box区域内打开焦点开关
        isBox = true;
    });
    $(".checkcus").mouseout(function () { // 鼠标离开input-box区域内关闭焦点开关
        isBox = false;
    });
    $(".changeinput").blur(function () { // input失去焦点时通过焦点开关状态判断鼠标所在区域
        console.log("blur")
        if (isBox == true) return false;
        $(this).siblings(".changeinputlist").hide();
    });
    $(".craftwork").on("mousedown", ".changeinputlist li", function () { //点击事件
        var _this = $(this)
        isBox = false;
        var text = $(_this).text();
        _this.parent().siblings(".changeinput").val(text);
        _this.parent().hide()
    })
    $(".craftwork").on("hover", '.changeinputlist li', function () {
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
    })
    $(".changeinput").keydown(function (event) {//键盘上下键以及回车键
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == 38) {  //up
            moveSelect(event, -1);
        }
        else if (event.keyCode == 40) {//down
            moveSelect(event, 1);
        } else if (event.keyCode == 13) {
            isenter = false
            checkselect(event)
        }
    });

});


// 上下键
function moveSelect(event, step) {
    var list = $(event.target).siblings(".changeinputlist").find("li")
    var i = 0;
    var length = list.length
    $.each(list, function (index, v) {
        if ($(v).hasClass("active")) {
            var activeindex = $(v).index()
            if (step == -1) {
                if (activeindex <= 0) {
                    activeindex = 0
                } else {
                    activeindex = activeindex * 1 - 1
                }
            } else {
                if (activeindex >= length) {
                    activeindex = length
                } else {
                    activeindex = activeindex * 1 + 1
                }
            }
            $(event.target).siblings(".changeinputlist").find("li").eq(activeindex).addClass("active").siblings().removeClass("active");
            return false
        } else {
            if (++i == length) {
                $(event.target).siblings(".changeinputlist").find("li").eq(0).addClass("active").siblings().removeClass("active");
                return false;
            }
        }
    })
}

// enter
function checkselect(event) {
    var list = $(event.target).siblings(".changeinputlist").find("li")
    var i = 0;
    var length = list.length
    $.each(list, function (index, v) {
        if ($(v).hasClass("active")) {
            var activeindex = $(v).index()
            var text = $(event.target).siblings(".changeinputlist").find("li").eq(activeindex).text();
            $(v).parent().siblings(".changeinput").val(text);
            $(v).parent().hide()
            return false
        } else {
            if (++i == length) {
                console.log('隐藏')
                var text = $(event.target).siblings(".changeinputlist").find("li").eq(0).text();
                $(v).parent().siblings(".changeinput").val(text);
                $(v).parent().hide()
                return false;
            }
        }
    })
    return false
}
function getdata() {
    console.log("获取数据")
}

// 弹窗数据
function getablelist(url, type, tableTitle, clickElem) {
    console.log(tableTitle)
    $(".searchupdata").attr("data-elem",clickElem)
    $(".searchupdata").attr("data-type",type)
    $(".searchupdata").attr("data-url",url)
    $(".searchupdata").attr("data-tableTitle",tableTitle)
    var str;
    $(".termask").removeClass("hidden")
    var title = "选择" + tableTitle
    $(".masktitle").html(title)
    $.ajax({
        url: url,
        success: function (res) {
            console.log(res)
            if (res.Succeed) {
                if (type == 'custom') {
                    str = [
                        { title: '序号', type: 'radio' },
                        { field: 'Customer_Nick', title: '客户名称', align: 'left' },
                        { field: 'Customer_Name', title: '客户代码', align: 'left' },
                        { field: 'Currency_Nick', title: '币别', align: 'left' },
                        { field: 'Customer_TaxNo', title: '	税务登记号', align: 'left' },
                        { field: 'Customer_TaxRate', title: '增值税率', align: 'right' },
                    ]
                }
                dialogtable(str, res.Data, clickElem, type)
            }
        }
    })
}

$(".searchupdata").on("click",function(){
    var param=$("#param").val()
    var clickelem=$(".searchupdata").attr("data-elem")
    var type=$(".searchupdata").attr("data-type")
    var title=$(".searchupdata").attr("data-tableTitle")
    var url=$(".searchupdata").attr("data-url")+param
    getablelist(url,type,title,clickelem)

})



// 弹窗
function dialogtable(str, datalist, clickElem, type) {
    var renderForm1, tableData1
    layui.use(['jquery', 'table', 'layer', "form", "layedit", "laydate", "upload"], function () {
        var $ = layui.$;
        table = layui.table,
            form = layui.form,
            layer = layui.layer,
            laydate = layui.laydate
        //数据表格实例化		
        tablepop = table.render({
            elem: '#dataTable1',
            id: "poplist",
            data: datalist,
            limit: 10,
            page: true,
            loading: true,
            cols: [str],
            done: function (res) {
                console.log(res)
            }
        });
        //定义事件集合
        var active = {
            // 更新每行数据
            updateRow: function () {
                var oldData = table.cache["poplist"];
                tablepop.reload({
                    data: oldData,
                    limit: viewObj.limit
                });
            },
            getCheckData: function () { //获取选中数据
                var checkStatus = table.checkStatus('poplist')
                    , data = checkStatus.data;
                console.log(data)
                if (type == 'custom') {
                    if (data.length >= 1) {
                        $("#" + clickElem).val(data[0].Customer_Nick)
                    }

                }
                closemark()
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
            switch (event) {
                case "state":
                    var stateVal = tr.find("input[name='state']").prop('checked') ? 1 : 0;
                    $.extend(obj.data, { 'state': stateVal })
                    activeByType('updateRow', obj.data);	//更新行记录对象
                    break;
            }
        });


        renderForm1 = function () {
            layui.use('form', function () {
                var form = layui.form;
                form.render();
                var oldData = table.cache["poplist"];
                tablepop.reload({
                    data: oldData,
                    limit: oldData.length
                });
            });
        }

        $(".cancel").on("click", function () {
            closemark()
        })

        closemark = function () {
            $(".termask").addClass("hidden")
            $(".terform")[0].reset();
        }

    });
}