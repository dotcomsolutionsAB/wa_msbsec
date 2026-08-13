<?php
	$page = $_REQUEST['page'];
	$page_1 = str_replace('_',' ',$page);
?>


<!-- begin:: Subheader -->
<div class="kt-subheader   kt-grid__item" id="kt_subheader">
	<div class="kt-container  kt-container--fluid ">
		<div class="kt-subheader__main">
			<h3 class="kt-subheader__title">
				<?php 
				if($page_1 == "index" || $page_1 =='')
					echo "Dashboard";
				else
					echo ucwords($page_1);

				?> </h3>
				<span class="kt-subheader__separator kt-subheader__separator--v"></span>
				<div class="kt-subheader__group kt-hidden" id="kt_subheader_group_actions">
					<div class="kt-subheader__desc"><span id="kt_subheader_group_selected_rows"></span> Selected:</div>
					<div class="btn-toolbar kt-margin-l-20">
						<div class="btn-toolbar kt-margin-l-20">
							<button class="btn btn-label-success btn-bold btn-sm btn-icon-h" id="kt_subheader_group_actions_product_excel">
								Download Excel
							</button>
						</div>
					</div>
				</div>
				<div class="kt-subheader__group kt-hidden" id="kt_subheader_group_actions_purchase_order">
					<div class="kt-subheader__desc"><span id="kt_subheader_group_selected_rows_PO"></span> Selected:</div>
					<div class="btn-toolbar kt-margin-l-20">
						<div class="btn-toolbar kt-margin-l-20">
							<button class="btn btn-label-success btn-bold btn-sm btn-icon-h" id="kt_subheader_group_actions_bag_po">
								Add to Purchase Order
							</button>
							<button class="btn btn-label-danger btn-bold btn-sm btn-icon-h" id="kt_subheader_group_actions_bag_delete">
								Delete
							</button>
						</div>
					</div>
				</div>
		</div>
	</div>
</div>

<!-- end:: Subheader -->