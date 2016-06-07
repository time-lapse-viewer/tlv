<li class = "dropdown">
	<a href ="javascript:void(0)" class = "dropdown-toggle" data-toggle = "dropdown" title = "Time-Lapse Functions">
		Time-Lapse<span class = "caret"></span>
	</a>
	<ul class = "dropdown-menu">
		<li><a href = javascript:void(0) onclick = "deleteFrame(); $('.navbar-collapse').collapse('hide');">Delete Frame</a></li>
		<li class = "dropdown-submenu">
			<a href= class = "dropdown-toggle" data-toggle = "dropdown" href = javascript:void(0)>Rotation</a>
			<ul class = "dropdown-menu">
				<li><a href = javascript:void(0) onclick = "disableMapRotation(); $('.navbar-collapse').collapse('hide');">None</a></li>
				<li><a href = javascript:void(0) onclick = "enableManualMapRotation(); $('.navbar-collapse').collapse('hide');">Manual</a></li>
				<li><a href = javascript:void(0) onclick = "enableCompassMapRotation(); $('.navbar-collapse').collapse('hide');">Compass</a></li>
			</ul>
		</li>
		<li><a href = javascript:void(0) onclick = "$('#geoJumpDialog').modal('show'); $('.navbar-collapse').collapse('hide');">Geo-Jump</a></li>
		<li><a href = javascript:void(0) onclick = "tlv.layers.reverse(); changeFrame('rewind'); changeFrame('fastForward'); $('.navbar-collapse').collapse('hide');">Reverse Order</a></li>
	</ul>
</li>
