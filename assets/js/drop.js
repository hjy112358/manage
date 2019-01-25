$(function(){
    var d1=new dragTable();
    d1.init({
      tabel: '#tablelist'
    });
  })
  function dragTable() {
    this.disX = 0; // 相对按下的位置移动的距离
    this.outX = 0; // 鼠标按下的点到大盒子边上的距离
    this.lanX = 0; // 拖动到的位置
    this.$createDiv = null;
    this.$createDivBg = null;
    this.clickEv = null;
    this.set = {
      tabel: '#tablelist'
    }
  }
  dragTable.prototype.init = function(opt) {
    $.extend(this.set, opt);
    this.$createDiv = $('<div class="createDiv hidden" ></div>');
    this.$createDivBg = $('<div class="createDivBg hidden"></div>'); // 防止复制页面的文字；
    this.events();
  }
  dragTable.prototype.events = function() {
    var $th = $(this.set.tabel).find('th');
    var that = this;
    $(document).on('mousedown',this.set.tabel +' th',function(e){
      that.clickEv = this;
      that.mousedown(this,e);
      that.$createDivBg.show();
    });
    $(document).on('mouseup',this.set.tabel +' th,.createDiv,.createDivBg',function(e){
      that.mouseup(this,e);
    })
  }
  dragTable.prototype.mousedown = function(that, e){
    $('body').append(this.$createDiv,this.$createDivBg);
    this.$createDiv.html($(that).html()).hide();
    this.outX = e.pageX - $(that).offset().left;
    var initX = e.pageX;
    var that = this;
    $(document).on('mousemove', function (ev) {
        that.mousemove(that, initX, ev);
    });
  }
  dragTable.prototype.mousemove=function(that, initX, ev){
    this.disX = ev.pageX - initX;
    this.lanX = ev.pageX;
    this.$createDiv.css({top:ev.pageY-20,left:ev.pageX-10});
    this.getCurrentTh('move');
    Math.abs(this.disX)>4?this.$createDiv.show():this.$createDiv.hide();
  }
  dragTable.prototype.mouseup=function(that, ev){
    $(document).unbind('mousemove');
    this.resetTable();
  }
  dragTable.prototype.resetTable = function(){
    this.$createDiv.remove();
    this.$createDivBg.remove();
    this.getCurrentTh('up');
    this.lanX = 0;
    this.disX = 0; // 重置disX
    this.showBorder('all',{'border-color':'#d8d8d8'});
  }
  dragTable.prototype.getCurrentTh = function(type){
    var that = this;
    $(this.set.tabel +' th').each(function (index,item){
      var l = $(item).offset().left;
      var r = $(item).offset().left + $(item).width();
      if(that.lanX > l && that.lanX < r){
        that.showBorder(index,{'border-color':'#d8d8d8'});
        if(that.disX>4) { // 右
          that.showBorder(index,{'border-right':'2px solid red'});
          type=='up'? that.setThTd(index,'after') :'';
        }
        if(that.disX<-4){ // 左边
          that.showBorder(index,{'border-left':'2px solid red'});
          type=='up'? that.setThTd(index,'before') :'';
        }
      }else{
        that.showBorder(index,{'border-color':'#d8d8d8'})
      }
    })
  }
  dragTable.prototype.setThTd = function(newsindex,type){
    var oldIndex = $(this.clickEv).index();
    var $th = $(this.set.tabel +' th').eq(oldIndex);
    $(this.set.tabel +' th').eq(newsindex)[type]($th.clone());
    $th.remove();
    $(this.set.tabel +' tbody tr').each(function (index, tdelement) {
        var $td = $(tdelement).find('td').eq(oldIndex);
        $(tdelement).find('td').eq(newsindex)[type]($td.clone());
        $td.remove();
    });
  }
  dragTable.prototype.showBorder = function(newsindex,css){
    if(newsindex == 'all'){
      $(this.set.tabel +' th').css(css);
      $(this.set.tabel +' td').css(css);
      return;
    }
    $(this.set.tabel +' th').eq(newsindex).css(css)
    $(this.set.tabel +' tbody tr').each(function (index, tdelement) {
        $(tdelement).find('td').eq(newsindex).css(css);
    });
  }