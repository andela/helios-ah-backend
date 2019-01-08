const commentHistoryModel = (sequelize, DataTypes) => {
  const CommentHistory = sequelize.define('CommentHistory', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
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
    userId: {
      type: DataTypes.UUIDV4,
      validate: {
        isUUID: {
          args: 4,
          msg: ':userId is not a valid uuid type'
        }
      }
    },
    oldComment: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: [3, 250],
          msg: 'Text should be between 3 and 250 characters'
        }
      }
    }
  });
  CommentHistory.associate = (models) => {
    CommentHistory.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    CommentHistory.belongsTo(models.Comments, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE'
    });
  };
  return CommentHistory;
};
export default commentHistoryModel;
