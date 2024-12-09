const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class PerfilModel extends Model { }

PerfilModel.init(
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
  },
  {
    sequelize,
    modelName: "PerfilModel",
    tableName: "tb_perfil",
    timestamps: false,
  }
);

module.exports = PerfilModel;
