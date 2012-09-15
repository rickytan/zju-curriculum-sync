function loadjs(src,cb) 
{
    var h = document.getElementsByTagName('head')[0];
    if(h){
        var s = document.createElement('script');
        s.setAttribute('src',src);
        s.setAttribute('type','text/javascript');
        s.onreadystatechange = function(){
            if (this.readyState == 'complete' || this.readyState == 'loaded'){
                try{
                    this.onload();
                }catch(e){}
            }
        };
        s.onload = (cb!==undefined)?cb:null;	
        h.appendChild(s);
    }
}
var oauth = oauth || chrome.extension.getBackgroundPage().oauth;
var App = App || {};
$(function(){
    var apiKey = "AIzaSyCwzksAHjNxNW505HsgOjr0PWjdsrFQWxg";
    var clientId = '817070761549.apps.googleusercontent.com';
    var scope = 'https://www.googleapis.com/auth/calendar';
    
    var HOST = "http://grsinfo.zju.edu.cn/";
    var LOGIN = "login_s_code.jsp";
    var COURSE = "cultivate/selectles/selectbefore/xkhxkbcx.jsp";
    App.auth = function () {
        gapi.auth.init(function(){
            var config = {
                'client_id': clientId,
                'scope': scope 
            };
            gapi.auth.authorize(config, function() {
                console.log('login complete');
                console.log(gapi.auth.getToken());
                gapi.client.load("calendar","v3",function(){
                    var request = gapi.client.calendar.events.list({
                        'calendarId': "ricky.tan.xin@gmail.com"
                    });
                    request.execute(function(resp) {
                        console.log('result:');
                        console.log(resp);

                        for (var i = 0; i < resp.items.length; i++) {
                            var li = document.createElement('li');
                            li.appendChild(document.createTextNode(resp.items[i].summary));
                            document.getElementById('events').appendChild(li);
                        }
                    });
                });
            });
            return false;
        });
    }
    App.onauth = function() {
        if (oauth.hasToken()) {
            $("#auth").text("退出").click(function(){
                oauth.clearTokens();
                $("login").slideUp("fast",function(){
                    window.close();
                });
            });
            gapi.auth.setToken(oauth.getToken());
            gapi.client.load("calendar","v3",function(){
                $("#login").slideDown("slow");
                var request = gapi.client.calendar.events.list({
                    'calendarId': "ricky.tan.xin@gmail.com"
                });
            });
        }
        else {
            $("#auth").click(function(){  
                chrome.tabs.create({
                    "url":chrome.extension.getURL("auth.html")
                });
            });
        }
    }
    App.onload = function() {
        App.onauth();
    }
    App.onlist = function(resp) {
        var eventList = JSON.parser(resp);
        console.log(resp);
    }
    function check_login_info() {
        return true;
    }
    $("#login").submit(function(){
        if (check_login_info()){
            var no = $("input[name=user_id]").val();
            var pw = $("input[name=password]").val();
            $.ajax({ 
                type: "POST", 
                url: HOST+LOGIN, 
                dataType:"json", 
                data:{
                    "user_id":no,
                    "password":pw
                },
                timeout:3000,
                success:function(response,text){
                    if (response.redirect == this.url) {
                        window.location.href = response.redirect;
                    }
                }, 
                error: function(xhr, textStatus, errorThrown) { 
                    $.get(HOST+COURSE,function(html){
                        var script = html.match(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi)[0];
                        html = html.replace(/<head\b[^<]*(?:(?!<\/head>)<[^<]*)*<\/head>/gi,"");
                        html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,"");
                        document.getElementById("builder").innerHTML = html;
                        script = /<script\b[^>]*>([\s\S]*?)<\/script>/gi.exec(script)[1];
                        var s = document.createElement("script");
                        s.setAttribute("type","text/javascript");
                        s.innerHTML = script;
                        document.getElementsByTagName("head")[0].appendChild(s);
                        loadjs("js/graduate.parser.js",function(){
                            var courses = Parser.parse(document.getElementById("kbT1"));
                            var a = 0;
                        });
                    });
                }
            });
        }
        return false;
    });
});

function clientloaded(){
    App.onload();
}