var models = ['users.js','trades.js'];

exports.initialize = function() {
	for (var i = 0; i < models.length; i++) {
		require('./' + models[i])();
	}
};