// models/ItemProjetoModel.js
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class ItemProjetoModel extends Model { }

ItemProjetoModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nome: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        responsavel: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        valor: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        prazo: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('Novo', 'Em Análise', 'Aguardando Cliente', 'Aprovado', 'Em Progresso', 'Concluído', 'Recusado', 'Cancelado'),
            defaultValue: 'Novo',
        },
        data_criacao: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        data_finalizacao: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        projeto_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        servico_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        artista_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        cliente_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        proposta_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "ItemProjetoModel",
        tableName: "tb_item_projeto",
        timestamps: false,
    }
);

module.exports = ItemProjetoModel;
