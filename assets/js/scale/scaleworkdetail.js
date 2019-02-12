var token = $.cookie("token");
var currname = [], currnick = [], cusid = [], cusnick = [], printdata, materid=[],maternick=[],matername=[];
var layer;
layui.use(['layer'], function () {
    layer = layui.layer
});
var layerindex= layer.load()
$(function () {
    var str = [
        { title: '序号', type: 'numbers' },
        { field: 'SalesOrderEntry_Project', title: '项目号' },
        { field: 'Material_Name', title: '<span style="color:red">*  </span>物料代码',templet:function(d){
            var index1 = materid.indexOf(d.SalesOrderEntry_Material)
            if (index1 == '-1') {
                return ''
            } else {
                return matername[index1]
            } 
        }
        },
        { field: 'Material_Nick', title: '物料名称',templet:function(d){
            var index= materid.indexOf(d.SalesOrderEntry_Material)
            if (index == '-1') {
                return ''
            } else {
                return maternick[index]
            } 
        } },
        { field: 'SalesOrderEntry_Specifications', title: '销售规格' },
        { field: 'SalesOrderEntry_Unit', title: '单位', align: "center" },
        { field: 'SalesOrderEntry_Quantity', title: '<span style="color:red">*  </span>数量', align: "center" },
        {
            field: 'SalesOrderEntry_Price', title: '销售单价', align: "right", templet: function (d) {
                if (d.SalesOrderEntry_Price || d.SalesOrderEntry_Price == '0') {
                    var num = parseFloat(d.SalesOrderEntry_Price);
                    num = num.toFixed(2);
                } else {
                    num = ''
                }
                return num
            }
        },
        {
            field: 'SalesOrderEntry_TaxPrice', title: '含税单价', align: "right", templet: function (d) {
                if (d.SalesOrderEntry_TaxPrice || d.SalesOrderEntry_TaxPrice == '0') {
                    var num = parseFloat(d.SalesOrderEntry_TaxPrice);
                    num = num.toFixed(2);
                } else {
                    num = ''
                }

                return num
            }
        },
        {
            field: 'SalesOrderEntry_Amount', title: '未税金额', align: "right", templet: function (d) {
                if (d.SalesOrderEntry_Amount || d.SalesOrderEntry_Amount == '0') {
                    var num = parseFloat(d.SalesOrderEntry_Amount);
                    num = num.toFixed(2);
                } else {
                    num = ''
                }

                return num
            }
        },
        { field: 'SalesOrderEntry_TaxRate', title: '税率(%)', align: "center" },

        {
            field: 'SalesOrderEntry_Total', title: '价税合计', align: "right", templet: function (d) {
                if (d.SalesOrderEntry_Total || d.SalesOrderEntry_Total == '0') {
                    var num = parseFloat(d.SalesOrderEntry_Total);
                    num = num.toFixed(2);
                } else {
                    num = ''
                }

                return num
            }
        },
        {
            field: 'SalesOrderEntry_Tax', title: '税额', align: "right", templet: function (d) {
                if (d.SalesOrderEntry_Tax || d.SalesOrderEntry_Tax == '0') {
                    var num = parseFloat(d.SalesOrderEntry_Tax);
                    num = num.toFixed(2);
                } else {
                    num = ''
                }

                return num
            }
        },
        {
            field: 'SalesOrderEntry_Deadline', title: '<span style="color:red">*  </span>交货日期', templet: function (d) {
                var deadline = (d.SalesOrderEntry_Deadline).split(" ")[0];
                // console.log(deadline)
                return deadline
            }
        },
        { field: 'Remark', title: '备注' }
    ];
    var url = window.location.search;
    var id = url.split("?")[1].split("&")[0].split("=")[1];
    var scaleid = url.split("?")[1].split("&")[1].split("=")[1];
    $.ajax({
        type: "get",
        url: ajaxURl + '/Api/PSISales/SalesOrder/GetEntry?keyValue=' + scaleid,
        success: function (res) {
            console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data;
            printdata = res.Data
            if (isussecc) {
                if (data) {
                    $("#SalesOrder_Name").val(data.SalesOrder_Name)
                    // $("#Customer_Nick").val(data.Customer_Nick);
                    if (data.SalesOrder_DateTime) {
                        $("#SalesOrder_DateTime").val(data.SalesOrder_DateTime.split(" ")[0].replace(/\//g, "-"))
                    }
                   
                    $("#SalesOrder_ExRate").val(data.SalesOrder_ExRate)
                    $("#SalesOrder_TaxRate").val(data.SalesOrder_TaxRate)
                    $("#SalesOrder_Project").val(data.SalesOrder_Project)
                    $("#recdate").val(data.SalesOrder_Deadline)
                    $("#SalesOrder_Delivery").val(data.SalesOrder_Delivery)
                    $("#SalesOrder_Payment").val(data.SalesOrder_Payment)
                    $("#SalesOrder_Cycle").val(data.SalesOrder_Cycle)
                    $("#Remark").val(data.Remark);
                    getcurr(data.SalesOrder_Currency);
                    getbii(data.SalesOrder_Biller);
                    gettype(data.SalesOrder_Type);
                    getstatus(data.SalesOrder_Status);
                    getdepart(data.SalesOrder_Department)
                    getem(data.SalesOrder_Employee)
                    getcustom(data.SalesOrder_Customer)
                    germater(str,res.Data.Details)
                     setInterval(function(){
                        layer.close(layerindex)
                    },1500)
                    
                }

            } else {
                alert(res.Message)
            }
        }
    })


    

    $(".audit").on("click", function () {
        var href = '/views/scale/scalworkchange.html?scaleorder=' + id + '&scaleid=' + scaleid;
        window.location.replace(href)
    })

    $(".hignckick").on("click", function () {
        // data-type="daten"
        var _this = $(this)
        var type = _this.attr("data-type");
        if (type == 'daten') {
            _this.attr("data-type", "datey");
            $(".hignrank").removeClass("hidden");
            $(".hignckick").html("收起")
        } else {
            _this.attr("data-type", "daten");
            $(".hignrank").addClass("hidden");
            $(".hignckick").html("更多")
        }
    })

})
// 物料--
function germater(str,data){

    $.ajax({
        url: ajaxMater,
        success:function(res){
            console.log(res)
            var isussecc=res.Succeed;
            if(isussecc){
                for(var i=0;i<res.Data.length;i++){
                    materid.push(res.Data[i].F_Id)
                    maternick.push(res.Data[i].Material_Nick)
                    matername.push(res.Data[i].Material_Name)
                }
                tablerender(str,data)
            }
        }
    })
}
// 部门--
function getdepart(id) {
    $.ajax({
        type: "get",
        url: ajaxdepart,
        success: function (res) {
            var isussecc = res.Succeed;
            var data =res.Data;
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i]
                    if (datanow.F_Id == id) {
                        $("#SalesOrder_Department").val(datanow.Department_Nick)
                    }
                }
            } else {
                alert(res.Message)
            }
        }
    })
}
// 业务员--
function getem(id) {
    $.ajax({
        type: "get",
        url: ajaxUsr,
        success: function (res) {
            console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data;
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i]
                    if (datanow.F_Id == id) {
                        $("#SalesOrder_Employee").val(datanow.User_Nick)
                    }
                }
            } else {
                alert(res.Message)
            }
        }
    })
}
// 订单类型--
function gettype(id) {
    $.ajax({
        type: "get",
        url: saletype,
        success: function (res) {
            var isussecc = res.Succeed;
            var data =res.Data.Details;
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i]
                    if (datanow.F_Id == id) {
                        $("#SalesOrder_Type").val(datanow.DictionaryItem_Nick)
                    }
                }
            } else {
                alert(res.Message)
            }
        }
    })
}

// 单据状态--
function getstatus(id) {
    console.log(id)
    $.ajax({
        type: "get",
        url: salestauts,
        success: function (res) {
            console.log(res)
            var isussecc =res.Succeed;
            var data = res.Data.Details;
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i]
                    if (datanow.DictionaryItem_Value == id) {
                        $("#SalesOrder_Status").val(datanow.DictionaryItem_Nick)
                    }
                }
            } else {
                alert(res.Message)
            }
        }
    })
}

// 币别--
function getcurr(id) {
    $.ajax({
        type: "get",
        url: ajaxCurrency,
        success: function (res) {
            var isussecc = res.Succeed;
            var data = res.Data;
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i]
                    currname.push(datanow.F_Id)
                    currnick.push(datanow.Currency_Nick)
                    if (datanow.F_Id == id) {
                        $("#SalesOrder_Currency").val(datanow.Currency_Nick)
                    }


                }
            } else {
                alert(res.Message)
            }
        }
    })
}
//客户--
function getcustom(id){
    $.ajax({
        type: "get",
        url: ajaxCus,
        success: function (res) {
            var isussecc = res.Succeed;
            var data = res.Data;
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i]
                    if (datanow.F_Id == id) {
                        $("#Customer_Nick").val(datanow.Customer_Nick)
                    }
                }
            } else {
                alert(res.Message)
            }
        }
    })
}
// 制单人--
function getbii(id) {
    $.ajax({
        type: "get",
        url: ajaxUsr,
        success: function (res) {
            console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data;
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    var datanow = data[i];
                    cusid.push(data[i].F_Id)
                    cusnick.push(data[i].User_Nick)
                    if (datanow.F_Id == id) {
                        $("#SalesOrder_Billername").val(datanow.User_Nick)
                    }
                }

            } else {
                alert(res.Message)
            }

        }
    })
}

function tablerender(str, data) {
    layui.use(['jquery', 'table'], function () {
        var $ = layui.$,
            table = layui.table;
        table.render({
            elem: '#dataTable'
            , toolbar: true
            , cols: [str]
            , data: data
            , page: true
            , limits: [1000, 2000, 3000, 4000, 5000]
            , limit: 1000
        });
        return false;
    })
}

function printable() {
    var base = new Base64();
    $(".printbody").removeClass("hidden");
    $.ajax({
        type: 'GET',
        url: ajaxURl + "/Api/PSIBase/Template/GetEntity?keyValue=D9D31C3A-B476-451D-A383-424F7F61E5CF",
        success: function (res) {
            console.log(res)
            var resdata = res.Data;
            // printdata=res.Data
            console.log(printdata)
            var isussecc = res.Succeed;
            if (isussecc) {
                var templet = resdata.Template_Html;
                // var data = res[0].Template_DataUrl;
                var html = base.decode(templet)
                $(".printbody").html(html)
                PraseTable();
                PraseBody();
            }
        }
    })


    // function PraseTable() {
    //     // console.log(printdata)
    //     var data;
    //     $('.printbody table').each(function (index, tb) {
    //         var tbid = tb.id
    //         var detail = printdata[tbid];
    //         var detail1=printdata;
    //         if (tbid == 'Details') {
    //             data = detail;
    //         } else {
    //             // data = detail1;
    //            var arr = []
    //             for (var i in detail1) {
    //                 var o = {};
    //                 o[i] = detail1[i];
    //                 arr.push(o)
    //             }
    //             // console.log(arr);
    //             data = arr;
    //         }
    //         console.log(detail)
    //         console.log(detail1)
    //         $.each(data, function (index, obj) {
    //             var row = $('#' + tbid).children().children("tr:last").html();
    //             var org = row;
    //             // console.log(obj);
    //             $.each(obj, function (key, val) {
    //                 var reg = new RegExp("{" + key + '}', "g");//g,表示全部替换。
    //                 row = row.replace(reg, val);
    //             });
    //             $('#' + tbid).children().children("tr:last").replaceWith("<tr>" + row + "</tr>" + "<tr>" + org + "</tr>")
    //         });
    //         //抹除模板行
    //         $('#' + tbid).children().children("tr:last").replaceWith("");
    //     });
    // }
    // function PraseTable() {
    //     // console.log(printdata)
    //     var data;
    //     $('.printbody table').each(function (index, tb) {
    //         var tbid = tb.id
    //         var detail = printdata[tbid];
    //         var detail1 = printdata;
    //         if (tbid == 'Data') {
    //             data = detail;
    //         } else {
    //             var arr = []
    //             for (var i in detail1) {
    //                 var k = {};
    //                 k[i] = detail1[i];
    //                 arr.push(o)
    //             }
    //             data = arr;
    //         }
    //         console.log(data)
    //         $.each(data, function (index, obj) {
    //             var row = $('#' + tbid).children().children("tr:last").html();
    //             var org = row;
    //             console.log(obj);
    //             $.each(obj, function (key, val) {
    //                 var reg = new RegExp("{" + key + '}', "g");//g,表示全部替换。
    //                 row = row.replace(reg, val);
    //             });
    //             $('#' + tbid).children().children("tr:last").replaceWith("<tr>" + row + "</tr>" + "<tr>" + org + "</tr>")
    //         });
    //         //抹除模板行
    //         $('#' + tbid).children().children("tr:last").replaceWith("");
    //     });
    // }


    
    function PraseTable() {
        // console.log(printdata)
        var data;
        $('.printbody table').each(function (index, tb) {
            var tbid = tb.id
            var detail = printdata[tbid];
            // var detail1=printdata;
            if (tbid == 'Details') {
                data = detail;
                $.each(data, function (index, obj) {
                    var row = $('#' + tbid).children().children("tr:last").html();
                    var org = row;
                    // console.log(obj);
                    $.each(obj, function (key, val) {
                        var reg = new RegExp("{" + key + '}', "g");//g,表示全部替换。
                        row = row.replace(reg, val);
                    });
                    $('#' + tbid).children().children("tr:last").replaceWith("<tr>" + row + "</tr>" + "<tr>" + org + "</tr>")
                });
                $('#' + tbid).children().children("tr:last").replaceWith("");
            } 
        
            
        });
    }
    function PraseBody() {
        // console.log(infdata)
        $(".printbody").each(function (index, body) {
            var ball = body.innerHTML;
            // console.log(body)
           
            $.each(printdata, function (key, val) {
                var reg = new RegExp("{" + key + '}', "g");//g,表示全部替换。
                ball = ball.replace(reg, val);
            });
            body.innerHTML = (ball);
        });

        $(".printbody").css("padding", "0 30px")
        $(".printbody").print();
        $(".printbody").addClass("hidden");
    }
}