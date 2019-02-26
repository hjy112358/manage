$(function () {
    $(".add").on("click", function () {
        //  parent.addmater()
        $(".termask").removeClass("hidden");
        $(".termask .masktitle").html("新增物料");
        $(".termask .save").removeClass("hidden");
        $(".termask .editsave").addClass("hidden");
        addnew()

         
    })
    $(".cancel,.iconclose").on("click",function(){
        $(".termask").addClass("hidden");
        $(".terform")[0].reset()
    })
    var layer;
    function renderForm() {
        layui.use('form', function () {
            var form = layui.form;
            form.render();
        });
    }

    layui.use(['form', 'layedit', 'laydate', "jquery"], function () {
        var form = layui.form
            , $ = layui.jquery;
        laydate = layui.laydate;
        layer = layui.layer;
       
        function tablerender(str, data) {
            layui.use(['jquery', 'table'], function () {
                var $ = layui.$,
                    table = layui.table;
                table.render({
                    elem: '#analy'
                    , loading: true
                    , toolbar: true
                    , cols: [str]
                    , data: data
                    , page: true
                    , limits: [1000, 2000, 3000, 4000, 5000]
                    , limit: 1000
                });

                table.on('rowDouble(analy)', function (obj) {
                    ////console.log(obj)
                    // parent.editmater(obj.data.Material_Name, obj.data.Material_Nick)
                    $(".termask").removeClass("hidden");
                    $(".termask .masktitle").html("修改物料");
                    $(".termask .editsave").removeClass("hidden");
                    $(".termask .save").addClass("hidden");
                    edit(obj.data.Material_Name,obj.data.Material_Nick,obj.data.F_Id)
                });

            })
        }
        $(".checklist").on("click", function () {
            var index = layer.load();
            var token = $.cookie("token");
            var str = [
                { type: 'numbers', title: '序号', width: "5%" },
                //  {field:'id', title:'ID',   unresize: true, sort: true, totalRowText: '合计'}
                // {field:'FCheck', title:'类别',align:'center'},
                { field: 'Material_Name', title: '代码', align: 'center' },
                { field: 'Material_Nick', title: '宝贝名称', align: 'center' },
                { field: 'Material_Specifications', title: '型号', align: 'center' },
                { field: 'Material_Type', title: '类别', align: 'center' },
                { field: 'Material_Measure', title: '计量单位', align: 'center' },
                {
                    field: 'F_Id', title: '操作', align: 'center', templet: function (d) {
                        return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.F_Id + '" onclick=delmater("' + d.F_Id + '")><i class="layui-icon layui-icon-delete"></i>删除</a>';
                    }
                }

            ];
// 物料列表
            $.ajax({
                async: false,
                url: ajaxMater,
                // data:datas,
                success: function (res) {
                    ////console.log(res)
                    var data = res.Data;
                    var success = res.Succeed;
                    var msg = res.Message;
                    if (success) {
                        layer.close(index);
                        tablerender(str, data);
                    } else {
                        layer.close(index);
                        alert(msg);
                    }

                }
            })

        })
        $(".checklist").trigger("click")

    })

    

});

function delmater(id) {
    var index = layer.confirm('确认删除？', {
        btn: ['确定', '取消'] //按钮
    }, function () {
        var token = $.cookie("token");
        var data = {
            F_Id: id
        }
        $.ajax({
            type: "POST",
            async: false,
            url:removeMater,
            data: data,
            success: function (res) {
                //////console.log(res)
                var isussecc = res.Succeed;
                if (isussecc) {
                    layer.close(index)
                    $(".checklist").trigger("click");
                } else {
                    layer.close(index);
                    alert(JSON.parse(res).Message)
                }

            }
        })
    });
}
var renderForm1;
var token = $.cookie("token");
renderForm1 = function () {
    layui.use('form', function () {
        var form = layui.form;
        form.render();
    });
}
function addnew(){
    var layer;
    //layui 模块化引用
    layui.use(['jquery', 'table', 'layer', "form", "layedit", "laydate"], function () {
        var $ = layui.$,
            form = layui.form,
            laydate = layui.laydate;
        layer = layui.layer;
        // 类别列表
        $(".matertype").on("click", function () {
            var _this = $(this);
            var date = _this.attr("data-type");
           
            if (date == 'daten') {
                $(".matertype").attr("data-type", "datey");
                $.ajax({
                    url: materFlist,
                    success: function (res) {
                        var data = res.Data;
                        var isussecc = res.Succeed;
                        if (isussecc) {
                            var html = '<option value="">全部</option>';
                            var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                            for (var i = 0; i < data.length; i++) {
                                var nowdata = data[i];
                                html += '<option value="' + nowdata.F_Id + '" >' + nowdata.Family_Nick + '</option>';
                                htmlsel += '<dd lay-value="' + nowdata.F_Id + '">' + nowdata.Family_Nick + '</dd>'
                            }
                            $("#matertype").html(html);
                            $(".matertype .layui-anim.layui-anim-upbit").html(htmlsel);
                            renderForm();
                            _this.find("select").next().find('.layui-select-title input').click();
    
                        } else {
                            alert(data.Message)
                        }
                    }
                })
            }
        })
    
    // 计量单位列表
        $(".unit").on("click", function () {
            var _this = $(this);
            var date = _this.attr("data-type");
            var token = $.cookie("token");
            if (date == 'daten') {
                $(".unit").attr("data-type", "datey");
                $.ajax({
                    type:"GET",
                    url: ajaxMea,
                    success: function (res) {
                        var data = res.Data;
                        var isussecc = res.Succeed;
                        if (isussecc) {
                            var html = '<option value="">全部</option>';
                            var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                            for (var i = 0; i < data.length; i++) {
                                html += '<option value="' + data[i].F_Id + '">' + data[i].Measure_Nick + '</option>';
                                htmlsel += '<dd lay-value="' + data[i].F_Id + '">' + data[i].Measure_Nick + '</dd>'
                            }
                            $("#unittype").html(html);
                            $(".unittype .layui-anim.layui-anim-upbit").html(htmlsel);
                            renderForm();
                            _this.find("select").next().find('.layui-select-title input').click();
    
                        } else {
                            alert(data.Message)
                        }
                    }
                })
            }
        })
    
        renderForm = function () {
            layui.use('form', function () {
                var form = layui.form;
                form.render();
            });
        }
        $(".save").on("click", function () {
            var _this = $(this);
            var token = $.cookie("token");
            var measure = $("#unittype option:selected").text();
            var matertype = $("#matertype option:selected").text();
            var nick = $("#Material_Nick").val();
            var name = $("#Material_Name").val();
            if (!matertype || matertype == '请选择') {
                alert("请选择类别");
                isure = false;
                return;
            } else if (!nick) {
                alert("请填写名称");
                isure = false;
                return;
            } else if (!name) {
                alert("请填写代码");
                isure = false;
                return;
            } else if (!measure || measure == '请选择') {
                alert("请选择计量单位");
                isure = false;
                return;
            } else {
                isure = true;
            }
            if (isure) {
                var index = layer.load();
                var data = {
                    Material_Type: matertype,
                    Material_Nick: $("#Material_Nick").val(),
                    Material_Name: $("#Material_Name").val(),
                    Material_Specifications: $("#Material_Specifications").val(),
                    Material_Measure: measure
                }
    
                $.ajax({
                    type: "POST",
                    url: addMater,
                    data: data,
                    success: function (res) {
                        ////console.log(res)
                        var data = res.Succeed;
                        if (data) {
                            layer.close(index);
                            layer.msg("新增成功");
                            setInterval(function () {
                                window.location.reload()
                            }, 1000)
    
                        } else {
                            alert(res.Message);
                            layer.close(index);
                        }
                    }
                })
    
            }
        })
    
    
    });
}

var layerload;
function edit(matename,maternick,id){
    var token = $.cookie("token");
        layerload = layer.load();
        $(".matertype").attr("data-type", "datey");
        $(".unit").attr("data-type", "datey");
        $.ajax({
            url: ajaxMaterone+'?keyword='+id+'&PageIndex=&PageSize=',
            success: function (res) {
                var data = res.Data;
                var isussecc = res.Succeed;
                if (isussecc) {
                    var checktype = data[0].Material_Type;
                    var unity = data[0].Material_Measure;
                    getmatertype(checktype, unity);

                    $("#Material_Nick").val(data[0].Material_Nick)
                    $("#Material_Specifications").val(data[0].Material_Specifications)
                    $("#Material_Name").val(data[0].Material_Name);
                    $(".sub").attr("isnew", data[0].Material_Id);
                } else {
                    alert(data.Message);
                    layer.close(layerload)
                }
            }
        })
    
   
   

    var isure = true;
    
    $(".editsave").on("click", function () {
        var _this = $(this);
        var token = $.cookie("token");
        var measure = $("#unittype option:selected").text();
        var matertype = $("#matertype option:selected").text();
        var nick = $("#Material_Nick").val();
        var name = $("#Material_Name").val();
        if (!matertype || matertype == '请选择') {
            alert("请选择类别");
            isure = false;
            return;
        } else if (!nick) {
            alert("请填写名称");
            isure = false;
            return;
        } else if (!name) {
            alert("请填写代码");
            isure = false;
            return;
        } else if (!measure || measure == '请选择') {
            alert("请选择计量单位");
            isure = false;
            return;
        } else {
            isure = true;
        }
        if (isure) {
            var index = layer.load();
            var data = {
                Material_Type: matertype,
                Material_Nick: $("#Material_Nick").val(),
                Material_Name: $("#Material_Name").val(),
                Material_Specifications: $("#Material_Specifications").val(),
                Material_Measure: measure
            }
          
            var data = {
                Material_Type: matertype,
                Material_Nick: $("#Material_Nick").val(),
                Material_Name: $("#Material_Name").val(),
                Material_Specifications: $("#Material_Specifications").val(),
                Material_Measure: measure,
                F_Id: id
            }
            $.ajax({
                type: "POST",
                url: editMater,
                data: data,
                success: function (res) {
                    ////console.log(res)
                    var data =res.Succeed;
                    if (data) {
                        layer.close(index);
                        layer.msg("修改成功");
                        setInterval(function () {
                            window.location.reload()
                        }, 1000)

                    } else {
                        alert(JSON.parse(res).Message);
                        layer.close(index);
                    }
                }
            })
        }
    })
}
layui.form.on('select(selecstyle)', function (data) {
    renderForm1()
    var value = data.value;
    var datalist = [];
    var datehtml = '';
    var token = $.cookie("token");
    $.ajax({
        type: 'GET',
        url: materFlistone+'?keyword='+value+'&PageIndex=&PageSize=',
        success: function (res) {
            var data = res.Data;
            ////console.log(data)
            var isussecc = res.Succeed;
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    var nowdata = data[i];

                    datalist.push(nowdata);
                    datehtml += ' <div class="layui-form-lsit fl">' +
                        '<label class="layui-form-label">' + nowdata.FamilyEntry_Nick + '：</label>' +
                        '<div class="layui-input-block  " >' +
                        ' <input type="text" name="" id="" autocomplete="off" class="layui-input" data-name="' + nowdata.FamilyEntry_Name + '"  data-type="' + nowdata.FamilyEntry_Datatype + '">' +
                        '</div>' +
                        '</div>';
                }
                $(".typestyle div").html(datehtml)
                ////console.log(datalist)
            }
        }
    })

})

function getmatertype(checktype, unity) {
    $.ajax({
        url:materFlist,
        success: function (res) {
            var data =res.Data;
            var isussecc = res.Succeed;
            if (isussecc) {
                var html = '<option value="">请选择</option>';
                var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">请选择</dd>'
                for (var i = 0; i < data.length; i++) {
                    var nowdata = data[i]
                    html += '<option value="' + nowdata.F_Id + '" >' + nowdata.Family_Nick + '</option>';
                    htmlsel += '<dd lay-value="' + nowdata.F_Id + '">' + nowdata.Family_Nick + '</dd>';
                    if (nowdata.Family_Nick == checktype) {
                        var materid = nowdata.F_Id
                    }
                }
                $("#matertype").html(html);
                $(".matertype .layui-anim.layui-anim-upbit").html(htmlsel);
                renderForm1();
                var select = 'dd[lay-value="' + materid + '"]';
                $('#matertype').siblings("div.layui-form-select").find('dl').find(select).click();;
                getunit(unity, materid)

            } else {
                alert(data.Message);
                layer.close(layerload)
            }
        }
    })
}

function getunit(unity, materid) {

    $.ajax({
        url: ajaxMea,
        success: function (res) {
            var data = res.Data;
            var isussecc =res.Succeed;
            if (isussecc) {
                var html = '<option value="">请选择</option>';
                var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">请选择</dd>'
                for (var i = 0; i < data.length; i++) {
                    var nowdata = data[i];
                    html += '<option value="' + nowdata.F_Id + '">' + nowdata.Measure_Nick + '</option>';
                    htmlsel += '<dd lay-value="' + nowdata.F_Id + '">' + nowdata.Measure_Nick + '</dd>';
                    if (unity && unity == nowdata.Measure_Nick) {
                        var measure = nowdata.F_Id;
                    }
                }
                $("#unittype").html(html);
                $(".unittype .layui-anim.layui-anim-upbit").html(htmlsel);
                renderForm1();
                if (unity) {
                    var select = 'dd[lay-value="' + measure + '"]';
                    $('#unittype').siblings("div.layui-form-select").find('dl').find(select).click();;
                }
                getblong(materid)

            } else {
                alert(data.Message);
                layer.close(layerload)
            }
        }
    })
}


function getblong(materid) {
    $.ajax({
        type: 'GET',
        url: materFlistone + '?keyword='+ materid+'&PageIndex=&PageSize=' ,
        success: function (res) {
            var data = res.Data;
            var datalist = [];
            var datehtml = '';
            var isussecc = res.Succeed;
            if (isussecc) {
                for (var i = 0; i < data.length; i++) {
                    var nowdata = data[i];
                    datalist.push(nowdata);
                    datehtml += ' <div class="layui-form-lsit fl">' +
                        '<label class="layui-form-label">' + nowdata.FamilyEntry_Nick + '：</label>' +
                        '<div class="layui-input-block  " >' +
                        ' <input type="text" name="" id="" autocomplete="off" class="layui-input" data-name="' + nowdata.FamilyEntry_Name + '"  data-type="' + nowdata.FamilyEntry_Datatype + '">' +
                        '</div>' +
                        '</div>';

                }
                $(".typestyle div").html(datehtml);
                layer.close(layerload)

            } else {
                alert(data.Message);
                layer.close(layerload)
            }
        }
    })

}







