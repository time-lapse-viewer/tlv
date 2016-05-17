<div class = "modal" id = "loadingDialog">
	<div class = "modal-dialog">
		<div class = "modal-content">
			<div class = "modal-header"><h4>Please wait...</h4></div>
			<div class = "modal-body">
				<div id = "loadingDialogMessageDiv"></div>
				<br>
				<div class = "progress progress-striped">
					<div class = "progress-bar progress-bar-info" role = "progressbar" style = "width: 100%"></div>
				</div>
			</div>
		</div>
	</div>
</div>

<g:render template = "/time-lapse-dialogs"/>
<%--
<g:render template = "menus/exportMenuDialogs"/>
<g:render template = "menus/imagePropertiesMenuDialogs"/>
<g:if test = "${grailsApplication.config.networkSpecific.layers.enabled}"><g:render plugin = "networkSpecific" template = "menus/layers/layersMenuDialogs"/></g:if>
--%>
<g:render template = "/menus/layers-menu-dialogs"/>
<g:render template = "/menus/search-menu-dialogs"/>
<g:render template = "/menus/time-lapse-menu-functions-dialogs"/>
