
'use strict';

(function () {
    var view = app.teamcoverageView = kendo.observable();
    var teamcoverageViewModel = kendo.observable({
        onShow: function () { 
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("teamcoverageView");
            }
            app.navigation.logincheck();
            loadsubordinatesdetails();
            $('#txtauocmpemployeelist').val('');
            app.utils.loading(true);
            fun_db_APP_Get_MSL_Coverage_Details_INS_Employee_Team($('#hdnEmployee_ID').val());

        },
        onRefresh: function () {
            app.utils.loading(true);
            if ($('#txtauocmpemployeelist').val().length>6)
            {
                var empid = $('#txtauocmpemployeelist').val().split("|")[1];
                fun_db_APP_Get_Current_MSL_Coverage_Details_INS_Employee_TeamByEmployeeid(empid);
            }

            else {
                fun_db_APP_Get_Current_MSL_Coverage_Details_INS_Employee_Team($('#hdnEmployee_ID').val());
            }
       },
    });

    view.set('teamcoverageViewModel', teamcoverageViewModel);
}());

function fun_db_APP_Get_Current_MSL_Coverage_Details_INS_Employee_Team(Employee_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/dvu4zra5xefb2qfq/Invoke/SqlProcedures/APP_Get_Current_MSL_Coverage_Details_INS_Employee_Team",
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
        },
        error: function (e) {
            app.utils.loading(false);
            app.notify.error('Error loading data please try again later.!'); 
        }
    });

    datasource.fetch(function () {
        var data = this.data();
        app.utils.loading(false);
        if (data[0].SNO > 0) {
            teamloadchart(1);
            localStorage.setItem("teamcoveragedetailscurrentmonth", JSON.stringify(data)); // coverage details  
            localStorage.setItem("teamcoveragedetailscurrentmonth_refresh", 1);
            //  teamloadcurrentmonthdata(parseInt($('#hdnchartslno').val()));
            teamloadcurrentmonthdata(1);
            app.utils.loading(false);
        }
        else {
            //app.notify.error(data[0][0].Output_Message);
            app.utils.loading(false);
        }
    });

}

function fun_db_APP_Get_MSL_Coverage_Details_INS_Employee_Team(Employee_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/dvu4zra5xefb2qfq/Invoke/SqlProcedures/APP_Get_MSL_Coverage_Details_INS_Employee_Team",
                type: "POST",
                dataType: "json",
                data: {
                    "Employee_ID": Employee_ID
                }
            }
        },
        schema: {
            parse: function (response) {
                var getdata = response.Result.Data;
                return getdata;
            }
        },
        error: function (e) { 
            app.utils.loading(false); // alert(e);
            app.notify.error('Error loading data please try again later.!'); 
        }
    });

    datasource.fetch(function () {
        var data = this.data();
        if (data[0][0].SNO > 0) {
            localStorage.setItem("teamcoveragedetails", JSON.stringify(data[0])); // coverage details 
           // localStorage.setItem("teamcoveragedetails_live", 1);

            localStorage.setItem("subordinatesdetails", JSON.stringify(data[1])); // coverage details 
            $('#dvteamcoveragedetails').show();
            teamloadchart(1);
            teamloadcurrentmonthdatafa(1);
            loadsubordinatesdetails();
            app.utils.loading(false);
        }
        else {
            //app.notify.error(data[0][0].Output_Message);
            app.utils.loading(false);
        }
    });

}

function fun_db_APP_Get_Current_MSL_Coverage_Details_INS_Employee_TeamByEmployeeid(Employee_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/dvu4zra5xefb2qfq/Invoke/SqlProcedures/APP_Get_Current_MSL_Coverage_Details_INS_Employee",
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
        },
        error: function (e) {
            app.utils.loading(false);
            app.notify.error('Error loading data please try again later.!');
        }
    });

    datasource.fetch(function () {
        var data = this.data();
        app.utils.loading(false);
        if (data[0].SNO > 0) {
            teamloadchart(1);
            localStorage.setItem("teamcoveragedetailscurrentmonth", JSON.stringify(data)); // coverage details  
            localStorage.setItem("teamcoveragedetailscurrentmonth_refresh", 1);
            //  teamloadcurrentmonthdata(parseInt($('#hdnchartslno').val()));
            teamloadcurrentmonthdata(1);
            app.utils.loading(false);
        }
        else {
            //app.notify.error(data[0][0].Output_Message);
            app.utils.loading(false);
        }
    });

}

function fun_db_APP_Get_MSL_Coverage_Details_INS_Employee_TeamByEmployeeid(Employee_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/dvu4zra5xefb2qfq/Invoke/SqlProcedures/APP_Get_MSL_Coverage_Details_INS_Employee",
                type: "POST",
                dataType: "json",
                data: {
                    "Employee_ID": Employee_ID
                }
            }
        },
        schema: {
            parse: function (response) {
                var getdata = response.Result.Data;
                return getdata;
            }
        },
        error: function (e) {
            app.utils.loading(false); // alert(e);
            app.notify.error('Error loading data please try again later.!');
        }
    });

    datasource.fetch(function () {
        var data = this.data();
        if (data[0][0].SNO > 0) {
            localStorage.setItem("teamcoveragedetails", JSON.stringify(data[0])); // coverage details 
           // localStorage.setItem("teamcoveragedetails_live", 1);

            localStorage.setItem("subordinatesdetails", JSON.stringify(data[1])); // coverage details 
            $('#dvteamcoveragedetails').show();
            teamloadchart(1);
            teamloadcurrentmonthdatafa(1);
            //loadsubordinatesdetails();
            app.utils.loading(false);
        }
        else {
            //app.notify.error(data[0][0].Output_Message);
            app.utils.loading(false);
        }
    });

}


function teamloadchart(filterid) {
    var localdata = JSON.parse(localStorage.getItem("teamcoveragedetails"));
    var objdate = new Date(),
    locale = "en-us",
    currentmonname = objdate.toLocaleString(locale, { month: "short" });
    var chartdata = JSON.parse(Enumerable.From(localdata)
        .Where("$.SNO==" + filterid + " && $.DataMonth != '" + currentmonname + "'")
        .ToJSON());

    var chartcurrentdatafa = JSON.parse(Enumerable.From(localdata)
       .Where("$.SNO==" + filterid + " && $.DataMonth == '" + currentmonname + "'")
       .ToJSON());
    localStorage.setItem("teamcoveragedetailscurrentmonthfa", JSON.stringify(chartcurrentdatafa));
    teamloadcurrentmonthdatafa(filterid);

    $("#spanchartdivisionname").html(chartdata[0].Division_Name);
    $("#hdnchartslno").val(chartdata[0].SNO);

    $("#chartbarteamcoveragedetails").kendoChart({
        theme: "nova",
        title: {
            text: "Coverage and Average Details",
            font: "bold 18px HimalayaFont",
            color: "#ff6600",
        },
        legend: {
            position: "bottom",
            labels: {
                font: "bold 12px HimalayaFont",
            },
        },
        dataSource: {
            data: chartdata,
            group: { field: "Parameter" },
            sort: [
                 { "field": "OrderByChart", "dir": "asc" },
            ],

        },
        series: [{
            field: "ParameterValue",
        }],
        categoryAxis: {
            field: "DataMonth",
            labels: {
                font: "bold 12px HimalayaFont",
            }
        },
        valueAxis: [{
            labels: {
                format: "{0}"
            }
        }, ],
        tooltip: {
            visible: true
        },
    }); 
}

function teamloadcurrentmonthdatafa(filterid) {
    var objdate = new Date(),
    locale = "en-us",
    currentmonname = objdate.toLocaleString(locale, { month: "short" });

    var localdata = JSON.parse(localStorage.getItem("teamcoveragedetailscurrentmonthfa"));

    var currentmonthdata = JSON.parse(Enumerable.From(localdata)
       .Where("$.SNO==" + filterid + " && $.DataMonth == '" + currentmonname + "'")
       .ToJSON());

    var divisionsource = new kendo.data.DataSource({
        data: currentmonthdata,
        group: { field: "GroupByName" },
        sort: [
                 { "field": "OrderByValue", "dir": "asc" },
        ],
    });
    $("#chartteamlist-listview").kendoMobileListView({
        dataSource: divisionsource,
        template: $("#template-chartteamlist").html(),
    });

    $('#chartteamlist-listview .km-group-title').hide();
    $('#chartteamlist-listview li[class="km-group-container"]').wrap('<div class="row " ><div class="col-xs-12" style="padding:0"/></div>').contents().unwrap();
    $('#chartteamlist-listview ul[class="km-list"] li').wrap('<div class="col-xs-4"/>').contents().unwrap();
    $('#chartteamlist-listview div ul div[class="col-xs-4"]')
        .css({ "background-color": "#006666 !important", "color": "#33404E" });

}

function teamloadcurrentmonthdata(filterid) {
    var objdate = new Date(),
    locale = "en-us",
    currentmonname = objdate.toLocaleString(locale, { month: "short" });

    var localdata = JSON.parse(localStorage.getItem("teamcoveragedetailscurrentmonth"));
    var currentmonthdata = JSON.parse(Enumerable.From(localdata)
       .Where("$.SNO==" + filterid + " && $.DataMonth == '" + currentmonname + "'")
       .ToJSON());

    //$("#spanchartdivisionname").html(currentmonthdata[0].Division_Name);
    //$("#hdnchartslno").val(currentmonthdata[0].SNO);

    var divisionsource = new kendo.data.DataSource({
        data: currentmonthdata,
        group: { field: "GroupByName" },
        sort: [
                 { "field": "OrderByValue", "dir": "asc" },
        ],
    });
    $("#chartteamlist-listview").kendoMobileListView({
        dataSource: divisionsource,
        template: $("#template-chartteamlist").html(),
    });

    $('#chartteamlist-listview .km-group-title').hide();
    $('#chartteamlist-listview li[class="km-group-container"]').wrap('<div class="row " ><div class="col-xs-12" style="padding:0"/></div>').contents().unwrap();
    $('#chartteamlist-listview ul[class="km-list"] li').wrap('<div class="col-xs-4"/>').contents().unwrap();
    $('#chartteamlist-listview div ul div[class="col-xs-4"]')
        .css({ "background-color": "#006666 !important", "color": "#33404E" });

}

function loadsubordinatesdetails() {
    var localdata = JSON.parse(localStorage.getItem("subordinatesdetails"));
    //create AutoComplete UI component
    $("#txtauocmpemployeelist").kendoAutoComplete({
        dataSource: localdata, 
        dataTextField: "Employee_Name", 
        valuePrimitive: true,
        ignoreCase: true,
        minLength: 3,
        filter: "startswith",
        placeholder: "Select Employee...",
        clearButton: false,
        //separator: ", "
        noDataTemplate: 'No records found!',
        change: function (e) {
            var value = this.value();
            if (value.length > 6) {
                var empid = value.split("|")[1];
                app.utils.loading(true);
                fun_db_APP_Get_MSL_Coverage_Details_INS_Employee_TeamByEmployeeid(empid);
            }
            // Use the value of the widget
        }
    }); 
}

 

