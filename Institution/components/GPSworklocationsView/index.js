
'use strict';

(function () {
    var view = app.GPSworklocationsView = kendo.observable();
    var GPSworklocationsViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("fieldlocatorView");
            }
            app.navigation.logincheck();
            if (localStorage.getItem("dcrgeodetails_live") == null ||
               localStorage.getItem("dcrgeodetails_live") != 1) {
            app.utils.loading(true);
            fun_db_APP_Get_DCR_INS_Work_Locations_GEO(parseInt($('#hdnEmployee_ID').val()));
            } 
        },
        fun_close_txtfslist: function () {
            $('#txtfslist').val('');
            setTimeout(function () {
                $("#txtfslist").blur();
                var autocomplete = $("#txtfslist").data("kendoAutoComplete");
                // Close the suggestion popup
                autocomplete.close();
            }, 1);
        },
        onRefresh: function () {
            fun_db_APP_Get_DCR_INS_Work_Locations_GEO(parseInt($('#hdnEmployee_ID').val()));
        },
    });

    view.set('GPSworklocationsViewModel', GPSworklocationsViewModel);
}());

function fun_gps_worklocation_pageinit() {
    $('#txtfslist').val('');
    $("#txtfslist").kendoAutoComplete({
        clearButton: false
    });
}

function fun_load_gps_subordinatesdetails() {
    var localdata = JSON.parse(localStorage.getItem("ethosinssubordinatesdetails"));
    //create AutoComplete UI component
    $("#txtfslist").kendoAutoComplete({
        dataSource: localdata,
        dataTextField: "Employee_Name",
        valuePrimitive: true,
        ignoreCase: true,
        minLength: 1,
        filter: "contains",
        placeholder: "Type employee name",
        clearButton: false,
        change: function (e) {
            var value = this.value();
            if (value.length > 6) {
                var ethosmastervaluesdata = JSON.parse(localStorage.getItem("ethosinssubordinatesdetails"));
                var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
               .Where("$.Employee_Name=='" + value + "'")
               .ToJSON());
                if (ethosmastervaluesrecords.length == 0) {
                    app.notify.error("Select valid employee name in list!");
                    return false;
                }
                var empid = value.split("|")[1];
                fun_load_geolocation_by_filter(empid, $("#ddlworklocations").val());
            }
            else if (value == 'ALL') {
                fun_load_geolocation_by_filter('ALL', $("#ddlworklocations").val());
            }
            else {
                fun_load_geolocation_by_filter('ALL', $("#ddlworklocations").val());
            }
            // Use the value of the widget
            $('.k-nodata').hide();
            setTimeout(function () {
                $("#txtfslist").blur();
                var autocomplete = $("#txtfslist").data("kendoAutoComplete");
                // Close the suggestion popup
                autocomplete.close();
            }, 1);
        }
    });
}

function fun_load_gps_daytypes() {
    $("#ddlworklocations").kendoDropDownList({
        index: 0,
        change: function (e) {
            var value = $("#txtfslist").val();
            if (value.length > 6) {
                var ethosmastervaluesdata = JSON.parse(localStorage.getItem("ethosinssubordinatesdetails"));
                var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
               .Where("$.Employee_Name=='" + value + "'")
               .ToJSON());
                if (ethosmastervaluesrecords.length == 0) {
                    app.notify.error("Select valid employee name in list!");
                    return false;
                }
                var empid = value.split("|")[1];
                var ddlworklocation = this.value();
                fun_load_geolocation_by_filter(empid, ddlworklocation);
            }
            else if (value == 'ALL') {
                fun_load_geolocation_by_filter('ALL', $("#ddlworklocations").val());
            }
            else {
                fun_load_geolocation_by_filter('ALL', $("#ddlworklocations").val());
            }
        }
    });
}

function fun_load_geolocation_by_filter(Employee_ID, ddlworklocation) {
    var alldivision = JSON.parse(localStorage.getItem("dcrgeodetails"));
    var data = JSON.parse(Enumerable.From(alldivision)
        .ToJSON());
    if (Employee_ID != "ALL") {
        data = JSON.parse(Enumerable.From(data)
       .Where("$.Employee_ID=='" + Employee_ID + "'")
       .ToJSON());
    }
    if (ddlworklocation != "ALL") {
        data = JSON.parse(Enumerable.From(data)
       .Where("$.DayType=='" + ddlworklocation + "'")
       .ToJSON());
    }
    var latlng = new google.maps.LatLng(13.0693312, 77.4551011);

    var mapOptions = { 
        sensor: true,
        center: latlng,
        panControl: true,
        zoomControl: true,
        zoomControlOptions: { style: google.maps.ZoomControlStyle.SMALL },
        zoom: 6,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: false,
        overviewMapControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById('mapwl'), mapOptions);
    map.setTilt(45);

    var infoWindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    var marker, i, positions;
    var totlength = parseInt(data.length);
    for (i = 0; i < totlength; i++) {
        positions = new google.maps.LatLng(data[i].Latitude, data[i].Longitude);
        bounds.extend(positions);
        marker = new google.maps.Marker({
            position: positions,
            title: data[i].Employee_Name + "," + data[i].DailyReport_Date + ","
                + data[i].Activity_Period + "," + data[i].Activity,
            animation: google.maps.Animation.DROP,
            map: map,
            //icon: { 
            //    fillColor: '#ff6600',
            //},
            //icon: {
            //    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            //    strokeColor: "#ff6600",
            //    scale: 3
            //},
        });
        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                infoWindow.setContent(data[i].Employee_Name +
                    "<br>" + data[i].DailyReport_Date +
                    "<br>" + data[i].Activity_Period +
                    "<br>" + data[i].Activity);
                infoWindow.open(map, marker);
            }
        })(marker, i));
    }
}

function fun_db_APP_Get_DCR_INS_Work_Locations_GEO(Employee_ID) {
    var storelist = new kendo.data.DataSource({
        offlineStorage: "storelist",
        transport: {
            read: {
                url: "https://api.everlive.com/v1/dvu4zra5xefb2qfq/Invoke/SqlProcedures/APP_Get_DCR_INS_Work_Locations_GEO",
                type: "POST",
                dataType: "json",
                data: {
                    "Employee_ID": Employee_ID
                }
            }
        },
        schema: {
            parse: function (response) {
                var getdata = response.Result.Data[0];
                return getdata;
            }
        }
    });

    storelist.fetch(function () {
        var data = this.data();
        localStorage.setItem("dcrgeodetails", JSON.stringify(data));
        localStorage.setItem("dcrgeodetails_live", 1);
        fun_gps_worklocation_pageinit();
        fun_load_gps_subordinatesdetails();
        fun_load_gps_daytypes();
        Employee_ID = "ALL";
        var ddlworklocation = "ALL";
        fun_load_geolocation_by_filter(Employee_ID, ddlworklocation);
        app.utils.loading(false);
    });
}

