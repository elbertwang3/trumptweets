  var vis = document.getElementById("vis")
  var visstyle = vis.style;
  var topoffset = vis.getBoundingClientRect().top
  

  $(window).scroll(function() {
  	//console.log(window.pageYOffset)
  	//console.log(window.pageYOffset)
  	if (window.pageYOffset >= 1723) {

	  	//console.log("GETTING fixed")
	  	d3.select("#vis").classed("is_fixed", true)
	  	d3.select("#vis").classed("is_unfixed", false)
	  	
	  } else {
	  	//console.log("GETTING unfixed")
	  	d3.select("#vis").classed("is_fixed", false)
	  	d3.select("#vis").classed("is_unfixed", true)
	  }
  })