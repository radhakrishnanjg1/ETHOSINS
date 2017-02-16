
'use strict';

(function () {
    var view = app.leavehistoryView = kendo.observable();
    var leavehistoryViewModel = kendo.observable({
        onShow: function () {
            //if (!app.utils.checkinternetconnection()) {
            //    return app.navigation.navigateoffline("leavehistoryView");
            //}
            //app.navigation.logincheck(); 
            //app.utils.loading(true);
           //// 979
           
           // fun_db_APP_Get_Employee_CurrentYear_Leave_History($('#hdnEmployee_ID').val());
            fun_db_APP_Get_Employee_CurrentYear_Leave_History(979);
        },
    });

    view.set('leavehistoryViewModel', leavehistoryViewModel);
}());
 
function fun_db_APP_Get_Employee_CurrentYear_Leave_History(Employee_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/dvu4zra5xefb2qfq/Invoke/SqlProcedures/APP_Get_Employee_CurrentYear_Leave_History",
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
        localStorage.setItem("leavehistorydetails", JSON.stringify(data)); 
        loadleavehistory();
        $('#dvleavehistory').show();
    }); 
}
function loadleavehistory() {
    var lvleavehistory = JSON.parse(Enumerable.From(JSON.parse(localStorage.getItem("leavehistorydetails")))
        .ToJSON()); 
    var dsleavehistory = new kendo.data.DataSource({
        data: lvleavehistory,
    });
    $("#listview-leavehistory").kendoMobileListView({
        dataSource: dsleavehistory,
        dataBound: function (e) {
            if (this.dataSource.data().length == 0) {
                //custom logic
                $("#listview-leavehistory").append("<li>No leaves on this year.!</li>");
            }
        },
        template: $("#template-leavehistory").html(),

    });
}
