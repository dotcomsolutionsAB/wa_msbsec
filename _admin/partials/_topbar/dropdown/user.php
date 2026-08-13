<!--begin: Head -->
<div class="kt-user-card kt-user-card--skin-dark kt-notification-item-padding-x" style="background-image: url(../assets/media/misc/bg-1.jpg)">
	<div class="kt-user-card__avatar">
		<img class="kt-hidden" alt="Pic" src="assets/media/users/300_25.jpg" />

		<!--use below badge element instead the user avatar to display username's first letter(remove kt-hidden class to display it) -->
		<span class="kt-badge kt-badge--lg kt-badge--rounded kt-badge--bold kt-font-success"><?php echo strtoupper($name_head[0]); ?></span>
	</div>
	<div class="kt-user-card__name">
		<?php echo $name_head; ?>
	</div>
	<!-- <div class="kt-user-card__badge">
		<span class="btn btn-success btn-sm btn-bold btn-font-md">23 messages</span>
	</div> -->
</div>

<!--end: Head -->

<!--begin: Navigation -->
<div class="kt-notification">
	<a href="?page=profile" class="kt-notification__item">
		<div class="kt-notification__item-icon">
			<i class="flaticon2-calendar-3 kt-font-success"></i>
		</div>
		<div class="kt-notification__item-details">
			<div class="kt-notification__item-title kt-font-bold">
				My Profile
			</div>
			<div class="kt-notification__item-time">
				Manage your profile details
			</div>
		</div>
	</a>
	<a href="?page=settings" class="kt-notification__item">
		<div class="kt-notification__item-icon">
			<i class="flaticon2-settings kt-font-brand"></i>
		</div>
		<div class="kt-notification__item-details">
			<div class="kt-notification__item-title kt-font-bold">
				Settings
			</div>
			<div class="kt-notification__item-time">
				Account settings and more
			</div>
		</div>
	</a>
	
	<div class="kt-notification__custom kt-space-between">
		<a href="../assets/custom/login/logout.php" class="btn btn-label btn-label-brand btn-sm btn-bold">Sign Out</a>
		<!-- <a href="custom/user/login-v2.html" target="_blank" class="btn btn-clean btn-sm btn-bold">Upgrade Plan</a> -->
	</div>
</div>

<!--end: Navigation -->