if (!("capitalize" in String.prototype)) {
	String.prototype.capitalize = function() { return this.charAt(0).toUpperCase() + this.slice(1); }
}

if (!("contains" in String.prototype)) {
	String.prototype.contains = function(string) { return this.search(string) > -1; }
}
