> 以反向时间顺序获取存储库的所有git semver标记,修改自“git-semver-tags”，在此基础上增加格式化日期，且转为es6标准



## Install

```sh
$ npm install --save git-semver-tags-info
```


## Usage

```js
var gitSemverTagsInfo = require('git-semver-tags-info', [options]);

gitSemverTagsInfo(function(err, tags) {
  console.log(tags);
  //=> [ { tag: '0.2.1', date: '2018-08-25 18:09:12' },  { tag: '0.1.0', date: '2018-08-25 18:09:12' } ]
});
```

```sh
$ npm install --global git-semver-tags-info
$ git-semver-tags-info
 [{ tag: '0.2.1', date: '2018-08-25 18:09:12' }, { tag: '0.1.0', date: '2018-08-25 18:09:12' }]
```

## Options

* `opts.lernaTags`: extract lerna style tags (`foo-package@2.0.0`) from the
  git history, rather than `v1.0.0` format.
* `opts.package`: what package should lerna style tags be listed for, e.g.,
  `foo-package`.
* `opts.tagPrefix`: specify a prefix for the git tag to be ignored from the semver checks

## License

BSD © [golddream-y](https://github.com/golddream-y)


[npm-url]: https://npmjs.org/package/git-semver-tags-info
[travis-image]: https://travis-ci.org/conventional-changelog/git-semver-tags-info.svg?branch=master
[travis-url]: https://travis-ci.org/conventional-changelog/git-semver-tags-info
