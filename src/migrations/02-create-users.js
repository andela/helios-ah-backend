export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    image: {
      type: Sequelize.STRING
    },
    bio: {
      type: Sequelize.TEXT,
    },
    isVerified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    roleId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    ratings: {
      type: Sequelize.UUID,
      onDelete: 'CASCADE',
      reference: {
        model: 'Likes',
        key: 'userId',
        as: 'likes',
      }
    },
    likes: {
      type: Sequelize.UUID,
      onDelete: 'CASCADE',
      reference: {
        model: 'Likes',
        key: 'userId',
        as: 'likes',
      }
    },
    emailNotification: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    inAppNotification: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
  }),
  down: queryInterface => queryInterface.dropTable('Users'),
};
