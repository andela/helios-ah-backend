export default (sequelize, DataTypes) => {
  const tags = sequelize.define(
    'Tags',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      tagName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [2, 20],
            msg: 'Name of tag should not exceed 20 characters'
          }
        }
      }
    }
  );
  tags.associate = (models) => {
    tags.belongsToMany(models.Article, {
      foreignKey: 'articleId',
      through: 'ArticleTags',
      as: 'Labels',
    });
  };
  return tags;
};
