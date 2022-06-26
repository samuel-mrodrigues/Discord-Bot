import ws from "ws"
import { ERROS } from "../tratativas/websocket/websocket_erros.js"


export default class GatewayMensagem {
    /**
     * Tipo de evento disparado pelo gateway do Discord
     * @type {string}
     */
    #t = null;
    /**
     * Sequencia do evento disparado pelo gateway do Discord, aumenta a sequencia em 1
     * @type {string}
     */
    #s = null;
    /**
    * Codigo OP disparado pelo gateway
    * @type {number}
    */
    #op = -1;

    /**
    * Payload do data
    * @type {{}}
    */
    #data = {}

    /**
     * Mensagem completa como recebida do websocket
     */
    #data_original = {}
    /**
     * Constroi um objeto Discord Mensagem baseado na resposta do websocket
     * @param {ws.MessageEvent} websocket_mensagem 
     */
    constructor(websocket_mensagem) {
        let data_json;
        try {
            data_json = JSON.parse(websocket_mensagem.data)
        } catch (erro) {
            throw ERROS.ERRO_PARSE_OBJETO_MENSAGEM
        }

        this.#data_original = data_json
        this.#data = data_json.d
        this.#op = data_json.op
        this.#s = data_json.s
        this.#t = data_json.t
    }

    get_opcode() {
        return this.#op
    }

    get_evento() {
        return this.#t
    }

    get_sequencia() {
        return this.#s
    }

    get_data() {
        return this.#data
    }

    get_originaldata() {
        return this.#data_original
    }

    toString() {
        return `Cod. OP: ${this.#op}, Evento: ${this.#t}, Sequencia: ${this.#s}, Data: ${JSON.stringify(this.#data)}`
    }
}