var admin = {
	hasAdminRights: false,
	verifyAdmin: function(){
		var dev = false;
		if(dev){
			window.localStorage.setItem("admin","yes");
			bp.hasAdminRights = true;
			app.sheet.close(".login-sheet");
		}
		else if(bp.user.rank >= 3){
			if(window.localStorage.getItem("admin") !== "yes"){
				app.sheet.open(".login-sheet");
				bp.setupNumPad(".login-num-pad",5,function(pin){
					if(pin == bp.user.pin){
						window.localStorage.setItem("admin","yes");
						bp.hasAdminRights = true;
						app.sheet.close(".login-sheet");
					}else{
						bp.hasAdminRights = false;
						bp.popup("Unable to verify admin.");
					}
					bp.updateAdmin();
				});
			}else{
				bp.hasAdminRights = true;
			}
		}else{
			bp.hasAdminRights = false;
		}
		bp.updateAdmin();
	},
	updateAdmin: function(){
		if(bp.hasAdminRights){
			$(".bp-admin-approve").show();
			$(".bp-admin-deny").hide();
		}else{
			$(".bp-admin-approve").hide();
			$(".bp-admin-deny").show();
		}
	},
	revokeAdmin: function(){
		window.localStorage.setItem("admin","no");
		bp.hasAdminRights = false;
		bp.updateAdmin();
		bp.reloadPage();
	},
	admin: {
		userAutocomplete: undefined,
		punchEditStartTime: undefined,
		punchEditEndTime: undefined,
		punchEditStartDate: undefined,
		punchEditEndDate: undefined,
		init: function(){
			var userArr = [];
			for(i = 0; i < bp.users.length; i++){
				if(bp.users[i].id != 0)
					userArr.push(bp.users[i].lName +", "+bp.users[i].fName+"  ID:"+bp.users[i].id);
			}
			bp.admin.userAutocomplete = app.autocomplete.create({
			  openIn: 'dropdown', //open in page
			  inputEl: '#user-autocomplete', //link that opens autocomplete
			  expandInput: true,
			  source: function (query, render) {
				  var results = [];
				    // Find matched items
				    for (var i = 0; i < userArr.length; i++) {
				      if (userArr[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(userArr[i]);
				    }
				    // Render items by passing array with result items
				    render(results);
				  }
			});
			bp.admin.punchEditStartTime = app.picker.create({
				  inputEl: '#start-time-picker',
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
			bp.admin.punchEditEndTime = app.picker.create({
				  inputEl: '#end-time-picker',
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
			var date = new Date();
			
			
		},
		punchSearchDate: undefined,
		getPunches: function(searchBy, printTo){
			if(searchBy == "user"){
				app.sheet.open(".user-select-sheet");
				$("#user-autocomplete").val("");
				$("#user-select-submit").unbind("click").on("click",function(){
					var selectedUser = $("#user-autocomplete").val();
					if(selectedUser.length > 0){
						var ar = selectedUser.split("ID:");
						if(ar.length > 1){
							var uid = ar[1];
							app.sheet.close(".user-select-sheet");
							bp.admin.queryAndPrint("SELECT * from punches WHERE user="+uid,printTo);
						}
						else{
							bp.popup("Invalid user.");
						}
					}else{
						bp.popup("Invalid user.");
					}
				});
			}
			else if(searchBy == "date"){
				app.sheet.open(".date-select-sheet");
				if(bp.admin.punchSearchDate !== undefined){
					bp.admin.punchSearchDate.destroy();
				}
				bp.admin.punchSearchDate = app.calendar.create({
					  inputEl: '#date-select-picker',
					  dateFormat: 'mm-dd-yyyy',
					  openIn: 'popover',
					  header: true,
					  footer: false,
					});
				$("#date-select-submit").unbind("click").on("click",function(){
					app.sheet.close(".date-select-sheet");
					bp.admin.queryAndPrint("SELECT * from punches WHERE inDate='"+$("#date-select-picker").val()+"'",printTo);
				});
			}
			else{
				//error
			}
		},
		_query: "",
		_printTo: "",
		queryAndPrint: function(query,printTo){
			bp.startLoad();
			bp.admin._query = query;
			bp.admin._printTo = printTo;
			app.request.get("https://bano.tech/bp-app/bp.php?function=getPunchesQuery&query="+query,function(data){
				data = JSON.parse(data);
				//console.log(data);
				if(data.status == "good"){
					bp.endLoad();
					//console.log(data.punches);
					var output = "";
					var dn;
					if(window.localStorage.getItem("dayNight") == "night"){
						dn = "night-text-white";
					}
					output += '<div class="data-table"><table class="punch-table"><thead><tr><th class="label-cell"><span class="'+dn+'">User</span></th><th class="numeric-cell "><span class="'+dn+'">Start Time</span></th><th class="numeric-cell"><span class="'+dn+'">End Time</span></th><th class="label-cell"><span class="'+dn+'">Hours</span></th><th></th></tr></thead><tbody>';
					
					for(var i = 0; i < data.punches.length; i++){
						var punch = data.punches[i];
						var user = bp.getUser(punch.user);
						var unit = bp.getUnit(punch.unit);
						output += "<tr>";
						//output += '<td class="label-cell">'+bp.getProperty(punch.property).name+'</td>';
						//output += '<td class="label-cell">'+unit.streetAddress+" "+unit.unitNumber+'</td>';
						output += '<td class="label-cell"><sub>'+user.fName+'</sub></td>';
						output += '<td class="numeric-cell"><sub>'+punch.inDate+'</sub><br>'+punch.inTime+'</td>';
						output += '<td class="numeric-cell"><sub>'+punch.outDate+'</sub><br>'+punch.outTime+'</td>';
						output += '<th class="label-cell">'+punch.hours+'</th>';
						output += '<th class="label-cell"><a class="link about-punch" data-punch-location="'+i+'"><i class="f7-icons">info</i></a></th>';
						output += "</tr>";
					}
					output += "</tbody></table></div>";
					$(printTo).html(output);
					$(".about-punch").each(function(){
						$link = $(this);
						var idl = $link.attr("data-punch-location");
						$link.unbind("click").on("click",function(){
							var punch = data.punches[idl];
							var user = bp.getUser(punch.user);
							var unit = bp.getUnit(punch.unit);
							var building = bp.getBuilding(punch.building);
							var property = bp.getProperty(punch.property);
							var comment = punch.comment;
							var dn ="";
							if(window.localStorage.getItem("dayNight") == "night"){
								dn = "night-sheet";
							}
							var dynamicSheet = app.sheet.create({
								  content: '<div class="sheet-modal half-sheet '+dn+'">'+
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
								                  '<strong>User: </strong>'+user.fName+" "+user.lName+
								                  '<br><strong>Property: </strong>'+property.name+
								                  '<br><strong>Building: </strong>'+building.buildingNumber+
								                  '<br><strong>Unit: </strong>'+unit.streetAddress+" "+unit.unitNumber+
								                  '<hr>'+
								                  '<strong>Start: </strong>'+punch.inDate+" "+punch.inTime+
								                  '<br><strong>End: </strong>'+punch.outDate+" "+punch.outTime+
								                  '<br><strong>Hours: </strong>'+punch.hours+
								                  '<hr>'+
								                  '<strong>Comment: </strong>'+comment+
								                  '</p>'+
								                  '<div class="row" style="padding-bottom:25px">'+
								                  '<a class="col button button-small button-fill button-raised color-orange" onclick="bp.admin.editPunch('+punch.id+')">Edit Punch</a>'+
								                  '<a class="col button button-small button-fill button-raised color-red" onclick="bp.admin.deletePunch('+punch.id+')">Delete Punch</a>'+
								                  '</div>'+
								                '</div>'+
								              '</div>'+
								            '</div>',
								});
							dynamicSheet.open();
						});
					});
					//console.log(data);
					//console.log(bp.buildings);
				}else{
					bp.endLoad();
					bp.popup("There was an error connecting to the servers. Please check your internet connection and try again later.");
				}
			});
		},
		editPunch: function(punchID){
			app.sheet.close();
			app.sheet.open(".punch-edit-sheet");
			var punch = bp.getPunch(punchID);
			
			var inDate = punch.inDate;
			var outDate = punch.outDate;
			var inTime = punch.inTime;
			var outTime = punch.outTime;
			
			var amSplit = inTime.split(" ");
			var inHour,inMinute,inAmPm;
			inAmPm = amSplit[1];
			var timeSplit = amSplit[0].split(":");
			inHour = timeSplit[0];
			inMinute = timeSplit[1];
			
			
			bp.admin.punchEditStartTime.value = [inHour,inMinute,inAmPm];
			$("#start-time-picker").val(inHour+":"+inMinute+" "+inAmPm);
			
			var amSplit = outTime.split(" ");
			var outHour,outMinute,outAmPm;
			outAmPm = amSplit[1];
			var timeSplit = amSplit[0].split(":");
			outHour = timeSplit[0];
			outMinute = timeSplit[1];
			
			bp.admin.punchEditEndTime.value = [outHour,outMinute,outAmPm];
			$("#end-time-picker").val(outHour+":"+outMinute+" "+outAmPm);
			
			var startDate = new Date(punch.inDate);
			var endDate = new Date(punch.outDate);
			
			if(bp.admin.punchEditStartDate !== undefined){
				bp.admin.punchEditStartDate.destroy();
				bp.admin.punchEditEndDate.destroy();
			}
			bp.admin.punchEditStartDate = app.calendar.create({
				  inputEl: '#start-date-picker',
				  dateFormat: 'mm-dd-yyyy',
				  openIn: 'popover',
				  header: true,
				  footer: false,
				  value: [startDate]
				});
			bp.admin.punchEditStartDate.on("dayClick",function(){
				bp.admin.punchEditStartDate.close();
			});
			bp.admin.punchEditEndDate = app.calendar.create({
				  inputEl: '#end-date-picker',
				  dateFormat: 'mm-dd-yyyy',
				  openIn: 'popover',
				  header: true,
				  footer: false,
				  value: [endDate]
				});
			bp.admin.punchEditEndDate.on("dayClick",function(){
				bp.admin.punchEditEndDate.close();
			});
			
			$("#punch-edit-submit").unbind("click").on("click",function(){
				var startDate = $("#start-date-picker").val();
				var startTime = $("#start-time-picker").val();
				var endDate = $("#end-date-picker").val();
				var endTime = $("#end-time-picker").val();
				
				app.sheet.close();
				bp.startLoad();
				app.request.get("https://bano.tech/bp-app/bp.php?function=editPunch&id="+punchID+"&startDate="+startDate+"&startTime="+startTime+"&endDate="+endDate+"&endTime="+endTime,function(data){
					if(data == "GOOD"){
						bp.endLoad();
						bp.toast("Punch Edited.");
						bp.admin.queryAndPrint(bp.admin._query,bp.admin._printTo);
					}else{
						bp.endLoad();
						bp.popup("There was an error connecting to the servers. Please check your internet connection and try again later.");
					}
				});
			});
		},
		deletePunch: function(punchID){
			bp.confirm("Are you sure you want to delete this punch?",function(){
				app.sheet.close();
				bp.startLoad();
				app.request.get("https://bano.tech/bp-app/bp.php?function=deletePunch&id="+punchID,function(data){
					//console.log(data);
					if(data == "GOOD"){
						bp.endLoad();
						bp.toast("Punch Deleted.");
						bp.admin.queryAndPrint(bp.admin._query,bp.admin._printTo);
					}else{
						bp.endLoad();
						bp.popup("There was an error connecting to the servers. Please check your internet connection and try again later.");
					}
				});
				
			});
		},
		archivePunches: function(){
			bp.confirm("Archiving punches will move all active punches from all users into the punch archives. This can only be viewed on the desktop admin website, and they cannot be edited or deleted.<br><strong>THIS CANNOT BE UNDONE.</strong><br>Are you sure you want to archive all punches?",function(){
				bp.startLoad();
				app.request.get("https://bano.tech/bp-app/bp.php?function=archivePunches",function(data){
					//console.log(data);
					if(data == "GOOD"){
						bp.endLoad();
						bp.toast("Punches have been archived.");
						//bp.admin.queryAndPrint("SELECT * FROM punches",bp.admin._printTo);
						bp.reloadPage();
					}else{
						bp.endLoad();
						bp.popup("There was an error connecting to the servers. Please check your internet connection and try again later.");
					}
				});
			});
		},
		updateUserList: function(){
			bp._loadDB();
			var output = "";
			var dn = ""
			if(window.localStorage.getItem("dayNight") == "night"){
				dn = "night-sheet";
			}
			output += '<div class="data-table"><table class="punch-table"><thead><tr><th class="label-cell"><span class="'+dn+'">Name</span></th><th class="numeric-cell "><span class="'+dn+'"></span></th></tr></thead><tbody>';
			for(var i = 0; i < bp.users.length; i++){
				var user = bp.users[i];
				output += "<tr>";
				output += '<td class="label-cell"><sub>'+user.lName+", "+user.fName+'</sub></td>';
				output += '<td class="numeric-cell"><a class="link popover-open" data-popover=".popover-user'+user.id+'"><i class="f7-icons">more_vertical</i></a></td>';
				output += "</tr>";
				
				output += '<div class="popover popover-user'+user.id+'">'+
    '<div class="popover-inner">'+
    '<p class="text-center">User Functions For '+user.fName+' '+user.lName+'</p>'+
      '<div class="list">'+
        '<ul>'+
          '<li><a class="list-button item-link popover-close" href="#" onclick="bp.admin.editUserProfile('+user.id+')">Edit User Name</a></li>'+
          '<li><a class="list-button item-link popover-close" href="#" onclick="bp.admin.editUserPin('+user.id+')">Change User Pin</a></li>'+
          '<li><a class="list-button item-link popover-close" href="#" onclick="bp.admin.editUserStatus('+user.id+')">Change Status</a></li>'+
          '<li><a class="list-button item-link popover-close" href="#" onclick="bp.admin.deleteUser('+user.id+')">Delete User</a></li>'+
        '</ul>'+
      '</div>'+
    '</div>'+
  '</div>';
				
			}
			output += "</tbody></table></div>";
			$(".all-users-list").html(output);
		},
		editUserProfile: function(userID){
			bp.prompt("Enter a new FIRST NAME for user: ", function(fNameI){
				var fName = fNameI;
				bp.prompt("Enter a new LAST NAME for user: ",function(lNameI){
					var lName = lNameI;
					//console.log(fName+" "+lName); 
					app.request.get("https://bano.tech/bp-app/bp.php?function=changeUserName&id="+userID+"&fName="+fName+"&lName="+lName,function(data){
						console.log(data);
						if(data == "good"){
							bp.toast("User updated");
							bp.reloadPage();
						}else{
							bp.toast("ERROR: Unable to edit user.");
						}
					});
				});
			});
		},
		editUserPin: function(userID){
			app.sheet.open(".login-sheet");
			bp.setupNumPad(".login-num-pad",5,function(pin2){
				app.sheet.close(".login-sheet");
				app.sheet.open(".login-sheet");
				bp.setupNumPad(".login-num-pad",5,function(pin3){
					if(pin2 == pin3){
						if(pin2.length == 5){
							app.request.get("https://bano.tech/bp-app/bp.php?function=changePin&id="+userID+"&pin="+pin2,function(data){
								//console.log(data);
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
		},
		editUserStatus: function(userID){
			app.dialog.create({
			    text: 'Choose a status for the user: ',
			    buttons: [
			      {
			        text: 'Good (No status)',
			        onClick: function(){
			        	bp.startLoad();
			        	app.request.get("https://bano.tech/bp-app/bp.php?function=changeStatus&id="+userID+"&status=",function(data){
			        		if(data == "good"){
								bp.toast("User updated");
								bp.reloadPage();
							}else{
								bp.toast("ERROR: Unable to edit user.");
							}
			        	});
			        },
			      },
			      {
			        text: 'Suspended',
			        onClick: function(){
			        	bp.startLoad();
			        	app.request.get("https://bano.tech/bp-app/bp.php?function=changeStatus&id="+userID+"&status=suspended",function(data){
			        		if(data == "good"){
								bp.toast("User updated");
								bp.reloadPage();
							}else{
								bp.toast("ERROR: Unable to edit user.");
							}
			        	});
			        },
			      },
			      {
			    	text: "Cancel",
			    	onClick: function(){
			        	app.dialog.close();
			        },
			      },
			    ],
			    verticalButtons: true,
			  }).open();
		},
		deleteUser: function(userID){
			bp.popup("Users cannot be deleted in the app. You must access the admin website.");
		},
	}
}
$(".bp-admin-approve").hide();
$(".bp-admin-deny").show();