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
		bottom: 20,
		left: 20
	}
};

//opts for chart
const innerChart = {
	width: opts.width - opts.margin.left - opts.margin.right,
	height: opts.height -opts.margin.top - opts.margin.bottom
};

//opts for viz = chart with data
const viz = {
	
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



//DATA IMPORT
//-------------------------------------------------------------------------

Promise.all([
	d3.json("data/epci.json"),
	d3.json("data/epci_reg.json")
]).then(function(data){

	const featureCollection = topojson.feature(data[0], data[0].objects.epci_gen); //geojson
	const featureCollectionReg = topojson.feature(data[1], data[1].objects.epci_reg_gen); //geojson


	//projection
	const projection = d3.geoConicConformal() //france projection
		.fitSize([innerChart.width,innerChart.height],featureCollection);

	const path = d3.geoPath() //generate path
		.projection(projection); //add projection to path


	//generate epci
	let epci = g.append("g")
		.attr("class","c-epci");
        
	epci.selectAll(".epci")
		.data(featureCollection.features)
		.join("path")
		.attr("d", path)
		.attr("class", "epci")
		.style("fill", "#78706c")
		.style("stroke", "#f8e7df")
		.style("stroke-width",.1);


	//generate reg
	let region = g.append("g")
		.attr("class","c-reg");
        
	region.append("path")
		.datum(featureCollectionReg)
		.attr("d", path)
		.attr("class", "region")
		.style("stroke", "#f8e7df")
		.style("stroke-width", .7)
		.style("fill", "none");



	//POPUP
	//-------------------------------------------------------------------------
	const popup = d3.select("body").append("div")
		.attr("class", "popup");

	epci.selectAll(".epci")
		.on("mousemove", mouseMoveHandler)
		.on("mouseleave", mouseLeaveHandler);


	function mouseMoveHandler(d){
		popup
			.transition()
			.duration(50)
			.style("left", d3.event.pageX -10 + "px")
			.style("top", d3.event.pageY - 40 + "px")
			.style("opacity", 1)
			.style("text-align", "left");

		popup
			.html(`
				<div><strong>${d.properties.libepci}</strong></div>
				`);

		//geographical unit
		d3.select(this)
			.style("fill-opacity",.2);

	}

	function mouseLeaveHandler(){
		popup
			.transition()
			.duration(100)
			.style("opacity", 0);

		//geographical unit
		d3.select(this)
			.style("fill-opacity",1);
	}


	//ZOOM EVENT
	//-------------------------------------------------------------------------

	//zoom
	svg
		.call(d3.zoom()
			.scaleExtent([1,6]) //deep zoom
			.translateExtent([[0,0],[innerChart.width, innerChart.height]])
			.on("zoom", zoomed)
			.on("start", zoomstart)
			.on("end", zoomend)
		);

	function zoomed(){
		g.attr("transform", d3.event.transform);
	}

	function zoomstart(){
		epci
			.on("mousemove",null);
	}


	function zoomend(){
		epci.selectAll(".epci")
			.on("mousemove", mouseMoveHandler)
			.on("mouseleave", mouseLeaveHandler);
	}




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

		//update projection
		projection
			.fitSize([innerChart.width,innerChart.height],featureCollection);	
		path
			.projection(projection);
            
		//update path
		svg.selectAll("path")
			.attr("d", path);
            
		//update zoom
		svg
			.call(d3.zoom()
				.scaleExtent([1,6]) //deep zoom
				.translateExtent([[0,0],[innerChart.width, innerChart.height]])
				.on("zoom", zoomed)
				.on("start", zoomstart)
				.on("end", zoomend)
			);

	} //function resize



	//BUTTON CONTROL MAP
	//-------------------------------------------------------------------------


	const buttonMapControl = document.querySelector(".map-control-a");
	const buttonMapControlClick = document.querySelector(".map-control-click");
	let displayControlToggle = 1;

	function showControlButton(){
		buttonMapControlClick.style.display = "flex";
	}
	function hideControlButton(){
		buttonMapControlClick.style.display = "none";
	}
	
	buttonMapControl.addEventListener("click",function(e){
		displayControlToggle++;
		if (displayControlToggle % 2 ==0){
			showControlButton();
		} else {
			hideControlButton();
		}
		e.stopPropagation();
	});

	//CHECKBOX CONTROL MAP
	//-------------------------------------------------------------------------

	d3.select("#check-region").on("change", checkUpdate);

	function checkUpdate(){
		if (d3.select("#check-region").property("checked")){
			region.style("opacity",1);
		} else{
			region.style("opacity",0);
		}
	}


	//BUTTON SEARCH MAP
	//-------------------------------------------------------------------------

	const buttonMapSearch = document.querySelector(".map-search-a");
	const buttonMapSearchClick = document.querySelector(".map-search-click");
	let displaySearchToggle=1;

	function showSearchButton(){
		buttonMapSearchClick.style.display = "flex";
	}
	function hideSearchButton(){
		buttonMapSearchClick.style.display = "none";
	}
	
	buttonMapSearch.addEventListener("click",function(e){
		
		
		displaySearchToggle++;
		if (displaySearchToggle % 2 ==0){
			showSearchButton();
		} else {
			hideSearchButton();
		}
		e.stopPropagation();
	});

	//STOP PROPAGATION CLICK BUTTON
	const mapClick = document.querySelectorAll(".map-click");

	Array.from(mapClick).forEach((el)=>{
		el.addEventListener("click", function(e){
			e.stopPropagation();
		});
	});


	//hide search and control map
	//disable click on children event e.stopPropagation
	window.addEventListener("click", (()=>{
		//reset value
		displaySearchToggle=1;
		displayControlToggle=1;
		hideControlButton();
		hideSearchButton();
	}));

    
}); //d3 promise