const { TransacoesPorItensModel} = require("../models/index");

class TransacoesPorItensRepository {
  constructor() {
    this.transacoesPorItem = TransacoesPorItensModel;
  }

  async criarTransacaoItem(transacaoItemData) {
    return await this.transacoesPorItem.create(transacaoItemData);
  }

  async buscarTransacaoItem(itemProjetoId) {
    return await this.transacoesPorItem.findOne({
      where: { item_projeto_id: itemProjetoId },
    });
  }

}

module.exports = new TransacoesPorItensRepository();
