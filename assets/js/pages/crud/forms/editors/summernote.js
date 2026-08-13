"use strict";
// Class definition

var KTSummernoteDemo = function () {    
    // Private functions
    var demos = function () {
        $('#q_em_message').summernote({
            height: 150,
            toolbar: [
                ['style', ['bold', 'italic', 'underline']]
            ]
        });
    }

    return {
        // public functions
        init: function() {
            demos(); 
        }
    };
}();

// Initialization
jQuery(document).ready(function() {
    KTSummernoteDemo.init();
});