
'use strict';

(function () {
    var view = app.supportView = kendo.observable();
    var supportViewModel = kendo.observable({
        onShow: function () { 
        },

    });

    view.set('supportViewModel', supportViewModel);
}());
 
 
function gotoonlinepage() { 
    var page = $('#hdncurrentpage').val();  
    if (app.utils.checkinternetconnection()) {
        return app.mobileApp.navigate('components/' + page + '/view.html'); 
    }
    app.navigation.navigateoffline(page);
};