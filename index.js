var http = require('http')
var qs = require('querystring')
var newEvent = require('palmettoflow-event').newEvent
var HttpHashRouter = require('http-hash-router')
var router = HttpHashRouter()
var $ = require('jquery')
var bodyJSON = require('body/json')
var sendJSON = require('send-data/json')

var request = require('request')
var ee = require('./services')()
// var msgSvc = require('./factories/msgSvc')


router.set('/api', {
  POST: function(req, res) {
    bodyJSON(req, res, function(err, body) {
      //console.log(body)
      var timeoutFired = false
      var to = setTimeout(function () {
        timeoutFired = true
        sendError(req, res, { body: 'Timeout Occured on Event: ' + body.subject})
      }, 2000)
      ee.once(body.from, function (e) {
        clearTimeout(to)
        if (!timeoutFired) sendJSON(req, res, e)
      })
      ee.emit('send', body)
    })
  }
})

var serverPort = 8124
http.createServer(function (request, response) {
    if (request.method == 'POST') {
        var body = '';

        request.on('data', function (data) {
            body += data

            // Kill server if data is > 1mb
            if (body.length > 1e6)
                request.connection.destroy();
        });

        request.on('end', function () {
            var post = qs.parse(body);
            var foo = JSON.parse(post.mandrill_events)
            var message = {}
        		message.from = foo[0].msg.from_email
        		message.to = foo[0].msg.email
        		message.textBody = foo[0].msg.text
        		sendThis(message)
        		// console.log(message)
        });
    }

}).listen(serverPort);
console.log('Server running at localhost:'+serverPort);


function sendThis(message) {
			// console.log('this is message ', message)
      var ne = newEvent('msgSvc', 'send', message, {})
      return $http.post('/api', ne).then(function (result) {
        return console.log('success!')
      })
    }

