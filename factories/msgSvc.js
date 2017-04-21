var newEvent = require('palmettoflow-event').newEvent
var _ = require('underscore')

module.exports = function ($http) {
  return {
  	send: function (message) {
      var ne = newEvent('msgSvc', 'send', message, {})
      return $http.post('/api', ne).then(function (result) {
        return console.log('success!')
      })
    },
  }
}
