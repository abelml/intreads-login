module.exports = function (sequelize, DataTypes) {
	return sequelize.define('google', {
		id: DataTypes.UUID,
		token: DataTypes.STRING,
		email: DataTypes.STRING,
		name: DataTypes.STRING
	});
};
