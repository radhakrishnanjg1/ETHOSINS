(function () {
    app.navigation = {
        logincheck: function () {
            //alert(app.user);
            if ($('#hdnLogin_ID').val() === 0) {
                return app.mobileApp.navigate('components/authenticationView/view.html');
            }
        },

        back: function () {
            app.mobileApp.navigate('#:back');
            app.utils.loading(false);
        },

        navigateNoAppId: function () {
            return app.mobileApp.navigate('components/missingSettingsView/noappidView.html');
        },

        navigatedashboard: function () {
            return app.mobileApp.navigate('components/dashboardView/view.html');
        }, 

        navigateteamcoverage: function () {
            return app.mobileApp.navigate('components/teamcoverageView/view.html');
        },

        //navigateindcoverage: function () {
        //    return app.mobileApp.navigate('components/indcoverageView/view.html');
        //},

        navigateholidays: function () {
            return app.mobileApp.navigate('components/holidaysView/view.html');
        },

        navigateleavemanagement: function () {
            return app.mobileApp.navigate('components/leavemanagementView/view.html');
        },
         
        navigateapplyleave: function () {
            return app.mobileApp.navigate('components/applyleaveView/view.html');
        },
        navigatecancelleave: function () {
            return app.mobileApp.navigate('components/cancelleaveView/view.html');
        },
        navigatealcancelleave: function () {
            return app.mobileApp.navigate('components/alcancelleaveView/view.html');
        },
        navigateleavehistory: function () {
            return app.mobileApp.navigate('components/leavehistoryView/view.html');
        },

        navigateapproveleave: function () {
            return app.mobileApp.navigate('components/approveleaveView/view.html');
        },

        navigateapprovealeave: function () {
            return app.mobileApp.navigate('components/approvealeaveView/view.html');
        },

        navigateleavecancelapproval: function () {
            return app.mobileApp.navigate('components/leavecancelapprovalView/view.html');
        },
        //DCR
        
        navigatedcr: function () {
            return app.mobileApp.navigate('components/DCRView/view.html');
            }, 
        navigateAuthentication: function () {
            return app.mobileApp.navigate('components/authenticationView/view.html');
        }, 

        navigateProfile: function () {
            return app.mobileApp.navigate('components/updateprofileView/view.html');
        },

        navigatechangepassword: function () {
            return app.mobileApp.navigate('components/changepasswordView/view.html');
        }, 
        navigatesignout: function () {
            var confirmation = "Are you sure you want to log out?";
            app.notify.confirmation(confirmation, function (confirm) {
                if (!confirm) {
                    return;
                }
                return app.mobileApp.navigate('components/authenticationView/view.html?action=logout');

            })
        }, 
        navigateoffline: function (redirect) {
            return app.mobileApp.navigate('components/offlineView/view.html?pageid=' + redirect);
        },
    };
}());