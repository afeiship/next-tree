(function () {
  const NxTree = require('../src');

  describe('NxTree.methods', function () {
    var menus = [];
    var columns = [];

    beforeEach(() => {
      menus = require('./menu.json');
      columns = require('./columns.json');
    });

    test('method - children --- level1', function () {
      var nxTree = new NxTree(menus);
      // "label": "素材库-子类1",
      var children = nxTree.children((index, item) => item.label === '素材库');
      expect(children.length).toBe(2);
      expect(children[0].label).toBe('素材库-子类1');
      expect(children[1].label).toBe('素材库-子2');
    });

    test('method - children --- level2', function () {
      var nxTree = new NxTree(menus);
      var children = nxTree.children((index, item) => item.label === '空间-子级1');
      expect(children[0].label).toBe('空间设置');
      expect(children[1].label).toBe('空间导出');
    });

    test('method - descendants -- level 1', function () {
      var nxTree = new NxTree(menus);
      var descendants = nxTree.descendants((index, item) => item.label === '素材库');
      var labels = descendants.map((item) => item.label);
      expect(labels).toEqual(['素材库-子类1', '素材库-子2']);
    });

    test('method - descendants -- level 2', function () {
      var nxTree = new NxTree(menus);
      var descendants = nxTree.descendants((index, item) => item.label === '空间');
      var labels = descendants.map((item) => item.label);
      expect(labels).toEqual(['空间-子级1', '空间设置', '空间导出']);
    });

    test('method - ancestors -- level 2', function () {
      var nxTree = new NxTree(menus);
      var descendants = nxTree.ancestors((index, item) => item.label === '空间设置');
      var labels = descendants.map((item) => item.label);
      expect(labels).toEqual(['空间-子级1', '空间']);
    });

    test('method - find', function () {
      var nxTree = new NxTree(menus);
      var res = nxTree.find((index, item) => {
        return item.value === '/admin/-1/person/1/:id';
      });
      expect(res.label).toBe('素材库-子类1');
    });

    test('method - filter', function () {
      var nxTree = new NxTree(menus);
      var res = nxTree.filter((index, item) => item.label.includes('素材库'));
      var labels = res.map((item) => item.label);
      expect(res.length).toBe(3);
      expect(labels).toEqual(['素材库', '素材库-子类1', '素材库-子2']);
    });

    test('method - search/serialize: level1/n', function () {
      var nxTree = new NxTree(menus, { inject: true });
      var res1 = nxTree.search((index, item) => item.label === '数据');
      var res2 = nxTree.search((index, item) => item.label === '团队');
      var res3 = nxTree.search((index, item) => item.label === '团体');
      var res4 = nxTree.search((index, item) => item.label === '空间导出');

      expect(res1[0].value).toBe('/admin/operational-data-content/operational-data');
      expect(res2[0].value).toBe('/admin/team/member-list');
      expect(res3[0].value).toBe('/admin/team/team');
      expect(NxTree.serialize(res4)).toEqual([
        {
          label: '空间',
          value: '/admin/space',
          children: [
            {
              label: '空间-子级1',
              value: '/admin/space/:id',
              children: [
                {
                  label: '空间导出',
                  value: '/admin/space/:id/export',
                  depth: 2,
                  independent: true
                }
              ],
              depth: 1,
              independent: false
            }
          ],
          depth: 0,
          independent: false
        }
      ]);
    });

    test('static methods:create should work fine', () => {
      const treeData = {
        label: '空间',
        value: '/admin/space',
        children: [
          {
            label: '空间-子级1',
            value: '/admin/space/:id',
            children: [
              {
                label: '空间导出',
                value: '/admin/space/:id/export'
              }
            ]
          },
          {
            label: '空间-子级2',
            value: '/admin/space2/:id',
            children: [
              {
                label: '空间导出222',
                value: '/admin/space/:id/expor2222t'
              }
            ]
          }
        ]
      };

      var item = nx.Tree.create(treeData, { inject: true }).find(
        (_, item) => item.label === '空间导出222'
      );

      expect(nx.Tree.serialize(item)).toEqual({
        label: '空间导出222',
        value: '/admin/space/:id/expor2222t',
        depth: 2,
        independent: true
      });
    });

    test('api: value should get all the values', () => {
      var ids = nx.Tree.create(columns, { idKey: 'key' }).value();
      expect(ids).toEqual([
        'name',
        undefined,
        'age',
        undefined,
        'street',
        undefined,
        'building',
        undefined,
        undefined,
        undefined,
        'number',
        undefined,
        undefined,
        undefined,
        'companyAddress',
        'companyName',
        'gender'
      ]);
    });
  });
})();
