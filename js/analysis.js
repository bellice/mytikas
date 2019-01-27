console.log("This is the index !");
console.log("Client side data processing");
console.log("\n\n");



/*
------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------
READ DATA 
------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------
*/

/* READ CSV 
--------------------------------------
--------------------------------------
*/


//d3.csv convert data into an array of object
d3.csv("data/cities.csv").then(function(data){
	console.log("1/ Lecture fichier csv :");
	console.log(data[0]);
	console.log("\n");
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
	
	console.log("2/ Lecture fichier csv en changeant le type de donnée après l'appel du document:");
	console.log(data[0]);
	console.log("\n");
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

	console.log("3/ Lecture fichier csv en changeant le type de donnée pendant l'appel du document:");
	console.log(data[0]);
	console.log("\n");

});



/* READ JSON 
--------------------------------------
--------------------------------------
*/

//a JSON value can be a string, a number a boolean value,
//an array, or another object
d3.json("data/employees.json").then(function(data){
	console.log("4/ Lecture fichier json :");
	console.log(data[0]);
	console.log("\n");
});



//loading multiple file with Promises
//inside all method, we load two types of files
//using two different loading functions
//the method returns an aray of our data sources
Promise.all([
	d3.csv("data/cities.csv"),
	d3.json("data/employees.json")
]).then(function(data){

	console.log("5/ Lecture 2 fichiers, 1 csv et 1 json :");
	console.log(data[0][0]);
	console.log(data[1][0]);
<<<<<<< HEAD
	console.log("\n");

});


/*
------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------
COMBINING DATA 
------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------
*/


/* ONE OR MORE COMMON ATTRIBUTES 
--------------------------------------
--------------------------------------
*/

var articles = [{
	"id": 1,
	"name": "vacuum cleaner",
	"weight": 9.9,
	"price": 89.9,
	"brand_id": 2
}, {
	"id": 2,
	"name": "washing machine",
	"weight": 540,
	"price": 230,
	"brand_id": 1
}, {
	"id": 3,
	"name": "hair dryer",
	"weight": 1.2,
	"price": 24.99,
	"brand_id": 2
}, {
	"id": 4,
	"name": "super fast laptop",
	"weight": 400,
	"price": 899.9,
	"brand_id": 3
}];

var brands = [{
	"id": 1,
	"name": "SuperKitchen"
}, {
	"id": 2,
	"name": "HomeSweetHome"
}];


//simple join (left outer join) using Array functions
//modify articles array by adding new key-value pair for brand
articles.forEach(function(el) {
	var result = brands.filter(function(brand) {
		return brand.id === el.brand_id;
	}); //result retourne l"array brands selon la condition pour chaque el
	delete el.brand_id; //supprime la clé brand_id
	el.brand = (result[0] !== undefined) ? result[0].name : null; //affecte le résultat dans el.brand
});

console.log("6/ Jointure gauche de 2 json :");
console.log(articles);
console.log("\n");


//Jointure efficace

function join(lookupTable, mainTable, lookupKey, mainKey, select) {
	var l = lookupTable.length,
		m = mainTable.length,
		lookupIndex = [],
		output = [];
	for (var i = 0; i < l; i++) { // loop through l items
		var row = lookupTable[i];
		lookupIndex[row[lookupKey]] = row; // create an index for lookup table
	}
	for (var j = 0; j < m; j++) { // loop through m items
		var y = mainTable[j];
		var x = lookupIndex[y[mainKey]]; // get corresponding row from lookupTable
		output.push(select(y, x)); // select only the columns you need
	}
	return output;
};

var result = join(brands, articles, "id", "brand_id", function(article, brand) {
	return {
		id: article.id,
		name: article.name,
		weight: article.weight,
		price: article.price,
		brand: (brand !== undefined) ? brand.name : null
	};
});
console.log("7/ Jointure gauche plus rapide de 2 json :");
console.log(result);
console.log("\n");


/*
------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------
SUMMARIZING DATA 
------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------
*/


let data = [
	{"city":"seattle", "state":"WA", "population":652405, "land_area":83.9},
	{"city":"new york", "state":"NY", "population":8405837, "land_area":302.6},
	{"city":"boston", "state":"MA", "population":645966, "land_area":48.3},
	{"city":"kansas city", "state":"MO", "population":467007, "land_area":315}
];

let minLand = d3.min(data,((d)=>{ return d.land_area; }));
console.log("9/ Minimum :");
console.log(minLand);
console.log("\n");

let maxLand = d3.max(data,((d)=>{ return d.land_area; }));
console.log("10/ Maximum :");
console.log(maxLand);
console.log("\n");

let landExtent = d3.extent(data,((d)=>{ return d.land_area; }));
console.log("11/ Minimum et Maximum : ");
console.log(landExtent);
console.log("\n");

let landAvg = d3.mean(data, ((d)=> { return d.land_area; }));
console.log("12/ Moyenne : ");
console.log(landAvg);
console.log("\n");

let landMed = d3.median(data, ((d)=>{ return d.land_area; }));
console.log("13/ Médiane : ");
console.log(landMed);
console.log("\n");

let landSD = d3.deviation(data, ((d)=>{ return d.land_area; }));
console.log("14/ Ecart-type : ");
console.log(landSD);
console.log("\n");


/*
------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------
ITERATING OVER AND REDUCING DATA
------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------
*/

//forEach is used to process each data object

let count=0;
data.forEach((d)=>{ count +=1;});
console.log("15/ Nombre de lignes dans data via forEach: ")
console.log(count);
console.log("\n");

console.log("16/ Nombre de lignes dans data via length: ")
console.log(data.length);
console.log("\n");

//the clone function takes an object and returns a copy of that object
//that copy is a separate data object that we can edit
//without effecting the original object
let dataObject = {"name":"Carl", "age":"48", "salary":"12300"};
let copyOfData = _.clone(dataObject);
copyOfData.age = +copyOfData.age;
copyOfData.salary = +copyOfData.salary;
console.log("17/ Données source :");
console.log(dataObject);
console.log("\n");
console.log("18/ Données copiées :");
console.log(copyOfData);
console.log("\n");

//by default, clone function will not copy over nested objects
let dataObject2 = {"name":"Saul", "stats":{"age":"55"}};
let shallowCopy = _.clone(dataObject2);
shallowCopy.stats.age = +shallowCopy.stats.age;
console.log("19/ Données source :");
console.log(dataObject2);
console.log("\n");
console.log("20/ Données copiées :");
console.log(shallowCopy);
console.log("\n");

//to provide this, use function cloneDeep
let dataObject3 = {"name":"Saul", "stats":{"age":"55"}};
var deepCopy = _.cloneDeep(dataObject3);
deepCopy.stats.age = +deepCopy.stats.age;
console.log("21/ Données source :");
console.log(dataObject3);
console.log("\n");
console.log("22/ Données copiées :");
console.log(deepCopy);
console.log("\n");


//map implement concept of a transformation on immutable data
//map takes an array and produces another array
//map does not modify the array
let smallData = data.map((d,i)=>{
	return {
		name: d.city.toUpperCase(),
		index: i+1,
		rounded_area: Math.round(d.land_area)
	};
});
console.log("23/ Données source :");
console.log(data[0]);
console.log("\n");
console.log("24/Données map :");
console.log(smallData[0]);
console.log("\n");

let large_land = data.filter((d)=>{ return d.land_area > 200; });
console.log("25/ Données filtrées :");
console.log(large_land);
console.log("\n");

//to sort an array, you need a comparator function
data.sort((a,b)=>{ return b.population-a.population;});
console.log("26/ Tri croissant :");
console.log(data);
console.log("\n");


//d3.ascending or d3.descending are comparator functions
let populations = data.map((d)=>{ return d.population;});
console.log("27/ Pas de tri effectué :");
console.log(populations);
console.log("\n");

populations.sort(d3.descending);
console.log("28/ Tri effectué :");
console.log(populations);
console.log("\n");

//reduce take an array and reduce it down to a single number
//example with summing up a value
//we start the sum at 0.
let landSum = data.reduce((sum, d)=> {
	return sum + d.land_area;
}, 0);
console.log("29/Utilisation de reduce :");
console.log(landSum);
console.log("\n");

//chaining functions
let bigCities = data.filter((d)=> { return d.population > 500000; })
	.sort((a,b)=>{ return a.population - b.population; })
	.map((d)=>{ return d.city;});
console.log("30/Chainage de fonctions :");
console.log(bigCities);
console.log("\n");



/*
------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------
GROUPING DATA
------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------
*/



let expenses = [{"name":"jim","amount":34,"date":"11/12/2015"},
  {"name":"carl","amount":120.11,"date":"11/12/2015"},
  {"name":"jim","amount":45,"date":"12/01/2015"},
  {"name":"stacy","amount":12.00,"date":"01/04/2016"},
  {"name":"stacy","amount":34.10,"date":"01/04/2016"},
  {"name":"stacy","amount":44.80,"date":"01/05/2016"}
];
=======
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
>>>>>>> e9a544d431104b1253442bec10b163e8f5a0e803
