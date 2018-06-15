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
		bp._loadDB();
	},
	setTheme: function(theme){
		window.localStorage.setItem("theme",theme);
		location.reload();
	},
	setDayNight: function(dn){
		window.localStorage.setItem("dayNight",dn);
		location.reload();
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
		window.localStorage.clear();
		window.localStorage.setItem("theme",theme);
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
	_loadDB: function(){
		users = [];
		properties = [];
		buildings = [];
		units = [];
		categories = [];
		app.request.get("https://bano.tech/bp-app/bp.php?function=loadDB",function(data){
			data = JSON.parse(data);
			console.log("DB Updated.");
			if(data.status == "good"){
				bp.endLoad();
				bp.users = data.users;
				bp.properties = data.properties;
				bp.buildings = data.buildings;
				bp.units = data.units;
				bp.categories = data.categories;
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
	reloadPage: function(){
		app.views.current.router.navigate(app.views.current.router.currentRoute.url, {
			  reloadCurrent: true,
			  ignoreCache: true,
			});
	},
	_punches: [],
	_openPunch: undefined,
	clockOutCalendar: undefined,
	clockOutTimePicker: undefined,
	newPunchCalendar: undefined,
	newPunchTimePicker: undefined,
	newPunchPropertyPicker: undefined,
	newPunchUnitPicker: undefined,
	newPunchBuildingPicker: undefined,
	punchInit(){
		bp.startLoad();
		bp._punches = [];
		bp._openPunch = undefined;
		$(".active-punch").html("<h4>You don't have an active punch.</h4>");
		$(".historical-punches").html("<h4>You don't have an past punches.</h4>");
		app.request.get("https://bano.tech/bp-app/bp.php?function=getPunches&id="+bp.user.id,function(data){
			data = JSON.parse(data);
			//console.log(data)
			if(data.status == "good"){
				bp.endLoad();
				var i = data.numPunches;
				for(var x = 0; x < i; x++){
					var p = data.punches[x];
					if(p.open == "yes")
						bp._openPunch = p;
					bp._punches.push(p);
					//console.log(data.punches[x]);
				}
				bp.printPunches();
			}else{
				bp.endLoad();
			}
		});
		var date = new Date();
		bp.clockOutCalendar = app.calendar.create({
		  inputEl: '#demo-calendar-default',
		  dateFormat: 'mm-dd-yyyy',
		  value: [date]
		});
		bp.clockOutTimePicker = app.picker.create({
			  inputEl: '#demo-picker-date',
			    rotateEffect: true,
			    openIn: 'popover',
			    value: [
			    	"12",
			    	"59",
			    	"PM"
			    ],
			    renderToolbar: function () {
			        return '<div class="toolbar">' +
			          '<div class="toolbar-inner">' +
			            '<div class="left">' +
			              '' +
			            '</div>' +
			            '<div class="right">' +
			              '<a href="#" class="link popover-close" onclick="">Select Time</a>' +
			            '</div>' +
			          '</div>' +
			        '</div>';
			      },
			    formatValue: function (values, displayValues) {
			        return values[0]+":"+values[1]+" "+values[2];
			      },
			    cols: [
			      {
			        textAlign: 'left',
			        values: ('1 2 3 4 5 6 7 8 9 10 11 12').split(' ')
			      },
			      {
			          values: ('00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59').split(' ')
			    	  //values: ('00 05 10 15 20 25 30 35 40 45 50 55').split(' ')
			      },
			      {
			         values: ('AM PM').split(' ')
			      },
		    ]
		});
		bp.newPunchCalendar = app.calendar.create({
			  inputEl: '#demo-calendar-default-new',
			  dateFormat: 'mm-dd-yyyy',
			  value: [date]
			});
		bp.newPunchTimePicker = app.picker.create({
			  inputEl: '#demo-picker-date-new',
			    rotateEffect: true,
			    openIn: 'popover',
			    value: [
			    	"12",
			    	"59",
			    	"PM"
			    ],
			    renderToolbar: function () {
			        return '<div class="toolbar">' +
			          '<div class="toolbar-inner">' +
			            '<div class="left">' +
			              '' +
			            '</div>' +
			            '<div class="right">' +
			              '<a href="#" class="link popover-close" onclick="">Select Time</a>' +
			            '</div>' +
			          '</div>' +
			        '</div>';
			      },
			    formatValue: function (values, displayValues) {
			        return values[0]+":"+values[1]+" "+values[2];
			      },
			    cols: [
			      {
			        textAlign: 'left',
			        values: ('1 2 3 4 5 6 7 8 9 10 11 12').split(' ')
			      },
			      {
			          values: ('00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59').split(' ')
			    	  //values: ('00 05 10 15 20 25 30 35 40 45 50 55').split(' ')
			      },
			      {
			         values: ('AM PM').split(' ')
			      },
		    ]
		});
		var propArr = [];
		for(i = 0; i < bp.properties.length; i++){
			if(bp.properties[i].id != 0)
				propArr.push(bp.properties[i].name +"  ID:"+bp.properties[i].id);
		}
		app.autocomplete.destroy();
		bp.newPunchPropertyPicker = app.autocomplete.create({
			  openIn: 'dropdown', //open in page
			  inputEl: '#property-autocomplete', //link that opens autocomplete
			  expandInput: true,
			  source: function (query, render) {
				  var results = [];
				    // Find matched items
				    for (var i = 0; i < propArr.length; i++) {
				      if (propArr[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(propArr[i]);
				    }
				    // Render items by passing array with result items
				    render(results);
				  }
			});
		bp.newPunchPropertyPicker.on("open",function(ret){
			//app.sheet.close(".punch-input-new");
		});
		bp.newPunchPropertyPicker.on("close",function(ret){
			//app.sheet.open(".punch-input-new");
			var propName = ret.value+"";
			var ar = propName.split("ID:");
			var propId = ar[1];
			
			var unitArr = [];
			var buildingArr = [];
			for(i = 0; i < bp.units.length; i++){
				if(bp.units[i].property == propId){
					unitArr.push(bp.units[i].streetAddress+" "+bp.units[i].unitNumber+"  ID:"+bp.units[i].id);
				}
			}
			for(i = 0; i < bp.buildings.length; i++){
				if(bp.buildings[i].property == propId){
					//buildingArr.push(bp.buildings[i].streetAddress+" "+bp.buildings[i].unitNumber+"  ID:"+bp.buildings[i].id);
					buildingArr.push("Building "+bp.buildings[i].buildingNumber+"  ID:"+bp.buildings[i].id)
				}
			}
			bp.newPunchUnitPicker = app.autocomplete.create({
				  openIn: 'dropdown', //open in page
				  inputEl: '#unit-autocomplete', //link that opens autocomplete
				  closeOnSelect: true, //go back after we select something
				  expandInput: true,
				  source: function (query, render) {
					  var results = [];
					    // Find matched items
					    for (var i = 0; i < unitArr.length; i++) {
					      if (unitArr[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(unitArr[i]);
					    }
					    // Render items by passing array with result items
					    render(results);
					  }
				});
			bp.newPunchBuildingPicker = app.autocomplete.create({
				  openIn: 'dropdown', //open in page
				  inputEl: '#building-autocomplete', //link that opens autocomplete
				  closeOnSelect: true, //go back after we select something
				  expandInput: true,
				  source: function (query, render) {
					  var results = [];
					    // Find matched items
					    for (var i = 0; i < buildingArr.length; i++) {
					      if (buildingArr[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(buildingArr[i]);
					    }
					    // Render items by passing array with result items
					    render(results);
					  }
				});

			
		});
		$(".new-punch").unbind("click").on("click",function(){
			//console.log(app.views.current.router);
			
			bp.newPunch();
		});
	},
	newPunch: function(clockOutButton){
		
		if(bp._openPunch !== undefined){
			//CLOCK OUT FORCE
			bp.getPunchInput(function(date,time){
				//console.log(date+" | "+time);
				bp.startLoad();
				
				
				app.request.get("https://bano.tech/bp-app/bp.php?function=punchOut&id="+bp._openPunch.id+"&date="+date+"&time="+time,function(data){
					console.log(data);
					if(data == "GOOD"){
						bp.endLoad();
						bp.reloadPage();
					}else if(data == "INVALID"){
						bp.endLoad();
						bp.popup("Punch out time must be after punch in.");
					}
					else{
						bp.endLoad();
						bp.popup("There was an error connecting to the servers. Please check your internet connection and try again later.");
					}
					//app.router.refreshPage();
				});
				
			});
			if(clockOutButton != true)
				bp.popup("You need to punch out first.");
		}
		else{
			//NEW PUNCH
			bp.getNewPunchInput(function(user,property,building,unit,date,time,comment){
				bp.startLoad();
				app.request.get("https://bano.tech/bp-app/bp.php?function=newPunch&user="+user+"&property="+property+"&building="+building+"&unit="+unit+"&date="+date+"&time="+time+"&comment="+comment,function(data){
					console.log(data);
					if(data == "GOOD"){
						bp.endLoad();
						bp.reloadPage();
					}else if(data == "INVALID"){
						bp.endLoad();
						bp.popup("Your new punch must be after your latest punch.");
					}else{
						bp.endLoad();
						bp.popup("There was an error connecting to the servers. Please check your internet connection and try again later.");
					}
					//bp.endLoad();
					//app.router.refreshPage();
					//bp.reloadPage();
				});
			});
		}
	},
getPunchInput: function(doAfter,openPunchId){
		
		var date = new Date();
		app.sheet.open(".punch-input");

		bp.clockOutCalendar.value = [date];
		bp.clockOutCalendar.on("dayClick",function(){
			bp.clockOutCalendar.close();
		});
		var adjustedHour = date.getHours();
		var amPM = "AM";
		if(date.getHours() > 12){
			adjustedHour = date.getHours()-12;
			amPM = "PM"
		}
		var minutes = date.getMinutes();
		if(minutes < 10){
			minutes = "0"+minutes;
		}

		bp.clockOutTimePicker.value = [adjustedHour,minutes,amPM];
		$("#demo-picker-date").val(adjustedHour+":"+minutes+" "+amPM);
		$(".confirm-punch").unbind("click").on("click",function(){
			app.sheet.close(".punch-input");
			if(doAfter !== undefined)
				doAfter($("#demo-calendar-default").val(),$("#demo-picker-date").val());
			
		});
	},
	newPunchType: "unit",
getNewPunchInput: function(doAfter,openPunchId){
		var date = new Date();
		app.sheet.open(".punch-input-new");
		app.calendar.destroy();

		bp.newPunchCalendar.on("dayClick",function(){
			bp.newPunchCalendar.close();
		});
		var adjustedHour = date.getHours();
		var amPM = "AM";
		if(date.getHours() > 12){
			adjustedHour = date.getHours()-12;
			amPM = "PM"
		}
		var minutes = date.getMinutes();
		if(minutes < 10){
			minutes = "0"+minutes;
		}

		bp.newPunchTimePicker.value = [adjustedHour,minutes,amPM];
		$("#demo-picker-date-new").val(adjustedHour+":"+minutes+" "+amPM);

		$("#property-autocomplete").val("");
		$("#unit-autocomplete").val("");
		$("#building-autocomplete").val("");
		$("#building-comment").val("");
		$("#other-comment").val("");
		$
		
		$(".confirm-punch-new").unbind("click").on("click",function(){
			var comment = "";
			var unitID,bldID;
			var unit;
			var error = false;
			var errors = "";
			//get property id
			var propID = bp.newPunchPropertyPicker.value+"";
			ar = propID.split("ID:");
			propID = ar[1];
			if(bp.newPunchPropertyPicker.value.length < 1){
				error = true;
				errors += "You need to select a property!<br>";
			}
			if(bp.newPunchType == "unit"){
				//get unit id
				if(bp.newPunchUnitPicker != undefined){
					if(bp.newPunchUnitPicker.value.length < 1){
						error = true;
						errors += "You need to select a unit!<br>";
					}else{
						unitID = bp.newPunchUnitPicker.value+"";
						var ar = unitID.split("ID:");
						unitID = ar[1];
						//get building id
						unit = bp.getUnit(unitID);
						bldID = bp.getBuilding(unit.building).id;
					}
				}else{
					error = true;
					errors += "You need to select a unit!<br>";
				}
			}else if(bp.newPunchType == "building"){
				//get unit id\
				if(bp.newPunchBuildingPicker != undefined){
					if(bp.newPunchBuildingPicker.value.length < 1){
						error = true;
						errors += "You need to select a building!<br>";
					}
					else{
						bldID = bp.newPunchBuildingPicker.value+"";
						var ar = bldID.split("ID:");
						bldID = ar[1];
						unitID = 0;
						comment = $("#building-comment").val();
					}
				}else{
					error = true;
					errors += "You need to select a building!<br>";
				}
			}else{
				comment = $("#other-comment").val();
				if(comment.length < 1){
					error = true;
					errors += "You need to leave a comment on your specific location!<br>";
				}
				unitID = 0;
				bldID = 0;
			}
			//console.log(bp.user.id+" "+propID+" "+bldID+" "+unitID);
			if(!error){
				app.sheet.close(".punch-input-new");
				if(doAfter !== undefined)
					doAfter(bp.user.id,propID,bldID,unitID,$("#demo-calendar-default-new").val(),$("#demo-picker-date-new").val(),comment);
			}else{
				bp.popup(errors);
			}
			
		});
		
		$(".punch-type-unit").show(200);
		$(".punch-type-building").hide(200);
		$(".punch-type-other").hide(200);
		$(".punch-select").removeClass("button-active");
		$("#punch-select-unit").addClass("button-active");
		bp.newPunchType = "unit";
		
		$("#punch-select-unit").unbind("click").on("click",function(){
			$(".punch-type-unit").show(200);
			$(".punch-type-building").hide(200);
			$(".punch-type-other").hide(200);
			$(".punch-select").removeClass("button-active");
			$(this).addClass("button-active");
			bp.newPunchType = "unit";
		});
		$("#punch-select-building").unbind("click").on("click",function(){
			$(".punch-type-unit").hide(200);
			$(".punch-type-building").show(200);
			$(".punch-type-other").hide(200);
			$(".punch-select").removeClass("button-active");
			$(this).addClass("button-active");
			bp.newPunchType = "building";
		});
		$("#punch-select-other").unbind("click").on("click",function(){
			$(".punch-type-unit").hide(200);
			$(".punch-type-building").hide(200);
			$(".punch-type-other").show(200);
			$(".punch-select").removeClass("button-active");
			$(this).addClass("button-active");
			bp.newPunchType = "other";
		});
		
	},
	printPunches: function(){
		if(bp._openPunch !== undefined){
			var output = "";
			output += bp.getProperty(bp._openPunch.property).name+"<br>";
			output += bp.getUnit(bp._openPunch.unit).streetAddress+" "+bp.getUnit(bp._openPunch.unit).unitNumber+"<br>";
			output += "<div class='row'><div class='col'><h3>Start Punch</h3><strong>"+bp._openPunch.inDate+" "+bp._openPunch.inTime+"</strong></div>";
			output += "<div class='col'><h3>End Punch</h3><button class='button button-raised button-fill button-round color-red punch-out'><i class='f7-icons'>alarm_fill</i> Punch Out</button></div>";
			$(".active-punch").html(output);
			$(".punch-out").unbind("click").on("click",function(){
				//console.log(app.views.current.router);
				
				bp.newPunch(true);
			});
		}
		if(bp._punches.length > 0){
			/*
			 *  <div class="data-table">
				  <table>
				    <thead>
				      <tr>
				        <th class="label-cell">Property</th>
				        <th class="tablet-only">Address</th>
				        <th class="numeric-cell">Start Time</th>
				        <th class="numeric-cell">End Time</th>
				        <th class="numeric-cell">Hours</th>
				      </tr>
				      
				    </thead>
				    <tbody>
				     <tr>
				        <td class="label-cell">Unit address</td>
				        <td class="tablet-only"></td>
				        <td class="numeric-cell">1/1/2018<br>4:58pm</td>
				        <td class="numeric-cell">1/1/2018<br>6:58pm</td>
				        <th class="numeric-cell">2.0</th>
				      </tr>
				    </tbody>
				    </table>
				    </div>
			 */
			var output = "Some information is only viewable on a larger screen.";
			output += '<div class="data-table"><table class="punch-table"><thead><tr><th class="numeric-cell">Start Time</th><th class="numeric-cell">End Time</th><th class="label-cell">Hours</th><th></th></tr></thead><tbody>';
			var sheets = [];
			for(x = bp._punches.length-1; x >= 0 ; x--){
				var punch = bp._punches[x];
				var unit = bp.getUnit(punch.unit);
				output += "<tr>";
				//output += '<td class="label-cell">'+bp.getProperty(punch.property).name+'</td>';
				//output += '<td class="label-cell">'+unit.streetAddress+" "+unit.unitNumber+'</td>';
				output += '<td class="numeric-cell"><sub>'+punch.inDate+'</sub><br>'+punch.inTime+'</td>';
				output += '<td class="numeric-cell"><sub>'+punch.outDate+'</sub><br>'+punch.outTime+'</td>';
				output += '<th class="label-cell">'+punch.hours+'</th>';
				output += '<th class="label-cell"><a class="link about-punch" data-punch-location="'+x+'"><i class="f7-icons">info</i></a></th>';
				output += "</tr>";
			}
			
			output += "</tbody></table></div>";
			$(".historical-punches").html(output);
			
			$(".about-punch").each(function(){
				$link = $(this);
				var idl = $link.attr("data-punch-location");
				$link.unbind("click").on("click",function(){
					var punch = bp._punches[idl];
					var unit = bp.getUnit(punch.unit);
					var building = bp.getBuilding(punch.building);
					var property = bp.getProperty(punch.property);
					var comment = punch.comment;
					var dynamicSheet = app.sheet.create({
						  content: '<div class="sheet-modal half-sheet">'+
						              '<div class="toolbar">'+
						                '<div class="toolbar-inner">'+
						                  '<div class="left"><i class="f7-icons">info</i> Punch Information</div>'+
						                  '<div class="right">'+
						                    '<a class="link sheet-close">Close</a>'+
						                  '</div>'+
						                '</div>'+
						              '</div>'+
						              '<div class="sheet-modal-inner">'+
						                '<div class="page-content">'+
						                  '<p>'+
						                  '<strong>Property: </strong>'+property.name+
						                  '<br><strong>Building: </strong>'+building.buildingNumber+
						                  '<br><strong>Unit: </strong>'+unit.streetAddress+" "+unit.unitNumber+
						                  '<hr>'+
						                  '<strong>Start: </strong>'+punch.inDate+" "+punch.inTime+
						                  '<br><strong>End: </strong>'+punch.outDate+" "+punch.outTime+
						                  '<br><strong>Hours: </strong>'+punch.hours+
						                  '<hr>'+
						                  '<strong>Comment: </strong>'+comment+
						                  '</p>'+
						                '</div>'+
						              '</div>'+
						            '</div>',
						});
					dynamicSheet.open();
				});
			});
		}
	}
}
