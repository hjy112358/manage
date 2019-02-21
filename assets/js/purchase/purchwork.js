
// 添加列表数据
var dataList = [];
var token = $.cookie("token");
// 记录id号
var currentId = [];
// 物料集合
var currentNike = [];
// 税率集合
var ratelAdd = [];
// 号码集合
var currentName = [];
// var first = new Date().valueOf();
// 数据源
var tData = [];
// var tempid = [];
var temip = [];
function getTid(i) {
    return (new Date().valueOf()) + i
}
for (var i = 0; i < 5; i++) {
    var k = i
    temip.push(getTid(k))
}


// 向下添加对应表头
for (var i = 0; i < 5; i++) {
    var data = {
        tempId: temip[i],
        state: 0,
        Material_Name: '',//物料编号
        Material_Nick: '',//物料名称
        PurchaseOrderEntry_Material: '',//物料id
        PurchaseOrderEntry_Specifications : '',//销售规格
        PurchaseOrderEntry_Unit: '',//单位
        PurchaseOrderEntry_Quantity: '',//数量    数量=未税金额/销售单价
        PurchaseOrderEntry_Price: '',//销售单价
        PurchaseOrderEntry_Amount: '',//未税金额 数量*销售单价
        PurchaseOrderEntry_TaxRate: "",//税率 
        PurchaseOrderEntry_Tax: "",//税额 PurchaseOrderEntry_Tax=PurchaseInvoiceEntry_Total-PurchaseInvoiceEntry_Amount
        PurchaseOrderEntry_TaxPrice: "",//含税单价 (税率  / 100 * 销售单价) + 销售单价
        PurchaseOrderEntry_Total: '',//价税合计  价税合计=未税金额*(1+税率/100)
        PurchaseOrderEntry_ExRate: '1',//汇率
        PurchaseOrderEntry_Deadline: "",//交货日期
        PurchaseOrderEntry_Project:'',//项目
    }
    tData.push(data);

}
window.viewObj = {
    tbData: tData,
    limit: 5,
    last: temip[4]
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
        elem: '#date',
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
            { field: 'Material_Name', title: '<span style="color:red">*  </span>物料', templet: '#selectTool', width: '120' },
            { field: 'Material_Nick', title: '客户料号', width: '200' },
            { field: 'PurchaseOrderEntry_Specifications', title: '规格' },
            { field: 'PurchaseOrderEntry_Unit', title: '计量单位' },
            { field: 'PurchaseOrderEntry_Name', title: '批号' },
            { field: 'PurchaseOrderEntry_Quantity', title: '数量' },
            { field: 'PurchaseOrderEntry_DateTime', title: '收货时间', edit: 'text' },
            { field: 'PurchaseOrderEntry_StartTime', title: '发货时间', templet: '#selectstock' },
            { field: 'PurchaseOrderEntry_Project', title: '项目', templet: '#selectstock' },
            { field: 'Rmark', title: '备注', edit: 'text' },
            {
                field: 'F_Id', title: '操作', align: 'center', templet: function (d) {
                    // return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.F_Id + '">删除</a>';
                    return '<a class="layui-btn layui-btn-xs layui-btn-danger" onclick=del("' + d.F_Id + '")>删除</a>';

                }
            }
        ]],
        done: function (res) {
            // console.log(res.data)
            viewObj.tbData = res.data;
            prolist();
            $(".layui-input-date").each(function (i) {
                layui.laydate.render({
                    elem: this,
                    format: "yyyy-MM-dd",
                    done: function (value, date) {
                        if (res && res.data[i]) {
                            console.log("up")
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
                        $cr.find('input').val(value.Material_Name);
                        $cr.find('input[id="PurchaseOrderEntry_Deadline"]').val(value.PurchaseOrderEntry_Deadline);

                    }
                });
            });


        }
    });


    //定义事件集合
    var active = {
        add: function () {	
            //不足时向下添加一行
            viewObj.limit = viewObj.limit + 1;
            var oldData = table.cache[layTableId];
            // console.log(oldData);
            var tid = new Date().valueOf();
            // 向下添加表头定义
            var newRow = {
                tempId: tid,
                state: 0,
                Material_Name: '',//物料代码
                Material_Nick: '',//物料名称
                PurchaseOrderEntry_Material: '',//物料--物料id
                PurchaseOrderEntry_Specifications : '',//销售规格
                PurchaseOrderEntry_Unit: '',//单位
                PurchaseOrderEntry_Quantity: '',//数量    数量=未税金额/销售单价
                PurchaseOrderEntry_Price: '',//销售单价
                PurchaseOrderEntry_Amount: '',//未税金额 数量*销售单价
                PurchaseOrderEntry_TaxRate: "",//税率 
                PurchaseOrderEntry_Tax: "",//税额 PurchaseOrderEntry_Tax=PurchaseInvoiceEntry_Total-PurchaseInvoiceEntry_Amount
                PurchaseOrderEntry_TaxPrice: "",//含税单价 (税率  / 100 * 销售单价) + 销售单价
                PurchaseOrderEntry_Total: '',//价税合计  价税合计=未税金额*(1+税率/100)
                PurchaseOrderEntry_ExRate: viewObj.rate,//汇率
                PurchaseOrderEntry_Deadline: "",//交货日期
                PurchaseOrderEntry_Project:'',//项目
                Remark: '',//备注
                // PurchaseOrderEntry_PurchaseInvoice: ''
            };
            oldData.push(newRow);
            viewObj.last = tid;
            tableIns.reload({
                data: oldData,
                limit: viewObj.limit
            });
        },
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
    
   // 下拉渲染表格
    var htmlterm = '';
    var arrlist = [];
    var arri = {};
    function prolist() {
        $(".productworktable td[data-field='Material_Name']").each(function () {
            var curnow = $(this);
            curnow.on("click", function () {
                // console.log(1);
                // option渲染
                var scrollHeight = $('#tableRes .layui-table-body.layui-table-main').prop("scrollHeight");
                var height = $('#tableRes .layui-table-body.layui-table-main').height() + scrollHeight + 80;
                $('#tableRes .layui-table-body.layui-table-main').css("height", height)
                var _this = $(this);
                // data-index
                var dataIndex = _this.parents("tr").attr("data-index");
                _this.find(".checkmater").addClass("layui-form-selected")
                var date = $(".productworktable").attr("data-type");
                if (date == 'daten') {
                    $(".productworktable").attr("data-type", "datey");
                    $("#tableRes").find("tr").each(function (i, v) {
                        var nowtr = v;
                        var nowindex = $(v).attr("data-index");
                        if (dataIndex != nowindex) {
                            $(nowtr).find(".selectlist").addClass("hidden");
                        } else {
                            $(nowtr).find(".selectlist").removeClass("hidden");
                            $(nowtr).find(".dateload").removeClass("hidden")
                            $(nowtr).find(".datelist").addClass("hidden")
                        }
                    });
                    $.ajax({
                        url: ajaxMater,
                        success: function (res) {
                            console.log(res)
                            $(".dateload").addClass("hidden")
                            $(".datelist").removeClass("hidden")
                            var data = res.Data;
                            console.log(data)
                            var isussecc = res.Succeed;
                            if (isussecc) {
                                for (var i = 0; i < data.length; i++) {
                                    var dataNow = data[i];
                                    htmlterm += '<li data-name="' + (dataNow.Material_Name || '') + '" data-nick="' + (dataNow.Material_Nick || '') + '" data-spe="' + (dataNow.Material_Specifications || '') + '" data-materme="' + (dataNow.Material_Measure || '') + '" data-materid="' + (dataNow.F_Id || '') + '"><p>' + (dataNow.Material_Name || '') + '</p><p>' + (dataNow.Material_Nick || '') + '</p><p>' + (dataNow.Material_Specifications || '') + '</p></li>'
                                    arri = { materame: (dataNow.Material_Name || ''), maternick: (dataNow.Material_Nick || ''), matersp: (dataNow.Material_Specifications || ''), matermea: (dataNow.Material_Measure || ''), materid: (dataNow.F_Id || '') };
                                    arrlist.push(arri)
                                }
                                $(".selectlist ul").html(htmlterm);
                                $(".materName").on("keyup", function () {
                                    var searchVal = $(this).val();
                                    var showList = [];
                                    var searchlist = '';
                                    //将匹配项显示，不匹配项隐藏
                                    $.each(arrlist, function (index, item) {
                                        if ((item.materame && item.materame.indexOf(searchVal) != -1) || (item.maternick && item.maternick.indexOf(searchVal) != -1) || (item.matersp && item.matersp.indexOf(searchVal) != -1)) {
                                            showList.push(item);
                                        } else {

                                        }
                                    })
                                    for (var j = 0; j < showList.length; j++) {
                                        var shownow = showList[j]
                                        searchlist += '<li data-name="' + shownow.materame + '" data-nick="' + shownow.maternick + '" data-spe="' + shownow.matersp + '" data-materme="' + shownow.materme + '" data-materid="' + shownow.materid + '"><p>' + shownow.materame + '</p><p>' + shownow.maternick + '</p><p>' + shownow.matersp + '</p></li>'
                                    }
                                    if (showList.length == 0) {
                                        searchlist = '<div style="text-align:center;padding:15px 10px 15px 0; ">暂无数据</div>'
                                    }
                                    $(".selectlist ul").html("");
                                    $(".selectlist ul").html(searchlist);

                                })
                                $('.selectlist ul').find('li').each(function () {
                                    var _this1 = $(this);
                                    _this1.hover(function () {
                                        $(this).addClass("active").siblings().removeClass("active")
                                    });
                                    _this1.on("click", function () {
                                        var oldData = table.cache[layTableId];
                                        var name = $(this).attr("data-name");
                                        var nick = $(this).attr("data-nick");
                                        var specife = $(this).attr("data-spe");
                                        var measure = $(this).attr("data-materme");
                                        var marid = $(this).attr("data-materid")
                                        $(".materName").val(name || '');
                                        var rate = $("#PurchaseOrderEntry_TaxRate").val();//税率
                                        var project = $("#PurchaseOrderEntry").val();
                                        var sendDate = $("#sendDate").val();//交货日期
                                        $.each(tableData, function (index, value) {
                                            if (value.LAY_TABLE_INDEX == dataIndex) {
                                                value.Material_Name = name || "";
                                                value.Material_Nick = nick || "";
                                                value.PurchaseOrderEntry_Specifications  = specife || "";//销售规格
                                                value.PurchaseOrderEntry_Material = marid || "";//物料id
                                                value.PurchaseOrderEntry_Unit = measure;//单位
                                                value.PurchaseOrderEntry_Quantity = 1;//数量=未税金额/销售单价
                                                value.PurchaseOrderEntry_Price = 0.00;//销售单价
                                                value.PurchaseOrderEntry_TaxRate = rate || '16';//税率
                                                value.PurchaseOrderEntry_Deadline = sendDate || '';//交货日期
                                                value.PurchaseOrderEntry_TaxPrice = 0;//含税单价
                                                value.PurchaseOrderEntry_Amount = 0;//未税金额=数量*销售单价
                                                value.PurchaseOrderEntry_Total = 0;//价税合计
                                                value.PurchaseOrderEntry_Tax = 0;//税额=合计-金额
                                                value.PurchaseOrderEntry_Project=project || "";
                                                if (value.tempId == viewObj.last) {
                                                    activeByType("add");
                                                } else {
                                                    var oldData = table.cache[layTableId];
                                                    tableIns.reload({
                                                        data: oldData,
                                                        limit: viewObj.limit
                                                    });
                                                }
                                            }
                                        });
                                        $(".selectlist").addClass("hidden");
                                        $(".checkmater").removeClass("layui-form-selected");
                                        return false
                                    })
                                })
                            }else{
                                alert(res.Message)
                            }

                        }
                    })
                } else {
                    $(".selectlist ul").html(htmlterm);
                    $("#tableRes").find("tr").each(function (i, v) {
                        var nowtr = v;
                        var nowindex = $(v).attr("data-index");
                        if (dataIndex != nowindex) {
                            $(nowtr).find(".selectlist").addClass("hidden");
                        } else {
                            $(nowtr).find(".selectlist").removeClass("hidden");
                            $(nowtr).find(".dateload").addClass("hidden")
                            $(nowtr).find(".datelist").removeClass("hidden")
                        }
                    });

                    $(".materName").on("keyup", function () {
                        var searchVal = $(this).val();
                        var showList = [];
                        var searchlist = '';
                        //将和所输入的字符串匹配的项存入showList
                        $.each(arrlist, function (index, item) {
                            if ((item.materame && item.materame.indexOf(searchVal) != -1) || (item.maternick && item.maternick.indexOf(searchVal) != -1) || (item.matersp && item.matersp.indexOf(searchVal) != -1)) {
                                showList.push(item);
                            } else {

                            }
                        })

                        for (var j = 0; j < showList.length; j++) {
                            var shownow = showList[j]
                            searchlist += '<li data-name="' + shownow.materame + '" data-nick="' + shownow.maternick + '" data-spe="' + shownow.matersp + '" data-maMaterial_Namee="' + shownow.matermea + '"><p>' + shownow.materame + '</p><p>' + shownow.maternick + '</p><p>' + shownow.matersp + '</p></li>'
                        }
                        if (showList.length == 0) {
                            searchlist = '<div style="text-align:center;padding:15px 10px 15px 0; ">暂无数据</div>'
                        }
                        $(".selectlist ul").html("");
                        $(".selectlist ul").html(searchlist);
                        $("#tableRes").find("tr").each(function (i, v) {
                            var nowtr = v;
                            var nowindex = $(v).attr("data-index");
                            if (dataIndex != nowindex) {
                                $(nowtr).find("selectlist").addClass("hidden")
                            }
                        });

                    })
                    $('.selectlist ul').find('li').each(function () {
                        var _this1 = $(this);
                        _this1.hover(function () {
                            $(this).addClass("active").siblings().removeClass("active")
                        });
                        _this1.on("click", function () {
                            var oldData = table.cache[layTableId];
                            // console.log(oldData)
                            var name = $(this).attr("data-name");
                            var nick = $(this).attr("data-nick");
                            var specife = $(this).attr("data-spe");
                            var measure = $(this).attr("data-materme");
                            var marid = $(this).attr("data-materid")
                            $(".materName").val(name || '');
                            var rate = $("#PurchaseOrderEntry_TaxRate").val();//税率
                            var project = $("#PurchaseOrderEntry").val();
                            var sendDate = $("#sendDate").val();//交货日期
                            $.each(tableData, function (index, value) {
                                // console.log(value)
                                if (value.LAY_TABLE_INDEX == dataIndex) {
                                    value.Material_Name = name || "";
                                    value.Material_Nick = nick || "";
                                    value.PurchaseOrderEntry_Specifications  = specife || "";//销售规格
                                    value.PurchaseOrderEntry_Material = marid || "";//物料id
                                    value.PurchaseOrderEntry_Unit = measure;//单位
                                    value.PurchaseOrderEntry_Quantity = 1;//数量=未税金额/销售单价
                                    value.PurchaseOrderEntry_Price = 0.00;//销售单价
                                    value.PurchaseOrderEntry_TaxRate = rate || '16';//税率
                                    value.PurchaseOrderEntry_Deadline = sendDate || '';//交货日期
                                    value.PurchaseOrderEntry_TaxPrice = 0;//含税单价
                                    value.PurchaseOrderEntry_Amount = 0;//未税金额=数量*销售单价
                                    value.PurchaseOrderEntry_Total = 0;//价税合计
                                    value.PurchaseOrderEntry_Tax = 0;//税额=合计-金额
                                    value.PurchaseOrderEntry_Project=project || "";
                                    if (value.tempId == viewObj.last) {
                                        activeByType("add");
                                    } else {
                                        var oldData = table.cache[layTableId];
                                        tableIns.reload({
                                            data: oldData,
                                            limit: viewObj.limit
                                        });
                                    }
                                }
                            });
                            //将匹配项显示，不匹配项隐藏
                            $(".selectlist").addClass("hidden");
                            $(".checkmater").removeClass("layui-form-selected");
                            return false
                        })
                    })
                }
                return false;
            })


        })
    }


    $(document).on("click", function () {
        var evt = event.srcElement ? event.srcElement : event.target;
        var seletlist = $(".selectlist");
        for (var i = 0; i < seletlist.length; i++) {
            if (!($(seletlist[i]).hasClass("hidden"))) {
                if (evt.id == 'checkmater') {
                    var oldData = table.cache[layTableId];
                    tableIns.reload({
                        data: oldData,
                        limit: viewObj.limit
                    });
                    return;
                }

                else {
                    $(".selectlist").addClass("hidden");
                    var oldData = table.cache[layTableId];
                    tableIns.reload({
                        data: oldData,
                        limit: viewObj.limit
                    });
                }
                return
            }
        }


    })

    form.on('select(currlist)', function (data) {
        var value = data.value;
        for (var k = 0; k < currentId.length; k++) {
            var nowname = currentId[k];
            var nowk = k;
            if (value == nowname) {
                $("#SalesOrder_ExRate").val(ratelAdd[nowk])
            }
        }

    });

  

    // 获取单据编号
    $.ajax({
        url: getnum,
        success: function (res) {
            if (res.Succeed) {
                $("#PurchaseOrderEntry_Name").val(res.Data)
            } else {
                alert(res.Message)
            }
        }
    })

    // 制单人
    var mouser = $.cookie("Modify_User");
    var username = $.cookie("User_Nick")
    $("#StockBill_Biller").val(mouser)
    $("#StockBill_Billername").val(username)

  
    // 供应商
    $(".supplier").on("click", function () {
        var _this = $(this);
        var date = _this.attr("data-type");
        if (date == 'daten') {
            $(".supplier").attr("data-type", "datey");
            $.ajax({
                type: "get",
                url:ajaxSupplier,
                success: function (res) {
                    var isussecc = res.Succeed;
                    var data = res.Data;
                    if (isussecc) {
                        var html = '<option value="">全部</option>';
                        var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                        for (var i = 0; i < data.length; i++) {
                            html += '<option value="' + data[i].F_Id + '" >' + data[i].Supplier_Nick + '</option>';
                            htmlsel += '<dd lay-value="' + data[i].F_Id + '" >' + data[i].Supplier_Nick + '</dd>'
                        }
                        $("#SupplierMaterial_Supplier").html(html);
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

    // 业务员
    $(".scalelists").on("click", function () {
        var _this = $(this);
        var date = _this.attr("data-type");
        if (date == 'daten') {
            $(".scalelists").attr("data-type", "datey");
            $.ajax({
                type: "get",
                url: ajaxUsr,
                success: function (res) {
                    // console.log(res)
                    var isussecc = res.Succeed;
                    var data = res.Data;
                    if (isussecc) {
                        var html = '<option value="">全部</option>';
                        var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                        for (var i = 0; i < data.length; i++) {
                            html += '<option value="' + data[i].F_Id + '">' + data[i].User_Nick + '</option>';
                            htmlsel += '<dd lay-value="' + data[i].F_Id + '">' + data[i].User_Nick + '</dd>'
                        }
                        $("#SalesOrder_Employee").html(html);
                        $(".scalelists .layui-anim.layui-anim-upbit").html(htmlsel);
                        renderForm();
                        _this.find("select").next().find('.layui-select-title input').click();
                    } else {
                        alert(res.Message)
                    }

                }
            })
        }
    })


    // 单号
    $(".checkid").on("click", function () {
        var _this = $(this);
        var date = _this.attr("data-type");
        if (date == 'daten') {
            $(".checkid").attr("data-type", "datey");
            $.ajax({
                type: "get",
                url: asslist,
                success: function (res) {
                    // console.log(res)
                    var isussecc = res.Succeed;
                    var data = res.Data;
                    if (isussecc) {
                        var html = '<option value="">全部</option>';
                        var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                        for (var i = 0; i < data.length; i++) {
                            html += '<option value="' + data[i].F_Id + '" >' + data[i].Assign_Name + '</option>';
                            htmlsel += '<dd lay-value="' + data[i].F_Id + '" >' + data[i].Assign_Name + '</dd>'
                        }
                        $("#order").html(html);
                        $(".checkid .layui-anim.layui-anim-upbit").html(htmlsel);
                        renderFormNext();
                        _this.find("select").next().find('.layui-select-title input').click();

                    } else {
                        alert(res.Message)
                    }

                }
            })
        }
    })


    // 切换订单号
    layui.form.on('select(changeorder)', function (data) {
        if (data.value != '') {
            $.ajax({
                type: "get",
                url: getassone + data.value,
                success: function (res) {
                    // console.log(res)
                    var isussecc = res.Succeed;
                    var data = res.Data;
                    if (isussecc) {
                        if (data.Children) {
                            // console.log(data.Children)
                            // 数据对应
                            $.each(data.Children, function (index, value) {
                                value.PurchaseOrderEntry_Specifications = value.AssignEntry_Specifications
                                value.PurchaseOrderEntry_Unit = value.AssignEntry_Unit
                                value.PurchaseOrderEntry_Material = value.AssignEntry_Material
                                value.PurchaseOrderEntry_Quantity = value.AssignEntry_Quantity
                                value.PurchaseOrderEntry_DateTime = value.AssignEntry_DateTime
                                value.PurchaseOrderEntry_StartTime = value.AssignEntry_StartTime
                                value.PurchaseOrderEntry_Project = value.AssignEntry_Project
                                value.Remark = value.Remark
                            })
                            tableIns.reload({
                                data: data.Children,
                                limit: data.Children.length
                            });
                        }

                    } else {
                        alert(res.Message)
                    }
                }
            })
        }
    })
    // 重选表格渲染
    renderFormNext = function () {
        layui.use('form', function () {
            var form = layui.form;
            form.render();
            var oldData = table.cache[layTableId];
            tableIns.reload({
                data: oldData,
                limit: viewObj.limit
            });
        });
    }

        // 制单人
    var mouser = $.cookie("Modify_User");
    var username = $.cookie("User_Nick")
    $("#PurchaseApply_Biller").val(mouser)
    $("#PurchaseApply_Billername").val(username)
    // // 申请人
    // var mouser = $.cookie("Modify_User");
    // var username = $.cookie("Employee_Nick")
    // $("#PurchaseApply_Employee").val(mouser)
    // $("#PurchaseApply_Employeename").val(username)
    // // 单据日期
    // var mouser = $.cookie("Modify_User");
    // var username = $.cookie("PurchaseApply_DateTime")
    // $("#PurchaseApply_DateTime").val(mouser)
    // $("#PurchaseApply_DateTimename").val(username)
    // // 单据状态
    // var mouser = $.cookie("Modify_User");
    // var username = $.cookie("DictionaryItem_Nick")
    // $("#PurchaseApply_Status").val(mouser)
    // $("#PurchaseApply_Statusname").val(username)


    // 保存
    $(".sub").on("click", function () {
        var list = $("form").serializeArray();
        var oldData = table.cache[layTableId];
        list.Details = oldData;
        if (!($(this).hasClass("audit"))) {
            var index = layer.load();
            $.ajax({
                type: "POST",
                url: purchaseOrderListAdd,
                data: list,
                success: function (res) {
                    // console.log(res)
                    var isussecc = res.Succeed;
                    var data = res.Data;
                    if (isussecc) {
                        layer.close(index);
                        layer.msg("保存成功");
                        setInterval(function () {
                            window.location.reload()
                        }, 1000)
                    } else {
                        layer.close(index);
                    }
                }
            })
        }
    })
});
     //多文件上传列表示例
     var tablehead = $('#tablehead');
     var tablebody = $('#tablebody');
     var imgcount = 0;
     var headhtml = "<tr><th>文件名</th><th>大小</th><th>操作</th></tr>";
     var uploadListIns = upload.render({
         elem: '#testList',
         url:'/Api/PSIBase/FileInput/SetFile'        
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

    //  渲染表格
    $(function () {
        $(document).on("click", function () {
            $("#tableRes .layui-table-body").addClass("overvis");
            $("#tableRes .layui-table-box").addClass("overvis");
            $("#tableRes .layui-table-view").addClass("overvis");
        })
        $("#tablelist").on("click", function () {
            $("#tablelist .layui-table-body").addClass("overvis");
            $("#tablelist .layui-table-box").addClass("overvis");
            $("#tablelist .layui-table-view").addClass("overvis");
        })
    })


     // 删除
     function del(id) {
        var index = layer.confirm('确认删除这条数据？', {
            btn: ['确定', '取消']
        }, function () {
            var token = $.cookie("token");
            $.ajax({
                type: "POST",
                async: false,
                url:removecraftlist,
                data: {
                    F_Id: id
                },
                success: function (res) {
                    var data = res.Data;
                    console.log(data)
                    var succeed = res.Succeed;
                    if (succeed) {
                        layer.close(index)
                    } else {
                        layer.close(index)
                        alert(res.Message)
                    }
                }
            })
        }); 
    }
