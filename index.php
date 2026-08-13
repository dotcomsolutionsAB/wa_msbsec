<!DOCTYPE html>

<html lang="en">

	<!-- begin::Head -->
	<head>
		<!-- <base href="../../../../"> -->
		<meta charset="utf-8" />
		<title>MSB Secunderabad</title>
		<meta name="description" content="Login Page">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

		<!--begin::Fonts -->
		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700|Roboto:300,400,500,600,700">

		<!--end::Fonts -->

		<!--begin::Page Custom Styles(used by this page) -->
		<link href="../assets/css/pages/login/login-6.css" rel="stylesheet" type="text/css" />

		<!--end::Page Custom Styles -->

		<!--begin::Global Theme Styles(used by all pages) -->
		<link href="assets/plugins/global/plugins.bundle.css" rel="stylesheet" type="text/css" />
		<link href="assets/css/style.bundle.css" rel="stylesheet" type="text/css" />
		<link href="assets/css/custom.css" rel="stylesheet" type="text/css" />

		<!--end::Global Theme Styles -->

		<!--begin::Layout Skins(used by all pages) -->
		<link href="assets/css/skins/header/base/light.css" rel="stylesheet" type="text/css" />
		<link href="assets/css/skins/header/menu/light.css" rel="stylesheet" type="text/css" />
		<link href="assets/css/skins/brand/dark.css" rel="stylesheet" type="text/css" />
		<link href="assets/css/skins/aside/dark.css" rel="stylesheet" type="text/css" />

	</head>

	<!-- end::Head -->

	<!-- begin::Body -->
	<body class="kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--enabled kt-subheader--fixed kt-subheader--solid kt-aside--enabled kt-aside--fixed kt-page--loading">

		<!-- begin:: Page -->
		<div class="kt-grid kt-grid--ver kt-grid--root">
			<div class="kt-grid kt-grid--hor kt-grid--root  kt-login kt-login--v6 kt-login--signin" id="kt_login">
				<div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--desktop kt-grid--ver-desktop kt-grid--hor-tablet-and-mobile">
					<div class="kt-grid__item  kt-grid__item--order-tablet-and-mobile-2  kt-grid kt-grid--hor kt-login__aside">
						<div class="kt-login__wrapper">
							<div class="kt-login__container">
								<div class="kt-login__body">
									<div class="kt-login__logo">
										<a href="#">
											<!-- <img src="assets/media/company-logos/logo.png" height="100px"> -->
										</a>
									</div>
									<div class="kt-login__signin">
										<div class="kt-login__head">
											<h3 class="kt-login__title">Sign In</h3>
										</div>
										<div class="kt-login__form">
											<form class="kt-form" action="">
												<div class="form-group">
													<input class="form-control" type="text" placeholder="Username" name="username" autocomplete="off">
												</div>
												<div class="form-group">
													<input class="form-control form-control-last" type="password" placeholder="Password" name="password">
												</div>
												<div class="kt-login__extra">
													<label class="kt-checkbox">
														<input type="checkbox" name="remember"> Remember me
														<span></span>
													</label>
													<a href="javascript:;" id="kt_login_forgot">Forget Password ?</a>
												</div>
												<div class="kt-login__actions">
													<button id="kt_login_signin_submit" class="btn btn-brand btn-pill btn-elevate">Sign In</button>
												</div>
											</form>
										</div>
									</div>
									<div class="kt-login__signup">
										<div class="kt-login__head">
											<h3 class="kt-login__title">Sign Up</h3>
											<div class="kt-login__desc">Enter your details to create your account:</div>
										</div>
										<div class="kt-login__form">
											<form class="kt-form" action="">
												<div class="form-group">
													<input class="form-control" type="text" placeholder="Fullname" name="fullname">
												</div>
												<div class="form-group">
													<input class="form-control" type="text" placeholder="Email" name="email" autocomplete="off">
												</div>
												<div class="form-group">
													<input class="form-control" type="password" placeholder="Password" name="password">
												</div>
												<div class="form-group">
													<input class="form-control form-control-last" type="password" placeholder="Confirm Password" name="rpassword">
												</div>
												<div class="kt-login__extra">
													<label class="kt-checkbox">
														<input type="checkbox" name="agree"> I Agree the <a href="#">terms and conditions</a>.
														<span></span>
													</label>
												</div>
												<div class="kt-login__actions">
													<button id="kt_login_signup_submit" class="btn btn-brand btn-pill btn-elevate">Sign Up</button>
													<button id="kt_login_signup_cancel" class="btn btn-outline-brand btn-pill">Cancel</button>
												</div>
											</form>
										</div>
									</div>
									<div class="kt-login__forgot">
										<div class="kt-login__head">
											<h3 class="kt-login__title">Forgotten Password ?</h3>
											<div class="kt-login__desc">Enter your email to reset your password:</div>
										</div>
										<div class="kt-login__form">
											<form class="kt-form" action="">
												<div class="form-group">
													<input class="form-control" type="text" placeholder="Email" name="email" id="kt_email" autocomplete="off">
												</div>
												<div class="kt-login__actions">
													<button id="kt_login_forgot_submit" class="btn btn-brand btn-pill btn-elevate">Request</button>
													<button id="kt_login_forgot_cancel" class="btn btn-outline-brand btn-pill">Cancel</button>
												</div>
											</form>
										</div>
									</div>
								</div>
							</div>
							<!-- <div class="kt-login__account">
								<span class="kt-login__account-msg">
									Don't have an account yet ?
								</span>&nbsp;&nbsp;
								<a href="javascript:;" id="kt_login_signup" class="kt-login__account-link">Sign Up!</a>
							</div> -->
						</div>
					</div>
					<div class="kt-grid__item kt-grid__item--fluid kt-grid__item--center kt-grid kt-grid--ver kt-login__content" style="background-image: url(assets/media/bg/bg-1.jpg);">
						<div class="kt-login__section">
							<!-- <div class="kt-login__block">
								<h3 class="kt-login__title">Designing Your Imagination!</h3>
								<div class="kt-login__desc">
									We believe in providing you services, that help you
									<br>live your imagination
								</div>
							</div> -->
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- end:: Page -->

		<!-- begin::Global Config(global config for global JS sciprts) -->
		<script>
			var KTAppOptions = {
				"colors": {
					"state": {
						"brand": "#5d78ff",
						"dark": "#282a3c",
						"light": "#ffffff",
						"primary": "#5867dd",
						"success": "#34bfa3",
						"info": "#36a3f7",
						"warning": "#ffb822",
						"danger": "#fd3995"
					},
					"base": {
						"label": [
							"#c5cbe3",
							"#a1a8c3",
							"#3d4465",
							"#3e4466"
						],
						"shape": [
							"#f0f3ff",
							"#d9dffa",
							"#afb4d4",
							"#646c9a"
						]
					}
				}
			};
		</script>

		<!-- end::Global Config -->

		<!--begin::Global Theme Bundle(used by all pages) -->
		<script src="assets/plugins/global/plugins.bundle.js" type="text/javascript"></script>
		<script src="assets/js/scripts.bundle.js" type="text/javascript"></script>

		<!--end::Global Theme Bundle -->

		<!--begin::Page Scripts(used by this page) -->
		<script src="assets/js/pages/custom/login/login-general.js" type="text/javascript"></script>

		<!--end::Page Scripts -->
	</body>
	<?php
    if(isset($_REQUEST['val']))
    {
        if($_REQUEST['val'] === 'signout')
        {
            echo '<script type="text/javascript">logoutToast();</script>';
        }else if($_REQUEST['val'] === 'timeout'){
        	echo '<script type="text/javascript">sessionToast();</script>';
        }
    }
    ?>

	<!-- end::Body -->
</html>