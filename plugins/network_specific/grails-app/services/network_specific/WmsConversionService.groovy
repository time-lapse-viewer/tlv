package network_specific


import grails.transaction.Transactional


@Transactional
class WmsConversionService {

	def grailsApplication


	def serviceMethod(params) {
		params.remove("action")
		params.remove("controller")
		params.remove("format")

		
		def bbox = params.BBOX.split(",").collect({ it as Double})
		def offsetLat = params.OFFSET_LAT as Double
		def offsetLon = params.OFFSET_LON as Double
		if (params.VERSION == "1.1.1") {
			bbox[0] += offsetLon
			bbox[1] += offsetLat
			bbox[2] += offsetLon
			bbox[3] += offsetLat
		}
		else if (params.VERSION == "1.3.0") {
			bbox[0] += offsetLat
			bbox[1] += offsetLon
			bbox[2] += offsetLat
			bbox[3] += offsetLon
		}
		params.BBOX = bbox.join(",")
		params.remove("OFFSET_LAT")
		params.remove("OFFSET_LON")

		def library = params.LIBRARY
		// remove params that are not used by any WMS schema
		params.remove("KEEP_VISIBLE")
		params.remove("LIBRARY")
		params.remove("IMAGE_ID")
		params.remove("OPACITY")
	

		def url = grailsApplication.config.libraries[library].baseUrl
		url += grailsApplication.config.libraries[library].relativeWmsUrl + "?"

		if (library == "omar") {
			// contrast
			def contrast = params.CONTRAST as Double
			params.CONTRAST = contrast + 1
	
			// dra
			def dra = params.DRA
			if (dra == "auto") { params.STRETCH_MODE = "linear_auto_min_max" }
			else if (dra == "none" ) { params.STRETCH_MODE = "none" }
			else if (dra == "sigma") {
				if (params.DRA_SIGMA == "1") { params.STRECH_MODE = "linear_1std_from_mean" }
				else if (params.SIGMA == "2") { params.STRECH_MODE = "linear_2std_from_mean" }
				else if (params.SIGMA == "3") { params.STRECH_MODE = "linear_3std_from_mean" }
			}
			params.remove("DRA")
			params.remove("DRA_SIGMA")
	
			// dra area
			if (params.DRA_AREA == "viewport") { params.STRECTH_MODE_REGION = "viewport" }
			else { params.STRECTH_MODE_REGION = "global"}
			params.remove("DRA_AREA")
			
			// sharpness
			def sharpness = params.SHARPNESS as Double
			if (sharpness > 0.5) { params.SHARPEN_MODE = "heavy" }
			else if (sharpness > 0) { params.SHARPEN_MODE = "light" }
			else { params.SHARPEN_MODE = "none" }
			params.remove("SHARPNESS")
		}
		else if (library == "digitalGlobe") { 
			params.CONNECTID = grailsApplication.config.libraries[library].connectId 
			params.COVERAGE_CQL_FILTER = "featureId='${params.LAYERS}'"
			params.LAYERS = "DigitalGlobe:Imagery"

			// remove params that are not used by the digital globe WMS schema
			params.remove("BANDS")
			params.remove("BRIGHTNESS")
			params.remove("CONTRAST")
			params.remove("DRA")
			params.remove("DRA_SIGMA")
			params.remove("DRA_AREA")
			params.remove("SHARPNESS")
		}
				
		params.each() { url += "${it}&" }

println url
		return url
	}
}
