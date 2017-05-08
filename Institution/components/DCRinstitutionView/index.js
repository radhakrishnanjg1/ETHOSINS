
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
            
        },
        afterShow: function () { 
            disableBackButton();
            get_dcr_listedinstitution_values();
            get_dcrworkwithmaster_subterritories_values();
            fun_load_dcr_listedinstutition_ww_temp();
            fun_load_listedinstitution_page();
        },
        fun_close_txtlistedinstitution: function () {
            $('#txtlistedinstitution').val('');
            setTimeout(function () {
                $("#txtlistedinstitution").blur();
                var autocomplete = $("#txtlistedinstitution").data("kendoAutoComplete");
                // Close the suggestion popup
                autocomplete.close();
            }, 1);
        }, 
        savelisteddcrdetails: function () { 
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
            if (gridkdmdetails == null || gridkdmdetails == undefined)
            {
                app.notify.error("There is no KDMS for this institution!");
                return false;
            }
            $.each(gridkdmdetails, function (i, item) {
                var pob = gridkdmdetails[i].Orders;
                if (parseInt(pob) >= 0) {
                    kdmflag = true;
                    return true;
                }
            });
           // var ddlworkwithinst = $("#ddlworkwithinst").data("kendoMultiSelect").value().toString();
            var ddlproductspromotedinst = $("#ddlproductspromotedinst").data("kendoMultiSelect").value().toString();
            if (!kdmflag) {
                app.notify.error("Enter orders for any one of KDM!");
                return false;
            }
            //else if (ddlworkwithinst == "") {
            //    app.notify.error("Select work with!");
            //    return false;
            //}
            //else if (ddlproductspromotedinst == "") {
            //    app.notify.error("Select products promoted!");
            //    return false;
            //}
            else {
                //save dcr listed details
                fun_save_dcr_institution(); 
                fun_clearcontrols_dcr_listedinstitution();
                app.notify.success('Institution details saved successfully.');
            }
            $(".km-scroll-container").css("transform", "none");
        },
    });
    view.set('DCRinstitutionViewModel', DCRinstitutionViewModel);
}());
function fun_load_listedinstitution_page() {
    if (localStorage.getItem("dcrs_listedinstutition_details_live") == null ||
                localStorage.getItem("dcrs_listedinstutition_details_live") != 1) {
        var user = JSON.parse(localStorage.getItem("userdata"));
        var Employee_ID = user.Employee_ID;

        //var Sub_Territory_ID = $("#ddlmajortownmaster").data("kendoMultiSelect").value().toString();
        var Sub_Territory_ID = "";
        if ($("#hdndcrworkwithmaster_subterritories").val() != "")
        {
            Sub_Territory_ID = $("#hdndcrworkwithmaster_subterritories").val(); 
        }
        else{
            Sub_Territory_ID = localStorage.getItem("dcrworkwithmaster_subterritories");
        } 
        var Designation_ID = user.Designation_ID;
        var Division_ID = user.Division_ID;
        app.utils.loading(true);
        fun_db_APP_Get_DCR_INS_ListedInstitution_Information(Employee_ID, Sub_Territory_ID,
        Designation_ID, Division_ID);
    }
    else {
        fun_load_dcr_institution_pageinit();
        fun_load_dcr_institution_pageload();
    }
}

function get_dcr_listedinstitution_values() {
    var render_dcr_ins_master = function (tx1, rs1) {
        // alert("hdndcr_ins_master_id: " + rs1.rows.item(0).dcr_ins_master_id);
        $("#hdndcr_ins_master_id").val(rs1.rows.item(0).dcr_ins_master_id);
    }
    app.select_count_dcr_ins_master_bydcr_master_id(render_dcr_ins_master, 1);
}

function get_dcrworkwithmaster_subterritories_values() {
    //var subterritories="";
    //var render_dcr_ins_master = function (tx1, rs1) { 
    //    subterritories+=rs1.rows.item(0).ww_id +",";
    //}
    //$("#hdndcrworkwithmaster_subterritories").val(subterritories.trim(','))
    //app.select_dcr_master_ww_details_bydcr_master_id(render_dcr_ins_master, 1);

    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i).ww_id);
        }
        $("#hdndcrworkwithmaster_subterritories").val(valuedata);
    }
    app.select_dcr_master_ww_details_bydcr_master_id(renderstr, 1);
}

function fun_clearcontrols_dcr_listedinstitution() {
    $('#txtlistedinstitution').val('');
    //var ddlworkwithinst = $("#ddlworkwithinst").data("kendoMultiSelect");
    //ddlworkwithinst.value([]);
    var ddlproductspromotedinst = $("#ddlproductspromotedinst").data("kendoMultiSelect");
    ddlproductspromotedinst.value([]);
    $("#tblkdmlist").data("kendoGrid").dataSource.data([]);
}

function fun_load_dcr_institution_pageinit() {
    $('#txtlistedinstitution').val(''); 
    $("#ddlproductspromotedinst").kendoMultiSelect({
        index: 0,
        dataTextField: "ProductGroup_Name",
        dataValueField: "ProductGroup_ID",
        dataSource: [],
        optionLabel: "---Select---",
        autoClose: true,
        clearButton: false,
    });
    localStorage.setItem("dcrs_listedinstutition_details_live", 1);
}

function fun_load_dcr_institution_pageload() {
     
    fun_load_dcr_institution_institutions();
     
    fun_dcr_institution_chiefs();
     
    fun_dcr_institution_productspromoted(); 
}

function fun_save_dcr_institution() {
    // need to save dcr institution data in sql lite db
    var dcr_master_id = 1;
    var instutition_id = $('#txtlistedinstitution').val().split('|')[1];
    var instutition_name = $('#txtlistedinstitution').val().split('|')[0]; 
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
    //var ddlwwrecords = $("#ddlworkwithinst")
    //                       .data("kendoMultiSelect").dataItems();
    //$.each(ddlwwrecords, function (i, item) {
    //    var emp_id = ddlwwrecords[i].Employee_Name.split('|')[1];
    //    var emp_name = ddlwwrecords[i].Employee_Name.split('|')[0];
    //    app.addto_dcr_ins_ww_details(hdndcr_ins_master_id , emp_id, emp_name);
    //});

    // Add new type work with

    var render_control = function (tx1, rs1) {
         for (var i = 0; i < rs1.rows.length; i++) { 
            var emp_id = rs1.rows.item(i).ww_id;
            var emp_name = rs1.rows.item(i).ww_name;
            app.addto_dcr_ins_ww_details(hdndcr_ins_master_id -1, emp_id, emp_name);
         }
         if (rs1.rows.length == 0)
         {
             var emp_id = $("#hdnEmployee_ID").val();
             var emp_name = $("#dvusername").html();
             app.addto_dcr_ins_ww_details(hdndcr_ins_master_id - 1, emp_id, emp_name);
         }
    }
    app.select_dcr_master_ww_details_temp_institution(render_control);

    //Add to product promoted details  
    var ddlpprecords = $("#ddlproductspromotedinst")
        .data("kendoMultiSelect").dataItems();
    $.each(ddlpprecords, function (i, item) {
        var pp_id = ddlpprecords[i].ProductGroup_ID;
        var pp_name = ddlpprecords[i].ProductGroup_Name;
        app.addto_dcr_ins_pp_details(hdndcr_ins_master_id, pp_id, pp_name);
    }); 
    
    app.delete_dcr_master_ww_details_temp_institution();
    fun_reload_dcr_master_ww_details_temp_institution();
    setTimeout(fun_load_dcr_listedinstutition_ww_temp, 1000); 
    hdndcr_ins_master_id = hdndcr_ins_master_id + 1;
    $("#hdndcr_ins_master_id").val(hdndcr_ins_master_id);
}

function fun_reload_dcr_master_ww_details_temp_institution() {
    var render_control_ = function (tx2, rs2) {
        for (var i = 0; i < rs2.rows.length; i++) {
            var emp_id = rs2.rows.item(i).ww_id;
            var emp_name = rs2.rows.item(i).ww_name;
            app.addto_dcr_master_ww_details_temp_institution(emp_id, emp_name);
        }
    }
    app.select_dcr_master_ww_details_temp_master(render_control_);
    fun_load_dcr_listedinstutition_ww_temp();
}
function fun_load_dcr_institution_institutions() {
    $("#txtlistedinstitution").kendoAutoComplete({
        clearButton: false
    });
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("dcrinstutitiondetails"));
    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .ToJSON());
     
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
                var Institution_MSL_ID = value.split("|")[1];
                 
                //Sub_Territory_ID	Institution_MSL_Number	Institution_MSL_ID	Institution_KDM_ID	Name_of_Key_Decision_Maker
               // 2918	14	2322	5487	DR S DAS
                fun_dcr_institution_kdms( Institution_MSL_ID);
            }
            $('.k-nodata').hide();
            setTimeout(function () {
                $("#txtlistedinstitution").blur();
                var autocomplete = $("#txtlistedinstitution").data("kendoAutoComplete");
                // Close the suggestion popup
                autocomplete.close();
            }, 1);
        }
    });
}

function fun_dcr_institution_kdms(Institution_MSL_ID) {
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("dcrkdmdetails"));
    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
    .Where("$.Institution_MSL_ID==" + Institution_MSL_ID)
        .ToJSON());
     
    var dataSource = new kendo.data.DataSource({
        data: ethosmastervaluesrecords,
        batch: true,
        schema: {
            model: {
                Institution_KDM_ID: "Institution_KDM_ID",
                fields: {
                    Institution_MSL_ID:{ type: "number", editable: false, nullable: false },
                    Institution_KDM_ID: { type: "number", editable: false, nullable: false },
                    Name_of_Key_Decision_Maker: { type: "string", editable: false },
                    Orders: { type: "number", editable: true }
                }
            }
        }
    });
    $("#tblkdmlist").kendoGrid({
        dataSource: dataSource, 
        columns: [
            { hidden: true, title: "Idmaster", field: "Institution_MSL_ID", editable: false },
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
           }],
        editable: true
    }); 
}

function fun_dcr_institution_chiefs() {
    var ethosmastervaluesdata = JSON.parse((localStorage.getItem("dcrchiefdetails")));
    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .ToJSON());
     
    //var ddlworkwithinst = $("#ddlworkwithinst").data("kendoMultiSelect");
    //ddlworkwithinst.setDataSource(ethosmastervaluesrecords);
    //ddlworkwithinst.refresh();

}

function fun_dcr_institution_productspromoted() {
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("dcrproductdetails"));
    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .ToJSON());
     
    var ddlproductspromotedinst = $("#ddlproductspromotedinst").data("kendoMultiSelect");
    ddlproductspromotedinst.setDataSource(ethosmastervaluesrecords);
    ddlproductspromotedinst.refresh();
}

function fun_load_dcr_listedinstutition_ww_temp() {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        $("#listview-dcr_listedinstutition_ww_temp").kendoMobileListView({
            dataSource: data1,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-dcr_listedinstutition_ww_temp").append("<li>No records found!</li>");
                }
            },
            template: $("#template-dcr_listedinstutition_ww_temp").html(),
        });
    }
    app.select_dcr_master_ww_details_temp_institution(render_control);
}

function fun_delete_dcr_listedinstutition_ww_temp(e) {
    var data = e.button.data();
    var dcr_master_ww_detail_temp_institution_id = data.dcr_master_ww_detail_temp_institution_id;
    app.delete_dcr_master_ww_details_temp_institution_by_id(dcr_master_ww_detail_temp_institution_id);
    fun_load_dcr_listedinstutition_ww_temp();
    //var institution_msl_id_autoco = $("#txtlistedinstitution").val();
    //if (institution_msl_id_autoco.length > 6 && institution_msl_id_autoco.match('|'))
    //{
    //    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("dcrinstutitiondetails"));
    //    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
    //   .Where("$.Institution_Name=='" + institution_msl_id_autoco + "'")
    //   .ToJSON());
    //    if (ethosmastervaluesrecords.length == 0) {
    //        app.notify.error("Select valid institution in list!");
    //        return false;
    //    }
    //    else {
    //        var institution_msl_id_value = institution_msl_id_autoco.split("|")[1];
    //        var kdmflag = false;
    //        var gridkdmdetails = $("#tblkdmlist")
    //               .data("kendoGrid").dataItems();
    //        $.each(gridkdmdetails, function (i, item) {
    //            var Institution_MSL_ID = gridkdmdetails[i].Institution_MSL_ID;
    //            if (parseInt(institution_msl_id_value) !=
    //                parseInt(Institution_MSL_ID)) {
    //                kdmflag = true;
    //            }
    //            return true;
    //        });
    //        if (kdmflag) {
    //            app.delete_dcr_master_ww_details_temp_institution_by_id(dcr_master_ww_detail_temp_institution_id);
    //            fun_load_dcr_listedinstutition_ww_temp();
    //        } else {
    //            app.notify.error("This record unable to delete,because already loaded in grid!");
    //        }
    //    } 
    //}  
}
function fun_show_dcr_master_listed() {
    var options = {
        enableHighAccuracy: false,
        timeout: 10000
    };
    var geolo = navigator.geolocation.getCurrentPosition(function () {
        $("#dvDCRinstitutionView").show();
        $("#dvDCRinstitutionView_offgps").hide();
    }, function () {
        $("#dvDCRinstitutionView_offgps").show();
        $("#dvDCRinstitutionView").hide();
    }, options);
}
function fun_db_APP_Get_DCR_INS_ListedInstitution_Information(Employee_ID, Sub_Territory_ID, Designation_ID, Division_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/dvu4zra5xefb2qfq/Invoke/SqlProcedures/APP_Get_DCR_INS_ListedInstitution_Information",
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
            // alert(e);
            app.utils.loading(false);
            app.notify.error('Error loading data please try again later!');
        }
    });
    datasource.fetch(function () {
        var data = this.data();
         
        localStorage.setItem("dcrinstutitiondetails", JSON.stringify(data[0])); // instutition details 

        localStorage.setItem("dcrkdmdetails", JSON.stringify(data[1])); // kdm details
         
        localStorage.setItem("dcrchiefdetails", JSON.stringify(data[2])); // chief details

        localStorage.setItem("dcrproductdetails", JSON.stringify(data[3])); // product details
        
        fun_load_dcr_institution_pageinit();
        fun_load_dcr_institution_pageload();
        app.utils.loading(false);

    });
}

