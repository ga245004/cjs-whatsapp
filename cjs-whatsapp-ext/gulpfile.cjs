const { src, dest, series } = require('gulp');
const { compile } = require('nexe');
const { exec } = require('pkg');
var clean = require('gulp-clean');
var run = require('gulp-run');

const config = {
  srcPkg: "./dist/cjs-whatsapp-ext.js",
  dest: "./dest/main.js",
  outputNameExe: "cjs-whatsapp-ext.exe",
  outputNameJs: "./dist/cjs-whatsapp-ext.js",
  output: "../extensions/cjs-whatsapp-ext/"
}


function devServer() {
  return run("webpack --config webpack.config.ext.dev.cjs && node dist/cjs-whatsapp-ext.js --nl-port 55337 --nl-extension-id js.neutralino.cjs.whatsapp.extension --nl-token SGiTkzwolv5MpROv-buMfSjj7Nzq8NxATM0iSZvhdiYT8TGJ")
    .pipe(dest('output'));
}



function copyExt() {
  return src(config.outputNameExe)
    .pipe(clean({ force: true }))
    .pipe(dest(config.output));
}

function cleanOutput() {
  return src(`${config.output}\*`, { read: false })
    .pipe(clean({ force: true }));
}

function copyJs() {
  return src(config.outputNameJs)
    .pipe(dest(config.output));
}

function packageExtPkg(cp) {
  return exec([config.srcPkg, '--target', 'host', '--output', config.outputName]).then(() => {
    console.log('success');
    cp();
  })
}

function packageExtNexe(cp) {
  compile({
    input: config.srcPkg,
    target: "windows-x64-14.5.0",
    build: true,
    name: config.outputName
  }).then(() => {
    console.log('success')
  })
  return cp();
}


function packageServerExt(cp) {
  compile({
    input: './dist/server.js',
    target: "windows-x64-14.5.0",
    name: 'cjs-whatsapp-server'
  }).then(() => {
    console.log('success')
  })
  return cp();
}

exports.devServer = devServer;
exports.copyExt = copyExt;
exports.copyJs = series(cleanOutput, copyJs);
exports.packageExtPkg = packageExtPkg;
exports.packageExtNexe = packageExtNexe;
exports.packageServerExt = packageServerExt; 