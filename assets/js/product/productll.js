$(function () {
    
    var istrue = window.location.search.split("?")[1].split("=")[1];

    if (istrue == '1') {
        hasdatelist();
        console.log("领料")
    } else {
        noramllist()
    }
    layui.form.on('select(selecstyle)', function (data) {
        var sta = $(".taplist").attr("data-staut")
        if (sta == '1') {
            renderForm()
        } else {
            renderForm1()
        }
    })

    $("#addCraft").click(function () {
        $(".termask").removeClass("hidden")
    })

    $("#btncancel,.iconclose").click(function () {
        $(".termask").addClass("hidden")
    })



    $(document).on("click", function () {
        $("#tablelist .layui-table-body").addClass("overvis");
        $("#tablelist .layui-table-box").addClass("overvis");
        $("#tablelist .layui-table-view").addClass("overvis");
    })

    $("#tablelist1").on("click", function () {
        $("#tablelist1 .layui-table-body").addClass("overvis");
        $("#tablelist1 .layui-table-box").addClass("overvis");
        $("#tablelist1 .layui-table-view").addClass("overvis");
    })

})

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
    //日期
    laydate.render({
        elem: '#date',
        value: tody,
        isInitValue: true,
        btns: ['now', 'confirm']
    });
});




function noramllist() {


   
    var renderForm1;
    var first = new Date().valueOf();
    window.viewObj = {
        tbData: [{
            tempId: first,
            term: '',
            FQty: '',
            FNote: '',
            state: 0,
            FFetchDate: '',
            FMaterialName: ''
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
            cols: [[
                { title: '序号', type: 'numbers' },
                { field: 'term', title: '物料代码', templet: '#selectTool' },
                { field: 'Material_Nick', title: '物料名称' },
                { field: 'Material_Specifications', title: '规格型号' },
                { field: 'term3', title: '辅助属性', edit: 'text' },
                { field: 'Material_Measure', title: '计量单位' },
                { field: 'term5', title: '批号', edit: 'text' },
                { field: 'term6', title: '应发数量', edit: 'text' },
                { field: 'term6', title: '实发数量', edit: 'text' },
                { field: 'term7', title: '单价', edit: 'text' },
                { field: 'term8', title: '金额', edit: 'text' },
                { field: 'FNote', title: '备注', edit: 'text' },

                {
                    field: 'tempId', title: '操作', align: 'center', templet: function (d) {
                        return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.tempId + '"><i class="layui-icon layui-icon-delete"></i>移除</a>';
                    }
                }
            ]],
            done: function (res, curr, count) {
                viewObj.tbData = res.data;
                var scrollHeight = $('#tableRes .layui-table-body.layui-table-main').prop("scrollHeight");
                $('#tableRes .layui-table-body.layui-table-main').animate({ scrollTop: scrollHeight }, 400);
                $(".layui-input-date").each(function (i) {
                    layui.laydate.render({
                        elem: this,
                        format: "yyyy-MM-dd",
                        done: function (value, date) {
                            if (res && res.data[i]) {
                                $.extend(res.data[i], { 'FFetchDate': value })
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
                            $cr.find('input').val(value.term);
                            // $cr.find('input[name="FFetchDate"]').val(value.FFetchDate);
                        }
                    });
                });

                // $("#tablelist .layui-table-view .layui-table td[data-field='term']").on("click", function () {
                //     console.log(1);
                //     var scrollHeight = $('#tableRes .layui-table-body.layui-table-main').prop("scrollHeight");
                //     $('#tableRes .layui-table-body.layui-table-main').animate({ scrollTop: scrollHeight }, 400);
                // })


            }
        });


        //定义事件集合
        var active = {
            add: function () {	//添加一行
                viewObj.limit = viewObj.limit + 1;
                var oldData = table.cache[layTableId];
                // console.log(oldData);
                var tid = new Date().valueOf();
                var newRow = { tempId: tid, term: "", FQty: "", date: "", FNote: "", state: 0, FMaterialName: '' , Material_Nick:'',Material_Specifications:'',Material_Measure:''};
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
            console.log('监听工具条');
            console.log(data);
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
            // console.log(oldData)
            // if (!$.isNumeric(obj.value)) {
            //     for (var i = 0; i < oldData.length; i++) {
            //         var datenow = oldData[i];
            //         if (datenow.tempId === obj.data.tempId) {
            //             datenow.dates = "";
            //             layer.alert("请输入数字");
            //         }
            //     }
            // }
            // if (obj.data.tempId == viewObj.last) {
            //     activeByType("add");
            // }
            tableIns.reload({
                data: oldData,
                limit: viewObj.limit
            });
        });
        var isend = true;
        var savedate;
        var lastid;
        // 保存
        $(".sub").on("click", function () {
            lastid = viewObj.last;
            var checkprobegin = $("#checkprobegin").val();
            var perbefore = $("#perbefore").val();
            if (!checkprobegin) {
                alert("请选择客户");
                isend = false;
            } else if (!perbefore) {
                alert("请选择业务员");
                isend = false;
            } else {
                isend = true;
                for (var i = 0; i < oldData.length; i++) {
                    if (oldData[i].FMaterialName == '') {
                        if (oldData[i].tempId != viewObj.last) {
                            alert("物料不能为空");
                            isend = false;
                        } else {
                            isend = true;
                        }
                    }
                }
            }
            if (oldData[oldData.length - 1].FMaterialName == '') {
                var newD = oldData;
                newD.splice(newD.length - 1, 1);
            }
            // 单据编号
            var FBillNo = $("#FBillNo").val();
            // 制单员
            var zd = $("#zd").val();
            // 客户
            var FCustomName = $("#checkprobegin").val();
            //业务员
            var ywy = $("#perbefore").val();
            var datelist = {
                FBillNo: FBillNo,//单据编号
                zd: zd,//制单员
                FDate: $("#date").val(),//单据日期
                FCustomName: FCustomName,//客户
                yw: ywy,//业务员
                lsit: newD
            }
            //列表
            console.log(datelist)
            return false
        })
        // 审核
        $(".audit").on("click", function () {
            $(".sub").trigger("click");
            if (isend) {

            }
            return false
        })
        // 变更

        // 新增
        $(".add").on("click", function () {
            viewObj.limit = 1;
            tableIns.reload({
                data: viewObj.tbData,
                limit: viewObj.limit
            });
        })

        form.on('select(term)', function (data, e) {
            var elem = data.othis.parents('tr');
            var dataindex = elem.attr("data-index");
            
            $.each(tabledata, function (index, value) {
                if (value.LAY_TABLE_INDEX == dataindex) {
                    value.FMaterialName = data.value;
                        var elems = data.elem;
                        for (var i = 0; i < elems.length; i++) {
                            var elemnow = elems[i];
                            if (elemnow.selected) {
                                var name=$(elemnow.outerHTML).attr("data-name");
                                var nick=elemnow.text;
                                var materspe=$(elemnow.outerHTML).attr("data-materspe");
                                var materme=$(elemnow.outerHTML).attr("data-materme");
                                value.term = name;
                                value.Material_Nick=nick
                                value.Material_Specifications=materspe;
                                value.Material_Measure=materme
                            }
                        }
    
                    
    
                    if (value.tempId == viewObj.last && data.value != '') {
                        activeByType("add");
                    }else{
                        var oldData = table.cache[layTableId];
                        tableIns.reload({
                            data: oldData,
                            limit: viewObj.limit
                        });
                    }
                }
            });
        })
        var token = $.cookie("token");
        // 物料
        $.ajax({
            type: "POST",
            url:ajaxURl + '/Api/ApiService/Get/PSIMaterial_List?token=' + token,
            success: function (res) {
                var data = JSON.parse(res).Data;
                var isussecc = JSON.parse(res).Succeed;
                if (isussecc) {
                    for (var i = 0; i < data.length; i++) {
                        dateslit.push(data[i]);
                    }
                    var oldData = table.cache[layTableId];
                    tableIns.reload({
                        data: oldData,
                        limit: viewObj.limit
                    });
                }
            }
        })

        // 客户
        $(".checkpro").on("click", function () {
            var _this = $(this);
            var date = _this.attr("data-type");
            if (date == 'daten') {
                $(".checkpro").attr("data-type", "datey");
                var oldData = table.cache[layTableId];
                console.log(oldData)
                $.ajax({
                    type: "get",
                    url: ajaxUrl + "/ReceivePay/CustomList",
                    success: function (res) {
                        console.log(JSON.parse(res))
                        var data = JSON.parse(res).table;
                        var isussecc = JSON.parse(res).success;
                        if (isussecc) {
                            var html = '<option value="">请选择</option>';
                            var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">请选择</dd>'
                            for (var i = 0; i < data.length; i++) {
                                html += '<option value="' + ((data[i].FName).split("/")[0]) + '">' + data[i].FName + '</option>';
                                htmlsel += '<dd lay-value="' + ((data[i].FName).split("/")[0]) + '">' + data[i].FName + '</dd>'
                            }
                            $("#checkprobegin").html(html);
                            $(".checkpro .layui-anim.layui-anim-upbit").html(htmlsel);
                            renderForm1();
                            _this.find("select").next().find('.layui-select-title input').click();
                            console.log(oldData)
                        } else {
                            alert(data.message)
                        }
                    }
                })
            }
        })


        // 业务员
        $(".checkper").on("click", function () {
            var _this = $(this);
            var date = _this.attr("data-type");
            if (date == 'daten') {
                $(".checkper").attr("data-type", "datey");
                $.ajax({
                    type: "get",
                    url: ajaxUrl + "/ReceivePay/EmployeeList",
                    success: function (res) {
                        console.log(JSON.parse(res))
                        var isussecc = JSON.parse(res).success;
                        var data = JSON.parse(res).table;
                        if (isussecc) {
                            var html = '<option value="">请选择</option>';
                            var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">请选择</dd>'
                            for (var i = 0; i < data.length; i++) {
                                html += '<option value="' + ((data[i].FName).split("/")[0]) + '">' + data[i].FName + '</option>';
                                htmlsel += '<dd lay-value="' + ((data[i].FName).split("/")[0]) + '">' + data[i].FName + '</dd>'
                            }
                            $("#perbefore").html(html);
                            $(".checkper .layui-anim.layui-anim-upbit").html(htmlsel);
                            renderForm1();
                            _this.find("select").next().find('.layui-select-title input').click();
                        } else {
                            alert(data.message)
                        }
                    }
                })
            }
        })

        renderForm1 = function () {
            layui.use('form', function () {
                console.log("change22222wl")
                var form = layui.form;
                form.render();
                var oldData = table.cache[layTableId];
                console.log("wl")
                console.log(oldData)
                tableIns.reload({
                    data: oldData,
                    limit: viewObj.limit
                });
            });
        }



    });


}


var dateslit = [];
var token = $.cookie("token");
function hasdatelist() {
    var datalist=sessionStorage.getItem('wlist');
    sessionStorage.setItem('wlist',"");
    datalist=JSON.parse(datalist);
    console.log(datalist)
    var haslimit=datalist.length;
    var renderForm1;
    var first = datalist[datalist.length-1].tempId;
    window.viewObj1 = {
        tbData:datalist,
        limit: haslimit,
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
            data: viewObj1.tbData,
            limit: viewObj1.limit,
            page: false,
            loading: true,
            // even: true,
            cols: [[
                { title: '序号', type: 'numbers' },
                { field: 'term', title: '物料代码', templet: '#selectTool' },
                { field: 'Material_Nick', title: '物料名称' },
                { field: 'Material_Specifications', title: '规格型号' },
                { field: 'term3', title: '辅助属性', edit: 'text' },
                { field: 'Material_Measure', title: '计量单位' },
                { field: 'term5', title: '批号', edit: 'text' },
                { field: 'term6', title: '应发数量', edit: 'text' },
                { field: 'term6', title: '实发数量', edit: 'text' },
                { field: 'term10', title: '单价', edit: 'text' },
                { field: 'term11', title: '金额', edit: 'text' },
                { field: 'FNote', title: '备注', edit: 'text' },

                {
                    field: 'tempId', title: '操作', align: 'center', templet: function (d) {
                        return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.tempId + '"><i class="layui-icon layui-icon-delete"></i>移除</a>';
                    }
                }
            ]],
            done: function (res, curr, count) {
                viewObj1.tbData = res.data;
                var scrollHeight = $('#tableRes .layui-table-body.layui-table-main').prop("scrollHeight");
                $('#tableRes .layui-table-body.layui-table-main').animate({ scrollTop: scrollHeight }, 400);
                $(".layui-input-date").each(function (i) {
                    layui.laydate.render({
                        elem: this,
                        format: "yyyy-MM-dd",
                        done: function (value, date) {
                            if (res && res.data[i]) {
                                $.extend(res.data[i], { 'FFetchDate': value })
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
                            $cr.find('input').val(value.term);
                            // $cr.find('input[name="FFetchDate"]').val(value.FFetchDate);
                        }
                    });
                });

                // $("#tablelist .layui-table-view .layui-table td[data-field='term']").on("click", function () {
                //     console.log(1);
                //     var scrollHeight = $('#tableRes .layui-table-body.layui-table-main').prop("scrollHeight");
                //     $('#tableRes .layui-table-body.layui-table-main').animate({ scrollTop: scrollHeight }, 400);
                // })


            }
        });


        //定义事件集合
        var active = {
            add: function () {	//添加一行
                viewObj1.limit = viewObj1.limit + 1;
                var oldData = table.cache[layTableId];
                // console.log(oldData);
                var tid = new Date().valueOf();
                var newRow = { tempId: tid, term: "", FQty: "", date: "", FNote: "", state: 0, FMaterialName: '' , Material_Nick:'',Material_Specifications:'',Material_Measure:''};
                oldData.push(newRow);
                viewObj1.last = tid;
                tableIns.reload({
                    data: oldData,
                    limit: viewObj1.limit
                });
            },
            updateRow: function (obj) {
                var oldData = table.cache[layTableId];
                // console.log(oldData);
                tableIns.reload({
                    data: oldData,
                    limit: viewObj1.limit
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
                viewObj1.last = oldData[oldData.length - 1].tempId;
                tableIns.reload({
                    data: oldData,
                    limit: viewObj1.limit
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
            console.log('监听工具条');
            console.log(data);
            switch (event) {
                case "state":
                    var stateVal = tr.find("input[name='state']").prop('checked') ? 1 : 0;
                    $.extend(obj.data, { 'state': stateVal })
                    activeByType('updateRow', obj.data);	//更新行记录对象
                    break;
                case "del":
                    if (viewObj1.limit == 1) {
                        alert("删除失败，至少应有一条数据")
                    } else {
                        viewObj1.limit = viewObj1.limit - 1;
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
            // console.log(oldData)
            // if (!$.isNumeric(obj.value)) {
            //     for (var i = 0; i < oldData.length; i++) {
            //         var datenow = oldData[i];
            //         if (datenow.tempId === obj.data.tempId) {
            //             datenow.dates = "";
            //             layer.alert("请输入数字");
            //         }
            //     }
            // }
            // if (obj.data.tempId == viewObj.last) {
            //     activeByType("add");
            // }
            tableIns.reload({
                data: oldData,
                limit: viewObj1.limit
            });
        });
        var isend = true;
        var savedate;
        var lastid;
        // 保存
        $(".sub").on("click", function () {
            lastid = viewObj1.last;
            var checkprobegin = $("#checkprobegin").val();
            var perbefore = $("#perbefore").val();
            if (!checkprobegin) {
                alert("请选择客户");
                isend = false;
            } else if (!perbefore) {
                alert("请选择业务员");
                isend = false;
            } else {
                isend = true;
                for (var i = 0; i < oldData.length; i++) {
                    if (oldData[i].FMaterialName == '') {
                        if (oldData[i].tempId != viewObj1.last) {
                            alert("物料不能为空");
                            isend = false;
                        } else {
                            isend = true;
                        }
                    }
                }
            }
            if (oldData[oldData.length - 1].FMaterialName == '') {
                var newD = oldData;
                newD.splice(newD.length - 1, 1);
            }
            // 单据编号
            var FBillNo = $("#FBillNo").val();
            // 制单员
            var zd = $("#zd").val();
            // 客户
            var FCustomName = $("#checkprobegin").val();
            //业务员
            var ywy = $("#perbefore").val();
            var datelist = {
                FBillNo: FBillNo,//单据编号
                zd: zd,//制单员
                FDate: $("#date").val(),//单据日期
                FCustomName: FCustomName,//客户
                yw: ywy,//业务员
                lsit: newD
            }
            //列表
            console.log(datelist)
            return false
        })
        // 审核
        $(".audit").on("click", function () {
            $(".sub").trigger("click");
            if (isend) {

            }
            return false
        })
        // 变更

        // 新增
        $(".add").on("click", function () {
            viewObj1.limit = 1;
            tableIns.reload({
                data: viewObj1.tbData,
                limit: viewObj1.limit
            });
        })

       
    form.on('select(term)', function (data, e) {
        var elem = data.othis.parents('tr');
        var dataindex = elem.attr("data-index");
        
        $.each(tabledata, function (index, value) {
            if (value.LAY_TABLE_INDEX == dataindex) {
                value.FMaterialName = data.value;
                    var elems = data.elem;
                    for (var i = 0; i < elems.length; i++) {
                        var elemnow = elems[i];
                        if (elemnow.selected) {
                            var name=$(elemnow.outerHTML).attr("data-name");
                            var nick=elemnow.text;
                            var materspe=$(elemnow.outerHTML).attr("data-materspe");
                            var materme=$(elemnow.outerHTML).attr("data-materme");
                            value.term = name;
                            value.Material_Nick=nick
                            value.Material_Specifications=materspe;
                            value.Material_Measure=materme
                        }
                    }

                

                if (value.tempId == viewObj1.last && data.value != '') {
                    activeByType("add");
                }else{
                    var oldData = table.cache[layTableId];
                    tableIns.reload({
                        data: oldData,
                        limit: viewObj1.limit
                    });
                }
            }
        });
    })
        // 物料
        $.ajax({
            type: "POST",
            url: ajaxURl + '/Api/ApiService/Get/PSIMaterial_List?token=' + token,
            success: function (res) {
    
                var data = JSON.parse(res).Data;
                console.log(data)
                var isussecc = JSON.parse(res).Succeed;
                if (isussecc) {
                    for (var i = 0; i < data.length; i++) {
                        dateslit.push(data[i]);
                    }
                    console.log(dateslit)
                    var oldData = table.cache[layTableId];
                    tableIns.reload({
                        data: oldData,
                        limit: viewObj1.limit
                    });
                }
            }
        })

        // 客户
        $(".checkpro").on("click", function () {
            var _this = $(this);
            var date = _this.attr("data-type");
            if (date == 'daten') {
                $(".checkpro").attr("data-type", "datey");
                var oldData = table.cache[layTableId];
                console.log(oldData)
                $.ajax({
                    type: "get",
                    url: ajaxUrl + "/ReceivePay/CustomList",
                    success: function (res) {
                        console.log(JSON.parse(res))
                        var data = JSON.parse(res).table;
                        var isussecc = JSON.parse(res).success;
                        if (isussecc) {
                            var html = '<option value="">请选择</option>';
                            var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">请选择</dd>'
                            for (var i = 0; i < data.length; i++) {
                                html += '<option value="' + ((data[i].FName).split("/")[0]) + '">' + data[i].FName + '</option>';
                                htmlsel += '<dd lay-value="' + ((data[i].FName).split("/")[0]) + '">' + data[i].FName + '</dd>'
                            }
                            $("#checkprobegin").html(html);
                            $(".checkpro .layui-anim.layui-anim-upbit").html(htmlsel);
                            renderForm1();
                            _this.find("select").next().find('.layui-select-title input').click();
                            console.log(oldData)
                        } else {
                            alert(data.message)
                        }
                    }
                })
            }
        })


        // 业务员
        $(".checkper").on("click", function () {
            var _this = $(this);
            var date = _this.attr("data-type");
            if (date == 'daten') {
                $(".checkper").attr("data-type", "datey");
                $.ajax({
                    type: "get",
                    url: ajaxUrl + "/ReceivePay/EmployeeList",
                    success: function (res) {
                        console.log(JSON.parse(res))
                        var isussecc = JSON.parse(res).success;
                        var data = JSON.parse(res).table;
                        if (isussecc) {
                            var html = '<option value="">请选择</option>';
                            var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">请选择</dd>'
                            for (var i = 0; i < data.length; i++) {
                                html += '<option value="' + ((data[i].FName).split("/")[0]) + '">' + data[i].FName + '</option>';
                                htmlsel += '<dd lay-value="' + ((data[i].FName).split("/")[0]) + '">' + data[i].FName + '</dd>'
                            }
                            $("#perbefore").html(html);
                            $(".checkper .layui-anim.layui-anim-upbit").html(htmlsel);
                            renderForm1();
                            _this.find("select").next().find('.layui-select-title input').click();
                        } else {
                            alert(data.message)
                        }
                    }
                })
            }
        })

        renderForm1 = function () {
            layui.use('form', function () {
                
                var form = layui.form;
                form.render();
                var oldData = table.cache[layTableId];
              
                tableIns.reload({
                    data: oldData,
                    limit: viewObj1.limit
                });
            });
        }



    });


}











