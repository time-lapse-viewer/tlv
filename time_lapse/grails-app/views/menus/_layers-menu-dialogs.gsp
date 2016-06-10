<div class = "modal" id = "layersDialog" role = "dialog" tabindex = "-1">
	<div class = "modal-dialog">
		<div class = "modal-content">
			<div class = "modal-header"><h4>Layers</h4></div>
			<div class = "modal-body">
				<div class = "form-group">
                                        <label>Cross-Hair</label>
					<select class = "form-control" id = "layersCrossHairSelect" onchange = crossHairLayerToggle()>
						<option value = "off">OFF</option>
						<option value = "on">ON</option>
					</select>
		
					<label>Search Origin</label>
					<select class = "form-control" id = "layersSearchOriginSelect" onchange = searchOriginLayerToggle()>
						<option value = "off">OFF</option>
						<option value = "on">ON</option>
					</select>
				
					<g:if test = "${grailsApplication.config.networkSpecific.layers.enabled}">
						<g:render plugin = "networkSpecific" template = "/plugin_menus/layers-menu-dialogs"/>
					</g:if>
				</div>
			</div>
			<div class = "modal-footer">
				<button type = "button" class = "btn btn-default" data-dismiss = "modal">Close</button>
			</div>
		</div>
	</div>
</div>

<g:javascript>
	$("#layersDialog").on("hidden.bs.modal", function (event) { hideDialog("layersDialog"); });
	$("#layersDialog").on("shown.bs.modal", function (event) { displayDialog("layersDialog"); });
</g:javascript>
