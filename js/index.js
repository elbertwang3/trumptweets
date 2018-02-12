var vis;
var topoffset;
var bottomoffset;


 
 

  $(window).scroll(function() {
  	 
  	console.log(window.pageYOffset)
  	console.log($("#graphic").outerHeight(true));
  	console.log($("#sections").outerHeight(true));
  	topoffset = $("#graphic").position().top
  	 bottomoffset = $("#graphic").position().top + $("#sections").outerHeight(true);
  	 console.log(topoffset);
  	 console.log(bottomoffset);
  	 console.log(window.clientHeight);
  	if (window.pageYOffset >= topoffset && window.pageYOffset <= bottomoffset - window.innerHeight) {
	  	//console.log("GETTING fixed")
	  	d3.select("#vis").classed("is_fixed", true)
	  	d3.select("#vis").classed("is_unfixed", false)
	  	d3.select("#vis").classed("is_bottom", false)
	  	
	  } else if (window.pageYOffset > bottomoffset - window.innerHeight) {
	  	console.log("getting bottom")
	  		d3.select("#vis").classed("is_fixed", false)
	  		d3.select("#vis").classed("is_bottom", true)
	  	}
	  	else {
	  	//console.log("GETTING unfixed")
	  	d3.select("#vis").classed("is_fixed", false)
	  	d3.select("#vis").classed("is_unfixed", true)
	  }
  })