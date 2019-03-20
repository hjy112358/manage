var first = new Date().valueOf();
var materid=[],maternick=[],matername=[],loadlayer
window.viewObj = {
    tbData: [],
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
        upload = layui.upload
    //单据日期
    laydate.render({
        elem: '#date',
        // value: tody,
        isInitValue: true,
        btns: ['now', 'confirm']
    });
    //交货日期
    laydate.render({
        elem: '#PurchaseApply_Deadline',
        // value: tody,
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
            { field: 'Material_Name', title: '<span style="color:red">*  </span>物料代码', templet: '#selectTool', width: '120' },
            { field: 'Material_Nick', title: '物料名称', width: '200' },
            { field: 'PurchaseApplyEntry_Specifications', title: '规格型号', width: '100' },
            { field: 'PurchaseApplyEntry_Unit', title: '单位', width: '50', align: "center" },
            {
                field: 'PurchaseApplyEntry_Deadline', title: '<span style="color:red">*  </span>交货日期', width: '100', align: "center", templet: function (d) {
                    var deadlin="";
                    if(d.PurchaseApplyEntry_Deadline){
                        deadlin=d.PurchaseApplyEntry_Deadline.split(" ")[0]
                    }
                    return '<input type="text" id="PurchaseApplyEntry_Deadline" verify lay-verify="verify" value="' + deadlin + '"  autocomplete="off" class="layui-input layui-input-date"/>';
                }
            },
            { field: 'PurchaseApplyEntry_Quantity', title: '数量', width: '100', edit: 'text' },
            { field: 'PurchaseApplyEntry_Purchase', title: '已采购数量', width: '100'},
            { field: 'Remark', title: '备注', edit: 'text', width: '200' }
           
        ]],
        done: function (res, curr, count) {
            layer.close(loadlayer)
            viewObj.tbData = res.data;
            console.log(res.data)
            // prolist();
            $(".layui-input-date").each(function (i) {
                layui.laydate.render({
                    elem: this,
                    format: "yyyy-MM-dd",
                    done: function (value, date) {
                        if (res && res.data[i]) {
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
                        $cr.find('input[id="PurchaseApplyEntry_Deadline"]').val(value.PurchaseApplyEntry_Deadline.split(" ")[0]);
                    }
                });
            });
        }
    });

    //定义事件集合
    var active = {
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
                    oldData.splice(i, 1);    //删除一项
                }
                continue;
            }
            viewObj.last = oldData[oldData.length - 1].tempId;
            tableIns.reload({
                data: oldData,
                limit: oldData.length
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
        var data = obj.data, event = obj.event, tr = obj.tr; //获得当前行 tr 的DOM对象
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
    function renderForm() {
        layui.use('form', function () {
            var form = layui.form;
            form.render();
        });
    }
    //多文件列表示例
    var tablehead = $('#tablehead');
    var tablebody = $('#tablebody');
    var imgcount = 0;
    var headhtml = "<tr><th>文件名</th><th>大小</th><th>操作</th></tr>";
    var uploadListIns = upload.render({
        elem: '#testList',
        url: '/Api/PSIBase/FileInput/SetFile'
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
    $(document).on("click", "td[data-field='PurchaseApplyEntry_Currency']", function () {
        var scrollHeight = $('#tableRes .layui-table-body.layui-table-main').prop("scrollHeight");
        var height = $('#tableRes .layui-table-body.layui-table-main').height() + scrollHeight;
        $('#tableRes .layui-table-body.layui-table-main').css("height", height)
    })

    // 保存
    var isSend = true;
    $(".sub").on("click", function () {
        var list = $("form").serializeArray();
        var data={};
        var newdata=[];
        for(var j=0;j<list.length;j++){
            data[list[j].name]=list[j].value
        }
        var oldData = table.cache[layTableId];
        for (var j = 0; j < oldData.length; j++) {
            var nowdata = oldData[j]
            if (nowdata.PurchaseApplyEntry_Deadline) {
                if (nowdata.PurchaseApplyEntry_Deadline == '') {
                    alert("请选择交货日期");
                    isSend = false;
                    return;
                } else {
                    newdata.push(nowdata)
                }
            }
        }
        if (!($(this).hasClass("disclick"))) {
            if (isSend) {
                var index = layer.load();
                data.Details = newdata;
                $.ajax({
                    type: "POST",
                    url: purchaseedit,
                    data: data,
                    success: function (res) {
                        var isussecc = res.Succeed;
                        var data = res.Data;
                        if (isussecc) {
                            layer.close(index);
                            layer.msg("修改成功");
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


    var url = window.location.search;
    var fid = url.split("?")[1].split("=")[1]
    $.ajax({
        url: purchaseDetails + fid,
        success: function (res) {
            if (res.Succeed) {
                loadlayer = layer.load()
                var data = res.Data
                getdepart(data.PurchaseApply_Department)
                getbillemle(data.PurchaseApply_Biller, data.PurchaseApply_Employee)
                getmatelist(data.Details)
                $("#PurchaseApply_DateTime").val(data.PurchaseApply_DateTime.split(" ")[0])
                $("#PurchaseApply_Deadline").val(data.PurchaseApply_Deadline.split(" ")[0])
                $("#PurchaseApply_Reason").val(data.PurchaseApply_Reason)
                $("#F_Id").val(data.F_Id)
                $("#PurchaseApply_Name").val(data.PurchaseApply_Name)
                $("#Remark").val(data.Remark)
            }
        }
    })


    // 部门
    function getdepart(id) {
        $.ajax({
            type: "get",
            url: ajaxdepart,
            success: function (res) {
                var isussecc = res.Succeed;
                if (isussecc) {
                    var html = '<option value="">全部</option>';
                    var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                    var data = res.Data;
                    for (var i = 0; i < data.length; i++) {
                        for (var i = 0; i < data.length; i++) {
                            html += '<option value="' + data[i].F_Id + '" >' + data[i].Department_Nick + '</option>';
                            htmlsel += '<dd lay-value="' + data[i].F_Id + '" >' + data[i].Department_Nick + '</dd>'
                        }
                        $("#PurchaseApply_Department").html(html);
                        $(".depart .layui-anim.layui-anim-upbit").html(htmlsel);
                        renderForm();
                        var select = 'dd[lay-value="' + id + '"]';
                        $('#PurchaseApply_Department').siblings("div.layui-form-select").find('dl').find(select).click();
                    }

                } else {
                    alert(res.Message)
                }
            }
        })
    }

    // 制单人、申请人
    function getbillemle(bill, em) {
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
                        html += '<option value="' + datanow.F_Id + '" >' + data[i].User_Nick + '</option>';
                        htmlsel += '<dd lay-value="' + datanow.F_Id + '" >' + data[i].User_Nick + '</dd>'
                        $("#PurchaseApply_Employee").html(html);
                        $(".emploees .layui-anim.layui-anim-upbit").html(htmlsel);
                        renderForm();
                        var select = 'dd[lay-value="' + em + '"]';
                        $('#PurchaseApply_Employee').siblings("div.layui-form-select").find('dl').find(select).click();
                        if (bill == datanow.F_Id) {
                            $("#PurchaseApply_Biller").val(datanow.F_Id)
                            $("#PurchaseApply_Billername").val(datanow.User_Nick)
                        }
                    }
                } else {
                    alert(res.Message)
                }
            }
        })
    }

    function getmatelist(datalist) {
        $.ajax({
            type: "get",
            async: false,
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
                } else {
                    alert(res.Message)
                }
            }
        })
        var newdata = datalist
        for (var j = 0; j < newdata.length; j++) {
            var nowdata = newdata[j]
            var index = materid.indexOf(nowdata.PurchaseApplyEntry_Material)
            if (index != '-1') {
                nowdata.Material_Name = matername[index]
                nowdata.Material_Nick = maternick[index]
            }
        }
        tableIns.reload({
            data: newdata,
            limit: newdata.length
        });
    }

});



