<div class = "modal" id = "planetCredentialsDialog" role = "dialog" tabindex = "-1">
	<div class = "modal-dialog">
		<div class = "modal-content">
			<div class = "modal-header">
				<h4>Planet Credentials</h4>
				<a href = "https://planet.com" target = "_blank">What is Planet?</a>
			</div>
			<div class = "modal-body">
				<form>
					<div class = "form-group">
						<label>Username</label>
						<input class = "form-control" id = "planetUsernameInput" name = "planetUsername" type = "text">

						<label>Password</label>
						<input class = "form-control" id = "planetPasswordInput" name = "planetPassword" type = "password">
					</div>
				</form>
			</div>
			<div class = "modal-footer">
				<button type = "button" class = "btn btn-primary" data-dismiss = "modal">Login</button>
				<button type = "button" class = "btn btn-default" data-dismiss = "modal">Close</button>
			</div>
		</div>
	</div>
</div>

<g:javascript>
	$("#planetCredentialsDialog").on("hidden.bs.modal", function (event) { hideDialog("planetCredentialsDialog"); });
	$("#planetCredentialsDialog").on("shown.bs.modal", function (event) { displayDialog("planetCredentialsDialog"); });
</g:javascript>
