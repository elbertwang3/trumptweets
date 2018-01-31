
var scrollVis = function(greatesthits) {
	console.log("getting here");
	//console.log(greatesthits)
	beeswarmdiv = d3.select('.beeswarm')
	bsmargin = {top: 40, right: 40, bottom: 40, left: 40},
    bswidth = 1000,
    bsheight = window.innerHeight,
    scatterwidth = 1000,
    scatterheight = window.innerHeight
    var lastIndex = -1;
  	var activeIndex = 0;
  	console.log(window.innerWidth);
  	console.log(window.innerHeight);
  	var parseDate = d3.timeParse("%Y-%m-%d")
	var parseTime = d3.timeParse("%H:%M:%S")
  	var sentimentScale = d3.scaleLinear()
							//.domain(d3.extent(greatesthits, function(d) { return d.sentiment_score; }))
							.range([bsmargin.left, bswidth-bsmargin.right])
	var colorScale = d3.scaleLinear()
		.domain([14,0,-13]).range(["#003366","#ffffff","#8b0000"]);


	var timeofdayScale = d3.scaleTime()
					//.domain([d3.extent(greatesthits, function(d) { return parseTime(['time_created']); })])
					.range([scatterheight - bsmargin.bottom, bsmargin.top])
	var dateScale = d3.scaleTime()
					//.domain([d3.extent(greatesthits, function(d) { return d['date_created']; })])
					.range([scatterheight - bsmargin.bottom, bsmargin.top])


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
	var simulation;
	var cells;
	var cell;
	var cellCircle;
	var voronoi;
	var bssvg;

	var chart = function (selection) {
	    selection.each(function (rawData) {
	    	console.log(rawData);
	    	greatesthits = rawData;
			bssvg = beeswarmdiv.append("svg")
				.attr("width", bswidth)
				.attr("height", bsheight)

			var defs = bssvg.append("svg:defs")
			defs
			    .append("marker")    // This section adds in the arrows
			    .attr("id", "arrow-head")
			    .attr("viewBox", "0 -5 10 10")
			    .attr("refX", 0)
			    .attr("refY", 0)
			    .attr("markerWidth", 5)
			    .attr("markerHeight", 3)
			    .attr("orient", "auto")
			    .append("path")
			    .attr("d", "M0,-5L10,0L0,5")
			    .attr("fill","#808080");



		greatesthits = greatesthits.filter(function(d) { 
						if (!isNaN(d.sentiment_score)) {
							return d; 
						}
						else {
						}
						if (!isNaN(d.retweet_count)) {

							return d;  
						}
						else {
							console.log("getting here")
							console.log(d);
						}
						if (d == null) {
							console.log("getting hereNULLLL")
						}
					})

		sentimentScale.domain(d3.extent(greatesthits, function(d) { return d.sentiment_score; }))
		retweetextent = d3.extent(greatesthits, function(d) { return d.retweet_count; })
		beeSize.domain(retweetextent)
		
		timeofdayScale
					.domain([parseTime("00:00:00"), parseTime("23:59:59")])
		dateScale
					.domain([d3.extent(greatesthits, function(d) { return d['date_created']; })])


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

	 var chartAnnotation = bssvg.append("g")
             //.attr("transform", "translate(" + bsmargin.left + "," + bsmargin.top + ")")
             .attr("class","swarm-annotation");

	simulation = d3.forceSimulation(greatesthits)
	 //.velocityDecay(0.2)
      .force("x", d3.forceX(function(d) { return sentimentScale(d.sentiment_score); }).strength(1))
      .force("y", d3.forceY(bsheight/2))
      //.force("collide", function(d) { return d3.forceCollide(beeSize(d.retweet_count)); })
      .force("collide", d3.forceCollide().radius(function(d) { return beeSize(d.retweet_count) + 1;   }))
          //.on('tick', ticked);
      .stop()
   
      


   for (var i = 0; i < 500; ++i) {
    	console.log("tick")
    	simulation.tick();
    }
//function ended(data) {

	voronoi = d3.voronoi()
        .extent([[-bsmargin.left, -bsmargin.top], [bswidth + bsmargin.right, bsheight + bsmargin.top]])
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
    
    cells = bssvg.append("g")
      .attr("class", "cells")
    cell = cells.selectAll("g").data(voronoi
      .polygons(greatesthits))
    	.enter()
    	.append("g")
    	.attr("class", "cell-g")
    	 .on("mouseenter", function(d) {
	      	data = d
	      	mouseOverEvents(data,d3.select(this));

	      })
	      .on("mouseleave", function(d) { 
	      	data = d
	      	mouseOutEvents(data,d3.select(this));
	      });
      
      console.log(cell);

      /*var cell = bssvg.append("g")
      .attr("class", "cells")
    .selectAll("g").data(greatesthits).enter().append('g')*/
     chartAnnotation.append("line")
        	.attr("class", "dividing-line")
        	.attr("x1",0)
          	.attr("x2",bswidth)
          	.attr("y1",bsheight/2)
          	.attr("y2",bsheight/2)
	cellCircle = cell.append("circle")
	     .attr("class", "cellcircle")
	       .attr('r', 0)
	      //.attr("r", function(d) {  return beeSize(d.data.retweet_count); })
	      .attr("cx", function(d) {  return d.data.x; })
	      .attr("cy", function(d) { return d.data.y; })
	      .attr("fill", function(d) { return colorScale(d.data.sentiment_score)})
	      .attr("opacity", 0)
	
	cellCircle.transition()
		.delay(1000)
		.duration(1000)
		.attr("r", function(d) {  return beeSize(d.data.retweet_count); }) 

	cell.append("path")
	  .attr('class', 'voronoi')
      .attr("d", function(d) { return "M" + d.join("L") + "Z"; })

 

      
        chartAnnotation.append("line")
          	.attr("x1",bswidth-240)
          	.attr("x2",bswidth-60)
          	.attr("y1",bsheight-35)
          	.attr("y2",bsheight-35)
          	.attr("class","annotation-line")
          	.attr("marker-end", function(d){
            	return "url(#arrow-head)"
         	});

        chartAnnotation.append("text")
            .attr("x",bswidth-60)
            .attr("y",bsheight-50)
            .attr("class","annnotation-text")
            .text(function(d){
            	return "More Positive Sentiment"
            }).attr("text-anchor", "start");

         chartAnnotation.append("line")
          	.attr("x1",200)
          	.attr("x2",20)
          	.attr("y1",40)
          	.attr("y2",40)
          	.attr("class","annotation-line")
          	.attr("marker-end", function(d){
            	return "url(#arrow-head)"
         	});

        chartAnnotation.append("text")
            .attr("x",200)
            .attr("y",25)
            .attr("class","annnotation-text")
            .text(function(d){
            	return "More Negative Sentiment"
            }).attr("text-anchor", "end");


        average = d3.mean(greatesthits, function(d) { return d['sentiment_score'];})
        console.log(average);
        
        averageAnnotation = bssvg.append('g')
        				.attr("class", "average-annotation")
        avg = averageAnnotation.selectAll("g")
        	.data([average])
        	.enter()
        avg.append("line")
        	.attr("x1",function(d) { return sentimentScale(d)})
          	.attr("x2",function(d) { return sentimentScale(d)})
          	.attr("y1",bsmargin.top)
          	.attr("y2",bsheight-bsmargin.bottom)
          	.attr("class", "average-line")

        avg.append('text')
        	.attr("x",function(d) { return sentimentScale(d)})
          	.attr("y",30)
          	.text("average")
          	.attr("class", "average-text-label")
          	.attr("text-anchor", "middle")



       
        function ticked() {
        	cellCircle
        	.attr("cx", function(d) {  return d.data.x; })
	      	.attr("cy", function(d) { return d.data.y; })
        }










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
		activateFunctions[0] = showAnno;
		activateFunctions[1] = showBeeswarm;
		activateFunctions[2] = showBeforePhoneSwitch;
 		activateFunctions[3] = showAndroid;
		activateFunctions[4] = showIphone;
		activateFunctions[5] = showObama;
		activateFunctions[6] = showClinton;
		activateFunctions[7] = showCnn;
		activateFunctions[8] = searchTerm;
		activateFunctions[9] = transitionScatterTimeOfDay;
		activateFunctions[10] = scatterTimeline;
		


    // updateFunctions are called whilec
    // in a particular section to update
    // the scroll progress in that section.
    // Most sections do not need to be updated
    // for all scrolling and so are set to
    // no-op functions.
    for (var i = 0; i < 9; i++) {
      updateFunctions[i] = function () {};
    }
    //updateFunctions[7] = updateCough;
  };

  function showAnno() {

  }
  function showBeeswarm() {

  	bssvg.selectAll(".cellcircle")
  		.transition()
  		.duration(1500)
  		.attr("opacity", 1)

  	bssvg.selectAll(".cellcircle")
  		.classed("unselected", false)
  	bssvg.selectAll(".cellcircle")
  		.classed("selected", false)

  	mean = d3.mean(greatesthits, function(d) { return d['sentiment_score'];})
  	buildAverage(mean);

  }

  function showBeforePhoneSwitch() {

  	

  	bssvg.selectAll(".cellcircle")
  		.classed("unselected", false)
  	bssvg.selectAll(".cellcircle")
  		.classed("selected", false)
  	bssvg.selectAll(".cellcircle")
  		.filter(function(d) { return d.data['date_created'] < parseDate('2017-05-01')})
  		.classed("selected", true)
  		
  	bssvg.selectAll(".cellcircle")
  		.filter(function(d) { return d.data['date_created'] >= parseDate('2017-05-01')})
  		.classed("unselected", true)  

  	oldtweets = greatesthits.filter(function(d) { return d['date_created'] < parseDate('2017-05-01'); })
  	oldmean = d3.mean(oldtweets, function(d) { return d['sentiment_score'];})
  	buildAverage(oldmean);
  }
  function showAndroid() {
  	bssvg.selectAll(".cellcircle")
  		.classed("unselected", false)
  	bssvg.selectAll(".cellcircle")
  		.classed("selected", false)
  	bssvg.selectAll(".cellcircle")
  		.filter(function(d) { return d.data['date_created'] < parseDate('2017-05-01') && d.data['source'] == 'Twitter for Android'})
  		.classed("selected", true)
  		
  	bssvg.selectAll(".cellcircle")
  		.filter(function(d) { return d.data['date_created'] >= parseDate('2017-05-01') || d.data['source'] != 'Twitter for Android'})
  		.classed("unselected", true)

 

 

   	androidonly = greatesthits.filter(function(d) { return d['date_created'] < parseDate('2017-05-01') && d['source'] == 'Twitter for Android' })
  	androidmean = d3.mean(androidonly, function(d) { return d['sentiment_score'];})
  	buildAverage(androidmean);
   
     
  }
  function showIphone() {
  	bssvg.selectAll(".cellcircle")
  		.classed("unselected", false)
  	bssvg.selectAll(".cellcircle")
  		.classed("selected", false)

  	bssvg.selectAll(".cellcircle")
  		.filter(function(d) { return d.data['date_created'] < parseDate('2017-05-01') && d.data['source'] == 'Twitter for iPhone'})
  		.classed("selected", true)

  		
  	bssvg.selectAll(".cellcircle")
  		.filter(function(d) { return  d.data['date_created'] >= parseDate('2017-05-01') || d.data['source'] != 'Twitter for iPhone'})
  		.classed("unselected", true)

  	iphoneonly = greatesthits.filter(function(d) { return d['date_created'] < parseDate('2017-05-01') && d['source'] == 'Twitter for iPhone' })
  	iphonemean = d3.mean(iphoneonly, function(d) { return d['sentiment_score'];})
  	buildAverage(iphonemean);
  }
  function showObama() {
  	bssvg.selectAll(".cellcircle")
  		.classed("unselected", false)
  	bssvg.selectAll(".cellcircle")
  		.classed("selected", false)

  	bssvg.selectAll(".cellcircle")
  		.filter(function(d) { return d.data['text'].indexOf('Obama') !== -1; })
  		.classed("selected", true)

  		
  	bssvg.selectAll(".cellcircle")
  		.filter(function(d) { return d.data['text'].indexOf('Obama') == -1; })
  		.classed("unselected", true)

  	obamaonly = greatesthits.filter(function(d) {  return d['text'].indexOf('Obama') !== -1; })
  	obamamean = d3.mean(obamaonly, function(d) { return d['sentiment_score'];})
  	buildAverage(obamamean);


  }
  function showClinton() {
  	bssvg.selectAll(".cellcircle")
  		.classed("unselected", false)
  	bssvg.selectAll(".cellcircle")
  		.classed("selected", false)
  	bssvg.selectAll(".cellcircle")
  		.filter(function(d) { return d.data['text'].toLowerCase().indexOf('hillary') !== -1 || d.data['text'].indexOf('clinton') !== -1 })
  		.classed("selected", true)

  		
  	bssvg.selectAll(".cellcircle")
  		.filter(function(d) { return d.data['text'].toLowerCase().indexOf('hillary') == -1 && d.data['text'].indexOf('clinton') == -1 })
  		.classed("unselected", true)

  	clintononly = greatesthits.filter(function(d) { return d['text'].toLowerCase().indexOf('hillary') !== -1 || d['text'].indexOf('clinton') !== -1 })
  	clintonmean = d3.mean(clintononly, function(d) { return d['sentiment_score'];})
  	buildAverage(clintonmean);

  }
  function showCnn() {
  	console.log("cnn shown")
  	bssvg.selectAll(".cellcircle")
  		.classed("unselected", false)
  	bssvg.selectAll(".cellcircle")
  		.classed("selected", false)
  	bssvg.selectAll(".cellcircle")
  		.filter(function(d) { return d.data['text'].toLowerCase().indexOf('cnn') !== -1 || d.data['text'].indexOf('nytimes') !== -1 || d.data['text'].indexOf('news') !== -1 || d.data['text'].indexOf('media') !== -1  })
  		.classed("selected", true)

  		
  	bssvg.selectAll(".cellcircle")
  		.filter(function(d) { return d.data['text'].toLowerCase().indexOf('cnn') == -1 && d.data['text'].indexOf('nytimes') == -1 && d.data['text'].indexOf('news') == -1 && d.data['text'].indexOf('media') == -1  })
  		.classed("unselected", true)

  	mediaonly = greatesthits.filter(function(d) { return d['text'].toLowerCase().indexOf('cnn') !== -1 || d['text'].indexOf('nytimes') !== -1 || d['text'].indexOf('news') !== -1 || d['text'].indexOf('media') !== -1  })
  	mediamean = d3.mean(mediaonly, function(d) { return d['sentiment_score'];})
  	buildAverage(mediamean);
  }
  function searchTerm() {
  	bssvg.selectAll(".cellcircle")
  		.classed("unselected", false)
  	bssvg.selectAll(".cellcircle")
  		.classed("selected", false)

  }
  function transitionScatterTimeOfDay() {

  		bssvg
          //.attr("viewBox", "0 0 " +  (width+margin.left+margin.top) + " " + (height+margin.top+margin.bottom))
          .transition()
          .duration(1000)
          .attr("width", scatterwidth)
          .attr("height", scatterheight)

        bssvg.selectAll(".cellcircle")
        	.transition()
        	.duration(1000)
        	.attr("cx", function(d) { return sentimentScale(d.data['sentiment_score']) })
        	.attr("cy", function(d) { console.log(parseTime(d.data['time_created'])); return timeofdayScale(parseTime(d.data['time_created'])) })

  }
  function scatterTimeline() {
  }
  function buildAverage(average) {
  		console.log(average);
        avg = averageAnnotation.selectAll("g")
        	.data([average])
        	.enter()

        console.log(avg)
        avg.select(".average-line")
       		.transition()
       		.duration(500)
        	.attr("x1",function(d) { return sentimentScale(d)})
          	.attr("x2",function(d) { return sentimentScale(d)})
      

          

        avg.select(".average-text-label")
        	.transition()
        	.duration(500)
        	.attr("x",function(d) { return sentimentScale(d)})
   	
   }
	  /**
  }
  }
  }
  }
  }
  }
  }
  }
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
var parseDate = d3.timeParse("%Y-%m-%d")
  d.sentiment_score = +d.sentiment_score;
  d.favorite_count = +d.favorite_count;
  d.retweet_count = +d.retweet_count;

  d.date_created = parseDate(d.date_created.slice(0,10))
  d.time_created = d.time_created.slice(11,19)



  return d;
}