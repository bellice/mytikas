const  gulp = require("gulp");
const browserSync = require("browser-sync").create();

 
gulp.task("sync", function() {
	browserSync.init({
		proxy: "http://127.0.0.1:8080/mytikas/"
	});
});












/*
For JS script
- transpiler and compiler ES2015
- concatanate
- minify

For CSS script
- minify
*/
