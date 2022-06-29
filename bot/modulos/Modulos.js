import { Bot } from "../bot.js";

import Grupos from "./grupos/Grupos.js"

/**
 * A classe de modulos proporciona varias classes pre-prontas que permitem interagir com a API do Discord
 * Por exemplo, chat de texto, voz, informações do grupo, atualizações, disparos de evento, etc...
 */
export default class ModulosManager {

    /**
     * Mostrar logs?
     */
    #mostrar_logs;

    /**
     * Referencia do BOT
     * @type {Bot}
     */
    #bot;

    /**
     * Modulo de grupos, contendo as informações de cada grupo em que o BOT se encontra
     * @type {Grupos}
     */
    #grupos;

    /**
     * Inicia o Modulo vinculado a um BOT
     * @param {Bot} bot
     */
    constructor(bot) {
        this.#bot = bot;

        this.#grupos = new Grupos(this)
    }

    /**
     * Retorna o BOT responsavel por esse modulo manager
     * @returns {Bot} O Bot desse modulo
     */
    get_bot() {
        return this.#bot
    }

    /**
     * Retorna o gerenciador de grupos do BOT
     * @return {Grupos}
     */
    get_modulo_grupos() {
        return this.#grupos
    }

    #log(msg) {
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