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

const innerChart = {
	width: opts.width - opts.margin.left - opts.margin.right,
	height: opts.height -opts.margin.top - opts.margin.bottom
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
const x = d3.scaleTime()
	.range([0, innerChart.width]);

const y = d3.scaleLinear()
	.range([innerChart.height, 0]);


const voronoi = d3.voronoi()
	.x((d)=>{ return x(d.date); })
	.y((d)=> { return y(d.value); });


//DATA IMPORT
//-------------------------------------------------------------------------

d3.csv("data/data.csv").then(function(data){

	console.log(data);


	//VALUE PROCESS
	//-------------------------------------------------------------------------

	//slice() method return a new array object selected from begin to end
	//here just the values. begin : extraction included | end : extraction not included 
	const keyValue = data.columns.slice(1,3);

	//transform string value into integer
	data.forEach((d)=>{
		keyValue.forEach((key)=>{
			d[key] =  +d[key];
		});

	});

	//min max value for axis
	const min = d3.min(data, ((d)=>{ return d3.min(keyValue, ((key)=>{ return d[key]; })); }));
	const max = d3.max(data, ((d)=>{ return d3.max(keyValue, ((key)=>{ return d[key]; })); }));


	//NAME PROCESS
	//-------------------------------------------------------------------------

	//select category
	const nameValue = data.map((d)=>{ return d.name; });
	var colorValue = d3.schemeBlues[9];

	const color = d3.scaleOrdinal()
		.domain(nameValue)
		.range(colorValue);


	//AXIS
	//-------------------------------------------------------------------------

	//value axis
	x.domain([min, max]);
	y.domain([min, max]);

	const xAxis = d3.axisBottom(x)
		.ticks(Math.max(innerChart.width/100, 2));

	const yAxis = d3.axisLeft(y);

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

	window.addEventListener("resize", ((e)=>{
		resize();
	}));


	function resize(){

		//WIDTH UPDATE
		//-------------------------------------------------------------------------

		//get width svg and innerChart
		opts.width = document.querySelector(".c-svg").clientWidth;
		innerChart.width = opts.width - opts.margin.left - opts.margin.right;

		//update svg width
		svg.attr("width", opts.width);
		//update x axis width
		x.range([0, innerChart.width]);
		//call x axis
		svg.selectAll(".x_axis").call(xAxis);
		//update x tick marks
		xAxis.ticks(Math.max(innerChart.width/100, 2));


		//HEIGHT UPDATE
		//-------------------------------------------------------------------------

		//get height svg and innerChart
		opts.height = document.querySelector(".c-svg").clientHeight;
		innerChart.height = opts.height -opts.margin.top - opts.margin.bottom;

		//update svg height
		svg.attr("height", opts.height);
		//update y axis height
		y.range([innerChart.height, 0]);
		//update x axis height
		svg.selectAll(".x_axis").attr("transform", `translate(0 ${innerChart.height})`);
		//call y axis
		svg.selectAll(".y_axis").call(yAxis);
		//update y tick marks
		yAxis.ticks(Math.max(innerChart.height/70, 2));

	}




}); //d3.csv



