var palmetto = require('palmettoflow-nodejs')

// services
var msgSvc = require('./msgSvc')({
	url: dbLink
})

module.exports = function () {
  var ee = palmetto()
	msgSvc(ee)
  return ee
}
