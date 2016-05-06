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
			acquisitionType: xml.acquisitionType?.text() ?: null,
			ageDyas: xml.ageDays?.text().isNumber() ? xml.ageDays.text() as Integer : null,
			antenaLookDirection: xml.antenaLookDirection?.text() ?: null,
			assetName: xml.assetName?.text() ?: null,
			assetType: xml.assetType?.text() ?: null,
			beamMode: xml.beamMode?.text() ?: null,
			ce90Accuracy: xml.CE90Accuracy?.text() ?: null,
			cloudCover: xml.cloudCover?.text().isNumber() ? xml.cloudCover.text() as Double : null,
			colorBandOrder: xml.colorBandOrder?.text() ?: null,
			companyName: xml.companyName?.text() ?: null,
			copyright: xml.copyright?.text() ?: null,
			crsFromPixels: xml.crsFromPixels?.text() ?: null,
			dataLayer: xml.dataLayer?.text() ?: null,
			earliestAcquisitionDate: xml.earliestAcquisitionDate?.text() ?: null,
			factoryOrderNumber: xml.factoryOrderNumber?.text() ?: null,
			featureId: xml.featureId?.text() ?: null,
			formattedDate: xml.formattedDate?.text() ?: null,
			groundSampleDistance: xml.groundSampleDistance?.text().isNumber() ? xml.groundSampleDistance?.text() as Double : null,
			groundSampleDistanceUnit: xml.groundSampleDistanceUnit?.text() ?: null,
			incidenceAngleVariation: xml.incidenceAngleVariation?.text().isNumber() ? xml.incidenceAngleVariation?.text() as Double : null,
			ingestDate: xml.ingestDate?.text() ?: null,
			isBrowse: xml.isBrowse?.text() ?: null,
			isMirrored: xml.isMirrored?.text() ?: null,
			isMultipleWkb: xml.isMultipleWKB?.text() ?: null,
			latestAcquisitionDate: xml.latestAcquisitionDate?.text() ?: null,
			legacyDescription: xml.legacyDescription?.text() ?: null,
			legacyId: xml.legacyId?.text() ?: null,
			licenseType: xml.licenseType?.text() ?: null,
			maximumIncidenceAngle: xml.maximumIncidenceAngle?.text().isNumber() ? xml.maximumIncidenceAngle?.text() as Double : null,
			minimumIncidenceAngle: xml.minimumIncidenceAngle?.text().isNumber() ? xml.minimumIncidenceAngle?.text() as Double : null,
			niirs: xml.niirs?.text().isNumber() ? xml.niirs?.text() as Double : null,
			offNadirAngle: xml.offNadirAngle?.text().isNumber() ? xml.offNadirAngle?.text() as Double : null,
			orbitDirection: xml.orbitDirection?.text() ?: null,
			outputMosaic: xml.outputMosaic?.text() ?: null,
			perPixelX: xml.perPixelX?.text().isNumber() ? xml.perPixelX?.text() as Double : null,
			perPixelY:xml.perPixelY?.text().isNumber() ? xml.perPixelY?.text() as Double : null,
			perciseGeometry: xml.perciseGeometry?.text() ?: null,
			pixelsIngested: xml.pixelsIngested?.text() ?: null,
			polarisationChannel: xml.polarisationChannel?.text() ?: null,
			polarisationMode: xml.polarisationMode?.text() ?: null,
			productType: xml.productType?.text() ?: null,
			rmseAccuracy: xml.RMSEAccuracy?.text() ?: null,
			sensorType: xml.sensorType?.text() ?: null,
			spatialAccuracy: xml.spatialAccuracy?.text() ?: null,
			source: xml.source?.text() ?: null,
			sourceUnit: xml.sourceUnit?.text() ?: null,
			sunAzimuth: xml.sunAzimuth?.text().isNumber() ? xml.sunAzimuth?.text() as Double : null,
			sunElevation: xml.sunElevation?.text().isNumber() ? xml.sunElevation?.text() as Double : null,
			url: xml.url?.text() ?: null,
			vendorName: xml.vendorName?.text() ?: null,
			vendorReference: xml.vendorReference?.text() ?: null,
			verticalAccuracy: xml.verticalAccuracy?.text().isNumber() ? xml.verticalAccuracy?.text() as Double : null
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
			image.indexId = metadata.featureId
			image.imageId = metadata.featureId
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
//		def startDate = "${params.startYear}-${params.startMonth}-${params.startDay}T${params.startHour}:${params.startHour}:${params.startSecond}.000"
//		def endDate = "${params.endYear}-${params.endMonth}-${params.endDay}T${params.endHour}:${params.endHour}:${params.endSecond}.000"
//		filter += "(acquisitionDate > ${startDate} AND acquisitionDate < ${endDate})"

//		filter += " AND "

		// bbox
		def deltaDeg = mathConversionService.convertRadiusToDeltaDegrees(params)
		def location = params.location.collect({ it as Double })
		//filter += "BBOX=${location[0] - deltaDeg},${location[1] - deltaDeg},${location[0] + deltaDeg},${location[1] + deltaDeg}"

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

		queryUrl += "?bbox=${location[0] - deltaDeg},${location[1] - deltaDeg},${location[0] + deltaDeg},${location[1] + deltaDeg}"
		queryUrl += "&connectid=${library.connectId}"
//		queryUrl += "&filter=" + URLEncoder.encode(filter)

		queryUrl += "&maxResults=${params.maxResults}"
		queryUrl += "&request=GetFeature"
		queryUrl += "&service=WFS"
		queryUrl += "&sortby=acquisitionDate%20D"
		queryUrl += "&typeName=DigitalGlobe:FinishedFeature"
		queryUrl += "&version=1.0.0"
println queryUrl

		def xml = httpDownloadService.serviceMethod([password: library.password, url: queryUrl, username: library.username])

		def images = xml.featureMember ? processResults(xml.featureMember) : []


		return images
	}
}
