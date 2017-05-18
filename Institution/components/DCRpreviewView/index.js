
'use strict';

(function () {
    var view = app.DCRpreviewView = kendo.observable();
    var DCRpreviewViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("DCRpreviewView");
            }
            app.navigation.logincheck();
        },
        afterShow: function () {
            fun_get_dcr_all_details();
            var hdndcr_master_id = 1;
            var render_dcrmaster = function (tx, rs) {
                $("#dvdcrmaster_date").html(rs.rows.item(0).dcr_date);
                $("#hdnactivity_id").val(rs.rows.item(0).activity_id);
                $("#dvdcrmaster_period").html(rs.rows.item(0).activity_peroid_name);
                $("#dvdcrmaster_activity").html(rs.rows.item(0).activity_name);
                $("#dvdcrmaster_deviationreason").html(rs.rows.item(0).deviation_reason);
                $("#dvdcrmaster_description").html(rs.rows.item(0).deviation_description);

                var ddlactivity = rs.rows.item(0).activity_id
                if (ddlactivity == 235)  // field staff 
                {

                    $("#dvdcrmaster_category").html(rs.rows.item(0).category_name);
                    $("#dvdcrmaster_mode").html(rs.rows.item(0).mode_name);
                    $("#dvdcrmaster_sfcroute").html(rs.rows.item(0).sfcroute_place);
                    fun_load_dcr_listedinstutition(hdndcr_master_id);
                    fun_load_dcr_unlistedinstutition(hdndcr_master_id);
                    $("#dvflow_fiedstaff").show();
                    $("#dvflow_second").hide();
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
                {
                    fun_load_dcr_master_ww(hdndcr_master_id);
                    fun_load_dcr_master_mj(hdndcr_master_id);
                    $("#dvflow_second").show();
                    $("#dvflow_fiedstaff").hide();
                }
                else if (ddlactivity == 237 || ddlactivity == 238
                    || ddlactivity == 242 || ddlactivity == 243
                    || ddlactivity == 244 || ddlactivity == 1131) // other option Sunday / Holiday/cl/sl/el/lta/nyjd
                {
                    $("#dvflow_fiedstaff").hide();
                    $("#dvflow_second").hide();
                }
            }
            app.select_dcr_master_byid(render_dcrmaster, hdndcr_master_id);
        },
        submitdcrdetails: function () {
            // var hdndcr_ins_master_string = $('#hdndcr_ins_master_string').val();
            // var hdndcr_unlisted_ins_master_string = $('#hdndcr_unlisted_ins_master_string').val();
            // var hdnactivity_id=$("#hdnactivity_id").val();
            // if (hdnactivity_id == 235 && (hdndcr_ins_master_string == "[]" || hdndcr_unlisted_ins_master_string == "[]"))
            // {
            //     app.notify.error("MSL or unlisted should not be empty!");
            //     return false;
            // }
            var confirmation = "Are you sure you want to save the details?";
            app.notify.confirmation(confirmation, function (confirm) {
                if (!confirm) {
                    return;
                }
                fun_save_dcr_all_details();
            })
        },

        cleardcrdetails: function () {
            var confirmation = "Are you sure you want to clear the enteries?";
            app.notify.confirmation(confirmation, function (confirm) {
                if (!confirm) {
                    return;
                }
                fun_delete_all_dcrrecords();
                fun_set_dcr_fields();
                app.navigation.navigateDCRstartView();
            })
        },
    });

    view.set('DCRpreviewViewModel', DCRpreviewViewModel);
}());


function fun_save_dcr_all_details() {
    app.utils.loading(true);
    var Activity_ID = parseInt($("#hdnactivity_id").val());
    fun_db_APP_Insert_DCR_INS_Report(parseInt(Activity_ID),
$("#hdndcr_master_string").val(),
$("#hdndcr_master_ww_details_string").val(),
$("#hdndcr_master_mj_details_string").val(),
$("#hdndcr_ins_master_string").val(),
$("#hdndcr_ins_kdm_details_string").val(),
$("#hdndcr_ins_ww_details_string").val(),
$("#hdndcr_ins_pp_details_string").val(),
$("#hdndcr_unlisted_ins_master_string").val(),
$("#hdndcr_unlisted_ins_ww_details_string").val(),
$("#hdndcr_unlisted_ins_pp_details_string").val()
    );
}
function fun_get_dcr_all_details() {
    fun_get_dcr_master_data();
    fun_get_dcr_master_ww_data();
    fun_get_dcr_master_mj_data();
    fun_get_dcr_ins_master_data();
    fun_get_dcr_ins_master_kdm_data();

    fun_get_dcr_ins_master_ww_data();
    fun_get_dcr_ins_master_pp_data();
    fun_get_dcr_unlisted_ins_master_data();
    fun_get_dcr_unlisted_ins_master_ww_data();
    fun_get_dcr_unlisted_ins_master_pp_data();
}


function fun_clear_dcr_all_details() {
    $("#hdndcr_master_string").val('');
    $("#hdndcr_master_ww_details_string").val('');
    $("#hdndcr_master_mj_details_string").val('');
    $("#hdndcr_ins_master_string").val('');
    $("#hdndcr_ins_kdm_details_string").val('');

    $("#hdndcr_ins_ww_details_string").val('');
    $("#hdndcr_ins_pp_details_string").val('');
    $("#hdndcr_unlisted_ins_master_string").val('');
    $("#hdndcr_unlisted_ins_ww_details_string").val('');
    $("#hdndcr_unlisted_ins_pp_details_string").val('');
}

function fun_get_dcr_master_data() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_master_string").val(JSON.stringify(valuedata));
    }
    app.select_dcr_master_byid(renderstr, 1);
}

function fun_get_dcr_master_ww_data() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_master_ww_details_string").val(JSON.stringify(valuedata));
    }
    app.select_dcr_master_ww_details(renderstr);
}

function fun_get_dcr_master_mj_data() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_master_mj_details_string").val(JSON.stringify(valuedata));
    }
    app.select_dcr_master_mj_details(renderstr);
}

function fun_get_dcr_ins_master_data() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_ins_master_string").val(JSON.stringify(valuedata));
    }
    app.select_dcr_ins_master(renderstr);
}

function fun_get_dcr_ins_master_kdm_data() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_ins_kdm_details_string").val(JSON.stringify(valuedata));
    }
    app.select_dcr_ins_kdm_details(renderstr);
}

function fun_get_dcr_ins_master_ww_data() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_ins_ww_details_string").val(JSON.stringify(valuedata));
    }
    app.select_dcr_ins_ww_details(renderstr);
}

function fun_get_dcr_ins_master_pp_data() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_ins_pp_details_string").val(JSON.stringify(valuedata));
    }
    app.select_dcr_ins_pp_details(renderstr);
}

function fun_get_dcr_unlisted_ins_master_data() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_unlisted_ins_master_string").val(JSON.stringify(valuedata));
    }
    app.select_dcr_unlisted_ins_master(renderstr);
}

function fun_get_dcr_unlisted_ins_master_ww_data() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_unlisted_ins_ww_details_string").val(JSON.stringify(valuedata));
    }
    app.select_dcr_unlisted_ins_ww_details(renderstr);
}

function fun_get_dcr_unlisted_ins_master_pp_data() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdndcr_unlisted_ins_pp_details_string").val(JSON.stringify(valuedata));
    }
    app.select_dcr_unlisted_ins_pp_details(renderstr);
}

function fun_load_dcr_master_ww(hdndcr_master_id) {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        $("#listview-dcrmasterww").kendoMobileListView({
            dataSource: data1,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-dcrmasterww").append("<li>No records found!</li>");
                }
            },
            template: $("#template-dcrmasterww").html(),
        });
    }
    app.select_dcr_master_ww_details_bydcr_master_id(render_control, hdndcr_master_id);
}

function fun_load_dcr_master_mj(hdndcr_master_id) {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        $("#listview-dcrmastermj").kendoMobileListView({
            dataSource: data1,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-dcrmastermj").append("<li>No records found!</li>");
                }
            },
            template: $("#template-dcrmastermj").html(),
        });
    }
    app.select_dcr_master_mj_details_bydcr_master_id(render_control, hdndcr_master_id);
}

function fun_load_dcr_listedinstutition(hdndcr_master_id) {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        $("#listview-dcr-listedinstutition").kendoMobileListView({
            dataSource: data1,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-dcr-listedinstutition").append("<li>No records found!</li>");
                }
            },
            template: $("#template-dcr-listedinstutition").html(),
        });
    }
    app.select_dcr_ins_master_bydcr_master_id(render_control, hdndcr_master_id);
}

function fun_dcr_listedinstutition_modelopen(e) {
    var data = e.button.data();
    var dcr_ins_master_id = data.dcr_ins_master_id;
    fun_load_dcr_listedinstutition_kdmdetails(dcr_ins_master_id);
    fun_load_dcr_listedinstutition_ww(dcr_ins_master_id);
    fun_load_dcr_listedinstutition_pp(dcr_ins_master_id);
    $("#modalview-dcr_listedinstutition").kendoMobileModalView("open");
}

function fun_dcr_listedinstutition_modelclose() {
    $("#modalview-dcr_listedinstutition").kendoMobileModalView("close");
}

function fun_load_dcr_listedinstutition_kdmdetails(dcr_ins_master_id) {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        $("#listview-dcr_listedinstutition_kdm").kendoMobileListView({
            dataSource: data1,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-dcr_listedinstutition_kdm").append("<li>No records found!</li>");
                }
            },
            template: $("#template-dcr_listedinstutition_kdm").html(),
        });
    }
    app.select_dcr_ins_kdm_details_bydcr_ins_master_id(render_control, dcr_ins_master_id);
}

function fun_load_dcr_listedinstutition_ww(dcr_ins_master_id) {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        $("#listview-dcr_listedinstutition_ww").kendoMobileListView({
            dataSource: data1,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-dcr_listedinstutition_ww").append("<li>No records found!</li>");
                }
            },
            template: $("#template-dcr_listedinstutition_ww").html(),
        });
    }
    app.select_dcr_ins_ww_details_bydcr_ins_master_id(render_control, dcr_ins_master_id);
}

function fun_load_dcr_listedinstutition_pp(dcr_ins_master_id) {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        $("#listview-dcr_listedinstutition_pp").kendoMobileListView({
            dataSource: data1,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-dcr_listedinstutition_pp").append("<li>No records found!</li>");
                }
            },
            template: $("#template-dcr_listedinstutition_pp").html(),
        });
    }
    app.select_dcr_ins_pp_details_bydcr_ins_master_id(render_control, dcr_ins_master_id);
}

function fun_load_dcr_unlistedinstutition(hdndcr_master_id) {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        $("#listview-dcr-unlistedinstutition").kendoMobileListView({
            dataSource: data1,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-dcr-unlistedinstutition").append("<li>No records found!</li>");
                }
            },
            template: $("#template-dcr-unlistedinstutition").html(),
        });
    }
    app.select_dcr_unlisted_ins_master_bydcr_master_id(render_control, hdndcr_master_id);
}

function fun_dcr_unlistedinstutition_modelopen(e) {
    var data = e.button.data();
    var dcr_unlisted_ins_master_id = data.dcr_unlisted_ins_master_id;
    fun_load_dcr_unlistedinstutition_ww(dcr_unlisted_ins_master_id);
    fun_load_dcr_unlistedinstutition_pp(dcr_unlisted_ins_master_id);
    $("#modalview-dcr_unlistedinstutition").kendoMobileModalView("open");
}

function fun_dcr_unlistedinstutition_modelclose() {
    $("#modalview-dcr_unlistedinstutition").kendoMobileModalView("close");
}

function fun_load_dcr_unlistedinstutition_ww(dcr_ins_master_id) {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        $("#listview-dcr_unlistedinstutition_ww").kendoMobileListView({
            dataSource: data1,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-dcr_unlistedinstutition_ww").append("<li>No records found!</li>");
                }
            },
            template: $("#template-dcr_unlistedinstutition_ww").html(),
        });
    }
    app.select_dcr_unlisted_ins_ww_details_bydcr_unlisted_ins_master_id(render_control, dcr_ins_master_id);
}

function fun_load_dcr_unlistedinstutition_pp(dcr_ins_master_id) {
    var render_control = function (tx1, rs1) {
        var render_control_string = [];
        for (var i = 0; i < rs1.rows.length; i++) {
            render_control_string.push(rs1.rows.item(i));
        }
        var data1 = render_control_string;
        $("#listview-dcr_unlistedinstutition_pp").kendoMobileListView({
            dataSource: data1,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-dcr_unlistedinstutition_pp").append("<li>No records found!</li>");
                }
            },
            template: $("#template-dcr_unlistedinstutition_pp").html(),
        });
    }
    app.select_dcr_unlisted_ins_pp_details_bydcr_unlisted_ins_master_id(render_control, dcr_ins_master_id);
}

function fun_db_APP_Insert_DCR_INS_Report(Activity_Id, DCR_Master_String, DCR_Master_WW_Details_String,
    DCR_Master_MJ_Details_String, DCR_Ins_Master_String, DCR_Ins_KDM_Details_String,
         DCR_Ins_WW_Details_String, DCR_Ins_PP_Details_String, DCR_Unlisted_INS_Master_String,
         DCR_Unlisted_INS_WW_Details_String, DCR_Unlisted_INS_PP_Details_String) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/dvu4zra5xefb2qfq/Invoke/SqlProcedures/APP_Insert_DCR_INS_Report",
                type: "POST",
                dataType: "json",
                data: {
                    "Activity_Id": Activity_Id, "DCR_Master_String": DCR_Master_String, "DCR_Master_WW_Details_String": DCR_Master_WW_Details_String,
                    "DCR_Master_MJ_Details_String": DCR_Master_MJ_Details_String, "DCR_Ins_Master_String": DCR_Ins_Master_String, "DCR_Ins_KDM_Details_String": DCR_Ins_KDM_Details_String,
                    "DCR_Ins_WW_Details_String": DCR_Ins_WW_Details_String, "DCR_Ins_PP_Details_String": DCR_Ins_PP_Details_String, "DCR_Unlisted_INS_Master_String": DCR_Unlisted_INS_Master_String,
                    "DCR_Unlisted_INS_WW_Details_String": DCR_Unlisted_INS_WW_Details_String, "DCR_Unlisted_INS_PP_Details_String": DCR_Unlisted_INS_PP_Details_String

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
        if (data[0].Output_ID == 1) {
            localStorage.setItem("Activity_Period_ID", 0);
            localStorage.setItem("Activity_ID", 0);
            localStorage.setItem("DCR_isavailable", 0);
            app.notify.success(data[0].Output_Message);
            fun_clear_dcr_all_details();
            $('#dvDCRstartView').show();
            fun_clearcontrols_dcrmaster_finalentry();
            fun_delete_all_dcrrecords();
            fun_set_dcr_fields();
            app.navigation.navigateDCRstartView();
        }
        else if (data[0].Output_ID == 0) {
            app.notify.error(data[0].Output_Message);
        }
        else {
            app.notify.error(data[0].Output_Message);
            fun_db_adderrorlog(parseInt($('#hdnLogin_ID').val()), "ETHOS-INS",
                data[0].Output_Message, data[0].ErrorMessage);
        }
    });
}


function fun_db_adderrorlog(Login_ID, App_Name, Error_key, Error_Message) {
    var errorlogds = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/dvu4zra5xefb2qfq/Invoke/SqlProcedures/APP_Insert_Error_Log",
                type: "POST",
                dataType: "json",
                data: {
                    "Login_ID": Login_ID,
                    "App_Name": App_Name,
                    "Error_key": Error_key,
                    "Error_Message": Error_Message,
                }
            }
        },
        schema: {
            parse: function (response) {
                var errordetails = response.Result.Data[0];
                return errordetails;
            }
        },
        error: function (e) {
            app.utils.loading(false); // alert(e);
            app.notify.error('Error loading data please try again later!');
        }
    });
    errorlogds.fetch();
}

