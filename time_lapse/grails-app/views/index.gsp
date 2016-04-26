<!DOCTYPE html>
<html>
	<head>
		<meta charset = "utf-8">
		<meta http-equiv = "X-UA-Compatible" content = "IE=edge">
		<meta name = "viewport" content = "width=device-width, initial-scale = 1">
		<!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->

		<title>Time Lapse Viewer (TLV)</title>
		<link href = "${request.contextPath}/assets/tlvicon.ico" rel = "shortcut icon" type = "image/x-icon">

		<asset:stylesheet src = "index-bundle.css"/>
		<asset:javascript src = "index-bundle.js"/>
	</head>
	<body>
		<div class = "container-fluid">
			<g:render template = "security-classification-header"/>
			<g:render template = "navigationMenu"/>
${grailsApplication.config.cheese}
			<g:render template = "dialogs"/>
		</div>
	</body>
</html>
