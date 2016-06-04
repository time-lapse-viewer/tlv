<li class = "dropdown">
	<a href ="javascript:void(0)" class = "dropdown-toggle" data-toggle = "dropdown" title = "Time-Lapse Functions">
		Time-Lapse<span class = "caret"></span>
	</a>
	<ul class = "dropdown-menu">
		<li><a href = javascript:void(0) onclick = deleteFrame()>Delete Frame</a></li>
		<li><a href = javascript:void(0) onclick = enableDisableMapRotation($(this).children()[0])>
			<span>Enable Rotation</span>
		</a></li>
		<li><a href = javascript:void(0) onclick = $("#geoJumpDialog").modal("show")>Geo-Jump</a></li>
		<li><a href = javascript:void(0) onclick = tlv.layers.reverse();changeFrame("rewind");changeFrame("fastForward")>Reverse Order</a></li>
	</ul>
</li>
