var bcrypt = require('bcrypt-nodejs');

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('local', {
		id: DataTypes.UUID,
		username: DataTypes.STRING,
		password: DataTypes.STRING
	}, {
		classMethods: {
			generateHash: function (password) {
				return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
			}
		},
		instanceMethods: {
			isValidPassword: function (password) {
				return bcrypt.compareSync(password, this.password);
			}
		}
	});
};
