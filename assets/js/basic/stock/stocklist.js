// 渲染table
var layer;
function tablerender(str, data) {
    layui.use(['jquery', 'table'], function () {
        var $ = layui.$,
            table = layui.table;
            layer=layui.layer;
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
                    $(".termask").removeClass("hidden");
                    $(".masktitle").html("修改仓库信息");
                    $(".save").addClass("hidden")
                    $(".editsave").removeClass("hidden")
                    var id=obj.data.F_Id
                    $(".editsave").attr("data-id",id)
                    $("#Stock_Name").val(obj.data.Stock_Name)
                    $("#Stock_Nick").val(obj.data.Stock_Nick)
                });
            }
        });
        return false;
    })
}

$(function () {
   
    var islist = false;
//  查询
    $(".checklist").on("click", function () {
        var str = [
            { title: '序号', type: 'numbers' },
            { field: 'Stock_Nick', title: '仓库名称'},
            { field: 'Stock_Name', title: '仓库代码'},
            {
                field: 'F_Id', title: '操作', align: 'center', templet: function (d) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-danger" onclick=delscale("' + d.F_Id + '")>删除</a>';
                }
            }
        ]
        $.ajax({
            type: "GET",
            async: false,
            url: ajaxURl + "/api/PSIBase/Stock/GetList?keyword=&PageSize=&PageIndex=&Total=&PageCount=",
            success: function (res) {
                var data = res.Data;
                console.log(data)
                var isussecc = res.Succeed;
                if (isussecc) {                  
                    tablerender(str, data);
                } else {
                    alert(res.Message)
                }
            }
        })

    })

    $(".checklist").trigger("click")

    $(".add").on("click", function () {
        $(".termask").removeClass("hidden")
        $(".masktitle").html("新增仓库信息")
        $(".save").removeClass("hidden")
        $(".editsave").addClass("hidden")
    })

    $(".cancel").on("click",function(){
        $(".termask").addClass("hidden")
    })
    // 新增
    $(".save").on("click",function(){
        var indexlay=layer.load();
        $.ajax({
            type:"POST",
            url:ajaxaddstock,
            data:{
                Stock_Name:$("#Stock_Name").val(),
                Stock_Nick:$("#Stock_Nick").val()
            },
            success:function(res){
                console.log(res)
                if(res.Succeed){
                    layer.close(indexlay);
                    layer.msg("新增成功");
                    setInterval(function () {
                        window.location.reload()
                    }, 1000) 
                }else{
                    alert(res.Message)
                }
            }
        })
    })
    // 修改
    $(".editsave").on("click",function(){
        var indexlay=layer.load();
        var id=$(".editsave").attr("data-id")
        $.ajax({
            type:"POST",
            url:ajaxeditstock,
            data:{
                Stock_Name:$("#Stock_Name").val(),
                Stock_Nick:$("#Stock_Nick").val(),
                F_Id:id
            },
            success:function(res){
                console.log(res)
                if(res.Succeed){
                    layer.close(indexlay);
                    layer.msg("修改成功");
                    setInterval(function () {
                        window.location.reload()
                    }, 1000) 
                }else{
                    alert(res.Message)
                }
            }
        })
    })
    
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
        $.ajax({
            type: "POST",
            url: ajaxremovestock,
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

