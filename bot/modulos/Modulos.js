/**
 * O modulo é responsavel por quase todas as funções de envio ao Discord, como mensagens, grupos, banimentos, etc...
 */
import { Bot } from "../bot.js"

import { EnviarMensagem } from "./EnviarMensagem/EnviarMensagem.js"

export default class Modulo {
    #mostrar_logs = true

    /**
     * Instancia do bot relacionado a esse modulo
     * @type {Bot}
     */
    #bot;

    /**
     * Endpoint REST do Discord, onde a maioria das solicitações serão enviadas
     */
    #discord_rest_url;

    /**
     * Modulo que é responsavél em enviar mensagens
     * @type {EnviarMensagem}
     */
    #envia_mensagem;

    constructor(bot_data) {
        this.log(`Iniciando o serviço de modulo do BOT`)
        this.#bot = bot_data

        this.#registrar_modulos()
    }

    /**
 * Retorna o modulo que é responsavel por enviar mensagens
 * @returns {EnviarMensagem}
 */
    modulo_EnviarMensagens() {
        return this.#envia_mensagem;
    }

    /**
     * Endpoint URL onde as requisições serão enviadas
     */
    get_rest_endpoint() {
        return this.#discord_rest_url
    }

    /**
     * Registra os modulos
     */
    #registrar_modulos() {
        this.#envia_mensagem = new EnviarMensagem(this)
    }

    log(msg) {
        if (!this.#mostrar_logs) return;
        if (typeof msg == 'string') {
            console.log(`[MODULO]: ${msg}`);
        } else {
            console.log(`-----------------------[MODULO]-----------------------`);
            console.log(msg);
            console.log("-------------------------------------------------------");
        }
    }
}