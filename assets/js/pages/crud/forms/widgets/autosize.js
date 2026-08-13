// Class definition

var KTAutosize = function () {
    
    // Private functions
    var textarea = function () {
        // basic demo
        // var textarea_enquiry = $('.autosize_enquiry');

        // autosize(textarea_enquiry);
        // autosize.update(textarea_enquiry);

    }

    return {
        // public functions
        init: function() {
            textarea(); 
        }
    };
}();

jQuery(document).ready(function() {
    KTAutosize.init();
});