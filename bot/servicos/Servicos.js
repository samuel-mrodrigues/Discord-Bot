import { Bot } from "../bot.js"
import ModuloEnviar from "./enviar/Enviar.js"

/**
 * Controla todos os eventos de envio e recebimentos do BOT
 */

export default class ServicoModulo {
    /**
     * Mostrar logs relacionados ao modulo?
     */
    #mostrar_logs = true;

    /**
     * Instancia do bot relacionado a esse modulo
     * @type {Bot}
     */
    #bot;

    /**
     * Modulo que cuida de toda a funcionaliade de enviar informações ao Discord
     * @type {ModuloEnviar}
     */
    #modulo_enviar;
    /**
    * Modulo que cuida de toda a funcionaliade de receber informações(eventos) do Discord
    */
    #modulo_receber;

    /**
     * Inicia o serviço que cuida dos modulos de enviar e receber
     * @param {Bot} bot_data 
     */
    constructor(bot_data) {
        this.#bot = bot_data
    }

    /**
     * Retorna o BOT vinculado a esse modulo de serviço
     * @returns {Bot}
     */
    get_bot() {
        return this.#bot
    }

    /**
     * @returns {ModuloEnviar} Recebe o modulo de enviar
     */
    get_modulo_enviar() {
        return this.#modulo_enviar
    }

    /**
     * 
     * @returns Retorna o modulo de receber 
     */
    get_modulo_receber() {
        return this.#modulo_receber
    }

    /**
     * Inicia o cadastro dos modulos de envio e recebimento do BOT
     */
    cadastrar_modulos() {
        this.log(`Iniciando o serviço de modulos do BOT...`)

        this.#modulo_enviar = new ModuloEnviar(this)
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