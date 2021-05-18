$(function () {
    /*画布验证码*/
    var canvas = document.getElementsByTagName("canvas")[0]; //获取画布
    var ctx = canvas.getContext('2d');
    var tempCount; //保存最终四位验证码

    function getRandom(min, max) { //获取随机数方法
        return Math.floor(Math.random() * (max - min) + min);
    }

    function AddCanvasContent() { //添加画布内容的方法
        ctx.rect(0, 0, 300, 150) //画布大小
        ctx.fillStyle = "pink"; //设置填充画布粉色
        ctx.fill(); //填充画布

        for (var i = 0; i < 200; i++) { //创建二百个背景小点
            ctx.beginPath(); //画布路劲初始化
            var dotLong = getRandom(2, 300); //设置小点横向位置
            var dotWidth = getRandom(2, 150); //设置小点纵向位置
            // console.log(dotWidth)
            ctx.arc(dotLong, dotWidth, 1.5, 0, 2 * Math.PI); //随机添加小点
            ctx.fillStyle = "orangered"; //更改填充颜色
            ctx.fill(); //填充开始
        }

        for (var i = 0; i < 10; i++) { //创建十条位置不同的直线
            var straightRandom = getRandom(0, 150); //设置左侧顶点直线位置
            var straightRandom2 = getRandom(0, 150); //设置右侧直线顶点位置
            ctx.beginPath(); //初始化
            ctx.moveTo(0, straightRandom); //绘画起始点
            ctx.lineTo(300, straightRandom2); //绘画终点与起始点开始连线
            var colorRandom1 = getRandom(0, 256); //随机颜色r
            var colorRandom2 = getRandom(0, 256); //随机颜色g
            var colorRandom3 = getRandom(0, 256); //随机颜色b
            var nk = "rgba(" + colorRandom1 + "," + colorRandom2 + "," + colorRandom3 + ")"; //得到随机颜色
            ctx.strokeStyle = nk; //设置填充的直线颜色
            ctx.stroke(); //填充颜色
        }

        var textRandom = []; //存储十个数字+52个大小写字母
        for (var i = 0; i < 10; i++) { //给数组添加0-9的数字
            textRandom.push(i);
        }
        for (var i = 65; i <= 90; i++) { //给数组添加A-Z的字母
            var temp = String.fromCharCode(i); //ASCLL码转换为字母
            textRandom.push(temp);
        }
        for (var i = 97; i <= 122; i++) { //给数组添加a-z的字母
            var temp = String.fromCharCode(i); //ASCLL码转换为字母
            textRandom.push(temp);
        }

        var addX = 20; //第一个文字的位置区间
        var addY = addX + 60; //下一个文字的位置区间
        var n; //存储取出来的文字
        var count = ""; //保存四位验证码
        ctx.font = "80px Georgia"; //设置字体大小
        for (var i = 0; i < 4; i++) {
            var colorRandom1 = getRandom(0, 256); //文字随机颜色
            var colorRandom2 = getRandom(0, 256);
            var colorRandom3 = getRandom(0, 256);
            var nk = "rgba(" + colorRandom1 + "," + colorRandom2 + "," + colorRandom3 + ")"; //给文字颜色赋值
            n = textRandom[getRandom(0, 62)]; //随机取出一个数组中的文字
            ctx.beginPath(); //初始化
            var txtRandom1 = getRandom(addX, addY); //文字横轴位置
            var txtRandom2 = getRandom(70, 130); //文字纵轴位置
            addX += 60; //给下一个文字出现的位置区间重新赋值
            addY = addX + 60;
            ctx.fillStyle = nk; //设置文字颜色
            count += n; //存储当前为验证码与之前的合并
            ctx.fillText(n, txtRandom1, txtRandom2); //添加文字
        }
        tempCount = count; //记录当前刷新出来的四位最终验证码
        count = ""; //清空存储验证码的容器避免下次点击继续得加叠加
    }
    AddCanvasContent(); //执行，刷新出第一次随机验证码
    canvas.onclick = function () { //点击验证码再次刷新新的
        AddCanvasContent();
        $(".container button").prop("disabled", true).css({ //验证码重置取消按钮继续可点bug
            backgroundColor: "#ccc",
            cursor: "no-drop"
        });
        console.log("小米ID:" + FinalUserName + "\n密码:" + FinalPow + "\n邮箱:" + FinalEmail + "\n手机号:" + FinalPhone + "\n验证码:" + tempCount);
    }

    //切换登录和注册
    $(".login .login_title div:nth-child(3)").click(function () { //点击注册
        $(".login .container").addClass("hidden"); //登录隐藏
        $(".login .login_title div:nth-child(1)").css("color", "#666")
        $(".login .registered").removeClass("hidden"); //注册显示
        $(".login .login_title div:nth-child(3)").css("color", "#f56600")
    })
    $(".login .login_title div:nth-child(1)").click(function () { //点击登录
        $(".login .container").removeClass("hidden"); //注册隐藏
        $(".login .login_title div:nth-child(3)").css("color", "#666")
        $(".login .registered").addClass("hidden"); //登录显示
        $(".login .login_title div:nth-child(1)").css("color", "#f56600")
    })

    //判断注册表单是否符合规定
    var FinalUserName = ""; //存储最终用户名
    var FinalPow = ""; //存储最终密码
    var FinalEmail = ""; //存储最终邮箱
    var FinalPhone = ""; //存储最终手机号
    var countDown = 60; //验证码倒计时时间
    var countDownTime = null; //倒计时计时器
    var numArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; //用于组成五个随机数字做验证码
    var verificationCode = ""; //最终验证码
    var verificationCodeKey = false; //判断验证码是否忽略大小写
    var reg = /^[a-zA-Z0-9_-]{4,16}$/; //判断用户名 4到16位（字母，数字，下划线，减号）
    var reg1 = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/; //判断密码
    var reg2 = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/; //判断邮箱
    var reg3 = /^[1][3,4,5,6,7,8,9][0-9]{9}$/; //判断手机号
    $(".basicRegistration:nth-child(1) input").on("input", function () { //给用户名文本框添加事件
        if (reg.test($(".basicRegistration:nth-child(1) input").val()) == true) { //正则判断是否符合要求
            $(".basicRegistration:nth-child(1) p").text("该用户名可用").css("color", "green"); //符合条件提示文字变色
            $(".basicRegistration:nth-child(1) p").addClass("icon-zhengque");
        } else if ($(".basicRegistration:nth-child(1) input").val() == 0) { //中途清空文本框初始化提示文字
            $(".basicRegistration:nth-child(1) p").text("填写用户名4到16位(字母,数字,下划线,减号)").css("color", "#ccc")
        } else { //如果输入的正则不匹配则发出警告
            $(".basicRegistration:nth-child(1) p").text("该用户名有误或已注册").css("color", "red")
            $(".basicRegistration:nth-child(1) p").removeClass("icon-zhengque");
        }
        registeredClick(); //判断所有文本框是否都正确
    })
    $(".basicRegistration:nth-child(2) input").on("input", function () { //密码框，注释同上
        if (reg1.test($(".basicRegistration:nth-child(2) input").val()) == true) {
            $(".basicRegistration:nth-child(2) p").text("该密码正确").css("color", "green");
            $(".basicRegistration:nth-child(2) p").addClass("icon-zhengque");
        } else if ($(".basicRegistration:nth-child(2) input").val() == 0) {
            $(".basicRegistration:nth-child(2) p").text("填写密码(数字+字母)").css("color", "#ccc")
        } else {
            $(".basicRegistration:nth-child(2) p").text("该密码格式不正确").css("color", "red")
            $(".basicRegistration:nth-child(2) p").removeClass("icon-zhengque");
        }
        registeredClick()
    })
    $(".basicRegistration:nth-child(3) input").on("input", function () { //确认密码框，注释同上
        if ($(".basicRegistration:nth-child(3) input").val() == $(".basicRegistration:nth-child(2) input").val()) {
            $(".basicRegistration:nth-child(3) p").text("该密码正确").css("color", "green");
            $(".basicRegistration:nth-child(3) p").addClass("icon-zhengque");
        } else if ($(".basicRegistration:nth-child(3) input").val() == 0) {
            $(".basicRegistration:nth-child(3) p").text("填写密码(数字+字母)").css("color", "#ccc")
        } else {
            $(".basicRegistration:nth-child(3) p").text("该密码格式不正确").css("color", "red")
            $(".basicRegistration:nth-child(3) p").removeClass("icon-zhengque");
        }
        registeredClick()
    })
    $(".basicRegistration:nth-child(4) input").on("input", function () { //邮箱框，注释同上
        if (reg2.test($(".basicRegistration:nth-child(4) input").val()) == true) {
            $(".basicRegistration:nth-child(4) p").text("该邮箱可用").css("color", "green");
            $(".basicRegistration:nth-child(4) p").addClass("icon-zhengque");
        } else if ($(".basicRegistration:nth-child(4) input").val() == 0) {
            $(".basicRegistration:nth-child(4) p").text("填写常用邮箱").css("color", "#ccc")
        } else {
            $(".basicRegistration:nth-child(4) p").text("该邮箱格式有误或已被注册").css("color", "red")
            $(".basicRegistration:nth-child(4) p").removeClass("icon-zhengque");
        }
        registeredClick()
    })
    $(".send input").on("input", function () { //手机号与验证码框，注释同上
        if (reg3.test($(".send input").val()) == true) {
            $(".send p").text("该号码可用").css("color", "green");
            $(".send button").prop("disabled", false);
            $(".send button").css("cursor", "pointer")
        } else if ($(".send input").val() == 0) {
            $(".send p").text("填写十一位手机号并按下发送填写验证码").css("color", "#ccc")
        } else {
            $(".send p").text("该号码不可用").css("color", "red")
            $(".send p").removeClass("icon-zhengque");
            $(".send button").prop("disabled", true);
            $(".send button").css("cursor", "no-drop")
        }
    })
    $(".send button").click(function () { //点击发送短信验证按钮
        FinalPhone = $(".send input").val(); //储存当前输入的正确号码
        $(".send input").val(""); //清空号码
        $(".send p").text("请输入收到的验证码").css("color", "purple"); //提示信息修改为验证码提示并且变色
        $(".send p").removeClass("icon-zhengque"); //删除提示信息前面的钩钩
        $(".send button").prop("disabled", true); //按钮设定为不可点状态
        $(".send button").css("cursor", "no-drop"); //改变移入样式
        $(".send input").unbind(); //给手机输入框解绑输入事件
        $(".send input").on("input", function () { //重新给手机输入框绑定输入事件
            if ($(".send input").val() == verificationCode && $(".send input").val() != "") { //判断验证码是否正确并且不为空
                $(".send p").text("验证码输入正确").css("color", "green"); //正确的话改变颜色
                $(".send p").addClass("icon-zhengque");
            } else if ($(".send input").val() == 0) { //如果为空则初始化信息提示
                $(".send p").text("请输入收到的验证码").css("color", "purple")
            } else { //如果验证码错误则发出红色信息警告
                $(".send p").text("验证码有误请核对后再试").css("color", "red")
                $(".send p").removeClass("icon-zhengque");
            }
            registeredClick(); //判断所有文本框是否都正确
        })
        for (var i = 0; i < 5; i++) { //随机取出五个数字并且组合赋值给verificationCode，模拟短信验证码
            var temp = getRandom(0, numArr.length);
            verificationCode += temp;
        }
        setTimeout(function () { //延迟两秒执行收到验证码
            alert("您的验证码为:" + verificationCode + ";该验证码将在60秒后失效请尽快输入");
        }, 2000)
        countDownTime = setInterval(function () { //发送短信后60秒倒计时
            countDown--; //每次减1秒
            $(".send button").text("(" + countDown + ")"); //给按钮赋值，使其倒计时
            if (countDown == 0) { //如果倒计时为零
                clearInterval(countDownTime); //定时器停止
                countDown = 60; //初始化倒计时
                verificationCode = ""; //验证码清空，避免时间到还可以验证成功
                $(".send button").text("重新发送"); //以下为初始化按钮
                $(".send button").prop("disabled", false);
                $(".send button").css("cursor", "pointer")
                $(".send p").text("验证码已失效请重新获取").css("color", "red")
                $(".send p").removeClass("icon-zhengque");
                $(".btn").prop("disabled", false).css({
                    backgroundColor: "#ccc",
                    cursor: "no-drop"
                });
            }
        }, 1000);
    })

    function registeredClick() { //判断注册按钮是否可以点击
        if (($(".basicRegistration:nth-child(1) p").attr("class") == "iconfont icon-zhengque") && ($(".basicRegistration:nth-child(2) p").attr("class") == "iconfont icon-zhengque") && ($(".basicRegistration:nth-child(3) p").attr("class") == "iconfont icon-zhengque") && ($(".basicRegistration:nth-child(4) p").attr("class") == "iconfont icon-zhengque") && ($(".send p").attr("class") == "iconfont icon-zhengque")) {
            //如果所有的注册框前面都有钩钩则改变注册按钮的样式
            $(".btn").prop("disabled", false).css({
                backgroundColor: "#ff6700",
                cursor: "pointer"
            });
            FinalUserName = $(".basicRegistration:nth-child(1) input").val(); //存储用户名
            FinalPow = $(".basicRegistration:nth-child(2) input").val(); //存储密码
            FinalEmail = $(".basicRegistration:nth-child(4) input").val(); //存储邮箱
        } else { //如果有一个没有钩钩则注册按钮不可点，以下为初始化注册按钮
            $(".btn").prop("disabled", false).css({
                backgroundColor: "#ccc",
                cursor: "no-drop"
            });
            FinalUserName = "";
            FinalPow = "";
            FinalEmail = "";
        }
    }
    $(".btn").click(function () { //点击注册按钮
        alert("注册成功,点击确定为您切换到登录页面");
        $(".login .container").removeClass("hidden"); //注册隐藏
        $(".login .login_title div:nth-child(3)").css("color", "#666");
        $(".login .registered").addClass("hidden"); //登录显示
        $(".login .login_title div:nth-child(1)").css("color", "#f56600");
        console.log("小米ID:" + FinalUserName + "\n密码:" + FinalPow + "\n邮箱:" + FinalEmail + "\n手机号:" + FinalPhone + "\n验证码:" + tempCount);
    })

    function registerClick() { //判断登录按钮是否可以点击
        if ((($(".account").val() == FinalUserName) || ($(".account").val() == FinalEmail) || ($(".account").val() == FinalPhone)) && $(".pow").val() == FinalPow && verificationCodeKey) {
            //id或邮箱或手机号正确并且密码，验证码正确则开启登录按钮
            $(".container button").prop("disabled", false).css({
                backgroundColor: "#ff6700",
                cursor: "pointer"
            });
        } else { //如果有一条不成立则取消登录按钮样式
            $(".container button").prop("disabled", true).css({
                backgroundColor: "#ccc",
                cursor: "no-drop"
            });
        }
    }
    $(".account").on("input", function () { //对输入的用户名判断是否全部输入正确
        registerClick();
    })
    $(".pow").on("input", function () { //对输入的密码判断是否全部输入正确
        registerClick();
    })
    $(".container_yz input").on("input", function () { //对输入的验证码判断是否全部输入正确
        if ($(".container_yz input").val().length == 4) { //当输入到最后一位时
            for (var i = 0; i < 4; i++) { //以下操作为忽略验证码大小写
                if ($(".container_yz input").val()[i] == (tempCount[i].toLowerCase()) || $(".container_yz input").val()[i] == tempCount[i]
                    .toUpperCase()) {
                    verificationCodeKey = true; //如果不计算大小写匹配并且成功则打开钥匙
                } else { //有一个不匹配则关闭钥匙
                    verificationCodeKey = false;
                    break;
                }
            }
        } else { //如果验证码不满四位也关闭钥匙
            verificationCodeKey = false;
        }
        registerClick(); //最后进行验证是否能够开启登录按钮
    })
    $(".container button").click(function () { //点击登录按钮
        alert("登录成功即将为您跳转页面！");
        $(".container input").val(""); //清空登录的账号密码
        $(".loginContainer").addClass("hidden");
        $(".index").removeClass("hidden");
        $(".index nav ul li:nth-child(17)>a").text(FinalUserName); //给index导航传入登录的id号
    })


    /*主页开始*/
    $(".index nav ul li:nth-child(12)").mouseover(function () { //导航下载动画
        $(".index nav ul li:nth-child(12) div").stop().slideDown();
    })
    $(".index nav ul li:nth-child(12)").mouseout(function () { //导航下载动画
        $(".index nav ul li:nth-child(12) div").stop().slideUp();
    })
    $(".index nav ul li:nth-child(17)").mouseover(function () { //导航用户名动画
        $(".index nav ul li:nth-child(17) ul").stop().slideDown();
    })
    $(".index nav ul li:nth-child(17)").mouseout(function () { //导航用户名动画
        $(".index nav ul li:nth-child(17) ul").stop().slideUp();
    })
    $(".index nav ul li:nth-child(14)").mouseover(function () { //导航购物车动画
        $(".index nav ul li:nth-child(14) ul").stop().slideDown();
    })
    $(".index nav ul li:nth-child(14)").mouseout(function () { //导航购物车动画
        $(".index nav ul li:nth-child(14) ul").stop().slideUp();
    })

    $(".index nav ul li:nth-child(17) ul li:nth-child(5)").click(function () { //点击退出登录返回登录页
        $(".index").addClass("hidden");
        $(".loginContainer").removeClass("hidden");
    })

    $(".index .mainNav .searchBox input").on("focus", function () { //搜索框获取到焦点则里面内容看不见
        $(".index .mainNav .searchBox p:nth-child(3)").css("opacity", "0");
        $(".index .mainNav .searchBox p:nth-child(4)").css("opacity", "0");
        $(".index .mainNav .searchBox div").css("borderColor", "#ff6700");
        $(".index .mainNav .searchBox input").css("borderColor", "#ff6700");

    })
    $(".index .mainNav .searchBox input").on("blur", function () { //搜索框获取到焦点则里面内容显示
        $(".index .mainNav .searchBox p:nth-child(3)").css("opacity", "1");
        $(".index .mainNav .searchBox p:nth-child(4)").css("opacity", "1");
        $(".index .mainNav .searchBox div").css("borderColor", "#eee");
        $(".index .mainNav .searchBox input").css("borderColor", "#eee");
    })

    $(".index .mainNav>ul>li").mouseover(function () { //导航购物车动画
        $(this).children("div").stop().slideDown();
    })
    $(".index .mainNav>ul>li").mouseout(function () { //导航购物车动画
        $(this).children("div").stop().slideUp();
    })

    /*轮播图*/

    var index = 0; //存储当前下标
    for (let i = 0; i < $(".slideshowDot li").length; i++) { //循环添加事件
        $(".slideshowDot li").eq(i).click(function () { //给每个圆点添加事件
            $(".slideshowDot li").removeClass("active"); //清空一遍当前的圆点样式
            $(".slideshowImg img").removeClass("active"); //清空一遍当前的圆点样式
            $(this).addClass("active"); //给选中圆点添加样式
            $(".slideshowImg img").eq(i).addClass("active"); //显示选中图片
            index = i; //每次点击后给下标重新赋值
        })
    }
    $(".arrowsLeft").click(function () { //点击轮播图左边按钮
        index--;
        if (index == -1) { //如果下标为最后一张
            index = $(".slideshowDot li").length - 1; //直接把最后一张图的下标赋给index
        }
        $(".slideshowDot li").removeClass("active"); //同上
        $(".slideshowImg img").removeClass("active");
        $(".slideshowDot li").eq(index).addClass("active");
        $(".slideshowImg img").eq(index).addClass("active");
    })
    $(".arrowsRight").click(function () { //点击轮播图右边按钮
        index++;
        if (index == $(".slideshowDot li").length) { //如果下标为第一张
            index = 0; //直接把第一张图的下标赋给index
        }
        $(".slideshowDot li").removeClass("active"); //同上
        $(".slideshowImg img").removeClass("active");
        $(".slideshowDot li").eq(index).addClass("active");
        $(".slideshowImg img").eq(index).addClass("active");
    })
    var AutomaticallyTimer = null; //自动轮播定时器
    function Automatically() { //自动轮播函数
        AutomaticallyTimer = setInterval(function () {
            index++;
            if (index == $(".slideshowDot li").length) { //如果自动跳转到最后一张图
                index = 0; //返回第一张
            }
            $(".slideshowDot li").removeClass("active"); //同上
            $(".slideshowImg img").removeClass("active");
            $(".slideshowDot li").eq(index).addClass("active");
            $(".slideshowImg img").eq(index).addClass("active");
        }, 2500)
    }
    Automatically();
    $(".slideshow_right").mouseover(function () { //鼠标移入停止自动轮播
        clearInterval(AutomaticallyTimer);
    })
    $(".slideshow_right").mouseout(function () { //鼠标移出开启自动轮播
        Automatically();
    })

    /*小米闪购区域的轮播*/
    // 左边箭头
    var clickTime = new Date().getTime(); //定义最初点击时间
    $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(1)").click(function () {
        //给左边箭头添加点击事件
        if (new Date().getTime() - clickTime <= 1000) {
            //如果两次点击时间小于一秒钟则不执行该事件
            return;
        } else {
            clickTime = new Date().getTime(); //点击过后重新给最初点击时间赋值
            var temp = parseInt($(".Exhibition ul").css("marginLeft")); //获取当前ul的偏移量
            if (temp < 0) { //当ul不等于第一批图片的时候才执行
                $(".Exhibition ul").animate({ //ul向左移动切换到第二批图片
                    marginLeft: temp + 992
                }, 1000, function () { //移动完毕之后
                    temp = temp + 992;
                    if (temp <= -2976) { //如果ul为最后一批图片
                        //右键按钮取消hover事件并且更改样式为灰色
                        $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(2)").css({
                            color: "#e0e0e0",
                            cursor: "default"
                        })
                        $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(2)").unbind("hover");
                    } else {
                        //如果不为最后一批则初始化一下
                        $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(2)").css({
                            color: "#b0b0b0",
                            cursor: "pointer"
                        })
                        $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(2)").hover(function () {
                            $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(2)").css("color", "#ff6700")
                        }, function () {
                            $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(2)").css("color", "#b0b0b0")
                        })
                    }
                    if (temp >= 0) { //如果为第一张图片
                        //左边按钮样式设为灰色并且取消hover事件
                        $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(1)").css({
                            color: "#e0e0e0",
                            cursor: "default"
                        })
                        $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(1)").unbind("hover");
                    } else {
                        //如果不是第一批图片初始化一遍
                        $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(1)").css({
                            color: "#b0b0b0",
                            cursor: "pointer"
                        })
                        $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(1)").hover(function () {
                            $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(1)").css("color", "#ff6700")
                        }, function () {
                            $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(1)").css("color", "#b0b0b0")
                        })
                    }
                })
            }

        }
    })
    // 右边箭头
    $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(2)").hover(function () {
        //右键移入移出事件
        $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(2)").css("color", "#ff6700")
    }, function () {
        $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(2)").css("color", "#b0b0b0")
    })

    $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(2)").click(function () {
        //给右键添加点击事件    一下注释与左键同理
        if (new Date().getTime() - clickTime <= 1000) {
            return;
        } else {
            clickTime = new Date().getTime();
            var temp = parseInt($(".Exhibition ul").css("marginLeft"));
            if (temp > -2976) {
                $(".Exhibition ul").animate({
                    marginLeft: temp - 992
                }, 1000, function () {
                    temp = temp - 992;
                    if (temp <= -2976) {
                        $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(2)").css({
                            color: "#e0e0e0",
                            cursor: "default"
                        })
                        $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(2)").unbind("hover");
                    } else {
                        $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(2)").css({
                            color: "#b0b0b0",
                            cursor: "pointer"
                        })
                        $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(2)").hover(function () {
                            $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(2)").css("color", "#ff6700")
                        }, function () {
                            $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(2)").css("color", "#b0b0b0")
                        })
                    }
                    if (temp >= 0) {
                        $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(1)").css({
                            color: "#e0e0e0",
                            cursor: "default"
                        })
                        $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(1)").unbind("hover");
                    } else {
                        $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(1)").css({
                            color: "#b0b0b0",
                            cursor: "pointer"
                        })
                        $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(1)").hover(function () {
                            $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(1)").css("color", "#ff6700")
                        }, function () {
                            $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(1)").css("color", "#b0b0b0")
                        })
                    }
                })
            }
        }
    })
    var nkTimer = null; //自动轮播定时器

    function automaticMove() { //自动轮播函数
        nkTimer = setInterval(function () {
            var temp = parseInt($(".Exhibition ul").css("marginLeft"));
            temp = temp - 992;
            if (temp < -2976) { //当图片为最后一批时
                temp = 0 //更改为初始值
            }
            $(".Exhibition ul").animate({
                marginLeft: temp
            }, 1000, function () {
                if (temp <= -2976) { //一下注释均为按钮样式初始化
                    $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(2)").css({
                        color: "#e0e0e0",
                        cursor: "default"
                    })
                    $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(2)").unbind("hover");
                } else {
                    $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(2)").css({
                        color: "#b0b0b0",
                        cursor: "pointer"
                    })
                    $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(2)").hover(function () {
                        $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(2)").css("color", "#ff6700")
                    }, function () {
                        $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(2)").css("color", "#b0b0b0")
                    })
                }
                if (temp >= 0) {
                    $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(1)").css({
                        color: "#e0e0e0",
                        cursor: "default"
                    })
                    $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(1)").unbind("hover");
                } else {
                    $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(1)").css({
                        color: "#b0b0b0",
                        cursor: "pointer"
                    })
                    $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(1)").hover(function () {
                        $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(1)").css("color", "#ff6700")
                    }, function () {
                        $(".index .contentArea .toSnapUp .toSnapUp_title div:nth-child(2) p:nth-child(1)").css("color", "#b0b0b0")
                    })
                }
            })

        }, 5000)
    }
    automaticMove()
    $(".Exhibition li").mouseover(function () { //移入图片停止
        clearInterval(nkTimer);
    })
    $(".Exhibition li").mouseout(function () { //移出图片开始
        automaticMove();
    })

    //12:00倒计时
    var purchaseCountDown = setInterval(function () {
        var presentHour = new Date().getHours(); //获取当前小时
        var presentYear = new Date().getFullYear(); //获取当天年
        var presentMonth = new Date().getMonth(); //获取当天月
        var presentDay = new Date().getDate(); //获取当天日
        if (presentHour < 21) {
            var current_time = new Date(); //当前的时间
            var setting_time = new Date(presentYear, presentMonth, presentDay, 21, 00, 00); //设定的时间
            var timeDifference = setting_time - current_time; //时间差
            var hour = String(Math.floor(timeDifference / 1000 / 60 / 60 % 24)); //剩余小时
            var minute = String(Math.floor(timeDifference / 1000 / 60 % 60)); //剩余分钟
            var second = String(Math.floor(timeDifference / 1000 % 60)); //剩余秒
            if (hour.length == 1) { //如果小时为一位数是前面加个0
                hour = 0 + hour;
            }
            if (minute.length == 1) { //如果分钟为一位数是前面加个0
                minute = 0 + minute;
            }
            if (second.length == 1) { //如果秒钟为一位数是前面加个0
                second = 0 + second;
            }
            //给网页中的时间赋值
            $(".index .contentArea .toSnapUp .countDown p:nth-child(4) span:nth-child(1)").text(hour);
            $(".index .contentArea .toSnapUp .countDown p:nth-child(4) span:nth-child(3)").text(minute);
            $(".index .contentArea .toSnapUp .countDown p:nth-child(4) span:nth-child(5)").text(second);
        }
    }, 1000)

    /*家电热门切换 */
    // 注释不写了，简单选项卡效果没意思
    $(".index .contentArea .appliances .appliances_title span:nth-child(2) i:nth-child(1)").mouseover(function () {
        $(".appliancesContainer_right").eq(1).addClass("hidden")
        $(".appliancesContainer_right").eq(0).removeClass("hidden")
        $(".index .contentArea .appliances .appliances_title span:nth-child(2) i:nth-child(1)").css({
            color: "#ff6700",
            borderBottom: "2px solid #ff6700"
        })
        $(".index .contentArea .appliances .appliances_title span:nth-child(2) i:nth-child(2)").css({
            color: "#424242",
            borderBottom: "none"
        })
    })
    $(".index .contentArea .appliances .appliances_title span:nth-child(2) i:nth-child(2)").mouseover(function () {
        $(".appliancesContainer_right").eq(0).addClass("hidden")
        $(".appliancesContainer_right").eq(1).removeClass("hidden")
        $(".index .contentArea .appliances .appliances_title span:nth-child(2) i:nth-child(2)").css({
            color: "#ff6700",
            borderBottom: "2px solid #ff6700"
        })
        $(".index .contentArea .appliances .appliances_title span:nth-child(2) i:nth-child(1)").css({
            color: "#424242",
            borderBottom: "none"
        })
    })
    /*返回顶部 */
    $(window).scroll(function () { //添加滚动条事件
        if ($(window).scrollTop() > 300) { //如果滚动超过300则显示返回顶部按钮
            $(".returnTop ul li:nth-child(6)").removeClass("hidden")
        } else { //初始化
            $(".returnTop ul li:nth-child(6)").addClass("hidden")
        }
    })
    $(".returnTop ul li:nth-child(6)").click(function () { //点击返回顶部滚动条为0
        $(window).scrollTop("0")
    })

    /*扫地机器人详情页*/
    /*固定导航 */
    $(window).scroll(function () {
        if ($(window).scrollTop() >= 140) { //如果滚动高度超过140则更改为固定导航
            $(".fixed_title").css({
                position: "fixed",
                top: 0,
                left: 0
            })
        } else { //不超过140固定导航取消
            $(".fixed_title").css("position", "static")
        }
        if ($(window).scrollTop() >= 225 && $(window).scrollTop() < 465) { //让轮播图跟随滚动条移动
            $(".slide2").css({
                top: $(window).scrollTop() - 225 + "px"
            })
        }
    })

    //轮播图
    var slide2index = 0; //下标
    for (let i = 0; i < $(".slide2Dot li").length; i++) {
        $(".slide2Dot li").eq(i).click(function () { //点下面横线
            $(".slide2Dot li").removeClass("active"); //修改样式
            $(".slide2Img img").removeClass("active");
            $(this).addClass("active")
            $(".slide2Img img").eq(i).addClass("active");
            slide2index = i;
        })
    }
    $(".arrowhead_right").click(function () { //给有点按钮添加点击事件
        slide2index++; //下标+1
        if (slide2index == 5) { //当下标为最后一张时跳转到第一张
            slide2index = 0;
        }
        $(".slide2Dot li").removeClass("active"); //更改样式
        $(".slide2Img img").removeClass("active");
        $(".slide2Dot li").eq(slide2index).addClass("active")
        $(".slide2Img img").eq(slide2index).addClass("active");
    })
    $(".arrowhead_left").click(function () { //注释同上
        slide2index--;
        if (slide2index == -1) {
            slide2index = 4
        }
        $(".slide2Dot li").removeClass("active");
        $(".slide2Img img").removeClass("active");
        $(".slide2Dot li").eq(slide2index).addClass("active")
        $(".slide2Img img").eq(slide2index).addClass("active");
    })
    //自动轮播
    var s2Timer = null; //用作移入移出定时器
    function zd() {
        s2Timer = setInterval(function () {
            slide2index++; //下标+1
            if (slide2index == 5) { //当下标为最后一张时跳转到第一张
                slide2index = 0;
            }
            $(".slide2Dot li").removeClass("active"); //更改样式
            $(".slide2Img img").removeClass("active");
            $(".slide2Dot li").eq(slide2index).addClass("active")
            $(".slide2Img img").eq(slide2index).addClass("active");
        }, 2500)
    }
    zd();
    $(".slide2Img").mouseover(function(){   //移入停止
        clearInterval(s2Timer);
    })
    $(".slide2Img").mouseout(function(){
        zd();
    })
    $(".live").click(function(){    //爱心按钮
        if($(".live i").attr("class")=="iconfont icon-xihuan1"){
            $(".live i").attr("class","iconfont icon-xihuan");
            $(".live i").css({
                fontSize:"26px",
                color:"#e35935"
            })
        }else{
            $(".live i").attr("class","iconfont icon-xihuan1");
            $(".live i").css({
                fontSize:"16px",
                color:"white"
            })
        }
    })
    $(".joinCar").click(function(){     //点击添加购物车
        //修改样式
        $(".joinCar").css("backgroundColor","#84c54d");
        $(".joinCar").text("添加成功!请到购物车查看")
        $(".billNum").text("( 1 )");
        //创建事先写好的html节点
        var temp = $("<div class=\"clearfix\">\n<img src=\"images/j1.jpg\"><span>米家扫地机器人</span><span class=\"close\">X</span><span>1999元x1</span><p>去购物车结算</p></div>");
        $(".bill").empty();//清空文字
        $(".bill").append(temp);    //添加进去节点
    })
    $(".bill").delegate(".close","click",function(){    //点击购物车里面的删除X
        $(".bill").empty(); //全部清空
        $(".bill").text("购物车中还没有商品，赶紧选购吧!"); //初始化所有值并且可以重新加入到购物车
        $(".billNum").text("( 0 )");
        $(".joinCar").css("backgroundColor","#ff6700");
        $(".joinCar").text("加入购物车")
    })
    $(".robot").click(function(){   //点击主页家电里面的扫地机器人
        $(".BtnI").addClass("hidden");   //主页隐藏
        $(".particulars").removeClass("hidden");     //详情页显示
        $(window).scrollTop(0);  //滚功跳返回顶部
        $(".imgBox").removeClass("hidden"); 
    })
    $(".btnIndex").click(function(){    //点击详情页开头导航的小米商城
        $(".particulars").addClass("hidden");   //隐藏详情页
        $(".BtnI").removeClass("hidden");   //显示主页
    })
})