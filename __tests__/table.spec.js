(function() {
  var nx = require('@feizheng/next-js-core2');
  var NxTree = require('../src/next-tree');
  require('@feizheng/next-deep-each');

  var columns = require('./columns.json');
  var globalTree = new NxTree(columns);

  console.log(globalTree.meta);

  // 行，按 depth = 0,1,2,3,4 来分组
  // rowSpan:跨几列：
    // 1. 有 children的情况下， rowSpan 为0
    // 2. 无 children的情况下， rowSpan = Global.y - self.depth(row.index)
  // colSpan: 看当前行下面有几个直接子 children




})();
