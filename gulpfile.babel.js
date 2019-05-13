import config from './package.json';
import { src, dest, watch, series, parallel } from 'gulp';
import browsersync from 'browser-sync';
import del from 'del';
import eslint from 'gulp-eslint';
import gulpif from 'gulp-if';
import imagemin from 'gulp-imagemin';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import rev from 'gulp-rev'
import revCollector from 'gulp-rev-collector'
import sourcemaps from 'gulp-sourcemaps';
import webpack from 'webpack-stream';

const
  dir = {
    src         : config.srcPath,
    build       : config.assetsPath
  },
  server = browsersync.create(),
  TerserJSPlugin = require("terser-webpack-plugin")
;

export const serve = (done) => {
  server.init({
    proxy: config.url,
    port: 3000,
    open: false
  });
  done();
}

export const reload = (done) => {
  server.reload();
  done();
}

export const clean = () => del( config.assetsPath );

export const styles = () => {
  return src( config.srcPath + "/css/style.css" )
  .pipe( plumber() )
  .pipe( gulpif( process.env.NODE_ENV === 'development', sourcemaps.init() ) )
  .pipe( postcss() )
  .pipe( gulpif( process.env.NODE_ENV === 'development', sourcemaps.write('.') ) )
  .pipe( dest( config.assetsPath + 'css' ) )
  .pipe( server.stream() );
}

export const images = () => {
  return src( config.srcPath + "/img/**/*.{jpg,jpeg,png,svg,gif}" )
  .pipe( gulpif( process.env.NODE_ENV === 'production', imagemin() ) )
  .pipe( dest( config.assetsPath + 'img' ) );
}

export const fonts = () => {
  return src( config.srcPath + "/webfonts/**/*" )
    .pipe( dest( config.assetsPath + 'webfonts' ) )
    .pipe( server.stream() )
}

export const scriptLint = () => {
  return src( [config.srcPath + "/js/**/*","./gulpfile.js"] )
    .pipe( plumber() )
    .pipe( eslint() )
    .pipe( eslint.format() )
    .pipe( eslint.failAfterError() );
}

export const scripts = () => {
  return src( [config.srcPath + "/js/bundle.js"] )
  .pipe( plumber())
  .pipe( webpack({
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader",
        },
      ]
    },
    optimization: {
      minimizer: [
        new TerserJSPlugin({}),
      ]
    },
    mode: process.env.NODE_ENV ? 'production' : 'development',
    devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : false,
    output: {
      filename: 'bundle.js'
    },
    externals: {
      jquery: 'jQuery'
    },
  }) )
  .pipe( dest( config.assetsPath + 'js' ) )
  .pipe( server.stream() );
}


// export const cacheBust = () => {
//   return src( [config.assetsPath + "css/**/*",config.assetsPath + "js/**/*"], { base: config.assetsPath } )
//   .pipe( rev() )
//   .pipe( dest(config.assetsPath) )
//   .pipe( rev.manifest() )
//   .pipe( dest(config.assetsPath) );
// }

// TODO: figure out way of replacing files in enqueue without needed previous hash

// export const versionFiles = () => {
//   return src( [ config.assetsPath + 'rev-manifest.json' ,'./inc/globals.php'] )
//   .pipe( revCollector() )
//   .pipe( dest('./inc') );
// }

export const watchFiles = () => {
  watch( config.srcPath + "css/**/*", styles );
  watch( config.srcPath + "js/**/*", series(scriptLint, scripts) );
  watch( config.srcPath + "img/**/*", images );
  watch( "./**/*.php", reload );
}

export const js = series(scriptLint, scripts);
export const dev = series(clean, parallel(styles, images, fonts, scripts), serve, watchFiles);
export const build = series(clean, parallel(styles, images, fonts, scripts) );
export default dev;