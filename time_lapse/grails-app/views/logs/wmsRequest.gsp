<!DOCTYPE html>
<html>
	<head>
		<meta content = "logs" name = "layout"/>
		<g:set var = "entityName" value = "${message(code: 'wmsRequest.label', default: 'WmsRequest')}"/>
		<title><g:message code="default.list.label" args="[entityName]"/></title>
	</head>
	<body>
		<div id="list-wmsRequest" class="content scaffold-list" role="main">
			<h1><g:message code="default.list.label" args="[entityName]" /></h1>
			<f:table collection="${wmsRequestList}" />

			<div class="pagination">
				<g:paginate total="${wmsRequestCount ?: 0}" />
			</div>
		</div>
	</body>
</html>
