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
								Whatsapp Credentials <small>Woonotif</small>
							</h3>
						</div>
					</div>
					<div class="kt-portlet__body">
						<?php
							
								$sql_fetch = "SELECT * FROM whatsapp";
								$query_fetch = $db->query($sql_fetch);
								$row_fetch = $query_fetch->fetch_assoc();

								$token = $row_fetch['token'];
								$instance_id = $row_fetch['instance_id'];
								$base_url = $row_fetch['url'];
								$queue_status = $row_fetch['queue_status'];
								$frequency = $row_fetch['frequency'];
								$start_time = $row_fetch['start_time'];
								$end_time = $row_fetch['end_time'];

								$p_status = $queue_status == '0' ? "selected" : "";
								$e_status = $queue_status == '1' ? "selected" : "";



								
						?>
						<div class="row" style="margin-top:5px;">
							<div class="col-sm-3">Token</div>
							<div class="col-sm-9">
								<input class="form-control" type="text" value="<?php echo $token; ?>" id="whatsapp_token" name="whatsapp_token">
							</div>
						</div>
						<div class="row" style="margin-top:5px;">
							<div class="col-sm-3">Instance Id</div>
							<div class="col-sm-9">
								<input class="form-control" type="text" value="<?php echo $instance_id; ?>" id="whatsapp_instance_id" name="whatsapp_instance_id">
							</div>
						</div>
						<div class="row" style="margin-top:5px;">
							<div class="col-sm-3">Base URL</div>
							<div class="col-sm-9">
								<input class="form-control" type="text" value="<?php echo $base_url; ?>" id="whatsapp_base_url" name="whatsapp_base_url">
							</div>
						</div>
						<div class="row" style="margin-top:5px;">
							<div class="col-sm-3">Queue Status</div>
							<div class="col-sm-9">
								<select class="form-control bootstrap-select" id="whatsapp_status" name="whatsapp_status">
									<option value="0" <?php echo $p_status; ?>>Pause Queue</option>
									<option value="1" <?php echo $e_status; ?>>Enable Queue</option>
								</select>
							</div>
						</div>
						<div class="row" style="margin-top:5px;">
							<div class="col-sm-3">Frequency</div>
							<div class="col-sm-9">
								<input class="form-control" type="text" value="<?php echo $frequency; ?>" id="whatsapp_frequency" name="whatsapp_frequency">
							</div>
						</div>
						<div class="row" style="margin-top:5px;">
							<div class="col-sm-3">Queue Start Time</div>
							<div class="col-sm-9">
								<input class="form-control" type="time" value="<?php echo $start_time; ?>" id="whatsapp_start_time" name="whatsapp_start_time">
							</div>
						</div>
						<div class="row" style="margin-top:5px;">
							<div class="col-sm-3">Queue End Time</div>
							<div class="col-sm-9">
								<input class="form-control" type="time" value="<?php echo $end_time; ?>" id="whatsapp_end_time" name="whatsapp_end_time">
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