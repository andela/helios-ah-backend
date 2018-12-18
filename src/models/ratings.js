const RatingsModel = (sequelize, DataTypes) => {
  const Ratings = sequelize.define('Ratings', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
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
  Ratings.associate = (models) => {
    Ratings.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Ratings.belongsTo(models.Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };
  return Ratings;
};
export default RatingsModel;
