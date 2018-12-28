export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
    'HighlightComments', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      comment: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      highlightId: {
        type: Sequelize.UUID,
        allowNull: false,
        onDelete: 'CASCADE',
      },
      userId: {
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
    }
  ),
  down: queryInterface => queryInterface.dropTable('HighlightComments')
};
