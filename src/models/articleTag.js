const articleTagModel = (sequelize, DataTypes) => {
  const articleTag = sequelize.define('ArticleTag', {
    id: {
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      type: DataTypes.UUID,
    },
    articleId: {
      type: DataTypes.UUID,
      onDelete: 'CASCADE',
      references: {
        model: 'Articles',
        key: 'id',
        as: 'Articles'
      }
    },
    tagId: {
      type: DataTypes.UUID,
      onDelete: 'CASCADE',
      references: {
        model: 'tags',
        key: 'id',
        as: 'Labels'
      }
    }
  });
  articleTag.associate = (models) => {
    articleTag.belongsTo(models.Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
    articleTag.belongsTo(models.Tags, {
      foreignKey: 'tagId',
      onDelete: 'CASCADE'
    });
  };
  return articleTag;
};

export default articleTagModel;
