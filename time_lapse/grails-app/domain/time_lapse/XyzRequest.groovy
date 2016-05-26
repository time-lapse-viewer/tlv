package time_lapse


class XyzRequest {
	
	Date date
	String imageId
	String ipAddress
	String library
	Integer x
	Integer y
	Integer z


	static mapping = {
		date index: "xyz_request_date_idx"
		version false
	}
}
