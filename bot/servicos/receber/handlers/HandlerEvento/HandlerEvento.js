import GatewayMensagem from "../../../../websocket/gateway_mensagem.js";
import FuncaoHandler from "./FuncaoHandler.js";
import Handler from "./FuncaoHandler.js"

/**
 * Essa classe representa um tipo de evento handler.
 * Por exemplo, um HandlerEvento pode ser um evento MESSAGE_CREATE, contendo funções cadastradas que
 * serão executadas quando esse evento for disparado
 */
export default class HandlerEvento {
    /**
 * Exibir logs?
 */
    #mostrar_logs = true;

    /**
     * O tipo do evento 
     * @type {String}
     */
    #tipo_evento;

    /**
     * Funções que devem ser executadas ao disparo desse evento
     * @type {[Handler]}
     */
    #handlers_lista = []

    /**
     * Esse ID é incrementado para cada handler adicionado. Assim, cada handler
     * sempre terá um ID unico de identificação
     * @type {Number}
     */
    #id_atual = 0;

    /**
     * Inicia o HandlerEvento 
     * @param {String} tipo_evento Tipo do evento que deverá ser disparado
     */
    constructor(tipo_evento) {
        this.#tipo_evento = tipo_evento
    }

    /**
     * 
     * @returns {{nome}} Retorna o tipo de evento desse handler
     */
    get_evento_tipo() {
        return this.#tipo_evento
    }

    /**
     * @returns {[Handler]} Retorna todos os handlers já cadastrados
     */
    get_handlers() {
        return this.#handlers_lista;
    }

    /**
     * 
     * @returns {Number} ID de identificação das funções, o ultimo adicionado
     */
    get_id_atual() {
        return this.#id_atual;
    }

    /**
     * Adiciona uma nova função para ser executada nesse tipo de evento
     * Apos a adição de um novo handler, o contador de ID #id_atual será incrementado!
     * @param {Function} funcao_executar 
     */
    add_handler(funcao_executar) {
        let novo_handler_funcao = new FuncaoHandler(this.#id_atual, funcao_executar)

        this.#handlers_lista.push(novo_handler_funcao)
        this.#id_atual++;
    }

    /**
     * Dispara esse evento, executando todas as funções
     * @param {GatewayMensagem} gateway_mensagem Informações do evento disparado
     */
    disparar(gateway_mensagem) {
        // Dispara todas as funções cadastradas nesse evento
        for (const funcao of this.#handlers_lista) {
            this.#log(`Disparando handler ID ${funcao.get_id()}`)
            funcao.executar(gateway_mensagem)
        }
    }

    #log(msg) {
        if (!this.#mostrar_logs) return;
        if (typeof msg == 'string') {
            console.log(`[BOT]: ${msg}`);
        } else {
            console.log(`-----------------------[HANDLER ${this.#tipo_evento}]-----------------------`);
            console.log(msg);
            console.log("-------------------------------------------------------");
        }
    }
}