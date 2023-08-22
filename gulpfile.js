"use strict";
// Imports
const { src, dest } = require("gulp");
const gulp = require("gulp");

const autoPrefixer = require("gulp-autoprefixer"),
	cssBeautify = require("gulp-cssbeautify"),
	rename = require("gulp-rename"),
	sass = require("gulp-sass")(require("sass")),
	cssnano = require("gulp-cssnano"),
	uglify = require("gulp-uglify"),
	rigger = require("gulp-rigger"),
	plumber = require("gulp-plumber"),
	imageMin = require("gulp-imagemin"),
	del = require("del"),
	notify = require("gulp-notify"),
	fileInclude = require("gulp-file-include"),
	groupMedia = require("gulp-group-css-media-queries"),
	browserSync = require("browser-sync").create(),
	bulk = require("gulp-sass-bulk-import"),
	changed = require("gulp-changed");

// 2 main directories
const srcPath = "src/",
	distPath = "dist/";

// All routes
const path = {
	build: {
		html: distPath,
		css: distPath + "css/",
		js: distPath + "js/",
		img: distPath + "img/",
		fonts: distPath + "fonts/",
	},
	src: {
		html: srcPath + "*.html",
		css: srcPath + "scss/style.scss",
		js: srcPath + "js/script.js",
		img: srcPath + "img/**/*.{png,jpg,svg,gif,ico,webp}",
		fonts: srcPath + "fonts/**/*.{eot,woff,woff2,ttf,svg}",
	},
	watch: {
		html: srcPath + "**/*.html",
		css: srcPath + "**/*.scss",
		js: srcPath + "js/*.js",
		img: srcPath + "img/**/*.{png,jpg,svg,gif,ico,webp}",
		fonts: srcPath + "fonts/**/*.{eot,woff,woff2,ttf,svg}",
	},
	clean: distPath,
};

//* Tasks
function server() {
	browserSync.init({
		server: {
			baseDir: distPath,
		},
		port: 3000,
		notify: false,
	});
}

//* HTML
function html() {
	return src(path.src.html)
		.pipe(
			plumber({
				errorHandler: notify.onError((error) => ({
					title: "HTML",
					message: error.message,
				})),
			})
		)
		.pipe(fileInclude())
		.pipe(dest(path.build.html))
		.pipe(browserSync.stream());
}

//* CSS
function css() {
	return src(path.src.css, { allowEmpty: true })
		.pipe(
			plumber({
				errorHandler: notify.onError((error) => ({
					title: "CSS",
					message: error.message,
				})),
			})
		)
		.pipe(bulk())
		.pipe(sass())
		.pipe(groupMedia())
		.pipe(
			autoPrefixer({
				cascade: true,
				overrideBrowserslist: ["last 5 versions"],
			})
		)
		.pipe(cssBeautify())
		.pipe(dest(path.build.css))
		.pipe(
			cssnano({
				zindex: false,
				discardComments: {
					removeAll: true,
				},
			})
		)
		.pipe(
			rename({
				suffix: ".min",
				extname: ".css",
			})
		)
		.pipe(dest(path.build.css))
		.pipe(browserSync.stream());
}

//* JS
function js() {
	return src(path.src.js, { allowEmpty: true })
		.pipe(
			plumber({
				errorHandler: notify.onError((error) => ({
					title: "JS",
					message: error.message,
				})),
			})
		)
		.pipe(rigger())
		.pipe(dest(path.build.js))
		.pipe(uglify())
		.pipe(
			rename({
				suffix: ".min",
				extname: ".js",
			})
		)
		.pipe(dest(path.build.js))
		.pipe(browserSync.stream());
}

//* IMG
function images() {
	return src(path.src.img)
		.pipe(changed(path.build.img))
		.pipe(
			imageMin([
				imageMin.gifsicle({ interlaced: true }),
				imageMin.mozjpeg({ quality: 80, progressive: true }),
				imageMin.optipng({ optimizationLevel: 5 }),
				imageMin.svgo({
					plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
				}),
			])
		)
		.pipe(dest(path.build.img))
		.pipe(browserSync.stream());
}

//* FONTS
function fonts() {
	return src(path.src.fonts).pipe(dest(path.build.fonts)).pipe(browserSync.stream());
}

//* CLEAN Directory
function clean() {
	return del(path.clean);
}

//* WATCH task
function watchFiles() {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], images);
	gulp.watch([path.watch.fonts], fonts);
}

//* Main tasks
const build = gulp.series(clean, gulp.parallel(html, css, js, images, fonts));
const watch = gulp.parallel(build, server, watchFiles);

//* Exports
exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.clean = clean;
exports.build = build;
exports.default = watch;
