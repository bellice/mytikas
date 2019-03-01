const  gulp = require("gulp");
const browserSync = require("browser-sync").create();

 
//Start BrowserSync
gulp.task("sync", function() {
	browserSync.init({
		proxy: "http://127.0.0.1:8080/mytikas/"
	});
	//Reload app whenever HTML, JS or CSS files change
	gulp.watch("*.html").on("change", browserSync.reload); 
	gulp.watch("src/*.js").on("change", browserSync.reload);
	gulp.watch("src/*.css").on("change", browserSync.reload); 
});








/*
For JS script
- transpiler and compiler ES2015
- concatanate
- minify

For CSS script
- minify
*/
