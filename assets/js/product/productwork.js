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
    //单据日期
    laydate.render({
        elem: '#Assign_DateTime',
        value: tody,
        isInitValue: true,
        btns: ['now', 'confirm']
    });
    // 开工
    laydate.render({
        elem: '#Assign_StartTime',
        value: tody,
        isInitValue: true,
        btns: ['now', 'confirm']
    });
    // 完工
    laydate.render({
        elem: '#Assign_Deadline',
        value: tody,
        isInitValue: true,
        btns: ['now', 'confirm']
    });
});

var dateslit1 = [];
// 物料--
$.ajax({
    type: 'GET',
    url: ajaxMater,
    success: function (res) {
        materdata = res.Data
    }
})
var materdata, craftdetail = [];
var sendfacture, sendcraft, reloadcraft, getpro, getcraft, getcraftdata, getmaterdata, subindex;
var dateslit = [];
var renderForm1;
var first = new Date().valueOf();
window.viewObj = {
    tbData: [{
        tempId: first,
        state: 0,
        AssignEntry_Material: '',
        materialName: '',
        materialNick: '',
        AssignEntry_Specifications: "",
        AssignEntry_Unit: '',
        AssignEntry_Quantity: '',
        AssignEntry_ScrapRate: '',
        AssignEntry_Total: '',
        Rmark: '',
        IsEnabled: true
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
    var layTableId1 = "layTable";
    tableIns = table.render({
        elem: '#dataTable',
        id: layTableId1,
        data: viewObj.tbData,
        limit: viewObj.limit,
        page: false,
        loading: true,
        // even: true,
        cols: [
            [{ title: '序号', type: 'checkbox' },
            { field: 'materialName', title: '物料代码', templet: '#selectTool' },
            { field: 'materialNick', title: '物料名称' },
            { field: 'AssignEntry_Specifications', title: '规格型号' },
            // { field: 'term3', title: '辅助属性', edit: 'text' },
            { field: 'AssignEntry_Unit', title: '计量单位' },
            // { field: 'term5', title: '批号', edit: 'text' },
            { field: 'AssignEntry_Quantity', title: '计划用料数量', edit: 'text' },
            // { field: '', title: '实际用料数量' },
            {
                field: 'AssignEntry_ScrapRate', title: '损耗率(%)', edit: 'text', templet: function (d) {
                    var num = '0.00'
                    if (d.AssignEntry_ScrapRate) {
                        num = parseFloat(d.AssignEntry_ScrapRate).toFixed(2);
                    }
                    if (d.AssignEntry_Material) {
                        return num
                    } else {
                        return ""
                    }


                }
            },
            { field: 'AssignEntry_Total', title: '理论用量' },//计划用料数量*损耗率
            { field: '', title: '领料差异' },
            // 领料差异=计划用量-实际用料
            { field: '', title: '领料差异率' },
            { field: 'Rmark', title: '备注', edit: 'text' },
            {
                field: 'tempId', title: '操作', align: 'center', templet: function (d) {
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
                            $.extend(res.data[i], {
                                'FFetchDate': value
                            })
                        }
                    }
                });
            });
            tabledata = res.data;
            $('#tableRes tr').each(function (e) {
                var $cr = $(this);
                var dataindex = $cr.attr("data-index");
                $.each(tabledata, function (index, value) {
                    if (value.LAY_TABLE_INDEX == dataindex) {
                        // $cr.find('input').val(value.term);
                        $cr.find('input[id="materName1"]').val(value.materialName);
                    }
                });
            });
        }
    });

    //定义事件集合
    var active = {
        add: function () { //添加一行
            viewObj.limit = viewObj.limit + 1;
            var oldData = table.cache[layTableId1];
            var tid = new Date().valueOf();
            var newRow = {
                tempId: tid,
                AssignEntry_Material: '',
                materialName: '',
                materialNick: '',
                AssignEntry_Specifications: "",
                AssignEntry_Unit: '',
                AssignEntry_Quantity: '',
                AssignEntry_ScrapRate: '',
                AssignEntry_Total: '',
                Rmark: '',
                IsEnabled: true
            };
            oldData.push(newRow);
            viewObj.last = tid;
            tableIns.reload({
                data: oldData,
                limit: viewObj.limit
            });
        },
        updateRow: function (obj) {
            var oldData = table.cache[layTableId1];

            tableIns.reload({
                data: oldData,
                limit: viewObj.limit
            });
        },
        removeEmptyTableCache: function () {
            var oldData = table.cache[layTableId1];

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
    table.on('edit(dataTable)', function (obj) {
        var dataindex = $(obj.tr).attr("data-index");
        var oldData = table.cache[layTableId1];
        $.each(tabledata, function (index, value) {
            if (value.LAY_TABLE_INDEX == dataindex) {
                if (value.AssignEntry_Quantity && value.AssignEntry_ScrapRate) {
                    value.AssignEntry_Total = parseFloat(value.AssignEntry_Quantity) * parseFloat(value.AssignEntry_ScrapRate / 100 + 1)
                }
            }
        });
        tableIns.reload({
            data: oldData,
            limit: viewObj.limit
        });
    });
    var isend = true;
    var savedate;
    var lastid;


    getmaterdata = function () {
        var oldData = table.cache[layTableId1];
        return oldData
    }

    renderForm1 = function () {
        layui.use('form', function () {
            var form = layui.form;
            form.render();
            var oldData = table.cache[layTableId1];
            tableIns.reload({
                data: oldData,
                limit: viewObj.limit
            });
        });
    }

    // $(".ordernext").on("click", function () {
    //     var data = table.cache[layTableId1];
    //     if (data.length == 1) {
    //         if (data[0].FMaterialName == '') {
    //             alert("至少选择一条物料代码")
    //         }
    //     } else {
    //         sessionStorage.setItem('wlist', JSON.stringify(data));
    //         parent.nextly()
    //     }
    // })


    var htmlterm = '';
    var arrlist = [];
    var arri = {};
    function prolist() {
        $(".productworktable td[data-field='materialName']").each(function () {
            var curnow = $(this);
            curnow.on("click", function () {
                $("#tablelist .layui-table-body").addClass("overvis");
                $("#tablelist .layui-table-box").addClass("overvis");
                $("#tablelist .layui-table-view").addClass("overvis");
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
                        type: 'GET',
                        url: ajaxMater,
                        success: function (res) {
                            $(".dateload").addClass("hidden")
                            $(".datelist").removeClass("hidden")

                            var data = res.Data;
                            var isussecc = res.Succeed;
                            // data[i].Material_Name data[i].Material_Nick  data[i].Material_Specification
                            for (var i = 0; i < data.length; i++) {
                                var datanow = data[i];
                                htmlterm += '<li data-name="' + (datanow.Material_Name || '') + '" data-nick="' + (datanow.Material_Nick || '') + '" data-spe="' + (datanow.Material_Specifications || '') + '" data-materme="' + (datanow.Material_Measure || '') + '" data-fid="' + datanow.F_Id + '" data-matertype="' + datanow.Material_Type + '"><p>' + (datanow.Material_Name || '') + '</p><p>' + (datanow.Material_Nick || '') + '</p><p>' + (datanow.Material_Specifications || '') + '</p></li>'
                                arri = { materame: (datanow.Material_Name || ''), maternick: (datanow.Material_Nick || ''), matersp: (datanow.Material_Specifications || ''), matermea: (datanow.Material_Measure || ''), materid: (datanow.F_Id || ''), matertype: datanow.Material_Type };
                                arrlist.push(arri)
                            }
                            $(".selectlist1 ul").html(htmlterm);
                            $(".materName1").on("keyup", function () {
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
                                    searchlist += '<li data-name="' + shownow.materame + '" data-nick="' + shownow.maternick + '" data-spe="' + shownow.matersp + '" data-materme="' + shownow.matermea + '" data-fid="' + shownow.materid + '" data-matertype="' + shownow.matertype + '"><p>' + shownow.materame + '</p><p>' + shownow.maternick + '</p><p>' + shownow.matersp + '</p></li>'
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
                                        var oldData = table.cache[layTableId1];
    
                                        var name = $(this).attr("data-name");
                                        var nick = $(this).attr("data-nick");
                                        var specife = $(this).attr("data-spe");
                                        var measure = $(this).attr("data-materme");
                                        var fid = $(this).attr("data-fid");
    
                                        $(".materName1").val(name);
                                        // $(".maternick").val(nick);
                                        // $(".materspe").val(specife);
                                        // $("#measure").val(measure);
                                        $.each(tabledata, function (index, value) {
    
                                            if (value.LAY_TABLE_INDEX == dataindex) {
                                                value.materialName = name;
                                                value.materialNick = nick
                                                value.AssignEntry_Specifications = specife;
                                                value.AssignEntry_Unit = measure
                                                value.AssignEntry_Material = fid
                                                value.AssignEntry_ScrapRate = '0'
                                                if (value.tempId == viewObj.last) {
                                                    activeByType("add");
                                                } else {
                                                    var oldData = table.cache[layTableId1];
                                                    tableIns.reload({
                                                        data: oldData,
                                                        limit: viewObj.limit
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
                                    var oldData = table.cache[layTableId1];

                                    var name = $(this).attr("data-name");
                                    var nick = $(this).attr("data-nick");
                                    var specife = $(this).attr("data-spe");
                                    var measure = $(this).attr("data-materme");
                                    var fid = $(this).attr("data-fid");

                                    $(".materName1").val(name);
                                    // $(".maternick").val(nick);
                                    // $(".materspe").val(specife);
                                    // $("#measure").val(measure);
                                    $.each(tabledata, function (index, value) {

                                        if (value.LAY_TABLE_INDEX == dataindex) {
                                            value.materialName = name;
                                            value.materialNick = nick
                                            value.AssignEntry_Specifications = specife;
                                            value.AssignEntry_Unit = measure
                                            value.AssignEntry_Material = fid
                                            value.AssignEntry_ScrapRate = '0'
                                            if (value.tempId == viewObj.last) {
                                                activeByType("add");
                                            } else {
                                                var oldData = table.cache[layTableId1];
                                                tableIns.reload({
                                                    data: oldData,
                                                    limit: viewObj.limit
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
                    $(".materName1").on("keyup", function () {
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
                            searchlist += '<li data-name="' + shownow.materame + '" data-nick="' + shownow.maternick + '" data-spe="' + shownow.matersp + '" data-materme="' + shownow.matermea + '" data-fid="' + shownow.materid + '" data-matertype="' + shownow.matertype + '"><p>' + shownow.materame + '</p><p>' + shownow.maternick + '</p><p>' + shownow.matersp + '</p></li>'
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
                                var oldData = table.cache[layTableId1];
                                var name = $(this).attr("data-name");
                                var nick = $(this).attr("data-nick");
                                var specife = $(this).attr("data-spe");
                                var measure = $(this).attr("data-materme");
                                var fid = $(this).attr("data-fid");
                                $(".materName1").val(name);
                                $.each(tabledata, function (index, value) {
                                    if (value.LAY_TABLE_INDEX == dataindex) {
                                        value.materialName = name;
                                        value.materialNick = nick
                                        value.AssignEntry_Specifications = specife;
                                        value.AssignEntry_Unit = measure
                                        value.AssignEntry_Material = fid
                                        value.AssignEntry_ScrapRate = '0'
                                        if (value.tempId == viewObj.last) {
                                            activeByType("add");
                                        } else {
                                            var oldData = table.cache[layTableId1];
                                            tableIns.reload({
                                                data: oldData,
                                                limit: viewObj.limit
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
                            var oldData = table.cache[layTableId1];
                            var name = $(this).attr("data-name");
                            var nick = $(this).attr("data-nick");
                            var specife = $(this).attr("data-spe");
                            var measure = $(this).attr("data-materme");
                            var fid = $(this).attr("data-fid");
                            $(".materName1").val(name);
                            $.each(tabledata, function (index, value) {
                                if (value.LAY_TABLE_INDEX == dataindex) {
                                    value.materialName = name;
                                    value.materialNick = nick
                                    value.AssignEntry_Specifications = specife;
                                    value.AssignEntry_Unit = measure
                                    value.AssignEntry_Material = fid
                                    value.AssignEntry_ScrapRate = '0'
                                    if (value.tempId == viewObj.last) {
                                        activeByType("add");
                                    } else {
                                        var oldData = table.cache[layTableId1];
                                        tableIns.reload({
                                            data: oldData,
                                            limit: viewObj.limit
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
    $(document).on("click", function (event) {
        var evt = event.srcElement ? event.srcElement : event.target;
        var seletlist = $(".selectlist1");
        for (var i = 0; i < seletlist.length; i++) {
            if (!($(seletlist[i]).hasClass("hidden"))) {
                if (evt.id == 'checkmater') return; // 如果是元素本身，则返回
                else {
                    $(".selectlist1").addClass("hidden");
                }
                return
            }
        }
    })
    // 客户订单号变更后包含的产品列表
    getpro = function (data) {
        $(".checkpro").on("click", function () {
            if ($("#cusOrder").val()) {
                $(".selectlist").removeClass("hidden");
                var _this = $(this);
                _this.addClass("layui-form-selected")
                $(".checkpro").attr("data-type", "datey");
                // $(".dateload").removeClass("hidden")
                // $(".datelist").addClass("hidden");
                // $(".dateload").addClass("hidden")
                $(".datelist").removeClass("hidden")
                var html = '';
                var arrlist = [];
                var arri = {};
                var materdatanew;
                var deadline;
                // data[i].Material_Name data[i].Material_Nick  data[i].Material_Specification
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i];
                    for (var j = 0; j < materdata.length; j++) {
                        if (materdata[j].F_Id == datanow.SalesOrderEntry_Material) {
                            materdatanew = materdata[j]
                            deadline = datanow.SalesOrderEntry_Deadline
                        }
                    }

                    html += '<li data-name="' + materdatanew.Material_Name + '" data-nick="' + materdatanew.Material_Nick + '" data-spe="' + materdatanew.Material_Specifications + '" data-materme="' + materdatanew.Material_Measure + '" data-deadline="' + deadline + '" data-materid="' + materdatanew.F_Id + '" data-matertype="' + materdatanew.Material_Type + '"><p>' + materdatanew.Material_Name + '</p><p>' + materdatanew.Material_Nick + '</p><p>' + materdatanew.Material_Specifications + '</p></li>'
                    arri = { materame: materdatanew.Material_Name, maternick: materdatanew.Material_Nick, matersp: materdatanew.Material_Specifications, materdatanew: materdatanew.Material_Measure, deadline: deadline, materid: materdatanew.F_Id, matertype: materdatanew.Material_Type };
                    arrlist.push(arri)
                }
                if (html) {
                    $(".selectlist ul").html(html);
                } else {
                    $(".selectlist ul").html("<span style='text-align:center;display: block;padding: 10px 0;'>没有数据</span>");
                }
                $(".materName").on("keyup", function () {
                    var searchVal = $(this).val();
                    var showList = [];
                    var searchlist = '';
                    //将和所输入的字符串匹配的项存入showList
                    //将匹配项显示，不匹配项隐藏
                    $.each(arrlist, function (index, item) {
                        if (item.materame.indexOf(searchVal) != -1 || item.maternick.indexOf(searchVal) != -1 || item.matersp.indexOf(searchVal) != -1) {
                            showList.push(item);
                        } else {

                        }
                    })

                    for (var j = 0; j < showList.length; j++) {
                        var shownow = showList[j]
                        searchlist += '<li data-name="' + shownow.materame + '" data-nick="' + shownow.maternick + '" data-spe="' + shownow.matersp + '" data-materme="' + shownow.matermea + '" data-deadline="' + deadline + '" data-materid="' + shownow.materid + '" data-matertype="' + shownow.matertype + '"><p>' + shownow.materame + '</p><p>' + shownow.maternick + '</p><p>' + shownow.matersp + '</p></li>'
                    }
                    if (showList.length == 0) {
                        searchlist = '<div style="text-align:center;padding:15px 0">暂无数据</div>'
                    }
                    $(".selectlist ul").html("");
                    $(".selectlist ul").html(searchlist);
                    $('.selectlist ul').find('li').each(function () {
                        var _this1 = $(this);
                        _this1.hover(function () {
                            $(this).addClass("active").siblings().removeClass("active")
                        });
                        _this1.on("click", function () {
                            $(".sub").attr("data-craftid", "")
                            var name = $(this).attr("data-name");
                            var nick = $(this).attr("data-nick");
                            var specife = $(this).attr("data-spe");
                            var measure = $(this).attr("data-materme");
                            var deadlin = $(this).attr("data-deadline")
                            var materid = $(this).attr("data-materid")
                            var matertype = $(this).attr("data-matertype");
                            matertypelist(matertype)
                            $("#Craft_Material").val(materid)
                            getcraftone(materid)
                            $("#deadline").val(deadlin.split(" ")[0])
                            $(".materName").val(name);
                            $(".maternick").val(nick);
                            $(".materspe").val(specife);
                            $("#measure").val(measure);
                            $(".selectlist").addClass("hidden");
                            $(".checkpro").removeClass("layui-form-selected");
                            $(".isAttribute").html("");
                            $(".isAttribute").css("padding", "0")

                            return false
                        })
                    })
                })
                $('.selectlist ul').find('li').each(function () {
                    var _this1 = $(this);
                    _this1.hover(function () {
                        $(this).addClass("active").siblings().removeClass("active")
                    });
                    _this1.on("click", function () {
                        var name = $(this).attr("data-name");
                        var nick = $(this).attr("data-nick");
                        $(".sub").attr("data-craftid", "")
                        var specife = $(this).attr("data-spe");
                        var measure = $(this).attr("data-materme");
                        var deadlin = $(this).attr("data-deadline")
                        var materid = $(this).attr("data-materid")
                        var matertype = $(this).attr("data-matertype");
                        matertypelist(matertype)
                        $("#Craft_Material").val(materid)
                        getcraftone(materid)
                        $("#deadline").val(deadlin.split(" ")[0])
                        $(".materName").val(name);
                        $(".maternick").val(nick);
                        $(".materspe").val(specife);
                        $("#measure").val(measure);
                        $(".selectlist").addClass("hidden");
                        $(".checkpro").removeClass("layui-form-selected");
                        $(".isAttribute").html("");
                        $(".isAttribute").css("padding", "0")
                        return false
                    })
                })
            }

            return false;
        })
    }
});


var renderForm;
var tablelist1, getproNorder;
var firstone = 'a' + new Date().valueOf();
var viewObjcra = {
    tbData1: [{
        state: 0,
        AssignCraft_Nick: '',
        crsId: firstone,
        AssignCraft_Name: '',
        fid: '',
        IsEnabled: true
    }],
    limit: 1,
    last: firstone
};
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
    var layTableId = "layTable1";
    var tablecrm = table.render({
        elem: '#dataTable1',
        data: viewObjcra.tbData1,
        limit: viewObjcra.limit,
        page: false,
        id: layTableId,
        loading: true,
        // even: true,
        cols: [
            [
                { title: '序号', type: 'checkbox' },
                { field: 'AssignCraft_Nick', title: '工序名称', templet: "#selectcrp" },
                { field: 'Rmark', title: '备注', edit: 'text' },
                // { field: 'Fuser', title: '操作工', templet: "#selectuser" },
                {
                    field: 'F_Id', title: '操作', align: 'center', templet: function (d) {
                        return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.F_Id + '">刪除</a>';
                    }
                }
            ]
        ],
        done: function (res, curr, count) {
            viewObjcra.tbData1 = res.data;
            tablelist1 = res.data;
            checklist()
            $('#tablecpm .layui-table-body tr').each(function (e) {
                var $cr1 = $(this);
                var dataindex = $cr1.attr("data-index");
                $.each(tablelist1, function (index, value) {
                    if (value.LAY_TABLE_INDEX == dataindex) {
                        $cr1.find('td[data-field="AssignCraft_Nick"]').find("input").val(value.AssignCraft_Nick);
                    }
                });
            });

        }
    });

    //定义事件集合
    var active = {
        add: function () { //添加一行
            viewObjcra.limit = viewObjcra.limit + 1;
            var oldData = table.cache[layTableId];
            var tid = 'a' + new Date().valueOf();
            var newRow = {
                AssignCraft_Nick: '',
                AssignCraft_Process: '',
                crsId: tid,
                AssignCraft_Name: '',
                fid: '',
                state: 0,
                IsEnabled: true

            };
            oldData.push(newRow);
            viewObjcra.last = tid;

            oldData.push(newRow);
            // viewObjcra.last = tid;
            tablecrm.reload({
                data: oldData,
                limit: viewObjcra.limit
            });
        },
        updateRow: function (obj) {
            var oldData = table.cache[layTableId];
            tablecrm.reload({
                data: oldData,
                limit: viewObjcra.limit
            });
        },
        removeEmptyTableCache: function () {
            var oldData = table.cache[layTableId];
            for (var i = 0, row; i < oldData.length; i++) {
                row = oldData[i];
                if (!row || !row.crsId) {
                    oldData.splice(i, 1); //删除一项
                }
                continue;
            }
            viewObjcra.last = oldData[oldData.length - 1].tempId;
            tablecrm.reload({
                data: oldData,
                limit: viewObjcra.limit
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
    table.on('tool(dataTable1)', function (obj) {
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

                if (viewObjcra.limit == 1) {
                    alert("删除失败，至少应有一条数据")
                } else {
                    viewObjcra.limit = viewObjcra.limit - 1;
                    layer.confirm('确定删除？', function (index) {
                        obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                        layer.close(index);
                        activeByType('removeEmptyTableCache');

                    });
                }
                break;
        }
    });
    table.on('edit(dataTable1)', function (obj) {
        var oldData = table.cache[layTableId];
        tablecrm.reload({
            data: oldData,
            limit: viewObjcra.limit
        });
    });
    // 切换列表中工序
    form.on('select(AssignCraft_Nick)', function (data, e) {
        $("#tablelist1 .layui-table-body").removeClass("overvis");
        $("#tablelist1 .layui-table-box").removeClass("overvis");
        $("#tablelist1 .layui-table-view").removeClass("overvis");

        var elem = data.othis.parents('tr');
        var dataindex = elem.attr("data-index");
        $.each(tablelist1, function (index, value) {
            if (value.LAY_TABLE_INDEX == dataindex) {
                value.AssignCraft_Name = data.value;
                if (data.elem.selectedOptions) {
                    value.AssignCraft_Nick = data.elem.selectedOptions[0].innerHTML;
                    value.fid = data.elem.selectedOptions[0].attributes[1].value;
                    value.AssignCraft_Process = data.elem.selectedOptions[0].attributes[1].value;
                } else {
                    var elems = data.elem;
                    for (var i = 0; i < elems.length; i++) {
                        var elemnow = elems[i];
                        if (elemnow.selected) {
                            value.AssignCraft_Nick = elemnow.text;
                            value.fid = elemnow.attributes[1].value;
                            value.AssignCraft_Process = elemnow.attributes[1].value;
                        }
                    }

                }
                if (value.crsId == viewObjcra.last && data.value != '') {
                    activeByType("add");
                }
            }
        });
    })

    // 工序---
    $.ajax({
        type: "GET",
        url: processlist,
        success: function (res) {

            var isussecc = res.Succeed;
            if (isussecc) {
                for (var i = 0; i < res.Data.length; i++) {
                    dateslit1.push(res.Data[i])
                }
                var oldData = table.cache[layTableId];
                tablecrm.reload({
                    data: oldData,
                    limit: viewObjcra.limit
                });
                // dateslit1=res.Data
            } else {
                alert(res.Message)
            }
        }
    })

    // 重载工序列表
    reloadcraft = function (data) {

        var id = 'a' + new Date().valueOf();
        var newdata = [];
        var adddata = {
            state: 0,
            AssignCraft_Nick: '',
            crsId: id,
            AssignCraft_Name: '',
            IsEnabled: true
        };
        viewObjcra.last = id;
        if (data) {
            viewObjcra.limit = data.length + 1;
            $.each(data, function (i, v) {
                v.AssignCraft_Name = v.CraftEntry_Name
                v.AssignCraft_Nick = v.CraftEntry_Nick
                v.AssignCraft_Process = v.F_Id
                newdata.push(v)
            })
            newdata.push(adddata)
        } else {
            viewObjcra.limit = 1;
            newdata.push(adddata) 
        }
        tablecrm.reload({
            data: newdata,
            limit: viewObjcra.limit
        });
    }

    renderForm = function () {
        layui.use('form', function () {
            var form = layui.form;
            form.render();
            var oldData = table.cache[layTableId];
            tablecrm.reload({
                data: oldData,
                limit: viewObjcra.limit
            });
        });
    }


    // $(".gynext").on("click", function () {
    //     var data = table.cache[layTableId];
    //     if (data.length == 1) {
    //         // if (data[0].FMaterialName == '') {
    //         //     alert("至少选择一条工艺")
    //         // }
    //     } else {
    //         sessionStorage.setItem('gylist', JSON.stringify(data));
    //         // parent.nexthb()
    //     }
    // })

    function checklist() {
        $("#tablelist1 td[data-field='AssignCraft_Nick']").each(function () {
            var curnow = $(this);
            curnow.on("click", function () {

                $("#tablelist1 .layui-table-body").addClass("overvis");
                $("#tablelist1 .layui-table-box").addClass("overvis");
                $("#tablelist1 .layui-table-view").addClass("overvis");
            })
        })
    }

    getcraftdata = function () {
        var oldData = table.cache[layTableId];
        return oldData
    }
});

$(function () {

    // 保存--
    var iscontinue = true
    $(".sub").on("click", function () {
        var list = $("form").serializeArray();
        console.log(list)
        $.each(list, function (i, v) {
            if (v.name == "Assign_Material") {
                if (v.value == '') {
                    alert("请选择产品");
                    iscontinue = false;
                    return false;
                } else {
                    iscontinue = true;

                }
            } else if (v.name == "Assign_StartTime") {
                if (v.value == '') {
                    alert("请选择计划开工日期");
                    iscontinue = false;
                    return false;
                } else {
                    iscontinue = true;
                }
            } else if (v.name == "Assign_Deadline") {
                if (v.value == '') {
                    alert("请选择计划完工日期");
                    iscontinue = false;
                    return false;
                } else {
                    iscontinue = true;
                }
            } else if (v.name == "Assign_DeaAssign_Typedline") {
                if (v.value == '') {
                    alert("请选择工单类型");
                    iscontinue = false;
                    return false;
                } else {
                    iscontinue = true;

                }
            }
        })

        var oldData = getcraftdata()
        var newdata = [];
        $.each(oldData, function (i, v) {
            if (v.AssignCraft_Nick != '') {
                newdata.push(v)
            }
        })

        sendfacture()


        return false
    })


    // 制单人
    var mouser = $.cookie("User_Id");
    var username = $.cookie("User_Nick")
    $("#Assign_Biller").val(mouser)
    $("#Assign_Billername").val(username)
    $("#tablelist1 .layui-table-body").addClass("overvis");
    $("#tablelist1 .layui-table-box").addClass("overvis");
    $("#tablelist1 .layui-table-view").addClass("overvis");
    // 产品代码
    $(".checkpro").on("click", function () {
        $(".dateload").addClass("hidden")
        if ($("#cusOrder").val()) {

        } else {
            var data = materdata
            $(".selectlist").removeClass("hidden");
            var _this = $(this);
            _this.addClass("layui-form-selected")

            $(".datelist").removeClass("hidden")

            var html = '';
            var arrlist = [];
            var arri = {};
            // data[i].Material_Name data[i].Material_Nick  data[i].Material_Specification
            for (var i = 0; i < data.length; i++) {
                var datanow = data[i];
                html += '<li data-name="' + datanow.Material_Name + '" data-nick="' + datanow.Material_Nick + '" data-spe="' + datanow.Material_Specifications + '" data-materme="' + datanow.Material_Measure + '" data-materid="' + datanow.F_Id + '" data-matertype="' + datanow.Material_Type + '"><p>' + datanow.Material_Name + '</p><p>' + datanow.Material_Nick + '</p><p>' + datanow.Material_Specifications + '</p></li>'
                arri = { materame: datanow.Material_Name, maternick: datanow.Material_Nick, matersp: datanow.Material_Specifications, matermea: datanow.Material_Measure, materid: datanow.F_Id, matertype: datanow.Material_Type };
                arrlist.push(arri)
            }
            $(".selectlist ul").html(html);


            $(".materName").on("keyup", function () {
                var searchVal = $(this).val();
                var showList = [];
                var searchlist = '';
                //将和所输入的字符串匹配的项存入showList
                //将匹配项显示，不匹配项隐藏
                $.each(arrlist, function (index, item) {
                    if (item.materame.indexOf(searchVal) != -1 || item.maternick.indexOf(searchVal) != -1 || item.matersp.indexOf(searchVal) != -1) {
                        showList.push(item);
                    } else {

                    }
                })

                for (var j = 0; j < showList.length; j++) {
                    var shownow = showList[j]
                    searchlist += '<li data-name="' + shownow.materame + '" data-nick="' + shownow.maternick + '" data-spe="' + shownow.matersp + '" data-materme="' + shownow.matermea + '" data-materid="' + shownow.materid + '" data-matertype="' + shownow.matertype + '"><p>' + shownow.materame + '</p><p>' + shownow.maternick + '</p><p>' + shownow.matersp + '</p></li>'
                }
                if (showList.length == 0) {
                    searchlist = '<div style="text-align:center;padding:15px 0">暂无数据</div>'
                }
                $(".selectlist ul").html("");
                $(".selectlist ul").html(searchlist);
                $('.selectlist ul').find('li').each(function () {
                    var _this1 = $(this);
                    _this1.hover(function () {
                        $(this).addClass("active").siblings().removeClass("active")
                    });
                    _this1.on("click", function () {
                        var name = $(this).attr("data-name");
                        $(".sub").attr("data-craftid", "")
                        var nick = $(this).attr("data-nick");
                        var specife = $(this).attr("data-spe");
                        var measure = $(this).attr("data-materme");
                        var materid = $(this).attr("data-materid")
                        var matertype = $(this).attr("data-matertype");
                        matertypelist(matertype)
                        getcraftone(materid)
                        $("#Craft_Material").val(materid)
                        $(".materName").val(name);
                        $(".maternick").val(nick);
                        $(".materspe").val(specife);
                        $("#measure").val(measure);
                        $(".selectlist").addClass("hidden");
                        $(".checkpro").removeClass("layui-form-selected");
                        $(".isAttribute").html("");
                        $(".isAttribute").css("padding", "0")
                        // getblong(name, nick);
                        return false
                    })
                })
            })
            $('.selectlist ul').find('li').each(function () {
                var _this1 = $(this);
                _this1.hover(function () {
                    $(this).addClass("active").siblings().removeClass("active")
                });
                _this1.on("click", function () {
                    $(".sub").attr("data-craftid", "")
                    var name = $(this).attr("data-name");
                    var nick = $(this).attr("data-nick");
                    var specife = $(this).attr("data-spe");
                    var materid = $(this).attr("data-materid")
                    var matertype = $(this).attr("data-matertype");
                    matertypelist(matertype)
                    getcraftone(materid)
                    $("#Craft_Material").val(materid)
                    var measure = $(this).attr("data-materme");
                    $(".materName").val(name);
                    $(".maternick").val(nick);
                    $(".materspe").val(specife);
                    $("#measure").val(measure);
                    $(".selectlist").addClass("hidden");
                    $(".checkpro").removeClass("layui-form-selected");
                    $(".isAttribute").html("");
                    $(".isAttribute").css("padding", "0")
                    // getblong(name, nick);
                    return false
                })
            })


        }

        return false;
    })

    getproNorder = function () {
        $(".dateload").addClass("hidden")
        if ($("#cusOrder").val()) {

        } else {
            $(".selectlist ul").html("");
            $(".datelist").removeClass("hidden")
            var data = materdata;
            var html = '';
            var arrlist = [];
            var arri = {};
            for (var i = 0; i < data.length; i++) {
                var datanow = data[i];
                html += '<li data-name="' + datanow.Material_Name + '" data-nick="' + datanow.Material_Nick + '" data-spe="' + datanow.Material_Specifications + '" data-materme="' + datanow.Material_Measure + '" data-materid="' + datanow.F_Id + '" data-matertype="' + datanow.Material_Type + '"><p>' + datanow.Material_Name + '</p><p>' + datanow.Material_Nick + '</p><p>' + datanow.Material_Specifications + '</p></li>'
                arri = { materame: datanow.Material_Name, maternick: datanow.Material_Nick, matersp: datanow.Material_Specifications, matermea: datanow.Material_Measure, materid: datanow.F_Id, matertype: datanow.Material_Type };
                arrlist.push(arri)
            }
            $(".selectlist ul").html(html);
            $(".materName").on("keyup", function () {
                var searchVal = $(this).val();
                var showList = [];
                var searchlist = '';
                //将和所输入的字符串匹配的项存入showList
                //将匹配项显示，不匹配项隐藏
                $.each(arrlist, function (index, item) {
                    if (item.materame.indexOf(searchVal) != -1 || item.maternick.indexOf(searchVal) != -1 || item.matersp.indexOf(searchVal) != -1) {
                        showList.push(item);
                    } else {

                    }
                })

                for (var j = 0; j < showList.length; j++) {
                    var shownow = showList[j]
                    searchlist += '<li data-name="' + shownow.materame + '" data-nick="' + shownow.maternick + '" data-spe="' + shownow.matersp + '" data-materme="' + shownow.matermea + '" data-materid="' + shownow.materid + '" data-matertype="' + shownow.matertype + '"><p>' + shownow.materame + '</p><p>' + shownow.maternick + '</p><p>' + shownow.matersp + '</p></li>'
                }
                if (showList.length == 0) {
                    searchlist = '<div style="text-align:center;padding:15px 0">暂无数据</div>'
                }
                $(".selectlist ul").html("");
                $(".selectlist ul").html(searchlist);
                $('.selectlist ul').find('li').each(function () {
                    var _this1 = $(this);
                    _this1.hover(function () {
                        $(this).addClass("active").siblings().removeClass("active")
                    });
                    _this1.on("click", function () {
                        var name = $(this).attr("data-name");
                        $(".sub").attr("data-craftid", "")
                        var nick = $(this).attr("data-nick");
                        var specife = $(this).attr("data-spe");
                        var measure = $(this).attr("data-materme");
                        var materid = $(this).attr("data-materid")
                        var matertype = $(this).attr("data-matertype");
                        matertypelist(matertype)
                        getcraftone(materid)
                        $("#Craft_Material").val(materid)
                        $(".materName").val(name);
                        $(".maternick").val(nick);
                        $(".materspe").val(specife);
                        $("#measure").val(measure);
                        $(".selectlist").addClass("hidden");
                        $(".checkpro").removeClass("layui-form-selected");
                        $(".isAttribute").html("");
                        $(".isAttribute").css("padding", "0")
                        // getblong(name, nick);
                        return false
                    })
                })
            })
            $('.selectlist ul').find('li').each(function () {
                var _this1 = $(this);
                _this1.hover(function () {
                    $(this).addClass("active").siblings().removeClass("active")
                });
                _this1.on("click", function () {
                    $(".sub").attr("data-craftid", "")
                    var name = $(this).attr("data-name");
                    var nick = $(this).attr("data-nick");
                    var specife = $(this).attr("data-spe");
                    var materid = $(this).attr("data-materid")
                    var matertype = $(this).attr("data-matertype");
                    matertypelist(matertype)
                    getcraftone(materid)
                    $("#Craft_Material").val(materid)
                    var measure = $(this).attr("data-materme");
                    $(".materName").val(name);
                    $(".maternick").val(nick);
                    $(".materspe").val(specife);
                    $("#measure").val(measure);
                    $(".selectlist").addClass("hidden");
                    $(".checkpro").removeClass("layui-form-selected");
                    $(".isAttribute").html("");
                    $(".isAttribute").css("padding", "0")
                    // getblong(name, nick);
                    return false
                })
            })


        }

        return false;
    }

    $("input[data-type='checkpro']").blur(function () {
        var _this = $(this);
        _this.parent().removeClass("layui-form-selected")
    });

    $('body').bind('click', function (event) {
        var evt = event.srcElement ? event.srcElement : event.target;
        if (!($(".selectlist").hasClass("hidden"))) {
            if (evt.id == 'checkpro') return; // 如果是元素本身，则返回
            else {
                $(".selectlist").addClass("hidden");
            }
        }
    });

    $("#addCraft").click(function () {
        $(".termask").removeClass("hidden")
    })

    $("#btncancel,.iconclose").click(function () {
        $(".termask").addClass("hidden")
    })

    var curlist;

    // 客户--
    $(".checkcus").on("click", function () {
        var _this = $(this);
        var date = _this.attr("data-type");
        if (date == 'daten') {
            $(".checkcus").attr("data-type", "datey");
            if (!curlist) {
                $.ajax({
                    type: "get",
                    url: ajaxCus,
                    success: function (res) {
                        var isussecc = res.Succeed;
                        var data = res.Data;
                        if (isussecc) {
                            var html = '<option value="">全部</option>';
                            var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                            for (var i = 0; i < data.length; i++) {
                                html += '<option value="' + data[i].F_Id + '" data-rate="' + data[i].Customer_TaxRate + '">' + data[i].Customer_Nick + '</option>';
                                htmlsel += '<dd lay-value="' + data[i].F_Id + '" data-rate="' + data[i].Customer_TaxRate + '">' + data[i].Customer_Nick + '</dd>'
                            }
                            $("#Assign_Customer").html(html);
                            $(".checkcus .layui-anim.layui-anim-upbit").html(htmlsel);
                            reloadform();
                            _this.find("select").next().find('.layui-select-title input').click();
                            _this.find("select").next().find('.layui-select-title input').focus()
                        } else {
                            alert(res.Message)
                        }
                    }
                })
            }

        }
    })

    function getcus(id) {
        $.ajax({
            type: "get",
            url: ajaxCus,
            success: function (res) {
                var isussecc = res.Succeed;
                var data = res.Data;
                var chekid;
                if (isussecc) {
                    curlist = data
                    var html = '<option value="">全部</option>';
                    var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                    for (var i = 0; i < data.length; i++) {
                        var nowdata = data[i]
                        html += '<option value="' + nowdata.F_Id + '" data-rate="' + nowdata.Customer_TaxRate + '">' + nowdata.Customer_Nick + '</option>';
                        htmlsel += '<dd lay-value="' + nowdata.F_Id + '" data-rate="' + nowdata.Customer_TaxRate + '">' + nowdata.Customer_Nick + '</dd>';
                        if (nowdata.F_Id == id) {
                            chekid = nowdata.F_Id
                        }
                    }
                    $("#Assign_Customer").html(html);
                    $(".checkcus .layui-anim.layui-anim-upbit").html(htmlsel);
                    reloadform();
                    var select = 'dd[lay-value="' + chekid + '"]';
                    $('#Assign_Customer').siblings("div.layui-form-select").find('dl').find(select).click();
                } else {
                    alert(res.Message)
                }

            }
        })
    }


    // 客户订单号--
    $(".cusOrder").on("click", function () {
        var _this = $(this);
        var date = _this.attr("data-type");
        if (date == 'daten') {
            $(".cusOrder").attr("data-type", "datey");
            $.ajax({
                type: "get",
                url: salelist,
                success: function (res) {

                    var isussecc = res.Succeed;
                    var data = res.Data;
                    if (isussecc) {
                        var html = '<option value="">全部</option>';
                        var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                        for (var i = 0; i < data.length; i++) {
                            html += '<option value="' + data[i].F_Id + '" data-cus="' + data[i].SalesOrder_Customer + '">' + data[i].SalesOrder_Name + '</option>';
                            htmlsel += '<dd lay-value="' + data[i].F_Id + '" data-cus="' + data[i].SalesOrder_Customer + '">' + data[i].SalesOrder_Name + '</dd>'
                        }
                        $("#cusOrder").html(html);
                        $(".cusOrder .layui-anim.layui-anim-upbit").html(htmlsel);
                        reloadform();
                        _this.find("select").next().find('.layui-select-title input').click();
                        _this.find("select").next().find('.layui-select-title input').focus()
                    } else {
                        alert(res.Message)
                    }

                }
            })
        }
    })


    // 工艺路线
    $.ajax({
        type: "get",
        url: craftlist,
        success: function (res) {

            var isussecc = res.Succeed;
            var data = res.Data;
            if (isussecc) {
                var html = '<option value="">全部</option>';
                var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                for (var i = 0; i < data.length; i++) {
                    var nowD = data[i];
                    var nick = "";
                    if (nowD.Craft_Nick) {
                        nick = nowD.Craft_Nick;
                    } else {
                        nick = nowD.Craft_Name;
                    }
                    html += '<option value="' + nowD.F_Id + '" >' + nick + '</option>';
                    htmlsel += '<dd lay-value="' + nowD.F_Id + '" >' + nick + '</dd>'
                }
                $("#Assign_Craft").html(html);
                $(".checkcraft .layui-anim.layui-anim-upbit").html(htmlsel);
                reloadform();
                // _this.find("select").next().find('.layui-select-title input').click();

            } else {
                alert(res.Message)
            }

        }
    })

    // BOM
    // $(".checkbom").on("click", function () {
    //     var _this = $(this);
    //     var date = _this.attr("data-type");
    //     if (date == 'daten') {
    //         $(".checkbom").attr("data-type", "datey");
    //         $.ajax({
    //             type: "get",
    //             url: bomlist,
    //             success: function (res) {
    //               
    //                 var isussecc = res.Succeed;
    //                 var data = res.Data;
    //                 if (isussecc) {
    //                     var html = '<option value="">全部</option>';
    //                     var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
    //                     for (var i = 0; i < data.length; i++) {
    //                         html += '<option value="' + data[i].F_Id + '" >' + data[i].BillOfMaterial_Name + '</option>';
    //                         htmlsel += '<dd lay-value="' + data[i].F_Id + '" >' + data[i].BillOfMaterial_Name + '</dd>'
    //                     }
    //                     $("#Assign_BillOfMaterial").html(html);
    //                     $(".checkbom .layui-anim.layui-anim-upbit").html(htmlsel);
    //                     reloadform();
    //                     _this.find("select").next().find('.layui-select-title input').click();

    //                 } else {
    //                     alert(res.Message)
    //                 }

    //             }
    //         })
    //     }
    // })

    // 切换客户订单号
    layui.form.on('select(cusorder)', function (data) {

        if (data.value == '') {
            getproNorder()
        } else {
            var id = data.value;
            var cusid;
            if (data.elem.selectedOptions) {
                cusid = data.elem.selectedOptions[0].attributes[1].value;

            } else {
                var elems = data.elem;
                for (var i = 0; i < elems.length; i++) {
                    var elemnow = elems[i];
                    if (elemnow.selected) {
                        cusid = elemnow.attributes[1].value;
                    }
                }
            }
            getcus(cusid)
            $.ajax({
                type: "get",
                url: saleEntry + id,
                success: function (res) {

                    var isussecc = res.Succeed;
                    var data = res.Data;
                    if (isussecc) {
                        $("#Assign_SalesOrderEntry").val(res.Data.F_Id)
                        // 获取客户订单号下产品列表
                        getpro(data.Details)

                    } else {
                        alert(res.Message)
                    }
                }
            })

        }



    })

    // 切换工艺路线
    layui.form.on('select(craft)', function (data) {

        var id = data.value;
        var crafid;
        if (data.value) {
            if (data.elem.selectedOptions) {
                crafid = data.elem.selectedOptions[0].attributes[0].value;

            } else {
                var elems = data.elem;
                for (var i = 0; i < elems.length; i++) {
                    var elemnow = elems[i];
                    if (elemnow.selected) {
                        crafid = elemnow.attributes[0].value;
                    }
                }
            }
        }

        $(".sub").attr("data-craftid", crafid)
        if (craftdetail.length >= 1) {
            reloadcraft(craftdetail)
        } else {
            var datanul = []
            reloadcraft(datanul)
        }

        // if (id) {
        //     // 切换工艺之后查询此工艺路线下的工序列表
        //     $.ajax({
        //         type: "get",
        //         url: assignCraft + id,
        //         success: function (res) {
        //            
        //             var isussecc = res.Succeed;
        //             var data = res.Data;
        //             if (isussecc) {
        //                 if (res.Data.length >= 1) {
        //                     reloadcraft(data)
        //                 } else {
        //                     reloadcraft(craftdetail)
        //                 }
        //                 $(".sub").attr("data-nick", data.Craft_Nick)
        //                 $(".sub").attr("data-name", data.Craft_Name)
        //             } else {
        //                 alert(res.Message)
        //             }
        //         }
        //     })
        // } else {
        //     var datanul = []
        //     reloadcraft(datanul)
        // }
    })

    $(".checkone").click(function () {
        var stau = $(this).attr("data-status");
        if (stau == '1') {
            var matername = $(".materName").val();
            if (matername) {
                $(".taplist").attr("data-staut", "1")
                $("#tablelist1").removeClass("hidden");
                $("#tablelist").addClass("hidden");
                $(".checkgy").addClass("active");
                $(".checkorder").removeClass("active");
                $(".ordernext").addClass("hidden");
                $(".gynext").removeClass("hidden");
            } else {
                alert("请先选择产品")
            }
        } else {
            $(".taplist").attr("data-staut", "2")
            $("#tablelist").removeClass("hidden");
            $("#tablelist1").addClass("hidden");
            $(".checkorder").addClass("active");
            $(".checkgy").removeClass("active");
            $(".ordernext").removeClass("hidden");
            $(".gynext").addClass("hidden");

        }
    })


    $(document).one("click", function () {
        $("#tablelist .layui-table-body").addClass("overvis");
        $("#tablelist .layui-table-box").addClass("overvis");
        $("#tablelist .layui-table-view").addClass("overvis");

    })

    // 文件上传
    layui.use(['upload'], function () {
        var upload = layui.upload;
        //多文件列表示例
        var tablehead = $('#tablehead');
        var tablebody = $('#tablebody');
        var imgcount = 0;
        var headhtml = "<tr><th>文件名</th><th>大小</th><th>操作</th></tr>";
        var uploadListIns = upload.render({
            elem: '#testList'
            , url: '/upload/'
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

    });


    // 工单类型--
    $.ajax({
        type: "get",
        url: ajaxAsstype,
        success: function (res) {
            var isussecc = res.Succeed;
            var data = res.Data.Details;
            var typeid;
            if (isussecc) {
                var html = '<option value="">全部</option>';
                var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                for (var i = 0; i < data.length; i++) {
                    var typedata = data[i];
                    if (typedata.DictionaryItem_Nick == '普通工单') {
                        typeid = typedata.DictionaryItem_Value
                    }
                    html += '<option value="' + typedata.DictionaryItem_Value + '">' + typedata.DictionaryItem_Nick + '</option>';
                    htmlsel += '<dd lay-value="' + typedata.DictionaryItem_Value + '">' + typedata.DictionaryItem_Nick + '</dd>'
                }
                $("#Assign_Type").html(html);
                $(".worktype .layui-anim.layui-anim-upbit").html(htmlsel);
                layui.use('form', function () {
                    var form = layui.form;
                    form.render();
                    renderForm1()
                    renderForm()
                });
                var select = 'dd[lay-value="' + typeid + '"]';
                $('#Assign_Type').siblings("div.layui-form-select").find('dl').find(select).click();
            } else {
                alert(res.Message)
            }

        }
    })

    // 获取单据编号
    $.ajax({
        url: getnum,
        success: function (res) {
            if (res.Succeed) {
                $("#Assign_Name").val(res.Data)
            } else {
                alert(res.Message)
            }
        }
    })

    // 获取工单主键
    $.ajax({
        url: getMain,
        success: function (res) {

            var isussecc = res.Succeed;
            if (isussecc) {
                $("#fid").val(res.Data)

            } else {
                alert(res.Message)
            }
        }
    })

})

function reloadform() {
    layui.use('form', function () {
        var form = layui.form;
        form.render()
        renderForm1()
        renderForm()
    });
}

// 根据选择的产品查工艺路线
function getcraftone(id) {

    $.ajax({
        url: materCraft + id,
        success: function (res) {

            var isussecc = res.Succeed;
            if (isussecc) {
                if (res.Data) {
                    $("#assCraftid").val(res.F_Id)
                    craftdetail = res.Data.Details
                    var select = 'dd[lay-value="' + res.Data.F_Id + '"]';
                    $('#Assign_Craft').siblings("div.layui-form-select").find('dl').find(select).click();
                    // newcraftdefalue(res.Data.Details,0)
                } else {
                    craftdetail = []
                    var select1 = 'dd[lay-value=""]';
                    $('#Assign_Craft').siblings("div.layui-form-select").find('dl').find(select1).click();
                    $("#isadd").val("false")
                }
            } else {
                alert(res.Message)
            }
        }
    })
}

// 保存工单
var isSend = true;
var newcraft = false;
sendfacture = function () {
    var list = $("form").serializeArray();
    var attrdatalist = []
    $(".attrhide form").html($(".isAttribute").html())
    var attrdata = $(".attrform").serializeArray();
    $.each(attrdata, function (i, v) {
        $.each(list, function (index, value) {
            if (v.name == value.name) {
                v.value = value.value
            }
        })
    })
    var newattrdata = {}
    $.each(attrdata, function (i, v) {
        newattrdata[v.name] = v.value
    })
    attrdatalist.push(newattrdata)
    console.log(attrdatalist)
    var data = {}, craftdata = {};
    var newdata = [], cradata = [];
    var fid = $("#fid").val()
    for (var j = 0; j < list.length; j++) {
        data[list[j].name] = list[j].value
        craftdata[list[j].name] = list[j].value
    }
    var oldData = getmaterdata();
    var oldCraftdata = getcraftdata();
    for (var j = 0; j < oldData.length; j++) {
        var nowdata = oldData[j]
        if (nowdata.AssignEntry_Material) {
            isSend = true;
            if (nowdata.AssignEntry_Quantity == '') {
                alert("请填写计划用量")
                isSend = false;
                return
            } else if (nowdata.AssignEntry_ScrapRate == '') {
                alert("请填写损耗")
                isSend = false;
                return
            } else {
                isSend = true
                newdata.push(nowdata)
            }
        }
    }

    for (var k = 0; k < oldCraftdata.length; k++) {
        var nowdata1 = oldCraftdata[k]
        if (nowdata1.AssignCraft_Nick) {
            if (nowdata1.F_Id) {
                nowdata1.F_Id = null
            }
            if (nowdata1.crsId) {
                newcraft = true;
            }
            cradata.push(nowdata1)
        }
    }
    subindex = layer.load();
    if (isSend) {
        data.Children = newdata;
        data.Crafts = cradata
        data.Details = attrdatalist
        craftdata.Crafts = cradata
        console.log(data)
        if (fid) {
            data.F_Id = fid
            craftdata.F_Id = fid
        }
        data.Assign_Status = '10000'
        craftdata.Assign_Status = '10000'

        $.ajax({
            type: "POST",
            url: saveAssign,
            data: data,
            success: function (res) {

                var isussecc = res.Succeed;
                var data = res.Data;
                if (isussecc) {
                    if (newcraft) {
                        var index = layer.confirm('是否下推工序汇报？', {
                            btn: ['确定', '取消'] //按钮
                        }, function () {
                            $.ajax({
                                type: "POST",
                                url: pushcraft,
                                data: craftdata,
                                success: function (res) {
                                    layer.close(index)
                                    var isussecc = res.Succeed;
                                    if (isussecc) {
                                        layer.close(subindex);
                                        layer.msg("新增成功");
                                        setInterval(function () {
                                            window.location.reload()
                                        }, 1000)
                                    } else {
                                        alert(res.Message)
                                    }
                                }
                            })
                        });
                    } else {
                        layer.close(subindex);
                        layer.msg("新增成功");
                        setInterval(function () {
                            window.location.reload()
                        }, 1000)
                    }

                } else {
                    layer.close(subindex);
                    alert(res.Message)
                }
            }
        })
    }

}


// 物料种属
function matertypelist(id) {

    var familyid;
    $.ajax({
        url: materFlist,
        success: function (res) {

            var isussecc = res.Succeed;
            if (isussecc) {
                var data = res.Data;
                var html = ''
                for (var i = 0; i < data.length; i++) {
                    var materdata1 = data[i]
                    if (id == materdata1.Family_Nick) {
                        familyid = materdata1.F_Id

                    }
                }

                $.ajax({
                    url: materFlistone + '?keyword=' + familyid + '&PageIndex=&PageSize=',
                    success: function (res) {

                        var isussecc = res.Succeed;
                        if (isussecc) {
                            var data = res.Data;
                            var html = ''
                            if (data.length >= 1) {
                                for (var i = 0; i < data.length; i++) {
                                    html += '<div class="layui-form-lsit fl ">' +
                                        '<label class="layui-form-label">' + data[i].FamilyEntry_Nick + '：</label>' +
                                        '<div class="layui-input-block disinput">' +
                                        '<input type="text" value="" id="" name="' + data[i].FamilyEntry_Name + '" class="attrs" autocomplete="off">' +
                                        '</div>' +
                                        '</div>';
                                }
                                $(".isAttribute").html(html)
                                $(".isAttribute").css("padding", "10px")
                            } else {
                                $(".isAttribute").html(html)
                                $(".isAttribute").css("padding", "0")
                            }

                        }
                    }
                })
            }
        }
    })


}