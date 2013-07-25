
function Wikistalker(args){
	
	var _defaults = {title: 'wikipedia', container: 'body' , width: 600, height: 600, relevance_cutoff : .5};
	
	 _args = {};
	
	var _wikidata_cache;
	
	var _svg;
	
	for(key in _defaults) {
         _args[key] = args[key] || _defaults[key];
      }
	
	console.log(_args);
	
	var URL_BY_TERM_JSON = '/proxy.php?proxy_url='+'http://wikipedia-miner.cms.waikato.ac.nz/services/exploreArticle?outLinks=true%26parentCategories=true%26linkRelatedness=true%26responseFormat=json%26title=';
	var URL_BY_ID_JSON = '/proxy.php?proxy_url='+'http://wikipedia-miner.cms.waikato.ac.nz/services/exploreArticle?outLinks=true%26parentCategories=true%26linkRelatedness=true%26responseFormat=json%26id=';
	var SORT_METHOD_RELATEDNESS = 'relatedness';
	var SORT_METHOD_TITLE = 'title';
	
	var width = _args.width;
	var height = _args.height;
	
	var history = [];
	

	
	var initialize = function(){
		console.log('I am ' );
		
		openEntry(_args.id,_args.title);
        
	};
	
	var openEntry = function(id,title) {
	    var url = id!=undefined ? URL_BY_ID_JSON+id : URL_BY_TERM_JSON+title;
		$.getJSON(url, function(data) {
		    _wikidata_cache = data;
		    drawSun(data);
		});

	}
	
	var relCuttoff = function(data) {
	    
	    var ret = [];
	    for(var i=0;i<data.length;i++) {
	        if(data[i].relatedness>_args.relevance_cutoff) {
	            ret.push(data[i]);
	        }
	    }
	    return ret;
	    
	}
	
	
	var drawSun = this.drawSun = function(wikidata) {

		    if(wikidata==undefined) 
		        wikidata = _wikidata_cache;
		    
		    sorted = sortJson(wikidata,SORT_METHOD_RELATEDNESS);
		    console.log(sorted);
		    
		   // sorted = sorted.slice(0,70);
		   
		   sorted= relCuttoff(sorted);
		   
	
            
            var dataSize = sorted.length;
            
            console.log(dataSize);	
            
            
            
            var innerCircleR = 100;	 
            var barWidth = 2*Math.PI*innerCircleR/dataSize;   
            
            var theta = 2*Math.PI/dataSize;
            
            var thetaD = 360/dataSize;
            
            var barMaxSize = 200;
            
            
            
            
            if(_svg==undefined) {
                 _svg = d3.select(_args.container).append("svg")
                        .attr("width", width)
                        .attr("height",height);
                    
            }
            
            _svg.selectAll(".bar").remove();
            

            var bars = _svg.selectAll(".bar")
              .data(sorted)
            .enter().append("g")
              .attr("class", "bar")
              .attr("transform", function(d,index) {  return ' translate('+(width/2+innerCircleR*Math.cos(theta*index))+','+(height/2-innerCircleR*Math.sin(theta*index))+') rotate('+(90-index*thetaD)+')'; })
              .attr('x',0)
              .attr('y',innerCircleR*2)
              .attr('doc-id',function(d) {return d.id;})
              .on("click", function(d) { 
                    openEntry(d.id,null);
                    return false;
              })

        //     .attr("text-anchor", function(d,index) { return (index>dataSize/4 && index<3*dataSize/4) ? 'end': 'start';})

              .attr("width", barWidth-1)
              .attr("height", function(d) { return 100-d.relatedness*100; });

            bars.append("rect")
              .attr("width", barWidth-1)
              .attr('x',0)
              .attr('y',innerCircleR*2)
              .attr("height", function(d) { return barMaxSize-d.relatedness*barMaxSize; });

            bars.append('text')
              .attr("class", "text")
              .attr('y',-barWidth*0.15)
              .attr('x',innerCircleR*2)
             // .style('fill','#aaa')
              //.style('background','#555')
//              .attr("width", barWidth*0.9)
//              .attr("height", function(d) { return d.relatedness*barMaxSize; })
              .attr("width", "100%")
              .attr("height", "100%")

            //  .attr("height", function(d,index) { return (index>dataSize/4 && index<3*dataSize/4) ? 0 : 100-d.relatedness*100; })
           //  .attr('x',function(d,index) {  return (index>dataSize/4 && index<3*dataSize/4) ? innerCircleR*2 : -innerCircleR*2-d.title.length*5.4; })
            //  .attr("transform", function(d,index) {  return (index>dataSize/4 && index<3*dataSize/4) ? 'rotate(90)' :'rotate(270)';})
            .attr("transform", function(d,index) {  return 'rotate(90)'})
                          
              .text(function(d) { return d.title;});


            
          
     
           
        
	}
	
    var sortJson = function(data,sortMethod) {
		var ret;
		console.log(sortMethod);
		if(sortMethod==SORT_METHOD_TITLE) {
		    console.log('related ness');
			ret=data.outLinks.sort(function(a,b) { return parseFloat(a.relatedness) - parseFloat(b.relatedness) } );
		}
		else {
			console.log('sort method is title');
			ret=data.outLinks.sort(function(a,b) { return a.title > b.title ? 1 : -1 } );
		}
		return ret;
	}
	
	
	initialize();

};

	Wikistalker.prototype.changeRelevanceCutoff = function(cutoff) {
	    console.log(this);
	    console.log(_args);

	    _args.relevance_cutoff=cutoff;
	    this.drawSun();
	}

