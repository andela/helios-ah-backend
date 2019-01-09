export default (sequelize, DataTypes) => {
  const HighlightComments = sequelize.define('HighlightComments', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3, 250],
          msg: 'Text should be between 3 and 250 characters'
        }
      }
    },
    highlightId: {
      type: DataTypes.UUID,
      allowNull: false,
      onDelete: 'CASCADE',
      validate: {
        isUUID: {
          args: 4,
          msg: ':highlightId is not a valid uuid type'
        }
      }
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      onDelete: 'CASCADE',
      validate: {
        isUUID: {
          args: 4,
          msg: ':userId is not a valid uuid type'
        }
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  });
  HighlightComments.associate = (models) => {
    HighlightComments.belongsTo(models.Highlights, {
      foreignKey: 'highlightId',
    });
  };
  return HighlightComments;
};
