export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('articleTag', {
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    articleId: {
      type: Sequelize.UUID,
      onDelete: 'CASCADE',
      references: {
        model: 'Article',
        key: 'id',
        as: 'articles'
      }
    },
    tagId: {
      type: Sequelize.UUID,
      onDelete: 'CASCADE',
      references: {
        model: 'tags',
        key: 'id',
        as: 'labels'
      }
    }
  }),
  down: queryInterface => queryInterface.dropTable('articleTag')
};
