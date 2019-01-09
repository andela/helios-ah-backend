export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Highlights', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    text: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      onDelete: 'CASCADE',
    },
    articleId: {
      type: Sequelize.UUID,
      allowNull: false,
      onDelete: 'CASCADE',
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
  down: queryInterface => queryInterface.dropTable('Highlights')
};
