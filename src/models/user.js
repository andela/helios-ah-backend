
export default (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 15],
        is: {
          args: /^[a-z]+$/i,
          msg: 'First name must contain only Alphabets'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 15],
        is: {
          args: /^[a-z]+$/i,
          msg: 'Last name must contain only Alphabets'
        }
      }
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
        is: {
          args: /^[A-Za-z]+[A-Za-z0-9 _.,!?;"']+$/i,
          msg: 'Bio must contain only valid '
              + 'characters and must begin with '
              + 'an alphabet'
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
        len: [3, 15],
        is: {
          args: /^[A-Za-z]+[A-Za-z0-9_]+$/i,
          msg: 'Username must contain only alphabet, '
              + 'numbers, and characters  and must begin '
              + 'with an alphabet'
        }
      }
    },
  });
  Users.associate = (models) => {
    Users.hasMany(models.VerificationToken, {
      foreignKey: 'userId',
    });
    Users.hasMany(models.Article, {
      foreignKey: 'userId',
      as: 'articles',
    });
  };
  return Users;
};
