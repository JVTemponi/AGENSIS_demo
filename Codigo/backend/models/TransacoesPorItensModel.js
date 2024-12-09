// models/TransacoesPorItensModel.js
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class TransacoesPorItensModel extends Model { }

TransacoesPorItensModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        item_projeto_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        transacao_financeira_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "TransacoesPorItensModel",
        tableName: "tb_transacoes_por_itens",
        timestamps: false,
    }
);

module.exports = TransacoesPorItensModel;