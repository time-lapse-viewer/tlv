<div class = "row">
	<nav class = "navbar navbar-default navbar-static-top" id = "navigationMenu" role = "navigation">
		<div class = "container-fluid">
			<div class = "navbar-header">
				<a class = "navbar-brand" href = "/" style = "padding-top: 5px">
					<asset:image height = "40px" src = "logos/tlv.png" title = "TLV Home"/>
				</a>

				<g:render template = "/menus/time-lapse-menu-controls"/>

				<button aria-expanded = "false" class = "navbar-toggle collapsed" data-target = "#navigationMenuList" data-toggle = "collapse" type = "button">
					<span class = "sr-only">Toggle navigation</span>
					<span class = "icon-bar"></span>
					<span class = "icon-bar"></span>
					<span class = "icon-bar"></span>
				</button>
			</div>

			<div class = "collapse navbar-collapse" id = "navigationMenuList">
				<ul class = "nav navbar-nav">
					<g:render template = "/menus/search-menu"/>
					<g:render template = "/menus/annotations-menu"/>
					<g:render template = "/menus/export-menu"/>
					<g:render template = "/menus/layers-menu"/>
					<g:render template = "/menus/time-lapse-menu"/>
					<g:render template = "/menus/view-menu"/>
				</ul>
				<ul class="nav navbar-nav navbar-right">
					<li><a href = "javascript:window.open(tlv.contextPath + '/docs')" target = "_blank")>Help</a></li>
				</ul>
			</div>
		</div>
	</nav>
</div>
