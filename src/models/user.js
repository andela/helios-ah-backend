import cryptData from '../utilities/cryptData';

export default (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'Users', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 25],
          is: {
            args: /^[a-z']+$/i,
            msg: 'First name must contain only Alphabets'
          }
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 25],
          is: {
            args: /^[a-z']+$/i,
            msg: 'Last name must contain only Alphabets'
          }
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: {
            args: true,
            msg: 'Email must be a valid email ID'
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [6, 150],
            msg: 'Password must be more than 5 characters'
          }
        }
      },
      image: {
        type: DataTypes.STRING,
        validate: {
          isUrl: true
        }
      },
      bio: {
        type: DataTypes.TEXT,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Bio must not be empty'
          }
        }
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 20],
          isAlphanumeric: {
            args: true,
            msg: 'Username must contain only alphanumeric',
          }
        }
      },
    }, {
      hooks: {
        beforeUpdate: async (user) => {
          user.password = await cryptData.encryptData(user.password);
        },
        beforeCreate: async (user) => {
          user.password = await cryptData.encryptData(user.password);
        }
      }
    }
  );
  Users.associate = (models) => {
    Users.hasMany(models.Authorize, {
      foreignKey: 'userId',
    });
    Users.hasMany(models.Article, {
      foreignKey: 'userId',
      as: 'articles',
    });
    Users.belongsToMany(models.Users, {
      as: 'Follow',
      through: {
        model: 'Follower',
      },
      foreignKey: 'userId',
    });
    Users.belongsToMany(models.Users, {
      as: 'Following',
      through: {
        model: 'Follower'
      },
      foreignKey: 'followerId'
    });
    Users.hasMany(models.Comments, {
      foreignKey: 'userId',
      as: 'comments'
    });
    Users.hasMany(models.ChildComments, {
      foreignKey: 'userId',
      as: 'childComments'
    });
    Users.belongsTo(models.Roles, {
      foreignKey: 'roleId'
    });
    Users.hasMany(models.Likes, {
      foreignKey: 'articleId',
      as: 'likes'
    });
    Users.hasMany(models.Ratings, {
      foreignKey: 'articleId',
      as: 'ratings'
    });
    Users.belongsToMany(models.Article, {
      as: 'reader',
      through: 'Bookmark',
      foreignKey: 'userId'
    });
    Users.hasMany(models.Report, {
      foreignKey: 'userId',
      as: 'report'
    });
  };
  Users.prototype.verifyPassword = password => cryptData
    .decryptData(password, Users.password);
  return Users;
};
