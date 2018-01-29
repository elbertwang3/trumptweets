
importScripts("https://cdnjs.cloudflare.com/ajax/libs/d3/4.12.2/d3.min.js")


onmessage = function(event) {
  var greatesthits = event.data.greatesthits
 
 bsmargin = {top: 40, right: 40, bottom: 40, left: 40},
    bswidth = 1440,
    bsheight = 350

 var sentimentScale = d3.scaleLinear()
							.domain(d3.extent(greatesthits, function(d) { return d.sentiment_score; }))
							.range([bsmargin.left, bswidth-bsmargin.right])
retweetextent = d3.extent(greatesthits, function(d) { return d.retweet_count; })
	var beeSize = d3.scaleSqrt()
						.domain(retweetextent)
						.range([2,20])
 var simulation = d3.forceSimulation(greatesthits)
      .force("x", d3.forceX(function(d) { return sentimentScale(d.sentiment_score); }).strength(1))
      .force("y", d3.forceY(bsheight/2))
      //.force("collide", function(d) { return d3.forceCollide(beeSize(d.retweet_count)); })
      .force("collide", d3.forceCollide().radius(function(d) { return beeSize(d.retweet_count) + 1;   }))
      .stop();

for (var i = 0; i < 500; ++i) simulation.tick();


postMessage({type: "end", greatesthits: greatesthits})

}