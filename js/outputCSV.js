let aJoindre3 = [
	{ name: "Joe", age: 22 },
	{ name: "Kevin", age: 24 },
	{ name: "Peter", age: 21 }
];


var headers = {
	name: "Name",
	age: "Age"
};
console.log(JSON.stringify(headers))

function convertToCSV(objArray) {
	var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
	var str = "";

	for (var i = 0; i < array.length; i++) {
		var line = "";
		for (var index in array[i]) {
			if (line != "") line += ",";

			line += array[i][index];
		}

		str += line + "\r\n";
	}

	return str;
}

function exportCSVFile(headers, items, fileTitle) {
	if (headers) {
		items.unshift(headers);
	}

	// Convert Object to JSON
	const jsonObject = JSON.stringify(items);

	const csv = this.convertToCSV(jsonObject);

	const exportedFilename = fileTitle + ".csv" || "export.csv";

	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	if (navigator.msSaveBlob) { // IE 10+
		navigator.msSaveBlob(blob, exportedFilename);
	} else {
		const link = document.createElement("a");
		if (link.download !== undefined) { // feature detection
			// Browsers that support HTML5 download attribute
			const url = URL.createObjectURL(blob);
			link.setAttribute("href", url);
			link.setAttribute("download", exportedFilename);
			link.style.visibility = "hidden";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}
}

function download(data, filetitle) {
	const fileTitle = filetitle; // or "my-unique-title"
	exportCSVFile(headers, data, fileTitle); // call the exportCSVFile() function to process the JSON and trigger the download
}


let dataDownload = document.querySelector(".data-download");
dataDownload.addEventListener("click", function () {
	download(aJoindre3, "data");
});