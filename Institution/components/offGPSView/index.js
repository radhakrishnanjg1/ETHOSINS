
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
    //app.utils.get_geoinfo();
   // setTimeout(function () { 
        //alert("refresh:" + $('#hdnlatitude').val());
        //if ($('#hdnlatitude').val() != "") {
        //    return app.mobileApp.navigate('components/' + page + '/view.html');
        //}
    //}, 1500);
    if (!app.utils.get_geoinfo()) {
        return app.mobileApp.navigate('components/' + page + '/view.html');
    }
};