import { Bot } from "../../../bot.js";
import { EVENTOS } from "../../../eventos/eventos.js";
import { Handler_Info } from "../../../servicos/receber/handlers/Handler.js";
import Grupos from "../Grupos.js";
import Canais from "./canais/Canais.js";
import { Interacao } from "./canais/canal/interacao/Interacao.js";

// Campos que normalmente cada grupo possui
import { Grupo_Estrutura } from "./Grupo_Estrutura.js";

/**
 * Essa classe representa um Grupo em que o BOT se encontra
 * A partir dessa classe, é possivel fazer basicamente tudo, visualizar, excluir, alterar mensagens, permissões, grupos, etc...
 * Tudo claro dependendo do nível de permissão do BOT
 */
export default class Grupo {
    /**
     * A instancia do Grupos, que guarda é responsavel por armazenar esse grup
     * @type {Grupos}
     */
    #grupo_manager;

    /**
     * Armazena todas as informações do grupo
     * @type {Grupo_Estrutura}
     */
    #grupo_dados;

    /**
     * Canais pertencentes desse grupo
     * @type {Canais}
     */
    #canais;

    /**
     * Os handlers são eventos que são chamados pelo serviço de receber eventos
     * Todos os handlers cadastrados aqui são pertencentes somente a esse grupo/guilda
     * @type {[Handler_Info]}
     */
    #handlers = []

    /**
     * A classe de interação cuida de todas as interações em relação a esse grupo
     */
    #interacao;

    /**
     * Instancia o grupo com um objeto do grupo, recebido do Discord pelo gateway
     * @param {Grupos} grupo_manager
     * @param {Grupo_Estrutura} grupo_data 
     */
    constructor(grupo_manager, grupo_data) {
        this.#grupo_manager = grupo_manager
        this.#grupo_dados = grupo_data

        this.#canais = new Canais(this)
        this.#interacao = new Interacao(this)

        this.cadastrar_handlers()
    }

    /**
     * Retorna as informações desse grupo
     * @returns {Grupo_Estrutura}
     */
    get_grupo_dados() {
        return this.#grupo_dados
    }

    /**
     * Retorna o BOT vinculado
     * @returns {Bot}
     */
    get_bot() {
        return this.#grupo_manager.get_modulo().get_bot()
    }

    /**
     * Retorna o objeto canais que guarda todos os canais pertencetes desse grupo
     * @returns {Canais}
     */
    get_canais_manager() {
        return this.#canais
    }

    /**
     * Retorna o manager de grupos responsavel por esse Grupo
     * @returns {Grupos}
     */
    get_grupo_manager() {
        return this.#grupo_manager
    }

    /**
     * Retorna o manager de interação responsavél por esse Grupo
     * @returns {Interacao}
     */
    get_interacao_manager() {
        return this.#interacao
    }

    /**
     * Disparar uma função sua quando um evento desse grupo for disparado
     * @param {EVENTOS} tipo_evento 
     * @param {Function} funcao_executar 
     */
    on(tipo_evento, funcao_executar) {
        this.#grupo_manager.log(`Adicionando novo evento ON ${tipo_evento}`)
        let handler_manager = this.#grupo_manager.get_modulo().get_bot().get_handlers()

        let handler_usuario = handler_manager.add_handler(tipo_evento, dados_gateway => {
            let guild_id;

            if (dados_gateway.get_data().guild_id != undefined) {
                guild_id = dados_gateway.get_data().guild_id
            } else if (dados_gateway.get_data().id != undefined) {
                guild_id = dados_gateway.get_data().id
            }

            if (guild_id != undefined && guild_id == this.#grupo_dados.id) {
                funcao_executar(dados_gateway.get_data())
            }
        })
        this.#handlers.push(handler_usuario)
    }

    /**
     * Castrar os listener que tem haver com o grupo, para mante-lo atualizado
     * Como membros novos, expulsoes, banimentos, etc...
     */
    cadastrar_handlers() {
        let handler_manager = this.#grupo_manager.get_modulo().get_bot().get_handlers()

        let handler_grupo_atualizou = handler_manager.add_handler(EVENTOS.GUILDS.GUILD_UPDATE, update_info => {
            let grupo_id = update_info.get_data().guild_id
            if (grupo_id == this.#grupo_dados.id) {
                this.#atualicar_grupo_dados(update_info.get_data())
            }
        })

        this.#handlers.push(handler_grupo_atualizou)
    }

    /**
     * Atualiza as informações do grupo que estiverem divergentes
     * @param {{}} dados_atualizar 
     */
    #atualicar_grupo_dados(dados_atualizar) {
        let discord_data = dados_atualizar

        for (const propriedade in discord_data) {
            if (this.#grupo_dados[propriedade] != undefined && this.#grupo_dados[propriedade] != discord_data[propriedade]) {
                this.#grupo_dados[propriedade] = discord_data[propriedade]
                console.log(propriedade);
            }
        }
    }

    /**
     * Excluir todos os handlers vinculados a esse grupo
     */
    excluir_handlers() {
        let handler_manager = this.#grupo_manager.get_modulo().get_bot().get_handlers()

        for (const handler_info of this.#handlers) {
            handler_manager.remove_handler(handler_info)
        }
    }

}