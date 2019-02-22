var dateslit1, tabledit,nedatalist,eddatalist,materdata;
var materid=[],maternick=[];
$(function () {


    $.ajax({
        url: processlist,
        success: function (res) {
            dateslit1 = res.Data
        }
    })
    $(".add").on("click", function () {
        $(".termask").removeClass("hidden");
        $("#tableRes1").addClass("hidden");
        $("#tableRes").removeClass("hidden");
        $(".editsave").addClass("hidden");
        $(".save").removeClass("hidden");
        $(".masktitle").html("新增工艺");
        $("#Craft_Name").val("");
        $("#Craft_Nick").val("");

        $(document).on("click", function () {
            $("#tableRes .layui-table-body").addClass("overvis");
            $("#tableRes .layui-table-box").addClass("overvis");
            $("#tableRes .layui-table-view").addClass("overvis");
        })


        tablerender1()

    })
    $(".cancel,.iconclose").on("click", function () {
        $(".termask").addClass("hidden");
        $(".termform")[0].reset()
    })


    //    列表
    function tablerender(str, data) {
        layui.use(['jquery', 'table', 'form'], function () {
            var $ = layui.$,
                table = layui.table,
                form = layui.form;
            table.render({
                elem: '#analy'
                , toolbar: true
                , cols: [str]
                , data: data
                , page: true
                , limits: [1000, 2000, 3000, 4000, 5000]
                , limit: 1000
            });

            // table.on('rowDouble(analy)', function (obj) {
            //     console.log(obj)
            //     parent.editmater(obj.data.Material_Name, obj.data.Material_Nick)
            // });

        })
    }
    // 新增
    function tablerender1() {
        var first = new Date().valueOf();
        window.viewObj = {
            tbData: [{
                tempId: first,
                state: 0,
                CraftEntry_Name: '',
                CraftEntry_Nick: '',
                IsEnabled: true
            }],
            limit: 1,
            last: first
        };
        layui.use(['jquery', 'table', "form"], function () {
            var $ = layui.$,
                table = layui.table,
                form = layui.form;
            var layTableId = "layTable";
            var tableIns = table.render({
                elem: '#dataTable',
                id: layTableId
                // , toolbar: true
                , cols: [[
                    { type: 'numbers', title: '序号' },
                    //  {field:'id', title:'ID',   unresize: true, sort: true, totalRowText: '合计'}
                    // {field:'FCheck', title:'类别',align:'center'},
                    { field: 'CraftEntry_Name', title: '工序代码', align: 'center', templet: "#selectcrp" },
                    { field: 'CraftEntry_Nick', title: '工序名称', align: 'center' },
                    {
                        field: 'F_Id', title: '操作', align: 'center', templet: function (d) {
                            return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.F_Id + '" >删除</a>';
                        }
                    }

                ]]
                , data: viewObj.tbData
                // , page: true
                // , limits: [1000, 2000, 3000, 4000, 5000]
                // , limit: 1000
                , done: function (res, curr, count) {
                    tabledata = res.data
                    nedatalist=res.data
                    viewObj.tbData = res.data;
                    $('#tableRes tr').each(function (e) {
                        var $cr = $(this);
                        var dataindex = $cr.attr("data-index");
                        $.each(tabledata, function (index, value) {
                            if (value.LAY_TABLE_INDEX == dataindex) {
                                $cr.find('input').val(value.CraftEntry_Name);
                            }
                        });
                    });
                }
            });

            // table.on('rowDouble(analy)', function (obj) {
            //     console.log(obj)
            //     parent.editmater(obj.data.Material_Name, obj.data.Material_Nick)
            // });

            //定义事件集合
            var active = {
                add: function () { //添加一行
                    viewObj.limit = viewObj.limit + 1;
                    var oldData = table.cache[layTableId];
                    var tid = new Date().valueOf();
                    var newRow = {
                        tempId: tid,
                        state: 0,
                        CraftEntry_Name: '',
                        CraftEntry_Nick: '',
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


            layui.form.on('select(CraftEntry_Nick)', function (data, e) {
                var elem = data.othis.parents('tr');
                var dataindex = elem.attr("data-index");
                $.each(tabledata, function (index, value) {
                    if (value.LAY_TABLE_INDEX == dataindex) {
                        value.CraftEntry_Name = data.value;
                        var elems = data.elem;
                        // console.log(elems)
                        for (var i = 0; i < elems.length; i++) {
                            var elemnow = elems[i];
                            if (elemnow.selected) {
                                value.CraftEntry_Name = elemnow.value;
                                value.CraftEntry_Nick = elemnow.innerText;
                            }
                        }

                        if (value.tempId == viewObj.last && data.value != '') {
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
            })


           





        })
    }

    tabledit = function (data, id) {

        window.viewObj1 = {
            tbData1: data,
            limit1: data.length,
            last1: id
        };

        layui.use(['jquery', 'table', "form"], function () {
            var $ = layui.$,
                table = layui.table,
                form = layui.form;
            var layTableId1 = "layTable1";
            var tableIns1 = table.render({
                elem: '#dataTable1',
                id: layTableId1
                // , toolbar: true
                , cols: [[
                    { type: 'numbers', title: '序号' },
                    //  {field:'id', title:'ID',   unresize: true, sort: true, totalRowText: '合计'}
                    // {field:'FCheck', title:'类别',align:'center'},
                    { field: 'CraftEntry_Name', title: '工序代码', align: 'center', templet: "#selectcrp" },
                    { field: 'CraftEntry_Nick', title: '工序名称', align: 'center' },
                    {
                        field: 'F_Id', title: '操作', align: 'center', templet: function (d) {
                            return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.F_Id + '" >删除</a>';
                        }
                    }

                ]]
                , data: viewObj1.tbData1
                // , page: true
                // , limits: [1000, 2000, 3000, 4000, 5000]
                // , limit: 1000
                , done: function (res, curr, count) {
                    tabledata1 = res.data
                    eddatalist=res.data
                    viewObj1.tbData1 = res.data;
                    $('#tableRes1 tr').each(function (e) {
                        var $cr = $(this);
                        var dataindex = $cr.attr("data-index");
                        $.each(tabledata1, function (index, value) {
                            if (value.LAY_TABLE_INDEX == dataindex) {
                                $cr.find('input').val(value.CraftEntry_Name);

                            }
                        });
                    });
                }
            });

            // table.on('rowDouble(analy)', function (obj) {
            //     console.log(obj)
            //     parent.editmater(obj.data.Material_Name, obj.data.Material_Nick)
            // });

            //定义事件集合
            var active = {
                add: function () { //添加一行
                    viewObj1.limit1 = viewObj1.limit1 + 1;
                    var oldData = table.cache[layTableId1];
                    var tid = new Date().valueOf();
                    var newRow = {
                        tempId: tid,
                        state: 0,
                        CraftEntry_Name: '',
                        CraftEntry_Nick: '',
                        IsEnabled: true
                    };
                    oldData.push(newRow);
                    viewObj1.last1 = tid;
                    tableIns1.reload({
                        data: oldData,
                        limit: viewObj1.limit1
                    });
                },
                updateRow: function (obj) {
                    var oldData = table.cache[layTableId1];

                    tableIns1.reload({
                        data: oldData,
                        limit: viewObj1.limit1
                    });
                },
                removeEmptyTableCache: function () {
                    var oldData = table.cache[layTableId1];

                    for (var i = 0, row; i < oldData.length; i++) {
                        row = oldData[i];
                        if (!row.F_Id && !row.tempId) {
                            oldData.splice(i, 1); //删除一项
                        }
                        continue;
                    }
                    viewObj1.last1 = oldData[oldData.length - 1].tempId;
                    tableIns1.reload({
                        data: oldData,
                        limit: viewObj1.limit1
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
                        if (viewObj1.limit1 == 1) {
                            alert("删除失败，至少应有一条数据")
                        } else {
                            console.log()
                            if (obj.data.F_Id) {
                                delone(obj.data.F_Id)
                            } else {
                                viewObj1.limit1 = viewObj1.limit1 - 1;
                                layer.confirm('确定删除？', function (index) {
                                    obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                                    layer.close(index);
                                    activeByType('removeEmptyTableCache');

                                });
                            }
                          

                        }
                        break;
                }
            });

            layui.form.on('select(CraftEntry_Nick)', function (data, e) {
                var elem = data.othis.parents('tr');
                var dataindex = elem.attr("data-index");
                $.each(tabledata1, function (index, value) {
                    if (value.LAY_TABLE_INDEX == dataindex) {
                        value.CraftEntry_Name = data.value;
                        var elems = data.elem;
                        // console.log(elems)
                        for (var i = 0; i < elems.length; i++) {
                            var elemnow = elems[i];
                            if (elemnow.selected) {
                                value.CraftEntry_Name = elemnow.value;
                                value.CraftEntry_Nick = elemnow.innerText;
                            }
                        }

                        if (value.tempId == viewObj1.last1 && data.value != '') {
                            activeByType("add");
                        } else {
                            var oldData = table.cache[layTableId1];
                            tableIns1.reload({
                                data: oldData,
                                limit: viewObj1.limit1
                            });
                        }
                    }
                });
            })

            function delone(id){
                $.ajax({
                    type: "POST",
                    async: false,
                    url: removeCraftety,
                    data: {
                        F_Id:id
                    },
                    success: function (res) {
                        console.log(res)
                        var isussecc = res.Succeed;
                        if (isussecc) {
                            var fid=$(".editsave").attr("data-Id")
                            $.ajax({
                                url: craftEnty + fid,
                                success: function (res) {
                                    console.log(res)
                                    var isussecc = res.Succeed;
                                    var data = res.Data;
                                    if (isussecc) {
                                       
                                        var tid = 'a' + new Date().valueOf();
                                        var newdata = [];
                                        var adddata = {
                                            tempId: tid,
                                            state: 0,
                                            CraftEntry_Name: '',
                                            CraftEntry_Nick: '',
                                            IsEnabled: true
                                        };
                        
                                        $.each(data.Details, function (i, v) {
                                            newdata.push(v)
                                        })
                                        newdata.push(adddata)
                                        viewObj1.limit1=newdata.length;
                                        viewObj1.tbData1= newdata,
                                        viewObj1.last1= tid
                                        tableIns1.reload({
                                            data: newdata,
                                            limit: newdata.length
                                        });
                                    } else {
                                        alert(res.Message)
                                    }
                        
                                }
                            })
                            
                           
                        } else {
                            alert(res.Message);
                        }

                    }
                })
            }

           



        })
    }

    // 物料
    $.ajax({
        type: "get",
        url: ajaxMater,
        success: function (res) {
            console.log(res)
            var isussecc = res.Succeed;
            if (isussecc) {
                var data = res.Data;
                materdata=data
                var html = '<option value="">全部</option>';
                var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                for (var i = 0; i < data.length; i++) {
                    var nowD = data[i];
                   
                    html += '<option value="' + nowD.F_Id + '" >' + nowD.Material_Nick + '</option>';
                    htmlsel += '<dd lay-value="' + nowD.F_Id + '" >' + nowD.Material_Nick + '</dd>'
                    materid.push(nowD.F_Id)
                    maternick.push(nowD.Material_Nick)
                }
                $("#Craft_Material").html(html);
                $(".matertype .layui-anim.layui-anim-upbit").html(htmlsel);
                layui.use('form', function () {
                    var form = layui.form;
                    form.render()
                });
                $(".checklist").trigger("click");

            } else {
                alert(res.Message)
            }

        }
    })

   
    $(".checklist").on("click", function () {
        var str = [
            { type: 'numbers', title: '序号', width: "5%" },
            //  {field:'id', title:'ID',   unresize: true, sort: true, totalRowText: '合计'}
            // {field:'FCheck', title:'类别',align:'center'},
            { field: 'Craft_Name', title: '工艺代码', align: 'center' },
            { field: 'Craft_Nick', title: '工艺名称', align: 'center' },
            { field: 'Craft_Material', title: '产品名称', align: 'center',templet:function(d){
                
                var index= materid.indexOf(d.Craft_Material)
                if (index == '-1') {
                    return ''
                } else {
                    return maternick[index]
                } 
            } },
            { field: 'IsEnabled', title: '启用', align: 'center',templet:function(d){
                if(d.IsEnabled==true){
                    return "是"
                }else{
                    return "否"
                }
            } },
            {
                field: 'F_Id', title: '操作', align: 'center', templet: function (d) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.F_Id + '" onclick=editmeasure("' + d.F_Id + '")>修改</a><a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.F_Id + '" onclick=delmeasure("' + d.F_Id + '")>删除</a>';
                }
            }

        ];

        $.ajax({
            type: "GET",
            async: false,
            url: craftlist,
            success: function (res) {
                console.log(res)
                tablerender(str, res.Data);

            }
        })

    })
    
   

    $(".save").on("click", function () {
        var name = $("#Craft_Name").val();
        var nick = $("#Craft_Nick").val();
        var mater=$("#Craft_Material option:selected").val();
        var IsEnabled=$("#IsEnabled option:selected").val();
        var newdata = [];
        $.each(nedatalist, function (i, v) {
            if (v.CraftEntry_Name) {
                newdata.push(v)
            }
        })
        var data = {
            Craft_Name: name,
            Craft_Nick: nick,
            Craft_Material:mater,
            IsEnabled:IsEnabled,
            Details: newdata
        }
        console.log(data)
        $.ajax({
            type: "POST",
            async: false,
            url: addCraft,
            data: data,
            success: function (res) {
                console.log(res)
                var isussecc = res.Succeed;
                if (isussecc) {
                    $(".termask").addClass("hidden");
                    $(".termform")[0].reset()
                    $(".checklist").trigger("click");
                } else {
                    $(".termform")[0].reset()
                    alert(res.Message);
                }

            }
        })
        return false
    })

    $(".editsave").on("click", function () {
        console.log(11)
        var name = $("#Craft_Name").val();
        var nick = $("#Craft_Nick").val();
        var id = $(".editsave").attr("data-id")
        var mater=$("#Craft_Material option:selected").val();
        var IsEnabled=$("#IsEnabled option:selected").val();
        var old=[]
        var mainid=$(".editsave").attr("data-Id")

        $.each(eddatalist, function (i, v) {
            if (v.CraftEntry_Name) {
                old.push(v)
            }
        })
        var data = {
            Craft_Name: name,
            Craft_Nick: nick,
            Craft_Material:mater,
            IsEnabled:IsEnabled,
            F_Id: id,
            Details: old
        }
        $.ajax({
            type: "POST",
            // async: false,
            url: editCraft,
            data: data,
            success: function (res) {
                console.log(res)
                var isussecc = res.Succeed;
                if (isussecc) {
                    $(".termask").addClass("hidden");
                    $(".termform")[0].reset()
                    $(".checklist").trigger("click");
                } else {
                    $(".termask").removeClass("hidden");
                    alert(res.Message);
                }

            }
        })
        return false
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
            url: removeCraft,
            data: data,
            success: function (res) {
                console.log(res)
                var isussecc = res.Succeed;
                if (isussecc) {
                    layer.close(index)
                    $(".checklist").trigger("click");
                } else {
                    alert(res.Message)
                }

            },
            error: function (res) {
                console.log(res)
            }
        })
    });


}

function editmeasure(id) {
    $(".termask").removeClass("hidden");
    $(".editsave").removeClass("hidden");
    $(".save").addClass("hidden");
    $(".masktitle").html("修改工艺");
    $("#tableRes").addClass("hidden");
    $("#tableRes1").removeClass("hidden");

    $.ajax({
        url: craftEnty + id,
        success: function (res) {
            console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data;
            if (isussecc) {
                $("#Craft_Name").val(data.Craft_Name);
                $("#Craft_Nick").val(data.Craft_Nick);
                var select = 'dd[lay-value="' + data.IsEnabled + '"]';
                $('#IsEnabled').siblings("div.layui-form-select").find('dl').find(select).click();
                var select1 = 'dd[lay-value="' + data.Craft_Material + '"]';
                $('#Craft_Material').siblings("div.layui-form-select").find('dl').find(select1).click();
                $(".editsave").attr("data-id", data.F_Id)
                $(".editsave").attr("data-Id", data.id)
                var id = 'a' + new Date().valueOf();
                var newdata = [];
                var adddata = {
                    tempId: id,
                    state: 0,
                    CraftEntry_Name: '',
                    CraftEntry_Nick: '',
                    IsEnabled: true
                };

                $.each(data.Details, function (i, v) {
                    newdata.push(v)
                })
                newdata.push(adddata)
                tabledit(newdata, id)
            } else {
                alert(res.Message)
            }

        }
    })
}
