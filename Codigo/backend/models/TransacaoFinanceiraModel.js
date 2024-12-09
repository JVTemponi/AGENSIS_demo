// TransacaoFinanceiraModel.js

const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class TransacaoFinanceiraModel extends Model { }

TransacaoFinanceiraModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tipo: {
      type: DataTypes.ENUM('entrada', 'saida'),
      allowNull: false,
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    data: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    recorrente: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    intervalo: {
      type: DataTypes.ENUM('diario', 'quinzenal', 'mensal', 'semestral', 'anual'),
      allowNull: true,
    },
    tempo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 12,
    },
    status: {
      type: DataTypes.ENUM('concluido', 'pendente', 'cancelado'),
      allowNull: false,
      defaultValue: 'pendente',
    },
  },
  {
    sequelize,
    modelName: 'TransacaoFinanceiraModel',
    tableName: 'tb_transacao_financeira',
    timestamps: false,
  }
);

module.exports = TransacaoFinanceiraModel;
