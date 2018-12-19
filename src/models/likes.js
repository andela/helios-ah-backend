const likesModel = (sequelize, DataTypes) => {
  const Likes = sequelize.define('Likes', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    isLiked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      validate: {
        isBoolean: {
          msg: 'like status must be a boolean value'
        }
      }
    },
  });
  Likes.associate = (models) => {
    Likes.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Likes.belongsTo(models.Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };
  return Likes;
};
export default likesModel;
