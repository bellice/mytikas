//INITIALISATION

//contructor Intl.NumberFormat for language sensitive number formatting
const numberFormat = new Intl.NumberFormat(
	undefined, {
		minimumFractionDigits: 0,
		maximumFractionDigits: 2
	}
);



console.log(numberFormat.format(1213131.24141));
console.log(dateFormat.format(new Date("2010/08")));

//opts for svg
const opts = {
	container: ".c-svg",
	width: document.querySelector(".c-svg").clientWidth,
	height: document.querySelector(".c-svg").clientHeight,
	margin: {
		top: 20,
		right: 20,
		bottom: 20,
		left: 20
	}
};


const svg = d3.select(opts.container)
	.append("svg")
	.attr("id", "svg-1")
	.attr("width", opts.width)
	.attr("height", opts.height);

const g = svg.append("g")
	.attr("id", "svg-1-main")
	.attr("transform", "translate(" + opts.margin.left + "," + opts.margin.top + ")");


//dimension axis
const x = d3.scaleTime()
	.range([0, opts.width]);

const y = d3.scaleLinear()
	.range([opts.height, 0]);


d3.csv("data/unemployment.csv").then(function(data){

	console.log(data);

	let monthKeys = data.columns.slice(1);
	console.log(monthKeys)

});



/*

	//Initiate x Axis
	const xScale = d3.scaleLinear()
	.domain(d3.extent(data, ((d)=>{return d.year;}))) //input
	.range([margin.left, width-margin.right]); //output

const yScale = d3.scaleLinear()
	.domain([min,max]).nice() //input
	.range([height-margin.bottom, margin.top]); //output


const xAxis = d3.axisBottom(xScale)
	.tickSizeOuter(0);

const yAxis = d3.axisLeft(yScale)
	.ticks(5)
	.tickSizeOuter(0)
	.tickFormat((d)=>{return format2(d)+" %";}); //add unit

*/