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
      onDelete: 'CASCADE'
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    readTime: {
      type: DataTypes.STRING,
      allowNull: false
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
        if (this.title) {
          if (this.title.search(/[^\w\s\.\-\?#\$!']/g) !== -1) {
            throw new Error('Title should contain letters, numbers, !""?');
          }
        }
      }
    },
  });

  Article.associate = (models) => {
    Article.belongsTo(models.Users, {
      foreignKey: 'userId',
    });
    Article.hasMany(models.Ratings, {
      foreignKey: 'articleId',
      as: 'Ratings'
    });
    Article.hasMany(models.Likes, {
      foreignKey: 'articleId',
      as: 'Likes'
    });
    Article.belongsToMany(models.Users, {
      as: 'article',
      through: 'Bookmark',
      foreignKey: 'articleId'
    });
    Article.belongsToMany(models.Tags, {
      foreignKey: 'articleId',
      through: 'ArticleTags',
      as: 'Articles',
    });
    Article.hasMany(models.Report, {
      foreignKey: 'articleId',
      as: 'report'
    });
    Article.hasMany(models.Comments, {
      foreignKey: 'articleId',
      as: 'Comments'
    });
  };
  return Article;
};

export default articleModel;
