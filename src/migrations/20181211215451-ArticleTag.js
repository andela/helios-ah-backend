export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('ArticleTag', {
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    ArticleId: {
      type: Sequelize.UUID,
      primaryKey: true
    },
    TagId: {
      type: Sequelize.UUID,
      primaryKey: true
    }
  }),
  down: queryInterface => queryInterface.dropTable('ArticleTag')
};
