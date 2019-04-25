//INITIALISATION
//-------------------------------------------------------------------------

//contructor Intl.NumberFormat for language sensitive number formatting
const numberFormat = new Intl.NumberFormat(
	undefined, {
		minimumFractionDigits: 0,
		maximumFractionDigits: 2
	}
);

console.log(numberFormat.format(1213131.24141));
console.log(numberFormat.format(0.00004342));

//opts for svg
const opts = {
	breakpoint: 620,
	container: ".c-svg",
	width: document.querySelector(".c-svg").clientWidth,
	height: document.querySelector(".c-svg").clientHeight,
	margin: {
		top: 20,
		right: 20,
		bottom: 30,
		left: 30
	}
};

//opts for chart
const innerChart = {
	width: opts.width - opts.margin.left - opts.margin.right,
	height: opts.height -opts.margin.top - opts.margin.bottom
};

//opts for viz = chart with data
const viz = {
	pointRadius: 5,
};


//initalization svg
const svg = d3.select(opts.container)
	.append("svg")
	.attr("id", "svg0")
	.attr("width", opts.width)
	.attr("height", opts.height);


//inner chart dimensions
const g = svg.append("g")
	.attr("id", "svg0-group")
	.attr("transform", `translate(${opts.margin.left} ${opts.margin.top})`);


//dimension axis
const x = d3.scaleLinear()
	.range([0, innerChart.width]);

const y = d3.scaleLinear()
	.range([innerChart.height, 0]);



//DATA IMPORT
//-------------------------------------------------------------------------

d3.csv("data/data.csv").then(function(data){

	console.log(data);


	//X & Y PROCESS
	//-------------------------------------------------------------------------

	//slice() method return a new array object selected from begin to end
	//here just the values. begin : extraction included | end : extraction not included 
	const keyValue = data.columns.slice(2,5);

	//transform string value into integer
	data.forEach((d)=>{
		keyValue.forEach((key)=>{
			d[key] =  +d[key];
		});

	});

	//min max value for axis
	const min = d3.min(data, ((d)=>{ return d3.min(keyValue, ((key)=>{ return d[key]; })); }));
	const max = d3.max(data, ((d)=>{ return d3.max(keyValue, ((key)=>{ return d[key]; })); }));


	//Z PROCESS
	//-------------------------------------------------------------------------

	//select category
	const nameValue = data.map((d)=>{ return d.year; });
	const colorValue = ["#ff3333", "#dcd427","#779933", "#0092cc", "#f0f0f0"];

	const z = d3.scaleOrdinal()
		.domain(nameValue)
		.range(colorValue);


	//AXIS
	//-------------------------------------------------------------------------

	//value axis
	x.domain(d3.extent(data, ((d)=>{ return d.miles; }))).nice();
	y.domain(d3.extent(data, ((d)=>{ return d.gas; }))).nice();

	const xAxis = d3.axisBottom(x)
		.tickSizeOuter(0)
		.ticks(Math.max(innerChart.width/100, 2));

	const yAxis = d3.axisLeft(y)
		.tickSizeOuter(0)
		.ticks(Math.max(innerChart.height/70, 2));

	//call axis
	g
		.append("g")
		.attr("class", "axis x_axis")
		.attr("transform", `translate(0 ${innerChart.height})`)
		.call(xAxis);

	g.select(".x_axis")
		.selectAll("text")
		.attr("y", 10);

	g
		.append("g")
		.attr("class", "axis y_axis")
		.attr("transform", "translate(0 0)")
		.call(yAxis);

	g.select(".y_axis")
		.selectAll("text")
		.attr("x", -10);

		
	
	
		
	//CIRCLE
	//-------------------------------------------------------------------------
	const circles = g.append("g")
		.attr("class", "circle");

	circles.selectAll(".data-point")
		.data(data)
		.join("circle")
		.classed("data-point", true)
		.attr("cx", d => x(d.miles))
		.attr("cy", d => y(d.gas))
		.attr("r", viz.pointRadius)
		.attr("fill", d => z(d.year));




	//VORONOI
	//-------------------------------------------------------------------------

	//create voronoi diagram based on the data and the scales
	const voronoi = d3.voronoi()
		.x(d => x(d.miles))
		.y(d => y(d.gas))
		.extent([[0, 0], [innerChart.width, innerChart.height]]);


	const cells = g.append("g")
		.attr("class", "voronoi-cells");

	//join voronoi
	cells.selectAll("path")
		.data(voronoi.polygons(data))
		.join("path")
		.attr("d", ((d)=>{ return d ? "M" + d.join("L") + "Z" : null; }))
		.style("fill","none")
		.style("stroke", "none")
		.attr("pointer-events", "all");
	

	//limit how far away the mouse can be from finding a Voronoi site
	const voronoiRadius = innerChart.width/10;


	//add circle for indicating the highlighted point
	g.append("circle")
		.attr("class", "highlight-circle")
		.attr("r", viz.pointRadius +2)
		.style("fill", "none")
		.style("display", "none");
	
	// callback to highlight a point
	function highlight(d){
		if(!d){
			d3.select(".highlight-circle")
				.style("display", "none");
		} else {
			d3.select(".highlight-circle")
				.style("display", "")
				.style("stroke", z(d.year))
				.attr("cx", x(d.miles))
				.attr("cy", y(d.gas));
		}
	}

	// callback for when the mouse moves across the overlay
	function mouseMoveHandler() {
		// get the current mouse position
		const [mx, my] = d3.mouse(this);

		// use the new diagram.find() function to find the Voronoi site
		// closest to the mouse, limited by max distance voronoiRadius
		const diagram = voronoi(data);
		const site = diagram.find(mx, my, voronoiRadius);
		
		// highlight the point if we found one
		highlight(site && site.data);

		console.log(site.data.year);

	}


	// add the overlay on top of everything to take the mouse events
	g.append("rect")
		.attr("class", "overlay")
		.attr("width", innerChart.width)
		.attr("height", innerChart.height)
		.style("fill", "#f00")
		.style("opacity", 0)
		.on("mousemove", mouseMoveHandler)
		.on("mouseleave", () => {
			// hide the highlight circle when the mouse leaves the chart
			highlight(null);
		});
















	//WINDOW EVENT
	//-------------------------------------------------------------------------

	console.log("Etat du document : " + document.readyState);
	if (document.readyState == "loading") {
		document.addEventListener("DOMContentLoaded", ()=>{
			resize();
		});
	} else {
		resize();
	}

	window.addEventListener("resize", (()=>{
		resize();
	}));


	function resize(){

		//WIDTH & HEIGHT UPDATE
		//-------------------------------------------------------------------------

		//get width svg and innerChart
		opts.width = document.querySelector(".c-svg").clientWidth;
		opts.height = document.querySelector(".c-svg").clientHeight;
		innerChart.width = opts.width - opts.margin.left - opts.margin.right;
		innerChart.height = opts.height -opts.margin.top - opts.margin.bottom;

		//update svg width & height
		svg.attr("width", opts.width)
			.attr("height", opts.height);

		//update x axis
		x.range([0, innerChart.width]);
		//update y axis
		y.range([innerChart.height, 0]);

		//call x axis
		svg.selectAll(".x_axis")
			.attr("transform", `translate(0 ${innerChart.height})`)
			.call(xAxis);
		//call y axis
		svg.selectAll(".y_axis")
			.call(yAxis);

		//update x tick marks
		xAxis.ticks(Math.max(innerChart.width/100, 2));
		//update y tick marks
		yAxis.ticks(Math.max(innerChart.height/70, 2));

		//update data-point
		circles.selectAll(".data-point")
			.attr("cx", d => x(d.miles))
			.attr("cy", d => y(d.gas));

		
		//update voronoi cells
		voronoi
			.x(d => x(d.miles))
			.y(d => y(d.gas))
			.extent([[0, 0], [innerChart.width, innerChart.height]]);
		
		cells.selectAll("path")
			.data(voronoi.polygons(data))
			.attr("d", ((d)=>{ return d ? "M" + d.join("L") + "Z" : null; }));
		
		//update overlay
		svg.select(".overlay")
			.attr("width", innerChart.width)
			.attr("height", innerChart.height);

	}



}); //d3.csv



