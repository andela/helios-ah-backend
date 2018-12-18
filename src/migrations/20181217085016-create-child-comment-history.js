export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('ChildCommentHistories', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    childCommentId: {
      type: Sequelize.UUID,
      references: {
        model: 'ChildComments',
        key: 'id',
        as: 'childCommentId'
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
  down: queryInterface => queryInterface.dropTable('ChildCommentHistories')
};
