<div class = "modal" id = "layersDialog" role = "dialog" tabindex = "-1">
	<div class = "modal-dialog">
		<div class = "modal-content">
			<div class = "modal-header"><h4>Layers</h4></div>
			<div class = "modal-body">
				<table class = "table" style = "width: auto">
					<tr>
						<td align = "right">Cross-Hair:</td>
						<td>
							<button class = "btn btn-danger btn-xs" id = "layersCrossHairButton" onclick = "crossHairToggleButtonClick()">OFF</button>
						</td>
					</tr>
					<tr>
						<td align = "right">Search Origin:</td>
						<td>
							<button class = "btn btn-danger btn-xs" id = "layersSearchOriginButton" onclick = "searchOriginToggleButtonClick()">OFF</button>
						</td>
					</tr>
					<g:if test = "${grailsApplication.config.networkSpecific.layers.enabled}">
						<g:render plugin = "networkSpecific" template = "/plugin_menus/layers-menu-dialogs"/>
					</g:if>
				</table>
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
