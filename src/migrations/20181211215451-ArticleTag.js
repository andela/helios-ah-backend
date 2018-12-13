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
      primaryKey: true
    },
    tagId: {
      type: Sequelize.UUID,
      primaryKey: true
    }
  }),
  down: queryInterface => queryInterface.dropTable('articleTag')
};
