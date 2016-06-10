<div class = "modal" id = "timeLapseDialog" role = "dialog" tabindex = "-1">
	<div class = "modal-dialog">
		<div class = "modal-content">
			<div class = "modal-header"><h4>Time-Lapse</h4></div>
			<div class = "modal-body">
				<div class = "form-group">
					<label>Delete Frame</label>
					<button class = "btn btn-primary form-control" onclick = "deleteFrame(); $('#timeLapseDialog').modal('hide')">Delete</button>

					<label>Rotation</label>
					<select class = "form-control" id = "rotationSelect" onchange = "rotationToggle(); $('#timeLapseDialog').modal('hide')">
						<option value = "none">None</option>
						<option value = "manual">Manual</option>
						<option value = "compass">Compass</option>
					</select>
					
					<label>Geo-Jump</label>
					<div class = "input-group">
						<input class = "form-control" id = "geoJumpLocationInput" placeholder = "e.g. ${grailsApplication.config.defaultLocation}" type = "text">
						<span class = "input-group-btn">
							<button class = "btn btn-primary"  onclick = "geoJump(); $('#timeLapseDialog').modal('hide')" type = "button">Go!</button>
						</span>
					</div>
				
					<label>Reverse Order</label>
					<button class = "btn btn-primary form-control" onclick = "reverseOrder(); $('#timeLapseDialog').modal('hide')">Reverse Order</button>
				</div>
			</div>
			<div class = "modal-footer">
				<button type = "button" class = "btn btn-default" data-dismiss = "modal">Close</button>
			</div>
		</div>
	</div>
</div>


<g:javascript>
	$("#timeLapseDialog").on("hidden.bs.modal", function (event) { hideDialog("timeLapseDialog"); });
	$("#timeLapseDialog").on("shown.bs.modal", function (event) { displayDialog("timeLapseDialog"); });
</g:javascript>
