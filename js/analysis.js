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


var data = [10, 20, 30, 40, 50];
// Select all existing circles and bind data to it
var circles = d3.selectAll("circle")
  .data(data);
 
// Update existing circles
circles.attr("fill", "red");
 
// Remove surplus circles
circles.exit().remove();
 
// Add new circles and then create a new selection
// merging the new and the existing circles and then
// update the merged selection
circles.enter()
  .append("circle")
  .merge(circles)
  .attr("fill", "green");
  //circles are present in the memory
  //see the nodes in the console


  //while binding data, it may happen that there are
  //surplus/less number of entries on either set. 3 scenarios :

  //SCENARIO 1:
  //number of dom elemetns are less than the number of
  //data points in the data set.
  //=>We need to add the missing elements to the DOM
  //=> ENTER set

  //SCENARIO 2:
  //number of dom elements are more than the number of
  //data points in the data set
  //=>We need to remove the surplus DOM elements
  //=>EXIT set

  //SCENARIO 3:
  //number of som elements are sames as tue number of
  //data points in the data set
  //=>We neet to update for data value changes
  //=>UPDATE SET