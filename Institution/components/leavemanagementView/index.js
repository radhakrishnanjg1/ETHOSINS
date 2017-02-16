
'use strict';

(function () {
    var view = app.leavemanagementView = kendo.observable();
    var leavemanagementViewModel = kendo.observable({
        onShow: function () {
            //if (!app.utils.checkinternetconnection()) {
            //    return app.navigation.navigateoffline("dashboardView");
            //}
            //app.navigation.logincheck(); 
            //if (localStorage.getItem("divisiondetails_live") == null || localStorage.getItem("divisiondetails_live") != 1) {
            //    app.utils.loading(true);
            //    fun_db_APP_Get_Activity_Details($('#hdnLogin_ID').val());
            //}

            var userdata = JSON.parse(localStorage.getItem("userdata"));
            if (userdata.IsManager == 0) {
                $("#dvaccess_approval").hide();
            }
        },

        onRefresh: function () { 
            //app.utils.loading(true);
            //fun_db_APP_Get_Activity_Details($('#hdnLogin_ID').val());
        },

    });

    view.set('leavemanagementViewModel', leavemanagementViewModel);
}());

 
 