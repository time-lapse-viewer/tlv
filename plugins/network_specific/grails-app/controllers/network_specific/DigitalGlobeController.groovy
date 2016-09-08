package network_specific


import groovy.json.JsonOutput


class DigitalGlobeController {


	def validateCredentials() {
		def data = "username=${params.username}&pw=${URLEncoder.encode(params.password)}&acceptTOS=on"
		def command = [
			"curl",
			"-L",
			"-c",
			"cookies.txt",
			"-d",
			data,
			"https://evwhs.digitalglobe.com/myDigitalGlobe/authenticate"
		]

		def process = command.execute()
		def text = process.getText()
		def connectId = text.find(/connectId:\s+'(\S+)'/) { match, connectId -> return connectId }


		render JsonOutput.toJson([connectId: connectId])
	}
}
