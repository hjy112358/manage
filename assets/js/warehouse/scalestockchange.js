var stocklist = [];
layui.use(['jquery', 'table', 'layer', "form", "layedit", "laydate"], function () {
    var $ = layui.$,
        form = layui.form,
        layedit = layui.layedit,
        laydate = layui.laydate,
        element = layui.element,
        table = layui.table,
        layer = layui.layer;

    var renderForm1, maternolist = [];
    var materid = [],
        maternick = [],
        matername = []
        
    var measureid = [],
        measurnick = [],
        stockid=[],
        stocknick=[]
        // 仓库
    $.ajax({
        type: 'GET',
        url: ajaxstocklist,
        success: function (res) {
            console.log(res)
            if(res.Succeed){
                $.each(res.Data, function (i, v) {
                    stocklist.push(v)
                    stockid.push(v.F_Id)
                    stocknick.push(v.Stock_Nick)
                })
            }
        }
    })
    window.viewObj = {
        tbData: [],
        limit: 1
    };

    var tableIns;
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
            [{
                    title: '序号',
                    type: 'numbers'
                },
                {
                    field: '',
                    title: '物料代码',
                    templet: function (d) {
                        if (d.StockBillEntry_Material) {
                            var index = materid.indexOf(d.StockBillEntry_Material)
                            if (index == '-1') {
                                return ''
                            } else {
                                return matername[index]
                            }
                        } else {
                            return ''
                        }
                    }
                },
                {
                    field: '',
                    title: '物料名称',
                    templet: function (d) {
                        if (d.StockBillEntry_Material) {
                            var index1 = materid.indexOf(d.StockBillEntry_Material)
                            if (index1 == '-1') {
                                return ''
                            } else {
                                return maternick[index1]
                            }
                        } else {
                            return ''
                        }
                    }
                },
                {
                    field: 'StockBillEntry_Specifications',
                    title: '规格型号'
                },
                // { field: 'term3', title: '辅助属性', edit: 'text' },
                {
                    field: 'StockBillEntry_Unit',
                    title: '计量单位'
                },
                {
                    field: 'StockBillEntry_BatchNo',
                    title: '批号'
                },
                {
                    field: 'StockBillEntry_Price',
                    title: '价格',
                    edit: 'text'
                },
                {
                    field: 'quatity',
                    title: '应发数量'
                },
                {
                    field: 'StockBillEntry_Quantity',
                    title: '实发数量',
                    edit: 'text'
                },
                {
                    field: 'StockBillEntry_Amount',
                    title: '总额'
                },
                {
                    field: 'StockBillEntry_Stock',
                    title: '仓库',
                    templet: '#selectstock'
                },
                {
                    field: 'Rmark',
                    title: '备注',
                    edit: 'text'
                }

            ]
        ],
        done: function (res, curr, count) {
            viewObj.tbData = res.data;
            var scrollHeight = $('#tableRes .layui-table-body.layui-table-main').prop("scrollHeight");
            $('#tableRes .layui-table-body.layui-table-main').animate({
                scrollTop: scrollHeight
            }, 400);


            tabledata = res.data;
            $('#tableRes tr').each(function (e) {
                var $cr = $(this);
                var dataindex = $cr.attr("data-index");
                $.each(tabledata, function (index, value) {
                    if (value.LAY_TABLE_INDEX == dataindex) {
                        var stock=''
                        var stockindex= stockid.indexOf(value.StockBillEntry_Stock)
                        if(stockindex!='-1'){
                            stock=stocknick[stockindex]
                        }
                       
                        $cr.find('td[data-field="StockBillEntry_Stock"]').find("input").val(stock);

                    }
                });
            });
            console.log(res.data)
            // $("#tablelist .layui-table-view .layui-table td[data-field='term']").on("click", function () {
            //     console.log(1);
            //     var scrollHeight = $('#tableRes .layui-table-body.layui-table-main').prop("scrollHeight");
            //     $('#tableRes .layui-table-body.layui-table-main').animate({ scrollTop: scrollHeight }, 400);
            // })


        }
    });
    //定义事件集合
    var active = {
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
        console.log('监听工具条');
        console.log(data);
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
        console.log(obj)
        var elem = obj.tr;
        var dataindex = elem.attr("data-index");
        $.each(tabledata, function (index, value) {
            console.log(value)
            if (value.LAY_TABLE_INDEX == dataindex) {
                if (obj.field == 'StockBillEntry_Quantity') {
                    if (!$.isNumeric(obj.value)) {
                        value.StockBillEntry_Quantity = parseInt(obj.value) || "";
                    } else {
                        if (value.StockBillEntry_Price) {
                            value.StockBillEntry_Amount = parseFloat(value.StockBillEntry_Quantity) * parseFloat(value.StockBillEntry_Price)
                            value.StockBillEntry_Amount = value.StockBillEntry_Amount.toFixed(2)
                        }
                    }
                } else if (obj.field == 'StockBillEntry_Price') {
                    if (value.StockBillEntry_Quantity) {
                        value.StockBillEntry_Amount = parseFloat(value.StockBillEntry_Quantity) * parseFloat(value.StockBillEntry_Price)
                        value.StockBillEntry_Amount = value.StockBillEntry_Amount.toFixed(2)
                    }
                }
            }
        });
        tableIns.reload({
            data: tabledata,
            limit: tabledata.length
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
    })


    // 物料
    $.ajax({
        url: ajaxMater,
        success: function (res) {
            var data = res.Data;
            var isussecc = res.Succeed;
            console.log(data)
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    materid.push(data[i].F_Id)
                    maternick.push(data[i].Material_Nick)
                    matername.push(data[i].Material_Name)
                }
                var oldData = table.cache[layTableId];
                tableIns.reload({
                    data: oldData,
                    limit: oldData.length
                });
            }

        }
    })
    

    // 计量单位
    // $.ajax({
    //     url: ajaxMea,
    //     success: function (res) {
    //         var data = res.Data;
    //         var isussecc = res.Succeed;
    //         console.log(data)
    //         if (isussecc) {
    //             for (var i = 0; i < data.length; i++) {
    //                 measureid.push(data[i].Measure_Manufacture)
    //                 measurnick.push(data[i].Measure_Nick)
    //             }
    //         }else{
    //             alert(res.Message)
    //         }
    //         var oldData = table.cache[layTableId];
    //         tableIns.reload({
    //             data: oldData,
    //             limit: oldData.length
    //         });

    //     }
    // })



   

    renderForm1 = function () {
        layui.use('form', function () {
            var form = layui.form;
            form.render();
            var oldData = table.cache[layTableId];
            tableIns.reload({
                data: oldData,
                limit: oldData.length
            });
        });
    }

    var url=window.location.search;
    var fid=url.split("?")[1].split("=")[1];
    $.ajax({
        url:ajaxstockbillone+fid,
        success:function(res){
            console.log(res)
            if(res.Succeed){
                var data=res.Data
                $("#StockBill_Name").val(data.StockBill_Name)
                getbill(data.StockBill_Sender,data.StockBill_Biller)
                getdepart(data.StockBill_Receiver)
                var datetime='';
                if(data.StockBill_DateTime){
                    datetime=data.StockBill_DateTime.split(" ")[0]
                }
                $("#StockBill_DateTime").val(datetime)
                $("#Rmark").val(data.Rmark)
                $("#F_Id").val(data.F_Id)
                tableIns.reload({
                    data: data.Details,
                    limit: data.Details.length
                });
              
                
            }
        }
    })
    
    function getbill(sender,bill){
        $.ajax({
            type: "get",
            url: ajaxUsr,
            success: function (res) {
                //console.log(res)
                var isussecc = res.Succeed;
                var data = res.Data;
                if (isussecc) {
                    var html = '<option value="">全部</option>';
                    var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                    for (var i = 0; i < data.length; i++) {
                        var datanow = data[i];
                        if (datanow.F_Id == bill) {
                            $("#StockBill_Billername").val(datanow.User_Nick)
                            $("#StockBill_Biller").val(bill)
                        }
                        
                        html += '<option value="' + datanow.F_Id + '">' + datanow.User_Nick + '</option>';
                        htmlsel += '<dd lay-value="' + datanow.F_Id + '" >' + datanow.User_Nick + '</dd>';
                    }
                    $("#StockBill_Sender").html(html);
                    $(".checkper .layui-anim.layui-anim-upbit").html(htmlsel);
                    renderForm1()
                    var select = 'dd[lay-value="' + sender + '"]';
                    $('#StockBill_Sender').siblings("div.layui-form-select").find('dl').find(select).click();
                } else {
                    alert(res.Message)
                }
            }
        })
    }

    function getdepart(id){
        // 部门
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
                    $("#department").html(html);
                    $(".checkdepart .layui-anim.layui-anim-upbit").html(htmlsel);
                    renderForm1();
                    var select = 'dd[lay-value="' + id + '"]';
                    $('#department').siblings("div.layui-form-select").find('dl').find(select).click();
                } else {
                    alert(res.Message)
                }
            }
        })
    }










    // 保存
    $(".sub").on("click", function () {
        var indexlay = layer.load();
        var formlist = $("form").serializeArray()
        var oldData = table.cache[layTableId];
        var data = {}
        for (var j = 0; j < formlist.length; j++) {
            data[formlist[j].name] = formlist[j].value
        }
        data.StockBill_Receiver = $("#department option:selected").val()
        data.Details = oldData
        console.log(data)
        $.ajax({
            type: "POST",
            url: editbill,
            data: data,
            success: function (res) {
                var isussecc = res.Succeed;
                if (isussecc) {
                    layer.close(indexlay);
                    layer.msg("修改成功");
                    setInterval(function () {
                        window.location.reload()
                    }, 1000)
                } else {
                    layer.close(indexlay);
                    alert(res.Message)
                }

            }
        })
        return false
    })

});


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