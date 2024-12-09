const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class ClienteRatingModel extends Model {}

ClienteRatingModel.init(
  {
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    artista_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    rate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ClienteRatingModel',
    tableName: 'tb_cliente_rating',
    timestamps: false,
    hooks: {
      beforeCreate: (instance) => {
        instance.createdAt = new Date();
        instance.updatedAt = new Date();
      },
      beforeUpdate: (instance) => {
        instance.updatedAt = new Date();
      },
    },
  }
);

module.exports = ClienteRatingModel;