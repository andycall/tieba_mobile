/**
 * @file: 根据iconfont.less生成对应的icon字符对象，用于在编译阶段匹配替换
 * @author： yuanzhen
 */
var fs = require('fs');
var path = require('path');

var getAllIconFont = function  () {
    var iconfontPath = path.resolve(__dirname, './style/iconfont.less');
    var iconfontOutputPath = path.resolve(__dirname, './iconfont-map.js');
    var iconfontData = fs.readFileSync(iconfontPath, 'utf-8');
    var reg = /(\icon-[a-zA-Z0-9]*?)(\s*?\:\s*?before)(\s*?\{\s*?)(.*?)(\s*?\}\s*?)/g;
    var outputData  = '';
    iconfontData.replace(reg, function(match, $1, $2, $3, $4, $5){
        $4 = $4.slice(0, $4.length-1).split(':')[1];
        outputData += '"'  + $1 + '"' + ':' +  $4 + ',';
    });
    outputData = outputData.slice(0, outputData.length - 1);
    fs.writeFileSync(iconfontOutputPath, '/* eslint-disable */ \n module.exports = {' + outputData + '}');
};

getAllIconFont();
