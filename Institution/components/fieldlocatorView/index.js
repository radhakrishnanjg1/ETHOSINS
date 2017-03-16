
'use strict';

(function () {
    var view = app.fieldlocatorView = kendo.observable();
    var fieldlocatorViewModel = kendo.observable({
        onShow: function () {
            //if (!app.utils.checkinternetconnection()) {
            //    return app.navigation.navigateoffline("fieldlocatorView");
            //}
            //app.navigation.logincheck();   

            $('#txtfslist').val('');
            $("#txtfslist").kendoAutoComplete({
                clearButton: false
            });
            fun_load_subordinatesdetails();
        },
        get_location: function () {
            var options = {
                enableHighAccuracy: true,
                timeout: 10000
            };
          var geolo=  navigator.geolocation.getCurrentPosition(function () {
              //alert(JSON.stringify(arguments));
              alert("latitude:" + JSON.stringify(arguments[0].coords.latitude) + " | "
                   + "longitude:" + JSON.stringify(arguments[0].coords.longitude))
            }, function () {
                alert(JSON.stringify(arguments));
            }, options);


        },
        showMap: function () {
            //if (!this.checkSimulator()) {
                alert('a');
                Mapbox.show(
                  {
                      style: 'emerald', // light|dark|emerald|satellite|hybrid|streets , default 'streets'
                      margins: {
                          left: 0, // default 0
                          right: 0, // default 0
                          // our demo apps have a different layout for Android (tabs at the top)
                          top: navigator.userAgent.indexOf("Android") == -1 ? 316 : 340, // default 0
                          bottom: navigator.userAgent.indexOf("Android") == -1 ? 50 : 0 // default 0
                      },
                      center: { // optional, without a default
                          lat: 13.0693312,
                          lng: 77.4551011
                      },
                      zoomLevel: 12, // 0 (the entire world) to 20, default 10
                      showUserLocation: true, // default false
                      hideAttribution: true, // default false, which is required by Mapbox if you're on a free plan
                      hideLogo: true, // default false, which is required by Mapbox if you're on a free plan
                      hideCompass: false, // default false
                      disableRotation: false, // default false
                      disableScroll: false, // default false
                      disableZoom: false, // default false
                      disablePitch: false, // default false
                      markers: [
                        {
                            lat: 13.0693312,
                            lng: 77.4551011,
                            title: 'Nice location',
                            subtitle: 'Really really nice location'
                        }
                      ]
                  },
                  function () {
                      // let's add an click handler to the marker callouts
                      Mapbox.addMarkerCallback(function (selectedMarker) {
                          alert("Marker selected: " + JSON.stringify(selectedMarker));
                      });
                  },
                  this.onError
            )
              alert('b');
           // }
        },

        hideMap: function () {
            if (!this.checkSimulator()) {
                Mapbox.hide(
                  {},
                  this.onSuccess,
                  this.onError
                );
            }
        },

        addMarkers: function () {
            if (!this.checkSimulator()) {
                Mapbox.addMarkers(
	                [
                    {
                        'lat': 13.0693312,
                        'lng': 77.4551011,
                        'title': 'One-line title here', // no popup unless set
                        'subtitle': 'This text can span multiple lines on Android only.'
                    },
                    {
                        'lat': 13.0693312,
                        'lng': 77.4551011,
                        'title': 'Nu subtitle for this one' // iOS: no popup unless set, Android: an empty popup -- so please add something
                    }
	                ],
                  this.onSuccess,
                  this.onError
                );
            }
        },

        addPolygon: function () {
            if (!this.checkSimulator()) {
                Mapbox.addPolygon(
                  {
                      points: [
                        {
                            'lat': 52.3832160,
                            'lng': 4.8991680
                        },
                        {
                            'lat': 52.3632160,
                            'lng': 4.9011680
                        },
                        {
                            'lat': 52.3932160,
                            'lng': 4.8911680
                        }
                      ]
                  },
                  this.onSuccess,
                  this.onError
                );
            }
        },

        setCenter: function () {
            if (!this.checkSimulator()) {
                Mapbox.setCenter(
                  {
                      lat: 13.0693312,
                      lng: 77.4551011,
                      animated: true
                  },
                  this.onSuccess,
                  this.onError
                );
            }
        },

        getCenter: function () {
            if (!this.checkSimulator()) {
                Mapbox.getCenter(
                  this.onSuccessWithAlert
                );
            }
        },

        setZoomLevel: function () {
            if (!this.checkSimulator()) {
                Mapbox.setZoomLevel(
                  {
                      level: 10,
                      animated: true
                  },
                  this.onSuccess,
                  this.onError
                );
            }
        },

        getZoomLevel: function () {
            if (!this.checkSimulator()) {
                Mapbox.getZoomLevel(
                  this.onSuccessWithAlert
                );
            }
        },

        checkSimulator: function () {
            if (window.navigator.simulator === true) {
                alert('This plugin is not available in the simulator.');
                return true;
            } else if (window.Mapbox === undefined) {
                alert('Plugin not found. Maybe you are running in AppBuilder Companion app which currently does not support this plugin.');
                return true;
            } else {
                return false;
            }
        },

        // callbacks
        onSuccess: function (msg) {
            console.log('Mapbox success: ' + msg);
        },

        onSuccessWithAlert: function (msg) {
            alert(JSON.stringify(msg));
        },

        onError: function (msg) {
            alert('Mapbox error: ' + msg);
        }
    });

    view.set('fieldlocatorViewModel', fieldlocatorViewModel);
}());


function fun_load_subordinatesdetails() {
    var localdata = JSON.parse(localStorage.getItem("ethosinssubordinatesdetails"));
    //create AutoComplete UI component
    $("#txtfslist").kendoAutoComplete({
        dataSource: localdata,
        dataTextField: "Employee_Name",
        valuePrimitive: true,
        ignoreCase: true,
        minLength: 3,
        filter: "contains",
        placeholder: "Select Employee...",
        clearButton: false,
        //separator: ", "
        //noDataTemplate: 'No records found!',

        //change: function (e) {
        //    var value = this.value();
        //    if (value.length > 6) {
        //        var ethosmastervaluesdata = JSON.parse(localStorage.getItem("ethosinssubordinatesdetails"));
        //        var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
        //       .Where("$.Employee_Name=='" + value + "'")
        //       .ToJSON());
        //        if (ethosmastervaluesrecords.length == 0) {
        //            app.notify.error("Select valid employee name in list.!");
        //            return false;
        //        }
        //        var empid = value.split("|")[1];
        //        $('#dvteamename').html(value.split("|")[0]);
        //        app.utils.loading(true);
        //        fun_db_APP_Get_MSL_Coverage_Details_INS_Employee_TeamByEmployeeid(empid);
        //    }
        //    // Use the value of the widget
        //}
    });
}

 
 
