package network_specific


import grails.transaction.Transactional


@Transactional
class SearchLibraryService {

	def grailsApplication
	def httpDownloadService
	def mathConversionService


	def extractMetadata(xml) {
		def metadata = [
			acquisitionDate: xml.acquisition_date?.text() ?: null,
			azimuthAngle: xml.azimuth_angle?.text() as Double ?: null,
			countryCode: xml.country_code?.text() ?: null,
			filename: xml.filename.text() ?: null,
			height: xml.height?.text() as Integer ?: null,
			imageId: xml.image_id?.text() ?: null,
			indexId: xml.index_id?.text() ?: null,
			numberOfBands: xml.number_of_bands?.text() as Integer ?: null,
			title: xml.title?.text() ?: null,
			width: xml.width?.text() as Integer ?: null
		]

		def footprint = xml.ground_geom?.MultiPolygon?.polygonMember?.Polygon?.outerBoundaryIs?.LinearRing?.coordinates?.text()
		metadata.put("footprint", footprint?.split(" ").collect({ it.split(",").collect({ it as Double}) }) ?: null)


		return metadata
        }

	def processResults(features) {
		def images = []
		features.each() {
			def metadata = extractMetadata(it.raster_entry)

			def image = [:]
			image.indexId = metadata.indexId
			image.imageId = metadata.imageId ?: (metadata.title ?: metadata.filename)
			image.library = "omar"
			image.metadata = metadata
			images.push(image)
		}


		return images
	}

	def searchImageId(image) {
		def queryUrl = grailsApplication.config.libraries["${image.library}"].baseUrl + "/omar/wfs"
		queryUrl += "?filter=" + URLEncoder.encode("image_id LIKE '${image.imageId}%' OR title LIKE '${image.imageId}%'")
		queryUrl += "&maxResults=1&request=getFeature&service=WFS&typeName=omar:raster_entry&version=1.0.0"

		def xml = httpDownloadService.serviceMethod([url: queryUrl])

		def images = xml.featureMember ? processResults(xml.featureMember) : []


		return images[0]
	}

	def searchOmar(params, library) {
		def libraryObject = grailsApplication.config.libraries["${library}"]

		def queryUrl = libraryObject.baseUrl
		queryUrl += "/omar/wfs"

		def filter = ""

		// acquisition date
		def startDate = "${params.startYear}-${params.startMonth}-${params.startDay}T${params.startHour}:${params.startHour}:${params.startSecond}.000"
		def endDate = "${params.endYear}-${params.endMonth}-${params.endDay}T${params.endHour}:${params.endHour}:${params.endSecond}.000"
		filter += "((acquisition_date > ${startDate} AND acquisition_date < ${endDate}) OR acquisition_date IS NULL)"

		filter += " AND "

		// cloud cover
		filter += "(cloud_cover < ${params.maxCloudCover} OR cloud_cover IS NULL)"

		filter += " AND "

		// dwithin
		def deltaDegrees = mathConversionService.convertRadiusToDeltaDegrees(params)
		filter += "DWITHIN(ground_geom,POINT(${params.location.join(" ")}),${deltaDegrees},meters)"

		filter += " AND "

		// niirs
		filter += "(niirs < ${params.minNiirs} OR niirs IS NULL)"

		// sensors
		if (params.sensors.find { it == "all" } != "all") {
			filter += " AND "

			// only search for sensors that are available in the library
			def availableSensors = libraryObject.sensors
			def sensorFilters = []
			params.sensors.each() {
				def sensor = it
				if (sensor == availableSensors.find({ it.name == sensor }).name) { sensorFilters.push("sensor_id ILIKE '%${sensor}%'") }
			}
			sensorFilters.push("sensor_id IS NULL")
			filter += "(${sensorFilters.join(" OR ")})"
		}


		queryUrl += "?filter=" + URLEncoder.encode(filter)

		queryUrl += "&maxResults=${params.maxResults}"
		queryUrl += "&request=getFeature"
		queryUrl += "&service=WFS"
		queryUrl += "&typeName=omar:raster_entry"
		queryUrl += "&version=1.0.0"

		def xml = httpDownloadService.serviceMethod([url: queryUrl])

		def images = xml.featureMember ? processResults(xml.featureMember) : []


		return images
	}

	def serviceMethod(params) {
		def resultsMap = [
			layers: [],
			location: params.location.collect({ it as Double })
		]

		params.libraries.each() { resultsMap.layers += searchOmar(params, it) }


		if (resultsMap.layers.size() > params.maxResults) {
			def howManyToDrop = resultsMap.layers.size() - params.maxResults
			resultsMap.layers = resultsMap.layers.reverse().drop(howManyToDrop).reverse()
		}


		return resultsMap
	}	
}
