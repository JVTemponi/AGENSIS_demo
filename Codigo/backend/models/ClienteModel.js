const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class ClienteModel extends Model { }

ClienteModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    sobrenome: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING(14),
      allowNull: true,
      unique: true
    },
    data_nascimento: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    telefone: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: "ClienteModel",
    tableName: "tb_cliente",
    timestamps: false,
  }
);

module.exports = ClienteModel;
