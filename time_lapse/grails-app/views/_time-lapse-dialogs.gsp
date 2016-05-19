<div class = "modal" id = "summaryTableDialog">
	<div class = "modal-dialog">
 		<div class = "modal-content">
			<div class = "modal-header"><h4>Summary Table</h4></div>
			<div class = "modal-body">
				<table class = "table table-condensed table-striped" id = "timeLapseSummaryTable" style = "white-space: nowrap"></table>
			</div>
			<div class = "modal-footer">
				<button type = "button" class = "btn btn-default" data-dismiss = "modal">Close</button>
 			</div>
		</div>
	</div>
</div>

<g:javascript>
	$("#summaryTableDialog").on(
		"shown.bs.modal", 
		function (event) {
			var dialogBody = $("#summaryTableDialog .modal-body");
			var maxDialogBodyHeight = $(window).height() * 0.7;
			var dialogBodyIsTooTall = dialogBody.height() > maxDialogBodyHeight;
			dialogBody.css("max-height", dialogBodyIsTooTall ? maxDialogBodyHeight : "");
			dialogBody.css("overflow-y", dialogBodyIsTooTall ? "auto" : "");
		}
	);
</g:javascript>

<div class = "modal" id = "contextMenuDialog">
	<div class = "modal-dialog">
		<div class = "modal-content">
			<div class = "modal-header"><h4>Context Menu</h4></div>
			<div class = "modal-body"></div>
			<div class = "modal-footer">
				<button type = "button" class = "btn btn-default" data-dismiss = "modal">Close</button>
			</div>
		</div>
	</div>
</div>
