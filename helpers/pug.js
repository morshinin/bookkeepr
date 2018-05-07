const moment = require('moment')

module.exports = {
	formatDate: function(date, format = 'DD.MM.YYYY') {
		return moment(date).format(format)
	}
}