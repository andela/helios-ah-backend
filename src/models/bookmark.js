const BookmarkModel = (sequelize, DataTypes) => {
  const Bookmark = sequelize.define('Bookmark', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    articleId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      onDelete: 'CASCADE',
    },
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      onDelete: 'CASCADE',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  });

  Bookmark.associate = (models) => {
    Bookmark.belongsTo(models.Article, {
      foreignKey: 'articleId',
      as: 'bookmark',
    });
  };
  return Bookmark;
};
export default BookmarkModel;
