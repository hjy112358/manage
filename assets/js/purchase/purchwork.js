// // var myDate = new Date();
// // var nowY = myDate.getFullYear();
// // var nowM = myDate.getMonth() + 1;
// // var nowD = myDate.getDate();
// // var today = nowY + "-" + (nowM < 10 ? "0" + nowM : nowM) + "-" + (nowD < 10 ? "0" + nowD : nowD);
// // //layui 模块化引用
// // var upload;
// // layui.use(['jquery', 'table', 'layer', "form", "layedit", "laydate", "upload"], function () {
// //     var $ = layui.$;
// //     table = layui.table,
// //         form = layui.form,
// //         layer = layui.layer,
// //         layedit = layui.layedit,
// //         laydate = layui.laydate,
// //         upload = layui.upload,
// //         element = layui.element;

// //     //日期
// //     laydate.render({
// //         elem: '#date',
// //         value: today,
// //         isInitValue: true,
// //         btns: ['now', 'confirm']
// //     });
// // });


// // var dataList = [];
// // var first = new Date().valueOf();
// // window.viewObj = {
// //     tbData: [{
// //         tempId: first,
// //         term: '',
// //         FQty: '',
// //         FNote: '',
// //         state: 0,
// //         FFetchDate: '',
// //         FMaterialName: '',
// //         Material_Nick: '',
// //         Material_Specifications: '',
// //         Material_Measure: ''
// //     }],
// //     limit: 1,
// //     last: first
// // };
// // var tableIns;
// // //layui 模块化引用
// // layui.use(['jquery', 'table', 'layer', "form", "layedit", "laydate"], function () {
// //     var $ = layui.$,
// //         form = layui.form,
// //         layer = layui.layer,
// //         layedit = layui.layedit,
// //         laydate = layui.laydate,
// //         element = layui.element,
// //         table = layui.table;
// //     //数据表格实例化		
// //     var layTableId = "layTable";
// //     tableIns = table.render({
// //         elem: '#dataTable',
// //         id: layTableId,
// //         data: viewObj.tbData,
// //         limit: viewObj.limit,
// //         page: false,
// //         loading: true,
// //         even: true,
// //         cols: [[
// //             { title: '序号', type: 'numbers' },
// //             { field: 'term', title: '物料', templet: '#selectTool' },
// //             { field: 'FQty', title: '客户料号', edit: 'text' },
// //             { field: 'Material_Specifications', title: '规格型号', edit: 'text' },
// //             { field: 'Material_Measure', title: '单位', edit: 'text' },
// //             { field: 'FNote', title: '数量', edit: 'text' },
// //             { field: 'FNote', title: '单价', edit: 'text' },
// //             { field: 'FNote', title: '含税单价', edit: 'text' },
// //             { field: 'FNote', title: '金额', edit: 'text' },
// //             { field: 'FNote', title: '税率(%)', edit: 'text' },
// //             { field: 'FNote', title: '税额', edit: 'text' },
// //             { field: 'FNote', title: '价税合计', edit: 'text' },

// //             {
// //                 field: 'FFetchDate', title: '交货日期', templet: function (d) {
// //                     return '<input type="text" name="FFetchDate" verify lay-verify="verify" value="' + (d.FFetchDate || '') + '" placeholder="请选择交货时间" readonly="readonly" class="layui-input layui-input-date"/>';
// //                 }
// //             },
// //             { field: 'FNote', title: '备注', edit: 'text' },
// //             {
// //                 field: 'tempId', title: '操作', align: 'center', templet: function (d) {
// //                     return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.tempId + '"><i class="layui-icon layui-icon-delete"></i>移除</a>';
// //                 }
// //             }
// //         ]],
// //         done: function (res, curr, count) {
// //             viewObj.tbData = res.data;
// //             var scrollHeight = $('#tableRes .layui-table-body.layui-table-main').prop("scrollHeight");
// //             $('#tableRes .layui-table-body.layui-table-main').animate({ scrollTop: scrollHeight }, 400);
// //             $(".layui-input-date").each(function (i) {
// //                 layui.laydate.render({
// //                     elem: this,
// //                     format: "yyyy-MM-dd",
// //                     done: function (value, date) {
// //                         if (res && res.data[i]) {
// //                             $.extend(res.data[i], { 'FFetchDate': value })
// //                         }
// //                     }
// //                 });
// //             });
// //             tableData = res.data;
// //             prolist();
// //             $('tr').each(function (e) {
// //                 var $cr = $(this);
// //                 var dataIndex = $cr.attr("data-index");
// //                 $.each(tableData, function (index, value) {
// //                     if (value.LAY_TABLE_INDEX == dataIndex) {
// //                         $cr.find('input').val(value.term);
// //                         $cr.find('input[name="FFetchDate"]').val(value.FFetchDate);
// //                     }
// //                 });
// //             });

// //             // $("#tablelist .layui-table-view .layui-table td[data-field='FMaterialName']").on("click", function () {
// //             //     console.log(1);
// //             //     var scrollHeight = $('#tableRes .layui-table-body.layui-table-main').prop("scrollHeight");
// //             //     $('#tableRes .layui-table-body.layui-table-main').animate({ scrollTop: scrollHeight }, 600);
// //             // })
// //         }
// //     });


// //     //定义事件集合
// //     var active = {
// //         add: function () {	//添加一行
// //             viewObj.limit = viewObj.limit + 1;
// //             var oldData = table.cache[layTableId];
// //             // console.log(oldData);
// //             var tid = new Date().valueOf();
// //             var newRow = { tempId: tid, term: "", FQty: "", date: "", FNote: "", state: 0, FMaterialName: '', Material_Nick: '', Material_Specifications: '', Material_Measure: '' };
// //             oldData.push(newRow);
// //             viewObj.last = tid;
// //             tableIns.reload({
// //                 data: oldData,
// //                 limit: viewObj.limit
// //             });
// //         },
// //         updateRow: function (obj) {
// //             var oldData = table.cache[layTableId];
// //             // console.log(oldData);
// //             tableIns.reload({
// //                 data: oldData,
// //                 limit: viewObj.limit
// //             });
// //         },
// //         removeEmptyTableCache: function () {
// //             var oldData = table.cache[layTableId];
// //             // console.log(oldData)
// //             for (var i = 0, row; i < oldData.length; i++) {
// //                 row = oldData[i];
// //                 if (!row || !row.tempId) {
// //                     oldData.splice(i, 1);    //删除一项
// //                 }
// //                 continue;
// //             }
// //             viewObj.last = oldData[oldData.length - 1].tempId;
// //             tableIns.reload({
// //                 data: oldData,
// //                 limit: viewObj.limit
// //             });
// //         }
// //     }
// //     //激活事件
// //     var activeByType = function (type, arg) {
// //         if (arguments.length === 2) {
// //             active[type] ? active[type].call(this, arg) : '';
// //         } else {
// //             active[type] ? active[type].call(this) : '';
// //         }
// //     }
// //     //注册按钮事件
// //     $('.layui-btn[data-type]').on('click', function () {
// //         var type = $(this).data('type');
// //         activeByType(type);
// //     });
// //     //监听工具条
// //     table.on('tool(dataTable)', function (obj) {
// //         var data = obj.data, event = obj.event, tr = obj.tr; //获得当前行 tr 的DOM对象;
// //         console.log('监听工具条');
// //         console.log(data);
// //         switch (event) {
// //             case "state":
// //                 var stateVal = tr.find("input[name='state']").prop('checked') ? 1 : 0;
// //                 $.extend(obj.data, { 'state': stateVal })
// //                 activeByType('updateRow', obj.data);	//更新行记录对象
// //                 break;
// //             case "del":
// //                 if (viewObj.limit == 1) {
// //                     alert("删除失败，至少应有一条数据")
// //                 } else {
// //                     viewObj.limit = viewObj.limit - 1;
// //                     layer.confirm('确定删除？', function (index) {
// //                         obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
// //                         layer.close(index);
// //                         activeByType('removeEmptyTableCache');

// //                     });
// //                 }
// //                 break;
// //         }
// //     });
// //     table.on('edit(dataTable)', function (obj) {
// //         var oldData = table.cache[layTableId];
// //         // console.log(oldData)
// //         // if (!$.isNumeric(obj.value)) {
// //         //     for (var i = 0; i < oldData.length; i++) {
// //         //         var datenow = oldData[i];
// //         //         if (datenow.tempId === obj.data.tempId) {
// //         //             datenow.dates = "";
// //         //             layer.alert("请输入数字");
// //         //         }
// //         //     }
// //         // }
// //         // if (obj.data.tempId == viewObj.last) {
// //         //     activeByType("add");
// //         // }
// //         tableIns.reload({
// //             data: oldData,
// //             limit: viewObj.limit
// //         });
// //     });


// //     var isend = true;
// //     var savedate;
// //     var lastid;
// //     // 保存
// //     $(".sub").on("click", function () {
// //         lastid = viewObj.last;
// //         var checkprobegin = $("#checkprobegin").val();
// //         var perbefore = $("#perbefore").val();
// //         if (!checkprobegin) {
// //             alert("请选择供应商");
// //             isend = false;
// //         } else if (!perbefore) {
// //             alert("请选择业务员");
// //             isend = false;
// //         } else {
// //             isend = true;
// //             for (var i = 0; i < oldData.length; i++) {
// //                 if (oldData[i].FMaterialName == '') {
// //                     if (oldData[i].tempId != viewObj.last) {
// //                         alert("物料不能为空");
// //                         isend = false;
// //                     } else {
// //                         isend = true;
// //                     }
// //                 }
// //             }
// //         }
// //         if (oldData[oldData.length - 1].FMaterialName == '') {
// //             var newD = oldData;
// //             newD.splice(newD.length - 1, 1);
// //         }
// //         // 单据编号
// //         var FBillNo = $("#FBillNo").val();
// //         // 制单员
// //         var zd = $("#zd").val();
// //         // 客户
// //         var FCustomName = $("#checkprobegin").val();
// //         //业务员
// //         var ywy = $("#perbefore").val();
// //         var datelist = {
// //             FBillNo: FBillNo,//单据编号
// //             zd: zd,//制单员
// //             FDate: $("#date").val(),//单据日期
// //             FCustomName: FCustomName,//客户
// //             yw: ywy,//业务员
// //             lsit: newD
// //         }


// //         //列表
// //         console.log(datelist)
// //         return false
// //     })
// //     // 审核
// //     $(".audit").on("click", function () {
// //         $(".sub").trigger("click");
// //         if (isend) {

// //         }
// //         return false
// //     })
// //     // 变更

// //     // 新增
// //     $(".add").on("click", function () {
// //         viewObj.limit = 1;
// //         tableIns.reload({
// //             data: viewObj.tbData,
// //             limit: viewObj.limit
// //         });
// //     })


// //     var token = $.cookie("token");

// //     // 制单人
// //     var mouser = $.cookie("Modify_User");
// //     var username = $.cookie("User_Nick")
// //     $("#PurchaseApply_Biller").val(mouser)
// //     $("#PurchaseApply_Billername").val(username)
// //     // 申请人
// //     var mouser = $.cookie("Modify_User");
// //     var username = $.cookie("Employee_Nick")
// //     $("#PurchaseApply_Employee").val(mouser)
// //     $("#PurchaseApply_Employeename").val(username)
// //     // 单据日期
// //     var mouser = $.cookie("Modify_User");
// //     var username = $.cookie("PurchaseApply_DateTime")
// //     $("#PurchaseApply_DateTime").val(mouser)
// //     $("#PurchaseApply_DateTimename").val(username)
// //     // 单据状态
// //     var mouser = $.cookie("Modify_User");
// //     var username = $.cookie("DictionaryItem_Nick")
// //     $("#PurchaseApply_Status").val(mouser)
// //     $("#PurchaseApply_Statusname").val(username)

// //     // 供应商
// //     $(".supplier").on("click", function () {
// //         var _this = $(this);
// //         var date = _this.attr("data-type");
// //         if (date == 'daten') {
// //             $(".supplier").attr("data-type", "datey");
// //             $.ajax({
// //                 type: "get",
// //                 url:ajaxSupplier,
// //                 success: function (res) {
// //                     console.log(res)
// //                     var isussecc = res.Succeed;
// //                     var data = res.Data;
// //                     if (isussecc) {
// //                         var html = '<option value="">全部</option>';
// //                         var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
// //                         for (var i = 0; i < data.length; i++) {
// //                             html += '<option value="' + data[i].F_Id + '" >' + data[i].Supplier_Nick + '</option>';
// //                             htmlsel += '<dd lay-value="' + data[i].F_Id + '" >' + data[i].Supplier_Nick + '</dd>'
// //                         }
// //                         $("#SupplierMaterial_Supplier").html(html);
// //                         $(".supplier .layui-anim.layui-anim-upbit").html(htmlsel);
// //                         renderForm();
// //                         _this.find("select").next().find('.layui-select-title input').click();
// //                         // Customer_TaxRate 税率   
// //                     } else {
// //                         alert(res.Message)
// //                     }

// //                 }
// //             })
// //         }
// //     })


// //     // 业务员
// //     $(".scalelists").on("click", function () {
// //         var _this = $(this);
// //         var date = _this.attr("data-type");
// //         if (date == 'daten') {
// //             $(".scalelists").attr("data-type", "datey");
// //             $.ajax({
// //                 type: "get",
// //                 url: ajaxUsr,
// //                 success: function (res) {
// //                     console.log(res)
// //                     var isussecc = res.Succeed;
// //                     var data = res.Data;
// //                     if (isussecc) {
// //                         var html = '<option value="">全部</option>';
// //                         var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
// //                         for (var i = 0; i < data.length; i++) {
// //                             html += '<option value="' + data[i].F_Id + '">' + data[i].User_Nick + '</option>';
// //                             htmlsel += '<dd lay-value="' + data[i].F_Id + '">' + data[i].User_Nick + '</dd>'
// //                         }
// //                         $("#SalesOrder_Employee").html(html);
// //                         $(".scalelists .layui-anim.layui-anim-upbit").html(htmlsel);
// //                         renderForm();
// //                         _this.find("select").next().find('.layui-select-title input').click();
// //                     } else {
// //                         alert(res.Message)
// //                     }

// //                 }
// //             })
// //         }
// //     })
// //     function renderForm() {
// //         layui.use('form', function () {
// //             var form = layui.form;
// //             form.render();
// //             var oldData = table.cache[layTableId];
// //             tableIns.reload({
// //                 data: oldData,
// //                 limit: viewObj.limit
// //             });
// //         });
// //     }


// //     $(document).on("click", function () {
// //         $("#tablelist .layui-table-body").addClass("overvis");
// //         $("#tablelist .layui-table-box").addClass("overvis");
// //         $("#tablelist .layui-table-view").addClass("overvis");
// //     })

// //     $(document).bind('click', function (event) {
// //         console.log(111)
// //         var evt = event.srcElement ? event.srcElement : event.target;
// //         if (!($(".selectlist").hasClass("hidden"))) {
// //             if (evt.id == 'checkmater') return; // 如果是元素本身，则返回
// //             else {
// //                 $(".selectlist").addClass("hidden");
// //             }
// //         }
// //     });


// //     //多文件列表示例
// //     var tablehead = $('#tablehead');
// //     var tablebody = $('#tablebody');
// //     var imgcount = 0;
// //     var headhtml = "<tr><th>文件名</th><th>大小</th><th>操作</th></tr>";
// //     var uploadListIns = upload.render({
// //         elem: '#testList'
// //         , url: '/upload/'
// //         , accept: 'file'
// //         , multiple: true
// //         , auto: false
// //         , bindAction: '#testListAction'
// //         , choose: function (obj) {
// //             var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
// //             tablehead.html(headhtml)
// //             //读取本地文件
// //             obj.preview(function (index, file, result) {
// //                 imgcount++;
// //                 var tr = $(['<tr id="upload-' + index + '">'
// //                     , '<td>' + file.name + '</td>'
// //                     , '<td class="textc">' + (file.size / 1014).toFixed(1) + 'kb</td>'
// //                     , '<td class="textc">'
// //                     , '<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>'
// //                     , '</td>'
// //                     , '</tr>'].join(''));
// //                 //删除
// //                 tr.find('.demo-delete').on('click', function () {
// //                     delete files[index]; //删除对应的文件
// //                     tr.remove();
// //                     uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
// //                     imgcount--;
// //                     if (imgcount == 0) {
// //                         tablehead.html("")
// //                     }

// //                 });

// //                 tablebody.append(tr);
// //             });
// //         }

// //     });

// //     var htmlterm = '';
// //     var arrlist = [];
// //     var arri = {};
// //     function prolist(){
       
// //         $(".productworktable td[data-field='term']").each(function () {
// //             var curnow = $(this);
// //             curnow.on("click", function () {
// //                 $("#tablelist .layui-table-body").addClass("overvis");
// //                 $("#tablelist .layui-table-box").addClass("overvis");
// //                 $("#tablelist .layui-table-view").addClass("overvis");
               
// //                 var _this = $(this);
// //                 var dataIndex = _this.parents("tr").attr("data-index");
// //                 _this.find(".checkmater").addClass("layui-form-selected")
// //                 var date = $(".productworktable").attr("data-type");
// //                 if (date == 'daten') {
// //                     $(".productworktable").attr("data-type", "datey");
// //                     $("#tableRes").find("tr").each(function(i,v){
// //                         var nowtr=v;
// //                         var nowindex=$(v).attr("data-index");
// //                         if(dataIndex!=nowindex){
// //                             console.log($(nowtr).find("selectlist"))
// //                             // $(nowtr).find("selectlist").addClass("hidden")
// //                         }else{
// //                             $(nowtr).find(".selectlist").removeClass("hidden");
// //                             $(nowtr).find(".dateload").addClass("hidden")
// //                             $(nowtr).find(".datelist").removeClass("hidden")
// //                         }
// //                     });
    
// //                     $.ajax({
// //                         url: ajaxMater,
// //                         success: function (res) {
// //                             $(".dateload").addClass("hidden")
// //                             $(".datelist").removeClass("hidden")
// //                             console.log(JSON.parse(res))
// //                             var data = JSON.parse(res).Data;
// //                             var isussecc = JSON.parse(res).Succeed;
    
// //                             // data[i].Material_Name data[i].Material_Nick  data[i].Material_Specification
// //                             for (var i = 0; i < data.length; i++) {
// //                                 var datanow = data[i];
// //                                 htmlterm += '<li data-name="' + datanow.Material_Name + '" data-nick="' + datanow.Material_Nick + '" data-spe="' + datanow.Material_Specifications + '" data-materme="' + datanow.Material_Measure + '"><p>' + datanow.Material_Name + '</p><p>' + datanow.Material_Nick + '</p><p>' + datanow.Material_Specifications + '</p></li>'
// //                                 arri = { materame: datanow.Material_Name, maternick: datanow.Material_Nick, matersp: datanow.Material_Specifications, matermea: datanow.Material_Measure };
// //                                 arrlist.push(arri)
// //                             }
// //                             $(".selectlist ul").html(htmlterm);
    
    
// //                             $(".materName").on("keyup", function () {
// //                                 var searchVal = $(this).val();
// //                                 var showList = [];
// //                                 var searchlist = '';
// //                                 //将和所输入的字符串匹配的项存入showList
// //                                 //将匹配项显示，不匹配项隐藏
// //                                 $.each(arrlist, function (index, item) {
// //                                     if (item.materame.indexOf(searchVal) != -1 || item.maternick.indexOf(searchVal) != -1 || item.matersp.indexOf(searchVal) != -1) {
// //                                         showList.push(item);
// //                                     } else {
    
// //                                     }
// //                                 })
// //                                 console.log(showList)
// //                                 for (var j = 0; j < showList.length; j++) {
// //                                     var shownow = showList[j]
// //                                     searchlist += '<li data-name="' + shownow.materame + '" data-nick="' + shownow.maternick + '" data-spe="' + shownow.matersp + '" data-materme="' + shownow.matermea + '"><p>' + shownow.materame + '</p><p>' + shownow.maternick + '</p><p>' + shownow.matersp + '</p></li>'
// //                                 }
// //                                 if (showList.length == 0) {
// //                                     searchlist = '<div style="text-align:center;padding:15px 0">暂无数据</div>'
// //                                 }
// //                                 $(".selectlist ul").html("");
// //                                 $(".selectlist ul").html(searchlist);
    
// //                             })
// //                             $('.selectlist ul').find('li').each(function () {
// //                                 var _this1 = $(this);
// //                                 _this1.hover(function () {
// //                                     $(this).addClass("active").siblings().removeClass("active")
// //                                 });
// //                                 _this1.on("click", function () {
// //                                     var oldData = table.cache[layTableId];
// //                                     console.log(oldData)
// //                                     var name = $(this).attr("data-name");
// //                                     var nick = $(this).attr("data-nick");
// //                                     var specife = $(this).attr("data-spe");
// //                                     var measure = $(this).attr("data-materme");
// //                                     $(".materName").val(name);
// //                                     $(".maternick").val(nick);
// //                                     $(".materspe").val(specife);
// //                                     $("#measure").val(measure);
// //                                     $.each(tableData, function (index, value) {
// //                                         console.log(value)
// //                                         if (value.LAY_TABLE_INDEX == dataIndex) {
// //                                             value.term = name;
// //                                             value.Material_Nick = nick
// //                                             value.Material_Specifications = specife;
// //                                             value.Material_Measure = measure
// //                                             if (value.tempId == viewObj.last) {
// //                                                 activeByType("add");
// //                                             } else {
// //                                                 var oldData = table.cache[layTableId];
// //                                                 tableIns.reload({
// //                                                     data: oldData,
// //                                                     limit: viewObj.limit
// //                                                 });
// //                                             }
// //                                         }
// //                                     });
// //                                     $(".selectlist").addClass("hidden");
// //                                     $(".checkmater").removeClass("layui-form-selected");
// //                                     return false
// //                                 })
// //                             })
// //                         }
// //                     })
// //                 } else {
                   
                   
// //                     $(".selectlist ul").html(htmlterm);
// //                     $("#tableRes").find("tr").each(function(i,v){
// //                         var nowtr=v;
// //                         var nowindex=$(v).attr("data-index");
// //                         if(dataIndex!=nowindex){
// //                             console.log($(nowtr).find("selectlist"))
// //                             // $(nowtr).find("selectlist").addClass("hidden")
// //                         }else{
// //                             $(nowtr).find(".selectlist").removeClass("hidden");
// //                             $(nowtr).find(".dateload").addClass("hidden")
// //                             $(nowtr).find(".datelist").removeClass("hidden")
// //                         }
// //                     });

// //                     $(".materName").on("keyup", function () {
// //                         var searchVal = $(this).val();
// //                         var showList = [];
// //                         var searchlist = '';
// //                         //将和所输入的字符串匹配的项存入showList
// //                         //将匹配项显示，不匹配项隐藏
// //                         $.each(arrlist, function (index, item) {
// //                             if (item.materame.indexOf(searchVal) != -1 || item.maternick.indexOf(searchVal) != -1 || item.matersp.indexOf(searchVal) != -1) {
// //                                 showList.push(item);
// //                             } else {
    
// //                             }
// //                         })
// //                         console.log(showList)
// //                         for (var j = 0; j < showList.length; j++) {
// //                             var shownow = showList[j]
// //                             searchlist += '<li data-name="' + shownow.materame + '" data-nick="' + shownow.maternick + '" data-spe="' + shownow.matersp + '" data-materme="' + shownow.matermea + '"><p>' + shownow.materame + '</p><p>' + shownow.maternick + '</p><p>' + shownow.matersp + '</p></li>'
// //                         }
// //                         if (showList.length == 0) {
// //                             searchlist = '<div style="text-align:center;padding:15px 0">暂无数据</div>'
// //                         }
// //                         $(".selectlist ul").html("");
// //                         $(".selectlist ul").html(searchlist);
// //                         $("#tableRes").find("tr").each(function(i,v){
// //                             var nowtr=v;
// //                             var nowindex=$(v).attr("data-index");
// //                             if(dataIndex!=nowindex){
// //                                 $(nowtr).find("selectlist").addClass("hidden")
// //                             }
// //                         });
    
// //                     })
// //                     $('.selectlist ul').find('li').each(function () {
// //                         var _this1 = $(this);
// //                         _this1.hover(function () {
// //                             $(this).addClass("active").siblings().removeClass("active")
// //                         });
// //                         _this1.on("click", function () {
// //                             var oldData = table.cache[layTableId];
// //                             console.log(oldData)
// //                             var name = $(this).attr("data-name");
// //                             var nick = $(this).attr("data-nick");
// //                             var specife = $(this).attr("data-spe");
// //                             var measure = $(this).attr("data-materme");
// //                             $(".materName").val(name);
// //                             $(".maternick").val(nick);
// //                             $(".materspe").val(specife);
// //                             $("#measure").val(measure);
// //                             $.each(tableData, function (index, value) {
// //                                 console.log(value)
// //                                 if (value.LAY_TABLE_INDEX == dataIndex) {
// //                                     value.term = name;
// //                                     value.Material_Nick = nick
// //                                     value.Material_Specifications = specife;
// //                                     value.Material_Measure = measure
// //                                     if (value.tempId == viewObj.last) {
// //                                         activeByType("add");
// //                                     } else {
// //                                         var oldData = table.cache[layTableId];
// //                                         tableIns.reload({
// //                                             data: oldData,
// //                                             limit: viewObj.limit
// //                                         });
// //                                     }
// //                                 }
// //                             });
// //                             $(".selectlist").addClass("hidden");
// //                             $(".checkmater").removeClass("layui-form-selected");
// //                             return false
// //                         })
// //                     })
// //                 }
// //                 return false;
// //             })
    
    
// //         })
// //     }



// // });

// // 第二版
// var materid = [], maternick = [], matername = [], stocklist = [];
// var myDate = new Date();
// var nowY = myDate.getFullYear();
// var nowM = myDate.getMonth() + 1;
// var nowD = myDate.getDate();
// var today = nowY + "-" + (nowM < 10 ? "0" + nowM : nowM) + "-" + (nowD < 10 ? "0" + nowD : nowD);
// //layui 模块化引用

// layui.use(['jquery', 'table', 'layer', "form", "layedit", "laydate"], function () {
//     var $ = layui.$;
//     table = layui.table,
//         form = layui.form,
//         layer = layui.layer,
//         layedit = layui.layedit,
//         laydate = layui.laydate,
//         element = layui.element;
//     //日期
//     laydate.render({
//         elem: '#date',
//         value: today,
//         isInitValue: true,
//         btns: ['now', 'confirm']
//     });
// });
// // 物料
// $.ajax({
//     url: ajaxMater,
//     success: function (res) {
//         var data = res.Data;
//         var isussecc = res.Succeed;
//         // console.log(data)
//         if (isussecc) {
//             for (var i = 0; i < data.length; i++) {
//                 materid.push(data[i].F_Id)
//                 maternick.push(data[i].Material_Nick)
//                 matername.push(data[i].Material_Name)
//             }
//         }
//     }
// })


// // 表格渲染
// var renderFormNext;
// window.viewObj = {
//     tbData: [],
//     limit: 1
// };
// var tableIns;
// //layui 模块化引用
// layui.use(['jquery', 'table', 'layer', "form", "layedit", "laydate","upload"], function () {

//     var $ = layui.$;
//         form = layui.form,
//         layer = layui.layer,
//         layedit = layui.layedit,
//         laydate = layui.laydate,
//         element = layui.element,
//         upload = layui.upload,
//         table = layui.table;
//     //数据表格实例化		
//     var layTableId = "layTable";
//     tableIns = table.render({
//         elem: '#dataTable',
//         id: layTableId,
//         data: viewObj.tbData,
//         limit: viewObj.limit,
//         page: false,
//         loading: true,
//         // even: true,
//         cols: [[
//             { title: '序号', type: 'numbers' },
//             { field: 'Material_Name', title: '<span style="color:red">*  </span>物料', templet: '#selectTool', width: '120' },
//             // {
//             //     field: '', title: '物料代码', templet: function (d) {
//             //         if (d.PurchaseOrderEntry_Material) {
//             //             var index = materid.indexOf(d.PurchaseOrderEntry_Material)
//             //             if (index == '-1') {
//             //                 return ''
//             //             } else {
//             //                 return matername[index]
//             //             }
//             //         } else {
//             //             return ''
//             //         }
//             //     }
//             // },
//             {
//                 field: '', title: '物料名称', templet: function (d) {
//                     if (d.PurchaseOrderEntry_Material) {
//                         var index1 = materid.indexOf(d.PurchaseOrderEntry_Material)
//                         if (index1 == '-1') {
//                             return ''
//                         } else {
//                             return maternick[index1]
//                         }
//                     } else {
//                         return ''
//                     }
//                 }
//             },
//             { field: 'PurchaseOrderEntry_Specifications', title: '规格' },
//             { field: 'PurchaseOrderEntry_Unit', title: '计量单位' },
//             { field: 'PurchaseOrderEntry_Name', title: '批号' },
//             { field: 'PurchaseOrderEntry_Quantity', title: '数量' },
//             { field: 'PurchaseOrderEntry_DateTime', title: '收货时间', edit: 'text' },
//             { field: 'PurchaseOrderEntry_StartTime', title: '发货时间', templet: '#selectstock' },
//             { field: 'PurchaseOrderEntry_Project', title: '项目', templet: '#selectstock' },
//             // { field: 'PurchaseOrderEntry_Tax', title: '税额', templet: '#selectstock' },
//             // { field: 'PurchaseOrderEntry_Total', title: '实际开票', templet: '#selectstock' },
//             // { field: 'PurchaseOrderEntry_Currency', title: '币别', templet: '#selectstock' },
//             { field: 'Rmark', title: '备注', edit: 'text' },
//             {
//                 field: 'F_Id', title: '操作', align: 'center', templet: function (d) {
//                     // return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.F_Id + '">删除</a>';
//                     return '<a class="layui-btn layui-btn-xs layui-btn-danger" onclick=del("' + d.F_Id + '")>删除</a>';

//                 }
//             }
//         ]],
//         done: function (res, curr, count) {
//             viewObj.tbData = res.data;
//             var scrollHeight = $('#tableRes .layui-table-body.layui-table-main').prop("scrollHeight");
//             $('#tableRes .layui-table-body.layui-table-main').animate({ scrollTop: scrollHeight }, 400);
//             tableData = res.data;
//             $('#tableRes tr').each(function (e) {
//                 var $cr = $(this);
//                 var dataIndex = $cr.attr("data-index");
//                 $.each(tableData, function (index, value) {
//                     if (value.LAY_TABLE_INDEX == dataIndex) {
//                         $cr.find('input').val(value.stock);
//                         // $cr.find('input[name="FFetchDate"]').val(value.FFetchDate);
//                     }
//                 });
//             });
//             // console.log(res.data)
//         }
//     });

//     // //定义事件集合
//     // var active = {
//     //     // 更新
//     //     updateRow: function (obj) {
//     //         var oldData = table.cache[layTableId];
//     //         // console.log(oldData);
//     //         tableIns.reload({
//     //             data: oldData,
//     //             limit: viewObj.limit
//     //         });
//     //     },
//     //     // 删除
//     //     // removeEmptyTableCache: function () {
//     //     //     var oldData = table.cache[layTableId];
//     //     //     // console.log(oldData)
//     //     //     for (var i = 0, row; i < oldData.length; i++) {
//     //     //         row = oldData[i];
//     //     //         if (!row || !row.tempId) {
//     //     //             oldData.splice(i, 1);    //删除一项
//     //     //         }
//     //     //         continue;
//     //     //     }
//     //     //     viewObj.last = oldData[oldData.length - 1].tempId;
//     //     //     tableIns.reload({
//     //     //         data: oldData,
//     //     //         limit: viewObj.limit
//     //     //     });
//     //     // }
//     // }
//         //定义事件集合
//         var active = {
//             add: function () {	//添加一行
//                 viewObj.limit = viewObj.limit + 1;
//                 var oldData = table.cache[layTableId];
   
//                 // console.log(oldData);
//                 var tid = new Date().valueOf();
//                 // 向下添加表头定义
//                 var newRow = {
//                     tempId: tid,
//                     state: 0,
//                     Material_Name: '',//物料代码
//                     Material_Nick: '',//物料名称
//                    PurchaseOrderEntry_Material: '',//物料--物料id
//                    PurchaseOrderEntry_Specifications : '',//销售规格
//                    PurchaseOrderEntry_Unit: '',//单位
//                    PurchaseOrderEntry_Quantity: '',//数量    数量=未税金额/销售单价
//                    PurchaseOrderEntry_Quantity: '',//销售单价
//                    PurchaseOrderEntry_Amount: '',//未税金额 数量*销售单价
//                    PurchaseOrderEntry_TaxRate: "",//税率 
//                    PurchaseOrderEntry_Tax: "",//税额 PurchaseOrderEntry_Tax=PurchaseInvoiceEntry_Total-PurchaseInvoiceEntry_Amount
//                    PurchaseOrderEntry_TaxPrice: "",//含税单价 (税率  / 100 * 销售单价) + 销售单价
//                    PurchaseOrderEntry_Total: '',//价税合计  价税合计=未税金额*(1+税率/100)
//                    PurchaseOrderEntry_ExRate: viewObj.rate,//汇率
//                    PurchaseOrderEntry_Deadline: "",//交货日期
//                    PurchaseOrderEntry_Project:'',//项目
//                    Remark: '',//备注
//                    PurchaseOrderEntry_PurchaseInvoice: ''
//                 };
//                 oldData.push(newRow);
//                 viewObj.last = tid;
//                 tableIns.reload({
//                     data: oldData,
//                     limit: viewObj.limit
//                 });
//             },
//             updateRow: function () {
//                 var oldData = table.cache[layTableId];
//                 // console.log(oldData);
//                 tableIns.reload({
//                     data: oldData,
//                     limit: viewObj.limit
//                 });
//             },
//         }
//         //激活事件
//         var activeByType = function (type, arg) {
//             if (arguments.length === 2) {
//                 active[type] ? active[type].call(this, arg) : '';
//             } else {
//                 active[type] ? active[type].call(this) : '';
//             }
//         }
//     //注册按钮事件
//     $('.layui-btn[data-type]').on('click', function () {
//         var type = $(this).data('type');
//         activeByType(type);
//     });



//     //监听工具条
//     // table.on('tool(dataTable)', function (obj) {
//     //     var data = obj.data, event = obj.event, tr = obj.tr; //获得当前行 tr 的DOM对象;
//         // console.log('监听工具条');
//         // // console.log(data);
//         // if(event === "del"){
//         //     layer.confirm("你确定要删除该数据表么,删除之后不可恢复？",{btn:['是的,我确定','取消']},
//         //     // $.ajax({
//         //     //     url:'/api/PSIPurchase/PurchaseOrder/Remove',
//         //     //     data:{'id':data.F_Id},
//         //     //     type:"post",
//         //     //     success:function(res){
//         //     //         layer.msg('已删除')
//         //     //     }
//         //     // })
//         //             function(){
//         //                 $.post("/api/PSIPurchase/PurchaseOrder/Remove",{"id":data.F_Id},function (res){
//         //                     if(res.success){
//         //                         layer.msg("删除成功",{time: 1000},function(){
//         //                             // table.reload('test', t);
//         //                             layer.close(index);
//         //                         });
//         //                     }else{
//         //                         layer.msg(res.message);
//         //                     }

//         //                 });
//         //             }
//         //     )
//         // }

//         // switch (event) {
//         //     case "state":
//         //         var stateVal = tr.find("input[name='state']").prop('checked') ? 1 : 0;
//         //         $.extend(obj.data, { 'state': stateVal })
//         //         activeByType('updateRow', obj.data);	//更新行记录对象
//         //         break;
//         //     case "del":
//         //             viewObj.limit = viewObj.limit - 1;
//         //             layer.confirm('确定删除？', function (index) {
//         //                 obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
//         //                 layer.close(index);
//         //                 activeByType('removeEmptyTableCache');

//         //             });
//         //         // }
//         //         // break;
//         // }
//     // });
   
//     // 新增
//     var isSend = true;
//     // $("#SalesOrder_Id").val(id)
//     $(".add").on("click", function () {
//         var list = $("form").serializeArray();
//         var data={};
//         var newdata=[];
//         for(var j=0;j<list.length;j++){
//             data[list[j].name]=list[j].value
//         }
//         var oldData = table.cache[layTableId];
//         // console.log(oldData)
//         for (var j = 0; j < oldData.length; j++) {
//             var nowdata = oldData[j]
//             // console.log(newdata)
//             // if (nowdata.PurchaseOrderEntry_Material) {
//             //     // newdata.push(nowdata)
//             //     if (nowdata.PurchaseApply_Deadline == '') {
//             //         alert("请选择交货时间");
//             //         isSend = false;
//             //         return;
//             //     } else {
//             //         newdata.push(nowdata)
//             //         // continue
//             //     }
//             // }
//         }
//         // console.log(newdata)
//         // if (!($("#supplier").val())) {
//         //     alert("请选择供应商")
//         //     isSend = false;
//         // } else {
//         //     isSend = true;
//         // }
//         if (!($(this).hasClass("audit"))) {
//             if (isSend) {
//                 var index = layer.load();

//                 data.Details = newdata;
//                 data.SalesOrder_Status="10000"
//                 // console.log(list)
//                 $.ajax({
//                     type: "POST",
//                     url: purchaseOrderListAdd,
//                     data: data,
//                     success: function (res) {
//                         // console.log(res)
//                         var isussecc = res.Succeed;
//                         var data = res.Data;
//                         if (isussecc) {
//                             layer.close(index);
//                             layer.msg("审核成功");
//                             setInterval(function () {
//                                 window.location.reload()
//                             }, 1000)
//                         } else {
//                             layer.close(index);
//                             alert(res.Message)
//                         }
//                     }
//                 })
//             }

//         }
//     })


//     // 获取单据编号
//     $.ajax({
//         url: getnum,
//         success: function (res) {
//             if (res.Succeed) {
//                 $("#PurchaseOrderEntry_Name").val(res.Data)
//             } else {
//                 alert(res.Message)
//             }
//         }
//     })

//     // 制单人
//     var mouser = $.cookie("Modify_User");
//     var username = $.cookie("User_Nick")
//     $("#StockBill_Biller").val(mouser)
//     $("#StockBill_Billername").val(username)

  
//     // 供应商
//     $(".supplier").on("click", function () {
//         var _this = $(this);
//         var date = _this.attr("data-type");
//         if (date == 'daten') {
//             $(".supplier").attr("data-type", "datey");
//             $.ajax({
//                 type: "get",
//                 url:ajaxSupplier,
//                 success: function (res) {
//                     // console.log(res)
//                     var isussecc = res.Succeed;
//                     var data = res.Data;
//                     if (isussecc) {
//                         var html = '<option value="">全部</option>';
//                         var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
//                         for (var i = 0; i < data.length; i++) {
//                             html += '<option value="' + data[i].F_Id + '" >' + data[i].Supplier_Nick + '</option>';
//                             htmlsel += '<dd lay-value="' + data[i].F_Id + '" >' + data[i].Supplier_Nick + '</dd>'
//                         }
//                         $("#SupplierMaterial_Supplier").html(html);
//                         $(".supplier .layui-anim.layui-anim-upbit").html(htmlsel);
//                         renderForm();
//                         _this.find("select").next().find('.layui-select-title input').click();
//                         // Customer_TaxRate 税率   
//                     } else {
//                         alert(res.Message)
//                     }

//                 }
//             })
//         }
//     })

//         // 业务员
//     $(".scalelists").on("click", function () {
//         var _this = $(this);
//         var date = _this.attr("data-type");
//         if (date == 'daten') {
//             $(".scalelists").attr("data-type", "datey");
//             $.ajax({
//                 type: "get",
//                 url: ajaxUsr,
//                 success: function (res) {
//                     // console.log(res)
//                     var isussecc = res.Succeed;
//                     var data = res.Data;
//                     if (isussecc) {
//                         var html = '<option value="">全部</option>';
//                         var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
//                         for (var i = 0; i < data.length; i++) {
//                             html += '<option value="' + data[i].F_Id + '">' + data[i].User_Nick + '</option>';
//                             htmlsel += '<dd lay-value="' + data[i].F_Id + '">' + data[i].User_Nick + '</dd>'
//                         }
//                         $("#SalesOrder_Employee").html(html);
//                         $(".scalelists .layui-anim.layui-anim-upbit").html(htmlsel);
//                         renderForm();
//                         _this.find("select").next().find('.layui-select-title input').click();
//                     } else {
//                         alert(res.Message)
//                     }

//                 }
//             })
//         }
//     })
//     function renderForm() {
//         layui.use('form', function () {
//             var form = layui.form;
//             form.render();
//             var oldData = table.cache[layTableId];
//             tableIns.reload({
//                 data: oldData,
//                 limit: viewObj.limit
//             });
//         });
//     }


//     // 单号
//     $(".checkid").on("click", function () {
//         var _this = $(this);
//         var date = _this.attr("data-type");
//         if (date == 'daten') {
//             $(".checkid").attr("data-type", "datey");
//             $.ajax({
//                 type: "get",
//                 url: asslist,
//                 success: function (res) {
//                     // console.log(res)
//                     var isussecc = res.Succeed;
//                     var data = res.Data;
//                     if (isussecc) {
//                         var html = '<option value="">全部</option>';
//                         var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
//                         for (var i = 0; i < data.length; i++) {
//                             html += '<option value="' + data[i].F_Id + '" >' + data[i].Assign_Name + '</option>';
//                             htmlsel += '<dd lay-value="' + data[i].F_Id + '" >' + data[i].Assign_Name + '</dd>'
//                         }
//                         $("#order").html(html);
//                         $(".checkid .layui-anim.layui-anim-upbit").html(htmlsel);
//                         renderFormNext();
//                         _this.find("select").next().find('.layui-select-title input').click();

//                     } else {
//                         alert(res.Message)
//                     }

//                 }
//             })
//         }
//     })


//     // 切换订单号
//     layui.form.on('select(changeorder)', function (data) {
//         if (data.value != '') {
//             $.ajax({
//                 type: "get",
//                 url: getassone + data.value,
//                 success: function (res) {
//                     // console.log(res)
//                     var isussecc = res.Succeed;
//                     var data = res.Data;
//                     if (isussecc) {
//                         if (data.Children) {
//                             // console.log(data.Children)
//                             $.each(data.Children, function (index, value) {
//                                 value.PurchaseOrderEntry_Specifications = value.AssignEntry_Specifications
//                                 value.PurchaseOrderEntry_Unit = value.AssignEntry_Unit
//                                 value.PurchaseOrderEntry_Material = value.AssignEntry_Material
//                                 value.PurchaseOrderEntry_Quantity = value.AssignEntry_Quantity
//                                 value.PurchaseOrderEntry_DateTime = value.AssignEntry_DateTime
//                                 value.PurchaseOrderEntry_StartTime = value.AssignEntry_StartTime
//                                 value.PurchaseOrderEntry_Project = value.AssignEntry_Project
//                                 value.Remark = value.Remark
//                             })
//                             tableIns.reload({
//                                 data: data.Children,
//                                 limit: data.Children.length
//                             });
//                         }

//                     } else {
//                         alert(res.Message)
//                     }
//                 }
//             })
//         }
//     })
//     renderFormNext = function () {
//         layui.use('form', function () {
//             var form = layui.form;
//             form.render();
//             var oldData = table.cache[layTableId];
//             tableIns.reload({
//                 data: oldData,
//                 limit: viewObj.limit
//             });
//         });
//     }

//         // 制单人
//     var mouser = $.cookie("Modify_User");
//     var username = $.cookie("User_Nick")
//     $("#PurchaseApply_Biller").val(mouser)
//     $("#PurchaseApply_Billername").val(username)
//     // // 申请人
//     // var mouser = $.cookie("Modify_User");
//     // var username = $.cookie("Employee_Nick")
//     // $("#PurchaseApply_Employee").val(mouser)
//     // $("#PurchaseApply_Employeename").val(username)
//     // // 单据日期
//     // var mouser = $.cookie("Modify_User");
//     // var username = $.cookie("PurchaseApply_DateTime")
//     // $("#PurchaseApply_DateTime").val(mouser)
//     // $("#PurchaseApply_DateTimename").val(username)
//     // // 单据状态
//     // var mouser = $.cookie("Modify_User");
//     // var username = $.cookie("DictionaryItem_Nick")
//     // $("#PurchaseApply_Status").val(mouser)
//     // $("#PurchaseApply_Statusname").val(username)


//     // 保存
//     $(".sub").on("click", function () {
//         var list = $("form").serializeArray();
//         var oldData = table.cache[layTableId];
//         list.Details = oldData;
//         if (!($(this).hasClass("audit"))) {
//             var index = layer.load();
//             $.ajax({
//                 type: "POST",
//                 url: purchaseOrderListAdd,
//                 data: list,
//                 success: function (res) {
//                     // console.log(res)
//                     var isussecc = res.Succeed;
//                     var data = res.Data;
//                     if (isussecc) {
//                         layer.close(index);
//                         layer.msg("保存成功");
//                         setInterval(function () {
//                             window.location.reload()
//                         }, 1000)
//                     } else {
//                         layer.close(index);
//                         // alert(JSON.parse(res).Message)
//                     }
//                 }
//             })
//         }
//     })
// });
//      //多文件上传列表示例
//      var tablehead = $('#tablehead');
//      var tablebody = $('#tablebody');
//      var imgcount = 0;
//      var headhtml = "<tr><th>文件名</th><th>大小</th><th>操作</th></tr>";
//      var uploadListIns = upload.render({
//          elem: '#testList',
//          url:'/Api/PSIBase/FileInput/SetFile'        
//          , accept: 'file'
//          , multiple: true
//          , auto: false
//          , bindAction: '#testListAction'
//          , choose: function (obj) {
//              var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
//              tablehead.html(headhtml)
//              //读取本地文件
//              obj.preview(function (index, file, result) {
//                  imgcount++;
//                  var tr = $(['<tr id="upload-' + index + '">'
//                      , '<td>' + file.name + '</td>'
//                      , '<td class="textc">' + (file.size / 1014).toFixed(1) + 'kb</td>'
//                      , '<td class="textc">'
//                      , '<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>'
//                      , '</td>'
//                      , '</tr>'].join(''));
//                  //删除
//                  tr.find('.demo-delete').on('click', function () {
//                      delete files[index]; //删除对应的文件
//                      tr.remove();
//                      uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
//                      imgcount--;
//                      if (imgcount == 0) {
//                          tablehead.html("")
//                      }
 
//                  });
 
//                  tablebody.append(tr);
//              });
//          }
 
//      });

//     //  渲染表格
// $(function () {

//     $(document).on("click", function () {
//         $("#tableRes .layui-table-body").addClass("overvis");
//         $("#tableRes .layui-table-box").addClass("overvis");
//         $("#tableRes .layui-table-view").addClass("overvis");
//     })
//     $("#tablelist").on("click", function () {
//         $("#tablelist .layui-table-body").addClass("overvis");
//         $("#tablelist .layui-table-box").addClass("overvis");
//         $("#tablelist .layui-table-view").addClass("overvis");
//     })
// })


//      // 删除
//      function del(id) {
//         var index = layer.confirm('确认删除？', {
//             btn: ['确定', '取消'] //按钮
//         }, function () {
//             var token = $.cookie("token");
//             $.ajax({
//                 type: "POST",
//                 async: false,
//                 url:removecraftlist,
//                 data: {
//                     F_Id: id
//                 },
//                 success: function (res) {
//                     var data = res.Data;
//                     console.log(data)
//                     var succeed = res.Succeed;
//                     if (succeed) {
//                         layer.close(index)
//                         // curnow.trigger("click")
//                     } else {
//                         layer.close(index)
//                         alert(res.Message)
//                     }
//                 }
//             })
//         }); 
//     }

// 上一版683行
// 添加列表数据
var dataList = [];
var token = $.cookie("token");
// 记录id号
var currentId = [];
// 物料集合
var currentNike = [];
// 税率集合
var ratelAdd = [];
// 号码集合
var currentName = [];
// var first = new Date().valueOf();
// 数据源
var tData = [];
// var tempid = [];
var temip = [];
function getTid(i) {
    return (new Date().valueOf()) + i
}
for (var i = 0; i < 5; i++) {
    var k = i
    temip.push(getTid(k))
}


// 向下添加对应表头
for (var i = 0; i < 5; i++) {
    var data = {
        tempId: temip[i],
        state: 0,
        Material_Name: '',//物料编号
        Material_Nick: '',//物料名称
        PurchaseOrderEntry_Material: '',//物料id
        PurchaseOrderEntry_Specifications : '',//销售规格
        PurchaseOrderEntry_Unit: '',//单位
        PurchaseOrderEntry_Quantity: '',//数量    数量=未税金额/销售单价
        PurchaseOrderEntry_Price: '',//销售单价
        PurchaseOrderEntry_Amount: '',//未税金额 数量*销售单价
        PurchaseOrderEntry_TaxRate: "",//税率 
        PurchaseOrderEntry_Tax: "",//税额 PurchaseOrderEntry_Tax=PurchaseInvoiceEntry_Total-PurchaseInvoiceEntry_Amount
        PurchaseOrderEntry_TaxPrice: "",//含税单价 (税率  / 100 * 销售单价) + 销售单价
        PurchaseOrderEntry_Total: '',//价税合计  价税合计=未税金额*(1+税率/100)
        PurchaseOrderEntry_ExRate: '1',//汇率
        PurchaseOrderEntry_Deadline: "",//交货日期
        PurchaseOrderEntry_Project:'',//项目
    }
    tData.push(data);

}
window.viewObj = {
    tbData: tData,
    limit: 5,
    last: temip[4]
};
var tableIns;
var upload, table;
var layTableId;
//layui 模块化引用
layui.use(['jquery', 'table', 'layer', "form", "layedit", "laydate", "upload"], function () {
    // 获取当天日期
    var myDate = new Date();
    var nowY = myDate.getFullYear();
    var nowM = myDate.getMonth() + 1;
    var nowD = myDate.getDate();
    var today = nowY + "-" + (nowM < 10 ? "0" + nowM : nowM) + "-" + (nowD < 10 ? "0" + nowD : nowD);

    var $ = layui.$;
    table = layui.table,
        form = layui.form,
        layer = layui.layer,
        laydate = layui.laydate,
        upload = layui.upload,
        element = layui.element;
    //日期
    laydate.render({
        elem: '#date',
        value: today,
        isInitValue: true,
        btns: ['now', 'confirm']
    });

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
            { title: '序号', type: 'numbers' },
            { field: 'Material_Name', title: '<span style="color:red">*  </span>物料', templet: '#selectTool', width: '120' },
            { field: 'Material_Nick', title: '客户料号', width: '200' },
            { field: 'PurchaseOrderEntry_Specifications', title: '规格' },
            { field: 'PurchaseOrderEntry_Unit', title: '计量单位' },
            { field: 'PurchaseOrderEntry_Name', title: '批号' },
            { field: 'PurchaseOrderEntry_Quantity', title: '数量' },
            { field: 'PurchaseOrderEntry_DateTime', title: '收货时间', edit: 'text' },
            { field: 'PurchaseOrderEntry_StartTime', title: '发货时间', templet: '#selectstock' },
            { field: 'PurchaseOrderEntry_Project', title: '项目', templet: '#selectstock' },
            { field: 'Rmark', title: '备注', edit: 'text' },
            {
                field: 'F_Id', title: '操作', align: 'center', templet: function (d) {
                    // return '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del" lay-id="' + d.F_Id + '">删除</a>';
                    return '<a class="layui-btn layui-btn-xs layui-btn-danger" onclick=del("' + d.F_Id + '")>删除</a>';

                }
            }
        ]],
        done: function (res) {
            // console.log(res.data)
            viewObj.tbData = res.data;
            prolist();
            $(".layui-input-date").each(function (i) {
                layui.laydate.render({
                    elem: this,
                    format: "yyyy-MM-dd",
                    done: function (value, date) {
                        if (res && res.data[i]) {
                            console.log("up")
                            $.extend(res.data[i], { 'PurchaseOrderEntry_Deadline': value })
                        }
                    }
                });
            });
            tableData = res.data;
            $('tr').each(function (e) {
                var $cr = $(this);
                var dataIndex = $cr.attr("data-index");
                $.each(tableData, function (index, value) {
                    if (value.LAY_TABLE_INDEX == dataIndex) {
                        $cr.find('input').val(value.Material_Name);
                        $cr.find('input[id="PurchaseOrderEntry_Deadline"]').val(value.PurchaseOrderEntry_Deadline);

                    }
                });
            });


        }
    });


    //定义事件集合
    var active = {
        add: function () {	
            //不足时向下添加一行
            viewObj.limit = viewObj.limit + 1;
            var oldData = table.cache[layTableId];
            // console.log(oldData);
            var tid = new Date().valueOf();
            // 向下添加表头定义
            var newRow = {
                tempId: tid,
                state: 0,
                Material_Name: '',//物料代码
                Material_Nick: '',//物料名称
                PurchaseOrderEntry_Material: '',//物料--物料id
                PurchaseOrderEntry_Specifications : '',//销售规格
                PurchaseOrderEntry_Unit: '',//单位
                PurchaseOrderEntry_Quantity: '',//数量    数量=未税金额/销售单价
                PurchaseOrderEntry_Price: '',//销售单价
                PurchaseOrderEntry_Amount: '',//未税金额 数量*销售单价
                PurchaseOrderEntry_TaxRate: "",//税率 
                PurchaseOrderEntry_Tax: "",//税额 PurchaseOrderEntry_Tax=PurchaseInvoiceEntry_Total-PurchaseInvoiceEntry_Amount
                PurchaseOrderEntry_TaxPrice: "",//含税单价 (税率  / 100 * 销售单价) + 销售单价
                PurchaseOrderEntry_Total: '',//价税合计  价税合计=未税金额*(1+税率/100)
                PurchaseOrderEntry_ExRate: viewObj.rate,//汇率
                PurchaseOrderEntry_Deadline: "",//交货日期
                PurchaseOrderEntry_Project:'',//项目
                Remark: '',//备注
                // PurchaseOrderEntry_PurchaseInvoice: ''
            };
            oldData.push(newRow);
            viewObj.last = tid;
            tableIns.reload({
                data: oldData,
                limit: viewObj.limit
            });
        },
        // 更新每行数据
        updateRow: function () {
            var oldData = table.cache[layTableId];
            // console.log(oldData);
            tableIns.reload({
                data: oldData,
                limit: viewObj.limit
            });
        },
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
    // // 单元格修改数据 保留两位小数
    // table.on('edit(dataTable)', function (obj) {
    //     console.log(obj)
    //     var field = obj.field;
    //     var dataIndex = $(obj.tr).attr("data-index");
    //     $.each(tableData, function (index, value) {

    //         if (value.LAY_TABLE_INDEX == dataIndex) {
    //             if (value.Material_Name == '') {
    //                 layer.alert("请先选择物料");
    //                 value.PurchaseOrderEntry_Quantity = '';
    //                 value.PurchaseOrderEntry_Price = '';
    //                 value.PurchaseOrderEntry_Amount = '';
    //                 value.PurchaseOrderEntry_TaxRate = '';
    //                 value.PurchaseOrderEntry_Tax = '';
    //                 value.PurchaseOrderEntry_TaxPrice = '';
    //                 value.PurchaseOrderEntry_Total = '';
    //                 value.PurchaseOrderEntry_Deadline = '';
    //                 value.Material_Name = '';
    //             } else {
    //                 //销售单价
    //                 if (field == 'PurchaseOrderEntry_Price') {
    //                     value.PurchaseOrderEntry_Price = parseFloat(value.PurchaseOrderEntry_Price)
    //                     // 未税金额=数量*销售单价
    //                     value.PurchaseOrderEntry_Amount = parseFloat(value.PurchaseOrderEntry_Quantity) * parseFloat(value.PurchaseOrderEntry_Price)
    //                     // 含税单价=销售单价*（1+税率/100）
    //                     value.PurchaseOrderEntry_TaxPrice = parseFloat(value.PurchaseOrderEntry_Price) * (1 + parseFloat(value.PurchaseOrderEntry_TaxRate) / 100)
    //                     // 价税合计=数量*含税单价
    //                     value.PurchaseOrderEntry_Total = parseFloat(value.PurchaseOrderEntry_Quantity) * parseFloat(value.PurchaseOrderEntry_TaxPrice)
    //                     // 税额=未税金额*（税率/100）
    //                     value.PurchaseOrderEntry_Tax = parseFloat(value.PurchaseOrderEntry_Amount) * (parseFloat(value.PurchaseOrderEntry_TaxRate) / 100)

    //                 } else if (field == 'PurchaseOrderEntry_Quantity') {//数量
    //                     value.PurchaseOrderEntry_Quantity = parseFloat(value.PurchaseOrderEntry_Quantity)
    //                     // 未税金额=数量*销售单价
    //                     value.PurchaseOrderEntry_Amount = parseFloat(value.PurchaseOrderEntry_Quantity) * parseFloat(value.PurchaseOrderEntry_Price)
    //                     // 含税单价=销售单价*（1+税率/100）
    //                     value.PurchaseOrderEntry_TaxPrice = parseFloat(value.PurchaseOrderEntry_Price) * (1 + parseFloat(value.PurchaseOrderEntry_TaxRate) / 100)
    //                     // 价税合计=数量*含税单价
    //                     value.PurchaseOrderEntry_Total = parseFloat(value.PurchaseOrderEntry_Quantity) * parseFloat(value.PurchaseOrderEntry_TaxPrice)
    //                     // 税额=未税金额*（税率/100）
    //                     value.PurchaseOrderEntry_Tax = parseFloat(value.PurchaseOrderEntry_Amount) * (parseFloat(value.PurchaseOrderEntry_TaxRate) / 100)
    //                     // value.PurchaseOrderEntry_Quantity='0'

    //                 } else if (field == 'PurchaseOrderEntry_TaxPrice') {//含税单价
    //                     value.PurchaseOrderEntry_TaxPrice = parseFloat(value.PurchaseOrderEntry_TaxPrice)
    //                     // 销售单价=含税单价/(1+税率/100)
    //                     value.PurchaseOrderEntry_Price = parseFloat(value.PurchaseOrderEntry_TaxPrice) / (1 + parseFloat(value.PurchaseOrderEntry_TaxRate) / 100)
    //                     // 未税金额=数量*销售单价
    //                     value.PurchaseOrderEntry_Amount = parseFloat(value.PurchaseOrderEntry_Quantity) * parseFloat(value.PurchaseOrderEntry_Price)
    //                     // 价税合计=数量*含税单价
    //                     value.PurchaseOrderEntry_Total = parseFloat(value.PurchaseOrderEntry_Quantity) * parseFloat(value.PurchaseOrderEntry_TaxPrice)
    //                     // 税额=未税金额*（税率/100）
    //                     value.PurchaseOrderEntry_Tax = parseFloat(value.PurchaseOrderEntry_Amount) * (parseFloat(value.PurchaseOrderEntry_TaxRate) / 100)


    //                 } else if (field == 'PurchaseOrderEntry_Amount') {//未税金额 
    //                     value.PurchaseOrderEntry_Amount = parseFloat(value.PurchaseOrderEntry_Amount)
    //                     // 销售单价=未税金额/数量
    //                     value.PurchaseOrderEntry_Price = parseFloat(value.PurchaseOrderEntry_Amount) / parseFloat(value.PurchaseOrderEntry_Quantity)
    //                     // 含税单价=销售单价*（1+税率/100）
    //                     value.PurchaseOrderEntry_TaxPrice = parseFloat(value.PurchaseOrderEntry_Price) * (1 + parseFloat(value.PurchaseOrderEntry_TaxRate) / 100)
    //                     // 价税合计=数量*含税单价
    //                     value.PurchaseOrderEntry_Total = parseFloat(value.PurchaseOrderEntry_Quantity) * parseFloat(value.PurchaseOrderEntry_TaxPrice)
    //                     // 税额=未税金额*（税率/100）
    //                     value.PurchaseOrderEntry_Tax = parseFloat(value.PurchaseOrderEntry_Amount) * (parseFloat(value.PurchaseOrderEntry_TaxRate) / 100)


    //                 } else if (field == 'PurchaseOrderEntry_Total') { //价税合计 
    //                     value.PurchaseOrderEntry_Total = parseFloat(value.PurchaseOrderEntry_Total)
    //                     // 含税单价=价税合计/数量
    //                     value.PurchaseOrderEntry_TaxPrice = parseFloat(value.PurchaseOrderEntry_Total) / parseFloat(value.PurchaseOrderEntry_Quantity)
    //                     // 销售单价=含税单价/（1+税率/100）
    //                     value.PurchaseOrderEntry_Price = parseFloat(value.PurchaseOrderEntry_TaxPrice) / (1 + parseFloat(value.PurchaseOrderEntry_TaxRate) / 100)

    //                     // 未税金额=数量*销售单价
    //                     value.PurchaseOrderEntry_Amount = parseFloat(value.PurchaseOrderEntry_Quantity) * parseFloat(value.PurchaseOrderEntry_Price)
    //                     // 税额=未税金额*（税率/100）
    //                     value.PurchaseOrderEntry_Tax = parseFloat(value.PurchaseOrderEntry_Amount) * (parseFloat(value.PurchaseOrderEntry_TaxRate) / 100)

    //                 } else if (field == 'PurchaseOrderEntry_TaxRate') {//税率
    //                     value.PurchaseOrderEntry_TaxRate = parseFloat(value.PurchaseOrderEntry_TaxRate)
    //                     // 含税单价=销售单价*（1+税率/100）
    //                     value.PurchaseOrderEntry_TaxPrice = parseFloat(value.PurchaseOrderEntry_Price) * (1 + parseFloat(value.PurchaseOrderEntry_TaxRate || '0') / 100)
    //                     // 未税金额=数量*销售单价
    //                     value.PurchaseOrderEntry_Amount = parseFloat(value.PurchaseOrderEntry_Quantity) * parseFloat(value.PurchaseOrderEntry_Price)
    //                     // 价税合计=数量*含税单价
    //                     value.PurchaseOrderEntry_Total = parseFloat(value.PurchaseOrderEntry_Quantity) * parseFloat(value.PurchaseOrderEntry_TaxPrice)
    //                     // 税额=未税金额*（税率/100）
    //                     value.PurchaseOrderEntry_Tax = parseFloat(value.PurchaseOrderEntry_Amount) * (parseFloat(value.PurchaseOrderEntry_TaxRate || '0') / 100)
    //                 }



    //             }
    //         }


    //     });
    //     var oldData = table.cache[layTableId];
    //     tableIns.reload({
    //         data: oldData,
    //         limit: viewObj.limit
    //     });
    // });

   // 下拉渲染表格
    var htmlterm = '';
    var arrlist = [];
    var arri = {};
    function prolist() {
        $(".productworktable td[data-field='Material_Name']").each(function () {
            var curnow = $(this);
            curnow.on("click", function () {
                // console.log(1);
                // option渲染
                var scrollHeight = $('#tableRes .layui-table-body.layui-table-main').prop("scrollHeight");
                var height = $('#tableRes .layui-table-body.layui-table-main').height() + scrollHeight + 80;
                $('#tableRes .layui-table-body.layui-table-main').css("height", height)
                var _this = $(this);
                // data-index
                var dataIndex = _this.parents("tr").attr("data-index");
                _this.find(".checkmater").addClass("layui-form-selected")
                var date = $(".productworktable").attr("data-type");
                if (date == 'daten') {
                    $(".productworktable").attr("data-type", "datey");
                    $("#tableRes").find("tr").each(function (i, v) {
                        var nowtr = v;
                        var nowindex = $(v).attr("data-index");
                        if (dataIndex != nowindex) {
                            $(nowtr).find(".selectlist").addClass("hidden");
                        } else {
                            $(nowtr).find(".selectlist").removeClass("hidden");
                            $(nowtr).find(".dateload").removeClass("hidden")
                            $(nowtr).find(".datelist").addClass("hidden")
                        }
                    });
                    $.ajax({
                        url: ajaxMater,
                        success: function (res) {
                            console.log(res)
                            $(".dateload").addClass("hidden")
                            $(".datelist").removeClass("hidden")
                            var data = res.Data;
                            console.log(data)
                            var isussecc = res.Succeed;
                            if (isussecc) {
                                for (var i = 0; i < data.length; i++) {
                                    var dataNow = data[i];
                                    htmlterm += '<li data-name="' + (dataNow.Material_Name || '') + '" data-nick="' + (dataNow.Material_Nick || '') + '" data-spe="' + (dataNow.Material_Specifications || '') + '" data-materme="' + (dataNow.Material_Measure || '') + '" data-materid="' + (dataNow.F_Id || '') + '"><p>' + (dataNow.Material_Name || '') + '</p><p>' + (dataNow.Material_Nick || '') + '</p><p>' + (dataNow.Material_Specifications || '') + '</p></li>'
                                    arri = { materame: (dataNow.Material_Name || ''), maternick: (dataNow.Material_Nick || ''), matersp: (dataNow.Material_Specifications || ''), matermea: (dataNow.Material_Measure || ''), materid: (dataNow.F_Id || '') };
                                    arrlist.push(arri)
                                }
                                $(".selectlist ul").html(htmlterm);
                                $(".materName").on("keyup", function () {
                                    var searchVal = $(this).val();
                                    var showList = [];
                                    var searchlist = '';
                                    //将匹配项显示，不匹配项隐藏
                                    $.each(arrlist, function (index, item) {
                                        if ((item.materame && item.materame.indexOf(searchVal) != -1) || (item.maternick && item.maternick.indexOf(searchVal) != -1) || (item.matersp && item.matersp.indexOf(searchVal) != -1)) {
                                            showList.push(item);
                                        } else {

                                        }
                                    })
                                    for (var j = 0; j < showList.length; j++) {
                                        var shownow = showList[j]
                                        searchlist += '<li data-name="' + shownow.materame + '" data-nick="' + shownow.maternick + '" data-spe="' + shownow.matersp + '" data-materme="' + shownow.materme + '" data-materid="' + shownow.materid + '"><p>' + shownow.materame + '</p><p>' + shownow.maternick + '</p><p>' + shownow.matersp + '</p></li>'
                                    }
                                    if (showList.length == 0) {
                                        searchlist = '<div style="text-align:center;padding:15px 10px 15px 0; ">暂无数据</div>'
                                    }
                                    $(".selectlist ul").html("");
                                    $(".selectlist ul").html(searchlist);

                                })
                                $('.selectlist ul').find('li').each(function () {
                                    var _this1 = $(this);
                                    _this1.hover(function () {
                                        $(this).addClass("active").siblings().removeClass("active")
                                    });
                                    _this1.on("click", function () {
                                        var oldData = table.cache[layTableId];
                                        var name = $(this).attr("data-name");
                                        var nick = $(this).attr("data-nick");
                                        var specife = $(this).attr("data-spe");
                                        var measure = $(this).attr("data-materme");
                                        var marid = $(this).attr("data-materid")
                                        $(".materName").val(name || '');
                                        var rate = $("#PurchaseOrderEntry_TaxRate").val();//税率
                                        var project = $("#PurchaseOrderEntry").val();
                                        var sendDate = $("#sendDate").val();//交货日期
                                        $.each(tableData, function (index, value) {
                                            if (value.LAY_TABLE_INDEX == dataIndex) {
                                                value.Material_Name = name || "";
                                                value.Material_Nick = nick || "";
                                                value.PurchaseOrderEntry_Specifications  = specife || "";//销售规格
                                                value.PurchaseOrderEntry_Material = marid || "";//物料id
                                                value.PurchaseOrderEntry_Unit = measure;//单位
                                                value.PurchaseOrderEntry_Quantity = 1;//数量=未税金额/销售单价
                                                value.PurchaseOrderEntry_Price = 0.00;//销售单价
                                                value.PurchaseOrderEntry_TaxRate = rate || '16';//税率
                                                value.PurchaseOrderEntry_Deadline = sendDate || '';//交货日期
                                                value.PurchaseOrderEntry_TaxPrice = 0;//含税单价
                                                value.PurchaseOrderEntry_Amount = 0;//未税金额=数量*销售单价
                                                value.PurchaseOrderEntry_Total = 0;//价税合计
                                                value.PurchaseOrderEntry_Tax = 0;//税额=合计-金额
                                                value.PurchaseOrderEntry_Project=project || "";
                                                if (value.tempId == viewObj.last) {
                                                    activeByType("add");
                                                } else {
                                                    var oldData = table.cache[layTableId];
                                                    tableIns.reload({
                                                        data: oldData,
                                                        limit: viewObj.limit
                                                    });
                                                }
                                            }
                                        });
                                        $(".selectlist").addClass("hidden");
                                        $(".checkmater").removeClass("layui-form-selected");
                                        return false
                                    })
                                })
                            }else{
                                alert(res.Message)
                            }

                        }
                    })
                } else {
                    $(".selectlist ul").html(htmlterm);
                    $("#tableRes").find("tr").each(function (i, v) {
                        var nowtr = v;
                        var nowindex = $(v).attr("data-index");
                        if (dataIndex != nowindex) {
                            $(nowtr).find(".selectlist").addClass("hidden");
                        } else {
                            $(nowtr).find(".selectlist").removeClass("hidden");
                            $(nowtr).find(".dateload").addClass("hidden")
                            $(nowtr).find(".datelist").removeClass("hidden")
                        }
                    });

                    $(".materName").on("keyup", function () {
                        var searchVal = $(this).val();
                        var showList = [];
                        var searchlist = '';
                        //将和所输入的字符串匹配的项存入showList
                        $.each(arrlist, function (index, item) {
                            if ((item.materame && item.materame.indexOf(searchVal) != -1) || (item.maternick && item.maternick.indexOf(searchVal) != -1) || (item.matersp && item.matersp.indexOf(searchVal) != -1)) {
                                showList.push(item);
                            } else {

                            }
                        })

                        for (var j = 0; j < showList.length; j++) {
                            var shownow = showList[j]
                            searchlist += '<li data-name="' + shownow.materame + '" data-nick="' + shownow.maternick + '" data-spe="' + shownow.matersp + '" data-maMaterial_Namee="' + shownow.matermea + '"><p>' + shownow.materame + '</p><p>' + shownow.maternick + '</p><p>' + shownow.matersp + '</p></li>'
                        }
                        if (showList.length == 0) {
                            searchlist = '<div style="text-align:center;padding:15px 10px 15px 0; ">暂无数据</div>'
                        }
                        $(".selectlist ul").html("");
                        $(".selectlist ul").html(searchlist);
                        $("#tableRes").find("tr").each(function (i, v) {
                            var nowtr = v;
                            var nowindex = $(v).attr("data-index");
                            if (dataIndex != nowindex) {
                                $(nowtr).find("selectlist").addClass("hidden")
                            }
                        });

                    })
                    $('.selectlist ul').find('li').each(function () {
                        var _this1 = $(this);
                        _this1.hover(function () {
                            $(this).addClass("active").siblings().removeClass("active")
                        });
                        _this1.on("click", function () {
                            var oldData = table.cache[layTableId];
                            // console.log(oldData)
                            var name = $(this).attr("data-name");
                            var nick = $(this).attr("data-nick");
                            var specife = $(this).attr("data-spe");
                            var measure = $(this).attr("data-materme");
                            var marid = $(this).attr("data-materid")
                            $(".materName").val(name || '');
                            var rate = $("#PurchaseOrderEntry_TaxRate").val();//税率
                            var project = $("#PurchaseOrderEntry").val();
                            var sendDate = $("#sendDate").val();//交货日期
                            $.each(tableData, function (index, value) {
                                // console.log(value)
                                if (value.LAY_TABLE_INDEX == dataIndex) {
                                    value.Material_Name = name || "";
                                    value.Material_Nick = nick || "";
                                    value.PurchaseOrderEntry_Specifications  = specife || "";//销售规格
                                    value.PurchaseOrderEntry_Material = marid || "";//物料id
                                    value.PurchaseOrderEntry_Unit = measure;//单位
                                    value.PurchaseOrderEntry_Quantity = 1;//数量=未税金额/销售单价
                                    value.PurchaseOrderEntry_Price = 0.00;//销售单价
                                    value.PurchaseOrderEntry_TaxRate = rate || '16';//税率
                                    value.PurchaseOrderEntry_Deadline = sendDate || '';//交货日期
                                    value.PurchaseOrderEntry_TaxPrice = 0;//含税单价
                                    value.PurchaseOrderEntry_Amount = 0;//未税金额=数量*销售单价
                                    value.PurchaseOrderEntry_Total = 0;//价税合计
                                    value.PurchaseOrderEntry_Tax = 0;//税额=合计-金额
                                    value.PurchaseOrderEntry_Project=project || "";
                                    if (value.tempId == viewObj.last) {
                                        activeByType("add");
                                    } else {
                                        var oldData = table.cache[layTableId];
                                        tableIns.reload({
                                            data: oldData,
                                            limit: viewObj.limit
                                        });
                                    }
                                }
                            });
                            //将匹配项显示，不匹配项隐藏
                            $(".selectlist").addClass("hidden");
                            $(".checkmater").removeClass("layui-form-selected");
                            return false
                        })
                    })
                }
                return false;
            })


        })
    }


    $(document).on("click", function () {
        var evt = event.srcElement ? event.srcElement : event.target;
        var seletlist = $(".selectlist");
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
                    $(".selectlist").addClass("hidden");
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

    form.on('select(currlist)', function (data) {
        var value = data.value;
        for (var k = 0; k < currentId.length; k++) {
            var nowname = currentId[k];
            var nowk = k;
            if (value == nowname) {
                // viewObj.currtype = nowname;
                // viewObj.rate = ratelAdd[nowk]
                $("#SalesOrder_ExRate").val(ratelAdd[nowk])
                // var oldData = table.cache[layTableId];
                // $.each(tableData, function (index, value) {
                //     if (value.currchange == 0) {
                //         value.PurchaseOrderEntry_Currency = viewObj.currtype
                //         // value.PurchaseOrderEntry_ExRate = viewObj.rate
                //     }
                // });
                // tableIns.reload({
                //     data: oldData,
                //     limit: viewObj.limit
                // });
            }
        }

    });

  

    // 获取单据编号
    $.ajax({
        url: getnum,
        success: function (res) {
            if (res.Succeed) {
                $("#PurchaseOrderEntry_Name").val(res.Data)
            } else {
                alert(res.Message)
            }
        }
    })

    // 制单人
    var mouser = $.cookie("Modify_User");
    var username = $.cookie("User_Nick")
    $("#StockBill_Biller").val(mouser)
    $("#StockBill_Billername").val(username)

  
    // 供应商
    $(".supplier").on("click", function () {
        var _this = $(this);
        var date = _this.attr("data-type");
        if (date == 'daten') {
            $(".supplier").attr("data-type", "datey");
            $.ajax({
                type: "get",
                url:ajaxSupplier,
                success: function (res) {
                    // console.log(res)
                    var isussecc = res.Succeed;
                    var data = res.Data;
                    if (isussecc) {
                        var html = '<option value="">全部</option>';
                        var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                        for (var i = 0; i < data.length; i++) {
                            html += '<option value="' + data[i].F_Id + '" >' + data[i].Supplier_Nick + '</option>';
                            htmlsel += '<dd lay-value="' + data[i].F_Id + '" >' + data[i].Supplier_Nick + '</dd>'
                        }
                        $("#SupplierMaterial_Supplier").html(html);
                        $(".supplier .layui-anim.layui-anim-upbit").html(htmlsel);
                        renderForm();
                        _this.find("select").next().find('.layui-select-title input').click();
                    } else {
                        alert(res.Message)
                    }

                }
            })
        }
    })

    // 业务员
    $(".scalelists").on("click", function () {
        var _this = $(this);
        var date = _this.attr("data-type");
        if (date == 'daten') {
            $(".scalelists").attr("data-type", "datey");
            $.ajax({
                type: "get",
                url: ajaxUsr,
                success: function (res) {
                    // console.log(res)
                    var isussecc = res.Succeed;
                    var data = res.Data;
                    if (isussecc) {
                        var html = '<option value="">全部</option>';
                        var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                        for (var i = 0; i < data.length; i++) {
                            html += '<option value="' + data[i].F_Id + '">' + data[i].User_Nick + '</option>';
                            htmlsel += '<dd lay-value="' + data[i].F_Id + '">' + data[i].User_Nick + '</dd>'
                        }
                        $("#SalesOrder_Employee").html(html);
                        $(".scalelists .layui-anim.layui-anim-upbit").html(htmlsel);
                        renderForm();
                        _this.find("select").next().find('.layui-select-title input').click();
                    } else {
                        alert(res.Message)
                    }

                }
            })
        }
    })


    // 单号
    $(".checkid").on("click", function () {
        var _this = $(this);
        var date = _this.attr("data-type");
        if (date == 'daten') {
            $(".checkid").attr("data-type", "datey");
            $.ajax({
                type: "get",
                url: asslist,
                success: function (res) {
                    // console.log(res)
                    var isussecc = res.Succeed;
                    var data = res.Data;
                    if (isussecc) {
                        var html = '<option value="">全部</option>';
                        var htmlsel = '<dd lay-value="" class="layui-select-tips layui-this">全部</dd>'
                        for (var i = 0; i < data.length; i++) {
                            html += '<option value="' + data[i].F_Id + '" >' + data[i].Assign_Name + '</option>';
                            htmlsel += '<dd lay-value="' + data[i].F_Id + '" >' + data[i].Assign_Name + '</dd>'
                        }
                        $("#order").html(html);
                        $(".checkid .layui-anim.layui-anim-upbit").html(htmlsel);
                        renderFormNext();
                        _this.find("select").next().find('.layui-select-title input').click();

                    } else {
                        alert(res.Message)
                    }

                }
            })
        }
    })


    // 切换订单号
    layui.form.on('select(changeorder)', function (data) {
        if (data.value != '') {
            $.ajax({
                type: "get",
                url: getassone + data.value,
                success: function (res) {
                    // console.log(res)
                    var isussecc = res.Succeed;
                    var data = res.Data;
                    if (isussecc) {
                        if (data.Children) {
                            // console.log(data.Children)
                            // 数据对应
                            $.each(data.Children, function (index, value) {
                                value.PurchaseOrderEntry_Specifications = value.AssignEntry_Specifications
                                value.PurchaseOrderEntry_Unit = value.AssignEntry_Unit
                                value.PurchaseOrderEntry_Material = value.AssignEntry_Material
                                value.PurchaseOrderEntry_Quantity = value.AssignEntry_Quantity
                                value.PurchaseOrderEntry_DateTime = value.AssignEntry_DateTime
                                value.PurchaseOrderEntry_StartTime = value.AssignEntry_StartTime
                                value.PurchaseOrderEntry_Project = value.AssignEntry_Project
                                value.Remark = value.Remark
                            })
                            tableIns.reload({
                                data: data.Children,
                                limit: data.Children.length
                            });
                        }

                    } else {
                        alert(res.Message)
                    }
                }
            })
        }
    })
    // 重选表格渲染
    renderFormNext = function () {
        layui.use('form', function () {
            var form = layui.form;
            form.render();
            var oldData = table.cache[layTableId];
            tableIns.reload({
                data: oldData,
                limit: viewObj.limit
            });
        });
    }

        // 制单人
    var mouser = $.cookie("Modify_User");
    var username = $.cookie("User_Nick")
    $("#PurchaseApply_Biller").val(mouser)
    $("#PurchaseApply_Billername").val(username)
    // // 申请人
    // var mouser = $.cookie("Modify_User");
    // var username = $.cookie("Employee_Nick")
    // $("#PurchaseApply_Employee").val(mouser)
    // $("#PurchaseApply_Employeename").val(username)
    // // 单据日期
    // var mouser = $.cookie("Modify_User");
    // var username = $.cookie("PurchaseApply_DateTime")
    // $("#PurchaseApply_DateTime").val(mouser)
    // $("#PurchaseApply_DateTimename").val(username)
    // // 单据状态
    // var mouser = $.cookie("Modify_User");
    // var username = $.cookie("DictionaryItem_Nick")
    // $("#PurchaseApply_Status").val(mouser)
    // $("#PurchaseApply_Statusname").val(username)


    // 保存
    $(".sub").on("click", function () {
        var list = $("form").serializeArray();
        var oldData = table.cache[layTableId];
        list.Details = oldData;
        if (!($(this).hasClass("audit"))) {
            var index = layer.load();
            $.ajax({
                type: "POST",
                url: purchaseOrderListAdd,
                data: list,
                success: function (res) {
                    // console.log(res)
                    var isussecc = res.Succeed;
                    var data = res.Data;
                    if (isussecc) {
                        layer.close(index);
                        layer.msg("保存成功");
                        setInterval(function () {
                            window.location.reload()
                        }, 1000)
                    } else {
                        layer.close(index);
                        // alert(JSON.parse(res).Message)
                    }
                }
            })
        }
    })
});
     //多文件上传列表示例
     var tablehead = $('#tablehead');
     var tablebody = $('#tablebody');
     var imgcount = 0;
     var headhtml = "<tr><th>文件名</th><th>大小</th><th>操作</th></tr>";
     var uploadListIns = upload.render({
         elem: '#testList',
         url:'/Api/PSIBase/FileInput/SetFile'        
         , accept: 'file'
         , multiple: true
         , auto: false
         , bindAction: '#testListAction'
         , choose: function (obj) {
            //将每次选择的文件追加到文件队列
             var files = this.files = obj.pushFile(); 
             tablehead.html(headhtml)
             //读取本地文件 可多次追加
             obj.preview(function (index, file) {
                 imgcount++;
                 var tr = $(['<tr id="upload-' + index + '">'
                     , '<td>' + file.name + '</td>'
                     , '<td class="textc">' + (file.size / 1014).toFixed(1) + 'kb</td>'
                     , '<td class="textc">'
                     , '<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>'
                     , '</td>'
                     , '</tr>'].join(''));
                 //删除选中
                 tr.find('.demo-delete').on('click', function () {
                     //删除对应的文件
                     delete files[index]; 
                     tr.remove();
                     //清空，以免删除后出现同名文件不可选
                     uploadListIns.config.elem.next()[0].value = ''; 
                     imgcount--;
                     if (imgcount == 0) {
                         tablehead.html("")
                     }
 
                 });
                // 上传文件到列表
                 tablebody.append(tr);
             });
         }
 
     });

    //  渲染表格
    $(function () {
        $(document).on("click", function () {
            $("#tableRes .layui-table-body").addClass("overvis");
            $("#tableRes .layui-table-box").addClass("overvis");
            $("#tableRes .layui-table-view").addClass("overvis");
        })
        $("#tablelist").on("click", function () {
            $("#tablelist .layui-table-body").addClass("overvis");
            $("#tablelist .layui-table-box").addClass("overvis");
            $("#tablelist .layui-table-view").addClass("overvis");
        })
    })


     // 删除
     function del(id) {
        var index = layer.confirm('确认删除这条数据？', {
            btn: ['确定', '取消']
        }, function () {
            var token = $.cookie("token");
            $.ajax({
                type: "POST",
                async: false,
                url:removecraftlist,
                data: {
                    F_Id: id
                },
                success: function (res) {
                    var data = res.Data;
                    console.log(data)
                    var succeed = res.Succeed;
                    if (succeed) {
                        layer.close(index)
                    } else {
                        layer.close(index)
                        alert(res.Message)
                    }
                }
            })
        }); 
    }
