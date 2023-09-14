"use strict";
// Imports
import gulp from "gulp";

import autoPrefixer from "gulp-autoprefixer";
import cssBeautify from "gulp-cssbeautify";
import rename from "gulp-rename";
import cssNano from "gulp-cssnano";
import uglify from "gulp-uglify";
import rigger from "gulp-rigger";
import plumber from "gulp-plumber";
import imageMin from "gulp-imagemin";
import del from "del";
import notify from "gulp-notify";
import fileInclude from "gulp-file-include";
import groupMedia from "gulp-group-css-media-queries";
import browserSync from "browser-sync";
import bulk from "gulp-sass-bulk-import";
import changed from "gulp-changed";
import gulpSass from "gulp-sass";
import * as nodeSass from "sass";

const sass = gulpSass(nodeSass);

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
export function html() {
	return gulp
		.src(path.src.html)
		.pipe(
			plumber({
				errorHandler: notify.onError((error) => ({
					title: "HTML",
					message: error.message,
				})),
			})
		)
		.pipe(fileInclude())
		.pipe(gulp.dest(path.build.html))
		.pipe(browserSync.stream());
}

//* CSS
export function css() {
	return gulp
		.src(path.src.css, { allowEmpty: true })
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
		.pipe(gulp.dest(path.build.css))
		.pipe(
			cssNano({
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
		.pipe(gulp.dest(path.build.css))
		.pipe(browserSync.stream());
}

//* JS
export function js() {
	return gulp
		.src(path.src.js, { allowEmpty: true })
		.pipe(
			plumber({
				errorHandler: notify.onError((error) => ({
					title: "JS",
					message: error.message,
				})),
			})
		)
		.pipe(rigger())
		.pipe(gulp.dest(path.build.js))
		.pipe(uglify())
		.pipe(
			rename({
				suffix: ".min",
				extname: ".js",
			})
		)
		.pipe(gulp.dest(path.build.js))
		.pipe(browserSync.stream());
}

//* IMG
export function images() {
	return gulp
		.src(path.src.img)
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
		.pipe(gulp.dest(path.build.img))
		.pipe(browserSync.stream());
}

//* FONTS
export function fonts() {
	return gulp
		.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
		.pipe(browserSync.stream());
}

//* CLEAN Directory
export function clean() {
	return del(path.clean);
}

//* WATCH task
export function watchFiles() {
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
export default watch;
