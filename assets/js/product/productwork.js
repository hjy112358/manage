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
        // value: tody,
        isInitValue: true,
        btns: ['now', 'confirm']
    });
    // 完工
    laydate.render({
        elem: '#Assign_Deadline',
        // value: tody,
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
var materdata,craftdetail;
var sendfacture, sendcraft, reloadcraft, getpro, getcraft;
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
    var layTableId = "layTable";
    tableIns = table.render({
        elem: '#dataTable',
        id: layTableId,
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
            { field: '', title: '实际用料数量' },
            { field: 'AssignEntry_ScrapRate', title: '损耗率' },
            { field: 'AssignEntry_Total', title: '理论用量' },//计划用料数量*损耗率
            { field: '', title: '领料差异' },
            // 领料差异=计划用量-实际用料
            { field: '', title: '领料差异率' },
            { field: 'Rmark', title: '备注', edit: 'text' },
            {
                field: 'tempId', title: '操作', align: 'center', templet: function (d) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.tempId + '"><i class="layui-icon layui-icon-delete"></i>删除</a>';
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
            var oldData = table.cache[layTableId];
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
    table.on('edit(dataTable)', function (obj) {
        var oldData = table.cache[layTableId];
        // if (!$.isNumeric(obj.value)) {
        //     for (var i = 0; i < oldData.length; i++) {
        //         var datenow = oldData[i];
        //         if (datenow.tempId === obj.data.tempId) {
        //             datenow.dates = "";
        //             layer.alert("请输入数字");
        //         }
        //     }
        // }

        tableIns.reload({
            data: oldData,
            limit: viewObj.limit
        });
    });
    var isend = true;
    var savedate;
    var lastid;

    // 保存物料工单
    sendfacture = function () {
        var list = $("form").serializeArray();
        var data = {};
        var newdata = [];
        for (var j = 0; j < list.length; j++) {
            console.log(list[j])
            data[list[j].name] = list[j].value
        }

        var oldData = table.cache[layTableId];
        for (var j = 0; j < oldData.length; j++) {
            var nowdata = oldData[j]
            if (nowdata.SalesOrderEntry_Material) {
                newdata.push(nowdata)
            }
        }
        data.Details = newdata;
        console.log(list)
        $.ajax({
            type: "POST",
            url: saveAssign,
            data: data,
            success: function (res) {
                console.log(res)
                var isussecc = res.Succeed;
                var data = res.Data;
                if (isussecc) {
                    // layer.close(index);
                    layer.msg("新增成功");
                    setInterval(function () {
                        window.location.reload()
                    }, 1000)
                } else {
                    // layer.close(index);
                    alert(res.Message)
                }
            }
        })
    }

    renderForm1 = function () {
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

    $(".ordernext").on("click", function () {
        var data = table.cache[layTableId];
        if (data.length == 1) {
            if (data[0].FMaterialName == '') {
                alert("至少选择一条物料代码")
            }
        } else {
            sessionStorage.setItem('wlist', JSON.stringify(data));
            parent.nextly()
        }
    })


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
                            console.log(res)
                            var data = res.Data;
                            var isussecc = res.Succeed;
                            // data[i].Material_Name data[i].Material_Nick  data[i].Material_Specification
                            for (var i = 0; i < data.length; i++) {
                                var datanow = data[i];
                                htmlterm += '<li data-name="' + (datanow.Material_Name || '') + '" data-nick="' + (datanow.Material_Nick || '') + '" data-spe="' + (datanow.Material_Specifications || '') + '" data-materme="' + (datanow.Material_Measure || '') + '" data-fid="' + datanow.F_Id + '"><p>' + (datanow.Material_Name || '') + '</p><p>' + (datanow.Material_Nick || '') + '</p><p>' + (datanow.Material_Specifications || '') + '</p></li>'
                                arri = { materame: (datanow.Material_Name || ''), maternick: (datanow.Material_Nick || ''), matersp: (datanow.Material_Specifications || ''), matermea: (datanow.Material_Measure || ''), materid: (datanow.F_Id || '') };
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
                                console.log(showList)
                                for (var j = 0; j < showList.length; j++) {
                                    var shownow = showList[j]
                                    searchlist += '<li data-name="' + shownow.materame + '" data-nick="' + shownow.maternick + '" data-spe="' + shownow.matersp + '" data-materme="' + shownow.matermea + '" data-fid="' + shownow.materid + '"><p>' + shownow.materame + '</p><p>' + shownow.maternick + '</p><p>' + shownow.matersp + '</p></li>'
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
                                    console.log(oldData)
                                    var name = $(this).attr("data-name");
                                    var nick = $(this).attr("data-nick");
                                    var specife = $(this).attr("data-spe");
                                    var measure = $(this).attr("data-materme");
                                    var fid = $(this).attr("data-fid");
                                    // console.log(fid)
                                    $(".materName1").val(name);
                                    // $(".maternick").val(nick);
                                    // $(".materspe").val(specife);
                                    // $("#measure").val(measure);
                                    $.each(tabledata, function (index, value) {
                                        console.log(value)
                                        if (value.LAY_TABLE_INDEX == dataindex) {
                                            value.materialName = name;
                                            value.materialNick = nick
                                            value.AssignEntry_Specifications = specife;
                                            value.AssignEntry_Unit = measure
                                            value.AssignEntry_Material = fid
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
                        console.log(showList)
                        for (var j = 0; j < showList.length; j++) {
                            var shownow = showList[j]
                            searchlist += '<li data-name="' + shownow.materame + '" data-nick="' + shownow.maternick + '" data-spe="' + shownow.matersp + '" data-materme="' + shownow.matermea + '" data-fid="' + shownow.materid + '"><p>' + shownow.materame + '</p><p>' + shownow.maternick + '</p><p>' + shownow.matersp + '</p></li>'
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
                            console.log(oldData)
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
                                console.log(value)
                                if (value.LAY_TABLE_INDEX == dataindex) {
                                    value.materialName = name;
                                    value.materialNick = nick
                                    value.AssignEntry_Specifications = specife;
                                    value.AssignEntry_Unit = measure
                                    value.AssignEntry_Material = fid
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

    $(document).on("click", function () {
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

    // 产品代码
    getpro = function (data) {
        console.log(data)
        $(".checkpro").on("click", function () {
            $(".selectlist").removeClass("hidden");
            var _this = $(this);
            _this.addClass("layui-form-selected")
            $(".checkpro").attr("data-type", "datey");
            // $(".dateload").removeClass("hidden")
            // $(".datelist").addClass("hidden");
            $(".dateload").addClass("hidden")
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
                console.log(materdatanew)
                html += '<li data-name="' + materdatanew.Material_Name + '" data-nick="' + materdatanew.Material_Nick + '" data-spe="' + materdatanew.Material_Specifications + '" data-materme="' + materdatanew.Material_Measure + '" data-deadline="' + deadline + '"><p>' + materdatanew.Material_Name + '</p><p>' + materdatanew.Material_Nick + '</p><p>' + materdatanew.Material_Specifications + '</p></li>'
                arri = { materame: materdatanew.Material_Name, maternick: materdatanew.Material_Nick, matersp: materdatanew.Material_Specifications, materdatanew: datanow.Material_Measure, deadline: deadline };
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
                console.log(showList)
                for (var j = 0; j < showList.length; j++) {
                    var shownow = showList[j]
                    searchlist += '<li data-name="' + shownow.materame + '" data-nick="' + shownow.maternick + '" data-spe="' + shownow.matersp + '" data-materme="' + shownow.matermea + '" data-deadline="' + deadline + '"><p>' + shownow.materame + '</p><p>' + shownow.maternick + '</p><p>' + shownow.matersp + '</p></li>'
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
                        var nick = $(this).attr("data-nick");
                        var specife = $(this).attr("data-spe");
                        var measure = $(this).attr("data-materme");
                        var deadlin = $(this).attr("data-deadline")
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
                    var specife = $(this).attr("data-spe");
                    var measure = $(this).attr("data-materme");
                    var deadlin = $(this).attr("data-deadline")
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
            return false;
        })
    }
});


var renderForm;
var tablelist1;
var firstone = 'a' + new Date().valueOf();
var viewObjcra = {
    tbData1: [{
        state: 0,
        CraftEntry_Nick: '',
        crsId: firstone,
        CraftEntry_Name: '',
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
                { field: 'CraftEntry_Nick', title: '工序名称', templet: "#selectcrp" },
                { field: 'Rmark', title: '备注', edit: 'text' },
                // { field: 'Fuser', title: '操作工', templet: "#selectuser" },
                {
                    field: 'F_Id', title: '操作', align: 'center', templet: function (d) {
                        return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.F_Id + '"><i class="layui-icon layui-icon-delete"></i>刪除</a>';
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
                        $cr1.find('td[data-field="CraftEntry_Nick"]').find("input").val(value.CraftEntry_Nick);

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
                CraftEntry_Nick: '',
                crsId: tid,
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
    form.on('select(CraftEntry_Nick)', function (data, e) {
        $("#tablelist1 .layui-table-body").removeClass("overvis");
        $("#tablelist1 .layui-table-box").removeClass("overvis");
        $("#tablelist1 .layui-table-view").removeClass("overvis");
        var elem = data.othis.parents('tr');
        var dataindex = elem.attr("data-index");
        $.each(tablelist1, function (index, value) {
            if (value.LAY_TABLE_INDEX == dataindex) {
                value.CraftEntry_Name = data.value;
                if (data.elem.selectedOptions) {
                    value.CraftEntry_Nick = data.elem.selectedOptions[0].innerHTML;

                } else {
                    var elems = data.elem;
                    for (var i = 0; i < elems.length; i++) {
                        var elemnow = elems[i];
                        if (elemnow.selected) {
                            value.CraftEntry_Nick = elemnow.text;
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
            console.log(res)
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

    reloadcraft = function (data) {
        console.log(data)
        viewObjcra.limit = data.length + 1;
        var id = 'a' + new Date().valueOf();
        var newdata = [];
        var adddata = {
            state: 0,
            CraftEntry_Nick: '',
            crsId: id,
            CraftEntry_Name: '',
            IsEnabled: true
        };
        viewObjcra.last = id;
        $.each(data, function (i, v) {
            newdata.push(v)
        })
        newdata.push(adddata)
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


    $(".gynext").on("click", function () {
        var data = table.cache[layTableId];
        if (data.length == 1) {
            if (data[0].FMaterialName == '') {
                alert("至少选择一条工艺")
            }
        } else {
            sessionStorage.setItem('gylist', JSON.stringify(data));
            parent.nexthb()
        }
    })

    function checklist() {
        $("#tablelist1 td[data-field='CraftEntry_Nick']").each(function () {
            var curnow = $(this);
            curnow.on("click", function () {
                console.log(dateslit1)
                $("#tablelist1 .layui-table-body").addClass("overvis");
                $("#tablelist1 .layui-table-box").addClass("overvis");
                $("#tablelist1 .layui-table-view").addClass("overvis");
            })
        })
    }

    // 保存--
    $(".sub").on("click", function () {
        var list=$("form").serializeArray()
        console.log(list)
        // sendcraft();
    })

    // 保存工艺--
    sendcraft = function () {
        var craftid = $(".sub").attr("data-craftid")
        var oldData = table.cache[layTableId];
        var nick = $(".sub").attr("data-nick")
        var name = $(".sub").attr("data-name")
        if (craftid) {
            var old = [];
            $.each(oldData, function (i, v) {
                if (v.CraftEntry_Name) {
                    old.push(v)
                }
            })
            var data1 = {
                Craft_Name: name,
                Craft_Nick: nick,
                F_Id: craftid,
                Details: old
            }
            $.ajax({
                type: "POST",
                // async: false,
                url: editCraft,
                data: data1,
                success: function (res) {
                    console.log(res)
                    var isussecc = res.Succeed;
                    if (isussecc) {
                        $(".termask").addClass("hidden");
                        $(".checklist").trigger("click");
                        var oldData = table.cache[layTableId];
                        tablecrm.reload({
                            data: oldData,
                            limit: viewObjcra.limit
                        });
                    } else {
                        $(".termask").removeClass("hidden");
                        alert(res.Message);
                    }
                }
            })
        } else {
            var newdata = [];
            for (var j = 0; j < oldData.length; j++) {
                var nowdata = oldData[j]
                if (nowdata.CraftEntry_Nick) {
                    newdata.push(nowdata)
                }
            }
            console.log(newdata)
            var mater = $("#Craft_Material").val()
            var data = {
                Craft_Material: mater,
                Details: newdata
            }
            $.ajax({
                type: 'POST',
                url: addCraft,
                data: data,
                success: function (res) {
                    var isussecc = res.Succeed;
                    if (isussecc) {
                        console.log(res)
                        var oldData = table.cache[layTableId];
                        tablecrm.reload({
                            data: oldData,
                            limit: viewObjcra.limit
                        });
                        // getcraft(res.F_Id)
                        // sendfacture()
                    } else {
                        alert(res.Message)
                    }
                }
            })
        }
    }
});



$(function () {

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
        if ($("#cusOrder").val()) {

        } else {
            $(".selectlist").removeClass("hidden");
            var _this = $(this);
            _this.addClass("layui-form-selected")
            var date = _this.attr("data-type");

            if (date == 'daten') {
                $(".checkpro").attr("data-type", "datey");
                $(".dateload").removeClass("hidden")
                $(".datelist").addClass("hidden");

                $.ajax({
                    url: ajaxMater,
                    success: function (res) {
                        $(".dateload").addClass("hidden")
                        $(".datelist").removeClass("hidden")
                        console.log(res)
                        var data = res.Data;
                        var isussecc = res.Succeed;
                        var html = '';
                        var arrlist = [];
                        var arri = {};
                        // data[i].Material_Name data[i].Material_Nick  data[i].Material_Specification
                        for (var i = 0; i < data.length; i++) {
                            var datanow = data[i];
                            html += '<li data-name="' + datanow.Material_Name + '" data-nick="' + datanow.Material_Nick + '" data-spe="' + datanow.Material_Specifications + '" data-materme="' + datanow.Material_Measure + '" data-materid="' + datanow.F_Id + '"><p>' + datanow.Material_Name + '</p><p>' + datanow.Material_Nick + '</p><p>' + datanow.Material_Specifications + '</p></li>'
                            arri = { materame: datanow.Material_Name, maternick: datanow.Material_Nick, matersp: datanow.Material_Specifications, matermea: datanow.Material_Measure, materid: datanow.F_Id };
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
                            console.log(showList)
                            for (var j = 0; j < showList.length; j++) {
                                var shownow = showList[j]
                                searchlist += '<li data-name="' + shownow.materame + '" data-nick="' + shownow.maternick + '" data-spe="' + shownow.matersp + '" data-materme="' + shownow.matermea + '" data-materid="' + shownow.materid + '"><p>' + shownow.materame + '</p><p>' + shownow.maternick + '</p><p>' + shownow.matersp + '</p></li>'
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

                                    var nick = $(this).attr("data-nick");
                                    var specife = $(this).attr("data-spe");
                                    var measure = $(this).attr("data-materme");
                                    var materid = $(this).attr("data-materid")
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
                                var name = $(this).attr("data-name");
                                var nick = $(this).attr("data-nick");
                                var specife = $(this).attr("data-spe");
                                var materid = $(this).attr("data-materid")
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
                })
            } else {
                $(".dateload").addClass("hidden")
                $(".datelist").removeClass("hidden")
            }
        }

        return false;
    })



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
                    console.log(res)
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
            console.log(res)
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
                        nick = '未命名'
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
    //保存工艺后更新工艺路线
    getcraft = function (checid) {
        $.ajax({
            type: "get",
            url: craftlist,
            success: function (res) {
                console.log(res)
                var isussecc = res.Succeed;
                var data = res.Data;
                if (isussecc) {
                    var html = '<option value="">全部</option>';
                    var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                    for (var i = 0; i < data.length; i++) {
                        var nowD = data[i];
                        var nick = '';
                        if (nowD.Craft_Nick) {
                            nick = nowD.Craft_Nick;
                        } else {
                            nick = '未命名'
                        }
                        html += '<option value="' + nowD.F_Id + '" >' + nick + '</option>';
                        htmlsel += '<dd lay-value="' + nowD.F_Id + '" >' + nick + '</dd>'

                    }
                    $("#Assign_Craft").html(html);
                    $(".checkcraft .layui-anim.layui-anim-upbit").html(htmlsel);
                    reloadform();
                    var select = 'dd[lay-value="' + checid + '"]';
                    $('#Assign_Craft').siblings("div.layui-form-select").find('dl').find(select).click();

                } else {
                    alert(res.Message)
                }

            }
        })
    }
    // BOM
    $(".checkbom").on("click", function () {
        var _this = $(this);
        var date = _this.attr("data-type");
        if (date == 'daten') {
            $(".checkbom").attr("data-type", "datey");
            $.ajax({
                type: "get",
                url: bomlist,
                success: function (res) {
                    console.log(res)
                    var isussecc = res.Succeed;
                    var data = res.Data;
                    if (isussecc) {
                        var html = '<option value="">全部</option>';
                        var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                        for (var i = 0; i < data.length; i++) {
                            html += '<option value="' + data[i].F_Id + '" >' + data[i].BillOfMaterial_Name + '</option>';
                            htmlsel += '<dd lay-value="' + data[i].F_Id + '" >' + data[i].BillOfMaterial_Name + '</dd>'
                        }
                        $("#Assign_BillOfMaterial").html(html);
                        $(".checkbom .layui-anim.layui-anim-upbit").html(htmlsel);
                        reloadform();
                        _this.find("select").next().find('.layui-select-title input').click();

                    } else {
                        alert(res.Message)
                    }

                }
            })
        }
    })

    // 切换客户订单号
    layui.form.on('select(cusorder)', function (data) {
        console.log(data)
        if (data.value) {
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
                    console.log(res)
                    var isussecc = res.Succeed;
                    var data = res.Data;
                    if (isussecc) {
                        $("#Assign_SalesOrderEntry").val(res.Data.F_Id)
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
        console.log(data)
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
        console.log(crafid)
        $(".sub").attr("data-craftid", crafid)
        if(id){
            $.ajax({
                type: "get",
                url: assignCraft + id,
                success: function (res) {
                    console.log(res)
                    var isussecc = res.Succeed;
                    var data = res.Data;
                    if (isussecc) {
                        if(res.Data.length>=1){
                            reloadcraft(data)
                        }else{
                            reloadcraft(craftdetail)
                        } 
                        $(".sub").attr("data-nick", data.Craft_Nick)
                        $(".sub").attr("data-name", data.Craft_Name)
                    } else {
                        alert(res.Message)
                    }
                }
            })
        }else{
            var datanul=[]
            reloadcraft(datanul)
        }
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
    $(".worktype").on("click", function () {
        var _this = $(this);
        var date = _this.attr("data-type");
        if (date == 'daten') {
            $(".worktype").attr("data-type", "datey");
            $.ajax({
                type: "get",
                url: ajaxAsstype,
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
                        $("#Assign_Type").html(html);
                        $(".worktype .layui-anim.layui-anim-upbit").html(htmlsel);
                        layui.use('form', function () {
                            var form = layui.form;
                            form.render();

                        });
                        _this.find("select").next().find('.layui-select-title input').click();

                    } else {
                        alert(res.Message)
                    }

                }
            })
        }
    })


})

function reloadform() {
    layui.use('form', function () {
        var form = layui.form;
        form.render()
    });
}


function getcraftone(id) {
    $.ajax({
        url: materCraft + id,
        success: function (res) {
            console.log(res)
            var isussecc = res.Succeed;
            if (isussecc) {
                if (res.Data) {
                    $("#assCraftid").val(res.F_Id)
                    craftdetail=res.Data.Details
                    var select = 'dd[lay-value="' + res.Data.F_Id + '"]';
                    $('#Assign_Craft').siblings("div.layui-form-select").find('dl').find(select).click();
                    newcraftdefalue(res.Data.Details)
                } else {
                    var select1 = 'dd[lay-value=""]';
                    $('#Assign_Craft').siblings("div.layui-form-select").find('dl').find(select1).click();
                }
            } else {
                alert(res.Message)
            }
        }
    })
}

// 创建工单工序
function newcraftdefalue(data){
    console.log(data)
    // 获取工单主键
    // $.ajax({
    //     url:getMain,
    //     success:function(res){
    //         console.log(res)
    //         var isussecc=res.Succeed;
    //         if(isussecc){
    //             $("#fid").val(res.Data)
    //             $.each(data,function(i,v){
    //                 var data={
    //                     AssignCraft_Nick:v.CraftEntry_Nick,
    //                     AssignCraft_Name:v.CraftEntry_Namem,
    //                     AssignCraft_Process:F_Id,
    //                     AssignCraft_Assign:res.Data
    //                 } 
    //                 $.ajax({
    //                     url:addassignCraft,
    //                     type:'POST',
    //                     success:function(result){
    //                         console.log(result);
    //                         if(result.Succeed){

    //                         }else{
    //                             alert(result.Message)
    //                         }
    //                     }
    //                 })   
    //             })
    //         }else{
    //             alert(res.Message)
    //         }
    //     }
    // })
}