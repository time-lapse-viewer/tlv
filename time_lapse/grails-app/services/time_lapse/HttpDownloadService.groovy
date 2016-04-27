package time_lapse


import grails.transaction.Transactional
import groovyx.net.http.ContentType
import groovyx.net.http.HTTPBuilder
import static groovyx.net.http.Method.*
import java.security.KeyStore
import org.apache.http.conn.scheme.Scheme
import org.apache.http.conn.ssl.SSLSocketFactory


@Transactional
class HttpDownloadService {


	def serviceMethod(params) {
		def http = new HTTPBuilder(params.url)

		def keyStoreFile = getClass().getResource("/keyStore.jks")
		def trustStoreFile = getClass().getResource("/trustStore.jks")

		if (keyStoreFile && trustStoreFile) {
			def keyStore = KeyStore.getInstance(KeyStore.defaultType)
			keyStoreFile.withInputStream { keyStore.load(it, "tlvCheese".toCharArray()) }

			def trustStore = KeyStore.getInstance(KeyStore.defaultType)
			trustStoreFile.withInputStream { trustStore.load(it, "tlvCheese".toCharArray()) }

			def ssl = new SSLSocketFactory(keyStore, "tlvCheese", trustStore)
			http.client.connectionManager.schemeRegistry.register(new Scheme("https", ssl, 443))
		}

		http.request(GET) { req ->
			response.success = { response, reader ->
				def contentType = response.allHeaders.find({ it.name =~ /(?i)Content-Type/})
				if (contentType) { contentType = contentType.value }


				if (contentType.contains("image/jpeg") || contentType.contains("image/png")) { return reader.bytes }
				else { return reader }
			}
		}
	}
}
