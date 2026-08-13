"use strict";
// Global Variables
var manageDashboardTable = '';
var manageSampleRequestsTable = '';
var manageProductTable = '';
var manageClientTable = '';
var manageTransporterTable = '';
var manageSupplierTable = '';
var manageUsersTable = '';
var manageWhatsAppTable = '';
var manageBankTable = '';
var managePDPurchaseTable = '';
var managePDSalesTable = '';
var managePDSalesOrderTable = '';
var managePDQuotationTable = '';
var managePDEnquiryTable = '';
var manageEnquiryTable = '';
var manageQuotationTable = '';
var manageSalesOrderTable = '';
var manageSalesInvoiceTable = '';
var manageSalesLedgerTable = '';
var manageReceiptsTable = '';
var manageSalesFollowupTable = '';
var managePurchaseBagTable = '';
var managePurchaseOrderTable = '';
var managePurchaseInvoiceTable = '';
var managePurchaseLedgerTable = '';
var managePaymentsTable = '';
var manageAssembliesTable = '';
var manageAssembliesOperationTable = '';
var manageFollowupTable = '';

var param_page = '';
var selected_supplier = '';
var selected_client = '';

var portlet = new KTPortlet('kt_portlet_add_primary');

jQuery(document).ready(function() {
    
    Datatables.init();
    
    let searchParams = new URLSearchParams(window.location.search);
    let url = window.location.href;

    if (url.includes('sample-request')){
        var input = document.querySelector('#contact_person_number');

        var iti = window.intlTelInput(input, {
            // NationalMode: true,
            preferredCountries: ['in'],
            // PreventInvalidNumbers: true,
            utilsScript: "../assets/js/pages/custom/tel_input/js/utils.js"
        });

        var handleChange = function() {
          var text = (iti.isValidNumber()) ? $("#contact_person_number_full").val(iti.getNumber()) : $("#contact_person_number_full").val("");
        };

        // Listen to "keyup", but also "change" to update when the user selects a country
        input.addEventListener('change', handleChange);
        input.addEventListener('keyup', handleChange);
    } else {
        FormRepeater.init();
    }

    Select2.init();
    Modals.init();

    Purchase_Bag.init();
    Sample.init();
    Settings.init();
    Product.init();
    Client.init();
    Supplier.init();
    User.init();
    Assemblies.init();
    Payments.init();
    Receipts.init();
    Bank.init();
    Transportrer.init();
    SalesFollowup.init();
    Followup.init();
    Whatsapp.init();

    if (searchParams.has('page')) {
        param_page = searchParams.get('page');
    }

    if (param_page == 'quotation') {
        if (searchParams.has('enquiry_no')) {
            $('[data-repeater-list="quotation"]').empty();
            $('[data-repeater-create="quotation"]').click();
            var tmp = "input[name$='quotation[0][q_sn]']";
            $(tmp).val(1);

            var id = searchParams.get('enquiry_no');
            $.ajax({
                url: '../assets/custom/enquiry/getSelectedEnquiryQuotation.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response1) {
                    var temp = '';
                    $('#q_enquiry_date').val(response1.enquiry_date);
                    $('#q_cl_enquiry_no').val(response1.cl_enquiry);
                    var enquiry_no = new Array();
                    enquiry_no.push(id);
                    $('#q_enquiry_no').append($("<option/>").val(id).text(id)).val(enquiry_no).trigger("change");
                    $('#q_client').val(response1.client);
                    $('#q_client').empty().append($("<option/>").val(response1.client).text(response1.client)).val(response1.client).trigger("change");

                    var obj = JSON.parse(response1.items);
                    var length = obj.product.length;
                    var count = 0;
                    var c = 0;

                    for (var i = 1; i < length; i++) {
                        $('#qtn_btn_add').click();
                    }
                    for (var i = 0; i < length; i++) {

                        if (obj.quantity[i] > 0) {
                            temp = "select[name$='quotation[" + c + "][q_product_name]']";
                            var pr = obj.product[i];
                            $(temp).empty().append($("<option/>").val(pr).text(pr)).val(pr).trigger("change");

                            temp = "input[name$='quotation[" + c + "][q_qty]']";
                            $(temp).val(obj.quantity[i]);
                            temp = "textarea[name$='quotation[" + c + "][q_product_add_description]']";

                            var temp_val = obj.desc[i];
                            temp_val = temp_val.replace(/\|/g, "\r\n");
                            $(temp).val(temp_val);

                            $.ajax({
                                url: '../assets/custom/api_get/get_product_info.php',
                                type: 'post',
                                data: { member_id: pr },
                                dataType: 'json',
                                async: false,
                                success: function(response) {
                                    temp = "input[name$='quotation[" + c + "][q_rate]']";
                                    $(temp).val(response.rate);
                                    temp = "select[name$='quotation[" + c + "][q_unit]']";
                                    $(temp).empty().append($("<option/>").val(response.unit).text(response.unit)).val(response.unit).trigger("change");
                                    temp = "input[name$='quotation[" + c + "][q_hsn]']";
                                    $(temp).val(response.hsn);
                                    temp = "select[name$='quotation[" + c + "][q_tax]']";
                                    $(temp).val(response.tax).trigger("change");
                                    // temp = "select[name$='quotation[" + c + "][q_display_make]']";
                                    // $(temp).val(response.default_make).trigger("change");

                                }
                            });
                            c++;
                        }

                    }
                    // q_preview(e);

                }
            });
        }
    }

    if (param_page == 'enquiries') {
        set_enquiry_no();
        $('[data-repeater-list="enquiry"]').empty();
        $('[data-repeater-create="enquiry"]').click();
        var tmp = "input[name$='enquiry[0][e_sn]']";
        $(tmp).val(1);
        Enquiry.init();      
    }

    if (param_page == 'quotation') {
        set_quotation_no();
        $('[data-repeater-list="quotation"]').empty();
        $('[data-repeater-create="quotation"]').click();
        var tmp = "input[name$='quotation[0][q_sn]']";
        $(tmp).val(1);
        Quotation.init();
    }

    if (param_page == 'sales_order') {
        set_sales_order_no();
        $('[data-repeater-list="sales_order"]').empty();
        $('[data-repeater-create="sales_order"]').click();
        var tmp = "input[name$='sales_order[0][so_sn]']";
        $(tmp).val(1);
        Sales_Order.init();
    }

    if (param_page == 'sales' || param_page == 'test') {
        set_sales_invoice_no('PRIMARY');
        $('[data-repeater-list="sales_invoice"]').empty();
        $('[data-repeater-create="sales_invoice"]').click();
        var tmp = "input[name$='sales_invoice[0][si_sn]']";
        $(tmp).val(1);
        Sales_Invoice.init();
    }

    if (param_page == 'purchase_order') {
        Purchase_Order_Group.init();
        set_purchase_order_no();
        $('[data-repeater-list="purchase_order"]').empty();
        $('[data-repeater-create="purchase_order"]').click();
        var tmp = "input[name$='purchase_order[0][po_sn]']";
        $(tmp).val(1);
        Purchase_Order.init();
        $("#bulk_discount_btn").click(function(e) { po_discount(e); });
    }

    if (param_page == 'purchase') {
        $('[data-repeater-list="purchase_invoice"]').empty();
        $('[data-repeater-create="purchase_invoice"]').click();
        var tmp = "input[name$='purchase_invoice[0][pi_sn]']";
        $(tmp).val(1);
        Purchase_Invoice.init();
    }

    if (param_page == 'product') {
        Product_Group.init();
        $('#kt_datatable_check_all').on('click', function() {
            // datatable.setActiveAll(true);
            $('#product_datatable').KTDatatable('setActiveAll', true);
        });
    }

    if (param_page == 'whatsapp') {
        var input = document.querySelector('#wa_mobile_test_temp');

        var iti = window.intlTelInput(input, {
            // NationalMode: true,
            preferredCountries: ['in'],
            // PreventInvalidNumbers: true,
            utilsScript: "../assets/js/pages/custom/tel_input/js/utils.js"
        });

        var handleChange = function() {
          var text = (iti.isValidNumber()) ? $("#wa_mobile_test").val(iti.getNumber()) : $("#wa_mobile_test").val("");
        };

        // Listen to "keyup", but also "change" to update when the user selects a country
        input.addEventListener('change', handleChange);
        input.addEventListener('keyup', handleChange);
    }



    $('.summernote').summernote({
        height: 150,
        toolbar: [
            ['style', ['bold', 'italic', 'underline']]
        ],
        callbacks: {
            onChange: function(contents, $editable) {
                $(this).val(contents);
            }
        }
    });

    $("#update_products").on("click", function() {

        $.ajax({
            url: '../assets/custom/api_excel/update_products.php',
            type: 'post',
            data: {},
            dataType: 'json',
            success: function(response) {
                if (response.success == true) {
                    swal.fire({
                        position: 'top-right',
                        type: 'success',
                        title: 'Products Updated Successfully!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else {
                    swal.fire({
                        position: 'top-right',
                        type: 'error',
                        title: 'There were some errors in your submission.',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }

            } // /success
        }); // /fetch selected member info

    });

    $("#add_products").on("click", function() {

        $.ajax({
            url: '../assets/custom/api_excel/add_products.php',
            type: 'post',
            data: {},
            dataType: 'json',
            success: function(response) {
                if (response.success == true) {
                    swal.fire({
                        position: 'top-right',
                        type: 'success',
                        title: 'Products Updated Successfully!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else {
                    swal.fire({
                        position: 'top-right',
                        type: 'error',
                        title: 'There were some errors in your submission.',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }

            } // /success
        }); // /fetch selected member info

    });

});

function appendLeadingZeroes(n) {
    if (n <= 9) {
        return "0" + n;
    }
    return n
}

var Product_Group = function() {

    var selection = function() {

        // event handler on check and uncheck on records
        manageProductTable.on('kt-datatable--on-check kt-datatable--on-uncheck kt-datatable--on-layout-updated', function(e) {
            var checkedNodes = manageProductTable.rows('.kt-datatable__row--active').nodes(); // get selected records
            var count = checkedNodes.length; // selected records count

            $('#kt_subheader_group_selected_rows').html(count);

            if (count > 0) {
                $('#kt_subheader_search').addClass('kt-hidden');
                $('#kt_subheader_group_actions').removeClass('kt-hidden');
            } else {
                $('#kt_subheader_search').removeClass('kt-hidden');
                $('#kt_subheader_group_actions').addClass('kt-hidden');
            }
        });
    }

    var selectedExport = function() {

        $('#kt_subheader_group_actions_product_excel').on('click', function() {

            var ids = manageProductTable.rows('.kt-datatable__row--active').nodes().find('.kt-checkbox--single > [type="checkbox"]').map(function(i, chk) {
                return $(chk).val();
            });

            var id_list = '';

            for (var i = 0; i < ids.length; i++) {

                if (i == (ids.length - 1))
                    id_list += ids[i];
                else
                    id_list += ids[i] + ',';


            }

            var url = 'https://www.asmacrm.com/assets/custom/api_excel/export_product.php?ids=' + id_list;
            console.log(url);
            window.open(url, '_blank');
            generateExcel("Excel file is being generated, kindly wait for 5 mins and then download the file");


        });
    }

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    return {
        // public functions
        init: function() {
            selection();
            selectedExport();
        },
    };
}();

var Purchase_Order_Group = function() {

    var selectionPO = function() {
        // event handler on check and uncheck on records
        managePurchaseBagTable.on('kt-datatable--on-check kt-datatable--on-uncheck kt-datatable--on-layout-updated', function(e) {
            var checkedNodes = managePurchaseBagTable.rows('.kt-datatable__row--active').nodes(); // get selected records
            var count = checkedNodes.length; // selected records count
            // console.log("Clicked");
            $('#kt_subheader_group_selected_rows_PO').html(count);

            if (count > 0) {
                $('#kt_subheader_search').addClass('kt-hidden');
                $('#kt_subheader_group_actions_purchase_order').removeClass('kt-hidden');
            } else {
                $('#kt_subheader_search').removeClass('kt-hidden');
                $('#kt_subheader_group_actions_purchase_order').addClass('kt-hidden');
            }
        });
    }

    var selectedAdd = function() {

        $('#kt_subheader_group_actions_bag_po').on('click', function() {

            var ids = managePurchaseBagTable.rows('.kt-datatable__row--active').nodes().find('.kt-checkbox--single > [type="checkbox"]').map(function(i, chk) {
                return $(chk).val();
            });

            var id_list = '';
            var id = '';

            for (var i = 0; i < ids.length; i++) {

                id = ids[i];
                var flag = 0;

                $.ajax({
                    url: '../assets/custom/purchase_bag/getSelectedPurchaseBag.php',
                    type: 'post',
                    data: { member_id: id },
                    dataType: 'json',
                    success: function(response) {

                        var tmp = "input[name$='purchase_order[0][po_product_description]']";
                        var desc = $(tmp).val();
                        console.log(desc);

                        var rep = document.getElementById('purchase_order_list');
                        var rowsCount = rep.childNodes.length;

                        if (rowsCount == 1 && desc == '' && flag == '0') {
                            rowsCount -= 1;
                            flag = 1;
                        } else {
                            $('[data-repeater-create="purchase_order"]').click();
                        }

                        var tmp = "select[name$='purchase_order[" + rowsCount + "][po_product_name]']";
                        var pr = response.product_name;
                        $(tmp).empty().append($("<option/>").val(pr).text(pr)).val(pr).trigger("change");
                        console.log(tmp);

                        tmp = "input[name$='purchase_order[" + rowsCount + "][po_qty]']";
                        $(tmp).val(response.quantity);
                        $("#po_pf").val('0');


                    }
                });
            }


            managePurchaseBagTable.reload();
            swal.fire({
                position: 'top-right',
                type: 'info',
                title: 'Products Added in the list above.',
                showConfirmButton: false,
                timer: 1500
            });


        });
    }

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    return {
        // public functions
        init: function() {
            selectionPO();
            selectedAdd();
        },
    };
}();

var Modals = function() {

    var products = function() {
        $('#kt_modal_product').on('hidden.bs.modal', function() {
            $('#add_product')[0].reset();
            $('#product_name').val(null).trigger('change');
            $('#product_group_name').val(null).trigger('change');
            $('#product_category').val(null).trigger('change');
            $('#product_sub_category').val(null).trigger('change');
            $('#product_unit').val(null).trigger('change');
            $('#product_tax').val(null).trigger('change');
            console.log("hidden");
        });
    };
    var clients = function() {
        $('#kt_modal_client').on('hidden.bs.modal', function() {
            $('#dcs_add_client')[0].reset();
            $('#client_category').val(null).trigger('change');
            $('#client_state').val(null).trigger('change');
            console.log("hidden");
        });
    };
    var suppliers = function() {
        $('#kt_modal_supplier').on('hidden.bs.modal', function() {
            $('#dcs_add_supplier')[0].reset();
            $('#supplier_category').val(null).trigger('change');
            $('#supplier_state').val(null).trigger('change');
            console.log("hidden");
        });
    };

    return {
        init: function() {
            products();
            clients();
            suppliers();

        },
    };
}();

var Datatables = function() {

    var dashboard = function() {

        manageDashboardTable = $('#product_dashboard_datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '../assets/custom/dashboard/retrieve.php',
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
                pageSize: 10,
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
            sortable: false,

            pagination: true,

            search: {
                input: $('#generalSearch'),
            },

            // columns definition
            columns: [{
                field: 'SN',
                title: '#',
                sortable: 'asc',
                width: 15,
                selector: {
                    class: 'kt-checkbox--solid'
                },
                textAlign: 'center',
            }, {
                field: 'Name',
                title: 'Name',
                width: 250,
                template: function(row) {
                    return '<strong>' + row.Name + '</strong><br/><span class="form-text text-muted" style="font-size: 12px;">' + row.Description + '</span>';
                },
            }, {
                field: 'Group',
                title: 'Group',
                width: 75,
                template: function(row) {
                    return '<span class="kt-badge kt-badge--success kt-badge--inline kt-badge--pill">' + row.Group + '</span>';
                },
                textAlign: 'center',
            }, {
                field: 'Category',
                title: 'Category',
                textAlign: 'center',
            }, {
                field: 'Sub-Category',
                title: 'Sub-Category',
                textAlign: 'center',
            }, {
                field: 'Rate',
                title: 'Rate',
                textAlign: 'center',
                template: function(row) {
                    return 'Rs. ' + row.Rate + '.00';
                },
            }, {
                field: 'HSN',
                title: 'HSN',
                textAlign: 'center',
            }, {
                field: 'Unit',
                title: 'Current Stock',
                textAlign: 'center',
                template: function(row) {
                    var stock = row.Opening_stock + ' ' + row.Unit;
                    return '<span class="kt-badge kt-badge--danger kt-badge--inline kt-badge--pill">' + stock + '</span>';

                },
            }, {
                field: 'Actions',
                title: 'Actions',
                width: 80,
                textAlign: 'center',
                overflow: 'visible',
                autoHide: false,
            }],

        });
    };

    var sample_requests = function() {

        manageSampleRequestsTable = $('#sample_requests_datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '../assets/custom/sample/retrieve.php',
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
                pageSize: 10,
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
            sortable: false,

            pagination: true,

            search: {
                input: $('#generalSearch'),
            },

            // columns definition
            columns: [{
                field: 'SN',
                title: '#',
                sortable: 'asc',
                width: 15,
                selector: {
                    class: 'kt-checkbox--solid'
                },
                textAlign: 'center',
            }, {
                field: 'Company',
                title: 'Company',
                width: 250,
                template: function(row) {
                    return '<strong>' + row.Company + '</strong><br/><span class="form-text text-muted" style="font-size: 12px;">' + row.Name + '</span>';
                },
            }, {
                field: 'Mobile',
                title: 'Category',
                template: function(row) {
                    return '<span class="form-text" style="font-size: 12px;">' + row.Mobile + '</span><br /><span class="form-text" style="font-size: 12px;">' + row.Email + '</span>';
                },
            }, {
                field: 'Address',
                title: 'Address',
                textAlign: 'center',
                template: function(row) {
                    return '<span class="form-text" style="font-size: 12px;">' + row.Address + '</span><br /><span class="form-text" style="font-size: 12px;">Pincode: ' + row.Pincode + '</span>';
                },
            }, {
                field: 'Thickness',
                title: 'Thickness',
                textAlign: 'center',
            }, {
                field: 'Width',
                title: 'Width',
                textAlign: 'center',
            }, {
                field: 'Quality',
                title: 'Quality',
                textAlign: 'center',
            }, {
                field: 'Additional',
                title: 'Additional',
                textAlign: 'center',
            }, {
                field: 'Status',
                title: 'Status',
                template: function(row) {
                    var status = {
                        0: { 'title': 'Pending', 'class': 'kt-badge--primary' },
                        1: { 'title': 'Fulfilled', 'class': ' kt-badge--success' },
                    };
                    return '<span class="kt-badge ' + status[row.Status].class + ' kt-badge--inline kt-badge--pill">' + status[row.Status].title + '</span>';
                },
            }, {
                field: 'Date',
                title: 'Date',
                textAlign: 'center',
            }, {
                field: 'Actions',
                title: 'Actions',
                width: 80,
                textAlign: 'center',
                overflow: 'visible',
                autoHide: false,
            }],

        });
    };

    var products = function() {

        manageProductTable = $('#product_datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '../assets/custom/product/retrieve.php',
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
                pageSize: 10,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
            },

            // layout definition
            layout: {
                scroll: false,
                footer: false,
            },

            toolbar: {
                layout: ['pagination', 'info'],
                placement: ['bottom'],
                items: {
                    pagination: {
                        pageSizeSelect: [10, 25, 50, 100, 250, 500],
                    },
                },
            },

            // column sorting
            sortable: false,

            pagination: true,

            search: {
                input: $('#generalSearch'),
            },

            // columns definition
            columns: [{
                field: 'SN',
                title: '#',
                sortable: 'asc',
                width: 20,
                selector: {
                    class: 'kt-checkbox--solid'
                },
                textAlign: 'center',
            }, {
                field: 'Name',
                title: 'Name',
                template: function(row) {
                    return row.Name + '<br/><span class="form-text text-muted" style="font-size: 9px;">' + row.Description + "</span>";
                },
            }, {
                field: 'Group',
                title: 'Group',
            }, {
                field: 'Category',
                title: 'Category',
            }, {
                field: 'Sub-Category',
                title: 'Sub-Category',
            }, {
                field: 'Rate',
                title: 'Rate',
                template: function(row) {
                    return 'Rs. ' + row.Rate + '.00';
                },
            }, {
                field: 'Tax',
                title: 'Tax',
                template: function(row) {
                    return row.Tax + ' %<br/>HSN : ' + row.HSN;
                },
            }, {
                field: 'Unit',
                title: 'Initial Stock',
                template: function(row) {
                    return row.Opening_stock + ' ' + row.Unit;
                },
            }, {
                field: 'Actions',
                title: 'Actions',
                sortable: false,
                width: 110,
                overflow: 'visible',
                autoHide: false,
            }],

        });
    };

    var clients = function() {

        manageClientTable = $('#dcs_clients_datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '../assets/custom/clients/retrieve.php',
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
                    sortable: false,
                    width: 20,
                    selector: {
                        class: 'kt-checkbox--solid'
                    },
                    textAlign: 'center',
                }, {
                    field: "Name",
                    title: "Name",
                    template: function(row) {
                        var output = '' +
                            '<div class="kt-user-card-v2">';
                        //     '<div class="kt-user-card-v2__pic">';
                        // output += '<span class="kt-badge ' + row.KT_Class + ' kt-badge--xl">' + row.Name.charAt(0) + '</span>';
                        // output += '</div>' +
                        output += '<div class="kt-user-card-v2__details">';
                        output += '<a href="?page=client_ledger&id=' + row.Id + '" class="kt-user-card-v2__name">' + row.Name + '</a></br>';
                        output += '<span class="kt-user-card-v2__desc">' + row.GSTIN + '</span>';
                        output += '</div></div>';
                        return output;
                    },
                }, {
                    field: 'Contact_Name',
                    title: 'Contact Details',
                    template: function(row) {
                        var output = row.Contact_Name + '</br>' + row.Designation + '</br>' + row.Mobile + '</br>' + row.Email;
                        return output;
                    },
                }, {
                    field: 'Add1',
                    title: 'Address',
                    template: function(row) {
                        var output = row.Add1 + '</br>' + row.Add2 + '</br>' + row.City + '-' + row.Pincode + '</br>' + row.State + ', ' + row.Country;
                        return output;
                    },
                },
                {
                    field: 'Bank_Client',
                    title: 'Bank Details',
                    template: function(row) {
                        var output = row.Bank_Client + '</br>' + row.Bank_Name + '</br>' + row.Bank_Account + '</br>' + row.Bank_IFSC;
                        return output;
                    },
                }, {
                    field: 'Actions',
                    title: 'Actions',
                    sortable: false,
                    width: 110,
                    overflow: 'visible',
                    autoHide: false,
                }
            ],

        });
    };

    var transporters = function() {

        manageTransporterTable = $('#dcs_transporters_datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '../assets/custom/transporters/retrieve.php',
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
                    sortable: false,
                    width: 20,
                    selector: {
                        class: 'kt-checkbox--solid'
                    },
                    textAlign: 'center',
                }, {
                    field: "Name",
                    title: "Name",
                    template: function(row) {
                        var output = '' +
                            '<div class="kt-user-card-v2">';
                        //     '<div class="kt-user-card-v2__pic">';
                        // output += '<span class="kt-badge ' + row.KT_Class + ' kt-badge--xl">' + row.Name.charAt(0) + '</span>';
                        // output += '</div>' +
                        output += '<div class="kt-user-card-v2__details">';
                        output += '<a href="?page=client_ledger&id=' + row.Id + '" class="kt-user-card-v2__name">' + row.Name + '</a></br>';
                        output += '<span class="kt-user-card-v2__desc">' + row.GSTIN + '</span>';
                        output += '</div></div>';
                        return output;
                    },
                }, {
                    field: 'Add1',
                    title: 'Address',
                    template: function(row) {
                        var output = row.Add1 + '</br>' + row.Add2 + '</br>' + row.City + '-' + row.Pincode + '</br>' + row.State + ', ' + row.Country;
                        return output;
                    },
                },
                {
                    field: 'Actions',
                    title: 'Actions',
                    sortable: false,
                    width: 110,
                    overflow: 'visible',
                    autoHide: false,
                }
            ],

        });
    };

    var suppliers = function() {

        manageSupplierTable = $('#dcs_suppliers_datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '../assets/custom/suppliers/retrieve.php',
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
                    sortable: false,
                    width: 20,
                    selector: {
                        class: 'kt-checkbox--solid'
                    },
                    textAlign: 'center',
                }, {
                    field: "Name",
                    title: "Name",
                    template: function(row) {
                        var output = '' +
                            '<div class="kt-user-card-v2">';
                        // '<div class="kt-user-card-v2__pic">';
                        // output += '<span class="kt-badge ' + row.KT_Class + ' kt-badge--xl">' + row.Name.charAt(0) + '</span>';
                        // output += '</div>' +
                        output += '<div class="kt-user-card-v2__details">';
                        output += '<a href="?page=supplier_ledger&id=' + row.Id + '" class="kt-user-card-v2__name">' + row.Name + '</a></br>';
                        output += '<span class="kt-user-card-v2__desc">' + row.GSTIN + '</span>';
                        output += '</div></div>';
                        return output;
                    },
                }, {
                    field: 'Contact_Name',
                    title: 'Contact Details',
                    template: function(row) {
                        var output = row.Contact_Name + '</br>' + row.Designation + '</br>' + row.Mobile + '</br>' + row.Email;
                        return output;
                    },
                }, {
                    field: 'Add1',
                    title: 'Address',
                    template: function(row) {
                        var output = row.Add1 + '</br>' + row.Add2 + '</br>' + row.City + '</br>' + row.State + '-' + row.Pincode;
                        return output;
                    },
                },
                {
                    field: 'Bank_Supplier',
                    title: 'Bank Details',
                    template: function(row) {
                        var output = row.Bank_Supplier + '</br>' + row.Bank_Name + '</br>' + row.Bank_Account + '</br>' + row.Bank_IFSC;
                        return output;
                    },
                }, {
                    field: 'Actions',
                    title: 'Actions',
                    sortable: false,
                    width: 110,
                    overflow: 'visible',
                    autoHide: false,
                }
            ],

        });
    };

    var users = function() {

        manageUsersTable = $('#users_table').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '../assets/custom/users/retrieve.php',
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
                    field: 'name',
                    title: 'Name',
                }, {
                    field: 'username',
                    title: 'Username'
                }, {
                    field: 'mobile',
                    title: 'Mobile',
                }, {
                    field: 'email',
                    title: 'Email',
                }, {
                    field: 'userlevel',
                    title: 'User Type',
                    // callback function support for column rendering
                    template: function(row) {
                        var status = {
                            'sadmin_df56fdg': { 'title': 'Admin', 'class': 'kt-badge--success' },
                            'sales_HgdK5254SHdg': { 'title': 'Sales', 'class': ' kt-badge--info' },
                            'purchase_LK85SDhg6dfd': { 'title': 'Purchase', 'class': ' kt-badge--danger' },
                        };
                        return '<span class="kt-badge ' + status[row.userlevel].class + ' kt-badge--inline kt-badge--pill">' + status[row.userlevel].title + '</span>';
                    },
                },
                {
                    field: 'Actions',
                    title: 'Actions',
                    sortable: false,
                    width: 80,
                    overflow: 'visible',
                    autoHide: false,
                }
            ],

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

    var whatsapp = function() {

        if (!$('#students_datatable').length) {
            return;
        }

        manageWhatsAppTable = $('#students_datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '../assets/custom/students/retrieve.php',
                        map: function(raw) {
                            var dataSet = raw;
                            if (typeof raw.data !== 'undefined') {
                                dataSet = raw.data;
                            }
                            return dataSet;
                        },
                    },
                },
                pageSize: 10,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
            },

            // layout definition
            layout: {
                scroll: true,
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
                    width: 40,
                    type: 'number',
                    selector: false,
                    textAlign: 'center',
                }, {
                    field: 'name',
                    title: 'Child Name',
                    width: 140,
                }, {
                    field: 'its',
                    title: 'ITS',
                    width: 90,
                }, {
                    field: 'class',
                    title: 'Class',
                    width: 70,
                }, {
                    field: 'section',
                    title: 'Section',
                    width: 70,
                }, {
                    field: 'father_name',
                    title: 'Father',
                    width: 120,
                }, {
                    field: 'father_mobile',
                    title: 'Father Mobile',
                    width: 110,
                }, {
                    field: 'mother_name',
                    title: 'Mother',
                    width: 120,
                }, {
                    field: 'mother_mobile',
                    title: 'Mother Mobile',
                    width: 110,
                }, {
                    field: 'custom_1',
                    title: 'Custom 1',
                    width: 100,
                }, {
                    field: 'custom_2',
                    title: 'Custom 2',
                    width: 100,
                }, {
                    field: 'custom_3',
                    title: 'Custom 3',
                    width: 100,
                }
            ],

        });
    };

    var bank = function() {

        manageBankTable = $('#bank_datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '../assets/custom/banks/retrieve.php',
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
                    sortable: false,
                    width: 20,
                    selector: {
                        class: 'kt-checkbox--solid'
                    },
                    textAlign: 'center',
                }, {
                    field: 'Account_Name',
                    title: 'Account Name'
                }, {
                    field: "Bank_Name",
                    title: "Bank Name"
                }, {
                    field: 'Account_Number',
                    title: 'Account Number'
                },
                {
                    field: 'Bank_IFSC',
                    title: 'IFSC Code'
                },
                {
                    field: 'Actions',
                    title: 'Actions'
                }
            ],

        });
    };

    var enquiry = function() {

        manageEnquiryTable = $('#enquiry_datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '../assets/custom/enquiry/retrieve.php',
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
                pageSize: 10,
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
            sortable: false,

            pagination: true,

            detail: {
                title: 'Load products',
                content: subTableInitQ,
            },

            search: {
                input: $('#generalSearch'),
            },

            // columns definition
            columns: [{
                    field: 'RecordID',
                    title: '',
                    sortable: false,
                    width: 30,
                    textAlign: 'center',
                }, {
                    field: 'SN',
                    title: '',
                    template: '{{RecordID}}',
                    width: 20,
                    selector: {
                        class: 'kt-checkbox--solid'
                    },
                    textAlign: 'center',
                }, {
                    field: 'Client',
                    title: 'Client',
                    width: 200,

                }, {
                    field: 'Enquiry_no',
                    title: 'Enquiry No',
                }, {
                    field: 'Date',
                    title: 'Date',
                }, {
                    field: 'Mode',
                    title: 'Mode',
                },
                {
                    field: 'Status',
                    title: 'Status',
                    template: function(row) {
                        var status = {
                            0: { 'title': 'Pending', 'class': 'kt-badge--primary' },
                            1: { 'title': 'Completed', 'class': ' kt-badge--success' },
                            2: { 'title': 'Rejected', 'class': ' kt-badge--danger' },
                        };
                        return '<span class="kt-badge ' + status[row.Status].class + ' kt-badge--inline kt-badge--pill">' + status[row.Status].title + '</span>';
                    },
                }, {
                    field: 'User',
                    title: 'User',
                    template: function(row) {
                        return row.User + '<br/><span class="form-text text-muted" style="font-size: 11px;">' + row.Log_Date;
                    },
                }, {
                    field: 'Actions',
                    title: 'Actions',
                    sortable: false,
                    width: 110,
                    overflow: 'visible',
                    autoHide: false,
                }
            ],

        });

        function subTableInitQ(e) {
            $('<div/>').attr('id', 'child_data_ajax_' + e.data.RecordID).appendTo(e.detailCell).KTDatatable({
                data: {
                    type: 'remote',
                    source: {
                        read: {
                            url: '../assets/custom/enquiry/retrieve_item.php?id=' + e.data.Enquiry_no,

                            params: {
                                // custom query params
                                query: {
                                    generalSearch: '',
                                    CustomerID: e.data.RecordID,
                                },
                            },
                        },
                    },
                    pageSize: 10,
                    serverPaging: true,
                    serverFiltering: false,
                    serverSorting: true,
                },

                // layout definition
                layout: {
                    scroll: true,
                    height: 300,
                    footer: false,

                    // enable/disable datatable spinner.
                    spinner: {
                        type: 1,
                        theme: 'default',
                    },
                },

                sortable: true,

                // columns definition
                columns: [{
                        field: 'RecordID',
                        title: '#',
                        sortable: false,
                        width: 30,
                    }, {
                        field: 'Product',
                        title: 'Product',
                        template: function(row) {
                            return '<strong>' + row.Product + '</strong><br/><span class="form-text text-muted" style="font-size: 9px;">' + row.Description;
                        },
                    }, {
                        field: 'Quantity',
                        title: 'Quantity',
                        template: function(row) {
                            return '<strong>' + row.Quantity + '</strong>';
                        },
                    },
                    {
                        field: 'Stock',
                        title: 'Stock in Hand',
                        template: function(row) {
                            return '<strong>' + row.Stock + '</strong>';
                        },
                    },
                    {
                        field: 'Co_Stock',
                        title: 'Stock in Co.',
                        template: function(row) {
                            return '<strong>' + row.Co_Stock + '</strong>';
                        },
                    }
                ],
            });
        }
    };

    var quotation = function() {

        manageQuotationTable = $('#quotation_datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '../assets/custom/quotation/retrieve.php',
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
                pageSize: 10,
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
            sortable: false,

            pagination: true,

            detail: {
                title: 'Load products',
                content: subTableInitQ,
            },

            search: {
                input: $('#generalSearch'),
            },

            // columns definition
            columns: [{
                    field: 'RecordID',
                    title: '',
                    sortable: false,
                    width: 30,
                    textAlign: 'center',
                }, {
                    field: 'SN',
                    title: '',
                    template: '{{RecordID}}',
                    width: 20,
                    selector: {
                        class: 'kt-checkbox--solid'
                    },
                    textAlign: 'center',
                }, {
                    field: 'Client',
                    title: 'Client',
                    width: 200,

                }, {
                    field: 'Quotation',
                    title: 'Quotation',
                }, {
                    field: 'Date',
                    title: 'Date',
                },
                {
                    field: 'Enquiry',
                    title: 'Enquiry',
                    template: function(row) {
                        var items = JSON.parse(row.Enquiry);
                        var output = '';
                        if (items.cl_enquiry_no[0] != null)
                            output += items.cl_enquiry_no[0] + '<br>' + items.enquiry_date[0];
                        return output;
                    },
                }, {
                    field: 'Amount',
                    title: 'Amount',
                }, {
                    field: 'Status',
                    title: 'Status',
                    template: function(row) {
                        var status = {
                            0: { 'title': 'Pending', 'class': 'kt-badge--primary' },
                            1: { 'title': 'Completed', 'class': ' kt-badge--success' },
                            2: { 'title': 'Rejected', 'class': ' kt-badge--danger' },
                        };
                        return '<span class="kt-badge ' + status[row.Status].class + ' kt-badge--inline kt-badge--pill">' + status[row.Status].title + '</span>';
                    },
                }, {
                    field: 'User',
                    title: 'User',
                    template: function(row) {
                        return row.User + '<br/><span class="form-text text-muted" style="font-size: 11px;">' + row.Log_Date;
                    },
                }, {
                    field: 'Actions',
                    title: 'Actions',
                    sortable: false,
                    width: 110,
                    overflow: 'visible',
                    autoHide: false,
                }
            ],

        });

        function subTableInitQ(e) {
            $('<div/>').attr('id', 'child_data_ajax_' + e.data.RecordID).appendTo(e.detailCell).KTDatatable({
                data: {
                    type: 'remote',
                    source: {
                        read: {
                            url: '../assets/custom/quotation/retrieve_item.php?id=' + e.data.Quotation_no,
                            params: {
                                // custom query params
                                query: {
                                    generalSearch: '',
                                    CustomerID: e.data.RecordID,
                                },
                            },
                        },
                    },
                    pageSize: 10,
                    serverPaging: true,
                    serverFiltering: false,
                    serverSorting: true,
                },

                // layout definition
                layout: {
                    scroll: true,
                    height: 300,
                    footer: false,

                    // enable/disable datatable spinner.
                    spinner: {
                        type: 1,
                        theme: 'default',
                    },
                },

                sortable: true,

                // columns definition
                columns: [{
                    field: 'RecordID',
                    title: '#',
                    sortable: false,
                    width: 30,
                }, {
                    field: 'Product',
                    title: 'Product',
                    template: function(row) {
                        return '<strong>' + row.Product + '</strong><br/><span class="form-text text-muted" style="font-size: 9px;">' + row.Description;
                    },
                }, {
                    field: 'Quantity',
                    title: 'Quantity',
                    template: function(row) {
                        return '<strong>' + row.Quantity + '</strong>';
                    },
                }, {
                    field: 'Price',
                    title: 'Rate',
                }, {
                    field: 'Discount',
                    title: 'Discount',
                    template: function(row) {
                        var output = '';
                        if (row.Discount != '')
                            output += row.Discount + ' %';

                        return output;
                    },
                }, {
                    field: 'HSN',
                    title: 'HSN',
                }, {
                    field: 'Tax',
                    title: 'Tax',
                    template: function(row) {
                        return row.Tax + ' %';
                    }
                }],
            });
        }



        $('form input').on('keypress', function(e) {
            // console.log(e.which);
            return e.which !== 13;
        });
    };

    var sales_order = function() {

        manageSalesOrderTable = $('#sales_order_datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '../assets/custom/sales_order/retrieve.php',
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
                pageSize: 10,
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
            sortable: false,

            pagination: true,

            detail: {
                title: 'Load products',
                content: subTableInit,
            },

            search: {
                input: $('#generalSearch'),
            },

            // columns definition
            columns: [{
                field: 'RecordID',
                title: '',
                sortable: false,
                width: 30,
                textAlign: 'center',
            }, {
                field: 'SN',
                title: '',
                template: '{{RecordID}}',
                width: 20,
                selector: {
                    class: 'kt-checkbox--solid'
                },
                textAlign: 'center',
            }, {
                field: 'Name',
                title: 'Name',
                template: function(row) {
                    var output = '' +
                        '<div class="kt-user-card-v2">' +
                        '<div class="kt-user-card-v2__pic">';
                    output += '<span class="kt-badge ' + row.KT_Class + ' kt-badge--xl">' + row.Name.charAt(0) + '</span>';
                    output += '</div>' +
                        '<div class="kt-user-card-v2__details">';
                    output += '<a href="#" class="kt-user-card-v2__name">' + row.Name + '</a>';
                    output += '</div></div>';

                    output = row.Name;
                    return output;
                },
            }, {
                field: 'Number',
                title: 'Order Number',
            }, {
                field: 'Date',
                title: 'Date',
            }, {
                field: 'MaterialStatus',
                title: 'Status',
            }, {
                field: 'Amount',
                title: 'Amount',
            }, {
                field: 'Status',
                title: 'Status',
                template: function(row) {
                    var status = {
                        0: { 'title': 'Pending', 'class': 'kt-badge--primary' },
                        1: { 'title': 'Completed', 'class': ' kt-badge--success' },
                        2: { 'title': 'Rejected', 'class': ' kt-badge--danger' },
                    };
                    return '<span class="kt-badge ' + status[row.Status].class + ' kt-badge--inline kt-badge--pill">' + status[row.Status].title + '</span>';
                },
            }, {
                field: 'User',
                title: 'User',
                template: function(row) {
                    return row.User + '<br/><span class="form-text text-muted" style="font-size: 11px;">' + row.Log_Date;
                },
            }, {
                field: 'Actions',
                title: 'Actions',
                sortable: false,
                width: 110,
                overflow: 'visible',
                autoHide: false,
            }],

        });

        function subTableInit(e) {
            $('<div/>').attr('id', 'child_data_ajax_' + e.data.RecordID).appendTo(e.detailCell).KTDatatable({
                data: {
                    type: 'remote',
                    source: {
                        read: {
                            url: '../assets/custom/sales_order/retrieve_item.php?id=' + e.data.Number,
                            params: {
                                // custom query params
                                query: {
                                    generalSearch: '',
                                    CustomerID: e.data.RecordID,
                                },
                            },
                        },
                    },
                    pageSize: 10,
                    serverPaging: true,
                    serverFiltering: false,
                    serverSorting: true,
                },

                // layout definition
                layout: {
                    scroll: true,
                    height: 300,
                    footer: false,

                    // enable/disable datatable spinner.
                    spinner: {
                        type: 1,
                        theme: 'default',
                    },
                },

                sortable: true,

                // columns definition
                columns: [{
                    field: 'RecordID',
                    title: '#',
                    sortable: false,
                    width: 30,
                }, {
                    field: 'Product',
                    title: 'Product',
                    template: function(row) {
                        return '<strong>' + row.Product + '</strong><br/><span class="form-text text-muted" style="font-size: 11px;">' + row.Description;
                    },
                }, {
                    field: 'Quantity',
                    title: 'Quantity',
                    template: function(row) {
                        return '<strong>' + row.Received + '</strong> out of <strong>' + row.Quantity + '</strong>';
                    },
                }, {
                    field: 'Price',
                    title: 'Rate',
                }, {
                    field: 'Discount',
                    title: 'Discount',
                    template: function(row) {
                        var output = '';
                        if (row.Discount != '')
                            output += row.Discount + ' %';

                        return output;
                    },
                }, {
                    field: 'HSN',
                    title: 'HSN',
                }, {
                    field: 'Tax',
                    title: 'Tax',
                    template: function(row) {
                        return row.Tax + ' %';
                    }
                }, {
                    field: 'Actions',
                    title: 'Actions',
                    sortable: false,
                    width: 110,
                    overflow: 'visible',
                    autoHide: false,
                }],
            });
        }
    };

    var sales = function() {

        manageSalesInvoiceTable = $('#sales_invoice_datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '../assets/custom/sales_invoice/retrieve.php',
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
                pageSize: 10,
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
            sortable: false,

            pagination: true,

            detail: {
                title: 'Load products',
                content: subTableInit,
            },

            search: {
                input: $('#generalSearch'),
            },

            // columns definition
            columns: [{
                    field: 'RecordID',
                    title: '',
                    sortable: false,
                    width: 30,
                    textAlign: 'center',
                }, {
                    field: 'SN',
                    title: '',
                    template: '{{RecordID}}',
                    width: 20,
                    selector: {
                        class: 'kt-checkbox--solid'
                    },
                    textAlign: 'center',
                }, {
                    field: 'Name',
                    title: 'Name',
                    template: function(row) {
                        var output = '' +
                            '<div class="kt-user-card-v2">' +
                            '<div class="kt-user-card-v2__pic">';
                        output += '<span class="kt-badge ' + row.KT_Class + ' kt-badge--xl">' + row.Name.charAt(0) + '</span>';
                        output += '</div>' +
                            '<div class="kt-user-card-v2__details">';
                        output += '<a href="#" class="kt-user-card-v2__name">' + row.Name + '</a>';
                        output += '</div></div>';
                        output = row.Name;
                        return output;
                    },
                }, {
                    field: 'Number',
                    title: 'Order Number',
                },
                {
                    field: 'Series',
                    title: 'Series',
                    template: function(row) {
                        if (row.Series == 'PRIMARY')
                            return '<span class="kt-badge kt-badge--success kt-badge--inline kt-badge--pill">' + row.Series + '</span>';
                        else if (row.Series == 'SECONDARY')
                            return '<span class="kt-badge kt-badge--primary kt-badge--inline kt-badge--pill">' + row.Series + '</span>';
                        else
                            return '<span class="kt-badge kt-badge--warning kt-badge--inline kt-badge--pill">' + row.Series + '</span>';
                    },
                }, {
                    field: 'Date',
                    title: 'Date',
                }, {
                    field: 'Amount',
                    title: 'Amount',
                }, {
                    field: 'Status',
                    title: 'Status',
                    template: function(row) {
                        var status = {
                            0: { 'title': 'Pending', 'class': 'kt-badge--primary' },
                            1: { 'title': 'Completed', 'class': ' kt-badge--success' },
                            2: { 'title': 'Partial', 'class': ' kt-badge--warning' },
                        };
                        return '<span class="kt-badge ' + status[row.Status].class + ' kt-badge--inline kt-badge--pill">' + status[row.Status].title + '</span>';
                    },
                }, {
                    field: 'User',
                    title: 'User',
                    template: function(row) {
                        return row.User + '<br/><span class="form-text text-muted" style="font-size: 11px;">' + row.Log_Date;
                    },
                }, {
                    field: 'Actions',
                    title: 'Actions',
                    sortable: false,
                    width: 110,
                    overflow: 'visible',
                    autoHide: false,
                }
            ],

        });

        function subTableInit(e) {
            $('<div/>').attr('id', 'child_data_ajax_' + e.data.RecordID).appendTo(e.detailCell).KTDatatable({
                data: {
                    type: 'remote',
                    source: {
                        read: {
                            url: '../assets/custom/sales_invoice/retrieve_item.php?id=' + e.data.Number,
                            params: {
                                // custom query params
                                query: {
                                    generalSearch: '',
                                    CustomerID: e.data.RecordID,
                                },
                            },
                        },
                    },
                    pageSize: 10,
                    serverPaging: true,
                    serverFiltering: false,
                    serverSorting: true,
                },

                // layout definition
                layout: {
                    scroll: true,
                    height: 300,
                    footer: false,

                    // enable/disable datatable spinner.
                    spinner: {
                        type: 1,
                        theme: 'default',
                    },
                },

                sortable: true,

                // columns definition
                columns: [{
                    field: 'RecordID',
                    title: '#',
                    sortable: false,
                    width: 30,
                }, {
                    field: 'Product',
                    title: 'Product',
                    template: function(row) {
                        return '<strong>' + row.Product + '</strong><br/><span class="form-text text-muted" style="font-size: 11px;">' + row.Description;
                    },
                }, {
                    field: 'Quantity',
                    title: 'Quantity',
                    template: function(row) {
                        return '<strong>' + row.Quantity + '</strong>';
                    },
                }, {
                    field: 'Price',
                    title: 'Rate',
                }, {
                    field: 'Discount',
                    title: 'Discount',
                    template: function(row) {
                        var output = '';
                        if (row.Discount != '')
                            output += row.Discount + ' %';

                        return output;
                    },
                }, {
                    field: 'HSN',
                    title: 'HSN',
                }, {
                    field: 'Tax',
                    title: 'Tax',
                    template: function(row) {
                        return row.Tax + ' %';
                    }
                }],
            });
        }
    };

    var receipts = function() {

        manageReceiptsTable = $('#receipts_datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '../assets/custom/receipts/retrieve.php',
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
                pageSize: 10,
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
            sortable: false,

            pagination: true,

            search: {
                input: $('#generalSearch'),
            },

            // columns definition
            columns: [{
                field: 'SN',
                title: '',
                template: '{{RecordID}}',
                width: 20,
                selector: {
                    class: 'kt-checkbox--solid'
                },
                textAlign: 'center',
            }, {
                field: 'ID',
                title: 'SN',
            }, {
                field: 'Date',
                title: 'Date',
            }, {
                field: 'Client',
                title: 'Client',
            }, {
                field: 'Sale_Invoice',
                title: 'Sale Invoices',
            }, {
                field: 'Mode',
                title: 'Mode',
            }, {
                field: 'Amount',
                title: 'Amount',
            }, {
                field: 'Actions',
                title: 'Actions',
            }],

        });
    };

    var purchase_bag = function() {

        managePurchaseBagTable = $('#purchase_bag_datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '../assets/custom/purchase_bag/retrieve.php',
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
                pageSize: 10,
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
            sortable: false,

            pagination: true,

            search: {
                input: $('#generalSearch'),
            },

            // columns definition
            columns: [{
                    field: 'SN',
                    title: '',
                    template: '{{RecordID}}',
                    width: 20,
                    selector: {
                        class: 'kt-checkbox--solid'
                    },
                    textAlign: 'center',
                }, {
                    field: 'Name',
                    title: 'Name',
                }, {
                    field: 'Group',
                    title: 'Group',
                }, {
                    field: 'Category',
                    title: 'Category',
                }, {
                    field: 'Sub_Category',
                    title: 'Sub Category',
                }, {
                    field: 'Quantity',
                    title: 'Quantity',
                }, {
                    field: 'User',
                    title: 'User',
                    template: function(row) {
                        return row.User + '</br>' + row.Date;
                    },
                }, {
                    field: 'Actions',
                    title: 'Actions',
                }

            ],

        });
    };

    var purchase_order = function() {

        managePurchaseOrderTable = $('#purchase_order_datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '../assets/custom/purchase_order/retrieve.php',
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
                pageSize: 10,
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
            sortable: false,

            pagination: true,

            detail: {
                title: 'Load products',
                content: subTableInit,
            },

            search: {
                input: $('#generalSearch'),
            },

            // columns definition
            columns: [{
                field: 'RecordID',
                title: '',
                sortable: false,
                width: 30,
                textAlign: 'center',
            }, {
                field: 'SN',
                title: '',
                template: '{{RecordID}}',
                width: 20,
                selector: {
                    class: 'kt-checkbox--solid'
                },
                textAlign: 'center',
            }, {
                field: 'Name',
                title: 'Name',
                template: function(row) {
                    var output = '' +
                        '<div class="kt-user-card-v2">' +
                        '<div class="kt-user-card-v2__pic">';
                    output += '<span class="kt-badge ' + row.KT_Class + ' kt-badge--xl">' + row.Name.charAt(0) + '</span>';
                    output += '</div>' +
                        '<div class="kt-user-card-v2__details">';
                    output += '<a href="#" class="kt-user-card-v2__name">' + row.Name + '</a>';
                    output += '</div></div>';

                    output = row.Name;
                    return output;
                },
            }, {
                field: 'Number',
                title: 'Invoice Number',
            }, {
                field: 'Date',
                title: 'Date',
            }, {
                field: 'Amount',
                title: 'Amount',
            }, {
                field: 'Status',
                title: 'Status',
                template: function(row) {
                    var status = {
                        0: { 'title': 'Pending', 'class': 'kt-badge--primary' },
                        1: { 'title': 'Completed', 'class': ' kt-badge--success' },
                        2: { 'title': 'Rejected', 'class': ' kt-badge--danger' },
                    };
                    return '<span class="kt-badge ' + status[row.Status].class + ' kt-badge--inline kt-badge--pill">' + status[row.Status].title + '</span>';
                },
            }, {
                field: 'User',
                title: 'User',
                template: function(row) {
                    return row.User + '<br/><span class="form-text text-muted" style="font-size: 11px;">' + row.Log_Date;
                },
            }, {
                field: 'Actions',
                title: 'Actions',
                sortable: false,
                width: 110,
                overflow: 'visible',
                autoHide: false,
            }],

        });

        function subTableInit(e) {
            $('<div/>').attr('id', 'child_data_ajax_' + e.data.RecordID).appendTo(e.detailCell).KTDatatable({
                data: {
                    type: 'remote',
                    source: {
                        read: {
                            url: '../assets/custom/purchase_order/retrieve_item.php?id=' + e.data.Number,
                            params: {
                                // custom query params
                                query: {
                                    generalSearch: '',
                                    CustomerID: e.data.RecordID,
                                },
                            },
                        },
                    },
                    pageSize: 10,
                    serverPaging: true,
                    serverFiltering: false,
                    serverSorting: true,
                },

                // layout definition
                layout: {
                    scroll: true,
                    height: 300,
                    footer: false,

                    // enable/disable datatable spinner.
                    spinner: {
                        type: 1,
                        theme: 'default',
                    },
                },

                sortable: true,

                // columns definition
                columns: [{
                    field: 'RecordID',
                    title: '#',
                    sortable: false,
                    width: 30,
                }, {
                    field: 'Product',
                    title: 'Product',
                    template: function(row) {
                        return '<strong>' + row.Product + '</strong><br/><span class="form-text text-muted" style="font-size: 11px;">' + row.Description;
                    },
                }, {
                    field: 'Quantity',
                    title: 'Quantity',
                    template: function(row) {
                        return '<strong>' + row.Received + '</strong> out of <strong>' + row.Quantity + '</strong>';
                    },
                }, {
                    field: 'Price',
                    title: 'Rate',
                }, {
                    field: 'Discount',
                    title: 'Discount',
                    template: function(row) {
                        var output = '';
                        if (row.Discount != '')
                            output += row.Discount + ' %';

                        return output;
                    },
                }, {
                    field: 'HSN',
                    title: 'HSN',
                }, {
                    field: 'Tax',
                    title: 'Tax',
                    template: function(row) {
                        return row.Tax + ' %';
                    }
                }],
            });
        }
    };

    var purchase = function() {

        managePurchaseInvoiceTable = $('#purchase_invoice_datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '../assets/custom/purchase_invoice/retrieve.php',
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
                pageSize: 10,
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
            sortable: false,

            pagination: true,

            detail: {
                title: 'Load products',
                content: subTableInit,
            },

            search: {
                input: $('#generalSearch'),
            },

            // columns definition
            columns: [{
                field: 'RecordID',
                title: '',
                sortable: false,
                width: 30,
                textAlign: 'center',
            }, {
                field: 'SN',
                title: '',
                template: '{{RecordID}}',
                width: 20,
                selector: {
                    class: 'kt-checkbox--solid'
                },
                textAlign: 'center',
            }, {
                field: 'Name',
                title: 'Name',
                template: function(row) {
                    var output = '' +
                        '<div class="kt-user-card-v2">' +
                        '<div class="kt-user-card-v2__pic">';
                    output += '<span class="kt-badge ' + row.KT_Class + ' kt-badge--xl">' + row.Name.charAt(0) + '</span>';
                    output += '</div>' +
                        '<div class="kt-user-card-v2__details">';
                    output += '<a href="#" class="kt-user-card-v2__name">' + row.Name + '</a>';
                    output += '</div></div>';
                    output = row.Name;
                    return output;
                },
            }, {
                field: 'Number',
                title: 'Invoice Number',
            }, {
                field: 'Date',
                title: 'Date',
            }, {
                field: 'Amount',
                title: 'Amount',
            }, {
                field: 'Status',
                title: 'Status',
                template: function(row) {
                    var status = {
                        0: { 'title': 'Pending', 'class': 'kt-badge--primary' },
                        1: { 'title': 'Completed', 'class': ' kt-badge--success' },
                        2: { 'title': 'Rejected', 'class': ' kt-badge--danger' },
                    };
                    return '<span class="kt-badge ' + status[row.Status].class + ' kt-badge--inline kt-badge--pill">' + status[row.Status].title + '</span>';
                },
            }, {
                field: 'User',
                title: 'User',
                template: function(row) {
                    return row.User + '<br/><span class="form-text text-muted" style="font-size: 11px;">' + row.Log_Date;
                },
            }, {
                field: 'Actions',
                title: 'Actions',
                sortable: false,
                width: 110,
                overflow: 'visible',
                autoHide: false,
            }],

        });

        function subTableInit(e) {
            $('<div/>').attr('id', 'child_data_ajax_' + e.data.RecordID).appendTo(e.detailCell).KTDatatable({
                data: {
                    type: 'remote',
                    source: {
                        read: {
                            url: '../assets/custom/purchase_invoice/retrieve_item.php?id=' + e.data.Number,
                            params: {
                                // custom query params
                                query: {
                                    generalSearch: '',
                                    CustomerID: e.data.RecordID,
                                },
                            },
                        },
                    },
                    pageSize: 10,
                    serverPaging: true,
                    serverFiltering: false,
                    serverSorting: true,
                },

                // layout definition
                layout: {
                    scroll: true,
                    height: 300,
                    footer: false,

                    // enable/disable datatable spinner.
                    spinner: {
                        type: 1,
                        theme: 'default',
                    },
                },

                sortable: true,

                // columns definition
                columns: [{
                    field: 'RecordID',
                    title: '#',
                    sortable: false,
                    width: 30,
                }, {
                    field: 'Product',
                    title: 'Product',
                    template: function(row) {
                        return '<strong>' + row.Product + '</strong><br/><span class="form-text text-muted" style="font-size: 11px;">' + row.Description;
                    },
                }, {
                    field: 'Quantity',
                    title: 'Quantity',
                    template: function(row) {
                        return '<strong>' + row.Quantity + '</strong>';
                    },
                }, {
                    field: 'Price',
                    title: 'Rate',
                }, {
                    field: 'Discount',
                    title: 'Discount',
                    template: function(row) {
                        var output = '';
                        if (row.Discount != '')
                            output += row.Discount + ' %';

                        return output;
                    },
                }, {
                    field: 'HSN',
                    title: 'HSN',
                }, {
                    field: 'Tax',
                    title: 'Tax',
                    template: function(row) {
                        return row.Tax + ' %';
                    }
                }],
            });
        }
    };

    var payments = function() {

        managePaymentsTable = $('#payments_datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '../assets/custom/payments/retrieve.php',
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
                pageSize: 10,
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
            sortable: false,

            pagination: true,

            search: {
                input: $('#generalSearch'),
            },

            // columns definition
            columns: [{
                field: 'SN',
                title: '',
                template: '{{RecordID}}',
                width: 20,
                selector: {
                    class: 'kt-checkbox--solid'
                },
                textAlign: 'center',
            }, {
                field: 'ID',
                title: 'SN',
            }, {
                field: 'Date',
                title: 'Date',
            }, {
                field: 'Supplier',
                title: 'Supplier',
            }, {
                field: 'Purchase_Invoice',
                title: 'Purchase Invoices',
            }, {
                field: 'Mode',
                title: 'Mode',
            }, {
                field: 'Amount',
                title: 'Amount',
            }, {
                field: 'Actions',
                title: 'Actions',
            }],

        });
    };

    var assemblies = function() {

        manageAssembliesTable = $('#assemblies_datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '../assets/custom/assemblies/retrieve.php',
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
                pageSize: 10,
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
            sortable: false,

            pagination: true,

            search: {
                input: $('#generalSearch'),
            },

            // columns definition
            columns: [{
                field: 'SN',
                title: '',
                template: '{{RecordID}}',
                width: 20,
                selector: {
                    class: 'kt-checkbox--solid'
                },
                textAlign: 'center',
            }, {
                field: 'Composite',
                title: 'Composite',
            }, {
                field: 'Spares',
                title: 'Spares',
            }, {
                field: 'Log_user',
                title: 'User',
                template: function(row) {
                    return row.Log_user + '<br/><span class="form-text text-muted" style="font-size: 11px;">' + row.Log_date;
                },
            }, {
                field: 'Actions',
                title: 'Actions',
            }],

        });
    };

    var assemblies_operation = function() {

        manageAssembliesOperationTable = $('#assemblies_operation_datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '../assets/custom/assemblies/retrieve_operation.php',
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
                pageSize: 10,
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
            sortable: false,

            pagination: true,

            search: {
                input: $('#generalSearch'),
            },

            // columns definition
            columns: [{
                field: 'SN',
                title: '',
                width: 20,
                textAlign: 'center',
            }, {
                field: 'composite',
                title: 'Composite',
            }, {
                field: 'operation',
                title: 'Operation',
            }, {
                field: 'quantity',
                title: 'Quantity',
            }, {
                field: 'log_user',
                title: 'User',
                template: function(row) {
                    return row.log_user + '<br/><span class="form-text text-muted" style="font-size: 11px;">' + row.log_date;
                },
            }, {
                field: 'Actions',
                title: 'Actions',
            }],

        });
    };

    var pd_purchase = function() {

        managePDPurchaseTable = $('#pd_purchase').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '../assets/custom/product_details/retrieve_purchase.php',
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
                pageSize: 10,
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
            sortable: false,

            pagination: true,

            search: {
                input: $('#search_pd_purchase'),
            },

            // columns definition
            columns: [{
                field: 'SN',
                title: 'SN',
                template: '{{SN}}',
                width: 20,
                textAlign: 'center',
                overflow: 'visible',
                autoHide: false,
            }, {
                field: 'PI_Date',
                title: 'Date',
                overflow: 'visible',
                autoHide: false,
            }, {
                field: 'Supplier',
                title: 'Supplier',
                overflow: 'visible',
                autoHide: false,
            }, {
                field: 'PI',
                title: 'Invoice #',
                textAlign: 'center',
                overflow: 'visible',
                autoHide: false,
            }, {
                field: 'Qty',
                title: 'Quantity',
                textAlign: 'center',
                overflow: 'visible',
                autoHide: false,
            }, {
                field: 'Rate',
                title: 'Rate',
                textAlign: 'left',
                overflow: 'visible',
                autoHide: false,
            }],

        });
    };

    var pd_sales_order = function() {

        managePDSalesOrderTable = $('#pd_sales_order').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '../assets/custom/product_details/retrieve_sales_order.php',
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
                pageSize: 10,
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
            sortable: false,

            pagination: true,

            search: {
                input: $('#search_pd_sales_order'),
            },

            // columns definition
            columns: [{
                field: 'SN',
                title: 'SN',
                template: '{{SN}}',
                width: 20,
                textAlign: 'center',
                overflow: 'visible',
                autoHide: false,
            }, {
                field: 'SO_Date',
                title: 'Date',
                overflow: 'visible',
                autoHide: false,
            }, {
                field: 'Client',
                title: 'Client',
                overflow: 'visible',
                autoHide: false,
            }, {
                field: 'Type',
                title: 'Type',
                overflow: 'visible',
                autoHide: false,
                template: function(row) {
                    var output = '';
                    if (row.Type == '1')
                        output = 'Material Given';
                    else
                        output = 'Order Received';
                    return output;
                },
            }, {
                field: 'SO',
                title: 'Invoice #',
                textAlign: 'center',
                overflow: 'visible',
                autoHide: false,
            }, {
                field: 'Qty',
                title: 'Quantity',
                textAlign: 'center',
                overflow: 'visible',
                autoHide: false,
            }, {
                field: 'Rate',
                title: 'Rate',
                textAlign: 'left',
                overflow: 'visible',
                autoHide: false,
            }],

        });
    };

    var pd_sales = function() {

        managePDSalesTable = $('#pd_sales').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '../assets/custom/product_details/retrieve_sales.php',
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
                pageSize: 10,
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
            sortable: false,

            pagination: true,

            search: {
                input: $('#search_pd_sales'),
            },

            // columns definition
            columns: [{
                field: 'SN',
                title: 'SN',
                template: '{{SN}}',
                width: 20,
                textAlign: 'center',
                overflow: 'visible',
                autoHide: false,
            }, {
                field: 'SI_Date',
                title: 'Date',
                overflow: 'visible',
                autoHide: false,
            }, {
                field: 'Client',
                title: 'Client',
                overflow: 'visible',
                autoHide: false,
            }, {
                field: 'SI',
                title: 'Invoice #',
                textAlign: 'center',
                overflow: 'visible',
                autoHide: false,
            }, {
                field: 'Qty',
                title: 'Quantity',
                textAlign: 'center',
                overflow: 'visible',
                autoHide: false,
            }, {
                field: 'Rate',
                title: 'Rate',
                textAlign: 'left',
                overflow: 'visible',
                autoHide: false,
            }],

        });
    };

    var pd_quotation = function() {

        managePDQuotationTable = $('#pd_quotation').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '../assets/custom/product_details/retrieve_quotation.php',
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
                pageSize: 10,
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
            sortable: false,

            pagination: true,

            search: {
                input: $('#search_pd_quotation'),
            },

            // columns definition
            columns: [{
                field: 'SN',
                title: 'SN',
                template: '{{SN}}',
                width: 20,
                textAlign: 'center',
                overflow: 'visible',
                autoHide: false,
            }, {
                field: 'Q_Date',
                title: 'Date',
                overflow: 'visible',
                autoHide: false,
            }, {
                field: 'Client',
                title: 'Client',
                overflow: 'visible',
                autoHide: false,
            }, {
                field: 'QN',
                title: 'Quotation #',
                textAlign: 'center',
                overflow: 'visible',
                autoHide: false,
            }, {
                field: 'Qty',
                title: 'Quantity',
                textAlign: 'center',
                overflow: 'visible',
                autoHide: false,
            }, {
                field: 'Rate',
                title: 'Rate',
                textAlign: 'left',
                overflow: 'visible',
                autoHide: false,
            }],

        });
    };

    var pd_enquiry = function() {

        managePDEnquiryTable = $('#pd_enquiry').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '../assets/custom/product_details/retrieve_enquiry.php',
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
                pageSize: 10,
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
            sortable: false,

            pagination: true,

            search: {
                input: $('#search_pd_enquiry'),
            },

            // columns definition
            columns: [{
                field: 'SN',
                title: 'SN',
                template: '{{SN}}',
                width: 20,
                textAlign: 'center',
                overflow: 'visible',
                autoHide: false,
            }, {
                field: 'E_Date',
                title: 'Date',
                overflow: 'visible',
                autoHide: false,
            }, {
                field: 'Client',
                title: 'Client',
                overflow: 'visible',
                autoHide: false,
            }, {
                field: 'EN',
                title: 'Enquiry #',
                textAlign: 'center',
                overflow: 'visible',
                autoHide: false,
            }, {
                field: 'Qty',
                title: 'Quantity',
                textAlign: 'center',
                overflow: 'visible',
                autoHide: false,
            }],

        });
    };

    var sales_followup = function() {

        manageSalesFollowupTable = $('#sales_followup_datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '../assets/custom/sales_followup/retrieve.php',
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
                pageSize: 10,
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
                    field: 'RecordID',
                    title: '',
                    sortable: false,
                    width: 30,
                    textAlign: 'center',
                }, {
                    field: 'SN',
                    title: '',
                    template: '{{RecordID}}',
                    width: 20,
                    selector: {
                        class: 'kt-checkbox--solid'
                    },
                    textAlign: 'center',
                }, {
                    field: 'Client',
                    title: 'Client',
                }, {
                    field: 'Invoice',
                    title: 'Invoice',
                }, {
                    field: 'Date',
                    title: 'Date',
                    textAlign: 'center',
                }, {
                    field: 'Amount',
                    title: 'Amount',
                    textAlign: 'right',
                },
                {
                    field: 'Status',
                    title: 'Status',
                    textAlign: 'center',

                    template: function(row) {
                        var status = {
                            0: { 'title': 'Pending', 'class': 'kt-badge--primary' },
                            1: { 'title': 'Completed', 'class': ' kt-badge--success' },
                            2: { 'title': 'Rejected', 'class': ' kt-badge--danger' },
                        };
                        return '<span class="kt-badge ' + status[row.Status].class + ' kt-badge--inline kt-badge--pill">' + status[row.Status].title + '</span>';
                    },
                }, {
                    field: 'User',
                    title: 'User',
                    textAlign: 'center',

                    template: function(row) {
                        return row.User + '<br/><span class="form-text text-muted" style="font-size: 11px;">' + row.Log_Date;
                    },
                }, {
                    field: 'Actions',
                    title: 'Actions',
                    textAlign: 'center',

                    sortable: false,
                    width: 110,
                    overflow: 'visible',
                    autoHide: false,
                }
            ],

        });

        $('form input').on('keypress', function(e) {
            // console.log(e.which);
            return e.which !== 13;
        });
    };

    var followup = function() {

        manageFollowupTable = $('#followup_datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '../assets/custom/followup/retrieve.php',
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
                pageSize: 10,
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
            sortable: false,

            pagination: true,

            search: {
                input: $('#generalSearch'),
            },

            // columns definition
            columns: [
                {
                    field: 'SN',
                    title: 'SN',
                    sortable: false,
                    width: 30,
                    textAlign: 'center',
                },  
                {
                    field: 'Client',
                    title: 'Client',
                    width: 200,
                    textAlign: 'center',
                },
                {
                    field: 'Mobile',
                    title: 'Mobile',
                    width: 200,
                    textAlign: 'center',
                },
                {
                    field: 'Email',
                    title: 'Email',
                    width: 200,
                    textAlign: 'center',
                },
                {
                    field: 'Actions',
                    title: 'Actions',
                    sortable: false,
                    width: 110,
                    overflow: 'visible',
                    autoHide: false,
                    textAlign: 'center',
                }
            ],

        });

        $('form input').on('keypress', function(e) {
            // console.log(e.which);
            return e.which !== 13;
        });
    };

    return {
        init: function() {
            dashboard();
            sample_requests();
            products();
            clients();
            transporters();
            suppliers();
            users();
            whatsapp();
            bank();
            quotation();
            enquiry();
            purchase_bag();
            purchase_order();
            purchase();
            sales_order();
            sales();
            payments();
            receipts();
            assemblies();
            assemblies_operation();
            pd_purchase();
            pd_sales();
            pd_sales_order();
            pd_quotation();
            pd_enquiry();
            sales_followup();
            followup();
        },
    };
}();

var FormRepeater = function() {

    var enquiry = function() {

        var options_repeater = jQuery('#kt_repeater_enquiry');

        options_repeater.repeater({
            show: function() {
                jQuery(this).slideDown();

                $('.e_product_name-select2').select2({
                    ajax: {
                        url: '../assets/custom/api_get/get_product.php',
                        dataType: 'json'
                    },
                    width: '100%',
                    placeholder: 'Select Product',
                    tags: true,
                    allowClear: true
                });

                $('.e_tax-select2').select2({
                    width: '100%',
                    placeholder: 'Tax',
                    allowClear: true
                });

                $('.e_product_name-select2').on("select2:select", function(e) {

                    var id = $(e.currentTarget).val();
                    var name = e.currentTarget.name;
                    var start = name.indexOf("[");
                    var end = name.indexOf("]");
                    start += 1;
                    name = name.substring(start, end);

                    $.ajax({
                        url: '../assets/custom/api_get/get_product_info.php',
                        type: 'post',
                        data: { member_id: id },
                        dataType: 'json',
                        success: function(response) {
                            var temp = '';

                            temp = "input[name$='enquiry[" + name + "][e_rate]']";
                            $(temp).val(response.rate);
                            temp = "input[name$='enquiry[" + name + "][e_hsn]']";
                            $(temp).val(response.hsn);
                            temp = "select[name$='enquiry[" + name + "][e_tax]']";
                            $(temp).val(response.tax).trigger("change");

                            temp = "textarea[name$='enquiry[" + name + "][e_product_description]']";
                            var temp_val = response.description;
                            temp_val = temp_val.replace(/\|/g, "\r\n");
                            $(temp).val(temp_val);
                            var temp_textarea = $(temp);
                            autosize(temp_textarea);

                        } // /success
                    }); // /fetch selected member info

                });

                $('#enq_btn_add').on("click", function(e) { e_preview(e); });
            },
            hide: function(deleteElement) {
                jQuery(this).slideUp(deleteElement);
            },
            ready: function(setIndexes) {

                $('.e_product_name-select2').select2({
                    ajax: {
                        url: '../assets/custom/api_get/get_product.php',
                        dataType: 'json'
                    },
                    width: '100%',
                    placeholder: 'Select Product',
                    tags: true,
                    allowClear: true
                });

                $('.e_tax-select2').select2({
                    width: '100%',
                    placeholder: 'Tax',
                    allowClear: true
                });

                $('.e_product_name-select2').on("select2:select", function(e) {

                    var id = $(e.currentTarget).val();
                    var name = e.currentTarget.name;
                    var start = name.indexOf("[");
                    var end = name.indexOf("]");
                    start += 1;
                    name = name.substring(start, end);

                    $.ajax({
                        url: '../assets/custom/api_get/get_product_info.php',
                        type: 'post',
                        data: { member_id: id },
                        dataType: 'json',
                        success: function(response) {
                            var temp = '';

                            temp = "input[name$='enquiry[" + name + "][e_rate]']";
                            $(temp).val(response.rate);
                            temp = "input[name$='enquiry[" + name + "][e_hsn]']";
                            $(temp).val(response.hsn);
                            temp = "select[name$='enquiry[" + name + "][e_tax]']";
                            $(temp).val(response.tax).trigger("change");

                            temp = "textarea[name$='enquiry[" + name + "][e_product_description]']";
                            var temp_val = response.description;
                            temp_val = temp_val.replace(/\|/g, "\r\n");
                            $(temp).val(temp_val);
                            var temp_textarea = $(temp);
                            autosize(temp_textarea);


                        } // /success
                    }); // /fetch selected member info
                });

                $('#enq_btn_add').on("click", function(e) { e_preview(e); });
            },
            isFirstItemUndeletable: true
        });

        jQuery("#enquiry_list").sortable({
            axis: "y",
            cursor: 'pointer',
            opacity: 0.5,
            placeholder: "row-dragging",
            delay: 150,
            update: function(event, ui) {
                options_repeater.repeater('setIndexes');
            }

        }).disableSelection();

    }

    var quotation = function() {

        var options_repeater_q = jQuery('#kt_repeater_q');

        options_repeater_q.repeater({
            show: function() {
                jQuery(this).slideDown();

                $('.q_product_name-select2').select2({
                    ajax: {
                        url: '../assets/custom/api_get/get_product.php',
                        dataType: 'json'
                    },
                    width: '100%',
                    placeholder: 'Select Product Code',
                    tags: true,
                    allowClear: true,
                });

                function formatState (state) {
                    if (!state.id) {
                        return state.text;
                    }
                    var baseUrl = '../assets/vendor/file-manager/files';
                    var $state = $(
                        '<span><img width="50px" src="' + baseUrl + '/' + state.id + '" class="img-flag" /> ' + state.text + '</span>'
                    );
                    return $state;
                };

                $(".q_img-select2").select2({
                    ajax: {
                        url: '../assets/custom/api_get/get_product_imgs.php',
                        dataType: 'json'
                    },
                    templateResult: formatState,
                    placeholder: 'Select Image',
                    width: '100%',
                    allowClear: true
                });

                $('.q_unit-select2').select2({
                    ajax: {
                        url: '../assets/custom/api_get/get_units.php',
                        dataType: 'json'
                    },
                    width: '100%',
                    placeholder: 'Unit',
                    tags: true
                });

                $('.q_tax-select2').select2({
                    width: '100%',
                    placeholder: 'Tax'
                });

                // $('.q_display_make-select2').select2({
                //     width: '100%',
                //     placeholder: 'Make'
                // });

                $('.q_product_name-select2').on("select2:select", function(e) {

                    var id = $(e.currentTarget).val();
                    var name = e.currentTarget.name;
                    var start = name.indexOf("[");
                    var end = name.indexOf("]");
                    start += 1;
                    name = name.substring(start, end);

                    $.ajax({
                        url: '../assets/custom/api_get/get_product_info.php',
                        type: 'post',
                        data: { member_id: id },
                        dataType: 'json',
                        success: function(response) {
                            var temp = '';

                            temp = "input[name$='quotation[" + name + "][q_rate]']";
                            $(temp).val(response.rate);
                            temp = "select[name$='quotation[" + name + "][q_unit]']";
                            $(temp).empty().append($("<option/>").val(response.unit).text(response.unit)).val(response.unit).trigger("change");
                            temp = "input[name$='quotation[" + name + "][q_hsn]']";
                            $(temp).val(response.hsn);
                            temp = "select[name$='quotation[" + name + "][q_tax]']";
                            $(temp).val(response.tax).trigger("change");
                            // temp = "select[name$='quotation[" + name + "][q_display_make]']";
                            // $(temp).val(response.default_make).trigger("change");
                            temp = "textarea[name$='quotation[" + name + "][q_product_add_description]']";
                            var temp_val = response.description;
                            temp_val = temp_val.replace(/\|/g, "\r\n");
                            $(temp).val(temp_val);

                            var temp_textarea = $(temp);
                            autosize(temp_textarea);

                        } // /success
                    }); // /fetch selected member info
                });

                $(".q_qty").change(function(e) { q_preview(e); });
                $(".q_rate").change(function(e) { q_preview(e); });
                $(".q_dsc").change(function(e) { q_preview(e); });
                $('.q_tax-select2').on("select2:select", function(e) { q_preview(e); });
                $("#q_freight").change(function(e) { q_preview(e); });
                $("#q_pf").change(function(e) { q_preview(e); });
                $("#q_tot_discount").change(function(e) { q_preview(e); });
                $("#q_round").change(function(e) { q_preview(e); });
                $('#qtn_btn_add').on("click", function(e) { q_preview(e); });
                $('[data-ktwizard-type="action-next"]').on("click", function(e) { q_preview(e); });
            },
            hide: function(deleteElement) {
                jQuery(this).slideUp(deleteElement);
            },
            ready: function(setIndexes) {

                $('.q_product_name-select2').select2({
                    ajax: {
                        url: '../assets/custom/api_get/get_product.php',
                        dataType: 'json'
                    },
                    width: '100%',
                    placeholder: 'Select Product Code',
                    tags: true,
                    allowClear: true
                });

                $('.q_unit-select2').select2({
                    ajax: {
                        url: '../assets/custom/api_get/get_units.php',
                        dataType: 'json'
                    },
                    width: '100%',
                    placeholder: 'Unit',
                    tags: true
                });

                $('.q_tax-select2').select2({
                    width: '100%',
                    placeholder: 'Tax'
                });

                // $('.q_display_make-select2').select2({
                //     width: '100%',
                //     placeholder: 'Make'
                // });

                $('.q_product_name-select2').on("select2:select", function(e) {

                    var id = $(e.currentTarget).val();
                    var name = e.currentTarget.name;
                    var start = name.indexOf("[");
                    var end = name.indexOf("]");
                    start += 1;
                    name = name.substring(start, end);

                    $.ajax({
                        url: '../assets/custom/api_get/get_product_info.php',
                        type: 'post',
                        data: { member_id: id },
                        dataType: 'json',
                        success: function(response) {
                            var temp = '';

                            temp = "input[name$='quotation[" + name + "][q_rate]']";
                            $(temp).val(response.rate);
                            temp = "select[name$='quotation[" + name + "][q_unit]']";
                            $(temp).empty().append($("<option/>").val(response.unit).text(response.unit)).val(response.unit).trigger("change");
                            temp = "input[name$='quotation[" + name + "][q_hsn]']";
                            $(temp).val(response.hsn);
                            temp = "select[name$='quotation[" + name + "][q_tax]']";
                            $(temp).val(response.tax).trigger("change");
                            // temp = "select[name$='quotation[" + name + "][q_display_make]']";
                            // $(temp).val(response.default_make).trigger("change");
                            temp = "textarea[name$='quotation[" + name + "][q_product_add_description]']";
                            var temp_val = response.description;
                            temp_val = temp_val.replace(/\|/g, "\r\n");
                            $(temp).val(temp_val);

                            var temp_textarea = $(temp);
                            autosize(temp_textarea);

                        } // /success
                    }); // /fetch selected member info
                });

                $(".q_qty").change(function(e) { q_preview(e); });
                $(".q_rate").change(function(e) { q_preview(e); });
                $(".q_dsc").change(function(e) { q_preview(e); });
                $('.q_tax-select2').on("select2:select", function(e) { q_preview(e); });
                $("#q_freight").change(function(e) { q_preview(e); });
                $("#q_pf").change(function(e) { q_preview(e); });
                $("#q_tot_discount").change(function(e) { q_preview(e); });
                $("#q_round").change(function(e) { q_preview(e); });
                $('#qtn_btn_add').on("click", function(e) { q_preview(e); });
                $('[data-ktwizard-type="action-next"]').on("click", function(e) { q_preview(e); });
            },
            isFirstItemUndeletable: false
        });

        jQuery("#quotation_list").sortable({
            axis: "y",
            cursor: 'pointer',
            opacity: 0.5,
            placeholder: "row-dragging",
            delay: 150,
            update: function(event, ui) {
                options_repeater.repeater('setIndexes');
            }

        }).disableSelection();

    }

    var sales_order = function() {

        var options_repeater_so = jQuery('#kt_repeater_so');

        options_repeater_so.repeater({
            show: function() {
                jQuery(this).slideDown();

                $('.so_product_name-select2').select2({
                    ajax: {
                        url: '../assets/custom/api_get/get_product.php',
                        dataType: 'json'
                    },
                    width: '100%',
                    placeholder: 'Select Product Code',
                    allowClear: true
                });

                $('.so_tax-select2').select2({
                    width: '100%',
                    placeholder: 'Tax',
                    allowClear: true
                });

                $('.so_display_make-select2').select2({
                    width: '100%',
                    placeholder: 'Make',
                });

                $('.so_unit-select2').select2({
                    ajax: {
                        url: '../assets/custom/api_get/get_units.php',
                        dataType: 'json'
                    },
                    width: '100%',
                    placeholder: 'Unit',
                    tags: true,
                    allowClear: true
                });

                $('.so_product_name-select2').on("select2:select", function(e) {

                    var id = $(e.currentTarget).val();
                    var name = e.currentTarget.name;
                    var start = name.indexOf("[");
                    var end = name.indexOf("]");
                    start += 1;
                    name = name.substring(start, end);

                    $.ajax({
                        url: '../assets/custom/api_get/get_product_info.php',
                        type: 'post',
                        data: { member_id: id },
                        dataType: 'json',
                        success: function(response) {
                            var temp = '';

                            temp = "input[name$='sales_order[" + name + "][so_rate]']";
                            $(temp).val(response.rate);
                            temp = "input[name$='sales_order[" + name + "][so_hsn]']";
                            $(temp).val(response.hsn);
                            temp = "select[name$='sales_order[" + name + "][so_tax]']";
                            $(temp).val(response.tax).trigger("change");
                            temp = "select[name$='sales_order[" + name + "][so_display_make]']";
                            $(temp).val(response.default_make).trigger("change");
                            temp = "select[name$='sales_order[" + name + "][so_unit]']";
                            $(temp).empty().append($("<option/>").val(response.unit).text(response.unit)).val(response.unit).trigger("change");
                            temp = "textarea[name$='sales_order[" + name + "][so_product_add_description]']";
                            var temp_val = response.description;
                            temp_val = temp_val.replace(/\|/g, "\r\n");
                            $(temp).val(temp_val);

                            var temp_textarea = $(temp);
                            autosize(temp_textarea);

                        } // /success
                    }); // /fetch selected member info
                });

                $(".so_qty").change(function(e) { so_preview(e); });
                $(".so_rate").keyup(function(e) { so_preview(e); });
                $(".so_dsc").keyup(function(e) { so_preview(e); });
                $('.so_tax-select2').on("select2:select", function(e) { so_preview(e); });
                $(".so_delete").click(function(e) { so_preview(e); });
                $("#so_freight").change(function(e) { so_preview(e); });
                $("#so_pf").change(function(e) { so_preview(e); });
                $("#so_tot_discount").change(function(e) { so_preview(e); });
                $("#so_round").change(function(e) { so_preview(e); });
                $('#so_btn_add').on("click", function(e) { so_preview(e); });
            },
            hide: function(deleteElement) {
                jQuery(this).slideUp(deleteElement);
            },
            ready: function(setIndexes) {

                $('.so_product_name-select2').select2({
                    ajax: {
                        url: '../assets/custom/api_get/get_product.php',
                        dataType: 'json'
                    },
                    width: '100%',
                    placeholder: 'Select Product Code',
                    allowClear: true
                });

                $('.so_tax-select2').select2({
                    width: '100%',
                    placeholder: 'Tax',
                    allowClear: true
                });

                $('.so_display_make-select2').select2({
                    width: '100%',
                    placeholder: 'Make',
                });

                $('.so_unit-select2').select2({
                    ajax: {
                        url: '../assets/custom/api_get/get_units.php',
                        dataType: 'json'
                    },
                    width: '100%',
                    placeholder: 'Unit',
                    tags: true,
                    allowClear: true
                });

                $('.so_product_name-select2').on("select2:select", function(e) {

                    var id = $(e.currentTarget).val();
                    var name = e.currentTarget.name;
                    var start = name.indexOf("[");
                    var end = name.indexOf("]");
                    start += 1;
                    name = name.substring(start, end);

                    $.ajax({
                        url: '../assets/custom/api_get/get_product_info.php',
                        type: 'post',
                        data: { member_id: id },
                        dataType: 'json',
                        success: function(response) {
                            var temp = '';

                            temp = "input[name$='sales_order[" + name + "][so_rate]']";
                            $(temp).val(response.rate);
                            temp = "input[name$='sales_order[" + name + "][so_hsn]']";
                            $(temp).val(response.hsn);
                            temp = "select[name$='sales_order[" + name + "][so_tax]']";
                            $(temp).val(response.tax).trigger("change");
                            temp = "select[name$='sales_order[" + name + "][so_display_make]']";
                            $(temp).val(response.default_make).trigger("change");
                            temp = "select[name$='sales_order[" + name + "][so_unit]']";
                            $(temp).empty().append($("<option/>").val(response.unit).text(response.unit)).val(response.unit).trigger("change");
                            temp = "textarea[name$='sales_order[" + name + "][so_product_add_description]']";
                            var temp_val = response.description;
                            temp_val = temp_val.replace(/\|/g, "\r\n");
                            $(temp).val(temp_val);

                            var temp_textarea = $(temp);
                            autosize(temp_textarea);

                        } // /success
                    }); // /fetch selected member info
                });

                $(".so_qty").change(function(e) { so_preview(e); });
                $(".so_rate").keyup(function(e) { so_preview(e); });
                $(".so_dsc").keyup(function(e) { so_preview(e); });
                $('.so_tax-select2').on("select2:select", function(e) { so_preview(e); });
                $(".so_delete").click(function(e) { so_preview(e); });
                $("#so_freight").change(function(e) { so_preview(e); });
                $("#so_pf").change(function(e) { so_preview(e); });
                $("#so_tot_discount").change(function(e) { so_preview(e); });
                $("#so_round").change(function(e) { so_preview(e); });
                $('#so_btn_add').on("click", function(e) { so_preview(e); });

            },
            isFirstItemUndeletable: true
        });

        jQuery("#sales_order_list").sortable({
            axis: "y",
            cursor: 'pointer',
            opacity: 0.5,
            placeholder: "row-dragging",
            delay: 150,
            update: function(event, ui) {
                options_repeater.repeater('setIndexes');
            }

        }).disableSelection();


    }

    var sales_invoice = function() {

        var options_repeater_si = jQuery('#kt_repeater_si');

        options_repeater_si.repeater({
            show: function() {
                jQuery(this).slideDown();

                $('.si_product_name-select2').select2({
                    ajax: {
                        url: '../assets/custom/api_get/get_product.php',
                        dataType: 'json'
                    },
                    width: '100%',
                    placeholder: 'Select Product Code',
                    allowClear: true
                });

                $('.si_tax-select2').select2({
                    width: '100%',
                    placeholder: 'Tax',
                    allowClear: true
                });

                $('.si_display_make-select2').select2({
                    width: '100%',
                    placeholder: 'Make',
                });

                $('.si_unit-select2').select2({
                    ajax: {
                        url: '../assets/custom/api_get/get_units.php',
                        dataType: 'json'
                    },
                    width: '100%',
                    placeholder: 'Unit',
                    tags: true
                });

                $('.si_product_name-select2').on("select2:select", function(e) {

                    var id = $(e.currentTarget).val();
                    var name = e.currentTarget.name;
                    var start = name.indexOf("[");
                    var end = name.indexOf("]");
                    start += 1;
                    name = name.substring(start, end);

                    $.ajax({
                        url: '../assets/custom/api_get/get_product_info.php',
                        type: 'post',
                        data: { member_id: id },
                        dataType: 'json',
                        success: function(response) {
                            var temp = '';

                            temp = "input[name$='sales_invoice[" + name + "][si_rate]']";
                            $(temp).val(response.rate);
                            temp = "input[name$='sales_invoice[" + name + "][si_hsn]']";
                            $(temp).val(response.hsn);
                            temp = "select[name$='sales_invoice[" + name + "][si_tax]']";
                            $(temp).val(response.tax).trigger("change");
                            temp = "select[name$='sales_invoice[" + name + "][si_display_make]']";
                            $(temp).val(response.default_make).trigger("change");
                            temp = "select[name$='sales_invoice[" + name + "][si_unit]']";
                            $(temp).empty().append($("<option/>").val(response.unit).text(response.unit)).val(response.unit).trigger("change");
                            temp = "textarea[name$='sales_invoice[" + name + "][si_product_add_description]']";
                            var temp_val = response.description;
                            temp_val = temp_val.replace(/\|/g, "\r\n");
                            $(temp).val(temp_val);

                            var temp_textarea = $(temp);
                            autosize(temp_textarea);
                        } // /success
                    }); // /fetch selected member info
                });

                $(".si_qty").keyup(function(e) { si_preview(e); });
                $(".si_rate").keyup(function(e) { si_preview(e); });
                $(".si_dsc").keyup(function(e) { si_preview(e); });
                $('.si_tax-select2').on("select2:select", function(e) { si_preview(e); });
                $(".si_delete").click(function(e) { si_preview(e); });
                $("#si_freight").change(function(e) { si_preview(e); });
                $("#si_pf").change(function(e) { si_preview(e); });
                $("#si_tot_discount").change(function(e) { si_preview(e); });
                $("#si_round").change(function(e) { si_preview(e); });
                $('#si_btn_add').on("click", function(e) { si_preview(e); });
                $('[data-ktwizard-type="action-next"]').on("click", function(e) { si_preview(e); });
            },
            hide: function(deleteElement) {
                jQuery(this).slideUp(deleteElement);
            },
            ready: function(setIndexes) {

                $('.si_product_name-select2').select2({
                    ajax: {
                        url: '../assets/custom/api_get/get_product.php',
                        dataType: 'json'
                    },
                    width: '100%',
                    placeholder: 'Select Product Code',
                    allowClear: true
                });

                $('.si_tax-select2').select2({
                    width: '100%',
                    placeholder: 'Tax',
                    allowClear: true
                });

                $('.si_display_make-select2').select2({
                    width: '100%',
                    placeholder: 'Make',
                });

                $('.si_unit-select2').select2({
                    ajax: {
                        url: '../assets/custom/api_get/get_units.php',
                        dataType: 'json'
                    },
                    width: '100%',
                    placeholder: 'Unit',
                    tags: true
                });

                $('.si_product_name-select2').on("select2:select", function(e) {

                    var id = $(e.currentTarget).val();
                    var name = e.currentTarget.name;
                    var start = name.indexOf("[");
                    var end = name.indexOf("]");
                    start += 1;
                    name = name.substring(start, end);

                    $.ajax({
                        url: '../assets/custom/api_get/get_product_info.php',
                        type: 'post',
                        data: { member_id: id },
                        dataType: 'json',
                        success: function(response) {
                            var temp = '';

                            temp = "input[name$='sales_invoice[" + name + "][si_rate]']";
                            $(temp).val(response.rate);
                            temp = "input[name$='sales_invoice[" + name + "][si_hsn]']";
                            $(temp).val(response.hsn);
                            temp = "select[name$='sales_invoice[" + name + "][si_tax]']";
                            $(temp).val(response.tax).trigger("change");
                            temp = "select[name$='sales_invoice[" + name + "][si_display_make]']";
                            $(temp).val(response.default_make).trigger("change");
                            temp = "select[name$='sales_invoice[" + name + "][si_unit]']";
                            $(temp).empty().append($("<option/>").val(response.unit).text(response.unit)).val(response.unit).trigger("change");
                            temp = "textarea[name$='sales_invoice[" + name + "][si_product_add_description]']";
                            var temp_val = response.description;
                            temp_val = temp_val.replace(/\|/g, "\r\n");
                            $(temp).val(temp_val);

                            var temp_textarea = $(temp);
                            autosize(temp_textarea);
                        } // /success
                    }); // /fetch selected member info
                });

                $(".si_qty").keyup(function(e) { si_preview(e); });
                $(".si_rate").keyup(function(e) { si_preview(e); });
                $(".si_dsc").keyup(function(e) { si_preview(e); });
                $('.si_tax-select2').on("select2:select", function(e) { si_preview(e); });
                $(".si_delete").click(function(e) { si_preview(e); });
                $("#si_freight").change(function(e) { si_preview(e); });
                $("#si_pf").change(function(e) { si_preview(e); });
                $("#si_tot_discount").change(function(e) { si_preview(e); });
                $("#si_round").change(function(e) { si_preview(e); });
                $('#si_btn_add').on("click", function(e) { si_preview(e); });
                $('[data-ktwizard-type="action-next"]').on("click", function(e) { si_preview(e); });
            },
            isFirstItemUndeletable: false
        });

        jQuery("#sales_invoice_list").sortable({
            axis: "y",
            cursor: 'pointer',
            opacity: 0.5,
            placeholder: "row-dragging",
            delay: 150,
            update: function(event, ui) {
                options_repeater.repeater('setIndexes');
            }

        }).disableSelection();

    }

    var sales_ledger = function() {

        manageSalesLedgerTable = $('#sales_ledger_datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '../assets/custom/reports/retreive_sales_ledger.php',
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
                pageSize: 10,
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
            sortable: false,

            pagination: true,

            search: {
                input: $('#generalSearch'),
            },

            // columns definition
            columns: [{
                field: 'SN',
                title: '',
                template: '{{RecordID}}',
                width: 20,
                selector: {
                    class: 'kt-checkbox--solid'
                },
                textAlign: 'center',
            }, {
                field: 'Name',
                title: 'Name',
                template: function(row) {
                    var output = row.Name;
                    return output;
                },
            }, {
                field: 'Number',
                title: 'Invoice Number',
            }, {
                field: 'Date',
                title: 'Date',
            }, {
                field: 'Tax',
                title: 'Tax',
            }, {
                field: 'Amount',
                title: 'Amount',
            }, {
                field: 'Actions',
                title: 'Actions',
                sortable: false,
                width: 110,
                overflow: 'visible',
                autoHide: false,
            }],

        });

    };

    var receipt = function() {

        $('#kt_repeater_rc').repeater({
            initEmpty: false,

            show: function() {
                $(this).slideDown();

                $(".rc_completed").change(function(e) {
                    if (e.handled !== true) {
                        e.handled = true;

                        if (this.checked) {

                            var total = $('#amount').val();
                            var collected = 0;

                            console.log("Total : " + total);

                            var rep = document.getElementById('receipt_list');
                            var rowsCount = rep.childNodes.length;

                            for (var i = 0; i < rowsCount; i++) {
                                var tmp = "input[name$='receipt[" + i + "][rc_amount]']";
                                var temp = $(tmp).val();
                                if (temp != '') {
                                    temp = temp.replace(',', '');
                                    temp = parseInt(temp);
                                    collected += temp;
                                }
                                console.log("Collected : " + i + "  " + collected);


                            }

                            total = total - collected;
                            console.log("Total Revised: " + total);

                            var name = e.currentTarget.name;
                            if (name != null) {
                                var start = name.indexOf("[");
                                var end = name.indexOf("]");
                                start += 1;
                                name = name.substring(start, end);

                                tmp = "input[name$='receipt[" + name + "][rc_due]']";
                                var due = $(tmp).val();

                                due = due.replace(/,/g, '');
                                due = parseInt(due);

                                tmp = "input[name$='receipt[" + name + "][rc_amount]']";
                                if (due <= total) {
                                    $(tmp).val(due);
                                } else {
                                    $(tmp).val(total);
                                }
                            }
                        } else {
                            var name = e.currentTarget.name;
                            if (name != null) {
                                var start = name.indexOf("[");
                                var end = name.indexOf("]");
                                start += 1;
                                name = name.substring(start, end);

                                tmp = "input[name$='receipt[" + name + "][rc_amount]']";
                                $(tmp).val('');
                            }
                        }

                        return;
                    }

                });

                // $(".rc_amount").keyup(function(e) { rc_preview(e); });
                // $('#rc_btn_add').on("click", function(e) { rc_preview(e); });

            },

            hide: function(deleteElement) {
                $(this).slideUp(deleteElement);
            },

            ready: function() {

                $(".rc_completed").change(function(e) {
                    console.log("Changed");
                });

            }
        });

    }

    var purchase_order = function() {

        var options_repeater_po = jQuery('#kt_repeater_po');

        options_repeater_po.repeater({
            show: function() {
                jQuery(this).slideDown();

                $('.po_product_name-select2').select2({
                    ajax: {
                        url: '../assets/custom/api_get/get_product.php',
                        dataType: 'json'
                    },
                    width: '100%',
                    placeholder: 'Select Product Code',
                    allowClear: true
                });

                $('.po_tax-select2').select2({
                    width: '100%',
                    placeholder: 'Tax',
                    allowClear: true
                });

                $('.po_display_make-select2').select2({
                    width: '100%',
                    placeholder: 'Make',
                });

                $('.po_unit-select2').select2({
                    ajax: {
                        url: '../assets/custom/api_get/get_units.php',
                        dataType: 'json'
                    },
                    width: '100%',
                    placeholder: 'Unit',
                    tags: true,
                    allowClear: true
                });

                $('.po_product_name-select2').on("change", function(e) {

                    var id = $(e.currentTarget).val();
                    var name = e.currentTarget.name;
                    var start = name.indexOf("[");
                    var end = name.indexOf("]");
                    start += 1;
                    name = name.substring(start, end);

                    $.ajax({
                        url: '../assets/custom/api_get/get_product_info.php',
                        type: 'post',
                        data: { member_id: id },
                        dataType: 'json',
                        success: function(response) {
                            var temp = '';

                            temp = "input[name$='purchase_order[" + name + "][po_rate]']";
                            $(temp).val(response.cost);
                            temp = "input[name$='purchase_order[" + name + "][po_hsn]']";
                            $(temp).val(response.hsn);
                            temp = "select[name$='purchase_order[" + name + "][po_tax]']";
                            $(temp).val(response.tax).trigger("change");
                            temp = "select[name$='purchase_order[" + name + "][po_display_make]']";
                            $(temp).val(response.default_make).trigger("change");
                            temp = "select[name$='purchase_order[" + name + "][po_unit]']";
                            $(temp).empty().append($("<option/>").val(response.unit).text(response.unit)).val(response.unit).trigger("change");
                            temp = "textarea[name$='purchase_order[" + name + "][po_product_add_description]']";
                            var temp_2 = response.description;
                            temp_2 = temp_2.replace(/\|/g, "\r\n");
                            $(temp).val(temp_2);
                            var temp_textarea = $(temp);
                            autosize(temp_textarea);
                        } // /success
                    }); // /fetch selected member info
                    po_preview(e);
                });

                $(".po_qty").keyup(function(e) { po_preview(e); });
                $(".po_rate").keyup(function(e) { po_preview(e); });
                $(".po_dsc").keyup(function(e) { po_preview(e); });
                $('.po_tax-select2').on("select2:select", function(e) { po_preview(e); });
                $(".po_delete").click(function(e) { po_preview(e); });
                $("#po_freight").change(function(e) { po_preview(e); });
                $("#po_pf").change(function(e) { po_preview(e); });
                $("#po_tot_discount").change(function(e) { po_preview(e); });
                $("#po_round").change(function(e) { po_preview(e); });
                $('#po_btn_add').on("click", function(e) { po_preview(e); });

            },
            hide: function(deleteElement) {
                jQuery(this).slideUp(deleteElement);
            },
            ready: function(setIndexes) {

                $('.po_product_name-select2').select2({
                    ajax: {
                        url: '../assets/custom/api_get/get_product.php',
                        dataType: 'json'
                    },
                    width: '100%',
                    placeholder: 'Select Product Code',
                    allowClear: true
                });

                $('.po_tax-select2').select2({
                    width: '100%',
                    placeholder: 'Tax',
                    allowClear: true
                });

                $('.po_display_make-select2').select2({
                    width: '100%',
                    placeholder: 'Make',
                });

                $('.po_unit-select2').select2({
                    ajax: {
                        url: '../assets/custom/api_get/get_units.php',
                        dataType: 'json'
                    },
                    width: '100%',
                    placeholder: 'Unit',
                    tags: true,
                    allowClear: true
                });

                $('.po_product_name-select2').on("change", function(e) {

                    var id = $(e.currentTarget).val();
                    var name = e.currentTarget.name;
                    var start = name.indexOf("[");
                    var end = name.indexOf("]");
                    start += 1;
                    name = name.substring(start, end);

                    $.ajax({
                        url: '../assets/custom/api_get/get_product_info.php',
                        type: 'post',
                        data: { member_id: id },
                        dataType: 'json',
                        success: function(response) {
                            var temp = '';

                            temp = "input[name$='purchase_order[" + name + "][po_rate]']";
                            $(temp).val(response.cost);
                            temp = "input[name$='purchase_order[" + name + "][po_hsn]']";
                            $(temp).val(response.hsn);
                            temp = "select[name$='purchase_order[" + name + "][po_tax]']";
                            $(temp).val(response.tax).trigger("change");
                            temp = "select[name$='purchase_order[" + name + "][po_display_make]']";
                            $(temp).val(response.default_make).trigger("change");
                            temp = "select[name$='purchase_order[" + name + "][po_unit]']";
                            $(temp).empty().append($("<option/>").val(response.unit).text(response.unit)).val(response.unit).trigger("change");
                            var temp_2 = response.description;
                            temp_2 = temp_2.replace(/\|/g, "\r\n");
                            $(temp).val(temp_2);
                        } // /success
                    }); // /fetch selected member info
                    po_preview(e);
                });

                $(".po_qty").keyup(function(e) { po_preview(e); });
                $(".po_rate").keyup(function(e) { po_preview(e); });
                $(".po_dsc").keyup(function(e) { po_preview(e); });
                $('.po_tax-select2').on("select2:select", function(e) { po_preview(e); });
                $(".po_delete").click(function(e) { po_preview(e); });
                $("#po_freight").change(function(e) { po_preview(e); });
                $("#po_pf").change(function(e) { po_preview(e); });
                $("#po_tot_discount").change(function(e) { po_preview(e); });
                $("#po_round").change(function(e) { po_preview(e); });
                $('#po_btn_add').on("click", function(e) { po_preview(e); });
            },
            isFirstItemUndeletable: false
        });

        jQuery("#purchase_order_list").sortable({
            axis: "y",
            cursor: 'pointer',
            opacity: 0.5,
            placeholder: "row-dragging",
            delay: 150,
            update: function(event, ui) {
                options_repeater.repeater('setIndexes');
            }

        }).disableSelection();

    }

    var purchase_invoice = function() {

        var options_repeater_pi = jQuery('#kt_repeater_pi');

        options_repeater_pi.repeater({
            show: function() {
                jQuery(this).slideDown();

                $('.pi_product_name-select2').select2({
                    ajax: {
                        url: '../assets/custom/api_get/get_product.php',
                        dataType: 'json'
                    },
                    width: '100%',
                    placeholder: 'Select Product Code',
                    allowClear: true
                });

                $('.pi_tax-select2').select2({
                    width: '100%',
                    placeholder: 'Tax',
                    allowClear: true
                });

                $('.pi_display_make-select2').select2({
                    width: '100%',
                    placeholder: 'Make',
                });

                $('.pi_unit-select2').select2({
                    ajax: {
                        url: '../assets/custom/api_get/get_units.php',
                        dataType: 'json'
                    },
                    width: '100%',
                    placeholder: 'Unit',
                    tags: true
                });

                $('.pi_product_name-select2').on("select2:select", function(e) {

                    var id = $(e.currentTarget).val();
                    var name = e.currentTarget.name;
                    var start = name.indexOf("[");
                    var end = name.indexOf("]");
                    start += 1;
                    name = name.substring(start, end);

                    $.ajax({
                        url: '../assets/custom/api_get/get_product_info.php',
                        type: 'post',
                        data: { member_id: id },
                        dataType: 'json',
                        success: function(response) {
                            var temp = '';

                            temp = "input[name$='purchase_invoice[" + name + "][pi_rate]']";
                            $(temp).val(response.cost);
                            temp = "input[name$='purchase_invoice[" + name + "][pi_hsn]']";
                            $(temp).val(response.hsn);
                            temp = "select[name$='purchase_invoice[" + name + "][pi_tax]']";
                            $(temp).val(response.tax).trigger("change");
                            temp = "select[name$='purchase_invoice[" + name + "][pi_display_make]']";
                            $(temp).val(response.default_make).trigger("change");
                            temp = "select[name$='purchase_invoice[" + name + "][pi_unit]']";
                            $(temp).empty().append($("<option/>").val(response.unit).text(response.unit)).val(response.unit).trigger("change");
                            temp = "textarea[name$='purchase_invoice[" + name + "][pi_product_add_description]']";
                            var temp_2 = response.description;
                            temp_2 = temp_2.replace(/\|/g, "\r\n");
                            $(temp).val(temp_2);
                            var temp_textarea = $(temp);
                            autosize(temp_textarea);
                        } // /success
                    }); // /fetch selected member info
                });

                $(".pi_qty").keyup(function(e) { pi_preview(e); });
                $(".pi_rate").keyup(function(e) { pi_preview(e); });
                $(".pi_dsc").keyup(function(e) { pi_preview(e); });
                $('.pi_tax-select2').on("select2:select", function(e) { pi_preview(e); });
                $(".pi_delete").click(function(e) { pi_preview(e); });
                $("#pi_freight").change(function(e) { pi_preview(e); });
                $("#pi_pf").change(function(e) { pi_preview(e); });
                $("#pi_tot_discount").change(function(e) { pi_preview(e); });
                $("#pi_round").change(function(e) { pi_preview(e); });
                $('#pi_btn_add').on("click", function(e) { pi_preview(e); });

            },
            hide: function(deleteElement) {
                jQuery(this).slideUp(deleteElement);
            },
            ready: function(setIndexes) {

                $('.pi_product_name-select2').select2({
                    ajax: {
                        url: '../assets/custom/api_get/get_product.php',
                        dataType: 'json'
                    },
                    width: '100%',
                    placeholder: 'Select Product Code',
                    allowClear: true
                });

                $('.pi_tax-select2').select2({
                    width: '100%',
                    placeholder: 'Tax',
                    allowClear: true
                });

                $('.pi_display_make-select2').select2({
                    width: '100%',
                    placeholder: 'Make',
                });

                $('.pi_unit-select2').select2({
                    ajax: {
                        url: '../assets/custom/api_get/get_units.php',
                        dataType: 'json'
                    },
                    width: '100%',
                    placeholder: 'Unit',
                    tags: true
                });

                $('.pi_product_name-select2').on("select2:select", function(e) {

                    var id = $(e.currentTarget).val();
                    var name = e.currentTarget.name;
                    var start = name.indexOf("[");
                    var end = name.indexOf("]");
                    start += 1;
                    name = name.substring(start, end);

                    $.ajax({
                        url: '../assets/custom/api_get/get_product_info.php',
                        type: 'post',
                        data: { member_id: id },
                        dataType: 'json',
                        success: function(response) {
                            var temp = '';

                            temp = "input[name$='purchase_invoice[" + name + "][pi_rate]']";
                            $(temp).val(response.cost);
                            temp = "input[name$='purchase_invoice[" + name + "][pi_hsn]']";
                            $(temp).val(response.hsn);
                            temp = "select[name$='purchase_invoice[" + name + "][pi_tax]']";
                            $(temp).val(response.tax).trigger("change");
                            temp = "select[name$='purchase_invoice[" + name + "][pi_unit]']";
                            $(temp).empty().append($("<option/>").val(response.unit).text(response.unit)).val(response.unit).trigger("change");
                            temp = "select[name$='purchase_invoice[" + name + "][pi_display_make]']";
                            $(temp).val(response.default_make).trigger("change");
                            temp = "textarea[name$='purchase_invoice[" + name + "][pi_product_add_description]']";
                            var temp_2 = response.description;
                            temp_2 = temp_2.replace(/\|/g, "\r\n");
                            $(temp).val(temp_2);
                            var temp_textarea = $(temp);
                            autosize(temp_textarea);
                        } // /success
                    }); // /fetch selected member info
                });

                $(".pi_qty").keyup(function(e) { pi_preview(e); });
                $(".pi_rate").keyup(function(e) { pi_preview(e); });
                $(".pi_dsc").keyup(function(e) { pi_preview(e); });
                $('.pi_tax-select2').on("select2:select", function(e) { pi_preview(e); });
                $(".pi_delete").click(function(e) { pi_preview(e); });
                $("#pi_freight").change(function(e) { pi_preview(e); });
                $("#pi_pf").change(function(e) { pi_preview(e); });
                $("#pi_tot_discount").change(function(e) { pi_preview(e); });
                $("#pi_round").change(function(e) { pi_preview(e); });
                $('#pi_btn_add').on("click", function(e) { pi_preview(e); });
            },
            isFirstItemUndeletable: false
        });

        jQuery("#purchase_invoice_list").sortable({
            axis: "y",
            cursor: 'pointer',
            opacity: 0.5,
            placeholder: "row-dragging",
            delay: 150,
            update: function(event, ui) {
                options_repeater.repeater('setIndexes');
            }

        }).disableSelection();

    }

    var purchase_ledger = function() {

        managePurchaseLedgerTable = $('#purchase_ledger_datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: '../assets/custom/reports/retreive_purchase_ledger.php',
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
                pageSize: 10,
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
            sortable: false,

            pagination: true,

            search: {
                input: $('#generalSearch'),
            },

            // columns definition
            columns: [{
                field: 'SN',
                title: '',
                template: '{{RecordID}}',
                width: 20,
                selector: {
                    class: 'kt-checkbox--solid'
                },
                textAlign: 'center',
            }, {
                field: 'Name',
                title: 'Name',
                template: function(row) {
                    var output = row.Name;
                    return output;
                },
            }, {
                field: 'Number',
                title: 'Invoice Number',
            }, {
                field: 'Date',
                title: 'Date',
            }, {
                field: 'Tax',
                title: 'Tax',
            }, {
                field: 'Amount',
                title: 'Amount',
            }, {
                field: 'Actions',
                title: 'Actions',
                sortable: false,
                width: 110,
                overflow: 'visible',
                autoHide: false,
            }],

        });

    };

    var payment = function() {

        $('#kt_repeater_py').repeater({
            initEmpty: false,

            show: function() {
                $(this).slideDown();

                $(".py_completed").change(function(e) {
                    if (e.handled !== true) {
                        e.handled = true;

                        if (this.checked) {

                            var total = $('#amount').val();
                            var collected = 0;

                            console.log("Total : " + total);

                            var rep = document.getElementById('payment_list');
                            var rowsCount = rep.childNodes.length;

                            for (var i = 0; i < rowsCount; i++) {
                                var tmp = "input[name$='payment[" + i + "][py_amount]']";
                                var temp = $(tmp).val();
                                if (temp != '') {
                                    temp = temp.replace(',', '');
                                    temp = parseInt(temp);
                                    collected += temp;
                                }
                                console.log("Collected : " + i + "  " + collected);


                            }

                            total = total - collected;
                            console.log("Total Revised: " + total);

                            var name = e.currentTarget.name;
                            if (name != null) {
                                var start = name.indexOf("[");
                                var end = name.indexOf("]");
                                start += 1;
                                name = name.substring(start, end);

                                tmp = "input[name$='payment[" + name + "][py_due]']";
                                var due = $(tmp).val();

                                due = due.replace(/,/g, '');
                                due = parseInt(due);

                                tmp = "input[name$='payment[" + name + "][py_amount]']";
                                if (due <= total) {
                                    $(tmp).val(due);
                                } else {
                                    $(tmp).val(total);
                                }
                            }
                        } else {
                            var name = e.currentTarget.name;
                            if (name != null) {
                                var start = name.indexOf("[");
                                var end = name.indexOf("]");
                                start += 1;
                                name = name.substring(start, end);

                                tmp = "input[name$='payment[" + name + "][py_amount]']";
                                $(tmp).val('');
                            }
                        }

                        return;
                    }

                });

                // $(".py_amount").keyup(function(e) { py_preview(e); });
                // $('#py_btn_add').on("click", function(e) { py_preview(e); });

            },

            hide: function(deleteElement) {
                $(this).slideUp(deleteElement);
            },

            ready: function() {

            }
        });

    }

    var supplier = function() {

        $('#kt_modal_supplier').on('show.bs.modal', function() {
            $('[data-repeater-list="supplier"]').empty();
            $('[data-repeater-create="add_supplier_contact"]').click();
        });

        $('#kt_repeater_supplier').repeater({
            initEmpty: false,

            defaultValues: {
                'text-input': 'foo'
            },

            show: function() {
                $(this).slideDown();
            },

            hide: function(deleteElement) {
                $(this).slideUp(deleteElement);
            },

            ready: function() {

            },
            isFirstItemUndeletable: false

        });

    }

    var edit_supplier = function() {

        $('#kt_modal_edit_supplier').on('show.bs.modal', function() {
            $('[data-repeater-list="edit_supplier"]').empty();
            // $('[data-repeater-create="edit_supplier_btn"]').click();
        });

        $('#kt_repeater_supplier_edit').repeater({
            initEmpty: false,
            defaultValues: {
                'text-input': 'foo'
            },

            show: function() {
                $(this).slideDown();
            },

            hide: function(deleteElement) {
                $(this).slideUp(deleteElement);
            },

            ready: function() {

            },
            isFirstItemUndeletable: false

        });

    }

    var client = function() {

        $('#kt_modal_client').on('show.bs.modal', function() {
            $('[data-repeater-list="client"]').empty();
            $('[data-repeater-create="add_client_contact"]').click();
        });

        $('#kt_repeater_client').repeater({
            initEmpty: false,

            defaultValues: {
                'text-input': 'foo'
            },

            show: function() {
                $(this).slideDown();
            },

            hide: function(deleteElement) {
                $(this).slideUp(deleteElement);
            },

            ready: function() {

            },
            isFirstItemUndeletable: false

        });

    }

    var edit_client = function() {

        $('#kt_modal_edit_client').on('show.bs.modal', function() {
            $('[data-repeater-list="edit_client"]').empty();
            // $('[data-repeater-create="edit_client_btn"]').click();
        });

        $('#kt_repeater_client_edit').repeater({
            initEmpty: false,
            defaultValues: {
                'text-input': 'foo'
            },

            show: function() {
                $(this).slideDown();
            },

            hide: function(deleteElement) {
                $(this).slideUp(deleteElement);
            },

            ready: function() {

            },
            isFirstItemUndeletable: false

        });

    }

    var assemblies = function() {
        $('#kt_repeater_assemblies').repeater({
            initEmpty: false,

            show: function() {
                $(this).slideDown();

                $('.a_product_name-select2').select2({
                    ajax: {
                        url: '../assets/custom/api_get/get_product.php',
                        dataType: 'json'
                    },
                    width: '100%',
                    placeholder: 'Select Spare Product',
                    tags: true,
                    allowClear: true
                });

                $('.a_product_name-select2').on("select2:select", function(e) {

                    var id = $(e.currentTarget).val();
                    var name = e.currentTarget.name;
                    var start = name.indexOf("[");
                    var end = name.indexOf("]");
                    start += 1;
                    name = name.substring(start, end);

                    $.ajax({
                        url: '../assets/custom/api_get/get_product_info.php',
                        type: 'post',
                        data: { member_id: id },
                        dataType: 'json',
                        success: function(response) {
                            var temp = '';
                            temp = "input[name$='assemblies[" + name + "][a_desc]']";
                            $(temp).val(response.description);

                        } // /success
                    }); // /fetch selected member info

                });

                $('#a_btn_add').on("click", function(e) { a_preview(e); });
            },

            hide: function(deleteElement) {
                $(this).slideUp(deleteElement);
            },

            ready: function() {

                $('.a_product_name-select2').select2({
                    ajax: {
                        url: '../assets/custom/api_get/get_product.php',
                        dataType: 'json'
                    },
                    width: '100%',
                    placeholder: 'Select Spare Product',
                    tags: true,
                    allowClear: true
                });

                $('.a_product_name-select2').on("select2:select", function(e) {

                    var id = $(e.currentTarget).val();
                    var name = e.currentTarget.name;
                    var start = name.indexOf("[");
                    var end = name.indexOf("]");
                    start += 1;
                    name = name.substring(start, end);

                    $.ajax({
                        url: '../assets/custom/api_get/get_product_info.php',
                        type: 'post',
                        data: { member_id: id },
                        dataType: 'json',
                        success: function(response) {
                            var temp = '';
                            temp = "input[name$='assemblies[" + name + "][a_desc]']";
                            $(temp).val(response.description);

                        } // /success
                    }); // /fetch selected member info

                });

                $('#a_btn_add').on("click", function(e) { a_preview(e); });
            }
        });
    }

    return {
        init: function() {
            enquiry();
            quotation();
            sales_order();
            sales_invoice();
            sales_ledger();
            receipt();
            purchase_order();
            purchase_invoice();
            purchase_ledger();
            payment();
            supplier();
            edit_supplier();
            client();
            edit_client();
            assemblies();
        }
    };
}();

var Select2 = function() {

    var search = function() {

        $('#wa_template').select2({
            width: '100%',
            placeholder: 'Select Template',
            allowClear: true
        });

        $('#whatsapp_status').select2({
            width: '100%',
            placeholder: 'Select Option'
        });

        $('#wa_template').on("change", function(e) {
            var id = $(this).val();
            $.ajax({
                url: '../assets/custom/api_get/get_template.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {
                    // console.log(response);
                    var tmp = "#wa_message";
                    var temp = response.message;
                    temp = temp.replace(/\|/g, "\r\n");
                    $(tmp).val(temp);

                    var temp_textarea = $(tmp);
                    autosize(temp_textarea);
                    // KTUtil.scrollTop();
                }
            });
        });

        $('#kt_product_group').on("change", function(e) {
            $('#kt_product_category').val('').trigger('change');
            $('#kt_product_sub_category').val('').trigger('change');
            manageDashboardTable.search($(this).val(), 'group');
        });

        $('#kt_si_series').on("change", function(e) {
            console.log('kjh');
            manageSalesInvoiceTable.search($(this).val(), 'series');
        });

        $('#kt_product_category').on("change", function(e) {
            $('#kt_product_sub_category').val('').trigger('change');
            manageDashboardTable.search($(this).val(), 'category');
        });

        $('#kt_product_sub_category').on("change", function(e) {
            manageDashboardTable.search($(this).val(), 'sub_category');
        });

        $('#kt_pr_product_group').on("change", function(e) {
            $('#kt_pr_product_category').val('').trigger('change');
            $('#kt_pr_product_sub_category').val('').trigger('change');
            manageProductTable.search($(this).val(), 'group');
        });

        $('#kt_pr_product_category').on("change", function(e) {
            $('#kt_pr_product_sub_category').val('').trigger('change');
            manageProductTable.search($(this).val(), 'category');
        });

        $('#kt_pr_product_sub_category').on("change", function(e) {
            manageProductTable.search($(this).val(), 'sub_category');
        });

        $('#kt_sales_followup_status').on("change", function(e) {
            manageSalesFollowupTable.search($(this).val(), 'status');
        });
    }

    var products = function() {

        $('#kt_product_group').select2({
            ajax: {
                url: '../assets/custom/api_get/get_group.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Filter Group',
            allowClear: true
        });

        $('#kt_product_category').select2({
            ajax: {
                url: '../assets/custom/api_get/get_category.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Filter Category',
            allowClear: true
        });

        $('#kt_product_sub_category').select2({
            ajax: {
                url: '../assets/custom/api_get/get_sub_category.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Filter Sub Category',
            allowClear: true
        });

        $('#kt_pr_product_group').select2({
            ajax: {
                url: '../assets/custom/api_get/get_pr_group.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Filter Group',
            allowClear: true
        });

        $('#kt_pr_product_category').select2({
            ajax: {
                url: '../assets/custom/api_get/get_pr_category.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Filter Category',
            allowClear: true
        });

        $('#kt_pr_product_sub_category').select2({
            ajax: {
                url: '../assets/custom/api_get/get_pr_sub_category.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Filter Sub Category',
            allowClear: true
        });

        $('#product_name').select2({
            ajax: {
                url: '../assets/custom/api_get/get_product.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Product Name',
            tags: true,
            allowClear: true,
            selectOnClose: true
        });

        $('#product_group_name').select2({
            ajax: {
                url: '../assets/custom/api_get/get_group.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select Group',
            tags: true,
            selectOnClose: true
        });

        $('#product_category').select2({
            ajax: {
                url: '../assets/custom/api_get/get_category.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select Category',
            tags: true,
            selectOnClose: true
        });

        $('#product_sub_category').select2({
            ajax: {
                url: '../assets/custom/api_get/get_sub_category.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select Sub Category',
            tags: true,
            selectOnClose: true
        });

        $('#product_unit').select2({
            ajax: {
                url: '../assets/custom/api_get/get_units.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select Unit',
            tags: true
        });

        $('#product_tax').select2({
            width: '100%',
            placeholder: 'Select Tax',
            selectOnClose: true
        });

        $('#edit_product_name').select2({
            ajax: {
                url: '../assets/custom/api_get/get_product.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Product Name',
            tags: true,
            allowClear: true,
            selectOnClose: true
        });

        $('#edit_product_group_name').select2({
            ajax: {
                url: '../assets/custom/api_get/get_group.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select Group',
            tags: true,
            selectOnClose: true
        });

        $('#edit_product_category').select2({
            ajax: {
                url: '../assets/custom/api_get/get_category.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select Category',
            tags: true,
            selectOnClose: true
        });

        $('#edit_product_sub_category').select2({
            ajax: {
                url: '../assets/custom/api_get/get_sub_category.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select Sub Category',
            tags: true,
            selectOnClose: true
        });

        $('#edit_product_unit').select2({
            ajax: {
                url: '../assets/custom/api_get/get_units.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select Unit',
            tags: true
        });

        $('#edit_product_tax').select2({
            width: '100%',
            placeholder: 'Select Tax',
            selectOnClose: true
        });
    };

    var clients = function() {

        $('#client_name').keyup(function(e) {
            var temp = $('#client_name').val();
            $('#client_print_name').val(temp);
        });

        $('#edit_client_name').keyup(function(e) {
            var temp = $('#edit_client_name').val();
            $('#edit_client_print_name').val(temp);
        });

        $('#client_category').select2({
            ajax: {
                url: '../assets/custom/api_get/get_client_type.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select client Type',
            tags: true,
            allowClear: true,
            selectOnClose: true
        });

        $('#edit_client_category').select2({
            ajax: {
                url: '../assets/custom/api_get/get_client_type.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select client Type',
            tags: true,
            allowClear: true,
            selectOnClose: true
        });

        $('#client_state').select2({
            ajax: {
                url: '../assets/custom/api_get/get_states.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select State',
            // tags: true,
            allowClear: true
        });

        $('#edit_client_state').select2({
            ajax: {
                url: '../assets/custom/api_get/get_states.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select State',
            // tags: true,
            allowClear: true
        });

        $('#client_gstin_type').select2({
            width: '100%'
        });

        $('#edit_client_gstin_type').select2({
            width: '100%'
        });

        $('#kt_form_status').on('change', function() {
            manageClientTable.search($(this).val().toLowerCase(), 'Status');
        });

        $('#kt_form_type').on('change', function() {
            manageClientTable.search($(this).val().toLowerCase(), 'Type');
        });

        $('#kt_form_status,#kt_form_type').selectpicker();
    };

    var transporters = function() {

        $('#transporter_state').select2({
            ajax: {
                url: '../assets/custom/api_get/get_states.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select State',
            // tags: true,
            allowClear: true
        });

        $('#edit_transporter_state').select2({
            ajax: {
                url: '../assets/custom/api_get/get_states.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select State',
            // tags: true,
            allowClear: true
        });

        $('#kt_form_status').on('change', function() {
            manageClientTable.search($(this).val().toLowerCase(), 'Status');
        });

        $('#kt_form_type').on('change', function() {
            manageClientTable.search($(this).val().toLowerCase(), 'Type');
        });

        $('#kt_form_status,#kt_form_type').selectpicker();
    };

    var suppliers = function() {

        $('#supplier_name').keyup(function(e) {
            var temp = $('#supplier_name').val();
            $('#supplier_print_name').val(temp);
        });

        $('#edit_supplier_name').keyup(function(e) {
            var temp = $('#edit_supplier_name').val();
            $('#edit_supplier_print_name').val(temp);
        });

        $('#supplier_category').select2({
            ajax: {
                url: '../assets/custom/api_get/get_supplier_type.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select Supplier Type',
            tags: true,
            allowClear: true,
            selectOnClose: true
        });

        $('#edit_supplier_category').select2({
            ajax: {
                url: '../assets/custom/api_get/get_supplier_type.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select Supplier Type',
            tags: true,
            allowClear: true,
            selectOnClose: true
        });

        $('#supplier_state').select2({
            ajax: {
                url: '../assets/custom/api_get/get_states.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select State',
            // tags: true,
            allowClear: true
        });

        $('#edit_supplier_state').select2({
            ajax: {
                url: '../assets/custom/api_get/get_states.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select State',
            // tags: true,
            allowClear: true
        });

        $('#supplier_gstin_type').select2({
            width: '100%'
        });

        $('#edit_supplier_gstin_type').select2({
            width: '100%'
        });

        $('#kt_form_status').on('change', function() {
            manageSupplierTable.search($(this).val().toLowerCase(), 'Status');
        });

        $('#kt_form_type').on('change', function() {
            manageSupplierTable.search($(this).val().toLowerCase(), 'Type');
        });

        $('#kt_form_status,#kt_form_type').selectpicker();
    };

    var users = function() {
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

    var enquiry = function() {
        var portlet = new KTPortlet('kt_portlet_add_e');

        $('#enquiry_date').datepicker({
            dateFormat: 'dd-mm-yy'
        });

        $('.enquiry-select2').select2({
            width: '100%',
            placeholder: 'Mode',
            tags:true
        });

        $('.enquiry-status-select2').select2({
            width: '100%',
            placeholder: 'Status'
        });

        $('#e_client').select2({
            ajax: {
                url: '../assets/custom/api_get/get_client.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select Client',
            selectOnClose: true,
            tags: true,
            allowClear: true
        });

        $('#e_client').on("change", function(e) {
            var selected_client = $(e.currentTarget).val();
            $.ajax({
                url: '../assets/custom/api_get/get_client_address.php',
                type: 'post',
                data: { member_id: selected_client },
                dataType: 'json',
                success: function(response) {
                    if(response != null) {
                        var address = response.address;
                        var state = response.state;
                        if(state != null) {
                            $("#state").val(state);
                        } else {
                            $("#state").val('');
                        }
                        if(address != null) {
                            address = JSON.parse(address);
                            $("#address_1").val(address.address_1);
                            $("#address_2").val(address.address_2);
                            $("#city").val(address.city);
                            $("#pincode").val(address.pincode);
                        } else {
                            $("#address_1").val('');
                            $("#address_2").val('');
                            $("#city").val('');
                            $("#pincode").val('');
                        }
                    } else {
                        $("#address_1").val('');
                        $("#address_2").val('');
                        $("#city").val('');
                        $("#pincode").val('');
                        $("#q_state").val('');
                        $("#state").val('');
                    }
                } // Success
            });
        });
    };

    var quotation = function() {
        var portlet = new KTPortlet('kt_portlet_add_q');

        $('#quotation_date').datepicker({
            dateFormat: 'dd-mm-yy'
        });

        $('.quotation-status-select2').select2({
            width: '100%',
            placeholder: 'Status'
        });

        $('#q_client').select2({
            ajax: {
                url: '../assets/custom/api_get/get_client.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select Client',
            selectOnClose: true,
            tags: true,
            allowClear: true,
        });

        $('#q_client').on("change", function(e) {
            $('[data-repeater-list="quotation"]').empty();
            $('[data-repeater-create="quotation"]').click();
            var tmp = "input[name$='quotation[0][q_sn]']";
            $(tmp).val(1);
            selected_client = $(e.currentTarget).val();
            $.ajax({
                url: '../assets/custom/api_get/get_client_address.php',
                type: 'post',
                data: { member_id: selected_client },
                dataType: 'json',
                success: function(response) {
                    $("#cl_name").val(response.name);
                    $("#cl_mobile").val(response.mobile);
                    $("#cl_email").val(response.email);

                    if(response != null) {
                        var address = response.address;
                        var state = response.state;
                        if(state != null) {
                            $("#q_state").val(state);
                            $("#state").val(state);
                            console.log(state);
                        } else {
                            $("#q_state").val('');
                            $("#state").val('');
                        }
                        if(address != null) {
                            address = JSON.parse(address);
                            $("#address_1").val(address.address_1);
                            $("#address_2").val(address.address_2);
                            $("#city").val(address.city);
                            $("#pincode").val(address.pincode);
                        } else {
                            $("#address_1").val('');
                            $("#address_2").val('');
                            $("#city").val('');
                            $("#pincode").val('');
                        }
                    } else {
                        $("#address_1").val('');
                        $("#address_2").val('');
                        $("#city").val('');
                        $("#pincode").val('');
                        $("#q_state").val('');
                        $("#state").val('');
                    }
                } // Success
            });
            // $('.q_enquiry_no-select2').val(null).trigger('change');
            $('#q_enquiry_date').val('');
        });

        $('#q_enquiry_no').select2({
            ajax: {
                url: '../assets/custom/api_get/get_enquiry.php',
                type: 'POST',
                dataType: 'json',
                data: function(term, page) {
                    return {
                        q: term, // search term
                        client: selected_client //Get your value from other elements using Query, for example.
                    };
                }
            },
            width: '100%',
            placeholder: 'Select Enquiry',
            multiple: true,
            tags: true,
            selectOnClose: true
        });

        $('#q_client').on("select2:select", function(e) {
            $('[data-repeater-list="quotation"]').empty();
            $('[data-repeater-create="quotation"]').click();
            var tmp = "input[name$='quotation[0][q_sn]']";
            $(tmp).val(1);
            selected_client = $(e.currentTarget).val();
            $('.q_enquiry_no-select2').val(null).trigger('change');
            $('#q_enquiry_date').val('');
        });

        $('.q_enquiry_no-select2').on("select2:select", function(e) {
            $('[data-repeater-list="quotation"]').empty();
            $('[data-repeater-create="quotation"]').click();
            var tmp = "input[name$='quotation[0][q_sn]']";
            $(tmp).val(1);

            var id = $(e.currentTarget).val();
            $.ajax({
                url: '../assets/custom/enquiry/getSelectedEnquiryPull.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response1) {

                    var temp = '';
                    $('#q_enquiry_date').val(response1.enquiry_date);
                    $('#q_cl_enquiry_no').val(response1.cl_enquiry);
                    // $('#q_client').val(response1.client);

                    var obj = JSON.parse(response1.items);
                    var length = obj.product.length;
                    var count = 0;
                    var c = 0;

                    for (var i = 1; i < length; i++) {
                        $('#qtn_btn_add').click();
                    }
                    for (var i = 0; i < length; i++) {

                        if (obj.quantity[i] > 0) {
                            temp = "select[name$='quotation[" + c + "][q_product_name]']";
                            var pr = obj.product[i];
                            $(temp).empty().append($("<option/>").val(pr).text(pr)).val(pr).trigger("change");

                            temp = "input[name$='quotation[" + c + "][q_qty]']";
                            $(temp).val(obj.quantity[i]);
                            temp = "textarea[name$='quotation[" + c + "][q_product_add_description]']";

                            var temp_val = obj.desc[i];
                            temp_val = temp_val.replace(/\|/g, "\r\n");
                            $(temp).val(temp_val);

                            $.ajax({
                                url: '../assets/custom/api_get/get_product_info.php',
                                type: 'post',
                                data: { member_id: pr },
                                dataType: 'json',
                                async: false,
                                success: function(response) {
                                    temp = "input[name$='quotation[" + c + "][q_rate]']";
                                    $(temp).val(response.rate);
                                    temp = "select[name$='quotation[" + c + "][q_unit]']";
                                    $(temp).empty().append($("<option/>").val(response.unit).text(response.unit)).val(response.unit).trigger("change");
                                    temp = "input[name$='quotation[" + c + "][q_hsn]']";
                                    $(temp).val(response.hsn);
                                    temp = "select[name$='quotation[" + c + "][q_tax]']";
                                    $(temp).val(response.tax).trigger("change");
                                    temp = "select[name$='quotation[" + c + "][q_display_make]']";
                                    $(temp).val(response.default_make).trigger("change");

                                }
                            });
                            c++;
                        }

                    }
                    q_preview(e);

                }
            });
        });
    };

    var sales_order = function() {

        var portlet = new KTPortlet('kt_portlet_add_so');

        $('#sales_date').datepicker({
            dateFormat: 'dd-mm-yy'
        });

        $('#followup_invoice_date').datepicker({
            dateFormat: 'dd-mm-yy'
        });

        $('#so_client').select2({
            ajax: {
                url: '../assets/custom/api_get/get_client.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select Client',
            selectOnClose: true
        });

        $('.so_status-select2').select2({
            width: '100%',
            placeholder: 'Status',
            allowClear: true
        });

        $('.so_collected-select2').select2({
            width: '100%',
            placeholder: 'Status'
        });

        $('#so_quotation').select2({
            ajax: {
                url: '../assets/custom/api_get/get_quotation.php',
                type: 'POST',
                dataType: 'json',
                data: function(term, page) {
                    return {
                        q: term, // search term
                        client: selected_client //Get your value from other elements using Query, for example.
                    };
                }
            },
            width: '100%',
            placeholder: 'Select Quotation',
            multiple: true
        });

        $('#so_client').on("select2:select", function(e) {
            $('[data-repeater-list="sales_order"]').empty();
            $('[data-repeater-create="sales_order"]').click();
            var tmp = "input[name$='sales_order[0][so_sn]']";
            $(tmp).val(1);
            selected_client = $(e.currentTarget).val();
            $('.so_quotation-select2').val(null).trigger('change');
        });

        $('.so_quotation-select2').on("select2:select", function(e) {
            $('[data-repeater-list="sales_order"]').empty();
            $('[data-repeater-create="sales_order"]').click();
            var tmp = "input[name$='sales_order[0][so_sn]']";
            $(tmp).val(1);

            var id = $(e.currentTarget).val();
            $.ajax({
                url: '../assets/custom/quotation/getSelectedQuotationPull.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response1) {

                    var temp = '';
                    var obj = JSON.parse(response1.items);
                    var addons = JSON.parse(response1.addons);
                    var length = obj.product.length;
                    var count = 0;
                    var c = 0;

                    $('#so_freight').val(addons.freight);
                    $('#so_pf').val(addons.pf);
                    $('#so_tot_discount').val(addons.discount);


                    for (var i = 1; i < length; i++) {
                        $('#so_btn_add').click();
                    }
                    for (var i = 0; i < length; i++) {

                        if (obj.quantity[i] > 0) {
                            temp = "select[name$='sales_order[" + c + "][so_product_name]']";
                            var pr = obj.product[i];
                            $(temp).empty().append($("<option/>").val(pr).text(pr)).val(pr).trigger("change");
                            temp = "input[name$='sales_order[" + c + "][so_qty]']";
                            $(temp).val(obj.quantity[i]);
                            temp = "select[name$='sales_order[" + c + "][so_unit]']";
                            $(temp).empty().append($("<option/>").val(obj.unit[i]).text(obj.unit[i])).val(obj.unit[i]).trigger("change");
                            temp = "input[name$='sales_order[" + c + "][so_rate]']";
                            $(temp).val(obj.price[i]);
                            temp = "input[name$='sales_order[" + c + "][so_dsc]']";
                            $(temp).val(obj.discount[i]);
                            temp = "input[name$='sales_order[" + c + "][so_hsn]']";
                            $(temp).val(obj.hsn[i]);
                            temp = "select[name$='sales_order[" + c + "][so_tax]']";
                            $(temp).val(obj.tax[i]).trigger("change");
                            temp = "select[name$='sales_order[" + c + "][so_display_make]']";
                            $(temp).val(obj.group[i]).trigger("change");

                            temp = "textarea[name$='sales_order[" + c + "][so_product_add_description]']";
                            var temp_val = obj.desc[i];
                            temp_val = temp_val.replace(/\|/g, "\r\n");
                            $(temp).val(temp_val);

                            var temp_textarea = $(temp);
                            autosize(temp_textarea);

                            c++;
                        }

                    }
                    so_preview(e);

                }
            });
        });
    };

    var sales = function() {
        var portlet = new KTPortlet('kt_portlet_add_si');

        $('#kt_si_series').select2({
            ajax: {
                url: '../assets/custom/api_get/get_series.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Filter Series',
            allowClear: true
        });

        $('#despatch_medium').select2({
            ajax: {
                url: '../assets/custom/api_get/get_transporter.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select transporter',
            selectOnClose: true
        });

        $('#si_series').on('select2:select', function(e) {
            var data = e.params.data.id;
            set_sales_invoice_no(data);
        });

        $('#sales_invoice_date').datepicker({
            dateFormat: 'dd-mm-yy'
        });

        $('#buyer_order_date').datepicker({
            dateFormat: 'dd-mm-yy'
        });

        $('#despatch_date').datepicker({
            dateFormat: 'dd-mm-yy'
        });

        $('#si_client').select2({
            ajax: {
                url: '../assets/custom/api_get/get_client.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select Client',
            selectOnClose: true
        });

        $('#si_series').select2({
            width: '100%',
            placeholder: 'Select Series'
        });

        $('#si_start').select2({
            width: '100%',
            placeholder: 'Select Format'
        });

        $('#shipping_state').select2({
            ajax: {
                url: '../assets/custom/api_get/get_states.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select State',
            // tags: true,
            allowClear: true
        });

        $('#si_sales_order').select2({
            ajax: {
                url: '../assets/custom/api_get/get_sales_order.php',
                type: 'POST',
                dataType: 'json',
                data: function(term, page) {
                    return {
                        q: term, // search term
                        client: selected_client //Get your value from other elements using Query, for example.
                    };
                }
            },
            width: '100%',
            placeholder: 'Select Sales Order',
            multiple: true
        });

        $('#si_quotation').select2({
            ajax: {
                url: '../assets/custom/api_get/get_quotation.php',
                type: 'POST',
                dataType: 'json',
                data: function(term, page) {
                    return {
                        q: term, // search term
                        client: selected_client //Get your value from other elements using Query, for example.
                    };
                }
            },
            width: '100%',
            placeholder: 'Select Quotation',
            multiple: true
        });

        $('#si_client').on("select2:select", function(e) {
            $('[data-repeater-list="sales_invoice"]').empty();
            $('[data-repeater-create="sales_invoice"]').click();
            var tmp = "input[name$='sales_invoice[0][si_sn]']";
            $(tmp).val(1);
            selected_client = $(e.currentTarget).val();
            $.ajax({
                url: '../assets/custom/api_get/get_client_address.php',
                type: 'post',
                data: { member_id: selected_client },
                dataType: 'json',
                success: function(response) {

                    $("#shipping_name").val(response.print_name);

                    var address = JSON.parse(response.address);
                    $("#shipping_add_1").val(address.address_1);
                    $("#shipping_add_2").val(address.address_2);
                    $("#shipping_city").val(address.city);
                    $("#shipping_pincode").val(address.pincode);
                    $("#shipping_state").empty().append($("<option/>").val(response.state).text(response.state)).val(response.state).trigger("change");

                    $("#shipping_country").val(response.country);

                } // /success
            }); // /fetch selected member info
            $('.si_sales_order-select2').val(null).trigger('change');
        });

        $('.si_sales_order-select2').on("select2:select", function(e) {
            $('[data-repeater-list="sales_invoice"]').empty();
            $('[data-repeater-create="sales_invoice"]').click();
            var tmp = "input[name$='sales_invoice[0][si_sn]']";
            $(tmp).val(1);

            var id = $(e.currentTarget).val();
            $.ajax({
                url: '../assets/custom/sales_order/getSelectedSOPull.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {

                    var temp = '';
                    var obj = JSON.parse(response.items);
                    var addons = JSON.parse(response.addons);

                    var length = obj.product.length;
                    var count = 0;
                    var c = 0;

                    $('#si_freight').val(addons.freight);
                    $('#si_pf').val(addons.pf);
                    $('#si_tot_discount').val(addons.discount);

                    for (var i = 0; i < length; i++) {
                        if (obj.quantity[i] - obj.received[i] > 0) {
                            count++;
                        }
                    }

                    for (var i = 1; i < count; i++) {
                        $('#si_btn_add').click();
                    }
                    for (var i = 0; i < length; i++) {

                        if (obj.quantity[i] - obj.received[i] > 0) {
                            temp = "select[name$='sales_invoice[" + c + "][si_product_name]']";
                            var pr = obj.product[i];
                            $(temp).empty().append($("<option/>").val(pr).text(pr)).val(pr).trigger("change");

                            temp = "input[name$='sales_invoice[" + c + "][si_qty]']";
                            $(temp).val(obj.quantity[i] - obj.received[i]);
                            temp = "select[name$='sales_invoice[" + c + "][si_unit]']";
                            $(temp).empty().append($("<option/>").val(obj.unit[i]).text(obj.unit[i])).val(obj.unit[i]).trigger("change");
                            temp = "input[name$='sales_invoice[" + c + "][si_rate]']";
                            $(temp).val(obj.price[i]);
                            temp = "input[name$='sales_invoice[" + c + "][si_dsc]']";
                            $(temp).val(obj.discount[i]);
                            temp = "input[name$='sales_invoice[" + c + "][si_hsn]']";
                            $(temp).val(obj.hsn[i]);
                            temp = "select[name$='sales_invoice[" + c + "][si_tax]']";
                            $(temp).val(obj.tax[i]).trigger("change");
                            temp = "select[name$='sales_invoice[" + c + "][si_display_make]']";
                            $(temp).val(obj.group[i]).trigger("change");
                            // temp = "input[name$='sales_invoice[" + c + "][si_product_description]']";
                            // $(temp).val(obj.desc[i]);

                            temp = "textarea[name$='sales_invoice[" + c + "][si_product_add_description]']";
                            var temp_val = obj.desc[i];
                            temp_val = temp_val.replace(/\|/g, "\r\n");
                            $(temp).val(temp_val);

                            var temp_textarea = $(temp);
                            autosize(temp_textarea);
                            c++;
                        }

                    }
                    $("#buyer_order_no").val(response.client_so_no);
                    $("#other_ref").val(response.q_no);
                    var so_date = new Date(response.so_date);
                    var formatted_date = appendLeadingZeroes(so_date.getDate()) + "-" + appendLeadingZeroes(so_date.getMonth() + 1) + "-" + so_date.getFullYear();
                    $("#buyer_order_date").val(formatted_date);
                    si_preview(e);
                } // /success
            }); // /fetch selected member info
        });

        $('.si_quotation-select2').on("select2:select", function(e) {
            $('[data-repeater-list="sales_invoice"]').empty();
            $('[data-repeater-create="sales_invoice"]').click();
            var tmp = "input[name$='sales_invoice[0][si_sn]']";
            $(tmp).val(1);

            var id = $(e.currentTarget).val();
            $.ajax({
                url: '../assets/custom/quotation/getSelectedQuotationPull.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {

                    var temp = '';
                    var obj = JSON.parse(response.items);
                    var addons = JSON.parse(response.addons);

                    var length = obj.product.length;
                    var count = 0;
                    var c = 0;

                    $('#si_freight').val(addons.freight);
                    $('#si_pf').val(addons.pf);
                    $('#si_tot_discount').val(addons.discount);

                    for (var i = 0; i < length; i++) {
                        if (obj.quantity[i] > 0) {
                            count++;
                        }
                    }

                    console.log(count);

                    for (var i = 1; i < count; i++) {
                        $('#si_btn_add').click();
                    }
                    for (var i = 0; i < length; i++) {

                        if (obj.quantity[i] > 0) {
                            temp = "select[name$='sales_invoice[" + c + "][si_product_name]']";
                            var pr = obj.product[i];
                            $(temp).empty().append($("<option/>").val(pr).text(pr)).val(pr).trigger("change");

                            temp = "input[name$='sales_invoice[" + c + "][si_qty]']";
                            $(temp).val(obj.quantity[i]);
                            temp = "select[name$='sales_invoice[" + c + "][si_unit]']";
                            $(temp).empty().append($("<option/>").val(obj.unit[i]).text(obj.unit[i])).val(obj.unit[i]).trigger("change");
                            temp = "input[name$='sales_invoice[" + c + "][si_rate]']";
                            $(temp).val(obj.price[i]);
                            temp = "input[name$='sales_invoice[" + c + "][si_dsc]']";
                            $(temp).val(obj.discount[i]);
                            temp = "input[name$='sales_invoice[" + c + "][si_hsn]']";
                            $(temp).val(obj.hsn[i]);
                            temp = "select[name$='sales_invoice[" + c + "][si_tax]']";
                            $(temp).val(obj.tax[i]).trigger("change");
                            // temp = "input[name$='sales_invoice[" + c + "][si_product_description]']";
                            // $(temp).val(obj.desc[i]);

                            temp = "textarea[name$='sales_invoice[" + c + "][si_product_add_description]']";
                            var temp_val = obj.desc[i];
                            temp_val = temp_val.replace(/\|/g, "\r\n");
                            $(temp).val(temp_val);

                            var temp_textarea = $(temp);
                            autosize(temp_textarea);
                            c++;
                        }

                    }
                    $("#other_ref").val(response.q_no);
                    si_preview(e);
                } // /success
            }); // /fetch selected member info
        });
    };

    var sales_followup = function() {
        var portlet = new KTPortlet('kt_portlet_add_si');

        $('#kt_sales_followup_status').select2({
            width: '100%',
            placeholder: 'Filter Status',
            allowClear: true
        });


        $('#sf_date').datepicker({
            dateFormat: 'dd-mm-yy'
        });


        $('#sf_client').select2({
            ajax: {
                url: '../assets/custom/api_get/get_client.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select Client',
            selectOnClose: true
        });
    };


    var receipts = function() {

        $('.rc_mode-select2').select2({
            width: '100%',
            placeholder: 'Select Mode',
            allowClear: true
        });

        $('.rc_bank-select2').select2({
            ajax: {
                url: '../assets/custom/api_get/get_bank.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select Bank',
            allowClear: true
        });

        $('.rc_bank-select2').on("select2:select", function(e) {
            var id = $(e.currentTarget).val();
            id = encodeURIComponent(id);
            console.log(id);

            var amount = $('#amount').val();

            if (id != 'Cash' && amount != '' && !isNaN(amount)) {
                document.getElementById("bank_details").style.display = "inline-flex";
                document.getElementById("bank_details_title").style.display = "inline-flex";
            } else {
                document.getElementById("bank_details").style.display = "none";
                document.getElementById("bank_details_title").style.display = "none";
            }
        });

        $('#amount').keyup(function(e) {
            var amount = $('#amount').val();

            var bank = $('.rc_bank-select2').val();
            if (amount != '' && !isNaN(amount)) {
                document.getElementById("invoice_details").style.display = "inline-flex";
                document.getElementById("invoice_details_title").style.display = "inline-flex";

                if (bank != 'Cash') {
                    document.getElementById("bank_details").style.display = "inline-flex";
                    document.getElementById("bank_details_title").style.display = "inline-flex";
                } else {
                    document.getElementById("bank_details").style.display = "none";
                    document.getElementById("bank_details_title").style.display = "none";
                }

            } else {
                document.getElementById("invoice_details").style.display = "none";
                document.getElementById("invoice_details_title").style.display = "none";

                document.getElementById("bank_details").style.display = "none";
                document.getElementById("bank_details_title").style.display = "none";
            }



        });



        $('.edit_rc_bank-select2').select2({
            ajax: {
                url: '../assets/custom/api_get/get_bank.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select Bank',
            allowClear: true,
            selectOnClose: true
        });

        $('#rc_date').datepicker({
            dateFormat: 'dd-mm-yy'
        });

        $('#rc_ins_date').datepicker({
            dateFormat: 'dd-mm-yy'
        });

        $('#edit_rc_date').datepicker({
            dateFormat: 'dd-mm-yy'
        });

        $('#rc_client').select2({
            ajax: {
                url: '../assets/custom/api_get/get_client.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select Client'
        });

        $('#edit_rc_client').select2({
            ajax: {
                url: '../assets/custom/api_get/get_client.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select Client',
            tags: true,
            selectOnClose: true
        });

        $('#rc_mode').select2({
            width: '100%',
            placeholder: 'Select Mode',
            selectOnClose: true
        });



        $('#edit_rc_mode').select2({
            width: '100%',
            placeholder: 'Select Mode',
            selectOnClose: true
        });

        $('#rc_btn_advance').on("click", function(e) {
            document.getElementById("rc_advance_amount").style.display = "block";

        });

        $('#rc_client').on("select2:select", function(e) {
            $('[data-repeater-list="receipt"]').empty();
            $('[data-repeater-create="receipt"]').click();
            var tmp = "input[name$='receipt[0][rc_sn]']";
            $(tmp).val(1);

            var id = $(e.currentTarget).val();
            id = encodeURIComponent(id);
            $.ajax({
                url: '../assets/custom/api_get/getPendingSales.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {

                    console.log(response);

                    var temp = '';
                    var obj = JSON.parse(response.result);

                    var length = obj.si_details_sn.length;
                    console.log(length);

                    var c = 0;

                    for (var i = 1; i < length; i++) {
                        $('#rc_btn_add').click();
                    }
                    for (var i = 0; i < length; i++) {

                        temp = "input[name$='receipt[" + c + "][rc_invoice_id]']";
                        $(temp).val(obj.id[i]);
                        temp = "input[name$='receipt[" + c + "][rc_details_sn]']";
                        $(temp).val(obj.si_details_sn[i]);
                        temp = "input[name$='receipt[" + c + "][rc_details_si]']";
                        $(temp).val(obj.si_details_si[i]);
                        temp = "input[name$='receipt[" + c + "][rc_details_date]']";
                        $(temp).val(obj.si_details_date[i]);
                        temp = "input[name$='receipt[" + c + "][rc_details_amount]']";
                        $(temp).val(obj.si_details_amount[i]);
                        temp = "input[name$='receipt[" + c + "][rc_due]']";
                        $(temp).val(obj.due[i]);
                        c++;

                    }

                    rc_preview(e);
                } // /success
            }); // /fetch selected member info
        });

        $('#edit_rc_sales_invoice').select2({
            ajax: {
                url: '../assets/custom/api_get/get_sale_invoice.php',
                type: 'POST',
                dataType: 'json',
                data: function(term, page) {
                    return {
                        q: term, // search term
                    };
                }
            },
            width: '100%',
            placeholder: 'Select Sale Invoice'
        });
    };

    var purchase_order = function() {

        var portlet = new KTPortlet('kt_portlet_add_po');

        $('#purchase_date').datepicker({
            dateFormat: 'dd-mm-yy'
        });

        $('#po_supplier').select2({
            ajax: {
                url: '../assets/custom/api_get/get_supplier.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select Supplier',
            selectOnClose: true
        });

        // $('#po_shipping_state').select2({
        //     ajax: {
        //         url: '../assets/custom/api_get/get_states.php',
        //         dataType: 'json'
        //     },
        //     width: '100%',
        //     placeholder: 'Select State',
        //     // tags: true,
        //     allowClear: true
        // });

        // $('#po_supplier').on("select2:select", function(e) {
        //     $('[data-repeater-list="purchase_order"]').empty();
        //     $('[data-repeater-create="purchase_order"]').click();
        //     var tmp = "input[name$='purchase_order[0][po_sn]']";
        //     $(tmp).val(1);
        //     selected_client = $(e.currentTarget).val();
        //     $.ajax({
        //         url: '../assets/custom/api_get/get_supplier_address.php',
        //         type: 'post',
        //         data: { member_id: selected_client },
        //         dataType: 'json',
        //         success: function(response) {

        //             $("#po_shipping_name").val(response.print_name);

        //             var address = JSON.parse(response.address);
        //             $("#po_shipping_add_1").val(address.address_1);
        //             $("#po_shipping_add_2").val(address.address_2);
        //             $("#po_shipping_city").val(address.city);
        //             $("#po_shipping_pincode").val(address.pincode);
        //             $("#po_shipping_state").empty().append($("<option/>").val(response.state).text(response.state)).val(response.state).trigger("change");

        //             $("#po_shipping_country").val(response.country);

        //         } // /success
        //     }); // /fetch selected member info
        // });

        // $('#po_supplier').on("select2:select", function(e) {
        //     $('[data-repeater-list="purchase_order"]').empty();
        //     $('[data-repeater-create="purchase_order"]').click();
        //     var tmp = "input[name$='purchase_order[0][po_sn]']";
        //     $(tmp).val(1);
        //     selected_client = $(e.currentTarget).val();
        //     $('.po_quotation-select2').val(null).trigger('change');
        // });
    };

    var purchase = function() {
        var portlet = new KTPortlet('kt_portlet_add_pi');

        $('#purchase_invoice_date').datepicker({
            dateFormat: 'dd-mm-yy'
        });

        $('#pi_supplier').select2({
            ajax: {
                url: '../assets/custom/api_get/get_supplier.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select Supplier',
            selectOnClose: true
        });

        $('#pi_purchase_order').select2({
            ajax: {
                url: '../assets/custom/api_get/get_purchase_order.php',
                type: 'POST',
                dataType: 'json',
                data: function(term, page) {
                    return {
                        q: term, // search term
                        supplier: selected_supplier //Get your value from other elements using Query, for example.
                    };
                }
            },
            width: '100%',
            placeholder: 'Select Purchase Order',
            multiple: true
        });

        $('#pi_supplier').on("select2:select", function(e) {
            $('[data-repeater-list="purchase_invoice"]').empty();
            $('[data-repeater-create="purchase_invoice"]').click();
            var tmp = "input[name$='purchase_invoice[0][pi_sn]']";
            $(tmp).val(1);
            selected_supplier = $(e.currentTarget).val();
            $('.pi_purchase_order-select2').val(null).trigger('change');
        });

        $('.pi_purchase_order-select2').on("select2:select", function(e) {
            $('[data-repeater-list="purchase_invoice"]').empty();
            $('[data-repeater-create="purchase_invoice"]').click();
            var tmp = "input[name$='purchase_invoice[0][pi_sn]']";
            $(tmp).val(1);

            var id = $(e.currentTarget).val();
            $.ajax({
                url: '../assets/custom/purchase_order/getSelectedPOPull.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {

                    var temp = '';
                    var obj = JSON.parse(response.items);
                    var addons = JSON.parse(response.addons);

                    var length = obj.product.length;
                    var count = 0;
                    var c = 0;

                    $('#pi_freight').val(addons.freight);
                    $('#pi_pf').val(addons.pf);
                    $('#pi_tot_discount').val(addons.discount);

                    for (var i = 0; i < length; i++) {
                        if (obj.quantity[i] - obj.received[i] > 0) {
                            count++;
                        }
                    }

                    for (var i = 1; i < count; i++) {
                        $('#pi_btn_add').click();
                    }
                    for (var i = 0; i < length; i++) {

                        if (obj.quantity[i] - obj.received[i] > 0) {
                            temp = "select[name$='purchase_invoice[" + c + "][pi_product_name]']";
                            var pr = obj.product[i];
                            $(temp).empty().append($("<option/>").val(pr).text(pr)).val(pr).trigger("change");

                            temp = "input[name$='purchase_invoice[" + c + "][pi_qty]']";
                            $(temp).val(obj.quantity[i] - obj.received[i]);
                            temp = "select[name$='purchase_invoice[" + c + "][pi_unit]']";
                            $(temp).empty().append($("<option/>").val(obj.unit[i]).text(obj.unit[i])).val(obj.unit[i]).trigger("change");
                            temp = "input[name$='purchase_invoice[" + c + "][pi_rate]']";
                            $(temp).val(obj.price[i]);
                            temp = "input[name$='purchase_invoice[" + c + "][pi_dsc]']";
                            $(temp).val(obj.discount[i]);
                            temp = "input[name$='purchase_invoice[" + c + "][pi_hsn]']";
                            $(temp).val(obj.hsn[i]);
                            temp = "select[name$='purchase_invoice[" + c + "][pi_tax]']";
                            $(temp).val(obj.tax[i]).trigger("change");
                            temp = "input[name$='purchase_invoice[" + c + "][pi_product_description]']";
                            $(temp).val(obj.desc[i]);

                            temp = "textarea[name$='purchase_invoice[" + c + "][pi_product_add_description]']";
                            var temp_val = obj.long_desc[i];
                            temp_val = temp_val.replace(/\|/g, "\r\n");
                            $(temp).val(temp_val);

                            var temp_textarea = $(temp);
                            autosize(temp_textarea);
                            c++;
                        }

                    }
                    pi_preview(e);
                } // /success
            }); // /fetch selected member info
        });
    };

    var payments = function() {

        $('.py_mode-select2').select2({
            width: '100%',
            placeholder: 'Select Mode',
            allowClear: true
        });

        $('.py_bank-select2').select2({
            ajax: {
                url: '../assets/custom/api_get/get_bank.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select Bank',
            allowClear: true
        });

        $('.edit_py_bank-select2').select2({
            ajax: {
                url: '../assets/custom/api_get/get_bank.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select Bank',
            allowClear: true,
            selectOnClose: true
        });

        $('#py_btn_advance').on("click", function(e) {
            document.getElementById("py_advance_amount").style.display = "block";

        });

        $('.py_bank-select2').on("select2:select", function(e) {
            var id = $(e.currentTarget).val();
            id = encodeURIComponent(id);
            console.log(id);

            var amount = $('#amount').val();

            if (id != 'Cash' && amount != '' && !isNaN(amount)) {
                document.getElementById("bank_details").style.display = "inline-flex";
                document.getElementById("bank_details_title").style.display = "inline-flex";
            } else {
                document.getElementById("bank_details").style.display = "none";
                document.getElementById("bank_details_title").style.display = "none";
            }
        });

        $('#amount').keyup(function(e) {
            var amount = $('#amount').val();

            var bank = $('.rc_bank-select2').val();
            if (amount != '' && !isNaN(amount)) {
                document.getElementById("invoice_details").style.display = "inline-flex";
                document.getElementById("invoice_details_title").style.display = "inline-flex";

                if (bank != 'Cash') {
                    document.getElementById("bank_details").style.display = "inline-flex";
                    document.getElementById("bank_details_title").style.display = "inline-flex";
                } else {
                    document.getElementById("bank_details").style.display = "none";
                    document.getElementById("bank_details_title").style.display = "none";
                }

            } else {
                document.getElementById("invoice_details").style.display = "none";
                document.getElementById("invoice_details_title").style.display = "none";

                document.getElementById("bank_details").style.display = "none";
                document.getElementById("bank_details_title").style.display = "none";
            }



        });

        $('#py_date').datepicker({
            dateFormat: 'dd-mm-yy'
        });

        $('#py_ins_date').datepicker({
            dateFormat: 'dd-mm-yy'
        });

        $('#edit_py_date').datepicker({
            dateFormat: 'dd-mm-yy'
        });

        $('#py_supplier').select2({
            ajax: {
                url: '../assets/custom/api_get/get_supplier.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select Supplier'
        });

        $('#edit_py_client').select2({
            ajax: {
                url: '../assets/custom/api_get/get_client.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select Client',
            tags: true,
            selectOnClose: true
        });

        $('#py_mode').select2({
            width: '100%',
            placeholder: 'Select Mode',
            selectOnClose: true
        });

        $('#edit_py_mode').select2({
            width: '100%',
            placeholder: 'Select Mode',
            selectOnClose: true
        });

        $('#py_supplier').on("select2:select", function(e) {
            $('[data-repeater-list="payment"]').empty();
            $('[data-repeater-create="payment"]').click();
            var tmp = "input[name$='payment[0][py_sn]']";
            $(tmp).val(1);

            var id = $(e.currentTarget).val();
            id = encodeURIComponent(id);
            $.ajax({
                url: '../assets/custom/api_get/getPendingPurchase.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {

                    var temp = '';
                    var obj = JSON.parse(response.result);

                    var length = obj.pi_details_sn.length;

                    var c = 0;

                    for (var i = 1; i < length; i++) {
                        $('#py_btn_add').click();
                    }
                    for (var i = 0; i < length; i++) {

                        temp = "input[name$='payment[" + c + "][py_invoice_id]']";
                        $(temp).val(obj.id[i]);
                        temp = "input[name$='payment[" + c + "][py_details_sn]']";
                        $(temp).val(obj.pi_details_sn[i]);
                        temp = "input[name$='payment[" + c + "][py_details_pi]']";
                        $(temp).val(obj.pi_details_pi[i]);
                        temp = "input[name$='payment[" + c + "][py_details_date]']";
                        $(temp).val(obj.pi_details_date[i]);
                        temp = "input[name$='payment[" + c + "][py_details_amount]']";
                        $(temp).val(obj.pi_details_amount[i]);
                        temp = "input[name$='payment[" + c + "][py_due]']";
                        $(temp).val(obj.due[i]);
                        c++;

                    }

                    py_preview(e);
                } // /success
            }); // /fetch selected member info
        });

        $('#edit_py_sales_invoice').select2({
            ajax: {
                url: '../assets/custom/api_get/get_purchase_invoice.php',
                type: 'POST',
                dataType: 'json',
                data: function(term, page) {
                    return {
                        q: term, // search term
                    };
                }
            },
            width: '100%',
            placeholder: 'Select Purchase Invoice'
        });
    };

    var assemblies = function() {
        $('#composite_product').select2({
            ajax: {
                url: '../assets/custom/api_get/get_product.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select Product',
            tags: true,
            selectOnClose: true
        });
        $('#composite_product').on("select2:select", function(e) {

            var id = $(e.currentTarget).val();

            $.ajax({
                url: '../assets/custom/api_get/get_product_info.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {
                    $("#composite_product_description").val(response.description);
                } // /success
            }); // /fetch selected member info
        });
    };

    var settings = function() {

        $('.settings_group-select2').select2({
            ajax: {
                url: '../assets/custom/api_get/get_group.php',
                dataType: 'json'
            },
            width: '100%',
            placeholder: 'Select Group',
            allowClear: true
        });

        $('.settings_group-select2').on("select2:select", function(e) {

            var id = $(e.currentTarget).val();
            $.ajax({
                url: '../assets/custom/api_get/get_default_make.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {

                    // console.log(response.default_make);
                    if (response.default_make == '1') {
                        $("#settings_make").attr('checked', 'checked');
                    } else
                        $("#settings_make").removeAttr('checked');

                }
            });
        });

    };

    return {
        init: function() {
            search();
            payments();
            receipts();
            products();
            clients();
            transporters();
            suppliers();
            quotation();
            purchase_order();
            purchase();
            sales_order();
            sales();
            enquiry();
            assemblies();
            settings();
            sales_followup();
        },
    };
}();

function e_preview(e) {

    setTimeout(() => {

        var rep = document.getElementById('enquiry_list');
        var rowsCount = rep.childNodes.length;

        var name = e.currentTarget.name;
        if (name != null) {
            var start = name.indexOf("[");
            var end = name.indexOf("]");
            start += 1;
            name = name.substring(start, end);

            var tmp = '';

            for (var i = 0; i < rowsCount; i++) {

                tmp = "input[name$='enquiry[" + i + "][e_sn]']";
                $(tmp).val(i + 1);
            }
        }

    }, 100);
}

function q_preview(e) {

    var client = $("#q_client").val();
    var state = '0';

    $.ajax({
        url: '../assets/custom/api_get/get_tax_type.php',
        type: 'post',
        data: { client: client },
        dataType: 'json',
        success: function(response) {
            state = response.state;

        } // /success
    }); // /fetch selected member info


    setTimeout(() => {

        var rep = document.getElementById('quotation_list');
        var rowsCount = rep.childNodes.length;

        var name = e.currentTarget.name;
        if (name != null) {
            var start = name.indexOf("[");
            var end = name.indexOf("]");
            start += 1;
            name = name.substring(start, end);

            var tmp = '';

            var qty = 0;
            var price = 0;
            var discount = 0;
            var tax = 0;

            var total_final = 0;
            var tax_final = 0;
            var gross_final = 0;

            for (var i = 0; i < rowsCount; i++) {
                tmp = "input[name$='quotation[" + i + "][q_qty]']";
                qty = $(tmp).val();

                tmp = "input[name$='quotation[" + i + "][q_rate]']";
                price = $(tmp).val();

                tmp = "input[name$='quotation[" + i + "][q_dsc]']";
                discount = $(tmp).val();

                tmp = "select[name$='quotation[" + i + "][q_tax]']";
                tax = $(tmp).val();

                tmp = "input[name$='quotation[" + i + "][q_sn]']";
                $(tmp).val(i + 1);

                tmp = "textarea[name$='quotation[" + i + "][q_product_add_description]']";
                var temp_textarea = $(tmp);
                autosize(temp_textarea);

                price = price.replace(/,/g, '');
                price = parseFloat(price);

                var total = 0;

                if (isNaN(tax)) {
                    tax = 0;
                }
                if (isNaN(qty)) {
                    qty = 0;
                }
                if (isNaN(price)) {
                    price = 0;
                }
                total = qty * price;

                var cgst = 0;
                var sgst = 0;
                var igst = 0;
                var tax_pr = '0';
                var gross_pr = total;

                if (discount != '') {
                    total = total * ((100 - parseFloat(discount)) / 100);
                    gross_pr = gross_pr * ((100 - parseFloat(discount)) / 100);
                }

                if (state == 1) {
                    if (tax != '') {
                        tax = tax / 2;
                        cgst = total * (parseFloat(tax) / 100);
                        sgst = total * (parseFloat(tax) / 100);
                        cgst = Math.round(cgst * 100) / 100;
                        sgst = Math.round(sgst * 100) / 100;
                        total = total + cgst + sgst;
                    }
                } else {
                    if (tax != '') {
                        igst = total * (parseFloat(tax) / 100);
                        igst = Math.round(igst * 100) / 100;
                        total = total + igst;
                    }
                }




                tax_pr = cgst + sgst + igst;

                total_final += Math.round(total * 100) / 100;
                tax_final += Math.round(tax_pr * 100) / 100;
                gross_final += Math.round(gross_pr * 100) / 100;

                total = Math.round(total * 100) / 100;
                tax_pr = Math.round(tax_pr * 100) / 100;
                gross_pr = Math.round(gross_pr * 100) / 100;

                if (qty != '' && price != '') {
                    tmp = "input[name$='quotation[" + i + "][q_gross_pr]']";
                    $(tmp).val(gross_pr.toFixed(2));
                    tmp = "input[name$='quotation[" + i + "][q_cgst]']";
                    $(tmp).val(cgst.toFixed(2));
                    tmp = "input[name$='quotation[" + i + "][q_sgst]']";
                    $(tmp).val(sgst.toFixed(2));
                    tmp = "input[name$='quotation[" + i + "][q_igst]']";
                    $(tmp).val(igst.toFixed(2));
                    tmp = "input[name$='quotation[" + i + "][q_tax_pr]']";
                    $(tmp).val(tax_pr.toFixed(2));
                    tmp = "input[name$='quotation[" + i + "][q_total_pr]']";
                    $(tmp).val(total.toFixed(2));
                } else {
                    tmp = "input[name$='quotation[" + i + "][q_gross_pr]']";
                    $(tmp).val('');
                    tmp = "input[name$='quotation[" + i + "][q_cgst]']";
                    $(tmp).val('');
                    tmp = "input[name$='quotation[" + i + "][q_sgst]']";
                    $(tmp).val('');
                    tmp = "input[name$='quotation[" + i + "][q_igst]']";
                    $(tmp).val('');
                    tmp = "input[name$='quotation[" + i + "][q_tax_pr]']";
                    $(tmp).val('');
                    tmp = "input[name$='quotation[" + i + "][q_total_pr]']";
                    $(tmp).val('');
                }

            }

            var freight = $('#q_freight').val();
            var pf = $('#q_pf').val();

            if (freight == '')
                freight = 0;
            else {
                var n = freight.indexOf("%");
                if (n == '-1')
                    freight = parseFloat(freight.replace(/,/g, ''));
                else {
                    var percent = parseFloat(freight.replace("%", ""));
                    freight = parseFloat(gross_final) * parseFloat(percent) / 100;
                }
            }

            if (pf == '')
                pf = 0;
            else {
                var n = pf.indexOf("%");
                if (n == '-1')
                    pf = parseFloat(pf.replace(/,/g, ''));
                else {
                    var percent = parseFloat(pf.replace("%", ""));
                    pf = parseFloat(gross_final) * parseFloat(percent) / 100;
                }
            }

            var addon = parseFloat(freight) + parseFloat(pf);

            if (state == '0')
                tax_final = tax_final + addon * 18 / 100;
            else {
                var addon_tax = addon * 9 / 100;
                tax_final = tax_final + addon_tax + addon_tax;
            }


            total_final = parseFloat(gross_final) + parseFloat(addon) + parseFloat(tax_final);

            total_final = Math.round(total_final * 100) / 100;
            tax_final = Math.round(tax_final * 100) / 100;
            gross_final = Math.round(gross_final * 100) / 100;

            var decimal = Math.floor(total_final);
            var fraction = total_final - decimal;

            if (fraction >= 0.5) {
                var add_fraction = 1 - fraction;
                $('#q_round').val(add_fraction.toFixed(2));
                total_final += add_fraction;
            } else {
                var add_fraction = -1 * fraction;
                $('#q_round').val(add_fraction.toFixed(2));
                total_final += add_fraction;
            }

            $(".q_gross_final").val(gross_final.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'));
            $(".q_tax_final").val(tax_final.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'));
            $(".q_total_final").val(total_final.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'));

            $("#q_freight").val(freight.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'));
            $("#q_pf").val(pf.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'));
        }
    }, 1000);
}

function so_preview(e) {

    var client = $("#so_client").val();
    var state = '0';

    $.ajax({
        url: '../assets/custom/api_get/get_tax_type.php',
        type: 'post',
        data: { client: client },
        dataType: 'json',
        success: function(response) {
            state = response.state;

        } // /success
    }); // /fetch selected member info

    setTimeout(() => {
        var rep = document.getElementById('sales_order_list');
        var rowsCount = rep.childNodes.length;

        var name = e.currentTarget.name;
        if (name != null) {
            var start = name.indexOf("[");
            var end = name.indexOf("]");
            start += 1;
            name = name.substring(start, end);

            var tmp = '';

            var qty = 0;
            var price = 0;
            var discount = 0;
            var tax = 0;

            var total_final = 0;
            var tax_final = 0;
            var gross_final = 0;

            for (var i = 0; i < rowsCount; i++) {
                tmp = "input[name$='sales_order[" + i + "][so_qty]']";
                qty = $(tmp).val();

                tmp = "input[name$='sales_order[" + i + "][so_rate]']";
                price = $(tmp).val();

                tmp = "input[name$='sales_order[" + i + "][so_dsc]']";
                discount = $(tmp).val();

                tmp = "select[name$='sales_order[" + i + "][so_tax]']";
                tax = $(tmp).val();

                tmp = "input[name$='sales_order[" + i + "][so_sn]']";
                $(tmp).val(i + 1);

                price = price.replace(/,/g, '');
                price = parseFloat(price);

                var total = 0;

                if (isNaN(tax)) {
                    tax = 0;
                }
                if (isNaN(qty)) {
                    qty = 0;
                }
                if (isNaN(price)) {
                    price = 0;
                }
                total = qty * price;

                var cgst = 0;
                var sgst = 0;
                var igst = 0;
                var tax_pr = '0';
                var gross_pr = total;

                if (discount != '') {
                    total = total * ((100 - parseFloat(discount)) / 100);
                    gross_pr = gross_pr * ((100 - parseFloat(discount)) / 100);
                }

                if (state == 1) {
                    if (tax != '') {
                        tax = tax / 2;
                        cgst = total * (parseFloat(tax) / 100);
                        sgst = total * (parseFloat(tax) / 100);
                        cgst = Math.round(cgst * 100) / 100;
                        sgst = Math.round(sgst * 100) / 100;
                        total = total + cgst + sgst;
                    }
                } else {
                    if (tax != '') {
                        igst = total * (parseFloat(tax) / 100);
                        igst = Math.round(igst * 100) / 100;
                        total = total + igst;
                    }
                }

                tax_pr = cgst + sgst + igst;

                total_final += Math.round(total * 100) / 100;
                tax_final += Math.round(tax_pr * 100) / 100;
                gross_final += Math.round(gross_pr * 100) / 100;

                total = Math.round(total * 100) / 100;
                tax_pr = Math.round(tax_pr * 100) / 100;
                gross_pr = Math.round(gross_pr * 100) / 100;

                if (qty != '' && price != '') {
                    tmp = "input[name$='sales_order[" + i + "][so_gross_pr]']";
                    $(tmp).val(gross_pr);
                    tmp = "input[name$='sales_order[" + i + "][so_cgst]']";
                    $(tmp).val(cgst.toFixed(2));
                    tmp = "input[name$='sales_order[" + i + "][so_sgst]']";
                    $(tmp).val(sgst.toFixed(2));
                    tmp = "input[name$='sales_order[" + i + "][so_igst]']";
                    $(tmp).val(igst.toFixed(2));
                    tmp = "input[name$='sales_order[" + i + "][so_tax_pr]']";
                    $(tmp).val(tax_pr);
                    tmp = "input[name$='sales_order[" + i + "][so_total_pr]']";
                    $(tmp).val(total);
                } else {
                    tmp = "input[name$='sales_order[" + i + "][so_gross_pr]']";
                    $(tmp).val('');
                    tmp = "input[name$='sales_order[" + i + "][so_cgst]']";
                    $(tmp).val('');
                    tmp = "input[name$='sales_order[" + i + "][so_sgst]']";
                    $(tmp).val('');
                    tmp = "input[name$='sales_order[" + i + "][so_igst]']";
                    $(tmp).val('');
                    tmp = "input[name$='sales_order[" + i + "][so_tax_pr]']";
                    $(tmp).val('');
                    tmp = "input[name$='sales_order[" + i + "][so_total_pr]']";
                    $(tmp).val('');
                }

            }

            var freight = $('#so_freight').val();
            var pf = $('#so_pf').val();

            if (freight == '')
                freight = 0;
            else {
                var n = freight.indexOf("%");
                if (n == '-1')
                    freight = parseFloat(freight.replace(",", ""));
                else {
                    var percent = parseFloat(freight.replace("%", ""));
                    freight = parseFloat(gross_final) * parseFloat(percent) / 100;
                }
            }

            if (pf == '')
                pf = 0;
            else {
                var n = pf.indexOf("%");
                if (n == '-1')
                    pf = parseFloat(pf.replace(",", ""));
                else {
                    var percent = parseFloat(pf.replace("%", ""));
                    pf = parseFloat(gross_final) * parseFloat(percent) / 100;
                }
            }

            var addon = parseFloat(freight) + parseFloat(pf);

            tax_final = tax_final + addon * 18 / 100;
            total_final = parseFloat(gross_final) + parseFloat(addon) + parseFloat(tax_final);

            total_final = Math.round(total_final * 100) / 100;
            tax_final = Math.round(tax_final * 100) / 100;
            gross_final = Math.round(gross_final * 100) / 100;

            var decimal = Math.floor(total_final);
            var fraction = total_final - decimal;

            if (fraction >= 0.5) {
                var add_fraction = 1 - fraction;
                $('#so_round').val(add_fraction.toFixed(2));
                total_final += add_fraction;
            } else {
                var add_fraction = -1 * fraction;
                $('#so_round').val(add_fraction.toFixed(2));
                total_final += add_fraction;
            }

            $(".so_gross_final").val(gross_final.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'));
            $(".so_tax_final").val(tax_final.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'));
            $(".so_total_final").val(total_final.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'));

            $("#so_freight").val(freight.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'));
            $("#so_pf").val(pf.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'));

        }
    }, 1000);
}

function si_preview(e) {

    var client = $("#si_client").val();
    var state = '0';

    $.ajax({
        url: '../assets/custom/api_get/get_tax_type.php',
        type: 'post',
        data: { client: client },
        dataType: 'json',
        success: function(response) {
            state = response.state;

        } // /success
    }); // /fetch selected member info

    setTimeout(() => {
        var rep = document.getElementById('sales_invoice_list');
        var rowsCount = rep.childNodes.length;

        var name = e.currentTarget.name;
        if (name != null) {
            var start = name.indexOf("[");
            var end = name.indexOf("]");
            start += 1;
            name = name.substring(start, end);

            var tmp = '';

            var qty = 0;
            var price = 0;
            var discount = 0;
            var tax = 0;

            var total_final = 0;
            var tax_final = 0;
            var gross_final = 0;

            for (var i = 0; i < rowsCount; i++) {
                tmp = "input[name$='sales_invoice[" + i + "][si_qty]']";
                qty = $(tmp).val();

                tmp = "input[name$='sales_invoice[" + i + "][si_rate]']";
                price = $(tmp).val();

                tmp = "input[name$='sales_invoice[" + i + "][si_dsc]']";
                discount = $(tmp).val();

                tmp = "select[name$='sales_invoice[" + i + "][si_tax]']";
                tax = $(tmp).val();

                tmp = "input[name$='sales_invoice[" + i + "][si_sn]']";
                $(tmp).val(i + 1);

                price = price.replace(/,/g, '');
                price = parseFloat(price);

                var total = 0;

                if (isNaN(tax)) {
                    tax = 0;
                }
                if (isNaN(qty)) {
                    qty = 0;
                }
                if (isNaN(price)) {
                    price = 0;
                }
                total = qty * price;

                var cgst = 0;
                var sgst = 0;
                var igst = 0;
                var tax_pr = '0';
                var gross_pr = total;

                if (discount != '') {
                    total = total * ((100 - parseFloat(discount)) / 100);
                    gross_pr = gross_pr * ((100 - parseFloat(discount)) / 100);
                }

                if (state == 1) {
                    if (tax != '') {
                        tax = tax / 2;
                        cgst = total * (parseFloat(tax) / 100);
                        sgst = total * (parseFloat(tax) / 100);
                        cgst = Math.round(cgst * 100) / 100;
                        sgst = Math.round(sgst * 100) / 100;
                        total = total + cgst + sgst;
                    }
                } else {
                    if (tax != '') {
                        igst = total * (parseFloat(tax) / 100);
                        igst = Math.round(igst * 100) / 100;
                        total = total + igst;
                    }
                }

                tax_pr = cgst + sgst + igst;


                total_final += Math.round(total * 100) / 100;
                tax_final += Math.round(tax_pr * 100) / 100;
                gross_final += Math.round(gross_pr * 100) / 100;

                total = Math.round(total * 100) / 100;
                tax_pr = Math.round(tax_pr * 100) / 100;
                gross_pr = Math.round(gross_pr * 100) / 100;

                if (qty != '' && price != '') {
                    tmp = "input[name$='sales_invoice[" + i + "][si_gross_pr]']";
                    $(tmp).val(gross_pr);
                    tmp = "input[name$='sales_invoice[" + i + "][si_cgst]']";
                    $(tmp).val(cgst.toFixed(2));
                    tmp = "input[name$='sales_invoice[" + i + "][si_sgst]']";
                    $(tmp).val(sgst.toFixed(2));
                    tmp = "input[name$='sales_invoice[" + i + "][si_igst]']";
                    $(tmp).val(igst.toFixed(2));
                    tmp = "input[name$='sales_invoice[" + i + "][si_tax_pr]']";
                    $(tmp).val(tax_pr);
                    tmp = "input[name$='sales_invoice[" + i + "][si_total_pr]']";
                    $(tmp).val(total);
                } else {
                    tmp = "input[name$='sales_invoice[" + i + "][si_gross_pr]']";
                    $(tmp).val('');
                    tmp = "input[name$='sales_invoice[" + i + "][si_cgst]']";
                    $(tmp).val('');
                    tmp = "input[name$='sales_invoice[" + i + "][si_sgst]']";
                    $(tmp).val('');
                    tmp = "input[name$='sales_invoice[" + i + "][si_igst]']";
                    $(tmp).val('');
                    tmp = "input[name$='sales_invoice[" + i + "][si_tax_pr]']";
                    $(tmp).val('');
                    tmp = "input[name$='sales_invoice[" + i + "][si_total_pr]']";
                    $(tmp).val('');
                }

            }

            var freight = $('#si_freight').val();
            var pf = $('#si_pf').val();

            if (freight == '')
                freight = 0;
            else {
                var n = freight.indexOf("%");
                if (n == '-1')
                    freight = parseFloat(freight.replace(/,/g, ''));
                else {
                    var percent = parseFloat(freight.replace("%", ""));
                    freight = parseFloat(gross_final) * parseFloat(percent) / 100;
                }
            }

            if (pf == '')
                pf = 0;
            else {
                var n = pf.indexOf("%");
                if (n == '-1')
                    pf = parseFloat(pf.replace(/,/g, ''));
                else {
                    var percent = parseFloat(pf.replace("%", ""));
                    pf = parseFloat(gross_final) * parseFloat(percent) / 100;
                }
            }

            var addon = parseFloat(freight) + parseFloat(pf);

            tax_final = tax_final + addon * 18 / 100;
            total_final = parseFloat(gross_final) + parseFloat(addon) + parseFloat(tax_final);

            total_final = Math.round(total_final * 100) / 100;
            tax_final = Math.round(tax_final * 100) / 100;
            gross_final = Math.round(gross_final * 100) / 100;

            var decimal = Math.floor(total_final);
            var fraction = total_final - decimal;

            if (fraction >= 0.5) {
                var add_fraction = 1 - fraction;
                $('#si_round').val(add_fraction.toFixed(2));
                total_final += add_fraction;
            } else {
                var add_fraction = -1 * fraction;
                $('#si_round').val(add_fraction.toFixed(2));
                total_final += add_fraction;
            }

            total_final = Math.round(total_final * 100) / 100;
            tax_final = Math.round(tax_final * 100) / 100;
            gross_final = Math.round(gross_final * 100) / 100;

            $(".si_gross_final").val(gross_final.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'));
            $(".si_tax_final").val(tax_final.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'));
            $(".si_total_final").val(total_final.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'));

            $("#si_freight").val(freight.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'));
            $("#si_pf").val(pf.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'));
        }
    }, 1000);
}

function rc_preview(e) {

    setTimeout(() => {
        var rep = document.getElementById('receipt_list');
        var rowsCount = rep.childNodes.length;

        var name = e.currentTarget.name;
        if (name != null) {
            var start = name.indexOf("[");
            var end = name.indexOf("]");
            start += 1;
            name = name.substring(start, end);

            var tmp = '';
            var amount = 0;
            var tot_amount = 0;

            for (var i = 0; i < rowsCount; i++) {
                tmp = "input[name$='receipt[" + i + "][rc_amount]']";
                amount = $(tmp).val();

                tmp = "input[name$='receipt[" + i + "][rc_sn]']";
                $(tmp).val(i + 1);

                tot_amount += parseFloat(amount);

            }

            $("#rc_amount").val(tot_amount.toFixed(2));
        }
    }, 1000);
}

function po_preview(e) {

    var supplier = $("#po_supplier").val();
    var state = '0';

    $.ajax({
        url: '../assets/custom/api_get/get_tax_type.php',
        type: 'post',
        data: { supplier: supplier },
        dataType: 'json',
        success: function(response) {
            state = response.state;

        } // /success
    }); // /fetch selected member info

    setTimeout(() => {
        var rep = document.getElementById('purchase_order_list');
        var rowsCount = rep.childNodes.length;

        var name = e.currentTarget.name;
        if (name != null) {
            var start = name.indexOf("[");
            var end = name.indexOf("]");
            start += 1;
            name = name.substring(start, end);

            var tmp = '';

            var qty = 0;
            var price = 0;
            var discount = 0;
            var tax = 0;

            var total_final = 0;
            var tax_final = 0;
            var gross_final = 0;

            for (var i = 0; i < rowsCount; i++) {
                tmp = "input[name$='purchase_order[" + i + "][po_qty]']";
                qty = $(tmp).val();

                tmp = "input[name$='purchase_order[" + i + "][po_rate]']";
                price = $(tmp).val();

                tmp = "input[name$='purchase_order[" + i + "][po_dsc]']";
                discount = $(tmp).val();

                tmp = "select[name$='purchase_order[" + i + "][po_tax]']";
                tax = $(tmp).val();

                tmp = "input[name$='purchase_order[" + i + "][po_sn]']";
                $(tmp).val(i + 1);

                price = price.replace(/,/g, '');
                price = parseFloat(price);

                var total = 0;

                if (isNaN(tax)) {
                    tax = 0;
                }
                if (isNaN(qty)) {
                    qty = 0;
                }
                if (isNaN(price)) {
                    price = 0;
                }
                total = qty * price;

                var cgst = 0;
                var sgst = 0;
                var igst = 0;
                var tax_pr = '0';
                var gross_pr = total;

                if (discount != '') {
                    total = total * ((100 - parseFloat(discount)) / 100);
                    gross_pr = gross_pr * ((100 - parseFloat(discount)) / 100);
                }

                if (state == 1) {
                    if (tax != '') {
                        tax = tax / 2;
                        cgst = total * (parseFloat(tax) / 100);
                        sgst = total * (parseFloat(tax) / 100);
                        cgst = Math.round(cgst * 100) / 100;
                        sgst = Math.round(sgst * 100) / 100;
                        total = total + cgst + sgst;
                    }
                } else {
                    if (tax != '') {
                        igst = total * (parseFloat(tax) / 100);
                        igst = Math.round(igst * 100) / 100;
                        total = total + igst;
                    }
                }

                tax_pr = cgst + sgst + igst;

                total_final += Math.round(total * 100) / 100;
                tax_final += Math.round(tax_pr * 100) / 100;
                gross_final += Math.round(gross_pr * 100) / 100;

                total = Math.round(total * 100) / 100;
                tax_pr = Math.round(tax_pr * 100) / 100;
                gross_pr = Math.round(gross_pr * 100) / 100;

                if (qty != '' && price != '') {
                    tmp = "input[name$='purchase_order[" + i + "][po_gross_pr]']";
                    $(tmp).val(gross_pr);
                    tmp = "input[name$='purchase_order[" + i + "][po_cgst]']";
                    $(tmp).val(cgst.toFixed(2));
                    tmp = "input[name$='purchase_order[" + i + "][po_sgst]']";
                    $(tmp).val(sgst.toFixed(2));
                    tmp = "input[name$='purchase_order[" + i + "][po_igst]']";
                    $(tmp).val(igst.toFixed(2));
                    tmp = "input[name$='purchase_order[" + i + "][po_tax_pr]']";
                    $(tmp).val(tax_pr);
                    tmp = "input[name$='purchase_order[" + i + "][po_total_pr]']";
                    $(tmp).val(total);
                } else {
                    tmp = "input[name$='purchase_order[" + i + "][po_gross_pr]']";
                    $(tmp).val('');
                    tmp = "input[name$='purchase_order[" + i + "][po_cgst]']";
                    $(tmp).val('');
                    tmp = "input[name$='purchase_order[" + i + "][po_sgst]']";
                    $(tmp).val('');
                    tmp = "input[name$='purchase_order[" + i + "][po_igst]']";
                    $(tmp).val('');
                    tmp = "input[name$='purchase_order[" + i + "][po_tax_pr]']";
                    $(tmp).val('');
                    tmp = "input[name$='purchase_order[" + i + "][po_total_pr]']";
                    $(tmp).val('');
                }

            }

            var freight = $('#po_freight').val();
            var pf = $('#po_pf').val();

            if (freight == '')
                freight = 0;
            else {
                var n = freight.indexOf("%");
                if (n == '-1')
                    freight = parseFloat(freight.replace(/,/g, ''));
                else {
                    var percent = parseFloat(freight.replace("%", ""));
                    freight = parseFloat(gross_final) * parseFloat(percent) / 100;
                }
            }

            if (pf == '')
                pf = 0;
            else {
                var n = pf.indexOf("%");
                if (n == '-1')
                    pf = parseFloat(pf.replace(/,/g, ''));
                else {
                    var percent = parseFloat(pf.replace("%", ""));
                    pf = parseFloat(gross_final) * parseFloat(percent) / 100;
                }
            }

            var addon = parseFloat(freight) + parseFloat(pf);

            tax_final = tax_final + addon * 18 / 100;
            total_final = parseFloat(gross_final) + parseFloat(addon) + parseFloat(tax_final);

            total_final = Math.round(total_final * 100) / 100;
            tax_final = Math.round(tax_final * 100) / 100;
            gross_final = Math.round(gross_final * 100) / 100;

            var decimal = Math.floor(total_final);
            var fraction = total_final - decimal;

            if (fraction >= 0.5) {
                var add_fraction = 1 - fraction;
                $('#po_round').val(add_fraction.toFixed(2));
                total_final += add_fraction;
            } else {
                var add_fraction = -1 * fraction;
                $('#po_round').val(add_fraction.toFixed(2));
                total_final += add_fraction;
            }

            $(".po_gross_final").val(gross_final.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'));
            $(".po_tax_final").val(tax_final.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'));
            $(".po_total_final").val(total_final.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'));

            $("#po_freight").val(freight.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'));
            $("#po_pf").val(pf.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'));
        }
    }, 1000);
}

function po_discount(e) {

    var discount = $("#bulk_discount").val();
    console.log(discount);
    setTimeout(() => {
        var rep = document.getElementById('purchase_order_list');
        var rowsCount = rep.childNodes.length;

        var name = e.currentTarget.name;
        if (name != null) {
            var start = name.indexOf("[");
            var end = name.indexOf("]");
            start += 1;
            name = name.substring(start, end);

            var tmp = '';

            for (var i = 0; i < rowsCount; i++) {
                tmp = "input[name$='purchase_order[" + i + "][po_dsc]']";
                $(tmp).val(discount);
            }
        }
    }, 1000);

    po_preview(e);
}

function pi_preview(e) {

    var supplier = $("#pi_supplier").val();
    var state = '0';

    $.ajax({
        url: '../assets/custom/api_get/get_tax_type.php',
        type: 'post',
        data: { supplier: supplier },
        dataType: 'json',
        success: function(response) {
            state = response.state;

        } // /success
    }); // /fetch selected member info

    setTimeout(() => {
        var rep = document.getElementById('purchase_invoice_list');
        var rowsCount = rep.childNodes.length;

        var name = e.currentTarget.name;
        if (name != null) {
            var start = name.indexOf("[");
            var end = name.indexOf("]");
            start += 1;
            name = name.substring(start, end);

            var tmp = '';

            var qty = 0;
            var price = 0;
            var discount = 0;
            var tax = 0;

            var total_final = 0;
            var tax_final = 0;
            var gross_final = 0;

            for (var i = 0; i < rowsCount; i++) {
                tmp = "input[name$='purchase_invoice[" + i + "][pi_qty]']";
                qty = $(tmp).val();

                tmp = "input[name$='purchase_invoice[" + i + "][pi_rate]']";
                price = $(tmp).val();

                tmp = "input[name$='purchase_invoice[" + i + "][pi_dsc]']";
                discount = $(tmp).val();

                tmp = "select[name$='purchase_invoice[" + i + "][pi_tax]']";
                tax = $(tmp).val();

                tmp = "input[name$='purchase_invoice[" + i + "][pi_sn]']";
                $(tmp).val(i + 1);

                price = price.replace(/,/g, '');
                price = parseFloat(price);

                var total = 0;

                if (isNaN(tax)) {
                    tax = 0;
                }
                if (isNaN(qty)) {
                    qty = 0;
                }
                if (isNaN(price)) {
                    price = 0;
                }
                total = qty * price;

                var cgst = 0;
                var sgst = 0;
                var igst = 0;
                var tax_pr = '0';
                var gross_pr = total;

                if (discount != '') {
                    total = total * ((100 - parseFloat(discount)) / 100);
                    gross_pr = gross_pr * ((100 - parseFloat(discount)) / 100);
                }
                if (state == 1) {
                    if (tax != '') {
                        tax = tax / 2;
                        cgst = total * (parseFloat(tax) / 100);
                        sgst = total * (parseFloat(tax) / 100);
                        cgst = Math.round(cgst * 100) / 100;
                        sgst = Math.round(sgst * 100) / 100;
                        total = total + cgst + sgst;
                    }
                } else {
                    if (tax != '') {
                        igst = total * (parseFloat(tax) / 100);
                        igst = Math.round(igst * 100) / 100;
                        total = total + igst;
                    }
                }

                tax_pr = cgst + sgst + igst;

                total_final += Math.round(total * 100) / 100;
                tax_final += Math.round(tax_pr * 100) / 100;
                gross_final += Math.round(gross_pr * 100) / 100;

                total = Math.round(total * 100) / 100;
                tax_pr = Math.round(tax_pr * 100) / 100;
                gross_pr = Math.round(gross_pr * 100) / 100;

                if (qty != '' && price != '') {
                    tmp = "input[name$='purchase_invoice[" + i + "][pi_gross_pr]']";
                    $(tmp).val(gross_pr);
                    tmp = "input[name$='purchase_invoice[" + i + "][pi_cgst]']";
                    $(tmp).val(cgst.toFixed(2));
                    tmp = "input[name$='purchase_invoice[" + i + "][pi_sgst]']";
                    $(tmp).val(sgst.toFixed(2));
                    tmp = "input[name$='purchase_invoice[" + i + "][pi_igst]']";
                    $(tmp).val(igst.toFixed(2));
                    tmp = "input[name$='purchase_invoice[" + i + "][pi_tax_pr]']";
                    $(tmp).val(tax_pr);
                    tmp = "input[name$='purchase_invoice[" + i + "][pi_total_pr]']";
                    $(tmp).val(total);
                } else {
                    tmp = "input[name$='purchase_invoice[" + i + "][pi_gross_pr]']";
                    $(tmp).val('');
                    tmp = "input[name$='purchase_invoice[" + i + "][pi_cgst]']";
                    $(tmp).val('');
                    tmp = "input[name$='purchase_invoice[" + i + "][pi_sgst]']";
                    $(tmp).val('');
                    tmp = "input[name$='purchase_invoice[" + i + "][pi_igst]']";
                    $(tmp).val('');
                    tmp = "input[name$='purchase_invoice[" + i + "][pi_tax_pr]']";
                    $(tmp).val('');
                    tmp = "input[name$='purchase_invoice[" + i + "][pi_total_pr]']";
                    $(tmp).val('');
                }

            }

            var freight = $('#pi_freight').val();
            var pf = $('#pi_pf').val();

            if (freight == '')
                freight = 0;
            else {
                var n = freight.indexOf("%");
                if (n == '-1')
                    freight = parseFloat(freight.replace(/,/g, ''));
                else {
                    var percent = parseFloat(freight.replace("%", ""));
                    freight = parseFloat(gross_final) * parseFloat(percent) / 100;
                }
            }

            if (pf == '')
                pf = 0;
            else {
                var n = pf.indexOf("%");
                if (n == '-1')
                    pf = parseFloat(pf.replace(/,/g, ''));
                else {
                    var percent = parseFloat(pf.replace("%", ""));
                    pf = parseFloat(gross_final) * parseFloat(percent) / 100;
                }
            }

            var addon = parseFloat(freight) + parseFloat(pf);

            tax_final = tax_final + addon * 18 / 100;
            total_final = parseFloat(gross_final) + parseFloat(addon) + parseFloat(tax_final);

            total_final = Math.round(total_final * 100) / 100;
            tax_final = Math.round(tax_final * 100) / 100;
            gross_final = Math.round(gross_final * 100) / 100;

            var decimal = Math.floor(total_final);
            var fraction = total_final - decimal;

            if (fraction >= 0.5) {
                var add_fraction = 1 - fraction;
                $('#pi_round').val(add_fraction.toFixed(2));
                total_final += add_fraction;
            } else {
                var add_fraction = -1 * fraction;
                $('#pi_round').val(add_fraction.toFixed(2));
                total_final += add_fraction;
            }

            total_final = Math.round(total_final * 100) / 100;
            tax_final = Math.round(tax_final * 100) / 100;
            gross_final = Math.round(gross_final * 100) / 100;

            $(".pi_gross_final").val(gross_final.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'));
            $(".pi_tax_final").val(tax_final.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'));
            $(".pi_total_final").val(total_final.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'));

            $("#pi_freight").val(freight.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'));
            $("#pi_pf").val(pf.toFixed(2).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,'));
        }
    }, 1000);
}

function py_preview(e) {

    setTimeout(() => {
        var rep = document.getElementById('payment_list');
        var rowsCount = rep.childNodes.length;

        var name = e.currentTarget.name;
        if (name != null) {
            var start = name.indexOf("[");
            var end = name.indexOf("]");
            start += 1;
            name = name.substring(start, end);

            var tmp = '';
            var amount = 0;
            var tot_amount = 0;

            for (var i = 0; i < rowsCount; i++) {
                tmp = "input[name$='payment[" + i + "][py_amount]']";
                amount = $(tmp).val();

                tmp = "input[name$='payment[" + i + "][py_sn]']";
                $(tmp).val(i + 1);

                tot_amount += parseFloat(amount);

            }

            $("#py_amount").val(tot_amount.toFixed(2));
        }
    }, 1000);
}

function a_preview(e) {

    setTimeout(() => {

        var rep = document.getElementById('assemblies_list');
        var rowsCount = rep.childNodes.length;

        var name = e.currentTarget.name;
        if (name != null) {
            var start = name.indexOf("[");
            var end = name.indexOf("]");
            start += 1;
            name = name.substring(start, end);

            var tmp = '';

            for (var i = 0; i < rowsCount; i++) {

                tmp = "input[name$='assemblies[" + i + "][a_sn]']";
                $(tmp).val(i + 1);
            }
        }

    }, 100);
}

function setStatus(id = true, status, script) {
    if (id) {
        $.ajax({
            url: '../assets/custom/api_set/set_status.php',
            type: 'post',
            data: { member_id: id, status: status, script: script },
            dataType: 'json',
            success: function(response) {
                if (response.success == true) {
                    swal.fire({
                        position: 'top-right',
                        type: 'success',
                        title: 'Status Changed',
                        showConfirmButton: false,
                        timer: 1500
                    });

                    if (script == "quotation") {
                        manageQuotationTable.reload();
                    } else if (script == "proforma") {
                        manageProformaTable.reload();
                    } else if (script == "sales_invoice") {
                        manageSalesInvoiceTable.reload();
                    } else if (script == "purchase_invoice") {
                        managePurchaseInvoiceTable.reload();
                    } else if (script == "sales_followup") {
                        manageSalesFollowupTable.reload();
                    }

                } else {
                    swal.fire({
                        position: 'top-right',
                        type: 'error',
                        title: 'There were some errors in your submission.',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            }
        });
    } else {
        alert('Error : Please refresh the page');
    }
}

//***************************************************** - Sample - *****************************************************

var Sample = function() {

    var handleAddSample = function() {

        var ajaxAdd = function(form) {
            form = $(form);
            $.ajax({
                type: "POST",
                url: "../assets/custom/sample/create.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Sample Request Added Successfully!',
                            showConfirmButton: false,
                            timer: 1500
                        });

                        //Reset The Form
                        $('#sample_form')[0].reset();
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                }
            });

            return false;
        }

        $('#sample_form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                contact_person_number_full: {
                    required: true
                },
            },
            messages: {
                contact_person_number_full: {
                    required: 'Invalid Number!'
                },
            },

            invalidHandler: function(event, validator) {
                var alert = $('#edit_product_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#sample_form input').keypress(function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            if (e.which == 13) {
                if ($('#sample_form').validate().form()) {
                    ajaxAdd($('#sample_form')); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    // Public Functions
    return {
        // public functions
        init: function() {
            handleAddSample();
        }
    };
}();

function fulfillSampleRequest(id, courier_name, awb_no, status) {

    $('#courier_name').val(courier_name);
    $('#awb_no').val(awb_no);
    
    if(status == 1) {
        $('#fulfill_checkbox').prop('checked', true);
    } else {
        $('#fulfill_checkbox').prop('checked', false);
    }

    if (id) {
        // Click remove button
        $('#fulfill_sample_submit').unbind('click').bind('click', function() {

            var courier_name    =  $('#courier_name').val();
            var awb_no          =  $('#awb_no').val();
            var checked         = '';
            if ($('#fulfill_checkbox').is(':checked')) {
                checked = 'checked';
            } else {
                checked = 'not checked';
            }

            $.ajax({
                url: '../assets/custom/sample/fulfill.php',
                type: 'post',
                data: { id, courier_name, awb_no, checked },
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Fulfilled Successfully!',
                            showConfirmButton: false,
                            timer: 1500
                        });

                        // Close the modal
                        $("#fulfillSampleModal").modal('hide');
                        $('#fulfill_sample_form')[0].reset();
                        manageSampleRequestsTable.reload();
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                }
            });
        });
        // click remove button
    } else {
        alert('Error : Please refresh the page');
    }
}

function removeSampleRequest(id) {
    if (id) {
        $('#delete_sample_submit').unbind('click').bind('click', function() {

            $.ajax({
                url: '../assets/custom/sample/delete.php',
                type: 'post',
                data: { id: id },
                dataType: 'json',
                success: function(response) {
                   if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Sample Request Deleted Successfully!',
                            showConfirmButton: false,
                            timer: 1500
                        });

                        // Close the modal
                        $("#delete_sample_modal").modal('hide');
                        manageSampleRequestsTable.reload();
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                }
            });
        });
    } else {
        alert('Error : Please refresh the page');
    }
}

//***************************************************** -Settings- *****************************************************

var Settings = function() {

    var handleUpdateWhatsapp = function() {
        // console.log("loaded");

        var ajaxAdd = function(form) {
            form = $(form);
            $.ajax({
                type: "POST",
                url: "../assets/custom/settings/update_whatsapp.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Updated Successfully!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    //Reset The Form
                    $('#whatsapp_credentials')[0].reset();
                    // close the modal
                    location.reload();
                }
            });

            return false;
        }

        $('#whatsapp_credentials').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {},
            messages: {},

            invalidHandler: function(event, validator) {
                var alert = $('#edit_product_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#whatsapp_credentials input').keypress(function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            if (e.which == 13) {
                if ($('#whatsapp_credentials').validate().form()) {
                    ajaxAdd($('#whatsapp_credentials')); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    // Public Functions
    return {
        // public functions
        init: function() {
            handleUpdateWhatsapp();
        }
    };
}();

//***************************************************** -Products- *****************************************************

var Product = function() {

    var product = $('#add_product');

    var handleAddProduct = function() {

        var ajaxAdd = function(form) {
            form = $(form);
            $.ajax({
                type: "POST",
                url: "../assets/custom/product/create.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Product added successfully',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    //Reset The Form
                    $('#add_product')[0].reset();
                    // close the modal
                    $("#kt_modal_product").modal('hide');
                    manageProductTable.reload();
                    $('#product_name').val(null).trigger('change');
                    $('#product_group_name').val(null).trigger('change');
                    $('#product_category').val(null).trigger('change');
                    $('#product_sub_category').val(null).trigger('change');
                    $('#product_unit').val(null).trigger('change');
                    $('#product_tax').val(null).trigger('change');
                }
            });

            return false;
        }

        $('#add_product').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                product_name: {
                    required: true,
                    remote: {
                        url: "../assets/custom/api_check/check_product.php",
                        type: "post"
                    }
                },
                product_opening_stock: {
                    required: true
                },
                product_unit: {
                    required: true
                },
                product_rate: {
                    required: true,
                    number: true
                }
            },
            messages: {
                product_name: {
                    required: 'This field is required!',
                    remote: "This product already exists"
                },
                product_opening_stock: {
                    required: 'This field is required!'
                },
                product_unit: {
                    required: 'This field is required!'
                },
                product_rate: {
                    required: 'This field is required!',
                    number: 'Only Numeric value allowed'
                }
            },

            invalidHandler: function(event, validator) {
                var alert = $('#add_product_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#add_product input').keypress(function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            if (e.which == 13) {
                if ($('#add_product').validate().form()) {
                    ajaxAdd($('#add_product')); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    var handleUpdateProduct = function() {

        var ajaxAdd = function(form) {
            form = $(form);
            $.ajax({
                type: "POST",
                url: "../assets/custom/product/update.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Product updated successfully',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    //Reset The Form
                    $('#edit_product')[0].reset();
                    // close the modal
                    $("#kt_modal_e_product").modal('hide');
                    manageProductTable.reload();
                }
            });

            return false;
        }

        $('#edit_product').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                edit_product_name: {
                    required: true
                },
                edit_product_opening_stock: {
                    required: true
                },
                edit_product_unit: {
                    required: true
                },
                edit_product_rate: {
                    required: true
                }
            },
            messages: {
                edit_product_name: {
                    required: 'This field is required!'
                },
                edit_product_opening_stock: {
                    required: 'This field is required!'
                },
                edit_product_unit: {
                    required: 'This field is required!'
                },
                edit_product_rate: {
                    required: 'This field is required!'
                }
            },

            invalidHandler: function(event, validator) {
                var alert = $('#edit_product_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#edit_product input').keypress(function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            if (e.which == 13) {
                if ($('#edit_product').validate().form()) {
                    ajaxAdd($('#edit_product')); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    // Public Functions
    return {
        // public functions
        init: function() {
            handleAddProduct();
            handleUpdateProduct();
        }
    };
}();

function editProduct(id) {
    if (id) {
        $.ajax({
            url: '../assets/custom/product/getSelectedProduct.php',
            type: 'post',
            data: { member_id: id },
            dataType: 'json',
            success: function(response) {
                $("#edit_product_id").val(response.id);
                $("#edit_product_name").empty().append($("<option/>").val(response.name).text(response.name)).val(response.name).trigger("change");
                $("#edit_product_description").val(response.description);
                $("#edit_product_group_name").empty().append($("<option/>").val(response.group).text(response.group)).val(response.group).trigger("change");
                $("#edit_product_category").empty().append($("<option/>").val(response.category).text(response.category)).val(response.category).trigger("change");
                $("#edit_product_sub_category").empty().append($("<option/>").val(response.sub_category).text(response.sub_category)).val(response.sub_category).trigger("change");
                $("#edit_product_opening_stock").val(response.opening_stock);
                $("#edit_product_unit").empty().append($("<option/>").val(response.unit).text(response.unit)).val(response.unit).trigger("change");
                $("#edit_product_rate").val(response.rate);
                $("#edit_product_tax").val(response.tax).trigger("change");
                $("#edit_product_hsn").val(response.hsn);


            } // /success
        }); // /fetch selected member info
    } else {
        alert('Error : Please refresh the page');
    }
}

function removeProduct(id = true) {
    if (id) {
        //click remove button
        $('#delete_product_submit').unbind('click').bind('click', function() {

            $.ajax({
                url: '../assets/custom/product/delete.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {
                   if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Product removed successfully',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    // close the modal
                    $("#kt_modal_d_product").modal('hide');
                    manageProductTable.reload();
                }
            });
        });
        // click remove button
    } else {
        alert('Error : Please refresh the page');
    }
}

//***************************************************** -Assemblies- *****************************************************

var Assemblies = function() {

    var handleAddAssemblies = function() {

        var ajaxAdd = function(form) {
            form = $(form);
            $.ajax({
                type: "POST",
                url: "../assets/custom/assemblies/create.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Your Assembly has been saved',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    //Reset The Form
                    $('#add_assembly')[0].reset();
                    // close the modal
                    manageAssembliesTable.reload();
                    $('#composite_product').val(null).trigger('change');

                    $('[data-repeater-list="assemblies"]').empty();
                    $('[data-repeater-create="assemblies"]').click();
                    var tmp = "input[name$='assemblies[0][a_sn]']";
                    $(tmp).val(1);
                }
            });

            return false;
        }

        $('#add_assembly').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                composite_product: {
                    required: true
                },
            },
            messages: {
                composite_product: {
                    required: 'This field is required'
                },
            },

            invalidHandler: function(event, validator) {
                var alert = $('#add_product_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#add_assembly input').keypress(function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            if (e.which == 13) {
                if ($('#add_assembly').validate().form()) {
                    ajaxAdd($('#add_assembly')); //form validation success, call ajax form submit
                }
                return false;
            }
        });

    }
    var handleAddAssemble = function() {

        var ajaxAdd = function(form) {
            form = $(form);
            $.ajax({
                type: "POST",
                url: "../assets/custom/assemblies/assemble.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Assemble Operation has been saved',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                    $("#kt_modal_a_assemblies").modal('hide');
                    //Reset The Form
                    $('#assemblies_assemble')[0].reset();
                    // close the modal
                    manageAssembliesOperationTable.reload();

                }
            });

            return false;
        }

        $('#assemblies_assemble').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                assemble_qty: {
                    required: true
                },
            },
            messages: {
                assemble_qty: {
                    required: 'This field is required'
                },
            },

            invalidHandler: function(event, validator) {
                var alert = $('#add_product_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#assemblies_assemble input').keypress(function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            if (e.which == 13) {
                if ($('#assemblies_assemble').validate().form()) {
                    ajaxAdd($('#assemblies_assemble')); //form validation success, call ajax form submit
                }
                return false;
            }
        });

    }
    var handleAddDisassemble = function() {

        var ajaxAdd = function(form) {
            form = $(form);
            $.ajax({
                type: "POST",
                url: "../assets/custom/assemblies/disassemble.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Disassemble Operation has been saved',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                    $("#kt_modal_dis_assemblies").modal('hide');
                    //Reset The Form
                    $('#assemblies_disassemble')[0].reset();
                    // close the modal
                    manageAssembliesOperationTable.reload();

                }
            });

            return false;
        }

        $('#assemblies_disassemble').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                assemble_qty: {
                    required: true
                },
            },
            messages: {
                disassemble_qty: {
                    required: 'This field is required'
                },
            },

            invalidHandler: function(event, validator) {
                var alert = $('#add_product_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#assemblies_disassemble input').keypress(function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            if (e.which == 13) {
                if ($('#assemblies_disassemble').validate().form()) {
                    ajaxAdd($('#assemblies_disassemble')); //form validation success, call ajax form submit
                }
                return false;
            }
        });

    }


    // Public Functions
    return {
        // public functions
        init: function() {
            handleAddAssemblies();
            handleAddAssemble();
            handleAddDisassemble();
        }
    };
}();

function removeAssemblies(id = true) {
    if (id) {
        $('#delete_assemblies_submit').unbind('click').bind('click', function() {

            $.ajax({
                url: '../assets/custom/assemblies/delete.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Assembly has been deleted',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    $("#kt_modal_d_assemblies").modal('hide');
                    manageAssembliesTable.reload();
                }
            });
        });
    } else {
        alert('Error : Please refresh the page');
    }
}

function assemble(id) {
    if (id) {
        $.ajax({
            url: '../assets/custom/assemblies/getSelectedAssembly.php',
            type: 'post',
            data: { member_id: id },
            dataType: 'json',
            success: function(response) {
                $("#a_id").val(response.id);
                $("#composite_assemble").val(response.composite);
            } // /success
        }); // /fetch selected member info
    } else {
        alert('Error : Please refresh the page');
    }
}

function disassemble(id) {
    if (id) {
        $.ajax({
            url: '../assets/custom/assemblies/getSelectedAssembly.php',
            type: 'post',
            data: { member_id: id },
            dataType: 'json',
            success: function(response) {
                $("#d_id").val(response.id);
                $("#composite_disassemble").val(response.composite);
            } // /success
        }); // /fetch selected member info
    } else {
        alert('Error : Please refresh the page');
    }
}
//***************************************************** -Clients- *****************************************************

var client_id;

var Client = function() {

    var client = $('#dcs_add_client');

    var handleAddClient = function() {

        var ajaxAdd = function(form) {
            form = $(form);
            $.ajax({
                type: "POST",
                url: "../assets/custom/clients/create.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Client added successfully',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    //Reset The Form
                    $('#dcs_add_client')[0].reset();
                    // close the modal
                    $("#kt_modal_client").modal('hide');
                    manageClientTable.reload();
                }
            });

            return false;
        }

        $('#dcs_add_client').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                client_name: {
                    required: true,
                    remote: {
                        url: "../assets/custom/api_check/check_client.php",
                        type: "post"
                    }
                },
                client_add_3: {
                    required: true
                }
            },
            messages: {
                client_name: {
                    required: 'This field is required!',
                    remote: 'This name already exists! (Kindly use another name)'
                },
                client_add_3: {
                    required: 'This field is required!'
                }
            },

            invalidHandler: function(event, validator) {
                var alert = $('#dcs_add_client_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#dcs_add_client input').keypress(function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            if (e.which == 13) {
                if ($('#dcs_add_client').validate().form()) {
                    ajaxAdd($('#dcs_add_client')); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    var handleUpdateClient = function() {

        var ajaxAdd = function(form) {
            form = $(form);
            $.ajax({
                type: "POST",
                url: "../assets/custom/clients/update.php?id=" + client_id,
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Client updated successfully',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    //Reset The Form
                    $('#dcs_edit_client')[0].reset();
                    // close the modal
                    $("#kt_modal_edit_client").modal('hide');
                    manageClientTable.reload();
                }
            });

            return false;
        }

        $('#dcs_edit_client').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                edit_client_name: {
                    required: true,
                    remote: {
                        url: "../assets/custom/api_check/check_client.php",
                        type: "post"
                    }
                },
                edit_client_add_3: {
                    required: true
                }
            },
            messages: {
                edit_client_name: {
                    required: 'This field is required!',
                    remote: 'This name already exists! (Kindly use another name)'
                },
                edit_client_add_3: {
                    required: 'This field is required!'
                }
            },

            invalidHandler: function(event, validator) {
                var alert = $('#dcs_add_client_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#dcs_edit_client input').keypress(function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            if (e.which == 13) {
                if ($('#dcs_edit_client').validate().form()) {
                    ajaxAdd($('#dcs_edit_client')); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    // Public Functions
    return {
        // public functions
        init: function() {
            handleAddClient();
            handleUpdateClient();
        }
    };
}();

function editClient(id) {
    client_id = id;
    if (id) {
        $.ajax({
            url: '../assets/custom/clients/getSelectedClient.php',
            type: 'post',
            data: { member_id: id },
            dataType: 'json',
            success: function(response) {
                $("#edit_client_name").val(response.name);
                $("#edit_client_print_name").val(response.print_name);
                $("#edit_client_address").val(response.address);
                var address = JSON.parse(response.address);
                $("#edit_client_add_1").val(address['address_1']);
                $("#edit_client_add_2").val(address['address_2']);
                $("#edit_client_city").val(address['city']);
                $("#edit_client_pincode").val(address['pincode']);

                $("#edit_client_state").empty() //empty select
                    .append($("<option/>") //add option tag in select
                        .val(response.state) //set value for option to post it
                        .text(response.state)) //set a text for show in select
                    .val(response.state) //select option of select2
                    .trigger("change");

                $("#edit_client_country").val(response.country);

                $("#edit_client_category").empty() //empty select
                    .append($("<option/>") //add option tag in select
                        .val(response.type) //set value for option to post it
                        .text(response.type)) //set a text for show in select
                    .val(response.type) //select option of select2
                    .trigger("change");

                var bank = JSON.parse(response.bank_details);
                $("#edit_bank_client").val(bank['name']);
                $("#edit_bank_name").val(bank['bank_name']);
                $("#edit_bank_account").val(bank['account']);
                $("#edit_bank_ifsc").val(bank['ifsc']);
                var temp = '';
                var obj = JSON.parse(response.contacts);
                var length = obj.name.length;

                for (var i = 0; i < length; i++) {
                    $('#edit_client_btn').click();
                }

                for (var i = 0; i < length; i++) {
                    temp = "input[name$='edit_client[" + i + "][edit_client_person]']";
                    $(temp).val(obj.name[i]);
                    temp = "input[name$='edit_client[" + i + "][edit_client_designation]']";
                    $(temp).val(obj.designation[i]);
                    temp = "input[name$='edit_client[" + i + "][edit_client_mobile]']";
                    $(temp).val(obj.mobile[i]);
                    temp = "input[name$='edit_client[" + i + "][edit_client_email]']";
                    $(temp).val(obj.email[i]);
                }

                $("#edit_client_gstin").val(response.gstin);
                $("#edit_client_gstin_type").val(response.gstin_type).trigger("change");

                $("#edit_client_credit").val(response.credit_period);
                $("#edit_client_opening").val(response.opening_balance);

            } // /success
        }); // /fetch selected member info
    } else {
        alert('Error : Please refresh the page');
    }
}

function removeClient(id = true) {
    if (id) {
        //click remove button
        $('#dcs_delete_client_submit').unbind('click').bind('click', function() {

            $.ajax({
                url: '../assets/custom/clients/delete.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Client removed successfully',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    // close the modal
                    $("#kt_modal_d_client").modal('hide');
                    manageClientTable.reload();
                }
            });
        });
        // click remove button
    } else {
        alert('Error : Please refresh the page');
    }
}

//***************************************************** -Clients- *****************************************************
var transporter_id;

var Transportrer = function() {

    var transporter = $('#dcs_add_transporter');

    var handleAddTransporter = function() {

        var ajaxAdd = function(form) {
            form = $(form);
            $.ajax({
                type: "POST",
                url: "../assets/custom/transporters/create.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Transporter added successfully',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    //Reset The Form
                    $('#dcs_add_transporter')[0].reset();
                    // close the modal
                    $("#kt_modal_transporter").modal('hide');
                    manageTransporterTable.reload();
                }
            });

            return false;
        }

        $('#dcs_add_transporter').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {

            },
            messages: {

            },

            invalidHandler: function(event, validator) {
                var alert = $('#dcs_add_transporter_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#dcs_add_transporter input').keypress(function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            if (e.which == 13) {
                if ($('#dcs_add_transporter').validate().form()) {
                    ajaxAdd($('#dcs_add_transporter')); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    var handleUpdateTransporter = function() {

        var ajaxAdd = function(form) {
            form = $(form);
            $.ajax({
                type: "POST",
                url: "../assets/custom/transporters/update.php?id=" + transporter_id,
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Transporter added successfully',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    //Reset The Form
                    $('#dcs_edit_transporter')[0].reset();
                    // close the modal
                    $("#kt_modal_edit_transporter").modal('hide');
                    manageTransporterTable.reload();
                }
            });

            return false;
        }

        $('#dcs_edit_transporter').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {

            },
            messages: {

            },

            invalidHandler: function(event, validator) {
                var alert = $('#dcs_add_client_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#dcs_edit_transporter input').keypress(function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            if (e.which == 13) {
                if ($('#dcs_edit_transporter').validate().form()) {
                    ajaxAdd($('#dcs_edit_transporter')); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    // Public Functions
    return {
        // public functions
        init: function() {
            handleAddTransporter();
            handleUpdateTransporter();
        }
    };
}();

function editTransporter(id) {
    transporter_id = id;
    if (id) {
        $.ajax({
            url: '../assets/custom/transporters/getSelectedTransporter.php',
            type: 'post',
            data: { member_id: id },
            dataType: 'json',
            success: function(response) {
                $("#edit_transporter_name").val(response.name);
                $("#edit_transporter_mobile").val(response.mobile);
                $("#edit_transporter_email").val(response.email);
                $("#edit_transporter_gstin").val(response.gstin);
                $("#edit_transporter_country").val(response.country);
                if (response.address != '') {
                    var address = JSON.parse(response.address);
                    $("#edit_transporter_add_1").val(address['address_1']);
                    $("#edit_transporter_add_2").val(address['address_2']);
                    $("#edit_transporter_city").val(address['city']);
                    $("#edit_transporter_pincode").val(address['pincode']);
                }

                $("#edit_transporter_state").empty() //empty select
                    .append($("<option/>") //add option tag in select
                        .val(response.state) //set value for option to post it
                        .text(response.state)) //set a text for show in select
                    .val(response.state) //select option of select2
                    .trigger("change");

            } // /success
        }); // /fetch selected member info
    } else {
        alert('Error : Please refresh the page');
    }
}

function removeTransporter(id = true) {
    if (id) {
        //click remove button
        $('#dcs_delete_transporter_submit').unbind('click').bind('click', function() {

            $.ajax({
                url: '../assets/custom/transporters/delete.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Transporter removed successfully',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    // close the modal
                    $("#kt_modal_d_transporter").modal('hide');
                    manageTransporterTable.reload();
                }
            });
        });
        // click remove button
    } else {
        alert('Error : Please refresh the page');
    }
}

//***************************************************** -Suppliers- *****************************************************

var supplier_id;

var Supplier = function() {

    var supplier = $('#dcs_add_supplier');

    var handleAddSupplier = function() {

        var ajaxAdd = function(form) {
            form = $(form);
            $.ajax({
                type: "POST",
                url: "../assets/custom/suppliers/create.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Supplier added successfully',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    //Reset The Form
                    $('#dcs_add_supplier')[0].reset();
                    // close the modal
                    $("#kt_modal_supplier").modal('hide');
                    manageSupplierTable.reload();
                }
            });

            return false;
        }

        $('#dcs_add_supplier').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                supplier_name: {
                    required: true
                },
                supplier_add_3: {
                    required: true
                }
            },
            messages: {
                supplier_name: {
                    required: 'This field is required!'
                },
                supplier_add_3: {
                    required: 'This field is required!'
                }
            },

            invalidHandler: function(event, validator) {
                var alert = $('#add_product_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#dcs_add_supplier input').keypress(function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            if (e.which == 13) {
                if ($('#dcs_add_supplier').validate().form()) {
                    ajaxAdd($('#dcs_add_supplier')); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    var handleUpdateSupplier = function() {

        var ajaxAdd = function(form) {
            form = $(form);
            $.ajax({
                type: "POST",
                url: "../assets/custom/suppliers/update.php?id=" + supplier_id,
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Supplier updated successfully',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    //Reset The Form
                    $('#dcs_edit_supplier')[0].reset();
                    // close the modal
                    $("#kt_modal_edit_supplier").modal('hide');
                    manageSupplierTable.reload();
                }
            });

            return false;
        }

        $('#dcs_edit_supplier').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                edit_supplier_name: {
                    required: true
                },
                edit_supplier_add_3: {
                    required: true
                }
            },
            messages: {
                edit_supplier_name: {
                    required: 'This field is required!'
                },
                edit_supplier_add_3: {
                    required: 'This field is required!'
                }
            },

            invalidHandler: function(event, validator) {
                var alert = $('#add_product_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#dcs_edit_supplier input').keypress(function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            if (e.which == 13) {
                if ($('#dcs_edit_supplier').validate().form()) {
                    ajaxAdd($('#dcs_edit_supplier')); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    // Public Functions
    return {
        // public functions
        init: function() {
            handleAddSupplier();
            handleUpdateSupplier();
        }
    };
}();

function editSupplier(id) {
    supplier_id = id;
    if (id) {
        $.ajax({
            url: '../assets/custom/suppliers/getSelectedSupplier.php',
            type: 'post',
            data: { member_id: id },
            dataType: 'json',
            success: function(response) {
                $("#edit_supplier_name").val(response.name);
                $("#edit_supplier_print_name").val(response.print_name);
                $("#edit_supplier_address").val(response.address);
                var address = JSON.parse(response.address);
                $("#edit_supplier_add_1").val(address['address_1']);
                $("#edit_supplier_add_2").val(address['address_2']);
                $("#edit_supplier_city").val(address['city']);
                $("#edit_supplier_pincode").val(address['pincode']);
                $("#edit_supplier_country").val(response['country']);


                $("#edit_supplier_state").empty() //empty select
                    .append($("<option/>") //add option tag in select
                        .val(response.state) //set value for option to post it
                        .text(response.state)) //set a text for show in select
                    .val(response.state) //select option of select2
                    .trigger("change");

                $("#edit_supplier_category").empty() //empty select
                    .append($("<option/>") //add option tag in select
                        .val(response.type) //set value for option to post it
                        .text(response.type)) //set a text for show in select
                    .val(response.type) //select option of select2
                    .trigger("change");

                var bank = JSON.parse(response.bank_details);
                $("#edit_bank_supplier").val(bank['name']);
                $("#edit_bank_name").val(bank['bank_name']);
                $("#edit_bank_account").val(bank['account']);
                $("#edit_bank_ifsc").val(bank['ifsc']);
                var temp = '';
                var obj = JSON.parse(response.contacts);
                var length = obj.name.length;

                for (var i = 0; i < length; i++) {
                    $('#edit_supplier_btn').click();
                }

                for (var i = 0; i < length; i++) {
                    temp = "input[name$='edit_supplier[" + i + "][edit_supplier_person]']";
                    $(temp).val(obj.name[i]);
                    temp = "input[name$='edit_supplier[" + i + "][edit_supplier_designation]']";
                    $(temp).val(obj.designation[i]);
                    temp = "input[name$='edit_supplier[" + i + "][edit_supplier_mobile]']";
                    $(temp).val(obj.mobile[i]);
                    temp = "input[name$='edit_supplier[" + i + "][edit_supplier_email]']";
                    $(temp).val(obj.email[i]);
                }

                $("#edit_supplier_gstin").val(response.gstin);
                $("#edit_supplier_gstin_type").val(response.gstin_type).trigger("change");

                $("#edit_supplier_credit").val(response.credit_period);
                $("#edit_supplier_opening").val(response.opening_balance);
            } // /success
        }); // /fetch selected member info
    } else {
        alert('Error : Please refresh the page');
    }
}

function removeSupplier(id = true) {
    if (id) {
        //click remove button
        $('#dcs_delete_supplier_submit').unbind('click').bind('click', function() {

            $.ajax({
                url: '../assets/custom/suppliers/delete.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Supplier removed successfully',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    // close the modal
                    $("#kt_modal_d_supplier").modal('hide');
                    manageSupplierTable.reload();
                }
            });
        });
        // click remove button
    } else {
        alert('Error : Please refresh the page');
    }
}

//***************************************************** -User- *****************************************************

var User = function() {

    var handleAddUser = function() {

        var ajaxAdd = function(form) {
            form = $(form);
            $.ajax({
                type: "POST",
                url: "../assets/custom/users/create.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true)
                        addUserToast(response.messages);
                    else
                        addUserToastError(response.messages);

                    //Reset The Form
                    $('#add_user')[0].reset();
                    // close the modal
                    $("#kt_modal_user").modal('hide');
                    manageUsersTable.reload();
                    $('#userlevel').val(null).trigger('change');
                }
            });

            return false;
        }

        $('#add_user').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                username: {
                    required: true
                },
                password: {
                    required: true
                }
            },
            messages: {
                username: {
                    required: 'This field is required!'
                },
                password: {
                    required: 'This field is required!'
                }
            },

            invalidHandler: function(event, validator) {
                var alert = $('#add_product_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#add_user input').keypress(function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            if (e.which == 13) {
                if ($('#add_user').validate().form()) {
                    ajaxAdd($('#add_user')); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    var handleUpdateUser = function() {

        var ajaxAdd = function(form) {
            form = $(form);
            $.ajax({
                type: "POST",
                url: "../assets/custom/users/update.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'User has been updated',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    //Reset The Form
                    $('#am_edit_user')[0].reset();
                    // close the modal
                    $("#kt_modal_e_user").modal('hide');
                    manageUsersTable.reload();
                    $('#edit_userlevel').val(null).trigger('change');
                }
            });

            return false;
        }

        $('#am_edit_user').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                edit_userlevel: {
                    required: true
                },
                edit_name: {
                    required: true
                }
            },
            messages: {
                edit_userlevel: {
                    required: 'This field is required!'
                },
                edit_name: {
                    required: 'This field is required!'
                }
            },

            invalidHandler: function(event, validator) {
                var alert = $('#add_product_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#am_edit_user input').keypress(function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            console.log("keys pressed");
            if (e.which == 13) {
                if ($('#am_edit_user').validate().form()) {
                    console.log("Call Ajax");

                    ajaxAdd($('#am_edit_user')); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    var handleUpdateUser_User = function() {

        var ajaxAdd = function(form) {
            form = $(form);
            $.ajax({
                type: "POST",
                url: "../assets/custom/users/update_user.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'User has been updated',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    location.reload();
                }
            });

            return false;
        }

        $('#profile_info').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                full_name: {
                    required: true
                }
            },
            messages: {
                full_name: {
                    required: 'This field is required!'
                }
            },

            invalidHandler: function(event, validator) {
                var alert = $('#add_product_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#profile_info input').keypress(function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            console.log("keys pressed");
            if (e.which == 13) {
                if ($('#profile_info').validate().form()) {
                    ajaxAdd($('#profile_info')); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    var handleUpdatePassword = function() {

        var ajaxAdd = function(form) {
            form = $(form);
            $.ajax({
                type: "POST",
                url: "../assets/custom/users/change_password.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Your password has been updated',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    //Reset The Form
                    $('#change_password')[0].reset();
                }
            });

            return false;
        }

        $('#change_password').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                new_pass: "required",
                recheck_pass: {
                    equalTo: "#new_pass"
                }
            },
            messages: {
                new_pass: " Enter Password",
                recheck_pass: " Enter Confirm Password Same as Password"
            },

            invalidHandler: function(event, validator) {
                var alert = $('#add_product_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#change_password input').keypress(function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            if (e.which == 13) {
                if ($('#change_password').validate().form()) {
                    ajaxAdd($('#change_password')); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    // Public Functions
    return {
        // public functions
        init: function() {
            handleAddUser();
            handleUpdateUser();
            handleUpdateUser_User();
            handleUpdatePassword();
        }
    };
}();

function editUser(id) {
    if (id) {
        $.ajax({
            url: '../assets/custom/users/getSelectedUser.php',
            type: 'post',
            data: { member_id: id },
            dataType: 'json',
            success: function(response) {
                $("#edit_id").val(response.id);
                $("#edit_username").val(response.username);
                $("#edit_name").val(response.name);
                $("#edit_mobile").val(response.mobile);
                $("#edit_email").val(response.email);

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
                url: '../assets/custom/users/delete.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'User has been removed',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
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

//***************************************************** -Purchase Order- *****************************************************

var Purchase_Order = function() {

    var handleAddPurchaseOrder = function() {

        var ajaxAdd = function(form) {
            form = $(form);
            $.ajax({
                type: "POST",
                url: "../assets/custom/purchase_order/create.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Your purchase order has been saved',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    //Reset The Form
                    $('#add_purchase_order')[0].reset();
                    // close the modal
                    managePurchaseOrderTable.reload();
                    managePurchaseBagTable.reload();
                    set_purchase_order_no();
                    $('#po_supplier').val(null).trigger('change');
                    $('[data-repeater-list="purchase_order"]').empty();
                    $('[data-repeater-create="purchase_order"]').click();
                    var tmp = "input[name$='purchase_order[0][po_sn]']";
                    $(tmp).val(1);
                }
            });

            return false;
        }

        $('#add_purchase_order').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                po_supplier: {
                    required: true
                },
                purchase: {
                    required: true
                },
                purchase_date: {
                    required: true
                },
            },
            messages: {
                po_supplier: {
                    required: 'This field is required!'
                },
                purchase: {
                    required: 'This field is required!'
                },
                purchase_date: {
                    required: 'This field is required!'
                }
            },

            invalidHandler: function(event, validator) {
                var alert = $('#add_product_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#add_purchase_order input').keypress(function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            if (e.which == 13) {
                if ($('#add_purchase_order').validate().form()) {
                    ajaxAdd($('#add_purchase_order')); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    // Public Functions
    return {
        // public functions
        init: function() {
            handleAddPurchaseOrder();
        }
    };
}();

function set_purchase_order_no() {
    $.ajax({
        url: '../assets/custom/api_get/get_counter.php',
        type: 'post',
        data: { key: 'purchase_order' },
        dataType: 'json',
        success: function(response) {
            $("#purchase").val(response.value);
        }
    });
}

function editPurchaseOrder(id) {
    if (id) {
        $.ajax({
            url: '../assets/custom/purchase_order/getSelectedPO.php',
            type: 'post',
            data: { member_id: id },
            dataType: 'json',
            success: function(response) {
                $("#edit_po_id").val(response.id);
                $("#po_supplier").empty().append($("<option/>").val(response.supplier_name).text(response.supplier_name)).val(response.supplier_name).trigger("change");
                $("#purchase").val(response.po_no);

                var po_date = new Date(response.po_date);
                var formatted_date = appendLeadingZeroes(po_date.getDate()) + "-" + appendLeadingZeroes(po_date.getMonth() + 1) + "-" + po_date.getFullYear();
                console.log(formatted_date);
                $("#purchase_date").val(formatted_date);

                var addons = JSON.parse(response.addons);
                $("#po_freight").val(addons.freight.value);
                $("#po_pf").val(addons.pf.value);

                var items = JSON.parse(response.items);
                var len = items.product.length;

                $('[data-repeater-list="purchase_order"]').empty();
                $('[data-repeater-create="purchase_order"]').click();

                for (var i = 1; i < len; i++) {
                    $('#po_btn_add').click();
                }

                var tmp = '';
                for (var i = 0; i < len; i++) {

                    tmp = "input[name$='purchase_order[" + i + "][po_sn]']";
                    $(tmp).val(i + 1);
                    tmp = "select[name$='purchase_order[" + i + "][po_product_name]']";
                    $(tmp).empty().append($("<option/>").val(items.product[i]).text(items.desc[i])).val(items.product[i]).trigger("change");
                    // tmp = "input[name$='purchase_order[" + i + "][po_product_description]']";
                    // $(tmp).val(items.desc[i]);
                    tmp = "textarea[name$='purchase_order[" + i + "][po_product_add_description]']";
                    var temp = items.desc[i];
                    temp = temp.replace(/\|/g, "\r\n");
                    $(tmp).val(temp);

                    var temp_textarea = $(tmp);
                    autosize(temp_textarea);

                    tmp = "input[name$='purchase_order[" + i + "][po_qty]']";
                    $(tmp).val(items.quantity[i]);
                    tmp = "select[name$='purchase_order[" + i + "][po_unit]']";
                    $(tmp).empty().append($("<option/>").val(items.unit[i]).text(items.unit[i])).val(items.unit[i]).trigger("change");
                    tmp = "input[name$='purchase_order[" + i + "][po_rate]']";
                    $(tmp).val(items.price[i]);
                    tmp = "input[name$='purchase_order[" + i + "][po_dsc]']";
                    $(tmp).val(items.discount[i]);
                    tmp = "input[name$='purchase_order[" + i + "][po_hsn]']";
                    $(tmp).val(items.hsn[i]);
                    tmp = "select[name$='purchase_order[" + i + "][po_tax]']";
                    $(tmp).empty().append($("<option/>").val(items.tax[i]).text(items.tax[i])).val(items.tax[i]).trigger("change");
                    tmp = "select[name$='purchase_order[" + i + "][po_display_make]']";
                    $(tmp).val(items.group[i]).trigger("change");
                }
                KTUtil.scrollTop();
            }
        });
    } else {
        alert('Error : Please refresh the page');
    }
}

function removePurchaseOrder(id = true) {
    if (id) {
        $('#delete_purchase_order_submit').unbind('click').bind('click', function() {

            $.ajax({
                url: '../assets/custom/purchase_order/delete.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        deletePurchaseOrderToast(response.messages);
                    } else {
                        deletePurchaseOrderToastError(response.messages);
                    }

                    $("#delete_purchase_order").modal('hide');
                    managePurchaseOrderTable.reload();
                    set_purchase_order_no();

                }
            });
        });
    } else {
        alert('Error : Please refresh the page');
    }
}

//***************************************************** -Purchase Invoice- *****************************************************

var Purchase_Invoice = function() {

    var handleAddPurchaseInvoice = function() {

        var ajaxAdd = function(form) {
            form = $(form);
            $.ajax({
                type: "POST",
                url: "../assets/custom/purchase_invoice/create.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Your purchase invoice has been saved',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        $.ajax({
                            url: "../assets/custom/api_set/set_purchase_purchaseorder.php",
                            type: "POST",
                            data: { pi: response.pi },
                            dataType: 'json',
                            success: function(response) {}
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    //Reset The Form
                    $('#add_purchase_invoice')[0].reset();
                    // close the modal
                    managePurchaseInvoiceTable.reload();
                    // set_purchase_invoice_no();

                    $('#pi_supplier').val(null).trigger('change');
                    $('#pi_purchase_order').val(null).trigger('change');
                    $('#pi_product_name').val(null).trigger('change');
                    $('#pi_tax').val(null).trigger('change');
                    $('[data-repeater-list="purchase_invoice"]').empty();
                    $('[data-repeater-create="purchase_invoice"]').click();
                    var tmp = "input[name$='purchase_invoice[0][pi_sn]']";
                    $(tmp).val(1);
                }
            });

            return false;
        }

        $('#add_purchase_invoice').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                pi_client: {
                    required: true
                },
                purchase: {
                    required: true
                },
                purchase_invoice_date: {
                    required: true
                },
            },
            messages: {
                pi_client: {
                    required: 'This field is required!'
                },
                purchase: {
                    required: 'This field is required!'
                },
                purchase_invoice_date: {
                    required: 'This field is required!'
                }
            },

            invalidHandler: function(event, validator) {
                var alert = $('#add_product_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#add_purchase_invoice input').keypress(function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            if (e.which == 13) {
                if ($('#add_purchase_invoice').validate().form()) {
                    ajaxAdd($('#add_purchase_invoice')); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    // Public Functions
    return {
        // public functions
        init: function() {
            handleAddPurchaseInvoice();
        }
    };
}();

function editPurchaseInvoice(id) {
    if (id) {
        $.ajax({
            url: '../assets/custom/purchase_invoice/getSelectedPI.php',
            type: 'post',
            data: { member_id: id },
            dataType: 'json',
            success: function(response) {
                $("#edit_pi_id").val(response.id);
                $("#pi_supplier").empty().append($("<option/>").val(response.supplier_name).text(response.supplier_name)).val(response.supplier_name).trigger("change");
                $("#purchase_invoice_no").val(response.pi_no);

                var pi_date = new Date(response.pi_date);
                var formatted_date = appendLeadingZeroes(pi_date.getDate()) + "-" + appendLeadingZeroes(pi_date.getMonth() + 1) + "-" + pi_date.getFullYear();
                console.log(formatted_date);
                $("#purchase_invoice_date").val(formatted_date);

                var e_nos = JSON.parse(response.po_no);

                $('#pi_purchase_order').empty();
                for (var i = 0, l = e_nos.length; i < l; i++) {

                    var po_no = e_nos[i];
                    $('#pi_purchase_order').append($("<option/>") //add option tag in select
                        .val(po_no) //set value for option to post it
                        .text(po_no));
                }

                var Values = new Array();
                for (var i = 0, l = e_nos.length; i < l; i++) {
                    Values.push(e_nos[i]);
                }
                $("#pi_purchase_order").val(Values).trigger('change');
                $("#pi_purchase_order").attr('readonly', true);

                var shipping = JSON.parse(response.shipping);
                $("#shipping_add_1").val(shipping.address1);
                $("#shipping_add_2").val(shipping.address2);
                $("#shipping_add_3").empty().append($("<option/>").val(shipping.address3).text(shipping.address3)).val(shipping.address3).trigger("change");

                var addons = JSON.parse(response.addons);
                $("#pi_freight").val(addons.freight.value);
                $("#pi_pf").val(addons.pf.value);

                var items = JSON.parse(response.items);
                var len = items.product.length;

                $('[data-repeater-list="purchase_invoice"]').empty();
                $('[data-repeater-create="purchase_invoice"]').click();

                for (var i = 1; i < len; i++) {
                    $('#pi_btn_add').click();
                }

                var tmp = '';
                for (var i = 0; i < len; i++) {

                    tmp = "input[name$='purchase_invoice[" + i + "][pi_sn]']";
                    $(tmp).val(i + 1);
                    tmp = "select[name$='purchase_invoice[" + i + "][pi_product_name]']";
                    $(tmp).empty().append($("<option/>").val(items.product[i]).text(items.desc[i])).val(items.product[i]).trigger("change");
                    // tmp = "input[name$='purchase_invoice[" + i + "][pi_product_description]']";
                    // $(tmp).val(items.desc[i]);
                    tmp = "textarea[name$='purchase_invoice[" + i + "][pi_product_add_description]']";
                    var temp = items.desc[i];
                    temp = temp.replace(/\|/g, "\r\n");
                    $(tmp).val(temp);

                    var temp_textarea = $(tmp);
                    autosize(temp_textarea);

                    tmp = "input[name$='purchase_invoice[" + i + "][pi_qty]']";
                    $(tmp).val(items.quantity[i]);
                    tmp = "select[name$='purchase_invoice[" + i + "][pi_unit]']";
                    $(tmp).empty().append($("<option/>").val(items.unit[i]).text(items.unit[i])).val(items.unit[i]).trigger("change");
                    tmp = "input[name$='purchase_invoice[" + i + "][pi_rate]']";
                    $(tmp).val(items.price[i]);
                    tmp = "input[name$='purchase_invoice[" + i + "][pi_dsc]']";
                    $(tmp).val(items.discount[i]);
                    tmp = "input[name$='purchase_invoice[" + i + "][pi_hsn]']";
                    $(tmp).val(items.hsn[i]);
                    tmp = "select[name$='purchase_invoice[" + i + "][pi_tax]']";
                    $(tmp).empty().append($("<option/>").val(items.tax[i]).text(items.tax[i])).val(items.tax[i]).trigger("change");
                    tmp = "select[name$='purchase_invoice[" + i + "][pi_display_make]']";
                    $(tmp).val(items.group[i]).trigger("change");
                }
                KTUtil.scrollTop();
            }
        });
    } else {
        alert('Error : Please refresh the page');
    }
}

function removePurchaseInvoice(id = true) {
    if (id) {
        $('#delete_purchase_invoice_submit').unbind('click').bind('click', function() {

            $.ajax({
                url: '../assets/custom/purchase_invoice/delete.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        deletePurchaseInvoiceToast(response.messages);
                        $.ajax({
                            url: "../assets/custom/api_set/set_purchase_purchaseorder.php",
                            type: "POST",
                            data: { so: response.so },
                            dataType: 'json',
                            success: function(response) {}
                        });
                    } else {
                        deletePurchaseInvoiceToastError(response.messages);
                    }

                    $("#delete_purchase_invoice").modal('hide');
                    managePurchaseInvoiceTable.reload();
                    // set_purchase_invoice_no();

                }
            });
        });
    } else {
        alert('Error : Please refresh the page');
    }
}

//***************************************************** -Purchase Bag- *****************************************************

var Purchase_Bag = function() {

    var showErrorMsg = function(form, type, msg) {
        var alert = $('<div class="alert alert-' + type + ' alert-dismissible" role="alert">\
            <div class="alert-text">' + msg + '</div>\
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

    var handleAddPurchaseBag = function() {
        $('#add_pb_submit').click(function(e) {
            e.preventDefault();
            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {}

            });

            if (!form.valid()) {
                return;
            }

            form.ajaxSubmit({
                type: "POST",
                url: "../assets/custom/purchase_bag/create.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true)
                        addPurchaseBagToast(response.messages);
                    else
                        addPurchaseBagToastError(response.messages);

                    //Reset The Form
                    $('#add_purchase_bag')[0].reset();
                    // close the modal
                    $("#kt_modal_add_purchase_bag").modal('hide');
                }
            });
        });
    }

    // Public Functions
    return {
        // public functions
        init: function() {
            handleAddPurchaseBag();
        }
    };
}();

function PurchaseBagLoad(name) {
    $("#pb_product").val(name);
}

function PurchaseBagLoadSO(name, qty) {
    $("#pb_product").val(name);
    $("#pb_quantity").val(qty);
}

function addToPurchaseOrder(id) {

    $.ajax({
        url: '../assets/custom/purchase_bag/getSelectedPurchaseBag.php',
        type: 'post',
        data: { member_id: id },
        dataType: 'json',
        success: function(response) {

            var tmp = "input[name$='purchase_order[0][po_product_description]']";
            var desc = $(tmp).val();

            var rep = document.getElementById('purchase_order_list');
            var rowsCount = rep.childNodes.length;

            if (rowsCount == 1 && desc == '') {
                rowsCount -= 1;
            } else {
                $('[data-repeater-create="purchase_order"]').click();
            }

            tmp = "select[name$='purchase_order[" + rowsCount + "][po_product_name]']";
            var pr = response.product_name;
            $(tmp).empty().append($("<option/>").val(pr).text(pr)).val(pr).trigger("change");
            console.log(tmp);

            tmp = "input[name$='purchase_order[" + rowsCount + "][po_qty]']";
            $(tmp).val(response.quantity);
            $("#po_pf").val('0');

            swal.fire({
                position: 'top-right',
                type: 'info',
                title: 'Product Added in the list above.',
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
}


function addPurchaseBagToast(msg) {
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

function addPurchaseBagToastError(msg) {
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

function removePurchaseBag(id = true) {
    if (id) {
        $('#delete_purchase_bag_submit').unbind('click').bind('click', function() {

            $.ajax({
                url: '../assets/custom/purchase_bag/delete.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Item has been deleted',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    $("#delete_item_purchase_bag").modal('hide');
                    managePurchaseBagTable.reload();
                }
            });
        });
    } else {
        alert('Error : Please refresh the page');
    }
}

//***************************************************** -Payments- *****************************************************

var payment_id;

var Payments = function() {

    var handleAddPayments = function() {

        var ajaxAdd = function(form) {
            form = $(form);
            $.ajax({
                type: "POST",
                url: "../assets/custom/payments/create.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Your payment has been saved',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        $.ajax({
                            url: "../assets/custom/api_set/set_purchase_payment.php",
                            type: "POST",
                            data: { py_no: response.py_no },
                            dataType: 'json',
                            success: function(response) {}
                        });
                        //Reset The Form
                        $('#add_payment')[0].reset();
                        // close the modal
                        managePaymentsTable.reload();
                        $('#py_supplier').val(null).trigger('change');
                        $('#py_bank').val(null).trigger('change');
                        $('#py_mode').val(null).trigger('change');
                        $('[data-repeater-list="payment"]').empty();
                        $('[data-repeater-create="payment"]').click();
                        var tmp = "input[name$='payment[0][py_sn]']";
                        $(tmp).val(1);

                        document.getElementById("bank_details").style.display = "none";
                        document.getElementById("bank_details_title").style.display = "none";

                        document.getElementById("invoice_details").style.display = "none";
                        document.getElementById("invoice_details_title").style.display = "none";

                    } else if (response.success == 'mismatch') {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'The totals do not tally.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }


                }
            });

            return false;
        }

        $('#add_payment').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                py_supplier: {
                    required: true
                }
            },
            messages: {
                py_supplier: {
                    required: 'This field is required!'
                }
            },

            invalidHandler: function(event, validator) {
                var alert = $('#add_product_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#add_payment input').keypress(function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            if (e.which == 13) {
                if ($('#add_payment').validate().form()) {
                    ajaxAdd($('#add_payment')); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    // Public Functions
    return {
        // public functions
        init: function() {
            handleAddPayments();
        }
    };
}();

function editPayments(id) {

    if (id) {
        $.ajax({
            url: '../assets/custom/payments/getSelectedPayment.php',
            type: 'post',
            data: { member_id: id },
            dataType: 'json',
            success: function(response) {
                $("#py_id").val(response.id);
                $("#py_no").val(response.r_no);
                $("#py_supplier").empty().append($("<option/>").val(response.supplier).text(response.supplier)).val(response.supplier).trigger("change");
                var receipts_date = new Date(response.date);
                var formatted_date = appendLeadingZeroes(receipts_date.getDate()) + "-" + appendLeadingZeroes(receipts_date.getMonth() + 1) + "-" + receipts_date.getFullYear();
                // console.log(formatted_date);
                $("#py_date").val(formatted_date);
                $("#py_bank").empty().append($("<option/>").val(response.account).text(response.account)).val(response.account).trigger("change");

                $("#py_supplier").attr("readonly", true);

                var purchase_invoice = JSON.parse(response.purchase_invoice);
                var len = purchase_invoice.pi_no.length;

                $('[data-repeater-list="payment"]').empty();
                $('[data-repeater-create="payment"]').click();

                for (var i = 1; i < len; i++) {
                    $('#py_btn_add').click();
                }

                var tmp = '';
                for (var i = 0; i < len; i++) {

                    tmp = "input[name$='payment[" + i + "][py_sn]']";
                    $(tmp).val(i + 1);
                    tmp = "input[name$='payment[" + i + "][py_pi_no]']";
                    $(tmp).val(purchase_invoice.pi_no[i]);
                    tmp = "input[name$='payment[" + i + "][py_pi_amount]']";
                    $(tmp).val(purchase_invoice.due[i]);
                    tmp = "input[name$='payment[" + i + "][py_pi_amount_due]']";
                    $(tmp).val(purchase_invoice.due[i]);
                    tmp = "input[name$='payment[" + i + "][py_amount]']";
                    $(tmp).val(purchase_invoice.amount[i]);



                    KTUtil.scrollTop();
                }

                $("#py_mode").val(response.mode).trigger("change");
                $("#py_bank_name").val(response.bank_name);
                $("#py_cheque").val(response.cheque);
                $("#py_ifsc").val(response.ifsc);


            }
        });
    } else {
        alert('Error : Please refresh the page');
    }
}

function removePayments(id = true) {
    if (id) {
        //click remove button
        $('#delete_payment_submit').unbind('click').bind('click', function() {

            $.ajax({
                url: '../assets/custom/payments/delete.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        deletePaymentsToast(response.messages);
                    } else {
                        deletePaymentsToastError(response.messages);
                    }

                    // close the modal
                    $("#kt_modal_d_payment").modal('hide');
                    managePaymentsTable.reload();
                }
            });
        });
        // click remove button
    } else {
        alert('Error : Please refresh the page');
    }
}

//***************************************************** -Enquiry- *****************************************************

var Enquiry = function() {

    var handleAddEnquiry = function() {

        var ajaxAdd = function(form) {
            form = $(form);
            $.ajax({
                type: "POST",
                url: "../assets/custom/enquiry/create.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Your enquiry has been saved',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    //Reset The Form
                    $('#add_enquiry')[0].reset();
                    // close the modal
                    manageEnquiryTable.reload();
                    $('#e_client').val(null).trigger('change');
                    $('#enquiry_mode').val(null).trigger('change');
                    $('#enquiry_status').val(null).trigger('change');

                    $('[data-repeater-list="enquiry"]').empty();
                    $('[data-repeater-create="enquiry"]').click();
                    var tmp = "input[name$='enquiry[0][e_sn]']";
                    $(tmp).val(1);
                    set_enquiry_no();
                }
            });

            return false;
        }

        $('#add_enquiry').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                e_client: {
                    required: true
                },
                enquiry_no: {
                    required: true
                },
                enquiry_date: {
                    required: true
                },
            },
            messages: {
                e_client: {
                    required: 'This field is required'
                },
                enquiry_no: {
                    required: 'This field is required'
                },
                enquiry_date: {
                    required: 'This field is required'
                },
            },

            invalidHandler: function(event, validator) {
                var alert = $('#add_product_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#add_enquiry input').keypress(function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            if (e.which == 13) {
                if ($('#add_enquiry').validate().form()) {
                    ajaxAdd($('#add_enquiry')); //form validation success, call ajax form submit
                }
                return false;
            }
        });

    }

    // Public Functions
    return {
        // public functions
        init: function() {
            handleAddEnquiry();
        }
    };
}();

function set_enquiry_no() {
    $.ajax({
        url: '../assets/custom/api_get/get_counter.php',
        type: 'post',
        data: { key: 'enquiry' },
        dataType: 'json',
        success: function(response) {
            $("#enquiry_no").val(response.value);
        }
    });
}

function generateQuotation() {
    var enquiry =  $('#fill_enquiry').val();
    $('#q_enquiry_no-select2').val(enquiry);
    console.log(enquiry);
}

function editEnquiry(id) {
    if (id) {
        $.ajax({
            url: '../assets/custom/enquiry/getSelectedEnquiry.php',
            type: 'post',
            data: { member_id: id },
            dataType: 'json',
            success: function(response) {
                $("#e_id").val(response.id);
                $("#e_client").empty().append($("<option/>").val(response.client).text(response.client)).val(response.client).trigger("change");
                $("#enquiry_no").val(response.enquiry_no);

                let enquiry_date = new Date(response.enquiry_date);
                let formatted_date = appendLeadingZeroes(enquiry_date.getDate()) + "-" + appendLeadingZeroes(enquiry_date.getMonth() + 1) + "-" + enquiry_date.getFullYear();
                console.log(formatted_date);

                $("#enquiry_date").val(formatted_date);
                $("#enquiry_mode").val(response.mode).trigger("change");
                $("#enquiry_status").val(response.status).trigger("change");
                $("#client_enquiry_no").val(response.cl_enquiry_no);

                var cl_contact = JSON.parse(response.cl_contact);
                $("#cl_name").val(cl_contact.name);
                $("#cl_mobile").val(cl_contact.mobile);
                $("#cl_email").val(cl_contact.email);

                var items = JSON.parse(response.items);
                var len = items.product.length;

                $('[data-repeater-list="enquiry"]').empty();
                $('[data-repeater-create="enquiry"]').click();

                for (var i = 1; i < len; i++) {
                    $('#enq_btn_add').click();
                }

                var tmp = '';
                for (var i = 0; i < len; i++) {

                    tmp = "input[name$='enquiry[" + i + "][e_sn]']";
                    $(tmp).val(i + 1);
                    tmp = "select[name$='enquiry[" + i + "][e_product_name]']";
                    $(tmp).empty().append($("<option/>").val(items.product[i]).text(items.product[i])).val(items.product[i]).trigger("change");
                    tmp = "textarea[name$='enquiry[" + i + "][e_product_description]']";
                    var temp = items.desc[i];
                    temp = temp.replace(/\|/g, "\r\n");
                    $(tmp).val(temp);

                    var temp_textarea = $(tmp);
                    autosize(temp_textarea);

                    tmp = "input[name$='enquiry[" + i + "][e_qty]']";
                    $(tmp).val(items.quantity[i]);
                }
                KTUtil.scrollTop();

            }
        });
    } else {
        alert('Error : Please refresh the page');
    }
}

function removeEnquiry(id = true) {
    if (id) {
        $('#delete_enquiry_submit').unbind('click').bind('click', function() {

            $.ajax({
                url: '../assets/custom/enquiry/delete.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Enquiry has been deleted',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    $("#kt_modal_d_enquiry").modal('hide');
                    manageEnquiryTable.reload();
                    set_enquiry_no();
                }
            });
        });
    } else {
        alert('Error : Please refresh the page');
    }
}

//***************************************************** -Quotation- *****************************************************

var Quotation = function() {

    var wizardEl;
    var formEl;
    var validator;
    var wizard;

    var initWizard = function() {
        wizard = new KTWizard('kt_wizard_v3', {
            startStep: 1, // initial active step number
            clickableSteps: false // allow step clicking
        });

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

        wizard.on('change', function(wizard) {
            KTUtil.scrollTop();
        });
    }

    var initValidation = function() {
        validator = formEl.validate({
            ignore: ":hidden",

            rules: {},

            invalidHandler: function(event, validator) {
                KTUtil.scrollTop();
            },

            submitHandler: function(form) {

            }
        });
    }

    var initSubmit = function() {
        var btn = formEl.find('[data-ktwizard-type="action-submit"]');

        btn.on('click', function(e) {
            e.preventDefault();

            if (validator.form()) {}
        });
    }

    var handleAddQuotation = function() {

        var ajaxAdd = function(form) {
            form = $(form);
            $.ajax({
                type: "POST",
                url: "../assets/custom/quotation/create.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Your quotation has been saved',
                            showConfirmButton: false,
                            timer: 1500
                        });

                        $.ajax({
                            url: "../assets/custom/api_set/set_enquiry_quotation.php",
                            type: "POST",
                            data: { q_no: response.q_no },
                            dataType: 'json',
                            success: function(response_2) {}
                        });

                        $.ajax({
                            url: "../assets/custom/quotation_print.php",
                            type: "POST",
                            data: { id: response.q_no, type: 'save' },
                            success: function() {
                                sendQuotationNotification(response.q_no);
                            }
                        });

                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    //Reset The Form
                    $('#add_quotation')[0].reset();
                    // close the modal
                    manageQuotationTable.reload();
                    $('#q_client').val(null).trigger('change');
                    $('[data-repeater-list="quotation"]').empty();
                    $('[data-repeater-create="quotation"]').click();
                    var tmp = "input[name$='quotation[0][q_sn]']";
                    $(tmp).val(1);

                    wizard.goFirst();
                    set_quotation_no();
                }
            });

            return false;
        }

        $('#add_quotation').validate({

            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                q_client: {
                    required: true
                },
                quotation_no: {
                    required: true
                },
                quotation_date: {
                    required: true
                },
            },
            messages: {
                q_client: {
                    required: 'This field is required!'
                },
                quotation_no: {
                    required: 'This field is required!'
                },
                quotation_date: {
                    required: 'This field is required!'
                },
            },

            invalidHandler: function(event, validator) {
                var alert = $('#add_product_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#quotation_submit').on('click', function(e) {

            $('.alert').hide();
            $('.alert span').html("");
            if ($('#add_quotation').validate().form()) {
                ajaxAdd($('#add_quotation')); //form validation success, call ajax form submit
            }
            return false;
        });
    }

    var handleAddNoteQuotation = function() {

        var ajaxAdd = function(form) {
            form = $(form);
            $.ajax({
                type: "POST",
                url: "../assets/custom/quotation/create_note.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Note added successfully',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    $('#add_qnote')[0].reset();
                    $("#kt_modal_a_qnote").modal('hide');
                }
            });

            return false;
        }

        $('#add_qnote').validate({

            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {},
            messages: {},

            invalidHandler: function(event, validator) {
                var alert = $('#add_product_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#add_qnote input').keypress(function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            if (e.which == 13) {
                if ($('#add_qnote').validate().form()) {
                    ajaxAdd($('#add_qnote')); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    var handleSendQEmail = function() {

        var ajaxAdd = function(form) {
            // $('.summernote').each( function() {
            //     $(this).val($(this).code());
            // });
            form = $(form);

            $.ajax({
                type: "POST",
                url: "../assets/custom/send_email.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Email Sent!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in sending the email.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    $('#send_q_email')[0].reset();
                    $("#kt_modal_q_email").modal('hide');
                }
            });

            return false;
        }

        $('#send_q_email').validate({

            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {},
            messages: {},

            invalidHandler: function(event, validator) {
                var alert = $('#add_product_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#send_q_email input').keypress(function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            if (e.which == 13) {
                if ($('#send_q_email').validate().form()) {
                    ajaxAdd($('#send_q_email')); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    return {
        init: function() {
            wizardEl = KTUtil.get('kt_wizard_v3');
            formEl = $('#add_quotation');

            initWizard();
            initValidation();
            initSubmit();

            handleAddQuotation();
            handleAddNoteQuotation();
            handleSendQEmail();

        }
    };
}();

function set_quotation_no() {
    $.ajax({
        url: '../assets/custom/api_get/get_counter.php',
        type: 'post',
        data: { key: 'quotation' },
        dataType: 'json',
        success: function(response) {
            $("#quotation_no").val(response.value);
        }
    });
}

function editQuotation(id) {

    if (id) {
        $.ajax({
            url: '../assets/custom/quotation/getSelectedQuotation.php',
            type: 'post',
            data: { member_id: id },
            dataType: 'json',
            success: function(response) {
                $("#q_id").val(response.id);
                $("#q_client").empty().append($("<option/>").val(response.client).text(response.client)).val(response.client).trigger("change");
                $("#quotation_no").val(response.quotation_no);
                var terms = JSON.parse(response.terms);
                $("#prices").val(terms.prices);
                $("#pf").val(terms.pf);
                $("#freight").val(terms.freight);
                $("#delivery").val(terms.delivery);
                $("#payment").val(terms.payment);
                $("#validity").val(terms.validity);
                $("#remarks").val(terms.remarks);

                $("#q_client").attr("readonly", true);

                var cl_contact = JSON.parse(response.cl_contact);
                $("#cl_name").val(cl_contact.name);
                $("#cl_mobile").val(cl_contact.mobile);
                $("#cl_email").val(cl_contact.email);

                var e_nos = JSON.parse(response.quotation_top);

                $('#q_enquiry_no').empty();
                for (var i = 0, l = e_nos.enquiry_no.length; i < l; i++) {

                    var enquiry_no = e_nos.enquiry_no[i];
                    $('#q_enquiry_no').append($("<option/>") //add option tag in select
                        .val(enquiry_no) //set value for option to post it
                        .text(enquiry_no));
                }

                var Values = new Array();
                for (var i = 0, l = e_nos.enquiry_no.length; i < l; i++) {
                    Values.push(e_nos.enquiry_no[i]);
                }
                $("#q_enquiry_no").val(Values).trigger('change');
                $("#q_enquiry_no").attr("readonly", true);


                // $("#e16,#e16_2").select2("readonly", true);

                $("#q_cl_enquiry_no").val(JSON.stringify(e_nos.cl_enquiry_no));
                $("#q_enquiry_date").val(JSON.stringify(e_nos.enquiry_date));

                var addons = JSON.parse(response.addons);
                $("#q_freight").val(addons.freight.value);
                $("#q_pf").val(addons.pf.value);

                var quotation_date = new Date(response.quotation_date);
                var formatted_date = appendLeadingZeroes(quotation_date.getDate()) + "-" + appendLeadingZeroes(quotation_date.getMonth() + 1) + "-" + quotation_date.getFullYear();
                console.log(formatted_date);
                $("#quotation_date").val(formatted_date);

                var items = JSON.parse(response.items);
                var len = items.product.length;

                $('[data-repeater-list="quotation"]').empty();
                $('[data-repeater-create="quotation"]').click();

                for (var i = 1; i < len; i++) {
                    $('#qtn_btn_add').click();
                }

                var tmp = '';
                for (var i = 0; i < len; i++) {

                    tmp = "input[name$='quotation[" + i + "][q_sn]']";
                    $(tmp).val(i + 1);
                    tmp = "select[name$='quotation[" + i + "][q_product_name]']";
                    $(tmp).empty().append($("<option/>").val(items.product[i]).text(items.product[i])).val(items.product[i]).trigger("change");
                    // tmp = "input[name$='quotation[" + i + "][q_product_description]']";
                    // $(tmp).val(items.desc[i]);
                    tmp = "textarea[name$='quotation[" + i + "][q_product_add_description]']";
                    var temp = items.desc[i];
                    temp = temp.replace(/\|/g, "\r\n");
                    $(tmp).val(temp);

                    var temp_textarea = $(tmp);
                    autosize(temp_textarea);

                    tmp = "select[name$='quotation[" + i + "][q_img]']";
                    $(tmp).empty().append($("<option/>").val(items.img[i]).text(items.img[i])).val(items.img[i]).trigger("change");

                    tmp = "input[name$='quotation[" + i + "][q_qty]']";
                    $(tmp).val(items.quantity[i]);
                    tmp = "select[name$='quotation[" + i + "][q_unit]']";
                    $(tmp).empty().append($("<option/>").val(items.unit[i]).text(items.unit[i])).val(items.unit[i]).trigger("change");
                    tmp = "input[name$='quotation[" + i + "][q_rate]']";
                    $(tmp).val(items.price[i]);
                    tmp = "input[name$='quotation[" + i + "][q_dsc]']";
                    $(tmp).val(items.discount[i]);
                    tmp = "input[name$='quotation[" + i + "][q_hsn]']";
                    $(tmp).val(items.hsn[i]);
                    tmp = "select[name$='quotation[" + i + "][q_tax]']";
                    $(tmp).val(items.tax[i]).trigger("change");
                    // tmp = "select[name$='quotation[" + i + "][q_display_make]']";
                    // $(tmp).val(items.group[i]).trigger("change");


                    KTUtil.scrollTop();
                }


            }
        });
    } else {
        alert('Error : Please refresh the page');
    }
}

function removeQuotation(id = true) {
    if (id) {
        $('#delete_quotation_submit').unbind('click').bind('click', function() {

            $.ajax({
                url: '../assets/custom/quotation/delete.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Your quotation has been deleted Successfully',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    $("#kt_modal_d_quotation").modal('hide');
                    manageQuotationTable.reload();
                    set_quotation_no();
                }
            });
        });
    } else {
        alert('Error : Please refresh the page');
    }
}

function toggleQHSN(id = true) {
    if (id) {
        $('#toggle_quotation_hsn_submit').unbind('click').bind('click', function() {

            $.ajax({
                url: '../assets/custom/quotation/hsn.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Quotation updated Successfully!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There was some error saving the record!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    $("#toggle_quotation_hsn").modal('hide');

                }
            });
        });
    } else {
        alert('Error : Please refresh the page');
    }
}

function toggleQTotals(id = true) {
    if (id) {
        $('#toggle_quotation_totals_submit').unbind('click').bind('click', function() {

            $.ajax({
                url: '../assets/custom/quotation/totals.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Quotation updated Successfully!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There was some error saving the record!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    $("#toggle_quotation_totals").modal('hide');

                }
            });
        });
    } else {
        alert('Error : Please refresh the page');
    }
}

function duplicateQuotation(id = true) {
    if (id) {
        $('#duplicate_quotation_submit').unbind('click').bind('click', function() {

            $.ajax({
                url: '../assets/custom/quotation/duplicate.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Your quotation has been duplicated Successfully',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    $("#kt_modal_duplicate_quotation").modal('hide');
                    manageQuotationTable.reload();
                    set_quotation_no();
                }
            });
        });
    } else {
        alert('Error : Please refresh the page');
    }
}

function addNoteQuotation(id) {
    if (id) {
        $("#an_q_no").val(id);
    } else {
        alert('Error : Please refresh the page');
    }
}

function sendQEmail(id) {
    if (id) {
        $("#q_em_id").val(id);
        $.ajax({
            url: '../assets/custom/quotation/email_message.php',
            type: 'post',
            data: { member_id: id },
            dataType: 'json',
            success: function(response) {
                if (response.status == '200') {
                    $("#q_em_email").val(response.email);
                    $("#q_em_subject").val(response.subject);
                    // $("#q_em_message").innerHTML(response.em_message);
                    $('#q_em_message').summernote('code', response.em_message);
                }

            }
        });

    } else {
        alert('Error : Please refresh the page');
    }
}

function removeNoteQuotation(id, index) {
    console.log(id);

    if (id) {
        $('#delete_qnote_submit').unbind('click').bind('click', function() {
            $.ajax({
                url: '../assets/custom/quotation/delete_note.php',
                type: 'post',
                data: { member_id: id, index: index },
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Note has been deleted Successfully',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    $("#kt_modal_d_qnote").modal('hide');
                    location.reload();
                }
            });
        });
    } else {
        alert('Error : Please refresh the page');
    }
}

function sendQuotationNotification(q_no) {
    if (q_no) {
        $('#kt_modal_notification').modal('show');

        $('#send_notification_submit').unbind('click').bind('click', function() {

            var wa_check = 'unchecked';
            var email_check = 'unchecked';

            if($('#wa_notif').is(":checked")) {
                wa_check = 'checked';
            }

            if($('#email_notif').is(":checked")) {
                email_check = 'checked';
            }

            $.ajax({
                url: '../assets/custom/quotation/sendNotification.php',
                type: 'post',
                data: { q_no, email_check, wa_check },
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Notification Sent!',
                            showConfirmButton: false,
                            timer: 1500
                        });

                        // Close Modal
                        $("#kt_modal_notification").modal('hide');
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                }
            });
        });
    } else {
        alert('Error : Please refresh the page');
    }

}

//***************************************************** -Sales Order- *****************************************************

var Sales_Order = function() {

    var handleAddSalesOrder = function() {

        var ajaxAdd = function(form) {
            form = $(form);
            $.ajax({
                type: "POST",
                url: "../assets/custom/sales_order/create.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Your sales order has been saved',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        $.ajax({
                            url: "../assets/custom/api_set/set_quotation_so.php",
                            type: "POST",
                            data: { so: response.so },
                            dataType: 'json',
                            success: function(response) {}
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    //Reset The Form
                    $('#add_sales_order')[0].reset();
                    // close the modal
                    manageSalesOrderTable.reload();
                    set_sales_order_no();
                    $('#so_client').val(null).trigger('change');
                    $('#so_quotation').val(null).trigger('change');
                    $('[data-repeater-list="sales_order"]').empty();
                    $('[data-repeater-create="sales_order"]').click();
                    var tmp = "input[name$='sales_order[0][so_sn]']";
                    $(tmp).val(1);
                }
            });

            return false;
        }

        $('#add_sales_order').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                so_client: {
                    required: true
                },
                sales: {
                    required: true
                },
                sales_date: {
                    required: true
                },
            },
            messages: {
                so_client: {
                    required: 'This field is required!'
                },
                sales: {
                    required: 'This field is required!'
                },
                sales_date: {
                    required: 'This field is required!'
                }
            },

            invalidHandler: function(event, validator) {
                var alert = $('#add_product_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#add_sales_order input').keypress(function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            if (e.which == 13) {
                if ($('#add_sales_order').validate().form()) {
                    ajaxAdd($('#add_sales_order')); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    var handleSendSOEmail = function() {

        var ajaxAdd = function(form) {
            // $('.summernote').each( function() {
            //     $(this).val($(this).code());
            // });
            form = $(form);

            $.ajax({
                type: "POST",
                url: "../assets/custom/sales_order_email.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Email Sent!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in sending the email.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    $('#send_so_email')[0].reset();
                    $("#kt_modal_so_email").modal('hide');
                }
            });

            return false;
        }

        $('#send_so_email').validate({

            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {},
            messages: {},

            invalidHandler: function(event, validator) {
                var alert = $('#add_product_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#send_so_email input').keypress(function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            if (e.which == 13) {
                if ($('#send_so_email').validate().form()) {
                    ajaxAdd($('#send_so_email')); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    // Public Functions
    return {
        // public functions
        init: function() {
            handleAddSalesOrder();
            handleSendSOEmail();
        }
    };
}();

function set_sales_order_no() {
    $.ajax({
        url: '../assets/custom/api_get/get_counter.php',
        type: 'post',
        data: { key: 'sales_order' },
        dataType: 'json',
        success: function(response) {
            $("#sales").val(response.value);
        }
    });
}

function editSalesOrder(id) {
    if (id) {
        $.ajax({
            url: '../assets/custom/sales_order/getSelectedSO.php',
            type: 'post',
            data: { member_id: id },
            dataType: 'json',
            success: function(response) {
                $("#edit_so_id").val(response.id);
                $("#so_client").empty().append($("<option/>").val(response.client_name).text(response.client_name)).val(response.client_name).trigger("change");
                $("#client_so_no").val(response.client_so_no);
                $("#so_client").attr('readonly', true);
                var e_nos = JSON.parse(response.q_no);
                $("#so_collected").val(response.collected).trigger("change");


                $('#so_quotation').empty();
                for (var i = 0, l = e_nos.length; i < l; i++) {

                    var quotation_no = e_nos[i];
                    $('#so_quotation').append($("<option/>") //add option tag in select
                        .val(quotation_no) //set value for option to post it
                        .text(quotation_no));
                }

                var Values = new Array();
                for (var i = 0, l = e_nos.length; i < l; i++) {
                    Values.push(e_nos[i]);
                }
                $("#so_quotation").val(Values).trigger('change');
                $("#so_quotation").attr('readonly', true);

                $("#sales").val(response.so_no);

                var so_date = new Date(response.so_date);
                var formatted_date = appendLeadingZeroes(so_date.getDate()) + "-" + appendLeadingZeroes(so_date.getMonth() + 1) + "-" + so_date.getFullYear();
                console.log(formatted_date);
                $("#sales_date").val(formatted_date);

                var addons = JSON.parse(response.addons);
                $("#so_freight").val(addons.freight.value);
                $("#so_pf").val(addons.pf.value);

                var items = JSON.parse(response.items);
                var len = items.product.length;

                $('[data-repeater-list="sales_order"]').empty();
                $('[data-repeater-create="sales_order"]').click();

                for (var i = 1; i < len; i++) {
                    $('#so_btn_add').click();
                }

                var tmp = '';
                for (var i = 0; i < len; i++) {

                    tmp = "input[name$='sales_order[" + i + "][so_sn]']";
                    $(tmp).val(i + 1);
                    tmp = "select[name$='sales_order[" + i + "][so_product_name]']";
                    $(tmp).empty().append($("<option/>").val(items.product[i]).text(items.desc[i])).val(items.product[i]).trigger("change");
                    // tmp = "input[name$='sales_order[" + i + "][so_product_description]']";
                    // $(tmp).val(items.desc[i]);
                    tmp = "textarea[name$='sales_order[" + i + "][so_product_add_description]']";
                    var temp = items.desc[i];
                    temp = temp.replace(/\|/g, "\r\n");
                    $(tmp).val(temp);

                    var temp_textarea = $(tmp);
                    autosize(temp_textarea);

                    tmp = "input[name$='sales_order[" + i + "][so_qty]']";
                    $(tmp).val(items.quantity[i]);
                    tmp = "select[name$='sales_order[" + i + "][so_unit]']";
                    $(tmp).empty().append($("<option/>").val(items.unit[i]).text(items.unit[i])).val(items.unit[i]).trigger("change");
                    tmp = "input[name$='sales_order[" + i + "][so_rate]']";
                    $(tmp).val(items.price[i]);
                    tmp = "input[name$='sales_order[" + i + "][so_dsc]']";
                    $(tmp).val(items.discount[i]);
                    tmp = "input[name$='sales_order[" + i + "][so_hsn]']";
                    $(tmp).val(items.hsn[i]);
                    tmp = "select[name$='sales_order[" + i + "][so_tax]']";
                    $(tmp).empty().append($("<option/>").val(items.tax[i]).text(items.tax[i])).val(items.tax[i]).trigger("change");
                    tmp = "select[name$='sales_order[" + i + "][so_display_make]']";
                    $(tmp).val(items.group[i]).trigger("change");
                }
                KTUtil.scrollTop();

            }
        });
    } else {
        alert('Error : Please refresh the page');
    }
}

function createProforma(id) {
    // console.log(id);
    if (id) {
        $('#create_proforma_submit').unbind('click').bind('click', function() {

            $.ajax({
                url: '../assets/custom/sales_order/create_proforma.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Your proforma invoice have been created.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    $("#create_proforma").modal('hide');
                    manageProformaInvoiceTable.reload();

                }
            });
        });
    } else {
        alert('Error : Please refresh the page');
    }
}

function sendSOEmail(id) {
    if (id) {
        $("#so_em_id").val(id);
        $.ajax({
            url: '../assets/custom/sales_order/email_message.php',
            type: 'post',
            data: { member_id: id },
            dataType: 'json',
            success: function(response) {
                if (response.status == '200') {
                    $("#so_em_email").val(response.email);
                    $("#so_em_subject").val(response.subject);
                    // $("#q_em_message").innerHTML(response.em_message);
                    $('#so_em_message').summernote('code', response.em_message);
                }

            }
        });

    } else {
        alert('Error : Please refresh the page');
    }
}

function removeSalesOrder(id = true) {
    if (id) {
        $('#delete_sales_order_submit').unbind('click').bind('click', function() {

            $.ajax({
                url: '../assets/custom/sales_order/delete.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Your sales order has been deleted',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    $("#delete_sales_order").modal('hide');
                    manageSalesOrderTable.reload();
                    set_sales_order_no();

                }
            });
        });
    } else {
        alert('Error : Please refresh the page');
    }
}

//***************************************************** -Sales Invoive- *****************************************************

var Sales_Invoice = function() {

    var wizardEl;
    var formEl;
    var validator;
    var wizard;

    var initWizard = function() {
        wizard = new KTWizard('kt_wizard_sales', {
            startStep: 1, // initial active step number
            clickableSteps: true // allow step clicking
        });

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

        wizard.on('change', function(wizard) {
            KTUtil.scrollTop();
        });
    }

    var initValidation = function() {
        validator = formEl.validate({
            ignore: ":hidden",

            rules: {},

            invalidHandler: function(event, validator) {
                KTUtil.scrollTop();
            },

            submitHandler: function(form) {

            }
        });
    }

    var initSubmit = function() {
        var btn = formEl.find('[data-ktwizard-type="action-submit"]');

        btn.on('click', function(e) {
            e.preventDefault();

            if (validator.form()) {}
        });
    }

    var handleAddSalesInvoice = function() {

        var ajaxAdd = function(form) {
            form = $(form);
            $.ajax({
                type: "POST",
                url: "../assets/custom/sales_invoice/create.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Your sales invoice has been saved',
                            showConfirmButton: false
                        });
                        $.ajax({
                            url: "../assets/custom/api_set/set_sales_salesorder.php",
                            type: "POST",
                            data: { si: response.si },
                            dataType: 'json',
                            success: function(response) {}
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false
                        });
                    }

                    //Reset The Form
                    $('#add_sales_invoice')[0].reset();
                    // close the modal
                    manageSalesInvoiceTable.reload();
                    set_sales_invoice_no('PRIMARY');

                    $('#si_client').val(null).trigger('change');
                    $('#si_sales_order').val(null).trigger('change');
                    $('#si_product_name').val(null).trigger('change');
                    $('#si_tax').val(null).trigger('change');
                    $('#shipping_state').val(null).trigger('change');
                    $('[data-repeater-list="sales_invoice"]').empty();
                    $('[data-repeater-create="sales_invoice"]').click();
                    var tmp = "input[name$='sales_invoice[0][si_sn]']";
                    $(tmp).val(1);
                    wizard.goFirst();
                }
            });

            return false;
        }

        $('#add_sales_invoice').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                si_client: {
                    required: true
                },
                sales: {
                    required: true
                },
                sales_invoice_date: {
                    required: true
                },
            },
            messages: {
                si_client: {
                    required: 'This field is required!'
                },
                sales: {
                    required: 'This field is required!'
                },
                sales_invoice_date: {
                    required: 'This field is required!'
                }
            },

            invalidHandler: function(event, validator) {
                var alert = $('#add_product_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#sales_invoice_submit').on('click', function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            if ($('#add_sales_invoice').validate().form()) {
                ajaxAdd($('#add_sales_invoice')); //form validation success, call ajax form submit
            }
            return false;
        });
    }

    var handleSendSIEmail = function() {

        var ajaxAdd = function(form) {
            // $('.summernote').each( function() {
            //     $(this).val($(this).code());
            // });
            form = $(form);

            $.ajax({
                type: "POST",
                url: "../assets/custom/sales_invoice_email.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Email Sent!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in sending the email.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    $('#send_si_email')[0].reset();
                    $("#kt_modal_si_email").modal('hide');
                }
            });

            return false;
        }

        $('#send_si_email').validate({

            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {},
            messages: {},

            invalidHandler: function(event, validator) {
                var alert = $('#add_product_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#send_si_email input').keypress(function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            if (e.which == 13) {
                if ($('#send_si_email').validate().form()) {
                    ajaxAdd($('#send_si_email')); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    // Public Functions
    return {
        // public functions
        init: function() {

            wizardEl = KTUtil.get('kt_wizard_sales');
            formEl = $('#add_sales_invoice');

            initWizard();
            initValidation();
            initSubmit();

            handleAddSalesInvoice();
            handleSendSIEmail();
        }
    };
}();

function set_sales_invoice_no(data) {
    if (data == 'PRIMARY') {
        data = 'sales_invoice';
    }
    $.ajax({
        url: '../assets/custom/api_get/get_counter.php',
        type: 'post',
        data: { key: data },
        dataType: 'json',
        success: function(response) {
            $("#sales_invoice_no").val(response.value);
        }
    });
    console.log('hello');
}

function sendSIEmail(id) {
    if (id) {
        $("#si_em_id").val(id);
        $.ajax({
            url: '../assets/custom/sales_invoice/email_message.php',
            type: 'post',
            data: { member_id: id },
            dataType: 'json',
            success: function(response) {
                if (response.status == '200') {
                    $("#si_em_email").val(response.email);
                    $("#si_em_subject").val(response.subject);
                    // $("#q_em_message").innerHTML(response.em_message);
                    $('#si_em_message').summernote('code', response.em_message);
                }

            }
        });

    } else {
        alert('Error : Please refresh the page');
    }
}

function editSalesInvoice(id) {
    if (id) {
        $.ajax({
            url: '../assets/custom/sales_invoice/getSelectedSI.php',
            type: 'post',
            data: { member_id: id },
            dataType: 'json',
            success: function(response) {
                $("#edit_si_id").val(response.id);
                $("#si_client").empty().append($("<option/>").val(response.client_name).text(response.client_name)).val(response.client_name).trigger("change");
                $("#sales_invoice_no").val(response.si_no);
                if (response.si_date != '') {
                    var si_date = new Date(response.si_date);
                    var formatted_date = appendLeadingZeroes(si_date.getDate()) + "-" + appendLeadingZeroes(si_date.getMonth() + 1) + "-" + si_date.getFullYear();
                    console.log(formatted_date);
                    $("#sales_invoice_date").val(formatted_date);
                }

                $("#si_series").empty().append($("<option/>").val(response.series).text(response.series)).val(response.series).trigger("change");

                var shipping = JSON.parse(response.shipping);
                $("#shipping_name").val(shipping.name);
                $("#shipping_add_1").val(shipping.address_1);
                $("#shipping_add_2").val(shipping.address_2);
                $("#shipping_city").val(shipping.city);
                $("#shipping_pincode").val(shipping.pincode);
                $("#shipping_country").val(shipping.country);

                $("#shipping_state").empty().append($("<option/>").val(response.state).text(response.state)).val(response.state).trigger("change");

                if (response.so_no != '') {
                    var e_nos = JSON.parse(response.so_no);

                    $('#si_sales_order').empty();
                    for (var i = 0, l = e_nos.length; i < l; i++) {

                        var si_sales_order = e_nos[i];
                        $('#si_sales_order').append($("<option/>") //add option tag in select
                            .val(si_sales_order) //set value for option to post it
                            .text(si_sales_order));
                    }

                    var Values = new Array();
                    for (var i = 0, l = e_nos.length; i < l; i++) {
                        Values.push(e_nos[i]);
                    }
                    $("#si_sales_order").val(Values).trigger('change');
                    $("#si_sales_order").attr('readonly', true);
                }

                if (response.q_no != '') {
                    var e_nos = JSON.parse(response.q_no);

                    $('#si_quotation').empty();
                    for (var i = 0, l = e_nos.length; i < l; i++) {

                        var quotation_no = e_nos[i];
                        $('#si_quotation').append($("<option/>") //add option tag in select
                            .val(quotation_no) //set value for option to post it
                            .text(quotation_no));
                    }

                    var Values = new Array();
                    for (var i = 0, l = e_nos.length; i < l; i++) {
                        Values.push(e_nos[i]);
                    }
                    $("#si_quotation").val(Values).trigger('change');
                    $("#si_quotation").attr('readonly', true);
                }

                var addons = JSON.parse(response.addons);
                $("#si_freight").val(addons.freight.value);
                $("#si_pf").val(addons.pf.value);

                var items = JSON.parse(response.items);
                var len = items.product.length;

                $('[data-repeater-list="sales_invoice"]').empty();
                $('[data-repeater-create="sales_invoice"]').click();

                for (var i = 1; i < len; i++) {
                    $('#si_btn_add').click();
                }

                var tmp = '';
                for (var i = 0; i < len; i++) {

                    tmp = "input[name$='sales_invoice[" + i + "][si_sn]']";
                    $(tmp).val(i + 1);
                    tmp = "select[name$='sales_invoice[" + i + "][si_product_name]']";
                    $(tmp).empty().append($("<option/>").val(items.product[i]).text(items.desc[i])).val(items.product[i]).trigger("change");
                    tmp = "textarea[name$='sales_invoice[" + i + "][si_product_add_description]']";
                    var temp = items.desc[i];
                    temp = temp.replace(/\|/g, "\r\n");
                    $(tmp).val(temp);

                    var temp_textarea = $(tmp);
                    autosize(temp_textarea);

                    tmp = "input[name$='sales_invoice[" + i + "][si_qty]']";
                    $(tmp).val(items.quantity[i]);
                    tmp = "select[name$='sales_invoice[" + i + "][si_unit]']";
                    $(tmp).empty().append($("<option/>").val(items.unit[i]).text(items.unit[i])).val(items.unit[i]).trigger("change");
                    tmp = "input[name$='sales_invoice[" + i + "][si_rate]']";
                    $(tmp).val(items.price[i]);
                    tmp = "input[name$='sales_invoice[" + i + "][si_dsc]']";
                    $(tmp).val(items.discount[i]);
                    tmp = "input[name$='sales_invoice[" + i + "][si_hsn]']";
                    $(tmp).val(items.hsn[i]);
                    tmp = "select[name$='sales_invoice[" + i + "][si_tax]']";
                    $(tmp).empty().append($("<option/>").val(items.tax[i]).text(items.tax[i])).val(items.tax[i]).trigger("change");
                    tmp = "select[name$='sales_invoice[" + i + "][si_display_make]']";
                    $(tmp).val(items.group[i]).trigger("change");
                }

                var invoice_details = JSON.parse(response.invoice_details);
                $("#buyer_order_no").val(invoice_details.buyer_order);

                if (invoice_details.order_date != '') {
                    var order_date = new Date(invoice_details.order_date);
                    var formatted_date = appendLeadingZeroes(order_date.getDate()) + "-" + appendLeadingZeroes(order_date.getMonth() + 1) + "-" + order_date.getFullYear();
                    console.log(formatted_date);
                    $("#buyer_order_date").val(formatted_date);
                }

                $("#terms_payment").val(invoice_details.payment_terms);
                $("#terms_delivery").val(invoice_details.delivery_terms);
                $("#other_ref").val(invoice_details.other_ref);

                $("#despatch_medium").val(invoice_details.despatch_medium);
                $("#despatch_doc_no").val(invoice_details.despatch_doc_no);

                if (invoice_details.despatch_date != '') {
                    var despatch_date = new Date(invoice_details.despatch_date);
                    var formatted_date = appendLeadingZeroes(despatch_date.getDate()) + "-" + appendLeadingZeroes(despatch_date.getMonth() + 1) + "-" + despatch_date.getFullYear();
                    console.log(formatted_date);
                    $("#despatch_date").val(formatted_date);
                }

                $("#despatch_destination").val(invoice_details.despatch_destination);

                KTUtil.scrollTop();
            }
        });
    } else {
        alert('Error : Please refresh the page');
    }
}

function printSalesInvoice(id) {
    console.log(id);
    $("#id").val(id);
}

function toggleHSN(id = true) {
    if (id) {
        $('#toggle_hsn_submit').unbind('click').bind('click', function() {

            $.ajax({
                url: '../assets/custom/sales_invoice/hsn.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Sales invoice updated Successfully!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There was some error saving the record!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    $("#toggle_sales_hsn").modal('hide');
                    // manageSalesInvoiceTable.reload();
                    // set_sales_invoice_no();

                }
            });
        });
    } else {
        alert('Error : Please refresh the page');
    }
}

function updateAWB(id = true) {
    if (id) {
        $.ajax({
            url: '../assets/custom/sales_invoice/getSelectedSI.php',
            type: 'post',
            data: { member_id: id },
            dataType: 'json',
            success: function(response) {
                var invoice_details = JSON.parse(response.invoice_details);
                $("#si_awb").val(invoice_details.despatch_doc_no);
            }
        });


        $('#update_awb_submit').unbind('click').bind('click', function() {

            var awb = $('#si_awb').val();
            // console.log(awb);

            $.ajax({
                url: '../assets/custom/sales_invoice/awb.php',
                type: 'post',
                data: { member_id: id, awb_no: awb },
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Sales invoice updated Successfully!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There was some error saving the record!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    $("#update_awb_sales").modal('hide');
                    $('#si_awb').val("");

                }
            });
        });
    } else {
        alert('Error : Please refresh the page');
    }
}

function removeSalesInvoice(id = true) {
    if (id) {
        $('#delete_sales_invoice_submit').unbind('click').bind('click', function() {

            $.ajax({
                url: '../assets/custom/sales_invoice/delete.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Sales Invoice Deleted Successfully!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There was some error saving the record!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    $("#delete_sales_invoice").modal('hide');
                    manageSalesInvoiceTable.reload();
                    set_sales_invoice_no('PRIMARY');

                }
            });
        });
    } else {
        alert('Error : Please refresh the page');
    }
}

//***************************************************** -Receipts- *****************************************************

var receipt_id;

var Receipts = function() {

    var handleAddReceipts = function() {

        var ajaxAdd = function(form) {
            form = $(form);
            $.ajax({
                type: "POST",
                url: "../assets/custom/receipts/create.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Your receipt has been saved',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        $.ajax({
                            url: "../assets/custom/api_set/set_sales_receipt.php",
                            type: "POST",
                            data: { r_no: response.r_no },
                            dataType: 'json',
                            success: function(response) {}
                        });
                        //Reset The Form
                        $('#add_receipt')[0].reset();
                        // close the modal
                        manageReceiptsTable.reload();
                        $('#rc_client').val(null).trigger('change');
                        $('#rc_bank').val(null).trigger('change');
                        $('#rc_mode').val(null).trigger('change');
                        $('[data-repeater-list="receipt"]').empty();
                        $('[data-repeater-create="receipt"]').click();
                        var tmp = "input[name$='receipt[0][rc_sn]']";
                        $(tmp).val(1);

                        document.getElementById("bank_details").style.display = "none";
                        document.getElementById("bank_details_title").style.display = "none";

                        document.getElementById("invoice_details").style.display = "none";
                        document.getElementById("invoice_details_title").style.display = "none";

                    } else if (response.success == 'mismatch') {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'The totals do not tally.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }


                }
            });

            return false;
        }

        $('#add_receipt').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                rc_client: {
                    required: true
                }
            },
            messages: {
                rc_client: {
                    required: 'This field is required!'
                }
            },

            invalidHandler: function(event, validator) {
                var alert = $('#add_product_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#add_receipt input').keypress(function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            if (e.which == 13) {
                if ($('#add_receipt').validate().form()) {
                    ajaxAdd($('#add_receipt')); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    // Public Functions
    return {
        // public functions
        init: function() {
            handleAddReceipts();
        }
    };
}();

function editReceipts(id) {

    if (id) {
        $.ajax({
            url: '../assets/custom/receipts/getSelectedReceipt.php',
            type: 'post',
            data: { member_id: id },
            dataType: 'json',
            success: function(response) {
                $("#rc_id").val(response.id);
                $("#r_no").val(response.r_no);
                $("#rc_client").empty().append($("<option/>").val(response.client).text(response.client)).val(response.client).trigger("change");
                var receipts_date = new Date(response.date);
                var formatted_date = appendLeadingZeroes(receipts_date.getDate()) + "-" + appendLeadingZeroes(receipts_date.getMonth() + 1) + "-" + receipts_date.getFullYear();
                // console.log(formatted_date);
                $("#rc_date").val(formatted_date);
                $("#rc_bank").empty().append($("<option/>").val(response.account).text(response.account)).val(response.account).trigger("change");

                $("#rc_client").attr("readonly", true);

                var sales_invoice = JSON.parse(response.sales_invoice);
                var len = sales_invoice.si_no.length;

                $('[data-repeater-list="receipt"]').empty();
                $('[data-repeater-create="receipt"]').click();

                for (var i = 1; i < len; i++) {
                    $('#rc_btn_add').click();
                }

                var tmp = '';
                for (var i = 0; i < len; i++) {

                    tmp = "input[name$='receipt[" + i + "][rc_sn]']";
                    $(tmp).val(i + 1);
                    tmp = "input[name$='receipt[" + i + "][rc_si_no]']";
                    $(tmp).val(sales_invoice.si_no[i]);
                    tmp = "input[name$='receipt[" + i + "][rc_si_amount]']";
                    $(tmp).val(sales_invoice.due[i]);
                    tmp = "input[name$='receipt[" + i + "][rc_si_amount_due]']";
                    $(tmp).val(sales_invoice.due[i]);
                    tmp = "input[name$='receipt[" + i + "][rc_amount]']";
                    $(tmp).val(sales_invoice.amount[i]);



                    KTUtil.scrollTop();
                }

                $("#rc_mode").val(response.mode).trigger("change");
                $("#rc_bank_name").val(response.bank_name);
                $("#rc_cheque").val(response.cheque);
                $("#rc_ifsc").val(response.ifsc);


            }
        });
    } else {
        alert('Error : Please refresh the page');
    }
}

function removeReceipts(id = true) {
    if (id) {
        //click remove button
        $('#delete_receipt_submit').unbind('click').bind('click', function() {

            $.ajax({
                url: '../assets/custom/receipts/delete.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        deleteReceiptsToast(response.messages);
                    } else {
                        deleteReceiptsToastError(response.messages);
                    }

                    // close the modal
                    $("#kt_modal_d_receipt").modal('hide');
                    manageReceiptsTable.reload();
                }
            });
        });
        // click remove button
    } else {
        alert('Error : Please refresh the page');
    }
}

//***************************************************** -Bank- *****************************************************

var Bank = function() {

    var handleAddBank = function() {

        var ajaxAdd = function(form) {
            form = $(form);
            $.ajax({
                type: "POST",
                url: "../assets/custom/banks/create.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Bank has been saved',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    //Reset The Form
                    $('#add_bank')[0].reset();
                    // close the modal
                    manageBankTable.reload();
                }
            });

            return false;
        }

        $('#add_bank').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                bank_name: {
                    required: true
                },
            },
            messages: {
                bank_name: {
                    required: 'This field is required'
                },
            },

            invalidHandler: function(event, validator) {
                var alert = $('#add_product_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#add_bank input').keypress(function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            if (e.which == 13) {
                if ($('#add_bank').validate().form()) {
                    ajaxAdd($('#add_bank')); //form validation success, call ajax form submit
                }
                return false;
            }
        });

    }

    // Public Functions
    return {
        // public functions
        init: function() {
            handleAddBank();
        }
    };
}();

function editBank(id) {
    if (id) {
        $.ajax({
            url: '../assets/custom/banks/getSelectedBank.php',
            type: 'post',
            data: { member_id: id },
            dataType: 'json',
            success: function(response) {
                $("#edit_bank_id").val(response.id);
                $("#account_name").val(response.account_name);
                $("#bank_name").val(response.bank_name);
                $("#account_number").val(response.account_number);
                $("#ifsc").val(response.ifsc);
                KTUtil.scrollTop();

            } // /success
        }); // /fetch selected member info
    } else {
        alert('Error : Please refresh the page');
    }
}

function removeBank(id = true) {
    if (id) {
        $('#delete_bank_submit').unbind('click').bind('click', function() {

            $.ajax({
                url: '../assets/custom/banks/delete.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Bank has been deleted',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    $("#kt_modal_d_bank").modal('hide');
                    manageBankTable.reload();
                }
            });
        });
    } else {
        alert('Error : Please refresh the page');
    }
}

//***************************************************** -Sales Followup- *****************************************************

var SalesFollowup = function() {

    var handleAddSalesFollowup = function() {

        var ajaxAdd = function(form) {
            form = $(form);
            $.ajax({
                type: "POST",
                url: "../assets/custom/sales_followup/create.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Your record has been saved',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    //Reset The Form
                    $('#add_sales_followup')[0].reset();
                    // close the modal
                    manageSalesFollowupTable.reload();
                    $('#sf_client').val(null).trigger('change');

                    $("#sales_followup_submit").attr("disabled", false);
                }
            });

            return false;
        }

        $('#add_sales_followup').validate({

            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {

            },
            messages: {

            },

            invalidHandler: function(event, validator) {
                var alert = $('#add_product_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
                $("#sales_followup_submit").attr("disabled", true);
            }
        });

        $('#sales_followup_submit').on('click', function(e) {

            $('.alert').hide();
            $('.alert span').html("");
            if ($('#add_sales_followup').validate().form()) {
                ajaxAdd($('#add_sales_followup')); //form validation success, call ajax form submit
            }
            return false;
        });
    }

    // Public Functions
    return {
        // public functions
        init: function() {
            handleAddSalesFollowup();
        }
    };
}();

function editSalesFollowup(id) {

    if (id) {
        $.ajax({
            url: '../assets/custom/sales_followup/getSelectedSalesFollowup.php',
            type: 'post',
            data: { member_id: id },
            dataType: 'json',
            success: function(response) {
                $("#edit_sf_id").val(response.id);
                $("#sf_client").empty().append($("<option/>").val(response.client).text(response.client)).val(response.client).trigger("change");

                var sf_date = new Date(response.sf_date);
                var formatted_date = appendLeadingZeroes(sf_date.getDate()) + "-" + appendLeadingZeroes(sf_date.getMonth() + 1) + "-" + sf_date.getFullYear();
                console.log(formatted_date);
                $("#sf_date").val(formatted_date);

                $("#sf_amount").val(response.amount);
                $("#sf_no").val(response.sf_no);

                KTUtil.scrollTop();
            }
        });
    } else {
        alert('Error : Please refresh the page');
    }
}

function removeSalesFollowup(id = true) {
    if (id) {
        $('#delete_sales_followup_submit').unbind('click').bind('click', function() {

            $.ajax({
                url: '../assets/custom/sales_followup/delete.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Your record has been deleted successfully!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    $("#delete_sales_followup").modal('hide');
                    manageSalesFollowupTable.reload();
                }
            });
        });
    } else {
        alert('Error : Please refresh the page');
    }
}

function sf_email(id) {
    if (id) {
        $("#sf_em_id").val(id);
        $.ajax({
            url: '../assets/custom/sales_followup/email_message.php',
            type: 'post',
            data: { member_id: id },
            dataType: 'json',
            success: function(response) {
                if (response.status == '200') {
                    $("#sf_em_email").val(response.email);
                    $("#sf_em_subject").val(response.subject);
                    // $("#q_em_message").innerHTML(response.em_message);
                    $('#sf_em_message').summernote('code', response.em_message);
                }

            }
        });

    } else {
        alert('Error : Please refresh the page');
    }
}

function sf_whatsapp(id) {
    if (id) {
        $("#sf_wa_id").val(id);
        $.ajax({
            url: '../assets/custom/sales_followup/whatsapp_message.php',
            type: 'post',
            data: { member_id: id },
            dataType: 'json',
            success: function(response) {
                if (response.status == '200') {
                    $('#sf_whatsapp_message').val(response.whatsapp_message);
                }

            }
        });

    } else {
        alert('Error : Please refresh the page');
    }
}

function sf_sms(id) {
    if (id) {
        $("#sf_wa_id").val(id);
        $.ajax({
            url: '../assets/custom/sales_followup/sms_message.php',
            type: 'post',
            data: { member_id: id },
            dataType: 'json',
            success: function(response) {
                if (response.status == '200') {
                    $('#sf_sms_message').val(response.sms_message);
                }

            }
        });

    } else {
        alert('Error : Please refresh the page');
    }
}

//***************************************************** -Followup- *****************************************************

var Followup = function() {

    var handleAddFollowup = function() {

        var ajaxAdd = function(form) {
            form = $(form);
            $.ajax({
                type: "POST",
                url: "../assets/custom/followup/create.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Your record has been saved',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    //Reset The Form
                    $('#add_followup')[0].reset();
                    // close the modal
                    manageFollowupTable.reload();
                }
            });

            return false;
        }

        $('#add_followup').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
               
            },
            messages: {
                
            },

            invalidHandler: function(event, validator) {
                var alert = $('#add_product_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#add_followup input').keypress(function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            if (e.which == 13) {
                if ($('#add_followup').validate().form()) {
                    ajaxAdd($('#add_followup')); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    var handleSendFollowup = function() {

        var ajaxAdd = function(form) {
            form = $(form);

            $("#followup_message_modal").modal('hide');

            $.ajax({
                type: "POST",
                url: "../assets/custom/followup/send_message.php",
                data: form.serialize(),
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Your message has been sent',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    //Reset The Form
                    $('#followup_message')[0].reset();
                    
                }
            });

            return false;
        }

        $('#followup_message').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
               
            },
            messages: {
                
            },

            invalidHandler: function(event, validator) {
                var alert = $('#add_product_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#followup_message input').keypress(function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            if (e.which == 13) {
                if ($('#followup_message').validate().form()) {
                    ajaxAdd($('#followup_message')); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    // Public Functions
    return {
        // public functions
        init: function() {
            handleAddFollowup();
            handleSendFollowup();
        }
    };
}();

function editFollowup(id) {
    if (id) {
        $.ajax({
            url: '../assets/custom/followup/getSelectedFollowup.php',
            type: 'post',
            data: { member_id: id },
            dataType: 'json',
            success: function(response) {
                $("#edit_followup_id").val(response.id);
                $("#followup_client").val(response.client);
                $("#followup_mobile").val(response.mobile);
                $("#followup_email").val(response.email);
                $("#followup_address").val(response.address);
                // $("#followup_invoice_no").val(response.invoice_no);

                // if (response.invoice_date != null && response.invoice_date != '') {
                //     var invoice_date = new Date(response.invoice_date);
                //     var formatted_date = appendLeadingZeroes(invoice_date.getDate()) + "-" + appendLeadingZeroes(invoice_date.getMonth() + 1) + "-" + invoice_date.getFullYear();
                //     console.log(formatted_date);
                //     $("#followup_invoice_date").val(formatted_date);
                // }

                // $("#followup_amount").val(response.amount);
                KTUtil.scrollTop();

            } // /success
        }); // /fetch selected member info
    } else {
        alert('Error : Please refresh the page');
    }
}

function messageFollowup(id) {
    if (id) {
        $.ajax({
            url: '../assets/custom/followup/getSelectedFollowup.php',
            type: 'post',
            data: { member_id: id },
            dataType: 'json',
            success: function(response) {
                $("#edit_followup_message_id").val(response.id);
                
                $("#followup_invoice_no").val(response.invoice_no);

                if (response.invoice_date != null && response.invoice_date != '') {
                    var invoice_date = new Date(response.invoice_date);
                    var formatted_date = appendLeadingZeroes(invoice_date.getDate()) + "-" + appendLeadingZeroes(invoice_date.getMonth() + 1) + "-" + invoice_date.getFullYear();
                    console.log(formatted_date);
                    $("#followup_invoice_date").val(formatted_date);
                }

                $("#followup_amount").val(response.amount);
                // KTUtil.scrollTop();

            } // /success
        }); // /fetch selected member info
    } else {
        alert('Error : Please refresh the page');
    }
}

function removeFollowup(id = true) {
    if (id) {
        $('#delete_followup_submit').unbind('click').bind('click', function() {

            $.ajax({
                url: '../assets/custom/followup/delete.php',
                type: 'post',
                data: { member_id: id },
                dataType: 'json',
                success: function(response) {
                    if (response.success == true) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Record has been deleted',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'There were some errors in your submission.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }

                    $("#delete_followup").modal('hide');
                    manageFollowupTable.reload();
                }
            });
        });
    } else {
        alert('Error : Please refresh the page');
    }
}

function import_followup() {
    console.log("Here");
    $.ajax({
        url: '../assets/custom/api_excel/import_followup.php',
        type: 'post',
        dataType: 'json',
        success: function(response) {
             if (response.success == true) {
                swal.fire({
                    position: 'top-right',
                    type: 'success',
                    title: 'Excel uploded successfully.',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                swal.fire({
                    position: 'top-right',
                    type: 'error',
                    title: 'There were some errors in your submission.',
                    showConfirmButton: false,
                    timer: 1500
                });
            }

            // close the modal
            manageFollowupTable.reload();
        }
    });
}

//***************************************************** -Whatsapp- *****************************************************

var Whatsapp = function() {

    var handleSyncStudents = function() {
        $('#students_sync_btn').off('click').on('click', function() {
            var $btn = $(this);
            $btn.prop('disabled', true).text('Syncing...');

            $.ajax({
                type: 'POST',
                url: '../assets/custom/students/sync.php',
                dataType: 'json',
                success: function(response) {
                    if (response && response.success) {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: response.messages || ('Synced ' + response.count + ' students'),
                            showConfirmButton: false,
                            timer: 1600
                        });
                        if (typeof manageWhatsAppTable !== 'undefined' && manageWhatsAppTable) {
                            manageWhatsAppTable.reload();
                        }
                        if (response.count !== undefined) {
                            $('#students_count_label').text(response.count + ' synced · Just now');
                        }
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: (response && response.error) ? response.error : 'Sync failed',
                            showConfirmButton: true
                        });
                    }
                },
                error: function(xhr) {
                    var msg = 'Sync failed';
                    try {
                        var parsed = JSON.parse(xhr.responseText);
                        if (parsed && parsed.error) msg = parsed.error;
                    } catch (e) {}
                    swal.fire({
                        position: 'top-right',
                        type: 'error',
                        title: msg,
                        showConfirmButton: true
                    });
                },
                complete: function() {
                    $btn.prop('disabled', false).text('Sync from Google Sheet');
                }
            });
        });
    };

    var handleSendWhatsapp = function() {

        if (!$('#whatsapp_form').length) {
            return;
        }

        var ajaxAdd = async function(form) {
            $("#wa_queue_submit").attr("disabled", true);

            var nextID = '';
            var file_size_in_limit = true;
            var file_exceed_limit = '';
            var maxSize = 10 * 1024 * 1024; // 10MB in bytes

            form = $(form);

            var file_count = $('#wa_attachments')[0].files;
            var message_id = $("#edit_message_id").val();

            var count = 0;

            if(file_count.length > 0) {

                for (var i = 1; i <= file_count.length; i++) {
                    var temp_file = file_count[i - 1];

                    if (temp_file.size > maxSize) {
                        file_size_in_limit = false;
                        file_exceed_limit = temp_file.name;
                        break; // Exit the loop since at least one file is over the size limit
                    }
                }

                if(file_size_in_limit === true) {

                    for (var i = 1; i <= file_count.length; i++) {

                        let formData = new FormData();

                        var file = file_count[i - 1];
                        formData.append("file", file);
                        formData.append("message_id", message_id);
                        formData.append("count", count);

                        await $.ajax({
                            url: "../assets/custom/whatsapp/upload_file.php",
                            type: "POST",
                            data: formData,
                            processData: false,
                            contentType: false,
                            dataType: 'json',
                            success: function(response_2) {
                                if (response_2.success == true) {
                                    count++;
                                    nextID = response_2.nextID;
                                }
                            }
                        });
                    }

                    if (count !== 0) {
                        $.ajax({
                            type: "POST",
                            url: "../assets/custom/api_googlesheet/view_sheet.php",
                            data: form.serialize() + '&count=' + count + '&nextID=' + nextID,
                            dataType: 'json',
                            success: function(response) {
                                swal.fire({
                                    position: 'top-right',
                                    type: 'success',
                                    title: 'Queued Successfully!',
                                    showConfirmButton: false,
                                    timer: 1500
                                });

                                //Reset The Form
                                $('#whatsapp_form')[0].reset();
                                // manageArticleTable.reload();
                            }
                        });
                    } else {
                        swal.fire({
                            position: 'top-right',
                            type: 'error',
                            title: 'Error in uploading files!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                } else {
                    Alert(file_exceed_limit + ' - File size should not exceed 10MB!')
                }
            } else {
                $.ajax({
                    type: "POST",
                    url: "../assets/custom/api_googlesheet/view_sheet.php",
                    data: form.serialize() + '&count=' + count,
                    dataType: 'json',
                    success: function() {
                        swal.fire({
                            position: 'top-right',
                            type: 'success',
                            title: 'Queued Successfully!',
                            showConfirmButton: false,
                            timer: 1500
                        });

                        //Reset The Form
                        $('#whatsapp_form')[0].reset();
                        // manageArticleTable.reload();
                    }
                });
            }
            setTimeout(() => {
                $("#wa_queue_submit").attr("disabled", false);
            }, 2000)
            return false;
        }

        $('#whatsapp_form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
               
            },
            messages: {
                
            },

            invalidHandler: function(event, validator) {
                var alert = $('#add_product_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            errorPlacement: function(error, element) {
                var group = element.closest('.kt-input-icon');
                if (group.length) {
                    group.after(error.addClass('invalid-feedback'));
                } else {
                    element.after(error.addClass('invalid-feedback'));
                }
            },

            submitHandler: function(form) {
                ajaxAdd(form);
            }
        });

        $('#whatsapp_form input').keypress(function(e) {
            $('.alert').hide();
            $('.alert span').html("");
            if (e.which == 13) {
                if ($('#whatsapp_form').validate().form()) {
                    ajaxAdd($('#whatsapp_form')); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    // Public Functions
    return {
        // public functions
        init: function() {
            handleSyncStudents();
            handleSendWhatsapp();
        }
    };
}();

$('#wa_test_btn').on('click', async function(e) {
    e.preventDefault();
    
    var message = $('#wa_message').val();
    var mobile  = $('#wa_mobile_test').val();

    if(mobile == '') {
        alert('Invalid Mobile Number!');
    } else {

        $("#wa_test_btn").attr("disabled", true);

        var nextID = '';
        var file_size_in_limit = true;
        var file_exceed_limit = '';
        var maxSize = 10 * 1024 * 1024; // 10MB in bytes

        var file_count = $('#wa_attachments')[0].files;

        var count = 0;

        if(file_count.length > 0) {

            for (var i = 1; i <= file_count.length; i++) {
                var temp_file = file_count[i - 1];

                if (temp_file.size > maxSize) {
                    file_size_in_limit = false;
                    file_exceed_limit = temp_file.name;
                    break; // Exit the loop since at least one file is over the size limit
                }
            }

            if(file_size_in_limit === true) {

                for (var i = 1; i <= file_count.length; i++) {

                    let formData = new FormData();

                    var file = file_count[i - 1];
                    formData.append("file", file);
                    formData.append("count", count);

                    await $.ajax({
                        url: "../assets/custom/whatsapp/upload_file.php",
                        type: "POST",
                        data: formData,
                        processData: false,
                        contentType: false,
                        dataType: 'json',
                        success: function(response_2) {
                            if (response_2.success == true) {
                                count++;
                                nextID = response_2.nextID;
                            }
                        }
                    });
                }

                if (count !== 0) {
                    $.ajax({
                        type: "POST",
                        url: "../assets/custom/api_googlesheet/view_single_sheet.php",
                        data: {message, mobile, nextID, count},
                        dataType: 'json',
                        success: function(response) {
                            swal.fire({
                                position: 'top-right',
                                type: 'success',
                                title: 'Queued Successfully!',
                                showConfirmButton: false,
                                timer: 1500
                            });

                            //Reset The Form
                            // $('#whatsapp_form')[0].reset();
                            // manageArticleTable.reload();
                        }
                    });
                } else {
                    swal.fire({
                        position: 'top-right',
                        type: 'error',
                        title: 'Error in uploading files!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            } else {
                alert(file_exceed_limit + ' - File size should not exceed 10MB!')
            }
        } else {
            $.ajax({
                type: "POST",
                url: "../assets/custom/api_googlesheet/view_single_sheet.php",
                data: {message, mobile, count},
                dataType: 'json',
                success: function() {
                    swal.fire({
                        position: 'top-right',
                        type: 'success',
                        title: 'Queued Successfully!',
                        showConfirmButton: false,
                        timer: 1500
                    });

                    //Reset The Form
                    // $('#whatsapp_form')[0].reset();
                    // manageArticleTable.reload();
                }
            });
        }
        setTimeout(() => {
            $("#wa_test_btn").attr("disabled", false);
        }, 2000);
    }
})