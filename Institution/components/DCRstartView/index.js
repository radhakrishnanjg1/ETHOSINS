
'use strict';

(function () {
    var view = app.DCRstartView = kendo.observable();
    var DCRstartViewModel = kendo.observable({ 
        onShow: function () { 
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("DCRstartView");
            }
            app.navigation.logincheck();
            var render_dcr_master_id = function (tx, rs) {
                if (rs.rows.length > 0) {
                    $("#hdndcr_master_id").val(rs.rows.item(0).dcr_master_id);
                    $("#hdnactivityperiod").val(rs.rows.item(0).activity_peroid_id);
                    $("#hdnactivity_id").val(rs.rows.item(0).activity_id);
                }
            }
            app.select_count_dcr_master(render_dcr_master_id);
            alert($("#hdndcr_master_id").val() + "|" + $("#hdnactivityperiod").val() + "|" + $("#hdnactivity_id").val());
        }, 
        afterShow: function () { 
            {
                alert("hdndcr_master_id: " + parseInt($("#hdndcr_master_id").val()) + "|activityperiod:" + parseInt($("#hdnactivityperiod").val()) + "|activity_id:" + parseInt($("#hdnactivity_id").val()));

                if (parseInt($("#hdndcr_master_id").val()) == 1 && (parseInt($("#hdndcr_master_id").val()) == 235)) {
                   // alert("hdndcr_master_id: " + parseInt($("#hdndcr_master_id").val()) + "|activityperiod:" + parseInt($("#hdnactivityperiod").val()) + "|activity_id:" + parseInt($("#hdnactivity_id").val()));
                    var render_dcr_ins_master = function (tx, rs1) {
                        //alert("hdndcr_ins_master_id: " + rs.rows.item(0).dcr_ins_master_id);
                        $("#hdndcr_ins_master_id").val(rs1.rows.item(0).dcr_ins_master_id);
                    }
                    app.select_count_dcr_ins_master_bydcr_master_id(render_dcr_ins_master, hdndcr_master_id);
                    var render_dcr_unlisted_ins_master = function (tx, rs2) {
                        // alert("hdndcr_unlisted_ins_master_id: " + rs.rows.item(0).hdndcr_unlisted_ins_master_id);
                        $("#hdndcr_unlisted_ins_master_id").val(rs2.rows.item(0).dcr_unlisted_ins_master_id);
                    }
                    app.select_count_dcr_unlisted_ins_master_bydcr_master_id(render_dcr_unlisted_ins_master, hdndcr_master_id);
                    var user = JSON.parse(localStorage.getItem("userdata"));
                    var Employee_ID = user.Employee_ID;
                    var Sub_Territory_ID = user.Sub_Territory_ID;
                    var Designation_ID = user.Designation_ID;
                    var Division_ID = user.Division_ID;
                    app.utils.loading(true);
                    fun_db_APP_Get_DCR_Required_Information(Employee_ID, Sub_Territory_ID,
                        Designation_ID, Division_ID);
                    //redirect to instiution page as default
                    app.navigation.navigateDCRinstitutionView();
                }
                else if (parseInt($("#hdndcr_master_id").val()) == 1 && (parseInt($("#hdnactivity_id").val()) == 236 || parseInt($("#hdnactivity_id").val()) == 239
                   || parseInt($("#hdnactivity_id").val()) == 240 || parseInt($("#hdnactivity_id").val()) == 241
                    || parseInt($("#hdnactivity_id").val()) == 1131
                   || parseInt($("#hdnactivity_id").val()) == 248 || parseInt($("#hdnactivity_id").val()) == 249
                   || parseInt($("#hdnactivity_id").val()) == 250 || parseInt($("#hdnactivity_id").val()) == 251
                   || parseInt($("#hdnactivity_id").val()) == 252 || parseInt($("#hdnactivity_id").val()) == 253
                   || parseInt($("#hdnactivity_id").val()) == 254 || parseInt($("#hdnactivity_id").val()) == 255
                   || parseInt($("#hdnactivity_id").val()) == 256 || parseInt($("#hdnactivity_id").val()) == 258
                    || parseInt($("#hdnactivity_id").val()) == 237 || ddlactivity == 238
                        || parseInt($("#hdnactivity_id").val()) == 242 || parseInt($("#hdnactivity_id").val()) == 243
                        || parseInt($("#hdnactivity_id").val()) == 244 || parseInt($("#hdnactivity_id").val()) == 1131)) {

                    //alert("hdndcr_master_id: " + parseInt($("#hdndcr_master_id").val()) + "|activityperiod:" + parseInt($("#hdnactivityperiod").val()) + "|activity_id:" + parseInt($("#hdnactivity_id").val()));
                    //redirect to final entry page
                    app.navigation.navigateDCRfinaentryView();
                }
                else {
                    //alert("hdndcr_master_id: " + parseInt($("#hdndcr_master_id").val()) + "|activityperiod:" + parseInt($("#hdnactivityperiod").val()) + "|activity_id:" + parseInt($("#hdnactivity_id").val()));

                    //fun_delete_all_dcrrecords();
                    //fun_set_dcr_fields();
                }
                //fun_delete_all_dcrrecords();
                //fun_set_dcr_fields(); 
            }
        },
    });

    view.set('DCRstartViewModel', DCRstartViewModel);
}());

function fun_delete_all_dcrrecords() {
    app.delete_dcr_master();
    app.delete_dcr_master_ww_details();
    app.delete_dcr_master_mj_details();
    app.delete_dcr_ins_master();;
    app.delete_dcr_ins_kdm_details();
    app.delete_dcr_ins_ww_details();
    app.delete_dcr_ins_pp_details();
    app.delete_dcr_unlisted_ins_master();
    app.delete_dcr_unlisted_ins_ww_details();
    app.delete_dcr_unlisted_ins_pp_details();
}

function fun_set_dcr_fields() {
    $('#hdndcr_master_id').val(1);
    $('#hdndcr_ins_master_id').val(1);
    $('#hdndcr_unlisted_ins_master_id').val(1);
}
