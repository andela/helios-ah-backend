const articleTagModel = (sequelize, DataTypes) => {
  const articleTag = sequelize.define('articleTag', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    }
  });
  articleTag.associate = (models) => {
    articleTag.belongsTo(models.Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
    articleTag.belongsTo(models.tags, {
      foreignKey: 'tagId',
      onDelete: 'CASCADE'
    });
  };
  return articleTag;
};
export default articleTagModel;
