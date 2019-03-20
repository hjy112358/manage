var dateslit = [];
var currname = [];
var currnick = [];
var ratelist = [];
var currnamshow = [];
var first = new Date().valueOf();
var tdata = [];
var tempid = [];
var temip = [];
var getablelist;

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
        Material_Name: '', //物料代码
        Material_Nick: '', //物料名称
        SalesOrderEntry_Material: '', //物料--物料id
        SalesOrderEntry_Specifications: '', //销售规格
        SalesOrderEntry_Price: '', //价格
        SalesOrderEntry_Quantity: '', //数量
        SalesOrderEntry_Unit: '', //单位
        SalesOrderEntry_Amount: '', //总额
        SalesOrderEntry_TaxRate: '', //税率
        SalesOrderEntry_Tax: "", //税额
        SalesOrderEntry_Total: '', //合计
        SalesOrderEntry_Deadline: '', //交货日期
        Remark: '', //备注
        SalesOrderEntry_SalesOrder: ''
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
        cols: [
            [{
                    title: '序号',
                    type: 'numbers',
                    width: '50'
                },
                {
                    field: 'Material_Name',
                    title: '<span style="color:red">*  </span>物料代码',
                    templet: '#selectTool',
                    width: '120'
                },
                {
                    field: 'Material_Nick',
                    title: '物料名称',
                    width: '200'
                },
                {
                    field: 'SalesOrderEntry_Specifications',
                    title: '规格',
                    width: '100',
                    edit: 'text'
                },
                {
                    field: 'SalesOrderEntry_Unit',
                    title: '单位',
                    width: '50',
                    align: "center"
                },
                {
                    field: 'SalesOrderEntry_Quantity',
                    title: '<span style="color:red">*  </span>数量',
                    edit: 'text',
                    width: '80',
                    align: "center"
                },
                {
                    field: 'SalesOrderEntry_Price',
                    title: '销售单价',
                    edit: 'text',
                    width: '100',
                    align: "right",
                    templet: function (d) {
                        if (d.SalesOrderEntry_Price) {
                            var num = parseFloat(d.SalesOrderEntry_Price);
                            num = num.toFixed(2);
                        } else if (d.SalesOrderEntry_Price == '0') {
                            num = '0.00'
                        } else {
                            num = ''
                        }
                        return num
                    }
                },
                {
                    field: 'SalesOrderEntry_TaxPrice',
                    title: '含税单价',
                    edit: 'text',
                    width: '100',
                    align: "right",
                    templet: function (d) {
                        if (d.SalesOrderEntry_TaxPrice) {
                            var num = parseFloat(d.SalesOrderEntry_TaxPrice);
                            num = num.toFixed(2);
                        } else if (d.SalesOrderEntry_TaxPrice == '0') {
                            num = '0.00'
                        } else {
                            num = ''
                        }

                        return num
                    }
                },
                {
                    field: 'SalesOrderEntry_Amount',
                    title: '未税金额',
                    edit: 'text',
                    width: '100',
                    align: "right",
                    templet: function (d) {
                        if (d.SalesOrderEntry_Amount) {
                            var num = parseFloat(d.SalesOrderEntry_Amount);
                            num = num.toFixed(2);
                        } else if (d.SalesOrderEntry_Amount == '0') {
                            num = '0.00'
                        } else {
                            num = ''
                        }

                        return num
                    }
                },
                {
                    field: 'SalesOrderEntry_TaxRate',
                    title: '税率(%)',
                    edit: 'text',
                    width: '50',
                    align: "center"
                },

                {
                    field: 'SalesOrderEntry_Total',
                    title: '价税合计',
                    edit: 'text',
                    width: '100',
                    align: "right",
                    templet: function (d) {
                        if (d.SalesOrderEntry_Total) {
                            var num = parseFloat(d.SalesOrderEntry_Total);
                            num = num.toFixed(2);
                        } else if (d.SalesOrderEntry_Total == '0') {
                            num = '0.00'
                        } else {
                            num = ''
                        }

                        return num
                    }
                },
                {
                    field: 'SalesOrderEntry_Tax',
                    title: '税额',
                    width: '80',
                    align: "right",
                    templet: function (d) {
                        if (d.SalesOrderEntry_Tax) {
                            var num = parseFloat(d.SalesOrderEntry_Tax);
                            num = num.toFixed(2);
                        } else if (d.SalesOrderEntry_Tax == '0') {
                            num = '0.00'
                        } else {
                            num = ''
                        }

                        return num
                    }
                },
                // { field: 'SalesOrderEntry_Currency', title: '币别', templet: '#selectcur', width: '100' },
                // { field: 'SalesOrderEntry_ExRate', title: '汇率', width: '100' },
                {
                    field: 'SalesOrderEntry_Deadline',
                    title: '<span style="color:red">*  </span>交货日期',
                    width: '100',
                    align: "center",
                    templet: function (d) {
                        return '<input type="text" id="SalesOrderEntry_Deadline" verify lay-verify="verify" value="' + (d.SalesOrderEntry_Deadline || '') + '"  autocomplete="off" class="layui-input layui-input-date"/>'; /* onblur="datachange('+d.SalesOrderEntry_Deadline+',this)" */
                    }
                },
                {
                    field: 'Remark',
                    title: '备注',
                    edit: 'text',
                    width: '200'
                },
                {
                    field: 'tempId',
                    title: '操作',
                    align: 'center',
                    width: '100',
                    templet: function (d) {
                        return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.tempId + '">删除</a>';
                    }
                }
            ]
        ],
        done: function (res, curr, count) {
            viewObj.tbData = res.data;
            prolist();
            $(".layui-input-date").each(function (i) {
                layui.laydate.render({
                    elem: this,
                    format: "yyyy-MM-dd",
                    done: function (value, date) {
                        if (res && res.data[i]) {
                            console.log("up")
                            $.extend(res.data[i], {
                                'SalesOrderEntry_Deadline': value
                            })
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
                        $cr.find('input[id="SalesOrderEntry_Deadline"]').val(value.SalesOrderEntry_Deadline);
                    }
                });
            });
        }
    });

    //定义事件集合
    var active = {
        add: function () { //添加一行
            viewObj.limit = viewObj.limit + 1;
            var oldData = table.cache[layTableId];
            var tid = new Date().valueOf();
            var newRow = {
                tempId: tid,
                state: 0,
                Material_Name: '', //物料代码
                Material_Nick: '', //物料名称
                SalesOrderEntry_Material: '', //物料--物料id
                // SalesOrderEntry_Currency: viewObj.currtype,//币别
                SalesOrderEntry_Specifications: '', //销售规格
                SalesOrderEntry_Unit: '', //单位
                SalesOrderEntry_Quantity: '', //数量    数量=未税金额/销售单价
                SalesOrderEntry_Price: '', //销售单价
                SalesOrderEntry_Amount: '', //未税金额 数量*销售单价
                SalesOrderEntry_TaxRate: "", //税率 
                SalesOrderEntry_Tax: "", //税额  SalesOrderEntry_Tax=SalesOrderEntry_Total-SalesOrderEntry_Amount
                SalesOrderEntry_TaxPrice: "", //含税单价 (税率  / 100 * 销售单价) + 销售单价
                SalesOrderEntry_Total: '', //价税合计  价税合计=未税金额*(1+税率/100)
                // SalesOrderEntry_ExRate: viewObj.rate,//汇率
                SalesOrderEntry_Deadline: "", //交货日期
                Remark: '', //备注
                // currchange: '0',
                SalesOrderEntry_SalesOrder: ''
            };
            oldData.push(newRow);
            viewObj.last = tid;
            tableIns.reload({
                data: oldData,
                limit: oldData.length
            });
        },
        updateRow: function () {
            var oldData = table.cache[layTableId];
            // console.log(oldData);
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
            viewObj.last = oldData[oldData.length - 1].tempId;
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
        var data = obj.data,
            event = obj.event,
            tr = obj.tr; //获得当前行 tr 的DOM对象;
        switch (event) {
            case "state":
                var stateVal = tr.find("input[name='state']").prop('checked') ? 1 : 0;
                $.extend(obj.data, {
                    'state': stateVal
                })
                activeByType('updateRow', obj.data); //更新行记录对象
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
        var field = obj.field;
        var dataindex = $(obj.tr).attr("data-index");
        $.each(tabledata, function (index, value) {
            if (value.LAY_TABLE_INDEX == dataindex) {
                if (value.Material_Name == '') {
                    layer.alert("请先选择物料");
                    value.SalesOrderEntry_Quantity = '';
                    value.SalesOrderEntry_Price = '';
                    value.SalesOrderEntry_Amount = '';
                    value.SalesOrderEntry_TaxRate = '';
                    value.SalesOrderEntry_Tax = '';
                    value.SalesOrderEntry_TaxPrice = '';
                    value.SalesOrderEntry_Total = '';
                    value.SalesOrderEntry_Deadline = '';
                    value.Remark = '';
                } else {
                    if (field == 'SalesOrderEntry_Price') { //销售单价
                        value.SalesOrderEntry_Price = parseFloat(value.SalesOrderEntry_Price)
                        // 未税金额=数量*销售单价
                        value.SalesOrderEntry_Amount = parseFloat(value.SalesOrderEntry_Quantity) * parseFloat(value.SalesOrderEntry_Price)
                        // 含税单价=销售单价*（1+税率/100）
                        value.SalesOrderEntry_TaxPrice = parseFloat(value.SalesOrderEntry_Price) * (1 + parseFloat(value.SalesOrderEntry_TaxRate) / 100)
                        // 价税合计=数量*含税单价
                        value.SalesOrderEntry_Total = parseFloat(value.SalesOrderEntry_Quantity) * parseFloat(value.SalesOrderEntry_TaxPrice)
                        // 税额=未税金额*（税率/100）
                        value.SalesOrderEntry_Tax = parseFloat(value.SalesOrderEntry_Amount) * (parseFloat(value.SalesOrderEntry_TaxRate) / 100)

                    } else if (field == 'SalesOrderEntry_Quantity') { //数量
                        value.SalesOrderEntry_Quantity = parseFloat(value.SalesOrderEntry_Quantity)
                        // 未税金额=数量*销售单价
                        value.SalesOrderEntry_Amount = parseFloat(value.SalesOrderEntry_Quantity) * parseFloat(value.SalesOrderEntry_Price)
                        // 含税单价=销售单价*（1+税率/100）
                        value.SalesOrderEntry_TaxPrice = parseFloat(value.SalesOrderEntry_Price) * (1 + parseFloat(value.SalesOrderEntry_TaxRate) / 100)
                        // 价税合计=数量*含税单价
                        value.SalesOrderEntry_Total = parseFloat(value.SalesOrderEntry_Quantity) * parseFloat(value.SalesOrderEntry_TaxPrice)
                        // 税额=未税金额*（税率/100）
                        value.SalesOrderEntry_Tax = parseFloat(value.SalesOrderEntry_Amount) * (parseFloat(value.SalesOrderEntry_TaxRate) / 100)
                        // value.SalesOrderEntry_Price='0'

                    } else if (field == 'SalesOrderEntry_TaxPrice') { //含税单价
                        value.SalesOrderEntry_TaxPrice = parseFloat(value.SalesOrderEntry_TaxPrice)
                        // 销售单价=含税单价/(1+税率/100)
                        value.SalesOrderEntry_Price = parseFloat(value.SalesOrderEntry_TaxPrice) / (1 + parseFloat(value.SalesOrderEntry_TaxRate) / 100)
                        // 未税金额=数量*销售单价
                        value.SalesOrderEntry_Amount = parseFloat(value.SalesOrderEntry_Quantity) * parseFloat(value.SalesOrderEntry_Price)
                        // 价税合计=数量*含税单价
                        value.SalesOrderEntry_Total = parseFloat(value.SalesOrderEntry_Quantity) * parseFloat(value.SalesOrderEntry_TaxPrice)
                        // 税额=未税金额*（税率/100）
                        value.SalesOrderEntry_Tax = parseFloat(value.SalesOrderEntry_Amount) * (parseFloat(value.SalesOrderEntry_TaxRate) / 100)


                    } else if (field == 'SalesOrderEntry_Amount') { //未税金额 
                        value.SalesOrderEntry_Amount = parseFloat(value.SalesOrderEntry_Amount)
                        // 销售单价=未税金额/数量
                        value.SalesOrderEntry_Price = parseFloat(value.SalesOrderEntry_Amount) / parseFloat(value.SalesOrderEntry_Quantity)
                        // 含税单价=销售单价*（1+税率/100）
                        value.SalesOrderEntry_TaxPrice = parseFloat(value.SalesOrderEntry_Price) * (1 + parseFloat(value.SalesOrderEntry_TaxRate) / 100)
                        // 价税合计=数量*含税单价
                        value.SalesOrderEntry_Total = parseFloat(value.SalesOrderEntry_Quantity) * parseFloat(value.SalesOrderEntry_TaxPrice)
                        // 税额=未税金额*（税率/100）
                        value.SalesOrderEntry_Tax = parseFloat(value.SalesOrderEntry_Amount) * (parseFloat(value.SalesOrderEntry_TaxRate) / 100)


                    } else if (field == 'SalesOrderEntry_Total') { //价税合计 
                        value.SalesOrderEntry_Total = parseFloat(value.SalesOrderEntry_Total)
                        // 含税单价=价税合计/数量
                        value.SalesOrderEntry_TaxPrice = parseFloat(value.SalesOrderEntry_Total) / parseFloat(value.SalesOrderEntry_Quantity)
                        // 销售单价=含税单价/（1+税率/100）
                        value.SalesOrderEntry_Price = parseFloat(value.SalesOrderEntry_TaxPrice) / (1 + parseFloat(value.SalesOrderEntry_TaxRate) / 100)

                        // 未税金额=数量*销售单价
                        value.SalesOrderEntry_Amount = parseFloat(value.SalesOrderEntry_Quantity) * parseFloat(value.SalesOrderEntry_Price)
                        // 税额=未税金额*（税率/100）
                        value.SalesOrderEntry_Tax = parseFloat(value.SalesOrderEntry_Amount) * (parseFloat(value.SalesOrderEntry_TaxRate) / 100)

                    } else if (field == 'SalesOrderEntry_TaxRate') { //税率
                        value.SalesOrderEntry_TaxRate = parseFloat(value.SalesOrderEntry_TaxRate)
                        // 含税单价=销售单价*（1+税率/100）
                        value.SalesOrderEntry_TaxPrice = parseFloat(value.SalesOrderEntry_Price) * (1 + parseFloat(value.SalesOrderEntry_TaxRate || '0') / 100)
                        // 未税金额=数量*销售单价
                        value.SalesOrderEntry_Amount = parseFloat(value.SalesOrderEntry_Quantity) * parseFloat(value.SalesOrderEntry_Price)
                        // 价税合计=数量*含税单价
                        value.SalesOrderEntry_Total = parseFloat(value.SalesOrderEntry_Quantity) * parseFloat(value.SalesOrderEntry_TaxPrice)
                        // 税额=未税金额*（税率/100）
                        value.SalesOrderEntry_Tax = parseFloat(value.SalesOrderEntry_Amount) * (parseFloat(value.SalesOrderEntry_TaxRate || '0') / 100)
                    }
                }
            }
        });
        var oldData = table.cache[layTableId];
        tableIns.reload({
            data: oldData,
            limit: oldData.length
        });
    });


    var htmlterm = '';
    var arrlist = [];
    var arri = {};

    function prolist() {
        $(".productworktable td[data-field='Material_Name']").each(function () {
            var curnow = $(this);
            curnow.on("click", function () {
                var scrollHeight = $('#tableRes .layui-table-body.layui-table-main').prop("scrollHeight");
                var height = $('#tableRes .layui-table-body.layui-table-main').height() + scrollHeight + 80;
                $('#tableRes .layui-table-body.layui-table-main').css("height", height)
                var _this = $(this);
                var dataindex = _this.parents("tr").attr("data-index");
                _this.find(".checkmater").addClass("layui-form-selected")
                var date = $(".productworktable").attr("data-type");
                if (date == 'daten') {
                    $(".productworktable").attr("data-type", "datey");
                    $("#tableRes").find("tr").each(function (i, v) {
                        var nowtr = v;
                        var nowindex = $(v).attr("data-index");
                        if (dataindex != nowindex) {
                            $(nowtr).find(".selectlist1").addClass("hidden");
                        } else {
                            $(nowtr).find(".selectlist1").removeClass("hidden");
                            $(nowtr).find(".dateload").removeClass("hidden")
                            $(nowtr).find(".datelist").addClass("hidden")
                        }
                    });
                    $.ajax({
                        url: ajaxMater,
                        success: function (res) {
                            $(".dateload").addClass("hidden")
                            $(".datelist").removeClass("hidden")
                            var data = res.Data;
                            var isussecc = res.Succeed;
                            if (isussecc) {
                                for (var i = 0; i < data.length; i++) {
                                    var datanow = data[i];
                                    htmlterm += '<li data-name="' + (datanow.Material_Name || '') + '" data-nick="' + (datanow.Material_Nick || '') + '" data-spe="' + (datanow.Material_Specifications || '') + '" data-materme="' + (datanow.Material_Measure || '') + '" data-materid="' + (datanow.F_Id || '') + '"><p>' + (datanow.Material_Name || '') + '</p><p>' + (datanow.Material_Nick || '') + '</p><p>' + (datanow.Material_Specifications || '') + '</p></li>'
                                    arri = {
                                        materame: (datanow.Material_Name || ''),
                                        maternick: (datanow.Material_Nick || ''),
                                        matersp: (datanow.Material_Specifications || ''),
                                        matermea: (datanow.Material_Measure || ''),
                                        materid: (datanow.F_Id || '')
                                    };
                                    arrlist.push(arri)
                                }
                                $(".selectlist1 ul").html(htmlterm);
                                $(".materName").on("keyup", function () {
                                    var searchVal = $(this).val();
                                    var showList = [];
                                    var searchlist = '';
                                    //将和所输入的字符串匹配的项存入showList
                                    //将匹配项显示，不匹配项隐藏
                                    $.each(arrlist, function (index, item) {
                                        if ((item.materame && item.materame.indexOf(searchVal) != -1) || (item.maternick && item.maternick.indexOf(searchVal) != -1) || (item.matersp && item.matersp.indexOf(searchVal) != -1)) {
                                            showList.push(item);
                                        } 
                                    })
                                    for (var j = 0; j < showList.length; j++) {
                                        var shownow = showList[j]
                                        searchlist += '<li data-name="' + shownow.materame + '" data-nick="' + shownow.maternick + '" data-spe="' + shownow.matersp + '" data-materme="' + shownow.materme + '" data-materid="' + shownow.materid + '"><p>' + shownow.materame + '</p><p>' + shownow.maternick + '</p><p>' + shownow.matersp + '</p></li>'
                                    }
                                    if (showList.length == 0) {
                                        searchlist = '<div style="text-align:center;padding:15px 10px 15px 0; ">暂无数据</div>'
                                    }
                                    $(".selectlist1 ul").html("");
                                    $(".selectlist1 ul").html(searchlist);
                                    $('.selectlist1 ul').find('li').each(function () {
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
                                            var rate = $("#SalesOrder_TaxRate").val(); //税率
                                            var sendate = $("#recdate").val(); //交货日期
                                            $.each(tabledata, function (index, value) {
                                                if (value.LAY_TABLE_INDEX == dataindex) {
                                                    value.Material_Name = name || "";
                                                    value.Material_Nick = nick || "";
                                                    value.SalesOrderEntry_Specifications = specife || "";
                                                    value.SalesOrderEntry_Material = marid || "";
                                                    value.SalesOrderEntry_Unit = measure
                                                    value.SalesOrderEntry_Quantity = 1; //数量
                                                    value.SalesOrderEntry_Price = 0.00; //销售单价
                                                    value.SalesOrderEntry_TaxRate = rate || '16'; //税率
                                                    value.SalesOrderEntry_Deadline = sendate || ''; //交货日期
                                                    value.SalesOrderEntry_TaxPrice = 0; //含税单价
                                                    value.SalesOrderEntry_Amount = 0; //未税金额
                                                    value.SalesOrderEntry_Total = 0; //价税合计
                                                    value.SalesOrderEntry_Tax = 0; //税额
                                                    if (value.tempId == viewObj.last) {
                                                        activeByType("add");
                                                    } else {
                                                        var oldData = table.cache[layTableId];
                                                        tableIns.reload({
                                                            data: oldData,
                                                            limit: oldData.length
                                                        });
                                                    }
                                                }
                                            });
                                            $(".selectlist1").addClass("hidden");
                                            $(".checkmater").removeClass("layui-form-selected");
                                            return false
                                        })
                                    })
                                })
                                $('.selectlist1 ul').find('li').each(function () {
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
                                        var rate = $("#SalesOrder_TaxRate").val(); //税率
                                        var sendate = $("#recdate").val(); //交货日期
                                        $.each(tabledata, function (index, value) {
                                            if (value.LAY_TABLE_INDEX == dataindex) {
                                                value.Material_Name = name || "";
                                                value.Material_Nick = nick || "";
                                                value.SalesOrderEntry_Specifications = specife || "";
                                                value.SalesOrderEntry_Material = marid || "";
                                                value.SalesOrderEntry_Unit = measure
                                                value.SalesOrderEntry_Quantity = 1; //数量
                                                value.SalesOrderEntry_Price = 0.00; //销售单价
                                                value.SalesOrderEntry_TaxRate = rate || '16'; //税率
                                                value.SalesOrderEntry_Deadline = sendate || ''; //交货日期
                                                value.SalesOrderEntry_TaxPrice = 0; //含税单价
                                                value.SalesOrderEntry_Amount = 0; //未税金额
                                                value.SalesOrderEntry_Total = 0; //价税合计
                                                value.SalesOrderEntry_Tax = 0; //税额
                                                if (value.tempId == viewObj.last) {
                                                    activeByType("add");
                                                } else {
                                                    var oldData = table.cache[layTableId];
                                                    tableIns.reload({
                                                        data: oldData,
                                                        limit: oldData.length
                                                    });
                                                }
                                            }
                                        });
                                        $(".selectlist1").addClass("hidden");
                                        $(".checkmater").removeClass("layui-form-selected");
                                        return false
                                    })
                                })
                            } else {
                                alert(res.Message)
                            }
                        }
                    })
                } else {
                    $(".selectlist1 ul").html(htmlterm);
                    $("#tableRes").find("tr").each(function (i, v) {
                        var nowtr = v;
                        var nowindex = $(v).attr("data-index");
                        if (dataindex != nowindex) {
                            $(nowtr).find(".selectlist1").addClass("hidden");
                        } else {
                            $(nowtr).find(".selectlist1").removeClass("hidden");
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
                            } 
                        })
                        for (var j = 0; j < showList.length; j++) {
                            var shownow = showList[j]
                            searchlist += '<li data-name="' + shownow.materame + '" data-nick="' + shownow.maternick + '" data-spe="' + shownow.matersp + '" data-maMaterial_Namee="' + shownow.matermea + '"><p>' + shownow.materame + '</p><p>' + shownow.maternick + '</p><p>' + shownow.matersp + '</p></li>'
                        }
                        if (showList.length == 0) {
                            searchlist = '<div style="text-align:center;padding:15px 10px 15px 0; ">暂无数据</div>'
                        }
                        $(".selectlist1 ul").html("");
                        $(".selectlist1 ul").html(searchlist);
                        $("#tableRes").find("tr").each(function (i, v) {
                            var nowtr = v;
                            var nowindex = $(v).attr("data-index");
                            if (dataindex != nowindex) {
                                $(nowtr).find("selectlist").addClass("hidden")
                            }
                        });
                        $('.selectlist1 ul').find('li').each(function () {
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
                                var rate = $("#SalesOrder_TaxRate").val(); //税率
                                var sendate = $("#recdate").val(); //交货日期
                                $.each(tabledata, function (index, value) {
                                    if (value.LAY_TABLE_INDEX == dataindex) {
                                        value.Material_Name = name || "";
                                        value.Material_Nick = nick || "";
                                        value.SalesOrderEntry_Specifications = specife || "";
                                        value.SalesOrderEntry_Material = marid || "";
                                        value.SalesOrderEntry_Unit = measure;
                                        value.SalesOrderEntry_Quantity = 1; //数量
                                        value.SalesOrderEntry_Price = 0.00; //销售单价
                                        value.SalesOrderEntry_TaxRate = rate || '16'; //税率
                                        value.SalesOrderEntry_Deadline = sendate || ''; //交货日期
                                        value.SalesOrderEntry_TaxPrice = 0; //含税单价
                                        value.SalesOrderEntry_Amount = 0; //未税金额
                                        value.SalesOrderEntry_Total = 0; //价税合计
                                        value.SalesOrderEntry_Tax = 0; //税额
                                        if (value.tempId == viewObj.last) {
                                            activeByType("add");
                                        } else {
                                            var oldData = table.cache[layTableId];
                                            tableIns.reload({
                                                data: oldData,
                                                limit: oldData.length
                                            });
                                        }
                                    }
                                });
                                $(".selectlist1").addClass("hidden");
                                $(".checkmater").removeClass("layui-form-selected");
                                return false
                            })
                        })

                    })
                    $('.selectlist1 ul').find('li').each(function () {
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
                            var rate = $("#SalesOrder_TaxRate").val(); //税率
                            var sendate = $("#recdate").val(); //交货日期
                            $.each(tabledata, function (index, value) {
                                if (value.LAY_TABLE_INDEX == dataindex) {
                                    value.Material_Name = name || "";
                                    value.Material_Nick = nick || "";
                                    value.SalesOrderEntry_Specifications = specife || "";
                                    value.SalesOrderEntry_Material = marid || "";
                                    value.SalesOrderEntry_Unit = measure;
                                    value.SalesOrderEntry_Quantity = 1; //数量
                                    value.SalesOrderEntry_Price = 0.00; //销售单价
                                    value.SalesOrderEntry_TaxRate = rate || '16'; //税率
                                    value.SalesOrderEntry_Deadline = sendate || ''; //交货日期
                                    value.SalesOrderEntry_TaxPrice = 0; //含税单价
                                    value.SalesOrderEntry_Amount = 0; //未税金额
                                    value.SalesOrderEntry_Total = 0; //价税合计
                                    value.SalesOrderEntry_Tax = 0; //税额
                                    if (value.tempId == viewObj.last) {
                                        activeByType("add");
                                    } else {
                                        var oldData = table.cache[layTableId];
                                        tableIns.reload({
                                            data: oldData,
                                            limit: oldData.length
                                        });
                                    }
                                }
                            });
                            $(".selectlist1").addClass("hidden");
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
                $("#SalesOrder_ExRate").val(rate)
            } else {
                alert(res.Message)
            }
        }
    })

    // // 部门--
    $(".checkdepart").on("click", function () {
        var _this = $(this);
        var date = _this.attr("data-type");
        if (date == 'daten') {
            $(".checkdepart").attr("data-type", "datey");
            $.ajax({
                type: "get",
                url: ajaxdepart,
                success: function (res) {
                    var isussecc = res.Succeed;
                    var data = res.Data;
                    if (isussecc) {
                        var html = '<option value="">全部</option>';
                        var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                        for (var i = 0; i < data.length; i++) {
                            html += '<option value="' + data[i].F_Id + '" >' + data[i].Department_Nick + '</option>';
                            htmlsel += '<dd lay-value="' + data[i].F_Id + '" >' + data[i].Department_Nick + '</dd>'
                        }
                        $("#SalesOrder_Department").html(html);
                        $(".checkdepart .layui-anim.layui-anim-upbit").html(htmlsel);
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
     $("#SalesOrder_Biller").val(mouser)
     $("#SalesOrder_Billername").val(username)
 

    // 业务员--
    $.ajax({
        type: "get",
        url: ajaxUsr,
        success: function (res) {
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
                var select = 'dd[lay-value="' + mouser + '"]';
                $('#SalesOrder_Employee').siblings("div.layui-form-select").find('dl').find(select).click();
            } else {
                alert(res.Message)
            }
        }
    })
   
    // 订单类型--
    $.ajax({
        type: "get",
        url: saletype,
        success: function (res) {
            var isussecc = res.Succeed;
            var data = res.Data.Details;
            if (isussecc) {
                var html = '<option value="">全部</option>';
                var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                for (var i = 0; i < data.length; i++) {
                    html += '<option value="' + data[i].F_Id + '">' + data[i].DictionaryItem_Nick + '</option>';
                    htmlsel += '<dd lay-value="' + data[i].F_Id + '">' + data[i].DictionaryItem_Nick + '</dd>'
                }
                $("#SalesOrder_Type").html(html);
                $(".ordertype .layui-anim.layui-anim-upbit").html(htmlsel);
                renderForm();
                var select = 'dd[lay-value="' + data[0].F_Id + '"]';
                $('#SalesOrder_Type').siblings("div.layui-form-select").find('dl').find(select).click();
            } else {
                alert(res.Message)
            }
        }
    })

   
    // 订单编号
    $.ajax({
        type: "get",
        url: ordernum,
        success: function (res) {
            var isussecc = res.Succeed;
            var data = res.Data;
            if (isussecc) {
                $("#SalesOrder_Name").val(data)
            } else {
                alert(res.Message)
            }
        }
    })

    laydate.render({
        elem: '#recdate',
        // value: tody,
        isInitValue: true,
        btns: ['now', 'confirm'],
        done: function (val) {
            $.each(tabledata, function (index, value) {
                if (value.SalesOrderEntry_Deadline == '' && value.Material_Name != '') {
                    value.SalesOrderEntry_Deadline = val;
                }
                var oldData = table.cache[layTableId];
                tableIns.reload({
                    data: oldData,
                    limit: oldData.length
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


    $(document).on("click", function (event) {
        var evt = event.srcElement ? event.srcElement : event.target;
        var seletlist = $(".selectlist1");
        for (var i = 0; i < seletlist.length; i++) {
            if (!($(seletlist[i]).hasClass("hidden"))) {
                if (evt.id == 'checkmater') {
                    var oldData = table.cache[layTableId];
                    tableIns.reload({
                        data: oldData,
                        limit: oldData.length
                    });
                    return;
                } else {
                    $(".selectlist1").addClass("hidden");
                    var oldData = table.cache[layTableId];
                    tableIns.reload({
                        data: oldData,
                        limit: oldData.length
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
        accept: 'file',
        multiple: true,
        auto: false,
        bindAction: '#testListAction',
        choose: function (obj) {
            var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
            tablehead.html(headhtml)
            //读取本地文件
            obj.preview(function (index, file, result) {
                imgcount++;
                var tr = $(['<tr id="upload-' + index + '">', '<td>' + file.name + '</td>', '<td class="textc">' + (file.size / 1014).toFixed(1) + 'kb</td>', '<td class="textc">', '<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>', '</td>', '</tr>'].join(''));
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
                $("#SalesOrder_ExRate").val(ratelist[nowk])
            }
        }

    });

  
    $(document).on("click", "td[data-field='SalesOrderEntry_Currency']", function () {
        var scrollHeight = $('#tableRes .layui-table-body.layui-table-main').prop("scrollHeight");
        var height = $('#tableRes .layui-table-body.layui-table-main').height() + scrollHeight;
        $('#tableRes .layui-table-body.layui-table-main').css("height", height)
    })

    // 暂存
    $(".addedit").on("click", function () {
        var list = $("form").serializeArray();
        var oldData = table.cache[layTableId];
        list.Details = oldData;
        if (!($(this).hasClass("disclick"))) {
            var index = layer.load();
            $.ajax({
                type: "POST",
                url: ajaxaddsale,
                data: list,
                success: function (res) {
                    console.log(res)
                    var isussecc = res.Succeed;
                    var data = res.Data;
                    if (isussecc) {
                        layer.close(index);
                        layer.msg("暂存成功");
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
    })

    //保存
    var isSend = true;
    $(".add").on("click", function () {
        var list = $("form").serializeArray();
        var data = {};
        var newdata = [];
        for (var j = 0; j < list.length; j++) {
            data[list[j].name] = list[j].value
        }
        var oldData = table.cache[layTableId];
        for (var j = 0; j < oldData.length; j++) {
            var nowdata = oldData[j]
            if (nowdata.SalesOrderEntry_Material) {
                if (nowdata.SalesOrderEntry_Deadline == '') {
                    alert("请选择交货日期");
                    isSend = false;
                    return;
                } else {
                    var exrate = $("#SalesOrder_ExRate").val()
                    var curr = $("#currency option:selected").val()
                    nowdata.SalesOrderEntry_Currency = curr
                    nowdata.SalesOrderEntry_ExRate = exrate
                    newdata.push(nowdata)
                }
            }
        }
        if (!($("#Customer_Nick").val())) {
            alert("请选择客户")
            isSend = false;
        } else {
            isSend = true;
        }
        if (!($(this).hasClass("disclick"))) {
            if (isSend) {
                var index = layer.load();
                data.Details = newdata;
                data.SalesOrder_Status = "10000"
                $.ajax({
                    type: "POST",
                    url: ajaxaddsale,
                    data: data,
                    success: function (res) {
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


    $(".hignckick").on("click", function () {
        var _this = $(this)
        var type = _this.attr("data-type");
        if (type == 'daten') {
            _this.attr("data-type", "datey");
            $(".hignrank").removeClass("hidden");
            $(".hignckick").html("收起")
        } else {
            _this.attr("data-type", "daten");
            $(".hignrank").addClass("hidden");
            $(".hignckick").html("更多")
        }
    })
    var isBox = false; 
    var isenter = true;
    // 客户
    $(".changeinput").focus(function () { 
        isBox = true;
        var _this = $(this)
        _this.bind("propertychange change  input paste", function () {
            var requestMsg = $(this).val()
            if (isenter&&isBox) {
                var changethis = $(this)
                $.ajax({
                    type: "get",
                    url: ajaxCus + requestMsg,
                    success: function (res) {
                        var isussecc = res.Succeed;
                        if (isussecc) {
                            var data = res.Data;
                            if (data.length == 0) {
                                changethis.siblings(".changeinputlist ").html("<span class='noData'>无匹配项</span>");
                            } else {
                                var html = ''
                                for (var i = 0; i < data.length; i++) {
                                    var datanow = data[i]
                                    var area = ""
                                    var rate=0
                                    if (datanow.Customer_TaxRate) {
                                         rate = datanow.Customer_TaxRate
                                    }
                                    if (datanow.Customer_Area) {
                                        area = datanow.Customer_Area
                                    }
                                    if (i == 0) {
                                        html += '<li data-id="' + datanow.F_Id + '" class="active" data-area="'+area+'" data-rate="'+rate+'">' + datanow.Customer_Nick + '</option>';
                                    } else {
                                        html += '<li data-id="' + datanow.F_Id + '" data-area="'+area+'" data-rate="'+rate+'">' + datanow.Customer_Nick + '</option>';
                                    }
                                }
                                changethis.siblings(".changeinputlist ").html(html);
                            }
                            changethis.siblings(".changeinputlist").removeClass("hidden");
                        } else {
                            $(".changeinputlist ").html("");
                            changethis.siblings(".changeinputlist").removeClass("hidden");
                            alert(res.Message)
                        }
                    }
                })
            } else {
                isenter = true;
            }
        });
    });
    $(".checkcus").mousemove(function () { 
        isBox = true;
    });
    $(".checkcus").mouseout(function () {
        isBox = false;
    });
    $(".changeinput").blur(function () {
        isBox=true
        $(this).siblings(".changeinputlist").addClass("hidden");
    });
    $(".craftwork").on("mousedown", ".changeinputlist li", function () { 
        var _this = $(this)
        isBox = false;
        var text = $(_this).text();
        var area=$(_this).attr("data-area")
        var rate=$(_this).attr("data-rate")
        $("#SalesOrder_TaxRate").val(rate);
        $("#SalesOrder_Delivery").val(area);
        _this.parent().siblings(".changeinput").val(text);
        _this.parent().addClass("hidden")
    })
    $(".craftwork").on("mouseover", 'li', function () {
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
    })
    $(".changeinput").keydown(function (event) { //键盘上下键以及回车键
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == 38) { //up
            moveSelect(event, -1);
        } else if (event.keyCode == 40) { //down
            moveSelect(event, 1);
        } else if (event.keyCode == 13) {
            isenter = false
            checkselect(event)
        }
    });
    // 上下键
    function moveSelect(event, step) {
        var list = $(event.target).siblings(".changeinputlist").find("li")
        var i = 0;
        var length = list.length
        $.each(list, function (index, v) {
            if ($(v).hasClass("active")) {
                var $bigAutocompleteContent = $(event.target).siblings(".changeinputlist")
                var $nextSiblingTr = $bigAutocompleteContent.find(".active");
                var activeindex = $(v).index()
                if (step == -1) {
                    var $previousSiblingTr = $bigAutocompleteContent.find(".active");
                    if (activeindex <= 0) {
                        activeindex = 0
                    } else {
                        activeindex = activeindex * 1 - 1
                    }
                    $previousSiblingTr = $previousSiblingTr.prev();
                    if($nextSiblingTr.length > 0){//有下一行时（不是最后一行）
                        $(event.target).siblings(".changeinputlist").find("li").eq(activeindex).addClass("active").siblings().removeClass("active");
                        $bigAutocompleteContent.scrollTop($previousSiblingTr[0].offsetTop - $bigAutocompleteContent.height() + $previousSiblingTr.height()+10);
                    }
                } else {
                    var $nextSiblingTr = $bigAutocompleteContent.find(".active");
                    if (activeindex >= length) {
                        activeindex = length
                    } else {
                        activeindex = activeindex * 1 + 1
                    }
                    $nextSiblingTr = $nextSiblingTr.next();
                    if($nextSiblingTr.length > 0){//有下一行时（不是最后一行）
                        $(event.target).siblings(".changeinputlist").find("li").eq(activeindex).addClass("active").siblings().removeClass("active");
                        $bigAutocompleteContent.scrollTop($nextSiblingTr[0].offsetTop - $bigAutocompleteContent.height()  +$nextSiblingTr.height()*2-15);
                    }
                }
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
                var nowli=$(event.target).siblings(".changeinputlist").find("li").eq(activeindex)
                var text =nowli.text();
                var area=nowli.attr("data-area")
                var rate=nowli.attr("data-rate")
                $(v).parent().siblings(".changeinput").val(text);
                $(v).parent().addClass("hidden")
                $("#SalesOrder_TaxRate").val(rate);
                $("#SalesOrder_Delivery").val(area);
                return false
            } else {
                if (++i == length) {
                    var nowli=$(event.target).siblings(".changeinputlist").find("li").eq(0)
                    var text = nowli.text();
                    var area=nowli.attr("data-area")
                    var rate=nowli.attr("data-rate")
                    $(v).parent().siblings(".changeinput").val(text);
                    $(v).parent().addClass("hidden")
                    $("#SalesOrder_TaxRate").val(rate);
                    $("#SalesOrder_Delivery").val(area);
                    return false;
                }
            }
        })
        return false
    }
    // 弹窗数据
    getablelist = function (url, type, tableTitle, clickElem) {
        $(".searchupdata").attr("data-elem", clickElem)
        $(".searchupdata").attr("data-type", type)
        $(".searchupdata").attr("data-url", url)
        $(".searchupdata").attr("data-tableTitle", tableTitle)
        var str;
        $(".termask").removeClass("hidden")
        var title = "选择" + tableTitle
        $(".masktitle").html(title)
        $(".termask #param").focus()
        $.ajax({
            url: url,
            success: function (res) {
                if (res.Succeed) {
                    if (type == 'custom') {
                        str = [{
                                title: '序号',
                                type: 'radio'
                            },
                            {
                                field: 'Customer_Nick',
                                title: '客户名称',
                                align: 'left'
                            },
                            {
                                field: 'Customer_Name',
                                title: '客户代码',
                                align: 'left'
                            },
                            {
                                field: 'Currency_Nick',
                                title: '币别',
                                align: 'left'
                            },
                            {
                                field: 'Customer_TaxNo',
                                title: '	税务登记号',
                                align: 'left'
                            },
                            {
                                field: 'Customer_TaxRate',
                                title: '增值税率',
                                align: 'right'
                            },
                        ]
                    }
                    dialogtable(str, res.Data, clickElem, type)
                }
            }
        })
    }
    $(".searchupdata").on("click", function () {
        var param = $("#param").val()
        var clickelem = $(".searchupdata").attr("data-elem")
        var type = $(".searchupdata").attr("data-type")
        var title = $(".searchupdata").attr("data-tableTitle")
        var url = $(".searchupdata").attr("data-url") + param
        getablelist(url, type, title, clickelem)
        $("#param").val("")
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
                        limit: oldData.length
                    });
                },
                getCheckData: function () { //获取选中数据
                    var checkStatus = table.checkStatus('poplist'),
                        data = checkStatus.data;
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
                var data = obj.data,
                    event = obj.event,
                    tr = obj.tr; //获得当前行 tr 的DOM对象;
                switch (event) {
                    case "state":
                        var stateVal = tr.find("input[name='state']").prop('checked') ? 1 : 0;
                        $.extend(obj.data, {
                            'state': stateVal
                        })
                        activeByType('updateRow', obj.data); //更新行记录对象
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
});




function datachange(data, e) {
    var dataindex = $(e).parent().parent().parent().attr("data-index");
    var oldData = table.cache[layTableId];
    $.each(oldData, function (index, value) {
        if (value.LAY_TABLE_INDEX == dataindex) {
            value.deadlinchage = 1;
            value.SalesOrderEntry_Deadline = data
        }
    });
    tableIns.reload({
        data: oldData,
        limit: oldData.length
    });
}