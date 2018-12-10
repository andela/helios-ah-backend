
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
        len: [3, 25],
        is: {
          args: /^[a-z']+$/i,
          msg: 'First name must contain only Alphabets and \''
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
          msg: 'Last name must contain only Alphabets and \''
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
