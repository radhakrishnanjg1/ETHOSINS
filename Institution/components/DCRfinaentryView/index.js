
'use strict';

(function () {
    var view = app.DCRfinaentryView = kendo.observable();
    var DCRfinaentryViewModel = kendo.observable({  
        dcrfinalentryValidator: null,
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("DCRfinaentryView");
            }
            app.navigation.logincheck();  
        },
        afterShow: function ()
        {
            var render_dcrmaster = function (tx, rs) {
                $("#txtdeviationreason").val(rs.rows.item(0).deviation_reason);
                $("#txtdescription").val(rs.rows.item(0).deviation_description);
            }
            app.select_dcr_master_byid(render_dcrmaster, 1); 
        },
        savefinalentrydetails: function () { 
            //hdnactivityperiod hdnactivity_id
            var Activity_Period_ID = parseInt($('#hdnactivityperiod').val());
            var Activity_ID = parseInt($('#hdnactivity_id').val());
            var ethosmastervaluesdata = JSON.parse(localStorage.getItem("dcrtourplandetails"));
            var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
            .Where("$.Activity_Period_ID=='" + Activity_Period_ID + "' && $.Activity_ID=='" + Activity_ID + "'").ToJSON());
            if (ethosmastervaluesrecords.length == 0) {
                var txtdeviationreason = ($("#txtdeviationreason").val());
                var txtdescription = parseInt($("#txtdescription").val());
                if (txtdeviationreason == "") {
                    app.notify.error("Enter deviation reason!");
                    return false;
                }
                else if (txtdescription == "") {
                    app.notify.error("Enter description/feedback!");
                    return false;
                }
                else{
                }
            }
            //update dcr master deviaion details n description
            var dcr_ins_master_id = 1;
            app.update_dcr_master_deviation(dcr_ins_master_id,
                $('#txtdeviationreason').val(), $('#txtdescription').val());
            //fun_clearcontrols_dcrmaster_finalentry();
            app.navigation.navigateDCRpreviewView();
        }
    });

    view.set('DCRfinaentryViewModel', DCRfinaentryViewModel);
}());
function fun_clearcontrols_dcrmaster_finalentry() {
    $("#txtdeviationreason").val('');
    $("#txtdescription").val('');
}
