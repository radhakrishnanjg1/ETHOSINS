
'use strict';

(function () {
    var view = app.LastActivitiesView = kendo.observable();
    var LastActivitiesViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("LastActivitiesView");
            }
            app.navigation.logincheck();

        },

        afterShow: function () {
            var userdata = JSON.parse(localStorage.getItem("userdata"));
            var Employee_ID = parseInt(userdata.Employee_ID); 
            if (localStorage.getItem("lastactivities_details_live") == null ||
                localStorage.getItem("lastactivities_details_live") != 1) {
                app.utils.loading(true);
                fun_db_APP_Get_Employee_Last_DCR_TP_EXP(Employee_ID);
            }
        },
        onRefresh: function () {
            var userdata = JSON.parse(localStorage.getItem("userdata"));
            var Employee_ID = parseInt(userdata.Employee_ID);
            app.utils.loading(true);
            fun_db_APP_Get_Employee_Last_DCR_TP_EXP(Employee_ID);
        },
    });

    view.set('LastActivitiesViewModel', LastActivitiesViewModel);
}());


function fun_db_APP_Get_Employee_Last_DCR_TP_EXP(Employee_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/dvu4zra5xefb2qfq/Invoke/SqlProcedures/APP_Get_Employee_Last_DCR_TP_EXP",
                type: "POST",
                dataType: "json",
                data: {
                    "Employee_ID": Employee_ID
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
        //localStorage.setItem("lastactivities_details", JSON.stringify(data));
        localStorage.setItem("lastactivities_details_live", 1);
       // $('#dvlastactivitiesview').show();
        load_lastactivitiesview(JSON.stringify(data));
    });
}

function load_lastactivitiesview(records) {
    var lvleavehistory = JSON.parse(Enumerable.From(JSON.parse(records))
        .ToJSON());
    var dsleavehistory = new kendo.data.DataSource({
        data: lvleavehistory,
    });
    $("#listview-lastactivities").kendoMobileListView({
        dataSource: dsleavehistory,
        dataBound: function (e) {
            if (this.dataSource.data().length == 0) {
                //custom logic
                $("#listview-lastactivities").append("<li>No Records Found!</li>");
            }
        },
        template: $("#template-lastactivities").html(),
    });
}
 

