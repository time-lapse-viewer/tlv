if (!("capitalize" in String.prototype)) {
	String.prototype.capitalize = function() { return this.charAt(0).toUpperCase() + this.slice(1); }
}

if (!("contains" in Array.prototype)) {
	Array.prototype.contains = function(value) {
		for (var i = 0; i < this.length; i++) {
			if(this[i] === value) { return true; }
    		}
    

		return false;
	}
}

if (!("contains" in String.prototype)) {
	String.prototype.contains = function(string) { return this.search(string) > -1; }
}

if (!("unique" in Array.prototype)) {
	Array.prototype.unique = function() {
		var array = [];
		for (var i = 0; i < this.length; i++) {
			if(!array.contains(this[i])) {
				array.push(this[i]);
			}
		}


		return array; 
	}
}
