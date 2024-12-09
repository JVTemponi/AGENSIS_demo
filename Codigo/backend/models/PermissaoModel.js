const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class PermissaoModel extends Model { }

PermissaoModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    acao: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    recurso: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "PermissaoModel",
    tableName: "tb_permissao",
    timestamps: false,
  }
);

module.exports = PermissaoModel;