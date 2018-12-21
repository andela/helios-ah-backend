const notificationModel = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: 'id',
        model: 'Users'
      }
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false
    },
  });
  Notification.associate = (models) => {
    Notification.belongsTo(models.Users, {
      foreignKey: 'userId',
    });
  };
  return Notification;
};

export default notificationModel;
