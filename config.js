const path = require('path');
const appName = 'test'; // 修改项目名为开发的文件名
const entryPath = path.resolve('src');
const outputPath = path.resolve('dist');
const appEntryPath = path.resolve(entryPath, appName);
const appOutputPath = path.resolve(outputPath, appName);


module.exports = {
    entryPath,
    outputPath,
    appEntryPath,
    appOutputPath
};