<?php
	$page = $_REQUEST['page'];
?>
<!-- begin:: Page -->

<?php include("partials/_header/base-mobile.php"); ?>		

<div class="kt-grid kt-grid--hor kt-grid--root">
	<div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver kt-page">

		<?php include("partials/_aside/base.php"); ?>		
		<div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-wrapper" id="kt_wrapper">

			<?php include("partials/_header/base.php"); ?>		
			<div class="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">

				<?php include("partials/_subheader/subheader-v1.php"); ?>		

				<?php 
				if($page == 'index' || $page == '')
					include("partials/_content/base.php"); 
				else
					include("partials/_content/".$page.".php");
				?>	

				<!--begin::Product Modal-->
				<form class="kt-form kt-form--label-right" id="add_product">
					<div class="modal fade" id="kt_modal_product" tabindex="-1" role="dialog" aria-labelledby="addProductModal" aria-hidden="true">
						<div class="modal-dialog modal-xl" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="addProductModal">Add New Product</h5>
									<button type="button" class="close" data-dismiss="modal" aria-label="Close">
									</button>
								</div>
								<div class="modal-body">
									<!--begin::Form-->
										<div class="kt-portlet__body">
											<div class="form-group form-group-last kt-hide">
												<div class="alert alert-danger" role="alert" id="add_product_msg">
													<div class="alert-icon"><i class="flaticon-warning"></i></div>
													<div class="alert-text">
														Oh snap! Change a few things up and try submitting again.
													</div>
													<div class="alert-close">
														<button type="button" class="close" data-dismiss="alert" aria-label="Close">
															<span aria-hidden="true"><i class="la la-close"></i></span>
														</button>
													</div>
												</div>
											</div>
											<div class="form-group row">
												<div class="col-lg-6">
													<label class="">Product Name:</label>
													<div class="kt-input-icon">
														<select class="form-control kt-select2" id="product_name" name="product_name"></select>
													</div>
													<span class="form-text text-muted">Please enter name of the product..</span>
												</div>
												<div class="col-lg-6">
													<label class="">Group Name:</label>
													<div class="kt-input-icon">
														<select class="form-control kt-select2" id="product_group_name" name="product_group_name"></select>
													</div>
													<span class="form-text text-muted">Please enter group name of the product..</span>
												</div>
											</div>
											<div class="form-group row">
												<div class="col-lg-12">
													<label>Description</label>
													<div class="kt-input-icon">
														<input type="text"  class="form-control" placeholder="Product Description" id="product_description" name="product_description">
													</div>
													<span class="form-text text-muted">Please enter description of the product..</span>
												</div>
											</div>
											<div class="form-group row">
												<div class="col-lg-4">
													<label class="">Product Category:</label>
													<div class="kt-input-icon">
														<select class="form-control kt-select2" id="product_category" name="product_category"></select>
													</div>
													<span class="form-text text-muted">Please select the appropriate category..</span>
												</div>
												<div class="col-lg-4">
													<label class="">Sub Category:</label>
													<div class="kt-input-icon">
														<select class="form-control kt-select2" id="product_sub_category" name="product_sub_category"></select>
													</div>
													<span class="form-text text-muted">Please select the appropriate sub category..</span>
												</div>
												<div class="col-lg-4">
													<label class="">Opening Stock</label>
													<div class="kt-input-icon">
														<input type="text" class="form-control" placeholder="Enter Opening Stock"  id="product_opening_stock" name="product_opening_stock">
													</div>
													<span class="form-text text-muted">Please enter opening stock..</span>
												</div>
											</div>
											<div class="form-group row">
												<div class="col-lg-3">
													<label>Unit:</label><br/>
													<div class="kt-input-icon">
														<select class="form-control kt-select2" id="product_unit" name="product_unit">
														</select>
													</div>
													<span class="form-text text-muted">Please select the unit..</span>
												</div>
												<div class="col-lg-3">
													<label class="">Rate:</label>
													<div class="kt-input-icon">
														<input type="text" class="form-control" placeholder="Enter service rate"  id="product_rate" name="product_rate">
													</div>
													<span class="form-text text-muted">Please enter service rate..</span>
												</div>
												<div class="col-lg-3">
													<label>Tax:</label><br/>
													<div class="kt-input-icon">
														<select class="form-control kt-select2" id="product_tax" name="product_tax">
															<option></option>
															<option value='5'>5%</option>
															<option value='12'>12%</option>
															<option value='18'>18%</option>
															<option value='28'>28%</option>
														</select>
													</div>
													<span class="form-text text-muted">Please select tax category..</span>
												</div>
												<div class="col-lg-3">
													<label class="">HSN:</label>
													<div class="kt-input-icon">
														<input type="text" class="form-control" placeholder="Enter HSN code" id="product_hsn" name="product_hsn">
													</div>
													<span class="form-text text-muted">Please hsn code..</span>
												</div>
											</div>
										</div>
									<!--end::Form-->
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
									<button id="add_product_submit" type="submit" class="btn btn-primary">Save</button>
								</div>
							</div>
						</div>
					</div>
				</form>

				<!--end::Product Modal-->

				<!--begin::Client Modal-->
				<form class="kt-form kt-form--label-right" id="dcs_add_client">
					<div class="modal fade" id="kt_modal_client" tabindex="-1" role="dialog" aria-labelledby="addClientModal" aria-hidden="true">
						<div class="modal-dialog modal-xl" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="addClientModal">Add New Client</h5>
									<button type="button" class="close" data-dismiss="modal" aria-label="Close">
									</button>
								</div>
								<div class="modal-body">
									<!--begin::Form-->
										<div class="kt-portlet__body">
											<div class="form-group row">
												<div class="col-lg-4">
													<label>Client Name:</label>
													<div class="kt-input-icon">
														<input type="text" class="form-control" placeholder="Enter Client Name" id="client_name" name="client_name">
													</div>
													<span class="form-text text-muted">Please enter name of the client..</span>
												</div>
												<div class="col-lg-4">
													<label>Printed Name:</label>
													<div class="kt-input-icon">
														<input type="text" class="form-control" placeholder="Enter Print Name" id="client_print_name" name="client_print_name">
													</div>
													<span class="form-text text-muted">Please enter name to be printed..</span>
												</div>
												<div class="col-lg-4">
													<label class="">Client Category:</label><br/>
													<div class="kt-input-icon">
														<select class="form-control kt-select2" id="client_category" name="client_category">
															<option></option>
														</select>
													</div>
													<span class="form-text text-muted">Please select the appropriate category..</span>
												</div>
											</div>
											<div class="form-group row">
												<div class="col-lg-3">
													<label>Address Line 1:</label>
													<input type="text" class="form-control" placeholder="Enter Address Line 1"  id="client_add_1" name="client_add_1">
												</div>
												<div class="col-lg-3">
													<label>Address Line 2:</label>
													<div class="kt-input-icon">
														<input type="text" class="form-control" placeholder="Enter Address Line 2"  id="client_add_2" name="client_add_2">
													</div>
												</div>
												<div class="col-lg-3">
													<label>City:</label>
													<div class="kt-input-icon">
														<input type="text" class="form-control" placeholder="Enter City"  id="client_city" name="client_city">
													</div>
												</div>
												<div class="col-lg-3">
													<label>Pincode:</label>
													<div class="kt-input-icon">
														<input type="text" class="form-control" placeholder="Enter Pincode"  id="client_pincode" name="client_pincode">
													</div>
												</div>
											</div>
											<div class="form-group row">
												<div class="col-lg-3">
													<label>GSTIN:</label>
													<div class="kt-input-icon">
														<input type="text" class="form-control" placeholder="Enter GSTIN"  id="client_gstin" name="client_gstin" maxlength="15">
													</div>
													<!-- <span class="form-text text-muted">Please enter GSTIN of the client..</span> -->
												</div>
												<div class="col-lg-3">
													<label>GSTIN Type:</label>
													<div class="kt-input-icon">
														<select class="form-control kt-select2 client_gstin_type-select2" id="client_gstin_type" name="client_gstin_type">
															<option value="UN-REGISTERED">Un Registered</option>
														<option value="REGISTERED">Registered</option>
														<option value="COMPOSITE">Composite</option>
														</select>
													</div>
												</div>
												<div class="col-lg-3">
													<label>State:</label>
													<div class="kt-input-icon">
														<select class="form-control kt-select2 client_state-select2" id="client_state" name="client_state">
														</select>
													</div>
												</div>
												<div class="col-lg-3">
													<label>Country:</label>
													<div class="kt-input-icon">
														<input type="text" class="form-control" placeholder="Enter Country"  id="client_country" name="client_country" value="INDIA">
													</div>
												</div>
											</div>
											<div class="form-group row">
												<div class="col-md-12">
													<label>Contact Persons:</label>
												</div>
												<div id="kt_repeater_client" class="col-lg-12">
													<div class="form-group form-group-last row" id="kt_repeater_1">
														<div data-repeater-list="client" class="col-lg-12">
															<div data-repeater-item class="form-group row align-items-center">
																<div class="col-md-3">
																		<input placeholder="Name" name="client_person" id="client_person" class="form-control" type="text">
																</div>
																<div class="col-md-3">
																		<input placeholder="Designation" name="client_designation" id="client_designation" class="form-control" type="text">
																</div>
																<div class="col-md-2">
																		<input placeholder="Mobile" name="client_mobile" id="client_mobile" class="form-control" type="text">
																</div>
																<div class="col-md-3">
																		<input placeholder="Email" name="client_email" id="client_email" class="form-control" type="text">
																</div>
																<div class="col-md-1">
																	<a href="javascript:;" data-repeater-delete="" class="btn-sm btn btn-label-danger btn-bold">
																		<i class="la la-trash-o"></i>
																	</a>
																</div>
															</div>
														</div>
													</div>
													<div class="form-group form-group-last row">
														<div class="col-lg-4">
															<a href="javascript:;" data-repeater-create="add_client_contact" class="btn btn-bold btn-sm btn-label-brand">
																<i class="la la-plus"></i> Add
															</a>
														</div>
													</div>
												</div>
											</div>
											
											<div class="form-group row col-lg-12">
												<div class="col-md-12">
													<label>Bank Details:</label>
												</div>
												<div class="col-md-3">
													<label>Name:</label>
													<div class="kt-input-icon">
														<input placeholder="Enter Account Name" name="bank_client" id="bank_client" class="form-control" type="text">
													</div>
												</div>
												<div class="col-md-3">
													<label>Bank:</label>
													<div class="kt-input-icon">
														<input placeholder="Enter Bank Name" name="bank_name" id="bank_name" class="form-control" type="text">
													</div>
												</div>
												<div class="col-md-3">
													<label>Account Number:</label>
													<div class="kt-input-icon">
														<input placeholder="Enter Account Number" name="bank_account" id="bank_account" class="form-control" type="text">
													</div>
												</div>
												<div class="col-md-3">
													<label>IFSC Code:</label>
													<div class="kt-input-icon">
														<input placeholder="Enter IFSC Code" name="bank_ifsc" id="bank_ifsc" class="form-control" type="text">
													</div>
												</div>
											</div>
										</div>
									<!--end::Form-->
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
									<button id="dcs_add_client_submit" type="submit" class="btn btn-primary">Save</button>
								</div>
							</div>
						</div>
					</div>
				</form>
				<!--end::Client Modal-->

				<!--begin::transporter Modal-->
				<form class="kt-form kt-form--label-right" id="dcs_add_transporter">
					<div class="modal fade" id="kt_modal_transporter" tabindex="-1" role="dialog" aria-labelledby="addtransporterModal" aria-hidden="true">
						<div class="modal-dialog modal-xl" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="addtransporterModal">Add New transporter</h5>
									<button type="button" class="close" data-dismiss="modal" aria-label="Close">
									</button>
								</div>
								<div class="modal-body">
									<!--begin::Form-->
										<div class="kt-portlet__body">
											<div class="form-group row">
												<div class="col-lg-4">
													<label>Transporter Name:</label>
													<div class="kt-input-icon">
														<input type="text" class="form-control" placeholder="Transporter Name" id="transporter_name" name="transporter_name">
													</div>
												</div>
												<div class="col-lg-4">
													<label>Transporter Mobile:</label>
													<div class="kt-input-icon">
														<input type="text" class="form-control" placeholder="Transporter Mobile" id="transporter_mobile" name="transporter_mobile">
													</div>
												</div>
												<div class="col-lg-4">
													<label>Transporter Email:</label>
													<div class="kt-input-icon">
														<input type="text" class="form-control" placeholder="Transporter Email" id="transporter_email" name="transporter_email">
													</div>
												</div>
											</div>
											<div class="form-group row">
												<div class="col-lg-3">
													<label>Address Line 1:</label>
													<input type="text" class="form-control" placeholder="Enter Address Line 1"  id="transporter_add_1" name="transporter_add_1">
												</div>
												<div class="col-lg-3">
													<label>Address Line 2:</label>
													<div class="kt-input-icon">
														<input type="text" class="form-control" placeholder="Enter Address Line 2"  id="transporter_add_2" name="transporter_add_2">
													</div>
												</div>
												<div class="col-lg-3">
													<label>City:</label>
													<div class="kt-input-icon">
														<input type="text" class="form-control" placeholder="Enter City"  id="transporter_city" name="transporter_city">
													</div>
												</div>
												<div class="col-lg-3">
													<label>Pincode:</label>
													<div class="kt-input-icon">
														<input type="text" class="form-control" placeholder="Enter Pincode"  id="transporter_pincode" name="transporter_pincode">
													</div>
												</div>
											</div>
											<div class="form-group row">
												<div class="col-lg-3">
													<label>GSTIN:</label>
													<div class="kt-input-icon">
														<input type="text" class="form-control" placeholder="Enter GSTIN"  id="transporter_gstin" name="transporter_gstin" maxlength="15">
													</div>
													<!-- <span class="form-text text-muted">Please enter GSTIN of the transporter..</span> -->
												</div>
												<div class="col-lg-3">
													<label>State:</label>
													<div class="kt-input-icon">
														<select class="form-control kt-select2 transporter_state-select2" id="transporter_state" name="transporter_state">
														</select>
													</div>
												</div>
												<div class="col-lg-3">
													<label>Country:</label>
													<div class="kt-input-icon">
														<input type="text" class="form-control" placeholder="Enter Country"  id="transporter_country" name="transporter_country" value="INDIA">
													</div>
												</div>
											</div>
										</div>
									<!--end::Form-->
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
									<button id="dcs_add_transporter_submit" type="submit" class="btn btn-primary">Save</button>
								</div>
							</div>
						</div>
					</div>
				</form>
				<!--end::transporter Modal-->

				<!--begin::Supplier Modal-->
				<form class="kt-form kt-form--label-right" id="dcs_add_supplier">
					<div class="modal fade" id="kt_modal_supplier" tabindex="-1" role="dialog" aria-labelledby="addSupplierModal" aria-hidden="true">
						<div class="modal-dialog modal-xl" role="document">
							<div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="addSupplierModal">Add New Supplier</h5>
									<button type="button" class="close" data-dismiss="modal" aria-label="Close">
									</button>
								</div>
								<div class="modal-body">
									<!--begin::Form-->
										<div class="kt-portlet__body">
											<div class="form-group row">
												<div class="col-lg-4">
													<label>Supplier Name:</label>
													<div class="kt-input-icon">
														<input type="text" class="form-control" placeholder="Enter Supplier Name" id="supplier_name" name="supplier_name">
													</div>
													<span class="form-text text-muted">Please enter name of the supplier..</span>
												</div>
												<div class="col-lg-4">
													<label>Printed Name:</label>
													<div class="kt-input-icon">
														<input type="text" class="form-control" placeholder="Enter Print Name" id="supplier_print_name" name="supplier_print_name">
													</div>
													<span class="form-text text-muted">Please enter name to be printed..</span>
												</div>
												<div class="col-lg-4">
													<label class="">Supplier Category:</label><br/>
													<div class="kt-input-icon">
														<select class="form-control kt-select2" id="supplier_category" name="supplier_category">
															<option></option>
														</select>
													</div>
													<span class="form-text text-muted">Please select the appropriate category..</span>
												</div>
											</div>
											<div class="form-group row">
												<div class="col-lg-3">
													<label>Address Line 1:</label>
													<input type="text" class="form-control" placeholder="Enter Address Line 1"  id="supplier_add_1" name="supplier_add_1">
												</div>
												<div class="col-lg-3">
													<label>Address Line 2:</label>
													<div class="kt-input-icon">
														<input type="text" class="form-control" placeholder="Enter Address Line 2"  id="supplier_add_2" name="supplier_add_2">
													</div>
												</div>
												<div class="col-lg-3">
													<label>City:</label>
													<div class="kt-input-icon">
														<input type="text" class="form-control" placeholder="Enter City"  id="supplier_city" name="supplier_city">
													</div>
												</div>
												<div class="col-lg-3">
													<label>Pincode:</label>
													<div class="kt-input-icon">
														<input type="text" class="form-control" placeholder="Enter Pincode"  id="supplier_pincode" name="supplier_pincode">
													</div>
												</div>
											</div>
											<div class="form-group row">
												<div class="col-lg-3">
													<label>GSTIN:</label>
													<div class="kt-input-icon">
														<input type="text" class="form-control" placeholder="Enter GSTIN"  id="supplier_gstin" name="supplier_gstin" maxlength="15">
													</div>
													<!-- <span class="form-text text-muted">Please enter GSTIN of the client..</span> -->
												</div>
												<div class="col-lg-3">
													<label>GSTIN Type:</label>
													<div class="kt-input-icon">
														<select class="form-control kt-select2 supplier_gstin_type-select2" id="supplier_gstin_type" name="supplier_gstin_type">
															<option value="UN-REGISTERED">Un Registered</option>
															<option value="REGISTERED">Registered</option>
															<option value="COMPOSITE">Composite</option>
														</select>
													</div>
												</div>
												<div class="col-lg-3">
													<label>State:</label>
													<div class="kt-input-icon">
														<select class="form-control kt-select2 supplier_state-select2" id="supplier_state" name="supplier_state">
														</select>
													</div>
												</div>
												<div class="col-lg-3">
													<label>Country:</label>
													<div class="kt-input-icon">
														<input type="text" class="form-control" placeholder="Enter Country"  id="supplier_country" name="supplier_country" value="INDIA">
													</div>
												</div>
											</div>
											<div class="form-group row">
												<div class="col-md-12">
													<label>Contact Persons:</label>
												</div>
												<div id="kt_repeater_supplier" class="col-lg-12">
													<div class="form-group form-group-last row" id="kt_repeater_1">
														<div data-repeater-list="supplier" class="col-lg-12">
															<div data-repeater-item class="form-group row align-items-center">
																<div class="col-md-3">
																		<input placeholder="Name" name="supplier_person" id="supplier_person" class="form-control" type="text">
																</div>
																<div class="col-md-3">
																		<input placeholder="Designation" name="supplier_designation" id="supplier_designation" class="form-control" type="text">
																</div>
																<div class="col-md-2">
																		<input placeholder="Mobile" name="supplier_mobile" id="supplier_mobile" class="form-control" type="text">
																</div>
																<div class="col-md-3">
																		<input placeholder="Email" name="supplier_email" id="supplier_email" class="form-control" type="text">
																</div>
																<div class="col-md-1">
																	<a href="javascript:;" data-repeater-delete="" class="btn-sm btn btn-label-danger btn-bold">
																		<i class="la la-trash-o"></i>
																	</a>
																</div>
															</div>
														</div>
													</div>
													<div class="form-group form-group-last row">
														<div class="col-lg-4">
															<a href="javascript:;" data-repeater-create="add_supplier_contact" class="btn btn-bold btn-sm btn-label-brand">
																<i class="la la-plus"></i> Add
															</a>
														</div>
													</div>
												</div>
											</div>
											
											<div class="form-group row col-lg-12">
												<div class="col-md-12">
													<label>Bank Details:</label>
												</div>
												<div class="col-md-3">
													<label>Name:</label>
													<div class="kt-input-icon">
														<input placeholder="Enter Account Name" name="bank_supplier" id="bank_supplier" class="form-control" type="text">
													</div>
												</div>
												<div class="col-md-3">
													<label>Bank:</label>
													<div class="kt-input-icon">
														<input placeholder="Enter Bank Name" name="bank_name" id="bank_name" class="form-control" type="text">
													</div>
												</div>
												<div class="col-md-3">
													<label>Account Number:</label>
													<div class="kt-input-icon">
														<input placeholder="Enter Account Number" name="bank_account" id="bank_account" class="form-control" type="text">
													</div>
												</div>
												<div class="col-md-3">
													<label>IFSC Code:</label>
													<div class="kt-input-icon">
														<input placeholder="Enter IFSC Code" name="bank_ifsc" id="bank_ifsc" class="form-control" type="text">
													</div>
												</div>
											</div>
										</div>
									<!--end::Form-->
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
									<button id="dcs_add_supplier_submit" type="submit" class="btn btn-primary">Save</button>
								</div>
							</div>
						</div>
					</div>
				</form>


				<!--end::Supplier Modal-->

			</div>

			<?php include("partials/_footer/base.php"); ?>		
		</div>
	</div>
</div>

<!-- end:: Page -->

<?php //include("partials/_quick-panel.php"); ?>		
<?php include("partials/_scrolltop.php"); ?>		
<?php include("partials/_toolbar.php"); ?>		
<?php //include("partials/_demo-panel.php"); ?>		
<?php //include("partials/_chat.php"); ?>	