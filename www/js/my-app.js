var apiLevel = "14";
var app;
function setupApp(){
	var prefTheme = "md";
	if(window.localStorage.getItem("theme") == "ios")
		prefTheme = "ios";
	app = new Framework7({
		  root: '#app',
		  name: 'Barrett Plumbing',
		  id: 'tech.bano.bp', 
		  version: "0.1.3114",
		  panel: {
		    swipe: 'left',
		  },
		  routes: [
			  {
			      path: '/about/',
			      url: 'about.html',
			      name: "about"
			    },
			    {
			        path: '/settings/',
			        url: 'settings.html',
			        name: "settings"
			      },
		  ],
		  theme: prefTheme,
		  statusbar: {
		    iosOverlaysWebView: true,
		    materialBackgroundColor: "#2196f3",
		    overlay:true,
		    enabled:false,
		  },
		  dialog: {
			  title: "Barrett Plumbing"
		  }
		});
	checkDayNight();
}
function checkDayNight(){
	if(window.localStorage.getItem("dayNight") == "night"){
		/*
		 * .page-content{
				background-color:#333;
				color:white;
			}
		 */
		$(".page-content").css("background-color","#333");
		$(".page-content").css("color","white");
		$(".panel").css("background-color","#333");
		$(".panel").css("color","white");
		$(".page").addClass("color-theme-gray");
		if(window.localStorage.getItem("theme") == "ios"){
			$(".panel .list").css("color","#333");
		}
	}
}
setupApp();
var mainView = app.views.create('.view-main');
//app.statusbar.show();
var $$ = Dom7;
$$(document).on('page:init', function (e) {
	// Page Data contains all required information about loaded and initialized page
	var page = e.detail;
	var name = page.name;
	bp.update();

	checkDayNight();
	if(name == "about"){
		//bp.popup("Name: "+app.name+"<br>Package: "+app.id+"<br>Version: "+app.version);
		$(".app-version").html(app.version);
    	$(".app-id").html(app.id);
    	$(".app-api").html(apiLevel);
	}
});
$(document).ready(function(){
	bp.testConnection();
	bp.update();
});
