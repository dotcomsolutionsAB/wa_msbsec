"use strict";

var KTSessionTimeoutDemo = function () {

    var initDemo = function () {
        $.sessionTimeout({
            title: 'Session Timeout Notification',
            message: 'Your session is about to expire.',
            keepAliveUrl: '#',
            redirUrl: '../assets/custom/login/logout.php',
            logoutUrl: '../assets/custom/login/logout.php',
            //warnAfter: 900000, //warn after 15 minutes
            //redirAfter: 930000, //redirect after 10 secons,
            warnAfter: 15000, //warn after 15 minutes
            redirAfter: 30000, //redirect after 10 secons,
            ignoreUserActivity: false,
            countdownMessage: 'Redirecting in {timer} seconds.',
            countdownBar: true,
            keepAliveInterval: 5000,
            keepAlive: true,
            clearWarningOnUserActivity: true,
            onStart: false,
            onWarn: false,
            onRedir: false,
            countdownSmart: false,
            useLocalStorageSynchronization: true,
            localStorageSynchronizationKey: "sessionkeepalive__lastkeepalive"
        });
    }

    return {
        //main function to initiate the module
        init: function () {
            initDemo();
        }
    };

}();

jQuery(document).ready(function() {    
    KTSessionTimeoutDemo.init();
});