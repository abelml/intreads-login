module.exports = function (sequelize, DataTypes) {
	return sequelize.define('facebook', {
		id: DataTypes.UUID,
		token: DataTypes.STRING,
		email: DataTypes.STRING,
		name: DataTypes.STRING
	});
};
