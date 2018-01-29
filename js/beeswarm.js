
var scrollVis = function(greatesthits) {
	console.log("getting here");
	//console.log(greatesthits)
	beeswarmdiv = d3.select('.beeswarm')
	bsmargin = {top: 40, right: 40, bottom: 40, left: 40},
    bswidth = 1000,
    bsheight = 350
    var lastIndex = -1;
  	var activeIndex = 0;


  	var sentimentScale = d3.scaleLinear()
							//.domain(d3.extent(greatesthits, function(d) { return d.sentiment_score; }))
							.range([bsmargin.left, bswidth-bsmargin.right])
	var colorScale = d3.scaleLinear()
		.domain([14,0,-13]).range(["#2161fa","#ffffff","#ff3333"]);


	//retweetextent = d3.extent(greatesthits, function(d) { return d.retweet_count; })
	var beeSize = d3.scaleSqrt()
						//.domain(retweetextent)
						.range([1,15])
	var tooltip = d3.select(".beeswarm")
	    .append("div")
	    .attr("class","tooltip")
	    //.style("transform", "translate(" + margin.left+"px" + "," + margin.top+"px" + ")")
	    .on("click",function(){
	      tooltip.style("visibility",null);
	    });

	

	var activateFunctions = [];
	var updateFunctions = [];

	var chart = function (selection) {
	    selection.each(function (rawData) {
	    	console.log(rawData);
	    	greatesthits = rawData;
		bssvg = beeswarmdiv.append("svg")
			.attr("width", bswidth)
			.attr("height", bsheight)
		greatesthits = greatesthits.filter(function(d) { 
										if (!isNaN(d.sentiment_score)) {


											return d; 
										}
										else {
											//console.log("getting here")
										}
										if (!isNaN(d.retweet_count)) {

											return d; 
										}
										else {
											//console.log("getting here")
										}
										if (d == null) {
											console.log("getting hereNULLLL")
										}
									})

	sentimentScale
						.domain(d3.extent(greatesthits, function(d) { return d.sentiment_score; }))
							//.range([bsmargin.left, bswidth-bsmargin.right])
	


	retweetextent = d3.extent(greatesthits, function(d) { return d.retweet_count; })
	beeSize 
			.domain(retweetextent)

	setupVis(greatesthits);
	setupSections();

	});
	   }

	var setupVis = function(greatesthits) {

	/*var worker = new Worker("js/worker.js");

worker.postMessage({
  greatesthits: greatesthits,

});

worker.onmessage = function(event) {
  if (event.data.type == "end") {
   return ended(event.data);
  }
};*/

	var simulation = d3.forceSimulation(greatesthits)
      .force("x", d3.forceX(function(d) { return sentimentScale(d.sentiment_score); }).strength(1))
      .force("y", d3.forceY(bsheight/2))
      //.force("collide", function(d) { return d3.forceCollide(beeSize(d.retweet_count)); })
      .force("collide", d3.forceCollide().radius(function(d) { return beeSize(d.retweet_count) + 1;   }))
      .stop();

    for (var i = 0; i < 500	; ++i) simulation.tick();
//function ended(data) {

    var cell = bssvg.append("g")
      .attr("class", "cells")
    .selectAll("g").data(d3.voronoi()
        .extent([[-bsmargin.left, -bsmargin.top], [bswidth + bsmargin.right, bsheight + bsmargin.top]])
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
      .polygons(greatesthits)).enter().append("g")
    	.attr("class", "cell-g")
    	 .on("mouseenter", function(d) {
	      	data = d

	      	mouseOverEvents(data,d3.select(this));

	      })
	      .on("mouseleave", function(d) { 
	      	data = d
	      	mouseOutEvents(data,d3.select(this));
	      });
      

      /*var cell = bssvg.append("g")
      .attr("class", "cells")
    .selectAll("g").data(greatesthits).enter().append('g')*/

	  cell.append("circle")
	     .attr("class", "cellcircle")
	      .attr("r", function(d) {  return beeSize(d.data.retweet_count); })
	      .attr("cx", function(d) { return d.data.x; })
	      .attr("cy", function(d) { return d.data.y; })
	      .attr("fill", function(d) { return colorScale(d.data.sentiment_score)})
	    

	   cell.append("path")
      .attr("d", function(d) { return "M" + d.join("L") + "Z"; })




	}
	function mouseOverEvents(data, element) {
		element.select("circle")
			.classed("active", true)
    	tooltip.selectAll("div").remove();

    	var tweetcontainer = tooltip.append("div")
    									.attr("id", "tweet")


    									
    									//.attr("tweetID", function(d) { return data.id_str; })

    	var tweet =  d3.select("#tweet").node()

    	var id = data.data.id_str;
    	 twttr.widgets.createTweet(id, tweet, 
		      {
		        conversation : 'none',    // or all
		        cards        : 'hidden',  // or visible 
		        linkColor    : '#cc0000', // default is blue
		        theme        : 'light'    // or dark
		      })
		    .then (function (el) {
		      //el.contentDocument.querySelector(".footer").style.display = "none";
		   
		    })

		    tooltip
		        	.style("visibility","visible")
				.style("top",function(d){
		            /*if(viewportWidth < 450 || mobile){
		              return "250px";
		            }*/

		            return (data.data.y + 20) +"px"
		          })
		          .style("left",function(d){
		            /*if(viewportWidth < 450 || mobile){
		              return "0px";
		            }*/
		            
		            return (data.data.x - 250)+"px";
		          })
		    
		

    }
    function mouseOutEvents(data,element) {

    		element.select("circle")
			.classed("active", false)
    	tooltip
       		.style("visibility",null)

    	tooltip.selectAll("div").remove();
 

	}
	 var setupSections = function () {
    // activateFunctions are called each
    // time the active section changes
   activateFunctions[0] = showBeeswarm;
activateFunctions[1] = showAndroid;
activateFunctions[2] = showIphone;
activateFunctions[3] = showObama;
activateFunctions[4] = showClinton;
activateFunctions[5] = showCnn;
activateFunctions[6] = transitionScatterTimeOfDay;
activateFunctions[7] = scatterTimeline;

    // updateFunctions are called while
    // in a particular section to update
    // the scroll progress in that section.
    // Most sections do not need to be updated
    // for all scrolling and so are set to
    // no-op functions.
    for (var i = 0; i < 9; i++) {
      updateFunctions[i] = function () {};
    }
    updateFunctions[7] = updateCough;
  };
	  /**
   * activate -
   *
   * @param index - index of the activated section
   */
  chart.activate = function (index) {
    activeIndex = index;
    var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(function (i) {
      activateFunctions[i]();
    });
    lastIndex = activeIndex;
  };

  /**
   * update
   *
   * @param index
   * @param progress
   */
  chart.update = function (index, progress) {
    updateFunctions[index](progress);
  };
	return chart;
};




d3.queue()
    .defer(d3.csv, "data/greatesthits.csv", type)
    .await(display);

function display(error,greatesthits) {
	console.log("ready")
	var plot = scrollVis();

	  d3.select('#vis')
	    .datum(greatesthits)
	    .call(plot);

   	  var scroll = scroller()
    .container(d3.select('#graphic'));

     scroll(d3.selectAll('.step'));


       scroll.on('active', function (index) {
    // highlight current step text
    d3.selectAll('.step')
      .style('opacity', function (d, i) { return i === index ? 1 : 0.1; });

    // activate current section
    plot.activate(index);
  });
        scroll.on('progress', function (index, progress) {
    plot.update(index, progress);
  });
}



     
	   

//}
	

	



function type(d) {

  d.sentiment_score = +d.sentiment_score;
  d.favorite_count = +d.favorite_count;
  d.retweet_count = +d.retweet_count;
  d.date_created = d.date_created.slice(0,10)
  d.time_created = d.time_created.slice(11,19)


  return d;
}