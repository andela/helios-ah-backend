const childCommentModel = (sequelize, DataTypes) => {
  const ChildCommentHistory = sequelize.define('ChildCommentHistory', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    childCommentId: {
      type: DataTypes.UUIDV4,
      validate: {
        isUUID: {
          args: 4,
          msg: ':childCommentId is not a valid uuid type'
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
  ChildCommentHistory.associate = (models) => {
    ChildCommentHistory.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    ChildCommentHistory.belongsTo(models.ChildComments, {
      foreignKey: 'childCommentId',
      onDelete: 'CASCADE'
    });
  };
  return ChildCommentHistory;
};
export default childCommentModel;
