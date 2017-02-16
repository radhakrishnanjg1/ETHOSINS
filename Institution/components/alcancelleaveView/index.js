
'use strict';

(function () {
    var view = app.alcancelleaveView = kendo.observable();
    var alcancelleaveViewModel = kendo.observable({
        onShow: function () { 
        },  
    });

    view.set('alcancelleaveViewModel', alcancelleaveViewModel);
}());
 