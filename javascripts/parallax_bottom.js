$(document).ready(function(){
	$('.parallax-bottom').plaxify({"xRange":10, "yRange":10, "invert":true});
	if ($('.parallax-top').length) {
		$.plax.enable();
	} else {
		$.plax.enable({ "activityTarget" : $('.app-footer') });
	}
});
