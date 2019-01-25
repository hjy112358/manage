
var dateslit = [], curid = [], curnick = [], cusid = [], cusnick = [], materid = [], maternick = [], matername = [];

var token = $.cookie("token");
var url = window.location.search;
var id = url.split("?")[1].split("&")[0].split("=")[1];
var scaleid = url.split("?")[1].split("&")[1].split("=")[1];

$.ajax({
    type: "get",
    url: ajaxURl + '/Api/PSISales/SalesOrder/GetEntry?keyValue=' + scaleid,
    success: function (res) {
        console.log(res)
        var isussecc = res.Succeed;
        var data = res.Data;
        if (isussecc) {
            if (data) {
                $("#SalesOrder_Name").val(data.SalesOrder_Name)
                getcusnick(data.SalesOrder_Customer);
                getcurr(data.SalesOrder_Currency);
                getbii(data.SalesOrder_Biller)
                if (data.SalesOrder_DateTime) {
                    $("input[name=SalesOrder_DateTime]").val(data.SalesOrder_DateTime.split(" ")[0].replace(/\//g, "-"));
                }
                $("#SalesOrder_Status").val(data.SalesOrder_Status);
                $("#SalesOrder_ExRate").val(data.SalesOrder_ExRate)
                $("#SalesOrder_TaxRate").val(data.SalesOrder_TaxRate)
                $("#SalesOrder_Biller").val(data.SalesOrder_Biller)
                $("#Remark").val(data.Remark)
                $("#SalesOrder_Project").val(data.SalesOrder_Project)
                $("#F_Id").val(data.F_Id)
                $("#SalesOrder_Delivery").val(data.SalesOrder_Delivery)
                $("#SalesOrder_Payment").val(data.SalesOrder_Payment)
                $("#SalesOrder_Cycle").val(data.SalesOrder_Cycle);
               
                getstatus(data.SalesOrder_Status); // 单据状态
                gettype(data.SalesOrder_Type);// 订单类型
                getdepart(data.SalesOrder_Department)// 部门
                getem(data.SalesOrder_Employee)// 业务员  
                getmater(res.Data.Details)
                // tableload(res.Data.Details)
                // first = res.Data.Details[(res.Data.Details.length - 1).F_Id]
            }

        } else {
            alert(JSON.parse(res).Message)
        }
    }
})



var currname = [];
var currnick = [];
var currnamshow = [];
var ratelist = [];
// var first;
function tableload(tdata) {
    var tid = new Date().valueOf();
    // var newRow = {
    //     tempId: tid,
    //     state: 0,
    //     Material_Name: '',//物料代码
    //     Material_Nick: '',//物料名称
    //     SalesOrderEntry_Material: '',//物料--物料id
    //     // SalesOrderEntry_Currency: "",//币别
    //     SalesOrderEntry_Specifications: '',//销售规格
    //     SalesOrderEntry_Price: '',//价格
    //     SalesOrderEntry_Quantity: '',//数量
    //     SalesOrderEntry_Unit: '',//单位
    //     SalesOrderEntry_Amount: '',//总额
    //     SalesOrderEntry_TaxRate: '',//税率
    //     SalesOrderEntry_Tax: "",//税额
    //     SalesOrderEntry_Total: '',//合计
    //     // SalesOrderEntry_ExRate: '',//汇率
    //     SalesOrderEntry_Deadline: '',//交货日期
    //     Remark: '',//备注
    //     // currchange: '0',
    //     SalesOrderEntry_SalesOrder: scaleid,

    // };
    // first = tid;
    // tdata.push(newRow)
    window.viewObj = {
        tbData: tdata,
        limit: tdata.length
        // last: first
    };
    var tableIns;
    var upload;
    //layui 模块化引用
    layui.use(['jquery', 'table', 'layer', "form", "layedit", "laydate", "upload"], function () {
        var $ = layui.$,
            form = layui.form,
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate,
            element = layui.element,
            table = layui.table;
        upload = layui.upload;
        var myDate = new Date();
        var nowY = myDate.getFullYear();
        var nowM = myDate.getMonth() + 1;
        var nowD = myDate.getDate();
        var tody = nowY + "-" + (nowM < 10 ? "0" + nowM : nowM) + "-" + (nowD < 10 ? "0" + nowD : nowD);

        //日期
        laydate.render({
            elem: '#date',
            // value: tody,
            isInitValue: true,
            btns: ['now', 'confirm']
        });

        //数据表格实例化		
        var layTableId = "layTable";
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
                { field: 'Material_Name', title: '<span style="color:red">*  </span>物料代码', templet: '#selectTool', width: '120' },
                { field: 'Material_Nick', title: '物料名称', width: '200' },
                { field: 'SalesOrderEntry_Specifications', title: '规格', width: '100' },
                { field: 'SalesOrderEntry_Unit', title: '单位', width: '50', align: "center" },
                { field: 'SalesOrderEntry_Quantity', title: '<span style="color:red">*  </span>数量', edit: 'text', width: '80', align: "center" },
                {
                    field: 'SalesOrderEntry_Price', title: '销售单价', edit: 'text', width: '100', align: "right", templet: function (d) {
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
                    field: 'SalesOrderEntry_TaxPrice', title: '含税单价', edit: 'text', align: "right", width: '100', templet: function (d) {
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
                    field: 'SalesOrderEntry_Amount', title: '未税金额', edit: 'text', align: "right", width: '100', templet: function (d) {
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
                { field: 'SalesOrderEntry_TaxRate', title: '税率(%)', edit: 'text', width: '50', align: "center" },
                {
                    field: 'SalesOrderEntry_Total', title: '价税合计', align: "right", edit: 'text', width: '100', templet: function (d) {
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
                    field: 'SalesOrderEntry_Tax', title: '税额', edit: 'text', align: "right", width: '80', templet: function (d) {
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
                // { field: 'SalesOrderEntry_Currency', title: '币别', templet: '#selectcur',width:'100' },
                // { field: 'SalesOrderEntry_ExRate', title: '汇率', edit: 'text' ,width:'100'},

                {
                    field: 'SalesOrderEntry_Deadline', title: '<span style="color:red">*  </span>交货日期', width: '100', templet: function (d) {
                        var date = ''
                        if (d.SalesOrderEntry_Deadline) {
                            date = d.SalesOrderEntry_Deadline.split(" ")[0].replace(/\//g, "-");

                        }

                        return '<input type="text" id="SalesOrderEntry_Deadline" value="' + date + '" placeholder="" readonly="readonly" class="layui-input layui-input-date"/>';
                    }
                },
                { field: 'Remark', title: '备注', edit: 'text', width: '200' },
                {
                    field: 'tempId', title: '操作', align: 'center', width: '100', templet: function (d) {
                        return '<a class="layui-btn layui-btn-xs layui-btn-danger" onclick=del("' + d.F_Id + '")>删除</a>';
                    }
                }
            ]],
            done: function (res, curr, count) {
                // console.log(dateslit)
                viewObj.tbData = res.data;
                prolist();

                $(".layui-input-date").each(function (i) {
                    layui.laydate.render({
                        elem: this,
                        format: "yyyy-MM-dd",
                        done: function (value, date) {
                            if (res && res.data[i]) {
                                $.extend(res.data[i], { 'SalesOrderEntry_Deadline': value })
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
                            var date = value.SalesOrderEntry_Deadline;
                            if (date.indexOf("/") == '-1') {
                                date = date.split(" ")[0]
                                $cr.find('input[id="SalesOrderEntry_Deadline"]').val(date);
                            } else {
                                date = date.split(" ")[0].replace(/\//g, "-");
                                $cr.find('input[id="SalesOrderEntry_Deadline"]').val(date);
                            }

                            for (var i = 0; i < currname.length; i++) {
                                var nownick = currname[i];
                                var nowi = i;
                                if (nownick == value.SalesOrderEntry_Currency) {
                                    $cr.find('td[data-field="SalesOrderEntry_Currency"] input').val(currnick[nowi]);
                                    return;
                                } else {
                                    $cr.find('td[data-field="SalesOrderEntry_Currency"] input').val("");
                                }
                            }

                        }
                    });
                });


            }
        });


        //定义事件集合
        var active = {
            // add: function () {	//添加一行
            //     viewObj.limit = viewObj.limit + 1;
            //     var oldData = table.cache[layTableId];
            //     // console.log(oldData);
            //     var tid = new Date().valueOf();
            //     var newRow = {
            //         tempId: tid,
            //         state: 0,
            //         Material_Name: '',//物料代码
            //         Material_Nick: '',//物料名称
            //         SalesOrderEntry_Material: '',//物料--物料id
            //         // SalesOrderEntry_Currency: "",//币别
            //         SalesOrderEntry_Specifications: '',//销售规格
            //         SalesOrderEntry_Price: '',//价格
            //         SalesOrderEntry_Quantity: '',//数量
            //         SalesOrderEntry_Unit: '',//单位
            //         SalesOrderEntry_Amount: '',//总额
            //         SalesOrderEntry_TaxRate: '',//税率
            //         SalesOrderEntry_Tax: "",//税额
            //         SalesOrderEntry_Total: '',//合计
            //         // SalesOrderEntry_ExRate: '',//汇率
            //         SalesOrderEntry_Deadline: '',//交货日期
            //         Remark: '',//备注
            //         // currchange: '0',
            //         SalesOrderEntry_SalesOrder: id
            //     };
            //     oldData.push(newRow);
            //     viewObj.last = tid;
            //     tableIns.reload({
            //         data: oldData,
            //         limit: viewObj.limit
            //     });
            // },
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
                // case "del":
                //     if (viewObj.limit == 1) {
                //         alert("删除失败，至少应有一条数据")
                //     } else {
                //         viewObj.limit = viewObj.limit - 1;
                //         layer.confirm('确定删除？', function (index) {
                //             obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                //             layer.close(index);
                //             activeByType('removeEmptyTableCache');

                //         });
                //     }
                //     break;
            }
        });
        table.on('edit(dataTable)', function (obj) {
            console.log(obj)
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
                        if (field == 'SalesOrderEntry_Price') {//销售单价
                            value.SalesOrderEntry_Price = parseFloat(value.SalesOrderEntry_Price)
                            // 含税单价=销售单价*（1+税率/100）
                            value.SalesOrderEntry_TaxPrice = parseFloat(value.SalesOrderEntry_Price) * (1 + parseFloat(value.SalesOrderEntry_TaxRate) / 100)
                            // 未税金额=数量*销售单价
                            value.SalesOrderEntry_Amount = parseFloat(value.SalesOrderEntry_Quantity) * parseFloat(value.SalesOrderEntry_Price)
                            // 价税合计=数量*含税单价
                            value.SalesOrderEntry_Total = parseFloat(value.SalesOrderEntry_Quantity) * parseFloat(value.SalesOrderEntry_TaxPrice)
                            // 税额=未税金额*（税率/100）
                            value.SalesOrderEntry_Tax = parseFloat(value.SalesOrderEntry_Amount) * (parseFloat(value.SalesOrderEntry_TaxRate) / 100)

                        } else if (field == 'SalesOrderEntry_Quantity') {//数量
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

                        } else if (field == 'SalesOrderEntry_TaxPrice') {//含税单价
                            value.SalesOrderEntry_TaxPrice = parseFloat(value.SalesOrderEntry_TaxPrice)
                            // 销售单价=含税单价/(1+税率/100)
                            value.SalesOrderEntry_Price = parseFloat(value.SalesOrderEntry_TaxPrice) / (1 + parseFloat(value.SalesOrderEntry_TaxRate) / 100)
                            // 未税金额=数量*销售单价
                            value.SalesOrderEntry_Amount = parseFloat(value.SalesOrderEntry_Quantity) * parseFloat(value.SalesOrderEntry_Price)
                            // 价税合计=数量*含税单价
                            value.SalesOrderEntry_Total = parseFloat(value.SalesOrderEntry_Quantity) * parseFloat(value.SalesOrderEntry_TaxPrice)
                            // 税额=未税金额*（税率/100）
                            value.SalesOrderEntry_Tax = parseFloat(value.SalesOrderEntry_Amount) * (parseFloat(value.SalesOrderEntry_TaxRate) / 100)


                        } else if (field == 'SalesOrderEntry_Amount') {//未税金额 
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

                        } else if (field == 'SalesOrderEntry_TaxRate') {//税率 
                            value.SalesOrderEntry_TaxRate = parseFloat(value.SalesOrderEntry_TaxRate)
                            // 含税单价=销售单价*（1+税率/100）
                            value.SalesOrderEntry_TaxPrice = parseFloat(value.SalesOrderEntry_Price) * (1 + parseFloat(value.SalesOrderEntry_TaxRat || '0') / 100)
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
                    // $("#tablelist .layui-table-body").addClass("overvis");
                    // $("#tablelist .layui-table-box").addClass("overvis");
                    // $("#tablelist .layui-table-view").addClass("overvis");
                    var scrollHeight = $('#tableRes .layui-table-body.layui-table-main').prop("scrollHeight");
                    var height = $('#tableRes .layui-table-body.layui-table-main').height() + scrollHeight + 280;

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

                            } else {
                                $(nowtr).find(".selectlist1").removeClass("hidden");
                                $(nowtr).find(".dateload").removeClass("hidden")
                                $(nowtr).find(".datelist").addClass("hidden")
                            }
                        });

                        $.ajax({
                            url: ajaxURl + '/Api/PSIBase/Material/GetList?keyword=&PageIndex=&PageSize=',
                            success: function (res) {
                                $(".dateload").addClass("hidden")
                                $(".datelist").removeClass("hidden")
                                // console.log(JSON.parse(res))
                                var data = res.Data;
                                var isussecc = res.Succeed;
                                if (isussecc) {
                                    // data[i].Material_Name data[i].Material_Nick  data[i].Material_Specification
                                    for (var i = 0; i < data.length; i++) {
                                        var datanow = data[i];
                                        htmlterm += '<li data-name="' + (datanow.Material_Name || '') + '" data-nick="' + (datanow.Material_Nick || '') + '" data-spe="' + (datanow.Material_Specifications || '') + '" data-materme="' + (datanow.Material_Measure || '') + '" data-materid="' + (datanow.F_Id || '') + '"><p>' + (datanow.Material_Name || '') + '</p><p>' + (datanow.Material_Nick || '') + '</p><p>' + (datanow.Material_Specifications || '') + '</p></li>'
                                        arri = { materame: (datanow.Material_Name || ''), maternick: (datanow.Material_Nick || ''), matersp: (datanow.Material_Specifications || ''), matermea: (datanow.Material_Measure || ''), materid: (datanow.F_Id || '') };
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
                                            } else {

                                            }
                                        })
                                        // console.log(showList)
                                        for (var j = 0; j < showList.length; j++) {
                                            var shownow = showList[j]
                                            searchlist += '<li data-name="' + shownow.materame + '" data-nick="' + shownow.maternick + '" data-spe="' + shownow.matersp + '" data-materme="' + shownow.materme + '" data-materid="' + shownow.materid + '"><p>' + shownow.materame + '</p><p>' + shownow.maternick + '</p><p>' + shownow.matersp + '</p></li>'
                                        }
                                        if (showList.length == 0) {
                                            searchlist = '<div style="text-align:center;padding:15px 10px 15px 0; ">暂无数据</div>'
                                        }
                                        $(".selectlist1 ul").html("");
                                        $(".selectlist1 ul").html(searchlist);

                                    })
                                    $('.selectlist1 ul').find('li').each(function () {
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
                                            var rate = $("#SalesOrder_TaxRate").val();//税率
                                            var sendate = $("#recdate").val();//交货日期
                                            // $(".maternick").val(nick);
                                            // $(".materspe").val(specife);
                                            // $("#measure").val(measure);
                                            console.log(nick)
                                            $.each(tabledata, function (index, value) {
                                                console.log(value)
                                                if (value.LAY_TABLE_INDEX == dataindex) {
                                                    value.Material_Name = name || "";
                                                    value.Material_Nick = nick || "";
                                                    value.SalesOrderEntry_Specifications = specife || "";
                                                    value.SalesOrderEntry_Material = marid || "";
                                                    value.SalesOrderEntry_Unit = measure
                                                    value.SalesOrderEntry_Quantity = 1;//数量
                                                    value.SalesOrderEntry_Price = 0.00;//销售单价
                                                    value.SalesOrderEntry_TaxRate = rate || '16';//税率
                                                    value.SalesOrderEntry_Deadline = sendate || '';//交货日期
                                                    value.SalesOrderEntry_TaxPrice = 0;//含税单价
                                                    value.SalesOrderEntry_Amount = 0;//未税金额
                                                    value.SalesOrderEntry_Total = 0;//价税合计
                                                    value.SalesOrderEntry_Tax = 0;//税额
                                                    var oldData = table.cache[layTableId];
                                                    tableIns.reload({
                                                        data: oldData,
                                                        limit: viewObj.limit
                                                    });
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
                                } else {

                                }
                            })
                            // console.log(showList)
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

                        })
                        $('.selectlist1 ul').find('li').each(function () {
                            var _this1 = $(this);
                            _this1.hover(function () {
                                $(this).addClass("active").siblings().removeClass("active")
                            });
                            _this1.on("click", function () {
                                var oldData = table.cache[layTableId];
                                // console.log(oldData)
                                var name = $(this).attr("data-name");
                                var nick = $(this).attr("data-nick");
                                console.log(nick)
                                var specife = $(this).attr("data-spe");
                                var measure = $(this).attr("data-materme");
                                var marid = $(this).attr("data-materid")
                                $(".materName").val(name || '');
                                var rate = $("#SalesOrder_TaxRate").val();//税率
                                var sendate = $("#recdate").val();//交货日期
                                // $(".maternick").val(nick);
                                // $(".materspe").val(specife);
                                // $("#measure").val(measure);
                                $.each(tabledata, function (index, value) {
                                    // console.log(value)
                                    if (value.LAY_TABLE_INDEX == dataindex) {
                                        value.Material_Name = name || "";
                                        value.Material_Nick = nick || "";
                                        value.SalesOrderEntry_Specifications = specife || "";
                                        value.SalesOrderEntry_Material = marid || "";
                                        value.SalesOrderEntry_Unit = measure;
                                        value.SalesOrderEntry_Quantity = 1;//数量
                                        value.SalesOrderEntry_Price = 0.00;//销售单价
                                        value.SalesOrderEntry_TaxRate = rate || '16';//税率
                                        value.SalesOrderEntry_Deadline = sendate || '';//交货日期
                                        value.SalesOrderEntry_TaxPrice = 0;//含税单价
                                        value.SalesOrderEntry_Amount = 0;//未税金额
                                        value.SalesOrderEntry_Total = 0;//价税合计
                                        value.SalesOrderEntry_Tax = 0;//税额
                                        var oldData = table.cache[layTableId];
                                        tableIns.reload({
                                            data: oldData,
                                            limit: viewObj.limit
                                        });
                                        // if (value.tempId == viewObj.last) {
                                        //     // activeByType("add");
                                        // } else {
                                        //     var oldData = table.cache[layTableId];
                                        //     tableIns.reload({
                                        //         data: oldData,
                                        //         limit: viewObj.limit
                                        //     });
                                        // }
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

       



        // 制单人
        // var mouser = $.cookie("Modify_User");
        // var username = $.cookie("User_Nick")
        // $("#SalesOrder_Biller").val(mouser)
        // $("#SalesOrder_Billername").val(username)

        form.on('select(customer)', function (data) {
            console.log(data);
            var rate = ''
            if(data.value){
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
                $("#SalesOrder_TaxRate").val(rate);
                $.each(tabledata, function (index, value) {
                    if (value.Material_Name) {
                        value.SalesOrderEntry_TaxRate = rate;
                    }
    
                });
                
            }
            var oldData = table.cache[layTableId];
                tableIns.reload({
                    data: oldData,
                    limit: viewObj.limit
                });
            
        })

        function renderForm() {
            layui.use('form', function () {
                var form = layui.form;
                form.render();
                // var oldData = table.cache[layTableId];
                // tableIns.reload({
                //     data: oldData,
                //     limit: viewObj.limit
                // });
            });
        }

        //日期
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
                        limit: viewObj.limit
                    });

                });

            }
        });

        $(document).on("click", function () {
            var evt = event.srcElement ? event.srcElement : event.target;
            var seletlist = $(".selectlist1");
            for (var i = 0; i < seletlist.length; i++) {
                if (!($(seletlist[i]).hasClass("hidden"))) {
                    if (evt.id == 'checkmater') {
                        var oldData = table.cache[layTableId];
                        tableIns.reload({
                            data: oldData,
                            limit: viewObj.limit
                        });
                        return; // 如果是元素本身，则返回
                    }
                    else {
                        $(".selectlist1").addClass("hidden");
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


        $(".hignckick").on("click", function () {
            // data-type="daten"
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
        // $(document).on("click", function () {

        //     $("#tablelist .layui-table-body").addClass("overvis");
        //     $("#tablelist .layui-table-box").addClass("overvis");
        //     $("#tablelist .layui-table-view").addClass("overvis");
        // })


        //多文件列表示例
        var tablehead = $('#tablehead');
        var tablebody = $('#tablebody');
        var imgcount = 0;
        var headhtml = "<tr><th>文件名</th><th>大小</th><th>操作</th></tr>";
        var uploadListIns = upload.render({
            elem: '#testList'
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


        //撤换币别
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

        // 保存
        var isSend = true;
        $(".add").on("click", function () {
            if (!($("#Customer_Nick").val())) {
                alert("请选择客户")
                isSend = false;
            } else {
                isSend = true;
            }
            var data = {};
            var newdata = [];
            var oldData = table.cache[layTableId];
            for (var j = 0; j < oldData.length; j++) {
                var nowdata = oldData[j]
                if (nowdata.SalesOrderEntry_Material) {
                    if (nowdata.SalesOrderEntry_Deadline == '') {
                        alert("请选择交货日期");
                        isSend = false;
                        return;
                    } else {
                        newdata.push(nowdata)
                        continue
                    }
                }
            }
            if (!($(this).hasClass("disclick"))) {
                if (isSend) {
                    var index = layer.load();
                  
                    var list = $("form").serializeArray();
                    for (var j = 0; j < list.length; j++) {
                        console.log(list[j])
                        data[list[j].name] = list[j].value
                    }
                    data.Details = newdata;
                    console.log(data)
                    $.ajax({
                        type: "POST",
                        url: ajaxURl + '/Api/PSISales/SalesOrder/Edit',
                        data: data,
                        success: function (res) {
                            console.log(res)
                            var isussecc = res.Succeed;
                            var data = res.Data;
                            if (isussecc) {
                                layer.close(index);
                                layer.msg("修改成功");
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

    });


}

 // 删除子表
 function del(id){
    var index = layer.confirm('确认删除？', {
        btn: ['确定', '取消'] //按钮
    }, function () {
        // console.log(id)
        $.ajax({
            type: "POST",
            // async: false,
            url: delentry,
            data: {
                F_Id: id
            },
            success: function (res) {
                var data = res.Data;
                console.log(data)
                var isussecc = res.Succeed;
                if (isussecc) {
                    layer.close(index)
                   window.location.reload()
                } else {
                    layer.close(index)
                    alert(res.Message)
                }
            },
            error:function(res){
                console.log(res)
            }
        })
    }); 
   
}
//物料-
function getmater(data) {
    $.ajax({
        url:ajaxMater,
        success: function (res) {
            console.log(res)
            var isussecc = res.Succeed;
            if (isussecc) {
                for(var j=0;j<data.length;j++){
                    for (var i = 0; i < res.Data.length; i++) {
                        if(data[j].SalesOrderEntry_Material==res.Data[i].F_Id){
                            data[j].Material_Nick=res.Data[i].Material_Nick
                            data[j].Material_Name=res.Data[i].Material_Name
                        }
                        // materid.push(res.Data[i].F_Id)
                        // maternick.push(res.Data[i].Material_Nick)
                        // matername.push(res.Data[i].Material_Name)
                    }
                }

                tableload(data)
            }
        }
    })

}

// 客户--
function getcusnick(id) {
    $.ajax({
        type: "get",
        url: ajaxCus,
        success: function (res) {
            console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data;
            var checid = '';
            if (isussecc) {
                var html = '<option value="">全部</option>';
                var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i];
                    html += '<option value="' + datanow.F_Id + '" data-rate="' + datanow.Customer_TaxRate + '">' + datanow.Customer_Nick + '</option>';
                    htmlsel += '<dd lay-value="' + datanow.F_Id + '" data-rate="' + datanow.Customer_TaxRate + '">' + datanow.Customer_Nick + '</dd>';
                    curid.push(datanow.F_Id)
                    curnick.push(datanow.Customer_Nick)
                    if (id == datanow.F_Id) {
                        checid = datanow.F_Id

                    }

                }
                $("#Customer_Nick").html(html);
                $(".checkcus .layui-anim.layui-anim-upbit").html(htmlsel);

                layui.use('form', function () {
                    var form = layui.form;
                    form.render();

                });
                var select = 'dd[lay-value="' + checid + '"]';
                $('#Customer_Nick').siblings("div.layui-form-select").find('dl').find(select).click();
            } else {
                alert(res.Message)
            }

        }
    })
}
//订单类型--
function gettype(id) {
    $.ajax({
        type: "get",
        url: saletype,
        success: function (res) {
            console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data.Details;
            var checid = '';
            if (isussecc) {
                var html = '<option value="">全部</option>';
                var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i];
                    html += '<option value="' + datanow.F_Id + '" >' + datanow.DictionaryItem_Nick + '</option>';
                    htmlsel += '<dd lay-value="' + datanow.F_Id + '" >' + datanow.DictionaryItem_Nick + '</dd>';
                    if (id == datanow.F_Id) {
                        checid = datanow.F_Id
                    }
                }
                $("#SalesOrder_Type").html(html);
                $(".ordertype .layui-anim.layui-anim-upbit").html(htmlsel);
                layui.use('form', function () {
                    var form = layui.form;
                    form.render();
                });
                var select = 'dd[lay-value="' + checid + '"]';
                $('#SalesOrder_Type').siblings("div.layui-form-select").find('dl').find(select).click();
            } else {
                alert(res.Message)
            }

        }
    })
}
// 单据状态--
function getstatus(id) {
    $.ajax({
        type: "get",
        url: salestauts,
        success: function (res) {
            var isussecc = res.Succeed;
            var data = res.Data.Details;
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i]
                    if (datanow.DictionaryItem_Value == id) {
                        $("#SalesOrder_Status1").val(datanow.DictionaryItem_Nick)
                        $("#SalesOrder_Status").val(datanow.DictionaryItem_Value)
                    }
                }
            } else {
                alert(res.Message)
            }
        }
    })
}
//部门--
function getdepart(id) {
    console.log("bumen")
    $.ajax({
        type: "get",
        url: ajaxdepart,
        success: function (res) {
            console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data;
            var checid = '';
            if (isussecc) {
                var html = '<option value="">全部</option>';
                var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i];
                    html += '<option value="' + datanow.F_Id + '" >' + datanow.Department_Nick + '</option>';
                    htmlsel += '<dd lay-value="' + datanow.F_Id + '" >' + datanow.Department_Nick + '</dd>';
                    if (id == datanow.F_Id) {
                        checid = datanow.F_Id

                    }
                }
                $("#SalesOrder_Department").html(html);
                $(".checkdepart .layui-anim.layui-anim-upbit").html(htmlsel);
                layui.use('form', function () {
                    var form = layui.form;
                    form.render();
                });
                var select = 'dd[lay-value="' + checid + '"]';
                $('#SalesOrder_Department').siblings("div.layui-form-select").find('dl').find(select).click();
            } else {
                alert(res.Message)
            }

        }
    })
}
//业务员--
function getem(id) {
    $.ajax({
        type: "get",
        url: ajaxUsr,
        success: function (res) {
            console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data;
            var checid = '';
            if (isussecc) {
                var html = '<option value="">全部</option>';
                var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i];
                    html += '<option value="' + datanow.F_Id + '" >' + datanow.User_Nick + '</option>';
                    htmlsel += '<dd lay-value="' + datanow.F_Id + '" >' + datanow.User_Nick + '</dd>';
                    if (id == datanow.F_Id) {
                        checid = datanow.F_Id
                    }
                }
                $("#SalesOrder_Employee").html(html);
                $(".scalelists .layui-anim.layui-anim-upbit").html(htmlsel);
                layui.use('form', function () {
                    var form = layui.form;
                    form.render();
                });
                var select = 'dd[lay-value="' + checid + '"]';
                $('#SalesOrder_Employee').siblings("div.layui-form-select").find('dl').find(select).click();
            } else {
                alert(res.Message)
            }

        }
    })
}

//币别--
function getcurr(id) {
    // 币别
    $.ajax({
        type: "get",
        url: ajaxCurrency,
        success: function (res) {
            console.log(res)
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
                    if (id == datanow.F_Id) {
                        cuID = datanow.F_Id
                    }
                }
                $("#currency").html(html);
                $(".currency .layui-anim.layui-anim-upbit").html(htmlsel);
                layui.use('form', function () {
                    var form = layui.form;
                    form.render();

                });

                var select = 'dd[lay-value="' + cuID + '"]';
                $('#currency').siblings("div.layui-form-select").find('dl').find(select).click();
                $("#SalesOrder_ExRate").val(rate)
                // _this.find("select").next().find('.layui-select-title input').click();
            } else {
                alert(res.Message)
            }
        }
    })

}

// 制单人--
function getbii(id) {
    $.ajax({
        type: "get",
        url: ajaxUsr,
        success: function (res) {
            console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data;
            if (isussecc) {
                var html = '<option value="">全部</option>';
                var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i];
                    cusid.push(datanow.F_Id)
                    cusnick.push(datanow.User_Nick)
                    html += '<option value="' + datanow.F_Id + '">' + datanow.User_Nick + '</option>';
                    htmlsel += '<dd lay-value="' + datanow.F_Id + '">' + datanow.User_Nick + '</dd>'
                    if (datanow.F_Id == id) {
                        $("#SalesOrder_Biller").val(datanow.F_Id)
                        $("#SalesOrder_Billername").val(datanow.User_Nick)
                    }
                }
                $("#salesman").html(html);
                $(".scalelists .layui-anim.layui-anim-upbit").html(htmlsel);
                layui.use('form', function () {
                    var form = layui.form;
                    form.render();
                });
            } else {
                alert(res.Message)
            }

        }
    })
}