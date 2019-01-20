console.log("This is the index !");
console.log("Client side data processing");

var theMax = d3.max([1, 2, 20, 3]);
console.log(theMax);



/* READ CSV 
--------------------------------------
--------------------------------------
*/

/*
//d3.csv convert data into an array of object
d3.csv("data/cities.csv").then(function(data){
	console.log(data[0]);
});


//headers of the csv have been used as the property names
//for the data objects. These properties are all strings
d3.csv("data/cities.csv").then(function(data){

	//forEach iterate over the data array
	//+ (unary pus) operator for type conversion in number
	data.forEach((d)=>{
		//use dot notation to access properties data objects
		d.population = +d.population;
		//use bracket notation to access with header with space
		d["land area"] = +d["land area"];
	});
    
	console.log(data[0]);
});

//same manipulation but during the loading of the data
//this is done by providing an accessor function to d3.csv
d3.csv("data/cities.csv", function(d){
	return{
		city : d.city,
		state: d.state,
		population: +d.population,
		land_area: +d["land area"]
	};
}).then(function(data){
	console.log(data[0]);
});
/*


/* READ JSON 
--------------------------------------
--------------------------------------
*/

//a JSON value can be a string, a number a boolean value,
//an array, or another object
d3.json("data/employees.json").then(function(data){
	console.log(data[0]);
});



//loading multiple file with Promises
//inside all method, we load two types of files
//using two different loading functions
//the method returns an aray of our data sources
Promise.all([
	d3.csv("data/cities.csv"),
	d3.json("data/employees.json")
]).then(function(data){
	console.log(data[0][0]);
	console.log(data[1][0]);
});