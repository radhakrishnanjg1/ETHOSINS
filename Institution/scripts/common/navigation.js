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

        //common page for offline
        navigateoffline: function (redirect) {
            return app.mobileApp.navigate('components/offlineView/view.html?pageid=' + redirect);
        },

        //right side menu 
        navigatedashboard: function () {
            return app.mobileApp.navigate('components/dashboardView/view.html');
        },
        navigateteamcoverage: function () {
            return app.mobileApp.navigate('components/teamcoverageView/view.html');
        },
        navigateholidays: function () {
            return app.mobileApp.navigate('components/holidaysView/view.html');
        },

        //left side menu 
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

        navigatesupport: function () {
            return app.mobileApp.navigate('components/supportView/view.html');
        },

        //LMS
        navigateLMSleavemanagementView: function () {
            return app.mobileApp.navigate('components/LMSleavemanagementView/view.html');
        },
        navigateLMSapplyleaveView: function () {
            return app.mobileApp.navigate('components/LMSapplyleaveView/view.html');
        },
        navigateLMScancelleaveView: function () {
            return app.mobileApp.navigate('components/LMScancelleaveView/view.html');
        },
        navigateLMSleavehistoryView: function () {
            return app.mobileApp.navigate('components/LMSleavehistoryView/view.html');
        },
        navigateLMSapproveleaveView: function () {
            return app.mobileApp.navigate('components/LMSapproveleaveView/view.html');
        },
        navigateLMSapproveleavecancelView: function () {
            return app.mobileApp.navigate('components/LMSapproveleavecancelView/view.html');
        },

        //DCR 
        navigateDCRstartView: function () {
            return app.mobileApp.navigate('components/DCRstartView/view.html');
        },
        navigateDCRmasterView: function () {
            return app.mobileApp.navigate('components/DCRmasterView/view.html');
        },
        navigateDCRinstitutionView: function () {
            return app.mobileApp.navigate('components/DCRinstitutionView/view.html');
        },
        navigateDCRunlistedinstitutionView: function () {
            return app.mobileApp.navigate('components/DCRunlistedinstitutionView/view.html');
        },
        navigateDCRfinaentryView: function () {
            return app.mobileApp.navigate('components/DCRfinaentryView/view.html');
        },
        navigateDCRpreviewView: function () {
            return app.mobileApp.navigate('components/DCRpreviewView/view.html');
        }, 

        navigateDCRscheduleView: function () {
            return app.mobileApp.navigate('components/DCRscheduleView/view.html');
        },


        //navigatefieldlocatorView 
        navigatefieldlocatorView: function () {
            return app.mobileApp.navigate('components/fieldlocatorView/view.html');
        },
        navigateAuthentication: function () {
            return app.mobileApp.navigate('components/authenticationView/view.html');
        },
    };
}());