  var vis = document.getElementById("vis")
  var visstyle = vis.style;
  var topoffset = vis.getBoundingClientRect().top
  

  $(window).scroll(function() {
  	console.log(window.pageYOffset)
  	//console.log(window.pageYOffset)
  	if (window.pageYOffset >= 2399 && window.pageYOffset <= 12869) {
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