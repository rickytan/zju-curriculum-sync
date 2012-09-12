$(function(){
	var apiKey = "AIzaSyCwzksAHjNxNW505HsgOjr0PWjdsrFQWxg";
	var clientId = '817070761549.apps.googleusercontent.com';
	var scope = 'https://www.googleapis.com/auth/calendar';
      function auth() {
        var config = {
          'client_id': clientId,
          'scope': scope 
        };
        gapi.auth.authorize(config, function() {
          console.log('login complete');
          console.log(gapi.auth.getToken());
        });
	return false;
      }
      function clientloaded() {
	gapi.client.setApiKey(apiKey);
      }
$("#auth").click(auth);
});
