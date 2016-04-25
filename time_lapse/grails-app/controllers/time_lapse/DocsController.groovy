package time_lapse


class DocsController {

	def index() { 
		// attempt to find the adoc file
		def adocFile = new File("../docs/tlv.adoc")
		if (!adocFile.exists()) { adocFile = getClass().getResource("/tlv.adoc")?.file }

		if (adocFile?.exists()) {
			// attempt to find the html file
			def htmlFile = new File("../docs/tlv.html")
			if (!htmlFile.exists()) {  htmlFile = getClass().getResource("/tlv.html")?.file }

			// create the corresponding html if it doesn't exist
			if (!htmlFile?.exists()) { 
				def command = "asciidoctor ${adocFile.absolutePath}"
				command.execute().waitFor()
				htmlFile = new File("${adocFile.absolutePath.replaceAll(".adoc", ".html")}")
				println htmlFile
			}

			if (htmlFile.exists()) {
				response.contentType = "text/html"
				render htmlFile.getText()
			}
			else { render "Oh no! There was a problem while generating the docs." }
		}
		else { render "There doesn't appear to be any docs!" }
	}
}
