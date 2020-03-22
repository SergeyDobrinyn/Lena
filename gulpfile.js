var gulp = require("gulp");
var rename = require("gulp-rename");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var sourcemaps = require("gulp-sourcemaps");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var browsersync = require("browser-sync").create();
function copy(done) {
  gulp.src("./index.html")
    .pipe(gulp.dest("./dist"));
  done();
}
function styles(done) {
  gulp.src("./scss/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({
      errorLogToConsole: true,
      outputStyle: "compressed"
    }))
    .on("error", console.error.bind(console))
    .pipe(autoprefixer({
      overrideBrowserslist: ["last 4 versions"],
      cascade: false
    }))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./dist/css"))
    .pipe(browsersync.stream());
  done();
}
function scripts(done) {
  gulp.src("./js/*.js")
    .pipe(concat("scripts.js"))
    .pipe(uglify())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest("./dist/js"));
  done();
}
function sync(done) {
  browsersync.init({
    server: {
      baseDir: "./dist"
    },
    port: 3000,
    browser: ["google chrome"],
    notify: false,
    open: false
  });
  done();
}
function reload(done) {
  browsersync.reload();
  done();
}
function watch() {
  gulp.watch("./index.html", copy);
  gulp.watch("./**/*.html", reload);
  gulp.watch("./scss/**/*", styles);
  gulp.watch("./js/**/*", scripts);
}
gulp.task("fonts", function() {
  return gulp.src("./fonts/**/*")
    .pipe(gulp.dest("dist/fonts"));
});
gulp.task("images", function() {
  return gulp.src("./img/**/*")
    .pipe(gulp.dest("dist/img"));
});
gulp.task("files", function() {
  return gulp.src("./files/**/*")
    .pipe(gulp.dest("dist/files"));
});
gulp.task("default", gulp.parallel(sync, watch));