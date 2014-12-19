var request = require('request-all-pages')
var JSONStream = require('JSONStream')
var through = require('through2')

module.exports = getCount

function getCount(token, url) {
  var headers = {'user-agent': 'nodeschool heros',
    'Authorization': 'token ' + token
  }

  var opts = {
    uri: url,
    headers: headers
  }

  var count = {}
  
  return request(opts, {startPage: 1, perPage: 100})
    .pipe(JSONStream.parse('body'))
    .pipe(JSONStream.parse('*.user.login'))
    .pipe(through.obj(function (user, enc, cb) {
      if(count[user]) count[user]++
      else count[user] = 1

      cb(null, count)
    }))
}


