export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('ArticleTags', {
    id: {
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      type: Sequelize.UUID,
    },
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
        model: 'Articles',
        key: 'id',
        as: 'Articles'
      }
    },
    tagId: {
      type: Sequelize.UUID,
      onDelete: 'CASCADE',
      references: {
        model: 'Tags',
        key: 'id',
        as: 'Labels'
      }
    }
  }),
  down: queryInterface => queryInterface.dropTable('ArticleTags')
};
