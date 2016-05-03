package network_specific


import grails.transaction.Transactional


@Transactional
class SearchDigitalGlobeService {

	def grailsApplication
	def httpDownloadService
	def mathConversionService


	def extractMetadata(xml) {
		def metadata = [
			acquisitionDate: xml.acquisitionDate?.text() ?: null,
			cloudCover: xml.cloudCover?.text().isNumber() ? xml.cloudCover.text() as Double : null,
			filename: xml.filename.text() ?: null,
			imageId: xml.imageId?.text() ?: null,
			indexId: xml.featureId?.text() ?: null,
			numberOfBands: xml.colorBandOrder?.text().toCharArray().size() > 0 ? xml.colorBandOrder?.text().toCharArray().size() : null,
			title: xml.title?.text() ?: null
		]

		def footprint = xml.geometry?.Polygon?.outerBoundaryIs?.LinearRing?.coordinates?.text()
		metadata.put("footprint", footprint ? footprint?.split(" ").collect({ it.split(",").collect({ it as Double}) }) : null)


		return metadata
        }

	def processResults(features) {
		def images = []
		features.each() {
			def metadata = extractMetadata(it.FinishedFeature)

			def image = [:]
			image.indexId = metadata.indexId
			image.imageId = metadata.indexId
			image.library = "digitalGlobe"
			image.metadata = metadata
			images.push(image)
		}


		return images
	}

	def searchImageId(image) {
		def library = grailsApplication.config.libraries["${image.library}"]		

//		def queryUrl = library.baseUrl + "/catalogservice/wfsaccess"
//		queryUrl += "?connectid=" + library.connectId
//		queryUrl += "&filter=" + URLEncoder.encode("image_id LIKE '${image.imageId}%' OR title LIKE '${image.imageId}%'")
//		queryUrl += "&maxResults=1&request=getFeature&service=WFS&typeName=omar:raster_entry&version=1.0.0"

//SERVICE=WFS&REQUEST=GetFeature&maxFeatures=25&typeName=DigitalGlobe:FinishedFeature&VERSION=1.1.0


//		def xml = httpDownloadService.serviceMethod([url: queryUrl])

//		def images = xml.featureMember ? processResults(xml.featureMember) : []


//		return images[0]
	}

	def searchLibrary(params) {
		def library = grailsApplication.config.libraries.digitalGlobe

		def queryUrl = library.baseUrl
		queryUrl += "/catalogservice/wfsaccess"

		def filter = ""

		// acquisition date
		def startDate = "${params.startYear}-${params.startMonth}-${params.startDay}T${params.startHour}:${params.startHour}:${params.startSecond}.000"
		def endDate = "${params.endYear}-${params.endMonth}-${params.endDay}T${params.endHour}:${params.endHour}:${params.endSecond}.000"
		filter += "(acquisitionDate > ${startDate} AND acquisitionDate < ${endDate})"

		filter += " AND "

		// bbox
		def deltaDeg = mathConversionService.convertRadiusToDeltaDegrees(params)
		def location = params.location.collect({ it as Double })
		filter += "BBOX=${location[0] - deltaDeg},${location[1] - deltaDeg},${location[0] + deltaDeg},${location[1] + deltaDeg}"

		filter += " AND "

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

		queryUrl += "&connectid=${library.connectId}"
		queryUrl += "&filter=" + URLEncoder.encode(filter)

		queryUrl += "&maxResults=${params.maxResults}"
		queryUrl += "&request=GetFeature"
		queryUrl += "&service=WFS"
		queryUrl += "&typeName=DigitalGlobe:FinishedFeature"
		queryUrl += "&version=1.0.0"
println queryUrl

		def xml = httpDownloadService.serviceMethod([password: library.password, url: queryUrl, username: library.username])

		def images = xml.featureMember ? processResults(xml.featureMember) : []


		return images
	}
}
