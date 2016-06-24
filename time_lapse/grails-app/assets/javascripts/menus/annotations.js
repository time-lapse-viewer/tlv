function anAnnotationHasBeenAdded() {}

function drawAnnotation(type) {
	if (getCurrentDimension() == 3) { displayErrorDialog("Annotations can only be added in 2D. :("); }
	else { drawAnnotationMap(type); }
}
