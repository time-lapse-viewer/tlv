package time_lapse


class ImagerySearch {

	Date date
	Date endDate
	String ipAddress
	String library
	String location
	Integer maxCloudCover
	Integer maxResults
	Double minNiirs
	String sensors
	Date startDate	
	String tailoredGeoint


	static constraints = {
		date()
		location()
		library()
		startDate()
		endDate()
		sensors()
		ipAddress()

		tailoredGeoint(display: false, nullable: true)
	}

	static mapping = {
		date index: "imagery_search_date_idx"
		version false
	}
}
