
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
    if (app.utils.checkinternetconnection()) {
        return app.mobileApp.navigate('components/' + page + '/view.html'); 
    }
    app.navigation.navigateoffline(page);
};