<div class = "row">
	<nav class = "navbar navbar-default navbar-static-top" id = "navigationMenu">
		<div class = "container-fluid">
			<div class = "navbar-header">
				<a class = "navbar-brand" href = "/" style = "padding-top: 5px">
					<asset:image height = "40px" src = "logos/tlv.png" title = "TLV Home"/>
				</a>
			</div>
			<div class = "collapse navbar-collapse">
				<ul class = "nav navbar-nav">
					<g:render template = "/menus/search-menu"/>
					<g:render template = "/menus/time-lapse-menu-controls"/>
					<li>
						<a href = javascript:void(0) onclick = buildSummaryTable();$("#summaryTableDialog").modal("show"); title = "Summary Table">
							<span id = "tlvLayerCountSpan">0/0</span>
							<span class = "glyphicon glyphicon-list-alt"></span>
						</a>
					</li>	
					<%--
					<g:render template = "menus/timeLapseMenuFunctions"/>
					<g:render template = "menus/exportMenu"/>
					<g:render template = "menus/imagePropertiesMenu"/>
					<g:render template = "menus/layersMenu"/>
					<g:render template = "menus/viewMenu"/> 
					--%>
				</ul>
				<ul class="nav navbar-nav navbar-right">
					<li><a href = javascript:void(0) onclick = $("#helpDialog").modal("show")>Help</a></li>
				</ul>
			</div>
		</div>		
	</nav>
</div>
