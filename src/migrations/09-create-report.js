export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Reports', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    reportComment: {
      type: Sequelize.STRING
    },
    plagiarism: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    agreementViolation: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    userId: {
      type: Sequelize.UUID,
      onDelete: 'CASCADE',
      reference: {
        model: 'Users',
        key: 'id',
        as: 'report',
      }
    },
    articleId: {
      type: Sequelize.UUID,
      onDelete: 'CASCADE',
      reference: {
        model: 'Article',
        key: 'id',
        as: 'report',
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
  down: queryInterface => queryInterface.dropTable('Reports')
};
