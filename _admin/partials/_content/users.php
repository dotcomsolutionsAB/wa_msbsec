<!-- begin:: Content -->
<div class="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
	<div class="kt-portlet kt-portlet--mobile">
		<div class="kt-portlet__head kt-portlet__head--lg">
			<div class="kt-portlet__head-label">
				<span class="kt-portlet__head-icon">
				</span>
				<h3 class="kt-portlet__head-title">
					Users
				</h3>
			</div>
			<div class="kt-portlet__head-toolbar">
				<div class="kt-portlet__head-wrapper">
					<div class="dropdown dropdown-inline">
						<button type="button" class="btn btn-brand btn-icon-sm" data-toggle="modal" data-target="#kt_modal_user">
							<i class="flaticon2-plus"></i> Add New
						</button>
					</div>
				</div>
			</div>
		</div>
		<div class="kt-portlet__body">

			<!--begin: Search Form -->
			<div class="kt-form kt-form--label-right kt-margin-t-20 kt-margin-b-10">
				<div class="row align-items-center">
					<div class="col-xl-8 order-2 order-xl-1">
						<div class="row align-items-center">
							<div class="col-md-4 kt-margin-b-20-tablet-and-mobile">
								<div class="kt-input-icon kt-input-icon--left">
									<input type="text" class="form-control" placeholder="Search..." id="generalSearch">
									<span class="kt-input-icon__icon kt-input-icon__icon--left">
										<span><i class="la la-search"></i></span>
									</span>
								</div>
							</div>
						</div>
					</div>
					<div class="col-xl-4 order-1 order-xl-2 kt-align-right">
					</div>
				</div>
			</div>

			<!--end: Search Form -->
		</div>
		<div class="kt-portlet__body kt-portlet__body--fit">

			<!--begin: Datatable -->
			<div class="kt-datatable" id="users_table"></div>

			<!--end: Datatable -->
		</div>

		<!--begin::Users Modal-->
		<form class="kt-form kt-form--label-right" id="add_user" autocomplete="off">
			<div class="modal fade" id="kt_modal_user" tabindex="-1" role="dialog" aria-labelledby="addUserModal" aria-hidden="true">
				<div class="modal-dialog modal-xl" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" id="addUserModal" >Add New User</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							</button>
						</div>
						<div class="modal-body">
								<div class="kt-portlet__body">
									<div class="form-group row">
										<div class="col-lg-4">
											<label>Name:</label>
											<input type="text" class="form-control" placeholder="Enter Name..." id="name" name="name">
											<span class="form-text text-muted">Please enter name..</span>
										</div>
										<div class="col-lg-4">
											<label>Username:</label>
											<input type="text" class="form-control" placeholder="Enter username..." id="username" name="username">
											<span class="form-text text-muted">Please enter username..</span>
										</div>
										<div class="col-lg-4">
											<label>Password:</label>
											<input type="password" class="form-control" placeholder="Enter password..." id="password" name="password" autocomplete="new-password">
											<span class="form-text text-muted">Please enter password..</span>
										</div>
									</div>
									<div class="form-group row">
										<div class="col-lg-4">
											<label>Mobile:</label>
											<input type="text" class="form-control" placeholder="Enter Mobile..." id="mobile" name="mobile">
											<span class="form-text text-muted">Please enter mobile..</span>
										</div>
										<div class="col-lg-4">
											<label>Email:</label>
											<input type="text" class="form-control" placeholder="Enter Email..." id="email" name="email">
											<span class="form-text text-muted">Please enter email..</span>
										</div>
										<div class="col-lg-4">
											<label>User Type:</label>
											<select class="form-control kt-select2" id="userlevel" name="userlevel">
												<option value="sadmin_df56fdg">Admin</option>
												<option value="sales_HgdK5254SHdg">Sales</option>
												<option value="purchase_LK85SDhg6dfd">Purchase</option>
											</select>
											<span class="form-text text-muted">Please select usertype..</span>
										</div>
									</div>
								</div>
						</div>
						<div class="modal-footer">
							<button id="add_user_submit" type="submit" class="btn btn-primary">Save</button>
						</div>
					</div>
				</div>
			</div>
		</form>

		<!--end::Users Modal-->

		<!--begin::Edit Users Modal-->
		<form class="kt-form kt-form--label-right" id="am_edit_user" autocomplete="off">
			<div class="modal fade" id="kt_modal_e_user" tabindex="-1" role="dialog" aria-labelledby="editUserModal" aria-hidden="true">
				<div class="modal-dialog modal-xl" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" id="editUserModal" >Edit User</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							</button>
						</div>
						<div class="modal-body">
							<!--begin::Form-->
								<input type="text" id="edit_id" name="edit_id" style="display:none">

								<div class="kt-portlet__body">
									<div class="form-group row">
											<div class="col-lg-4">
												<label>Name:</label>
												<input type="text" class="form-control" placeholder="Enter Name..." id="edit_name" name="edit_name">
												<span class="form-text text-muted">Please enter name..</span>
											</div>
											<div class="col-lg-4">
												<label>Username:</label>
												<input type="text" class="form-control" placeholder="Enter username" id="edit_username" name="edit_username" readonly>
												<span class="form-text text-muted">Please enter username..</span>
											</div>
											<div class="col-lg-4">
												<label>Password:</label>
												<input type="password" class="form-control" placeholder="Enter password" id="edit_password" name="edit_password" autocomplete="new-password">
												<span class="form-text text-muted">Please enter password..</span>
											</div>
										</div>
										<div class="form-group row">
											<div class="col-lg-4">
												<label>Mobile:</label>
												<input type="text" class="form-control" placeholder="Enter Mobile..." id="edit_mobile" name="edit_mobile">
												<span class="form-text text-muted">Please enter mobile..</span>
											</div>
											<div class="col-lg-4">
												<label>Email:</label>
												<input type="text" class="form-control" placeholder="Enter Email..." id="edit_email" name="edit_email">
												<span class="form-text text-muted">Please enter email..</span>
											</div>
											<div class="col-lg-4">
												<label>User Type:</label>
												<select class="form-control kt-select2" id="edit_userlevel" name="edit_userlevel">
													<option value="sadmin_df56fdg">Admin</option>
													<option value="sales_HgdK5254SHdg">Sales</option>
													<option value="purchase_LK85SDhg6dfd">Purchase</option>	
												</select>
												<span class="form-text text-muted">Please select usertype..</span>
											</div>

										</div>
								</div>
							

							<!--end::Form-->
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
							<button id="edit_user_submit" type="submit" class="btn btn-primary">Update</button>
						</div>
					</div>
				</div>
			</div>
		</form>
		<!--end::Edit Users Modal-->

		<!--begin::Delete Users Modal-->
		<div class="modal fade" id="kt_modal_d_user" tabindex="-1" role="dialog" aria-labelledby="deleteUserModal" aria-hidden="true">
			<div class="modal-dialog modal-xl" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="deleteUserModal" >Delete User</h5>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						</button>
					</div>
					<div class="modal-body">
						<!--begin::Form-->
						<form class="kt-form kt-form--label-right">
							<div class="kt-portlet__body">
								Are you sure you want to delete this user ?
							</div>
						</form>

						<!--end::Form-->
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
						<button id="dcs_delete_user_submit" type="button" class="btn btn-primary">Delete</button>
					</div>
				</div>
			</div>
		</div>

		<!--end::Delete Users Modal-->
	</div>
</div>

<!-- end:: Content -->

