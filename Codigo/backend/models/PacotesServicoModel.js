const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class PacotesServicoModel extends Model { }

PacotesServicoModel.init(
  {
    pacote_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    servico_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "PacotesServicoModel",
    tableName: "tb_pacote_servico",
    timestamps: false,
  }
);

module.exports = PacotesServicoModel;
