"use strict";
// Class definition

var KTDropzoneDemo = function () {
    // Private functions
    var demo1 = function () {
        // single file upload
        $('#kt_dropzone_1').dropzone({
            url: "/assets/custom/api_upload/product_update.php", // Set the url for your upload script location
            paramName: "file", // The name that will be used to transfer the file
            maxFiles: 1,
            maxFilesize: 5, // MB
            addRemoveLinks: true,
            acceptedFiles: ".xlsx",
            accept: function(file, done) {
                if (file.name == "justinbieber.jpg") {
                    done("Naha, you don't.");
                } else {
                    done();
                }
            }
        });

        $('#kt_dropzone_2').dropzone({
            url: "/assets/custom/api_upload/product_add.php", // Set the url for your upload script location
            paramName: "file", // The name that will be used to transfer the file
            maxFiles: 1,
            maxFilesize: 5, // MB
            addRemoveLinks: true,
            acceptedFiles: ".xlsx",
            accept: function(file, done) {
                if (file.name == "justinbieber.jpg") {
                    done("Naha, you don't.");
                } else {
                    done();
                }
            }
        });  
    }

    var demo2 = function() {
        $('#kt_dropzone_followup').dropzone({
            url: "/assets/custom/api_upload/followup.php", // Set the url for your upload script location
            paramName: "file", // The name that will be used to transfer the file
            maxFiles: 1,
            maxFilesize: 5, // MB
            addRemoveLinks: true,
            acceptedFiles: ".xlsx",
            accept: function(file, done) {
                if (file.name == "justinbieber.jpg") {
                    done("Naha, you don't.");
                } else {
                    done();
                }
            }
        });
    }

    return {
        // public functions
        init: function() {
            demo1();
            demo2();
        }
    };
}();

KTUtil.ready(function() {
    KTDropzoneDemo.init();
});
