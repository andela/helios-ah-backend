const VerificationModel = (sequelize, DataTypes) => {
  const Authorize = sequelize.define('VerificationToken', {
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
