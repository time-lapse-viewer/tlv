<li class = "dropdown">
	<a href ="javascript:void(0)" class = "dropdown-toggle" data-toggle = "dropdown" title = "Time-Lapse Functions">
		Time-Lapse<span class = "caret"></span>
	</a>
	<ul class = "dropdown-menu">
		<li><a href = javascript:void(0) onclick = deleteFrame()>Delete Frame</a></li>
		<li><a href = javascript:void(0) onclick = enableDisableCompassMapRotation($(this).children()[0])>
			<span>Enable Compass Rotation</span>
		</a></li>
		<li><a href = javascript:void(0) onclick = enableDisableManualMapRotation($(this).children()[0])>
			<span>Enable Manual Rotation</span>
		</a></li>
		<li class = "dropdown-submenu">
			<a href= class = "dropdown-toggle" data-toggle = "dropdown" href = javascript:void(0)>Rotation</a>
			<ul class = "dropdown-menu">
				<li><a href = javascript:void(0) onclick = disableMapRotation()>None</a></li>
				<li><a href = javascript:void(0) onclick = enableManualMapRotation()>Manual</a></li>
				<li><a href = javascript:void(0) onclick = enableCompassMapRotation()>Compass</a></li>
			</ul>
		</li>
		<li><a href = javascript:void(0) onclick = $("#geoJumpDialog").modal("show")>Geo-Jump</a></li>
		<li><a href = javascript:void(0) onclick = tlv.layers.reverse();changeFrame("rewind");changeFrame("fastForward")>Reverse Order</a></li>
	</ul>
</li>
