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
    userId: {
      type: DataTypes.UUIDV4,
      validate: {
        isUUID: {
          args: 4,
          msg: ':userId is not a valid uuid type'
        }
      }
    },
    articleId: {
      type: DataTypes.UUIDV4,
      validate: {
        isUUID: {
          args: 4,
          msg: ':articleId is not a valid uuid type'
        }
      }
    },
    commentId: {
      type: DataTypes.UUIDV4,
      validate: {
        isUUID: {
          args: 4,
          msg: ':commentId is not a valid uuid type'
        }
      }
    },
    childCommentId: {
      type: DataTypes.UUIDV4,
      validate: {
        isUUID: {
          args: 4,
          msg: ':childCommentId is not a valid uuid type'
        }
      }
    }
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
    Likes.belongsTo(models.Comments, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE'
    });
    Likes.belongsTo(models.ChildComments, {
      foreignKey: 'childCommentId',
      onDelete: 'CASCADE'
    });
  };
  return Likes;
};
export default likesModel;
