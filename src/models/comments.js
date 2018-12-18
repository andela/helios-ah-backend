const CommentModel = (sequelize, DataTypes) => {
  const Comments = sequelize.define('Comments', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    commentText: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3, 250],
          msg: 'Text should be between 3 and 250 characters'
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
  });
  Comments.associate = (models) => {
    Comments.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Comments.belongsTo(models.Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
    Comments.hasMany(models.ChildComments, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE'
    });
    Comments.hasMany(models.CommentHistory, {
      foreignKey: 'comments',
      onDelete: 'CASCADE'
    });
  };
  return Comments;
};


export default CommentModel;
