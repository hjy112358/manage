var dateslit = [];
var currname = [];
var currnick = [];
var ratelist = [];
var currnamshow = [];
var first=new Date().valueOf();
window.viewObj = {
    tbData: [{
        tempId: first,
        state: 0,
        Material_Name: '',//物料代码
        Material_Nick: '',//物料名称
        SalesOrderEntry_Material: '',//物料--物料id
        SalesOrderEntry_Specifications: '',//销售规格
        SalesOrderEntry_Price: '',//价格
        SalesOrderEntry_Quantity: '',//数量
        SalesOrderEntry_Unit: '',//单位
        SalesOrderEntry_Amount: '',//总额
        SalesOrderEntry_TaxRate: '',//税率
        SalesOrderEntry_Tax: "",//税额
        SalesOrderEntry_Total: '',//合计
        SalesOrderEntry_Deadline: '',//交货日期
        Remark: '',//备注
        SalesOrderEntry_SalesOrder: ''
    }],
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
        element = layui.element;
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
            { title: '序号', type: 'numbers', width: '50' },
            { field: 'Material_Name', title: '<span style="color:red">*  </span>物料代码', width: '120',templet:function(){
                return '<input class="choosemater" style="width:120px">'
            } },
            { field: 'Material_Nick', title: '物料名称', width: '200' },
            { field: 'SalesOrderEntry_Specifications', title: '规格', width: '100', edit: 'text' },
            { field: 'SalesOrderEntry_Unit', title: '单位', width: '50', align: "center" },
            { field: 'SalesOrderEntry_Quantity', title: '<span style="color:red">*  </span>数量', edit: 'text', width: '80', align: "center"},
            {field: 'SalesOrderEntry_Price', title: '销售单价', edit: 'text', width: '100', align: "right"},
            {field: 'SalesOrderEntry_TaxPrice', title: '含税单价', edit: 'text', width: '100', align: "right"},
            {field: 'SalesOrderEntry_Amount', title: '未税金额', edit: 'text', width: '100', align: "right"},
            { field: 'SalesOrderEntry_TaxRate', title: '税率(%)', edit: 'text', width: '50', align: "center" },
            {field: 'SalesOrderEntry_Total', title: '价税合计', edit: 'text', width: '100', align: "right"},
            {field: 'SalesOrderEntry_Tax', title: '税额', width: '80', align: "right"},
            {field: 'SalesOrderEntry_Deadline', title: '<span style="color:red">*  </span>交货日期', width: '100', align: "center"},
            { field: 'Remark', title: '备注', edit: 'text', width: '200' }
          
        ]],
        done: function (res, curr, count) {
            viewObj.tbData = res.data;
            prolist();
            tabledata = res.data;
            $('tr').each(function (e) {
                var $cr = $(this);
                var dataindex = $cr.attr("data-index");
                $.each(tabledata, function (index, value) {
                    if (value.LAY_TABLE_INDEX == dataindex) {
                        $cr.find('input').val(value.Material_Name);
                        $cr.find('input[id="SalesOrderEntry_Deadline"]').val(value.SalesOrderEntry_Deadline);
                    }
                });
            });
        }
    });

    function renderForm() {
        layui.use('form', function () {
            var form = layui.form;
            form.render();
        });
    }
    $(document).on("click", function () {
        var evt = event.srcElement ? event.srcElement : event.target;
        var seletlist = $(".selectlist1");
        for (var i = 0; i < seletlist.length; i++) {
            if (!($(seletlist[i]).hasClass("hidden"))) {
                if (evt.id == 'checkmater') {
                    var oldData = table.cache[layTableId];
                    tableIns.reload({
                        data: oldData,
                        limit: viewObj.limit
                    });
                    return;
                }
                else {
                    $(".selectlist1").addClass("hidden");
                    var oldData = table.cache[layTableId];
                    tableIns.reload({
                        data: oldData,
                        limit: viewObj.limit
                    });
                }
                return
            }
        }
    })
    

    var htmlterm = '';
    var arrlist = [];
    var arri = {};
    function prolist() {
        // $(".productworktable td[data-field='Material_Name']").each(function () {
        //     var curnow = $(this);
        //     curnow.on("click", function () {
        //         // console.log(1);
        //         var scrollHeight = $('#tableRes .layui-table-body.layui-table-main').prop("scrollHeight");
        //         var height = $('#tableRes .layui-table-body.layui-table-main').height() + scrollHeight + 80;
        //         $('#tableRes .layui-table-body.layui-table-main').css("height", height)
        //         var _this = $(this);
        //         var dataindex = _this.parents("tr").attr("data-index");
        //         _this.find(".checkmater").addClass("layui-form-selected")
        //         var date = $(".productworktable").attr("data-type");
        //         if (date == 'daten') {
        //             $(".productworktable").attr("data-type", "datey");
        //             $("#tableRes").find("tr").each(function (i, v) {
        //                 var nowtr = v;
        //                 var nowindex = $(v).attr("data-index");
        //                 if (dataindex != nowindex) {
        //                     $(nowtr).find(".selectlist1").addClass("hidden");
        //                 } else {
        //                     $(nowtr).find(".selectlist1").removeClass("hidden");
        //                     $(nowtr).find(".dateload").removeClass("hidden")
        //                     $(nowtr).find(".datelist").addClass("hidden")
        //                 }
        //             });
        //             $.ajax({
        //                 url: ajaxMater,
        //                 success: function (res) {
        //                     $(".dateload").addClass("hidden")
        //                     $(".datelist").removeClass("hidden")
        //                     var data = res.Data;
        //                     var isussecc = res.Succeed;
        //                     if (isussecc) {
        //                         // data[i].Material_Name data[i].Material_Nick  data[i].Material_Specification
        //                         for (var i = 0; i < data.length; i++) {
        //                             var datanow = data[i];
        //                             htmlterm += '<li data-name="' + (datanow.Material_Name || '') + '" data-nick="' + (datanow.Material_Nick || '') + '" data-spe="' + (datanow.Material_Specifications || '') + '" data-materme="' + (datanow.Material_Measure || '') + '" data-materid="' + (datanow.F_Id || '') + '"><p>' + (datanow.Material_Name || '') + '</p><p>' + (datanow.Material_Nick || '') + '</p><p>' + (datanow.Material_Specifications || '') + '</p></li>'
        //                             arri = { materame: (datanow.Material_Name || ''), maternick: (datanow.Material_Nick || ''), matersp: (datanow.Material_Specifications || ''), matermea: (datanow.Material_Measure || ''), materid: (datanow.F_Id || '') };
        //                             arrlist.push(arri)
        //                         }
        //                         $(".selectlist1 ul").html(htmlterm);
        //                         $(".materName").on("keyup", function () {
        //                             var searchVal = $(this).val();
        //                             var showList = [];
        //                             var searchlist = '';
        //                             //将和所输入的字符串匹配的项存入showList
        //                             //将匹配项显示，不匹配项隐藏
        //                             $.each(arrlist, function (index, item) {
        //                                 if ((item.materame && item.materame.indexOf(searchVal) != -1) || (item.maternick && item.maternick.indexOf(searchVal) != -1) || (item.matersp && item.matersp.indexOf(searchVal) != -1)) {
        //                                     showList.push(item);
        //                                 } else {

        //                                 }
        //                             })
        //                             for (var j = 0; j < showList.length; j++) {
        //                                 var shownow = showList[j]
        //                                 searchlist += '<li data-name="' + shownow.materame + '" data-nick="' + shownow.maternick + '" data-spe="' + shownow.matersp + '" data-materme="' + shownow.materme + '" data-materid="' + shownow.materid + '"><p>' + shownow.materame + '</p><p>' + shownow.maternick + '</p><p>' + shownow.matersp + '</p></li>'
        //                             }
        //                             if (showList.length == 0) {
        //                                 searchlist = '<div style="text-align:center;padding:15px 10px 15px 0; ">暂无数据</div>'
        //                             }
        //                             $(".selectlist1 ul").html("");
        //                             $(".selectlist1 ul").html(searchlist);
        //                             $('.selectlist1 ul').find('li').each(function () {
        //                                 var _this1 = $(this);
        //                                 _this1.hover(function () {
        //                                     $(this).addClass("active").siblings().removeClass("active")
        //                                 });
        //                                 _this1.on("click", function () {
        //                                     var oldData = table.cache[layTableId];
        //                                     var name = $(this).attr("data-name");
        //                                     var nick = $(this).attr("data-nick");
        //                                     var specife = $(this).attr("data-spe");
        //                                     var measure = $(this).attr("data-materme");
        //                                     var marid = $(this).attr("data-materid")
        //                                     $(".materName").val(name || '');
        //                                     var rate = $("#SalesOrder_TaxRate").val();//税率
        //                                     var sendate = $("#recdate").val();//交货日期
        //                                     $.each(tabledata, function (index, value) {
        //                                         if (value.LAY_TABLE_INDEX == dataindex) {
        //                                             value.Material_Name = name || "";
        //                                             value.Material_Nick = nick || "";
        //                                             value.SalesOrderEntry_Specifications = specife || "";
        //                                             value.SalesOrderEntry_Material = marid || "";
        //                                             value.SalesOrderEntry_Unit = measure
        //                                             value.SalesOrderEntry_Quantity = 1;//数量
        //                                             value.SalesOrderEntry_Price = 0.00;//销售单价
        //                                             value.SalesOrderEntry_TaxRate = rate || '16';//税率
        //                                             value.SalesOrderEntry_Deadline = sendate || '';//交货日期
        //                                             value.SalesOrderEntry_TaxPrice = 0;//含税单价
        //                                             value.SalesOrderEntry_Amount = 0;//未税金额
        //                                             value.SalesOrderEntry_Total = 0;//价税合计
        //                                             value.SalesOrderEntry_Tax = 0;//税额
        //                                             if (value.tempId == viewObj.last) {
        //                                                 activeByType("add");
        //                                             } else {
        //                                                 var oldData = table.cache[layTableId];
        //                                                 tableIns.reload({
        //                                                     data: oldData,
        //                                                     limit: viewObj.limit
        //                                                 });
        //                                             }
        //                                         }
        //                                     });
        //                                     $(".selectlist1").addClass("hidden");
        //                                     $(".checkmater").removeClass("layui-form-selected");
        //                                     return false
        //                                 })
        //                             })
        //                         })
        //                         $('.selectlist1 ul').find('li').each(function () {
        //                             var _this1 = $(this);
        //                             _this1.hover(function () {
        //                                 $(this).addClass("active").siblings().removeClass("active")
        //                             });
        //                             _this1.on("click", function () {
        //                                 var oldData = table.cache[layTableId];
        //                                 var name = $(this).attr("data-name");
        //                                 var nick = $(this).attr("data-nick");
        //                                 var specife = $(this).attr("data-spe");
        //                                 var measure = $(this).attr("data-materme");
        //                                 var marid = $(this).attr("data-materid")
        //                                 $(".materName").val(name || '');
        //                                 var rate = $("#SalesOrder_TaxRate").val();//税率
        //                                 var sendate = $("#recdate").val();//交货日期
        //                                 $.each(tabledata, function (index, value) {
        //                                     if (value.LAY_TABLE_INDEX == dataindex) {
        //                                         value.Material_Name = name || "";
        //                                         value.Material_Nick = nick || "";
        //                                         value.SalesOrderEntry_Specifications = specife || "";
        //                                         value.SalesOrderEntry_Material = marid || "";
        //                                         value.SalesOrderEntry_Unit = measure
        //                                         value.SalesOrderEntry_Quantity = 1;//数量
        //                                         value.SalesOrderEntry_Price = 0.00;//销售单价
        //                                         value.SalesOrderEntry_TaxRate = rate || '16';//税率
        //                                         value.SalesOrderEntry_Deadline = sendate || '';//交货日期
        //                                         value.SalesOrderEntry_TaxPrice = 0;//含税单价
        //                                         value.SalesOrderEntry_Amount = 0;//未税金额
        //                                         value.SalesOrderEntry_Total = 0;//价税合计
        //                                         value.SalesOrderEntry_Tax = 0;//税额
        //                                         if (value.tempId == viewObj.last) {
        //                                             activeByType("add");
        //                                         } else {
        //                                             var oldData = table.cache[layTableId];
        //                                             tableIns.reload({
        //                                                 data: oldData,
        //                                                 limit: viewObj.limit
        //                                             });
        //                                         }
        //                                     }
        //                                 });
        //                                 $(".selectlist1").addClass("hidden");
        //                                 $(".checkmater").removeClass("layui-form-selected");
        //                                 return false
        //                             })
        //                         })
        //                     }else{
        //                         alert(res.Message)
        //                     }

        //                 }
        //             })
        //         } else {
        //             $(".selectlist1 ul").html(htmlterm);
        //             $("#tableRes").find("tr").each(function (i, v) {
        //                 var nowtr = v;
        //                 var nowindex = $(v).attr("data-index");
        //                 if (dataindex != nowindex) {
        //                     $(nowtr).find(".selectlist1").addClass("hidden");
        //                 } else {
        //                     $(nowtr).find(".selectlist1").removeClass("hidden");
        //                     $(nowtr).find(".dateload").addClass("hidden")
        //                     $(nowtr).find(".datelist").removeClass("hidden")
        //                 }
        //             });

        //             $(".materName").on("keyup", function () {
        //                 var searchVal = $(this).val();
        //                 var showList = [];
        //                 var searchlist = '';
        //                 //将和所输入的字符串匹配的项存入showList
        //                 //将匹配项显示，不匹配项隐藏
        //                 $.each(arrlist, function (index, item) {
        //                     if ((item.materame && item.materame.indexOf(searchVal) != -1) || (item.maternick && item.maternick.indexOf(searchVal) != -1) || (item.matersp && item.matersp.indexOf(searchVal) != -1)) {
        //                         showList.push(item);
        //                     } else {

        //                     }
        //                 })

        //                 for (var j = 0; j < showList.length; j++) {
        //                     var shownow = showList[j]
        //                     searchlist += '<li data-name="' + shownow.materame + '" data-nick="' + shownow.maternick + '" data-spe="' + shownow.matersp + '" data-maMaterial_Namee="' + shownow.matermea + '"><p>' + shownow.materame + '</p><p>' + shownow.maternick + '</p><p>' + shownow.matersp + '</p></li>'
        //                 }
        //                 if (showList.length == 0) {
        //                     searchlist = '<div style="text-align:center;padding:15px 10px 15px 0; ">暂无数据</div>'
        //                 } 
        //                 $(".selectlist1 ul").html("");
        //                 $(".selectlist1 ul").html(searchlist);
        //                 $("#tableRes").find("tr").each(function (i, v) {
        //                     var nowtr = v;
        //                     var nowindex = $(v).attr("data-index");
        //                     if (dataindex != nowindex) {
        //                         $(nowtr).find("selectlist").addClass("hidden")
        //                     }
        //                 });
        //                 $('.selectlist1 ul').find('li').each(function () {
        //                     var _this1 = $(this);
        //                     _this1.hover(function () {
        //                         $(this).addClass("active").siblings().removeClass("active")
        //                     });
        //                     _this1.on("click", function () {
        //                         var oldData = table.cache[layTableId];
        //                         // console.log(oldData)
        //                         var name = $(this).attr("data-name");
        //                         var nick = $(this).attr("data-nick");
        //                         var specife = $(this).attr("data-spe");
        //                         var measure = $(this).attr("data-materme");
        //                         var marid = $(this).attr("data-materid")
        //                         $(".materName").val(name || '');
        //                         var rate = $("#SalesOrder_TaxRate").val();//税率
        //                         var sendate = $("#recdate").val();//交货日期
        //                         $.each(tabledata, function (index, value) {
        //                             // console.log(value)
        //                             if (value.LAY_TABLE_INDEX == dataindex) {
        //                                 value.Material_Name = name || "";
        //                                 value.Material_Nick = nick || "";
        //                                 value.SalesOrderEntry_Specifications = specife || "";
        //                                 value.SalesOrderEntry_Material = marid || "";
        //                                 value.SalesOrderEntry_Unit = measure;
        //                                 value.SalesOrderEntry_Quantity = 1;//数量
        //                                 value.SalesOrderEntry_Price = 0.00;//销售单价
        //                                 value.SalesOrderEntry_TaxRate = rate || '16';//税率
        //                                 value.SalesOrderEntry_Deadline = sendate || '';//交货日期
        //                                 value.SalesOrderEntry_TaxPrice = 0;//含税单价
        //                                 value.SalesOrderEntry_Amount = 0;//未税金额
        //                                 value.SalesOrderEntry_Total = 0;//价税合计
        //                                 value.SalesOrderEntry_Tax = 0;//税额
        //                                 if (value.tempId == viewObj.last) {
        //                                     activeByType("add");
        //                                 } else {
        //                                     var oldData = table.cache[layTableId];
        //                                     tableIns.reload({
        //                                         data: oldData,
        //                                         limit: viewObj.limit
        //                                     });
        //                                 }
        //                             }
        //                         });
        //                         $(".selectlist1").addClass("hidden");
        //                         $(".checkmater").removeClass("layui-form-selected");
        //                         return false
        //                     })
        //                 })

        //             })
        //             $('.selectlist1 ul').find('li').each(function () {
        //                 var _this1 = $(this);
        //                 _this1.hover(function () {
        //                     $(this).addClass("active").siblings().removeClass("active")
        //                 });
        //                 _this1.on("click", function () {
        //                     var oldData = table.cache[layTableId];
        //                     // console.log(oldData)
        //                     var name = $(this).attr("data-name");
        //                     var nick = $(this).attr("data-nick");
        //                     var specife = $(this).attr("data-spe");
        //                     var measure = $(this).attr("data-materme");
        //                     var marid = $(this).attr("data-materid")
        //                     $(".materName").val(name || '');
        //                     var rate = $("#SalesOrder_TaxRate").val();//税率
        //                     var sendate = $("#recdate").val();//交货日期
        //                     $.each(tabledata, function (index, value) {
        //                         // console.log(value)
        //                         if (value.LAY_TABLE_INDEX == dataindex) {
        //                             value.Material_Name = name || "";
        //                             value.Material_Nick = nick || "";
        //                             value.SalesOrderEntry_Specifications = specife || "";
        //                             value.SalesOrderEntry_Material = marid || "";
        //                             value.SalesOrderEntry_Unit = measure;
        //                             value.SalesOrderEntry_Quantity = 1;//数量
        //                             value.SalesOrderEntry_Price = 0.00;//销售单价
        //                             value.SalesOrderEntry_TaxRate = rate || '16';//税率
        //                             value.SalesOrderEntry_Deadline = sendate || '';//交货日期
        //                             value.SalesOrderEntry_TaxPrice = 0;//含税单价
        //                             value.SalesOrderEntry_Amount = 0;//未税金额
        //                             value.SalesOrderEntry_Total = 0;//价税合计
        //                             value.SalesOrderEntry_Tax = 0;//税额
        //                             if (value.tempId == viewObj.last) {
        //                                 activeByType("add");
        //                             } else {
        //                                 var oldData = table.cache[layTableId];
        //                                 tableIns.reload({
        //                                     data: oldData,
        //                                     limit: viewObj.limit
        //                                 });
        //                             }
        //                         }
        //                     });
        //                     $(".selectlist1").addClass("hidden");
        //                     $(".checkmater").removeClass("layui-form-selected");
        //                     return false
        //                 })
        //             })
        //         }
        //         return false;
        //     })


        // })
    }

});


