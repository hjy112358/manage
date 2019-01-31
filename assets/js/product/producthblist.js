// 时间
var layer;
layui.use(['layer', "laydate"], function () {
    var laydate = layui.laydate;
    layer = layui.layer;
    //日期
    laydate.render({
        elem: '#date',
        isInitValue: true,
        btns: ['now', 'confirm']
    })
    
});

var billid = [], billnick = []

// 渲染table
function tablerender( data) {
    layui.use(['jquery', 'table'], function () {
        var $ = layui.$,
            table = layui.table;
        table.render({
            elem: '#dataTable'
            , toolbar: true
            , cols: [[
                { title: '序号', type: 'numbers' },
                { field: 'Assign_Name', title: '工单单号' },
                { field: 'Report_Name', title: '报工单号' },
                // { field: '', title: '工时' },
                // { field: '', title: '接收数' },
                { field: 'Report_Quantity', title: '实做数' },
                { field: 'Report_Qualified', title: '合格数' },//实做数-报废数
                { field: 'Report_Scrap', title: '报废数' },
                {
                    field: 'Fscrappage', title: '报废率(%)', templet: function (d) {
                        var scrappage = '';
                        if (d.Report_Quantity && d.Report_Scrap) {
                            scrappage = parseFloat(d.Report_Scrap) / parseFloat(d.Report_Quantity) * 100
                            scrappage = scrappage.toFixed(2)
                        }
                        return scrappage
                    }
                },
                { field: 'Rmark', title: '备注' },
                {
                    field: 'FNumber', title: '操作', align: 'center', templet: function (d) {
                        return '<a class="layui-btn layui-btn-xs layui-btn-danger btn-hb" href="javascript:void(0)" onclick=delreport("' + d.F_Id + '")>删除</a>';
                    }
                }
            ]]
            , data: data
            , page: true
            , limits: [1000, 2000, 3000, 4000, 5000]
            , limit: 1000
            , done: function () {
                table.on('rowDouble(dataTable)', function (obj) {
                   $(".termask").removeClass("hidden");
                   gethbdata(obj.data.F_Id)
                });
            }
        });
        return false;
    })
}

var islist = 0;
$(function () {
    // var subindex = layer.load();
    // 制单人
    var mouser = $.cookie("User_Id");
    var cheuser;
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
                    var datanow = data[i]
                    html += '<option value="' + datanow.F_Id + '">' + datanow.User_Nick + '</option>';
                    htmlsel += '<dd lay-value="' + datanow.F_Id + '">' + datanow.User_Nick + '</dd>'
                    if (datanow.F_Id == mouser) {
                        cheuser = datanow.F_Id
                    }
                }
                $("#ReportEntry_Biller").html(html);
                $(".checkuser .layui-anim.layui-anim-upbit").html(htmlsel);
                layui.use('form', function () {
                    var form = layui.form;
                    form.render();
                });
                var select = 'dd[lay-value="' + cheuser + '"]';
                $('#ReportEntry_Biller').siblings("div.layui-form-select").find('dl').find(select).click();

            } else {
                alert(res.Message)
            }
        }
    })

     // 报工类型
     $.ajax({
        url: craftypesta,
        success: function (res) {
            var isussecc = res.Succeed;
            if (isussecc) {
                var data = res.Data.Details;
                var html = '<option value="">全部</option>';
                var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                for (var i = 0; i < data.length; i++) {
                    var typedata = data[i];
                    html += '<option value="' + typedata.DictionaryItem_Value + '">' + typedata.DictionaryItem_Nick + '</option>';
                    htmlsel += '<dd lay-value="' + typedata.DictionaryItem_Value + '">' + typedata.DictionaryItem_Nick + '</dd>'
                }
                $("#ReportEntry_Type").html(html);
                $(".craftype .layui-anim.layui-anim-upbit").html(htmlsel);
                layui.use('form', function () {
                    var form = layui.form;
                    form.render();
                });
            }
        }

    })

    $(".checklist").on("click", function () {
        
        $.ajax({
            type: "GET",
            async: false,
            url: getReportlist,
            success: function (res) {
                var data = res.Data;
                console.log(data)
                var isussecc = res.Succeed;
                if (isussecc) {
                    tablerender(data);
                } else {
                    alert(res.Message)
                }
            }
        })

    })

    $(".checklist").trigger("click")
    $(".add").on("click", function () {
        parent.newproduct()
    })

    function isclick() {
        // if (islist == 6) {
        //     layer.close(subindex);
        //     $(".checklist").trigger("click")
        // }
    }

    
})

function renderForm() {
    layui.use('form', function () {
        var form = layui.form;
        form.render()
    });
}

// 删除
function delreport(id) {
    var index = layer.confirm('确认删除？', {
        btn: ['确定', '取消'] //按钮
    }, function () {
        var token = $.cookie("token");
        $.ajax({
            type: "POST",
            async: false,
            url: rempveReportlist,
            data: {
                F_Id: id
            },
            success: function (res) {
                var data = res.Data;
                //console.log(data)
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

var issure=true;
function gethbdata(id){
 
    var oldetails;
    $.ajax({
        url:getReportone + '?keyvalue=' + id,
        success:function(res){
            console.log(res)
            if(res.Succeed){
                var data=res.Data.Details[0]
                oldetails=data
                // 实做数  ReportEntry_Quantity
                $("#ReportEntry_Quantity").attr("data-num",data.ReportEntry_Quantity)
                // 合格数  ReportEntry_Qualified
                $("#ReportEntry_Qualified").attr("data-num",data.ReportEntry_Qualified)
                // 作废数  ReportEntry_Scrap
                $("#ReportEntry_Scrap").attr("data-num",data.ReportEntry_Scrap)
            }else{
                alert(res.Message)
            }
        }
    })

    
    $(".editsave").on("click",function(){
        var issure=true;
        var quant=($("#ReportEntry_Quantity").val())||0
        var quanted=($("#ReportEntry_Qualified").val())||0
        var scrp=($("#ReportEntry_Scrap").val())||0
        var correctnum=parseInt(quant)-parseInt(scrp)
        if(!quant){
            alert("实做数量不能为空")
        }else if(!quanted){
            alert("合格数量不能为空")
        }else if(correctnum!=parseInt(quanted)){
            alert("请核对数据")
            issure=false
        }else{
            issure=true;
        }
        if(issure){
            var data={}, details=[]
            data.F_Id=id
            // 类型
            var reporttype=$("#ReportEntry_Type option:selected").val()
            // 操作者
            var bill=$("#ReportEntry_Biller option:selected").val()
            // 备注
            var rmark=$("#Rmark").val()
            // 实做数  ReportEntry_Quantity
            var quantity=$("#ReportEntry_Quantity").attr("data-num");
            var oldquantity=oldetails.ReportEntry_Quantity;
            var newquantity=parseInt(quantity)+parseInt(oldquantity)
            oldetails.ReportEntry_Quantity=newquantity
            console.log(newquantity)
            // 合格数  ReportEntry_Qualified
            var qualified=$("#ReportEntry_Qualified").attr("data-num")
            var oldqualified=oldetails.ReportEntry_Qualified;
            var newqualified=parseInt(qualified)+parseInt(oldqualified)
            oldetails.ReportEntry_Qualified=newqualified
            // 作废数  ReportEntry_Scrap
            var scrap=$("#ReportEntry_Scrap").attr("data-num")
            var oldscrap=oldetails.ReportEntry_Scrap;
            var newscrap=parseInt(scrap)+parseInt(oldscrap)
            oldetails.ReportEntry_Scrap=newscrap
            console.log(oldetails)
            details.push(oldetails)
            data.Details=details
            console.log(data)
            // if(issure){
            //     var subindex = layer.load();
            //     $.ajax({
            //         type: 'POST',
            //         url: editReportone,
            //         data: data,
            //         success: function (res) {
            //             console.log(res)
            //             var isussecc = res.Succeed
            //             if (isussecc) {
            //                 layer.close(subindex);
            //                 layer.msg("汇报成功");
            //             } else {
            //                 layer.close(subindex);
            //                 alert(res.Message)
            //             }
            //         }
            //     })
            // }else{
            //     alert("请核对数据")
            // }
        }
       
    })

}
