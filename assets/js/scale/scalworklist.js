// 时间
var myDate = new Date();
var nowY = myDate.getFullYear();
var nowM = myDate.getMonth() + 1;
var nowD = myDate.getDate();
var tody = nowY + "-" + (nowM < 10 ? "0" + nowM : nowM) + "-" + (nowD < 10 ? "0" + nowD : nowD);
layui.use(['jquery', 'table', 'layer', "form", "layedit", "laydate"], function () {
    var $ = layui.$;
    table = layui.table,
        form = layui.form,
        layer = layui.layer,
        layedit = layui.layedit,
        laydate = layui.laydate,
        upload = layui.uplaod,
        element = layui.element;
    //日期
    laydate.render({
        elem: '#date',
        value: tody,
        isInitValue: true,
        btns: ['now', 'confirm']
    })
    //日期
    laydate.render({
        elem: '#recdate',
        value: tody,
        isInitValue: true,
        btns: ['now', 'confirm']
    });
});


var layer
// 渲染table
function tablerender(str, data) {
    layui.use(['jquery', 'table'], function () {
        var $ = layui.$,
            table = layui.table;
            layer=layui.layer
        table.render({
            elem: '#dataTable'
            , toolbar: true
            , cols: [str]
            , data: data
            , page: true
            , limits: [1000, 2000, 3000, 4000, 5000]
            , limit: 1000
            , done: function () {
                table.on('rowDouble(dataTable)', function (obj) {
                    console.log(obj);
                    parent.getscale(obj.data.SalesOrder_Name, obj.data.F_Id)
                });
            }
        });
        return false;
    })
}


$(function () {
    var subindex = layer.load();
    var islist = 0;
    var currid = [],currname = [],currnick = [],ratelist = [];
    var currnamshow = [], userid = [], usernick = [];
    var customid=[],customnick=[];
    var ordertype=[],ordernick=[];
    var statuvalu=[],statunick=[]
    var islist = false;
    // 币别--
    $.ajax({
        type: "get",
        url:ajaxCurrency,
        success: function (res) {
            console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data;
            if (isussecc) {
                var html = '<option value="">请选择币别</option>';
                var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">请选择币别</dd>'
                for (var i = 0; i < data.length; i++) {
                    html += '<option value="' + data[i].F_Id + '">' + data[i].Currency_Nick + '</option>';
                    htmlsel += '<dd lay-value="' + data[i].F_Id + '">' + data[i].Currency_Nick + '</dd>';
                    currid.push(data[i].Currency_F_Idd);
                    // currname.push(data[i].Currency_Nick);
                    currname.push(data[i].F_Id)
                    currnick.push(data[i].Currency_Nick)
                    currnamshow.push(data[i].Currency_Name)
                    ratelist.push(data[i].Currency_ExRate)
                }
                $("#currency").html(html);
                $(".currency .layui-anim.layui-anim-upbit").html(htmlsel);
                renderForm();
                islist++;
                isclick()
            } else {
                alert(data.Message);
                islist++;
                isclick()
            }
        }
    })

    // 制单人--
    $.ajax({
        type: "get",
        url: ajaxUsr,
        success: function (res) {
            var isussecc =res.Succeed;
            var data =res.Data;
            if (isussecc) {
                var html = '<option value="">全部</option>';
                var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i];
                    html += '<option value="' + datanow.F_Id + '" >' + datanow.User_Nick + '</option>';
                    htmlsel += '<dd lay-value="' + datanow.F_Id + '" >' + datanow.User_Nick + '</dd>';
                    userid.push(datanow.F_Id)
                    usernick.push(datanow.User_Nick)
                }
                $("#SalesOrder_Biller").html(html);
                $(".checkbiller .layui-anim.layui-anim-upbit").html(htmlsel);
                renderForm();
                islist++;
                isclick()
            } else {
                islist++;
                isclick()
                alert(res.Message)
            }

        }
    })

    $(".checklist").on("click", function () {
        var str = [
            { title: '序号', type: 'numbers', width: '3%' },
            { field: 'SalesOrder_Project', title: '项目号', width: '5%',align:"left" },
            { field: 'SalesOrder_Name', title: '订单编号', width: '12%',align:"left" },
            {
                field: 'SalesOrder_DateTime', title: '单据日期', width: "12%", align: "center", templet: function (d) {
                    if (d.SalesOrder_DateTime) {
                        return (d.SalesOrder_DateTime).split(" ")[0]
                    } else {
                        return ''
                    }

                }
            },
            { field: 'SalesOrder_Customer', title: '客户', width: '15%' ,align:"left",templet:function(d){
                var index1 = customid.indexOf(d.SalesOrder_Customer)
                if (index1 == '-1') {
                    return ''
                } else {
                    return customnick[index1]
                }
            }},
            { field: 'SalesOrder_Type', title: '订单类型', width: "8%",align:"center",templet:function(d){
                var index2 = ordertype.indexOf(d.SalesOrder_Type)
                if (index2 == '-1') {
                    return ''
                } else {
                    return ordernick[index2]
                }
            } },
            // {
            //     field: 'SalesOrder_Deadline', title: '交货日期', width: "12%", align: 'center', templet: function (d) {
            //         if (d.SalesOrder_Deadline) {
            //             return (d.SalesOrder_Deadline).split(" ")[0]
            //         } else {
            //             return ''
            //         }

            //     }
            // },
            {
                field: 'SalesOrder_Currency', title: '币别', width: '5%',align:"left", templet: function (d) {
                    var index = currname.indexOf(d.SalesOrder_Currency)
                    if (index == '-1') {
                        return ''
                    } else {
                        return currnick[index]
                    }
                }
            },
            { field: 'SalesOrder_ExRate', title: '汇率', width: "5%", align: "right" },
            { field: 'SalesOrder_TaxRate', title: '税率(%)', width: "5%", align: "right" },
           
            { field: 'SalesOrder_Status', title: '单据状态', width: "5%",align:"center", templet: function (d) {
                var index3 = statuvalu.indexOf(d.SalesOrder_Status)
                if (index3 == '-1') {
                    return ''
                } else {
                    return statunick[index3]
                }
            }},
            {
                field: 'SalesOrder_Biller', title: '制单人', width: "5%",align:"left", templet: function (d) {
                    var nowi = userid.indexOf(d.SalesOrder_Biller)
                    if (nowi == '-1') {
                        return ''
                    } else {
                        return usernick[nowi]
                    }

                }
            },
            
            {
                field: 'IsEnabled', title: '启用', align: 'center', width: "5%", templet: function (d) {
                    if (d.IsEnabled) {
                        return '是';
                    } else {
                        return '否';
                    }

                }
            },
            { field: 'Remark', title: '备注', width: "10%",align:"left" },
            {
                field: 'F_Id', title: '操作', align: 'center', templet: function (d) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-danger" onclick=delscale("' + d.F_Id + '")>删除</a>';
                }
            }
        ]
        $.ajax({
            type: "GET",
            async: false,
            url: salelist,
            // url: ajaxURl + "/Api/ApiService/Get/PSISalesOrder_Inf?token=" + token,
            success: function (res) {
                var data = res.Data;
                console.log(data)
                var isussecc = res.Succeed;
                if (isussecc) {
                    if (islist) {
                        tablerender(str, data);
                    }

                } else {
                    alert(res.Message)
                }
            }
        })

    })

    // 客户--
    $.ajax({
        type: "get",
        url: ajaxCus,
        success: function (res) {
            console.log(res)
            var isussecc = res.Succeed;
            var data =res.Data;
            if (isussecc) {
                var html = '<option value="">全部</option>';
                var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                for (var i = 0; i < data.length; i++) {
                    html += '<option value="' + data[i].F_Id + '" data-rate="' + data[i].Customer_TaxRate + '">' + data[i].Customer_Nick + '</option>';
                    htmlsel += '<dd lay-value="' + data[i].F_Id + '" data-rate="' + data[i].Customer_TaxRate + '">' + data[i].Customer_Nick + '</dd>';
                    customid.push(data[i].F_Id)
                    customnick.push(data[i].Customer_Nick)
                }
                $("#Customer_Nick").html(html);
                $(".checkcus .layui-anim.layui-anim-upbit").html(htmlsel);
                renderForm();
                islist++;
                isclick()
            } else {
                alert(res.Message)
                islist++;
                isclick()
            }

        }
    })

    //单据状态--
    $.ajax({
        type: "get",
        url: salestauts,
        success: function (res) { 
            var isussecc = res.Succeed;
            var data =res.Data.Details;
            if (isussecc) {
                var html = '<option value="">全部</option>';
                var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                for (var i = 0; i < data.length; i++) {
                    html += '<option value="' + data[i].DictionaryItem_Value + '" >' + data[i].DictionaryItem_Nick + '</option>';
                    htmlsel += '<dd lay-value="' + data[i].DictionaryItem_Value + '" >' + data[i].DictionaryItem_Nick + '</dd>'
                    statuvalu.push(data[i].DictionaryItem_Value)
                    statunick.push(data[i].DictionaryItem_Nick)   
                }
                $("#SalesOrder_Status").html(html);
                $(".orderstau .layui-anim.layui-anim-upbit").html(htmlsel);
                renderForm();
                islist++;
                isclick()
            } else {
                islist++;
                isclick()
                alert(res.Message)
            }

        }
    })


    //订单类型--
    
    $.ajax({
        type: "get",
        url: saletype,
        success: function (res) {
            console.log(res)
            var isussecc =res.Succeed;
            var data =res.Data.Details;
            if (isussecc) {
                var html = '<option value="">全部</option>';
                var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                for (var i = 0; i < data.length; i++) {
                    html += '<option value="' + data[i].F_Id + '" >' + data[i].DictionaryItem_Nick + '</option>';
                    htmlsel += '<dd lay-value="' + data[i].F_Id + '" >' + data[i].DictionaryItem_Nick + '</dd>'
                    ordertype.push(data[i].F_Id)
                    ordernick.push(data[i].DictionaryItem_Nick)
                }
                $("#SalesOrder_Type").html(html);
                $(".ordertype .layui-anim.layui-anim-upbit").html(htmlsel);
                renderForm();
                islist++;
                isclick()
            } else {
                islist++;
                isclick()
                alert(res.Message)
            }

        }
    })



    // 部门--
    $(".checkdepart").on("click", function () {
        var _this = $(this);
        var date = _this.attr("data-type");
        if (date == 'daten') {
            $(".checkdepart").attr("data-type", "datey");
            $.ajax({
                type: "get",
                url: ajaxdepart,
                success: function (res) {
                    console.log(res)
                    var isussecc =res.Succeed;
                    var data =res.Data;
                    if (isussecc) {
                        var html = '<option value="">全部</option>';
                        var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                        for (var i = 0; i < data.length; i++) {
                            html += '<option value="' + data[i].F_Id + '" >' + data[i].Department_Nick + '</option>';
                            htmlsel += '<dd lay-value="' + data[i].F_Id + '" >' + data[i].Department_Nick + '</dd>'
                        }
                        $("#department").html(html);
                        $(".checkdepart .layui-anim.layui-anim-upbit").html(htmlsel);
                        renderForm();
                        _this.find("select").next().find('.layui-select-title input').click();
                        _this.find("select").next().find('.layui-select-title input').focus()
                        // Customer_TaxRate 税率   
                    } else {
                        alert(JSON.parse(res).Message)
                    }

                }
            })
        }
    })
    $(".add").on("click", function () {
        parent.newscale();
    })

    // 切换客户
    form.on('select(customer)', function (data) {
        console.log(data);
        var rate = ''
        if(data.value){
            if (data.elem.selectedOptions) {
                rate = data.elem.selectedOptions[0].attributes[1].value;
    
            } else {
                var elems = data.elem;
                for (var i = 0; i < elems.length; i++) {
                    var elemnow = elems[i];
                    if (elemnow.selected) {
                        rate = elemnow.attributes[1].value;
                    }
                }
    
            }
            $("#SalesOrder_TaxRate").val(rate)
        }
        
    })
    // 切换币别
    form.on('select(currlist)', function (data) {
        var value = data.value;
        for (var k = 0; k < currname.length; k++) {
            var nowname = currname[k];
            var nowk = k;
            if (value == nowname) {
                $("#SalesOrder_ExRate").val(ratelist[nowk])

            }
        }

    });


    function isclick() {
        if (islist == 5) {
            layer.close(subindex);
            $(".checklist").trigger("click")
        }
    }


})


function renderForm() {
    layui.use('form', function () {
        var form = layui.form;
        form.render()
    });
}

// 删除
function delscale(id) {
    var index = layer.confirm('确认删除？', {
        btn: ['确定', '取消'] //按钮
    }, function () {
        var token = $.cookie("token");
        $.ajax({
            type: "POST",
            async: false,
            url: ajaxURl + "/Api/PSISales/SalesOrder/Delete",
            data: {
                F_Id: id
            },
            success: function (res) {
                var data = res.Data;
                console.log(data)
                var isussecc = res.Succeed;
                if (isussecc) {
                    layer.close(index)
                    $(".checklist").trigger("click");
                } else {
                    layer.close(index)
                    alert(res.Message)
                }
            }
        })
    }); 
}

