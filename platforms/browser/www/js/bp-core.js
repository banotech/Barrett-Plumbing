var bp = {
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
	}
}