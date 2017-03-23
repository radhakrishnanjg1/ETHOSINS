'use strict';
(function () {
    var view = app.DCRmasterView = kendo.observable();
    var DCRmasterViewModel = kendo.observable({
        
        onShow: function () { 
        },
        afterShow: function () {
            disableBackButton();
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("DCRmasterView");
            }
            app.navigation.logincheck();
            fun_load_dcr_master_pageinit();
            var user = JSON.parse(localStorage.getItem("userdata"));
            var Employee_ID = user.Employee_ID;
            var Sub_Territory_ID = user.Sub_Territory_ID;
            var Designation_ID = user.Designation_ID;
            var Division_ID = user.Division_ID;
            app.utils.loading(true);
            fun_db_APP_Get_DCR_Required_Information(Employee_ID, Sub_Territory_ID,
                Designation_ID, Division_ID);
        },
        fun_load_master_mj: function () {
            var ddlworkwithmaster = $("#ddlworkwithmaster").data("kendoMultiSelect");
            var Sub_Territory_ID = ddlworkwithmaster.value().toString();
            ddlworkwithmaster.close();
            var ddlworkwithmaster = $("#ddlworkwithmaster").data("kendoMultiSelect").value().toString();
            if (ddlworkwithmaster == "") {
                app.notify.error("Select work with!");
                return false;
            }
            app.utils.loading(true);
            var user = JSON.parse(localStorage.getItem("userdata"));
            var emp_Sub_Territory_ID = user.Sub_Territory_ID;
            if (Sub_Territory_ID.match(',') && Sub_Territory_ID.match(emp_Sub_Territory_ID)) {
                app.notify.error("You can't select alone and some one at same time!");
                return false;
            }
            else {
                fun_db_dcr_master_APP_Get_Market_Area_Names(Sub_Territory_ID);
            }
        },
        //savedcrmsterdetails
        savedcrmsterdetails: function () {
            var ddlactivityperiod = parseInt($("#ddlactivityperiod").val());
            var ddlactivity = parseInt($("#ddlactivity").val());
            if (ddlactivityperiod == "" || isNaN(ddlactivityperiod)) {
                app.notify.error("Select period!");
                return false;
            }
            if (ddlactivity == "" || isNaN(ddlactivity)) {
                app.notify.error("Select activity!");
                return false;
            }
            else {
                var ddlcategory = parseInt($("#ddlcategory").val());
                var ddlmode = parseInt($("#ddlmode").val());
                var ddlsfcroute = parseInt($("#ddlsfcroute").val());
                if (ddlactivity == 235) //Field Work
                {
                    if (ddlcategory == "" || isNaN(ddlcategory)) {
                        app.notify.error("Select category!");
                        return false;
                    }
                    else if (ddlmode == "" || isNaN(ddlmode)) {
                        app.notify.error("Select mode!");
                        return false;
                    }
                    else if (ddlsfcroute == "" || isNaN(ddlsfcroute)) {
                        app.notify.error("Select SFC route!");
                        return false;
                    }
                    else {
                        fun_save_dcrmaster_fieldstaff();
                        fun_clearcontrols_dcrmaster_fieldstaff();
                        //app.notify.success('Master details saved successfully.');
                        app.navigation.navigateDCRinstitutionView();
                    }
                }
                else if (ddlactivity == 236 || ddlactivity == 239
               || ddlactivity == 240 || ddlactivity == 241
                || ddlactivity == 247
               || ddlactivity == 248 || ddlactivity == 249
               || ddlactivity == 250 || ddlactivity == 251
               || ddlactivity == 252 || ddlactivity == 253
               || ddlactivity == 254 || ddlactivity == 255
               || ddlactivity == 256 || ddlactivity == 258)  //247
                    //248 , 249 250 251 252 ,253
                    // 254 , 255, 256, 258
                { // second options 
                    var ddlworkwithmaster = $("#ddlworkwithmaster").data("kendoMultiSelect").value().toString();
                    var ddlmajortownmaster = $("#ddlmajortownmaster").data("kendoMultiSelect").value().toString();
                    if (ddlworkwithmaster == "") {
                        app.notify.error("Select work with!");
                        return false;
                    }
                    else if (ddlmajortownmaster == "") {
                        app.notify.error("Select major town!");
                        return false;
                    }
                    else {

                        var user = JSON.parse(localStorage.getItem("userdata"));
                        var emp_Sub_Territory_ID = user.Sub_Territory_ID;
                        var Sub_Territory_ID = ddlworkwithmaster;
                        if (Sub_Territory_ID.match(',') && Sub_Territory_ID.match(emp_Sub_Territory_ID)) {
                            app.notify.error("You can't select alone and some one at same time!");
                            return false;
                        }
                        fun_save_dcrmaster_secondflow();
                        fun_clearcontrols_dcrmaster_secondflow();
                        //app.notify.success('Master details saved successfully.'); 
                        app.navigation.navigateDCRfinaentryView();
                    }
                }
                else if (ddlactivity == 237 || ddlactivity == 238
                    || ddlactivity == 242 || ddlactivity == 243
                    || ddlactivity == 244 || ddlactivity == 1131) // other option Sunday / Holiday/cl/sl/el/lta/nyjd
                {
                    if (ddlactivityperiod == 228) // other option Sunday / Holiday/cl/sl/el/lta/nyjd
                    {
                        app.notify.error("Activity period and activity combination is not allowed!");
                        return false;
                    }
                    fun_save_dcrmaster_otherflow();
                    fun_clearcontrols_dcrmaster_otherflow();
                    //app.notify.success('Master details saved successfully.');
                    app.navigation.navigateDCRfinaentryView();
                }  
            }

            //after validate n save n redirect next page
        },
    });

    view.set('DCRmasterViewModel', DCRmasterViewModel);
}());

//function get_dcr_master_id() {
//    var render = function (tx, rs) {
//        if (rs.rows.length == 0) {
//            $("#hdndcr_master_id").val(1);
//        } else {
//            $("#hdndcr_master_id").val(rs.rows.item(0).ID);
//        }
//    }
//    app.db.transaction(function (tx) {
//        tx.executeSql("SELECT dcr_master_id+1 FROM dcr_master ORDER BY dcr_master_id desc limit 1", [],
//                      render,
//                      app.onError);
//    });
//}

function fun_clearcontrols_dcrmaster_fieldstaff() {
    var ddlactivityperiod = $("#ddlactivityperiod").data("kendoDropDownList");
    ddlactivityperiod.value("---Select---");
    var ddlactivity = $("#ddlactivity").data("kendoDropDownList");
    ddlactivity.value("---Select---");
    var ddlcategory = $("#ddlcategory").data("kendoDropDownList");
    ddlcategory.value("---Select---");
    var ddlmode = $("#ddlmode").data("kendoDropDownList");
    ddlmode.value("---Select---");
    var ddlsfcroute = $("#ddlsfcroute").data("kendoDropDownList");
    ddlsfcroute.value("---Select---"); 
}

function fun_clearcontrols_dcrmaster_secondflow() {
    var ddlactivityperiod = $("#ddlactivityperiod").data("kendoDropDownList");
    ddlactivityperiod.value("---Select---");
    var ddlactivity = $("#ddlactivity").data("kendoDropDownList");
    ddlactivity.value("---Select---"); 
    var ddlworkwithmaster = $("#ddlworkwithmaster").data("kendoMultiSelect");
    ddlworkwithmaster.value("");
    var ddlmajortownmaster = $("#ddlmajortownmaster").data("kendoMultiSelect");
    ddlmajortownmaster.value("");
}

function fun_clearcontrols_dcrmaster_otherflow() {
    var ddlactivityperiod = $("#ddlactivityperiod").data("kendoDropDownList");
    ddlactivityperiod.value("---Select---");
    var ddlactivity = $("#ddlactivity").data("kendoDropDownList");
    ddlactivity.value("---Select---"); 
}

function fun_load_dcr_master_pageinit() {
    $("#ddlactivityperiod").kendoDropDownList().data("kendoDropDownList");
    $("#ddlactivity").kendoDropDownList().data("kendoDropDownList");
    $("#ddlcategory").kendoDropDownList().data("kendoDropDownList");
    $("#ddlmode").kendoDropDownList().data("kendoDropDownList");
    $("#ddlsfcroute").kendoDropDownList().data("kendoDropDownList");


    //if (localStorage.getItem("dcr_master_ispageinitiated") == null ||
    //  localStorage.getItem("dcr_master_ispageinitiated") != 1) {
        $("#ddlmajortownmaster").kendoMultiSelect({
            index: 0,
            dataTextField: "Market_Area_Name",
            dataValueField: "Market_Area_ID",
            dataSource: [],
            optionLabel: "---Select---",
            autoClose: false,
            clearButton: false,
        });
        $("#ddlworkwithmaster").kendoMultiSelect({
            index: 0,
            dataTextField: "Employee_Name",
            dataValueField: "Sub_Territory_ID",
            dataSource: [],
            optionLabel: "---Select---",
            autoClose: false,
            clearButton: false,
            change: function (e) {
                var ddlmajortownmaster = $("#ddlmajortownmaster").data("kendoMultiSelect");
                ddlmajortownmaster.value("");

                var ddlmajortownmaster = $("#ddlmajortownmaster").data("kendoMultiSelect");
                ddlmajortownmaster.setDataSource([]);
                ddlmajortownmaster.refresh();
            },
        });
   // }
    //localStorage.setItem("dcr_master_ispageinitiated", 1);
}

function fun_load_dcr_master_pageload() {
    fun_dcr_load_activityperiod();
    fun_dcr_load_activity();
    fun_dcr_load_category();
    fun_dcr_load_mode();
}

function fun_save_dcrmaster_fieldstaff() {
    //localStorage.setItem("Activity_Period_ID", parseInt($("#ddlactivityperiod").val()));
    //localStorage.setItem("Activity_ID", parseInt($("#ddlactivity").val()));
    //localStorage.setItem("DCR_isavailable", 1);
    // need to save dcr master data in sql lite db
    var dcr_date = $("#txtdcrdate").val();
    var activity_peroid_id = parseInt($("#ddlactivityperiod").val());
    var activity_peroid_name = $("#ddlactivityperiod option:selected").text();
    var activity_id = parseInt($("#ddlactivity").val());
    var activity_name = $("#ddlactivity option:selected").text();
    var category_id = parseInt($("#ddlcategory").val());;
    var category_name = $("#ddlcategory option:selected").text();
    var mode_id = parseInt($("#ddlmode").val());;
    var mode_name = $("#ddlmode option:selected").text();
    var sfcroute_id = parseInt($("#ddlsfcroute").val());;//ddlsfcroute;
    var sfcroute_place = $("#ddlsfcroute option:selected").text();
    var deviation_reason = "";
    var deviation_description = "";
    //alert("dcr_date:" + dcr_date + "|activity_peroid_id:" + activity_peroid_id + "|activity_peroid_name:" + activity_peroid_name + "|activity_id:" + activity_id + "|activity_name:" + activity_name + "|category_id:" +
    //category_id + "|category_name:" + category_name + "|mode_id:" + mode_id + "|mode_name:" + mode_name + "|sfcroute_id:" + sfcroute_id + "|sfcroute_place:" +
    //sfcroute_place + "|deviation_reason:" + deviation_reason + "|deviation_description:" + deviation_description);

    //app.addto_dcr_master(Employee_ID, Sub_Territory_ID,dcr_date, activity_peroid_id, activity_peroid_name, activity_id, activity_name,
    //category_id, category_name, mode_id, mode_name, sfcroute_id,
    //sfcroute_place, deviation_reason, deviation_description);

    var user = JSON.parse(localStorage.getItem("userdata"));
    var Employee_ID = user.Employee_ID;
    var Sub_Territory_ID = user.Sub_Territory_ID; 
    app.addto_dcr_master(Employee_ID, Sub_Territory_ID, dcr_date, activity_peroid_id, activity_peroid_name, activity_id, activity_name,
        category_id, category_name, mode_id, mode_name, sfcroute_id,
        sfcroute_place, deviation_reason, deviation_description,
        "", "");
    setTimeout(fun_update_dcr_master_geo, 1000);
}

function fun_save_dcrmaster_secondflow() {
      
    // need to save dcr master data in sql lite db
    var dcr_date = $("#txtdcrdate").val();
    var activity_peroid_id = parseInt($("#ddlactivityperiod").val());
    var activity_peroid_name = $("#ddlactivityperiod option:selected").text();
    var activity_id = parseInt($("#ddlactivity").val());
    var activity_name = $("#ddlactivity option:selected").text();
    var category_id = 0;
    var category_name = "";
    var mode_id = 0;;
    var mode_name = "";
    var sfcroute_id = 0;//ddlsfcroute;
    var sfcroute_place = "";
    var deviation_reason = "";
    var deviation_description = "";
    //alert("dcr_date:" + dcr_date + "|activity_peroid_id:" + activity_peroid_id + "|activity_peroid_name:" + activity_peroid_name + "|activity_id:" + activity_id + "|activity_name:" + activity_name + "|category_id:" +
    //category_id + "|category_name:" + category_name + "|mode_id:" + mode_id + "|mode_name:" + mode_name + "|sfcroute_id:" + sfcroute_id + "|sfcroute_place:" +
    //sfcroute_place + "|deviation_reason:" + deviation_reason + "|deviation_description:" + deviation_description);

    var user = JSON.parse(localStorage.getItem("userdata"));
    var Employee_ID = user.Employee_ID;
    var Sub_Territory_ID = user.Sub_Territory_ID; 
    app.addto_dcr_master(Employee_ID, Sub_Territory_ID, dcr_date, activity_peroid_id, activity_peroid_name, activity_id, activity_name,
        category_id, category_name, mode_id, mode_name, sfcroute_id,
        sfcroute_place, deviation_reason, deviation_description,
        "", "");
    setTimeout(fun_update_dcr_master_geo, 1000);
    // get_dcr_master_id();
    var dcr_master_id = $("#hdndcr_master_id").val();
    var ddlwwrecords = $("#ddlworkwithmaster")
                            .data("kendoMultiSelect").dataItems();
    $.each(ddlwwrecords, function (i, item) {
        //alert("id:" + ddlwwrecords[i].Employee_Name.split('|')[1] + " | name:"
        //    + ddlwwrecords[i].Employee_Name);
        var emp_id = ddlwwrecords[i].Employee_Name.split('|')[1];
        var emp_name = ddlwwrecords[i].Employee_Name.split('|')[0];
        app.addto_dcr_master_ww_details(dcr_master_id, emp_id, emp_name);
    });
    var ddlmjrecords = $("#ddlmajortownmaster")
        .data("kendoMultiSelect").dataItems();
    $.each(ddlmjrecords, function (i, item) {
        //alert("id:" + ddlmjrecords[i].Market_Area_ID + " | name:"
        //    + ddlmjrecords[i].Market_Area_Name);
        var mj_id = ddlmjrecords[i].Market_Area_ID;
        var mj_name = ddlmjrecords[i].Market_Area_Name;
        app.addto_dcr_master_mj_details(dcr_master_id, mj_id, mj_name);
    });
    setTimeout(fun_update_dcr_master_geo, 1000);
}

function fun_save_dcrmaster_otherflow() {
     
    // need to save dcr master data in sql lite db
    var dcr_date = $("#txtdcrdate").val();
    var activity_peroid_id = parseInt($("#ddlactivityperiod").val());
    var activity_peroid_name = $("#ddlactivityperiod option:selected").text();
    var activity_id = parseInt($("#ddlactivity").val());
    var activity_name = $("#ddlactivity option:selected").text();
    var category_id = 0;
    var category_name = "";
    var mode_id = 0;;
    var mode_name = "";
    var sfcroute_id = 0;//ddlsfcroute;
    var sfcroute_place = "";
    var deviation_reason = "";
    var deviation_description = "";
    var user = JSON.parse(localStorage.getItem("userdata"));
    var Employee_ID = user.Employee_ID;
    var Sub_Territory_ID = user.Sub_Territory_ID;
     
    app.addto_dcr_master(Employee_ID, Sub_Territory_ID, dcr_date, activity_peroid_id, activity_peroid_name, activity_id, activity_name,
        category_id, category_name, mode_id, mode_name, sfcroute_id,
        sfcroute_place, deviation_reason, deviation_description,
        "", "");
    setTimeout(fun_update_dcr_master_geo, 1000); 
}

function fun_update_dcr_master_geo()
{
    var options = {
            enableHighAccuracy: false,
            timeout: 10000
        };
    var geolo = navigator.geolocation.getCurrentPosition(function () {
        app.update_dcr_master_geo(1,
                JSON.stringify(arguments[0].coords.latitude),
                JSON.stringify(arguments[0].coords.longitude));
    }, function () {
        app.update_dcr_master_geo(1,
                "",
                "");
    }, options);
}
function fun_dcr_load_activityperiod() {
    localStorage.setItem("Activity_Period_ID", parseInt($("#ddlactivityperiod").val()));
    localStorage.setItem("Activity_ID", parseInt($("#ddlactivity").val()));
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("dcrlastreporteddetails"));
    var records = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .ToJSON());
    $("#ddlactivityperiod").kendoDropDownList({
        index: 0,
        dataTextField: "Master_Value_Name",
        dataValueField: "Master_Value_ID",
        dataSource: records,
        //change: onChange
        optionLabel: "---Select---",
    });
    $("#txtdcrdate").val(records[0].Last_Date);
}

function fun_dcr_load_activity() {
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("dcractivitytypedetails"));
    var leavetypedata = JSON.parse(Enumerable.From(ethosmastervaluesdata)
       .Where("$.Master_Value_ID!=" + 262)
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
            else if (activity == 236 || activity == 239
                || activity == 240 || activity == 241
                 || activity == 247
                || activity == 248 || activity == 249
                || activity == 250 || activity == 251
                || activity == 252 || activity == 253
                || activity == 254 || activity == 255
                || activity == 256 || activity == 258)  //247
                //248 , 249 250 251 252 ,253
                // 254 , 255, 256, 258
            { // others options 

                app.utils.loading(true);
                fun_dcr_master_chiefs();
                $("#dvdcrmasterdata").hide();
                $("#dvdcrmasterdata_ww").show();
            }
            else if (activity == 237 || activity == 238
                || activity == 242 || activity == 243
                || activity == 244 || activity == 1131) // other option Sunday / Holiday/cl/sl/el/lta/nyjd
            {
                $("#dvdcrmasterdata").hide();
                $("#dvdcrmasterdata_ww").hide();
            }
            app.utils.loading(false);
        },
    });
}

function fun_dcr_load_category() {
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("ethosmastervalues"));
    var leavetypedata = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .Where("$.Master_Table_ID==" + 17 + " && $.Master_Value_ID!=" + 264)
   .ToJSON());
    $("#ddlcategory").kendoDropDownList({
        index: 0,
        dataTextField: "Master_Value_Short_Form",
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
   .Where("$.Master_Table_ID==" + 2 + " && $.Master_Value_ID!=" + 263)
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
    if (isNaN(Category_ID)) {
        Category_ID = 0;
    }
    if (isNaN(Mode_ID)) {
        Mode_ID = 0;
    }
    app.utils.loading(false);
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("dcrsfcroutedetails"));
    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
        .Where("$.Category_ID==" + Category_ID + " && $.Mode_ID==" + Mode_ID).ToJSON());
    $("#ddlsfcroute").kendoDropDownList({
        index: 0,
        dataTextField: "Place",
        dataValueField: "SFC_GoogleMap_Fare_Master_ID",
        dataSource: ethosmastervaluesrecords,
        optionLabel: "---Select---",
    });
}

function fun_dcr_master_chiefs() {
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("dcrchiefdetails"));
    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .ToJSON());
    app.utils.loading(false);
    var ddlworkwithmaster = $("#ddlworkwithmaster").data("kendoMultiSelect");
    ddlworkwithmaster.setDataSource(ethosmastervaluesrecords);
    ddlworkwithmaster.refresh();
}

function fun_db_APP_Get_DCR_Required_Information(Employee_ID, Sub_Territory_ID, Designation_ID, Division_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/dvu4zra5xefb2qfq/Invoke/SqlProcedures/APP_Get_DCR_Required_Information",
                type: "POST",
                dataType: "json",
                data: {
                    "Employee_ID": Employee_ID, "Sub_Territory_ID": Sub_Territory_ID,
                    "Designation_ID": Designation_ID, "Division_ID": Division_ID
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
            app.notify.error('Error loading data please try again later!');
        }
    });
    datasource.fetch(function () {
        var data = this.data();
        app.utils.loading(false); 
        localStorage.setItem("dcractivitytypedetails", JSON.stringify(data[0])); // ActivityType details 

        localStorage.setItem("dcrproductdetails", JSON.stringify(data[1])); // product details

        localStorage.setItem("dcrsfcroutedetails", JSON.stringify(data[2])); // sfcroutes details 

        localStorage.setItem("dcrchiefdetails", JSON.stringify(data[3])); // chief details

        localStorage.setItem("dcrinstutitiondetails", JSON.stringify(data[4])); // instutition details 

        localStorage.setItem("dcrkdmdetails", JSON.stringify(data[5])); // kdm details

        localStorage.setItem("dcrlastreporteddetails", JSON.stringify(data[6])); // last reported details  

        localStorage.setItem("dcrtourplandetails", JSON.stringify(data[7])); // tourplan details  based on empid,sub id,reported date

        fun_load_dcr_master_pageload();
    });
}

function fun_db_dcr_master_APP_Get_Market_Area_Names(Sub_Territory_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/dvu4zra5xefb2qfq/Invoke/SqlProcedures/APP_Get_Market_Area_Names",
                type: "POST",
                dataType: "json",
                data: {
                    "Sub_Territory_ID": Sub_Territory_ID
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
            app.notify.error('Error loading data please try again later!');
        }
    });
    datasource.fetch(function () {
        var data = this.data();
        app.utils.loading(false);
        var records = JSON.parse(JSON.stringify(data));
        var ddlmajortownmaster = $("#ddlmajortownmaster").data("kendoMultiSelect");
        ddlmajortownmaster.setDataSource(records);
        ddlmajortownmaster.refresh();
    });
}
