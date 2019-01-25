$(function () {
     //获取当前日期
     
 
     $(".reset").on("click", function () {
         start = laydate.render({
             elem: '#dateBegin'
             , value: startdate
             , done: function (value, date) {
                 endMax = end.config.max;
                 end.config.min = date;
                 end.config.min.month = date.month - 1;
             }
         });
         end = laydate.render({
             elem: '#dateEnd'
             , value: enddate
 
         });
         return false;
     })

     $(".more").on("click",function(){
        var _this=$(this);
        var isfirst=_this.attr("data-type");
        if(isfirst=='daten'){
            _this.attr("data-type","datey");
        }
        if(_this.hasClass("packup")){
            _this.html("更多");
            _this.removeClass("packup")
            $(".morelists").addClass("hidden")
         }else{
             if(isfirst=='daten'){
                getdata();
             }
            _this.html("收起");
            _this.addClass("packup")
            $(".morelists").removeClass("hidden")
         }
       
     })
    
    
    function renderForm() {
        layui.use('form', function () {
            var form = layui.form;
            form.render();
        });
    }

   
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
                ,done:function(){
                    $("#tablelist .layui-table-body").addClass("overvis");
                    $("#tablelist .layui-table-box").addClass("overvis");
                    $("#tablelist .layui-table-cell").addClass("overvis");
                    $("#tablelist .layui-table-view").addClass("overvis");
                }
            });
            return false;
        })
    }
    $(".checklist").on("click", function () {
        console.log(1)
        var str = [
            { type: 'checkbox', width: "5%" },
            { field: 'FName', title: '流水号' },
            { field: 'FBillNo', title: '流程类型' },
            { field: 'FCustNumber', title: '工作名称/文号'},
            { field: 'FCustName', title: '开始时间' },
            { field: 'FExplanation', title: '公共附件'},
            { field: 'FDeptName', title: '状态'},
            {
                field: 'tempId', title: '操作', align: 'center', templet: function (d) {
                    return '<a class="flowchar" >流程图</a> '+
                            '<div class="moreOpera">'+
                                '<span>更多</span>'+
                                '<div class="opearlist ">'+
                                    '<a href="javascript:void(0)">催办</a>'+
                                    '<a href="javascript:void(0)">关注</a>'+
                                '</div>'+
                            '</div>'
                }
            }
           
          
        ];


        var data=[
            {FName:'001',FBillNo:'类型1',FCustNumber:'1111',FCustName:'2019-01-07',FExplanation:"123"},
            {FName:'002',FBillNo:'类型2',FCustNumber:'222',FCustName:'2019-01-08',FExplanation:"344"},
            {FName:'003',FBillNo:'类型3',FCustNumber:'333',FCustName:'2019-01-09',FExplanation:"552"},
            {FName:'004',FBillNo:'类型4',FCustNumber:'444',FCustName:'2019-01-20',FExplanation:"6566"},
            {FName:'005',FBillNo:'类型5',FCustNumber:'555',FCustName:'2019-01-22',FExplanation:"22"},
    ]
        

        tablerender(str, data);

    })
})

function getdata(){
    var myDate = new Date();
     var nowY = myDate.getFullYear();
     var nowM = myDate.getMonth() + 1;
     var nowD = myDate.getDate();
     var enddate = nowY + "-" + (nowM < 10 ? "0" + nowM : nowM) + "-" + (nowD < 10 ? "0" + nowD : nowD);
 
     //获取三十天前日期
     var lw = new Date(myDate - 1000 * 60 * 60 * 24 * 30);
     var lastY = lw.getFullYear();
     var lastM = lw.getMonth() + 1;
     var lastD = lw.getDate();
     var startdate = lastY + "-" + (lastM < 10 ? "0" + lastM : lastM) + "-" + (lastD < 10 ? "0" + lastD : lastD);
     var laydate;
     var start, end, laydate;
     layui.use(['form', 'layedit', 'laydate', "jquery"], function () {
         var form = layui.form
             , layer = layui.layer
             , $ = layui.jquery;
         laydate = layui.laydate;
         //日期
         start = laydate.render({
             elem: '#dateBegin',
             //   min:nowTime,
             value: startdate,
             done: function (value, date) {
                 endMax = end.config.max;
                 end.config.min = date;
                 end.config.min.month = date.month - 1;
             }
         });
         end = laydate.render({
             elem: '#dateEnd',
             value: enddate,
 
         });
     });
}