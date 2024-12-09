class ReuniaoController {
  constructor(ReuniaoService) {
    this.ReuniaoService = ReuniaoService;
  }

  async criarReuniao(req, res) {
    const { nome, descricao, horarioInicio, horarioFim, local, status, usuario_id } = req.body;
  
    if (!usuario_id) {
      return res.status(400).json({ error: "ID do usuário é obrigatório." });
    }
  
    try {
      const reuniao = await this.ReuniaoService.criarReuniao(
        nome,
        descricao,
        horarioInicio,
        horarioFim,
        local,
        status,
        usuario_id
      );
      res.status(201).json(reuniao);
    } catch (error) {
      console.error("Erro ao criar reunião:", error);
      res.status(500).json({ error: "Erro ao criar reunião: " + error.message });
    }
  }
  

  async listarReunioes(req, res) {
    try {
      const reunioes = await this.ReuniaoService.buscarReunioes();
      res.status(200).json(reunioes);
    } catch (error) {
      console.error("Erro ao listar reuniões:", error);
      res.status(500).json({ error: "Erro ao listar reuniões: " + error });
    }
  }

  async buscarReunioesPorIdUsuario(req, res) {
    const { usuario_id } = req.params;
    try {
      const reunioes = await this.ReuniaoService.buscarReunioesPorIdUsuario(usuario_id);
      res.status(200).json(reunioes);
    } catch (error) {
      console.error("Erro ao listar reuniões:", error);
      res.status(500).json({ error: "Erro ao listar reuniões: " + error });
    }
  }

  async buscarReuniaoPorIdUsuario(req, res) {
    const { usuario_id } = req.params;
    try {
      const reuniao = await this.ReuniaoService.buscarReuniaoPorIdUsuario(usuario_id);
      if (!reuniao) {
        return res.status(404).json({ error: "Reunião não encontrada" });
      }
      res.status(200).json(reuniao);
    } catch (error) {
      console.error("Erro ao buscar reunião: ", error);
      res.status(500).json({ error: "Erro ao buscar reunião: " + error });
    }
  }


  async buscarReuniaoPorId(req, res) {
    const { id } = req.params;
    try {
      const reuniao = await this.ReuniaoService.buscarReuniaoPorId(id);
      if (!reuniao) {
        return res.status(404).json({ error: "Reunião não encontrada" });
      }
      res.status(200).json(reuniao);
    } catch (error) {
      console.error("Erro ao buscar reunião: ", error);
      res.status(500).json({ error: "Erro ao buscar reunião: " + error });
    }
  }

  async atualizarReuniao(req, res) {
    const { id } = req.params;
    const dados = req.body;
    console.log("Atualizando reunião com id:", id); // Verifique se o id está correto
    try {
      const atualizado = await this.ReuniaoService.atualizarReuniao(id, dados);
      if (atualizado[0] === 0) {
        return res.status(404).json({ error: "Reunião não encontrada" });
      }
      res.status(200).json({ message: "Reunião atualizada com sucesso" });
    } catch (error) {
      console.error("Erro ao atualizar reunião:", error);
      res.status(500).json({ error: "Erro ao atualizar reunião: " + error });
    }
  }
  

  async deletarReuniao(req, res) {
    const { id } = req.params;
    try {
      const deletado = await this.ReuniaoService.deletarReuniao(id);
      if (!deletado) {
        return res.status(404).json({ error: "Reunião não encontrada" });
      }
      res.status(200).json({ message: "Reunião deletado com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar reunião:", error);
      res.status(500).json({ error: "Erro ao deletar reunião: " + error });
    }
  }
}

module.exports = new ReuniaoController(require('../services/ReuniaoService'));
