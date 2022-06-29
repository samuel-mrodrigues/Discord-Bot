import Grupos from "../Grupos.js";

// Campos que normalmente cada grupo possui
import Grupo_Campo from "./Grupo_Campo.js";

export default class Grupo {

    /**
     * Armazena todas as informações do grupo
     * @type {Grupo_Campo}
     */
    #grupo_dados;

    /**
     * A instancia do Grupos, que guarda é responsavel por armazenar esse grup
     * @type {Grupos}
     */
    #grupo_manager;

    /**
     * Instancia o grupo com um objeto do grupo, recebido do Discord pelo gateway
     * @param {Grupos} grupo_manager
     * @param {Grupo_Campo} grupo_data 
     */
    constructor(grupo_manager, grupo_data) {
        this.#grupo_manager = grupo_manager
        this.#grupo_dados = grupo_data

        this.#cadastrar_handlers()
    }

    /**
     * Retorna as informações desse grupo
     * @returns {Grupo_Campo}
     */
    get_grupo_dados() {
        return this.#grupo_dados
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
    #cadastrar_handlers() {

    }
}