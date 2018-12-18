export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Likes', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    isLiked: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    userId: {
      type: Sequelize.UUID,
      onDelete: 'CASCADE',
      reference: {
        model: 'Users',
        key: 'id',
        as: 'userId',
      }
    },
    articleId: {
      type: Sequelize.UUID,
      onDelete: 'CASCADE',
      reference: {
        model: 'Article',
        key: 'id',
        as: 'articleId'
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
  down: queryInterface => queryInterface.dropTable('Likes')
};
