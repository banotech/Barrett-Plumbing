var app = new Framework7({
  root: '#app',
  name: 'Barrett Plumbing',
  id: 'tech.bano.bp', 
  version: "0.1.2",
  panel: {
    swipe: 'left',
  },
  routes: [
    {
      path: '/about/',
      url: 'about.html',
      name: "about"
    },
  ],
  theme: "md",
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
var mainView = app.views.create('.view-main');
//app.statusbar.show();
var $$ = Dom7;
$$(document).on('page:init', function (e) {
	// Page Data contains all required information about loaded and initialized page
	var page = e.detail;
	var name = page.name;
	bp.update();
	if(name == "about"){
		bp.popup("Name: "+app.name+"<br>Package: "+app.id+"<br>Version: "+app.version);
		
	}
});
$(document).ready(function(){
	bp.testConnection();
	bp.update();
});
