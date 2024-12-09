const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');
const PacotesServicoModel = require('./PacotesServicoModel');
const ServicoModel = require('./ServicoModel');

class PacotesModel extends Model { }

PacotesModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'PacotesModel',
    tableName: 'tb_pacote',
    timestamps: false,
  }
);

module.exports = PacotesModel;
