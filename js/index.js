var vis;
var topoffset;
var bottomoffset;

$(document).ready(function() { 
 	vis = document.getElementById("graphic")
  topoffset = vis.getBoundingClientRect().top + 132.9375
  bottomoffset = vis.getBoundingClientRect().bottom
  console.log(window.pageYOffset);
  console.log(topoffset);
  console.log(bottomoffset);
})

 
 

  $(window).scroll(function() {
  	 
  	console.log(window.pageYOffset)
  	if (window.pageYOffset >= topoffset && window.pageYOffset <= 12869) {
	  	//console.log("GETTING fixed")
	  	d3.select("#vis").classed("is_fixed", true)
	  	d3.select("#vis").classed("is_unfixed", false)
	  	d3.select("#vis").classed("is_bottom", false)
	  	
	  } else if (window.pageYOffset > 12869) {

	  		d3.select("#vis").classed("is_fixed", false)
	  		d3.select("#vis").classed("is_bottom", true)
	  	}
	  	else {
	  	//console.log("GETTING unfixed")
	  	d3.select("#vis").classed("is_fixed", false)
	  	d3.select("#vis").classed("is_unfixed", true)
	  }
  })