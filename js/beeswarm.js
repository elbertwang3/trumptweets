
var scrollVis = function(greatesthits) {
	beeswarmdiv = d3.select('.beeswarm')
	bsmargin = {top: 40, right: 40, bottom: 50, left: 90},
    bswidth = 1000,
    bsheight = window.innerHeight,
    scatterwidth = 1000,
    scatterheight = window.innerHeight
    var lastIndex = -1;
  	var activeIndex = 0;

  	var parseDate = d3.timeParse("%Y-%m-%d")
    var parseDate2 = d3.timeParse("%b %Y")
	var parseTime = d3.timeParse("%H:%M:%S")
  var parseTime2 = d3.timeParse("%H %p")
  	var sentimentScale = d3.scaleLinear()
							//.domain(d3.extent(greatesthits, function(d) { return d.sentiment_score; }))
							.range([bsheight - bsmargin.bottom, bsmargin.top])
	var colorScale = d3.scaleLinear()
		.domain([14,0,-13]).range(["#1a80c4","#ffffff","#cc3d3d"]);


	var timeofdayScale = d3.scaleTime()
					//.domain([d3.extent(greatesthits, function(d) { return parseTime(['time_created']); })])
					.range([bsmargin.left, scatterwidth - bsmargin.right])
	var dateScale = d3.scaleTime()
					//.domain([d3.extent(greatesthits, function(d) { return d['date_created']; })])
					.range([bsmargin.left, scatterwidth - bsmargin.right])


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
  var cellg;
	var cellCircle;
	var voronoi;
	var bssvg;
  var xticks;
  var xtick;

	var chart = function (selection) {
	    selection.each(function (rawData) {
	
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
					.domain(d3.extent(greatesthits, function(d) { return d['date_created']; }))


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
      //.force("x", d3.forceX(function(d) { return sentimentScale(d.sentiment_score); }).strength(1))
      //.force("y", d3.forceY(bsheight/2))
      .force("x", d3.forceX(bswidth/2))
      .force("y", d3.forceY(function(d) { return sentimentScale(d.sentiment_score); }).strength(1))
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
    cellg = cells.selectAll("g").data(voronoi
      .polygons(greatesthits))

    cell = cellg
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
      

      /*var cell = bssvg.append("g")
      .attr("class", "cells")
    .selectAll("g").data(greatesthits).enter().append('g')*/
     chartAnnotation.append("line")
        	.attr("class", "dividing-line")
        	.attr("x1",bswidth/2)
          	.attr("x2",bswidth/2)
          	.attr("y1",bsmargin.top)
          	.attr("y2",bsheight-bsmargin.bottom)
        chartAnnotation.append("line")
          .attr("class", "dividing-line")
          .attr("x1",bsmargin.left)
            .attr("x2",bswidth-bsmargin.right)
            .attr("y1",sentimentScale(0))
            .attr("y2",sentimentScale(0))

      chartAnnotation.append("text")
        .attr("class", "chart-annotation")
        .attr("transform", "translate(100,50)")
        //.text("What is Trump's sentiment ____________?")
       
        .attr("dy", "1em")
        .call(wrap, 400)


      legend = chartAnnotation.append("g")
      .attr("class", "chart-legend")
      .attr("transform", "translate(850, 50)")


      circlesizes = [3,6,9,12,15]
      legend.selectAll("circle")
        .data(circlesizes)
        .enter()
        .append("circle")
        .attr("class", "legend-circle")
      //  .attr("transform",)
        .attr("cy", function(d,i) { return d3.sum(circlesizes.slice(0,i+1))*2.5 ; })
        .attr("r", function(d) { return d; })

        /*legend = chartAnnotation.append("g")
  .attr("class", "legendSize")
  .attr("transform", "translate(800, 100)");

var legendSize = d3.legendSize()
  .scale(beeSize)
  .shape('circle')
  .shapePadding(15)
  .labelOffset(20)
  .orient('vertical');

chartAnnotation.select(".legendSize")
  .call(legendSize);*/

      legend.append("text")
        .attr("class", "legend-annotation")
        .text("Less retweets")
        .attr("x", 25)
        .attr("y", 10)

      legend.append("text")
        .text("More retweets")
          .attr("class", "legend-annotation")
          .attr("transform", "translate(0,110)")
            .attr("y", 10)
             .attr("x", 25)

        //.attr("stroke",)
	cellCircle = cell.append("circle")
	     .attr("class", "cellcircle")
	       //.attr('r', 0)
	      .attr("r", function(d) {  return beeSize(d.data.retweet_count); })
	      .attr("cx", function(d) {  return d.data.x; })
	      .attr("cy", function(d) { return d.data.y; })
	      .attr("fill", function(d) { return colorScale(d.data.sentiment_score)})
	      .attr("opacity", 0)
	
	

	cell.append("path")
	  .attr('class', 'voronoi')
      .attr("d", function(d) { return "M" + d.join("L") + "Z"; })

 

      
        chartAnnotation.append("line")
          	.attr("x1",bsmargin.left-45)
          	.attr("x2",bsmargin.left-45)
          	.attr("y1",bsmargin.top+220)
          	.attr("y2",bsmargin.top+40)
          	.attr("class","annotation-line")
          	.attr("marker-end", function(d){
            	return "url(#arrow-head)"
         	});

        chartAnnotation.append("text")
            //.attr("x",100)
            //.attr("y",bsmargin.top)
            .attr("class","annnotation-text")
            .text(function(d){
            	return "More Positive Sentiment"
            })
            .attr("dy", "1em")
            .attr("transform", "translate(" +(bsmargin.left-45) + ", "+ (bsmargin.top-28)+")")
            .call(wrap,60)

         chartAnnotation.append("line")
          	.attr("x1",bsmargin.left-45)
          	.attr("x2",bsmargin.left-45)
          	.attr("y1",bsheight - bsmargin.bottom - 220)
          	.attr("y2",bsheight - bsmargin.bottom - 40)
          	.attr("class","annotation-line")
          	.attr("marker-end", function(d){
            	return "url(#arrow-head)"
         	});

        chartAnnotation.append("text")
            //.attr("x",100)
            //.attr("y",bsheight - bsmargin.bottom)
            .attr("class","annnotation-text")
            .text(function(d){
            	return "More Negative Sentiment"
            })
             .attr("transform", "translate("+(bsmargin.left-45) + ", " + (bsheight-bsmargin.bottom-25)+")")
            .attr("dy", "1em")
            .call(wrap,60)

     

            



        average = d3.mean(greatesthits, function(d) { return d['sentiment_score'];})

        
        averageAnnotation = bssvg.append('g')
        				.attr("class", "average-annotation")
                 .attr("opacity", 0)
        avg = averageAnnotation.selectAll("g")
        	.data([average])
        	.enter()
        avg.append("line")
        	/*.attr("x1",function(d) { return sentimentScale(d)})
          	.attr("x2",function(d) { return sentimentScale(d)})
          	.attr("y1",bsmargin.top)
          	.attr("y2",bsheight-bsmargin.bottom)*/
            .attr("x1",bsmargin.left + 50)
            .attr("x2",bswidth - bsmargin.right)
            .attr("y1",function(d) { return sentimentScale(d)})
            .attr("y2",function(d) { return sentimentScale(d)})
          	.attr("class", "average-line")


        avg.append('text')
        	.attr("x",bsmargin.left)
          	.attr("y",function(d) { return sentimentScale(d)})
          	.text("average")
          	.attr("class", "average-text-label")
          	.attr("alignment-baseline", "middle")


        xticks = bssvg.append('g')
    .attr("class", "ticks")
    .attr("opacity", 0)
  xtick = xticks.selectAll('g')
    .data(['3 AM', '6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'])
    .enter()
    .append('g')
    .attr("class", "tick")

    xtick.append("line")
    .attr("x1", function(d) { return timeofdayScale(parseTime2(d))})
    .attr("x2", function(d) { return timeofdayScale(parseTime2(d))})
    .attr("y2", bsheight - bsmargin.bottom+20)
    .attr("class", "scatter-axis-line")

  xtick.append("text")
    .attr("x", function(d) { return timeofdayScale(parseTime2(d))})
    .attr("y", (bsheight-bsmargin.bottom) + 40)
    .attr("text-anchor", "middle")
    .text(function(d) { return d; })
    .attr("class", "text-labels")
       
        










	}
	function mouseOverEvents(data, element) {
		element.select("circle")
			.classed("active", true)
    	tooltip.selectAll("div").remove();

    	var tweetcontainer = tooltip.append("div")
    									.attr("id", "tweet")


    									
    									//.attr("tweetID", function(d) { return data.id_str; })

    	var tweet =  d3.select("#tweet").node()
      var id;
    	if (data.data !== 'undefined') {
        id = data.data.id_str;
      } else {
        id = data.id_str;
      }

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
                if (data.data.y < 450) {
                   return (data.data.y + 20) +"px"
                }else {


		              return (data.data.y -250) +"px"
                }
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
    activateFunctions[10] = showAndroid;
    activateFunctions[11] = showIphone;
		activateFunctions[12] = scatterTimeline;
		


    // updateFunctions are called whilec
    // in a particular section to update
    // the scroll progress in that section.
    // Most sections do not need to be updated
    // for all scrolling and so are set to
    // no-op functions.
    for (var i = 0; i < 20; i++) {
      updateFunctions[i] = function () {};
    }
    //updateFunctions[7] = updateCough;
  };

  function showAnno() {

  }
  function showBeeswarm() {
    d3.select(".chart-annotation")
      .text("What is Trump's sentiment...")
      .attr("dy", "1rem")

    averageAnnotation
      .transition()
      .duration(1000)
      .attr("opacity", 1)

    cellCircle.transition()
    .duration(1000)
    .attr("r", function(d) {  return beeSize(d.data.retweet_count); }) 

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

  	
      d3.select(".chart-annotation")
      .text("What is Trump's sentiment...")
  	bssvg.selectAll(".cellcircle")
  		.classed("unselected", false)
  	bssvg.selectAll(".cellcircle")
  		.classed("selected", false)
  	bssvg.selectAll(".cellcircle")
  		.filter(function(d) { return d.data['date_created'] < parseDate('2017-03-08')})
  		.classed("selected", true)
  		
  	bssvg.selectAll(".cellcircle")
  		.filter(function(d) { return d.data['date_created'] >= parseDate('2017-03-08')})
  		.classed("unselected", true)  

  	/*oldtweets = greatesthits.filter(function(d) { return d['date_created'] < parseDate('2017-03-08'); })
  	oldmean = d3.mean(oldtweets, function(d) { return d['sentiment_score'];})
  	buildAverage(oldmean);*/
  }
  function showAndroid() {

    d3.select(".chart-annotation")
      .text("What is Trump's sentiment from an Android?")
      .attr("dy", "1rem")
        .call(wrap, 300)
  	bssvg.selectAll(".cellcircle")
  		.classed("unselected", false)
  	bssvg.selectAll(".cellcircle")
  		.classed("selected", false)
  	bssvg.selectAll(".cellcircle")
  		.filter(function(d) { return d.data['source'] == 'Twitter for Android'})
  		.classed("selected", true)
  		
  	bssvg.selectAll(".cellcircle")
  		.filter(function(d) { return d.data['source'] != 'Twitter for Android'})
  		.classed("unselected", true)

 

 

   	androidonly = greatesthits.filter(function(d) { return d['date_created'] < parseDate('2017-03-08') && d['source'] == 'Twitter for Android' })
  	androidmean = d3.mean(androidonly, function(d) { return d['sentiment_score'];})
  	buildAverage(androidmean);
   
     
  }
  function showIphone() {
    d3.select(".chart-annotation")
      .text("What is Trump's sentiment from an iPhone?")
      .attr("dy", "1rem")
        .call(wrap, 300)

  	bssvg.selectAll(".cellcircle")
  		.classed("unselected", false)
  	bssvg.selectAll(".cellcircle")
  		.classed("selected", false)

  	bssvg.selectAll(".cellcircle")
  		.filter(function(d) { return d.data['date_created'] < parseDate('2017-03-08') && d.data['source'] == 'Twitter for iPhone'})
  		.classed("selected", true)

  		
  	bssvg.selectAll(".cellcircle")
  		.filter(function(d) { return  d.data['date_created'] >= parseDate('2017-03-08') || d.data['source'] != 'Twitter for iPhone'})
  		.classed("unselected", true)

  	iphoneonly = greatesthits.filter(function(d) { return d['date_created'] < parseDate('2017-03-08') && d['source'] == 'Twitter for iPhone' })
  	iphonemean = d3.mean(iphoneonly, function(d) { return d['sentiment_score'];})
  	buildAverage(iphonemean);


    if (lastIndex >= 11) {
      console.log("getting here");


       var voronoi = d3.voronoi()
        .extent([[-bsmargin.left, -bsmargin.top], [bswidth + bsmargin.right, bsheight + bsmargin.top]])
     .x(function(d) {  return timeofdayScale(parseTime(d['time_created'])) })
    .y(function(d) { return sentimentScale(d['sentiment_score']) })
     
     cellg = cells.selectAll("g").data(voronoi
      .polygons(greatesthits))
       .on("mouseenter", function(d) {
          data = d
          mouseOverEvents(data,d3.select(this));

        })
        .on("mouseleave", function(d) { 
          data = d
          mouseOutEvents(data,d3.select(this));
        });
    cellg.select("path").transition()
    .duration(1000)
    .attr("d", function(d, i) { return d ? "M" + d.join("L") + "Z" : null; })
    


        bssvg.selectAll(".cellcircle")
          .transition()
          .duration(1000)
          
            .attr("cx", function(d) { return timeofdayScale(parseTime(d.data['time_created'])) })
          .attr("cy", function(d) { return sentimentScale(d.data['sentiment_score']) })


         xticks.selectAll(".tick").remove()
         console.log(xticks);
         console.log(xticks.selectAll('g')
    .data(['3 AM', '6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM']))
          xtick = xticks.selectAll('g')
    .data(['3 AM', '6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'])
    .enter()
    .append('g')
    .attr("class", "tick")


    xtick.append("line")
    .attr("x1", function(d) { return timeofdayScale(parseTime2(d))})
    .attr("x2", function(d) { return timeofdayScale(parseTime2(d))})
    .attr("y2", bsheight - bsmargin.bottom+20)
    .attr("class", "scatter-axis-line")

  xtick.append("text")
    .attr("x", function(d) { return timeofdayScale(parseTime2(d))})
    .attr("y", (bsheight-bsmargin.bottom) + 40)
    .attr("text-anchor", "middle")
    .text(function(d) { return d; })
    .attr("class", "text-labels")





      } 
  }
  function showObama() {
    d3.select(".chart-annotation")
      .text("What is Trump's sentiment on Obama?")
      .attr("dy", "1rem")
        .call(wrap, 300)
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

      d3.select(".chart-annotation")
      .text("What is Trump's sentiment on Hillary?")
      .attr("dy", "1rem")
        .call(wrap, 300)
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

    d3.select(".chart-annotation")
      .text("What is Trump's sentiment on the media?")
      .attr("dy", "1rem")
        .call(wrap, 300)
 
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
    d3.select(".chart-annotation")
      .text("What is Trump's sentiment...")
      .attr("dy", "1rem")
  	bssvg.selectAll(".cellcircle")
  		.classed("unselected", false)
  	bssvg.selectAll(".cellcircle")
  		.classed("selected", false)

    mean = d3.mean(greatesthits, function(d) { return d['sentiment_score'];})
    buildAverage(mean);


      if (lastIndex >= 8) {

        simulation = d3.forceSimulation(greatesthits)
       //.velocityDecay(0.2)
          //.force("x", d3.forceX(function(d) { return sentimentScale(d.sentiment_score); }).strength(1))
          //.force("y", d3.forceY(bsheight/2))
          .force("x", d3.forceX(bswidth/2))
          .force("y", d3.forceY(function(d) { return sentimentScale(d.sentiment_score); }).strength(1))
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
        
        cellg = cells.selectAll("g").data(voronoi
          .polygons(greatesthits))

        cellg.select("g")
          .on("mouseenter", function(d) {
          data = d
         mouseOverEvents (data,d3.select(this));

        })
        .on("mouseleave", function(d) { 
          data = d
          mouseOutEvents(data,d3.select(this));
        });

         cellg.select("path").transition()
        .duration(1000)
        .attr("d", function(d, i) { return d ? "M" + d.join("L") + "Z" : null; })
          

        cellg.select("circle")
              .transition()
              .duration(1000)
              
                 .attr("cx", function(d) {  return d.data.x; })
            .attr("cy", function(d) { return d.data.y; })
      

      cell.append("path")
        .attr('class', 'voronoi')
          .attr("d", function(d) { return "M" + d.join("L") + "Z"; })
        }

          d3.selectAll('.dividing-line')
      .transition()
      .duration(1000)
      .attr("opacity", 1)
         xticks
      .transition()
      .duration(1000)
      .attr("opacity", 0)

  }
  function transitionScatterTimeOfDay() {

  	d3.selectAll('.dividing-line')
      .transition()
      .duration(1000)
      .attr("opacity", 0)
    xticks
      .transition()
      .duration(1000)
      .attr("opacity", 1)
   
 

    var voronoi = d3.voronoi()
        .extent([[-bsmargin.left, -bsmargin.top], [bswidth + bsmargin.right, bsheight + bsmargin.top]])
     .x(function(d) {  return timeofdayScale(parseTime(d['time_created'])) })
    .y(function(d) { return sentimentScale(d['sentiment_score']) })
	   
     cellg = cells.selectAll("g").data(voronoi
      .polygons(greatesthits))
       .on("mouseenter", function(d) {
          data = d
          mouseOverEvents(data,d3.select(this));

        })
        .on("mouseleave", function(d) { 
          data = d
          mouseOutEvents(data,d3.select(this));
        });
    cellg.select("path").transition()
    .duration(1000)
    .attr("d", function(d, i) { return d ? "M" + d.join("L") + "Z" : null; })
  	


        bssvg.selectAll(".cellcircle")
        	.transition()
        	.duration(1000)
        	
            .attr("cx", function(d) { return timeofdayScale(parseTime(d.data['time_created'])) })
          .attr("cy", function(d) { return sentimentScale(d.data['sentiment_score']) })


        
      /*if (lastIndex >= 9) {
         xticks.selectAll(".tick").remove()
          xtick = xticks.selectAll('g')
    .data(['3 AM', '6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'])
    .enter()
    .append('g')
    .attr("class", "tick")

    xtick.append("line")
    .attr("x1", function(d) { return timeofdayScale(parseTime2(d))})
    .attr("x2", function(d) { return timeofdayScale(parseTime2(d))})
    .attr("y2", bsheight - bsmargin.bottom+20)
    .attr("class", "scatter-axis-line")

  xtick.append("text")
    .attr("x", function(d) { return timeofdayScale(parseTime2(d))})
    .attr("y", (bsheight-bsmargin.bottom) + 40)
    .attr("text-anchor", "middle")
    .text(function(d) { return d; })
    .attr("class", "text-labels")


      } else {
         xticks
      .transition()
      .duration(1000)
      .attr("opacity", 1)
      }*/


         /*avg.transition()
            .duration(1000)
            .attr("opacity", 0)*/



  }
  function scatterTimeline() {

      bssvg.selectAll(".cellcircle")
      .classed("unselected", false)
    bssvg.selectAll(".cellcircle")
      .classed("selected", false)
        /*xticks.transition()
        .duration(500)
    .attr("opacity", 0)*/
    console.log(d3.extent(greatesthits, function(d) { return d['date_created']}))
    xticks.selectAll(".tick").remove()
    xtick = xticks.selectAll('g')
    .data([
    'Jan 2013',  'Jul 2013',  
    'Jan 2014', 'Jul 2014', 
    'Jan 2015', 'Jul 2015', 
    'Jan 2016', 'Jul 2016', 
    'Jan 2017',  'Jul 2017', 
    'Jan 2018'])
    .enter()
    .append("g")
    .attr("class", "tick")


    xtick.append("line")
    .attr("x1", function(d) {  return dateScale(parseDate2(d))})
    .attr("x2", function(d) { return dateScale(parseDate2(d))})
    .attr("y2", bsheight - bsmargin.bottom+20)
    .attr("class", "scatter-axis-line")

  xtick.append("text")

    .attr("x", function(d) { return dateScale(parseDate2(d))})
    .attr("y", (bsheight-bsmargin.bottom) + 40)
    .attr("text-anchor", "middle")
    .text(function(d) { return d; })
    .attr("class", "text-labels")
       



        var voronoi = d3.voronoi()
        .extent([[-bsmargin.left, -bsmargin.top], [bswidth + bsmargin.right, bsheight + bsmargin.top]])
     .x(function(d) {  return dateScale(d['date_created']) })
    .y(function(d) { return sentimentScale(d['sentiment_score']) })
     cellg = cells.selectAll("g").data(voronoi
      .polygons(greatesthits))
       .on("mouseenter", function(d) {
          data = d
          mouseOverEvents(data,d3.select(this));

        })
        .on("mouseleave", function(d) { 
          data = d
          mouseOutEvents(data,d3.select(this));
        });
    cellg.select("path").transition()
    .duration(1000)
    .attr("d", function(d, i) { return d ? "M" + d.join("L") + "Z" : null; })
    


        bssvg.selectAll(".cellcircle")
          .transition()
          .duration(1000)
          
            .attr("cx", function(d) { return dateScale(d.data['date_created']) })
          .attr("cy", function(d) { return sentimentScale(d.data['sentiment_score']) })
        
  }
  function buildAverage(average) {
    console.log(average);
        avg = averageAnnotation.selectAll("g")
        	.data([average])
        	.enter()

    
        avg.select(".average-line")
       		.transition()
       		.duration(500)
        	.attr("y1",function(d) { return sentimentScale(d)})
          	.attr("y2",function(d) { return sentimentScale(d)})
      

          

        avg.select(".average-text-label")
        	.transition()
        	.duration(500)
        	.attr("y",function(d) { return sentimentScale(d)})
   	
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
    console.log(index);
    console.log(lastIndex)
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
	

	

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function type(d) {
var parseDate = d3.timeParse("%Y-%m-%d")
  d.sentiment_score = +d.sentiment_score;
  d.favorite_count = +d.favorite_count;
  d.retweet_count = +d.retweet_count;
  var realdate = moment('January 1, 1970 ' + d.time_created.slice(11,19)).add(19, 'h').toDate()
  var realtime = addZero(realdate.getHours()) + ":" + addZero(realdate.getMinutes()) + ":" + addZero(realdate.getSeconds())
  d.date_created = parseDate(d.date_created.slice(0,10))
  d.time_created = realtime;

  //time_created = new Date(d.time_created.slice(11,19).subtract(8, 'h'))
  //console.log(time_created);




  return d;
}