
const ChildCommentModel = (sequelize, DataTypes) => {
  const ChildComments = sequelize.define('ChildComments', {
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
  ChildComments.associate = (models) => {
    ChildComments.belongsTo(models.Comments, {
      foreign: 'commentId',
      onDelete: 'CASCADE'
    });
    ChildComments.belongsTo(models.Users, {
      foreign: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return ChildComments;
};

export default ChildCommentModel;
