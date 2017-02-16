
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
            $("#ddlactivity").kendoDropDownList({
                index: 0,
                //dataTextField: "Master_Value_Name",
                //dataValueField: "Master_Value_ID",
                //dataSource: leavetypedata,
                //change: onChange
                optionLabel: "---Select---",
                change: function (e) {
                    var activity = this.value();
                    // Use the value of the widget
                   // app.utils.loading(true);
                    //fun_db_APP_Get_Employee_Leave_Details(leavetype, $('#hdnEmployee_ID').val());
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
                },
            });
            $("#ddlcategory").kendoDropDownList().data("kendoDropDownList");
            $("#ddlmode").kendoDropDownList().data("kendoDropDownList");

            $("#ddlworkwithmaster").kendoMultiSelect().data("kendoMultiSelect");
            $("#ddlmajortown").kendoMultiSelect().data("kendoMultiSelect");


            $("#ddlproductspromoted").kendoMultiSelect().data("kendoMultiSelect"); 
            $("#ddlworkwithchild").kendoMultiSelect().data("kendoMultiSelect");
           // 
        },
        gotoDCR1: function () {
            $("#dvdcr1").show();
            $("#dvdcr2").hide();
            $("#dvdcr3").hide();
            $("#dvdcr4").hide();
            $("#dvdcr5").hide();
        },
        gotoDCR2: function () {
            $("#dvdcr1").hide();
            $("#dvdcr2").show();
            $("#dvdcr3").hide();
            $("#dvdcr4").hide();
            $("#dvdcr5").hide();
        },
        gotoDCR3: function () { 
            var activity = parseInt($("#ddlactivity").val());
            // Use the value of the widget
            // app.utils.loading(true);
            //fun_db_APP_Get_Employee_Leave_Details(leavetype, $('#hdnEmployee_ID').val());
            if (activity == 235) //Field Work
            {
                $("#dvdcr1").hide();
                $("#dvdcr2").hide();
                $("#dvdcr3").show();
                $("#dvdcr4").hide();
                $("#dvdcr5").hide();
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
            }
            else // others options
            { 
                $("#dvdcr1").hide();
                $("#dvdcr2").hide();
                $("#dvdcr3").hide();
                $("#dvdcr4").hide();
                $("#dvdcr5").show();
            }
        },
        gotoDCR4: function () {
            $("#dvdcr1").hide();
            $("#dvdcr2").hide();
            $("#dvdcr3").hide();
            $("#dvdcr4").show();
            $("#dvdcr5").hide();
        },
        gotoDCR5: function () {
            $("#dvdcr1").hide();
            $("#dvdcr2").hide();
            $("#dvdcr3").hide();
            $("#dvdcr4").hide();
            $("#dvdcr5").show();
        },
    });

    view.set('DCRViewModel', DCRViewModel);
}());


function fun_dcr_activityperiod() { 
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("ethosmastervalues"));
    var leavetypedata = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .Where("$.Master_Table_ID==" + 16)
   .ToJSON());
    $("#ddlperiod").kendoDropDownList({
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

function fun_dcr_activity() {
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
        //change: function (e) {
        //    var leavetype = this.value();
        //    // Use the value of the widget
        //    app.utils.loading(true);
        //    fun_db_APP_Get_Employee_Leave_Details(leavetype, $('#hdnEmployee_ID').val());
        //},
    });
}

function fun_dcr_category() {
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
        //change: function (e) {
        //    var leavetype = this.value();
        //    // Use the value of the widget
        //    app.utils.loading(true);
        //    fun_db_APP_Get_Employee_Leave_Details(leavetype, $('#hdnEmployee_ID').val());
        //},
    });
}

function fun_dcr_mode() {
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
        //change: function (e) {
        //    var leavetype = this.value();
        //    // Use the value of the widget
        //    app.utils.loading(true);
        //    fun_db_APP_Get_Employee_Leave_Details(leavetype, $('#hdnEmployee_ID').val());
        //},
    });
}

function fun_dcr_sfcroute() {
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("ethosmastervalues"));
    var leavetypedata = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .Where("$.Master_Table_ID==" + 2)
   .ToJSON());
    $("#ddlsfcroute").kendoDropDownList({
        index: 0,
        dataTextField: "Master_Value_Name",
        dataValueField: "Master_Value_ID",
        dataSource: leavetypedata,
        optionLabel: "---Select---",
        //change: function (e) {
        //    var leavetype = this.value();
        //    // Use the value of the widget
        //    app.utils.loading(true);
        //    fun_db_APP_Get_Employee_Leave_Details(leavetype, $('#hdnEmployee_ID').val());
        //},
    });
}
 

 
 