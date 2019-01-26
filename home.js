layui.define(['element', 'layer'], function (exports) {

    var $ = layui.$,
        $body = $('body'),
        element = layui.element,
        layer = layui.layer;

    var screen_size = {
        pc: [991, -1],
        pad: [768, 990],
        mobile: [0, 767]
    }

    var getDevice = function () {
        var width = $(window).width();
        for (var i in screen_size) {
            var sizes = screen_size[i],
                min = sizes[0],
                max = sizes[1];
            if (max == -1) max = width;
            if (min <= width && max >= width) {
                return i;
            }
        }
        return null;
    }

    var isDevice = function (label) {
        return getDevice() == label;
    }

    var isMobile = function () {
        return isDevice('mobile');
    }

    var Tab = function (el) {
        this.el = el;
        this.urls = [];
    }

    Tab.prototype.content = function (src) {
        var iframe = document.createElement("iframe");
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("src", src);
        iframe.setAttribute("data-id", this.urls.length);
        return iframe.outerHTML;
    };

    Tab.prototype.is = function (url) {
        return (this.urls.indexOf(url) !== -1)
    };

    Tab.prototype.add = function (title, url) {
        if (this.is(url)) return false;
        this.urls.push(url);
        element.tabAdd(this.el, {
            title: title,
            content: this.content(url),
            id: url
        });
        this.change(url);
    };

    Tab.prototype.change = function (url) {
        element.tabChange(this.el, url);
    };

    Tab.prototype.delete = function (url) {
        element.tabDelete(this.el, url);
    };

    Tab.prototype.onChange = function (callback) {
        element.on('tab(' + this.el + ')', callback);
    };

    Tab.prototype.onDelete = function (callback) {
        var self = this;
        element.on('tabDelete(' + this.el + ')', function (data) {
            var i = data.index;
            self.urls.splice(i, 1);
            callback && callback(data);
        });
    };

    var Home = function () {

        var tabs = new Tab('tabs'),
            navItems = [];

        $('#Nav a').on('click', function (event) {
            event.preventDefault();
            var $this = $(this),
                url = $this.attr('href'),
                title = $.trim($this.text());
            if (url && url !== 'javascript:;') {

                if (tabs.is(url)) {
                    tabs.change(url);
                } else {
                    navItems.push($this);
                    tabs.add(title, url);
                }
            }
            $this.closest('li.layui-nav-item')
                .addClass('layui-nav-itemed')
                .siblings()
                .removeClass('layui-nav-itemed');
        });

        // 默认触发第一个子菜单的点击事件
        $('#Nav li.layui-nav-item:eq(0) > dl.layui-nav-child > dd > a:eq(0)').trigger('click');

        tabs.onChange(function (data) {
            var i = data.index,
                $this = navItems[i];
            if ($this && typeof $this === 'object') {
                $('#Nav dd').removeClass('layui-this');
                $this.parent('dd').addClass('layui-this');
                $this.closest('li.layui-nav-item')
                    .addClass('layui-nav-itemed')
                    .siblings()
                    .removeClass('layui-nav-itemed');
            }
        });

        tabs.onDelete(function (data) {
            var i = data.index;
            navItems.splice(i, 1);
        });

        this.slideSideBar();
    }

    Home.prototype.slideSideBar = function () {
        var $slideSidebar = $('.slide-sidebar'),
            $pageContainer = $('.layui-body'),
            $mobileMask = $('.mobile-mask');

        var isFold = false;
        $slideSidebar.click(function (e) {
            e.preventDefault();
            var $this = $(this),
                $icon = $this.find('i'),
                $admin = $body.find('.layui-layout-admin');
            var toggleClass = isMobile() ? 'fold-side-bar-xs' : 'fold-side-bar';
            if ($icon.hasClass('ai-menufold')) {
                $icon.removeClass('ai-menufold').addClass('ai-menuunfold');
                $admin.addClass(toggleClass);
                isFold = true;
                if (isMobile()) $mobileMask.show();
            } else {
                $icon.removeClass('ai-menuunfold').addClass('ai-menufold');
                $admin.removeClass(toggleClass);
                isFold = false;
                if (isMobile()) $mobileMask.hide();
            }
        });

        var tipIndex;
        // 菜单收起后的模块信息小提示
        $('#Nav li > a').hover(function () {
            var $this = $(this);
            if (isFold) {
                tipIndex = layer.tips($this.find('em').text(), $this);
            }
        }, function () {
            if (isFold && tipIndex) {
                layer.close(tipIndex);
                tipIndex = null
            }
        })

        if (isMobile()) {
            $mobileMask.click(function () {
                $slideSidebar.trigger('click');
            });
        }
    }

    exports('home', new Home);
});

$(function () {
    var name = $.cookie("name");
    // var setbookname=$.cookie("setbookname");
    if (name) {
        name = name + ',你好！';
        $("#username").html(name);
        // $(".setbok").html(setbookname); 
        $("#mainindex").css("display", "block");
    } else {
        window.location.href = "login.html";
    }
    var name = $.cookie("name") + ',你好';
})

function homejs(obj, date) {
    console.log(obj)
    // var FItemNumber='';
    // for(var key in obj){    
    //   if(key=='FItemNumber'){
    //     FItemNumber=obj[key]
    //   }  
    // }    
    // console.log(FItemNumber)
    // var href=$('#Nav li.layui-nav-item:eq(5) > dl.layui-nav-child > dd > a:eq(1)').attr("href");
    // $('#Nav li.layui-nav-item:eq(5) > dl.layui-nav-child > dd > a:eq(1)').attr("href",href+"?FItemNumber="+FItemNumber+'&'+date)
    // $('#Nav li.layui-nav-item:eq(5) > dl.layui-nav-child > dd > a:eq(1)').trigger('click');
}

function homejsp(obj, date) {
    console.log(obj)
    // var FItemNumber='';
    // for(var key in obj){    
    //   if(key=='FItemNumber'){
    //     FItemNumber=obj[key]
    //   }  
    // }    
    // console.log(FItemNumber)
    // var href=$('#Nav li.layui-nav-item:eq(5) > dl.layui-nav-child > dd > a:eq(3)').attr("href");
    // $('#Nav li.layui-nav-item:eq(5) > dl.layui-nav-child > dd > a:eq(3)').attr("href",href+"?FItemNumber="+FItemNumber+'&'+date)
    // $('#Nav li.layui-nav-item:eq(5) > dl.layui-nav-child > dd > a:eq(3)').trigger('click');
}



// 领料单
function nextly() {
    var oldhref = $('#Nav li.layui-nav-item:eq(4) > dl.layui-nav-child > dd > a:eq(1)').attr("href");
    var href = oldhref
    // href = href.substr(0, href.length - 1);  
    if (href.split("?")[1].split("=")[1] == '10') {
        href = href.substr(0, href.length - 1);
    }

    console.log(href)
    $('#Nav li.layui-nav-item:eq(4) > dl.layui-nav-child > dd > a:eq(1)').attr("href", href)
    $('#Nav li.layui-nav-item:eq(4) > dl.layui-nav-child > dd > a:eq(1)').trigger('click');
    $('#Nav li.layui-nav-item:eq(4) > dl.layui-nav-child > dd > a:eq(1)').attr("href", oldhref)
}
//汇报单
function nexthb() {
    var oldhref = $('#Nav li.layui-nav-item:eq(4) > dl.layui-nav-child > dd > a:eq(2)').attr("href");
    var href = oldhref
    // href = href.substr(0, href.length - 1);  
    if (href.split("?")[1].split("=")[1] == '10') {
        href = href.substr(0, href.length - 1);
    }

    console.log(href)
    $('#Nav li.layui-nav-item:eq(4) > dl.layui-nav-child > dd > a:eq(2)').attr("href", href)
    $('#Nav li.layui-nav-item:eq(4) > dl.layui-nav-child > dd > a:eq(2)').trigger('click');
    $('#Nav li.layui-nav-item:eq(4) > dl.layui-nav-child > dd > a:eq(2)').attr("href", oldhref)
}

// 新增
//查看


//金蝶生产订单    0新增   1查看   2变更
function protypesta(sta, id) {
    var oldhref = $('#Nav li.layui-nav-item:eq(8) > dl.layui-nav-child > dd > a:eq(0)').attr("href");
    var href = oldhref
    href = href.split("?")[0] + '?status=' + sta
    if (id) {
        href = href + '&interid=' + id;
    }
    console.log(href)
    $('#Nav li.layui-nav-item:eq(8) > dl.layui-nav-child > dd > a:eq(0)').attr("href", href)
    $('#Nav li.layui-nav-item:eq(8) > dl.layui-nav-child > dd > a:eq(0)').trigger('click');
    $('#Nav li.layui-nav-item:eq(8) > dl.layui-nav-child > dd > a:eq(0)').attr("href", oldhref)
}



// 新增物料
function addmater() {
    $('#Nav li.layui-nav-item:eq(7) > dl.layui-nav-child > dd > a:eq(2)').trigger('click');
}
//查看物料
function editmater(name,nick) {
    var oldhref = $('#Nav li.layui-nav-item:eq(7) > dl.layui-nav-child > dd > a:eq(2)').attr("href");
    var href = oldhref
    href = href + '?matername=' + name+'&maternick='+nick;
    $('#Nav li.layui-nav-item:eq(7) > dl.layui-nav-child > dd > a:eq(2)').attr("href", href)
    $('#Nav li.layui-nav-item:eq(7) > dl.layui-nav-child > dd > a:eq(2)').trigger('click');
    $('#Nav li.layui-nav-item:eq(7) > dl.layui-nav-child > dd > a:eq(2)').attr("href", oldhref)
    
}



// 流程图
function changeLct(nav, navl) {

    $('#Nav li.layui-nav-item:eq(' + nav + ') > dl.layui-nav-child > dd > a:eq(' + navl + ')').trigger('click');
}

// 导出excel
function printable() {
    console.log(1)
    $(".tablelist").table2excel({
        exclude: ".noExl",
        name: "Excel Document Name",
        filename: "表格" + new Date().toISOString().replace(/[\-\:\.]/g, ""),
        fileext: ".xlxs",
        exclude_img: true,
        exclude_links: true,
        exclude_inputs: true
    });
}


// 销售订单明细
function getscale(name,id){
    var oldhref = $('#Nav li.layui-nav-item:eq(3) > dl.layui-nav-child > dd > a:eq(1)').attr("href");
    var href = oldhref
    href = href + '?scaleorder=' + name+'&scaleid='+id;
    $('#Nav li.layui-nav-item:eq(3) > dl.layui-nav-child > dd > a:eq(1)').attr("href", href)
    $('#Nav li.layui-nav-item:eq(3) > dl.layui-nav-child > dd > a:eq(1)').trigger('click');
    $('#Nav li.layui-nav-item:eq(3) > dl.layui-nav-child > dd > a:eq(1)').attr("href", oldhref)
}

// 新建销售订单
function newscale(){
    $('#Nav li.layui-nav-item:eq(3) > dl.layui-nav-child > dd > a:eq(2)').trigger('click');
}




// 新增模板
function newtemp(){
    $('#Nav li.layui-nav-item:eq(7) > dl.layui-nav-child > dd > a:eq(9)').trigger('click');
}

// 查看修改模板
function gettemplte(type,id){
    var oldhref = $('#Nav li.layui-nav-item:eq(7) > dl.layui-nav-child > dd > a:eq(10)').attr("href");
    var href = oldhref
    href = href + '?type=' + type+'&tepid='+id;
    $('#Nav li.layui-nav-item:eq(7) > dl.layui-nav-child > dd > a:eq(10)').attr("href", href)
    $('#Nav li.layui-nav-item:eq(7) > dl.layui-nav-child > dd > a:eq(10)').trigger('click');
    $('#Nav li.layui-nav-item:eq(7) > dl.layui-nav-child > dd > a:eq(10)').attr("href", oldhref)
}

// 新增客户信息
function newcustom(){
    $('#Nav li.layui-nav-item:eq(7) > dl.layui-nav-child > dd > a:eq(6)').trigger('click');
}
// 新增供应商信息
function newsupp(){
    $('#Nav li.layui-nav-item:eq(7) > dl.layui-nav-child > dd > a:eq(7)').trigger('click');
}

// 新增生产订单
function newproduct(){
    $('#Nav li.layui-nav-item:eq(5) > dl.layui-nav-child > dd > a:eq(0)').trigger('click');
}
// 查看生产订单
function getproduct(id){
    var oldhref = $('#Nav li.layui-nav-item:eq(5) > dl.layui-nav-child > dd > a:eq(9)').attr("href");
    var href = oldhref
    href = href + '?fid='+id
    $('#Nav li.layui-nav-item:eq(5) > dl.layui-nav-child > dd > a:eq(9)').attr("href", href)
    $('#Nav li.layui-nav-item:eq(5) > dl.layui-nav-child > dd > a:eq(9)').trigger('click');
    $('#Nav li.layui-nav-item:eq(5) > dl.layui-nav-child > dd > a:eq(9)').attr("href", oldhref)
    
}
// 新增仓库
function newstock(){
    $('#Nav li.layui-nav-item:eq(7) > dl.layui-nav-child > dd > a:eq(12)').trigger('click');

}