// UsuarioModel.js

const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class UsuarioModel extends Model { }

UsuarioModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(244),
      allowNull: false,
      unique: true,
    },
    senha: {
      type: DataTypes.STRING(244),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("1", "2", "3"),
      defaultValue: "1",
    },
    data_criacao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    perfil_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "UsuarioModel",
    tableName: "tb_usuario",
    timestamps: false,
  }
);

module.exports = UsuarioModel;