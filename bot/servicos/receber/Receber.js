import Servico from "../Servicos.js"
import GatewayMensagem from "../../websocket/gateway_mensagem.js"
import Handler from "./handlers/Handler.js";

export default class ReceberEvento {
    /**
     * Ativa o log no console
     */
    #mostrar_logs = true;

    /**
     * Serviço vinculado a esse modulo de receber
     * @type {Servico}
     */
    #servico;

    /**
     * Handler que é responsavel por executar funções quando eventos forem disparados
     * @type {Handler}
     */
    #handler;

    /**
     * Retorna o Handler responsavel que executa funções a partir de eventos disparados
     * @returns {Handler} Handler responsavel por disparar e executar os eventos
     */
    get_handler_manager() {
        return this.#handler
    }

    /**
     * Inicia o modulo de receber do BOT
     * @param {Servico} servico 
     */
    constructor(servico) {
        this.#servico = servico

        this.#handler = new Handler(this.#servico.get_bot())
    }

    /**
     * Recebe um evento disparado pelo gateway do Discord
     * @param {string} evento_tipo Tipo do evento disparado
     * @param {GatewayMensagem} gateway_mensagem
     */
    novo_evento(evento_tipo, gateway_mensagem) {
        this.log(`Novo evento do gateway recebido! ${evento_tipo}`)
        console.log(gateway_mensagem.get_data());

        this.#handler.disparar_evento(evento_tipo, gateway_mensagem)
    }

    log(msg) {
        if (!this.#mostrar_logs) return;

        if (typeof msg == 'string') {
            this.#servico.log(`[RECEBER]: ${msg}`)
        } else {
            console.log(`-----------------------[RECEBER]-----------------------`);
            console.log(msg);
            console.log("-------------------------------------------------------");
        }
    }
}