
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
          args: [2, 80],
          msg: 'Title field accepts 2 - 80 characters',
        }
      }
    },
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      onDelete: 'CASCADE',
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
          msg: 'Description field accepts 2 - 200 characters',
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
  }, {
    validate: {
      checkForSpace() {
        if (this.title.search(/[^\w\s\.\-\?#\$!']/g) !== -1) {
          throw new Error('Title should contain letters, numbers, !""?');
        }
      }
    },
  });

  Article.associate = (models) => {
    Article.belongsTo(models.Users, {
      foreignKey: 'userId',
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
