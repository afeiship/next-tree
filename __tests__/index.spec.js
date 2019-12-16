(function() {
  var nx = require('@feizheng/next-js-core2');
  var NxTree = require('../src/next-tree');

  describe('NxTree.methods', function() {
    var menus = [];
    beforeEach(() => {
      menus = require('./menu.json');
    });

    test('method - children --- level1', function() {
      var nxTree = new NxTree(menus);
      // "label": "素材库-子类1",
      var current = nxTree.data[0];
      var children = nxTree.children(current);
      expect(children.length).toBe(2);
      expect(children[0].label).toBe('素材库-子类1');
      expect(children[1].label).toBe('素材库-子2');
    });

    test('method - children --- level2', function() {
      var nxTree = new NxTree(menus);
      var current = nxTree.data[1].children[0];
      var children = nxTree.children(current);
      expect(children[0].label).toBe('空间设置');
      expect(children[1].label).toBe('空间导出');
    });

    test('method - descendants -- level 1', function() {
      var nxTree = new NxTree(menus);
      var current = nxTree.data[0];
      var descendants = nxTree.descendants(current);
      var labels = descendants.map((item) => item.label);
      expect(labels).toEqual(['素材库-子类1', '素材库-子2']);
    });

    test('method - descendants -- level 2', function() {
      var nxTree = new NxTree(menus);
      var current = nxTree.data[1];
      var descendants = nxTree.descendants(current);
      var labels = descendants.map((item) => item.label);
      expect(labels).toEqual(['空间-子级1', '空间设置', '空间导出']);
    });

    test('method - ancestors -- level 2', function() {
      var nxTree = new NxTree(menus);
      var current = nxTree.data[1].children[0].children[1];
      var descendants = nxTree.ancestors(current);
      var labels = descendants.map((item) => item.label);
      expect(labels).toEqual(['空间-子级1', '空间']);
    });

    test('method - find', function() {
      var nxTree = new NxTree(menus);
      var res = nxTree.find((index, item) => {
        return item.value === '/admin/-1/person/1/:id';
      });
      expect(res.label).toBe('素材库-子类1');
    });

    test('method - filter', function() {
      var nxTree = new NxTree(menus);
      var res = nxTree.filter((index, item) => item.label.includes('素材库'));
      var labels = res.map((item) => item.label);
      expect(res.length).toBe(3);
      expect(labels).toEqual(['素材库', '素材库-子类1', '素材库-子2']);
    });
  });
})();
