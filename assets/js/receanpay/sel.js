(function ($) {
    $.fn.gobalSearch = function (options) {
      var defaults = {
        contanier: '',
        //drop menu contentsearch_list
        prevTrIndex: '',
        //mark prevTrIndex
        items: ['Private Equity Firms', 'Portfolio Companies', 'Professionals', 'Lenders'] //['Private Equity Firms','Portfolio Companies','Professionals','Lenders']
      };
      var options = $.extend(defaults, options);
      this.each(function () {
        var globalSearch = $(this);
        var searchbtn = globalSearch.next();
        var nextele = globalSearch.parent().next();
        var drop_li = nextele.children();
        var prevEle = $("#" + options.prevTrIndex);
        //js方法判断当前搜索框触发return按键
        /*globalSearch.keydown(function(event){
          var evt=event ? event : (window.event ? window.event:null);//兼容IE和FF
          if (evt.keyCode==13){ 
            nextele.show();
            globalSearch.blur();
            mainDrop();
          }
        });*/
        //jquery借助jquery.hotkey.js插件获取键盘return按键的事件
        globalSearch.bind('keydown', 'return', function (evt) {
          nextele.show();
          globalSearch.blur();
          mainDrop();
        });
        drop_li.bind('click', function () {
          var $this = $(this);
          var selectVal = $this.text();
          var searchVal = globalSearch.val();
          var relVal = $this.children('a').attr('rel');
          switch (selectVal) {
          case options.items[0]:
            window.location.href = relVal + searchVal;
            break;
          case options.items[1]:
            window.location.href = relVal + searchVal;
            break;
          case options.items[2]:
            window.location.href = relVal + searchVal;
            break;
          case options.items[3]:
            window.location.href = relVal + searchVal;
            break;
          default:
            return false;
          };
          nextele.hide();
          return false;
        });
        $(document).bind('keydown', 'up', function (evt) {
          var prevTrIndex = parseInt(prevEle.val());
          if (prevTrIndex == -1 || prevTrIndex == 0) {
            clickTr(trSize - 1);
          } else if (prevTrIndex > 0) {
            clickTr(prevTrIndex - 1);
          };
          return false;
        }).bind('keydown', 'down', function (evt) {
          var prevTrIndex = parseInt(prevEle.val());
          if (prevTrIndex == -1 || prevTrIndex == (trSize - 1)) {
            clickTr(0);
          } else if (prevTrIndex < (trSize - 1)) {
            clickTr(prevTrIndex + 1);
          };
          return false;
        }).bind('keydown', 'return', function (evt) {
          var prevTrIndex = parseInt(prevEle.val());
          var searchVal = globalSearch.val();
          var curli = $("#li_" + prevTrIndex);
          var selectVal = curli.text();
          var relVal = curli.children('a').attr('rel');
          switch (selectVal) {
          case options.items[0]:
            window.location.href = relVal + searchVal;
            break;
          case options.items[1]:
            window.location.href = relVal + searchVal;
            break;
          case options.items[2]:
            window.location.href = relVal + searchVal;
            break;
          case options.items[3]:
            window.location.href = relVal + searchVal;
            break;
          default:
            return false;
          };
          nextele.hide();
          return false;
        }).bind('click', function () {
          nextele.hide();
        });
        searchbtn.click(function () {
          if (!(nextele.css('display') == 'block')) {
            nextele.show();
            $(this).blur();
            mainDrop();
            return false;
          } else {
            nextele.hide();
            return false;
          };
        }).bind('keydown', 'return', function () {
          nextele.show();
          $(this).blur();
          mainDrop();
          return false;
        });
        //为当前选中的li选中样式
  
  
        function clickTr(currTrIndex) {
          var prevTrIndex = prevEle.val();
          if (currTrIndex > -1) {
            $("#li_" + currTrIndex).addClass("current");
          }
          $("#li_" + prevTrIndex).removeClass("current");
          prevEle.val(currTrIndex);
          $("#nuname").val(currTrIndex);
        };
        //下拉菜单添加事件集合方法
  
        function mainDrop() {
          drop_li.eq(0).focus();
          drop_li.removeClass('current');
          prevEle.val("-1"); //默认-1
          trSize = $("#" + options.contanier).find('li').size(); //li的数量
          drop_li.mouseover(function () { //鼠标滑过
            $(this).addClass("current");
          }).mouseout(function () { //鼠标滑出
            $(this).removeClass("current");
          }).each(function (i) { //初始化 id 和 index 属性
            $(this).attr("id", "li_" + i).attr("index", i);
          }).click(function () { //鼠标单击
            clickTr($(this).attr("index"));
          });
          clickTr(0);
          return false;
        };
      });
    };
  })(jQuery);
 