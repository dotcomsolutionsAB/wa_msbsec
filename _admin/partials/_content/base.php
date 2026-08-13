<!-- begin:: Content --> 
<div class="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">

	<!--Begin::Dashboard 1-->
		<!--begin::Portlet-->
		<div class="kt-portlet kt-portlet--mobile">
			<div class="kt-portlet__body kt-portlet__body--fit">
				<div class="kt-portlet__body">
					<!--begin: Search Form -->
					<div class="kt-form kt-form--label-right kt-margin-t-20 kt-margin-b-10">
						<div class="row align-items-center">
							<div class="col-xl-8 order-2 order-xl-1">
								<div class="row align-items-center">				
									<div class="col-md-3 kt-margin-b-20-tablet-and-mobile">
										<div class="kt-input-icon kt-input-icon--left">
											<input type="text" class="form-control" placeholder="Search By Name / Description..." id="generalSearch">
											<span class="kt-input-icon__icon kt-input-icon__icon--left">
												<span><i class="la la-search"></i></span>
											</span>
										</div>
									</div>
									<div class="col-md-3 kt-margin-b-20-tablet-and-mobile">
											<div class="kt-form__control">
												<select class="form-control bootstrap-select" id="kt_product_group">
												</select>
											</div>
									</div>
									<div class="col-md-3 kt-margin-b-20-tablet-and-mobile">
											<div class="kt-form__control">
												<select class="form-control bootstrap-select" id="kt_product_category">
												</select>
											</div>
									</div>
									<div class="col-md-3 kt-margin-b-20-tablet-and-mobile">
											<div class="kt-form__control">
												<select class="form-control bootstrap-select" id="kt_product_sub_category">
												</select>
											</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<!--end: Search Form -->
				</div>
				<!--begin: Datatable -->
				<div class="kt-datatable" id="whatsapp_queue_datatable"></div>
				<!--end: Datatable -->
			</div>
		</div>
		<!--end::Portlet-->
	<!--End::Dashboard 1-->
</div>
<!-- end:: Content -->

<form class="kt-form kt-form--label-right" id="add_purchase_bag">
	<div class="modal fade" id="kt_modal_add_purchase_bag" tabindex="-1" role="dialog" aria-labelledby="addPurchaseBagModal" aria-hidden="true">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="addPurchaseBagModal" >Add to Purchase Bag</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					</button>
				</div>
				<div class="modal-body">
					<div class="kt-portlet__body">
						<div class="form-group row">
	                        <div class="col-sm-6">
	                        	<div class="form-group">
	                                <label>Product Name</label>
	                                <input name="pb_product" id="pb_product" class="form-control" type="text">
	                            </div>											
	                        </div>
	                        <div class="col-sm-6">
	                            <div class="form-group">
			                            <label>Quantity</label>
	                                <input name="pb_quantity" id="pb_quantity" class="form-control" type="text">
	                                <span class="form-text text-muted">Please enter the the quantity required .</span>
	                            </div>
	                        </div>
	                    </div>
                    </div>
				</div>
				<div class="modal-footer">
					<button id="add_pb_submit" type="submit" class="btn btn-primary">Submit </button>
				</div>
			</div>
		</div>
	</div>
</form>