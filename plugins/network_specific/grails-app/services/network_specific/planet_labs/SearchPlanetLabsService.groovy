package network_specific.planet_labs


import grails.transaction.Transactional
import groovy.json.JsonOutput


@Transactional
class SearchPlanetLabsService {

	def grailsApplication
	def httpDownloadService
	def mathConversionService


	def extractMetadata(json) {
		def metadata = [
			acquired: json.properties.acquired ?: null,
			altitude: json.properties.sat.alt ?: null,
			bitDepth: json.properties.camera.bit_depth ?: null,
			id: json.id ?: null,
			cloudCover: json.properties.cloud_cover.estimated ?: null,
			colorMode: json.properties.camera.color_mode ?: null,
			exposureTime: json.properties.camera.exposure_time ?: null,
			gain: json.properties.camera.gain ?: null,
			groundSampleDistance: json.properties.image_statistics.gsd ?: null,
			imageQuality: json.properties.image_statistics.image_quality ?: null,
			latitude: json.properties.sat.lat ?: null,
			link: json.properties.links.full ?: null,
			longitude: json.properties.sat.lng ?: null,
			offNadir: json.properties.sat.off_nadir ?: null,
			provider: json.properties.provider ?: null,
			signalToNoiseRatio: json.properties.image_statistics.snr ?: null,
			stripId: json.properties.strip_id ?: null,
			sunAltitude: json.properties.sun.altitude ?: null,
			sunAzimuth: json.properties.sun.azimuth ?: null,
			sunLocalTimeOfDay: json.properties.sun.local_time_of_day ?: null,
			timeDelayIntegrationPulses: json.properties.camera.tdi_pulses ?: null
		]

		def footprint = json.geometry?.coordinates[0]
		metadata.put("footprint", footprint ?: null)


		return metadata
        }

	def processResults(features) {
		def images = []
		features.each() {
			def metadata = extractMetadata(it)

			def image = [:]
			image.acquisitionDate = metadata.acquired ? Date.parse("yyyy-MM-dd'T'HH:mm:ss", metadata.acquired).format("yyyy-MM-dd HH:mm:ss") : null
			image.indexId = metadata.id
			image.imageId = metadata.id
			image.library = "planetLabs"
			image.metadata = metadata
			images.push(image)
		}


		return images
	}

	def searchLibrary(params) {
		def library = grailsApplication.config.libraries.planetLabs

		def queryUrl = library.queryUrl
		queryUrl += "/v0/scenes/ortho"

		def filter = ""

		// acquisition date
		def startDate = "${params.startYear}-${params.startMonth}-${params.startDay}T${params.startHour}:${params.startHour}:${params.startSecond}.000"
		def endDate = "${params.endYear}-${params.endMonth}-${params.endDay}T${params.endHour}:${params.endHour}:${params.endSecond}.000"
		queryUrl += "?acquired.gte=${startDate}&acquired.lte=${endDate}"

		// bbox
		def deltaDeg = mathConversionService.convertRadiusToDeltaDegrees([radius: 1])
		def location = params.location.collect({ it as Double })
		def bbox = [location[0] - deltaDeg, location[1] - deltaDeg, location[0] + deltaDeg, location[1] + deltaDeg]
		def polygon = [
			[bbox[0], bbox[1]], 
			[bbox[2], bbox[1]], 
			[bbox[2], bbox[3]], 
			[bbox[0], bbox[3]], 
			[bbox[0], bbox[1]]
		]
		def geojson = JsonOutput.toJson([
			geometry: [
				coordinates: [polygon],
				type: "Polygon"
			],
			properties: [],
			type: "Feature"
		])

		queryUrl += "&intersects=${URLEncoder.encode(geojson)}"

		// cloud cover
//		filter += "(cloud_cover < ${params.maxCloudCover} OR cloud_cover IS NULL)"

//		filter += " AND "

		// dwithin
//		def deltaDegrees = mathConversionService.convertRadiusToDeltaDegrees(params)
//		filter += "DWITHIN(ground_geom,POINT(${params.location.join(" ")}),${deltaDegrees},meters)"

//		filter += " AND "

		// niirs
//		filter += "(niirs < ${params.minNiirs} OR niirs IS NULL)"

		// sensors
//		if (params.sensors.find { it == "all" } != "all") {
//			filter += " AND "

			// only search for sensors that are available in the library
//			def availableSensors = libraryObject.sensors
//			def sensorFilters = []
//			params.sensors.each() {
//				def sensor = it
//				if (sensor == availableSensors.find({ it.name == sensor }).name) { sensorFilters.push("sensor_id ILIKE '%${sensor}%'") }
//			}
//			sensorFilters.push("sensor_id IS NULL")
//			filter += "(${sensorFilters.join(" OR ")})"
//		}


		queryUrl += "&order_by=acquired%20desc"
println queryUrl

		def json = httpDownloadService.serviceMethod([password: library.password, url: queryUrl, username: library.username])
		def images = json.features.size() > 0 ? processResults(json.features) : []


		return images
	}
}
