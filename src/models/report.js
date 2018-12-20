const ReportModel = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    plagiarism: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        isBoolean: {
          args: true,
          msg: 'boolean value expected'
        }
      }
    },
    agreementViolation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        isBoolean: {
          args: true,
          msg: 'boolean value expected'
        }
      }
    },
    reportComment: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3, 250],
          msg: 'Text should be between 3 and 250 characters'
        }
      }
    },
    userId: {
      type: DataTypes.UUIDV4,
      validate: {
        isUUID: {
          args: 4,
          msg: ':userId is not a valid uuid type'
        }
      }
    },
    articleId: {
      type: DataTypes.UUIDV4,
      validate: {
        isUUID: {
          args: 4,
          msg: ':articleId is not a valid uuid type'
        }
      }
    }
  });
  Report.associate = (models) => {
    Report.belongsTo(models.Users, {
      foreign: 'userId',
      onDelete: 'CASCADE'
    });
    Report.belongsTo(models.Article, {
      foreign: 'articleId',
      onDelete: 'CASCADE'
    });
  };
  return Report;
};

export default ReportModel;
