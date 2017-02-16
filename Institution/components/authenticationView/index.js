'use strict';

(function () {

    var view = app.authenticationView = kendo.observable({
        onShow: function (e) {
            var actionvalue = e.view.params.action;
            if (actionvalue == "logout") {                
                app.utils.loading(true);
                var user = JSON.parse(localStorage.getItem("userdata"));
                fun_db_APP_User_Logout(user.Login_ID, user.Employee_ID, app.utils.deviceinformation('Logout'));
                $('#username').val('');
                $('#password').val('');
                $('#hdnLogin_ID').val('0'); 
                localStorage.clear();
            }
            if (app.user != null) {
                return app.navigation.navigatedashboard();
            }
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("authenticationView");
            }
        }, 
    });

    var provider = app.data.defaultProvider;
    var mode = app.constants.authenticationModeSignin;
    var registerRedirect = 'activitiesView';
    var signinRedirect = 'activitiesView';



    var vm = kendo.observable({
        user: {
            displayName: '',
            //username: '',
            //password: '',
            username: 'IN-MGR-PATNA1', //rep level
            password: 'emp2114',

            //username: 'IN-MGR-LUCKNOW1', //approval level
            //password: 'JAYASWAL7',
            email: ''
        },
        loginValidator: null,
        registerValidator: null,
        signin: function (username, password) {
            this.loginValidator = app.validate.getValidator('#login-form');
            if (!this.loginValidator.validate()) {
                //$(".k-invalid-msg").show();
                return;
            }

            var model = vm.user;
            if (typeof username !== 'string') {
                username = model.username;

            }

            if (typeof password !== 'string') {
                password = model.password;
            } 
            app.utils.loading(true);
            fun_db_APP_Verify_Field_User_Authentication(username, password, app.utils.deviceinformation('Login'));
        },
    });

    view.set('authenticationViewModel', vm);
}());


function fun_db_APP_Verify_Field_User_Authentication(username, password, deviceinfo) {
    var storelogin = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/dvu4zra5xefb2qfq/Invoke/SqlProcedures/APP_Verify_Field_User_Authentication",
                type: "POST",
                dataType: "json",
                data: {
                    "Username": username, "Password": password, "DeviceInfo": deviceinfo
                }
            }
        },
        schema: {
            parse: function (response) {
                var getlogin = response.Result.Data;
                return getlogin;
            }
        }
    });

    storelogin.fetch(function () {
        var data = this.data();
        if (data[0][0].Output_ID == 1) {
            //app.user = data[0][0];
            $('#dvusername').html(data[0][0].Username)
            $('#hdnLogin_ID').val(data[0][0].Login_ID)
            $('#hdnEmployee_ID').val(data[0][0].Employee_ID)
            if (data[0][0].IsManager == 0)
            {
                $('#dvteamcoverage').hide();
            } 
            localStorage.setItem("userdata", JSON.stringify(data[0][0])); // userdata details 

            localStorage.setItem("ethosmastervalues", JSON.stringify(data[1])); // ethosmastervalues details 

            //localStorage.setItem("holidaydetails", JSON.stringify(data[3])); // holiday details 

            //redirect dashboard page 
            app.navigation.navigatedashboard();// navigatedcr navigateapplyleave  navigateleavemanagement navigatedashboard
            app.utils.loading(false);
        }
        else {
            app.notify.error(data[0][0].Output_Message);
            app.utils.loading(false);
        }
    });

}

function fun_db_APP_User_Logout(Login_ID, Employee_ID, deviceinfo) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/dvu4zra5xefb2qfq/Invoke/SqlProcedures/APP_User_Logout",
                type: "POST",
                dataType: "json",
                data: {
                    "Login_ID": Login_ID, "Employee_ID": Employee_ID, "DeviceInfo": deviceinfo
                }
            }
        },
        schema: {
            parse: function (response) {
                var getdata = response.Result.Data[0];
                return getdata;
            }
        }
    });

    datasource.fetch(function () {
        var data = this.data();
        if (data[0].Output_ID == 1) {
            app.notify.success(data[0].Output_Message);
            app.utils.loading(false);
        }
        else {
            app.notify.error(data[0].Output_Message);
            app.utils.loading(false);
        }
    });

}
