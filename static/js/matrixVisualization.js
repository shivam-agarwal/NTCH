function MatrixVisualization()
{
  var _margin     = {top: 185, right: 20, bottom: 20, left: 185};
  var _width      = 100;
  var _height     = _width;
  //var _colorScale = d3.scale.pow().exponent(.5).domain([0,1]).range([AugmentedNodeTrix._colorScaleStart,AugmentedNodeTrix._colorScaleEnd]);
  var _colorScale = d3.scale.linear().domain([0,1]).range([AugmentedNodeTrix._colorScaleStart,AugmentedNodeTrix._colorScaleEnd]);
  var _matrix, _matrixSize, _labelsData, _axisPositioningScale, _matrixID, _originalDataset;  
  var _community_assignment_result;

	// Assumes a parent SVG Id given along with data. Draws the matrix visualization inside it.	
	function chart(data, parentID)
	{
      _originalDataset = jQuery.extend(true, {}, data); // Deep copy the original dataset backup
			_matrixID = parentID;

 			_matrix = data.matrixData;
			_labelsData = data.labelsData;

			_matrixSize = _matrix.length;
      _width  = _matrixSize * 10;
			_height = _width;

			_axisPositioningScale = d3.scale.ordinal().domain(d3.range(_matrixSize)).rangeBands([0, _width]);

      detectCommunities();

    	svg = d3.selectAll('#'+_matrixID)
    					.attr("width", _width + _margin.left + _margin.right)
					    .attr("height", _height + _margin.top + _margin.bottom)
					    .attr("margin-left", -_margin.left + "px")
		    			.selectAll('g')
		    			.data([data])
		    			.enter()			    
					    .append("g")
					    .attr('class','parentGroup')
					    .attr("transform", "translate(" + _margin.left + "," + _margin.top + ")");

			svg.append("rect")
			    .attr("class", "drawnMatrix")
			    .attr("width", _width)
			    .attr("height", _height)
          .style("fill", 'lightgrey' );    

			var row = svg.selectAll(".row")
			                .data(_matrix)
			                .enter().append("g")
			                .attr("class", "row")
			                .attr("transform", function(d, i) { return "translate(0," + _axisPositioningScale(i) + ")"; })
			                .each(addCells);
			    
			row.append("line")
			    .attr("x2", _width)        

			    row.append("text")
			        .attr("x", -6)
			        .attr("y", _axisPositioningScale.rangeBand() / 2)
			        .attr("dy", ".3em")
			        .attr("text-anchor", "end")
			        .text(function(d, i) { return _labelsData[i].name; })
			        .attr('class','authorLabel')
              .style('fill',function(d,i)
              { 
                  if( _community_assignment_result && true == AugmentedNodeTrix._communityDetection )
                  {
                      var color = d3.scale.category10().domain(d3.range(0,10));
                      return color(_community_assignment_result[ _labelsData[i].id ]);
                  }

                    return '#505050';
              })

			var column = svg.selectAll(".column")
			                .data(_matrix)
			                .enter().append("g")
			                .attr("class", "column")
			                .attr("transform", function(d, i) { return "translate(" + _axisPositioningScale(i) + ")rotate(-90)"; })

			    column.append("line")
			        .attr("x1", -_width)

			    column.append("text")
			        .attr("x", 6)
			        .attr("y", _axisPositioningScale.rangeBand() / 2)
			        .attr("dy", ".3em")
			        .attr("text-anchor", "start")
			        .text(function(d, i) { return _labelsData[i].name ; })
			        .attr('class','authorLabel')
              .style('fill',function(d,i)
              { 
                  if( _community_assignment_result && true == AugmentedNodeTrix._communityDetection )
                  {
                      var color = d3.scale.category10().domain(d3.range(0,10));
                      return color(_community_assignment_result[ _labelsData[i].id ]);
                  }

                  return '#505050';
              })

		return this;
	}

  chart.updateData = function(data)
  {
      _originalDataset = jQuery.extend(true, {}, data); // Deep copy the original dataset backup

      _matrix = data.matrixData;
      _labelsData = data.labelsData;

      var min = 10000, max = -1;

      for( var i = 0 ; i < _matrixSize ; ++i )
      {
          for( var j = 0 ; j < _matrixSize ; ++j )
          {
              if( _matrix[i][j] > max )
                max = _matrix[i][j];

              if( _matrix[i][j] < min )
                min = _matrix[i][j];
          }
      }
      
      _colorScale.domain([min,max]);
      chart.renderUpdatedMatrix()

      return this;
  }

  function addCells(data,rowIndex) 
  {
      var min = 10000, max = -1;

      for( var i = 0 ; i < _matrixSize ; ++i )
      {
          for( var j = 0 ; j < _matrixSize ; ++j )
          {
              if( _matrix[i][j] > max )
                max = _matrix[i][j];

              if( _matrix[i][j] < min )
                min = _matrix[i][j];
          }
      }

      _colorScale.domain([min,max]);

      if( 'circle' == AugmentedNodeTrix.glyphType )
      {
          var cell = d3.select(this).selectAll(".cell")
            .data( data )            
            .enter()
            .append("circle")
            .attr("class", "cell") // Move the circles a little bit to bring them to the center of the rectangles
            .attr("cx", function(d,i) { return _axisPositioningScale.rangeBand()*i + _axisPositioningScale.rangeBand()/2 ; }) 
            .attr("cy", function(d) { return _axisPositioningScale.rangeBand()/2; })          
            //.attr('r',_axisPositioningScale.rangeBand()/2)
            .attr('r',function(d,i) { return 3 * (1-data[i]) })

            .on('mouseover', function(d,colIndex)
            {
                d3.selectAll("#" + _matrixID + " .row text").classed('active', function(d,i){ return(i==rowIndex) })
                d3.selectAll("#" + _matrixID + " .column text").classed('active', function(d,i){ return(i==colIndex) })

                d3.selectAll("#" + _matrixID + " .row text").classed('deactive', function(d,i){ return(i!=rowIndex) })
                d3.selectAll("#" + _matrixID + " .column text").classed('deactive', function(d,i){ return(i!=colIndex) })

                AugmentedNodeTrix._currentHighlightedPair.src = _labelsData[rowIndex].id;
                AugmentedNodeTrix._currentHighlightedPair.dst = _labelsData[colIndex].id;
            })
            .on('mouseout', function(d)
            {
                d3.selectAll("text").classed('active', false)
                d3.selectAll("text").classed('deactive', false)

                AugmentedNodeTrix._currentHighlightedPair.src = -1;
                AugmentedNodeTrix._currentHighlightedPair.dst = -1;
            })            
            .style("fill", function(d,i) { return _colorScale(data[i]) })
            .append('title')
            .text(function(data){ return data})    
      }

      else if( 'rect' == AugmentedNodeTrix.glyphType )
      {
          var cell = d3.select(this).selectAll(".cell")
            .data( data )            
            .enter()
            .append("rect")
            .attr("class", "cell")
            .attr("x", function(d,i) { return _axisPositioningScale.rangeBand()*i; })
            .attr("y", function(d)   { return 0; })
            .attr("width" , _axisPositioningScale.rangeBand())
            .attr("height", _axisPositioningScale.rangeBand())   
            .on('mouseover', function(d,colIndex)
            {
                d3.selectAll("#" + _matrixID + " .row text").classed('active', function(d,i){ return(i==rowIndex) })
                d3.selectAll("#" + _matrixID + " .column text").classed('active', function(d,i){ return(i==colIndex) })

                d3.selectAll("#" + _matrixID + " .row text").classed('deactive', function(d,i){ return(i!=rowIndex) })
                d3.selectAll("#" + _matrixID + " .column text").classed('deactive', function(d,i){ return(i!=colIndex) })

                AugmentedNodeTrix._currentHighlightedPair.src = _labelsData[rowIndex].id;
                AugmentedNodeTrix._currentHighlightedPair.dst = _labelsData[colIndex].id;
            })
            .on('mouseout', function(d)
            {
                d3.selectAll("text").classed('active', false)
                d3.selectAll("text").classed('deactive', false)

                AugmentedNodeTrix._currentHighlightedPair.src = -1;
                AugmentedNodeTrix._currentHighlightedPair.dst = -1;
            })            
            .style("fill", function(d,i) { return _colorScale(data[i]) })
            .append('title')
            .text(function(data){ return data})               
      }       
  }

  chart.updateColorScale = function( color1, color2)
  {     

      // Height map encoding taken from - http://bl.ocks.org/mbostock/3289530
      if( 'HM' == color1 && 'HM' == color2 )
      {
          _colorScale.range(["#d7191c", "#ffffbf", "#2c7bb6"])
          .domain([0,.5,1])
          .interpolate(d3.interpolateHcl);
      }

      else
      {

          if( true == AugmentedNodeTrix._LABColorSpace )
          {
              // Updated to the HCL color space - https://gist.github.com/mbostock/3014589
              _colorScale.domain([0,1]).range([d3.lab(color1).brighter(),d3.lab(color2).brighter()]);  
              console.log('Lab COlor Space')      
          }

          else
          {
              _colorScale.domain([0,1]).range([color1,color2]);           
          }          
      }
    
      chart.renderUpdatedMatrix();
  }

  chart.topLeft = function()
  {
      var w = $(window);  
      var offset = $('#'+ _matrixID).offset();
      
      return cellPosition = { xPos : offset.left , yPos : offset.top };
  }

  chart.width = function()
  {    	
  		return d3.select('#'+ _matrixID).attr('width');
  }

  chart.height = function()
  {
  		return d3.select('#'+ _matrixID).attr('height');
  }

  chart.hasID = function(authorID)
  {      
      for( var i = 0; i < _labelsData.length ; ++i )
      {
        if( _labelsData[i].id == authorID )
          return true;
      }

      return false;
  }

  chart.connectingPosition = function(authorID,connectionType)
  {
  		var i = 0;

  		for(  ; i < _labelsData.length ; ++i )
  		{
  			if( _labelsData[i].id == authorID )
  				break;
  		}

  		var currentAuthorPosition = i;

      // Calculates the position of an element on the screen using JQuery APIs
    	var w = $(window);  
      var offset = $('svg' + '#'+ _matrixID + ' .drawnMatrix').offset();
      var offSetChart = $('#'+AugmentedNodeTrix._parentID).offset();

      var drawnMatrixTopLeftX = offset.left  - offSetChart.left
      var drawnMatrixTopLeftY = offset.top  - offSetChart.top

    	var offset = $('#'+ _matrixID).offset();
      var parentHolderLeftTopX = offset.left - offSetChart.left
      var parentHolderLeftTopY = offset.top - offSetChart.top

      var padding = _axisPositioningScale.rangeBand()/2;      

    	if( 'left' == connectionType )
    	{

    	return { 
        				xPos : parentHolderLeftTopX + padding , 
        				yPos : drawnMatrixTopLeftY + ( currentAuthorPosition * _axisPositioningScale.rangeBand()) + padding
    		     };
    	}

    	else if( 'right' == connectionType )
    	{

    	return { 
        				xPos : drawnMatrixTopLeftX + (_axisPositioningScale.rangeBand() * _matrixSize) + padding, 
        				yPos : drawnMatrixTopLeftY + ( currentAuthorPosition * _axisPositioningScale.rangeBand()) + padding
    		     };
    	}

    	else if( 'bottom' == connectionType )
    	{
    	
    	return { 
        				xPos : drawnMatrixTopLeftX + (currentAuthorPosition * _axisPositioningScale.rangeBand()) + padding, 
        				yPos : drawnMatrixTopLeftY + ( _axisPositioningScale.rangeBand() * _matrixSize) + padding
    		     };	
    	}

    	else if( 'top' == connectionType )
    	{
    		
    	return { 
        				xPos : drawnMatrixTopLeftX + (currentAuthorPosition * _axisPositioningScale.rangeBand()) + padding, 
        				yPos : parentHolderLeftTopY  + padding
    		     };		
    	}

    	else
    		console.log('Error in connection type');
}

/***
* @ToDO
* In a good designn this seriation code should have been made as a webservice.
**/

  chart.applyVAT = function ()
  {

    if( _matrixSize < 2)
        return chart;

    var vertices = [] , verticesChosen = [], maxDistance = -1, maxDistanceIndex = -1;

    // Find Max
    for( var i = 0 ; i < _matrixSize ; ++i)
    {
        for( var j = 0 ; j < _matrixSize ; ++j)
        {
            if( i != j && _matrix[i][j] > maxDistanceIndex )
            {
                maxDistance = _matrix[i][j];
                maxDistanceIndex = j ;  
            }
        }
    }

    for(var i = 0 ; i < _matrixSize ; ++ i )
    {
        vertices.push(i)
    }

    verticesChosen.push(maxDistanceIndex);
    vertices.splice(vertices.indexOf(maxDistanceIndex), 1);

    while( 0 != vertices.length )
    {
        var minimumDistance 		    = 10000.0;
        var minimumDistanceVertex  	= 0;

        // Apply VAT
        for(var i = 0 ; i < verticesChosen.length ; ++i)
        {
            for(var j = 0 ; j < vertices.length ; ++j)
            {
                if( verticesChosen[i] != vertices[j] && _matrix[verticesChosen[i]][vertices[j]] <= minimumDistance )
                {
                    minimumDistance 		= _matrix[verticesChosen[i]][vertices[j]];
                    minimumDistanceVertex 	= vertices[j] ;
                }
            }
        }

        verticesChosen.push(minimumDistanceVertex );
        vertices.splice(vertices.indexOf(minimumDistanceVertex),1);
    }

    var Matrix2 = new Array(_matrixSize);

    for (var i = 0; i < _matrixSize; i++)   
        Matrix2[i] = new Array(_matrixSize);

    // Exchange Columns
    for( var i = 0 ; i < _matrixSize ; ++i)
    {
        for( var j = 0 ; j < _matrixSize ; ++j)
        {
             Matrix2[i][j] = _matrix[verticesChosen[i]][verticesChosen[j]];
        }
    }
             
    var tempAuthorArray = new Array(_labelsData.length);

    // Exchange the author data accordingly
    for( var i = 0 ; i < verticesChosen.length ; ++i)
    {
             tempAuthorArray[i] = _labelsData[verticesChosen[i]];
    }

    _labelsData = tempAuthorArray;
          
    // Exchange Columns back to original matrix
    for( var i = 0 ; i < _matrixSize ; ++i)
    {
        for( var j = 0 ; j < _matrixSize ; ++j)
        {
            _matrix[i][j] =  Matrix2[i][j];
        }
    }

		chart.renderUpdatedMatrix();
    return chart;    
  }

  chart.applyCommunityDetectionLeuven = function ()
  {
    if( _matrixSize < 2)
        return chart;

    var verticesChosen = [];

    if( _community_assignment_result )
    {
        var max = -1;
        for( var i = 0 ; i < _labelsData.length; ++i )
        {
            if( _community_assignment_result[_labelsData[i].id] > max )
              max = _community_assignment_result[_labelsData[i].id];
        }
    }

    for( var i = 0 ; i <= max; ++i)
    {
        for( var j = 0 ; j < _labelsData.length; ++j )
        {
            if( i == _community_assignment_result[_labelsData[j].id] )  
                verticesChosen.push(j)              
        }        
    }

    if( 0 == verticesChosen.length)
      return;
    // 

    var Matrix2 = new Array(_matrixSize);

    for (var i = 0; i < _matrixSize; i++)   
        Matrix2[i] = new Array(_matrixSize);

    // Exchange Columns
    for( var i = 0 ; i < _matrixSize ; ++i)
        for( var j = 0 ; j < _matrixSize ; ++j)
             Matrix2[i][j] = _matrix[verticesChosen[i]][verticesChosen[j]];
             
    var tempAuthorArray = new Array(_labelsData.length);

    // Exchange the author data accordingly
    for( var i = 0 ; i < verticesChosen.length ; ++i)
             tempAuthorArray[i] = _labelsData[verticesChosen[i]];

    _labelsData = tempAuthorArray;
          
    // Exchange Columns back to original matrix
    for( var i = 0 ; i < _matrixSize ; ++i)
        for( var j = 0 ; j < _matrixSize ; ++j)
            _matrix[i][j] =  Matrix2[i][j];

    chart.renderUpdatedMatrix();
    return chart;    
  }

  chart.revertOriginalMatrixState = function()
  {
      // Store a deep copy of the matrix
      _matrix = _originalDataset.matrixData.map(function(arr) { return arr.slice(); });
      
      _labelsData = _originalDataset.labelsData;
      chart.renderUpdatedMatrix();
      return chart;
  }

  chart.printMatrix = function ()
  {
        for( var i = 0 ; i < _matrix.length ; ++i )
        {            
            console.log( _matrix[i] );
            console.log( '\n' );
        }
        return chart;
  }

  chart.renderUpdatedMatrix = function ()
  {
        // Community Detection
        detectCommunities();        

        d3.selectAll( '#' + _matrixID ).selectAll(".row")
            .data( _matrix )              
            .each(updateRowCells)    

        d3.selectAll( '#' + _matrixID ).selectAll(".row text")
                .data(_matrix)                                
                .text(function(d, i) { return _labelsData[i].name; })
                .style('fill',function(d,i)
                { 
                    if( _community_assignment_result && true == AugmentedNodeTrix._communityDetection )
                    {
                        var color = d3.scale.category10().domain(d3.range(0,10));
                        return color(_community_assignment_result[ _labelsData[i].id ]);
                    }

                    return '#505050';
                })                  

        d3.selectAll( '#' + _matrixID ).selectAll(".column text")
                .data(_matrix)                                
                .text(function(d, i) { return _labelsData[i].name; })
                .style('fill',function(d,i)
                { 
                    if( _community_assignment_result && true == AugmentedNodeTrix._communityDetection )
                    {
                        var color = d3.scale.category10().domain(d3.range(0,10));                        
                        return color(_community_assignment_result[ _labelsData[i].id ]);
                    }

                    return '#505050';
                })

        return chart;                 
  }

  function updateRowCells(data)
  {
    if('circle' == AugmentedNodeTrix.glyphType)
    {
        var cell = d3.select(this).selectAll(".cell")
                    .data( data )         
                    .transition()
                    .delay(function(d, i) { return _axisPositioningScale(i); })
                    .duration( 1500 )
                    .attr("cx", function(d,i) { return _axisPositioningScale.rangeBand()*i + _axisPositioningScale.rangeBand()/2 ; })
                    .attr("cy", function(d) { return _axisPositioningScale.rangeBand()/2; })          
                    //.attr('r',_axisPositioningScale.rangeBand()/2)
                    .attr('r',function(d,i) { return 3 * (1-data[i]) })
                    .style("fill", function(d,i) { return data[i] < AugmentedNodeTrix._alpha ? _colorScale(data[i]) : AugmentedNodeTrix._colorScaleEnd })                                  
    }

    else if('rect' == AugmentedNodeTrix.glyphType)
    {
        var cell = d3.select(this).selectAll(".cell")
                    .data( data )         
                    .transition()
                    .delay(function(d, i) { return _axisPositioningScale(i); })
                    .duration( 1500 )
                    .attr("x", function(d,i) { return _axisPositioningScale.rangeBand()*i; })
                    .attr("y", function(d) { return 0; })          
                    .attr("width" , _axisPositioningScale.rangeBand())
                    .attr("height", _axisPositioningScale.rangeBand())            
                    .style("fill", function(d,i) { return data[i] < AugmentedNodeTrix._alpha ? _colorScale(data[i]) : AugmentedNodeTrix._colorScaleEnd })                                  
    }

    d3.select(this).selectAll(".cell title")
             .data( data )                    
             .text(function(data){ return data}) 

        return chart;   
  }    

  function detectCommunities()
{
      /*
         Community Detection - https://github.com/upphiminn/jLouvain
         http://arxiv.org/pdf/0803.0476.pdf
      */

      if( _matrix.length > 1 )
        {
              var node_data = [];
              for( var i = 0 ; i < _labelsData.length; ++i)
              {
                  node_data[i] = _labelsData[i].id;
              }

              var original_node_data = d3.entries(node_data);

              var edge_data = [];

              for( var i = 0 ; i < _matrixSize ; ++i)
              {
                  for( var j = i ; j < _matrixSize ; ++j)
                  {
                      if( 1 ==_matrix[i][j] || i==j ){}                
                      
                      else
                      {
                        edge_data.push({source: node_data[i], target:node_data[j], weight: 1-_matrix[i][j]})
                      }
                  }
              }              

              if( edge_data.length > 0 )
              {
                  var community = jLouvain().nodes(node_data).edges(edge_data);
                  _community_assignment_result = community();   
              }              
        } 
}

  return chart;
}

