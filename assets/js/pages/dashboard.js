"use strict";

// Class definition
var KTDashboard = function() {

    // Daterangepicker Init
    var daterangepickerInit = function() {

        moment.locale('en');

        if ($('#kt_dashboard_daterangepicker').length == 0) {
            return;
        }

        var picker = $('#kt_dashboard_daterangepicker');
        var start = moment();
        var end = moment();
        var quarter = moment().quarter();

        var sem_start = 2;
        var sem_end = 3;
        var add_year = 0;
        var sub_year = 0;

        var y_sub = 0;

        if(quarter == 4){
            sem_start = 4;
            sem_end = 1;
            add_year = 1;
        }

        if(quarter == 1){
            sem_start = 4;
            sem_end = 1;
            sub_year = 1;
            y_sub = 1;
        }

        var nextquarter = moment().quarter(quarter).add(3, 'months');

        // console.log(quarter);
        // console.log(nextquarter);

        function cb(start, end, label) {

            var title = '';
            var range = '';

            if ((end - start) < 100 || label == 'Today') {
                title = 'Today:';
                range = start.format('MMM D, YYYY');
            } else if (label == 'Yesterday') {
                title = 'Yesterday:';
                range = start.format('MMM D, YYYY');
            } else {
                range = start.format('MMM D, YYYY') + ' - ' + end.format('MMM D, YYYY');
            }

            $('#kt_dashboard_daterangepicker_date').html(range);
            $('#kt_dashboard_daterangepicker_title').html(title);

            $.ajax({
                url: "../assets/custom/api_set/setrange.php",
                type: "POST",
                data: { "start": start.format('YYYY-MM-DD'), "end": end.format('YYYY-MM-DD') },
                dataType: "json",
                success: function(response) {
                    location.reload();
                }
            });
        }

        function base(start, end, label) {

            var title = '';
            var range = '';

            $.ajax({
                url: "../assets/custom/api_get/getrange.php",
                type: "GET",
                dataType: "json",
                success: function(response) {
                    if (response.start != "") {
                        start = response.start;
                        start = moment(start, "YYYY-MM-DD");

                        end = response.end;
                        end = moment(end, "YYYY-MM-DD");

                        if ((end - start) < 100 || label == 'Today') {
                            title = 'Today:';
                            range = start.format('MMM D, YYYY');
                        } else if (label == 'Yesterday') {
                            title = 'Yesterday:';
                            range = start.format('MMM D, YYYY');
                        } else {
                            range = start.format('MMM D, YYYY') + ' - ' + end.format('MMM D, YYYY');
                        }
                    } else {
                        range = start.format('MMM D, YYYY') + ' - ' + end.format('MMM D, YYYY');
                    }
                    $('#kt_dashboard_daterangepicker_date').html(range);
                    $('#kt_dashboard_daterangepicker_title').html(title);
                }
            });
        }

        picker.daterangepicker({
            direction: KTUtil.isRTL(),
            startDate: start,
            endDate: end,
            opens: 'left',
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                'This Financial Year': [moment().subtract(y_sub, 'year').month(3).startOf('month'), moment().subtract(y_sub, 'year').month(3).startOf('month').subtract(1, 'days').add(1, 'year')],
                'Last Financial Year': [moment().subtract(y_sub, 'year').month(3).startOf('month').subtract(1, 'year'), moment().subtract(y_sub, 'year').month(3).startOf('month').subtract(1, 'days')]

            }
        }, cb);

        base(start, end, '');
    }

    return {
        // Init demos
        init: function() {

            // init daterangepicker
            daterangepickerInit();

            // demo loading
            var loading = new KTDialog({ 'type': 'loader', 'placement': 'top center', 'message': 'Loading ...' });
            loading.show();

            setTimeout(function() {
                loading.hide();
            }, 3000);
        }
    };
}();

// Class initialization on page load
jQuery(document).ready(function() {
    KTDashboard.init();
});