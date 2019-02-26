$(function () {
    $(".add").on("click", function () {
        $(".termask").removeClass("hidden");
        $(".editsave").addClass("hidden");
        $(".save").removeClass("hidden");
        $(".masktitle").html("新增工序");
        $("#Measure_Name").val("");
        $("#Measure_Nick").val("");
    })
    $(".cancel,.iconclose").on("click",function(){
        $(".termask").addClass("hidden");
    })
    function tablerender(str, data) {
        layui.use(['jquery', 'table'], function () {
            var $ = layui.$,
                table = layui.table;
            table.render({
                elem: '#analy'
                , toolbar: true
                , cols: [str]
                , data: data
                , page: true
                , limits: [1000, 2000, 3000, 4000, 5000]
                , limit: 1000
            });

            // table.on('rowDouble(analy)', function (obj) {
            //     console.log(obj)
            //     parent.editmater(obj.data.Material_Name, obj.data.Material_Nick)
            // }); 

        })
    }
    $(".checklist").on("click", function () {
        var str = [
            { type: 'numbers', title: '序号', width: "5%" },
            //  {field:'id', title:'ID',   unresize: true, sort: true, totalRowText: '合计'}
            // {field:'FCheck', title:'类别',align:'center'},
            { field: 'Process_Name', title: '工序代码', align: 'center' },
            { field: 'Process_Nick', title: '工序名称', align: 'center' },
            {
                field: 'F_Id', title: '操作', align: 'center', templet: function (d) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.F_Id + '" onclick=editmeasure("' + d.F_Id + '")>修改</a><a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.F_Id + '" onclick=delmeasure("' + d.F_Id + '")>删除</a>';
                }
            }

        ];

        $.ajax({
            type: "GET",
            async: false,
            url: processlist,
            success: function (res) {
                console.log(res)
                tablerender(str, res.Data);

            }
        })

    })
    $(".checklist").trigger("click");

    $(".save").on("click",function(){
        var name=$("#Process_Name").val();
        var nick=$("#Process_Nick").val();
        var data={
            Process_Name:name,
            Process_Nick:nick
        }
        $.ajax({
            type: "POST",
            async: false,
            url: addprocess,
            data: data,
            success: function (res) {
                console.log(res)
                var isussecc = res.Succeed;
                if (isussecc) {
                    $(".termask").addClass("hidden");
                    $(".checklist").trigger("click");
                } else {
                    alert(res.Message);
                }

            }
        })
    })

    $(".editsave").on("click",function(){
        var name=$("#Process_Name").val();
        var nick=$("#Process_Nick").val();
        var id=$(".editsave").attr("data-id")
        var data={
            Process_Name:name,
            Process_Nick:nick,
            F_Id:id
        }
        $.ajax({
            type: "POST",
            async: false,
            url:editprocess,
            data: data,
            success: function (res) {
                console.log(res)
                var isussecc = res.Succeed;
                if (isussecc) {
                    $(".termask").addClass("hidden");
                    $(".checklist").trigger("click");
                } else {
                    alert(res.Message);
                }

            }
        })
    })
})


function delmeasure(id) {
    var index = layer.confirm('确认删除？', {
        btn: ['确定', '取消'] //按钮
    }, function () {
        var data = {
            F_Id: id
        }
        $.ajax({
            type: "POST",
            async: false,
            url: removeprocess,
            data: data,
            success: function (res) {
                console.log(res)
                var isussecc = res.Succeed;
                if (isussecc) {
                    layer.close(index)
                    $(".checklist").trigger("click");
                } else {
                    alert(res.Message)
                }

            },
            error:function(res){
                console.log(res)
            }
        })
    });


}

function editmeasure(id){
    $(".termask").removeClass("hidden");
    $(".editsave").removeClass("hidden");
    $(".save").addClass("hidden");
    $(".masktitle").html("修改工序");
    $.ajax({
        url: processlist+id,
        success: function (res) {
            console.log(res)
            var isussecc = res.Succeed;
            var data=res.Data;
            if (isussecc) { 
                $("#Process_Name").val(data[0].Process_Name);
                $("#Process_Nick").val(data[0].Process_Nick);
                $(".editsave").attr("data-id",data[0].F_Id)
            } else {
                alert(res.Message)
            }

        }
    })
}