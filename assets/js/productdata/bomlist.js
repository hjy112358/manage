$(function () {
// bom分组
    $(".checktype").on("click", function () {
        var _this = $(this);
        var date = _this.attr("data-type");
        if (date == 'daten') {
            $(".checktype").attr("data-type", "datey");
            $.ajax({
                type: "get",
                url: matertype,
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
                        }
                        $("#BillOfMaterial_Type").html(html);
                        $(".checktype .layui-anim.layui-anim-upbit").html(htmlsel);
                        reloadform();
                        _this.find("select").next().find('.layui-select-title input').click();

                    } else {
                        alert(res.Message)
                    }
                }
            })
        }
    })

    $(".checklist").on('click',function(){
        var id=$("#BillOfMaterial_Type option:selected").val()
        console.log(id)
        $.ajax({
            type: "get",
            url: bomlistone+'keyword='+id+'&PageSize=&PageIndex=',
            success: function (res) {
                console.log(res)
                var isussecc = res.Succeed;
                var data = res.Data;
                if (isussecc) {
                    var str = [
                        { title: '序号', type: 'numbers', width: '80' },
                        { field: 'BillOfMaterial_Name', title: 'BOM代码', width: "150", },                      
                        // {field: 'Assign_Type', title: '工单类型', align: 'center', width: "150",templet:function(d){
                        //     var index2= asstypeid.indexOf(d.Assign_Type)
                        //     if (index2 == '-1') {
                        //         return ''
                        //     } else {
                        //         return asstypenick[index2]
                        //     } 
                        // }},
                        // {
                        //     field: 'F_Id', title: '操作', align: 'center', width:'100',templet: function (d) {
                        //         return '<a class="layui-btn layui-btn-xs layui-btn-danger" onclick=delscale("' + d.F_Id + '")>删除</a>';
                        //     }
                        // }
                    ]
                    tablerender(str,data)
                } else {
                    alert(res.Message)
                }
            }
        })
    })
})


function reloadform() {
    layui.use('form', function () {
        var form = layui.form;
        form.render()
    });
}


// 渲染table
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
            , done: function () {
                table.on('rowDouble(dataTable)', function (obj) {
                    console.log(obj);
                    parent.getproduct(obj.data.F_Id)
                });
            }
        });
        return false;
    })
}