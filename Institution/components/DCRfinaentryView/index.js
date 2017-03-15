
'use strict';

(function () {
    var view = app.DCRfinaentryView = kendo.observable();
    var DCRfinaentryViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("DCRfinaentryView");
            }
            app.navigation.logincheck(); 

        },
        dcrfinalentryValidator: null,
        savefinalentrydetails: function () { 
            //hdnactivityperiod hdnactivity_id
            var Activity_Period_ID = parseInt($('#hdnactivityperiod').val());
            var Activity_ID = parseInt($('#hdnactivity_id').val());
            var ethosmastervaluesdata = JSON.parse((localStorage.getItem("dcrtourplandetails")));
            var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
            .Where("$.Activity_Period_ID==" + Activity_Period_ID + " && $.Activity_ID==" + Activity_ID)
            .ToJSON());
            if (ethosmastervaluesrecords.length == 0) {
                this.dcrfinalentryValidator = app.validate.getValidator('#form-finalentry');
                if (!this.dcrfinalentryValidator.validate()) {
                    return;
                }
            }
            //update dcr master deviaion details n description
            var dcr_ins_master_id = parseInt($("#hdndcr_master_id").val());
            app.update_dcr_master_deviation(dcr_ins_master_id,
                $('#txtdeviationreason').val(), $('#txtdescription').val());
            fun_clearcontrols_dcrmaster_finalentry();
            app.navigation.navigateDCRpreviewView();
        },
    });

    view.set('DCRfinaentryViewModel', DCRfinaentryViewModel);
}());
function fun_clearcontrols_dcrmaster_finalentry() {
    $("#txtdeviationreason").val('');
    $("#txtdescription").val('');
}
