export default (sequelize, DataTypes) => {
  const Highlights = sequelize.define('Highlights', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      onDelete: 'CASCADE',
      validate: {
        isUUID: {
          args: 4,
          msg: ':userId is not a valid uuid type'
        }
      }
    },
    articleId: {
      type: DataTypes.UUID,
      allowNull: false,
      onDelete: 'CASCADE',
      validate: {
        isUUID: {
          args: 4,
          msg: ':articleId is not a valid uuid type'
        }
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  });
  Highlights.associate = (models) => {
    Highlights.belongsTo(models.Users, {
      foreignKey: 'userId',
    });
    Highlights.belongsTo(models.Article, {
      foreignKey: 'articleId',
    });
    Highlights.hasMany(models.HighlightComments, {
      foreignKey: 'highlightId',
      as: 'comments'
    });
  };
  return Highlights;
};
