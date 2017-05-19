
'use strict';

(function () {
    var view = app.supportView = kendo.observable();
    var supportViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("supportView");
            }
            app.navigation.logincheck();
            
            //TechSupportEmail

            //TechSupportMobile
        },
        afterShow: function () {
            $('#span_appversion').html(app.constants.appversion);
            var user = JSON.parse(localStorage.getItem("userdata"));
            var TechSupportEmail = user.TechSupportEmail;
            var TechSupportMobile = user.TechSupportMobile;
            //$('#anchartechsupportemail').html(TechSupportEmail.split(":")[1].split("?")[0]);
            //$('#anchartechsupportmobile').html(TechSupportMobile.split(":")[1]);
            $('#anchartechsupportemail').attr("href", TechSupportEmail + "&subject=" + app.constants.appname + " App Queries");
            $('#anchartechsupportmobile').attr("href", TechSupportMobile);
        },
    });

    view.set('supportViewModel', supportViewModel);
}());
  