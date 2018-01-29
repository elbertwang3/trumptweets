  var vis = document.getElementById("vis")
  console.log(vis);
  var visstyle = vis.style;
  console.log(vis.getBoundingClientRect)
  var topoffset = vis.getBoundingClientRect().top
  console.log(topoffset);
  

  $(window).scroll(function() {
  	//console.log(window.pageYOffset)
  	if (window.pageYOffset >= 1807.25) {
	  	console.log("GETTING fixed")
	  	d3.select("#vis").classed("is_fixed", true)
	  	d3.select("#vis").classed("is_unfixed", false)
	  	
	  } else {
	  	console.log("GETTING unfixed")
	  	d3.select("#vis").classed("is_fixed", false)
	  	d3.select("#vis").classed("is_unfixed", true)
	  }
  })