
'use strict';

(function () {
    var view = app.DCRView = kendo.observable();
    var DCRViewModel = kendo.observable({
        onShow: function () {
            //if (!app.utils.checkinternetconnection()) {
            //    return app.navigation.navigateoffline("dashboardView");
            //}
            //app.navigation.logincheck(); 
            //if (localStorage.getItem("divisiondetails_live") == null || localStorage.getItem("divisiondetails_live") != 1) {
            //    app.utils.loading(true);
            //    fun_db_APP_Get_Activity_Details($('#hdnLogin_ID').val());
            //}  
            
            $("#dvdcr1").show(); 
            $("#ddlactivityperiod").kendoDropDownList().data("kendoDropDownList");             
            $("#ddlactivity").kendoDropDownList().data("kendoDropDownList");
            $("#ddlcategory").kendoDropDownList().data("kendoDropDownList");
            $("#ddlmode").kendoDropDownList().data("kendoDropDownList");

            $("#ddlworkwithmaster").kendoMultiSelect().data("kendoMultiSelect");
            $("#ddlmajortown").kendoMultiSelect().data("kendoMultiSelect");


            $("#ddlproductspromoted").kendoMultiSelect().data("kendoMultiSelect"); 
            $("#ddlworkwithchild").kendoMultiSelect().data("kendoMultiSelect");

            fun_dcr_load_activityperiod();
            fun_dcr_load_activity();
            fun_dcr_load_category();
            fun_dcr_load_mode();
           // 
        },
        gotoDCR1: function () {
            $("#dvdcr1").show();
            $("#dvdcr2").hide();
            $("#dvdcr3").hide();
            $("#dvdcr4").hide();
            $("#dvdcr5").hide();
            $("#dvdcr6").hide();
        },
        gotoDCR2: function () {
            $("#dvdcr1").hide();
            $("#dvdcr2").show();
            $("#dvdcr3").hide();
            $("#dvdcr4").hide();
            $("#dvdcr5").hide();
            $("#dvdcr6").hide();
        },
        gotoDCR3: function () { 
            var activity = parseInt($("#ddlactivity").val()); 
            if (activity == 235) //Field Work
            {
                $("#dvdcr1").hide();
                $("#dvdcr2").hide();
                $("#dvdcr3").show();
                $("#dvdcr4").hide();
                $("#dvdcr5").hide();
                $("#dvdcr6").hide();
            }
            else if (activity == 237 || activity == 238
                || activity == 242 || activity == 243
                || activity == 244 || activity == 1131
                || activity == 257) // second option Sunday / Holiday/cl/sl/el/lta/nyjd
            {
                $("#dvdcr1").hide();
                $("#dvdcr2").hide();
                $("#dvdcr3").hide();
                $("#dvdcr4").hide();
                $("#dvdcr5").show();
                $("#dvdcr6").hide();
            }
            else // others options
            { 
                $("#dvdcr1").hide();
                $("#dvdcr2").hide();
                $("#dvdcr3").hide();
                $("#dvdcr4").hide();
                $("#dvdcr5").show();
                $("#dvdcr6").hide();
            }
        },
        gotoDCR4: function () {
            $("#dvdcr1").hide();
            $("#dvdcr2").hide();
            $("#dvdcr3").hide();
            $("#dvdcr4").show();
            $("#dvdcr5").hide();
            $("#dvdcr6").hide();
        },
        gotoDCR5: function () {
            $("#dvdcr1").hide();
            $("#dvdcr2").hide();
            $("#dvdcr3").hide();
            $("#dvdcr4").hide();
            $("#dvdcr5").show();
            $("#dvdcr6").hide();
        },
        gotoDCR6: function () {
            $("#dvdcr1").hide();
            $("#dvdcr2").hide();
            $("#dvdcr3").hide();
            $("#dvdcr4").hide();
            $("#dvdcr5").hide();
            $("#dvdcr6").show();
        },
    });

    view.set('DCRViewModel', DCRViewModel);
}());


function fun_dcr_load_activityperiod() { 
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("ethosmastervalues"));
    var leavetypedata = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .Where("$.Master_Table_ID==" + 16 )
   .ToJSON());
    $("#ddlactivityperiod").kendoDropDownList({
        index: 0,
        dataTextField: "Master_Value_Name",
        dataValueField: "Master_Value_ID",
        dataSource: leavetypedata,
        //change: onChange
        optionLabel: "---Select---",
        //change: function (e) {
        //    var leavetype = this.value();
        //    // Use the value of the widget
        //    app.utils.loading(true);
        //    fun_db_APP_Get_Employee_Leave_Details(leavetype, $('#hdnEmployee_ID').val());
        //},
    }); 
}

function fun_dcr_load_activity() {
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("ethosmastervalues"));
    var leavetypedata = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .Where("$.Master_Table_ID==" + 15)
   .ToJSON());
    $("#ddlactivity").kendoDropDownList({
        index: 0,
        dataTextField: "Master_Value_Name",
        dataValueField: "Master_Value_ID",
        dataSource: leavetypedata, 
        optionLabel: "---Select---",
        change: function (e) { 
            // Use the value of the widget
            app.utils.loading(true);
            var activity = this.value(); 
            if (activity == 235) //Field Work
            {
                $("#dvdcrmasterdata").show();
                $("#dvdcrmasterdata_ww").hide();
            }
            else if (activity == 237 || activity == 238
                || activity == 242 || activity == 243
                || activity == 244 || activity == 1131
                || activity == 257) // second option Sunday / Holiday/cl/sl/el/lta/nyjd
            {
                $("#dvdcrmasterdata").hide();
                $("#dvdcrmasterdata_ww").hide();
            }
            else // others options
            {
                $("#dvdcrmasterdata").show();
                $("#dvdcrmasterdata_ww").show();
            }
            app.utils.loading(false);
        },
    });
}

function fun_dcr_load_category() {
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("ethosmastervalues"));
    var leavetypedata = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .Where("$.Master_Table_ID==" + 17)
   .ToJSON());
    $("#ddlcategory").kendoDropDownList({
        index: 0,
        dataTextField: "Master_Value_Name",
        dataValueField: "Master_Value_ID",
        dataSource: leavetypedata,
        optionLabel: "---Select---",
        change: function (e) {
            //var leavetype = this.value();
            // Use the value of the widget 
            fun_dcr_load_sfcroute();
        },
    });
}

function fun_dcr_load_mode() {
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("ethosmastervalues"));
    var leavetypedata = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .Where("$.Master_Table_ID==" + 2)
   .ToJSON());
    $("#ddlmode").kendoDropDownList({
        index: 0,
        dataTextField: "Master_Value_Name",
        dataValueField: "Master_Value_ID",
        dataSource: leavetypedata,
        optionLabel: "---Select---",
        change: function (e) {
            //var leavetype = this.value();
            // Use the value of the widget 
            app.utils.loading(true);
            fun_dcr_load_sfcroute();
        },
    });
}

function fun_dcr_load_sfcroute() {
    var userdata = JSON.parse(localStorage.getItem("userdata"));
    var Sub_Territory_ID = userdata.Sub_Territory_ID;
    var Employee_ID = userdata.Employee_ID;

    var Category_ID = parseInt($('#ddlcategory').val()); 
    var Mode_ID = parseInt($('#ddlmode').val());
    fun_db_APP_Get_SFC_Routes(Sub_Territory_ID, Employee_ID, Category_ID, Mode_ID);
} 
function fun_db_APP_Get_SFC_Routes(Sub_Territory_ID, Employee_ID, Category_ID, Mode_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/dvu4zra5xefb2qfq/Invoke/SqlProcedures/APP_Get_SFC_Routes",
                type: "POST",
                dataType: "json",
                data: {
                    "Sub_Territory_ID": Sub_Territory_ID, "Employee_ID": Employee_ID,
                    "Category_ID": Category_ID, "Mode_ID": Mode_ID
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
            app.utils.loading(false); // alert(e);
            app.notify.error('Error loading data please try again later.!');
        }
    });
    datasource.fetch(function () {
        var data = this.data();
        app.utils.loading(false);
        var ethosmastervaluesdata = JSON.parse(data);
        var leavetypedata = JSON.parse(Enumerable.From(ethosmastervaluesdata).ToJSON());
        $("#ddlsfcroute").kendoDropDownList({
            index: 0,
            dataTextField: "Place",
            dataValueField: "SFC_GoogleMap_Fare_Master_ID",
            dataSource: leavetypedata,
            optionLabel: "---Select---", 
        });
    });
}
