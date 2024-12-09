const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class ServicoCamposModel extends Model { }

ServicoCamposModel.init(
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
    tipo: {
      type: DataTypes.ENUM('Texto', 'Numero Inteiro', 'Numero Decimal', 'Data', 'Selecao'),
      allowNull: false,
    },
    obrigatorio: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    servico_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ServicoCamposModel",
    tableName: "tb_servico_campos",
    timestamps: false,
  }
);

module.exports = ServicoCamposModel;