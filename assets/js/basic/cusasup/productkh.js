//layui 模块化引用
layui.use(['jquery', 'table', 'layer', "form", "layedit", "laydate"], function () {
    var renderForm;
    var tableIns;
    var first = new Date().valueOf();
    var viewObj = {
        tbData: [{
            tempId: first,
            state: 0,
            Contact_Sort: '',
            Contact_Nick: '',
            Contact_Phone: '',
            Contact_Mobile: '',
            Contact_Fax: '',
            Contact_Fax: '',
            Contact_Message: '',
            Contact_Position: ''
        }],
        limit: 1,
        last: first
    };
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
        cols: [[
            { title: '序号', type: 'numbers',width:"60" },
            { field: 'Contact_Sort', title: '主联系人', type: 'radio' ,width:"80"},
            { field: 'Contact_Nick', title: '姓名', edit: 'text' ,width:"100"},
            { field: 'Contact_Sex', title: '性别', edit: 'text' ,width:"100"},
            { field: 'term3', title: '生日', edit: 'text',width:"100" },
            { field: 'Contact_Phone', title: '公司电话', edit: 'text',width:"150" },
            { field: 'Contact_Mobile', title: '手机号码', edit: 'text' ,width:"150" },
            { field: 'Contact_Fax', title: '传真', edit: 'text' ,width:"150" },
            { field: 'Contact_Fax', title: '电子邮件', edit: 'text' ,width:"150" },
            { field: 'Contact_Message', title: 'qq号码', edit: 'text' ,width:"150" },
            { field: 'Contact_Address', title: '地址', edit: 'text' ,width:"200" },
            { field: 'term10', title: '部门', edit: 'text' ,width:"150" },
            { field: 'Contact_Position', title: '职位', edit: 'text',width:"150"  },
            { field: 'Remark', title: '备注', edit: 'text',width:"200"  },
            {
                field: 'tempId', title: '操作', align: 'center',width:"100" , templet: function (d) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.tempId + '">删除</a>';
                }
            }
        ]],
        done: function (res, curr, count) {
            viewObj.tbData = res.data;
            viewObj.limit=res.data.length
        }
    });
    //定义事件集合
    var active = {
        add: function () {	//添加一行
            viewObj.limit = viewObj.limit + 1;
            var oldData = table.cache[layTableId];
            // console.log(oldData);
            var tid = new Date().valueOf();
            var newRow = { tempId: tid, state: 0, Contact_Sort: '', Contact_Nick: '', Contact_Phone: '', Contact_Mobile: '', Contact_Fax: '', Contact_Fax: '', Contact_Message: '', Contact_Position: '' };
            oldData.push(newRow);
            viewObj.last = tid;
            tableIns.reload({
                data: oldData,
                limit: viewObj.limit
            });
        },
        updateRow: function (obj) {
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
    table.on('edit(dataTable)', function (obj) {
        var oldData = table.cache[layTableId];

        // if (obj.data.tempId == viewObj.last) {
        //     activeByType("add");
        // }
        // tableIns.reload({
        //     data: oldData,
        //     limit: viewObj.limit
        // });
    });
   
    renderForm = function () {
        layui.use('form', function () {
            var form = layui.form;
            form.render();
        });
    }
    element.on('tab(filter)', function(data){
        var oldData = table.cache[layTableId1];
        if(data.index == 0) {
            tableIns.reload({
                data: oldData,
                limit: oldData.length
            });
        }
    });

    getcontract=function(){
        var contact = table.cache[layTableId];
        $.each(contact, function (i, value) {
            if (value.LAY_CHECKED) {
                value.Contact_Sort = 1
            }
        })
        return contact
    }
        
});

var layer;
//layui 模块化引用
layui.use(['jquery', 'table', 'layer', "form", "layedit", "laydate"], function () {
    var renderForm;
    var tableIns;
    var first = new Date().valueOf();
    var viewObj = {
        tbData: [{
            tempId: first,
            state: 0,
            CustomerMaterial_Name: '',
            CustomerMaterial_Nick: '',
            CustomerMaterial_Material: ''
        }],
        limit: 1,
        last: first
    };
    var $ = layui.$,
        form = layui.form,
        layedit = layui.layedit,
        laydate = layui.laydate,
        element = layui.element,
        table = layui.table;
        layer = layui.layer;
    //数据表格实例化	
    var layTableId1 = "layTable1";
    tableIns = table.render({
        elem: '#dataTable1',
        id: layTableId1,
        data: viewObj.tbData,
        limit: viewObj.limit,
        page: false,
        loading: true,
        // even: true,
        cols: [[
            { title: '序号', type: 'numbers' ,width:'60'},
            { field: 'CustomerMaterial_Name', title: '物料代码',templet: '#selectTool',width:'200'},
            { field: 'CustomerMaterial_Nick', title: '物料名称', edit: 'text' ,width:'200'},
            {
                field: 'tempId', title: '操作', align: 'center', width:'60',templet: function (d) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="delrow" lay-id="' + d.tempId + '">删除</a>';
                }
            }
        ]],
        done: function (res, curr, count) {
            viewObj.tbData = res.data;
            tabledata= res.data;
            prolist();
            $('tr').each(function (e) {
                var $cr = $(this);
                var dataindex = $cr.attr("data-index");
                $.each(tabledata, function (index, value) {
                    if (value.LAY_TABLE_INDEX == dataindex) {
                        $cr.find('input').val(value.CustomerMaterial_Name);
                   
                    }
                });
            });
        }
    });
    //定义事件集合
    var active = {
        addrow: function () {	//添加一行
            viewObj.limit = viewObj.limit + 1;
            var oldData = table.cache[layTableId1];
            // console.log(oldData);
            var tid = new Date().valueOf();
            var newRow = { tempId: tid, state: 0,  CustomerMaterial_Name: '',CustomerMaterial_Nick: '',CustomerMaterial_Material: '' };
            oldData.push(newRow);
            viewObj.last = tid;
            tableIns.reload({
                data: oldData,
                limit: viewObj.limit
            });
        },
        updateRow: function (obj) {
            var oldData = table.cache[layTableId1];
            // console.log(oldData);
            tableIns.reload({
                data: oldData,
                limit: viewObj.limit
            });
        },
        removeEmptyTableCache: function () {
            var oldData = table.cache[layTableId1];
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
    table.on('tool(dataTable1)', function (obj) {
        var data = obj.data, event = obj.event, tr = obj.tr; //获得当前行 tr 的DOM对象;
        switch (event) {
            case "state":
                var stateVal = tr.find("input[name='state']").prop('checked') ? 1 : 0;
                $.extend(obj.data, { 'state': stateVal })
                activeByType('updateRow', obj.data);	//更新行记录对象
                break;
            case "delrow":
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
        var oldData = table.cache[layTableId1];

        // if (obj.data.tempId == viewObj.last) {
        //     activeByType("add");
        // }
        // tableIns.reload({
        //     data: oldData,
        //     limit: viewObj.limit
        // });
    });
    var htmlterm = '';
    var arrlist = [];
    var arri = {};
    function prolist() {
        $(".cpmtable td[data-field='CustomerMaterial_Name']").each(function () {
            var curnow = $(this);
            curnow.on("click", function () {
                // console.log(1);
                var scrollHeight = $('#tablecpm .layui-table-body.layui-table-main').prop("scrollHeight");
                var height = $('#tablecpm .layui-table-body.layui-table-main').height() + scrollHeight + 300;
                $('#tablecpm .layui-table-body.layui-table-main').css("height", height)
                var _this = $(this);
                var dataindex = _this.parents("tr").attr("data-index");
                _this.find(".checkmater").addClass("layui-form-selected")
                var date = $(".cpmtable").attr("data-type");
                if (date == 'daten') {
                    $(".cpmtable").attr("data-type", "datey");
                    $("#tablecpm").find("tr").each(function (i, v) {
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
                            console.log(res)
                            $(".dateload").addClass("hidden")
                            $(".datelist").removeClass("hidden")
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
                                            var name = $(this).attr("data-name");
                                            var nick = $(this).attr("data-nick");    
                                            var marid = $(this).attr("data-materid")                                     
                                            $(".materName").val(name || '');                                          
                                            $.each(tabledata, function (index, value) {
                                                if (value.LAY_TABLE_INDEX == dataindex) {
                                                    value.CustomerMaterial_Name = name || "";
                                                    value.CustomerMaterial_Nick = nick || "";
                                                    value.CustomerMaterial_Material = marid || "";
                                                    var oldData = table.cache[layTableId1];
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
                                })
                                $('.selectlist1 ul').find('li').each(function () {
                                    var _this1 = $(this);
                                    _this1.hover(function () {
                                        $(this).addClass("active").siblings().removeClass("active")
                                    });
                                    _this1.on("click", function () {
                                        var name = $(this).attr("data-name");
                                        var nick = $(this).attr("data-nick");
                                        var marid = $(this).attr("data-materid")
                                        $(".materName").val(name || '');
                                        $.each(tabledata, function (index, value) {
                                            if (value.LAY_TABLE_INDEX == dataindex) {
                                                value.CustomerMaterial_Name = name || "";
                                                value.CustomerMaterial_Nick = nick || "";
                                                value.CustomerMaterial_Material = marid || "";
                                                var oldData = table.cache[layTableId1];
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
                            }else{
                                alert(res.Message)
                            }

                        }
                    })
                } else {
                    $(".selectlist1 ul").html(htmlterm);
                    $("#tablecpm").find("tr").each(function (i, v) {
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
                        $("#tablecpm").find("tr").each(function (i, v) {
                            var nowtr = v;
                            var nowindex = $(v).attr("data-index");
                            if (dataindex != nowindex) {
                                $(nowtr).find("selectlist1").addClass("hidden")
                            }
                        });
                        $('.selectlist1 ul').find('li').each(function () {
                            var _this1 = $(this);
                            _this1.hover(function () {
                                $(this).addClass("active").siblings().removeClass("active")
                            });
                            _this1.on("click", function () {
                                var name = $(this).attr("data-name");
                                var nick = $(this).attr("data-nick");
                                var marid = $(this).attr("data-materid")
                                $(".materName").val(name || '');
                                $.each(tabledata, function (index, value) {
                                    if (value.LAY_TABLE_INDEX == dataindex) {
                                        value.CustomerMaterial_Name = name || "";
                                        value.CustomerMaterial_Nick = nick || "";  
                                        value.CustomerMaterial_Material = marid || "";                                     
                                        var oldData = table.cache[layTableId1];
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

                    })
                    $('.selectlist1 ul').find('li').each(function () {
                        var _this1 = $(this);
                        _this1.hover(function () {
                            $(this).addClass("active").siblings().removeClass("active")
                        });
                        _this1.on("click", function () {
                            var name = $(this).attr("data-name");
                            var nick = $(this).attr("data-nick");
                            var marid = $(this).attr("data-materid")
                            $(".materName").val(name || '');
                            $.each(tabledata, function (index, value) {
                                // console.log(value)
                                if (value.LAY_TABLE_INDEX == dataindex) {
                                    value.CustomerMaterial_Name = name || "";
                                    value.CustomerMaterial_Nick = nick || "";
                                    value.CustomerMaterial_Material = marid || "";
                                    var oldData = table.cache[layTableId1];
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
                }
                return false;
            })


        })
    }

    renderForm = function () {
        layui.use('form', function () {
            var form = layui.form;
            form.render();
        });
    }
    element.on('tab(filter)', function(data){
        var oldData = table.cache[layTableId1];
        if(data.index == 1) {
            tableIns.reload({
                data: oldData,
                limit: oldData.length
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
                        limit: oldData.length
                    });
                    return;
                }

                else {
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


    getmater=function(){
        var materlist = table.cache[layTableId1]
        return materlist
    }
});

var getmater,getcontract
$(function(){
     // 保存
     $(".sub").on("click", function () {
        var cuslist = $("#customMsg").serializeArray()
        var data = {};
        for (var j = 0; j < cuslist.length; j++) {
            data[cuslist[j].name] = cuslist[j].value
        }
        // 地址信息
        var addresslist = []
        var addresdata = $("#addressMsg").serializeArray();
        var newaddresdata = {}
        $.each(addresdata, function (i, v) {
            newaddresdata[v.name] = v.value
        })
        addresslist.push(newaddresdata)
        // 财务信息
        var financelist = []
        var financedata = $("#financeMsg").serializeArray();
        var newfinancedata = {}
        $.each(financedata, function (i, v) {
            newfinancedata[v.name] = v.value
        })
        financelist.push(newfinancedata)
       

        var contact=getcontract()
        var materList=getmater()

        data.Contact = contact
        data.Address = addresslist
        data.Finance = financelist
        data.Material = materList
        console.log(data)
        var index = layer.load();
        $.ajax({
            url: ajaxCusadd,
            type: "post",
            data: data,
            success: function (res) {
                console.log(res)
                if (res.Succeed) {
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
    })
})