var bp = {
	loader: '<div class="text-align-center block"><div class="preloader color-multi"></div></div>',
	loggedIn: false,
	popup: function(body){
		app.dialog.alert(body);
	},
	confirm: function(){
		
	},
	getNumber: function(){
		
	},
	update: function(){
		$(".login-button").unbind("click").on("click",function(){
			console.log("Login window opened.");
			bp.openLoginWindow();
			console.log(bp.user.fName);
		});
		bp.updateUser();
		if(bp.loggedIn){
			$(".logged-in").show();
			$(".logged-out").hide();
		}else{
			$(".logged-in").hide();
			$(".logged-out").show();
		}
	},
	toast: function(text){
		var toast = app.toast.create({
		  text: text+"",
		  position: 'bottom',
		  closeTimeout: 2000,
		  closeButton: true,
		}).open();
	},
	setupNumPad: function(numPad, max,onComplete){
		blankValue = "";
		for(var i = 0; i < max; i++)
			blankValue += "X";
		$(numPad+" .output").html(blankValue);
		$(numPad+" .button").unbind("click").on("click",function(){
			var $output = $(numPad+" .output");
			currentValue = $output.html().trim();
			var input = $(this).attr("data-number");
			if(input == "back"){
				if(currentValue.length > 0 && !currentValue.startsWith("X")) 
					currentValue = currentValue.substring(0,currentValue.length-1);
				if(currentValue.length == 0)
					for(var i = 0; i < max; i++)
						currentValue += "X";
				$output.html(currentValue);
			}
			else if(input == "done"){
				if(currentValue.startsWith("X")){
					bp.toast("Error: Field cannot be blank!");
					console.log("Field cannot be blank");
				}
				else{
					if(onComplete == undefined)
						console.log("-"+currentValue+"-");
					else
						onComplete(currentValue);
				}
			}
			else{
				if(currentValue.startsWith("X"))
					currentValue = "";
				if(currentValue.length < max)
					$output.html(currentValue += input);
			}
		});
	},
	user: {
		id: window.localStorage.getItem("id"),
		fName: window.localStorage.getItem("fName"),
		lName: window.localStorage.getItem("lName"),
		rank: window.localStorage.getItem("rank"),	
	},
	updateUser: function(){
		bp.user.id = window.localStorage.getItem("id");
		bp.user.fName = window.localStorage.getItem("fName");
		bp.user.lName = window.localStorage.getItem("lName");
		bp.user.rank = window.localStorage.getItem("rank");
		if(bp.user.id != null){
			bp.loggedIn = true;
		}
		console.log("Logged In? "+bp.loggedIn);
	},
	hardLogout: function(){
		window.localStorage.clear();
		bp.loggedIn = false;
		bp.toast("Hard logout complete!");
		bp.update();
	},
	tryPinLogin: function(pin){
		bp.startLoad();
		app.request.get("https://bano.tech/bp-app/bp.php?function=pinLogin&pin="+pin,function(data){
			data = JSON.parse(data);
			if(data.status == "good"){
				bp.endLoad();
				bp.toast("Welcome back, "+data.fName);
				app.sheet.close(".input-sheet");
				window.localStorage.setItem("id",data.id);
				window.localStorage.setItem("fName",data.fName);
				window.localStorage.setItem("lName",data.lName);
				window.localStorage.setItem("rank",data.rank);
				bp.updateUser();
				bp.update();
			}else{
				bp.endLoad();
				bp.popup("That pin didn't work. Try again or contact your supervisor.");
			}
		});
	},
	openLoginWindow(){
		app.sheet.open(".login-sheet");
		bp.setupNumPad(".login-num-pad",5,bp.tryPinLogin);
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