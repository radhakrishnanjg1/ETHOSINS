
'use strict';

(function () {
    var view = app.DCRstartView = kendo.observable();
    var DCRstartViewModel = kendo.observable({
        //onShow: function () { 
        //    if (!app.utils.checkinternetconnection()) {
        //        return app.navigation.navigateoffline("DCRstartView");
        //    }
        //    app.navigation.logincheck(); 
        //    get_dcr_master_values();
        //    //alert($("#hdndcr_master_id").val() + "|" + $("#hdnactivityperiod").val() + "|" + $("#hdnactivity_id").val());
        //}, 
        onShow: function () {
            // get_dcr_master_values();
            //alert("hdndcr_master_id: " + parseInt($("#hdndcr_master_id").val()) + "|activityperiod:" + parseInt($("#hdnactivityperiod").val()) + "|activity_id:" + parseInt($("#hdnactivity_id").val()));
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("DCRstartView");
            }
            app.navigation.logincheck();
            var dcr_isavailable = parseInt(localStorage.getItem("DCR_isavailable"));
            var activity_id = parseInt(localStorage.getItem("Activity_ID"));
            var activity_period_id = parseInt(localStorage.getItem("Activity_Period_ID"));
            if (dcr_isavailable == 1 && activity_id == 235) {
                //alert("dcr_isavailable: " + dcr_isavailable +
                //    "|activity_period_id:" + activity_period_id + "|activity_id:" + activity_id);

                var user = JSON.parse(localStorage.getItem("userdata"));
                var Employee_ID = user.Employee_ID;
                var Sub_Territory_ID = user.Sub_Territory_ID;
                var Designation_ID = user.Designation_ID;
                var Division_ID = user.Division_ID;
                fun_db_APP_Get_DCR_Required_Information(Employee_ID, Sub_Territory_ID,
                    Designation_ID, Division_ID);
                //redirect to instiution page as default 
                $('#dvDCRstartView').hide();
                app.utils.loading(true);
                setTimeout("app.navigation.navigateDCRinstitutionView()", 1500);
                app.utils.loading(false);

            }
            else if (dcr_isavailable == 1
                && (activity_id == 236 || activity_id == 239
               || activity_id == 240 || activity_id == 241
                || activity_id == 247
               || activity_id == 248 || activity_id == 249
               || activity_id == 250 || activity_id == 251
               || activity_id == 252 || activity_id == 253
               || activity_id == 254 || activity_id == 255
               || activity_id == 256 || activity_id == 258
                || activity_id == 237 || ddlactivity == 238
                    || activity_id == 242 || activity_id == 243
                    || activity_id == 244 || activity_id == 1131)) {

                //alert("dcr_isavailable: " + dcr_isavailable +
                //    "|activity_period_id:" + activity_period_id + "|activity_id:" + activity_id);
                //redirect to final entry page
                $('#dvDCRstartView').hide();
                app.utils.loading(true);
                setTimeout("app.navigation.navigateDCRfinaentryView()", 1500);
                app.utils.loading(false);
                //app.mobileApp.navigate('components/DCRfinaentryView/view.html');
                //  app.navigation.navigateProfile();
            }
            else if (dcr_isavailable == 1 ||
                isNaN(dcr_isavailable) ||
                activity_period_id == 0 ||
                isNaN(activity_period_id) == null ||
                activity_id == 0 ||
                isNaN(activity_id) == null
                ) {
                //alert("dcr_isavailable: " + dcr_isavailable +
                //    "|activity_period_id:" + activity_period_id + "|activity_id:" + activity_id);

                fun_delete_all_dcrrecords();
                fun_set_dcr_fields();
            }
        },
    });

    view.set('DCRstartViewModel', DCRstartViewModel);
}());


function redirectDCRfinaentryView() {
    app.utils.loading(true);
    setTimeout("app.navigation.navigateDCRfinaentryView()", 2000);
    app.utils.loading(false);
}
function get_dcr_master_values() {
    //var render_dcr_master_id = function (tx, rs) {
    //    if (rs.rows.length > 0) {
    //        $("#hdndcr_master_id").val(rs.rows.item(0).dcr_master_id);
    //        $("#hdnactivityperiod").val(rs.rows.item(0).activity_peroid_id);
    //        $("#hdnactivity_id").val(rs.rows.item(0).activity_id);
    //    }
    //}
    //app.select_count_dcr_master(render_dcr_master_id);
    var render_dcr_ins_master = function (tx, rs1) {
        //alert("hdndcr_ins_master_id: " + rs.rows.item(0).dcr_ins_master_id);
        $("#hdndcr_ins_master_id").val(rs1.rows.item(0).dcr_ins_master_id);
    }
    app.select_count_dcr_ins_master_bydcr_master_id(render_dcr_ins_master, 1);
    var render_dcr_unlisted_ins_master = function (tx, rs2) {
        // alert("hdndcr_unlisted_ins_master_id: " + rs.rows.item(0).hdndcr_unlisted_ins_master_id);
        $("#hdndcr_unlisted_ins_master_id").val(rs2.rows.item(0).dcr_unlisted_ins_master_id);
    }
    app.select_count_dcr_unlisted_ins_master_bydcr_master_id(render_dcr_unlisted_ins_master, 1);
}


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
