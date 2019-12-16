/*!
 * name: @feizheng/next-tree
 * url: https://github.com/afeiship/next-tree
 * version: 1.0.1
 * date: 2019-12-16T13:02:36.654Z
 * license: MIT
 */

(function() {
  var global = global || this || window || Function('return this')();
  var nx = global.nx || require('@feizheng/next-js-core2');

  var nxTraverse = nx.traverse || require('@feizheng/next-traverse');
  var DEFAULT_OPTIONS = { itemsKey: 'children' };

  var NxTree = nx.declare('nx.Tree', {
    methods: {
      init: function(inData, inOptions) {
        this.data = inData;
        this.options = nx.mix(null, DEFAULT_OPTIONS, inOptions);
        this.attach();
      },
      attach: function() {
        var options = this.options;
        nxTraverse(
          this.data,
          function(key, item, target) {
            item.__parent__ = function() {
              return target;
            };
            item.__children__ = function() {
              return item[options.itemsKey] || [];
            };
          },
          options
        );
      },
      traverse: function(inCallback) {
        nxTraverse(this.data, inCallback, this.options);
      },
      find: function(inCallback) {
        var result = null;
        nxTraverse(
          this.data,
          function(index, item, parent) {
            if (inCallback(index, item, parent)) {
              result = item;
              return nx.BREAKER;
            }
          },
          this.options
        );
        return result;
      },
      filter: function(inCallback) {
        var result = [];
        nxTraverse(
          this.data,
          function(index, item, parent) {
            if (inCallback(index, item, parent)) {
              result.push(item);
            }
          },
          this.options
        );
        return result;
      },
      ancestors: function(inItem) {
        var results = [];
        var parent = inItem.__parent__();
        while (parent) {
          results.push(parent);
          parent = parent.__parent__();
        }
        return results;
      },
      descendants: function(inItem) {
        var results = [];
        nxTraverse(
          inItem,
          function(_, item) {
            results = results.concat(item.__children__());
          },
          this.options
        );
        return results;
      },
      parent: function(inItem) {
        return inItem.__parent__();
      },
      children: function(inItem) {
        return inItem.__children__();
      }
    }
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NxTree;
  }
})();

//# sourceMappingURL=next-tree.js.map
