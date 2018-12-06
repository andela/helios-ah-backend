export default (sequelize, DataTypes) => {
  const roles = sequelize.define('roles', {
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
  roles.associate = (models) => {
    roles.hasMany(models.Users, {
      foreignKey: 'roleId',
    });
  };
  return roles;
};
