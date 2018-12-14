const feedbackModel = (sequelize, DataTypes) => {
  const Feedback = sequelize.define('Feedback', {
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.UUIDV4,
      primaryKey: true
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
    rating: {
      type: DataTypes.INTEGER,
      defaultValue: null,
      validate: {
        max: {
          args: 5,
          msg: 'Ratings  must be less than 6'
        },
        min: {
          args: 1,
          msg: 'Ratings  must be greater than 0'
        }
      }
    }
  });
  Feedback.associate = (models) => {
    Feedback.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Feedback.belongsTo(models.Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };
  return Feedback;
};
export default feedbackModel;
