
'use strict';

(function () {
    var view = app.DCRscheduleView = kendo.observable();
    var DCRscheduleViewModel = kendo.observable({
        onShow: function () {
            $("#scheduler").kendoScheduler({
                startTime: new Date("2013/6/26 07:00 AM"),
                height: 'auto',
                views: [
                    { type: "day", selected: true },
                { type: "week", selectedDateFormat: "{0:ddd,MMM dd,yyyy} - {1:ddd,MMM dd,yyyy}" },
                "month",
                { type: "agenda", selectedDateFormat: "{0:ddd, M/dd/yyyy} - {1:ddd, M/dd/yyyy}" },
                "timeline"
                ],
                mobile: "phone",
                date: new Date("2013/6/6"), // The current date of the scheduler
                dataSource: [ // The kendo.data.SchedulerDataSource configuration
                  // First scheduler event
                  {
                      id: 1, // Unique identifier. Needed for editing.
                      start: new Date("2013/6/6 08:00 AM"), // Start of the event
                      end: new Date("2013/6/6 09:00 AM"), // End of the event
                      title: "Breakfast" // Title of the event
                  },
                  // Second scheduler event
                  {
                      id: 2,
                      start: new Date("2013/6/6 10:15 AM"),
                      end: new Date("2013/6/6 12:30 PM"),
                      title: "Job Interview"
                  }
                ]
            });
        },

    });

    view.set('DCRscheduleViewModel', DCRscheduleViewModel);
}());
  