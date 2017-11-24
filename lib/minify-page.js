'use strict';

require('colors');
const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');
const pd = require('pretty-data').pd;
const utils = require('./utils');
const config = require('./config')();

const EXT_WXML = '.wxml';
const EXT_WXSS = '.wxss';

const minifyWXML = function(filepath){
  const content = fs.readFileSync(filepath).toString();
  const result = pd.xmlmin(content);
  fs.writeFileSync(filepath, result);
};

const minifyWXSS = function(filepath){
  const content = fs.readFileSync(filepath).toString();
  const result = new CleanCSS({}).minify(content).styles;
  fs.writeFileSync(filepath, result);
};

const minify = function(dirpath){
  const paths = fs.readdirSync(dirpath);
  paths.forEach(filepath => {
    const realpath = path.resolve(dirpath, filepath);
    if (utils.isDirectory(realpath)) {
      minify(realpath);
    } else {
      const info = path.parse(realpath);
      if (info.ext === EXT_WXML) {
        console.log('minify'.green, path.relative(config.workDir, realpath).blue);
        minifyWXML(realpath);
      } else if (info.ext === EXT_WXSS) {
        console.log('minify'.green, path.relative(config.workDir, realpath).blue);
        minifyWXSS(realpath);
      }
    }
  });
};

module.exports = function*(){
  console.log('minify page...'.green);
  minify(config.distDir);
};
