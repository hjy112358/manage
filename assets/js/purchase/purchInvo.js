
var dateslit = [];
var token = $.cookie("token");
var currname = [];
var currnick = [];
var ratelist = [];
var currnamshow = [];
var first = new Date().valueOf();
var tdata = [];
var tempid = [];
var temip = [];
function getTid(i) {
    return (new Date().valueOf()) + i
}
for (var i = 0; i < 5; i++) {
    var k = i
    temip.push(getTid(k))
}

for (var i = 0; i < 5; i++) {
    var data = {
        tempId: temip[i],
        state: 0,
        Material_Name: '',//物料编号
        Material_Nick: '',//物料名称
        PurchaseInvoiceEntry_Material: '',//物料--物料id
        // PurchaseInvoiceEntry_Currency: "55C21484-9E61-4EB8-8496-3137C249130B",//币别
        PurchaseInvoiceEntry_Specifications : '',//规格
        PurchaseInvoiceEntry_Quantity: '',//价格
        PurchaseInvoiceEntry_Quantity: '',//数量
        PurchaseInvoiceEntry_Unit: '',//单位
        PurchaseInvoiceEntry_Amount: '',//总额
        PurchaseInvoiceEntry_TaxRate: '',//税率
        PurchaseInvoiceEntry_Tax: "",//税额
        PurchaseInvoiceEntry_Total: '',//合计
        PurchaseInvoiceEntry_ExRate: '1',//汇率
        PurchaseInvoiceEntry_Deadline: '',//交货日期
        PurchaseInvoiceEntry_Project :'', //项目
        Remark: '',//备注
        // currchange: '0',
        PurchaseInvoiceEntry_PurchaseInvoice: ''
    }

    tdata.push(data);

}
window.viewObj = {
    tbData: tdata,
    limit: 5,
    last: temip[4]
};
var tableIns;
var upload, table;
var layTableId;
//layui 模块化引用
layui.use(['jquery', 'table', 'layer', "form", "layedit", "laydate", "upload"], function () {
    // 日期
    var myDate = new Date();
    var nowY = myDate.getFullYear();
    var nowM = myDate.getMonth() + 1;
    var nowD = myDate.getDate();
    var tody = nowY + "-" + (nowM < 10 ? "0" + nowM : nowM) + "-" + (nowD < 10 ? "0" + nowD : nowD);

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
        value: tody,
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
        // even: true,
        cols: [[
            { title: '序号', type: 'numbers', width: '50' },
            { field: 'Material_Name', title: '<span style="color:red">*  </span>物料', templet: '#selectTool', width: '120' },
            { field: 'Material_Nick', title: '客户料号', width: '200' },
            { field: 'PurchaseInvoiceEntry_Specifications ', title: '规格型号', width: '100', edit: 'text' },
            { field: 'PurchaseInvoiceEntry_Unit', title: '单位', width: '50', align: "center" },
            {
                field: 'PurchaseInvoiceEntry_Quantity', title: '数量', edit: 'text', width: '80', align: "center"
            },
            {
                field: 'PurchaseInvoiceEntry_Quantity', title: '单价', edit: 'text', width: '100', align: "right", templet: function (d) {
                    if (d.PurchaseInvoiceEntry_Quantity) {
                        var num = parseFloat(d.PurchaseInvoiceEntry_Quantity);
                        num = num.toFixed(2);
                    } else if (d.PurchaseInvoiceEntry_Quantity == '0') {
                        num = '0.00'
                    } else {
                        num = ''
                    }
                    return num
                }
            },
            {
                field: 'PurchaseInvoiceEntry_TaxPrice', title: '含税单价', edit: 'text', width: '100', align: "right", templet: function (d) {
                    if (d.PurchaseInvoiceEntry_TaxPrice) {
                        var num = parseFloat(d.PurchaseInvoiceEntry_TaxPrice);
                        num = num.toFixed(2);
                    } else if (d.PurchaseInvoiceEntry_TaxPrice == '0') {
                        num = '0.00'
                    } else {
                        num = ''
                    }

                    return num
                }
            },
            {
                field: 'PurchaseInvoiceEntry_Amount', title: '金额', edit: 'text', width: '100', align: "right", templet: function (d) {
                    if (d.PurchaseInvoiceEntry_Amount) {
                        var num = parseFloat(d.PurchaseInvoiceEntry_Amount);
                        num = num.toFixed(2);
                    } else if (d.PurchaseInvoiceEntry_Amount == '0') {
                        num = '0.00'
                    } else {
                        num = ''
                    }

                    return num
                }
            },
            { field: 'PurchaseInvoiceEntry_TaxRate', title: '税率(%)', edit: 'text', width: '50', align: "center" },

            {
                field: 'PurchaseInvoiceEntry_Total', title: '税额', edit: 'text', width: '100', align: "right", templet: function (d) {
                    if (d.PurchaseInvoiceEntry_Total) {
                        var num = parseFloat(d.PurchaseInvoiceEntry_Total);
                        num = num.toFixed(2);
                    } else if (d.PurchaseInvoiceEntry_Total == '0') {
                        num = '0.00'
                    } else {
                        num = ''
                    }

                    return num
                }
            },
            {
                field: 'PurchaseInvoiceEntry_Tax', title: '价税合计', width: '80', align: "right", templet: function (d) {
                    if (d.PurchaseInvoiceEntry_Tax) {
                        var num = parseFloat(d.PurchaseInvoiceEntry_Tax);
                        num = num.toFixed(2);
                    } else if (d.PurchaseInvoiceEntry_Tax == '0') {
                        num = '0.00'
                    } else {
                        num = ''
                    }

                    return num
                }
            },
            {
                field: 'PurchaseInvoiceEntry_Deadline', title: '<span style="color:red"></span>交货日期', width: '100', align: "center", 
                // templet: function (d) {
                //     return '<input type="text" id="PurchaseInvoiceEntry_Deadline" verify lay-verify="verify" value="' + (d.PurchaseInvoiceEntry_Deadline || '') + '"  autocomplete="off" class="layui-input layui-input-date"/>';/* onblur="datachange('+d.PurchaseInvoiceEntry_Deadline+',this)" */
                // }
            },
            {
                field: 'PurchaseInvoiceEntry_Project', title: '<span style="color:red"></span>项目', width: '100', align: "center", 
                // templet: function (d) {
                //     return '<input type="text" id="PurchaseInvoiceEntry_Project" verify lay-verify="verify" value="' + (d.PurchaseInvoiceEntry_Project || '') + '"  autocomplete="off" class="layui-input layui-input-date"/>';/* onblur="datachange('+d.PurchaseInvoiceEntry_Project+',this)" */
                // }
            },
            { field: 'Remark', title: '备注', edit: 'text', width: '200' },
            {
                field: 'tempId', title: '操作', align: 'center', width: '100', templet: function (d) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.tempId + '">删除</a>';
                }
            }
        ]],
        done: function (res, curr, count) {

            // console.log(res.data)
            viewObj.tbData = res.data;
            prolist();

            $(".layui-input-date").each(function (i) {
                layui.laydate.render({
                    elem: this,
                    format: "yyyy-MM-dd",
                    done: function (value, date) {
                        if (res && res.data[i]) {
                            // console.log("up")
                            $.extend(res.data[i], { 'PurchaseInvoiceEntry_Deadline': value })
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
                        $cr.find('input').val(value.Material_Name);
                        $cr.find('input[id="PurchaseInvoiceEntry_Deadline"]').val(value.PurchaseInvoiceEntry_Deadline);

                    }
                });
            });


        }
    });


    //定义事件集合
    var active = {
        add: function () {	//添加一行
            viewObj.limit = viewObj.limit + 1;
            var oldData = table.cache[layTableId];

            // console.log(oldData);
            var tid = new Date().valueOf();
            var newRow = {
                tempId: tid,
                state: 0,
                Material_Name: '',//物料代码
                Material_Nick: '',//物料名称
                PurchaseInvoiceEntry_Material: '',//物料--物料id
                PurchaseInvoiceEntry_Specifications : '',//销售规格
                PurchaseInvoiceEntry_Unit: '',//单位
                PurchaseInvoiceEntry_Quantity: '',//数量    数量=未税金额/销售单价
                PurchaseInvoiceEntry_Quantity: '',//销售单价
                PurchaseInvoiceEntry_Amount: '',//未税金额 数量*销售单价
                PurchaseInvoiceEntry_TaxRate: "",//税率 
                PurchaseInvoiceEntry_Tax: "",//税额  PurchaseInvoiceEntry_Tax=PurchaseInvoiceEntry_Total-PurchaseInvoiceEntry_Amount
                PurchaseInvoiceEntry_TaxPrice: "",//含税单价 (税率  / 100 * 销售单价) + 销售单价
                PurchaseInvoiceEntry_Total: '',//价税合计  价税合计=未税金额*(1+税率/100)
                PurchaseInvoiceEntry_ExRate: viewObj.rate,//汇率
                PurchaseInvoiceEntry_Deadline: "",//交货日期
                PurchaseInvoiceEntry_Project:'',//项目
                Remark: '',//备注
                PurchaseInvoiceEntry_PurchaseInvoice: ''
            };
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
    // table 修改
    table.on('edit(dataTable)', function (obj) {
        // console.log(obj)
        var field = obj.field;
        var dataindex = $(obj.tr).attr("data-index");
        $.each(tabledata, function (index, value) {

            if (value.LAY_TABLE_INDEX == dataindex) {
                if (value.Material_Name == '') {
                    layer.alert("请先选择物料");
                    value.PurchaseInvoiceEntry_Quantity = '';
                    value.PurchaseInvoiceEntry_Quantity = '';
                    value.PurchaseInvoiceEntry_Amount = '';
                    value.PurchaseInvoiceEntry_TaxRate = '';
                    value.PurchaseInvoiceEntry_Tax = '';
                    value.PurchaseInvoiceEntry_TaxPrice = '';
                    value.PurchaseInvoiceEntry_Total = '';
                    value.PurchaseInvoiceEntry_Deadline = '';
                    value.Material_Name = '';
                } else {
                    if (field == 'PurchaseInvoiceEntry_Quantity') {//销售单价
                        value.PurchaseInvoiceEntry_Quantity = parseFloat(value.PurchaseInvoiceEntry_Quantity)
                        // 未税金额=数量*销售单价
                        value.PurchaseInvoiceEntry_Amount = parseFloat(value.PurchaseInvoiceEntry_Quantity) * parseFloat(value.PurchaseInvoiceEntry_Quantity)
                        // 含税单价=销售单价*（1+税率/100）
                        value.PurchaseInvoiceEntry_TaxPrice = parseFloat(value.PurchaseInvoiceEntry_Quantity) * (1 + parseFloat(value.PurchaseInvoiceEntry_TaxRate) / 100)
                        // 价税合计=数量*含税单价
                        value.PurchaseInvoiceEntry_Total = parseFloat(value.PurchaseInvoiceEntry_Quantity) * parseFloat(value.PurchaseInvoiceEntry_TaxPrice)
                        // 税额=未税金额*（税率/100）
                        value.PurchaseInvoiceEntry_Tax = parseFloat(value.PurchaseInvoiceEntry_Amount) * (parseFloat(value.PurchaseInvoiceEntry_TaxRate) / 100)

                    } else if (field == 'PurchaseInvoiceEntry_Quantity') {//数量
                        value.PurchaseInvoiceEntry_Quantity = parseFloat(value.PurchaseInvoiceEntry_Quantity)
                        // 未税金额=数量*销售单价
                        value.PurchaseInvoiceEntry_Amount = parseFloat(value.PurchaseInvoiceEntry_Quantity) * parseFloat(value.PurchaseInvoiceEntry_Quantity)
                        // 含税单价=销售单价*（1+税率/100）
                        value.PurchaseInvoiceEntry_TaxPrice = parseFloat(value.PurchaseInvoiceEntry_Quantity) * (1 + parseFloat(value.PurchaseInvoiceEntry_TaxRate) / 100)
                        // 价税合计=数量*含税单价
                        value.PurchaseInvoiceEntry_Total = parseFloat(value.PurchaseInvoiceEntry_Quantity) * parseFloat(value.PurchaseInvoiceEntry_TaxPrice)
                        // 税额=未税金额*（税率/100）
                        value.PurchaseInvoiceEntry_Tax = parseFloat(value.PurchaseInvoiceEntry_Amount) * (parseFloat(value.PurchaseInvoiceEntry_TaxRate) / 100)
                        // value.PurchaseInvoiceEntry_Quantity='0'

                    } else if (field == 'PurchaseInvoiceEntry_TaxPrice') {//含税单价
                        value.PurchaseInvoiceEntry_TaxPrice = parseFloat(value.PurchaseInvoiceEntry_TaxPrice)
                        // 销售单价=含税单价/(1+税率/100)
                        value.PurchaseInvoiceEntry_Quantity = parseFloat(value.PurchaseInvoiceEntry_TaxPrice) / (1 + parseFloat(value.PurchaseInvoiceEntry_TaxRate) / 100)
                        // 未税金额=数量*销售单价
                        value.PurchaseInvoiceEntry_Amount = parseFloat(value.PurchaseInvoiceEntry_Quantity) * parseFloat(value.PurchaseInvoiceEntry_Quantity)
                        // 价税合计=数量*含税单价
                        value.PurchaseInvoiceEntry_Total = parseFloat(value.PurchaseInvoiceEntry_Quantity) * parseFloat(value.PurchaseInvoiceEntry_TaxPrice)
                        // 税额=未税金额*（税率/100）
                        value.PurchaseInvoiceEntry_Tax = parseFloat(value.PurchaseInvoiceEntry_Amount) * (parseFloat(value.PurchaseInvoiceEntry_TaxRate) / 100)


                    } else if (field == 'PurchaseInvoiceEntry_Amount') {//未税金额 
                        value.PurchaseInvoiceEntry_Amount = parseFloat(value.PurchaseInvoiceEntry_Amount)
                        // 销售单价=未税金额/数量
                        value.PurchaseInvoiceEntry_Quantity = parseFloat(value.PurchaseInvoiceEntry_Amount) / parseFloat(value.PurchaseInvoiceEntry_Quantity)
                        // 含税单价=销售单价*（1+税率/100）
                        value.PurchaseInvoiceEntry_TaxPrice = parseFloat(value.PurchaseInvoiceEntry_Quantity) * (1 + parseFloat(value.PurchaseInvoiceEntry_TaxRate) / 100)
                        // 价税合计=数量*含税单价
                        value.PurchaseInvoiceEntry_Total = parseFloat(value.PurchaseInvoiceEntry_Quantity) * parseFloat(value.PurchaseInvoiceEntry_TaxPrice)
                        // 税额=未税金额*（税率/100）
                        value.PurchaseInvoiceEntry_Tax = parseFloat(value.PurchaseInvoiceEntry_Amount) * (parseFloat(value.PurchaseInvoiceEntry_TaxRate) / 100)


                    } else if (field == 'PurchaseInvoiceEntry_Total') { //价税合计 
                        value.PurchaseInvoiceEntry_Total = parseFloat(value.PurchaseInvoiceEntry_Total)
                        // 含税单价=价税合计/数量
                        value.PurchaseInvoiceEntry_TaxPrice = parseFloat(value.PurchaseInvoiceEntry_Total) / parseFloat(value.PurchaseInvoiceEntry_Quantity)
                        // 销售单价=含税单价/（1+税率/100）
                        value.PurchaseInvoiceEntry_Quantity = parseFloat(value.PurchaseInvoiceEntry_TaxPrice) / (1 + parseFloat(value.PurchaseInvoiceEntry_TaxRate) / 100)

                        // 未税金额=数量*销售单价
                        value.PurchaseInvoiceEntry_Amount = parseFloat(value.PurchaseInvoiceEntry_Quantity) * parseFloat(value.PurchaseInvoiceEntry_Quantity)
                        // 税额=未税金额*（税率/100）
                        value.PurchaseInvoiceEntry_Tax = parseFloat(value.PurchaseInvoiceEntry_Amount) * (parseFloat(value.PurchaseInvoiceEntry_TaxRate) / 100)

                    } else if (field == 'PurchaseInvoiceEntry_TaxRate') {//税率
                        value.PurchaseInvoiceEntry_TaxRate = parseFloat(value.PurchaseInvoiceEntry_TaxRate)
                        // 含税单价=销售单价*（1+税率/100）
                        value.PurchaseInvoiceEntry_TaxPrice = parseFloat(value.PurchaseInvoiceEntry_Quantity) * (1 + parseFloat(value.PurchaseInvoiceEntry_TaxRate || '0') / 100)
                        // 未税金额=数量*销售单价
                        value.PurchaseInvoiceEntry_Amount = parseFloat(value.PurchaseInvoiceEntry_Quantity) * parseFloat(value.PurchaseInvoiceEntry_Quantity)
                        // 价税合计=数量*含税单价
                        value.PurchaseInvoiceEntry_Total = parseFloat(value.PurchaseInvoiceEntry_Quantity) * parseFloat(value.PurchaseInvoiceEntry_TaxPrice)
                        // 税额=未税金额*（税率/100）
                        value.PurchaseInvoiceEntry_Tax = parseFloat(value.PurchaseInvoiceEntry_Amount) * (parseFloat(value.PurchaseInvoiceEntry_TaxRate || '0') / 100)
                    }



                }
            }


        });
        var oldData = table.cache[layTableId];
        tableIns.reload({
            data: oldData,
            limit: viewObj.limit
        });
    });


    var htmlterm = '';
    var arrlist = [];
    var arri = {};
    function prolist() {
        $(".productworktable td[data-field='Material_Name']").each(function () {
            var curnow = $(this);
            curnow.on("click", function () {
                // console.log(1);
                var scrollHeight = $('#tableRes .layui-table-body.layui-table-main').prop("scrollHeight");
                var height = $('#tableRes .layui-table-body.layui-table-main').height() + scrollHeight + 80;
                $('#tableRes .layui-table-body.layui-table-main').css("height", height)
                var _this = $(this);
                // data-index无
                var dataindex = _this.parents("tr").attr("data-index");
                _this.find(".checkmater").addClass("layui-form-selected")
                var date = $(".productworktable").attr("data-type");
                if (date == 'daten') {
                    $(".productworktable").attr("data-type", "datey");
                    $("#tableRes").find("tr").each(function (i, v) {
                        var nowtr = v;
                        var nowindex = $(v).attr("data-index");
                        if (dataindex != nowindex) {
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
                            // console.log(res)
                            $(".dateload").addClass("hidden")
                            $(".datelist").removeClass("hidden")
                            var data = res.Data;
                            // console.log(data)
                            var isussecc = res.Succeed;
                            if (isussecc) {
                                // data[i].Material_Name data[i].Material_Nick  data[i].Material_Specification
                                for (var i = 0; i < data.length; i++) {
                                    var datanow = data[i];
                                    htmlterm += '<li data-name="' + (datanow.Material_Name || '') + '" data-nick="' + (datanow.Material_Nick || '') + '" data-spe="' + (datanow.Material_Specifications || '') + '" data-materme="' + (datanow.Material_Measure || '') + '" data-materid="' + (datanow.F_Id || '') + '"><p>' + (datanow.Material_Name || '') + '</p><p>' + (datanow.Material_Nick || '') + '</p><p>' + (datanow.Material_Specifications || '') + '</p></li>'
                                    arri = { materame: (datanow.Material_Name || ''), maternick: (datanow.Material_Nick || ''), matersp: (datanow.Material_Specifications || ''), matermea: (datanow.Material_Measure || ''), materid: (datanow.F_Id || '') };
                                    arrlist.push(arri)
                                }
                                $(".selectlist ul").html(htmlterm);
                                $(".materName").on("keyup", function () {
                                    var searchVal = $(this).val();
                                    var showList = [];
                                    var searchlist = '';
                                    //将和所输入的字符串匹配的项存入showList
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
                                        // var rate = $("#PurchaseInvoice_TaxRate").val();//税率
                                        var sendate = $("#recdate").val();//交货日期
                                        $.each(tabledata, function (index, value) {
                                            if (value.LAY_TABLE_INDEX == dataindex) {
                                                value.Material_Name = name || "";
                                                value.Material_Nick = nick || "";
                                                value.PurchaseInvoiceEntry_Specifications  = specife || "";
                                                value.PurchaseInvoiceEntry_Material = marid || "";
                                                value.PurchaseInvoiceEntry_Unit = measure
                                                value.PurchaseInvoiceEntry_Quantity = 1;//数量
                                                value.PurchaseInvoiceEntry_Quantity = 0.00;//销售单价
                                                value.PurchaseInvoiceEntry_TaxRate = rate || '16';//税率
                                                value.PurchaseInvoiceEntry_Deadline = sendate || '';//交货日期
                                                value.PurchaseInvoiceEntry_TaxPrice = 0;//含税单价
                                                value.PurchaseInvoiceEntry_Amount = 0;//未税金额
                                                value.PurchaseInvoiceEntry_Total = 0;//价税合计
                                                value.PurchaseInvoiceEntry_Tax = 0;//税额
                                                value.PurchaseInvoiceEntry_Project=project || "";
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
                        if (dataindex != nowindex) {
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
                        //将匹配项显示，不匹配项隐藏
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
                            if (dataindex != nowindex) {
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
                            // var rate = $("#PurchaseInvoice_TaxRate").val();//税率
                            var sendate = $("#recdate").val();//交货日期
                            $.each(tabledata, function (index, value) {
                                // console.log(value)
                                if (value.LAY_TABLE_INDEX == dataindex) {
                                    value.Material_Name = name || "";
                                    value.Material_Nick = nick || "";
                                    value.PurchaseInvoiceEntry_Specifications  = specife || "";
                                    value.PurchaseInvoiceEntry_Material = marid || "";
                                    value.PurchaseInvoiceEntry_Unit = measure;
                                    value.PurchaseInvoiceEntry_Quantity = 1;//数量
                                    value.PurchaseInvoiceEntry_Quantity = 0.00;//销售单价
                                    value.PurchaseInvoiceEntry_TaxRate = rate || '16';//税率
                                    value.PurchaseInvoiceEntry_Deadline = sendate || '';//交货日期
                                    value.PurchaseInvoiceEntry_TaxPrice = 0;//含税单价
                                    value.PurchaseInvoiceEntry_Amount = 0;//未税金额
                                    value.PurchaseInvoiceEntry_Total = 0;//价税合计
                                    value.PurchaseInvoiceEntry_Tax = 0;//税额
                                    value.PurchaseInvoiceEntry_Project=project || "";
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
                }
                return false;
            })


        })
    }


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
                    // Currency_Name: "M0001"
                    //Currency_Nick: "人民币"
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
                $("#currency").html(html);
                $(".currency .layui-anim.layui-anim-upbit").html(htmlsel);
                renderForm();
                var select = 'dd[lay-value="' + rmbid + '"]';
                $('#currency').siblings("div.layui-form-select").find('dl').find(select).click();
                $("#PurchaseInvoice_ExRate").val(rate)
                // _this.find("select").next().find('.layui-select-title input').click();
            } else {
                alert(res.Message)
            }
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
                url:ajaxSupplier,
                success: function (res) {
                    // console.log(res)
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
                        // Customer_TaxRate 税率   
                    } else {
                        alert(res.Message)
                    }

                }
            })
        }
    })


    // 采购申请单号
    $.ajax({
        type: "get",
        url: ordernum,
        success: function (res) {
            // console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data;
            if (isussecc) {
                $("#PurchaseInvoice_Name").val(data)
            } else {
                alert(res.Message)
            }
        }
    })

    // 审核日期
    laydate.render({
        elem: '#shrq',
        // value: tody,
        isInitValue: true,
        btns: ['now', 'confirm'],
        done: function (val) {
            $.each(tabledata, function (index, value) {
                if (value.PurchaseInvoiceEntry_Deadline == '' && value.Material_Name != '') {
                    value.PurchaseInvoiceEntry_Deadline = val;
                }
                var oldData = table.cache[layTableId];
                tableIns.reload({
                    data: oldData,
                    limit: viewObj.limit
                });

            });

        }
    });

    function renderForm() {
        layui.use('form', function () {
            var form = layui.form;
            form.render();
        });
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



    //多文件列表示例
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
            var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
            tablehead.html(headhtml)
            //读取本地文件
            obj.preview(function (index, file, result) {
                imgcount++;
                var tr = $(['<tr id="upload-' + index + '">'
                    , '<td>' + file.name + '</td>'
                    , '<td class="textc">' + (file.size / 1014).toFixed(1) + 'kb</td>'
                    , '<td class="textc">'
                    , '<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>'
                    , '</td>'
                    , '</tr>'].join(''));
                //删除
                tr.find('.demo-delete').on('click', function () {
                    delete files[index]; //删除对应的文件
                    tr.remove();
                    uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                    imgcount--;
                    if (imgcount == 0) {
                        tablehead.html("")
                    }

                });

                tablebody.append(tr);
            });
        }

    });


    form.on('select(currlist)', function (data) {
        var value = data.value;
        for (var k = 0; k < currname.length; k++) {
            var nowname = currname[k];
            var nowk = k;
            if (value == nowname) {
                // viewObj.currtype = nowname;
                // viewObj.rate = ratelist[nowk]
                $("#PurchaseInvoice_ExRate").val(ratelist[nowk])
                // var oldData = table.cache[layTableId];
                // $.each(tabledata, function (index, value) {
                //     if (value.currchange == 0) {
                //         value.PurchaseInvoiceEntry_Currency = viewObj.currtype
                //         // value.PurchaseInvoiceEntry_ExRate = viewObj.rate
                //     }
                // });
                // tableIns.reload({
                //     data: oldData,
                //     limit: viewObj.limit
                // });
            }
        }

    });
    $(document).on("click", "td[data-field='PurchaseInvoiceEntry_Currency']", function () {
        var scrollHeight = $('#tableRes .layui-table-body.layui-table-main').prop("scrollHeight");
        var height = $('#tableRes .layui-table-body.layui-table-main').height() + scrollHeight;
        $('#tableRes .layui-table-body.layui-table-main').css("height", height)
    })

      // 订单编号
      $.ajax({
        type: "get",
        url: ordernum,
        success: function (res) {
            // console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data;
            if (isussecc) {
                $("#SalesOrder_Name").val(data)
            } else {
                alert(res.Message)
            }
        }
    })

   // 保存
   $(".sub").on("click", function () {
    var list = $("form").serializeArray();
    var oldData = table.cache[layTableId];
    list.Details = oldData;
    if (!($(this).hasClass("aduit"))) {
        var index = layer.load();
        $.ajax({
            type: "POST",
            url:purchaseAdd,
            data: list,
            success: function (res) {
                // console.log(res)
                var isussecc = res.Succeed;
                var data = res.Data;
                if (isussecc) {
                    layer.close(index);
                    alert("保存成功");
                    setInterval(function () {
                        window.location.reload()
                    }, 1000)
                } else {
                    layer.close(index);
                    // alert(JSON.parse(res).Message)
                }
            }
        })
    }
})

//新增
var isSend = true;
// $("#SalesOrder_Id").val(id)
$(".add").on("click", function () {
    var list = $("form").serializeArray();
    var data={};
    var newdata=[];
    for(var j=0;j<list.length;j++){
        data[list[j].name]=list[j].value
    }
    var oldData = table.cache[layTableId];
    // console.log(oldData)
    for (var j = 0; j < oldData.length; j++) {
        var nowdata = oldData[j]
        // console.log(newdata)
        if (nowdata.PurchaseInvoice_Deadline) {
            // newdata.push(nowdata)
            if (nowdata.PurchaseInvoice_Deadline == '') {
                alert("请选择交货日期");
                isSend = false;
                return;
            } else {
                newdata.push(nowdata)
                // continue
            }
        }
    }
    // console.log(newdata)
    if (!($("#SupplierMaterial_Supplier").val())) {
        alert("请选择供应商")
        isSend = false;
    } else {
        isSend = true;
    }
    if (!($(this).hasClass("disclick"))) {
        if (isSend) {
            var index = layer.load();

            data.Details = newdata;
            data.SalesOrder_Status="10000"
            // console.log(list)
            $.ajax({
                type: "POST",
                url: purchaseAdd,
                data: data,
                success: function (res) {
                    // console.log(res)
                    var isussecc = res.Succeed;
                    var data = res.Data;
                    if (isussecc) {
                        layer.close(index);
                        layer.msg("新增成功");
                        setInterval(function () {
                            window.location.reload()
                        }, 1000)
                    } else {
                        layer.close(index);
                        alert(res.Message)
                    }
                }
            })
        }

    }
})

});




function datachange(data, e) {
// console.log("down")
var dataindex = $(e).parent().parent().parent().attr("data-index");
var oldData = table.cache[layTableId];
$.each(oldData, function (index, value) {
    if (value.LAY_TABLE_INDEX == dataindex) {
        value.deadlinchage = 1;
        value.PurchaseInvoiceEntry_Deadline = data
    }
});
tableIns.reload({
    data: oldData,
    limit: viewObj.limit
});
}
