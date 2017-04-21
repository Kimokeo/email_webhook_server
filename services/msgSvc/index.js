var PouchDB = require('pouchdb')
var response = require('palmettoflow-event').response
var responseError = require('palmettoflow-event').responseError
var _ = require('underscore')

module.exports = function (config) {
	var db = PouchDB(config.url)

	return function (ee) {
		ee.on('/msgSvc/send', function (event) {
			console.log(event)
			var message = event.object
			message.type = 'unfilteredMessage'
			db.post(message).then(function (result) {
				ee.emit('send', response(event, result))
			}).catch(function (err) {
				console.log(err)
				ee.emit('send', responseError(event, result))
			})
		})
	}
}
