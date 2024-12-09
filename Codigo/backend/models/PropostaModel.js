const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class PropostaModel extends Model { }

PropostaModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('Incompleta', 'Pendente', 'Aprovada', 'Recusada'),
        defaultValue: 'Incompleta',
    },
    valor: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    prazo: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'PropostaModel',
    tableName: 'tb_proposta',
    timestamps: false,
});

module.exports = PropostaModel;
