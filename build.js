"use strict";
//build for win32
const path = require('path');
const builder = require("electron-builder");
const distPath = path.resolve(__dirname, './dist/');
const packageJson = require('./package.json');
const productName = packageJson.productName,
  version = packageJson.version;  
require('shelljs/global');


// Promise is returned
builder.build({
  arch: 'ia32',
  platform: 'win32',
})
  .then(result => {
    //改名
    mv(path.resolve(distPath, `${productName} Setup ${version}.exe`), path.resolve(distPath, `${productName} Setup ${version}.ia32.exe`));
  })
  .catch(error => {
    console.log(error);
  })
  .then(() => {
    return builder.build({
      arch: 'x64',
      platform: 'win32',
    })
  })
  .then(result => {
    mv(path.resolve(distPath, `${productName} Setup ${version}.exe`), path.resolve(distPath, `${productName} Setup ${version}.x64.exe`));
  })