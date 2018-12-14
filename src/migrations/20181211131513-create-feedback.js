export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Feedbacks', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    isLiked: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    rating: {
      type: Sequelize.INTEGER,
      defaultValue: null
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
  down: queryInterface => queryInterface.dropTable('Feedbacks')
};
