export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('tags', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID
    },
    tagName: {
      type: Sequelize.STRING,
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
  down: queryInterface => queryInterface.dropTable('tags')
};
