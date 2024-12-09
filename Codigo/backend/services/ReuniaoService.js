const ReuniaoRepository = require("../repositories/ReuniaoRepository");

class ReuniaoService {
    constructor() {
      this.reuniaoRepository = ReuniaoRepository;
    }
  
    async criarReuniao(nome, descricao, horarioInicio, horarioFim, local, status, usuario_id) {
      try {
        const reuniao = await this.reuniaoRepository.criarReuniao({
            nome, 
            descricao, 
            horarioInicio, 
            horarioFim, 
            local, 
            status,
            usuario_id,
        });
        return reuniao;
      } catch (error) {
        console.error("Erro ao criar reunião:", error);
        throw new Error("Erro ao criar reunião");
      }
    }
  
    async buscarReunioes() {
        return await this.reuniaoRepository.buscarReunioes();
      }

    async buscarReunioesPorIdUsuario(usuario_id) {
      return await this.reuniaoRepository.buscarReunioesPorIdUsuario(usuario_id);
    }
    
    
      async buscarReuniaoPorId(id) {
        return await this.reuniaoRepository.buscarReuniaoPorId(id);
      }
    
      async atualizarReuniao(id, dados) {
        try {
          const atualizado = await this.reuniaoRepository.atualizarReuniao(id, dados);
          return atualizado;
        } catch (error) {
          console.error("Erro ao atualizar reunião:", error);
          throw new Error("Erro ao atualizar reunião");
        }
      }
    
      async deletarReuniao(id) {
        try {
          const deletado = await this.reuniaoRepository.deletarReuniao(id);
          return deletado;
        } catch (error) {
          console.error("Erro ao deletar reunião:", error);
          throw new Error("Erro ao deletar reunião");
        }
      }
}
  
  module.exports = new ReuniaoService(require('../repositories/ReuniaoRepository'));
  