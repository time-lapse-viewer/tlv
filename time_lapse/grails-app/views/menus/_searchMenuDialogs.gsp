<div class = "modal" id = "searchBookmarkDialog">
	<div class = "modal-dialog">
 		<div class = "modal-content">
			<div class = "modal-body">
				<a id = "searchBookmarkHref">This</a> URL captures ALL of the current search parameters. Keep what you want and delete the rest. Then, bookmark it!
			</div>
			<div class = "modal-footer">
				<button type = "button" class = "btn btn-default" data-dismiss = "modal">Close</button>
			</div>
 		</div>
	</div>
</div>


<div class = "modal" id = "searchDialog">
	<div class = "modal-dialog modal-lg">
		<div class = "modal-content">
			<div class = "modal-header"><h4>Search Parameters</h4></div>
			<div class = "modal-body">
				<table class = "table">
					<tr>
						<td align = "right">Location:</td>
						<td>
							<input id = "searchTabLocationDiv" type = "text">
							&nbsp;within&nbsp;
							<select id = "searchTabRadiusSelect">
								<g:each in = "${[1, 10, 50, 100, 500,1000, 5000, 10000]}">
									<option value = ${it}>${it}</option>
								</g:each>
							</select> meter(s)
						</td>
					</tr>
					<tr>
						<td align = "right">Start Date:</td>
						<td><input type = "text" id = "searchTabStartDateTimePicker"/></td>
					</tr>
					<tr>
						<td align = "right">End Date:</td>
						<td><input type = "text" id = "searchTabEndDateTimePicker"/></td>
					</tr>
					<tr>
						<td align = "right">Sensor:</td>
         					<td>
							<div class = "btn-group" data-toggle = "buttons">
								<label class = "btn btn-primary" id = "searchTabSensorAllLabel" onchange = librarySensorCheck()>
									<input id = "searchTabSensorAllCheckbox" type = "checkbox">ALL
								</label>
								<g:each in = "${params.availableResources.sensors}">
									<label class = "btn btn-primary" id = "searchTabSensor${it.name.capitalize()}Label" title = "${it.description}">
										<input id = "searchTabSensor${it.name.capitalize()}Checkbox" type = "checkbox">
										${it.name.toUpperCase()}
									</label>
								</g:each>
							</div>
						</td>
					</tr>
					<tr>
						<td align = "right">Tailored GEOINT:</td>
						<td>
							<div class = "btn-group" data-toggle = "buttons">
								<label class = "btn btn-primary" id = "searchTabTailoredGeointAllLabel" onchange = librarySensorCheck()>
									<input id = "searchTabTailoredGeointAllCheckbox" type = "checkbox">ALL
								</label>
								<g:each in = "${params.availableResources.tailoredGeoint}">
									<label 
										class = "btn btn-primary" id = "searchTabTailoredGeoint${it.name.capitalize()}Label" title = "${it.description}">
										<input id = "searchTabTailoredGeoint${it.name.capitalize()}Checkbox" type = "checkbox">
										${it.name.toUpperCase()}
									</label>
								</g:each>
							</div>	
						</td>
					</tr>
					<tr>
						<td align = "right">Min. NIIRS:</td>
               					<td><input id = "searchTabMinNiirsInput" max = "9" min = "0" step = "0.1" type = "number"></td>
					</tr>
        				<tr>
						<td align = "right">Max. Cloud Cover (%):</td>
						<td><input id = "searchTabMaxCloudCoverInput" max = "100" min = "0" step = "1" type = "number"></td>
					</tr>
					<tr>
						<td align = "right">Max. Results:</td>
						<td>
							<select id = "searchTabMaxResultsSelect">
								<g:each in = "${[5, 10, 25, 50, 75, 100, 250, 500]}">
									<option value = ${it}>${it}</option>
								</g:each>
							</select>
						</td>
					</tr>
					<tr>
						<td align = "right">Library:</td>
						<td>
							<div class = "btn-group" data-toggle = "buttons">
								<g:each in = "${params.availableResources.libraries}">
									<label class = "btn btn-primary" id = "searchTabLibrary${it.capitalize()}Label" onchange = librarySensorCheck()>
										<input id = "searchTabLibrary${it.capitalize()}Checkbox" type = "checkbox">
										${it.toUpperCase()}
									</label>
								</g:each>
							</div>
						</td>
					</tr>
				</table>
			</div>
                        <div class = "modal-footer">
				<button type = "button" class = "btn btn-primary" data-dismiss = "modal" onclick = "beginSearch()">Search</button>
				<button type = "button" class = "btn btn-primary" data-dismiss = "modal" onclick = "bookmarkSearchParams()">Bookmark It!</button>
                                <button type = "button" class = "btn btn-default" data-dismiss = "modal">Close</button>
                        </div>
		</div>
	</div>
</div> 
