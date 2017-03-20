(function () {
    $.noty.defaults = _.extend({}, $.noty.defaults, {
        layout: 'center',
        theme: 'metroui', // or relax or defaultTheme
        type: 'alert',
        timeout: 1800,
        modal: true,
        killer: true,
    });

    app.notify = {
        error: function (error) {
            app.utils.loading(false);
            //console.error(error);
            //console.trace();
            var message = error || error //JSON.stringify(error);
            noty({ text: message, type: 'error', layout: 'center' })
        },
        info: function (text) {
            noty({ text: text });
        },
        success: function (text) {
            noty({ text: text, type: 'success', layout: 'center' })
        },
        warning: function (text) {
            noty({ text: text, type: 'warning', layout: 'center' })
        },
        confirmation: function (text,callback) {
            text = text || 'Are you sure?';

            noty({
                text: text,
                buttons: [
                  {
                      addClass: 'btn btn-success', text: 'Confirm', onClick: function ($noty) {
                          $noty.close();
                          return callback(1);
                      }
                  },
                  {
                      addClass: 'btn btn-primary', text: 'Cancel', onClick: function ($noty) {
                          $noty.close();
                         // noty({ text: 'You clicked "Cancel" button', type: 'error' });
                      }
                  }
                ]
            });
        }
    };
}());
