
// 添加列表数据
var dataList = [];
var token = $.cookie("token");
// 记录id号
var currentId = [];
// 物料集合
var currentNike = [];
// 税率集合
var ratelAdd = [];
// 号码集合
var currentName = [];
// var first = new Date().valueOf();
// 数据源
var tData = [];
// var tempid = [];
var temip = [];
function getTid(i) {
    return (new Date().valueOf()) + i
}
for (var i = 0; i < 5; i++) {
    var k = i
    temip.push(getTid(k))
}


// 向下添加对应表头
for (var i = 0; i < 5; i++) {
    var data = {
        tempId: temip[i],
        state: 0,
        Material_Name: '',//物料编号
        Material_Nick: '',//物料名称
        PurchaseOrderEntry_Material: '',//物料id
        PurchaseOrderEntry_Specifications : '',//销售规格
        PurchaseOrderEntry_Unit: '',//单位
        PurchaseOrderEntry_Quantity: '',//数量    数量=未税金额/销售单价
        PurchaseOrderEntry_Price: '',//销售单价
        PurchaseOrderEntry_Amount: '',//未税金额 数量*销售单价
        PurchaseOrderEntry_TaxRate: "",//税率 
        PurchaseOrderEntry_Tax: "",//税额 PurchaseOrderEntry_Tax=PurchaseInvoiceEntry_Total-PurchaseInvoiceEntry_Amount
        PurchaseOrderEntry_TaxPrice: "",//含税单价 (税率  / 100 * 销售单价) + 销售单价
        PurchaseOrderEntry_Total: '',//价税合计  价税合计=未税金额*(1+税率/100)
        PurchaseOrderEntry_ExRate: '1',//汇率
        PurchaseOrderEntry_Deadline: "",//交货日期
        PurchaseOrderEntry_Project:'',//项目
    }
    tData.push(data);

}
window.viewObj = {
    tbData: tData,
    limit: 5,
    last: temip[4]
};
var tableIns;
var upload, table;
var layTableId;
//layui 模块化引用
layui.use(['jquery', 'table', 'layer', "form", "layedit", "laydate", "upload"], function () {
    // 获取当天日期
    var myDate = new Date();
    var nowY = myDate.getFullYear();
    var nowM = myDate.getMonth() + 1;
    var nowD = myDate.getDate();
    var today = nowY + "-" + (nowM < 10 ? "0" + nowM : nowM) + "-" + (nowD < 10 ? "0" + nowD : nowD);

    var $ = layui.$;
    table = layui.table,
        form = layui.form,
        layer = layui.layer,
        laydate = layui.laydate,
        upload = layui.upload,
        element = layui.element;
    //日期
    laydate.render({
        elem: '#date',
        value: today,
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
        cols: [[
            { title: '序号', type: 'numbers' },
            { field: 'Material_Name', title: '<span style="color:red">*  </span>物料', templet: '#selectTool', width: '120' },
            { field: 'Material_Nick', title: '客户料号', width: '200' },
            { field: 'PurchaseOrderEntry_Specifications', title: '规格' },
            { field: 'PurchaseOrderEntry_Unit', title: '计量单位' },
            { field: 'PurchaseOrderEntry_Name', title: '批号' },
            { field: 'PurchaseOrderEntry_Quantity', title: '数量' },
            { field: 'PurchaseOrderEntry_DateTime', title: '收货时间', edit: 'text' },
            { field: 'PurchaseOrderEntry_StartTime', title: '发货时间', templet: '#selectstock' },
            { field: 'PurchaseOrderEntry_Project', title: '项目', templet: '#selectstock' },
            { field: 'Rmark', title: '备注', edit: 'text' },
            {
                field: 'F_Id', title: '操作', align: 'center', templet: function (d) {
                    // return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.F_Id + '">删除</a>';
                    return '<a class="layui-btn layui-btn-xs layui-btn-danger" onclick=del("' + d.F_Id + '")>删除</a>';

                }
            }
        ]],
        done: function (res) {
            // console.log(res.data)
            viewObj.tbData = res.data;
           
            $(".layui-input-date").each(function (i) {
                layui.laydate.render({
                    elem: this,
                    format: "yyyy-MM-dd",
                    done: function (value, date) {
                        if (res && res.data[i]) {
                            console.log("up")
                            $.extend(res.data[i], { 'PurchaseOrderEntry_Deadline': value })
                        }
                    }
                });
            });
            tableData = res.data;
            $('tr').each(function (e) {
                var $cr = $(this);
                var dataIndex = $cr.attr("data-index");
                $.each(tableData, function (index, value) {
                    if (value.LAY_TABLE_INDEX == dataIndex) {
                        $cr.find('input').val(value.Material_Name);
                        $cr.find('input[id="PurchaseOrderEntry_Deadline"]').val(value.PurchaseOrderEntry_Deadline);

                    }
                });
            });


        }
    });


    //定义事件集合
    var active = {
        // 更新每行数据
        updateRow: function () {
            var oldData = table.cache[layTableId];
            // console.log(oldData);
            tableIns.reload({
                data: oldData,
                limit: viewObj.limit
            });
        },
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



    // 获取单据编号
    // $.ajax({
    //     url: getnum,
    //     success: function (res) {
    //         if (res.Succeed) {
    //             $("#PurchaseOrderEntry_Name").val(res.Data)
    //         } else {
    //             alert(res.Message)
    //         }
    //     }
    // })

    // 制单人
    var mouser = $.cookie("Modify_User");
    var username = $.cookie("User_Nick")
    $("#StockBill_Biller").val(mouser)
    $("#StockBill_Billername").val(username)

    // 供应商
    $(".supplier").on("click", function () {
        var _this = $(this);
        var date = _this.attr("data-type");
        if (date == 'daten') {
            $(".supplier").attr("data-type", "datey");
            $.ajax({
                type: "get",
                url:ajaxSupplier,
                success: function (res) {
                    var isussecc = res.Succeed;
                    var data = res.Data;
                    if (isussecc) {
                        var html = '<option value="">全部</option>';
                        var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                        for (var i = 0; i < data.length; i++) {
                            html += '<option value="' + data[i].F_Id + '" >' + data[i].Supplier_Nick + '</option>';
                            htmlsel += '<dd lay-value="' + data[i].F_Id + '" >' + data[i].Supplier_Nick + '</dd>'
                        }
                        $("#SupplierMaterial_Supplier").html(html);
                        $(".supplier .layui-anim.layui-anim-upbit").html(htmlsel);
                        renderForm();
                        _this.find("select").next().find('.layui-select-title input').click();
                    } else {
                        alert(res.Message)
                    }

                }
            })
        }
    })

    // 业务员
    $(".scalelists").on("click", function () {
        var _this = $(this);
        var date = _this.attr("data-type");
        if (date == 'daten') {
            $(".scalelists").attr("data-type", "datey");
            $.ajax({
                type: "get",
                url: ajaxUsr,
                success: function (res) {
                    // console.log(res)
                    var isussecc = res.Succeed;
                    var data = res.Data;
                    if (isussecc) {
                        var html = '<option value="">全部</option>';
                        var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                        for (var i = 0; i < data.length; i++) {
                            html += '<option value="' + data[i].F_Id + '">' + data[i].User_Nick + '</option>';
                            htmlsel += '<dd lay-value="' + data[i].F_Id + '">' + data[i].User_Nick + '</dd>'
                        }
                        $("#SalesOrder_Employee").html(html);
                        $(".scalelists .layui-anim.layui-anim-upbit").html(htmlsel);
                        renderForm();
                        _this.find("select").next().find('.layui-select-title input').click();
                    } else {
                        alert(res.Message)
                    }

                }
            })
        }
    })

    // 单号
    $(".checkid").on("click", function () {
        var _this = $(this);
        var date = _this.attr("data-type");
        if (date == 'daten') {
            $(".checkid").attr("data-type", "datey");
            $.ajax({
                type: "get",
                url: asslist,
                success: function (res) {
                    // console.log(res)
                    var isussecc = res.Succeed;
                    var data = res.Data;
                    if (isussecc) {
                        var html = '<option value="">全部</option>';
                        var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                        for (var i = 0; i < data.length; i++) {
                            html += '<option value="' + data[i].F_Id + '" >' + data[i].Assign_Name + '</option>';
                            htmlsel += '<dd lay-value="' + data[i].F_Id + '" >' + data[i].Assign_Name + '</dd>'
                        }
                        $("#order").html(html);
                        $(".checkid .layui-anim.layui-anim-upbit").html(htmlsel);
                        renderFormNext();
                        _this.find("select").next().find('.layui-select-title input').click();

                    } else {
                        alert(res.Message)
                    }

                }
            })
        }
    })

    // 切换订单号
    layui.form.on('select(changeorder)', function (data) {
        if (data.value != '') {
            $.ajax({
                type: "get",
                url: getassone + data.value,
                success: function (res) {
                    // console.log(res)
                    var isussecc = res.Succeed;
                    var data = res.Data;
                    if (isussecc) {
                        if (data.Children) {
                            // console.log(data.Children)
                            // 数据对应
                            $.each(data.Children, function (index, value) {
                                value.PurchaseOrderEntry_Specifications = value.AssignEntry_Specifications
                                value.PurchaseOrderEntry_Unit = value.AssignEntry_Unit
                                value.PurchaseOrderEntry_Material = value.AssignEntry_Material
                                value.PurchaseOrderEntry_Quantity = value.AssignEntry_Quantity
                                value.PurchaseOrderEntry_DateTime = value.AssignEntry_DateTime
                                value.PurchaseOrderEntry_StartTime = value.AssignEntry_StartTime
                                value.PurchaseOrderEntry_Project = value.AssignEntry_Project
                                value.Remark = value.Remark
                            })
                            tableIns.reload({
                                data: data.Children,
                                limit: data.Children.length
                            });
                        }

                    } else {
                        alert(res.Message)
                    }
                }
            })
        }
    })
    // 重选表格渲染
    renderFormNext = function () {
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

        // 制单人
    var mouser = $.cookie("Modify_User");
    var username = $.cookie("User_Nick")
    $("#PurchaseApply_Biller").val(mouser)
    $("#PurchaseApply_Billername").val(username)
    // // 申请人
    // var mouser = $.cookie("Modify_User");
    // var username = $.cookie("Employee_Nick")
    // $("#PurchaseApply_Employee").val(mouser)
    // $("#PurchaseApply_Employeename").val(username)
    // // 单据日期
    // var mouser = $.cookie("Modify_User");
    // var username = $.cookie("PurchaseApply_DateTime")
    // $("#PurchaseApply_DateTime").val(mouser)
    // $("#PurchaseApply_DateTimename").val(username)
    // // 单据状态
    // var mouser = $.cookie("Modify_User");
    // var username = $.cookie("DictionaryItem_Nick")
    // $("#PurchaseApply_Status").val(mouser)
    // $("#PurchaseApply_Statusname").val(username)


    // 保存
    $(".sub").on("click", function () {
        var list = $("form").serializeArray();
        var oldData = table.cache[layTableId];
        list.Details = oldData;
        if (!($(this).hasClass("audit"))) {
            var index = layer.load();
            $.ajax({
                type: "POST",
                url: purchaseOrderListAdd,
                data: list,
                success: function (res) {
                    // console.log(res)
                    var isussecc = res.Succeed;
                    var data = res.Data;
                    if (isussecc) {
                        layer.close(index);
                        layer.msg("保存成功");
                        setInterval(function () {
                            window.location.reload()
                        }, 1000)
                    } else {
                        layer.close(index);
                    }
                }
            })
        }
    })
});
     //多文件上传列表示例
     var tablehead = $('#tablehead');
     var tablebody = $('#tablebody');
     var imgcount = 0;
     var headhtml = "<tr><th>文件名</th><th>大小</th><th>操作</th></tr>";
     var uploadListIns = upload.render({
         elem: '#testList',
         url:'/Api/PSIBase/FileInput/SetFile'        
         , accept: 'file'
         , multiple: true
         , auto: false
         , bindAction: '#testListAction'
         , choose: function (obj) {
            //将每次选择的文件追加到文件队列
             var files = this.files = obj.pushFile(); 
             tablehead.html(headhtml)
             //读取本地文件 可多次追加
             obj.preview(function (index, file) {
                 imgcount++;
                 var tr = $(['<tr id="upload-' + index + '">'
                     , '<td>' + file.name + '</td>'
                     , '<td class="textc">' + (file.size / 1014).toFixed(1) + 'kb</td>'
                     , '<td class="textc">'
                     , '<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>'
                     , '</td>'
                     , '</tr>'].join(''));
                 //删除选中
                 tr.find('.demo-delete').on('click', function () {
                     //删除对应的文件
                     delete files[index]; 
                     tr.remove();
                     //清空，以免删除后出现同名文件不可选
                     uploadListIns.config.elem.next()[0].value = ''; 
                     imgcount--;
                     if (imgcount == 0) {
                         tablehead.html("")
                     }
 
                 });
                // 上传文件到列表
                 tablebody.append(tr);
             });
         }
 
     });

    //  渲染表格
    $(function () {
        $(document).on("click", function () {
            $("#tableRes .layui-table-body").addClass("overvis");
            $("#tableRes .layui-table-box").addClass("overvis");
            $("#tableRes .layui-table-view").addClass("overvis");
        })
        $("#tablelist").on("click", function () {
            $("#tablelist .layui-table-body").addClass("overvis");
            $("#tablelist .layui-table-box").addClass("overvis");
            $("#tablelist .layui-table-view").addClass("overvis");
        })
    })


     // 删除
     function del(id) {
        var index = layer.confirm('确认删除这条数据？', {
            btn: ['确定', '取消']
        }, function () {
            var token = $.cookie("token");
            $.ajax({
                type: "POST",
                async: false,
                url:removecraftlist,
                data: {
                    F_Id: id
                },
                success: function (res) {
                    var data = res.Data;
                    console.log(data)
                    var succeed = res.Succeed;
                    if (succeed) {
                        layer.close(index)
                    } else {
                        layer.close(index)
                        alert(res.Message)
                    }
                }
            })
        }); 
    }
