export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('CommentHistories', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    commentId: {
      type: Sequelize.UUID,
      references: {
        model: 'Comments',
        key: 'id',
        as: 'commentId'
      }
    },
    userId: {
      type: Sequelize.UUID,
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId'
      }
    },
    oldComment: {
      type: Sequelize.TEXT
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
  down: queryInterface => queryInterface.dropTable('CommentHistories')
};
