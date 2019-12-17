/*!
 * name: @feizheng/next-tree
 * url: https://github.com/afeiship/next-tree
 * version: 1.0.6
 * date: 2019-12-17T04:32:02.959Z
 * license: MIT
 */

(function() {
  var global = global || this || window || Function('return this')();
  var nx = global.nx || require('@feizheng/next-js-core2');
  var nxDeepClone = nx.deepClone || require('@feizheng/next-deep-clone');
  var nxTraverse = nx.traverse || require('@feizheng/next-traverse');
  var DEFAULT_OPTIONS = { itemsKey: 'children' };

  var NxTree = nx.declare('nx.Tree', {
    statics: {
      serialize: function(inData) {
        return JSON.parse(
          JSON.stringify(inData)
        );
      }
    },
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
      search: function(inCallback) {
        var options = this.options;
        var data = nxDeepClone(this.data);
        var filter = function(list, callback) {
          return list.filter(function(item, index) {
            var children = item[options.itemsKey];
            if (children && children.length) {
              children = item[options.itemsKey] = filter(children, callback);
              if (children.length) {
                return true;
              }
            }
            return callback(index, item);
          });
        };
        return filter(data, inCallback);
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
      ancestors: function(inCallback, inOptions) {
        var results = [];
        var current = this.find(inCallback);
        if (current) {
          var parent = current.__parent__();
          while (parent) {
            results.push(parent);
            parent = parent.__parent__();
          }
        }
        return results;
      },
      descendants: function(inCallback) {
        var current = this.find(inCallback);
        var results = [];
        if (current) {
          nxTraverse(
            current,
            function(_, item) {
              results = results.concat(item.__children__());
            },
            this.options
          );
        }
        return results;
      },
      parent: function(inCallback) {
        var current = this.find(inCallback);
        return current && current.__parent__();
      },
      children: function(inCallback) {
        var current = this.find(inCallback);
        return current && current.__children__();
      }
    }
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NxTree;
  }
})();

//# sourceMappingURL=next-tree.js.map
