export default (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    'Tag',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        autoIncrement: true,
      },
      tagName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Tag already exists. Try another'
        }
      }
    }
  );
  Tag.associate = (models) => {
    Tag.belongsToMany(models.Article, {
      as: 'Texts',
      through: 'ArticleTag',
    });
  };
  return Tag;
};
