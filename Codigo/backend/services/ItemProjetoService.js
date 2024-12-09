// ItemProjetoService.js
const ItemProjetoRepository = require('../repositories/ItemProjetoRepository');
const PropostaRepository = require('../repositories/PropostaRepository');
const ServicoService = require('./ServicoService');
const UsuarioService = require('./UsuarioService');
const ClienteService = require('./ClienteService');
const ArtistaService = require('./ArtistaService');
const TransacaoFinanceiraService = require('./TransacaoFinanceiraService');
const TransacoesPorItensRepository = require('../repositories/TransacoesPorItensRepository');

class ItemProjetoService {

    constructor() {
        this.itemProjetoRepository = ItemProjetoRepository;
        this.propostaRepository = PropostaRepository;
        this.servicoService = ServicoService;
        this.clienteService = ClienteService;
        this.artistaService = ArtistaService;
        this.transacao = TransacaoFinanceiraService;
        this.transacaoItem = TransacoesPorItensRepository;
    }

    async criarItemProjeto(dadosItemCampos, projeto_id, servico_id, cliente_id) {

        if (!dadosItemCampos || dadosItemCampos.length === 0) {
            throw new Error('Campos do item do projeto não informados.');
        }
        if (!projeto_id || !servico_id || !cliente_id) {
            throw new Error('Projeto, Serviço ou Cliente não informados.');
        }

        try {
            const servico = await this.servicoService.buscarServicoPorId(servico_id);
            const cliente = await this.clienteService.buscarClientePorId(cliente_id);
            const proposta = await this.propostaRepository.criarProposta(servico.nome, cliente.nome);

            const dadadosItemProjeto = {
                nome: `${servico.nome} - ${cliente.nome}`,
                projeto_id: projeto_id,
                servico_id: servico.id,
                cliente_id: cliente.id,
                proposta_id: proposta.id
            };

            const itemProjeto = await this.itemProjetoRepository.criarItemProjeto(dadadosItemProjeto);

            for (const campo of dadosItemCampos) {
                await this.itemProjetoRepository.criarItemProjetoCampos(itemProjeto.id, {
                    nome_campo: campo.nome_campo,
                    valor_digitado: campo.valor_digitado
                });
            }
            return itemProjeto;
        }
        catch (error) {
            throw new Error('Erro ao criar item do projeto: ' + error.message);
        }
    }

    async buscarTodosItemProjeto() {
        return await this.itemProjetoRepository.buscarTodosItemProjeto();
    }

    async buscarTodosItemProjetoPorIdProjeto(projeto_id) {
        return await this.itemProjetoRepository.buscarTodosItemProjetoPorIdProjeto(projeto_id);
    }

    async buscarTodosItemProjetoPorIdCliente(cliente_id) {
        return await this.itemProjetoRepository.buscarTodosItemProjetoPorIdCliente(cliente_id);
    }

    async buscarTodosItemProjetoPorIdArtista(artista_id) {
        return await this.itemProjetoRepository.buscarTodosItemProjetoPorIdArtista(artista_id);
    }

    async buscarTodosItemProjetoPorIdUsuario(usuario_id) {

        try {
            const usuario = await UsuarioService.buscarUsuarioPorId(usuario_id);

            if (!usuario) {
                throw new Error('Usuário não encontrado');
            }
            else {
                let cliente = null;
                let artista = null;

                //Verifica se o usuário é cliente ou artista
                if (usuario.perfil === 'cliente') {
                    cliente = await this.clienteService.buscarClientePorUsuarioId(usuario_id);
                }
                else {
                    artista = await this.artistaService.buscarArtistaPorUsuarioId(usuario_id);
                }
                //Realiza as chamadas corretas
                if (cliente && artista) {
                    throw new Error('Usuário não pode ser cliente e artista ao mesmo tempo');
                }
                else if (!cliente && !artista) {
                    throw new Error('Serão exibidos apenas itens do projeto de clientes ou artistas');
                }
                else if (cliente && !artista) {
                    return await this.itemProjetoRepository.buscarTodosItemProjetoPorIdCliente(cliente.id);
                }
                if (artista && !cliente) {
                    return await this.itemProjetoRepository.buscarTodosItemProjetoPorIdArtista(artista.id);
                }
            }
        } catch (error) {
            throw new Error('Erro ao buscar itens do projeto do usuário: ' + error.message);
        }
    }

    async buscarTodosItemProjetoPorStatus(status) {

        if (!status) {
            throw new Error('Status do item do projeto não informado.');
        }
        if (
            status !== 'Novo' &&
            status !== 'Em Análise' &&
            status !== 'Aguardando Cliente' &&
            status !== 'Aprovado' &&
            status !== 'Em Progresso' &&
            status !== 'Concluído' &&
            status !== 'Cancelado' &&
            status !== 'Recusado'
        ) { throw new Error('Status do item do projeto inválido.'); }

        return await this.itemProjetoRepository.buscarTodosItemProjetoPorStatus(status);
    }

    async buscarItemProjetoPorId(id) {
        return await this.itemProjetoRepository.buscarItemProjetoPorId(id);
    }

    async assumirItemProjeto(id, artista_id) {

        try {
            const itemProjeto = await this.itemProjetoRepository.buscarItemProjetoPorId(id);
            const artista = await this.artistaService.buscarArtistaPorId(artista_id);

            if (itemProjeto.status === 'Concluído') {
                throw new Error('Item do projeto já foi concluído e não pode ser assumido');
            }
            if (itemProjeto.status === 'Cancelado' || itemProjeto.status === 'Recusado') {
                throw new Error('Item do projeto já foi recusado ou cancelado');
            }

            //O primeiro artista a assumir o item do projeto, altera o status para 'Em Análise'
            if (itemProjeto.status === 'Novo') {
                itemProjeto.status = 'Em Análise';
            }

            const dadosItem = {
                status: itemProjeto.status,
                artista_id: artista_id,
                responsavel: artista.nome
            };

            await this.itemProjetoRepository.atualizarItemProjeto(id, dadosItem);

        } catch (error) {
            throw new Error('Erro ao assumir item do projeto: ' + error.message);
        }
    }

    async adicionarPropostaItemProjeto(id, descricao, valor, prazo) {

        try {
            const itemProjeto = await this.itemProjetoRepository.buscarItemProjetoPorId(id);
            const proposta = await this.propostaRepository.buscarPropostaPorId(itemProjeto.proposta_id);

            if (itemProjeto.status !== 'Em Análise') {
                throw new Error('As propostas serão realizadas apenas durante a análise da demanda');
            }
            if (proposta.status !== 'Incompleta' && proposta.status !== 'Recusada') {
                throw new Error('Já existe uma proposta em andamento para este item do projeto');
            }

            const dadosProposta = {
                descricao: descricao,
                valor: valor,
                prazo: prazo,
                status: 'Pendente'
            };

            const dadosItem = {
                status: 'Aguardando Cliente'
            };

            await this.propostaRepository.preencherProposta(proposta.id, dadosProposta);
            await this.itemProjetoRepository.atualizarItemProjeto(id, dadosItem);

        } catch (error) {
            throw new Error('Erro ao adicionar proposta ao item do projeto: ' + error.message);
        }
    }

    async recusarPropostaItemProjeto(id) {
        try {
            const itemProjeto = await this.itemProjetoRepository.buscarItemProjetoPorId(id);
            const proposta = await this.propostaRepository.buscarPropostaPorId(itemProjeto.proposta_id);

            if (itemProjeto.status !== 'Aguardando Cliente') {
                throw new Error('A proposta só pode ser recusada após a análise do cliente');
            }
            if (proposta.status !== 'Pendente') {
                throw new Error('A proposta já foi aceita ou recusada');
            }

            const dadosProposta = {
                status: 'Recusada',
                descricao: `[Proposta Recusada] - ${proposta.descricao}`,
            };

            const dadosItem = {
                status: 'Recusado',
                valor: proposta.valor,
                prazo: proposta.prazo,
            };

            await this.propostaRepository.preencherProposta(proposta.id, dadosProposta);
            await this.itemProjetoRepository.atualizarItemProjeto(id, dadosItem);

        } catch (error) {
            throw new Error('Erro ao recusar proposta do item do projeto: ' + error.message);
        }
    }

    async aceitarPropostaItemProjeto(id) {
        try {
            const itemProjeto = await this.itemProjetoRepository.buscarItemProjetoPorId(id);
            const proposta = await this.propostaRepository.buscarPropostaPorId(itemProjeto.proposta_id);

            if (itemProjeto.status !== 'Aguardando Cliente') {
                throw new Error('A proposta só pode ser aceita após a análise do cliente');
            }
            if (proposta.status !== 'Pendente') {
                throw new Error('A proposta já foi aceita ou recusada');
            }

            const dadosProposta = {
                status: 'Aprovada',
                descricao: `[Proposta Aceita] - ${proposta.descricao}`,
            };

            const dadosItem = {
                status: 'Aprovado',
                valor: proposta.valor,
                prazo: proposta.prazo,
            };

            await this.propostaRepository.preencherProposta(proposta.id, dadosProposta);
            await this.itemProjetoRepository.atualizarItemProjeto(id, dadosItem);

            const transacao = await this.transacao.criarTransacao({
                nome: `Projeto - ${itemProjeto.nome}`,
                descricao: `Pagamento referente ao item do projeto: ${itemProjeto.nome}`,
                tipo: 'entrada',
                valor: proposta.valor,
                data: proposta.prazo,
                recorrente: false,
                intervalo: null,
                tempo: null,
                status: 'pendente'

            });

            const transacaoItemData = {
                item_projeto_id: itemProjeto.id,
                transacao_financeira_id: transacao.id
            };

            await this.transacaoItem.criarTransacaoItem( transacaoItemData );

        } catch (error) {
            throw new Error('Erro ao aceitar proposta do item do projeto: ' + error.message);
        }
    }

    async iniciarItemProjeto(id) {
        try {
            const itemProjeto = await this.itemProjetoRepository.buscarItemProjetoPorId(id);
            const proposta = await this.propostaRepository.buscarPropostaPorId(itemProjeto.proposta_id);

            if (itemProjeto.status !== 'Aprovado') {
                throw new Error('O item do projeto ainda não foi aprovado pelo cliente');
            }
            if (proposta.status !== 'Aprovada') {
                throw new Error('A proposta do item do projeto não foi aprovada pelo cliente');
            }

            const dadosItem = { status: 'Em Progresso' };

            await this.itemProjetoRepository.atualizarItemProjeto(id, dadosItem);

        } catch (error) {
            throw new Error('Erro ao iniciar item do projeto: ' + error.message);
        }
    }

    async concluirItemProjeto(id) {
        try {
            const itemProjeto = await this.itemProjetoRepository.buscarItemProjetoPorId(id);

            if (itemProjeto.status !== 'Em Progresso') {
                throw new Error('O item do projeto ainda não foi iniciado');
            }

            const dadosItem = {
                status: 'Concluído',
                data_finalizacao: new Date()
            };

            const transacaoItemProjeto = await this.transacaoItem.buscarTransacaoItem(itemProjeto.id);

            console.log('transacaoItemProjeto', transacaoItemProjeto);

            if (transacaoItemProjeto) {
                
                const updateData = {
                    status : 'concluido'                    
                };

                await this.transacao.finalizarTransacao(transacaoItemProjeto.transacao_financeira_id, updateData);
              
            }

            await this.itemProjetoRepository.atualizarItemProjeto(id, dadosItem);

        } catch (error) {
            throw new Error('Erro ao concluir item do projeto: ' + error.message);
        }
    }

    async cancelarItemProjeto(id, artista_id) {

        try {
            const itemProjeto = await this.itemProjetoRepository.buscarItemProjetoPorId(id);
            const artista = await this.artistaService.buscarArtistaPorId(artista_id);

            if (itemProjeto.status === 'Concluído') {
                throw new Error('Item do projeto já foi concluído e não pode ser cancelado');
            }
            if (itemProjeto.status === 'Cancelado') {
                throw new Error('Item do projeto já foi cancelado');
            }
            else {
                const dadosItem = {
                    status: 'Cancelado',
                    data_finalizacao: new Date(),
                    artista_id: null,
                    responsavel: artista.nome
                };

                await this.itemProjetoRepository.atualizarItemProjeto(id, dadosItem);
            }

            const transacaoItemProjeto = await this.transacaoItem.buscarTransacaoItem(itemProjeto.id);

            if (transacaoItemProjeto) {
                
                const updateData = {
                    status : 'cancelado'                    
                };
                
                await this.transacao.finalizarTransacao(transacaoItemProjeto.transacao_financeira_id, updateData);                
            }

        } catch (error) {
            throw new Error('Erro ao cancelar item do projeto: ' + error.message);
        }
    }
}

module.exports = new ItemProjetoService();

