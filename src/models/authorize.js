const VerificationModel = (sequelize, DataTypes) => {
<<<<<<< HEAD
  const Authorize = sequelize.define('Authorize', {
=======
  const userTokens = sequelize.define('Authorize', {
>>>>>>> 554da7bcbe3332bad5b6cde7b9fe3091168a1ec3
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
