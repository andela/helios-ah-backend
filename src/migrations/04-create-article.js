
export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Articles', {
    id: {
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      type: Sequelize.UUID,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    body: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    readTime: {
      type: Sequelize.STRING,
      allowNull: false
    },
    image: {
      type: Sequelize.STRING,
    },
    isDraft: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      onDelete: 'CASCADE',
      defaultValue: Sequelize.UUIDV4,
      reference: {
        model: 'Users',
        key: 'id',
        as: 'articles',
      }
    },
    ratings: {
      type: Sequelize.UUID,
      onDelete: 'CASCADE',
      reference: {
        model: 'Likes',
        key: 'userId',
        as: 'likes',
      }
    },
    likes: {
      type: Sequelize.UUID,
      onDelete: 'CASCADE',
      reference: {
        model: 'Likes',
        key: 'userId',
        as: 'likes',
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
  down: queryInterface => queryInterface.dropTable('Articles')
};
