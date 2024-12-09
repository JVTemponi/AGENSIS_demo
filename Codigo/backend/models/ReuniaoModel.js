const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database'); // Reutilizando a instância de conexão
const UsuarioModel = require('./UsuarioModel'); // Import do modelo de usuário

class ReuniaoModel extends Model {}

ReuniaoModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    horarioInicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    horarioFim: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    local: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("confirmado", "cancelado"),
      allowNull: false,
      defaultValue: "confirmado",
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: UsuarioModel, key: 'id' },
    },
  },
  {
    sequelize,
    modelName: "ReuniaoModel",
    tableName: "tb_reuniao",
    timestamps: false,
  }
);

module.exports = ReuniaoModel;
