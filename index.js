var request = require('request-all-pages')
var JSONStream = require('JSONStream')
var through = require('through2')
var animate = require('animate-tty')
module.exports = getCount

function getCount(token, url, cb) {
  var headers = {'user-agent': 'nodeschool heros',
    'Authorization': 'token ' + token
  }

  var opts = {
    uri: url,
    headers: headers
  }

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
  
  request(opts, {startPage: 1, perPage: 100})
    .pipe(JSONStream.parse('body'))
    .pipe(JSONStream.parse('*.user.login'))
    .on('data', function (user) {
      if(count[user]) count[user]++
      else count[user] = 1
    })
    .on('end', function () {
      animator.stop(true)
    })
}


