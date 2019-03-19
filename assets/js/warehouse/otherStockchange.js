var dateslit = [];
var stocklist=[]
var currname = [];
var currnick = [];
var ratelist = [];
var currnamshow = [];
var meavalue = [],
    meanick = [],
    stockid = [],
    stocknick = []
var materid = [],
    maternick = [],
    matername = []
var first = new Date().valueOf();
var getablelist;
window.viewObj = {
    tbData: [{
        tempId: first,
        state: 0,
        Material_Name: '', //物料代码
        Material_Nick: '', //物料名称
        Remark: ''
    }],
    limit: 1,
    last: first
};
var tableIns;
var upload, table;
var layTableId;
//layui 模块化引用
layui.use(['jquery', 'table', 'layer', "form", "layedit", "laydate", "upload"], function () {
    var $ = layui.$;
    table = layui.table,
        form = layui.form,
        layer = layui.layer,
        laydate = layui.laydate,
        upload = layui.upload,
        element = layui.element;
        var myDate = new Date();
        var nowY = myDate.getFullYear();
        var nowM = myDate.getMonth() + 1;
        var nowD = myDate.getDate();
        var tody = nowY + "-" + (nowM < 10 ? "0" + nowM : nowM) + "-" + (nowD < 10 ? "0" + nowD : nowD);
        //日期
        laydate.render({
            elem: '#date',
            value: tody,
            isInitValue: true,
            btns: ['now', 'confirm']
        });
        // 仓库
        $.ajax({
            type:'GET',
            url: ajaxstocklist,
            success: function (res) {
                $.each(res.Data,function(i,v){
                    stocklist.push(v)
                })
            }
        })
        // 计量单位
        $.ajax({
            type:"GET",
            url: ajaxMea,
            success: function (res) {
                var data = res.Data;
                var isussecc = res.Succeed;
                if (isussecc) {
                    for (var i = 0; i < data.length; i++) {
                        var datanow=data[i]
                        meavalue.push(datanow.F_Id)  
                        meanick.push(datanow.Measure_Nick)
                    }
                } else {
                    alert(data.Message)
                }
            }
        })
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
            [{title: '序号', type: 'numbers' },
            {field: 'Material_Name',title: '物料代码',templet:"#selectTool",width:120},
            {field: 'Material_Nick',title: '物料名称',width:120},
            {field: 'StockBillEntry_Specifications',title: '规格型号',width:80},
            {field: 'StockBillEntry_BatchNo',title: '批号',width:80 },
            {field: 'Unit',title: '计量单位',width:80,align:'center',templet:function(d){
                var unitindex = meavalue.indexOf(d.StockBillEntry_Unit)
                if (unitindex != '-1') {
                    return meanick[unitindex]
                } else {
                    return ''
                }
            }},
            {field: 'StockBillEntry_Price',title: '价格',edit: 'text',width:100},
            {field: 'StockBillEntry_Quantity',title: '实收数量',edit: 'text',width:100},
            {field: 'StockBillEntry_Amount',title: '总额',width:100},
            {field: 'StockBillEntry_Stock', title: '发货仓库',templet: '#selectstock',width:100},
            {field: 'Rmark',title: '备注',edit: 'text' ,width:100},
            {field: 'F_Id',title: '操作',align: 'center', templet: function (d) {
                return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.F_Id + '">删除</a>';
            }}
            ]
        ],
        done: function (res, curr, count) {
            console.log(res.data)
            viewObj.tbData = res.data;
            prolist();
            tabledata = res.data;
            $('tr').each(function (e) {
                var $cr = $(this);
                var dataindex = $cr.attr("data-index");
                $.each(tabledata, function (index, value) {
                    if (value.LAY_TABLE_INDEX == dataindex) {
                        $cr.find('input').val(value.Material_Name);
                        $cr.find('td[data-field="StockBillEntry_Stock"] input').val(value.stock);
                    }
                });
            });
            $("#tablelist .layui-table-view .layui-table td[data-field='StockBillEntry_Stock']").on("click", function () {
                var scrollHeight = $('#tableRes .layui-table-body.layui-table-main').prop("scrollHeight");
                $('#tableRes .layui-table-body.layui-table-main').css("height", scrollHeight)
            })
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
                Remark: ''
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
            tableIns.reload({
                data: oldData,
                limit: viewObj.limit
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
        var oldData = table.cache[layTableId];
        // console.log(obj)
        for (var i = 0; i < oldData.length; i++) {
            var datenow = oldData[i];
            if (datenow.F_Id === obj.data.F_Id) {
                if(obj.field=='StockBillEntry_Quantity'){
                    if (!$.isNumeric(obj.value)){
                        datenow.StockBillEntry_Quantity = parseInt(obj.value);
                    }else{
                        if(datenow.StockBillEntry_Price){
                            datenow.StockBillEntry_Amount=parseFloat(datenow.StockBillEntry_Quantity)*parseFloat(datenow.StockBillEntry_Price)
                            datenow.StockBillEntry_Amount=datenow.StockBillEntry_Amount.toFixed(2)
                        }
                    }
                }else if(obj.field=='StockBillEntry_Price'){
                    if(datenow.StockBillEntry_Quantity){
                        datenow.StockBillEntry_Amount=parseFloat(datenow.StockBillEntry_Quantity)*parseFloat(datenow.StockBillEntry_Price)
                        datenow.StockBillEntry_Amount=datenow.StockBillEntry_Amount.toFixed(2)
                    }
                }
                
            }
        }
        tableIns.reload({
            data: oldData,
            limit: oldData.length
        });
    });
    form.on('select(StockBillEntry_Stock)', function (data, e) {
        var elem = data.othis.parents('tr');
        var dataindex = elem.attr("data-index");
        $.each(tabledata, function (index, value) {
            console.log(value)
            if (value.LAY_TABLE_INDEX == dataindex) {
                value.StockBillEntry_Stock = data.value;
                if (data.elem.selectedOptions) {
                    value.stock = data.elem.selectedOptions[0].innerHTML;
                } else {
                    var elems = data.elem;
                    for (var i = 0; i < elems.length; i++) {
                        var elemnow = elems[i];
                        if (elemnow.selected) {
                            value.stock = elemnow.text
                        }
                    }
                }
            }
        });
        tableIns.reload({
            data: tabledata,
            limit: tabledata.length
        });
    })

    var htmlterm = '';
    var arrlist = [];
    var arri = {};
    function prolist() {
        $(".productworktable td[data-field='Material_Name']").each(function () {
            var curnow = $(this);
            curnow.on("click", function () {
                // console.log(1);
                var scrollHeight = $('#tableRes .layui-table-body.layui-table-main').prop("scrollHeight");
                var height = $('#tableRes .layui-table-body.layui-table-main').height() + scrollHeight + 200;
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
                                // data[i].Material_Name data[i].Material_Nick  data[i].Material_Specification
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
                                                    value.StockBillEntry_Specifications = specife || "";
                                                    value.StockBillEntry_Material = marid || "";
                                                    value.Unit = measure
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
                                            getbatno(oldData,oldData.length)
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
                                                value.StockBillEntry_Specifications = specife || "";
                                                value.StockBillEntry_Material = marid || "";
                                                value.Unit = measure
                                                var meaindex=meanick.indexOf(measure)
                                                if(meaindex!='-1'){
                                                    value.StockBillEntry_Unit = meavalue[meaindex]
                                                }else{
                                                    value.StockBillEntry_Unit = ""
                                                }
                                          
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
                                        getbatno(oldData,oldData.length)
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
                                // console.log(oldData)
                                var name = $(this).attr("data-name");
                                var nick = $(this).attr("data-nick");
                                var specife = $(this).attr("data-spe");
                                var measure = $(this).attr("data-materme");
                                var marid = $(this).attr("data-materid")
                                $(".materName").val(name || '');
                                var rate = $("#SalesOrder_TaxRate").val(); //税率
                                var sendate = $("#recdate").val(); //交货日期
                                $.each(tabledata, function (index, value) {
                                    // console.log(value)
                                    if (value.LAY_TABLE_INDEX == dataindex) {
                                        value.Material_Name = name || "";
                                        value.Material_Nick = nick || "";
                                        value.StockBillEntry_Specifications = specife || "";
                                        value.StockBillEntry_Material = marid || "";
                                        value.Unit = measure;
                                        var meaindex=meanick.indexOf(measure)
                                        if(meaindex!='-1'){
                                            value.StockBillEntry_Unit = meavalue[meaindex]
                                        }else{
                                            value.StockBillEntry_Unit = ""
                                        }
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
                                getbatno(oldData,oldData.length)
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
                            // console.log(oldData)
                            var name = $(this).attr("data-name");
                            var nick = $(this).attr("data-nick");
                            var specife = $(this).attr("data-spe");
                            var measure = $(this).attr("data-materme");
                            var marid = $(this).attr("data-materid")
                            $(".materName").val(name || '');
                            var rate = $("#SalesOrder_TaxRate").val(); //税率
                            var sendate = $("#recdate").val(); //交货日期
                            $.each(tabledata, function (index, value) {
                                // console.log(value)
                                if (value.LAY_TABLE_INDEX == dataindex) {
                                    value.Material_Name = name || "";
                                    value.Material_Nick = nick || "";
                                    value.StockBillEntry_Specifications = specife || "";
                                    value.StockBillEntry_Material = marid || "";
                                    value.Unit= measure;
                                    var meaindex=meanick.indexOf(measure)
                                    if(meaindex!='-1'){
                                        value.StockBillEntry_Unit = meavalue[meaindex]
                                    }else{
                                        value.StockBillEntry_Unit = ""
                                    }
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
                            getbatno(oldData,oldData.length)
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
    // 获取批号
    function getbatno(data,cout){
        for(var i=0;i<=cout-2;i++){
            $.ajax({
                async: false,
                url:ordernum,
                success:function(res){
                    if(res.Succeed){
                        console.log(data[i])
                        data[i].StockBillEntry_BatchNo=res.Data
                    }else{
                        alert(res.Message)
                    }
                }
            })
        }
       console.log(data)
        tableIns.reload({
            data: data,
            limit: data.length
        });
    }
    // 部门--
    $(".stockdepart").on("click", function () {
        var _this = $(this);
        var supper=$("#StockBill_Department option:selected").val()
        var custom=$("#StockBill_custom option:selected").val()
        console.log
        if(!supper&&!custom){
            var date = _this.attr("data-type");
            if (date == 'daten') {
                $(".stockdepart").attr("data-type", "datey");
                $.ajax({
                    type: "get",
                    url: ajaxdepart,
                    success: function (res) {
                        console.log(res)
                        var isussecc = res.Succeed;
                        var data = res.Data;
                        if (isussecc) {
                            var html = '<option value="">全部</option>';
                            var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                            for (var i = 0; i < data.length; i++) {
                                html += '<option value="' + data[i].F_Id + '" >' + data[i].Department_Nick + '</option>';
                                htmlsel += '<dd lay-value="' + data[i].F_Id + '" >' + data[i].Department_Nick + '</dd>'
                            }
                            $("#StockBill_Department").html(html);
                            $(".stockdepart .layui-anim.layui-anim-upbit").html(htmlsel);
                            renderForm();
                            _this.find("select").next().find('.layui-select-title input').click();
                            _this.find("select").next().find('.layui-select-title input').focus()
                        } else {
                            alert(res.Message)
                        }
                    }
                })
            }
        }else{

        }
     
    })
    // 供应商
    $(".stockbill").on("click", function () {
        var _this = $(this);
        var date = _this.attr("data-type");
        if (date == 'daten') {
            $(".stockbill").attr("data-type", "datey");
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
                        $("#StockBill_Supper").html(html);
                        $(".stockbill .layui-anim.layui-anim-upbit").html(htmlsel);
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
    // 客户
    $(".stockcus").on("click", function () {
            var _this = $(this);
            var date = _this.attr("data-type");
            if (date == 'daten') {
                $(".stockcus").attr("data-type", "datey");
                $.ajax({
                    type: "get",
                    url: ajaxCus,
                    success: function (res) {
                        console.log(res)
                        var isussecc = res.Succeed;
                        var data = res.Data;
                        if (isussecc) {
                            var html = '<option value="">全部</option>';
                            var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                            for (var i = 0; i < data.length; i++) {
                                html += '<option value="' + data[i].F_Id + '" >' + data[i].Customer_Nick + '</option>';
                                htmlsel += '<dd lay-value="' + data[i].F_Id + '" >' + data[i].Customer_Nick + '</dd>'
                            }
                            $("#StockBill_custom").html(html);
                            $(".stockcus .layui-anim.layui-anim-upbit").html(htmlsel);
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
                        limit: viewObj.limit
                    });
                    return;
                } else {
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


  var url = window.location.search;
    var fid = url.split("?")[1].split("=")[1];
    $.ajax({
        url: ajaxstockbillone + fid,
        success: function (res) {
            console.log(res)
            if (res.Succeed) {
                var data = res.Data
                $("#StockBill_Name").val(data.StockBill_Name)
                getbill(data.StockBill_Sender, data.StockBill_Biller)
                getreceive(data.StockBill_Receiver)
                var datetime = '';
                if (data.StockBill_DateTime) {
                    datetime = data.StockBill_DateTime.split(" ")[0]
                }
                $("#StockBill_DateTime").val(datetime)
                $("#Rmark").val(data.Rmark)
                getmater(data.Details)
                $("#F_Id").val(data.F_Id)

            }
        }
    })

    function getmater(tabledata) {
        // 物料
        $.ajax({
            type: "get",
            url: ajaxMater,
            success: function (res) {
                var isussecc = res.Succeed;
                if (isussecc) {
                    var data = res.Data;
                    for (var i = 0; i < data.length; i++) {
                        var nowD = data[i];
                        materid.push(nowD.F_Id)
                        maternick.push(nowD.Material_Nick)
                        matername.push(nowD.Material_Name)
                    }
                    $.each(tabledata, function (i, v) {
                        if (v.StockBillEntry_Material) {
                            var materindex = materid.indexOf(v.StockBillEntry_Material)
                            if (materindex != '-1') {
                                v.Material_Name = matername[materindex]
                                v.Material_Nick = maternick[materindex]
                            } else {
                                v.Material_Name = ""
                                v.Material_Nick = ""
                            }
                        }
                    })
                    tableIns.reload({
                        data: tabledata,
                        limit: tabledata.length
                    });
                } else {
                    alert(res.Message)
                }

            }
        })
    }

    // 制单人
    function getbill(sender, bill) {
        $.ajax({
            type: "get",
            url: ajaxUsr,
            success: function (res) {
                var isussecc = res.Succeed;
                if (isussecc) {
                    var data = res.Data;
                    var html = '<option value="">全部</option>';
                    var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                    for (var i = 0; i < data.length; i++) {
                        var datanow = data[i];
                        html += '<option value="' + datanow.F_Id + '">' + datanow.User_Nick + '</option>';
                        htmlsel += '<dd lay-value="' + datanow.F_Id + '">' + datanow.User_Nick + '</dd>'
                        if (datanow.F_Id == bill) {
                            $("#StockBill_Billername").val(datanow.User_Nick)
                        }
                    }
                    $("#StockBill_Sender").html(html);
                    $(".checkper .layui-anim.layui-anim-upbit").html(htmlsel);
                    renderForm();
                    var select = 'dd[lay-value="' + sender + '"]';
                    $('#StockBill_Sender').siblings("div.layui-form-select").find('dl').find(select).click();

                } else {
                    alert(res.Message)
                }

            }
        })
    }

    //  部门
    function getreceive(id) {
        $(".stockdepart").attr("data-type", "datey");
        $.ajax({
            type: "get",
            url: ajaxdepart,
            success: function (res) {
                var isussecc = res.Succeed;
                var data = res.Data;
                if (isussecc) {
                    var deparnick = '';
                    var html = '<option value="">全部</option>';
                    var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                    for (var i = 0; i < data.length; i++) {
                        var datanow = data[i]
                        html += '<option value="' + datanow.F_Id + '" >' + datanow.Department_Nick + '</option>';
                        htmlsel += '<dd lay-value="' + datanow.F_Id + '" >' + datanow.Department_Nick + '</dd>'
                        if (datanow.F_Id == id) {
                            deparnick = datanow.Department_Nick
                        }
                    }
                    $("#StockBill_Department").html(html);
                    $(".stockdepart .layui-anim.layui-anim-upbit").html(htmlsel);
                    renderForm();
                    if (deparnick == '') {
                        getsupper(id)
                    } else {
                        var select = 'dd[lay-value="' + id + '"]';
                        $('#StockBill_Department').siblings("div.layui-form-select").find('dl').find(select).click();
                    }
                } else {
                    getsupper(id)
                    alert(res.Message)
                }
            }
        })
        return false
    }
    // 供应商
    function getsupper(id) {
        $(".stockbill").attr("data-type", "datey");
        $.ajax({
            type: "get",
            url: ajaxsupplist,
            success: function (res) {
                var isussecc = res.Succeed;
                if (isussecc) {
                    var suppernick = ''
                    var data = res.Data;
                    var html = '<option value="">全部</option>';
                    var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                    for (var i = 0; i < data.length; i++) {
                        var datanow = data[i]
                        html += '<option value="' + datanow.F_Id + '" data-rate="' + datanow.Supplier_TaxRate + '">' + datanow.Supplier_Nick + '</option>';
                        htmlsel += '<dd lay-value="' + datanow.F_Id + '" data-rate="' + datanow.Supplier_TaxRate + '">' + datanow.Supplier_Nick + '</dd>'
                        if (datanow.F_Id == id) {
                            suppernick = datanow.Supplier_Nick
                        }
                    }
                    $("#StockBill_Supper").html(html);
                    $(".stockbill .layui-anim.layui-anim-upbit").html(htmlsel);
                    renderForm();
                    if (suppernick == '') {
                        getcustom(id)
                    } else {
                        var select = 'dd[lay-value="' + id + '"]';
                        $('#StockBill_Supper').siblings("div.layui-form-select").find('dl').find(select).click();
                    }
                } else {
                    getcustom(id)
                    alert(res.Message)
                }
            }
        })
        return false
    }


    // 客户
    function getcustom(id) {
        $(".stockcus").attr("data-type", "datey");
        $.ajax({
            type: "get",
            url: ajaxCus,
            success: function (res) {
                var isussecc = res.Succeed;
                var data = res.Data;
                if (isussecc) {
                    var customnick = ''
                    var html = '<option value="">全部</option>';
                    var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                    for (var i = 0; i < data.length; i++) {
                        var datanow = data[i]
                        if (datanow.F_Id == id) {
                            customnick = datanow.Customer_Nick
                        }
                        html += '<option value="' + datanow.F_Id + '" >' + datanow.Customer_Nick + '</option>';
                        htmlsel += '<dd lay-value="' + datanow.F_Id + '" >' + datanow.Customer_Nick + '</dd>'
                    }
                    $("#StockBill_custom").html(html);
                    $(".stockcus .layui-anim.layui-anim-upbit").html(htmlsel);
                    renderForm();
                    if (customnick != '') {
                        var select = 'dd[lay-value="' + id + '"]';
                        $('#StockBill_custom').siblings("div.layui-form-select").find('dl').find(select).click();
                    }
                } else {
                    alert(res.Message)
                }

            }
        })
        return false
    }




    // 保存
    $(".sub").on("click", function () {
        var indexlay=layer.load();
        var formlist=$("form").serializeArray()
        var oldData = table.cache[layTableId];
        var data = {}
        for (var j = 0; j < formlist.length; j++) {
            data[formlist[j].name] = formlist[j].value
        }
        var newdata=[]
        $.each(oldData,function(i,v){
            if(v.StockBillEntry_Material){
                newdata.push(v)
            }
        })
     
        data.Details=newdata
        console.log(data)
        $.ajax({
            type:"POST",
            url:editbill,
            data:data,
            success:function(res){
               if(res.Succeed){
                layer.close(indexlay);
                layer.msg("修改成功");
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