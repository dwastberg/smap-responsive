
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var bowerfiles = require('gulp-bower-files');
var cache = require('gulp-cache');
var changed = require('gulp-changed');
var concat = require('gulp-concat');
var cssvalidator = require('gulp-css-validator');
var csslint = require('gulp-csslint');
var imagemin = require('gulp-imagemin');
var inject = require('gulp-inject');
var jshint = require('gulp-jshint');
var mincss = require('gulp-minify-css');
var minhtml = require('gulp-minify-html');
var ngmin = require('gulp-ngmin');
var order = require('gulp-order');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var rimraf = require('gulp-rimraf');
var sass = require('gulp-sass');
var stripdebug = require('gulp-strip-debug');
var stylus = require('gulp-stylus');
var todo = require('gulp-todo');
var uglify = require('gulp-uglify');
var using = require('gulp-using');
var gutil = require('gulp-util');

var es = require('event-stream');
var pngcrush = require('imagemin-pngcrush');



var p = {

	// ----- Our libs ------
	libsCss: [
		'dist/lib/font-awesome/**/*.css',
		'dist/lib/sass-bootstrap/**/*.css',
		'dist/lib/es5-shim/**/*.css',
		'dist/lib/leaflet/**/*.css',
		'dist/lib/**/*.css'
	],
	libsJs: [
		'dist/lib/proj4/**/*.js',
		'dist/lib/jquery/**/*.js',
		'dist/lib/sass-bootstrap/**/*.js',
		'dist/lib/leaflet/**/*.js',
		'lib/jquery.mobile.custom/jquery.mobile.custom.min.js', // Note! I could not install this lib with bower.
		'dist/lib/**/*.js'
	],

	// ----- Our code ------
	ourSass: [
		// first
		"core/css/**/*.scss",

		// last
		"plugins/**/*.scss"

	],
	ourStylus: [
		// first
		"core/css/**/*.styl",

		// last
		"plugins/**/*.styl"
	],
	ourCss: [
		// first
		"core/css/app.css",
		"core/css/lib-overrides.css",

		// last
		"plugins/**/*.css",
		"!plugins/MyPlugin/**/*.css",
		"!plugins/SideBars/**/*.css",
		"!plugins/ThreeD/**/*.css",
		"!plugins/WorkshopPlugin/**/*.css"

		
	],
	ourJs: [
		"core/js/smap.js",
		"core/js/*.js",
		"plugins/**/*.js",
		"!plugins/MyPlugin/**/*.js",
		"!plugins/SideBars/**/*.js",
		"!plugins/ThreeD/**/*.js",
		"!plugins/WorkshopPlugin/**/*.js",
		"!plugins/PluginTemplate.js"
	]

};





// ----- Tasks ------

gulp.task('cleancode', function() {
	gulp.src("dist/css").pipe(rimraf());
	gulp.src("dist/js").pipe(rimraf());
});
gulp.task('cleanlib', function() {
	return gulp.src("dist/lib").pipe(rimraf());
});
gulp.task('cleanimg', function() {
	return gulp.src("dist/img").pipe(rimraf());
});
gulp.task('clean', ['cleanlib', 'cleancode']); // Clean all but img folder
gulp.task('cleantotal', function() {
	return gulp.src("dist").pipe(rimraf());
});





// ---- Our code -----

gulp.task('ourcsscompile', function() {
	var streamStylus = gulp.src(p.ourStylus, {base: "./"})
			.pipe(stylus());
	var streamSass = gulp.src(p.ourSass, {base: "./"})
			.pipe(sass());

	return es.merge(streamStylus, streamSass)
		.pipe(autoprefixer("last 1 version", "> 1%", "ie 8"))
		.pipe(gulp.dest("."));
});


gulp.task('ourcss', ['ourcsscompile'], function() {
	return gulp
		.src(p.ourCss)
		.pipe(autoprefixer("last 1 version", "> 1%", "ie 8"))
		// .pipe(csslint())
		// .pipe(csslint.reporter())
		// .pipe(order(p.ourCss.concat("*")))
		.pipe(concat('smap.css'))
		.pipe(mincss())
		// .pipe(rename("smap.css"))
		.pipe(gulp.dest("dist/css"));
});



gulp.task('ourjs', function() {
	return gulp
		.src(p.ourJs)
		// .pipe(order(p.ourJs.concat("*")))
		// .pipe(jshint())
  // 		.pipe(jshint.reporter('default'))
  		.pipe(concat("smap.js"))
  		// .pipe(ngmin())
		.pipe(uglify())  // {mangle: false}
		.pipe(gulp.dest("dist/js"));
});





gulp.task('images', function () {
	var imgDest = 'dist/img';
    return gulp
    	.src(['img/**/*.png', 'img/**/*.jpg', 'img/**/*.jpeg', 'img/**/*.gif'])
    	.pipe(changed(imgDest))
        .pipe(imagemin({
        	progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngcrush()]
        }))
        .pipe(gulp.dest(imgDest));
});

gulp.task('libs', function() {
	return bowerfiles().pipe(gulp.dest("dist/lib"));  // {checkExistence: true}
});

gulp.task('htmlinjectdev', ["libs", "ourcss", "ourjs"], function() {
	var devSrcs = p.libsJs.concat(p.libsCss).concat(p.ourJs).concat(p.ourCss);
	return gulp
		.src('index_template.html')
		.pipe(inject(gulp.src(devSrcs, {read: false}), {addRootSlash: false}))
		.pipe(rename("dev.html"))
		.pipe(gulp.dest("."));
});

gulp.task('htmlinjectprod', ["libs", "ourcss", "ourjs"], function() {
	var prodSrcs = p.libsJs.concat(p.libsCss).concat("dist/js/*.js").concat("dist/css/*.css");
	return gulp
		.src('index_template.html')
		.pipe(inject(gulp.src(prodSrcs, {read: false}), {addRootSlash: false}))
		.pipe(rename("index.html"))
		.pipe(gulp.dest("."));
});
gulp.task('htmlinject', ["htmlinjectdev", "htmlinjectprod"]);

gulp.task('htmlcompress', ['htmlinject'], function() {
	return gulp
		.src('index.html')
		.pipe(minhtml())
		.pipe(gulp.dest("."));
});
gulp.task('html', ["htmlcompress"]);




// Build our code (during dev)
gulp.task('ourcode', ["ourcss", "ourjs"]); //["cleancss", "cleanjs", "ourcss", "ourjs"]);

gulp.task('_full', ["images", "html"]);

// Clean the code and libs and then make a full build (i.e. fetch libs to dist,
// compile js/css/sass/styl and insert into HTML).
gulp.task('full', ["cleancode"], function() {
	return gulp.start("_full");
});

// Note! It's wise to run <bower update> before resetting. Thereby, packages will be
// up to date and any missing files (however that might happen...) will be filled-in.
gulp.task('reset', ["cleantotal", "full"]);


gulp.task('watch', function() {
	var css = p.ourCss.concat(p.ourStylus).concat(p.ourSass);
	var js = p.ourJs;
	return gulp.watch(js.concat(css), ["ourcode"]);
});

gulp.task('default', ["watch"]); // Note! <gulp> is same as <gulp default>




























