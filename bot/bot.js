import { Intent } from "./bot_intents.js"
import { ERROS } from "./bot_erros.js"
import { PARAMETROS } from "../discord/parametros.js"

export class Bot {
    /**
     * Token do bot
     * @type {string}
     */
    #token_secreto = ""

    /**
     * Intent que o BOT irá precisa receber do Discord
     * @type {Intent}
     */
    #intents;

    /**
     * 
     * @param {string} token - Token de acesso secreto do bot
     * @param {Intent} intent - Intent contendo os eventos que o bot precisará receber
     */
    constructor(token, intent) {
        if (token == null || token.length <= 10) {
            throw ERROS.TOKEN_INVALIDO
        }

        if (intent != null) {
            if (!(intent instanceof Intent)) {
                throw ERROS.INTENT_FORMATO_INCORRETO
            }
        }

        this.token_secreto = token
        this.#intents = intent
    }
}