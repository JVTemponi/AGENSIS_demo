const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class ArtistaModel extends Model { }

ArtistaModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    sobrenome: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING(14),
      allowNull: false,
      unique: true
    },
    habilidades: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    experiencia: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ArtistaModel",
    tableName: "tb_artista",
    timestamps: false,
  }
);

module.exports = ArtistaModel;
