const express = require('express');
const ligacoes = require('../models/index');

class InitRoutes {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Rota para atualizar as associações
    this.router.get('/update-associations', async (req, res) => {
      try {
        // Atualiza associações
        await this.defineAssociacoes();
        res.status(200).json({ message: 'Associações atualizadas com sucesso!' });
      } catch (error) {
        console.error('Erro ao atualizar associações:', error);
        res.status(500).json({ error: 'Erro ao atualizar associações', details: error.message });
      }
    });

    // Outras rotas protegidas podem ser adicionadas aqui
  }

  async defineAssociacoes() {
    try {
      ligacoes.defineAssociacoes();
      console.log('Associações definidas com sucesso!');
    } catch (error) {
      console.error('Erro ao definir associações:', error);
      throw error; // Lança o erro para ser tratado na rota
    }
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new InitRoutes().getRouter();
