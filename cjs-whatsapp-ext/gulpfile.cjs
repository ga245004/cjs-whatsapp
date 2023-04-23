const { src, dest } = require('gulp');
const { compile } = require('nexe');
const { exec } = require('pkg');

const config = {
  srcPkg: "./dist/main.js",
  dest: "./dest/main.js",
  outputName: "cjs-whatsapp-ext.exe",
  output: "../extensions/cjs-whatsapp-ext/"
}

function copyExt() {
  return src(config.outputName)
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

exports.copyExt = copyExt;
exports.packageExtPkg = packageExtPkg;
exports.packageExtNexe = packageExtNexe;
exports.packageServerExt = packageServerExt; 