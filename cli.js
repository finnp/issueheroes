#!/usr/bin/env node

var ghauth = require('ghauth')
var getCount = require('./index.js')

if(process.argv.length <= 2) {
  console.error('Usage: issueheros <username/repo>')
  process.exit()
}
var slug = process.argv[2]

ghauth({configName: 'comments-count'}, function (err, authData) {
  if(err) throw err
  var url = "https://api.github.com/repos/" + slug + "/issues/comments"
  getCount(authData.token, url, function (data) {
    console.log(data.join('\n'))
  })
})

