
'use strict';

(function () {
    var view = app.DCRunlistedinstitutionView = kendo.observable();
    var DCRunlistedinstitutionViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("DCRunlistedinstitutionView");
            }
            app.navigation.logincheck();
            if (localStorage.getItem("dcrs_unlistedinstutition_details_live") == null ||
                localStorage.getItem("dcrs_unlistedinstutition_details_live") != 1) {
                var user = JSON.parse(localStorage.getItem("userdata"));
                var Sub_Territory_ID = user.Sub_Territory_ID;
                app.utils.loading(true);
                fun_db_APP_Get_DCR_State_City_Information(Sub_Territory_ID); 
            }
            else {
                fun_load_dcr_unlistedinstitution_pageload();
            }
        },
        dcrunlistedscrValidator: null,
        saveunlistedscrdetails: function () {
            this.dcrunlistedscrValidator = app.validate.getValidator('#form-unlistedscr');
            if (!this.dcrunlistedscrValidator.validate()) {
                //$(".k-invalid-msg").show();
                return;
            }
            //save dcr unlisteddetails
            fun_save_dcrmaster_unlisted_institution();
            fun_clearcontrols_dcr_unlisted_institution();
            app.notify.success('Unlisted institution details saved successfully.');
        },
    });

    view.set('DCRunlistedinstitutionViewModel', DCRunlistedinstitutionViewModel);
}());

function fun_save_dcrmaster_unlisted_institution() {
    //  parent  table data and need to save dcr master data in sql lite db
    var txtinstitution = $("#txtinstitution").val();
    var txtkdm = "";//($("#txtkdm").val());
    var txtpobsingle = parseInt($("#txtpobsingle").val());
    var ddlstate = parseInt($("#ddlstate").val());
    var ddlstate_name = $("#ddlstate option:selected").text();
    var ddlcity = parseInt($("#ddlcity").val());
    var ddlcity_name = $("#ddlcity option:selected").text();
    var ddlmajortownunlisted = parseInt($("#ddlmajortownunlisted").val());
    var ddlmajortownunlisted_name = $("#ddlmajortownunlisted option:selected").text();
    var txtaddress = $("#txtaddress").val();
    var txtpincode = $("#txtpincode").val();
    var txtphone = $("#txtphone").val();
    var txtmobile = $("#txtmobile").val();
    var txtemail = $("#txtemail").val(); 
    var dcr_master_id = $("#hdndcr_master_id").val();
    //app.addto_dcr_unlisted_ins_master(dcr_master_id, txtinstitution, txtkdm, txtpobsingle,
    //ddlmajortownunlisted, ddlmajortownunlisted_name, ddlstate, ddlstate_name, ddlcity,
    //ddlcity_name, txtaddress, txtpincode, txtphone, txtmobile, txtemail);

    var options = {
        enableHighAccuracy: true,
        timeout: 10000
    };
    var geolo = navigator.geolocation.getCurrentPosition(function () {
        app.addto_dcr_unlisted_ins_master(dcr_master_id, txtinstitution, txtkdm, txtpobsingle,
    ddlmajortownunlisted, ddlmajortownunlisted_name, ddlstate, ddlstate_name, ddlcity,
    ddlcity_name, txtaddress, txtpincode, txtphone, txtmobile, txtemail,
    JSON.stringify(arguments[0].coords.latitude), JSON.stringify(arguments[0].coords.longitude));
    }, function () {
        app.addto_dcr_unlisted_ins_master(dcr_master_id, txtinstitution, txtkdm, txtpobsingle,
     ddlmajortownunlisted, ddlmajortownunlisted_name, ddlstate, ddlstate_name, ddlcity,
     ddlcity_name, txtaddress, txtpincode, txtphone, txtmobile, txtemail,
      "","");
    }, options);

    //child table data
    var hdndcr_unlisted_ins_master_id = parseInt($("#hdndcr_unlisted_ins_master_id").val()); 
    var ddlwwrecords = $("#ddlworkwithunlisted")
                            .data("kendoMultiSelect").dataItems();
    $.each(ddlwwrecords, function (i, item) { 
        var emp_id = ddlwwrecords[i].Employee_Name.split('|')[1];
        var emp_name = ddlwwrecords[i].Employee_Name;
        app.addto_dcr_unlisted_ins_ww_details(hdndcr_unlisted_ins_master_id, emp_id, emp_name);
    });
    var ddlpprecords = $("#ddlproductspromotedunlisted")
        .data("kendoMultiSelect").dataItems();
    $.each(ddlpprecords, function (i, item) {
        var pp_id = ddlpprecords[i].ProductGroup_ID;
        var pp_name = ddlpprecords[i].ProductGroup_Name;
        app.addto_dcr_unlisted_ins_pp_details(hdndcr_unlisted_ins_master_id, pp_id, pp_name);
    });

    hdndcr_unlisted_ins_master_id = hdndcr_unlisted_ins_master_id + 1;
    $("#hdndcr_unlisted_ins_master_id").val(hdndcr_unlisted_ins_master_id);
}

function fun_clearcontrols_dcr_unlisted_institution() {
    $("#txtinstitution").val('');
    $("#txtkdm").val('');
    $("#txtpobsingle").val('');
    var ddlmajortownunlisted = $("#ddlmajortownunlisted").data("kendoDropDownList");
    ddlmajortownunlisted.value("---Select---");
    var ddlstate = $("#ddlstate").data("kendoDropDownList");
    ddlstate.value("---Select---");
    var ddlcity = $("#ddlcity").data("kendoDropDownList");
    ddlcity.value("---Select---"); 
    $("#txtaddress").val('');
    $("#txtpincode").val('');
    $("#txtphone").val('');
    $("#txtmobile").val('');
    $("#txtemail").val('');
    var ddlworkwithunlisted = $("#ddlworkwithunlisted").data("kendoMultiSelect");
    ddlworkwithunlisted.value("");
    var ddlproductspromotedunlisted = $("#ddlproductspromotedunlisted").data("kendoMultiSelect");
    ddlproductspromotedunlisted.value("");
}
function fun_load_dcr_unlistedinstitution_pageinit() {
    $("#ddlstate").kendoDropDownList().data("kendoDropDownList");
    $("#ddlcity").kendoDropDownList().data("kendoDropDownList");
    fun_dcr_unlistedinstitution_marketareas();
    fun_dcr_unlistedinstitution_states();
    $("#ddlworkwithunlisted").kendoMultiSelect({
        index: 0,
        dataTextField: "Employee_Name",
        dataValueField: "Sub_Territory_ID",
        dataSource: [],
        optionLabel: "---Select---",
        autoClose: false,
        clearButton: false,
    });
    $("#ddlproductspromotedunlisted").kendoMultiSelect({
        index: 0,
        dataTextField: "ProductGroup_Name",
        dataValueField: "ProductGroup_ID",
        dataSource: [],
        optionLabel: "---Select---",
        autoClose: false,
        clearButton: false,
    });
}
function fun_load_dcr_unlistedinstitution_pageload() {
    $("#ddlstate").kendoDropDownList().data("kendoDropDownList");
    $("#ddlcity").kendoDropDownList().data("kendoDropDownList");
    fun_dcr_unlistedinstitution_marketareas();
    fun_dcr_unlistedinstitution_states(); 
    fun_dcr_unlistedinstitution_chiefs();
    fun_dcr_unlistedinstitution_productspromoted();
}


function fun_dcr_unlistedinstitution_chiefs() {
    var ethosmastervaluesdata = JSON.parse((localStorage.getItem("dcrchiefdetails")));
    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .ToJSON());
    app.utils.loading(false);  
    var ddlworkwithunlisted = $("#ddlworkwithunlisted").data("kendoMultiSelect");
    ddlworkwithunlisted.setDataSource(ethosmastervaluesrecords);
    ddlworkwithunlisted.refresh();
}

function fun_dcr_unlistedinstitution_productspromoted() {
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("dcrproductdetails"));
    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .ToJSON()); 
    var ddlproductspromotedunlisted = $("#ddlproductspromotedunlisted").data("kendoMultiSelect");
    ddlproductspromotedunlisted.setDataSource(ethosmastervaluesrecords);
    ddlproductspromotedunlisted.refresh();
}

function fun_dcr_unlistedinstitution_marketareas() {
    var ethosmastervaluesdata = JSON.parse((localStorage.getItem("dcrmarketareadetails")));
    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .ToJSON());
    app.utils.loading(false);
    $("#ddlmajortownunlisted").kendoDropDownList({
        index: 0,
        dataTextField: "Market_Area_Name",
        dataValueField: "Market_Area_ID",
        dataSource: ethosmastervaluesrecords,
        optionLabel: "---Select---",
    });
}
function fun_dcr_unlistedinstitution_states() {
    var ethosmastervaluesdata = JSON.parse((localStorage.getItem("dcrstatedetails")));
    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .ToJSON());
    app.utils.loading(false);
    $("#ddlstate").kendoDropDownList({
        index: 0,
        dataTextField: "State_Name",
        dataValueField: "State_Id",
        dataSource: ethosmastervaluesrecords,
        optionLabel: "---Select---",
        change: function (e) {
            var value = this.value();
            fun_dcr_unlistedinstitution_cities(value);
        },
    });
}

function fun_dcr_unlistedinstitution_cities(State_ID) {
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("dcrcitydetails"));
    var records = JSON.parse(Enumerable.From(ethosmastervaluesdata)
    .Where("$.State_ID==" + State_ID)
        .ToJSON());
    $("#ddlcity").kendoDropDownList({
        index: 0,
        dataTextField: "City_Name",
        dataValueField: "City_ID",
        dataSource: records,
        optionLabel: "---Select---",
    });
}

function fun_db_APP_Get_DCR_State_City_Information(Sub_Territory_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/dvu4zra5xefb2qfq/Invoke/SqlProcedures/APP_Get_DCR_State_City_Information",
                type: "POST",
                dataType: "json",
                data: {
                    "Sub_Territory_ID": Sub_Territory_ID
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
        app.utils.loading(false);

        localStorage.setItem("dcrstatedetails", JSON.stringify(data[0])); // state details 

        localStorage.setItem("dcrcitydetails", JSON.stringify(data[1])); // city details

        localStorage.setItem("dcrmarketareadetails", JSON.stringify(data[2])); // market area details

        localStorage.setItem("dcrs_unlistedinstutition_details_live", 1);
        fun_load_dcr_unlistedinstitution_pageinit();
        fun_load_dcr_unlistedinstitution_pageload();
    });
}

