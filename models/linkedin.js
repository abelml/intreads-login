module.exports = function (sequelize, DataTypes) {
	return sequelize.define('linkedin', {
		id: DataTypes.UUID,
		token: DataTypes.STRING,
		displayName: DataTypes.STRING,
		userName: DataTypes.STRING
	});
};
