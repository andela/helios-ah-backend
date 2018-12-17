export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Profiles', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    facebookId: {
      type: Sequelize.TEXT,
      unique: true,
    },
    twitterId: {
      type: Sequelize.TEXT,
      unique: true,
    },
    googleId: {
      type: Sequelize.TEXT,
      unique: true,
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      onDelete: 'CASCADE',
      reference: {
        model: 'Users',
        key: 'id',
        as: 'userProfile',
      }
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('Profiles')
};
