const CommentModel = (sequelize, DataTypes) => {
  const Comments = sequelize.define('Comments', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3, 250],
          msg: 'Text should be between 3 and 250 characters'
        }
      }
    }
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
  };
  return Comments;
};


export default CommentModel;
