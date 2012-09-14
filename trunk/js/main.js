function loadjs(src,cb) 
{
    var h = document.getElementsByTagName('head')[0];
    if(h){
        var s = document.createElement('script');
        s.setAttribute('src',src);
        s.setAttribute('type','text/javascript');
        s.onreadystatechange = function(){
            if (this.readyState == 'complete' || this.readyState == 'loaded'){
                this.onload();
            }
        };
        s.onload = cb;	
        h.appendChild(s);
    }
}

$(function(){
    var apiKey = "AIzaSyCwzksAHjNxNW505HsgOjr0PWjdsrFQWxg";
    var clientId = '817070761549.apps.googleusercontent.com';
    var scope = 'https://www.googleapis.com/auth/calendar';
    
    var HOST = "http://g.zju.edu.cn/";
    var LOGIN = "login_s_code.jsp";
    var COURSE = "cultivate/selectles/selectbefore/xkhxkbcx.jsp";
    function auth() {
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
        function clientloaded() {
            gapi.client.setApiKey(apiKey);
        }
    }
    function check_login_info() {
        return true;
    }
    $("#auth").click(auth);
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
                    else {
                }
                }, 
                error: function(xhr, textStatus, errorThrown) { 
                    $.get(HOST+COURSE,function(html){
                        $("#builder").append(html);
                        loadjs("js/graduate.parser.js",function(){
                            Parser.parse($("#builder table#kbT1"));
                        });
                    });
                }
            });
        }
        return false;
        var frame = document.createElement("iframe");
        $(frame).attr("name","target");
        document.body.appendChild(frame);
        
        frame.onreadystatechange = function () {
            loadjs("js/graduate.parser.js",function(){
                Parser.parse(document.body);
            });
        }
        frame.onload = function() {
            var doc = this.document;
            if(this.contentDocument)
                        doc = this.contentDocument; // For NS6
                else if(this.contentWindow)
                        doc = this.contentWindow.document; // For IE5.5 and IE6
                // Put the content in the iframe
                doc.open();
                doc.writeln("<html><body>test</body></html>");
                doc.close();
            if (window.frames["target"].location.href == HOST+LOGIN) {
                
            }
            else {
                loadjs("js/graduate.parser.js",function(){
                    Parser.parse(window.frames["target"].document.body);
                });
            }
        }
        //$(frame).css({width:"0px",height:"0px",border:"0px"}).attr("name","target");
        this.action = HOST+LOGIN;
        this.target = "target";
        return false;
    });
});
