var admin = {
	hasAdminRights: false,
	verifyAdmin: function(){
		if(bp.user.rank >= 3){
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
}
$(".bp-admin-approve").hide();
$(".bp-admin-deny").show();