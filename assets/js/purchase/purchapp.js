
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
        PurchaseApplyEntry_Material: '',//物料--物料id
        PurchaseApplyEntry_Specifications : '',//规格
        // PurchaseApplyEntry_Quantity: '',//价格
        PurchaseApplyEntry_Quantity: '',//数量
        PurchaseApplyEntry_Unit: '',//单位
        // PurchaseApplyEntry_Amount: '',//总额
        // PurchaseApplyEntry_TaxRate: '',//税率
        // PurchaseApplyEntry_Tax: "",//税额
        // PurchaseApplyEntry_Total: '',//合计
        // // PurchaseApplyEntry_ExRate: '1',//汇率
        PurchaseApplyEntry_Deadline: '',//交货日期
        PurchaseApplyEntry_Project :'', //项目
        Remark: '',//备注
        PurchaseApplyEntry_SalesOrder: ''
    }

    tdata.push(data);

}
window.viewObj = {
    tbData: tdata,
    limit: 5,
    last: temip[4]
    // currtype: "55C21484-9E61-4EB8-8496-3137C249130B",
    // rate: '1'
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
            { field: 'PurchaseApplyEntry_Specifications ', title: '规格型号', width: '100', edit: 'text' },
            { field: 'PurchaseApplyEntry_Unit', title: '单位', width: '50', align: "center" },
            {
                field: 'PurchaseApplyEntry_Deadline', title: '<span style="color:red"></span>交货日期', width: '100', align: "center", 
            },
            {
                field: 'PurchaseApplyEntry_Project', title: '<span style="color:red"></span>项目', width: '100', align: "center", 
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
                            console.log("up")
                            $.extend(res.data[i], { 'PurchaseApplyEntry_Deadline': value })
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
                        $cr.find('input[id="PurchaseApplyEntry_Deadline"]').val(value.PurchaseApplyEntry_Deadline);

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
                PurchaseApplyEntry_Material: '',//物料--物料id
                // PurchaseApplyEntry_Currency: viewObj.currtype,//币别
                // PurchaseApplyEntry_Specifications : '',//销售规格
                PurchaseApplyEntry_Unit: '',//单位
                PurchaseApplyEntry_Quantity: '',//数量    数量=未税金额/销售单价
                // PurchaseApplyEntry_Quantity: '',//销售单价
                // PurchaseApplyEntry_Amount: '',//未税金额 数量*销售单价
                // PurchaseApplyEntry_TaxRate: "",//税率 
                // PurchaseApplyEntry_Tax: "",//税额  PurchaseApplyEntry_Tax=PurchaseApplyEntry_Total-PurchaseApplyEntry_Amount
                // PurchaseApplyEntry_TaxPrice: "",//含税单价 (税率  / 100 * 销售单价) + 销售单价
                // PurchaseApplyEntry_Total: '',//价税合计  价税合计=未税金额*(1+税率/100)
                // PurchaseApplyEntry_ExRate: viewObj.rate,//汇率
                PurchaseApplyEntry_Deadline: "",//交货日期
                // PurchaseApplyEntry_Project:'',//项目
                Remark: '',//备注
                // currchange: '0',
                PurchaseApplyEntry_SalesOrder: ''
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
    // table.on('edit(dataTable)', function (obj) {
    //     console.log(obj)
    //     var field = obj.field;
    //     var dataindex = $(obj.tr).attr("data-index");
    //     $.each(tabledata, function (index, value) {

    //         if (value.LAY_TABLE_INDEX == dataindex) {
    //             if (value.Material_Name == '') {
    //                 layer.alert("请先选择物料");
    //                 value.PurchaseApplyEntry_Quantity = '';
    //                 value.PurchaseApplyEntry_Quantity = '';
    //                 value.PurchaseApplyEntry_Amount = '';
    //                 value.PurchaseApplyEntry_TaxRate = '';
    //                 value.PurchaseApplyEntry_Tax = '';
    //                 value.PurchaseApplyEntry_TaxPrice = '';
    //                 value.PurchaseApplyEntry_Total = '';
    //                 value.PurchaseApplyEntry_Deadline = '';
    //                 value.Material_Name = '';
    //             } else {
    //                 if (field == 'PurchaseApplyEntry_Quantity') {//销售单价
    //                     value.PurchaseApplyEntry_Quantity = parseFloat(value.PurchaseApplyEntry_Quantity)
    //                     // 未税金额=数量*销售单价
    //                     value.PurchaseApplyEntry_Amount = parseFloat(value.PurchaseApplyEntry_Quantity) * parseFloat(value.PurchaseApplyEntry_Quantity)
    //                     // 含税单价=销售单价*（1+税率/100）
    //                     value.PurchaseApplyEntry_TaxPrice = parseFloat(value.PurchaseApplyEntry_Quantity) * (1 + parseFloat(value.PurchaseApplyEntry_TaxRate) / 100)
    //                     // 价税合计=数量*含税单价
    //                     value.PurchaseApplyEntry_Total = parseFloat(value.PurchaseApplyEntry_Quantity) * parseFloat(value.PurchaseApplyEntry_TaxPrice)
    //                     // 税额=未税金额*（税率/100）
    //                     value.PurchaseApplyEntry_Tax = parseFloat(value.PurchaseApplyEntry_Amount) * (parseFloat(value.PurchaseApplyEntry_TaxRate) / 100)

    //                 } else if (field == 'PurchaseApplyEntry_Quantity') {//数量
    //                     value.PurchaseApplyEntry_Quantity = parseFloat(value.PurchaseApplyEntry_Quantity)
    //                     // 未税金额=数量*销售单价
    //                     value.PurchaseApplyEntry_Amount = parseFloat(value.PurchaseApplyEntry_Quantity) * parseFloat(value.PurchaseApplyEntry_Quantity)
    //                     // 含税单价=销售单价*（1+税率/100）
    //                     value.PurchaseApplyEntry_TaxPrice = parseFloat(value.PurchaseApplyEntry_Quantity) * (1 + parseFloat(value.PurchaseApplyEntry_TaxRate) / 100)
    //                     // 价税合计=数量*含税单价
    //                     value.PurchaseApplyEntry_Total = parseFloat(value.PurchaseApplyEntry_Quantity) * parseFloat(value.PurchaseApplyEntry_TaxPrice)
    //                     // 税额=未税金额*（税率/100）
    //                     value.PurchaseApplyEntry_Tax = parseFloat(value.PurchaseApplyEntry_Amount) * (parseFloat(value.PurchaseApplyEntry_TaxRate) / 100)
    //                     // value.PurchaseApplyEntry_Quantity='0'

    //                 } else if (field == 'PurchaseApplyEntry_TaxPrice') {//含税单价
    //                     value.PurchaseApplyEntry_TaxPrice = parseFloat(value.PurchaseApplyEntry_TaxPrice)
    //                     // 销售单价=含税单价/(1+税率/100)
    //                     value.PurchaseApplyEntry_Quantity = parseFloat(value.PurchaseApplyEntry_TaxPrice) / (1 + parseFloat(value.PurchaseApplyEntry_TaxRate) / 100)
    //                     // 未税金额=数量*销售单价
    //                     value.PurchaseApplyEntry_Amount = parseFloat(value.PurchaseApplyEntry_Quantity) * parseFloat(value.PurchaseApplyEntry_Quantity)
    //                     // 价税合计=数量*含税单价
    //                     value.PurchaseApplyEntry_Total = parseFloat(value.PurchaseApplyEntry_Quantity) * parseFloat(value.PurchaseApplyEntry_TaxPrice)
    //                     // 税额=未税金额*（税率/100）
    //                     value.PurchaseApplyEntry_Tax = parseFloat(value.PurchaseApplyEntry_Amount) * (parseFloat(value.PurchaseApplyEntry_TaxRate) / 100)


    //                 } else if (field == 'PurchaseApplyEntry_Amount') {//未税金额 
    //                     value.PurchaseApplyEntry_Amount = parseFloat(value.PurchaseApplyEntry_Amount)
    //                     // 销售单价=未税金额/数量
    //                     value.PurchaseApplyEntry_Quantity = parseFloat(value.PurchaseApplyEntry_Amount) / parseFloat(value.PurchaseApplyEntry_Quantity)
    //                     // 含税单价=销售单价*（1+税率/100）
    //                     value.PurchaseApplyEntry_TaxPrice = parseFloat(value.PurchaseApplyEntry_Quantity) * (1 + parseFloat(value.PurchaseApplyEntry_TaxRate) / 100)
    //                     // 价税合计=数量*含税单价
    //                     value.PurchaseApplyEntry_Total = parseFloat(value.PurchaseApplyEntry_Quantity) * parseFloat(value.PurchaseApplyEntry_TaxPrice)
    //                     // 税额=未税金额*（税率/100）
    //                     value.PurchaseApplyEntry_Tax = parseFloat(value.PurchaseApplyEntry_Amount) * (parseFloat(value.PurchaseApplyEntry_TaxRate) / 100)


    //                 } else if (field == 'PurchaseApplyEntry_Total') { //价税合计 
    //                     value.PurchaseApplyEntry_Total = parseFloat(value.PurchaseApplyEntry_Total)
    //                     // 含税单价=价税合计/数量
    //                     value.PurchaseApplyEntry_TaxPrice = parseFloat(value.PurchaseApplyEntry_Total) / parseFloat(value.PurchaseApplyEntry_Quantity)
    //                     // 销售单价=含税单价/（1+税率/100）
    //                     value.PurchaseApplyEntry_Quantity = parseFloat(value.PurchaseApplyEntry_TaxPrice) / (1 + parseFloat(value.PurchaseApplyEntry_TaxRate) / 100)

    //                     // 未税金额=数量*销售单价
    //                     value.PurchaseApplyEntry_Amount = parseFloat(value.PurchaseApplyEntry_Quantity) * parseFloat(value.PurchaseApplyEntry_Quantity)
    //                     // 税额=未税金额*（税率/100）
    //                     value.PurchaseApplyEntry_Tax = parseFloat(value.PurchaseApplyEntry_Amount) * (parseFloat(value.PurchaseApplyEntry_TaxRate) / 100)

    //                 } else if (field == 'PurchaseApplyEntry_TaxRate') {//税率
    //                     value.PurchaseApplyEntry_TaxRate = parseFloat(value.PurchaseApplyEntry_TaxRate)
    //                     // 含税单价=销售单价*（1+税率/100）
    //                     value.PurchaseApplyEntry_TaxPrice = parseFloat(value.PurchaseApplyEntry_Quantity) * (1 + parseFloat(value.PurchaseApplyEntry_TaxRate || '0') / 100)
    //                     // 未税金额=数量*销售单价
    //                     value.PurchaseApplyEntry_Amount = parseFloat(value.PurchaseApplyEntry_Quantity) * parseFloat(value.PurchaseApplyEntry_Quantity)
    //                     // 价税合计=数量*含税单价
    //                     value.PurchaseApplyEntry_Total = parseFloat(value.PurchaseApplyEntry_Quantity) * parseFloat(value.PurchaseApplyEntry_TaxPrice)
    //                     // 税额=未税金额*（税率/100）
    //                     value.PurchaseApplyEntry_Tax = parseFloat(value.PurchaseApplyEntry_Amount) * (parseFloat(value.PurchaseApplyEntry_TaxRate || '0') / 100)
    //                 }



    //             }
    //         }


    //     });
    //     var oldData = table.cache[layTableId];
    //     tableIns.reload({
    //         data: oldData,
    //         limit: viewObj.limit
    //     });
    // });

   // 渲染表格
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
                                        // var rate = $("#SalesOrder_TaxRate").val();//税率
                                        var sendate = $("#recdate").val();//交货日期
                                        $.each(tabledata, function (index, value) {
                                            if (value.LAY_TABLE_INDEX == dataindex) {
                                                value.Material_Name = name || "";
                                                value.Material_Nick = nick || "";
                                                value.PurchaseApplyEntry_Specifications  = specife || "";
                                                value.PurchaseApplyEntry_Material = marid || "";
                                                value.PurchaseApplyEntry_Unit = measure
                                                value.PurchaseApplyEntry_Quantity = 1;//数量
                                                // value.PurchaseApplyEntry_Quantity = 0.00;//销售单价
                                                // value.PurchaseApplyEntry_TaxRate = rate || '16';//税率
                                                // value.PurchaseApplyEntry_Deadline = sendate || '';//交货日期
                                                // value.PurchaseApplyEntry_TaxPrice = 0;//含税单价
                                                // value.PurchaseApplyEntry_Amount = 0;//未税金额
                                                // value.PurchaseApplyEntry_Total = 0;//价税合计
                                                // value.PurchaseApplyEntry_Tax = 0;//税额
                                                // value.PurchaseApplyEntry_Project=project || "";
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
                            // var rate = $("#SalesOrder_TaxRate").val();//税率
                            var sendate = $("#recdate").val();//交货日期
                            $.each(tabledata, function (index, value) {
                                // console.log(value)
                                if (value.LAY_TABLE_INDEX == dataindex) {
                                    value.Material_Name = name || "";
                                    value.Material_Nick = nick || "";
                                    value.PurchaseApplyEntry_Specifications  = specife || "";
                                    value.PurchaseApplyEntry_Material = marid || "";
                                    value.PurchaseApplyEntry_Unit = measure;
                                    // value.PurchaseApplyEntry_Quantity = 1;//数量
                                    // value.PurchaseApplyEntry_Quantity = 0.00;//销售单价
                                    // value.PurchaseApplyEntry_TaxRate = rate || '16';//税率
                                    // value.PurchaseApplyEntry_Deadline = sendate || '';//交货日期
                                    // value.PurchaseApplyEntry_TaxPrice = 0;//含税单价
                                    // value.PurchaseApplyEntry_Amount = 0;//未税金额
                                    // value.PurchaseApplyEntry_Total = 0;//价税合计
                                    // value.PurchaseApplyEntry_Tax = 0;//税额
                                    // value.PurchaseApplyEntry_Project=project || "";
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
            var fId = '';
            var rate = "";
            if (isussecc) {
                var html = '<option value="">请选择币别</option>';
                var htmlOption = '<dd lay-value="" class="layui-select-tips layui-this">请选择币别</dd>'
                for (var i = 0; i < data.length; i++) {
                    // Currency_Name: "M0001"
                    //Currency_Nick: "人民币"
                    dateslit.push(data[i])
                    var dataNow = data[i];
                    if (dataNow.Currency_Nick == '人民币') {
                        fId = dataNow.F_Id;
                        rate = dataNow.Currency_ExRate
                    }
                    html += '<option value="' + dataNow.F_Id + '" >' + dataNow.Currency_Nick + '</option>';
                    htmlOption += '<dd lay-value="' + dataNow.F_Id + '">' + dataNow.Currency_Nick + '</dd>'
                    currname.push(dataNow.F_Id)
                    currnick.push(dataNow.Currency_Nick)
                    currnamshow.push(dataNow.Currency_Name)
                    ratelist.push(dataNow.Currency_ExRate)
                }
                $("#currency").html(html);
                $(".currency .layui-anim.layui-anim-upbit").html(htmlOption);
                renderForm();
                var select = 'dd[lay-value="' + fId + '"]';
                $('#currency').siblings("div.layui-form-select").find('dl').find(select).click();
                $("#SalesOrder_ExRate").val(rate)
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
                        var htmlOption = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                        for (var i = 0; i < data.length; i++) {
                            html += '<option value="' + data[i].F_Id + '" >' + data[i].Supplier_Nick + '</option>';
                            htmlOption += '<dd lay-value="' + data[i].F_Id + '" >' + data[i].Supplier_Nick + '</dd>'
                        }
                        $("#SupplierMaterial_Supplier").html(html);
                        $(".supplier .layui-anim.layui-anim-upbit").html(htmlOption);
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


    // 采购申请单号
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

    // 审核日期
    laydate.render({
        elem: '#shrq',
        isInitValue: true,
        btns: ['now', 'confirm'],
        done: function (val) {
            $.each(tabledata, function (index, value) {
                if (value.PurchaseApplyEntry_Deadline == '' && value.Material_Name != '') {
                    value.PurchaseApplyEntry_Deadline = val;
                }
                var oldData = table.cache[layTableId];
                tableIns.reload({
                    data: oldData,
                    limit: viewObj.limit
                });

            });

        }
    });

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
                $("#SalesOrder_ExRate").val(ratelist[nowk])
            }
        }

    });

    $(document).on("click", "td[data-field='PurchaseApplyEntry_Currency']", function () {
        var scrollHeight = $('#tableRes .layui-table-body.layui-table-main').prop("scrollHeight");
        var height = $('#tableRes .layui-table-body.layui-table-main').height() + scrollHeight;
        $('#tableRes .layui-table-body.layui-table-main').css("height", height)
    })



    // 保存
    $(".sub").on("click", function () {
        var list = $("form").serializeArray();
        var oldData = table.cache[layTableId];
        list.Details = oldData;
        if (!($(this).hasClass("audit"))) {
            var index = layer.load();
            $.ajax({
                type: "POST",
                url: addPurchase,
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

    //新增
    var isSend = true;
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
            console.log(newdata)
            if (nowdata.PurchaseApply_Deadline) {
                if (nowdata.PurchaseApply_Deadline == '') {
                    alert("请选择交货时间");
                    isSend = false;
                    return;
                } else {
                    newdata.push(nowdata)
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
        if (!($(this).hasClass("audit"))) {
            if (isSend) {
                var index = layer.load();

                data.Details = newdata;
                data.SalesOrder_Status="10000"
                // console.log(list)
                $.ajax({
                    type: "POST",
                    url: addPurchase,
                    data: data,
                    success: function (res) {
                        // console.log(res)
                        var isussecc = res.Succeed;
                        var data = res.Data;
                        if (isussecc) {
                            layer.close(index);
                            layer.msg("审核成功");
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
            value.PurchaseApplyEntry_Deadline = data
        }
    });
    tableIns.reload({
        data: oldData,
        limit: viewObj.limit
    });
}