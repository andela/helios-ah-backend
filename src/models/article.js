const articleModel = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
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
    Article.hasMany(models.Feedback, {
      foreignKey: 'userId',
      as: 'feedback'
    });
  };
  return Article;
};

export default articleModel;
