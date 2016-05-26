package time_lapse


import grails.transaction.Transactional


@Transactional
class LogsService {
		

	def getIpAddress(request) { return request.getHeader("client-ip") ?: 0 }

	def recordWmsRequest(params, request) {
		new WmsRequest(
			bbox: params.BBOX,
			date: new Date(),
			imageId: params.IMAGE_ID,
			ipAddress: getIpAddress(request),
                        library: params.LIBRARY	
		).save()
	}

	def recordXyzRequest(params, request) {
		new XyzRequest(
			date: new Date(),
			imageId: params.IMAGE_ID,
			ipAddress: getIpAddress(request),
			library: params.LIBRARY,
			x: params.X,
			y: params.Y,
			z: params.Z
		).save()
	}
}
