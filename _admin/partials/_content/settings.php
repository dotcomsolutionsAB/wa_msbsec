<?php

$documents = array("enquiry", "quotation", "sales_order", "sales_invoice", "e-commerce", "receipt", "purchase_order", "payment", "secondary");
$print_name = array("Enquiry", "Quotation", "Sales Order", "Sales Invoice", "E-Commerce", "Receipt", "Purchase Order", "Payment", "Secondary");

$len = sizeof($documents);

?>

<!-- begin:: Content -->
<div class="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">

	<!--Begin::Dashboard 1-->
	<div class="row">
		<div class="col-lg-6">	
			<!--begin::Portlet-->
	   		<div class="kt-portlet kt-portlet--mobile">
	   			<form class="kt-form kt-form--label-right" id="whatsapp_credentials">
					<div class="kt-portlet__head">
						<div class="kt-portlet__head-label">
							<h3 class="kt-portlet__head-title">
								Whatsapp Credentials <small>Meta Cloud API</small>
							</h3>
						</div>
					</div>
					<div class="kt-portlet__body">
						<?php
							
								$sql_fetch = "SELECT * FROM whatsapp LIMIT 1";
								$query_fetch = $db->query($sql_fetch);
								$row_fetch = $query_fetch->fetch_assoc();

								$access_token    = isset($row_fetch['access_token']) ? $row_fetch['access_token'] : '';
								$phone_number_id = isset($row_fetch['phone_number_id']) ? $row_fetch['phone_number_id'] : '';
								$waba_id         = isset($row_fetch['waba_id']) ? $row_fetch['waba_id'] : '';
								$api_version     = isset($row_fetch['api_version']) && $row_fetch['api_version'] !== '' ? $row_fetch['api_version'] : 'v22.0';
								$base_url        = isset($row_fetch['url']) && $row_fetch['url'] !== '' ? $row_fetch['url'] : 'https://graph.facebook.com';

								
						?>
						<div class="row" style="margin-top:5px;">
							<div class="col-sm-3">Access Token</div>
							<div class="col-sm-9">
								<input class="form-control" type="password" value="<?php echo htmlspecialchars($access_token); ?>" id="whatsapp_access_token" name="whatsapp_access_token" autocomplete="off">
								<span class="form-text text-muted">Meta permanent System User token (Bearer).</span>
							</div>
						</div>
						<div class="row" style="margin-top:5px;">
							<div class="col-sm-3">Phone Number ID</div>
							<div class="col-sm-9">
								<input class="form-control" type="text" value="<?php echo htmlspecialchars($phone_number_id); ?>" id="whatsapp_phone_number_id" name="whatsapp_phone_number_id">
							</div>
						</div>
						<div class="row" style="margin-top:5px;">
							<div class="col-sm-3">WABA ID</div>
							<div class="col-sm-9">
								<input class="form-control" type="text" value="<?php echo htmlspecialchars($waba_id); ?>" id="whatsapp_waba_id" name="whatsapp_waba_id">
								<span class="form-text text-muted">WhatsApp Business Account ID (for templates).</span>
							</div>
						</div>
						<div class="row" style="margin-top:5px;">
							<div class="col-sm-3">API Version</div>
							<div class="col-sm-9">
								<input class="form-control" type="text" value="<?php echo htmlspecialchars($api_version); ?>" id="whatsapp_api_version" name="whatsapp_api_version" placeholder="v22.0">
							</div>
						</div>
						<div class="row" style="margin-top:5px;">
							<div class="col-sm-3">Graph Base URL</div>
							<div class="col-sm-9">
								<input class="form-control" type="text" value="<?php echo htmlspecialchars($base_url); ?>" id="whatsapp_base_url" name="whatsapp_base_url">
							</div>
						</div>
					</div>
					<div class="kt-portlet__foot">
						<div class="kt-form__actions">
							<div class="row">
								<div class="col-lg-9 col-xl-9">
								</div>
								<div class="col-lg-3 col-xl-3" style="float:right;">
									<button type="Submit" class="btn btn-success" id="save_whatsapp_credentials">Save Changes</button>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>	
			<!--end::Portlet-->
		</div>
	</div>

<!-- end:: Content -->
