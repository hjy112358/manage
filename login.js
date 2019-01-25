layui.define(['element'], function (exports) {
    var $ = layui.$;
    $('.input-field').on('change', function () {
        var $this = $(this),
            value = $.trim($this.val()),
            $parent = $this.parent();

        if (value !== '' && !$parent.hasClass('field-focus')) {
            $parent.addClass('field-focus');
        } else {
            $parent.removeClass('field-focus');
        }
    })
    exports('login');
});

$(function () {
    var layer
    layui.use(['layer'], function () {
        layer = layui.layer;
    })
    clearAllCookie();
    var loginis = true;
    $(".login").on("click", function () {
        var name = $("#username").val();
        var pass = hex_md5($("#password").val());
        if (name == '') {
            layer.alert("请输入用户名");
            loginis = false;
            return;
        }else {
            loginis = true;
            var index = layer.load();
        }
        clearAllCookie();
        if (loginis) {
            $.ajax({
                type: "GET",
                // async:false,
                url: ajaxURl + '/Api/SystemManager/User/GetToken?username='+name+'&password='+pass,
                success: function (res) {
                    var date = res;
                    console.log(date.Succeed)
                    if (date.Succeed) {
                        layer.close(index);
                        var name = date.Data.User_Name;
                        $.cookie("name", name);
                        $.cookie("User_Id", date.Data.User_Id);
                        $.cookie("User_Nick", date.Data.User_Nick);
                        $.cookie("Modify_User", date.Data.User_Id);
                        // $.cookie("Token",date.Data.User_Token); 
                        $.cookie("token", "f7600cdc-6aaa-43e3-b46a-a2bba0bfdd56");
                        window.location.href = "index.html";
                    } else {
                        layer.close(index);
                        alert(date.message)
                    }
                }
            })
        }

    })
    if (loginis) {
        $(document).keyup(function (event) {
            if (event.keyCode == 13) {
                $(".login").trigger("click");
            }
        });
    }
})


function clearAllCookie() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if(keys) {
        for(var i = keys.length; i--;)
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
    }
}