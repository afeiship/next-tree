(function () {
  var global = global || this || window || Function('return this')();
  var nx = global.nx || require('@jswork/next');
  var nxDeepClone = nx.deepClone || require('@jswork/next-deep-clone');
  var nxTraverse = nx.traverse || require('@jswork/next-traverse');
  var DEFAULT_OPTIONS = { itemsKey: 'children', idKey: 'value', clone: true };

  var NxTree = nx.declare('nx.Tree', {
    statics: {
      serialize: function (inData) {
        return JSON.parse(JSON.stringify(inData));
      },
      create: function (inData, inOptions) {
        return new this(inData, inOptions);
      }
    },
    methods: {
      init: function (inData, inOptions) {
        this.options = nx.mix(null, DEFAULT_OPTIONS, inOptions);
        this.data = this.options.clone ? nxDeepClone(inData) : inData;
        this.attach();
      },
      attach: function () {
        var options = this.options;
        nxTraverse(
          this.data,
          function (_, item, target) {
            item.__parent__ = function () {
              return target;
            };
            item.__children__ = function () {
              return item[options.itemsKey] || [];
            };
          },
          options
        );
      },
      traverse: function (inCallback) {
        nxTraverse(this.data, inCallback, this.options);
      },
      value: function () {
        var result = [];
        var self = this;
        nxTraverse(
          this.data,
          function (_, item) {
            var id = nx.get(item, self.options.idKey);
            result.push(id);
          },
          this.options
        );
        return result;
      },
      find: function (inCallback) {
        var result = null;
        nxTraverse(
          this.data,
          function (_, item) {
            if (inCallback.apply(null, arguments)) {
              result = item;
              return nx.BREAKER;
            }
          },
          this.options
        );
        return result;
      },
      search: function (inCallback) {
        var options = this.options;
        var data = nxDeepClone(this.data);
        var filter = function (list, callback) {
          return list.filter(function (item, index) {
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
      filter: function (inCallback) {
        var result = [];
        nxTraverse(
          this.data,
          function (_, item) {
            if (inCallback.apply(null, arguments)) {
              result.push(item);
            }
          },
          this.options
        );
        return result;
      },
      ancestors: function (inCallback) {
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
      descendants: function (inCallback) {
        var current = this.find(inCallback);
        var results = [];
        if (current) {
          nxTraverse(
            current,
            function (_, item) {
              results = results.concat(item.__children__());
            },
            this.options
          );
        }
        return results;
      },
      parent: function (inCallback) {
        var current = this.find(inCallback);
        return current && current.__parent__();
      },
      children: function (inCallback) {
        var current = this.find(inCallback);
        return current && current.__children__();
      }
    }
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NxTree;
  }
})();
