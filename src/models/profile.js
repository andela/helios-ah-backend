
export default (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    facebookId: {
      type: DataTypes.TEXT,
    },
    twitterId: {
      type: DataTypes.TEXT,
    },
    googleId: {
      type: DataTypes.TEXT,
    },
    facebookProfileUrl: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      }
    },
    twitterHandle: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.UUID,
    }
  });
  Profile.associate = (models) => {
    Profile.belongsTo(models.Users, {
      foreignKey: 'userId'
    });
    // associations can be defined here
  };
  return Profile;
};
