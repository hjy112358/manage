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
        elem: '#StockBill_DateTime',
        // value: tody,
        isInitValue: true,
        btns: ['now', 'confirm']
    });
});
// 物料
$.ajax({
    url: ajaxMater,
    success: function (res) {
        var data = res.Data;
        var isussecc = res.Succeed;
        // console.log(data)
        if (isussecc) {
            for (var i = 0; i < data.length; i++) {
                materid.push(data[i].F_Id)
                maternick.push(data[i].Material_Nick)
                matername.push(data[i].Material_Name)
                materspe.push(data[i].Material_Specifications)
            }
        }
    }
})
// 仓库
$.ajax({
    type:'GET',
    url: ajaxstocklist,
    success: function (res) {
    //    console.log(res)
       $.each(res.Data,function(i,v){
        stocklist.push(v)
       })
    }
})
// 计量单位
$.ajax({
    url: ajaxMea,
    success: function (res) {
        var data = res.Data;
        var isussecc = res.Succeed;
        // console.log(data)
        if (isussecc) {
            for (var i = 0; i < data.length; i++) {
                measureid.push(data[i].Measure_Manufacture)  
                measurnick.push(data[i].Measure_Nick)
               
            }
        }
    }
})
var materid = [], maternick = [], matername = [],materspe=[],stocklist=[]
var measureid=[],measurnick=[],supperid=[],suppernick=[];
var renderForm1;
window.viewObj = {
    tbData: [],
    limit: 1
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
            { field: '', title: '物料代码' , templet: function (d) {
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
            }},
            { field: '', title: '物料名称',  templet: function (d) {
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
            }},
            { field: 'StockBillEntry_Specifications', title: '规格型号' },
            { field: 'StockBillEntry_BatchNo', title: '批号'},
            { field: 'unit', title: '计量单位', templet: function (d) {
                if (d.StockBillEntry_Unit) {
                    var index2 = measureid.indexOf(d.StockBillEntry_Unit)
                    if (index2 == '-1') {
                        return ''
                    } else {
                        return measurnick[index2]
                    }
                } else {
                    return ''
                }
            }},
            { field: 'StockBillEntry_Price', title: '价格', edit: 'text'  },
            { field: 'quatity', title: '应收数量'},
            { field: 'StockBillEntry_Quantity', title: '实收数量', edit: 'text' },
            { field: 'StockBillEntry_Amount', title: '总额'},
            { field: 'StockBillEntry_Stock', title: '收货仓库',templet:'#selectstock' },
            { field: 'Rmark', title: '备注', edit: 'text' }

            // {
            //     field: 'F_Id', title: '操作', align: 'center', templet: function (d) {
            //         return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.F_Id + '">删除</a>';
            //     }
            // }
        ]],
        done: function (res, curr, count) {
            viewObj.tbData = res.data;
            var scrollHeight = $('#tableRes .layui-table-body.layui-table-main').prop("scrollHeight");
            $('#tableRes .layui-table-body.layui-table-main').animate({ scrollTop: scrollHeight }, 400);
            tabledata = res.data;
            $('#tableRes tr').each(function (e) {
                var $cr = $(this);
                var dataindex = $cr.attr("data-index");
                $.each(tabledata, function (index, value) {
                    if (value.LAY_TABLE_INDEX == dataindex) {
                        $cr.find('input').val(value.stock);
                        var select = 'dd[lay-value="' + value.StockBillEntry_Stock + '"]';
                        $cr.find('td[data-field="StockBillEntry_Stock"]').find("div.layui-form-select").find('dl').find(select).click();
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

    table.on('edit(dataTable)', function (obj) {
        var oldData = table.cache[layTableId];
        // console.log(obj)
        for (var i = 0; i < oldData.length; i++) {
            var datenow = oldData[i];
            if (datenow.F_Id === obj.data.F_Id) {
                if(obj.field=='StockBillEntry_Quantity'){
                    if (!$.isNumeric(obj.value)){
                        datenow.StockBillEntry_Quantity = parseInt(obj.value);
                    }else{
                        if(datenow.StockBillEntry_Price){
                            datenow.StockBillEntry_Amount=parseFloat(datenow.StockBillEntry_Quantity)*parseFloat(datenow.StockBillEntry_Price)
                            datenow.StockBillEntry_Amount=datenow.StockBillEntry_Amount.toFixed(2)
                        }
                    }
                }else if(obj.field=='StockBillEntry_Price'){
                    if(datenow.StockBillEntry_Quantity){
                        datenow.StockBillEntry_Amount=parseFloat(datenow.StockBillEntry_Quantity)*parseFloat(datenow.StockBillEntry_Price)
                        datenow.StockBillEntry_Amount=datenow.StockBillEntry_Amount.toFixed(2)
                    }
                }
                
            }
        }
        tableIns.reload({
            data: oldData,
            limit:  oldData.length
        });
    });


   


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

    // 保存
    $(".sub").on("click", function () {
        var indexlay=layer.load();
        var formlist=$("form").serializeArray()
        var oldData = table.cache[layTableId];
        var data = {}
        for (var j = 0; j < formlist.length; j++) {
            data[formlist[j].name] = formlist[j].value
        }
      
        data.Details=oldData
        console.log(data)
        $.ajax({
            type:"POST",
            url:editbill,
            data:data,
            success:function(res){
               if(res.Succeed){
                layer.close(indexlay);
                layer.msg("修改成功");
                setInterval(function () {
                    window.location.reload()
                }, 1000) 
               }else{
                layer.close(indexlay);
                   alert(res.Message)
               }
            }
        })
        return false
    })
});

$(function(){
    var url=window.location.search;
    var fid=url.split("?")[1].split("=")[1];
    $("#F_Id").val(fid)
    $.ajax({
        url:ajaxstockbillone+fid,
        success:function(res){
            if(res.Succeed){
                var data=res.Data;
                $("#StockBill_Name").val(data.StockBill_Name)
                $("#Rmark").val(data.Rmark)
                $("#StockBill_DateTime").val(data.StockBill_DateTime.split(" ")[0])
                getper(data.StockBill_Biller,data.StockBill_Receiver)
                getsupp(data.StockBill_Sender)
                $.each(data.Details,function(i,v){
                    var index = measurnick.indexOf(v.AssignEntry_Unit)
                    if (index != '-1') {
                        v.StockBillEntry_Unit=measureid[index]
                        v.unit=measurnick[index]
                    } 
                })
                tableIns.reload({
                    data: data.Details,
                    limit: data.Details.length
                });
                
            }
        }
    })
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



function getper(biller,receive){
    $.ajax({
        type: "get",
        url: ajaxUsr,
        success: function (res) {
            console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data;
            if (isussecc) {
                var html = '<option value="">全部</option>';
                var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i]
                    html += '<option value="' + datanow.F_Id + '" >' + datanow.User_Nick + '</option>';
                    htmlsel += '<dd lay-value="' + datanow.F_Id + '" >' + datanow.User_Nick + '</dd>'
                    if (datanow.F_Id == biller) {
                        $("#StockBill_Billername").val(datanow.User_Nick)
                    }
                    $("#StockBill_Receiver").html(html);
                    $(".checkper .layui-anim.layui-anim-upbit").html(htmlsel);
                    renderForm1();
                    var select = 'dd[lay-value="' + receive + '"]';
                    $('#StockBill_Receiver').siblings("div.layui-form-select").find('dl').find(select).click();
                   
                }  
            } else {
                alert(res.Message)
            }
        }
    })
}

function getsupp(sender){
    $.ajax({
        type: "get",
        url: ajaxsupplist,
        success: function (res) {
            console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data;
            if (isussecc) {
                var html = '<option value="">全部</option>';
                var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i]
                    html += '<option value="' + datanow.F_Id + '" >' + datanow.Supplier_Nick + '</option>';
                    htmlsel += '<dd lay-value="' + datanow.F_Id + '" >' + datanow.Supplier_Nick + '</dd>'
                  
                    $("#StockBill_Sender").html(html);
                    $(".checksupper .layui-anim.layui-anim-upbit").html(htmlsel);
                    renderForm1();
                    var select = 'dd[lay-value="' + sender + '"]';
                    $('#StockBill_Sender').siblings("div.layui-form-select").find('dl').find(select).click();
                }  
            } else {
                alert(res.Message)
            }
        }
    })
}




