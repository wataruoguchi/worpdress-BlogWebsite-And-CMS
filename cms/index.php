<?php include('./header.php'); ?>
<!-- setting controller in header -->
<span ng-bind="setInfo(
<?php echo "'".$_SESSION['userId']."','".$_SESSION['displayName']."','".$_SESSION['roleId']."'" ?>);
"></span>
<!-- MODAL -->
<!-- It's not used this time. Priority is low. -->
<!-- 
<div id="myModal" class="reveal-modal" data-reveal>
	<h2>Awesome. I have it.</h2>
	<p class="lead">Your couch.  It is mine.</p>
	<p>I'm a cool paragraph that lives inside of an even cooler modal. Wins!</p>
	<a class="close-reveal-modal">&#215;</a>
</div>
 -->
<!-- TOP BAR -->
<div class="sticky">
	<nav class="top-bar" data-topbar role="navigation">
		<ul class="title-area">
			<li class="name">
				<h1><a ui-sref="page1">Worpdress</a></h1>
			</li>
			<!-- MOBILE  -->
			<li class="toggle-topbar menu-icon"><a href="#"><span> </span></a></li>
		</ul>

		<section class="top-bar-section">
			<!-- TOP BAR LEFT(same as side menu) -->
			<ul class="left hide-for-large-up {{active}}" ng-click="$event.preventDefault()">
				<?php include('./sideMenuItems.php'); ?>
			</ul>
			<!-- TOP BAR RIGHT -->
			<ul class="right">
				<li class="has-dropdown">
					<a>{{displayName}}</a>
					<ul class="dropdown">
						<li><a ng-click="getEditUserId();" ui-sref="page6">Profile</a></li>
						<li><a href="./logout.php">Log Out</a></li>
					</ul>
				</li>
			</ul>
		</section>
	</nav>
</div>

<!-- PAGE AREA (Under the top bar) -->
<div class="row fullWidth">
	<!-- SIDEMENU AREA -->
	<div class="large-1 medium-2 columns show-for-large-up side-nav-area">
		<ul class="side-nav {{active}}" ng-click="$event.preventDefault()">
			<?php include('./sideMenuItems.php'); ?>
		</ul>
	</div>
	<!-- CONTENTS AREA -->
	<div class="medium-12 large-11 columns">
		<div ui-view></div>
	</div>
</div>

<!-- FOOTER -->
<?php include('./footer.php'); ?>