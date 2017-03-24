
'use strict';

(function () {
    var view = app.DCRinstitutionView = kendo.observable();
    var DCRinstitutionViewModel = kendo.observable({
        onShow: function () {
            disableBackButton();
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("DCRinstitutionView");
            }
            app.navigation.logincheck();
            if (localStorage.getItem("dcrs_listedinstutition_details_live") == null ||
                localStorage.getItem("dcrs_listedinstutition_details_live") != 1) {
                fun_load_dcr_institution_pageinit();
                fun_load_dcr_institution_pageload();
            }
            else {
                fun_load_dcr_institution_pageload();
            }
            //fun_load_dcr_institution_pageinit();
            //fun_load_dcr_institution_pageload();
        },
        afterShow: function () {
            disableBackButton();
            get_dcr_listedinstitution_values();
        },
        dcrlistedscrValidator: null,
        savelisteddcrdetails: function () {
            //this.dcrlistedscrValidator = app.validate.getValidator('#form-listeddcr');
            //if (!this.dcrlistedscrValidator.validate()) { 
            //    return;
            //}
            //check auto complete string is a avaliable or not 
            var txtlistedinstitution = $("#txtlistedinstitution").val();
            var ethosmastervaluesdata = JSON.parse(localStorage.getItem("dcrinstutitiondetails"));
            var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
           .Where("$.Institution_Name=='" + txtlistedinstitution + "'")
           .ToJSON());
            if (ethosmastervaluesrecords.length == 0) {
                app.notify.error("Select valid institution in list!");
                return false;
            }
            // first check kdm selected or not 
            var kdmflag = false;
            var gridkdmdetails = $("#tblkdmlist")
                            .data("kendoGrid").dataItems();
            $.each(gridkdmdetails, function (i, item) {
                var pob = gridkdmdetails[i].Orders;
                if (parseInt(pob) >= 0) {
                    kdmflag = true;
                    return true;
                }
            });
            var ddlworkwithinst = $("#ddlworkwithinst").data("kendoMultiSelect").value().toString();
            var ddlproductspromotedinst = $("#ddlproductspromotedinst").data("kendoMultiSelect").value().toString();
            if (!kdmflag) {
                app.notify.error("Enter orders for any one of KDM!");
                return false;
            }
            else if (ddlworkwithinst == "") {
                app.notify.error("Select work with!");
                return false;
            }
            else if (ddlproductspromotedinst == "") {
                app.notify.error("Select products promoted!");
                return false;
            }
            else {
                //save dcr listed details
                fun_save_dcr_institution();
                //fun_load_dcr_institution_pageload();
                fun_clearcontrols_dcr_listedinstitution();
                app.notify.success('Institution details saved successfully.');
            }
        },
    });
    view.set('DCRinstitutionViewModel', DCRinstitutionViewModel);
}());

function get_dcr_listedinstitution_values() {
    var render_dcr_ins_master = function (tx1, rs1) {
        // alert("hdndcr_ins_master_id: " + rs1.rows.item(0).dcr_ins_master_id);
        $("#hdndcr_ins_master_id").val(rs1.rows.item(0).dcr_ins_master_id);
    }
    app.select_count_dcr_ins_master_bydcr_master_id(render_dcr_ins_master, 1);
}

function fun_clearcontrols_dcr_listedinstitution() {
    $('#txtlistedinstitution').val('');
    var ddlworkwithinst = $("#ddlworkwithinst").data("kendoMultiSelect");
    ddlworkwithinst.value([]);
    var ddlproductspromotedinst = $("#ddlproductspromotedinst").data("kendoMultiSelect");
    ddlproductspromotedinst.value([]);
    $("#tblkdmlist").data("kendoGrid").dataSource.data([]);
}

function fun_load_dcr_institution_pageinit() {
    $('#txtlistedinstitution').val('');
    $("#ddlworkwithinst").kendoMultiSelect({
        index: 0,
        dataTextField: "Employee_Name",
        dataValueField: "Sub_Territory_ID",
        dataSource: [],
        optionLabel: "---Select---",
        autoClose: false,
        clearButton: false,
    });
    $("#ddlproductspromotedinst").kendoMultiSelect({
        index: 0,
        dataTextField: "ProductGroup_Name",
        dataValueField: "ProductGroup_ID",
        dataSource: [],
        optionLabel: "---Select---",
        autoClose: false,
        clearButton: false,
    });

}

function fun_load_dcr_institution_pageload() {
    app.utils.loading(true);
    fun_load_dcr_institution_institutions();
    app.utils.loading(true);
    fun_dcr_institution_chiefs();
    app.utils.loading(true);
    fun_dcr_institution_productspromoted();
    localStorage.setItem("dcrs_listedinstutition_details_live", 1);
}

function fun_save_dcr_institution() {
    // need to save dcr institution data in sql lite db
    var dcr_master_id = 1;
    var instutition_id = $('#txtlistedinstitution').val().split('|')[1];
    var instutition_name = $('#txtlistedinstitution').val().split('|')[0];

    //app.addto_dcr_ins_master(dcr_master_id, instutition_id, instutition_name,"","");

    var options = {
        enableHighAccuracy: true,
        timeout: 10000
    };
    var geolo = navigator.geolocation.getCurrentPosition(function () {
        app.addto_dcr_ins_master(dcr_master_id, instutition_id, instutition_name,
            JSON.stringify(arguments[0].coords.latitude),
            JSON.stringify(arguments[0].coords.longitude));
    }, function () {
        app.addto_dcr_ins_master(dcr_master_id, instutition_id, instutition_name,
            "", "");
    }, options);

    var hdndcr_ins_master_id = parseInt($("#hdndcr_ins_master_id").val());
    //Add to kdm details  
    var gridkdmdetails = $("#tblkdmlist")
                    .data("kendoGrid").dataItems();
    $.each(gridkdmdetails, function (i, item) {
        var institution_kdm_id = gridkdmdetails[i].Institution_KDM_ID;
        var name_of_key_decision_maker = gridkdmdetails[i].Name_of_Key_Decision_Maker;
        var pob = gridkdmdetails[i].Orders;
        if (parseInt(pob) >= 0) {
            app.addto_dcr_ins_kdm_details(hdndcr_ins_master_id, institution_kdm_id,
                name_of_key_decision_maker, pob);
        }
    });
    //Add to ww details  
    var ddlwwrecords = $("#ddlworkwithinst")
                           .data("kendoMultiSelect").dataItems();
    $.each(ddlwwrecords, function (i, item) {
        var emp_id = ddlwwrecords[i].Employee_Name.split('|')[1];
        var emp_name = ddlwwrecords[i].Employee_Name.split('|')[0];
        app.addto_dcr_ins_ww_details(hdndcr_ins_master_id, emp_id, emp_name);
    });
    //Add to product promoted details  
    var ddlpprecords = $("#ddlproductspromotedinst")
        .data("kendoMultiSelect").dataItems();
    $.each(ddlpprecords, function (i, item) {
        var pp_id = ddlpprecords[i].ProductGroup_ID;
        var pp_name = ddlpprecords[i].ProductGroup_Name;
        app.addto_dcr_ins_pp_details(hdndcr_ins_master_id, pp_id, pp_name);
    });
    hdndcr_ins_master_id = hdndcr_ins_master_id + 1;
    $("#hdndcr_ins_master_id").val(hdndcr_ins_master_id);
}


function fun_load_dcr_institution_institutions() {
    $("#txtlistedinstitution").kendoAutoComplete({
        clearButton: false
    })
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("dcrinstutitiondetails"));
    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .ToJSON());
    app.utils.loading(false);
    $("#txtlistedinstitution").kendoAutoComplete({
        dataSource: ethosmastervaluesrecords,
        dataTextField: "Institution_Name",
        valuePrimitive: true,
        ignoreCase: true,
        minLength: 1,
        filter: "contains",
        placeholder: "Type institution name",
        clearButton: false,
        //separator: ", "
        //noDataTemplate: 'No records found!',
        change: function (e) {
            var value = this.value();
            if (value.length > 6) {
                var ethosmastervaluesdata = JSON.parse(localStorage.getItem("dcrinstutitiondetails"));
                var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
               .Where("$.Institution_Name=='" + value + "'")
               .ToJSON());
                if (ethosmastervaluesrecords.length == 0) {
                    app.notify.error("Select valid institution in list!");
                    return false;
                }
                var user = JSON.parse(localStorage.getItem("userdata"));
                var Sub_Territory_ID = user.Sub_Territory_ID;
                var ins_msl_number = value.split("|")[1];
                app.utils.loading(true);
                fun_dcr_institution_kdms(Sub_Territory_ID, ins_msl_number);
            }
            $('.k-nodata').hide();
        }
    });
}

function fun_dcr_institution_kdms(Sub_Territory_ID, Institution_MSL_Number) {
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("dcrkdmdetails"));
    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
    .Where("$.Sub_Territory_ID==" + Sub_Territory_ID + " && $.Institution_MSL_Number==" + Institution_MSL_Number)
        .ToJSON());
    app.utils.loading(false);
    $("#tblkdmlist").kendoGrid({
        editable: true,
        columns: [
           { hidden: true, title: "Id", field: "Institution_KDM_ID", editable: false },
           { enabled: false, title: "KDM", field: "Name_of_Key_Decision_Maker", editable: false, },
           {
               field: "Orders",
               editor: function (container, options) {
                   // create an input element
                   var input = $("<input/>");
                   // set its name to the field to which the column is bound ('name' in this case)
                   input.attr("name", options.field);
                   input.attr("id", options.field);
                   input.attr("type", "number");
                   // append it to the container
                   input.appendTo(container);
               },
               editable: true
           }
        ],
        dataSource: ethosmastervaluesrecords,
        //selectable: "multiple, row"
    });

    $("#tblkdmlist").find("input[name='Name_of_Key_Decision_Maker']").prop('disabled', true);
}

function fun_dcr_institution_chiefs() {
    var ethosmastervaluesdata = JSON.parse((localStorage.getItem("dcrchiefdetails")));
    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .ToJSON());
    app.utils.loading(false);
    var ddlworkwithinst = $("#ddlworkwithinst").data("kendoMultiSelect");
    ddlworkwithinst.setDataSource(ethosmastervaluesrecords);
    ddlworkwithinst.refresh();

}

function fun_dcr_institution_productspromoted() {
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("dcrproductdetails"));
    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .ToJSON());
    app.utils.loading(false);
    var ddlproductspromotedinst = $("#ddlproductspromotedinst").data("kendoMultiSelect");
    ddlproductspromotedinst.setDataSource(ethosmastervaluesrecords);
    ddlproductspromotedinst.refresh();
}

