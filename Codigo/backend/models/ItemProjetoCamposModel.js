const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class ItemProjetoCamposModel extends Model { }

ItemProjetoCamposModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nome_campo: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        valor_digitado: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        item_projeto_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "ItemProjetoCamposModel",
        tableName: "item_projeto_campos",
        timestamps: false,
    }
);

module.exports = ItemProjetoCamposModel;

