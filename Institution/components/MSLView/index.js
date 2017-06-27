
'use strict';

(function () {
    var view = app.MSLView = kendo.observable();
    var MSLViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("MSLView");
            }
            app.navigation.logincheck();

        },

        afterShow: function () {
            var userdata = JSON.parse(localStorage.getItem("userdata"));
            var Employee_ID = parseInt(userdata.Employee_ID);
            var Sub_Territory_ID = parseInt(userdata.Sub_Territory_ID);
            if (localStorage.getItem("kdmmsldetails_live") == null ||
                localStorage.getItem("kdmmsldetails_live") != 1) {
                app.utils.loading(true);
                fun_db_APP_Get_INS_MSL_Details_By_Employee_ID(Employee_ID, Sub_Territory_ID);
            }
        },
        onRefresh: function () {
            var userdata = JSON.parse(localStorage.getItem("userdata"));
            var Employee_ID = parseInt(userdata.Employee_ID);
            var Sub_Territory_ID = parseInt(userdata.Sub_Territory_ID); 
            app.utils.loading(true);
            fun_db_APP_Get_INS_MSL_Details_By_Employee_ID(Employee_ID, Sub_Territory_ID);
            
        }, 
        ScrollTop: function () {
            $(".km-scroll-container").css("transform", "none");
        },
    });

    view.set('MSLViewModel', MSLViewModel);
}());

function fun_db_APP_Get_INS_MSL_Details_By_Employee_ID(Employee_ID, Sub_Territory_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/dvu4zra5xefb2qfq/Invoke/SqlProcedures/APP_Get_INS_MSL_Details_By_Employee_ID",
                type: "POST",
                dataType: "json",
                data: {
                    "Employee_ID": Employee_ID,
                    "Sub_Territory_ID": Sub_Territory_ID,
                }
            }
        },
        schema: {
            parse: function (response) {
                var getdata = response.Result.Data;
                return getdata;
            }
        }
    });

    datasource.fetch(function () {
        var data = this.data();
        app.utils.loading(false);
        load_institution_msldetails(JSON.stringify(data[0]));
        localStorage.setItem("kdmmsldetails", JSON.stringify(data[1]));
        localStorage.setItem("kdmmsldetails_live", 1);
        $('#dvmsldetails').show();
    });
}

function load_institution_msldetails(records) {
    var lvmsldetails = JSON.parse(Enumerable.From(JSON.parse(records))
        .ToJSON());
    var dsmsldetails = new kendo.data.DataSource({
        data: lvmsldetails,
    });
    $("#listview-institutionmsldetails").kendoMobileListView({
        dataSource: dsmsldetails,
        filterable: {
            field: 'Institution_Search',
            operator: 'contains',
            ignoreCase: true
        },
        dataBound: function (e) {
            if (this.dataSource.data().length == 0) {
                //custom logics
                $("#listview-institutionmsldetails").append("<li>No Records Found!</li>");
            }
        },
        template: $("#template-institutionmsldetails").html()
    });
}


function fun_open_modalviewmslview(e) {
    $("#modalview-mslview").kendoMobileModalView("open");
    var data = e.button.data();
    var Institution_MSL_Number = data.institution_msl_number;

    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("kdmmsldetails"));
    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
    .Where("$.Institution_MSL_Number==" + Institution_MSL_Number)
        .ToJSON());

    var dataSource = new kendo.data.DataSource({
        data: ethosmastervaluesrecords,
        batch: true,
        schema: {
            model: {
                fields: {
                    Row_KDM: { type: "string", editable: false },
                    Name_of_Key_Decision_Maker: { type: "string", editable: false },
                    Contact_No: { type: "string", editable: false },
                }
            }
        }
    });
    $("#mslview-inskdmlist").kendoGrid({
        dataSource: dataSource,
        columns: [
             { width: 60, enabled: false, title: "SLNO", field: "Row_KDM", editable: false, },
             { enabled: false, title: "KDM", field: "Name_of_Key_Decision_Maker", editable: false, },
              { enabled: false, title: "Contact", field: "Contact_No", editable: false, },
        ],
        editable: true
    });
}

function fun_close_modalviewmslview() {
    $("#modalview-mslview").kendoMobileModalView("close");
}


