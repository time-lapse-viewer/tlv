package time_lapse


class WmsRequest {

	String bbox	
	Date date
	String imageId
	String ipAddress
	String library


	static mapping = {
		date index: "wms_request_date_idx"
		version false
	}
}
