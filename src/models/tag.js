export default (sequelize, DataTypes) => {
  const tag = sequelize.define(
    'tag',
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
  tag.associate = (models) => {
    tag.belongsToMany(models.Article, {
      as: 'Texts',
      through: 'articleTag',
    });
  };
  return tag;
};
