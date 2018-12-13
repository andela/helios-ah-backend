export default {
  up: (queryInterface, Sequelize) => queryInterface
    .createTable('ChildComments', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      commentText: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      userId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        reference: {
          model: 'Users',
          key: 'id',
          as: 'childComments',
        }
      },
      commentId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        reference: {
          model: 'Comments',
          key: 'id',
          as: 'childComments',
        }
      },
    }),
  down: queryInterface => queryInterface.dropTable('ChildComments')
};
