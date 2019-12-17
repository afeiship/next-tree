var nx = require('@feizheng/next-js-core2');
var NxTree = require('../src/next-tree');
var menus = require('./menu.json');
var nxTree = new NxTree(menus);
var res = nxTree.search((index, item) => item.label.includes('数据'));
console.log(res);
