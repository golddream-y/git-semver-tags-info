/**
 * @Author: erwin
 * @Date:   2018-08-25 20-08-17
 * @Last modified by:   erwin
 * @Last modified time: 2018-08-26 17-08-67
 */



'use strict'

var exec = require('child_process').exec
var semverValid = require('semver').valid
var regex = /tag:\s*(.+?)[,)]/gi
// 获取git日志，且日期格式化为moment可识别格式
var cmd = 'git log --decorate --no-color --date=format:"%Y-%m-%d %H:%M:%S"'

function lernaTag(tag, pkg) {
  if (pkg && !(new RegExp('^' + pkg + '@')).test(tag)) {
    return false
  } else {
    return /^.+@[0-9]+\.[0-9]+\.[0-9]+(-.+)?$/.test(tag)
  }
}

/**
 * 获取git log的时间字符串
 * @method getLogDate
 * @param  {[string]}   dateStr
 * @return {[string|boolean]}
 */
const getLogDate = dateStr => {
  if (!dateStr.indexOf('Date:')) {
    let dateStrArray = dateStr.split(' ');
    return dateStrArray[dateStrArray.length - 2] + ' ' + dateStrArray[dateStrArray.length - 1];
  } else {
    return false;
  }
}

module.exports = function(callback, opts) {
  opts = opts || {}

  if (opts.package && !opts.lernaTags) {
    callback(Error('opts.package should only be used when running in lerna mode'))
    return
  }

  exec(cmd, {
    maxBuffer: Infinity
  }, function(err, data) {
    if (err) {
      callback(err)
      return
    }

    let tags = []
    let commits = []
    let tagPrefixRegexp;
    // 当前tag的时间
    let currentDate;
    if (opts.tagPrefix) {
      tagPrefixRegexp = new RegExp('^' + opts.tagPrefix + '(.*)')
    }

    data.split('\n').forEach(function(decorations) {

      let match;

      // 更新当前记录所在时间
      if (getLogDate(decorations)) {
        currentDate = getLogDate(decorations);
      }
      debug('decorations:', decorations);
      while ((match = regex.exec(decorations))) {

        let tag = match[1];

        if (opts.lernaTags) {
          if (lernaTag(tag, opts.package)) {
            tags.push({
              'tag': tag,
              'date': currentDate
            })
          }
        } else if (opts.tagPrefix) {
          var matches = tag.match(tagPrefixRegexp)
          if (matches && semverValid(matches[1])) {
            tags.push({
              'tag': tag,
              'date': currentDate
            })
          }
        } else if (semverValid(tag)) {
          tags.push({
            'tag': tag,
            'date': currentDate
          })
        }
      }

      // 获取所有commit记录信息
      if (decorations.indexOf('commit ') === 0) {
        let logInfo = regex.exec(decorations);
        let tag = logInfo ? logInfo[1] : null;

        if (!currentDate) {
          return;
        }

        commits.push({
          'isTag': !!tag,
          'tag': tag ? tag : decorations,
          'date': currentDate
        })

      }

    })

    debug('tags', tags);
    debug('commits', commits);
    callback(null, commits)
  })
}