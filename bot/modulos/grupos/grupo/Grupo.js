import { EVENTOS } from "../../../eventos/eventos.js";
import { Handler_Info } from "../../../servicos/receber/handlers/Handler.js";
import Grupos from "../Grupos.js";
import Canais from "./canais/Canais.js";

// Campos que normalmente cada grupo possui
import Grupo_Campo from "./Grupo_Estrutura.js";

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
     * @type {Grupo_Campo}
     */
    #grupo_dados;

    /**
     * Canais pertencentes desse grupo
     * @type {Canais}
     */
    #canais;

    /**
     * Os handlers são eventos que são chamados pelo serviço de receber eventos
     * Nesse caso, eu vou salvar ids dos handlers desse grupo, do que for preciso.
     * @type {[Handler_Info]}
     */
    #handlers = []

    /**
     * Instancia o grupo com um objeto do grupo, recebido do Discord pelo gateway
     * @param {Grupos} grupo_manager
     * @param {Grupo_Campo} grupo_data 
     */
    constructor(grupo_manager, grupo_data) {
        this.#grupo_manager = grupo_manager
        this.#grupo_dados = grupo_data

        this.#canais = new Canais(this)

        this.cadastrar_handlers()
    }

    /**
     * Retorna as informações desse grupo
     * @returns {Grupo_Campo}
     */
    get_grupo_dados() {
        return this.#grupo_dados
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
     * Castrar os listener que tem haver com o grupo, para mante-lo atualizado
     * Como membros novos, expulsoes, banimentos, etc...
     */
    cadastrar_handlers() {


    }

    /**
     * Excluir todos os handlers vinculados a esse grupo
     */
    excluir_handlers() {

    }

}