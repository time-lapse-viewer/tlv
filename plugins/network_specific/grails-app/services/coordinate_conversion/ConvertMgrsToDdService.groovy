package coordinate_conversion


import grails.transaction.Transactional


@Transactional
class ConvertMgrsToDdService {


	def serviceMethod(one, two, three, four, five, six) {
		def zone = one
		def zdl = two
		def c1 = three
		def c2 = four
		def E = five
		def N = six

		def u = [:]
		if (zone < 1 || zone > 60 || Math.round(zone) != zone) { return [error: "Invalid Zone"] }
		u.zone = zone
	
		def mgrsChars = "ABCDEFGHJKLMNPQRSTUVWXYZ"
		def n1 = mgrsChars.indexOf(c1)
		def n2 = mgrsChars.indexOf(c2)
		if (n1 < 0 || n2 < 0) { return [error: "Invalid MGRS square characters"]}

		def E0 = 1 + n1 % 8
		def N0 = (20 + n2 - ((zone % 2) ? 0 : 5)) % 20

		def zdlMedianLat 
		def utmZdlChars = "CDEFGHJKLMNPQRSTUVWXX"
		def i = utmZdlChars.indexOf(zdl)
		if (zdl == "X") { zdlMedianLat = 78  /* not 76; X is 72 to 84 */ }
		else if (i < 0) { return [error: "Invalid zone designation letter ${zdl}"] }
		else { zdlMedianLat = -76 + 8 * i }
		def approxN = zdlMedianLat * 100 / 90 // approx median northing of zdl in units of 100km
	
		// add a multiple of 2000km to get the MGRS square closest to approxN (letters repeat every 20*100km=2000km)
		N0 += Math.round((approxN - N0) / 20) * 20  
		u.E = E0 * 100000 + E
		u.N = N0 * 100000 + N
	
		def s = (u.N < 0) ? "S" : "N"
		if (u.N < 0) { u.N += 10000000 }
	
		def x = u.E
		def y = u.N
		def southhemi
		if (u.zone < 1 || 60 < u.zone) { return [error: "The UTM zone you entered is out of range. Enter a number between 1 and 60."] }
	
		def lonZone = one
		def latZone = two
		if ("CDEFGHJKLM".contains(latZone)) { southhemi = true }
		else { southhemi = false }


		def UTMScaleFactor = 0.9996

		x -= 500000.0
		x /= UTMScaleFactor

		// If in southern hemisphere, adjust y accordingly.
		if (southhemi) { y -= 10000000.0 }
		y /= UTMScaleFactor

		def cmeridian = (-183.0 + u.zone * 6) * Math.PI / 180
	
		// Get the value of phif, the footpoint latitude.
	
		// Ellipsoid model constants (actual values here are for WGS84)
		def sm_a = 6378137.0
		def sm_b = 6356752.314
		def sm_EccSquared = 6.69437999013e-03
	
		// Precalculate n (Eq. 10.18)
		def n = (sm_a - sm_b) / (sm_a + sm_b);
	
		// Precalculate alpha (Eq. 10.22) (Same as alpha in Eq. 10.17)
		def alpha = (sm_a + sm_b) / 2.0 * (1 + Math.pow(n, 2) / 4 + Math.pow(n, 4) / 64)
	
		// Precalculate yTemp (Eq. 10.23)
		def yTemp = y / alpha
	
		// Precalculate beta (Eq. 10.22)
		def beta = 3 * n / 2 + -27 * Math.pow(n, 3) / 32 + 269 * Math.pow(n, 5) / 512
	
		// Precalculate gamma (Eq. 10.22)
		def gamma = 21 * Math.pow(n, 2) / 16 + -55 * Math.pow(n, 4) / 32
	
		// Precalculate delta (Eq. 10.22)
		def delta = 151 * Math.pow(n, 3) / 96 - 417 * Math.pow(n, 5) / 128
	
		// Precalculate epsilon_ (Eq. 10.22)
		def epsilon = 1097 * Math.pow(n, 4) / 512
	
		// Now calculate the sum of the series (Eq. 10.21)
		def phif = yTemp + beta * Math.sin(2 * yTemp) + gamma * Math.sin(4 * yTemp) + delta * Math.sin(6 * yTemp) + epsilon * Math.sin(8 * yTemp)
	
	
		// Precalculate ep2
		def ep2 = (Math.pow(sm_a, 2) - Math.pow(sm_b, 2)) / Math.pow(sm_b, 2)
	
		// Precalculate cos (phif)
		def cf = Math.cos(phif)
	
		// Precalculate nuf2
		def nuf2 = ep2 * Math.pow(cf, 2)
	
		// Precalculate Nf and initialize Nfpow
		def Nf = Math.pow(sm_a, 2) / (sm_b * Math.sqrt(1 + nuf2));
		def Nfpow = Nf
	
		// Precalculate tf
		def tf = Math.tan(phif)
		def tf2 = tf * tf
		def tf4 = tf2 * tf2
	
		// Precalculate fractional coefficients for x**n in the equations below to simplify the expressions for latitude and longitude.
		def x1frac = 1 / (Nfpow * cf)
	
		Nfpow *= Nf  // now equals Nf**2
		def x2frac = tf / (2 * Nfpow)
	
		Nfpow *= Nf   // now equals Nf**3
		def x3frac = 1 / (6 * Nfpow * cf)
	
		Nfpow *= Nf   // now equals Nf**4
		def x4frac = tf / (24 * Nfpow)
	
		Nfpow *= Nf   // now equals Nf**5
		def x5frac = 1 / (120 * Nfpow * cf)
	
		Nfpow *= Nf   // now equals Nf**6
		def x6frac = tf / (720 * Nfpow)
	
		Nfpow *= Nf   // now equals Nf**7
		def x7frac = 1 / (5040 * Nfpow * cf)
	
		Nfpow *= Nf   // now equals Nf**8
		def x8frac = tf / (40320 * Nfpow)
	
		// Precalculate polynomial coefficients for x**n. x**1 does not have a polynomial coefficient.
		def x2poly = -1 - nuf2
		def x3poly = -1 - 2 * tf2 - nuf2
		def x4poly = 5 + 3 * tf2 + 6 * nuf2 - 6 * tf2 * nuf2 - 3 * nuf2 * nuf2 - 9 * tf2 * nuf2 * nuf2
		def x5poly = 5 + 28 * tf2 + 24 * tf4 + 6 * nuf2 + 8 * tf2 * nuf2
		def x6poly = -61 - 90 * tf2 - 45 * tf4 - 107 * nuf2 + 162 * tf2 * nuf2
		def x7poly = -61 - 662 * tf2 - 1320 * tf4 - 720 * tf4 * tf2
		def x8poly = 1385 + 3633 * tf2 + 4095 * tf4 + 1575 * tf4 * tf2
	
		// Calculate latitude
		def latitude = phif + x2frac * x2poly * x * x + x4frac * x4poly * Math.pow(x, 4) + x6frac * x6poly * Math.pow(x, 6) + x8frac * x8poly * Math.pow(x, 8)
		latitude *= 180 / Math.PI
	
		// Calculate longitude
		def longitude = cmeridian + x1frac * x + x3frac * x3poly * Math.pow(x, 3) + x5frac * x5poly * Math.pow(x, 5) + x7frac * x7poly * Math.pow(x, 7)
		longitude *= 180 / Math.PI
	

		return [latitude: latitude, longitude: longitude]
	}
}
