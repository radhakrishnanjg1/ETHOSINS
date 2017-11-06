'use strict';

(function () {

    var view = app.authenticationView = kendo.observable({
        onShow: function (e) {
            var Mobile_APP_Name = app.constants.appname.split(':')[1];
            app.utils.loading(true);
            fun_db_APP_Get_Mobile_APP_Login_Message(Mobile_APP_Name);
            var actionvalue = e.view.params.action;
            if (actionvalue == "logout") {                
                app.utils.loading(true);
                var user = JSON.parse(localStorage.getItem("userdata"));
                fun_db_APP_User_Logout(user.Login_ID, user.Employee_ID, app.utils.deviceinformation('Logout')); 
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
             username: '',
             password: '',   
            //email: ''
        },
        loginValidator: null,
        registerValidator: null,
        signin: function (username, password) { 
            var model = vm.user;
            if ($('#username').val() == '' || model.username == '' || model.username == undefined) {
                username = model.username;
                app.notify.error("Enter username!");
                return false;
            }

            if ($('#password').val() == '' || model.password == '' || model.password == undefined) {
                password = model.password;
                app.notify.error("Enter password!");
                return false;
            }
            app.utils.loading(true);
            fun_db_APP_Verify_Field_User_Authentication(model.username, model.password, app.utils.deviceinformation('Login'));
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
            $('#dvusername').html(data[0][0].Employee_Name)
            $('#hdnLogin_ID').val(data[0][0].Login_ID)
            $('#hdnEmployee_ID').val(data[0][0].Employee_ID);
            $('#dvlast_visited').html(data[2][0].Last_Visited);
            localStorage.clear();
            localStorage.setItem("userdata", JSON.stringify(data[0][0])); // userdata details 

            localStorage.setItem("ethosmastervalues", JSON.stringify(data[1])); // ethosmastervalues details 

            if (data[0][0].Login_ID == 2473 || data[0][0].Login_ID ==2917 || data[0][0].Login_ID == 2722 ||data[0][0].Login_ID == 10500) {
                $('#dvfieldlocator').show();
            }
            else   {
                $('#dvfieldlocator').hide();
            }

            if (data[0][0].IsManager == 0) {
                $('#dvindvcoverage').show(); 
                //redirect dashboard/indiviual  page 
                app.navigation.navigatedashboard();//  navigateDCRstartView 
                //navigateLMSleavemanagementView  navigateLMSapplyleaveView
                //navigatedashboard
                app.utils.loading(false);
            }
            else if (data[0][0].IsManager == 1) {
                $('#dvteamcoverage').show(); 
                //redirect dashboard/team coverage page 
                app.navigation.navigateteamcoverage();// navigateDCRstartView 
                //navigateLMSleavemanagementView  navigateLMSapplyleaveView navigatedashboard
                app.utils.loading(false);
            } 
            // NIKIL SHIRALI login id
            app_db_init();
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
            $('#username').val('');
            $('#password').val('');
            $('#hdnLogin_ID').val('0'); 
            localStorage.clear(); 
        }
        else {
            app.notify.error(data[0].Output_Message);
            app.utils.loading(false);
        }
    });

}

function fun_db_APP_Get_Mobile_APP_Login_Message(Mobile_APP_Name) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/dvu4zra5xefb2qfq/Invoke/SqlProcedures/APP_Get_Mobile_APP_Login_Message",
                type: "POST",
                dataType: "json",
                data: {
                    "Mobile_APP_Name": Mobile_APP_Name
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
        app.utils.loading(false);
        $('#h6appdescritpion').html(data[0].Login_Message);
        localStorage.setItem("authenticationviewloginmessage_live", 1);
    });
}
