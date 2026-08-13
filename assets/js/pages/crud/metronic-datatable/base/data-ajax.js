"use strict";
// Global Variables
var manageUsersTable;
// Class definition

var KTDatatableRemoteAjaxDemo = function() {
    // Private functions

    // basic demo
    var demo = function() {

        var datatable = $('#ttest').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        // url: 'https://keenthemes.com/metronic/tools/preview/api/datatables/demos/default.php',
                        url: 'https://www.dotcomsolutions.biz/assets/custom/works/retreive.json',
                        // sample custom headers
                        // headers: {'x-my-custom-header': 'some value', 'x-test-header': 'the value'},
                        map: function(raw) {
                            // sample data mapping
                            var dataSet = raw;
                            if (typeof raw.data !== 'undefined') {
                                dataSet = raw.data;
                            }
                            return dataSet;
                        },
                    },
                },
                pageSize: 1,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
            },

            // layout definition
            layout: {
                scroll: false,
                footer: false,
            },

            // column sorting
            sortable: true,

            pagination: true,

            search: {
                input: $('#generalSearch'),
            },

            // columns definition
            columns: [{
                field: 'ID',
                title: '#',
                sortable: 'asc',
                width: 30,
                type: 'number',
                selector: false,
                textAlign: 'center',
            }, {
                field: 'OrderID',
                title: 'Order ID',
            }, {
                field: 'Country',
                title: 'Country',
                template: function(row) {
                    return row.Country + ' ' + row.ShipCountry;
                },
            }, {
                field: 'ShipDate',
                title: 'Ship Date',
                type: 'date',
                format: 'MM/DD/YYYY',
            }, {
                field: 'CompanyName',
                title: 'Company Name',
            }, {
                field: 'Status',
                title: 'Status',
                // callback function support for column rendering
                template: function(row) {
                    var status = {
                        1: { 'title': 'Pending', 'class': 'kt-badge--brand' },
                        2: { 'title': 'Delivered', 'class': ' kt-badge--danger' },
                        3: { 'title': 'Canceled', 'class': ' kt-badge--primary' },
                        4: { 'title': 'Success', 'class': ' kt-badge--success' },
                        5: { 'title': 'Info', 'class': ' kt-badge--info' },
                        6: { 'title': 'Danger', 'class': ' kt-badge--danger' },
                        7: { 'title': 'Warning', 'class': ' kt-badge--warning' },
                    };
                    return '<span class="kt-badge ' + status[row.Status].class + ' kt-badge--inline kt-badge--pill">' + status[row.Status].title + '</span>';
                },
            }, {
                field: 'Type',
                title: 'Type',
                autoHide: false,
                // callback function support for column rendering
                template: function(row) {
                    var status = {
                        1: { 'title': 'Online', 'state': 'danger' },
                        2: { 'title': 'Retail', 'state': 'primary' },
                        3: { 'title': 'Direct', 'state': 'success' },
                    };
                    return '<span class="kt-badge kt-badge--' + status[row.Type].state + ' kt-badge--dot"></span>&nbsp;<span class="kt-font-bold kt-font-' + status[row.Type].state + '">' +
                        status[row.Type].title + '</span>';
                },
            }, {
                field: 'Actions',
                title: 'Actions',
                sortable: false,
                width: 110,
                overflow: 'visible',
                autoHide: false,
                template: function() {
                    return '\
						<div class="dropdown">\
							<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-sm" data-toggle="dropdown">\
                                <i class="flaticon2-gear"></i>\
                            </a>\
						  	<div class="dropdown-menu dropdown-menu-right">\
						    	<a class="dropdown-item" href="#"><i class="la la-edit"></i> Edit Details</a>\
						    	<a class="dropdown-item" href="#"><i class="la la-leaf"></i> Update Status</a>\
						    	<a class="dropdown-item" href="#"><i class="la la-print"></i> Generate Report</a>\
						  	</div>\
						</div>\
						<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-sm" title="Edit details">\
							<i class="flaticon2-paper"></i>\
						</a>\
						<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-sm" title="Delete">\
							<i class="flaticon2-trash"></i>\
						</a>\
					';
                },
            }],

        });

        $('#kt_form_status').on('change', function() {
            datatable.search($(this).val().toLowerCase(), 'Status');
        });

        $('#kt_form_type').on('change', function() {
            datatable.search($(this).val().toLowerCase(), 'Type');
        });

        $('#kt_form_status,#kt_form_type').selectpicker();

    };

    // works Datatable
    var works = function() {

        var datatable = $('#works_table').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: 'https://www.dotcomsolutions.biz/assets/custom/works/retreive.php',
                        // sample custom headers
                        // headers: {'x-my-custom-header': 'some value', 'x-test-header': 'the value'},
                        map: function(raw) {
                            // sample data mapping
                            var dataSet = raw;
                            if (typeof raw.data !== 'undefined') {
                                dataSet = raw.data;
                            }
                            return dataSet;
                        },
                    },
                },
                pageSize: 1,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
            },

            // layout definition
            layout: {
                scroll: false,
                footer: false,
            },

            // column sorting
            sortable: true,

            pagination: true,

            search: {
                input: $('#generalSearch'),
            },

            // columns definition
            columns: [{
                field: 'SN',
                title: '#',
                sortable: 'asc',
                width: 30,
                type: 'number',
                selector: false,
                textAlign: 'center',
            }, {
                field: 'service',
                title: 'Work',
                width: 200,
                template: function(row) {
                    return '<strong>' + row.service + '</strong><br/>' + row.description;
                },
            }, {
                field: 'client',
                title: 'Client',
            }, {
                field: 'date',
                title: 'Date',
                type: 'date',
                format: 'DD-MM-YYYY',
            }, {
                field: 'type',
                title: 'Type',
                autoHide: false,
                // callback function support for column rendering
                template: function(row) {
                    var status = {
                        'Designing': { 'title': 'Designing', 'state': 'danger' },
                        'Printing': { 'title': 'Printing', 'state': 'primary' },
                        'Website': { 'title': 'Website', 'state': 'success' },
                    };
                    return '<span class="kt-badge kt-badge--' + status[row.type].state + ' kt-badge--dot"></span>&nbsp;<span class="kt-font-bold kt-font-' + status[row.type].state + '">' +
                        status[row.type].title + '</span>';
                },
            }, {
                field: 'charge',
                title: 'Charges',
                template: function(row) {
                    return 'Rs. ' + row.charge + '.00';
                },
            }, 
            {
                field: 'Status',
                title: 'Status',
                // callback function support for column rendering
                template: function(row) {
                    var status = {
                        1: { 'title': 'Acknowledged', 'class': 'kt-badge--brand' },
                        2: { 'title': 'In Process', 'class': ' kt-badge--info' },
                        3: { 'title': 'Pending Approval', 'class': ' kt-badge--warning' },
                        4: { 'title': 'Cancelled', 'class': ' kt-badge--danger' },
                        5: { 'title': 'Completed', 'class': ' kt-badge--success' },
                    };
                    return '<span class="kt-badge ' + status[row.Status].class + ' kt-badge--inline kt-badge--pill">' + status[row.Status].title + '</span>';
                },
            }, 
            {
                field: 'Actions',
                title: 'Actions',
                sortable: false,
                width: 110,
                overflow: 'visible',
                autoHide: false,
                template: function() {
                    return '\
                        <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-sm" data-toggle="modal" data-target="#kt_modal_e_work" title="Edit details">\
                            <i class="flaticon2-paper"></i>\
                        </a>\
                        <a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-sm" data-toggle="modal" data-target="#kt_modal_d_work" title="Delete">\
                            <i class="flaticon2-trash"></i>\
                        </a>\
                    ';
                },
            }],

        });

        $('#kt_form_status').on('change', function() {
            datatable.search($(this).val().toLowerCase(), 'Status');
        });

        $('#kt_form_type').on('change', function() {
            datatable.search($(this).val().toLowerCase(), 'Type');
        });

        $('#kt_form_status,#kt_form_type').selectpicker();

    };

    // users Datatable
    var users = function() {

        manageUsersTable = $('#users_table').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: 'https://www.dotcomsolutions.biz/assets/custom/users/retrieve.php',
                        // sample custom headers
                        // headers: {'x-my-custom-header': 'some value', 'x-test-header': 'the value'},
                        map: function(raw) {
                            // sample data mapping
                            var dataSet = raw;
                            if (typeof raw.data !== 'undefined') {
                                dataSet = raw.data;
                            }
                            return dataSet;
                        },
                    },
                },
                pageSize: 1,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
            },

            // layout definition
            layout: {
                scroll: false,
                footer: false,
            },

            // column sorting
            sortable: true,

            pagination: true,

            search: {
                input: $('#generalSearch'),
            },

            // columns definition
            columns: [{
                field: 'SN',
                title: '#',
                sortable: 'asc',
                width: 30,
                type: 'number',
                selector: false,
                textAlign: 'center',
            }, {
                field: 'username',
                title: 'Username'
            }, {
                field: 'password',
                title: 'Password',
            },{
                field: 'userlevel',
                title: 'User Type',
                // callback function support for column rendering
                template: function(row) {
                    var status = {
                        'sadmin_df56fdg': { 'title': 'Admin', 'class': 'kt-badge--success' },
                        'user_JDVjb4651dfs5': { 'title': 'Employee', 'class': ' kt-badge--danger' },
                    };
                    return '<span class="kt-badge ' + status[row.userlevel].class + ' kt-badge--inline kt-badge--pill">' + status[row.userlevel].title + '</span>';
                },
            }, 
            {
                field: 'Actions',
                title: 'Actions',
                sortable: false,
                width: 110,
                overflow: 'visible',
                autoHide: false,
            }],

        });

        $('#kt_user_type').on('change', function() {
            manageUsersTable.search($(this).val().toLowerCase(), 'Usertype');
        });

        $('#kt_user_type').selectpicker();

        $('#userlevel').select2({
            width: '100%',
            placeholder: 'Select User Type'
        });

        $('#edit_userlevel').select2({
            width: '100%',
            placeholder: 'Select User Type'
        });

    };

    // Clients Datatable
    var clients = function() {

        var client_datatable = $('#dcs_clients_datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: 'https://www.dotcomsolutions.biz/assets/custom/clients/retreive.php',
                        // sample custom headers
                        // headers: {'x-my-custom-header': 'some value', 'x-test-header': 'the value'},
                        map: function(raw) {
                            // sample data mapping
                            var dataSet = raw;
                            if (typeof raw.data !== 'undefined') {
                                dataSet = raw.data;
                            }
                            return dataSet;
                        },
                    },
                },
                pageSize: 20,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
            },

            // layout definition
            layout: {
                scroll: false,
                footer: false,
            },

            // column sorting
            sortable: true,

            pagination: true,

            search: {
                input: $('#generalSearch'),
            },

            // columns definition
            columns: [{
                field: 'SN',
                title: '#',
                sortable: 'asc',
                width: 30,
                type: 'number',
                selector: false,
                textAlign: 'center',
            }, {
                field: 'Name',
                title: 'Name',
                template: function(row) {
                    return row.Name + '<br/><strong>' + row.Company + '</strong>';
                },
            }, {
                field: 'Mobile',
                title: 'Contact Details',
                template: function(row) {
                    return row.Mobile + '<br/>' + row.Email;
                },
            }, {
                field: 'Address',
                title: 'Address',
            }, {
                field: 'Actions',
                title: 'Actions',
                sortable: false,
                width: 110,
                overflow: 'visible',
                autoHide: false,
                template: function() {
                    return '\
						<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-sm" title="Edit details">\
							<i class="flaticon2-paper"></i>\
						</a>\
						<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-sm" title="Delete">\
							<i class="flaticon2-trash"></i>\
						</a>\
					';
                },
            }],

        });

        $('#kt_form_status').on('change', function() {
            client_datatable.search($(this).val().toLowerCase(), 'Status');
        });

        $('#kt_form_type').on('change', function() {
            client_datatable.search($(this).val().toLowerCase(), 'Type');
        });

        $('#kt_form_status,#kt_form_type').selectpicker();

    };

    return {
        // public functions
        init: function() {
            demo();
            works();
            users();
            clients();
        },
    };
}();

// Add Service Form
var Service = function() {

    var client = $('#dcs_add_service');

    var showErrorMsg = function(form, type, msg) {
        var alert = $('<div class="alert alert-' + type + ' alert-dismissible" role="alert">\
            <div class="alert-text">'+msg+'</div>\
            <div class="alert-close">\
                <i class="flaticon2-cross kt-icon-sm" data-dismiss="alert"></i>\
            </div>\
        </div>');

        form.find('.alert').remove();
        alert.prependTo(form);
        //alert.animateClass('fadeIn animated');
        KTUtil.animateClass(alert[0], 'fadeIn animated');
        alert.find('span').html(msg);
    }



    var handleAddService = function() {
        $('#dcs_add_service_submit').click(function(e) {
            e.preventDefault();
            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    ser_name: {
                        required: true
                    },
                    ser_category: {
                        required: true
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            form.ajaxSubmit({
                type: "POST",
                url: "../assets/custom/services/create.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if(response.success == true)
                        addServiceToast();
                    else
                        addServiceToastError(response.messages);

                    //Reset The Form
                    $('#dcs_add_service')[0].reset();
                    // close the modal
                    $("#kt_modal_service").modal('hide');
                    $('#ser_category').val(null).trigger('change');
                    $('#ser_sub_category').val(null).trigger('change');
                    $('#ser_unit').val(null).trigger('change');
                    $('#ser_tax').val(null).trigger('change');
                }
            });
        });
    }

    // Public Functions
    return {
        // public functions
        init: function() {
            handleAddService();
        }
    };
}();

// Add Client Form
var Client = function() {

    var client = $('#dcs_add_client');

    var showErrorMsg = function(form, type, msg) {
        var alert = $('<div class="alert alert-' + type + ' alert-dismissible" role="alert">\
            <div class="alert-text">'+msg+'</div>\
            <div class="alert-close">\
                <i class="flaticon2-cross kt-icon-sm" data-dismiss="alert"></i>\
            </div>\
        </div>');

        form.find('.alert').remove();
        alert.prependTo(form);
        //alert.animateClass('fadeIn animated');
        KTUtil.animateClass(alert[0], 'fadeIn animated');
        alert.find('span').html(msg);
    }

    var handleAddClient = function() {
        $('#dcs_add_client_submit').click(function(e) {
            e.preventDefault();
            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    client_company: {
                        required: true
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            form.ajaxSubmit({
                type: "POST",
                url: "../assets/custom/clients/create.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if(response.success == true)
                        addClientToast();
                    else
                        addClientToastError(response.messages);

                    //Reset The Form
                    $('#dcs_add_client')[0].reset();
                    // close the modal
                    $("#kt_modal_client").modal('hide');
                }
            });
        });
    }

    // Public Functions
    return {
        // public functions
        init: function() {
            handleAddClient();
        }
    };
}();

// Add Supplier Form
var Supplier = function() {

    var client = $('#dcs_add_service');

    var showErrorMsg = function(form, type, msg) {
        var alert = $('<div class="alert alert-' + type + ' alert-dismissible" role="alert">\
            <div class="alert-text">'+msg+'</div>\
            <div class="alert-close">\
                <i class="flaticon2-cross kt-icon-sm" data-dismiss="alert"></i>\
            </div>\
        </div>');

        form.find('.alert').remove();
        alert.prependTo(form);
        //alert.animateClass('fadeIn animated');
        KTUtil.animateClass(alert[0], 'fadeIn animated');
        alert.find('span').html(msg);
    }

    var handleAddService = function() {
        $('#dcs_add_service_submit').click(function(e) {
            e.preventDefault();
            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    ser_name: {
                        required: true
                    },
                    ser_category: {
                        required: true
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            form.ajaxSubmit({
                type: "POST",
                url: "../assets/custom/services/create.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if(response.success == true)
                        addServiceToast();
                    else
                        addServiceToastError(response.messages);

                    //Reset The Form
                    $('#dcs_add_service')[0].reset();
                    // close the modal
                    $("#kt_modal_service").modal('hide');
                    $('#ser_category').val(null).trigger('change');
                    $('#ser_sub_category').val(null).trigger('change');
                    $('#ser_unit').val(null).trigger('change');
                    $('#ser_tax').val(null).trigger('change');
                }
            });
        });
    }

    // Public Functions
    return {
        // public functions
        init: function() {
            handleAddService();
        }
    };
}();

// Add Work Form
var Work = function() {

    var client = $('#dcs_add_service');

    var showErrorMsg = function(form, type, msg) {
        var alert = $('<div class="alert alert-' + type + ' alert-dismissible" role="alert">\
            <div class="alert-text">'+msg+'</div>\
            <div class="alert-close">\
                <i class="flaticon2-cross kt-icon-sm" data-dismiss="alert"></i>\
            </div>\
        </div>');

        form.find('.alert').remove();
        alert.prependTo(form);
        //alert.animateClass('fadeIn animated');
        KTUtil.animateClass(alert[0], 'fadeIn animated');
        alert.find('span').html(msg);
    }

    var handleAddService = function() {
        $('#dcs_add_service_submit').click(function(e) {
            e.preventDefault();
            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    ser_name: {
                        required: true
                    },
                    ser_category: {
                        required: true
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            form.ajaxSubmit({
                type: "POST",
                url: "../assets/custom/services/create.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if(response.success == true)
                        addServiceToast();
                    else
                        addServiceToastError(response.messages);

                    //Reset The Form
                    $('#dcs_add_service')[0].reset();
                    // close the modal
                    $("#kt_modal_service").modal('hide');
                    $('#ser_category').val(null).trigger('change');
                    $('#ser_sub_category').val(null).trigger('change');
                    $('#ser_unit').val(null).trigger('change');
                    $('#ser_tax').val(null).trigger('change');
                }
            });
        });
    }

    // Public Functions
    return {
        // public functions
        init: function() {
            handleAddService();
        }
    };
}();

// Add User Form
var User = function() {

    var client = $('#dcs_add_user');

    var showErrorMsg = function(form, type, msg) {
        var alert = $('<div class="alert alert-' + type + ' alert-dismissible" role="alert">\
            <div class="alert-text">'+msg+'</div>\
            <div class="alert-close">\
                <i class="flaticon2-cross kt-icon-sm" data-dismiss="alert"></i>\
            </div>\
        </div>');

        form.find('.alert').remove();
        alert.prependTo(form);
        //alert.animateClass('fadeIn animated');
        KTUtil.animateClass(alert[0], 'fadeIn animated');
        alert.find('span').html(msg);
    }

    var handleAddService = function() {
        $('#dcs_add_user_submit').click(function(e) {
            e.preventDefault();
            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    username: {
                        required: true
                    },
                    password: {
                        required: true
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            form.ajaxSubmit({
                type: "POST",
                url: "../assets/custom/users/create.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if(response.success == true)
                        addUserToast(response.messages);
                    else
                        addUserToastError(response.messages);

                    //Reset The Form
                    $('#dcs_add_user')[0].reset();
                    // close the modal
                    $("#kt_modal_user").modal('hide');
                    manageUsersTable.reload();
                    $('#userlevel').val(null).trigger('change');
                }
            });
        });
    }

    var handleUpdateService = function() {
        $('#dcs_edit_user_submit').click(function(e) {
            e.preventDefault();
            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    edit_username: {
                        required: true
                    },
                    edit_password: {
                        required: true
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            form.ajaxSubmit({
                type: "POST",
                url: "../assets/custom/users/update.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if(response.success == true)
                        editUserToast(response.messages);
                    else
                        editUserToastError(response.messages);

                    //Reset The Form
                    $('#dcs_edit_user')[0].reset();
                    // close the modal
                    $("#kt_modal_e_user").modal('hide');
                    manageUsersTable.reload();
                    $('#edit_userlevel').val(null).trigger('change');
                }
            });
        });
    }

    // Public Functions
    return {
        // public functions
        init: function() {
            handleAddService();
            handleUpdateService();
        }
    };
}();

function editUser(id){
    if (id) {
        $.ajax({
            url: 'https://www.dotcomsolutions.biz/assets/custom/users/getSelectedUser.php',
            type: 'post',
            data: { member_id: id },
            dataType: 'json',
            success: function(response) {
                $("#edit_id").val(response.id);
                $("#edit_username").val(response.username);
                $("#edit_password").val(response.password);

                $("#edit_userlevel").val(response.userlevel) //select option of select2
                    .trigger("change"); //apply to select2

            } // /success
        }); // /fetch selected member info
    } else {
        alert('Error : Please refresh the page');
    }
}

function removeUser(id = true) {
    if (id) {
        //click remove button
        $('#dcs_delete_user_submit').unbind('click').bind('click', function() {

            $.ajax({
                url: 'https://www.dotcomsolutions.biz/assets/custom/users/delete.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {
                    if(response.success == true){
                        deleteUserToast(response.messages);
                    }
                    else{
                        deleteUserToastError(response.messages);
                    }

                    // close the modal
                    $("#kt_modal_d_user").modal('hide');
                    manageUsersTable.reload();
                }
            });
        });
        // click remove button
    } else {
        alert('Error : Please refresh the page');
    }
}

jQuery(document).ready(function() {
    KTDatatableRemoteAjaxDemo.init();
    
    Service.init();
    Client.init();
    User.init();
    // Supplier.init();
    // Work.init();

    $('#ser_category').select2({
        width: '100%',
        placeholder: 'Select Category'
    });

    $('#ser_sub_category').select2({
        width: '100%',
        placeholder: 'Select Sub Category'
    });

    $('#ser_unit').select2({
        width: '100%',
        placeholder: 'Select Unit'
    });

    $('#ser_tax').select2({
        width: '100%',
        placeholder: 'Select Tax'
    });
});

function addServiceToast() {
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "preventDuplicates": true,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };

    toastr.success("Service successfully added.!", "Successfully Added");
}

function addServiceToastError(error) {
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "preventDuplicates": true,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };

    toastr.error(error, "Error !!");
}

function addUserToast(msg) {
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "preventDuplicates": true,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };

    toastr.success(msg, "Successfully Added");
}

function addUserToastError(msg) {
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "preventDuplicates": true,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };

    toastr.error(msg, "Error !!");
}

function editUserToast(msg) {
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "preventDuplicates": true,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };

    toastr.success(msg, "Successfully Added");
}

function editUserToastError(msg) {
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "preventDuplicates": true,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };

    toastr.error(msg, "Error !!");
}

function deleteUserToast(msg) {
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "preventDuplicates": true,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };

    toastr.success(msg, "Successfully Added");
}

function deleteUserToastError(msg) {
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "preventDuplicates": true,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };

    toastr.error(msg, "Error !!");
}

function addClientToast() {
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "preventDuplicates": true,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };

    toastr.success("Client successfully added.!", "Successfully Added");
}

function addClientToastError(error) {
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "preventDuplicates": true,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };

    toastr.error(error, "Error !!");
}