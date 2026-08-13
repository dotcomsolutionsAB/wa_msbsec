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

$classes = [];
$classRes = @$db->query("SELECT DISTINCT `class` FROM `students` WHERE `class` <> '' ORDER BY `class` ASC");
if ($classRes) {
	while ($c = $classRes->fetch_assoc()) {
		$classes[] = $c['class'];
	}
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
							<div class="col-md-3">
								<select class="form-control" id="students_class_filter">
									<option value="">All Classes</option>
									<?php foreach ($classes as $className): ?>
										<option value="<?php echo htmlspecialchars($className); ?>"><?php echo htmlspecialchars($className); ?></option>
									<?php endforeach; ?>
								</select>
							</div>
							<div class="col-md-5 text-right">
								<span class="kt-margin-r-10" id="students_selected_label">0 selected</span>
								<button type="button" class="btn btn-sm btn-brand" id="students_send_wa_btn" disabled>
									Send WA
								</button>
							</div>
						</div>
					</div>

					<div id="wa_test_panel" class="kt-margin-b-15" style="display:none;">
						<div class="alert alert-secondary mb-0">
							<div class="row align-items-end">
								<div class="col-md-3">
									<label>Parent</label>
									<select class="form-control" id="wa_test_parent_role">
										<option value="father">Father</option>
										<option value="mother">Mother</option>
									</select>
								</div>
								<div class="col-md-4">
									<label>Phone (test)</label>
									<input type="text" class="form-control" id="wa_test_phone" placeholder="91XXXXXXXXXX">
								</div>
								<div class="col-md-3">
									<label>&nbsp;</label>
									<button type="button" class="btn btn-warning btn-block" id="wa_test_send_btn">
										Send Test Message
									</button>
								</div>
								<div class="col-md-2">
									<small class="form-text text-muted" id="wa_test_student_label"></small>
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
