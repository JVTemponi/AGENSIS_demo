const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');
const ServicoCamposModel = require('./ServicoCamposModel');

class ServicoModel extends Model { }

ServicoModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(244),
      allowNull: false,
      unique: true,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: false,
    }
  },
  {
    sequelize,
    modelName: "ServicoModel",
    tableName: "tb_servico",
    timestamps: false,
  }
);

module.exports = ServicoModel;

