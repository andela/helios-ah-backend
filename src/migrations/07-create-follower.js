export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Followers', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    userId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: 'id',
        model: 'Users',
        as: 'following'
      }
    },
    followerId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        key: 'id',
        model: 'Users',
        as: 'follower'
      }
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false
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
  down: queryInterface => queryInterface.dropTable('Followers')
};
