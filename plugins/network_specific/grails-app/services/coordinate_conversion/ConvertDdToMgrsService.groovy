package coordinate_conversion


import grails.transaction.Transactional


@Transactional
class ConvertDdToMgrsService {


	def serviceMethod(latitude, longitude) {
		def K0 = 0.9996
		def A1 = 6378137.0 * K0
		def B1 = 6356752.3142 * K0
		def N0 = 0
		def E0 = 500000

		def N1 = (A1 - B1) / (A1 + B1)
		def N2 = N1 * N1
		def N3 = N2 * N1
		def E2 = ((A1 * A1) - (B1 * B1)) / (A1 * A1) // e^2

		def latitudeRad = latitude * Math.PI / 180
		def longitudeRad = longitude * Math.PI / 180

		def latitudeRadSin = Math.sin(latitudeRad)
		def latitudeRadCos = Math.cos(latitudeRad)
		def latitudeRadCos2 = latitudeRadCos * latitudeRadCos
		def latitudeRadCos3 = latitudeRadCos2 * latitudeRadCos

		def latitudeRadTan = latitudeRadSin / latitudeRadCos
		def latitudeRadTan2 = latitudeRadTan * latitudeRadTan

		def K3 = latitudeRad
		def K4 = latitudeRad

		def meridian = Math.floor(longitude / 6) * 6 + 3
		if (latitude >= 72 && longitude >= 0) {
			if (longitude < 9) { meridian = 3 }
			else if (longitude < 21) { meridian = 15 }
			else if (longitude < 33) { meridian = 27 }
			else if (longitude < 42) { meridian = 39 }
		}
		if(latitude >= 56 && latitude < 64) {
			if (longitude >= 3 && longitude < 12) { meridian = 9 }
		}

		def L0 = meridian * Math.PI / 180  // Long of True Origin (3,9,15 etc)

		// Arc of meridian
		def J3 = K3 * (1 + N1 + 1.25 * (N2 + N3))
		def J4 = Math.sin(K3) * Math.cos(K4) * (3 * (N1 + N2 + 0.875 * N3))
		def J5 = Math.sin(2 * K3) * Math.cos(2 * K4) * (1.875 * (N2 + N3))
		def J6 = Math.sin(3 * K3) * Math.cos(3 * K4) * 35 / 24 * N3
		def M = (J3 - J4 + J5 - J6) * B1

		def temp = 1 - E2 * latitudeRadSin * latitudeRadSin
		def V = A1 / Math.sqrt(temp)
		def R = V * (1 - E2) / temp
		def H2 = V / R - 1

		def P = longitudeRad - L0
		def P2 = Math.pow(P, 2)
		def P4 = Math.pow(P2, 2)
		J3 = M + N0
		J4 = V / 2 * latitudeRadSin * latitudeRadCos
		J5 = V / 24 * latitudeRadSin * latitudeRadCos3 * (5 - latitudeRadTan2 + 9 * H2)
		J6 = V / 720 * latitudeRadSin * latitudeRadCos3 * latitudeRadCos2 * (61 - 58 * latitudeRadTan2 + latitudeRadTan2 * latitudeRadTan2)
		def north = J3 + P2 * J4 + P4 * J5 + P4 * P2 * J6

		def south = latitude < 0
		if (south) { north = north + 10000000.0  /* UTM S hemisphere */ }

		def J7 = V * latitudeRadCos
		def J8 = V / 6 * latitudeRadCos3 * (V / R - latitudeRadTan2)
		def J9 = V / 120 * latitudeRadCos3 * latitudeRadCos2
		J9 = J9 * (5 - 18 * latitudeRadTan2 + latitudeRadTan2 * latitudeRadTan2 + 14 * H2 - 58 * latitudeRadTan2 * H2)

		def east = E0 + P * J7 + P2 * P * J8 + P4 * P * J9
		def iEast = Math.round(east)
		def iNorth = Math.round(north)
		def eastString = Math.abs(iEast).toString()
		def northString = Math.abs(iNorth).toString()

		while (eastString.size() < 7) { eastString = "0" + eastString }
		while (northString.size() < 7) { northString = "0" + northString }

		def GR100km = eastString.substring(1,2) + northString.substring(1, 2) as Integer
		def GRremainder = eastString.substring(2,7) + northString.substring(2, 7)
	
		def lonZone = (meridian - 3) / 6 + 31 as Integer
	
		def GR
	
		if (lonZone % 1 != 0) { GR = "non-UTM central meridian" }
		else { 
			if (iEast < 100000 || latitude < -80 || iEast > 899999 || latitude >= 84) { GR = "outside UTM grid area" }
			else {
				def letters = "ABCDEFGHJKLMNPQRSTUVWXYZ"
				def position = Math.round(latitude / 8 - 0.5) + 10 + 2 as Integer

				def latZone = letters.substring(position, position + 1)
				if (latZone > "X") { latZone = "X" }

				position = Math.round(Math.abs(iNorth) / 100000 - 0.5) as Integer
				while (position > 19) { position -= 20 }

				if (lonZone % 2 == 0) { 
					position += 5
					if (position > 19) { position -= 20 }
				}

				def N100km = letters.substring(position, position + 1)
				position = GR100km / 10 - 1 as Integer

				P = lonZone
				while (P > 3) { P -= 3 }
				position += (P - 1) * 8 as Integer
	
				def E100km = letters.substring(position, position + 1)
				GR = lonZone + latZone + E100km + N100km + GRremainder
			}
		}

	
		return GR
	}
}
