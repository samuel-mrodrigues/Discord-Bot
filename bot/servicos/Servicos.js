import { Bot } from "../bot.js"
import ServicoEnviar from "./enviar/Enviar.js"
import ServicoReceber from "./receber/Receber.js"

/**
 * Controla todos os eventos de envio e recebimentos do BOT
 */

export default class Servico {
    /**
     * Mostrar logs relacionados ao servico?
     */
    #mostrar_logs = true;

    /**
     * Instancia do bot relacionado a esse servico
     * @type {Bot}
     */
    #bot;

    /**
     * Serviço que cuida de toda a funcionaliade de enviar informações ao Discord
     * @type {ServicoEnviar}
     */
    #enviar_eventos;

    /**
    * Serviço que cuida de toda a funcionaliade de receber informações(eventos) do Discord
    * @type {ServicoReceber}
    */
    #receber_eventos;

    /**
     * Inicia o serviço que cuida dos serviços de enviar e receber
     * @param {Bot} bot_data 
     */
    constructor(bot_data) {
        this.#bot = bot_data

        this.#enviar_eventos = new ServicoEnviar(this)
        this.#receber_eventos = new ServicoReceber(this)
    }

    /**
     * Retorna o BOT vinculado a esse serviço de serviço
     * @returns {Bot}
     */
    get_bot() {
        return this.#bot
    }

    /**
     * @returns {ServicoEnviar} Recebe o serviço de enviar
     */
    get_servico_enviar() {
        return this.#enviar_eventos
    }

    /**
     * 
     * @returns {ServicoReceber} Retorna o serviço de receber 
     */
    get_servico_receber() {
        return this.#receber_eventos
    }


    log(msg) {
        if (!this.#mostrar_logs) return;
        if (typeof msg == 'string') {
            console.log(`[SERVICOS]: ${msg}`);
        } else {
            console.log(`-----------------------[SERVICOS]-----------------------`);
            console.log(msg);
            console.log("-------------------------------------------------------");
        }
    }
}