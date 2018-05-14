var bp = {
	loader: '<div class="text-align-center block"><div class="preloader color-multi"></div></div>',
	popup: function(body){
		app.dialog.alert(body);
	},
	confirm: function(){
		
	},
	getNumber: function(){
		var dynamicSheet = app.sheet.create({
		  content: '<div class="sheet-modal">'+
		              '<div class="toolbar">'+
		                '<div class="toolbar-inner">'+
		                  '<div class="left"></div>'+
		                  '<div class="right">'+
		                    '<a class="link sheet-close">Done</a>'+
		                  '</div>'+
		                '</div>'+
		              '</div>'+
		              '<div class="sheet-modal-inner">'+
		                '<div class="block">'+
		                  '<p>Sheet created dynamically.</p>'+
		                  '<p><a href="#" class="link sheet-close">Close me</a></p>'+
		                '</div>'+
		              '</div>'+
		            '</div>',
		  // Events
		  on: {
		    open: function (sheet) {
		      console.log('Sheet open');
		    },
		    opened: function (sheet) {
		      console.log('Sheet opened');
		    },
		  }
		});
	},
	update: function(){
	  
	},
	_loading_dialog: undefined,
	startLoad: function(){
		bp._loading_dialog = app.dialog.create({
		    text: 'Loading...<br><br><span class="progressbar-infinite"></span>',
		    title: ""
		  }).open();
	},
	endLoad: function(){
		bp._loading_dialog.close();
	},
	testConnection(){
		bp.startLoad();
		app.request.get("https://bano.tech/bp-app/bp.php?function=test",function(data){
			console.log(data);
			if(data == "GOOD"){
				bp.endLoad();
			}else{
				bp.endLoad();
				bp.popup("There was an error connecting to the servers. Please check your internet connection and try again later.");
			}
		});
	}
}