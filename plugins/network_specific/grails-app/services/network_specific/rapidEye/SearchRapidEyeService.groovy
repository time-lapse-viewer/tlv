package network_specific.landsat


import grails.transaction.Transactional
import groovy.json.JsonOutput


@Transactional
class SearchRapidEyeService {

	def grailsApplication
	def httpDownloadService
	def library
	def mathConversionService


	def extractMetadata(json) {
		def metadata = [
			acquired: json.properties.acquired ?: null,
			altitude: json.properties.sat.alt ?: null,
			area: json.properties.area ?: null,
			azimuth: json.properties.sat.azimuth_angle ?: null,
			blackFill: json.properties.rapideye.black_fill ?: null,
			catalogId: json.properties.rapideye.catalog_id ?: null,
			cloudCover: json.properties.cloud_cover.estimated ?: null,
			groundSampleDistance: json.properties.image_statistics.gsd ?: null,
			id: json.id ?: null,
			link: json.properties.data.products.visual.full ?: null,
			offNadir: json.properties.sat.off_nadir ?: null,
			provider: json.properties.provider ?: null,
			published: json.properties.published ?: null,
			satId: json.properties.sat.id ?: null,
			sunAltitude: json.properties.sun.altitude ?: null,
			sunAzimuth: json.properties.sun.azimuth ?: null,
			stripId: json.properties.strip_id ?: null,
			tileId: json.properties.rapideye.tile_id ?: null,
			viewAngle: json.properties.sat.view_angle ?: null
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
			image.library = library.name
			image.metadata = metadata
			image.type = library.layerType
			images.push(image)
		}


		return images
	}

	def searchLibrary(params) {
		library = grailsApplication.config.libraries.rapidEye

		def queryUrl = library.queryUrl
		queryUrl += "/v0/scenes/rapideye"

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

		queryUrl += "&order_by=acquired%20desc"
println queryUrl

		def json = httpDownloadService.serviceMethod([password: library.password, url: queryUrl, username: library.username])
		def images = json.features.size() > 0 ? processResults(json.features) : []


		return images
	}
}
