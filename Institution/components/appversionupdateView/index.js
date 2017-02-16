
'use strict';

(function () {
    var view = app.appversionupdateView = kendo.observable();
    var appversionupdateViewModel = kendo.observable({
        onShow: function ( ) {
            showAppVersion();
        },

    });

    view.set('appversionupdateViewModel', appversionupdateViewModel);
}());
  
function showAppVersion() {
    cordova.getAppVersion(function (version) {
       // alert("Current App Version: " + version);
        $('#h5appversion').html(version);
    });
}