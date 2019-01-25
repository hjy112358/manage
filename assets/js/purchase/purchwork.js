var myDate = new Date();
var nowY = myDate.getFullYear();
var nowM = myDate.getMonth() + 1;
var nowD = myDate.getDate();
var tody = nowY + "-" + (nowM < 10 ? "0" + nowM : nowM) + "-" + (nowD < 10 ? "0" + nowD : nowD);
//layui 模块化引用
var upload;
layui.use(['jquery', 'table', 'layer', "form", "layedit", "laydate", "upload"], function () {
    var $ = layui.$;
    table = layui.table,
        form = layui.form,
        layer = layui.layer,
        layedit = layui.layedit,
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
});


var dateslit = [];
var first = new Date().valueOf();
window.viewObj = {
    tbData: [{
        tempId: first,
        term: '',
        FQty: '',
        FNote: '',
        state: 0,
        FFetchDate: '',
        FMaterialName: '',
        Material_Nick: '',
        Material_Specifications: '',
        Material_Measure: ''
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
        even: true,
        cols: [[
            { title: '序号', type: 'numbers' },
            { field: 'term', title: '物料', templet: '#selectTool' },
            { field: 'FQty', title: '客户料号', edit: 'text' },
            { field: 'Material_Specifications', title: '规格型号', edit: 'text' },
            { field: 'Material_Measure', title: '单位', edit: 'text' },
            { field: 'FNote', title: '数量', edit: 'text' },
            { field: 'FNote', title: '单价', edit: 'text' },
            { field: 'FNote', title: '含税单价', edit: 'text' },
            { field: 'FNote', title: '金额', edit: 'text' },
            { field: 'FNote', title: '税率(%)', edit: 'text' },
            { field: 'FNote', title: '税额', edit: 'text' },
            { field: 'FNote', title: '价税合计', edit: 'text' },

            {
                field: 'FFetchDate', title: '交货日期', templet: function (d) {
                    return '<input type="text" name="FFetchDate" verify lay-verify="verify" value="' + (d.FFetchDate || '') + '" placeholder="请选择交货时间" readonly="readonly" class="layui-input layui-input-date"/>';
                }
            },
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
            prolist();
            $('tr').each(function (e) {
                var $cr = $(this);
                var dataindex = $cr.attr("data-index");
                $.each(tabledata, function (index, value) {
                    if (value.LAY_TABLE_INDEX == dataindex) {
                        $cr.find('input').val(value.term);
                        $cr.find('input[name="FFetchDate"]').val(value.FFetchDate);
                    }
                });
            });

            // $("#tablelist .layui-table-view .layui-table td[data-field='FMaterialName']").on("click", function () {
            //     console.log(1);
            //     var scrollHeight = $('#tableRes .layui-table-body.layui-table-main').prop("scrollHeight");
            //     $('#tableRes .layui-table-body.layui-table-main').animate({ scrollTop: scrollHeight }, 600);
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
            var newRow = { tempId: tid, term: "", FQty: "", date: "", FNote: "", state: 0, FMaterialName: '', Material_Nick: '', Material_Specifications: '', Material_Measure: '' };
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
            alert("请选择供应商");
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


    var token = $.cookie("token");



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
                        var html = '<option value="">选择供应商</option>';
                        var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">选择供应商</dd>'
                        for (var i = 0; i < data.length; i++) {
                            html += '<option value="' + ((data[i].FName).split("/")[0]) + '">' + data[i].FName + '</option>';
                            htmlsel += '<dd lay-value="' + ((data[i].FName).split("/")[0]) + '">' + data[i].FName + '</dd>'
                        }
                        $("#checkprobegin").html(html);
                        $(".checkpro .layui-anim.layui-anim-upbit").html(htmlsel);
                        renderForm();
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
                        var html = '<option value="">全部</option>';
                        var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                        for (var i = 0; i < data.length; i++) {
                            html += '<option value="' + ((data[i].FName).split("/")[0]) + '">' + data[i].FName + '</option>';
                            htmlsel += '<dd lay-value="' + ((data[i].FName).split("/")[0]) + '">' + data[i].FName + '</dd>'
                        }
                        $("#perbefore").html(html);
                        $(".checkper .layui-anim.layui-anim-upbit").html(htmlsel);
                        renderForm();
                        _this.find("select").next().find('.layui-select-title input').click();
                    } else {
                        alert(data.message)
                    }
                }
            })
        }
    })

    function renderForm() {
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


    $(document).on("click", function () {
        $("#tablelist .layui-table-body").addClass("overvis");
        $("#tablelist .layui-table-box").addClass("overvis");
        $("#tablelist .layui-table-view").addClass("overvis");
    })

    $(document).bind('click', function (event) {
        console.log(111)
        var evt = event.srcElement ? event.srcElement : event.target;
        if (!($(".selectlist").hasClass("hidden"))) {
            if (evt.id == 'checkmater') return; // 如果是元素本身，则返回
            else {
                $(".selectlist").addClass("hidden");
            }
        }
    });


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

    var htmlterm = '';
    var arrlist = [];
    var arri = {};
    function prolist(){
       
        $(".productworktable td[data-field='term']").each(function () {
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
                    $("#tableRes").find("tr").each(function(i,v){
                        var nowtr=v;
                        var nowindex=$(v).attr("data-index");
                        if(dataindex!=nowindex){
                            console.log($(nowtr).find("selectlist"))
                            // $(nowtr).find("selectlist").addClass("hidden")
                        }else{
                            $(nowtr).find(".selectlist").removeClass("hidden");
                            $(nowtr).find(".dateload").addClass("hidden")
                            $(nowtr).find(".datelist").removeClass("hidden")
                        }
                    });
    
                    $.ajax({
                        url: ajaxURl + '/Api/ApiService/Get/PSIMaterial_List?token=' + token,
                        success: function (res) {
                            $(".dateload").addClass("hidden")
                            $(".datelist").removeClass("hidden")
                            console.log(JSON.parse(res))
                            var data = JSON.parse(res).Data;
                            var isussecc = JSON.parse(res).Succeed;
    
                            // data[i].Material_Name data[i].Material_Nick  data[i].Material_Specification
                            for (var i = 0; i < data.length; i++) {
                                var datanow = data[i];
                                htmlterm += '<li data-name="' + datanow.Material_Name + '" data-nick="' + datanow.Material_Nick + '" data-spe="' + datanow.Material_Specifications + '" data-materme="' + datanow.Material_Measure + '"><p>' + datanow.Material_Name + '</p><p>' + datanow.Material_Nick + '</p><p>' + datanow.Material_Specifications + '</p></li>'
                                arri = { materame: datanow.Material_Name, maternick: datanow.Material_Nick, matersp: datanow.Material_Specifications, matermea: datanow.Material_Measure };
                                arrlist.push(arri)
                            }
                            $(".selectlist ul").html(htmlterm);
    
    
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
                                    searchlist += '<li data-name="' + shownow.materame + '" data-nick="' + shownow.maternick + '" data-spe="' + shownow.matersp + '" data-materme="' + shownow.matermea + '"><p>' + shownow.materame + '</p><p>' + shownow.maternick + '</p><p>' + shownow.matersp + '</p></li>'
                                }
                                if (showList.length == 0) {
                                    searchlist = '<div style="text-align:center;padding:15px 0">暂无数据</div>'
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
                                    console.log(oldData)
                                    var name = $(this).attr("data-name");
                                    var nick = $(this).attr("data-nick");
                                    var specife = $(this).attr("data-spe");
                                    var measure = $(this).attr("data-materme");
                                    $(".materName").val(name);
                                    $(".maternick").val(nick);
                                    $(".materspe").val(specife);
                                    $("#measure").val(measure);
                                    $.each(tabledata, function (index, value) {
                                        console.log(value)
                                        if (value.LAY_TABLE_INDEX == dataindex) {
                                            value.term = name;
                                            value.Material_Nick = nick
                                            value.Material_Specifications = specife;
                                            value.Material_Measure = measure
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
                    })
                } else {
                   
                   
                    $(".selectlist ul").html(htmlterm);
                    $("#tableRes").find("tr").each(function(i,v){
                        var nowtr=v;
                        var nowindex=$(v).attr("data-index");
                        if(dataindex!=nowindex){
                            console.log($(nowtr).find("selectlist"))
                            // $(nowtr).find("selectlist").addClass("hidden")
                        }else{
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
                            if (item.materame.indexOf(searchVal) != -1 || item.maternick.indexOf(searchVal) != -1 || item.matersp.indexOf(searchVal) != -1) {
                                showList.push(item);
                            } else {
    
                            }
                        })
                        console.log(showList)
                        for (var j = 0; j < showList.length; j++) {
                            var shownow = showList[j]
                            searchlist += '<li data-name="' + shownow.materame + '" data-nick="' + shownow.maternick + '" data-spe="' + shownow.matersp + '" data-materme="' + shownow.matermea + '"><p>' + shownow.materame + '</p><p>' + shownow.maternick + '</p><p>' + shownow.matersp + '</p></li>'
                        }
                        if (showList.length == 0) {
                            searchlist = '<div style="text-align:center;padding:15px 0">暂无数据</div>'
                        }
                        $(".selectlist ul").html("");
                        $(".selectlist ul").html(searchlist);
                        $("#tableRes").find("tr").each(function(i,v){
                            var nowtr=v;
                            var nowindex=$(v).attr("data-index");
                            if(dataindex!=nowindex){
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
                            console.log(oldData)
                            var name = $(this).attr("data-name");
                            var nick = $(this).attr("data-nick");
                            var specife = $(this).attr("data-spe");
                            var measure = $(this).attr("data-materme");
                            $(".materName").val(name);
                            $(".maternick").val(nick);
                            $(".materspe").val(specife);
                            $("#measure").val(measure);
                            $.each(tabledata, function (index, value) {
                                console.log(value)
                                if (value.LAY_TABLE_INDEX == dataindex) {
                                    value.term = name;
                                    value.Material_Nick = nick
                                    value.Material_Specifications = specife;
                                    value.Material_Measure = measure
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



});


