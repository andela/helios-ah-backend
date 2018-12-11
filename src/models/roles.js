export default (sequelize, DataTypes) => {
  const Roles = sequelize.define('roles', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      defaultValue: DataTypes.INTEGER,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  Roles.associate = (models) => {
    Roles.hasMany(models.Users, {
      foreignKey: 'roleId',
    });
  };
  return Roles;
};
