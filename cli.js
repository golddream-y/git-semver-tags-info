#!/usr/bin/env node

'use strict'
var meow = require('meow')
var gitSemverTagsInfo = require('./')

var args = meow(`
   Usage
     git-semver-tags-info
   Options
     --lerna parse lerna style git tags
     --package when listing lerna style tags, filter by a package
     --tagPrefix prefix to remove from the tags during their processing`)

gitSemverTagsInfo(function(err, tags) {
  if (err) {
    console.error(err.toString())
    process.exit(1)
  }
  const tagsInfo = JSON.stringify(tags);
  console.log(tags.length > 0 ? tagsInfo : '无tag信息')
}, {
  lernaTags: args.flags.lerna,
  package: args.flags.package,
  tagPrefix: args.flags.tagPrefix
})
