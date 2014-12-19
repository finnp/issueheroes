#!/usr/bin/env node

var ghauth = require('ghauth')
var getCount = require('./index.js')
var animate = require('animate-tty')

if(process.argv.length <= 2) {
  console.error('Usage: issueheros <username/repo>')
  process.exit()
}
var slug = process.argv[2]

var count = {}

var animator = animate(function (runtime) {
  return Object.keys(count)
  .sort(function (a,b) {
    return count[b] - count[a]
  })
  .slice(0,10)
  .map(function (user, index) {
    return (index + 1) + ') ' + user + ' (' + count[user] +  ')'
  })
  .join('\n') 
})

animator.start()

ghauth({configName: 'comments-count'}, function (err, authData) {
  if(err) throw err
  var url = "https://api.github.com/repos/" + slug + "/issues/comments"
  getCount(authData.token, url)
    .on('data', function (currentcount) {
      count = currentcount
    })
    .on('end', function () {
      animator.stop(true)
    })
  
})

