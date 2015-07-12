module.exports = function (sequelize, DataTypes) {
	return sequelize.define('twitter', {
		id: DataTypes.UUID,
		token: DataTypes.STRING,
		displayName: DataTypes.STRING,
		userName: DataTypes.STRING
	});
};
