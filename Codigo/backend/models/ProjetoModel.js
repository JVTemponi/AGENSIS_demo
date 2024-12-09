const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class ProjetoModel extends Model { }

ProjetoModel.init(
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
        cliente_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "ProjetoModel",
        tableName: "tb_projeto",
        timestamps: false,
    }
);

module.exports = ProjetoModel;
