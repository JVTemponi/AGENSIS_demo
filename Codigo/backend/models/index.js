const { sequelize } = require('../config/database');
const UsuarioModel = require('./UsuarioModel');
const PerfilModel = require('./PerfilModel');
const PermissaoModel = require('./PermissaoModel');
const PermissaoPerfilModel = require('./PermissaoPerfilModel');
const ArtistaModel = require('./ArtistaModel');
const ClienteModel = require('./ClienteModel');
const ProjetoModel = require('./ProjetoModel');
const ItemProjetoModel = require('./ItemProjetoModel');
const ItemProjetoCamposModel = require('./ItemProjetoCamposModel');
const ServicoModel = require('./ServicoModel');
const ServicoCamposModel = require('./ServicoCamposModel');
const PropostaModel = require('./PropostaModel');
const PacotesModel = require('./PacotesModel');
const PacoteServicoModel = require('./PacotesServicoModel');
const ReuniaoModel = require('./ReuniaoModel');
const TransacaoFinanceiraModel = require('./TransacaoFinanceiraModel');
const PermissaoService = require('../services/PermissaoService');
const ClienteRatingModel = require('./ClienteRatingModel');
const TransacoesPorItensModel = require('./TransacoesPorItensModel');

function defineAssociacoes() {

    // Associações de Usuario
    UsuarioModel.belongsTo(PerfilModel, { foreignKey: 'perfil_id', as: 'perfil' });
    UsuarioModel.hasMany(ReuniaoModel, { foreignKey: 'usuario_id', as: 'reunioes' });

    // Associações de Artista
    ArtistaModel.belongsTo(UsuarioModel, { foreignKey: 'usuario_id', as: 'usuario' });
    ArtistaModel.hasMany(ItemProjetoModel, { foreignKey: 'artista_id', as: 'itensProjeto' });

    // Associações de Cliente
    ClienteModel.belongsTo(UsuarioModel, { foreignKey: 'usuario_id', as: 'usuario' });
    ClienteModel.hasMany(ItemProjetoModel, { foreignKey: 'cliente_id', as: 'itensProjeto' });
    ClienteModel.hasMany(ProjetoModel, { foreignKey: 'cliente_id', as: 'projetos' });
    ClienteModel.hasMany(ClienteRatingModel, { foreignKey: 'cliente_id', as: 'avaliacao' });

    // Associações de Perfil
    PerfilModel.hasMany(UsuarioModel, { foreignKey: 'perfil_id', as: 'usuarios' });
    PerfilModel.hasMany(PermissaoPerfilModel, { foreignKey: 'perfil id', as: 'permissoes' });
    PerfilModel.belongsToMany(PermissaoModel, { through: PermissaoPerfilModel, foreignKey: 'perfil_id', otherKey: 'permissao_id' });

    // Associações de Permissao
    PermissaoModel.hasMany(PermissaoPerfilModel, { foreignKey: 'permissao_id', as: 'perfis' });
    PermissaoModel.belongsToMany(PerfilModel, { through: PermissaoPerfilModel, foreignKey: 'permissao_id', otherKey: 'perfil_id' });


    // Associações de PermissaoPerfil
    PermissaoPerfilModel.belongsTo(PerfilModel, { foreignKey: 'perfil_id', as: 'perfil' });
    PermissaoPerfilModel.belongsTo(PermissaoModel, { foreignKey: 'permissao_id', as: 'permissao' });

    //Associações de Servico
    ServicoModel.hasMany(ItemProjetoModel, { foreignKey: 'servico_id', as: 'itensProjeto' });
    ServicoModel.hasMany(PacoteServicoModel, { foreignKey: 'servico_id'/*, as: 'pacotes' */ });
    ServicoModel.hasMany(ServicoCamposModel, { foreignKey: 'servico_id', as: 'campos', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    ServicoModel.belongsToMany(PacotesModel, { through: PacoteServicoModel, foreignKey: 'servico_id', otherKey: 'pacote_id', as: 'pacotes' });

    //Associações de Reuniao
    ReuniaoModel.belongsTo(UsuarioModel, { foreignKey: 'usuario_id', as: 'usuario' });

    // Associações de Pacote
    PacotesModel.hasMany(PacoteServicoModel, { foreignKey: 'pacote_id'/*, as: 'servicos'*/ });
    PacotesModel.belongsToMany(ServicoModel, { through: PacoteServicoModel, foreignKey: 'pacote_id', otherKey: 'servico_id', as: 'servicos' });

    //Associações de PacoteServico
    PacoteServicoModel.belongsTo(ServicoModel, { foreignKey: 'servico_id', as: 'servico' });
    PacoteServicoModel.belongsTo(PacotesModel, { foreignKey: 'pacote_id', as: 'pacote' });

    // Associações de Projeto
    ProjetoModel.hasMany(ItemProjetoModel, { foreignKey: 'projeto_id', as: 'itensProjeto' });

    // Associações de Proposta
    PropostaModel.hasMany(ItemProjetoModel, { foreignKey: 'proposta_id', as: 'itensProjeto' });

    // Associações de ItemProjeto
    ItemProjetoModel.belongsTo(ProjetoModel, { foreignKey: 'projeto_id', as: 'projeto' });
    ItemProjetoModel.belongsTo(ServicoModel, { foreignKey: 'servico_id', as: 'servico' });
    ItemProjetoModel.belongsTo(ArtistaModel, { foreignKey: 'artista_id', as: 'artista' });
    ItemProjetoModel.belongsTo(ClienteModel, { foreignKey: 'cliente_id', as: 'cliente' });
    ItemProjetoModel.belongsTo(PropostaModel, { foreignKey: 'proposta_id', as: 'proposta' });
    ItemProjetoModel.hasMany(ItemProjetoCamposModel, { foreignKey: 'item_projeto_id', as: 'campos', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    ItemProjetoModel.hasMany(TransacoesPorItensModel, { foreignKey: 'item_projeto_id', as: 'transacoesPorItens' });


    // Associação de ItemProjetoCampos
    ItemProjetoCamposModel.belongsTo(ItemProjetoModel, { foreignKey: 'item_projeto_id', as: 'itemProjeto', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

    // Associações de ServicoCampos
    ServicoCamposModel.belongsTo(ServicoModel, { foreignKey: 'servico_id', as: 'servico', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

    // Associações de TransacaoFinanceira por item
    TransacoesPorItensModel.belongsTo(ItemProjetoModel, { foreignKey: 'item_projeto_id', as: 'itemProjetoTransacao' });
    TransacoesPorItensModel.belongsTo(TransacaoFinanceiraModel, { foreignKey: 'transacao_financeira_id', as: 'transacaoFinanceira' });

    // Associações de TransacaoFinanceira
    TransacaoFinanceiraModel.hasMany(TransacoesPorItensModel , { foreignKey: 'transacao_financeira_id', as: 'transacaoItem' });


}

async function criaRegistrosIniciais() {
    const [perfilAdmin] = await PerfilModel.findOrCreate({
        where: { nome: 'admin' },
        defaults: { nome: 'admin' },
    });

    const emailAdmin = 'admin@admin.com';
    const usuarioAdmin = await UsuarioModel.findOne({ where: { email: emailAdmin } });

    if (!usuarioAdmin) {
        await UsuarioModel.create({
            email: emailAdmin,
            senha: 'admin',
            perfil_id: perfilAdmin.id,
        });
    }

    const [perfilCliente] = await PerfilModel.findOrCreate({
        where: { nome: 'cliente' },
        defaults: { nome: 'cliente' },
    });

    const emailCliente = 'cliente@cliente.com';
    const usuarioCliente = await UsuarioModel.findOne({ where: { email: emailCliente } });

    if (!usuarioCliente) {
        const novoCliente = await UsuarioModel.create({
            email: emailCliente,
            senha: 'cliente',
            perfil_id: perfilCliente.id,
        });
        await ClienteModel.create({
            nome: 'Cliente',
            sobrenome: 'Inicial',
            usuario_id: novoCliente.id,
        });
    }

    await PermissaoService.carregarPermissoes();
}

async function initializeDatabase() {
    try {
        // Define associações
        //defineAssociacoes();

        // Sincroniza o banco de dados
        //await sequelize.sync({ alter: true });
        console.log('Tabelas sincronizadas com sucesso!');

        // Cria registros iniciais
        //await criaRegistrosIniciais();
        console.log('Registros iniciais criados com sucesso!');
    } catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
    }
}

initializeDatabase();

// Exporte os modelos já configurados
module.exports = {
    UsuarioModel,
    PerfilModel,
    PermissaoModel,
    PermissaoPerfilModel,
    ArtistaModel,
    ClienteModel,
    ClienteRatingModel,
    ProjetoModel,
    ItemProjetoModel,
    ItemProjetoCamposModel,
    ServicoModel,
    ServicoCamposModel,
    PropostaModel,
    PacotesModel,
    PacoteServicoModel,
    ReuniaoModel,
    TransacaoFinanceiraModel,
    TransacoesPorItensModel,
};
