var ajaxUrl='http://192.168.2.169:9995';
var ajaxURl='http://47.104.8.75:4824';

//-------------------- 基础信息-----------------
// 币别
var ajaxCurrency=ajaxURl+"/Api/PSIBase/Currency/GetList?keyword=&PageSize=&PageIndex="
// 客户
var ajaxCus=ajaxURl+"/Api/PSIBase/Customer/GetList?keyword=&PageSize=&PageIndex="
// 部门
var ajaxdepart=ajaxURl+'/Api/SystemManager/Department/GetList?keyword='
// 物料列表
var ajaxMater= ajaxURl+'/Api/PSIBase/Material/GetList?keyword=&PageIndex=&PageSize='
// 物料列表一条详情
var ajaxMaterone= ajaxURl+'/Api/PSIBase/Material/GetList'
// 修改物料
var editMater=ajaxURl+'/Api/PSIBase/Material/Edit'
// 物料删除
var removeMater=ajaxURl+'/Api/PSIBase/Material/Remove'
// 物料增加
var addMater=ajaxURl+'/Api/PSIBase/Material/Add'
// 物料类别列表
var materFlist=ajaxURl+'/Api/PSIBase/Family/GetList?keyword=&PageIndex=&PageSize='
//物料类别添加
var addmater=ajaxURl+'/Api/PSIBase/Family/Add'
//物料类别修改
var editmater=ajaxURl+'/Api/PSIBase/Family/Edit'
//物料类别删除
var removemater=ajaxURl+'/Api/PSIBase/Family/Rmove'
// 物料类别种属
var materFlistone=ajaxURl+'/Api/PSIBase/FamilyEntry/GetList'
//物料类别添加
var addmaterfamily=ajaxURl+'/Api/PSIBase/FamilyEntry/Add'
//物料类别修改
var editmaterfamily=ajaxURl+'/Api/PSIBase/FamilyEntry/Edit'
//物料类别删除
var removematerfamily=ajaxURl+'/Api/PSIBase/FamilyEntry/Rmove'
// 计量单位列表  
var ajaxMea=ajaxURl + "/api/PSIBase/Measure/GetList?keyword=&PageIndex=&PageSize="
// 计量单位一条详情
var ajaxMeaone=ajaxURl + "/api/PSIBase/Measure/GetList"
// 修改计量单位
var editMea=ajaxURl + "/api/PSIBase/Measure/Edit"
// 添加计量单位
var addMea=ajaxURl + "/api/PSIBase/Measure/Add"
// 删除计量单位
var remvoeMea=ajaxURl + "/api/PSIBase/Measure/Remove"
// 计量单位基础单位
var basicMea=ajaxURl + "/Api/SystemManager/Dictionary/GetEntry?keyword=PSIMaterial_Unit"
//-------------------- 基础信息----------------------



//-------------------- 销售管理----------------------
// 用户/制单人/业务员
var ajaxUsr=ajaxURl+'/Api/SystemManager/User/GetList?keyword='
// 销售订单列表==客户订单号
var salelist= ajaxURl + "/Api/PSISales/SalesOrder/GetList?keyword=&PageSize=&PageIndex="
// 销售订单类型
var saletype=ajaxURl+'/Api/SystemManager/Dictionary/GetEntry?keyword=PSISalesOrder_Type'
// 销售单据状态
var salestauts=ajaxURl+'/Api/SystemManager/Dictionary/GetEntry?keyword=PSIBill_Status'
// 删除销售订单明细
var delentry= ajaxURl+'/Api/PSISales/SalesOrderEntry/Delete'
// 销售订单单号
var ordernum=ajaxURl+'/Api/PSIBase/BatchNo/GetNext?billType=&dateFormart='
// 销售订单列表
var saleEntry=ajaxURl + '/Api/PSISales/SalesOrder/GetEntry?keyValue='
//-------------------- 销售管理---------------------


// -------------------生产管理----------------------
// 生产订单类型
var ajaxAsstype=ajaxURl + "/Api/SystemManager/Dictionary/GetEntry?keyword=PSIAssign_Type"
// 工序列表
var processlist=ajaxURl + '/Api/PSIBase/Process/GetList?keyword='
// 添加工序
var addprocess=ajaxURl + '/Api/PSIBase/Process/Add'
// 修改工序
var editprocess=ajaxURl + '/Api/PSIBase/Process/Edit'
// 删除工序
var removeprocess=ajaxURl + '/Api/PSIBase/Process/Remove'
// 添加工艺
var addCraft=ajaxURl + '/api/PSIBase/Craft/Add'
// 修改工艺
var editCraft=ajaxURl + '/api/PSIBase/Craft/Edit'
// 删除工艺
var removeCraft=ajaxURl + '/api/PSIBase/Craft/Remove'
// 删除工艺字表
var removeCraftety=ajaxURl + '/api/PSIBase/CraftEntry/Remove'
// 添加工艺字表
var addCrafty=ajaxURl + '/api/PSIBase/CraftEntry/Add'
// 保存生产订单
var saveAssign=ajaxURl + '/Api/Manufacture/Assign/Add'
// 工艺列表
var craftlist=ajaxURl+'/api/PSIBase/Craft/GetList?keyword=&PageSize=&PageIndex='
// 工艺详细列表
var craftEnty=ajaxURl+'/api/PSIBase/Craft/GetEntity?keyValue='
// BOM清单
var bomlist=ajaxURl+'/api/PSIBase/BillOfMaterial/GetList?keyword=&PageSize=&PageIndex='
// 根据物料查工艺路线
var materCraft=ajaxURl+'/api/PSIBase/Craft/GetDefault?keyvalue='
// 工单工序查询
var assignCraft=ajaxURl+'/Api/Manufacture/AssignCraft/GetList?keyword='
// 添加工单工序
var addassignCraft=ajaxURl+'/Api/Manufacture/AssignCraft/Add'
// 修改工单工序
var editassignCraft=ajaxURl+'/Api/Manufacture/AssignCraft/Edit'
// 获取工单主键
var getMain=ajaxURl+'/api/PSIBase/BatchNo/GetNewId'
// 删除工单工序
var removeassignCraft=ajaxURl+'/Api/Manufacture/AssignCraft/Remove' 

// -------------------生产管理----------------------






function paramString2obj(serializedParams) {
    var obj = {};
    function evalThem(str) {
        var strAry = new Array();
        strAry = str.split("=");
        //使用decodeURIComponent解析uri 组件编码
        for (var i = 0; i < strAry.length; i++) {
            strAry[i] = decodeURIComponent(strAry[i]);
        }
        var attributeName = strAry[0];
        var attributeValue = strAry[1].trim();
        //如果值中包含"="符号，需要合并值
        if (strAry.length > 2) {
            for (var i = 2; i < strAry.length; i++) {
                attributeValue += "=" + strAry[i].trim();
            }
        }
        if (!attributeValue) {
            return;
        }
        var attriNames = attributeName.split("."),
            curObj = obj;
        for (var i = 0; i < (attriNames.length - 1); i++) {
            curObj[attriNames[i]] ? "" : (curObj[attriNames[i]] = {});
            curObj = curObj[attriNames[i]];
        }
        //使用赋值方式obj[attributeName] = attributeValue.trim();替换
        //eval("obj."+attributeName+"=\""+attributeValue.trim()+"\";");
        //解决值attributeValue中包含单引号、双引号时无法处理的问题
        curObj[attriNames[i]] = attributeValue.trim();
    };
    var properties = serializedParams.split("&");
    for (var i = 0; i < properties.length; i++) {
        //处理每一个键值对
        evalThem(properties[i]);
    };
    return obj;
};


