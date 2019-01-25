
var renderForm;
var first = new Date().valueOf();
window.viewObj = {
    tbData: [{
        tempId: first,
        term: '',
        FQty: '',
        FNote: '',
        state: 0,
        FFetchDate: '',
        FMaterialName: ''
    }],
    limit: 1,
    last: first
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
            { field: 'term1', title: '主联系人', edit: 'text' },
            { field: 'term3', title: '姓名', edit: 'text' },
            { field: 'term3', title: '生日', edit: 'text' },
            { field: 'term4', title: '公司电话', edit: 'text' },
            { field: 'term5', title: '手机号码', edit: 'text' },
            { field: 'term6', title: '传真', edit: 'text' },
            { field: 'term7', title: '电子邮件', edit: 'text' },
            { field: 'term8', title: 'qq号码', edit: 'text' },
            // 领料差异=计划用量-实际用料
            { field: 'term9', title: '地址', edit: 'text' },
            { field: 'term10', title: '部门', edit: 'text' },
            { field: 'term11', title: '职位', edit: 'text' },
            { field: 'term12', title: '备注', edit: 'text' },
            {
                field: 'tempId', title: '操作', align: 'center', templet: function (d) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.tempId + '"><i class="layui-icon layui-icon-delete"></i>删除</a>';
                }
            }
        ]],
        done: function (res, curr, count) {
            viewObj.tbData = res.data;
           
           

        }
    });


    //定义事件集合
    var active = {
        add: function () {	//添加一行
            viewObj.limit = viewObj.limit + 1;
            var oldData = table.cache[layTableId];
            // console.log(oldData);
            var tid = new Date().valueOf();
            var newRow = { tempId: tid, term: "", FQty: "", date: "", FNote: "", state: 0, FMaterialName: '' };
            oldData.push(newRow);
            viewObj.last = tid;
            tableIns.reload({
                data: oldData,
                limit: viewObj.limit
            });
        },
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
        console.log('监听工具条');
        console.log(data);
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
    table.on('edit(dataTable)', function (obj) {
        var oldData = table.cache[layTableId];
        // console.log(oldData)
        // if (!$.isNumeric(obj.value)) {
        //     for (var i = 0; i < oldData.length; i++) {
        //         var datenow = oldData[i];
        //         if (datenow.tempId === obj.data.tempId) {
        //             datenow.dates = "";
        //             layer.alert("请输入数字");
        //         }
        //     }
        // }
        if (obj.data.tempId == viewObj.last) {
            activeByType("add");
        }
        tableIns.reload({
            data: oldData,
            limit: viewObj.limit
        });
    });
    var isend = true;
    var savedate;
    var lastid;
    // 保存
    $(".sub.cus").on("click", function () {
   
        return false
    })
    
    
   

  
    renderForm=function(){
        layui.use('form', function () {
            var form = layui.form;
            form.render();
        
        });
    }
});


$(function(){


    $(document).on("click", function () {
        $("#tablelist .layui-table-body").addClass("overvis");
        $("#tablelist .layui-table-box").addClass("overvis");
        $("#tablelist .layui-table-view").addClass("overvis");
    })

    

})

   





