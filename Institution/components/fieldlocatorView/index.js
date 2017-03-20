
'use strict';

(function () {
    var view = app.fieldlocatorView = kendo.observable();
    var fieldlocatorViewModel = kendo.observable({
        onShow: function () {
            //if (!app.utils.checkinternetconnection()) {
            //    return app.navigation.navigateoffline("fieldlocatorView");
            //}
            //app.navigation.logincheck();   
           // fun_db_APP_Get_MSL_Coverage_Details_INS_Employee($('#hdnEmployee_ID').val());
            app.utils.loading(true);
            fun_db_APP_Get_DCR_Master_GEO(2880);
            $('#txtfslist').val('');
            $("#txtfslist").kendoAutoComplete({
                clearButton: false
            });
            fun_load_subordinatesdetails();

            
        },
    });

    view.set('fieldlocatorViewModel', fieldlocatorViewModel);
}());

function fun_load_geolocation_by_employee_id(Employee_ID) { 
    var alldivision = JSON.parse(localStorage.getItem("ethosinsdcrgeodetails"));
    var singledivision = JSON.parse(Enumerable.From(alldivision)
       .Where("$.Employee_ID=='" + Employee_ID)
       .ToJSON());

    L.mapbox.accessToken = 'pk.eyJ1IjoicmFkaGFrcmlzaG5hbmpnIiwiYSI6ImNqMGFqNTh3YzAwMDczMm53d3pha2x0ZGIifQ.tyPyR0XvtlNvQ3S1SE7HUg';

    var map = L.mapbox.map('map', 'mapbox.streets')
    .setView([13.0693312, 77.4551011], 4); 
    var marker = L.marker(new L.LatLng(singledivision[0].Latitude , singledivision[0].Latitude), {
            icon: L.mapbox.marker.icon({
                'marker-color': '006666'
            }),
        });
    marker.bindPopup('Date:' + singledivision[0].Latitude+
        'Activity Period:' + singledivision[0].Activity_Period +
        'Activity:' + singledivision[0].Activity);
        marker.addTo(map);
    } 

function fun_load_geolocation()
{

    var alldivision = JSON.parse(localStorage.getItem("ethosinsdcrgeodetails"));
    var singledivision = JSON.parse(Enumerable.From(alldivision)
        .ToJSON());

    L.mapbox.accessToken = 'pk.eyJ1IjoicmFkaGFrcmlzaG5hbmpnIiwiYSI6ImNqMGFqNTh3YzAwMDczMm53d3pha2x0ZGIifQ.tyPyR0XvtlNvQ3S1SE7HUg';

    var map = L.mapbox.map('map', 'mapbox.streets')
    .setView([13.0693312, 77.4551011], 4);

    $.each(singledivision, function (i, item) {
        var marker = L.marker(new L.LatLng(singledivision[i].Latitude,
            singledivision[i].Latitude), {
            icon: L.mapbox.marker.icon({
                'marker-color': '006666'
            }),
        });
        marker.bindPopup('Date:' + singledivision[i].Latitude +
            'Activity Period:' + singledivision[i].Activity_Period +
            'Activity:' + singledivision[i].Activity);
        marker.addTo(map);
    }); 
}

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

        change: function (e) {
            var value = this.value();
            if (value.length > 6) {
                var ethosmastervaluesdata = JSON.parse(localStorage.getItem("ethosinssubordinatesdetails"));
                var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
               .Where("$.Employee_Name=='" + value + "'")
               .ToJSON());
                if (ethosmastervaluesrecords.length == 0) {
                    app.notify.error("Select valid employee name in list.!");
                    return false;
                }
                var empid = value.split("|")[1]; 
                app.utils.loading(true);
                fun_load_geolocation_by_employee_id(empid);
            }
            // Use the value of the widget
        }
    });
}


function fun_db_APP_Get_DCR_Master_GEO(Employee_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/dvu4zra5xefb2qfq/Invoke/SqlProcedures/APP_Get_DCR_Master_GEO",
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
        },
        error: function (e) { 
            app.utils.loading(false);  
        }
    });

    datasource.fetch(function () {
        var data = this.data();
        localStorage.setItem("ethosinsdcrgeodetails", JSON.stringify(data)); // dcrgeo details 
        fun_load_geolocation();
        app.utils.loading(false);
    });

}

