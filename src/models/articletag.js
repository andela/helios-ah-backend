export default (sequelize, DataTypes) => {
  const articleTag = sequelize.define(
    'ArticleTag', {
      ArticleId: {
        type: DataTypes.UUID,
        primaryKey: true
      },
      TagId: {
        type: DataTypes.UUID,
        primaryKey: true
      }
    }
  );
  return articleTag;
};
