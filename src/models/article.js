
const articleModel = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3, 80],
          msg: 'Title should not exceed 80 characters',
        }
      }
    },
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      onDelete: 'CASCADE'
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 200],
          msg: 'Description field should not exceed 200 character',
        }
      }
    },
    image: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          msg: 'Please use an image URL.'
        }
      }
    },
    isDraft: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  });
  Article.associate = (models) => {
    Article.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    Article.belongsToMany(models.Users, {
      as: 'article',
      through: 'Bookmark',
      foreignKey: 'articleId'
    });
  };
  return Article;
};

export default articleModel;
