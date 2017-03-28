
'use strict';

(function () {
    var view = app.offGPSView = kendo.observable();
    var offGPSViewModel = kendo.observable({
        onShow: function (e) {
            var pageid = e.view.params.pageid;
            $('#hdngpscurrentpage').val(pageid); 
           // alert(e.view.params.pageid);
        },

    });

    view.set('offGPSViewModel', offGPSViewModel);
}());
 
 
function goto_onGPSpage() {
    var page = $('#hdngpscurrentpage').val();
    //alert(app.utils.get_geoinfo());
    //if (app.utils.get_geoinfo() != 0) {
    //    return app.mobileApp.navigate('components/' + page + '/view.html');
    //}


    //var options = {
    //    enableHighAccuracy: false,
    //    timeout: 1
    //};
    //var geolo = navigator.geolocation.getCurrentPosition(function () {
    //    return app.mobileApp.navigate('components/' + page + '/view.html');
    //}, function () { 
    //}, options);


    setTimeout(app.utils.isGpsLocationEnabled, 1000);
    if ($("#hdnlatitude").val() != "") {
        return app.mobileApp.navigate('components/' + page + '/view.html');
    }
};