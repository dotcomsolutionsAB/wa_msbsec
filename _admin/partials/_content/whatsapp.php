<?php

require_once "../assets/custom/connect.php";

$sql = "SELECT COUNT(*) as total FROM `wa_messages`";
$query = $db->query($sql);
$row = $query->fetch_assoc();

$total = $row['total'];

?>

<!-- begin:: Content -->
<div class="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
	<div class="row">
		<div class="col-lg-4">
            <div class="kt-portlet kt-iconbox kt-iconbox--animate">
                <div class="kt-portlet__body">
                    <div class="kt-iconbox__body">
                        <div class="kt-iconbox__icon">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                    <rect x="0" y="0" width="24" height="24" />
                                    <path d="M2.56066017,10.6819805 L4.68198052,8.56066017 C5.26776695,7.97487373 6.21751442,7.97487373 6.80330086,8.56066017 L8.9246212,10.6819805 C9.51040764,11.267767 9.51040764,12.2175144 8.9246212,12.8033009 L6.80330086,14.9246212 C6.21751442,15.5104076 5.26776695,15.5104076 4.68198052,14.9246212 L2.56066017,12.8033009 C1.97487373,12.2175144 1.97487373,11.267767 2.56066017,10.6819805 Z M14.5606602,10.6819805 L16.6819805,8.56066017 C17.267767,7.97487373 18.2175144,7.97487373 18.8033009,8.56066017 L20.9246212,10.6819805 C21.5104076,11.267767 21.5104076,12.2175144 20.9246212,12.8033009 L18.8033009,14.9246212 C18.2175144,15.5104076 17.267767,15.5104076 16.6819805,14.9246212 L14.5606602,12.8033009 C13.9748737,12.2175144 13.9748737,11.267767 14.5606602,10.6819805 Z" fill="#000000" opacity="0.3" />
                                    <path d="M8.56066017,16.6819805 L10.6819805,14.5606602 C11.267767,13.9748737 12.2175144,13.9748737 12.8033009,14.5606602 L14.9246212,16.6819805 C15.5104076,17.267767 15.5104076,18.2175144 14.9246212,18.8033009 L12.8033009,20.9246212 C12.2175144,21.5104076 11.267767,21.5104076 10.6819805,20.9246212 L8.56066017,18.8033009 C7.97487373,18.2175144 7.97487373,17.267767 8.56066017,16.6819805 Z M8.56066017,4.68198052 L10.6819805,2.56066017 C11.267767,1.97487373 12.2175144,1.97487373 12.8033009,2.56066017 L14.9246212,4.68198052 C15.5104076,5.26776695 15.5104076,6.21751442 14.9246212,6.80330086 L12.8033009,8.9246212 C12.2175144,9.51040764 11.267767,9.51040764 10.6819805,8.9246212 L8.56066017,6.80330086 C7.97487373,6.21751442 7.97487373,5.26776695 8.56066017,4.68198052 Z" fill="#000000" />
                                </g>
                            </svg> 
                        </div>
                        <div class="kt-iconbox__desc">
                            <h3 class="kt-iconbox__title">
                                <?php echo $total; ?>
                            </h3>
                            <div class="kt-iconbox__content">
                                Messages in Queue
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="text-align: justify;">Click below to fill up the mobile numbers, names and other details. Please ensure that you provide accurate and complete information. This will help us effectively send the messages and avoid any discrepancies.</div><br/>
            <a href="https://docs.google.com/spreadsheets/d/12rnO0rPpVU-6v_RUhHs2auTtqeGEKEcC8AKiyD_dX7Y/edit#gid=0"  target="_blank"><button class="btn" style="background-color: rgb(15, 157, 88); color: white; width: 100%;">OPEN GOOGLE SHEET</button></a>
        </div>
        <div class="col-lg-8">
        	<div class="kt-portlet kt-portlet--mobile">
				<div class="kt-portlet__body kt-portlet__body--fit">
					<div class="kt-portlet__body">
						Placeholders<br/>
						<div class="row">
							<div class="col-sm-3">Child Name : {child_name}</div>
							<div class="col-sm-3">ITS : {its}</div>
							<div class="col-sm-3">Class : {class}</div>
							<div class="col-sm-3">Section : {section}</div>
						</div>
						<div class="row">
							<div class="col-sm-3">Custom 1 : {custom_1}</div>
							<div class="col-sm-3">Custom 2 : {custom_2}</div>
							<div class="col-sm-3">Custom 3 : {custom_3}</div>
							<div class="col-sm-3">Custom 4 : {custom_4}</div>
						</div>
						<div class="row">
							<div class="col-sm-3">Custom 5 : {custom_5}</div>
							<div class="col-sm-3"></div>
							<div class="col-sm-3"></div>
							<div class="col-sm-3"></div>
						</div>
                        <div id="wa_count"></div><br/>
                        <form id="whatsapp_form">
	                        <textarea class="form-control" id="wa_message" name="wa_message" rows="15" placeholder="Type Here..." style="width: 100%"></textarea><br/>

	                        <input class="form-control" type="text" id="edit_message_id" name="edit_message_id" placeholder="ID" style="display: none;" />

	                        <div class="row">
	                        	<div class="col-lg-4">
	                        		<input class="form-control" type="file" id="wa_attachments" name="wa_attachments" multiple></input>
	                        	</div>
	                        	<div class="col-lg-4">
									<select class="form-control kt-select2" id="wa_template" name="wa_template">
										<option></option>
										<option value="1">Fee Reminder</option>
									</select>
								</div>
	                        	<!-- <div class="col-lg-4">
			                        <input type="hidden" id="phone2" name="phone" />
                                    <input name="wa_mobile_test_temp" placeholder="Mobile Number..." id="wa_mobile_test_temp" class="form-control" type="tel" >
                                    <input name="wa_mobile_test" placeholder="Mobile Number..." id="wa_mobile_test" class="form-control" type="tel" style="display: none;">
			                    </div>
			                    <div class="col-lg-4">
			                        <button class="btn btn-warning" id="wa_test_btn" style="width: 100%;">Send Test Message</button>
			                    </div> -->
			                </div>
			                <br/>
	                        <button class="btn btn-success" type="submit" id="wa_queue_submit">SEND</button>
	                    </form>
					</div>
				</div>
			</div>
        </div>
	</div>

	<div class="row">
		<div class="col-lg-12">
			<div class="kt-portlet kt-portlet--mobile">
				<div class="kt-portlet__body kt-portlet__body--fit">
					<div class="kt-portlet__body">
						<!-- Datatable listing the whatsapp Queue, with search option<br/>
						Global Options : Pause Queue | Truncate Queue<br/>
						Row Wise Options : Edit / Delete -->

						<div class="kt-form kt-form--label-right kt-margin-t-20 kt-margin-b-10">
							<div class="row align-items-center">				
								<div class="col-md-6 kt-margin-b-20-tablet-and-mobile">
									<div class="kt-input-icon kt-input-icon--left">
										<input type="text" class="form-control" placeholder="Search By Mobile / Content..." id="generalSearch">
										<span class="kt-input-icon__icon kt-input-icon__icon--left">
											<span><i class="la la-search"></i></span>
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<!--begin: Datatable -->
					<div class="kt-datatable" id="whatsapp_queue_datatable"></div>
					<!--end: Datatable -->
				</div>
			</div>
		</div>
	</div>
	
</div>
<!-- end:: Content -->