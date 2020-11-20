# next-tree
> Tree data for next.

[![version][version-image]][version-url]
[![license][license-image]][license-url]
[![size][size-image]][size-url]
[![download][download-image]][download-url]

## installation
```bash
npm install -S @jswork/next-tree
```

## apis
| api         | params   | description                 |
| ----------- | -------- | --------------------------- |
| children    | callback | Find children only on level |
| parent      | callback | Find parent only one level  |
| descendants | callback | Find descendants recursion  |
| ancestors   | callback | Find ancestors recursion    |
| find        | callback | -                           |
| filter      | callback | -                           |
| search      | callback | -                           |
| table       | callback | Create table data           |


## usage
```js
import NxTree from '@jswork/next-tree';

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

const item = NxTree.create(treeData).find((_, item) => item.label === '空间导出222');
const data = NxTree.serialize(item);

// results:
{
  label: '空间导出222',
  value: '/admin/space/:id/expor2222t',
  depth: 2,
  independent: true
}
```


## license
Code released under [the MIT license](https://github.com/afeiship/next-tree/blob/master/LICENSE.txt).

[version-image]: https://img.shields.io/npm/v/@jswork/next-tree
[version-url]: https://npmjs.org/package/@jswork/next-tree

[license-image]: https://img.shields.io/npm/l/@jswork/next-tree
[license-url]: https://github.com/afeiship/next-tree/blob/master/LICENSE.txt

[size-image]: https://img.shields.io/bundlephobia/minzip/@jswork/next-tree
[size-url]: https://github.com/afeiship/next-tree/blob/master/dist/next-tree.min.js

[download-image]: https://img.shields.io/npm/dm/@jswork/next-tree
[download-url]: https://www.npmjs.com/package/@jswork/next-tree
