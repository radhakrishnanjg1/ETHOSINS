
function geolocationApp() {
}

geolocationApp.prototype = {
	_watchID:null,
    
	run:function() {
		var that = this;
		document.getElementById("watchButton").addEventListener("click", function() {
			that._handleWatch.apply(that, arguments);
		}, false);
		document.getElementById("refreshButton").addEventListener("click", function() {
			that._handleRefresh.apply(that, arguments);
		}, false);
	},
    
	_handleRefresh:function() {
        var options = {
                enableHighAccuracy: true,
                timeout: 10000
            },
            that = this;
        
        that._setStatus("Waiting for geolocation information...");
        
		navigator.geolocation.getCurrentPosition(function() {
			that._onSuccess.apply(that, arguments);
		}, function() {
			that._onError.apply(that, arguments);
		}, options);
	},
    
	_handleWatch:function() {
		var that = this,
		// If watch is running, clear it now. Otherwise, start it.
		button = document.getElementById("watchButton");
                     
		if (that._watchID != null) {
		    that._setStatus();
		    document.getElementById("results").classList.add("hidden");
			navigator.geolocation.clearWatch(that._watchID);
			that._watchID = null;
                         
			button.innerHTML = "Start Geolocation Watch";
		}
		else {
		    this._setStatus("Waiting for geolocation information...");
			// Update the watch every second.
			var options = {
			    frequency: 1000,
                timeout: 10000,
				enableHighAccuracy: true
			};
			that._watchID = navigator.geolocation.watchPosition(function() {
				that._onSuccess.apply(that, arguments);
			}, function() {
				that._onError.apply(that, arguments);
			}, options);
			button.innerHTML = "Clear Geolocation Watch";
            
		}
	},
    
	_onSuccess:function(position) {
	    // Successfully retrieved the geolocation information. Display it all.

	    for (key in position.coords) {
	        document.getElementById(key).innerText = position.coords[key];
	    }
        document.getElementById("timestamp").innerText = new Date(position.timestamp).toLocaleTimeString().split(" ")[0];

        this._setStatus();
        document.getElementById("results").classList.remove("hidden");
	},
    
	_onError: function (error) {
		this._setStatus('code: ' + error.code + '<br/>' +
						 'message: ' + error.message + '<br/>');

		document.getElementById("results").classList.add("hidden");
	},

	_setStatus: function (value) {
	    if (!value) {
	        document.getElementById("status").innerHTML = " ";
	    }
	    else {
	        document.getElementById("status").innerHTML = value;
	    }
	}
}