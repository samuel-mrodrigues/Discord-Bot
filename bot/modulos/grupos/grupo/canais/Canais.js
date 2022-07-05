import { EVENTOS } from "../../../../eventos/eventos.js";
import { Handler_Info } from "../../../../servicos/receber/handlers/Handler.js";
import Grupo from "../Grupo.js";
import Canal from "./canal/Canal.js";

import { Canal_Estrutura } from "./canal/Canal_Estrutura.js"
/**
 * A classe de Canais guarda todas as informações de canais sobre um grupo
 */
export default class Canais {

    /**
     * Instancia do grupo ao qua este canal esta vinculado
     * @type {Grupo} 
     */
    #grupo;

    /**
     * Lista de canais existentes
     * @type {[Canal]}
     */
    #lista_canais = []

    /**
     * Handlers cadastrados que preciso receber informações
     * @type {[Handler_Info]}
     */
    #handlers = []

    /**
     * Registra o modulo de canais e já registra os canais recebidos
     * @param {Grupo} grupo 
     */
    constructor(grupo) {
        this.#grupo = grupo

        // Adiciona os canais recebidos pelo grupo inicialmente
        for (const canal of this.#grupo.get_grupo_dados().channels) {
            this.#adicionar_canal(canal)
        }

        this.cadastrar_handlers()
    }

    /**
     * Adiciona um novo canal a lista 
     * @param {Canal_Estrutura} canal_objeto 
     */
    #adicionar_canal(canal_objeto) {
        let novo_canal = new Canal(this, canal_objeto)

        this.#lista_canais.push(novo_canal)
    }

    /**
     * Exclui algum canal da lista de canais existentes
     * @param {number} canal_id
     */
    #remove_canal(id) {
        this.#lista_canais = this.#lista_canais.filter(canal => {
            if (canal.get_dados().id == id) {

                // Remove handlers que possam existir desse canal
                canal.excluir_handlers()
                return false;
            } else {
                return true;
            }
        })
    }

    #atualizar_canal(canal_objeto) {
        this.#remove_canal(canal_objeto)
        this.#adicionar_canal(canal_objeto)
    }

    /**
     * Retorna uma lista de canais existentes do grupo
     * @returns {[Canal]}
     */
    get_canais_existentes() {
        return this.#lista_canais
    }

    /**
     * Retorna um objeto Canal a partir de um id
     * @param {String} id_canal 
     * @returns {Canal} Objeto canal, ou undefined caso não exista o canal com o id solicitado
     */
    get_canal_por_id(id_canal) {
        let canal_procurado = this.#lista_canais.find(canal => {
            if (canal.get_dados().id == id_canal) {
                return true;
            }
        })

        if (canal_procurado != undefined) {
            return canal_procurado;
        }
    }

    /**
     * Retorna o grupo que este gerenciador de canais pertence
     * @returns {Grupo}
     */
    get_grupo() {
        return this.#grupo
    }

    /**
     * Realiza o cadastro do handler de canais desse grupo
     * Todos os eventos, como por exemplo, criar grupo, excluir grupo, são disparados aqui. e então
     * atualizados conforme necessario
     */
    cadastrar_handlers() {
        let handler_manager = this.#grupo.get_grupo_manager().get_modulo().get_bot().get_handlers()

        // Quando algum canal for criado, salvar ele na lista de canais
        this.#handlers.CHANNEL_CREATE = handler_manager.add_handler(EVENTOS.GUILDS.CHANNEL_CREATE, (novocanal_info) => {
            this.#adicionar_canal(novocanal_info.get_data())
        })

        // Quando o canal for removido, excluir ele da lista
        this.#handlers.CHANNEL_DELETE = handler_manager.add_handler(EVENTOS.GUILDS.CHANNEL_DELETE, (canalexcluido_info) => {
            this.#remove_canal(canalexcluido_info.get_data())
        })

        this.#handlers.CHANNEL_UPDATE = handler_manager.add_handler(EVENTOS.GUILDS.CHANNEL_UPDATE, (canalatualizado_info) => {
            this.#atualizar_canal(canalatualizado_info)
        })
    }

    /**
     * Remover todos os handlers cadastrados
     */
    excluir_handlers() {
        let handler_manager = this.#grupo.get_grupo_manager().get_modulo().get_bot().get_handlers()

        for (const handler_info of this.#handlers) {
            handler_manager.remove_handler(handler_info)
        }
    }
}