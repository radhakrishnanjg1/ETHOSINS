
'use strict';

(function () {
    var view = app.DCRstartView = kendo.observable();
    var DCRstartViewModel = kendo.observable({
        onShow: function () { 
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("DCRstartView");
            }
            else
            {
                if (app.utils.get_geoinfo()==0) {
                        return app.navigation.navigateoffGPSView("DCRstartView");
                }

                //if (!app.utils.isGpsLocationEnabled()) {
                //    return app.navigation.navigateoffGPSView("DCRstartView");
                //}
                //if (!app.utils.get_geoinfo()) {
                //    return app.navigation.navigateoffGPSView("DCRstartView");
                //}
                //app.utils.get_geoinfo();
                //setTimeout(function () {
                    //alert("load:"+$('#hdnlatitude').val());
                    //if ($('#hdnlatitude').val() == "") {
                    //    return app.navigation.navigateoffGPSView("DCRstartView");
                    //}
               // }, 1000); 
            }
            app.navigation.logincheck();
        },
        afterShow: function () {
            disableBackButton();
            get_dcr_master_values(); 
            

        },
        redirecttocontinuedcr: function () {
            redirectDCRView();
        }
    });

    view.set('DCRstartViewModel', DCRstartViewModel);
}());


function redirectDCRView() {
    //var dcr_isavailable = parseInt(localStorage.getItem("DCR_isavailable"));
    //var activity_id = parseInt(localStorage.getItem("Activity_ID"));
    //var activity_period_id = parseInt(localStorage.getItem("Activity_Period_ID")); 
    var dcr_isavailable = parseInt($("#hdn_old_dcr_master_id").val());
    var activity_id = parseInt($("#hdnactivity_id").val());
    var activity_period_id = parseInt($("#hdnactivityperiod").val());

    if (dcr_isavailable == 1 && activity_id == 235) {
        //redirect to instiution page as default  
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
        || activity_id == 237 || activity_id == 238
            || activity_id == 242 || activity_id == 243
            || activity_id == 244 || activity_id == 1131)) { //redirect to final entry page

        app.utils.loading(true);
        setTimeout("app.navigation.navigateDCRfinaentryView()", 1500);
        app.utils.loading(false);
    }
    else if (dcr_isavailable == 1 ||
        isNaN(dcr_isavailable) ||
        activity_period_id == 0 ||
        isNaN(activity_period_id) == null ||
        activity_id == 0 ||
        isNaN(activity_id) == null
        ) {
        fun_delete_all_dcrrecords();
        fun_set_dcr_fields();
        app.navigation.navigateDCRmasterView();
    }
}
function get_dcr_master_values() {
    // $("#spandcrstartpage").html('start');
    $("#spandcrstartpage").attr('src', "images/start.jpg");
    var render_dcr_master_id = function (tx, rs) {
        if (rs.rows.length > 0) {
            $("#hdn_old_dcr_master_id").val(rs.rows.item(0).dcr_master_id);
            $("#hdnactivityperiod").val(rs.rows.item(0).activity_peroid_id);
            $("#hdnactivity_id").val(rs.rows.item(0).activity_id);
            $("#spandcrstartpage").html('continue');
            $("#spandcrstartpage").attr('src', "images/continue.jpg");
        }
    }
    app.select_count_dcr_master(render_dcr_master_id);
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

    $('#hdn_old_dcr_master_id').val(0);
    $('#hdnactivity_id').val(0);
    $('#hdnactivityperiod').val(0);

    localStorage.removeItem("dcrs_listedinstutition_details_live");

    localStorage.removeItem("dcrs_unlistedinstutition_details_live");
}
