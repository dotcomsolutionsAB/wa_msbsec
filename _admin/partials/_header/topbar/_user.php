<?php 
	session_start();
	$user = $_SESSION['username'];
	$sql_head = "SELECT * FROM users WHERE username = '$user'";
	$query_head = $db->query($sql_head);
	$row_head = $query_head->fetch_assoc();

	$name_head = $row_head['name'];

?>
<!--begin: User Bar -->
<div class="kt-header__topbar-item kt-header__topbar-item--user">
	<div class="kt-header__topbar-wrapper" data-toggle="dropdown" data-offset="0px,0px">
		<div class="kt-header__topbar-user">
			<span class="kt-header__topbar-welcome kt-hidden-mobile">Hi,</span>
			<span class="kt-header__topbar-username kt-hidden-mobile"><?php echo $name_head; ?></span>
			<img class="kt-hidden" alt="Pic" src="assets/media/users/300_25.jpg" />

			<!--use below badge element instead the user avatar to display username's first letter(remove kt-hidden class to display it) -->
			<span class="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--rounded kt-badge--bold"><?php echo strtoupper($name_head[0]); ?></span>
		</div>
	</div>
	<div class="dropdown-menu dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl">

		<!--[html-partial:include:{"file":"partials/_topbar/dropdown/user.html"}]/-->
			<?php include("partials/_topbar/dropdown/user.php"); ?>

	</div>
</div>

<!--end: User Bar -->