export default (sequelize, DataTypes) => {
  const tags = sequelize.define(
    'tags',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      tagName: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    }
  );
  tags.associate = (models) => {
    tags.belongsToMany(models.Articles, {
      foreignKey: 'articleId',
      through: 'ArticleTag',
    });
  };
  return tags;
};
