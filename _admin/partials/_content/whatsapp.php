<?php

require_once "../assets/custom/connect.php";

$total = 0;
$syncedAt = '';
$res = @$db->query("SELECT COUNT(*) AS total, MAX(synced_at) AS synced_at FROM `students`");
if ($res) {
	$row = $res->fetch_assoc();
	$total = (int) $row['total'];
	$syncedAt = $row['synced_at'] ? $row['synced_at'] : '';
}

?>

<!-- begin:: Content -->
<div class="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
	<div class="row">
		<div class="col-lg-12">
			<div class="kt-portlet kt-portlet--mobile">
				<div class="kt-portlet__head">
					<div class="kt-portlet__head-label">
						<h3 class="kt-portlet__head-title">
							Students
							<small id="students_count_label"><?php echo $total; ?> synced<?php echo $syncedAt !== '' ? ' · Last sync ' . htmlspecialchars($syncedAt) : ''; ?></small>
						</h3>
					</div>
					<div class="kt-portlet__head-toolbar">
						<a href="https://docs.google.com/spreadsheets/d/12rnO0rPpVU-6v_RUhHs2auTtqeGEKEcC8AKiyD_dX7Y/edit#gid=0" target="_blank" class="btn btn-sm btn-secondary kt-margin-r-10">
							Open Google Sheet
						</a>
						<button type="button" class="btn btn-sm btn-success" id="students_sync_btn">
							Sync from Google Sheet
						</button>
					</div>
				</div>
				<div class="kt-portlet__body">
					<div class="kt-form kt-form--label-right kt-margin-b-10">
						<div class="row align-items-center">
							<div class="col-md-4">
								<div class="kt-input-icon kt-input-icon--left">
									<input type="text" class="form-control" placeholder="Search name / ITS / mobile / class..." id="generalSearch">
									<span class="kt-input-icon__icon kt-input-icon__icon--left">
										<span><i class="la la-search"></i></span>
									</span>
								</div>
							</div>
						</div>
					</div>
					<div class="kt-datatable" id="students_datatable"></div>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- end:: Content -->
