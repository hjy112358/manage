
$(function () {
    $(".add").on("click", function () {
        $(".termask").removeClass("hidden");
        $(".editsave").addClass("hidden");
        $(".save").removeClass("hidden");
        $(".masktitle").html("新增物料类别");
        $(".addattr").html("添加类别属性");
        $("#tableRes1").addClass("hidden");
        $("#tableRes").removeClass("hidden");
        $("#Family_Name").val("");
        $("#Family_Nick").val("");
        $(document).on("click", function () {
            $("#tableRes .layui-table-body").addClass("overvis");
            $("#tableRes .layui-table-box").addClass("overvis");
            $("#tableRes .layui-table-view").addClass("overvis");
        })
        tablelist();

    })
    $(".cancel,.iconclose").on("click", function () {
        $(".termask").addClass("hidden");
        tablelist();
        var data = [];
        editablelist(data)
    })

    function renderForm() {
        layui.use('form', function () {
            var form = layui.form;
            form.render();
        });
    }

    var laydate;
    layui.use(['form', 'layedit', 'laydate', "jquery"], function () {
        var form = layui.form
            , layer = layui.layer
            , $ = layui.jquery;
        laydate = layui.laydate;

    });

    function tablerender(str, data) {
        layui.use(['jquery', 'table'], function () {
            var $ = layui.$,
                table = layui.table;
            table.render({
                elem: '#analy'

                , toolbar: true
                , cols: [str]
                , data: data
                , page: true
                , limits: [1000, 2000, 3000, 4000, 5000]
                , limit: 1000
            });

            table.on('rowDouble(analy)', function (obj) {
                console.log(obj)
                $(".termask").removeClass("hidden");
                $(".editsave").removeClass("hidden");
                $(".save").addClass("hidden");
                $("#tableRes").addClass("hidden");
                $("#tableRes1").removeClass("hidden");
                $(".editsave").removeClass("hidden");
                $(".masktitle").html("修改物料类别");
                $("#Family_Name").val(obj.data.Family_Name);
                $("#Family_Nick").val(obj.data.Family_Nick);
                var id = obj.data.F_Id;
                $(".editsave").attr("data-id", id)
                $.ajax({
                    type: "GET",
                    async: false,
                    url: materFlistone + '?keyword=' + id + '&PageIndex=&PageSize=',
                    // data:datas,
                    success: function (res) {
                        console.log(res)
                        var success = res.Succeed;
                        if (success) {
                            // $(".addattr").removeClass("addfirst");
                            // $(".addattr").addClass("editadd");
                            // $(".addattr").html("增加一行");
                            console.log(res)
                            var datalist = res.Data
                            editablelist(datalist);
                        } else {
                            alert(res.Message)
                        }
                    }
                })
            });
        })
    }
    $(".checklist").on("click", function () {
        var str = [
            { type: 'numbers', title: '序号', width: "5%" },
            //  {field:'id', title:'ID',   unresize: true, sort: true, totalRowText: '合计'}
            // {field:'FCheck', title:'类别',align:'center'},
            { field: 'Family_Name', title: '物料类别代码', align: 'center' },
            { field: 'Family_Nick', title: '物料类别名称', align: 'center' },
            {
                field: 'Measure_Id', title: '操作', align: 'center', templet: function (d) {
                    // return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.Family_Id + '" onclick=editmeasure("' + d.Family_Name + '","' + d.Family_Nick + '")><i class="layui-icon layui-icon-delete"></i>修改</a><a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.Family_Id + '" onclick=delmeasure("' + d.Family_Id + '")><i class="layui-icon layui-icon-delete"></i>移除</a>';
                    return '<a class="layui-btn layui-btn-xs layui-btn-danger"  onclick=delmeasure("' + d.F_Id + '")>删除</a>';
                }
            }

        ];

        $.ajax({
            async: false,
            url: materFlist,
            // data:datas,
            success: function (res) {

                tablerender(str, res.Data);

            }
        })

    })
    $(".checklist").trigger("click");

    var isSend = true;
    $(".save").on("click", function () {

        var name = $("#Family_Name").val();
        var nick = $("#Family_Nick").val();

        if (!name) {
            alert("请输入物料类别代码");
            isSend = false;
            return;
        } else if (!nick) {
            alert("请输入物料类别名称");
            isSend = false;
            return;
        } else {
            isSend = true;
        }
        if (tabledatalist && tabledatalist.length > 1) {
            for (var j = 0; j < tabledatalist.length; j++) {
                var tablelistnow = tabledatalist[j]
                if (!tablelistnow.FamilyEntry_Datatype) {
                    alert("请选择数据类型");
                    isSend = false;
                    return;
                } else if (!tablelistnow.FamilyEntry_Nick) {
                    alert("请输入类别属性名称");
                    isSend = false;
                    return;
                }
            }
        } else if (tabledatalist && tabledatalist.length == 1) {
            if (tabledatalist[0].FamilyEntry_Datatype && tabledatalist[0].FamilyEntry_Nick) {
                isSend = true;
            } else {
                if (!tabledatalist[0].FamilyEntry_Datatype) {
                    alert("请选择数据类型");
                    isSend = false;
                    return;
                } else if (!tabledatalist[0].FamilyEntry_Nick) {
                    alert("请输入类别属性名称");
                    isSend = false;
                    return;
                }
            }
        } else {
            isSend = true;
        }
        if (isSend) {
            // var id = new Date().valueOf();
            var data = {
                // F_Id: id,
                Family_Name: name,
                Family_Nick: nick,
                Details: tabledatalist
            }
            $.ajax({
                type: "POST",
                async: false,
                url: addmater,
                data: data,
                success: function (res) {

                    var isussecc = res.Succeed;
                    if (isussecc) {
                        $(".termask").addClass("hidden");
                        tablelist();
                        $(".checklist").trigger("click");
                        // window.location.reload()
                    } else {
                        alert(res.Message);
                    }

                }
            })

            // for (var k = 0; k < tabledatalist.length; k++) {
            //     var datanow = tabledatalist[k];
            //     var datai = k;
            //     var data = {
            //         FamilyEntry_Name: datanow.FamilyEntry_Name,
            //         FamilyEntry_Nick: datanow.FamilyEntry_Nick,
            //         FamilyEntry_Datatype: datanow.FamilyEntry_Datatype,
            //         FamilyEntry_Object: id
            //     }
            //     $.ajax({
            //         type: "POST",
            //         async: false,
            //         url: addmaterfamily,
            //         data: data,
            //         success: function (res) {
            //             console.log(JSON.parse(res))
            //             var isussecc = JSON.parse(res).Succeed;
            //             if (isussecc) {
            //                 if (datai == tabledatalist.length - 1) {
            //                     $(".termask").addClass("hidden");
            //                     // $(".checklist").trigger("click");
            //                     // tabledatalist=[];
            //                     window.location.reload()
            //                 }
            //             } else {
            //                 alert(JSON.parse(res).Message);
            //             }

            //         }
            //     })
            // }

        }


    })

    $(".editsave").on("click", function () {

        var id = $(".editsave").attr("data-id")
        var name = $("#Family_Name").val();
        var nick = $("#Family_Nick").val();
        if (!name) {
            alert("请输入物料类别代码");
            isSend = false;
            return;
        } else if (!nick) {
            alert("请输入物料类别名称");
            isSend = false;
            return;
        } else {
            isSend = true;
        }
        if (tabledatalist && tabledatalist.length > 1) {
            for (var j = 0; j < tabledatalist.length; j++) {
                var tablelistnow = tabledatalist[j]
                if (!tablelistnow.FamilyEntry_Datatype) {
                    alert("请选择数据类型");
                    isSend = false;
                    return;
                } else if (!tablelistnow.FamilyEntry_Nick) {
                    alert("请输入类别属性名称");
                    isSend = false;
                    return;
                }
            }
        } else if (tabledatalist && tabledatalist.length == 1) {
            if (tabledatalist[0].FamilyEntry_Datatype && tabledatalist[0].FamilyEntry_Nick) {
                isSend = true;
            } else {
                if (!tabledatalist[0].FamilyEntry_Datatype) {
                    alert("请选择数据类型");
                    isSend = false;
                    return;
                } else if (!tabledatalist[0].FamilyEntry_Nick) {
                    alert("请输入类别属性名称");
                    isSend = false;
                    return;
                }
            }
        } else {
            isSend = true;
        }
        if (isSend) {
            var data = {
                F_Id: id,
                Family_Name: name,
                Family_Nick: nick,
                Details: tabledatalist
            }
            $.ajax({
                type: "POST",
                async: false,
                url: editmater,
                data: data,
                success: function (res) {

                    var isussecc = res.Succeed;
                    if (isussecc) {
                        $(".termask").addClass("hidden");
                        window.location.reload();

                    } else {
                        alert(res.Message);
                    }
                }
            })
        }
    })
})


function delmeasure(id) {
    var index = layer.confirm('确认删除？', {
        btn: ['确定', '取消'] //按钮
    }, function () {

        var data = {
            F_Id: id
        }
        $.ajax({
            type: "POST",
            async: false,
            url: removemater,
            data: data,
            success: function (res) {

                var isussecc = res.Succeed;
                if (isussecc) {
                    layer.close(index)
                    $(".checklist").trigger("click");
                } else {
                    alert(res.Message)
                }

            }
        })
    });


}

function tablelist() {
    var viewObj = {
        tbData: [{
            tempId: new Date().valueOf(),
            FamilyEntry_Nick: '',
            FamilyEntry_Datatype: '',
            state: 0,
            datatypeText: ''
        }],
        limit: 1
    };

    //layui 模块化引用
    layui.use(['jquery', 'table', 'layer', "form", "layedit", "laydate"], function () {
        var $ = layui.$,
            table = layui.table,
            form = layui.form,
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate,
            element = layui.element;

        //数据表格实例化			
        var tbWidth = $("#tableRes").width();
        var layTableId = "layTable";
        var tableIns = table.render({
            elem: '#dataTable',
            id: layTableId,
            data: viewObj.tbData,
            // width: tbWidth,
            limit: viewObj.limit,
            height: 200,
            page: false,
            loading: true,
            even: false, //不开启隔行背景
            cols: [[
                { title: '序号', type: 'numbers' },
                { field: 'FamilyEntry_Nick', title: '类别属性名称', edit: 'text' },
                { field: 'FamilyEntry_Datatype', title: '数据类型', templet: "#selectattr" },
                {
                    field: 'tempId', title: '操作', templet: function (d) {
                        return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.tempId + '"><i class="layui-icon layui-icon-delete"></i>移除</a>';
                    }
                }
            ]],
            done: function (res, curr, count) {
                viewObj.tbData = res.data;
                tabledata = res.data;
                tabledatalist = res.data;
                $('#tableRes tr').each(function (e) {
                    var $cr = $(this);
                    var dataindex = $cr.attr("data-index");
                    $.each(tabledata, function (index, value) {
                        if (value.LAY_TABLE_INDEX == dataindex) {
                            $cr.find('input').val(value.datatypeText);
                            // $cr.find('input[name="FFetchDate"]').val(value.FFetchDate);
                        }
                    });
                });


            }
        });
        //定义事件集合
        var active = {
            addRow: function () {	//添加一行
                console.log("new")
                viewObj.limit = viewObj.limit + 1;
                var oldData = table.cache[layTableId];

                var newRow = { tempId: new Date().valueOf(), state: 0, FamilyEntry_Nick: '', FamilyEntry_Datatype: '', datatypeText: '' };
                oldData.push(newRow);
                tableIns.reload({
                    data: oldData,
                    limit: viewObj.limit
                });
            },
            updateRow: function (obj) {
                var oldData = table.cache[layTableId];

                for (var i = 0, row; i < oldData.length; i++) {
                    row = oldData[i];
                    var nowi = i;
                    if (row.tempId == obj.tempId) {
                        $.extend(oldData[i], obj);
                        return;
                    }


                }
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
                        oldData.splice(i, 1);    //删除一项
                    }
                    continue;
                }

                tableIns.reload({
                    data: oldData,
                    limit: viewObj.limit
                });
            },

            cancel: function () {
                $(".termask").addClass("hidden");
                tablelist();
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
                    viewObj.limit = viewObj.limit - 1;
                    layer.confirm('确定删除？', function (index) {
                        obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                        layer.close(index);
                        activeByType('removeEmptyTableCache');

                    });
                    break;
            }
        });

        form.on('select(datatype)', function (data, e) {
            var elem = data.othis.parents('tr');
            var dataindex = elem.attr("data-index");
            $.each(tabledata, function (index, value) {
                if (value.LAY_TABLE_INDEX == dataindex) {
                    value.FamilyEntry_Datatype = data.value;
                    var elems = data.elem;

                    for (var i = 0; i < elems.length; i++) {
                        var elemnow = elems[i];
                        if (elemnow.selected) {
                            value.FamilyEntry_Datatype = elemnow.value;
                            value.datatypeText = elemnow.innerText;
                        }
                    }
                    // if (value.tempId == viewObj.last && data.value != '') {
                    //     activeByType("add");
                    // } else {
                    //     var oldData = table.cache[layTableId];
                    //     tableIns.reload({
                    //         data: oldData,
                    //         limit: viewObj.limit
                    //     });
                    // }
                }
            });
        })
    });
}

function editablelist(datalist) {
    var viewObj1 = {
        tbData1: datalist,
        limit1: datalist.length
    };
    //layui 模块化引用
    layui.use(['jquery', 'table', 'layer', "form", "layedit", "laydate"], function () {
        var $ = layui.$,
            table = layui.table,
            form = layui.form,
            layer = layui.layer,
            layedit = layui.layedit,
            laydate = layui.laydate,
            element = layui.element;

        //数据表格实例化			
        var tbWidth = $("#tableRes1").width();
        var layTableId1 = "layTable";
        var tableIns1 = table.render({
            elem: '#dataTable1',
            id: layTableId1,
            data: viewObj1.tbData1,
            // width: tbWidth,
            limit: viewObj1.limit1,
            height: 200,
            page: false,
            loading: true,
            even: false, //不开启隔行背景
            cols: [[
                { title: '序号', type: 'numbers' },
                { field: 'FamilyEntry_Nick', title: '类别属性名称', edit: 'text' },
                { field: 'FamilyEntry_Datatype', title: '数据类型', templet: "#selectattr" },
                {
                    field: 'tempId', title: '操作', templet: function (d) {
                        return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.tempId + '"><i class="layui-icon layui-icon-delete"></i>移除</a>';
                    }
                }
            ]],
            done: function (res, curr, count) {
                var scrollHeight = $('#tableRes1 .layui-table-body.layui-table-main').prop("scrollHeight");
                $('#tableRes1 .layui-table-body.layui-table-main').animate({ scrollTop: scrollHeight }, 400);
                viewObj1.tbData1 = res.data;
                tabledata1 = res.data;
                tabledatalist = res.data;
                $('#tableRes1 tr').each(function (e) {
                    var $cr = $(this);
                    var dataindex = $cr.attr("data-index");
                    $.each(tabledata1, function (index, value) {
                        if (value.LAY_TABLE_INDEX == dataindex) {
                            if (value.datatypeText) {
                                $cr.find('input').val(value.datatypeText);
                            } else {
                                var val = ''
                                switch (value.FamilyEntry_Datatype) {
                                    case "NVarChar(50)":
                                        val = "文本";
                                        break;
                                    case "INT":
                                        val = "整数";
                                        break;
                                    case "Decimal(18,2)":
                                        val = "小数";
                                        break;
                                    case "DATETIME":
                                        val = "时间";
                                        break;
                                    default:
                                        val = value.FamilyEntry_Datatype;
                                        break
                                }
                                $cr.find('input').val(val);
                            }

                        }
                    });
                });
                $(".chooseterm .layui-table-view .layui-table td[data-field='FamilyEntry_Datatype']").on("click", function () {
                    var scrollHeight = $('#tableRes1 .layui-table-body.layui-table-main').prop("scrollHeight");
                    $('#tableRes1 .layui-table-body.layui-table-main').animate({ scrollTop: scrollHeight }, 600);
                })
            }
        });
        //定义事件集合
        var active = {
            addRow: function () {	//添加一行
                console.log(viewObj1)
                viewObj1.limit1 = viewObj1.limit1 + 1;
                var oldData = table.cache[layTableId1];
                var newRow = { tempId: new Date().valueOf(), state: 0, FamilyEntry_Nick: '', FamilyEntry_Datatype: '', datatypeText: '' };
                oldData.push(newRow);
                tableIns1.reload({
                    data: oldData,
                    limit: viewObj1.limit1
                });
            },
            updateRow: function (obj) {
                var oldData = table.cache[layTableId1];
                for (var i = 0, row; i < oldData.length; i++) {
                    row = oldData[i];
                    var nowi = i;
                    if (row.tempId == obj.tempId) {
                        $.extend(oldData[i], obj);
                        return;
                    }
                }
                tableIns1.reload({
                    data: oldData,
                    limit: viewObj1.limit1
                });
            },
            removeEmptyTableCache: function () {
                var oldData = table.cache[layTableId1];
                for (var i = 0, row; i < oldData.length; i++) {
                    row = oldData[i];
                    if (!row || !row.tempId) {
                        oldData.splice(i, 1);    //删除一项
                    }
                    continue;
                }
                tableIns1.reload({
                    data: oldData,
                    limit: viewObj1.limit1
                });
            },
            cancel: function () {
                $(".termask").addClass("hidden");
                tablelist();
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
        table.on('tool(datatype)', function (obj) {
            var data = obj.data, event = obj.event, tr = obj.tr; //获得当前行 tr 的DOM对象;
            switch (event) {
                case "state":
                    var stateVal = tr.find("input[name='state']").prop('checked') ? 1 : 0;
                    $.extend(obj.data, { 'state': stateVal })
                    activeByType('updateRow', obj.data);	//更新行记录对象
                    break;
                case "del":
                    viewObj1.limit1 = viewObj1.limit1 - 1;
                    layer.confirm('确定删除？', function (index) {
                        obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                        layer.close(index);
                        activeByType('removeEmptyTableCache');

                    });
                    break;
            }
        });

        form.on('select(datatype)', function (data, e) {
            var elem = data.othis.parents('tr');
            var dataindex = elem.attr("data-index");
            $.each(tabledata1, function (index, value) {
                if (value.LAY_TABLE_INDEX == dataindex) {
                    value.FamilyEntry_Datatype = data.value;
                    var elems = data.elem;
                    for (var i = 0; i < elems.length; i++) {
                        var elemnow = elems[i];
                        if (elemnow.selected) {
                            value.FamilyEntry_Datatype = elemnow.value;
                            value.datatypeText = elemnow.innerText;
                        }
                    }
                    // if (value.tempId == viewObj1.last1 && data.value != '') {
                    //     activeByType("add");
                    // } else {
                    //     var oldData = table.cache[layTableId1];
                    //     tableIns1.reload({
                    //         data: oldData,
                    //         limit: viewObj1.limit1
                    //     });
                    // }
                }
            });
        })
    });
}