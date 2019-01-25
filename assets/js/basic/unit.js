var deflutid=[],deflutnick=[]
$(function () {
    $(".add").on("click", function () {
        $(".termask").removeClass("hidden");
        $(".editsave").addClass("hidden");
        $(".save").removeClass("hidden");
        $(".masktitle").html("新增计量单位");
        $("#Measure_Name").val("");
        $("#Measure_Nick").val("");
    })
    $(".cancel,.iconclose").on("click",function(){
        $(".termask").addClass("hidden");
        $(".termform")[0].reset()
    })

    function renderForm() {
        layui.use('form', function () {
            var form = layui.form;
            form.render();
        });
    }
// 基础单位
    $.ajax({
        type: "get",
        url: basicMea,
        success: function (res) {
            console.log(res)
            var isussecc = res.Succeed;
            var data = res.Data.Details;
            if (isussecc) {
                var html = '<option value="">全部</option>';
                var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                for (var i = 0; i < data.length; i++) {
                    html += '<option value="' + data[i].DictionaryItem_Value + '" >' + data[i].DictionaryItem_Nick + '</option>';
                    htmlsel += '<dd lay-value="' + data[i].DictionaryItem_Value + '" >' + data[i].DictionaryItem_Nick + '</dd>'
                    deflutid.push(data[i].DictionaryItem_Value)
                    deflutnick.push(data[i].DictionaryItem_Nick)
                }
                $("#Measure_Default").html(html);
                $(".basicmea .layui-anim.layui-anim-upbit").html(htmlsel);
                renderForm();
                // _this.find("select").next().find('.layui-select-title input').click();

            } else {
                alert(res.Message)
            }

        }
    })

    var laydate;
    layui.use(['form', 'layedit', 'laydate', "jquery"], function () {
        var form = layui.form
            , layer = layui.layer
            , $ = layui.jquery;
        laydate = layui.laydate;

    });

    var token = $.cookie("token");
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
            { field: 'Measure_Name', title: '计量单位代码', align: 'center' },
            { field: 'Measure_Nick', title: '计量单位名称', align: 'center' },
            {
                field: 'F_Id', title: '操作', align: 'center', templet: function (d) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-danger"  onclick=editmeasure("' + d.F_Id + '")>修改</a><a class="layui-btn layui-btn-xs layui-btn-danger"  onclick=delmeasure("' + d.F_Id + '")>删除</a>';
                }
            }

        ];

        $.ajax({
            // type: "POST",
            // async: false,
            url: ajaxMea,
            // data:datas,
            success: function (res) {
                console.log(res)
                tablerender(str, res.Data);

            }
        })

    })
    $(".checklist").trigger("click");

    $(".save").on("click",function(){
        var name=$("#Measure_Name").val();
        var nick=$("#Measure_Nick").val();
        var defult=$("#Measure_Default option:selected").val()
        var data={
            Measure_Name:name,
            Measure_Nick:nick,
            Measure_Default:defult
        }
        $.ajax({
            type: "POST",
            async: false,
            url: addMea,
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
        var name=$("#Measure_Name").val();
        var nick=$("#Measure_Nick").val();
        var defult=$("#Measure_Default option:selected").val()
        var id=$(".editsave").attr("data-id")
        var data={
            Measure_Name:name,
            Measure_Nick:nick,
            Measure_Default:defult,
            F_Id:id
        }
        $.ajax({
            type: "POST",
            async: false,
            url: editMea,
            data: data,
            success: function (res) {
                console.log(res)
                var isussecc =res.Succeed;
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
            url: remvoeMea,
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

            }
        })
    });


}

function editmeasure(id){
    $(".termask").removeClass("hidden");
    $(".editsave").removeClass("hidden");
    $(".save").addClass("hidden");
    $(".masktitle").html("修改计量单位");
    $.ajax({
        async: false,
        url: ajaxMeaone+'?keyword='+id+'&PageIndex=&PageSize=',
        success: function (res) {
            console.log(res)
            var isussecc = res.Succeed;
            var data=res.Data;
            if (isussecc) {
            var data=res.Data;
                $("#Measure_Name").val(data[0].Measure_Name);
                $("#Measure_Nick").val(data[0].Measure_Nick);
              
                var select1 = 'dd[lay-value="' + data[0].Measure_Default  + '"]';
                $('#Measure_Default').siblings("div.layui-form-select").find('dl').find(select1).click();
                $(".editsave").attr("data-id",data[0].F_Id)
            } else {
                alert(res.Message)
            }

        }
    })
}