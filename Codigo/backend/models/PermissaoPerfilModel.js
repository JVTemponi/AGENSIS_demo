const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class PermissaoPerfilModel extends Model { }

PermissaoPerfilModel.init(
  {
    perfil_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    permissao_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "PermissaoPerfilModel",
    tableName: "tb_permissao_perfil",
    timestamps: false,
  }
);

module.exports = PermissaoPerfilModel;
