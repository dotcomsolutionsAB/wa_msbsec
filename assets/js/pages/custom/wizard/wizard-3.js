"use strict";

// Class definition
var KTWizard3 = function() {

    // console.log("Running");

    // Base elements
    var wizardEl;
    var formEl;
    var validator;
    var wizard;

    // Private functions
    var initWizard = function() {
        // Initialize form wizard
        wizard = new KTWizard('kt_wizard_v3', {
            startStep: 1, // initial active step number
            clickableSteps: false // allow step clicking
        });

        // Validation before going to next page
        wizard.on('beforeNext', function(wizardObj) {
            if (validator.form() !== true) {
                wizardObj.stop(); // don't go to the next step
            }
        });

        wizard.on('beforePrev', function(wizardObj) {
            if (validator.form() !== true) {
                wizardObj.stop(); // don't go to the next step
            }
        });

        wizard.on('submit', function(wizardObj) {
            if (validator.form() !== true) {
                wizardObj.goFirst(); // don't go to the next step
            }
        });

        // Change event
        wizard.on('change', function(wizard) {
            KTUtil.scrollTop();
        });
    }

    var initValidation = function() {
        console.log('handleAddQuotation - initValidation');
        validator = formEl.validate({
            // Validate only visible fields
            ignore: ":hidden",

            // Validation rules
            rules: {

            },

            // Display error
            invalidHandler: function(event, validator) {
                KTUtil.scrollTop();

                swal.fire({
                    "title": "",
                    "text": "There are some errors in your submission. Please correct them.",
                    "type": "error",
                    "confirmButtonClass": "btn btn-secondary"
                });
            },

            // Submit valid form
            submitHandler: function(form) {

            }
        });
    }

    var initSubmit = function() {
        var btn = formEl.find('[data-ktwizard-type="action-submit"]');
        console.log('handleAddQuotation - initSubmit');


        btn.on('click', function(e) {
            e.preventDefault();
            console.log('handleAddQuotation - Submit Btn Click');


            if (validator.form()) {
                // See: src\js\framework\base\app.js
                KTApp.progress(btn);
                //KTApp.block(formEl);
                console.log("Created");

                // See: http://malsup.com/jquery/form/#ajaxSubmit
                swal.fire({
                    "title": "",
                    "text": "The qoutation has been successfully submitted!",
                    "type": "success",
                    "confirmButtonClass": "btn btn-secondary"
                });
            }
        });
    }

    return {
        // public functions
        init: function() {
            wizardEl = KTUtil.get('kt_wizard_v3');
            formEl = $('#add_quotation');

            initWizard();
            initValidation();
            initSubmit();
        }
    };
}();

jQuery(document).ready(function() {
    // KTWizard3.init();
});