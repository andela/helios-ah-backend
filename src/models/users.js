const UserModel = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
    },
    bio: {
      type: DataTypes.TEXT,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
  });
  Users.associate = (models) => {
    Users.hasMany(models.Articles, {
      foreignKey: 'userId',
    });
    Users.hasMany(models.Comments, {
      foreignKey: 'userId'
    });
    Users.hasMany(models.VerificationToken, {
      foreignKey: 'userId'
    });
  };
  return Users;
};
export default UserModel;
