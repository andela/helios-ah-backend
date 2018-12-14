const VerificationModel = (sequelize, DataTypes) => {
  const userTokens = sequelize.define('Authorize', {
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
  userTokens.associate = (models) => {
    userTokens.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return userTokens;
};
export default VerificationModel;
