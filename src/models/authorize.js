const VerificationModel = (sequelize, DataTypes) => {
  const Authorize = sequelize.define('Authorize', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    token: {
      type: DataTypes.STRING,
    },
    isExpired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    userId: {
      type: DataTypes.UUID,
    }
  });
  Authorize.associate = (models) => {
    Authorize.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Authorize;
};
export default VerificationModel;
