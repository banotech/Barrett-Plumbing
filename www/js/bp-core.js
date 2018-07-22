var bp = {
	loader: '<div class="text-align-center block"><div class="preloader color-multi"></div></div>',
	loggedIn: false,
	popup: function(body){
		app.dialog.alert(body);
	},
	confirm: function(question,doAfter){
		app.dialog.confirm(question, doAfter);
	},
	prompt: function(question,doAfter){
		app.dialog.prompt(question,function(input){
			doAfter(input);
		});
	},
	getText: function(question,doAfter){
		app.dialog.prompt(question, function (name) {
		    doAfter(name);
		  });
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
			bp.updateUserInfo();
		}else{
			$(".logged-in").hide();
			$(".logged-out").show();
		}
		bp._loadDB();
	},
	updateUserInfo: function(){
		$(".bp-user-fName").html(bp.user.fName);
		$(".bp-user-lName").html(bp.user.lName);
		$(".bp-user-pin").html(bp.user.pin);
		$(".bp-user-id").html(bp.user.id);
		
		$(".bp-user-fName-input").val(bp.user.fName);
		$(".bp-user-lName-input").val(bp.user.lName);
		$(".bp-user-pin-input").val(bp.user.pin);
		$(".bp-user-id-input").val(bp.user.id);
	},
	
	setTheme: function(theme){
		window.localStorage.setItem("theme",theme);
		location.reload();
	},
	setDayNight: function(dn){
		window.localStorage.setItem("dayNight",dn);
		location.reload();
	},
	setColorTheme(color){
		$(".color-theme-select").removeClass("button-active");
		$("#color-theme-select-"+color).addClass("button-active");
		
		window.localStorage.setItem("colorTheme",color);
		if(window.localStorage.getItem("dayNight") !== "night"){
			$("body").removeClass().addClass("color-theme-"+color);
		}
	},
	setupSettings: function(){
		$(".color-theme-select").removeClass("button-active");
		$(".theme-select").removeClass("button-active");
		$(".day-night-select").removeClass("button-active");
		if(window.localStorage.getItem("colorTheme") !== undefined){
			$("#color-theme-select-"+window.localStorage.getItem("colorTheme")).addClass("button-active");
		}
		if(window.localStorage.getItem("theme") !== undefined){
			$("#theme-select-"+window.localStorage.getItem("theme")).addClass("button-active");
		}
		if(window.localStorage.getItem("dayNight") !== undefined){
			$("#day-night-select-"+window.localStorage.getItem("dayNight")).addClass("button-active");
		}
		
		
	},
	changePin: function(){
		app.sheet.open(".login-sheet");
		bp.setupNumPad(".login-num-pad",5,function(pin1){
			if(pin1 == bp.user.pin){
				app.sheet.close(".login-sheet");
				app.sheet.open(".login-sheet");
				bp.setupNumPad(".login-num-pad",5,function(pin2){
					app.sheet.close(".login-sheet");
					app.sheet.open(".login-sheet");
					bp.setupNumPad(".login-num-pad",5,function(pin3){
						if(pin2 == pin3){
							if(pin2.length == 5){
								app.request.get("https://bano.tech/bp-app/bp.php?function=changePin&id="+bp.user.id+"&pin="+pin2,function(data){
									console.log(data);
									if(data == "GOOD"){
										window.localStorage.setItem("pin",pin2);
										bp.updateUser();
										app.sheet.close(".login-sheet");
										bp.toast("Pin changed successfully.");
									}else{
										bp.popup("The server rejected you change. Please contact your supervisor.");
										app.sheet.close(".login-sheet");
									}
								});
							}else{
								bp.popup("New pin is the incorrect length. Try again.");
								app.sheet.close(".login-sheet");
							}						
						}else{
							bp.popup("Those pins did not match. Try again.");
							app.sheet.close(".login-sheet");
							
						}
					},"Confirm new pin");
				},"Enter new pin");
			}else{
				bp.popup("Invalid pin. Try again.");
				
			}
			bp.updateAdmin();
		},"Enter your current pin");
	},
	toast: function(text){
		var toast = app.toast.create({
		  text: text+"",
		  position: 'bottom',
		  closeTimeout: 2000,
		  closeButton: true,
		}).open();
	},
	setupNumPad: function(numPad, max,onComplete,text){
		blankValue = "";
		if(text == undefined)
			text = "Login with your credentials below:";
		$(".login-text").html(text);
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
		pin: window.localStorage.getItem("pin"),
	},
	updateUser: function(){
		bp.user.id = window.localStorage.getItem("id");
		bp.user.fName = window.localStorage.getItem("fName");
		bp.user.lName = window.localStorage.getItem("lName");
		bp.user.rank = window.localStorage.getItem("rank");
		bp.user.pin = window.localStorage.getItem("pin");
		if(bp.user.id != null){
			app.request.get("https://bano.tech/bp-app/bp.php?function=validateId&id="+bp.user.id,function(data){
				//console.log(data);
				if(data !== "good"){
					bp.hardLogout();
					bp.popup("There server rejected your login. You have been logged out. If the issue continues, contact your supervisor.");
				}
			});
			bp.loggedIn = true;
		}
		//console.log("Logged In? "+bp.loggedIn);
	},
	hardLogout: function(){
		var theme = window.localStorage.getItem("theme");
		var dn = window.localStorage.getItem("dayNight");
		var color = window.localStorage.getItem("colorTheme");
		window.localStorage.clear();
		window.localStorage.setItem("theme",theme);
		window.localStorage.setItem("dayNight",dn);
		window.localStorage.setItem("colorTheme",color);
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
				window.localStorage.setItem("pin",data.pin);
				bp.updateUser();
				bp.update();
			}
			else if(data.status == "denied"){
				bp.endLoad();
				bp.popup("Your access to this app has been denied. Please contact your supervisor.");
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
	startLoad: function(text){
		if(text == undefined)
			text = "Loading...";
		bp._loading_dialog = app.dialog.create({
		    text: text+'<br><div class="preloader color-blue"></div>',
		    title: ""
		  }).open();
	},
	endLoad: function(){
		bp._loading_dialog.close();
	},
	testConnection(){
		bp.startLoad();
		app.request.get("https://bano.tech/bp-app/bp.php?function=test",function(data){
			//console.log(data);
			if(data == "GOOD"){
				bp.endLoad();
			}else{
				bp.endLoad();
				bp.popup("There was an error connecting to the servers. Please check your internet connection and try again later.");
			}
		});
	},
	users: [],
	properties: [],
	buildings: [],
	units: [],
	categories: [],
	punches: [],
	_loadDB: function(){
		users = [];
		properties = [];
		buildings = [];
		units = [];
		categories = [];
		app.request.get("https://bano.tech/bp-app/bp.php?function=loadDB",function(data){
			data = JSON.parse(data);
			//console.log("DB Updated.");
			if(data.status == "good"){
				bp.endLoad();
				bp.users = data.users;
				bp.properties = data.properties;
				bp.buildings = data.buildings;
				bp.units = data.units;
				bp.categories = data.categories;
				bp.punches = data.punches;
				//console.log(data);
				//console.log(bp.buildings);
			}else{
				bp.popup("There was an error connecting to the servers. Please check your internet connection and try again later.");
			}
		});
	},
	getUser: function(id){
		for(i = 0; i < bp.users.length; i++){
			if(bp.users[i].id == id)
				return bp.users[i];
		}
		return undefined;
	},
	getProperty: function(id){
		for(i = 0; i < bp.properties.length; i++){
			if(bp.properties[i].id == id)
				return bp.properties[i];
		}
		return undefined;
	},
	getBuilding: function(id){
		for(i = 0; i < bp.buildings.length; i++){
			if(bp.buildings[i].id == id)
				return bp.buildings[i];
		}
		return undefined;
	},
	getUnit: function(id){
		for(i = 0; i < bp.units.length; i++){
			if(bp.units[i].id == id)
				return bp.units[i];
		}
		return undefined;
	},
	getCategory: function(id){
		for(i = 0; i < bp.categories.length; i++){
			if(bp.categories[i].id == id)
				return bp.categories[i];
		}
		return undefined;
	},
	getPunch: function(id){
		for(i = 0; i < bp.punches.length; i++){
			if(bp.punches[i].id == id)
				return bp.punches[i];
		}
		return undefined;
	},
	reloadPage: function(){
		app.views.current.router.navigate(app.views.current.router.currentRoute.url, {
			  reloadCurrent: true,
			  ignoreCache: true,
			});
	}
}
addSubsystem = function(name,sys){
	//bp = {bp,sys};
	var obj3 = {};
    for (var attrname in bp) { obj3[attrname] = bp[attrname];}
    for (var attrname in sys) { obj3[attrname] = sys[attrname]; }
    bp = obj3;
	console.log("Successfully added subsystem: "+name);
}
