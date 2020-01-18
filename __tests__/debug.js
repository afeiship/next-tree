var nx = require('@feizheng/next-js-core2');
var NxTree = require('../src/next-tree');
var fs = require('fs');
require('@feizheng/next-deep-each');

// 行，按 depth = 0,1,2,3,4 来分组
// rowSpan:跨几列：
// 1. 有 children的情况下， rowSpan 为0
// 2. 无 children的情况下， rowSpan = Global.y - self.depth(row.index)
// colSpan: new NxTree(self).x

var columns = require('./columns.json');
var globalTree = new NxTree(columns);
var table = globalTree.table();
fs.writeFileSync('__tests__/test.json', JSON.stringify(table, null, 2));
